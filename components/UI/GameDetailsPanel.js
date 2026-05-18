import { useGameStore } from "@/hooks/useGameStore"
import ArticlesButton from "./Button"
import useGameHelpers from "@/hooks/useGameHelpers"

export default function GameDetailsPanel() {

    const status = useGameStore(state => state.gameState.status)
    const timer = useGameStore(state => state.gameState.timer)

    const {
        handleGameStart
    } = useGameHelpers()

    return (
        <div className="card card-articles card-sm">
            <div className="card-body">

                <div>Status: {status}</div>
                <div>Timer: {timer}</div>

                <ArticlesButton
                    size="sm"
                    className="w-100"
                    onClick={() => {

                        const gameState = useGameStore.getState().gameState
                        console.log(gameState)

                        handleGameStart()

                    }}
                >
                    Start Game
                </ArticlesButton>

                <Players />

            </div>
        </div >
    )

}

function Players() {

    const players = useGameStore(state => state.gameState.players)

    return (
        <div>

            <div>Players</div>

            {players?.length > 0 && players.map((player, index) => (
                <div key={index} className="player-entry border p-2">

                    {/* <div className="player-color" style={{ backgroundColor: player.color }}></div> */}

                    <div className="d-flex justify-content-between align-items-center mb-0">

                        <div
                            className=""
                            style={{ fontSize: "0.6rem" }}
                        >
                            ID: {player.id}
                        </div>

                        <div
                            className="d-flex"
                            style={{ fontSize: "0.6rem" }}
                        >
                            {player.heldChests?.length > 0 && <span className="me-1">Held Chests:</span>}
                            {player.heldChests?.map((chest, index) => (
                                <span key={index} className="badge bg-primary me-1">
                                    {chest}
                                </span>
                            ))}
                        </div>

                    </div>

                    <div className="player-name d-flex align-items-center">
                        <span
                            className={`badge ${player.ready ? 'bg-success' : 'bg-danger'} me-1`}
                            style={{
                                fontSize: "0.6rem"
                            }}
                        >
                            {player.ready ? "Ready" : "Not Ready"}
                        </span>
                        <span>{player.nickname || "?"} </span>
                        <span>- {player.score || 0}</span>
                    </div>

                    <div className="d-flex justify-content-between">

                        <div>
                            <span>X: {player.position?.[0]?.toFixed(2) || 0}</span>
                            <span> | </span>
                            <span>Y: {player.position?.[1]?.toFixed(2) || 0}</span>
                            <span> | </span>
                            <span>Z: {player.position?.[2]?.toFixed(2) || 0}</span>
                        </div>

                    </div>

                </div>
            ))}

        </div>
    )
}