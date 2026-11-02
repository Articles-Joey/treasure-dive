"use client";

import { useEffect, useRef } from "react";
import { useAudioStore } from "@/hooks/useAudioStore";
import { useGameStore } from "@/hooks/useGameStore";

export default function GameMusicHandler() {
    const musicRef = useRef(null);
    const status = useGameStore((state) => state.gameState.status);
    const enabled = useAudioStore((state) => state.audioSettings.enabled);
    const musicVolume = useAudioStore(
        (state) => state.audioSettings.music_volume,
    );
    const volume = Math.max(0, Math.min(1, Number(musicVolume) / 100)) || 0;
    const audible = enabled && volume > 0;

    useEffect(() => {
        const music = new Audio("/audio/Treasure%20Dive.mp3");
        music.loop = true;
        musicRef.current = music;
        return () => {
            music.pause();
            music.removeAttribute("src");
            music.load();
            musicRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (musicRef.current) musicRef.current.volume = volume;
    }, [volume]);

    useEffect(() => {
        const music = musicRef.current;
        if (!music) return;
        if (status !== "In Progress" || !audible) {
            music.pause();
            if (status !== "In Progress") music.currentTime = 0;
            return;
        }

        const play = () => {
            if (music.paused) {
                music.play().catch(() => {
                    // Retry on the next interaction if autoplay is blocked.
                });
            }
        };
        play();
        window.addEventListener("pointerdown", play);
        window.addEventListener("keydown", play);
        return () => {
            window.removeEventListener("pointerdown", play);
            window.removeEventListener("keydown", play);
            music.pause();
        };
    }, [status, audible]);

    return null;
}
