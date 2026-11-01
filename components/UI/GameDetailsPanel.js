"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import { useGameStore } from "@/hooks/useGameStore";
import ArticlesButton from "./Button";
import useGameHelpers from "@/hooks/useGameHelpers";
import { useScoreStore } from "@/hooks/useScoreStore";
import { useSocketStore } from "@/hooks/useSocketStore";
import { ScoreDate } from "./SinglePlayerGameOverDialog";
import Stack from "@mui/material/Stack";

export default function GameDetailsPanel() {
    const status = useGameStore((state) => state.gameState.status);
    const timer = useGameStore((state) => state.gameState.timer);
    const score = useGameStore((state) => state.score);
    const obstaclesHit = useGameStore((state) => state.obstacles_hit);
    const lifetimeHits = useScoreStore((state) => state.obstacles_hit);
    const startedAt = useGameStore((state) => state.gameState.startedAt);
    const result = useGameStore((state) => state.gameState.result);
    const playerLocation = useGameStore((state) => state.playerLocation);
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
                {/* <Box>Timer: {timer}</Box> */}
                {/* <Box>
                    Range: {playerLocation?.x?.toFixed(2) ?? "0.00"} | Depth: {playerLocation?.y?.toFixed(2) ?? "0.00"}
                </Box> */}
                {/* <Box>Obstacles hit this game: {obstaclesHit}</Box> */}
                {/* <Box>Lifetime obstacles hit: {lifetimeHits}</Box> */}
                {/* {startedAt && <Box>Started: <ScoreDate playedAt={startedAt} /></Box>} */}
                {/* {result && <Box>Finished by {result.nickname}: <ScoreDate playedAt={result.playedAt} /></Box>} */}
                <ArticlesButton
                    small
                    sx={{
                        width: "100%",
                        mb: 1,
                    }}
                    disabled={isGameInProgress}
                    onClick={() => handleGameStart()}
                >
                    {isGameInProgress ? "Game In Progress" : "Start Game"}
                </ArticlesButton>
                <Players />
            </CardContent>
        </Card>
    );
}

function Players() {
    const players = useGameStore((state) => state.gameState.players);
    const rotation = useGameStore((state) => state.rotation);
    const socketId = useSocketStore((state) => state.socket?.id);

    return (
        <Box>
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
                    <Box
                        sx={{
                            fontSize: "0.65rem",
                            lineHeight: 1.4,
                            fontVariantNumeric: "tabular-nums",
                        }}
                    >
                        X: {player.position?.[0]?.toFixed(2) || 0} | Y:{" "}
                        {player.position?.[1]?.toFixed(2) || 0} | Z:{" "}
                        {player.position?.[2]?.toFixed(2) || 0} | Rotation:{" "}
                        {(player.id === "local" || player.id === socketId
                            ? rotation
                            : Number.isFinite(player.rotation)
                              ? player.rotation
                              : 0
                        ).toFixed(1)}
                        °
                    </Box>
                </Box>
            ))}
        </Box>
    );
}
