// import { create } from 'zustand'
import { createWithEqualityFn as create } from 'zustand/traditional'



export const useGameStore = create((set) => ({

    cameraMode: 'Player',
    setCameraMode: (newValue) => {
        set((prev) => ({
            cameraMode: newValue
        }))
    },

    rotation: 0,
    setRotation: (newValue) => {
        set((prev) => ({
            rotation: newValue
        }))
    },

    debug: 0,
    setDebug: (newValue) => {
        set((prev) => ({
            debug: newValue
        }))
    },

    score: 0,
    setScore: (newValue) => {
        set((prev) => ({
            score: newValue
        }))
    },
    addScore: (newValue) => {
        set((prev) => ({
            score: prev.score + 1
        }))
    },

    holdingChest: false,
    setHoldingChest: (newValue) => {
        set((prev) => ({
            holdingChest: newValue
        }))
    },

    playerLocation: false,
    setPlayerLocation: (newValue) => {
        set((prev) => ({
            playerLocation: newValue
        }))
    },

    maxHeight: 0,
    setMaxHeight: (newValue) => {
        set((prev) => ({
            maxHeight: newValue
        }))
    },

    distance: 0,
    setDistance: (newValue) => {
        set((prev) => ({
            distance: newValue
        }))
    },
    addDistance: (newValue) => {
        set((prev) => ({
            distance: (prev.distance + newValue)
        }))
    },

    obstacles: [],
    setObstacles: (newValue) => {
        set((prev) => ({
            obstacles: newValue
        }))
    },

    totalDistance: 0,
    setTotalDistance: (newValue) => {
        set((prev) => ({
            totalDistance: newValue
        }))
    },
    setChests: (newValue) => {
        set((prev) => ({
            chests: newValue
        }))
    },

    shift: false,
    setShift: (newValue) => {
        set((prev) => ({
            shift: newValue
        }))
    },

    touchControls: {
        jump: false,
        left: false,
        right: false
    },
    setTouchControls: (newValue) => {
        set((prev) => ({
            touchControls: newValue
        }))
    },

    teleport: false,
    setTeleport: (newValue) => {
        set((prev) => ({
            teleport: newValue
        }))
    },

    gameState: {},
    setGameState: (newValue) => {
        set((prev) => ({
            gameState: newValue
        }))
    },

    showGameOverModal: false,
    setShowGameOverModal: (newValue) => {
        set((prev) => ({
            showGameOverModal: newValue
        }))
    },

}))