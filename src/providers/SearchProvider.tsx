"use client";

import React, { useState, ReactNode } from "react";
import { SearchContext } from "../search";
import { FilterChipModel } from "../search";

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchText, setSearchText] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>({});
  const [filterChips, setFilterChips] = useState<FilterChipModel[]>([]);
  const [compactMode, setCompactMode] = useState(false);
  const [panelState, setPanelState] = useState<"open" | "closed">("closed");

  const addChip = (chip: FilterChipModel) => {
    setFilterChips((prev) => {
      if (prev.find((c) => c.id === chip.id)) return prev;
      return [...prev, chip];
    });
  };

  const removeChip = (id: string) => {
    setFilterChips((prev) => prev.filter((c) => c.id !== id));
  };

  const clearAll = () => {
    setSearchText("");
    setActiveFilters({});
    setFilterChips([]);
  };

  return (
    <SearchContext.Provider
      value={{
        searchText,
        activeFilters,
        filterChips,
        compactMode,
        panelState,
        setSearchText,
        setPanelState,
        setCompactMode,
        addChip,
        removeChip,
        clearAll,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
