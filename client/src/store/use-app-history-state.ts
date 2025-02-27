import { create } from "zustand";
import axios, { AxiosError } from "axios";
import getBackendUrl from "@/utils/get-backend-url";
import { IErrorResponse } from "@/types/backend-error-types";

const apiBase = await getBackendUrl();

interface AppHistory {
  id: string;
  moduleworking: boolean;
  description: string;
  evidenceImage_url: string;
  ipfs_cid: string;
  moduleId: string;
  userId: string;
  checkedByDOA: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AppHistoryStore {
  appHistory: AppHistory[];
  fetchAppHistory: (moduleId: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  loadingAppHistory: boolean;
  setLoadingAppHistory: (loading: boolean) => void;
}

export const useAppHistoryStore = create<AppHistoryStore>((set) => ({
  appHistory: [],
  loadingAppHistory: true,
  setLoadingAppHistory: (loading) => set({ loadingAppHistory: loading }),

  fetchAppHistory: async (moduleId) => {
    set({ loadingAppHistory: true });
    try {
      const response = await axios.get(`${apiBase}/api/app-history/${moduleId}`);
      set({ appHistory: response.data, loadingAppHistory: false });
      return { success: true };
    } catch (error) {
      const { response } = error as AxiosError<IErrorResponse>;
      set({ appHistory: [], loadingAppHistory: false });
      return { success: false, error: response?.data.errorMessage ?? "Server is not connected" };
    }
  },
}));
