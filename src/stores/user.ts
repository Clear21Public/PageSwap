import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface State {
  isModalOpen: boolean;
}

interface Actions {
  setIsModalOpen: (isOpen: boolean) => void;
}

export const useAddUserStore = create<State & Actions>()(
  immer((set) => ({
    isModalOpen: true,
    setIsModalOpen: (isModalOpen) =>
      set((state) => {
        state.isModalOpen = isModalOpen;
      }),
  }))
);
