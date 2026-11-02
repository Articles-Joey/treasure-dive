import { useLayoutEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Box3, Euler, Matrix4, Vector3 } from "three";
import { ModelRock, ROCK_MODEL_SCALE, ROCK_MODEL_URL } from "../Models/Rock";
import { BOARD_HEIGHT, BOARD_WIDTH, WATER_SURFACE_Y } from "./board";

export default function RockSegments({
    width = BOARD_WIDTH,
    height = BOARD_HEIGHT,
    onBoundsChange,
}) {
    const groupRef = useRef();
    const { nodes } = useGLTF(ROCK_MODEL_URL);
    const rockBounds = useMemo(() => {
        const geometry = nodes.Rock_4.geometry;
        geometry.computeBoundingBox();
        return geometry.boundingBox
            .clone()
            .applyMatrix4(
                new Matrix4().makeScale(
                    ROCK_MODEL_SCALE,
                    ROCK_MODEL_SCALE,
                    ROCK_MODEL_SCALE,
                ),
            );
    }, [nodes]);

    const rocks = useMemo(() => {
        const result = [];
        for (const side of [-1, 1]) {
            let top = WATER_SURFACE_Y;
            let row = 0;
            while (top > -height) {
                const rotation = [
                    (Math.random() - 0.5) * 0.3,
                    (Math.random() - 0.5) * 0.7,
                    (Math.random() - 0.5) * 0.45,
                ];
                const transform = new Matrix4()
                    .makeRotationFromEuler(new Euler(...rotation))
                    .scale(new Vector3(side, 1, 1));
                const bounds = rockBounds.clone().applyMatrix4(transform);
                const rockHeight = bounds.max.y - bounds.min.y;
                if (row === 0) {
                    // Cap each column with a rock centered on the waterline.
                    result.push({
                        key: `surface-${side}`,
                        position: [
                            side * (width / 2 + 1),
                            WATER_SURFACE_Y - (bounds.min.y + bounds.max.y) / 2,
                            1.5,
                        ],
                        scale: [side, 1, 1],
                        rotation,
                    });
                }
                result.push({
                    key: `${row++}-${side}`,
                    position: [side * (width / 2 + 1), top - bounds.max.y, 1.5],
                    scale: [side, 1, 1],
                    rotation,
                });
                // Overlap the measured, rotated rocks and cap spacing for a dense wall.
                top -= Math.max(0.05, Math.min(2, rockHeight * 0.65));
            }
        }
        return result;
    }, [width, height, rockBounds]);

    useLayoutEffect(() => {
        if (!groupRef.current || !onBoundsChange) return;
        groupRef.current.updateWorldMatrix(true, true);
        const bounds = new Box3().setFromObject(groupRef.current, true);
        if (!bounds.isEmpty()) {
            onBoundsChange({ min: bounds.min.toArray(), max: bounds.max.toArray() });
        }
    }, [rocks, onBoundsChange]);

    return (
        <group ref={groupRef}>
            {rocks.map(({ key, ...props }) => (
                <ModelRock
                    key={key}
                    {...props}
                />
            ))}
        </group>
    );
}
