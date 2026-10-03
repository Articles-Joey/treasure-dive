"use client";

import { memo, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import BugReportIcon from "@mui/icons-material/BugReport";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import VideocamIcon from "@mui/icons-material/Videocam";
import ArticlesButton from "./Button";
import GameMenuPrimaryButtonGroup from "@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup";
import { useGameStore } from "@/hooks/useGameStore";
import { useStore } from "@/hooks/useStore";
import Minimap from "./Minimap";
import DebugPanel from "../Game/DebugPanel";
import GameDetailsPanel from "./GameDetailsPanel";

function LeftPanelContent() {
    const reloadScene = useStore((state) => state.reloadScene);
    const debug = useStore((state) => state.debug);
    const setDebug = useStore((state) => state.setDebug);
    const setScore = useGameStore((state) => state.setScore);
    const cameraMode = useGameStore((state) => state.cameraMode);
    const setCameraMode = useGameStore((state) => state.setCameraMode);
    const [debugAnchor, setDebugAnchor] = useState(null);
    const [cameraAnchor, setCameraAnchor] = useState(null);

    return (
        <Box sx={{ width: "100%" }}>
            <Card sx={{ bgcolor: "game.card", backgroundImage: "none", fontSize: "0.875rem", border: 1, borderColor: "divider" }}>
                <CardContent sx={{ p: 1, "&:last-child": { pb: 1 }, display: "flex", flexWrap: "wrap" }}>
                    <GameMenuPrimaryButtonGroup useStore={useStore} type="GameMenu" useRouter={useRouter} />
                    <Box sx={{ width: "100%", p: 0.5 }} />
                    <ArticlesButton
                        small
                        sx={{ width: "50%" }}
                        startIcon={<RestartAltIcon />}
                        onClick={() => { reloadScene(); setScore(0); }}
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
                        slotProps={{ list: { "aria-labelledby": "debug-menu-button" }, paper: { sx: { maxHeight: 600, width: 200 } } }}
                    >
                        {[false, true].map((value) => (
                            <MenuItem key={String(value)} selected={debug === value} onClick={() => {
                                setDebug(value);
                                setDebugAnchor(null);
                                reloadScene();
                            }}>
                                {value ? "True" : "False"}
                            </MenuItem>
                        ))}
                    </Menu>
                    <ArticlesButton small sx={{ width: "50%" }} startIcon={<RocketLaunchIcon />} onClick={() => {}}>
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
                        slotProps={{ list: { "aria-labelledby": "camera-menu-button" }, paper: { sx: { maxHeight: 600, width: 200 } } }}
                    >
                        {["Free", "Player"].map((mode) => (
                            <MenuItem key={mode} selected={cameraMode === mode} onClick={() => {
                                setCameraMode(mode);
                                setCameraAnchor(null);
                            }}>
                                <VideocamIcon fontSize="small" sx={{ mr: 0.5 }} />
                                {mode}
                            </MenuItem>
                        ))}
                    </Menu>
                </CardContent>
            </Card>
            <GameDetailsPanel />
            <Minimap />
            {debug && <DebugPanel />}
        </Box>
    );
}

export default memo(LeftPanelContent);
