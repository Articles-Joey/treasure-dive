import { useGameStore } from "@/hooks/useGameStore"

function DebugPanel() {

    const playerLocation = useGameStore(state => state.playerLocation)
    const score = useGameStore(state => state.score)
    const holdingChest = useGameStore(state => state.holdingChest)
    const rotation = useGameStore(state => state.rotation)

    return (
        <div className="card card-articles card-sm">

            <div className="card-body">

                <div>Debug Info</div>

                <div>
                    Rotation: {rotation}
                </div>

                <div>
                    Range: {playerLocation.x}
                    Depth: {playerLocation.y}
                </div>

                <div>
                    Score: {score}
                </div>

                <div>
                    Holding Chest: {holdingChest === false ? 'No' : `Yes - ${holdingChest}`}
                </div>

                {/* <div>
                        XYZ: {JSON.stringify(playerLocation)}
                    </div> */}

            </div>
        </div>
    )

}

export default DebugPanel