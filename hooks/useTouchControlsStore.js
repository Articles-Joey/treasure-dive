// import { create } from 'zustand'
import { persist } from "zustand/middleware";
import { createWithEqualityFn as create } from "zustand/traditional";

const EMPTY_CONTROLS = { jump: false, left: false, right: false, up: false, down: false };

const useTouchControlsStore = create()(
    persist(
        (set, get) => ({
            enabled: false,
            setEnabled: (newValue) => {
                set((prev) => ({
                    enabled: newValue,
                    ...(!newValue && { touchControls: { ...EMPTY_CONTROLS } }),
                }));
            },

            touchControls: {
                jump: false,
                left: false,
                right: false,
                up: false,
                down: false,
            },
            setTouchControls: (newValue) => {
                set((prev) => ({
                    touchControls: { ...prev.touchControls, ...newValue },
                }));
            },
            resetTouchControls: () => set({ touchControls: { ...EMPTY_CONTROLS } }),
        }),
        {
            name: "touch-controls-store",
            version: 1,
            partialize: (state) => ({
                enabled: state.enabled,
                // touchControls: state.touchControls
            }),
            // onRehydrateStorage: () => (state) => {
            //     state.setHasHydrated(true)
            // },
        },
    ),
);

export default useTouchControlsStore;
