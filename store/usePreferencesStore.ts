import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreferencesState {
  region: string | null;
  setRegion: (region: string) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      region: null,
      setRegion: (region) => {
        set({ region });
        // Save to Cookie for Server Components to read
        if (typeof window !== 'undefined') {
          document.cookie = `region=${region}; path=/; max-age=31536000`; // 1 year expiry
        }
      },
    }),
    {
      name: 'movie-night-preferences',
    }
  )
);
