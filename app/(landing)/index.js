"use client"
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';

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
        <Box
            sx={(theme) => ({
                position: 'relative',
                isolation: 'isolate',
                '& .landing-page': {
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                },
                '& .servers': { display: 'grid', gap: '5px', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
                '& .server': {
                    p: '0.5rem',
                    border: '1px solid rgba(0,0,0,0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                },
                '& .ad-wrap': {
                    mt: '1rem',
                    '@media (min-width: 992px)': {
                        mt: 0,
                        display: 'block',
                        position: 'absolute',
                        right: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                    },
                },
                '& .background-wrap': {
                    position: 'fixed',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: -1,
                    '& img': {
                        filter: theme.palette.mode === 'dark' ? 'blur(10px) brightness(0.5) !important' : 'blur(10px)',
                        objectPosition: '0% 50% !important',
                    },
                },
                '& .original-surfer-regular': {
                    fontFamily: '"Original Surfer", sans-serif',
                    fontWeight: 400,
                    fontStyle: 'normal',
                },
            })}
        >
            <PageTemplateLandingPage
                useSocketStore={useSocketStore}
                useStore={useStore}
                RotatingMascot={RotatingMascot}
                Link={Link}
                useRouter={useRouter}
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
                    attachServerType: "single-player",
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
        </Box>
    );
}
