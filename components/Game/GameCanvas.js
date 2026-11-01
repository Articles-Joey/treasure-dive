import { memo, Suspense, useMemo } from "react";

import { Canvas } from "@react-three/fiber";
import { Sky, OrbitControls, Stats } from "@react-three/drei";

import { ACESFilmicToneMapping, Object3D, PCFSoftShadowMap } from "three";

import { Debug, Physics, useBox } from "@react-three/cannon";
import { degToRad } from "three/src/math/MathUtils";

import Sand from "./Sand";
import SeabedDecorations from "./SeabedDecorations";

import PlayerBase from "./Player";
import PlayerForeground from "./PlayerForeground";
import Obstacles from "./Obstacles";
import Chests from "./Chests";
import { useStore } from "@/hooks/useStore";
import Boat from "./Boat";
import RockSegments from "./RockSegments";
import WallGraphics from "./WallGraphics";
import Water from "./Water";
import { BOARD_HEIGHT, BOARD_WIDTH, PLAYER_CAMERA_DISTANCE } from "./board";

function GameCanvas(props) {
    const gameHeight = BOARD_HEIGHT;

    const debug = useStore((state) => state.debug);
    const darkMode = useStore((state) => state.darkMode);
    const graphicsQuality = useStore((state) => state.graphicsQuality);
    const showStats = useStore((state) => state?.debugConfig?.showStats);
    const showPhysicsDebug = useStore(
        (state) => state?.debugConfig?.showPhysicsDebug,
    );
    const cameraMode = useStore((state) => state.cameraMode);
    const lowQuality = String(graphicsQuality).toLowerCase() === "low";
    const sunTarget = useMemo(() => {
        const target = new Object3D();
        target.position.set(0, -gameHeight / 2, -2);
        return target;
    }, [gameHeight]);

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

            <Sky sunPosition={darkMode ? [0, -10, 0] : [0, 10, 0]} />

            <ambientLight intensity={darkMode ? 0.18 : 0.35} />
            <hemisphereLight
                args={[
                    darkMode ? "#6589b9" : "#c2f3ff",
                    "#6b6043",
                    darkMode ? 0.5 : 1.1,
                ]}
            />
            <directionalLight
                castShadow
                target={sunTarget}
                color={darkMode ? "#a4c7ff" : "#fff0d1"}
                intensity={darkMode ? 1.1 : 3}
                position={[-15, 20, 18]}
                shadow-mapSize={[
                    lowQuality ? 1024 : 2048,
                    lowQuality ? 1024 : 2048,
                ]}
                shadow-camera-left={-BOARD_WIDTH - 8}
                shadow-camera-right={BOARD_WIDTH + 8}
                shadow-camera-top={gameHeight + 8}
                shadow-camera-bottom={-gameHeight - 8}
                shadow-camera-near={1}
                shadow-camera-far={110}
                shadow-bias={-0.00015}
                shadow-normalBias={0.035}
                shadow-radius={3}
            />
            <primitive object={sunTarget} />
            <directionalLight
                position={[10, -10, 8]}
                color="#68cce5"
                intensity={darkMode ? 0.3 : 0.65}
            />

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
                            />

                            <PlayerBase />

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
