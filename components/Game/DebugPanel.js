"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import BugReportIcon from "@mui/icons-material/BugReport";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import VideocamIcon from "@mui/icons-material/Videocam";

import ArticlesButton from "@/components/UI/Button";

import { useGameStore } from "@/hooks/useGameStore";
import { useStore } from "@/hooks/useStore";

function DebugPanel() {
    const score = useGameStore((state) => state.score);
    const holdingChest = useGameStore((state) => state.holdingChest);

    const server = useSearchParams().get("server");
    const reloadScene = useStore((state) => state.reloadScene);
    const debug = useStore((state) => state.debug);
    const setDebug = useStore((state) => state.setDebug);
    const setScore = useGameStore((state) => state.setScore);
    const cameraMode = useStore((state) => state.cameraMode);
    const setCameraMode = useStore((state) => state.setCameraMode);
    const [debugAnchor, setDebugAnchor] = useState(null);
    const [cameraAnchor, setCameraAnchor] = useState(null);

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
                <Box>Debug Info</Box>

                <Box>Score: {score}</Box>

                <Box>
                    Holding Chest:{" "}
                    {holdingChest === false ? "No" : `Yes - ${holdingChest}`}
                </Box>

                <ArticlesButton
                    small
                    sx={{ width: "50%" }}
                    startIcon={<RestartAltIcon />}
                    onClick={() => {
                        if (!server)
                            useGameStore.getState().resetSinglePlayerGame();
                        else setScore(0);
                        reloadScene();
                    }}
                >
                    Reload Game
                </ArticlesButton>
                <ArticlesButton
                    id="debug-menu-button"
                    small
                    sx={{ width: "50%" }}
                    startIcon={<BugReportIcon />}
                    aria-haspopup="menu"
                    aria-controls={debugAnchor ? "debug-menu" : undefined}
                    aria-expanded={Boolean(debugAnchor)}
                    onClick={(event) => setDebugAnchor(event.currentTarget)}
                >
                    Debug {debug ? "On" : "Off"}
                </ArticlesButton>
                <Menu
                    id="debug-menu"
                    anchorEl={debugAnchor}
                    open={Boolean(debugAnchor)}
                    onClose={() => setDebugAnchor(null)}
                    slotProps={{
                        list: { "aria-labelledby": "debug-menu-button" },
                        paper: { sx: { maxHeight: 600, width: 200 } },
                    }}
                >
                    {[false, true].map((value) => (
                        <MenuItem
                            key={String(value)}
                            selected={debug === value}
                            onClick={() => {
                                setDebug(value);
                                setDebugAnchor(null);
                                reloadScene();
                            }}
                        >
                            {value ? "True" : "False"}
                        </MenuItem>
                    ))}
                </Menu>
                <ArticlesButton
                    small
                    sx={{ width: "50%" }}
                    startIcon={<RocketLaunchIcon />}
                    onClick={() => {}}
                >
                    Teleport
                </ArticlesButton>
                <ArticlesButton
                    id="camera-menu-button"
                    small
                    sx={{ width: "50%" }}
                    startIcon={<VideocamIcon />}
                    aria-haspopup="menu"
                    aria-controls={cameraAnchor ? "camera-menu" : undefined}
                    aria-expanded={Boolean(cameraAnchor)}
                    onClick={(event) => setCameraAnchor(event.currentTarget)}
                >
                    Camera
                </ArticlesButton>
                <Menu
                    id="camera-menu"
                    anchorEl={cameraAnchor}
                    open={Boolean(cameraAnchor)}
                    onClose={() => setCameraAnchor(null)}
                    slotProps={{
                        list: { "aria-labelledby": "camera-menu-button" },
                        paper: { sx: { maxHeight: 600, width: 200 } },
                    }}
                >
                    {["Free", "Player"].map((mode) => (
                        <MenuItem
                            key={mode}
                            selected={cameraMode === mode}
                            onClick={() => {
                                setCameraMode(mode);
                                setCameraAnchor(null);
                            }}
                        >
                            <VideocamIcon
                                fontSize="small"
                                sx={{ mr: 0.5 }}
                            />
                            {mode}
                        </MenuItem>
                    ))}
                </Menu>
            </CardContent>
        </Card>
    );
}

export default DebugPanel;
