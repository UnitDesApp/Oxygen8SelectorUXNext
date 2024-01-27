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

type UnitTypeInfo = {
  /* ----- Global States ----- */
  intProductTypeID: number | null;
  intUnitTypeID: number | null;
  setIntProductTypeID: (info: number) => void;
  setIntUnitTypeID: (info: number) => void;
};

export const useUnitTypeInfo = create<UnitTypeInfo>((set) => ({
  intProductTypeID: null,
  setIntProductTypeID: (info) => set({ intProductTypeID: info }),
  intUnitTypeID: null,
  setIntUnitTypeID: (info) => set({ intUnitTypeID: info }),
}));
