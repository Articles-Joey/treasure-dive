"use client"
import { useEffect } from 'react';

import { useSearchParams } from 'next/navigation';

import dynamic from 'next/dynamic'

import useFullscreen from '@/hooks/useFullScreen';

import LeftPanelContent from '@/components/Game/LeftPanel';
import { useSocketStore } from '@/hooks/useSocketStore';

import GameMenu from '@articles-media/articles-dev-box/GameMenu';
import classNames from 'classnames';
import { useStore } from '@/hooks/useStore';

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

    useEffect(() => {

        if (server && socket.connected) {
            socket.emit('join-room', `game:cannon-room-${server}`, {
                game_id: server,
                nickname: JSON.parse(localStorage.getItem('game:nickname')),
                client_version: '1',

            });
        }

        // return function cleanup() {
        //     socket.emit('leave-room', 'game:glass-ceiling-landing')
        // };

    }, [server, socket.connected]);

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

            <div className='canvas-wrap'>

                <GameCanvas
                    key={sceneKey}
                />

            </div>

        </div>
    );
}