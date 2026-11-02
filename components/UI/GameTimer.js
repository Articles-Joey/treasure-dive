"use client";

import Box from "@mui/material/Box";
import { useGameStore } from "@/hooks/useGameStore";
import useTouchControlsStore from "@/hooks/useTouchControlsStore";

export default function GameTimer() {
    const timer = useGameStore((state) => state.gameState.timer);
    const touchControlsEnabled = useTouchControlsStore(
        (state) => state.enabled,
    );
    // Use the authoritative timer for both local and server games.
    const seconds = Number.isFinite(Number(timer))
        ? Math.max(0, Math.ceil(Number(timer)))
        : 0;

    return (
        <Box
            component="output"
            className="game-timer hidden-in-screenshot-mode"
            role="timer"
            aria-label={`Time remaining: ${seconds} seconds`}
            aria-live="off"
            sx={{
                position: "absolute",
                right: "max(12px, env(safe-area-inset-right))",
                top: "max(12px, env(safe-area-inset-bottom))",
                "@media (max-width: 480px)": {
                    bottom: touchControlsEnabled
                        ? "calc(max(12px, env(safe-area-inset-bottom)) + 96px)"
                        : "max(12px, env(safe-area-inset-bottom))",
                },
                width: "100px",
                aspectRatio: "1",
                zIndex: 2,
                pointerEvents: "none",
                userSelect: "none",
                filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))",
            }}
        >
            <Box
                component="img"
                src="/img/toontown/alarm-clock-filled.webp"
                alt=""
                sx={{ display: "block", width: "100%", height: "100%" }}
            />
            <Box
                component="span"
                sx={{
                    position: "absolute",
                    left: "49%",
                    top: "49.5%",
                    transform: "translate(-50%, -50%)",
                    color: "#000",
                    fontFamily: "Arial, Helvetica, sans-serif",
                    fontWeight: 900,
                    fontSize: "1.5rem",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                }}
            >
                {seconds}
            </Box>
        </Box>
    );
}
