import { create } from 'zustand';

interface LoginPhoneState {
  phone: string | undefined;
  setPhone: (phone: string | undefined) => void;
  email: string | undefined;
  setEmail: (email: string | undefined) => void;
  token: string;
  setToken: (token: string) => void;
}

export const useLoginPhoneStore = create<LoginPhoneState>((set) => ({
  phone: undefined,
  token: '',
  email: undefined,
  setToken: (token) => set({ token }),
  setEmail: (email) => set({ email }),
  setPhone: (phone) => set({ phone }),
}));
