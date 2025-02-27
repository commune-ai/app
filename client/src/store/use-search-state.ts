import { create } from "zustand";

interface SearchStore {
  searchTerm: string;
  currentPage: number;
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: number) => void;
}

const useSearchStore = create<SearchStore>((set) => ({
  searchTerm: "",
  currentPage: 1,
  setSearchTerm: (term) => set({ searchTerm: term }),
  setCurrentPage: (page) => set({ currentPage: page }),
}));

export default useSearchStore;
