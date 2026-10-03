"use client";
import Box from "@mui/material/Box";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ModelKennyNLPirateShipDark } from "@/components/Models/ship_dark";
import { ModelDonaldsBoat } from "../Models/DonaldsBoat";
import { useStore } from "@/hooks/useStore";

export default function RotatingMascot() {

    const toontownMode = useStore(state => state.toontownMode)

    return (
        <Box className="rotating-mascot-container" sx={{ width: "100%", height: "100%" }}>
            <Canvas shadows>

                <group position={[0, 0, 0]}>
                    <OrbitControls
                        autoRotate
                        enableZoom={false}
                        enablePan={false}
                        enableRotate={false}
                        autoRotateSpeed={10}
                    />

                    {/* <ambientLight intensity={2} /> */}
                    <directionalLight
                        castShadow
                        position={[10, 10, 5]}
                        intensity={5}
                        shadow-mapSize-width={1024}
                        shadow-mapSize-height={1024}
                    />
                    <directionalLight
                        castShadow
                        position={[-10, 10, 5]}
                        intensity={5}
                        shadow-mapSize-width={1024}
                        shadow-mapSize-height={1024}
                    />

                    {toontownMode ?
                        <>
                            <ModelDonaldsBoat 
                                position={[0, -1.5, 0]}
                            />
                        </>
                        :
                        <>
                            <ModelKennyNLPirateShipDark
                                scale={0.7}
                                position={[0, -2, 0]}
                            />
                        </>
                    }

                </group>

            </Canvas>
        </Box>
    );
}
