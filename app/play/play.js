"use client";

import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import classNames from "classnames";
import useFullscreen from "@articles-media/articles-dev-box/useFullscreen";
import GameMenu from "@articles-media/articles-dev-box/GameMenu";
import LeftPanelContent from "@/components/UI/LeftPanel";
import { useStore } from "@/hooks/useStore";
import SinglePlayerHandler from "@/components/Handlers/SinglePlayerHandler";
import { useGameStore } from "@/hooks/useGameStore";
import GameOverModal from "@/components/UI/GameOverModal";

const GameCanvas = dynamic(() => import("@/components/Game/GameCanvas"), { ssr: false });

export default function GamePage() {
    const sceneKey = useStore((state) => state.sceneKey);
    const showMenu = useStore((state) => state.showMenu);
    const sidebar = useStore((state) => state.sidebar);
    const showGameOverModal = useGameStore((state) => state.showGameOverModal);
    const { isFullscreen } = useFullscreen();

    return (
        <Box
            className={classNames(`${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`, {
                "menu-open": showMenu,
                fullscreen: isFullscreen,
                "show-sidebar": sidebar,
            })}
            id={`${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`}
            sx={{ position: "relative", display: "flex" }}
        >
            {showGameOverModal && (
                <GameOverModal show={showGameOverModal} setShow={useGameStore.getState().setShowGameOverModal} />
            )}
            <GameMenu
                useStore={useStore}
                LeftPanelContent={LeftPanelContent}
                menuBarConfig={{ style: "Corner Button", menuBarButtonPosition: "Left" }}
                sidebarConfig={{ style: "Static Panel" }}
            />
            <SinglePlayerHandler />
            <Box
                className="canvas-wrap"
                sx={{
                    position: "relative",
                    width: "100vw",
                    height: "100vh",
                    "& canvas": { position: "absolute", width: "100%", height: "100%", left: 0, top: 0 },
                }}
            >
                <GameCanvas key={sceneKey} />
            </Box>
        </Box>
    );
}
