import { create } from 'zustand';

interface WelcomeState {
  openModal: boolean;
  setOpenModal: (openModal: boolean) => void;
  openModalMobile: boolean;
  setOpenModalMobile: (openModal: boolean) => void;
}

export const useWelcomeStore = create<WelcomeState>((set) => ({
  openModal: false,
  setOpenModal: (openModal) => set({ openModal }),
  openModalMobile: false,
  setOpenModalMobile: (openModalMobile) => set({ openModalMobile }),
}));
