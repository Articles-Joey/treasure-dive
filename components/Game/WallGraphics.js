import { useEffect, useMemo } from "react";

import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

import getAssetSource from "@articles-media/articles-dev-box/getAssetSource";

import {
    LinearFilter,
    LinearMipmapLinearFilter,
    RepeatWrapping,
    SRGBColorSpace,
} from "three";
import { BOARD_HEIGHT, BOARD_WIDTH, WATER_SURFACE_Y } from "./board";

export default function WallGraphics({
    width = BOARD_WIDTH,
    height = BOARD_HEIGHT,
}) {
    const texture = useTexture(getAssetSource("/img/mg_cliff.png"));
    const gl = useThree((state) => state.gl);

    const segments = useMemo(() => {
        return [
            2 / 3, // Top
            0, // Middle
            1 / 3, // Bottom
        ].map((offsetX) => {
            const t = texture.clone();
            // Inset the atlas samples to avoid filtering a neighboring strip.
            const inset = 1 / texture.image.width;
            t.repeat.set(1 / 3 - inset * 2, 1);
            t.offset.set(offsetX + inset, 0);
            t.wrapS = t.wrapT = RepeatWrapping;
            t.magFilter = LinearFilter;
            t.minFilter = LinearMipmapLinearFilter;
            t.colorSpace = SRGBColorSpace;
            t.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
            t.needsUpdate = true;
            return t;
        });
    }, [texture, gl]);

    useEffect(
        () => () => segments.forEach((segment) => segment.dispose()),
        [segments],
    );

    // Define X positions per segment (index correspond to segments)
    const segmentXPositions = [
        [-(width / 2 - 0.5), width / 2 - 0.5],
        [-(width / 2 - 0.35), width / 2 - 0.35],
        [-(width / 2 - 0.35), width / 2 - 0.35],
    ];
    const segmentHeight = height / 3;
    const yPositions = [0, 1, 2].map(
        (row) => WATER_SURFACE_Y - (row + 0.5) * segmentHeight,
    );

    return (
        <group>
            {yPositions.map((y, i) => (
                <group key={`row-${i}`}>
                    {segmentXPositions[i].map((x, j) => (
                        <mesh
                            receiveShadow
                            renderOrder={4}
                            key={`segment-${i}-${j}`}
                            position={[x, y, 0.51]}
                            scale={[x < 0 ? -1 : 1, 1, 1]}
                        >
                            <planeGeometry args={[2, segmentHeight + 1]} />
                            <meshStandardMaterial
                                map={segments[i]}
                                transparent={true}
                                alphaTest={0.05}
                                depthWrite={false}
                                polygonOffset={true}
                                polygonOffsetFactor={-1}
                            />
                        </mesh>
                    ))}
                </group>
            ))}
        </group>
    );
}
