import { useEffect, useMemo } from "react";
import { Billboard, useTexture } from "@react-three/drei";
import {
    DoubleSide,
    LinearFilter,
    LinearMipmapLinearFilter,
    SRGBColorSpace,
} from "three";
import { BOARD_HEIGHT, BOARD_WIDTH } from "./board";

const IMAGE_URLS = [
    "/img/toontown/seaweed2.png",
    "/img/toontown/underwater_neptune.png",
    "/img/toontown/coral.png",
];

// Stable variation keeps the seabed from rearranging on game-state updates.
function variation(column, row, offset = 0) {
    const value =
        Math.sin(column * 127.1 + row * 311.7 + offset * 73.9) * 43758.5453;
    return value - Math.floor(value);
}

export default function SeabedDecorations({
    width = BOARD_WIDTH + 36,
    floorY = -BOARD_HEIGHT,
}) {
    const sources = useTexture(IMAGE_URLS);
    const textures = useMemo(
        () =>
            sources.map((source) => {
                const texture = source.clone();
                texture.colorSpace = SRGBColorSpace;
                texture.magFilter = LinearFilter;
                texture.minFilter = LinearMipmapLinearFilter;
                texture.needsUpdate = true;
                return texture;
            }),
        [sources],
    );
    useEffect(
        () => () => textures.forEach((texture) => texture.dispose()),
        [textures],
    );

    const decorations = useMemo(() => {
        const columns = Math.max(3, Math.ceil(width / 2.4));
        const spacing = width / columns;
        return [-4.4, -2.5, -0.8].flatMap((z, row) =>
            Array.from({ length: columns }, (_, column) => {
                const statue = row === 0 && column % 7 === 3;
                const image = statue ? 1 : (column + row) % 3 === 0 ? 2 : 0;
                const height = statue
                    ? 3
                    : image === 2
                      ? 0.9 + variation(column, row) * 0.5
                      : 1.25 + variation(column, row) * 1.1;
                return {
                    key: `${row}-${column}`,
                    image,
                    height,
                    mirror: variation(column, row, 1) > 0.5 ? -1 : 1,
                    position: [
                        -width / 2 +
                            spacing * (column + 0.5) +
                            (variation(column, row, 2) - 0.5) * spacing * 0.45,
                        floorY + 0.02,
                        z + variation(column, row, 3) * 0.2,
                    ],
                };
            }),
        );
    }, [width, floorY]);

    return (
        <group>
            {decorations.map(({ key, image, height, mirror, position }) => {
                const texture = textures[image];
                const aspect = texture.image.width / texture.image.height;
                return (
                    <Billboard
                        key={key}
                        position={position}
                        follow
                        lockX
                        lockZ
                    >
                        <mesh
                            position={[0, height / 2, 0]}
                            scale={[mirror, 1, 1]}
                        >
                            <planeGeometry args={[height * aspect, height]} />
                            <meshStandardMaterial
                                map={texture}
                                transparent
                                alphaTest={0.05}
                                depthWrite={false}
                                side={DoubleSide}
                                roughness={1}
                            />
                        </mesh>
                    </Billboard>
                );
            })}
        </group>
    );
}
