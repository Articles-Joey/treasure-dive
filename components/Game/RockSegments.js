import { createContext, createRef, forwardRef, memo, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { NearestFilter, RepeatWrapping, TextureLoader, Vector3 } from "three";

import { ModelRock } from "../Models/Rock";

export default function RockSegments() {

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
        [-8, 8], // Top segment X positions
        [-8, 8], // Middle segment X positions
        [-8, 8]  // Bottom segment X positions
    ]
    const yPositions = [-12, -20, -31]

    return (
        <group>
            {yPositions.map((y, i) => (
                <group key={`row-${i}`}>
                    {segmentXPositions[i].map((x, j) => (
                        
                        <ModelRock 
                            key={`rock-segment-${i}-${j}`}
                            position={[x, y, 1.5]}
                            scale={[x < 0 ? -1 : 1, 5, 1]}
                        />

                    ))}
                </group>
            ))}
        </group>
    )

}