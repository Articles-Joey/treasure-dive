"use client";

import { memo, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import PoolIcon from "@mui/icons-material/Pool";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import ArticlesButton from "@/components/UI/Button";
import useTouchControlsStore from "@/hooks/useTouchControlsStore";

const CONTROLS = [
    { action: "left", label: "Rotate left", Icon: RotateLeftIcon },
    { action: "up", label: "Swim", Icon: PoolIcon },
    { action: "right", label: "Rotate right", Icon: RotateRightIcon },
];

function TouchControls() {
    const enabled = useTouchControlsStore((state) => state.enabled);
    const controls = useTouchControlsStore((state) => state.touchControls);
    const setTouchControls = useTouchControlsStore(
        (state) => state.setTouchControls,
    );
    const resetTouchControls = useTouchControlsStore(
        (state) => state.resetTouchControls,
    );
    const presses = useRef(new Map());
    const buttons = useRef({});

    const syncControls = () => {
        const next = { left: false, up: false, right: false };
        for (const { action, rotation } of presses.current.values()) {
            next[action] = true;
            if (rotation) next[rotation] = true;
        }
        setTouchControls(next);
    };

    const hold = (action, id) => {
        if (!enabled) return;
        presses.current.set(id, { action, rotation: null });
        syncControls();
    };

    const release = (id) => {
        if (!presses.current.has(id)) return;
        presses.current.delete(id);
        // Keep any actions still held by another finger or the keyboard.
        syncControls();
    };

    const steerWhileSwimming = (event) => {
        const press = presses.current.get(event.pointerId);
        if (!press || press.action !== "up") return;

        // Pointer capture keeps swimming active; hit-test the rotation buttons
        // using the finger's actual position rather than the captured target.
        const rotation =
            ["left", "right"].find((action) => {
                const bounds = buttons.current[action]?.getBoundingClientRect();
                return (
                    bounds &&
                    event.clientX >= bounds.left &&
                    event.clientX <= bounds.right &&
                    event.clientY >= bounds.top &&
                    event.clientY <= bounds.bottom
                );
            }) ?? null;
        if (press.rotation === rotation) return;
        press.rotation = rotation;
        syncControls();
    };

    useEffect(() => {
        const reset = () => {
            presses.current.clear();
            resetTouchControls();
        };
        const onVisibilityChange = () => {
            if (document.hidden) reset();
        };
        window.addEventListener("blur", reset);
        document.addEventListener("visibilitychange", onVisibilityChange);
        return () => {
            window.removeEventListener("blur", reset);
            document.removeEventListener(
                "visibilitychange",
                onVisibilityChange,
            );
            reset();
        };
    }, [resetTouchControls]);

    if (!enabled) return null;

    return (
        <Box
            className="touch-controls-area hidden-in-screenshot-mode"
            role="group"
            aria-label="Swimming controls"
            sx={(theme) => ({
                position: "fixed",
                left: "50%",
                bottom: "max(16px, env(safe-area-inset-bottom))",
                transform: "translateX(-50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                p: 1,
                zIndex: 10,
                pointerEvents: "none",
                [theme.breakpoints.up("md")]: {
                    right: "1rem",
                    left: "auto",
                    transform: "none",
                },
            })}
        >
            {CONTROLS.map(({ action, label, Icon }) => (
                <ArticlesButton
                    key={action}
                    ref={(element) => {
                        buttons.current[action] = element;
                    }}
                    aria-label={label}
                    aria-pressed={Boolean(controls[action])}
                    active={Boolean(controls[action])}
                    onPointerDown={(event) => {
                        if (event.button !== 0) return;
                        event.preventDefault();
                        event.currentTarget.setPointerCapture(event.pointerId);
                        hold(action, event.pointerId);
                    }}
                    onPointerUp={(event) => release(event.pointerId)}
                    onPointerMove={steerWhileSwimming}
                    onPointerCancel={(event) => release(event.pointerId)}
                    onLostPointerCapture={(event) => release(event.pointerId)}
                    onKeyDown={(event) => {
                        if (event.key !== " " && event.key !== "Enter") return;
                        event.preventDefault();
                        if (!event.repeat) hold(action, `key-${action}`);
                    }}
                    onKeyUp={(event) => {
                        if (event.key !== " " && event.key !== "Enter") return;
                        event.preventDefault();
                        release(`key-${action}`);
                    }}
                    onBlur={() => release(`key-${action}`)}
                    onContextMenu={(event) => event.preventDefault()}
                    onDragStart={(event) => event.preventDefault()}
                    sx={{
                        width: "clamp(52px, 12vw, 68px)",
                        height: "clamp(52px, 12vw, 68px)",
                        minWidth: 0,
                        flexShrink: 0,
                        borderRadius: "50%",
                        p: 0,
                        m: 0,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        pointerEvents: "auto",
                        touchAction: "none",
                        userSelect: "none",
                        WebkitTouchCallout: "none",
                        filter: "drop-shadow(0 3px 5px rgba(0, 0, 0, 0.3))",
                        "& .MuiSvgIcon-root": {
                            fontSize: "clamp(24px, 5vw, 32px)",
                        },
                    }}
                >
                    <Icon />
                </ArticlesButton>
            ))}
        </Box>
    );
}

export default memo(TouchControls);
