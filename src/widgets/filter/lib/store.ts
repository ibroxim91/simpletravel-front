import { create } from 'zustand';

interface FilterToursStore {
  where: string;
  setStoreWhere: (where: string) => void;

  from: string;
  setStoreFrom: (from: string) => void;

  date: Date | undefined;
  setStoreDate: (date: Date | undefined) => void;

  toDate: Date | undefined;
  setStoreToDate: (date: Date | undefined) => void;

  selectData: string;
  setStoreSelectData: (date: string) => void;

  passenger: number;
  setStorePassenger: (passenger: number) => void;

  adults: number;
  setAdults: (adults: number) => void;

  children: number;
  setChildren: (children: number) => void;
}

export const useFilterToursStore = create<FilterToursStore>((set) => ({
  date: undefined,
  adults: 0,
  children: 0,
  toDate: undefined,
  from: '',
  passenger: 0,
  selectData: '',
  where: '',
  setStoreDate: (date: Date | undefined) => set({ date: date }),
  setAdults: (adults: number) => set({ adults }),
  setChildren: (children: number) => set({ children }),
  setStoreToDate: (toDate: Date | undefined) => set({ toDate: toDate }),
  setStoreFrom: (from) => set({ from }),
  setStoreSelectData: (selectData) => set({ selectData }),
  setStoreWhere: (where) => set({ where }),
  setStorePassenger: (passenger) => set({ passenger }),
}));
