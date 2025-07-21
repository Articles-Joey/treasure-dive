import { degToRad } from "three/src/math/MathUtils.js";

import { Chest } from "./Chest";

import { useGameStore } from "@/hooks/useGameStore";

export default function Chests() {

    const {
        chests
    } = useGameStore(state => ({
        chests: state.chests
    }));

    return (
        <group>

            {chests.map((obj, obj_i) => {

                return (
                    <Chest
                        key={obj_i}
                        position={obj.position}
                        obj_i={obj_i}
                        scale={2}
                        rotation={[0, degToRad(-180), 0]}
                    />
                )

            })}

            {/* <Chest
                position={[-5, -50, 0]}
                scale={2}
                rotation={[0, degToRad(-180), 0]}
            />

            <Chest
                position={[-2.5, -50, 0]}
                scale={2}
                rotation={[0, degToRad(-180), 0]}
            />

            <Chest
                position={[0, -50, 0]}
                scale={2}
                rotation={[0, degToRad(-180), 0]}
            />

            <Chest
                position={[2.5, -50, 0]}
                scale={2}
                rotation={[0, degToRad(-180), 0]}
            />

            <Chest
                position={[5, -50, 0]}
                scale={2}
                rotation={[0, degToRad(-180), 0]}
            /> */}

        </group>
    )

}