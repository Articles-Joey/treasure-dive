"use client"
import Link from 'next/link'
import dynamic from 'next/dynamic'

import { useSocketStore } from '@/hooks/useSocketStore';
import { useStore } from '@/hooks/useStore';

import logo from '@/app/icon.png'

import PageTemplateLandingPage from '@articles-media/articles-dev-box/PageTemplateLandingPage';

const RotatingMascot = dynamic(() =>
    import('@/components/UI/RotatingMascot'),
    { ssr: false }
);

export default function LobbyPage() {

    return (
        <>
            <PageTemplateLandingPage
                useSocketStore={useSocketStore}
                useStore={useStore}
                RotatingMascot={RotatingMascot}
                Link={Link}
                logoImage={logo.src}
                // LandingBackgroundAnimation={
                //     <LandingBackgroundAnimation />
                // }
                // CardBodyOverride={<>

                // </>}
                // disableHero
                // heroOverride={<>
                // </>}
                backgroundImage={`${process.env.NEXT_PUBLIC_CDN}games/Treasure Dive/treasure-dive-thumbnail.png`}
                singlePlayerConfig={{

                }}
                NicknameInputConfig={{
                    // PreComponent: <></>,
                }}
                multiplayerConfig={{
                    type: "WebSocket",
                    // comingSoon: true,
                    defaultServers: 2,
                    // privateServerSupport: false,
                    onlinePlayersTemplate: "2.0",
                }}
                gameScoreboardConfig={{
                    append_score_text: "m",
                    metrics: [
                        {
                            label: 'Treasures Collected',
                            key: "score",
                            format: (value) => `${value} m`
                        },
                        {
                            label: 'Distance Swam',
                            key: "total_distance",
                            format: (value) => `${value} m`
                        }
                    ]
                }}
                brandingTextClass="original-surfer-regular"
                disableGameScoreboard={process.env.NEXT_PUBLIC_ENABLE_ARTICLES !== 'true'}
                disableAd={process.env.NEXT_PUBLIC_ENABLE_ARTICLES !== 'true'}
            />
        </>
    );
}