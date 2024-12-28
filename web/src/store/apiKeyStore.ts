import {create} from "zustand";

export const useApiKeyStore = create<{
    isValid: boolean;
    apiKey: string;
    setApiKey: (apiKey: string) => void;
    setValid: (isValid: boolean) => void;
}>((set) => ({
    isValid: true,
    apiKey: localStorage.getItem('apiKey') || '',
    setApiKey: (apiKey: string) => {
        localStorage.setItem('apiKey', apiKey)
        set({ apiKey })
    },
    setValid: (isValid: boolean) => set({ isValid })
}));