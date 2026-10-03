"use client";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useGameStore } from "@/hooks/useGameStore"

function DebugPanel() {

    const playerLocation = useGameStore(state => state.playerLocation)
    const score = useGameStore(state => state.score)
    const holdingChest = useGameStore(state => state.holdingChest)
    const rotation = useGameStore(state => state.rotation)

    return (
        <Card sx={{ bgcolor: 'game.card', backgroundImage: 'none', fontSize: '0.875rem', border: 1, borderColor: 'divider' }}>

            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>

                <Box>Debug Info</Box>

                <Box>
                    Rotation: {rotation}
                </Box>

                <Box>
                    Range: {playerLocation.x}
                    Depth: {playerLocation.y}
                </Box>

                <Box>
                    Score: {score}
                </Box>

                <Box>
                    Holding Chest: {holdingChest === false ? 'No' : `Yes - ${holdingChest}`}
                </Box>

                {/* <div>
                        XYZ: {JSON.stringify(playerLocation)}
                    </div> */}

            </CardContent>
        </Card>
    )

}

export default DebugPanel
