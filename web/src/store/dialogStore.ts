import React from "react";
import {create} from "zustand";

export const useDialogStore = create<{
    dialog: React.ReactNode,
    setDialog: (dialog: React.ReactNode) => void
}>((set) => ({
    dialog: null,
    setDialog: (dialog) => set({dialog})
}))