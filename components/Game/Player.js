import { useFrame, useThree } from "@react-three/fiber"
import { useSphere } from "@react-three/cannon"
import { useGLTF, useAnimations, Text } from '@react-three/drei'
import { memo, use, useEffect, useRef, useState } from "react"
import { Vector3 } from "three"
import * as THREE from 'three';
// import { useKeyboard } from "components/Games/Epcot/hooks/useKeyboard"

import { useControllerStore } from '@/hooks/useControllerStore';
import { useControlsStore, useGameStore } from "@/hooks/useGameStore";

// import ClownfishModel from "./PlayerModels/Clownfish"
// import BoneFishModel from "./PlayerModels/BoneFish"
// import { useLocalStorageNew } from "@/hooks/useLocalStorageNew"

import { Model as SpacesuitModel } from "@/components/Models/Spacesuit";
import { degToRad } from "three/src/math/MathUtils.js"
import { HeldChest } from "@/components/Game/HeldChest"
import { useKeyboard } from "@/hooks/useKeyboard"
import { useStore } from "@/hooks/useStore"
import useGameHelpers from "@/hooks/useGameHelpers"
import { useSearchParams } from "next/navigation"
import useTouchControlsStore from "@/hooks/useTouchControlsStore"

const JUMP_FORCE = 6;
const SPEED = 4;
const ROTATION_SPEED = 2; // degrees per frame

let lastLocation

function myToFixed(i, digits) {
    var pow = Math.pow(10, digits);

    return Math.floor(i * pow) / pow;
}

function PlayerBase(props) {

    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    // const { setPlayerData, teleportPlayer, setTeleportPlayer } = props;

    const nickname = useStore((state) => state.nickname)

    const {
        cameraMode, setCameraMode,
        teleport, setTeleport,
        setPlayerLocation,
        maxHeight, setMaxHeight,
        shift, setShift,
        addDistance,
        rotation, setRotation,
        holdingChest, setHoldingChest,
        addScore,
        debug
    } = useGameStore(state => ({
        cameraMode: state.cameraMode,
        setCameraMode: state.setCameraMode,
        teleport: state.teleport,
        setTeleport: state.setTeleport,
        setPlayerLocation: state.setPlayerLocation,
        maxHeight: state.maxHeight,
        setMaxHeight: state.setMaxHeight,
        shift: state.shift,
        setShift: state.setShift,
        addDistance: state.addDistance,
        rotation: state.rotation,
        setRotation: state.setRotation,
        holdingChest: state.holdingChest,
        setHoldingChest: state.setHoldingChest,
        addScore: state.addScore,
        debug: state.debug
    }));

    const status = useGameStore(state => state.gameState.status)

    const {
        touchControls, setTouchControls
    } = useTouchControlsStore()

    const { controllerState, setControllerState } = useControllerStore()

    // const [character, setCharacter] = useLocalStorageNew("game:ocean-rings:character", {
    //     model: 'Clownfish',
    //     color: '#000000'
    // })

    // Attach event listeners when the component mounts
    useEffect(() => {

        if (controllerState.axes && Math.abs(controllerState?.axes[0]) > 0.3) {

            if (controllerState?.axes[0] > 0) {
                api.position.set([-1, 5, 0]);
            } else {
                api.position.set([1, 5, 0]);
            }

        }

    }, [controllerState]);

    useEffect(() => {

        if (teleport) {

            console.log("Teleport has been called!", teleport)
            api.position.set(teleport[0], teleport[1], teleport[2]);
            setTeleport(false)

        }

    }, [teleport]);

    const { moveBackward, moveForward, moveRight, moveLeft, jump, shift: isShifting, crouch } = useKeyboard()

    const { camera } = useThree()

    const {
        handleChestDrop,
        handleChestPickup,
        handlePlayerMove,
        handleChestClaim
    } = useGameHelpers()

    const [ref, api] = useSphere(() => ({
        // type: "Kinematic",
        mass: 1,
        args: [0.5],
        position: [0, -1, 0],
        onCollide: (e) => {

            const gameStatePlayer = useGameStore.getState().gameState?.players?.find(p => p.id === 'local')

            if (e?.body.userData.isEnemy) {

                console.log("Enemy collision")
                onEnemyCollisionRef.current?.()

                handleChestDrop()

            }

            if (e?.body.userData.isChest) {

                console.log("Chest collision", e.body.userData)

                console.log(
                    "gameStatePlayer",
                    gameStatePlayer
                )

                if (
                    (
                        gameStatePlayer.heldChests?.length
                        ||
                        0
                    ) == 0
                ) {
                    console.log("???")
                    handleChestPickup(
                        gameStatePlayer.id,
                        e.body.userData.index
                    )
                }

                // setHoldingChest(e.body.userData.index)

            }

        }
    }))

    const material = new THREE.MeshPhysicalMaterial({
        color: 'red',
        opacity: 0.5,
        transparent: true
    });

    const vel = useRef([0, 0, 0])
    useEffect(() => {
        api.velocity.subscribe((v) => vel.current = v)
    }, [api.velocity])

    const pos = useRef([0, 0, 0])
    const playerModelRef = useRef()
    const nicknameRef = useRef()
    const stunnedRef = useRef(false)
    const stunTimeoutRef = useRef(null)
    const onEnemyCollisionRef = useRef(null)
    const rollYOffsetRef = useRef(0)
    const rollYTargetRef = useRef(0)

    useEffect(() => {

        const gameStatePlayer = useGameStore.getState().gameState?.players?.find(p => p.id === 'local')

        if (gameStatePlayer?.position) {
            api.position.set(
                gameStatePlayer.position[0],
                gameStatePlayer.position[1],
                gameStatePlayer.position[2]
            )
        }

    }, [])
    
    useEffect(() => {

        const unsubscribe = api.position.subscribe((p) => {

            pos.current = p
            handlePlayerMove('local', p)

            // if (p[1] > 0) {
            //     console.log("Player has surfaced", holdingChest)
            // }

        })

        return () => unsubscribe();

    }, [api.position])

    useEffect(() => {

        const unsubscribe = api.position.subscribe((p) => {

            if (p[1] > 0) {
                console.log("Player has surfaced")

                const heldChestIndex = useGameStore.getState().gameState?.players?.find(p => p.id === 'local')?.heldChests?.[0]

                if (heldChestIndex !== undefined) {
                    // setHoldingChest(false)
                    // addScore()
                    handleChestClaim('local', heldChestIndex)
                }
            }

        })

        return () => unsubscribe();

    }, [api.position, holdingChest])

    useEffect(() => {
        console.log("Shift", isShifting)
        setShift(isShifting)
    }, [isShifting])

    const [action, setAction] = useState("Idle")
    useEffect(() => {

        if (stunnedRef.current) return;
        if (moveForward || moveRight || moveLeft) {
            setAction("Run");
        } else {
            setAction("Idle");
        }

    }, [moveForward, moveRight, moveLeft])

    useFrame((state, delta) => {

        // Make nickname follow player position, but keep upright
        if (nicknameRef.current) {
            // Place slightly above or below player (adjust y offset as needed)
            nicknameRef.current.position.set(
                pos.current[0],
                pos.current[1] + 0.75,
                pos.current[2]
            );
            // Keep upright: zero rotation
            nicknameRef.current.rotation.set(0, 0, 0);
        }

        // Lerp roll Y offset and update model position along player's local up axis
        rollYOffsetRef.current = THREE.MathUtils.lerp(rollYOffsetRef.current, rollYTargetRef.current, delta * 8);
        if (playerModelRef.current) {
            const rad = degToRad(rotationRef.current);
            playerModelRef.current.position.set(
                pos.current[0] + (-Math.sin(rad)) * rollYOffsetRef.current,
                pos.current[1] + Math.cos(rad) * rollYOffsetRef.current,
                pos.current[2]
            );
        }

        // Smooth rotation — independent of forward movement
        if (!stunnedRef.current) {
            if (moveLeft) {
                rotationRef.current = (rotationRef.current + ROTATION_SPEED) % 360;
                if (playerModelRef.current) {
                    playerModelRef.current.rotation.z = degToRad(rotationRef.current);
                }
            }
            if (moveRight) {
                rotationRef.current = ((rotationRef.current - ROTATION_SPEED) + 360) % 360;
                if (playerModelRef.current) {
                    playerModelRef.current.rotation.z = degToRad(rotationRef.current);
                }
            }
        }

        // addDistance(0.1)

        if (cameraMode == "Player") {

            if (pos.current[1] < -25.5) {
                camera.position.copy(new Vector3(0, -25.5, (pos.current[2] + 10)))
                camera.lookAt(new Vector3(0, -25.5, (pos.current[2] + 5)))
            } else {
                camera.position.copy(new Vector3(0, pos.current[1], (pos.current[2] + 10)))
                camera.lookAt(new Vector3(0, pos.current[1], (pos.current[2] + 5)))
            }

        }

        let posX = 0
        if (pos.current[0]) {
            posX = myToFixed(pos.current[0], 2)
        }

        // console.log(pos.current[1])
        let posY = 0
        if (pos.current[1]) {
            posY = myToFixed(pos.current[1], 2)
        }

        let posZ = 0
        if (pos.current[2]) {
            posZ = myToFixed(pos.current[2], 2)
        }

        // console.log(posX)

        let newLocation = new Vector3(posX, posY, posZ)

        if (JSON.stringify(lastLocation) !== JSON.stringify(newLocation)) {
            // console.log(newLocation, lastLocation)
            setPlayerLocation(newLocation)
            lastLocation = newLocation
        }
        // else {
        //     console.log("location unchanged")
        // }

        // if (pos.current[1] > maxHeight) {
        //     setMaxHeight(pos.current[1].toFixed(2))
        // }

        const currentStatus = useGameStore.getState().gameState?.status;

        if (currentStatus === "In Progress") {
            if (!stunnedRef.current && moveForward) {
                const direction = new Vector3();
                const moveSpeed = SPEED * (shift ? 2 : 0.5);
                const rad = degToRad(rotationRef.current);
                // Calculate the direction vector based on rotation
                direction.set(
                    Math.sin(rad), // X component
                    -Math.cos(rad), // Maintain current Y velocity
                    vel.current[2] // Z component (forward/backward movement)
                );
                // Normalize and scale the vector
                direction.normalize().multiplyScalar(moveSpeed);
                api.velocity.set(direction.x, direction.y, direction.z);
            } else {
                // Slowly sink with gravity (Y axis)
                api.velocity.set(0, -0.5, 0);
            }
        } else {
            // No movement or sinking if not in progress
            api.velocity.set(0, 0, 0);
        }

    })

    const playHitSound = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(150, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.3);
            gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.3);
        } catch (e) { }
    };

    onEnemyCollisionRef.current = () => {
        if (stunnedRef.current) return;
        setHoldingChest(false);
        setAction("Roll");
        stunnedRef.current = true;
        rollYTargetRef.current = -0.3;
        playHitSound();
        if (stunTimeoutRef.current) clearTimeout(stunTimeoutRef.current);
        stunTimeoutRef.current = setTimeout(() => {
            stunnedRef.current = false;
            rollYTargetRef.current = 0;
            setAction("Idle");
        }, 1000);
    };

    useEffect(() => {
        return () => {
            if (stunTimeoutRef.current) clearTimeout(stunTimeoutRef.current);
        };
    }, []);

    const rotationRef = useRef(rotation);
    useEffect(() => {
        rotationRef.current = rotation;
        if (playerModelRef.current) {
            playerModelRef.current.rotation.z = degToRad(rotation);
        }
    }, [rotation]);

    const players = useGameStore(state => state.gameState.players)
    const localPlayer = (
        server ?
            players?.find(p => p.id === socket.id)
            :
            players?.find(p => p.id === 'local')
    )

    return (
        <group>
            <Text
                ref={nicknameRef}
                color="black"
                position={[0, 0, 0]}
                scale={0.25}
                anchorX="center"
                anchorY="middle"
            >
                {nickname}
            </Text>
            <group ref={playerModelRef}>
                <SpacesuitModel
                    rotation={[degToRad(180), degToRad(180), 0]}
                    position={[0, 1, 0]}
                    action={action}
                />
                {(localPlayer?.heldChests?.length || 0) > 0 &&
                    <HeldChest
                        position={[0, -.2, 0.1]}
                        rotation={[0, degToRad(180), 0]}
                    />
                }
            </group>
            <mesh
                ref={ref}
                material={material}
            >
                {debug &&
                    <sphereGeometry
                        args={[0.5, 32, 32]}
                    />
                }
            </mesh>
        </group>
    )
}

export default PlayerBase