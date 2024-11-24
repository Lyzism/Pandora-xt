import { create } from 'zustand';

interface TransparencyState {
  transparency: number;
  setTransparency: (value: number) => void;
  resetState: () => void; // Tambahkan fungsi reset
}

export const useTransparencyStore = create<TransparencyState>((set) => ({
  transparency: 100, // Default transparency
  setTransparency: (value: number) => {
    const newValue = Math.max(1, Math.min(100, value)); // Batas nilai antara 1 dan 100
    set({ transparency: newValue });
    window.electronAPI.send("set-transparency", newValue / 100); // Kirim nilai ke Electron
  },
  resetState: () => {
    set({ transparency: 100 }); // Reset ke nilai default
  },
}));
