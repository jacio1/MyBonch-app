import { create } from "zustand";

export type ModalType = "task" | "note" | "previewNote" | null;

interface ModalState {
  activeModal: ModalType;
  modalProps: Record<string, any>;

  openModal: (type: ModalType, props?: any) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  activeModal: null,
  modalProps: {},

  openModal: (type, props = {}) =>
    set({ activeModal: type, modalProps: props }),

  closeModal: () => set({ activeModal: null, modalProps: {} }),
}));
