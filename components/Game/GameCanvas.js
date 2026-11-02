import { memo, Suspense, useState } from "react";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";

import { ACESFilmicToneMapping, PCFSoftShadowMap } from "three";

import { Debug, Physics, useBox } from "@react-three/cannon";
import { degToRad } from "three/src/math/MathUtils";

import Sand from "./Sand";
import SeabedDecorations from "./SeabedDecorations";

import PlayerBase from "./Player";
import Players from "./Players";
import PlayerForeground from "./PlayerForeground";
import SceneLighting from "./SceneLighting";
import Obstacles from "./Obstacles";
import Chests from "./Chests";
import { useStore } from "@/hooks/useStore";
import Boat from "./Boat";
import RockSegments from "./RockSegments";
import WallGraphics from "./WallGraphics";
import Water from "./Water";
import { BOARD_HEIGHT, BOARD_WIDTH, PLAYER_CAMERA_DISTANCE } from "./board";

function GameCanvas({ landingAnimationMode = false }) {
    const gameHeight = BOARD_HEIGHT;
    const [rockBounds, setRockBounds] = useState(null);

    const debug = useStore((state) => state.debug);
    const graphicsQuality = useStore((state) => state.graphicsQuality);
    const showStats = useStore((state) => state?.debugConfig?.showStats);
    const showPhysicsDebug = useStore(
        (state) => state?.debugConfig?.showPhysicsDebug,
    );
    const cameraMode = useStore((state) => state.cameraMode);
    const lowQuality = String(graphicsQuality).toLowerCase() === "low";

    return (
        <Canvas
            shadows={{ type: PCFSoftShadowMap }}
            dpr={[1, lowQuality ? 1 : 2]}
            gl={{
                antialias: !lowQuality,
                toneMapping: ACESFilmicToneMapping,
                toneMappingExposure: 1.05,
            }}
            camera={{ position: [0, 0, PLAYER_CAMERA_DISTANCE], fov: 50 }}
        >
            {showStats && (
                <>
                    <Stats className="stats-overlay" />
                </>
            )}

            <OrbitControls enabled={cameraMode === "Free"} />

            <SceneLighting />

            <Boat />
            <PlayerForeground />

            <Water
                width={BOARD_WIDTH + 20}
                height={gameHeight}
            />

            <Sand
                rotation={[degToRad(-90), 0, 0]}
                position={[0, -gameHeight, -3.5]}
                args={[BOARD_WIDTH + 36, 20]}
            />
            <Suspense fallback={null}>
                <SeabedDecorations
                    width={BOARD_WIDTH + 36}
                    floorY={-gameHeight}
                />
            </Suspense>

            <Suspense>
                <Physics gravity={[0, 0, 0]}>
                    <Debug scale={showPhysicsDebug ? 1 : 0}>
                        <>
                            <Wall
                                position={[
                                    -(BOARD_WIDTH / 2 + 0.5),
                                    -gameHeight / 2,
                                    0,
                                ]}
                                height={gameHeight}
                            />

                            <Wall
                                position={[
                                    BOARD_WIDTH / 2 + 0.5,
                                    -gameHeight / 2,
                                    0,
                                ]}
                                height={gameHeight}
                            />

                            <WallGraphics
                                width={BOARD_WIDTH}
                                height={gameHeight}
                            />

                            <RockSegments
                                width={BOARD_WIDTH}
                                height={gameHeight}
                                onBoundsChange={setRockBounds}
                            />

                            {!landingAnimationMode &&
                                <>
                                    <PlayerBase cameraBounds={rockBounds} />
                                    <Players />
                                </>
                            }

                            <Obstacles />

                            <Chests />
                        </>
                    </Debug>
                </Physics>
            </Suspense>
        </Canvas>
    );
}

export default memo(GameCanvas);

function Wall({ height, position }) {
    const [ref, api] = useBox(() => ({
        mass: 0,
        // type: 'Dynamic',
        // isTrigger: true,
        args: [1, height + 0.5, 1],
        position: [position[0], -(height / 2), position[2]],
        // rotation: [0, degToRad(-90), 0],
        userData: {
            // isChest: true,
            // index: props.obj_i
        },
    }));

    return (
        <mesh
            ref={ref}
            castShadow
            receiveShadow
            position={position}
        >
            <boxGeometry args={[1, height + 0.5, 1]} />
            <meshStandardMaterial
                color="saddlebrown"
            // transparent={true}
            // opacity={0.5}
            />
        </mesh>
    );
}
