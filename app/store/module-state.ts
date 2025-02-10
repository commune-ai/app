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

interface ModuleStore {
    modules: ModuleType[];
    fetchModules: () => Promise<void>;
    loadingModules: boolean;
    setLoadingModules: (loading: boolean) => void;
}

export const useModuleStore = create<ModuleStore>((set) => ({
    modules: [],
    loadingModules: true,
    setLoadingModules: (loading) => set({ loadingModules: loading }),
    fetchModules: async () => {
        set({ loadingModules: true });
        try {
            console.log('Fetching modules...');
            const client = new Client();
            const data = await client.call('modules');
            set({ modules: data, loadingModules: false });
        } catch (error) {
            console.error('Failed to fetch modules:', error);
            set({ modules:[],loadingModules: false });
        }
    },
}));