import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const HISTORY_LIMIT = 5;

function isResult(result) {
    return (
        result &&
        typeof result.id === "string" &&
        Number.isFinite(result.score) &&
        result.score >= 0 &&
        Number.isInteger(result.obstacles_hit) &&
        result.obstacles_hit >= 0 &&
        typeof result.nickname === "string" &&
        Number.isFinite(Date.parse(result.playedAt))
    );
}

function bestScores(entries) {
    return (Array.isArray(entries) ? entries : [])
        .filter(isResult)
        .slice()
        .sort((a, b) => b.score - a.score)
        .slice(0, HISTORY_LIMIT);
}

function recentScores(entries) {
    return (Array.isArray(entries) ? entries : [])
        .filter(isResult)
        .slice()
        .sort((a, b) => Date.parse(b.playedAt) - Date.parse(a.playedAt))
        .slice(0, HISTORY_LIMIT);
}

export const useScoreStore = create()(
    persist(
        (set) => ({
            _hasHydrated: false,
            setHasHydrated: (value) => set({ _hasHydrated: value }),
            bestScores: [],
            recentScores: [],
            // Lifetime hits include unfinished games and survive score-history resets.
            obstacles_hit: 0,
            addObstacleHit: () =>
                set((state) => ({ obstacles_hit: state.obstacles_hit + 1 })),
            addResult: (result) => {
                if (!isResult(result)) return;
                set((state) => {
                    if (
                        [...state.bestScores, ...state.recentScores].some(
                            (entry) => entry.id === result.id,
                        )
                    )
                        return state;
                    return {
                        // Stable score-only sorting preserves earlier entries on ties.
                        bestScores: bestScores([...state.bestScores, result]),
                        recentScores: recentScores([
                            result,
                            ...state.recentScores,
                        ]),
                    };
                });
            },
            resetScores: () => set({ bestScores: [], recentScores: [] }),
        }),
        {
            name: `${process.env.NEXT_PUBLIC_GAME_KEY || "treasure-dive"}-score-store`,
            version: 1,
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                bestScores: state.bestScores,
                recentScores: state.recentScores,
                obstacles_hit: state.obstacles_hit,
            }),
            merge: (persisted, current) => ({
                ...current,
                bestScores: bestScores(persisted?.bestScores),
                recentScores: recentScores(persisted?.recentScores),
                obstacles_hit:
                    Number.isInteger(persisted?.obstacles_hit) &&
                    persisted.obstacles_hit >= 0
                        ? persisted.obstacles_hit
                        : 0,
            }),
            onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
        },
    ),
);

export function resetScores() {
    useScoreStore.getState().resetScores();
}
