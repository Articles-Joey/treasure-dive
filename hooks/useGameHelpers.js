import { useSearchParams } from "next/navigation";
import { useGameStore } from "./useGameStore";

export default function useGameHelpers() {
    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    function handleChestPickup(player_id, chestIndex) {
        console.log("handleChestPickup called with player_id:", player_id, "chestIndex:", chestIndex)
        if (server) {
            // Not ready
        } else {
            console.log("handleChestPickup - Single Player Mode - Chest Index:", chestIndex)
            const gameState = useGameStore.getState().gameState;
            if (!gameState) return {};

            // Prevent pickup if last drop was less than 5 seconds ago
            const localPlayer = gameState.players.find(player => player.id === 'local');
            if (localPlayer && localPlayer.lastChestDrop) {
                const now = Date.now();
                if (now - localPlayer.lastChestDrop < 5000) {
                    console.log('Pickup prevented: last drop was too recent.');
                    return;
                }
            }

            const newPlayers = gameState.players.map(player => {
                if (player.id === 'local') {
                    const newHeldChests = [...(player.heldChests || []), chestIndex];
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
        console.log("handleChestDrop called with player_id:", player_id)
        if (server) {
            // Not ready
        } else {
            console.log("handleChestDrop - Single Player Mode - Player ID:", player_id)
            const gameState = useGameStore.getState().gameState;
            if (!gameState) return {};

            // Find the local player and their held chests
            const localPlayer = gameState.players.find(player => player.id === 'local');
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
            const newPlayers = gameState.players.map(player => {
                if (player.id === 'local') {
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
        console.log("handlePlayerMove called with player_id:", player_id, "newPosition:", newPosition)
        if (server) {
            // Not ready
        } else {
            console.log("handlePlayerMove - Single Player Mode - Player ID:", player_id, "New Position:", newPosition)
            const gameState = useGameStore.getState().gameState;
            if (!gameState) return {};

            const newPlayers = gameState.players.map(player => {
                if (player.id === 'local') {
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

    function handleGameStart() {
        console.log("handleGameStart called")

        if (server) {
            // Not ready
        } else {
            console.log("handleGameStart - Single Player Mode")
            const gameState = useGameStore.getState().gameState;
            const newGameState = {
                ...gameState,
                status: 'In Progress',
                timer: 60,
                // timer: 10,
            };
            useGameStore.getState().setGameState(newGameState);
        }
    }

    function handleChestClaim(player_id, chestIndex) {
        console.log("handleChestClaim called with player_id:", player_id, "chestIndex:", chestIndex)
        if (server) {
            // Not ready
        } else {
            console.log("handleChestClaim - Single Player Mode - Player ID:", player_id, "Chest Index:", chestIndex)
            const gameState = useGameStore.getState().gameState;
            if (!gameState) return {};

            const chests = gameState.chests || [];
            const chestPositionLookup = chests.find((chest, idx) => idx === chestIndex);

            const newGameState = {
                ...gameState,
                players: gameState.players.map(player => {
                    if (player.id === 'local') {
                        const newHeldChests = (player.heldChests || []).filter(index => index !== chestIndex);
                        return { 
                            ...player, 
                            heldChests: newHeldChests,
                            score: (player.score || 0) + 1 // Increment score by 1 for each claimed chest
                        };
                    }
                    return player;
                }),
                chests: gameState.chests.map((chest, idx) => {
                    if (idx === chestIndex) {
                        return {
                            ...chest,
                            position: chestPositionLookup.initialPosition
                        };
                    }
                    return chest;
                }),
            };
            useGameStore.getState().setGameState(newGameState);

        }
    }

    return {
        handleChestPickup,
        handleChestDrop,
        handlePlayerMove,
        handleGameStart,
        handleChestClaim
    }

}