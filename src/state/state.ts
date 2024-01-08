import { create } from 'zustand';

type Store = {
  /* ----- Global States ----- */
  projectInitInfo: any;
  setProjectInitInfo: (info: any) => void;
};

export const useStore = create<Store>((set) => ({
  projectInitInfo: undefined,
  setProjectInitInfo: (info) => set({ projectInitInfo: info }),
}));
