import { ModelQuaterniusFishingShark } from "@/components/Models/Shark";
import { ModelQuaterniusFishingGoldfish } from "@/components/Models/Goldfish";
import { degToRad } from "three/src/math/MathUtils.js";
import { useSphere } from "@react-three/cannon";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

export default function Obstacles() {
    return (
        <>

            {/* <ModelQuaterniusFishingShark
                scale={0.25}
                position={[-1, -3, 0]}
                rotation={[0, degToRad(90), 0]}
            />

            <ModelQuaterniusFishingGoldfish
                scale={0.25}
                position={[1, -4, 0]}
                rotation={[0, degToRad(-90), 0]}
            /> */}

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
    )
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
    )
}

function Obstacle({ position, rowDirection }) {

    const [ref, api] = useSphere(() => ({
        // mass: 0,
        // type: 'Dynamic',
        isTrigger: true,
        args: [0.5, 0.5, 0.5],
        position: position,
        rotation: [0, degToRad(-90), 0],
        userData: {
            isEnemy: true
        }
    }))

    const speed = 2; // Speed of movement
    const direction = useRef(rowDirection); // 1 for forward, -1 for backward
    const [currentX, setCurrentX] = useState(position[0]); // Starting X position

    useFrame(() => {

        let newX

        if (rowDirection > 0) {

            newX = currentX - direction.current * speed * 0.02; // Update position (scale time)

            setCurrentX(newX);

            if (newX <= -10) {
                api.position.set(10, position[1], position[2]);
                setCurrentX(10)
            }

        } else {

            newX = currentX - direction.current * speed * 0.02; // Update position (scale time)

            setCurrentX(newX);

            if (newX >= 10) {
                api.position.set(-10, position[1], position[2]);
                setCurrentX(-10)
            }

        }

        api.position.set(newX, position[1], position[2]); // Apply the new X position

    });

    return (
        <group ref={ref}>

            {/* <ModelQuaterniusFishingShark
                scale={0.25}
                position={[-1, -3, 0]}
                rotation={[0, degToRad(90), 0]}
            /> */}

            <ModelQuaterniusFishingGoldfish
                scale={0.25}
                // position={[1, -4, 0]}
                rotation={[
                    0,
                    rowDirection > 0 ? 0 : degToRad(180),
                    0
                ]}
            />

        </group>
    )
}