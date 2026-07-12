"use client";

import React, { useState } from "react";
import {
  QuestionBrowserProvider,
  QuestionBrowser,
  QuestionBrowserHeader,
  QuestionBrowserSummary,
  QuestionBrowserStatistics,
  QuestionBrowserToolbar,
  QuestionBrowserSelection,
  QuestionBrowserPaginatorPlaceholder,
  QuestionBrowserQuickActions,
  GridView,
  ListView,
  CompactView,
  QuestionExplorer,
  QuestionExplorerPanel,
  QuestionExplorerViewport,
  QuestionBrowserMode,
  QuestionBrowserView,
} from "@/features/questions";
import {
  QuestionCard,
  QuestionCardHeader,
  QuestionCardBody,
  QuestionCardFooter,
  QuestionCardStatus,
} from "@/features/questions/client/components/cards";
import { Toolbar } from "@/components/toolbar/Toolbar/Toolbar";
import { ToolbarGroup } from "@/components/toolbar/ToolbarGroup/ToolbarGroup";
import { ToolbarAction } from "@/components/toolbar/ToolbarAction/ToolbarAction";
import { Button } from "@/components/primitives/Button";

// Dummy Data Generators
const generateQuestions = (count: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `q-${i + 1}`,
    title: `Question ${i + 1}: Detailed Analysis of Topic ${Math.floor(Math.random() * 100)}`,
    excerpt: `This is a long passage excerpt for question ${i + 1}. It contains significant text to test layout wrapping and overflow behaviors in grids and lists...`,
    difficulty: ["Easy", "Medium", "Hard", "Expert"][Math.floor(Math.random() * 4)],
    category: `Category ${Math.floor(Math.random() * 100) + 1}`,
    type: ["Multiple Choice", "True/False", "Essay", "Coding"][Math.floor(Math.random() * 4)],
    status: ["Published", "Draft", "Archived", "Review"][Math.floor(Math.random() * 4)],
  }));
};

const DUMMY_QUESTIONS = generateQuestions(500);

export default function QuestionBrowserPlayground() {
  const [currentView, setCurrentView] = useState<QuestionBrowserView>(QuestionBrowserView.GRID);
  const [currentMode, setCurrentMode] = useState<QuestionBrowserMode>(QuestionBrowserMode.BROWSE);

  const renderCards = () => {
    return DUMMY_QUESTIONS.map((q) => (
      <QuestionCard key={q.id}>
        <QuestionCardHeader>
          <div className="flex justify-between items-start gap-4">
            <h4 className="font-semibold text-gray-900 text-sm">{q.title}</h4>
            <div className="flex gap-2 shrink-0">
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-md whitespace-nowrap">
                {q.type}
              </span>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-md">{q.difficulty}</span>
            </div>
          </div>
        </QuestionCardHeader>
        <QuestionCardBody>
          <p className="text-sm text-gray-600 line-clamp-3">{q.excerpt}</p>
        </QuestionCardBody>
        <QuestionCardFooter>
          <div className="flex justify-between items-center w-full">
            <span className="text-xs text-gray-500">{q.category}</span>
            <QuestionCardStatus>
              <span className="text-xs font-medium text-gray-600 px-2 py-1 bg-gray-100 rounded-md">
                {q.status}
              </span>
            </QuestionCardStatus>
          </div>
        </QuestionCardFooter>
      </QuestionCard>
    ));
  };

  const renderViewport = () => {
    switch (currentView) {
      case QuestionBrowserView.LIST:
        return <ListView>{renderCards()}</ListView>;
      case QuestionBrowserView.COMPACT:
        return <CompactView>{renderCards()}</CompactView>;
      case QuestionBrowserView.GRID:
      default:
        return <GridView columns={4}>{renderCards()}</GridView>;
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans">
      <div className="w-16 bg-gray-900 flex-col flex items-center py-4 gap-4 shrink-0">
        {/* Mock global nav */}
        <div className="w-10 h-10 bg-indigo-500 rounded-lg" />
        <div className="w-10 h-10 bg-gray-800 rounded-lg" />
      </div>

      <div className="flex-1 h-full overflow-hidden flex flex-col">
        <QuestionBrowserProvider initialView={currentView} initialMode={currentMode}>
          <QuestionBrowser>
            {/* Header Composition */}
            <QuestionBrowserHeader>
              <div className="flex justify-between items-end">
                <QuestionBrowserSummary
                  title="Question Bank"
                  description="Manage, organize, and discover all question content across your enterprise."
                />
                <QuestionBrowserSelection onSelectModeChange={setCurrentMode} />
              </div>

              {/* Toolbar Composition */}
              <QuestionBrowserToolbar>
                <Toolbar variant="default">
                  <ToolbarGroup id="group-1">
                    <ToolbarAction icon="Search" label="Search" />
                    <ToolbarAction icon="Filter" label="Filter" />
                  </ToolbarGroup>
                  <ToolbarGroup id="group-2">
                    <QuestionBrowserQuickActions />
                  </ToolbarGroup>
                  <ToolbarGroup id="group-3">
                    <div className="px-3 py-1 flex gap-2">
                      <Button
                        variant={currentView === QuestionBrowserView.GRID ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setCurrentView(QuestionBrowserView.GRID)}
                      >
                        Grid
                      </Button>
                      <Button
                        variant={currentView === QuestionBrowserView.LIST ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setCurrentView(QuestionBrowserView.LIST)}
                      >
                        List
                      </Button>
                      <Button
                        variant={
                          currentView === QuestionBrowserView.COMPACT ? "primary" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentView(QuestionBrowserView.COMPACT)}
                      >
                        Compact
                      </Button>
                    </div>
                  </ToolbarGroup>
                </Toolbar>
              </QuestionBrowserToolbar>

              <QuestionBrowserStatistics
                totalQuestions={500}
                totalCategories={100}
                totalTags={250}
              />
            </QuestionBrowserHeader>

            {/* Explorer Composition */}
            <div className="flex-1 overflow-hidden p-6">
              <QuestionExplorer>
                {/* Optional left panel (e.g., category tree or filters) */}
                <QuestionExplorerPanel width="w-64" position="left">
                  <div className="p-4">
                    <h3 className="font-semibold mb-4 text-sm text-gray-500 uppercase">
                      Categories (100)
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <li key={i} className="cursor-pointer hover:text-indigo-600">
                          Category {i + 1}
                        </li>
                      ))}
                      <li className="text-gray-400 italic">... 80 more</li>
                    </ul>
                  </div>
                </QuestionExplorerPanel>

                {/* Main Viewport */}
                <QuestionExplorerViewport>
                  <div className="p-6 h-full overflow-auto">{renderViewport()}</div>
                </QuestionExplorerViewport>
              </QuestionExplorer>
            </div>

            {/* Paginator UI Placeholder */}
            <QuestionBrowserPaginatorPlaceholder />
          </QuestionBrowser>
        </QuestionBrowserProvider>
      </div>
    </div>
  );
}
