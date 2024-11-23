import { create } from 'zustand';

interface TransparencyState {
  transparency: number;
  setTransparency: (value: number) => void;
}

export const useTransparencyStore = create<TransparencyState>((set) => ({
  transparency: 100,
  setTransparency: (value: number) => {
    const newValue = Math.max(1, Math.min(100, value));
    set({ transparency: newValue });
    window.electronAPI.send("set-transparency", newValue / 100);
  },
}));