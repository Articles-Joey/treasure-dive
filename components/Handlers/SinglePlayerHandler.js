// Attempting a socket server first architecture, but this component will handle the single player mode and local game state management.

import { useEffect } from "react"
import { useStore } from "@/hooks/useStore"
import { useSocketStore } from "@/hooks/useSocketStore"
import { useSearchParams } from "next/navigation";
import { useGameStore } from "@/hooks/useGameStore";
import generateRandomInteger from "@/util/generateRandomInteger";

const totalRounds = 5;

const chestY = -30

function generateMoveSequence(gameState, setGameState) {
}

export default function SinglePlayerHandler() {

    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    const socket = useSocketStore(state => state.socket)

    const nickname = useStore((state) => state.nickname)

    const gameState = useGameStore(state => state.gameState)
    const status = useGameStore(state => state.gameState.status)
    const setGameState = useGameStore(state => state.setGameState)

    if (server) {
        console.warn("Not single player mode, server param found:", server)
        return null;
    }

    useEffect(() => {

        console.warn("SinglePlayerHandler - Player length check", gameState?.status)

        if ((gameState?.players?.length || 0) === 0 && gameState?.status !== 'Game Over') {

            console.warn("No players found in game state, adding local player.")

            setGameState({
                players: [{
                    id: 'local',
                    nickname: nickname,
                    position: [
                        generateRandomInteger(-6, 6),
                        -1,
                        0
                    ],
                }],
                status: 'In Lobby',
                timer: 0,
                chests: [
                    // Dev chest
                    ...(process.env.NODE_ENV === 'development' && [{
                        position: [-5, -2, 0],
                        initialPosition: [-5, -2, 0],
                        isHeld: false,
                        captured: false,
                    }] || []),
                    {
                        position: [-5, chestY, 0],
                        initialPosition: [-5, chestY, 0],
                        isHeld: false,
                        captured: false,
                    },
                    {
                        position: [-2.5, chestY, 0],
                        initialPosition: [-2.5, chestY, 0],
                        isHeld: false,
                        captured: false,
                    },
                    {
                        position: [0, chestY, 0],
                        initialPosition: [0, chestY, 0],
                        isHeld: false,
                        captured: false,
                    },
                    {
                        position: [2.5, chestY, 0],
                        initialPosition: [2.5, chestY, 0],
                        isHeld: false,
                        captured: false,
                    },
                    {
                        position: [5, chestY, 0],
                        initialPosition: [5, chestY, 0],
                        isHeld: false,
                        captured: false,
                    }
                ],
            });

        }

    }, [gameState?.players?.length, gameState?.status])

    useEffect(() => {

        console.warn("SinglePlayerHandler - Status change detected", status)

        let interval;

        if (status === "In Progress") {

            // generateMoveSequence(gameState, setGameState);

            interval = setInterval(() => {
                const currentGameState = useGameStore.getState().gameState;

                if (currentGameState.status !== 'In Progress') {
                    clearInterval(interval);
                    return;
                }

                const currentGameTimer = currentGameState.timer ?? 0;

                if (
                    currentGameTimer == 0
                ) {

                    setGameState({
                        ...currentGameState,
                        status: 'Game Over',
                        timer: 0
                    });

                    useGameStore.getState().setShowGameOverModal({
                        winner: {
                            nickname: "You",
                            score: currentGameState.players[0].score || 0
                        },
                        rankings: currentGameState.players.map(player => ({
                            nickname: player.nickname,
                            score: player.score || 0
                        })).sort((a, b) => b.score - a.score)
                    })

                    // useStore.getState().setShowGameOverModal({
                    //     rankings: [],
                    //     winner: {
                    //         nickname: "123",
                    //     }
                    // })

                } else {
                    setGameState({
                        ...currentGameState,
                        timer: currentGameTimer - 1,
                    });
                }
            }, 1000);

        }

        return () => {
            if (interval) clearInterval(interval);
        };

    }, [status])

}