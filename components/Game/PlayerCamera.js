import { useFrame, useThree } from "@react-three/fiber";
import { useStore } from "@/hooks/useStore";
import { BOARD_HEIGHT, BOARD_WIDTH, WATER_SURFACE_Y } from "./board";

const EDGE_PADDING = 0.75; // How much of the rocks' nearest face to keep visible on screen.
const SEABED_MARGIN = 1;

export default function PlayerCamera({ positionRef, bounds }) {
    const camera = useThree((state) => state.camera);
    const size = useThree((state) => state.size);
    const cameraMode = useStore((state) => state.cameraMode);

    useFrame(() => {
        if (
            cameraMode !== "Player" ||
            !camera.isPerspectiveCamera ||
            size.width <= 0 ||
            size.height <= 0
        )
            return;

        const minX = bounds?.min[0] ?? -(BOARD_WIDTH / 2 + 2);
        const maxX = bounds?.max[0] ?? BOARD_WIDTH / 2 + 2;
        const frontZ = bounds?.max[2] ?? 1.5;
        const centerX = (minX + maxX) / 2;
        const aspect = size.width / size.height;
        const tanHalfFov = Math.tan((camera.getEffectiveFOV() * Math.PI) / 360);
        const playerZ = positionRef.current[2];

        // Fit the nearest face of the rocks' world bounds horizontally.
        // Effective FOV includes camera.zoom; canvas size includes resize/fullscreen changes.
        const cameraZ = Math.max(
            frontZ + ((maxX - minX) * EDGE_PADDING) / (2 * tanHalfFov * aspect),
            playerZ + camera.near + 1,
        );
        const halfViewHeight = (cameraZ - playerZ) * tanHalfFov;
        const boardHalfHeight = (BOARD_HEIGHT + WATER_SURFACE_Y) / 2;
        const cameraY =
            halfViewHeight >= boardHalfHeight + SEABED_MARGIN
                ? (WATER_SURFACE_Y - BOARD_HEIGHT) / 2
                : Math.max(
                      positionRef.current[1],
                      -BOARD_HEIGHT + halfViewHeight - SEABED_MARGIN,
                  );

        const requiredFar = cameraZ - (bounds?.min[2] ?? -5) + BOARD_HEIGHT * 2;
        if (requiredFar > camera.far) {
            camera.far = requiredFar;
            camera.updateProjectionMatrix();
        }
        camera.position.set(centerX, cameraY, cameraZ);
        camera.lookAt(centerX, cameraY, playerZ);
    });

    return null;
}
