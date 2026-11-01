import { degToRad } from "three/src/math/MathUtils.js";

import { Chest } from "./Chest";

import { useGameStore } from "@/hooks/useGameStore";
import { shallow } from "zustand/shallow";
import { memo } from "react";

const MemoChest = memo(Chest);
const CHEST_ROTATION = [0, degToRad(180), 0];

export default function Chests() {
    const chests = useGameStore((state) => state.gameState.chests);
    const heldChestIds = useGameStore(
        (state) =>
            state.gameState.players?.flatMap(
                (player) => player.heldChests || [],
            ) || [],
        shallow,
    );

    return (
        <group>
            {chests?.map((obj, obj_i) => {
                if (heldChestIds.includes(obj_i)) {
                    return null; // Skip rendering this chest since it's held by a player
                }

                return (
                    <MemoChest
                        key={`${obj_i}:${obj.position.join(",")}`}
                        position={obj.position}
                        obj_i={obj_i}
                        scale={2}
                        rotation={CHEST_ROTATION}
                    />
                );
            })}
        </group>
    );
}
