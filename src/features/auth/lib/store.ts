import { create } from 'zustand';

interface LoginPhoneState {
  phone: string;
  setPhone: (phone: string) => void;
  email: string;
  setEmail: (email: string) => void;
}

export const useLoginPhoneStore = create<LoginPhoneState>((set) => ({
  phone: '',
  email: '',
  setEmail: (email) => set({ email }),
  setPhone: (phone) => set({ phone }),
}));
