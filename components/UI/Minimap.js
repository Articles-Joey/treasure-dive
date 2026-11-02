"use client";
import { useLayoutEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { useGameStore } from "@/hooks/useGameStore";

// Increase this to skip more of the image above the play area.
const MAP_TOP_OFFSET_PERCENT = 10;

function getMapTop(y) {
    return (
        MAP_TOP_OFFSET_PERCENT + (y / -29.5) * (100 - MAP_TOP_OFFSET_PERCENT)
    );
}

function Minimap() {
    const playerMarker = useRef(null);
    const chests = useGameStore((state) => state.gameState.chests);

    useLayoutEffect(() => {
        const updateMarker = ({ playerLocation }) => {
            if (!playerMarker.current) return;
            const left = playerLocation
                ? ((playerLocation.x + 6.5) / 13) * 100
                : 0;
            const top = getMapTop(playerLocation ? playerLocation.y : 0);
            playerMarker.current.style.left = `clamp(7px, ${left}%, calc(100% - 7px))`;
            playerMarker.current.style.top = `clamp(7px, ${top}%, calc(100% - 7px))`;
        };
        updateMarker(useGameStore.getState());
        // Move only the marker; don't rerender the map and all chest markers.
        return useGameStore.subscribe((state, previous) => {
            if (state.playerLocation !== previous.playerLocation)
                updateMarker(state);
        });
    }, []);

    // Helper to convert chest position array to minimap coordinates
    function getChestCoords(posArr) {
        if (!Array.isArray(posArr) || posArr.length < 2)
            return { left: 0, top: getMapTop(0) };
        const [x, y] = posArr;
        return {
            left: ((x + 6.5) / 13) * 100,
            top: getMapTop(y),
        };
    }

    return (
        <Card
            sx={{
                bgcolor: "game.card",
                backgroundImage: "none",
                border: 1,
                borderColor: "divider",
                "@media (min-width: 992px)": {
                    position: "fixed",
                    top: "50%",
                    transform: "translateY(-50%)",
                    right: "1rem",
                    width: 100,
                    height: 200,
                    zIndex: 2,
                },
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    width: 200,
                    maxWidth: "100%",
                    mx: "auto",
                }}
            >
                <Box
                    component="img"
                    src={`${process.env.NEXT_PUBLIC_CDN}games/Treasure Dive/treasure-dive-toontown-map.jpg`}
                    alt=""
                    sx={{
                        display: "block",
                        maxWidth: "100%",
                        height: "auto",
                        mx: "auto",
                        "@media (min-width: 992px)": {
                            width: "100%",
                            height: 200,
                            objectFit: "fill",
                        },
                    }}
                    width={200}
                />
                {/* Player marker */}
                <Box
                    ref={playerMarker}
                    sx={{
                        position: "absolute",
                        width: "10px",
                        height: "10px",
                        backgroundColor: "red",
                        borderRadius: "50%",
                        transform: "translate(-50%, -50%)",
                        border: "2px solid white",
                        boxShadow: "0 0 5px rgba(0,0,0,0.5)",
                        pointerEvents: "none",
                    }}
                />
                {/* Chest markers */}
                {Array.isArray(chests) &&
                    chests.map((chest, idx) => {
                        if (!chest || !Array.isArray(chest.position))
                            return null;
                        const coords = getChestCoords(chest.position);
                        return (
                            <Box
                                key={idx}
                                sx={{
                                    position: "absolute",
                                    left: `clamp(7px, ${coords.left}%, calc(100% - 7px))`,
                                    top: `clamp(7px, ${coords.top}%, calc(100% - 7px))`,
                                    width: "10px",
                                    height: "10px",
                                    backgroundColor: "gold",
                                    borderRadius: "50%",
                                    transform: "translate(-50%, -50%)",
                                    border: "2px solid #bfa100",
                                    boxShadow: "0 0 5px rgba(0,0,0,0.5)",
                                    pointerEvents: "none",
                                    zIndex: 2,
                                }}
                            />
                        );
                    })}
            </Box>
        </Card>
    );
}

export default Minimap;
