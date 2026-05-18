import { degToRad } from "three/src/math/MathUtils.js";

import { Chest } from "./Chest";

import { useGameStore } from "@/hooks/useGameStore";

export default function Chests() {

    const chests = useGameStore(state => state.gameState.chests)

    return (
        <group>

            {chests?.map((obj, obj_i) => {

                const players = useGameStore(state => state.gameState.players)

                const isChestHeldByPlayerLookup = players.find(player => {
                    return player.heldChests?.includes(obj_i)
                })

                if (isChestHeldByPlayerLookup) {
                    return null; // Skip rendering this chest since it's held by a player
                }

                return (
                    <Chest
                        key={obj_i}
                        position={obj.position}
                        obj_i={obj_i}
                        scale={2}
                        rotation={[0, degToRad(-180), 0]}
                    />
                )

            })}

        </group>
    )

}