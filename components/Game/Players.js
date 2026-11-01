import { Text } from "@react-three/drei";
import { useSearchParams } from "next/navigation";
import { useGameStore } from "@/hooks/useGameStore";
import { useSocketStore } from "@/hooks/useSocketStore";
import { useStore } from "@/hooks/useStore";
import { ModelNewPlayer } from "../Models/NewPlayer";
import ModelToonCharacter from "../Models/ModelToonCharacter";
import { HeldChest } from "./HeldChest";
import { memo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { shallow } from "zustand/shallow";

export default function Players() {
    const server = useSearchParams().get("server");
    const socketId = useSocketStore((state) => state.socket?.id);
    const playerIds = useGameStore(
        (state) =>
            server
                ? state.gameState.players
                      ?.filter((player) => player.id !== socketId)
                      .map((player) => player.id) || []
                : [],
        shallow,
    );
    return playerIds.map((id) => (
        <RemotePlayer
            key={id}
            id={id}
        />
    ));
}

const RemotePlayer = memo(function RemotePlayer({ id }) {
    const toontownMode = useStore((state) => state.toontownMode);
    const nickname = useGameStore(
        (state) =>
            state.gameState.players?.find((player) => player.id === id)
                ?.nickname,
    );
    const hasHeldChest = useGameStore((state) =>
        Boolean(
            state.gameState.players?.find((player) => player.id === id)
                ?.heldChests?.length,
        ),
    );
    const group = useRef();
    const model = useRef();
    useFrame(() => {
        const player = useGameStore
            .getState()
            .gameState.players?.find((player) => player.id === id);
        if (!player || !group.current || !model.current) return;
        group.current.position.set(...player.position);
        model.current.rotation.z = ((player.rotation || 0) * Math.PI) / 180;
    });
    return (
        <group ref={group}>
            <Text
                position={[0, 0.75, 0]}
                scale={0.25}
                color="black"
            >
                {nickname}
            </Text>
            <group ref={model}>
                {toontownMode ? (
                    <ModelToonCharacter
                        scale={0.01 / 4}
                        position={[0, 0.6, 0.1]}
                        rotation={[0, Math.PI, Math.PI]}
                        isSwimming
                    />
                ) : (
                    <ModelNewPlayer
                        position={[0, 0.2, -0.8]}
                        rotation={[Math.PI / 2, 0, 0]}
                    />
                )}
                {hasHeldChest && (
                    <HeldChest
                        position={[0, -0.2, 0.1]}
                        rotation={[0, Math.PI, 0]}
                    />
                )}
            </group>
        </group>
    );
});
