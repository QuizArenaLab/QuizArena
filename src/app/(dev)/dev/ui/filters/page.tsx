"use client";

import React, { useState } from "react";
import {
  FilterBar,
  FilterGroup,
  FilterChip,
  FilterPanel,
  AdvancedFilterBuilder,
  SavedFilter,
} from "@/components/search";
import { Button } from "@/components/primitives/Button";
import { SearchProvider } from "@/providers/SearchProvider";
import { Icon } from "@/icons";
import { AdvancedFilterGroupModel } from "@/search";
import { CheckboxRoot } from "@/components/primitives/Checkbox";

function FiltersPlaygroundContent() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [chips, setChips] = useState(
    Array.from({ length: 5 }).map((_, i) => ({ id: `chip-${i}`, label: `Filter ${i + 1}` }))
  );

  const handleRemove = (id: string) => {
    setChips((prev) => prev.filter((c) => c.id !== id));
  };

  const stressChips = Array.from({ length: 1000 }).map((_, i) => ({
    id: `s-chip-${i}`,
    label: `Stress ${i + 1}`,
  }));
  const stressGroups = Array.from({ length: 50 }).map((_, i) => ({
    id: `group-${i}`,
    title: `Group ${i + 1}`,
  }));

  // Generating 20 nested rule groups
  const nestedRules: AdvancedFilterGroupModel = {
    id: "root",
    connector: "AND",
    rules: [{ id: "r1", field: "Status", operator: "Equals", value: "Published" }],
  };

  let currentGroup = nestedRules;
  for (let i = 0; i < 19; i++) {
    const newGroup: AdvancedFilterGroupModel = {
      id: `g-${i}`,
      connector: "OR",
      rules: [{ id: `r-${i}-1`, field: `Field ${i}`, operator: "Contains", value: `Value ${i}` }],
    };
    currentGroup.rules.push(newGroup);
    currentGroup = newGroup;
  }

  return (
    <div className="space-y-12 pb-20">
      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-6">Filter Bar & Chips</h2>
        <div className="space-y-4">
          <FilterBar
            actionSlot={
              <FilterPanel
                open={panelOpen}
                onOpenChange={setPanelOpen}
                trigger={
                  <Button variant="ghost" size="sm">
                    <Icon name="SlidersHorizontal" className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                }
                footer={
                  <>
                    <Button variant="ghost" size="sm" onClick={() => setPanelOpen(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => setPanelOpen(false)}>
                      Apply Filters
                    </Button>
                  </>
                }
              >
                <div className="space-y-6">
                  <FilterGroup title="Status" description="Filter by competition status">
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex items-center gap-2">
                        <CheckboxRoot id="status-1" />
                        <label htmlFor="status-1" className="text-sm font-medium leading-none">
                          Active
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckboxRoot id="status-2" />
                        <label htmlFor="status-2" className="text-sm font-medium leading-none">
                          Draft
                        </label>
                      </div>
                    </div>
                  </FilterGroup>
                  <FilterGroup title="Difficulty" description="Filter by question difficulty">
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex items-center gap-2">
                        <CheckboxRoot id="diff-1" />
                        <label htmlFor="diff-1" className="text-sm font-medium leading-none">
                          Easy
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckboxRoot id="diff-2" />
                        <label htmlFor="diff-2" className="text-sm font-medium leading-none">
                          Hard
                        </label>
                      </div>
                    </div>
                  </FilterGroup>
                </div>
              </FilterPanel>
            }
          >
            <FilterChip
              label="Active"
              selected
              icon={<Icon name="CheckCircle2" className="w-3.5 h-3.5" />}
            />
            <FilterChip label="React" removable onRemove={() => {}} />
            <FilterChip label="JavaScript" disabled removable onRemove={() => {}} />
            <FilterChip label="Difficulty: Hard" removable onRemove={() => {}} />
            <FilterChip
              label="Popular"
              favorite
              selected
              icon={<Icon name="TrendingUp" className="w-3.5 h-3.5" />}
            />
            <FilterChip label="Categories" counter={4} />
          </FilterBar>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-6">Saved Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SavedFilter
            name="My Active Competitions"
            description="Competitions I created that are currently active and published."
            favorite
          />
          <SavedFilter
            name="Team Dashboard"
            description="Shared dashboard for the whole team."
            shared
            icon={<Icon name="Users" className="h-4 w-4" />}
          />
          <SavedFilter
            name="Recent Queries"
            recent
            icon={<Icon name="Clock" className="h-4 w-4" />}
          />
          <SavedFilter
            name="System Defaults"
            description="Read-only system defaults."
            locked
            icon={<Icon name="Settings" className="h-4 w-4" />}
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-6">
          Advanced Filter Builder (Visual Rules)
        </h2>
        <div className="p-6 bg-muted/10 border rounded-lg max-w-4xl">
          <AdvancedFilterBuilder
            rootGroup={{
              id: "root",
              connector: "AND",
              rules: [
                { id: "r1", field: "Difficulty", operator: "Equals", value: "Hard" },
                { id: "r2", field: "Tags", operator: "Contains", value: "React" },
                {
                  id: "g1",
                  connector: "OR",
                  rules: [
                    { id: "r3", field: "Status", operator: "Equals", value: "Published" },
                    { id: "r4", field: "Status", operator: "Equals", value: "Draft" },
                  ],
                },
              ],
            }}
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold tracking-tight text-destructive mb-6">
          Stress Testing
        </h2>

        <div className="space-y-8">
          <div>
            <h3 className="font-medium mb-3">1000 Filter Chips</h3>
            <div className="h-48 overflow-y-auto border p-4 bg-background rounded-md flex flex-wrap gap-2">
              {stressChips.map((c) => (
                <FilterChip key={c.id} label={c.label} removable />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">50 Filter Groups</h3>
            <div className="h-64 overflow-y-auto border p-4 bg-background rounded-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stressGroups.map((g) => (
                <FilterGroup key={g.id} title={g.title} defaultExpanded={false}>
                  <div className="text-sm p-2 text-muted-foreground">Content for {g.title}</div>
                </FilterGroup>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">20 Nested Rule Groups</h3>
            <div className="p-6 bg-muted/10 border rounded-lg max-w-4xl overflow-x-auto">
              <AdvancedFilterBuilder rootGroup={nestedRules} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FiltersPlayground() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Filter Platform</h1>
        <p className="text-muted-foreground mt-2">
          Enterprise filtering foundation supporting chips, groups, advanced rules, and extreme
          scalability.
        </p>
      </div>

      <SearchProvider>
        <FiltersPlaygroundContent />
      </SearchProvider>
    </div>
  );
}
