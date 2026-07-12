"use client";

import React, { useState } from "react";
import {
  QuizNavigationProvider,
  NavigationWorkspace,
  NavigationSidebar,
  NavigationViewport,
  NavigationFooterBar,
  NavigationToolbarRegion,
  QuestionPalette,
  QuestionGrid,
  QuestionMap,
  QuestionNavigator,
  QuestionTile,
  BookmarkBadge,
  FlagBadge,
  QuestionIndex,
  QuestionStatusBadge,
  QuestionGroup,
  QuestionGroupHeader,
  QuestionGroupBody,
  ProgressSummary,
  NavigationLegend,
  NavigationSummary,
  NavigationItemPresentation,
} from "@/features/quizzes";

// Mock generation for 500 questions
const generateMocks = (count: number): NavigationItemPresentation[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `q-${i + 1}`,
    index: i + 1,
    bookmarked: i % 15 === 0,
    flagged: i % 25 === 0,
    answered: i < count / 2 && i % 3 !== 0,
    current: i === count / 2,
    visited: i <= count / 2,
    disabled: false,
    readonly: false,
    focused: false,
    hovered: false,
  }));
};

const MOCK_500 = generateMocks(500);
const MOCK_GROUPS = [
  { id: "g1", title: "Section A: Fundamentals", items: MOCK_500.slice(0, 50) },
  { id: "g2", title: "Section B: Advanced Concepts", items: MOCK_500.slice(50, 150) },
  { id: "g3", title: "Section C: Case Studies", items: MOCK_500.slice(150, 300) },
];

export default function QuizNavigationPlayground() {
  const [dataset, setDataset] = useState<"ALL" | "GROUPS">("ALL");

  const renderTile = (p: NavigationItemPresentation) => {
    let bg = "bg-card";
    if (p.current) bg = "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-1";
    else if (p.answered) bg = "bg-green-100 text-green-800 border-green-300";
    else if (p.visited) bg = "bg-slate-100 text-slate-800";

    return (
      <QuestionTile
        key={p.id}
        presentation={p}
        className={`w-10 h-10 border rounded flex items-center justify-center text-xs font-medium relative cursor-pointer hover:ring-2 ${bg}`}
        overlaySlot={
          <>
            {p.bookmarked && (
              <BookmarkBadge className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-white" />
            )}
            {p.flagged && (
              <FlagBadge className="absolute -bottom-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border border-white" />
            )}
          </>
        }
        bodySlot={<QuestionIndex>{p.index}</QuestionIndex>}
      />
    );
  };

  return (
    <QuizNavigationProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <div className="border-b border-border bg-card p-4 sticky top-0 z-10 flex justify-between items-center shadow-sm">
          <div>
            <h1 className="text-xl font-bold">Enterprise Quiz Navigation</h1>
            <p className="text-xs text-muted-foreground mt-1">FS-06.3 Presentation Architecture</p>
          </div>
          <div className="flex gap-4">
            <button
              className={`px-3 py-1 text-sm border rounded ${dataset === "ALL" ? "bg-primary text-white" : ""}`}
              onClick={() => setDataset("ALL")}
            >
              500 Items Grid
            </button>
            <button
              className={`px-3 py-1 text-sm border rounded ${dataset === "GROUPS" ? "bg-primary text-white" : ""}`}
              onClick={() => setDataset("GROUPS")}
            >
              Sectional Groups
            </button>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-12">
          <section className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <h2 className="text-lg font-semibold border-b pb-2">Layout: GRID & PALETTE</h2>

              <NavigationWorkspace className="border rounded-lg bg-card shadow-sm h-96 flex flex-col">
                <NavigationToolbarRegion className="p-2 border-b bg-muted/10 text-xs font-semibold flex justify-between">
                  <span>Question Grid</span>
                  <NavigationLegend className="flex gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded bg-primary"></span> Current
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded bg-green-300"></span> Answered
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded bg-orange-500"></span> Flagged
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded bg-blue-500"></span> Bookmarked
                    </span>
                  </NavigationLegend>
                </NavigationToolbarRegion>

                <NavigationViewport className="flex-1 overflow-auto p-4">
                  {dataset === "ALL" ? (
                    <QuestionGrid className="flex flex-wrap gap-2">
                      {MOCK_500.map(renderTile)}
                    </QuestionGrid>
                  ) : (
                    <div className="space-y-6">
                      {MOCK_GROUPS.map((g) => (
                        <QuestionGroup key={g.id} className="border rounded p-3 bg-muted/5">
                          <QuestionGroupHeader className="text-sm font-bold mb-3 border-b pb-2">
                            {g.title}
                          </QuestionGroupHeader>
                          <QuestionGroupBody className="flex flex-wrap gap-2">
                            {g.items.map(renderTile)}
                          </QuestionGroupBody>
                        </QuestionGroup>
                      ))}
                    </div>
                  )}
                </NavigationViewport>
              </NavigationWorkspace>
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-semibold border-b pb-2">Layout: SIDEBAR & FLOATING</h2>

              <NavigationSidebar className="border rounded-lg bg-card shadow-sm h-96 flex flex-col">
                <div className="p-3 border-b bg-muted/10">
                  <ProgressSummary className="text-sm font-semibold">
                    Overall Progress (45%)
                    <div className="w-full bg-muted rounded h-2 mt-2">
                      <div className="bg-primary h-2 rounded" style={{ width: "45%" }}></div>
                    </div>
                  </ProgressSummary>
                </div>

                <NavigationSummary className="p-4 space-y-3 flex-1 overflow-auto text-sm">
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Answered</span>
                    <span className="font-bold">200 / 500</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground text-orange-600">Flagged</span>
                    <span className="font-bold text-orange-600">20</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground text-blue-600">Bookmarked</span>
                    <span className="font-bold text-blue-600">33</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-muted-foreground">Not Visited</span>
                    <span className="font-bold">250</span>
                  </div>
                </NavigationSummary>

                <NavigationFooterBar className="p-3 border-t bg-muted/5 flex justify-center">
                  <QuestionNavigator className="flex gap-2 w-full">
                    <button className="flex-1 py-1 px-2 border rounded text-xs hover:bg-muted">
                      Previous
                    </button>
                    <button className="flex-1 py-1 px-2 border rounded text-xs bg-primary text-primary-foreground">
                      Next
                    </button>
                  </QuestionNavigator>
                </NavigationFooterBar>
              </NavigationSidebar>
            </div>
          </section>
        </div>
      </div>
    </QuizNavigationProvider>
  );
}
