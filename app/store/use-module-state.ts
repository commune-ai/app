import { create } from "zustand";
import axios, { AxiosError } from "axios";
import getBackendUrl from "@/utils/get-backend-url";
import { IErrorResponse } from "@/types/backend-error-types";

const apiBase = await getBackendUrl();

export type ModuleType = {
  id: string;
  module_image_url: string;
  name: string;
  description: string;
  network: string;
  tags: string[];
  key: string;
  founder: string;
  codelocation: string;
  appurl: string;
  ipfs_cid: string;
  deregistered: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

interface ModuleStore {
  isLoading: boolean;
  modules: ModuleType[];
  networks: string[];
  tags: string[];
  fetchModules: () => Promise<void>;
  addModuleInIpfs: (data: FormData) => Promise<{ success: boolean; error?: string }>;
  loadingModules: boolean;
  setLoadingModules: (loading: boolean) => void;
}

export const useModuleStore = create<ModuleStore>((set) => ({
  isLoading: false,
  modules: [],
  networks: [],
  tags: [],
  loadingModules: true,
  setLoadingModules: (loading) => set({ loadingModules: loading }),

  fetchModules: async () => {
    set({ loadingModules: true, isLoading: true });
    try {
      const response = await axios.get(`${apiBase}/api/module/`);
      set({
        modules: response.data.modules,
        networks: response.data.networks,
        tags: response.data.tags,
        loadingModules: false
      });
    } catch {
      set({ modules: [], networks: [], tags: [], loadingModules: false });
    } finally {
      set({ isLoading: false });
    }
  },

  addModuleInIpfs: async (data) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${apiBase}/api/module/create`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      set((state) => ({
        modules: [...state.modules, response.data.module],
        networks: response.data.networks,
        tags: response.data.tags,
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      const { response } = error as AxiosError<IErrorResponse>;
      set({ isLoading: false });
      return { success: false, error: response?.data.errorMessage ?? "Server is not connected" };
    }
  },
}));
