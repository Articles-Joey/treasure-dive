import { memo, useMemo } from "react";
import { Sky, Stars } from "@react-three/drei";
import { Object3D } from "three";
import { useStore } from "@/hooks/useStore";
import { BOARD_HEIGHT, BOARD_WIDTH } from "./board";

const NIGHT_SKY_COLOR = "#0c1626";

function SceneLighting() {
    const darkMode = useStore((state) => state.darkMode);
    const graphicsQuality = useStore((state) => state.graphicsQuality);
    const lowQuality = String(graphicsQuality).toLowerCase() === "low";
    const sunTarget = useMemo(() => {
        const target = new Object3D();
        target.position.set(0, -BOARD_HEIGHT / 2, -2);
        return target;
    }, []);

    return (
        <>
            {darkMode ? (
                <>
                    <color attach="background" args={[NIGHT_SKY_COLOR]} />
                    <Stars
                        radius={100}
                        depth={35}
                        count={1500}
                        factor={2}
                        saturation={0}
                        fade
                    />
                </>
            ) : (
                <Sky sunPosition={[0, 10, 0]} />
            )}

            <ambientLight intensity={darkMode ? 0.18 : 0.35} />
            <hemisphereLight
                args={[
                    darkMode ? "#6589b9" : "#c2f3ff",
                    "#6b6043",
                    darkMode ? 0.5 : 1.1,
                ]}
            />
            <directionalLight
                castShadow
                target={sunTarget}
                color={darkMode ? "#a4c7ff" : "#fff0d1"}
                intensity={darkMode ? 1.1 : 3}
                position={[-15, 20, 18]}
                shadow-mapSize={[
                    lowQuality ? 1024 : 2048,
                    lowQuality ? 1024 : 2048,
                ]}
                shadow-camera-left={-BOARD_WIDTH - 8}
                shadow-camera-right={BOARD_WIDTH + 8}
                shadow-camera-top={BOARD_HEIGHT + 8}
                shadow-camera-bottom={-BOARD_HEIGHT - 8}
                shadow-camera-near={1}
                shadow-camera-far={110}
                shadow-bias={-0.00015}
                shadow-normalBias={0.035}
                shadow-radius={3}
            />
            <primitive object={sunTarget} />
            <directionalLight
                position={[10, -10, 8]}
                color="#68cce5"
                intensity={darkMode ? 0.3 : 0.65}
            />
        </>
    );
}

export default memo(SceneLighting);
