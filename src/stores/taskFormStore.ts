import { create } from "zustand";
import { Assignment } from "../types";

interface TaskFormState {
  formData: Omit<Assignment, "id">;
  editingId: number | null;
  isSubmitting: boolean;
  setFormData: (data: Partial<Omit<Assignment, "id">>) => void;
  resetForm: () => void;
  setEditing: (id: number | null, data?: Omit<Assignment, "id">) => void;
  setIsSubmitting: (value: boolean) => void;
}

const initialFormData = {
  title: "",
  subject: "",
  deadline: "",
  completed: false,
  priority: "medium" as const,
};

export const useTaskFormStore = create<TaskFormState>((set) => ({
  formData: initialFormData,
  editingId: null,
  isSubmitting: false,

  setFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),

  resetForm: () =>
    set({ formData: initialFormData, editingId: null, isSubmitting: false }),

  setEditing: (id, data) =>
    set({ editingId: id, formData: data || initialFormData }),

  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
}));
