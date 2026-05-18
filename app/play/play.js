"use client"
import { useEffect } from 'react';

import { useSearchParams } from 'next/navigation';

import dynamic from 'next/dynamic'

import useFullscreen from '@/hooks/useFullScreen';

import LeftPanelContent from '@/components/UI/LeftPanel';
import { useSocketStore } from '@/hooks/useSocketStore';

import GameMenu from '@articles-media/articles-dev-box/GameMenu';
import classNames from 'classnames';
import { useStore } from '@/hooks/useStore';
import SinglePlayerHandler from '@/components/Handlers/SinglePlayerHandler';
import { useGameStore } from '@/hooks/useGameStore';
import GameOverModal from '@/components/UI/GameOverModal';

const GameCanvas = dynamic(() => import('@/components/Game/GameCanvas'), {
    ssr: false,
});

export default function GamePage() {

    const {
        socket
    } = useSocketStore(state => ({
        socket: state.socket
    }));

    // const router = useRouter()
    // const pathname = usePathname()
    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    const sceneKey = useStore(state => state.sceneKey)
    const menuOpen = useStore(state => state.menuOpen)
    const sidebar = useStore(state => state.sidebar)

    const showGameOverModal = useGameStore(state => state.showGameOverModal)

    return (

        <div
            className={classNames(
                `${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`,
                {
                    'menu-open': menuOpen,
                    'fullscreen': useFullscreen().isFullscreen,
                    'show-sidebar': sidebar,
                }
            )}
            id={`${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`}
        >

            {showGameOverModal &&
                <GameOverModal
                    show={showGameOverModal}
                    setShow={useGameStore.getState().setShowGameOverModal}
                />
            }

            <GameMenu
                useStore={useStore}
                LeftPanelContent={LeftPanelContent}
                menuBarConfig={{
                    style: "Corner Button",
                    menuBarButtonPosition: "Left"
                }}
                sidebarConfig={{
                    style: "Static Panel",
                }}
            />

            <SinglePlayerHandler />

            <div className='canvas-wrap'>

                <GameCanvas
                    key={sceneKey}
                />

            </div>

        </div>
    );
}