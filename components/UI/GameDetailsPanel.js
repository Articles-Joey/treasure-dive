"use client";

import { useLayoutEffect, useRef } from "react";
import { shallow } from "zustand/shallow";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import { useGameStore } from "@/hooks/useGameStore";
import ArticlesButton from "./Button";
import useGameHelpers from "@/hooks/useGameHelpers";
import { useSocketStore } from "@/hooks/useSocketStore";
import Stack from "@mui/material/Stack";
import { useSearchParams } from "next/navigation";

export default function GameDetailsPanel() {
    const server = useSearchParams().get("server");
    const connected = useSocketStore((state) => state.connected);
    const socketId = useSocketStore((state) => state.socket?.id);
    const playerCount = useGameStore(
        (state) => state.gameState.players?.length || 0,
    );
    const isRoomMember = useGameStore((state) =>
        state.gameState.players?.some((p) => p.id === socketId),
    );
    const multiplayerError = useGameStore((state) => state.multiplayerError);
    const canStart = !server || (connected && playerCount >= 2 && isRoomMember);
    const status = useGameStore((state) => state.gameState.status);
    const score = useGameStore((state) => state.score);
    const { handleGameStart } = useGameHelpers();
    const isGameInProgress = status === "In Progress";

    return (
        <Card
            sx={{
                bgcolor: "game.card",
                backgroundImage: "none",
                fontSize: "0.875rem",
                border: 1,
                borderColor: "divider",
            }}
        >
            <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{ flex: 1, justifyContent: "space-between" }}
                >
                    <Box>Status: {status}</Box>
                    <Box>Score: {score}</Box>
                </Stack>
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        flex: 1,
                        justifyContent: "space-between",
                    }}
                >
                    <ArticlesButton
                        small
                        sx={{
                            width: "100%",
                        }}
                        // disabled={isGameInProgress || !canStart}
                        onClick={() => handleGameStart()}
                    >
                        {isGameInProgress ? "Game In Progress" : "Start Game"}
                    </ArticlesButton>
                </Stack>
                {server && (
                    <Box>
                        {multiplayerError ||
                            (!connected
                                ? "Connecting to server…"
                                : `${playerCount}/4 players · At least 2 needed to start`)}
                    </Box>
                )}

                <Players />
            </CardContent>
        </Card>
    );
}

function samePlayerDetails(previous, next) {
    if (previous === next) return true;
    if (!previous || !next || previous.length !== next.length) return false;
    return previous.every((player, index) => {
        const other = next[index];
        return (
            player.id === other.id &&
            player.nickname === other.nickname &&
            player.score === other.score &&
            shallow(player.heldChests, other.heldChests)
        );
    });
}

function Players() {
    const players = useGameStore(
        (state) => state.gameState.players,
        samePlayerDetails,
    );

    return (
        <Box
            sx={{
                mt: 1,
            }}
        >
            <Box>Players</Box>
            {players?.map((player, index) => (
                <Box
                    key={player.id ?? index}
                    sx={{ border: 1, borderColor: "divider", p: 1 }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Box sx={{ fontSize: "0.6rem" }}>ID: {player.id}</Box>
                        {/* <Chip
                            label={player.ready ? "Ready" : "Not Ready"}
                            color={player.ready ? "success" : "error"}
                            size="small"
                            sx={{ height: 20, fontSize: "0.6rem" }}
                        /> */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                fontSize: "0.6rem",
                                gap: 0.5,
                            }}
                        >
                            {player.heldChests?.length > 0 && (
                                <Box component="span">Held Chests:</Box>
                            )}
                            {player.heldChests?.map((chest, chestIndex) => (
                                <Chip
                                    key={chestIndex}
                                    label={chest}
                                    color="primary"
                                    size="small"
                                    sx={{ height: 20, fontSize: "0.6rem" }}
                                />
                            ))}
                        </Box>
                    </Box>
                    <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                        <Box component="span">{player.nickname || "?"}</Box>
                        <Chip
                            label={player.score || 0}
                            aria-label={`Score: ${player.score || 0}`}
                            size="small"
                            sx={{
                                height: 20,
                                fontSize: "0.65rem",
                                bgcolor: "#000",
                                color: "#fff",
                            }}
                        />
                    </Box>
                    <PlayerCoordinates playerId={player.id} />
                </Box>
            ))}
        </Box>
    );
}

function PlayerCoordinates({ playerId }) {
    const coordinates = useRef(null);
    const socketId = useSocketStore((state) => state.socket?.id);

    useLayoutEffect(() => {
        const isLocal = playerId === "local" || playerId === socketId;
        let previousText;
        const updateCoordinates = (state) => {
            const player = state.gameState.players?.find((p) => p.id === playerId);
            const rotation = isLocal
                ? state.rotation
                : Number.isFinite(player?.rotation)
                  ? player.rotation
                  : 0;
            const position = player?.position;
            const text = `X: ${position?.[0]?.toFixed(2) || 0} | Y: ${position?.[1]?.toFixed(2) || 0} | Z: ${position?.[2]?.toFixed(2) || 0} | Rotation: ${rotation.toFixed(1)}°`;
            if (coordinates.current && text !== previousText) {
                coordinates.current.textContent = text;
                previousText = text;
            }
        };
        updateCoordinates(useGameStore.getState());
        // Keep live coordinates without rerendering every MUI player row.
        return useGameStore.subscribe((state, previous) => {
            if (
                state.gameState.players !== previous.gameState.players ||
                (isLocal && state.rotation !== previous.rotation)
            ) {
                updateCoordinates(state);
            }
        });
    }, [playerId, socketId]);

    return (
        <Box
            ref={coordinates}
            sx={{
                fontSize: "0.65rem",
                lineHeight: 1.4,
                fontVariantNumeric: "tabular-nums",
            }}
        />
    );
}
