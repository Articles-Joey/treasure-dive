import { memo } from "react";

import Link from "next/link";

// import ROUTES from '@/components/constants/routes';

import ArticlesButton from "@/components/UI/Button";

import { useSocketStore } from "@/hooks/useSocketStore";
import { useGameStore } from "@/hooks/useGameStore";
import { Dropdown, DropdownButton } from "react-bootstrap";

import GameMenuPrimaryButtonGroup from '@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup';
import { useStore } from "@/hooks/useStore";
import Minimap from "./Minimap";
import DebugPanel from "./DebugPanel";

function LeftPanelContent(props) {

    const reloadScene = useStore(state => state.reloadScene)

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    // const {
    //     setScore,
    //     debug,
    //     setDebug,
    //     cameraMode,
    //     setCameraMode,
    // } = useGameStore(state => ({
    //     rotation: state.rotation,
    //     setRotation: state.setRotation,
    //     playerLocation: state.playerLocation,
    //     holdingChest: state.holdingChest,
    //     score: state.score,
    //     setScore: state.setScore,
    //     debug: state.debug,
    //     setDebug: state.setDebug,
    //     cameraMode: state.cameraMode,
    //     setCameraMode: state.setCameraMode,
    // }));

    const debug = useStore(state => state.debug)
    const setDebug = useStore(state => state.setDebug)

    const setScore = useGameStore(state => state.setScore)
    const cameraMode = useGameStore(state => state.cameraMode)
    const setCameraMode = useGameStore(state => state.setCameraMode)

    return (
        <div className='w-100'>

            <div className="card card-articles card-sm">

                <div className="card-body d-flex flex-wrap">

                    <GameMenuPrimaryButtonGroup
                        useStore={useStore}
                        type="GameMenu"
                    />

                    <div className='w-100 p-1'></div>

                    <ArticlesButton
                        size="sm"
                        className="w-50"
                        onClick={() => {
                            reloadScene()
                            setScore(0)
                        }}
                    >
                        <i className="fad fa-redo"></i>
                        Reload Game
                    </ArticlesButton>

                    <div className='w-50'>
                        <DropdownButton
                            variant="articles w-100"
                            size='sm'
                            id="dropdown-basic-button"
                            className="dropdown-articles"
                            title={
                                <span>
                                    <i className="fad fa-bug"></i>
                                    <span>Debug </span>
                                    <span>{debug ? 'On' : 'Off'}</span>
                                </span>
                            }
                        >

                            <div style={{ maxHeight: '600px', overflowY: 'auto', width: '200px' }}>

                                {[
                                    false,
                                    true
                                ]
                                    .map(location =>
                                        <Dropdown.Item
                                            key={location}
                                            onClick={() => {
                                                setDebug(location)
                                                reloadScene()
                                            }}
                                            className="d-flex justify-content-between"
                                        >
                                            {location ? 'True' : 'False'}
                                        </Dropdown.Item>
                                    )}

                            </div>

                        </DropdownButton>
                    </div>

                    <ArticlesButton
                        size="sm"
                        className="w-50"
                        onClick={() => {

                        }}
                    >
                        <i className="fad fa-ufo"></i>
                        Teleport
                    </ArticlesButton>

                    <div className='w-50'>
                        <DropdownButton
                            variant="articles w-100"
                            size='sm'
                            id="dropdown-basic-button"
                            className="dropdown-articles"
                            title={
                                <span>
                                    <i className="fad fa-camera"></i>
                                    <span>Camera</span>
                                </span>
                            }
                        >

                            <div style={{ maxHeight: '600px', overflowY: 'auto', width: '200px' }}>

                                {[
                                    {
                                        name: 'Free',
                                    },
                                    {
                                        name: 'Player',
                                    }
                                ]
                                    .map(location =>
                                        <Dropdown.Item
                                            key={location.name}
                                            active={cameraMode == location.name}
                                            onClick={() => {
                                                setCameraMode(location.name)
                                                // setShowMenu(false)
                                            }}
                                            className="d-flex justify-content-between"
                                        >
                                            <i className="fad fa-camera"></i>
                                            {location.name}
                                        </Dropdown.Item>
                                    )}

                            </div>

                        </DropdownButton>
                    </div>

                </div>
            </div>

            {/* Minimap */}
            <Minimap />

            {/* Debug */}
            {debug && <DebugPanel />}

        </div>
    )

}

export default memo(LeftPanelContent)