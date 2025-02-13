import { create } from 'zustand';



interface NavbarSidebarStore {
    isAlternateLayout: boolean
    onToggle: () => void
}

export const useNavbarSidebarStore = create<NavbarSidebarStore>((set) => ({
    isAlternateLayout: false,
    onToggle: () => set((state) => ({ isAlternateLayout: !state.isAlternateLayout })),
}));
