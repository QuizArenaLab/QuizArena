"use client";

import React, { useState } from "react";
import { SearchInput, GlobalSearchBar, SearchEmptyState } from "@/components/search";
import { Button } from "@/components/primitives/Button";
import { SearchProvider } from "@/providers/SearchProvider";
import { useSearchContext, SearchInputState } from "@/search";
import { Icon } from "@/icons";

function SearchPlaygroundContent() {
  const { searchText, setSearchText } = useSearchContext();
  const [state, setState] = useState<SearchInputState>("Idle");
  const [isCompact, setIsCompact] = useState(false);

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-6">Search Input States</h2>
        <div className="flex flex-wrap gap-4 mb-6">
          {(
            ["Idle", "Focused", "Loading", "Disabled", "Error", "Success"] as SearchInputState[]
          ).map((s) => (
            <Button
              key={s}
              variant={state === s ? "primary" : "outline"}
              size="sm"
              onClick={() => setState(s)}
            >
              {s}
            </Button>
          ))}
        </div>

        <div className="max-w-sm">
          <SearchInput
            value={searchText}
            onChange={setSearchText}
            onClear={() => setSearchText("")}
            state={state}
            placeholder="Search questions..."
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold tracking-tight">Global Search Bar</h2>
          <Button variant="outline" size="sm" onClick={() => setIsCompact(!isCompact)}>
            Toggle Compact: {isCompact ? "On" : "Off"}
          </Button>
        </div>

        <div className="p-6 bg-muted/20 border rounded-lg">
          <GlobalSearchBar
            value={searchText}
            onChange={setSearchText}
            onClear={() => setSearchText("")}
            state={state}
            isCompact={isCompact}
            actionSlot={
              <Button size="sm" variant="secondary">
                <Icon name="Filter" className="w-4 h-4 mr-2" />
                Filters
              </Button>
            }
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-6">Empty States</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6 flex items-center justify-center bg-background">
            <SearchEmptyState type="No Search Yet" />
          </div>
          <div className="border rounded-lg p-6 flex items-center justify-center bg-background">
            <SearchEmptyState type="No Results" />
          </div>
          <div className="border rounded-lg p-6 flex items-center justify-center bg-background">
            <SearchEmptyState type="Loading" />
          </div>
          <div className="border rounded-lg p-6 flex items-center justify-center bg-background">
            <SearchEmptyState type="Offline" />
          </div>
          <div className="border rounded-lg p-6 flex items-center justify-center bg-background">
            <SearchEmptyState
              type="Permission Restricted"
              action={<Button variant="outline">Request Access</Button>}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPlayground() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Search Platform</h1>
        <p className="text-muted-foreground mt-2">
          Enterprise search foundation supporting responsive states, accessibility, and zero
          business logic.
        </p>
      </div>

      <SearchProvider>
        <SearchPlaygroundContent />
      </SearchProvider>
    </div>
  );
}
