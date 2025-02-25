import { create } from "zustand";
import axios, { AxiosError } from "axios";
import getBackendUrl from "@/utils/get-backend-url";
import { IErrorResponse } from "@/types/backend-error-types";

const apiBase = await getBackendUrl();

interface Code {
  [key: string]: string;
}

interface InputField {
  value: string;
  type: string;
}

interface Schema {
  [key: string]: {
    input: {
      [key: string]: InputField;
    };
    output: {
      value: unknown;
      type: string;
    };
  };
}

interface ModuleDetailProps {
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
  code?: Code;
  schema?: Schema;
}

interface ModuleDetailStore {
  moduleDetail: ModuleDetailProps[];
  fetchModuleDetail: (moduleId: string) => Promise<{
    success:boolean,
    error?: string
  }>;
  loadingModuleDetail: boolean;
  setLoadingModuleDetail: (loading: boolean) => void;
}

export const useModuleDetailStore = create<ModuleDetailStore>((set) => ({
  moduleDetail: [],
  loadingModuleDetail: true,
  setLoadingModuleDetail: (loading) => set({ loadingModuleDetail: loading }),

  fetchModuleDetail: async (moduleId) => {
    set({ loadingModuleDetail: true });
    try {
      const response = await axios.get(`${apiBase}/api/module/${moduleId}`);
      set({ moduleDetail: [response.data], loadingModuleDetail: false });
      return { success: true };
    } catch (error) {
      const { response } = error as AxiosError<IErrorResponse>;
      set({ moduleDetail: [], loadingModuleDetail: false });
      return { success: false, error: response?.data.errorMessage ?? "Server is not connected" };
    }
  },
}));
