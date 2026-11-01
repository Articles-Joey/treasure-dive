import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, Vector2 } from "three";
import { useStore } from "@/hooks/useStore";
import { BOARD_HEIGHT, BOARD_WIDTH, WATER_SURFACE_Y } from "./board";

const waterVertex = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const waterFragment = `
    uniform float uTime;
    uniform float uDark;
    uniform float uFront;
    uniform vec2 uSize;
    varying vec2 vUv;
    void main() {
        vec2 p = vUv * uSize * 0.55;
        float t = uTime * 0.35;
        float waveA = sin(p.x * 1.7 + p.y * 2.1 + t + sin(p.y - t));
        float waveB = sin(p.x * 2.3 - p.y * 1.3 - t * 0.8 + cos(p.x + t));
        float caustic = pow(1.0 - abs(sin(waveA + waveB)), 14.0);
        float shaft = pow(max(0.0, sin(vUv.x * 37.0 + vUv.y * 5.0 + sin(t) * 0.6)), 12.0);
        vec3 deep = mix(vec3(0.015, 0.12, 0.21), vec3(0.008, 0.035, 0.085), uDark);
        vec3 shallow = mix(vec3(0.05, 0.55, 0.66), vec3(0.025, 0.19, 0.29), uDark);
        vec3 color = mix(deep, shallow, pow(vUv.y, 1.25));
        color += vec3(0.13, 0.31, 0.28) * shaft * pow(vUv.y, 1.7) * (1.0 - uDark * 0.65);
        color += vec3(0.08, 0.21, 0.19) * caustic * 0.23;
        float alpha = 1.0;
        if (uFront > 0.5) {
            color = vec3(0.19, 0.65, 0.73);
            alpha = 0.025 + caustic * 0.045 + shaft * 0.02;
        }
        gl_FragColor = vec4(color, alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
    }
`;

const surfaceVertex = `
    uniform float uTime;
    varying vec2 vUv;
    varying float vWave;
    void main() {
        vUv = uv;
        vec3 p = position;
        vWave = sin(p.x * 2.4 + uTime * 1.2) * 0.035
            + sin(p.y * 1.9 + p.x - uTime * 0.8) * 0.025;
        p.z += vWave;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    }
`;

const surfaceFragment = `
    uniform float uTime;
    uniform float uDark;
    varying vec2 vUv;
    varying float vWave;
    void main() {
        float ripple = pow(max(0.0, sin(vUv.x * 95.0 + sin(vUv.y * 35.0 + uTime) * 2.0 + uTime)), 18.0);
        float edge = smoothstep(0.91, 1.0, vUv.y);
        vec3 color = mix(vec3(0.04, 0.48, 0.61), vec3(0.025, 0.19, 0.31), uDark);
        color += vec3(0.45, 0.72, 0.73) * (ripple * 0.5 + edge * 0.55 + max(vWave, 0.0) * 3.0);
        gl_FragColor = vec4(color, 0.63 + edge * 0.25);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
    }
`;

export default function Water({
    width = BOARD_WIDTH,
    height = BOARD_HEIGHT,
    surfaceY = WATER_SURFACE_Y,
}) {
    const darkMode = useStore((state) => state.darkMode);
    const background = useRef();
    const foreground = useRef();
    const surface = useRef();
    const waterHeight = height + surfaceY;
    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uDark: { value: darkMode ? 1 : 0 },
            uSize: { value: new Vector2(width, waterHeight) },
        }),
        [width, waterHeight, darkMode],
    );
    const backgroundUniforms = useMemo(
        () => ({ ...uniforms, uFront: { value: 0 } }),
        [uniforms],
    );
    const foregroundUniforms = useMemo(
        () => ({ ...uniforms, uFront: { value: 1 } }),
        [uniforms],
    );

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();
        for (const material of [
            background.current,
            foreground.current,
            surface.current,
        ]) {
            if (material) material.uniforms.uTime.value = time;
        }
    });

    return (
        <group>
            {/* A deep backdrop and a faint front layer keep the diver readable. */}
            <mesh position={[0, surfaceY - waterHeight / 2, -5]}>
                <planeGeometry args={[width, waterHeight]} />
                <shaderMaterial
                    ref={background}
                    uniforms={backgroundUniforms}
                    vertexShader={waterVertex}
                    fragmentShader={waterFragment}
                    side={DoubleSide}
                />
            </mesh>
            {/* Close the sides so the following camera cannot see sky through the water. */}
            {[-1, 1].map((side) => (
                <mesh
                    key={side}
                    position={[
                        (side * width) / 2,
                        surfaceY - waterHeight / 2,
                        -1.5,
                    ]}
                    rotation={[0, (side * Math.PI) / 2, 0]}
                >
                    <planeGeometry args={[7, waterHeight]} />
                    <shaderMaterial
                        uniforms={backgroundUniforms}
                        vertexShader={waterVertex}
                        fragmentShader={waterFragment}
                        side={DoubleSide}
                    />
                </mesh>
            ))}
            <mesh
                position={[0, surfaceY - waterHeight / 2, 2]}
                renderOrder={2}
            >
                <planeGeometry args={[width, waterHeight]} />
                <shaderMaterial
                    ref={foreground}
                    uniforms={foregroundUniforms}
                    vertexShader={waterVertex}
                    fragmentShader={waterFragment}
                    transparent
                    depthWrite={false}
                    side={DoubleSide}
                />
            </mesh>
            <mesh
                position={[0, surfaceY, -1.5]}
                rotation={[-Math.PI / 2, 0, 0]}
                renderOrder={3}
            >
                <planeGeometry args={[width, 7, 96, 32]} />
                <shaderMaterial
                    ref={surface}
                    uniforms={uniforms}
                    vertexShader={surfaceVertex}
                    fragmentShader={surfaceFragment}
                    transparent
                    depthWrite={false}
                    side={DoubleSide}
                />
            </mesh>
        </group>
    );
}
