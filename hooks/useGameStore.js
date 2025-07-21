// import { create } from 'zustand'
import { createWithEqualityFn as create } from 'zustand/traditional'

const chestY = -30

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

    chests: [
        {
            position: [-5, -2, 0],
            isHeld: false,
            captured: false,
        },
        {
            position: [-5, chestY, 0],
            isHeld: false,
            captured: false,
        },
        {
            position: [-2.5, chestY, 0],
            isHeld: false,
            captured: false,
        },
        {
            position: [0, chestY, 0],
            isHeld: false,
            captured: false,
        },
        {
            position: [2.5, chestY, 0],
            isHeld: false,
            captured: false,
        },
        {
            position: [5, chestY, 0],
            isHeld: false,
            captured: false,
        }
    ],
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
}))

export const useControlsStore = create((set) => ({

    touchControls: {
        jump: false,
        left: false,
        right: false,
        up: false,
        down: false
    },
    setTouchControls: (newValue) => {
        set((prev) => ({
            touchControls: newValue
        }))
    }

}))