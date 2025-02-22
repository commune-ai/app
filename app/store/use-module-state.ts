import { create } from "zustand";
import { Client } from "@/utils/client";
type Params = Record<string, unknown> | FormData;
import getBackendUrl from "@/utils/get-backend-url";
const apiBase = await getBackendUrl();
import axios, { AxiosError } from "axios";
import { IErrorResponse } from "@/types/backend-error-types";

export type ModuleType = {
  description: string;
  name: string;
  key: string;
  url: string;
  app: string;
  desc: string;
  hash: string;
  network: string;
  code: string;
  tags: string[];
  comments: string[];
  owner: string;
  time: number;
};
const getRandomNetworkAndTags = () => {
  const networks = ["commune"];
  const tags = [
    "LLM",
    "image generator",
    "data science",
    "AI",
    "artificial intelligence",
    "chatbot",
    "neural network",
    "GAN",
    "NLP",
    "natural language processing",
    "computer vision",
    "blockchain",
    "web3",
    "decentralized",
    "crypto",
    "cryptocurrency",
    "solidity",
    "smart contract",
    "dapp",
    "decentralized finance",
    "defi",
    "web3",
    "web3.js",
  ];

  const randomNetwork = networks[Math.floor(Math.random() * networks.length)];
  const randomTags = Array.from(
    new Set(
      Array.from(
        { length: Math.floor(Math.random() * 6) + 1 },
        () => tags[Math.floor(Math.random() * tags.length)]
      )
    )
  );

  return { network: randomNetwork, tags: randomTags };
};

interface ModuleStore {
  isLoading: boolean;
  modules: ModuleType[];
  fetchModules: () => Promise<void>;
  createModules: (data: Params) => Promise<{ success: boolean, error?: string }>;
  addModuleInIpfs: (data: FormData) => Promise<{ success: boolean, error?: string }>;
  loadingModules: boolean;
  setLoadingModules: (loading: boolean) => void;
  assignRandomNetworkAndTags: () => void;
}

export const useModuleStore = create<ModuleStore>((set) => ({
  isLoading: false,
  modules: [],
  loadingModules: true,
  setLoadingModules: (loading) => set({ loadingModules: loading }),
  fetchModules: async () => {
    set({ loadingModules: true, isLoading: true });
    try {
      const client = new Client();
      const data = (await client.call("modules")) as { success: boolean; modules: ModuleType[] };
      if (data.success === false) {
        console.error("Failed to fetch modules:", data);
        set({ modules: [], loadingModules: false, isLoading: false });
        return;
      }
      set({ modules: Array.isArray(data) ? data : [], loadingModules: false });
      return;
    } catch (error) {
      console.error("Failed to fetch modules:", error);
      set({ modules: [], loadingModules: false });
    } finally {
      set({ isLoading: false });
    }
  },
  createModules: async (data) => {
    set({ isLoading: true });
    try {
      const client = new Client();
      const response = (await client.call("add_module", data)) as { success: boolean };
      if (response.success === false) {
        console.error("Failed to create module:", response);
        set({ isLoading: false });
        return { success: false, error: "Failed to create module" };
      }
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      console.error("Failed to create module:", error);
      set({ isLoading: false });
      return { success: false, error: "Failed to create module" };
    } finally {
      set({ isLoading: false });
    }
  },
  addModuleInIpfs: async (data) => {
    try {
      await axios.post(
        `${apiBase}/api/module/create`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true
        }
      );
      return { success: true };
    } catch (error) {
      const { response } = error as AxiosError<IErrorResponse>;
      set({
        isLoading: false,
      });
      return { success: false, error: response?.data.errorMessage ?? "Server is not connected" };
    }
  },
  assignRandomNetworkAndTags: () => {
    set((state) => ({
      modules: state.modules.map((module) => {
        const { network, tags } = getRandomNetworkAndTags();
        return { ...module, network, tags };
      }),
    }));
  },
}));
