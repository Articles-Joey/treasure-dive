"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import shareSnapshot from "@/util/shareSnapshot";

import { useSocketStore } from "@/hooks/useSocketStore";
import { useStore } from "@/hooks/useStore";
import { useGameStore } from "@/hooks/useGameStore";
import { useAudioStore } from "@/hooks/useAudioStore";

import ReusedSocketLogicHandler from "@articles-media/articles-dev-box/ReusedSocketLogicHandler";

// The shared handler also consumes unscoped game-update events. Apply game
// snapshots below only after checking the current route and server.
const connectionGameStore = {
    getState: () => ({ gameState: {}, setGameState: () => {} }),
};

export default function SocketLogicHandler(props) {
    const _hasHydrated = useStore((state) => state._hasHydrated);

    // const router = useRouter()
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params;
    const socket = useSocketStore((state) => state.socket);
    const connected = useSocketStore((state) => state.connected);
    const nickname = useStore((state) => state.nickname);

    useEffect(() => {
        if (!_hasHydrated || pathname !== "/play" || !server) return;
        const room = `game:treasure-dive-room-${server}`;
        useGameStore.setState({
            gameState: {},
            score: 0,
            holdingChest: false,
            multiplayerError: null,
            showGameOverModal: false,
        });
        let previousRound;
        let joined = false;
        const update = (game) => {
            if (String(game.server_id) !== server) return;
            const player = game.players?.find((p) => p.id === socket.id);
            if (!player) return;
            const reset = !joined || previousRound !== game.id;
            const previousGame = useGameStore.getState().gameState;
            const previousPlayer = previousGame.players?.find(
                (p) => p.id === socket.id,
            );
            game = shareSnapshot(previousGame, game);
            if (!reset && game === previousGame) return;
            const justFinished =
                game.status === "Game Over" &&
                (reset || previousGame.status !== "Game Over");
            const rankings = justFinished
                ? [...game.players].sort(
                      (a, b) => (b.score || 0) - (a.score || 0),
                  )
                : null;
            joined = true;
            previousRound = game.id;
            useGameStore.setState({
                gameState: game,
                score: player.score || 0,
                holdingChest: player.heldChests?.[0] ?? false,
                multiplayerError: null,
                ...(justFinished
                    ? {
                          showGameOverModal: { winner: rankings[0], rankings },
                      }
                    : game.status !== "Game Over"
                      ? { showGameOverModal: false }
                      : {}),
                ...(reset ? { teleport: player.position, rotation: 0 } : {}),
            });
            if (!reset && (player.score || 0) > (previousPlayer?.score || 0)) {
                useAudioStore.getState().playSound("ring_get.ogg");
            }
            if (justFinished) {
                useAudioStore.getState().playSound("ring_perfect.ogg");
            }
        };
        const full = (data) => {
            if (String(data.game_id) === server)
                useGameStore.setState({
                    multiplayerError:
                        "This server is full (4 players). Choose another server.",
                });
        };
        socket.on("game:treasure-dive:update", update);
        socket.on("game-full", full);
        if (connected)
            socket.emit("join-room", room, { game_id: server, nickname });
        return () => {
            socket.off("game:treasure-dive:update", update);
            socket.off("game-full", full);
            if (socket.connected) socket.emit("leave-room", room);
            useGameStore.setState({
                gameState: {},
                score: 0,
                holdingChest: false,
                teleport: false,
                multiplayerError: null,
                showGameOverModal: false,
            });
        };
    }, [_hasHydrated, pathname, server, socket, connected, nickname]);

    if (!_hasHydrated) return null;

    return (
        <>
            <ReusedSocketLogicHandler
                pathname={pathname}
                useStore={useStore}
                useGameStore={connectionGameStore}
                useSocketStore={useSocketStore}
                debugConfig={{
                    enabled: true,
                    // autoHide: true,
                    autoHideDelay: 5000,
                }}
                landingConfig={{
                    handleLandingDetails: true,
                    onLandingDetails: (data) => {
                        console.log(
                            "[SocketLogicHandler] onLandingDetails",
                            data,
                        );
                    },
                }}
                gameConfig={{
                    handleGameUpdates: false,
                    onGameUpdate: (data) => {
                        console.log("[SocketLogicHandler] onGameUpdate", data);
                    },
                }}
                server={server}
            />
        </>
    );
}
