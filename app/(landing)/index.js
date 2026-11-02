"use client";
import { useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { useSocketStore } from "@/hooks/useSocketStore";
import { useStore } from "@/hooks/useStore";
import { useGameStore } from "@/hooks/useGameStore";
import { resetScores } from "@/hooks/useScoreStore";
import { SinglePlayerScoreboard } from "@/components/UI/GameOverModal";
import ArticlesButton from "@/components/UI/Button";

import logo from "@/app/icon.png";

import PageTemplateLandingPage from "@articles-media/articles-dev-box/PageTemplateLandingPage";
import getAssetSource from "@articles-media/articles-dev-box/getAssetSource";
import LandingBackgroundAnimation from "@/components/Game/LandingBackgroundAnimation";
import { useAudioStore } from "@/hooks/useAudioStore";

const RotatingMascot = dynamic(() => import("@/components/UI/RotatingMascot"), {
    ssr: false,
});

export default function LobbyPage() {
    const darkMode = useStore((state) => state.darkMode);
    
    useEffect(() => {
        useGameStore.getState().resetSinglePlayerGame();
    }, []);

    return (
        <Box
            sx={(theme) => ({
                position: "relative",
                isolation: "isolate",
                "& .landing-page": {
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                },
                "& .servers": {
                    display: "grid",
                    gap: "5px",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                },
                "& .server": {
                    p: "0.5rem",
                    border: "1px solid rgba(0,0,0,0.25)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                },
                "& .ad-wrap": {
                    mt: "1rem",
                    "@media (min-width: 992px)": {
                        mt: 0,
                        display: "block",
                        position: "absolute",
                        right: "1rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                    },
                },
                "& .background-wrap": {
                    position: "fixed",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: -1,
                    "& img": {
                        filter:
                            theme.palette.mode === "dark"
                                ? "blur(10px) brightness(0.5) !important"
                                : "blur(10px)",
                        objectPosition: "0% 50% !important",
                    },
                },
                "& .original-surfer-regular": {
                    fontFamily: '"Original Surfer", sans-serif',
                    fontWeight: 400,
                    fontStyle: "normal",
                },
                "& .landing-hero img": {
                    marginBottom: "-25px",
                },
                "& .landing-hero h1": {
                    lineHeight: "1!important",
                    fontSize: "3rem!important",
                    color: "saddlebrown",
                    WebkitTextStroke: "0.5px gold",
                },
                "& #landing-page-container": {
                    flexDirection: "column",
                }
            })}
        >
            <PageTemplateLandingPage
                useSocketStore={useSocketStore}
                useStore={useStore}
                useAudioStore={useAudioStore}
                RotatingMascot={<RotatingMascot />}
                Link={Link}
                useRouter={useRouter}
                logoImage={logo.src}
                LandingBackgroundAnimation={<LandingBackgroundAnimation />}
                // CardBodyOverride={<>

                // </>}
                // disableHero
                // heroOverride={<>
                // </>}
                backgroundImage={
                    darkMode
                        ? getAssetSource("img/previews/start-dark.webp")
                        : getAssetSource("img/previews/start.webp")
                }
                singlePlayerConfig={{
                    attachServerType: "single-player",
                }}
                NicknameInputConfig={
                    {
                        // PreComponent: <></>,
                    }
                }
                multiplayerConfig={{
                    type: "WebSocket",
                    // comingSoon: true,
                    defaultServers: 2,
                    // privateServerSupport: false,
                    onlinePlayersTemplate: "2.0",
                }}
                gameScoreboardConfig={{
                    CardBodyOverride: <SinglePlayerScoreboard />,
                    disableRefreshButton: true,
                    disableJoinScoreboardSetting: true,
                    ScoreboardSettingsContent: () => (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 1,
                                p: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.75,
                                }}
                            >
                                <DeleteForeverIcon fontSize="small" />
                                <Box component="span">Reset Scores?</Box>
                            </Box>
                            <ArticlesButton
                                small
                                onClick={resetScores}
                            >
                                Reset
                            </ArticlesButton>
                        </Box>
                    ),
                }}
                brandingTextClass="original-surfer-regular"
                disableGameScoreboard={false}
                disableAd={process.env.NEXT_PUBLIC_ENABLE_ARTICLES !== "true"}
            />
        </Box>
    );
}
