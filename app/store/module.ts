import { create } from 'zustand';
import { Client } from '@/client/client';


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
  description?: string;
  code: Code;
  schema: Schema;
  name: string;
  key: string;
  founder: string;
  hash: string;
  time: number;
}

interface ModuleDetailStore {
  moduleDetail: ModuleDetailProps[];
  fetchModuleDetail: (odule_name: string) => Promise<void>;
  loadingModuleDetail: boolean;
  setLoadingModuleDetail: (loading: boolean) => void;
}

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
  const networks = ['commune'];
  const tags = [
    'LLM',
    'image generator',
    'data science',
    'AI',
    'artificial intelligence',
    'chatbot',
    'neural network',
    'GAN',
    'NLP',
    'natural language processing',
    'computer vision',
    'blockchain',
    'web3',
    'decentralized',
    'crypto',
    'cryptocurrency',
    'solidity',
    'smart contract',
    'dapp',
    'decentralized finance',
    'defi',
    'web3',
    'web3.js',
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data:any = await client.call('modules');
      if (data.success === false) {
        // console.error('Failed to fetch modules:', data);
        set({ modules: [], loadingModules: false });
        return;
      }
      set({ modules: Array.isArray(data) ? data : [], loadingModules: false });
      return;
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


export const useModuleDetailStore = create<ModuleDetailStore>((set) => ({
  moduleDetail: [],
  loadingModuleDetail: true,
  setLoadingModuleDetail: (loading) => set({ loadingModuleDetail: loading }),
  fetchModuleDetail: async (module_name) => {
    set({ loadingModuleDetail: true });
    try {
      console.log('Fetching modules...');
      const client = new Client();
      const data = await client.call( 'get_module', { module: module_name });
      if (Array.isArray(data)) {
        set({ moduleDetail: data, loadingModuleDetail: false });
      } else {
        set({ moduleDetail: [data as ModuleDetailProps], loadingModuleDetail: false });
      }
    } catch (error) {
      console.error('Failed to fetch modules:', error);
      set({ moduleDetail: [], loadingModuleDetail: false });
    }
  },
}));
