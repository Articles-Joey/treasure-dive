import { ModelGoldfish } from "@/public/models/Fishing/transformed/Goldfish";
import { ModelPuffer } from "@/public/models/Fishing/transformed/Puffer";
import { ModelPiranha } from "@/public/models/Fishing/transformed/Piranha";
import { ModelShark } from "@/public/models/Fishing/transformed/Shark";
import { ModelZebraClownFish } from "@/public/models/Fishing/transformed/ZebraClownFish";
import { ModelAnglerfish } from "@/public/models/Fishing/transformed/Anglerfish";
import { degToRad } from "three/src/math/MathUtils.js";
import { useSphere } from "@react-three/cannon";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "@/hooks/useGameStore";

const FISH_MODELS = [
    ModelGoldfish,
    ModelPuffer,
    ModelPiranha,
    ModelShark,
    ModelZebraClownFish,
    ModelAnglerfish,
];

export default function Obstacles() {
    return (
        <>
            <ObstacleRow
                positionY={-4}
                direction={1}
            />

            <ObstacleRow
                positionY={-8}
                direction={-1}
            />

            <ObstacleRow
                positionY={-16}
                direction={1}
            />

            <ObstacleRow
                positionY={-20}
                direction={-1}
            />

            {/* <Obstacle
                position={[1, -4, 0]}
            /> */}
        </>
    );
}

function ObstacleRow({ positionY, direction }) {
    return (
        <group>
            <Obstacle
                position={[-5, positionY, 0]}
                rowDirection={direction}
            />

            <Obstacle
                position={[0, positionY, 0]}
                rowDirection={direction}
            />

            <Obstacle
                position={[5, positionY, 0]}
                rowDirection={direction}
            />

            <Obstacle
                position={[10, positionY, 0]}
                rowDirection={direction}
            />
        </group>
    );
}

function Obstacle({ position, rowDirection }) {
    const [FishModel] = useState(
        () => FISH_MODELS[Math.floor(Math.random() * FISH_MODELS.length)],
    );
    const gameOver = useGameStore(
        (state) => state.gameState.status === "Game Over",
    );
    const [ref, api] = useSphere(() => ({
        // mass: 0,
        // type: 'Dynamic',
        isTrigger: true,
        args: [0.5, 0.5, 0.5],
        position: position,
        rotation: [0, degToRad(-90), 0],
        userData: {
            isEnemy: true,
        },
    }));

    const speed = 2; // Speed of movement
    const currentX = useRef(position[0]);

    useFrame(() => {
        if (useGameStore.getState().gameState.status === "Game Over") return;
        currentX.current -= rowDirection * speed * 0.02;
        if (rowDirection > 0 && currentX.current <= -10) currentX.current = 10;
        if (rowDirection < 0 && currentX.current >= 10) currentX.current = -10;

        api.position.set(currentX.current, position[1], position[2]);
    });

    return (
        <group ref={ref}>
            <FishModel
                paused={gameOver}
                scale={0.25}
                // position={[1, -4, 0]}
                rotation={[0, rowDirection > 0 ? 0 : degToRad(180), 0]}
            />
        </group>
    );
}
