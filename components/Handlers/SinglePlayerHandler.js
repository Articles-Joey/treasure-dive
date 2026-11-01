import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useGameStore } from "@/hooks/useGameStore";

export default function SinglePlayerHandler() {
    const server = useSearchParams().get("server");
    const playerCount = useGameStore(
        (state) => state.gameState.players?.length ?? 0,
    );
    const status = useGameStore((state) => state.gameState.status);

    useEffect(() => {
        if (!server && playerCount === 0 && status !== "Game Over") {
            useGameStore.getState().resetSinglePlayerGame();
        }
    }, [server, playerCount, status]);

    useEffect(() => {
        if (server || status !== "In Progress") return;
        const interval = setInterval(() => {
            const store = useGameStore.getState();
            if (store.gameState.status !== "In Progress") return;
            const timer = Math.max(0, (store.gameState.timer ?? 0) - 1);
            if (timer === 0) store.finishSinglePlayerGame();
            else store.setGameState({ ...store.gameState, timer });
        }, 1000);
        return () => clearInterval(interval);
    }, [server, status]);

    return null;
}
