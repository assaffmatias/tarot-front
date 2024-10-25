import { create } from "zustand";

const defaultValues = { search: null, page: 1, tags: [] };

const useFilterStore = create((set) => ({
  home: { search: null, page: 1, tags: [] },
  setHomeFilter: (value) => set({ home: { ...defaultValues, ...value } }),
}));

export default useFilterStore;
