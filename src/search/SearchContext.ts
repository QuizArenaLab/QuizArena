import { createContext, useContext } from "react";
import { FilterChipModel } from "./SearchTypes";

export interface SearchContextState {
  searchText: string;
  activeFilters: Record<string, unknown>; // Presentation filter state model
  filterChips: FilterChipModel[];
  compactMode: boolean;
  panelState: "open" | "closed";

  // Actions
  setSearchText: (text: string) => void;
  setPanelState: (state: "open" | "closed") => void;
  setCompactMode: (compact: boolean) => void;
  addChip: (chip: FilterChipModel) => void;
  removeChip: (id: string) => void;
  clearAll: () => void;
}

export const SearchContext = createContext<SearchContextState | undefined>(undefined);

export function useSearchContext() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
}
