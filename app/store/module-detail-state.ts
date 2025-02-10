import { create } from 'zustand';
import { Client } from '@/utils/client';

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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value: any;
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

export const useModuleDetailStore = create<ModuleDetailStore>((set) => ({
    moduleDetail: [],
    loadingModuleDetail: true,
    setLoadingModuleDetail: (loading) => set({ loadingModuleDetail: loading }),
    fetchModuleDetail: async (module_name) => {
        set({ loadingModuleDetail: true });
        try {
            console.log('Fetching modules...');
            const client = new Client();
            const data = await client.call('get_module', { module: module_name });
            if (Array.isArray(data)) {
                set({ moduleDetail: data, loadingModuleDetail: false });
            } else {
                set({ moduleDetail: [data], loadingModuleDetail: false });
            }
        } catch (error) {
            console.error('Failed to fetch modules:', error);
            set({ moduleDetail: [], loadingModuleDetail: false });
        }
    },
}));