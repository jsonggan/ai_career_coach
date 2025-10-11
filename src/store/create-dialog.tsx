"use client";

import { create } from "zustand";

export interface CreateProjectParams {
  name: string;
  description: string;
  start: string;
  end: string;
}

interface CreateProjectDialogState {
  open: boolean;
  params?: CreateProjectParams;
  openDialog: (params?: CreateProjectParams) => void;
  closeDialog: () => void;
}

export const useCreateProjectDialogStore = create<CreateProjectDialogState>()(
  (set) => ({
    open: false,
    openDialog: (params?: CreateProjectParams) => set({ open: true, params }),
    closeDialog: () => set({ open: false }),
  }),
);
