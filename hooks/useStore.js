// import { create } from 'zustand'
import { createWithEqualityFn as create } from 'zustand/traditional'
import { persist, createJSONStorage } from 'zustand/middleware'

import typicalZustandStoreExcludes from '@articles-media/articles-dev-box/typicalZustandStoreExcludes';
import typicalZustandStoreStateSlice from '@articles-media/articles-dev-box/typicalZustandStoreStateSlice';

import generateRandomNickname from '@/util/generateRandomNickname';

export const useStore = create()(
  persist(
    (set, get) => ({

      ...typicalZustandStoreStateSlice(set, get, generateRandomNickname),

    }),
    {
      name: `${process.env.NEXT_PUBLIC_GAME_KEY}-store`,
      version: 2,
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true)
      },
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => ![
            ...typicalZustandStoreExcludes,
          ].includes(key))
        ),
    },
  ),
)