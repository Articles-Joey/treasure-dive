import { useFrame, useThree } from "@react-three/fiber";
import { useCompoundBody } from "@react-three/cannon";
import { useGLTF, useAnimations, Text } from "@react-three/drei";
import { memo, use, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import * as THREE from "three";
// import { useKeyboard } from "components/Games/Epcot/hooks/useKeyboard"

import { useControllerStore } from "@/hooks/useControllerStore";
import { useGameStore } from "@/hooks/useGameStore";

// import ClownfishModel from "./PlayerModels/Clownfish"
// import BoneFishModel from "./PlayerModels/BoneFish"
// import { useLocalStorageNew } from "@/hooks/useLocalStorageNew"

import { Model as SpacesuitModel } from "@/components/Models/Spacesuit";
import { degToRad } from "three/src/math/MathUtils.js";
import { HeldChest } from "@/components/Game/HeldChest";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useStore } from "@/hooks/useStore";
import useGameHelpers from "@/hooks/useGameHelpers";
import { useSearchParams } from "next/navigation";
import useTouchControlsStore from "@/hooks/useTouchControlsStore";
import { ModelNewPlayer } from "../Models/NewPlayer";
import ModelToonCharacter from "../Models/ModelToonCharacter";
import { BOARD_HEIGHT, PLAYER_CAMERA_DISTANCE, WATER_SURFACE_Y } from "./board";
import { useSocketStore } from "@/hooks/useSocketStore";
import { PLAYER_FOREGROUND_LAYER } from "./PlayerForeground";

const JUMP_FORCE = 6;
const SPEED = 4;
const ROTATION_SPEED = 2; // degrees per frame
const CAPSULE_RADIUS = 0.4;
const CAPSULE_LENGTH = 0.8;
const MAX_PLAYER_Y = 0.25;
const MIN_PLAYER_Y = -29.5;

function clampPlayerY(y) {
    return Math.max(MIN_PLAYER_Y, Math.min(y, MAX_PLAYER_Y));
}

let lastLocation;

function myToFixed(i, digits) {
    var pow = Math.pow(10, digits);

    return Math.floor(i * pow) / pow;
}

function PlayerBase(props) {
    const searchParams = useSearchParams();
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params;

    // const { setPlayerData, teleportPlayer, setTeleportPlayer } = props;

    const socket = useSocketStore((state) => state.socket);

    const nickname = useStore((state) => state.nickname);
    const toontownMode = useStore((state) => state.toontownMode);
    const cameraMode = useStore((state) => state.cameraMode);

    const {
        teleport,
        setTeleport,
        setPlayerLocation,
        maxHeight,
        setMaxHeight,
        shift,
        setShift,
        addDistance,
        rotation,
        setRotation,
        holdingChest,
        setHoldingChest,
        addScore,
        debug,
    } = useGameStore((state) => ({
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
        debug: state.debug,
    }));

    const status = useGameStore((state) => state.gameState.status);

    const { touchControls, setTouchControls } = useTouchControlsStore();

    const { controllerState, setControllerState } = useControllerStore();

    // const [character, setCharacter] = useLocalStorageNew("game:ocean-rings:character", {
    //     model: 'Clownfish',
    //     color: '#000000'
    // })

    // Attach event listeners when the component mounts
    useEffect(() => {
        if (controllerState.axes && Math.abs(controllerState?.axes[0]) > 0.3) {
            if (controllerState?.axes[0] > 0) {
                api.position.set(-1, MAX_PLAYER_Y, 0);
            } else {
                api.position.set(1, MAX_PLAYER_Y, 0);
            }
        }
    }, [controllerState]);

    useEffect(() => {
        if (teleport) {
            console.log("Teleport has been called!", teleport);
            api.position.set(
                teleport[0],
                clampPlayerY(teleport[1]),
                teleport[2],
            );
            setTeleport(false);
        }
    }, [teleport]);

    const {
        moveBackward,
        moveForward,
        moveRight,
        moveLeft,
        jump,
        shift: isShifting,
        crouch,
    } = useKeyboard();

    const { camera } = useThree();

    const {
        handleChestDrop,
        handleChestPickup,
        handlePlayerMove,
        handleChestClaim,
    } = useGameHelpers();

    const [ref, api] = useCompoundBody(() => ({
        // type: "Kinematic",
        mass: 1,
        fixedRotation: true,
        shapes: [
            {
                type: "Cylinder",
                args: [CAPSULE_RADIUS, CAPSULE_RADIUS, CAPSULE_LENGTH, 16],
            },
            {
                type: "Sphere",
                args: [CAPSULE_RADIUS],
                position: [0, CAPSULE_LENGTH / 2, 0],
            },
            {
                type: "Sphere",
                args: [CAPSULE_RADIUS],
                position: [0, -CAPSULE_LENGTH / 2, 0],
            },
        ],
        position: [0, -1, 0],
        onCollide: (e) => {
            const gameStatePlayer = useGameStore
                .getState()
                .gameState?.players?.find((p) => p.id === "local");

            if (e?.body.userData.isEnemy) {
                console.log("Enemy collision");
                if (onEnemyCollisionRef.current?.()) handleChestDrop();
            }

            if (e?.body.userData.isChest) {
                console.log("Chest collision", e.body.userData);

                console.log("gameStatePlayer", gameStatePlayer);

                if (
                    gameStatePlayer &&
                    (gameStatePlayer.heldChests?.length || 0) == 0
                ) {
                    console.log("???");
                    handleChestPickup(
                        gameStatePlayer.id,
                        e.body.userData.index,
                    );
                }

                // setHoldingChest(e.body.userData.index)
            }
        },
    }));

    const material = new THREE.MeshPhysicalMaterial({
        color: "red",
        opacity: 0.5,
        transparent: true,
    });

    const vel = useRef([0, 0, 0]);
    useEffect(() => {
        return api.velocity.subscribe((v) => (vel.current = v));
    }, [api.velocity]);

    const pos = useRef([0, 0, 0]);
    const playerModelRef = useRef();
    const nicknameRef = useRef();
    const stunnedRef = useRef(false);
    const stunTimeoutRef = useRef(null);
    const onEnemyCollisionRef = useRef(null);
    const rollYOffsetRef = useRef(0);
    const rollYTargetRef = useRef(0);

    useEffect(() => {
        const gameStatePlayer = useGameStore
            .getState()
            .gameState?.players?.find((p) => p.id === "local");

        if (gameStatePlayer?.position) {
            api.position.set(
                gameStatePlayer.position[0],
                clampPlayerY(gameStatePlayer.position[1]),
                gameStatePlayer.position[2],
            );
        }
    }, []);

    useEffect(() => {
        const unsubscribe = api.position.subscribe((p) => {
            const position = [p[0], clampPlayerY(p[1]), p[2]];
            if (p[1] > MAX_PLAYER_Y || p[1] < MIN_PLAYER_Y) {
                api.position.set(...position);
                const velocityY =
                    p[1] > MAX_PLAYER_Y
                        ? Math.min(vel.current[1], 0)
                        : Math.max(vel.current[1], 0);
                api.velocity.set(vel.current[0], velocityY, vel.current[2]);
            }
            pos.current = position;
            handlePlayerMove("local", position);

            // if (p[1] > 0) {
            //     console.log("Player has surfaced", holdingChest)
            // }
        });

        return () => unsubscribe();
    }, [api.position, api.velocity]);

    useEffect(() => {
        const unsubscribe = api.position.subscribe((p) => {
            const capsuleTop =
                p[1] +
                CAPSULE_RADIUS +
                (CAPSULE_LENGTH / 2) *
                    Math.abs(Math.cos(degToRad(rotationRef.current)));
            if (capsuleTop >= WATER_SURFACE_Y - 0.1) {
                console.log("Player has surfaced");

                const heldChestIndex = useGameStore
                    .getState()
                    .gameState?.players?.find((p) => p.id === "local")
                    ?.heldChests?.[0];

                if (heldChestIndex !== undefined) {
                    // setHoldingChest(false)
                    // addScore()
                    handleChestClaim("local", heldChestIndex);
                }
            }
        });

        return () => unsubscribe();
    }, [api.position, holdingChest]);

    useEffect(() => {
        console.log("Shift", isShifting);
        setShift(isShifting);
    }, [isShifting]);

    const [action, setAction] = useState("Idle");
    useEffect(() => {
        if (stunnedRef.current) return;
        if (moveForward || moveRight || moveLeft) {
            setAction("Run");
        } else {
            setAction("Idle");
        }
    }, [moveForward, moveRight, moveLeft]);

    useFrame((state, delta) => {
        const currentStatus = useGameStore.getState().gameState?.status;
        const gameOver = currentStatus === "Game Over";
        // Make nickname follow player position, but keep upright
        if (nicknameRef.current) {
            // Place slightly above or below player (adjust y offset as needed)
            nicknameRef.current.position.set(
                pos.current[0],
                pos.current[1] + 0.75,
                pos.current[2],
            );
            // Keep upright: zero rotation
            nicknameRef.current.rotation.set(0, 0, 0);
        }

        // Lerp roll Y offset and update model position along player's local up axis
        rollYOffsetRef.current = THREE.MathUtils.lerp(
            rollYOffsetRef.current,
            rollYTargetRef.current,
            delta * 8,
        );
        if (playerModelRef.current) {
            const rad = degToRad(rotationRef.current);
            playerModelRef.current.position.set(
                pos.current[0] + -Math.sin(rad) * rollYOffsetRef.current,
                pos.current[1] + Math.cos(rad) * rollYOffsetRef.current,
                pos.current[2],
            );
        }

        // Smooth rotation — independent of forward movement
        if (!stunnedRef.current || gameOver) {
            if (moveLeft) {
                rotationRef.current =
                    (rotationRef.current + ROTATION_SPEED) % 360;
                api.rotation.set(0, 0, degToRad(rotationRef.current));
                if (playerModelRef.current) {
                    playerModelRef.current.rotation.z = degToRad(
                        rotationRef.current,
                    );
                }
            }
            if (moveRight) {
                rotationRef.current =
                    (rotationRef.current - ROTATION_SPEED + 360) % 360;
                api.rotation.set(0, 0, degToRad(rotationRef.current));
                if (playerModelRef.current) {
                    playerModelRef.current.rotation.z = degToRad(
                        rotationRef.current,
                    );
                }
            }
        }

        if (rotationRef.current !== useGameStore.getState().rotation) {
            setRotation(rotationRef.current);
        }

        // addDistance(0.1)

        if (cameraMode == "Player") {
            const cameraFloor =
                -BOARD_HEIGHT + PLAYER_CAMERA_DISTANCE * 0.45 - 1;
            if (pos.current[1] < cameraFloor) {
                camera.position.copy(
                    new Vector3(
                        0,
                        cameraFloor,
                        pos.current[2] + PLAYER_CAMERA_DISTANCE,
                    ),
                );
                camera.lookAt(new Vector3(0, cameraFloor, pos.current[2] + 5));
            } else {
                camera.position.copy(
                    new Vector3(
                        0,
                        pos.current[1],
                        pos.current[2] + PLAYER_CAMERA_DISTANCE,
                    ),
                );
                camera.lookAt(
                    new Vector3(0, pos.current[1], pos.current[2] + 5),
                );
            }
        }

        let posX = 0;
        if (pos.current[0]) {
            posX = myToFixed(pos.current[0], 2);
        }

        // console.log(pos.current[1])
        let posY = 0;
        if (pos.current[1]) {
            posY = myToFixed(pos.current[1], 2);
        }

        let posZ = 0;
        if (pos.current[2]) {
            posZ = myToFixed(pos.current[2], 2);
        }

        // console.log(posX)

        let newLocation = new Vector3(posX, posY, posZ);

        if (JSON.stringify(lastLocation) !== JSON.stringify(newLocation)) {
            // console.log(newLocation, lastLocation)
            setPlayerLocation(newLocation);
            lastLocation = newLocation;
        }
        // else {
        //     console.log("location unchanged")
        // }

        // if (pos.current[1] > maxHeight) {
        //     setMaxHeight(pos.current[1].toFixed(2))
        // }

        if (currentStatus === "In Progress" || gameOver) {
            if ((!stunnedRef.current || gameOver) && moveForward) {
                const direction = new Vector3();
                const moveSpeed = SPEED * (shift ? 2 : 0.5);
                const rad = degToRad(rotationRef.current);
                // Calculate the direction vector based on rotation
                direction.set(
                    Math.sin(rad), // X component
                    -Math.cos(rad), // Maintain current Y velocity
                    vel.current[2], // Z component (forward/backward movement)
                );
                // Normalize and scale the vector
                direction.normalize().multiplyScalar(moveSpeed);
                if (pos.current[1] >= MAX_PLAYER_Y && direction.y > 0)
                    direction.y = 0;
                if (pos.current[1] <= MIN_PLAYER_Y && direction.y < 0)
                    direction.y = 0;
                api.velocity.set(direction.x, direction.y, direction.z);
            } else {
                // Passive sinking only applies during an active round.
                api.velocity.set(
                    0,
                    gameOver || pos.current[1] <= MIN_PLAYER_Y ? 0 : -0.5,
                    0,
                );
            }
        } else {
            // Keep the player still in the lobby.
            api.velocity.set(0, 0, 0);
        }
    });

    const playHitSound = () => {
        try {
            const ctx = new (
                window.AudioContext || window.webkitAudioContext
            )();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            oscillator.type = "sawtooth";
            oscillator.frequency.setValueAtTime(150, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(
                40,
                ctx.currentTime + 0.3,
            );
            gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
                0.001,
                ctx.currentTime + 0.3,
            );
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.3);
        } catch (e) {}
    };

    onEnemyCollisionRef.current = () => {
        if (
            stunnedRef.current ||
            useGameStore.getState().gameState.status !== "In Progress"
        )
            return false;
        useGameStore.getState().recordObstacleHit();
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
        return true;
    };

    useEffect(() => {
        return () => {
            if (stunTimeoutRef.current) clearTimeout(stunTimeoutRef.current);
        };
    }, []);

    const rotationRef = useRef(rotation);
    useEffect(() => {
        rotationRef.current = rotation;
        api.rotation.set(0, 0, degToRad(rotation));
        if (playerModelRef.current) {
            playerModelRef.current.rotation.z = degToRad(rotation);
        }
    }, [rotation, api.rotation]);

    const players = useGameStore((state) => state.gameState.players);
    const localPlayer = server
        ? players?.find((p) => p.id === socket?.id)
        : players?.find((p) => p.id === "local");

    useLayoutEffect(() => {
        const group = playerModelRef.current;
        group?.traverse((object) =>
            object.layers.enable(PLAYER_FOREGROUND_LAYER),
        );
        return () =>
            group?.traverse((object) =>
                object.layers.disable(PLAYER_FOREGROUND_LAYER),
            );
    }, [toontownMode, localPlayer?.heldChests?.length]);

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
                {/* <SpacesuitModel
                    rotation={[degToRad(180), degToRad(180), 0]}
                    position={[0, 1, 0]}
                    action={action}
                /> */}

                {toontownMode ? (
                    <ModelToonCharacter
                        scale={0.01 / 4}
                        position={[0, 0.6, 0.1]}
                        // Keep the toon in the board's XY plane, facing down at heading zero.
                        rotation={[0, Math.PI, Math.PI]}
                        isSwimming
                    />
                ) : (
                    <ModelNewPlayer
                        position={[0, 0.2, -0.8]}
                        rotation={[degToRad(90), 0, 0]}
                    />
                )}

                {(localPlayer?.heldChests?.length || 0) > 0 && (
                    <HeldChest
                        position={[0, -0.2, 0.1]}
                        rotation={[0, degToRad(180), 0]}
                    />
                )}
            </group>
            <mesh
                ref={ref}
                material={material}
            >
                {debug && (
                    <capsuleGeometry
                        args={[CAPSULE_RADIUS, CAPSULE_LENGTH, 8, 16]}
                    />
                )}
            </mesh>
        </group>
    );
}

export default PlayerBase;
