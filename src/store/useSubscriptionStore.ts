import { create } from "zustand";
import { persist } from "zustand/middleware";


const useSubscriptionStore = create(
    persist(
        (set, get) => ({
            status: 'free',
            expiresAt: null,
            
            activatePremium: (exiryDate: Date) => set({
                status: 'premium',
                expiresAt: exiryDate
            }),

            deactivatePremium: () => set({
                status: 'free',
                expiresAt: null
        }),

        canAddMoreTasks: (currentTaskCount) => {
            const {status} = get()
            if (status === 'premium') return true;
            return currentTaskCount < 15;
        },
        canUploadFileSize: (fileSizeMB) => {
            const {status} = get()
            return status === 'premium'  ? 50 : 10
        }
    }),
    {
        name: 'subscription-storage'
    }
    )
)