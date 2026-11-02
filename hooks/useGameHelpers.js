import { useSearchParams } from "next/navigation";
import { useGameStore } from "./useGameStore";
import { useAudioStore } from "./useAudioStore";
import { useSocketStore } from "./useSocketStore";
import { useRef } from "react";

export default function useGameHelpers() {
    const searchParams = useSearchParams();
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params;
    const lastMove = useRef(0);
    const lastSentMove = useRef(null);
    function send(action, details = {}) {
        const socket = useSocketStore.getState().socket;
        const game = useGameStore.getState().gameState;
        if (!socket?.connected || String(game.server_id) !== server) return;
        socket.emit(`game:treasure-dive:${action}`, {
            server,
            roundId: game.id,
            ...details,
        });
    }

    function handleChestPickup(player_id, chestIndex) {
        console.log(
            "handleChestPickup called with player_id:",
            player_id,
            "chestIndex:",
            chestIndex,
        );
        if (server) {
            send("pickup", { chestIndex });
        } else {
            console.log(
                "handleChestPickup - Single Player Mode - Chest Index:",
                chestIndex,
            );
            const gameState = useGameStore.getState().gameState;
            if (gameState?.status !== "In Progress") return;

            // Prevent pickup if last drop was less than 5 seconds ago
            const localPlayer = gameState.players.find(
                (player) => player.id === "local",
            );
            if (
                !localPlayer ||
                localPlayer.heldChests?.length ||
                !gameState.chests?.[chestIndex]
            )
                return;
            if (localPlayer && localPlayer.lastChestDrop) {
                const now = Date.now();
                if (now - localPlayer.lastChestDrop < 5000) {
                    console.log("Pickup prevented: last drop was too recent.");
                    return;
                }
            }

            const newPlayers = gameState.players.map((player) => {
                if (player.id === "local") {
                    const newHeldChests = [
                        ...(player.heldChests || []),
                        chestIndex,
                    ];
                    return { ...player, heldChests: newHeldChests };
                }
                return player;
            });

            useGameStore.getState().setGameState({
                ...gameState,
                players: newPlayers,
            });
        }
    }

    function handleChestDrop(player_id) {
        console.log("handleChestDrop called with player_id:", player_id);
        if (server) {
            send("drop");
        } else {
            console.log(
                "handleChestDrop - Single Player Mode - Player ID:",
                player_id,
            );
            const gameState = useGameStore.getState().gameState;
            if (!gameState?.players) return;

            // Find the local player and their held chests
            const localPlayer = gameState.players.find(
                (player) => player.id === "local",
            );
            if (!localPlayer) return;
            const heldChests = localPlayer.heldChests || [];
            const playerPosition = localPlayer.position;

            // Update the positions of the dropped chests
            const newChests = gameState.chests.map((chest, idx) => {
                if (heldChests.includes(idx)) {
                    return { ...chest, position: playerPosition };
                }
                return chest;
            });

            const now = Date.now();
            const newPlayers = gameState.players.map((player) => {
                if (player.id === "local") {
                    return { ...player, heldChests: [], lastChestDrop: now };
                }
                return player;
            });

            useGameStore.getState().setGameState({
                ...gameState,
                players: newPlayers,
                chests: newChests,
            });
        }
    }

    function handlePlayerMove(player_id, newPosition) {
        if (server) {
            const { gameState, rotation } = useGameStore.getState();
            if (gameState.status !== "In Progress") return;
            if (Date.now() - lastMove.current < 50) return;
            const previous = lastSentMove.current;
            if (
                previous?.roundId === gameState.id &&
                previous.rotation === rotation &&
                newPosition.every(
                    (value, index) =>
                        Math.abs(value - previous.position[index]) < 0.001,
                )
            )
                return;
            lastMove.current = Date.now();
            lastSentMove.current = {
                roundId: gameState.id,
                position: [...newPosition],
                rotation,
            };
            send("position", { position: newPosition, rotation });
        } else {
            const gameState = useGameStore.getState().gameState;
            if (!gameState?.players) return;

            const newPlayers = gameState.players.map((player) => {
                if (player.id === "local") {
                    return { ...player, position: newPosition };
                }
                return player;
            });

            // In single player mode, we can directly update the game state to reflect the player move
            useGameStore.getState().setGameState({
                ...gameState,
                players: newPlayers,
            });
        }
    }

    function handleReturnToLobby() {
        if (server) send("return-to-lobby");
    }

    function handleGameStart() {
        console.log("handleGameStart called");

        if (server) {
            send("start-game");
        } else {
            console.log("handleGameStart - Single Player Mode");
            useGameStore.getState().startSinglePlayerGame();
        }
    }

    function handleChestClaim(player_id, chestIndex) {
        console.log(
            "handleChestClaim called with player_id:",
            player_id,
            "chestIndex:",
            chestIndex,
        );
        if (server) {
            send("claim", { chestIndex });
        } else {
            console.log(
                "handleChestClaim - Single Player Mode - Player ID:",
                player_id,
                "Chest Index:",
                chestIndex,
            );
            const gameState = useGameStore.getState().gameState;
            if (gameState?.status !== "In Progress") return;
            const store = useGameStore.getState();
            const localPlayer = gameState.players.find(
                (player) => player.id === "local",
            );
            if (!localPlayer?.heldChests?.includes(chestIndex)) return;
            const chests = gameState.chests || [];
            const chestPositionLookup = chests.find(
                (chest, idx) => idx === chestIndex,
            );
            if (!chestPositionLookup) return;

            const newGameState = {
                ...gameState,
                players: gameState.players.map((player) => {
                    if (player.id === "local") {
                        const newHeldChests = (player.heldChests || []).filter(
                            (index) => index !== chestIndex,
                        );
                        return {
                            ...player,
                            heldChests: newHeldChests,
                            score: store.score + 1,
                        };
                    }
                    return player;
                }),
                chests: gameState.chests.map((chest, idx) => {
                    if (idx === chestIndex) {
                        return {
                            ...chest,
                            position: chestPositionLookup.initialPosition,
                        };
                    }
                    return chest;
                }),
            };
            useGameStore.setState({
                gameState: newGameState,
                score: store.score + 1,
            });
            useAudioStore.getState().playSound("ring_get.ogg");
        }
    }

    return {
        handleChestPickup,
        handleChestDrop,
        handlePlayerMove,
        handleGameStart,
        handleReturnToLobby,
        handleChestClaim,
    };
}
