import { createContext, createRef, forwardRef, memo, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Sky, useDetectGPU, useTexture, OrbitControls, Cylinder, QuadraticBezierLine, Text, Stats } from "@react-three/drei";

import { NearestFilter, RepeatWrapping, TextureLoader, Vector3 } from "three";

export default function WallGraphics() {

    const texture = useTexture('/img/mg_cliff.png')

    const segments = useMemo(() => {
        return [
            2 / 3, // Top
            0,     // Middle
            1 / 3, // Bottom
        ].map((offsetX) => {
            const t = texture.clone()
            t.repeat.set(1 / 3, 1)
            t.offset.set(offsetX, 0)
            t.wrapS = t.wrapT = RepeatWrapping
            t.magFilter = t.minFilter = NearestFilter
            t.needsUpdate = true
            return t
        })
    }, [texture])

    // Define X positions per segment (index correspond to segments)
    const segmentXPositions = [
        [-6.5, 6.5], // Top segment X positions
        [-6.65, 6.65], // Middle segment X positions
        [-6.65, 6.65]  // Bottom segment X positions
    ]
    const yPositions = [-4.5, -14.5, -24.5]

    return (
        <group>
            {yPositions.map((y, i) => (
                <group key={`row-${i}`}>
                    {segmentXPositions[i].map((x, j) => (

                        <mesh
                            key={`segment-${i}-${j}`}
                            position={[x, y, 0.51]}
                            scale={[x < 0 ? -1 : 1, 1, 1]}
                        >
                            <planeGeometry args={[2, 11]} />
                            <meshStandardMaterial
                                map={segments[i]}
                                transparent={true}
                                polygonOffset={true}
                                polygonOffsetFactor={-1}
                            />
                        </mesh>

                    ))}
                </group>
            ))}
        </group>
    )

}