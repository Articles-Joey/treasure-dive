import { createContext, createRef, forwardRef, memo, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Sky, useDetectGPU, useTexture, OrbitControls, Cylinder, QuadraticBezierLine, Text } from "@react-three/drei";

import { NearestFilter, RepeatWrapping, TextureLoader, Vector3 } from "three";

import { Debug, Physics, useBox, useSphere } from "@react-three/cannon";
import { degToRad } from "three/src/math/MathUtils";
import { ModelKennyNLPirateShipDark } from "@/components/Models/ship_dark";

import Sand from "./Sand";

import PlayerBase from "./Player";
import Obstacles from "./Obstacles";
import Chests from "./Chests";
import { useGameStore } from "@/hooks/useGameStore";

function GameCanvas(props) {

    const gameHeight = 30

    const {
        debug,
    } = useGameStore(state => ({
        debug: state.debug,
    }));

    let gameContent = (
        <>
            <Wall
                position={[-7.5, -25, 0]}
                height={gameHeight}
            />

            <Wall
                position={[7.5, -25, 0]}
                height={gameHeight}
            />

            <Surface
                position={[0, 1, 0]}
            />

            <Surface
                position={[0, -(gameHeight + 0.5), 0]}
            />

            <PlayerBase />

            <Obstacles />

            <Chests />
        </>
    )

    let physicsContent
    if (debug) {
        physicsContent = (
            <Debug>
                {gameContent}
            </Debug>
        )
    } else {
        physicsContent = (
            gameContent
        )
    }

    return (
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>

            <OrbitControls
            // autoRotate={gameState?.status == 'In Lobby'}
            />

            <Sky
                sunPosition={[0, 10, 0]}
            />

            <ambientLight intensity={1} />
            <spotLight intensity={30000} position={[-50, 100, 50]} angle={5} penumbra={1} />

            <ModelKennyNLPirateShipDark
                position={[0, -0.5, 2.75]}
                rotation={[0, degToRad(90), 0]}
            />

            <group
                position={[0, -25, 0]}
            >
                <Water />
            </group>

            <Sand
                rotation={[degToRad(-90), 0, 0]}
                position={[0, -gameHeight, -9.5]}
                args={[50, 20]}
            />

            <Physics>

                {physicsContent}

            </Physics>

        </Canvas>
    )
}

export default memo(GameCanvas)

function Water() {

    return (
        <mesh castShadow>
            <boxGeometry args={[14, 50, 1]} />
            <meshStandardMaterial
                color="blue"
                transparent={true}
                opacity={0.5}
            />
        </mesh>
    )

}

function Wall({ height, position }) {

    const [ref, api] = useBox(() => ({
        mass: 0,
        // type: 'Dynamic',
        // isTrigger: true,
        args: [1, (height + .5), 1],
        position: [
            position[0],
            -(height / 2),
            position[2]
        ],
        // rotation: [0, degToRad(-90), 0],
        userData: {
            // isChest: true,
            // index: props.obj_i
        }
    }))

    return (
        <mesh ref={ref} castShadow position={position}>
            <boxGeometry args={[1, (height + .5), 1]} />
            <meshStandardMaterial
                color="saddlebrown"
            // transparent={true}
            // opacity={0.5}
            />
        </mesh>
    )

}

function Surface({ position }) {

    const args = [30, 1, 2]

    const [ref, api] = useBox(() => ({
        mass: 0,
        // type: 'Dynamic',
        // isTrigger: true,
        args: args,
        position: position,
        // rotation: [0, degToRad(-90), 0],
        userData: {
            // isChest: true,
            // index: props.obj_i
        }
    }))

    const {
        debug,
    } = useGameStore(state => ({
        debug: state.debug,
    }));

    return (
        <mesh ref={ref} castShadow position={position}>

            {debug &&
                <>
                    <boxGeometry args={args} />
                    <meshStandardMaterial
                        color="white"
                        transparent={true}
                        opacity={0.25}
                    />
                </>
            }

        </mesh>
    )

}