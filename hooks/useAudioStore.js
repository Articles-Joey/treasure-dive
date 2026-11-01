import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialStore = {
    enabled: true,
    game_volume: 50,
    music_volume: 50,
};

export const useAudioStore = create()(
    persist(
        (set, get) => ({
            _hasHydrated: false,
            setHasHydrated: (state) => {
                set({
                    _hasHydrated: state,
                });
            },

            audioSettings: initialStore,
            setAudioSettings: (newValue) => set({ audioSettings: newValue }),

            resetAudioSettings: () => set({ audioSettings: initialStore }),

            toggleAudio: () => {
                set((state) => ({
                    audioSettings: {
                        ...state.audioSettings,
                        enabled: !state.audioSettings.enabled,
                    },
                }));
            },
        }),
        {
            name: "audio-store", // name of the item in the storage (must be unique)
            version: 2,
            onRehydrateStorage: () => (state) => {
                state.setHasHydrated(true);
            },
            partialize: (state) => ({
                audioSettings: state.audioSettings,
            }),
        },
    ),
);
