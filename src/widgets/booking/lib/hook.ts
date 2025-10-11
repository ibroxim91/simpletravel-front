import { create } from 'zustand';

type Gender = 'male' | 'female';

type User = {
  userId: number;
  gender: Gender;
  firstName: string;
  lastName: string;
  birthDate: Date | null;
  phone: string;
  passport: File | null | string | { id: number; image: string };
};

type Store = {
  where: string;
  whereTo: string;
  dispatch: Date | null;
  returned: Date | null;
  user: User[];
  tours_category: {
    id: number;
    name: string;
  }[];
  transport: string | null;
  additional: string | null;
  excursions: number[];
  excursionsPrice: number | null;
  service:
    | {
        id: number;
        name: string;
      }[]
    | [];
  paidService: {
    id: number;
    price: number;
    name: string;
  }[];
  tariff: {
    name: string;
  };
  total_price: number | null;

  // actions
  setWhere: (value: string) => void;
  setWhereTo: (value: string) => void;
  setDispatch: (date: Date | null) => void;
  setReturned: (date: Date | null) => void;
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (index: number, user: Partial<User>) => void;
  removeUser: (index: number) => void;
  setToursCategory: (services: { id: number; name: string }[]) => void;
  setTransport: (id: string | null) => void;
  setTarif: (tariff: { name: string }) => void;
  setAdditional: (id: string | null) => void;
  setExcursions: (ids: number[]) => void;
  setExcursionsPrice: (price: number | null) => void;
  setPaidService: (
    paidService: {
      id: number;
      price: number;
      name: string;
    }[],
  ) => void;
  setServices: (services: { id: number; name: string }[]) => void;
  setTotalPrice: (total_price: number) => void;
  reset: () => void;
};

const initialState = {
  where: '',
  whereTo: '',
  dispatch: null,
  returned: null,
  user: [],
  tours_category: [] as { id: number; name: string }[],
  transport: null,
  additional: null,
  excursions: [] as number[],
  paidService: [] as { id: number; price: number; name: string }[],
  service: [] as { id: number; name: string }[],
  tariff: { name: '' },
  excursionsPrice: null,
  total_price: null,
};

const formStore = create<Store>((set) => ({
  ...initialState,

  setWhere: (value) => set({ where: value }),
  setTarif: (tariff) => set({ tariff }),
  setTotalPrice: (total_price) => set({ total_price }),
  setPaidService: (value) => set({ paidService: value }),
  setServices: (services) => set({ service: services }),
  setWhereTo: (value) => set({ whereTo: value }),
  setDispatch: (date) => set({ dispatch: date }),
  setExcursionsPrice: (price) => set({ excursionsPrice: price }),
  setReturned: (date) => set({ returned: date }),
  setUsers: (users) => set({ user: users }),
  addUser: (user) => set((state) => ({ user: [...state.user, user] })),
  updateUser: (index, updated) =>
    set((state) => ({
      user: state.user.map((u, i) => (i === index ? { ...u, ...updated } : u)),
    })),
  removeUser: (index) =>
    set((state) => ({
      user: state.user.filter((_, i) => i !== index),
    })),
  setToursCategory: (services) => set({ tours_category: services }),
  setTransport: (id) => set({ transport: id }),
  setAdditional: (id) => set({ additional: id }),
  setExcursions: (ids) => set({ excursions: ids }),
  reset: () => set(initialState),
}));

export default formStore;
