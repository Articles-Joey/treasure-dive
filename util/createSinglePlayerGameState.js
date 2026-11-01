import { BOARD_HEIGHT, BOARD_WIDTH } from "@/components/Game/board";

export default function createSinglePlayerGameState(nickname, started = false) {
    const floor = -BOARD_HEIGHT;
    const spawnRange = Math.max(0, BOARD_WIDTH / 2 - 1);
    const spawn = [(Math.random() * 2 - 1) * spawnRange, -1, 0];
    const chest = (x, y) => ({
        position: [x, y, 0],
        initialPosition: [x, y, 0],
        isHeld: false,
        captured: false,
    });

    return {
        id: started
            ? (globalThis.crypto?.randomUUID?.() ??
              `${Date.now()}-${Math.random().toString(36).slice(2)}`)
            : null,
        startedAt: started ? new Date().toISOString() : null,
        players: [
            {
                id: "local",
                nickname,
                position: spawn,
                heldChests: [],
                score: 0,
            },
        ],
        status: started ? "In Progress" : "In Lobby",
        timer: started ? 60 : 0,
        result: null,
        resultDialogOpen: false,
        chests: [
            ...(process.env.NODE_ENV === "development" ? [chest(-5, -2)] : []),
            ...[-5, -2.5, 0, 2.5, 5].map((x) => chest(x, floor)),
        ],
    };
}
