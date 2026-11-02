// import { create } from 'zustand'
import { createWithEqualityFn as create } from "zustand/traditional";
import { useScoreStore } from "./useScoreStore";
import { useAudioStore } from "./useAudioStore";
import { useStore } from "./useStore";
import createSinglePlayerGameState from "@/util/createSinglePlayerGameState";

export const useGameStore = create((set, get) => ({
    obstacles_hit: 0,
    recordObstacleHit: () => {
        if (get().gameState.status !== "In Progress") return;
        set((state) => ({ obstacles_hit: state.obstacles_hit + 1 }));
        useScoreStore.getState().addObstacleHit();
    },
    resetSinglePlayerGame: () => {
        const gameState = createSinglePlayerGameState(
            useStore.getState().nickname || "Player",
        );
        set({
            gameState,
            score: 0,
            obstacles_hit: 0,
            holdingChest: false,
            rotation: 0,
            distance: 0,
            totalDistance: 0,
            teleport: gameState.players[0].position,
            showGameOverModal: false,
        });
    },
    startSinglePlayerGame: () => {
        if (get().gameState.status === "In Progress") return;
        const gameState = createSinglePlayerGameState(
            useStore.getState().nickname || "Player",
            true,
        );
        set({
            gameState,
            score: 0,
            obstacles_hit: 0,
            holdingChest: false,
            rotation: 0,
            distance: 0,
            totalDistance: 0,
            teleport: gameState.players[0].position,
            showGameOverModal: false,
        });
        useStore.getState().reloadScene();
    },
    finishSinglePlayerGame: () => {
        const state = get();
        if (state.gameState.status !== "In Progress") return;
        const result = {
            id: state.gameState.id,
            nickname:
                state.gameState.players.find((player) => player.id === "local")
                    ?.nickname || "Player",
            playedAt: new Date().toISOString(),
            score: state.score,
            obstacles_hit: state.obstacles_hit,
        };
        set({
            gameState: {
                ...state.gameState,
                status: "Game Over",
                timer: 0,
                result,
                resultDialogOpen: true,
            },
            showGameOverModal: false,
        });
        useScoreStore.getState().addResult(result);
        useAudioStore.getState().playSound("ring_perfect.ogg");
    },
    closeResultDialog: () =>
        set((state) => ({
            gameState: { ...state.gameState, resultDialogOpen: false },
        })),
    rotation: 0,
    setRotation: (newValue) => {
        set((prev) => ({
            rotation: newValue,
        }));
    },

    debug: 0,
    setDebug: (newValue) => {
        set((prev) => ({
            debug: newValue,
        }));
    },

    score: 0,
    setScore: (newValue) => {
        set((prev) => ({
            score: newValue,
        }));
    },
    addScore: (newValue) => {
        set((prev) => ({
            score: prev.score + 1,
        }));
    },

    holdingChest: false,
    setHoldingChest: (newValue) => {
        set((prev) => ({
            holdingChest: newValue,
        }));
    },

    playerLocation: false,
    setPlayerLocation: (newValue) => {
        set((prev) => ({
            playerLocation: newValue,
        }));
    },

    maxHeight: 0,
    setMaxHeight: (newValue) => {
        set((prev) => ({
            maxHeight: newValue,
        }));
    },

    distance: 0,
    setDistance: (newValue) => {
        set((prev) => ({
            distance: newValue,
        }));
    },
    addDistance: (newValue) => {
        set((prev) => ({
            distance: prev.distance + newValue,
        }));
    },

    obstacles: [],
    setObstacles: (newValue) => {
        set((prev) => ({
            obstacles: newValue,
        }));
    },

    totalDistance: 0,
    setTotalDistance: (newValue) => {
        set((prev) => ({
            totalDistance: newValue,
        }));
    },
    setChests: (newValue) => {
        set((prev) => ({
            chests: newValue,
        }));
    },

    shift: false,
    setShift: (newValue) => {
        set((prev) => ({
            shift: newValue,
        }));
    },

    touchControls: {
        jump: false,
        left: false,
        right: false,
    },
    setTouchControls: (newValue) => {
        set((prev) => ({
            touchControls: newValue,
        }));
    },

    teleport: false,
    setTeleport: (newValue) => {
        set((prev) => ({
            teleport: newValue,
        }));
    },

    gameState: {},
    setGameState: (newValue) => {
        set((prev) => ({
            gameState: newValue,
        }));
    },

    showGameOverModal: false,
    setShowGameOverModal: (newValue) => {
        set((prev) => ({
            showGameOverModal: newValue,
        }));
    },
}));
