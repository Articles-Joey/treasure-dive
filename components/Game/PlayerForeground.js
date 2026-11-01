import { useLayoutEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export const PLAYER_FOREGROUND_LAYER = 1;

export default function PlayerForeground() {
    const scene = useThree((state) => state.scene);

    useLayoutEffect(() => {
        const lights = [];
        scene.traverse((object) => {
            if (!object.isLight) return;
            lights.push([object, object.layers.mask]);
            object.layers.enable(PLAYER_FOREGROUND_LAYER);
        });
        return () =>
            lights.forEach(([light, mask]) => {
                light.layers.mask = mask;
            });
    }, [scene]);

    useFrame(({ gl, camera }) => {
        // Draw the complete world first, including the player's normal shadows.
        gl.render(scene, camera);

        const cameraMask = camera.layers.mask;
        const autoClear = gl.autoClear;
        const shadowAutoUpdate = gl.shadowMap.autoUpdate;
        const background = scene.background;
        try {
            // Give the player its own depth buffer so its body parts still
            // occlude each other correctly, regardless of the boat's depth.
            gl.autoClear = false;
            gl.shadowMap.autoUpdate = false;
            scene.background = null;
            camera.layers.set(PLAYER_FOREGROUND_LAYER);
            gl.clearDepth();
            gl.render(scene, camera);
        } finally {
            camera.layers.mask = cameraMask;
            scene.background = background;
            gl.shadowMap.autoUpdate = shadowAutoUpdate;
            gl.autoClear = autoClear;
        }
    }, 1);

    return null;
}
