import { create } from 'zustand';
import { Client } from '@/utils/client';

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
  const networks = ['commune', 'bittensor', 'torus'];
  const tags = [
    'LLM',
    'image generator',
    'data science',
    'AI',
    'artificial intelligence',
    'chatbot',
    'neural network',
  ];

  const randomNetwork = networks[Math.floor(Math.random() * networks.length)];
  const randomTags = Array.from(
    new Set(
      Array.from(
        { length: Math.floor(Math.random() * 4) + 1 },
        () => tags[Math.floor(Math.random() * tags.length)]
      )
    )
  );

  return { network: randomNetwork, tags: randomTags };
};

interface ModuleStore {
  modules: ModuleType[];
  fetchModules: () => Promise<void>;
  loadingModules: boolean;
  setLoadingModules: (loading: boolean) => void;
  assignRandomNetworkAndTags: () => void;
}

export const useModuleStore = create<ModuleStore>((set) => ({
  modules: [],
  loadingModules: true,
  setLoadingModules: (loading) => set({ loadingModules: loading }),
  fetchModules: async () => {
    set({ loadingModules: true });
    try {
      const client = new Client();
      const data = await client.call('modules');
      set({ modules: Array.isArray(data) ? data : [], loadingModules: false });
    } catch (error) {
      console.error('Failed to fetch modules:', error);
      set({ modules: [], loadingModules: false });
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
