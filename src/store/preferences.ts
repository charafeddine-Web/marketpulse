import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type PreferencesState = {
  darkMode: boolean
  favorites: number[]
  toggleTheme: () => void
  toggleFavorite: (id: number) => void
}

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      darkMode: false,
      favorites: [],
      toggleTheme: () => set((state) => ({ darkMode: !state.darkMode })),
      toggleFavorite: (id) => set((state) => ({
        favorites: state.favorites.includes(id)
          ? state.favorites.filter((favorite) => favorite !== id)
          : [...state.favorites, id],
      })),
    }),
    { name: 'marketpulse-preferences' },
  ),
)
