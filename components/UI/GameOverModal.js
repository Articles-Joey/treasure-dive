"use client";

import Box from "@mui/material/Box";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ArticlesModal from "./ArticlesModal";
import ArticlesButton from "./Button";

export default function GameOverModal({ show, setShow }) {
    const server = useSearchParams().get("server");

    return (
        <ArticlesModal
            show={show}
            setShow={setShow}
            title="Game Over"
            contentSx={{ p: 0 }}
            footerOverride={
                <>
                    <ArticlesButton component={Link} href="/" variant="outline-dark" onClick={() => setShow(false)}>
                        Close
                    </ArticlesButton>
                    <ArticlesButton variant="outline-dark" onClick={() => setShow(false)}>
                        Play Again
                    </ArticlesButton>
                </>
            }
        >
            <Box sx={{ display: "flex", flexDirection: "column", p: '1rem' }}>
                {server ? (
                    <>
                        <Box sx={{ mb: "1rem" }}>
                            The winner was <b>{show?.winner?.nickname || "Unknown"}</b> with a distance of <b>{show?.winner?.distance?.toFixed(2) || 0}</b> meters!
                        </Box>
                        <Box sx={{ mb: "0.5rem" }}>Here is how everyone else did:</Box>
                        {show?.rankings?.map((player, index) => (
                            <Box key={player.id ?? index}>
                                <b>{player.nickname || "Unknown"}</b>: {player.distance?.toFixed(2) || 0} meters
                            </Box>
                        ))}
                    </>
                ) : (
                    <Box sx={{ mb: "1rem" }}>You had a score of <b>{show?.winner?.score || 0}</b> points!</Box>
                )}
                {server && (
                    <Box>
                        You have been awarded 10 coins for playing! Coins are usable on our other game AMCOT. Use coins to buy in game gear and cosmetics to show off in AMCOT! <a href="https://amcot.articles.media" target="_blank" rel="noopener noreferrer">Play AMCOT here!</a>
                    </Box>
                )}
            </Box>
        </ArticlesModal>
    );
}
