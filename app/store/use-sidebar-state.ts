import { create } from "zustand";

interface SidebarStore {
  isCollapsed: boolean;
  setIsCollapsed: (data: boolean) => void;
  selectedNetworks: string[];
  setSelectedNetworks: (networks: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string) => void;
}

const useSidebarStore = create<SidebarStore>((set) => ({
  isCollapsed: false,
  selectedNetworks: [],
  selectedTags: [],
  setIsCollapsed: (data) => set({ isCollapsed: data }),
  setSelectedNetworks: (network: string) =>
    set((state) => ({
      selectedNetworks: state.selectedNetworks.includes(network)
        ? state.selectedNetworks.filter((n) => n !== network)
        : [...state.selectedNetworks, network],
    })),
  setSelectedTags: (tag: string) =>
    set((state) => ({
      selectedTags: state.selectedTags.includes(tag)
        ? state.selectedTags.filter((t) => t !== tag)
        : [...state.selectedTags, tag],
    })),
}));

export default useSidebarStore;
