import { create } from 'zustand';

type Gender = 'male' | 'female';

type User = {
  gender: Gender;
  firstName: string;
  lastName: string;
  birthDate: Date | null;
  phone: string;
  passport: File | null;
};

type Store = {
  where: string;
  whereTo: string;
  dispatch: Date | null;
  returned: Date | null;
  user: User[];
  tours_category: number | null;
  transport: number | null;
  additional: number | null;
  excursions: number | null;

  // actions
  setWhere: (value: string) => void;
  setWhereTo: (value: string) => void;
  setDispatch: (date: Date | null) => void;
  setReturned: (date: Date | null) => void;
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (index: number, user: Partial<User>) => void;
  removeUser: (index: number) => void;
  setToursCategory: (id: number | null) => void;
  setTransport: (id: number | null) => void;
  setAdditional: (id: number | null) => void;
  setExcursions: (id: number | null) => void;
  reset: () => void;
};

const initialState = {
  where: '',
  whereTo: '',
  dispatch: null,
  returned: null,
  user: [],
  tours_category: null,
  transport: null,
  additional: null,
  excursions: null,
};

const formStore = create<Store>((set) => ({
  ...initialState,

  setWhere: (value) => set({ where: value }),
  setWhereTo: (value) => set({ whereTo: value }),
  setDispatch: (date) => set({ dispatch: date }),
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
  setToursCategory: (id) => set({ tours_category: id }),
  setTransport: (id) => set({ transport: id }),
  setAdditional: (id) => set({ additional: id }),
  setExcursions: (id) => set({ excursions: id }),
  reset: () => set(initialState),
}));

export default formStore;
