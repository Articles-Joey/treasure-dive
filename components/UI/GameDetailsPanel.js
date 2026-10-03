"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import { useGameStore } from "@/hooks/useGameStore";
import ArticlesButton from "./Button";
import useGameHelpers from "@/hooks/useGameHelpers";

export default function GameDetailsPanel() {
    const status = useGameStore((state) => state.gameState.status);
    const timer = useGameStore((state) => state.gameState.timer);
    const { handleGameStart } = useGameHelpers();

    return (
        <Card sx={{ bgcolor: "game.card", backgroundImage: "none", fontSize: "0.875rem", border: 1, borderColor: "divider" }}>
            <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                <Box>Status: {status}</Box>
                <Box>Timer: {timer}</Box>
                <ArticlesButton small sx={{ width: "100%" }} onClick={() => handleGameStart()}>
                    Start Game
                </ArticlesButton>
                <Players />
            </CardContent>
        </Card>
    );
}

function Players() {
    const players = useGameStore((state) => state.gameState.players);

    return (
        <Box>
            <Box>Players</Box>
            {players?.map((player, index) => (
                <Box key={player.id ?? index} sx={{ border: 1, borderColor: "divider", p: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ fontSize: "0.6rem" }}>ID: {player.id}</Box>
                        <Box sx={{ display: "flex", alignItems: "center", fontSize: "0.6rem", gap: 0.5 }}>
                            {player.heldChests?.length > 0 && <Box component="span">Held Chests:</Box>}
                            {player.heldChests?.map((chest, chestIndex) => (
                                <Chip key={chestIndex} label={chest} color="primary" size="small" sx={{ height: 20, fontSize: "0.6rem" }} />
                            ))}
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Chip label={player.ready ? "Ready" : "Not Ready"} color={player.ready ? "success" : "error"} size="small" sx={{ height: 20, fontSize: "0.6rem" }} />
                        <Box component="span">{player.nickname || "?"} - {player.score || 0}</Box>
                    </Box>
                    <Box>
                        X: {player.position?.[0]?.toFixed(2) || 0} | Y: {player.position?.[1]?.toFixed(2) || 0} | Z: {player.position?.[2]?.toFixed(2) || 0}
                    </Box>
                </Box>
            ))}
        </Box>
    );
}
