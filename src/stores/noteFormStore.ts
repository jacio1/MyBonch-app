import { create } from 'zustand';
import { Note, Attachment } from '@/src/types';

interface NoteFormState {
  formData: Omit<Note, 'id'>;
  editingId: number | null;
  isSubmitting: boolean;
  showPreview: boolean;
  attachments: Attachment[];
  
  setFormData: (data: Partial<Omit<Note, 'id'>>) => void;
  resetForm: () => void;
  setEditing: (id: number | null, data?: Omit<Note, 'id'>) => void;
  setIsSubmitting: (value: boolean) => void;
  togglePreview: () => void;
  setAttachments: (attachments: Attachment[]) => void;
  addAttachment: (attachment: Attachment) => void;
  removeAttachment: (id: string) => void;
}

const initialFormData = {
  title: '',
  subject: '',
  content: '',
  date: new Date().toISOString().split('T')[0],
};

export const useNoteFormStore = create<NoteFormState>((set) => ({
  formData: initialFormData,
  editingId: null,
  isSubmitting: false,
  showPreview: false,
  attachments: [],
  
  setFormData: (data) => 
    set((state) => ({ formData: { ...state.formData, ...data } })),
    
  resetForm: () => set({ 
    formData: initialFormData, 
    editingId: null, 
    isSubmitting: false,
    showPreview: false,
    attachments: [],
  }),
  
  setEditing: (id, data) => set({ 
    editingId: id, 
    formData: data || initialFormData,
    showPreview: false,
  }),
  
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  
  togglePreview: () => set((state) => ({ showPreview: !state.showPreview })),
  
  setAttachments: (attachments) => set({ attachments }),
  
  addAttachment: (attachment) => 
    set((state) => ({ attachments: [...state.attachments, attachment] })),
    
  removeAttachment: (id) => 
    set((state) => ({ 
      attachments: state.attachments.filter(a => a.id !== id) 
    })),
}));