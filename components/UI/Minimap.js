import { useGameStore } from "@/hooks/useGameStore"

function Minimap() {

    const playerLocation = useGameStore(state => state.playerLocation)
    const chests = useGameStore(state => state.gameState.chests)

    // Range: x (-6.5 to 6.5), y (0 to -29.5)
    // Map to percentage: 
    // left = ((x + 6.5) / 13) * 100
    // top = (Map area is bottom 90% of image. y=0 is top of map area, y=-29.5 is bottom)
    // top = 10% (buffer) + ((y / -29.5) * 90%)
    const left = playerLocation ? ((playerLocation.x + 6.5) / 13) * 100 : 0;
    const top = playerLocation ? 10 + (playerLocation.y / -29.5) * 90 : 10;

    // Helper to convert chest position array to minimap coordinates
    function getChestCoords(posArr) {
        if (!Array.isArray(posArr) || posArr.length < 2) return { left: 0, top: 0 };
        const [x, y] = posArr;
        return {
            left: ((x + 6.5) / 13) * 100,
            top: 10 + (y / -29.5) * 90
        };
    }

    return (
        <div className="card card-articles card-sm">
            <div className="mx-auto" style={{ position: 'relative', width: '200px' }}>
                <img
                    src={`${process.env.NEXT_PUBLIC_CDN}games/Treasure Dive/treasure-dive-toontown-map.jpg`}
                    alt=""
                    className="img-fluid mx-auto"
                    width={200}
                />
                {/* Player marker */}
                <div
                    style={{
                        position: 'absolute',
                        left: `${left}%`,
                        top: `${top}%`,
                        width: '10px',
                        height: '10px',
                        backgroundColor: 'red',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        border: '2px solid white',
                        boxShadow: '0 0 5px rgba(0,0,0,0.5)',
                        pointerEvents: 'none'
                    }}
                />
                {/* Chest markers */}
                {Array.isArray(chests) && chests.map((chest, idx) => {
                    if (!chest || !Array.isArray(chest.position)) return null;
                    const coords = getChestCoords(chest.position);
                    return (
                        <div
                            key={idx}
                            style={{
                                position: 'absolute',
                                left: `${coords.left}%`,
                                top: `${coords.top}%`,
                                width: '10px',
                                height: '10px',
                                backgroundColor: 'gold',
                                borderRadius: '50%',
                                transform: 'translate(-50%, -50%)',
                                border: '2px solid #bfa100',
                                boxShadow: '0 0 5px rgba(0,0,0,0.5)',
                                pointerEvents: 'none',
                                zIndex: 2
                            }}
                        />
                    );
                })}
            </div>
        </div>
    )

}

export default Minimap