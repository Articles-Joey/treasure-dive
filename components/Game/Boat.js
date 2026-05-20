import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore } from "@/hooks/useStore";

import { degToRad } from "three/src/math/MathUtils.js";

import { ModelDonaldsBoat } from "@/components/Models/DonaldsBoat";
import { ModelKennyNLPirateShipDark } from "@/components/Models/ship_dark";
import { ModelDonaldDuck } from "@/components/Models/DonaldDuck";

export default function Boat() {

    const groupRef = useRef();
    const toontownMode = useStore(state => state.toontownMode)

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (groupRef.current) {
            // Up and down (Y)
            groupRef.current.position.y = Math.sin(t * 1.5) * 0.1;

            // Pitch (rocking forward/backward) - slight X rotation
            groupRef.current.rotation.x = Math.sin(t * 1.2) * 0.05;

            // Roll (rocking side-to-side) - slight Z rotation
            groupRef.current.rotation.z = Math.cos(t * 1.4) * 0.05;

            // Slight moving back and forth (X position since boat is rotated 90 deg)
            groupRef.current.position.x = Math.sin(t * 0.8) * 0.1;
        }
    });

    return (
        <group ref={groupRef}>

            {toontownMode ?
                <>
                    <group>
                        <ModelDonaldsBoat
                            rotation={[0, degToRad(90), 0]}
                            position={[0.5, 0.25, 0]}
                        />
                        <ModelDonaldDuck
                            rotation={[0, degToRad(0), 0]}
                            position={[-1.75, 1.04, 0]}
                            scale={1.25}
                        />
                    </group>
                </>
                :
                <>
                    <ModelKennyNLPirateShipDark
                        position={[-0, -0.25, 0]}
                        rotation={[0, degToRad(90), 0]}
                    />
                </>
            }
        </group>
    )
}