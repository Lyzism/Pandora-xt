import { create } from 'zustand';

interface TransparencyState {
  transparency: number;
  setTransparency: (value: number, isFromUI?: boolean) => void;
  resetState: () => void;
}

export const useTransparencyStore = create<TransparencyState>((set) => ({
  transparency: 100,
  setTransparency: (value: number, isFromUI = true) => {
    const roundedValue = Math.round(Math.max(1, Math.min(100, value)));
    set({ transparency: roundedValue });

    if (isFromUI) {
      window.electronAPI.send("set-transparency", roundedValue / 100);
    }
  },
  resetState: () => {
    set({ transparency: 100 });
  },
}));
