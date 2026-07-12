"use client";

import React, { useState } from "react";
import {
  QuestionEditor,
  QuestionEditorHeader,
  QuestionEditorBody,
  QuestionEditorFooter,
  QuestionEditorSidebar,
  QuestionEditorCanvas,
  QuestionEditorInspector,
  QuestionEditorToolbar,
  QuestionEditorPlaceholder,
  QuestionEditorLoading,
  StatementSection,
  MetadataSection,
  OptionsSection,
  ExplanationSection,
  MCQEditor,
  CodingEditor,
  CaseStudyEditor,
  ComprehensionEditor,
  QuestionPreview,
  EditorSplitLayout,
  EditorFocusLayout,
  InspectorMetadata,
} from "@/features/questions/client/components";
import {
  QuestionCard,
  QuestionCardHeader,
  QuestionCardBody,
  QuestionTitle,
  QuestionStatement,
} from "@/features/questions/client/components";
import { QuestionEditorProvider, useQuestionEditor } from "@/features/questions";

function EditorPlayground() {
  const [tab, setTab] = useState<"GALLERY" | "FULL" | "STRESS">("FULL");

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="border-b border-border bg-card p-6">
        <h1 className="text-2xl font-bold">Enterprise Question Editor Platform</h1>
        <p className="text-sm text-muted-foreground mt-1">FS-04.4 Core Presentation Architecture</p>
        <div className="mt-4 flex items-center gap-4 border-b">
          <button
            className={`pb-2 px-2 text-sm font-medium ${tab === "FULL" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
            onClick={() => setTab("FULL")}
          >
            Full Editor
          </button>
          <button
            className={`pb-2 px-2 text-sm font-medium ${tab === "GALLERY" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
            onClick={() => setTab("GALLERY")}
          >
            Type Gallery
          </button>
          <button
            className={`pb-2 px-2 text-sm font-medium ${tab === "STRESS" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
            onClick={() => setTab("STRESS")}
          >
            Stress Tests
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8 flex-1">
        {tab === "FULL" && (
          <QuestionEditorProvider>
            <div className="border rounded-lg bg-card shadow-sm h-[800px] flex flex-col overflow-hidden">
              <QuestionEditorHeader className="border-b p-4 flex justify-between items-center bg-muted/20">
                <div className="font-semibold">Question Editor Workspace</div>
                <QuestionEditorToolbar className="flex gap-2">
                  <button className="px-3 py-1 border rounded text-xs bg-primary text-primary-foreground">
                    Save
                  </button>
                  <button className="px-3 py-1 border rounded text-xs">Preview</button>
                </QuestionEditorToolbar>
              </QuestionEditorHeader>

              <EditorSplitLayout className="flex-1 flex overflow-hidden">
                <QuestionEditorSidebar className="w-64 border-r p-4 bg-muted/10 overflow-y-auto">
                  <div className="font-medium mb-4 text-sm">Navigation</div>
                  <div className="space-y-2">
                    <div className="text-xs p-2 bg-muted rounded">Statement</div>
                    <div className="text-xs p-2 hover:bg-muted/50 rounded cursor-pointer">
                      Options
                    </div>
                    <div className="text-xs p-2 hover:bg-muted/50 rounded cursor-pointer">
                      Explanation
                    </div>
                  </div>
                </QuestionEditorSidebar>

                <QuestionEditorCanvas className="flex-1 p-6 overflow-y-auto bg-background">
                  <div className="max-w-3xl mx-auto space-y-6">
                    <StatementSection className="border rounded-lg p-4">
                      <div className="font-medium text-sm mb-2">Problem Statement</div>
                      <QuestionEditorPlaceholder className="h-32 border border-dashed rounded bg-muted/20 flex items-center justify-center text-muted-foreground text-sm">
                        Rich Text Editor Plugin Mounts Here
                      </QuestionEditorPlaceholder>
                    </StatementSection>

                    <OptionsSection className="border rounded-lg p-4">
                      <div className="font-medium text-sm mb-2">Options</div>
                      <div className="space-y-2">
                        <div className="h-12 border rounded bg-card flex items-center px-4 text-sm">
                          Option A...
                        </div>
                        <div className="h-12 border rounded bg-card flex items-center px-4 text-sm">
                          Option B...
                        </div>
                        <div className="h-12 border border-dashed rounded flex items-center justify-center text-xs text-muted-foreground cursor-pointer">
                          + Add Option
                        </div>
                      </div>
                    </OptionsSection>
                  </div>
                </QuestionEditorCanvas>

                <QuestionEditorInspector className="w-80 border-l p-4 bg-muted/10 overflow-y-auto">
                  <div className="font-medium mb-4 text-sm">Inspector</div>
                  <InspectorMetadata className="space-y-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Difficulty</div>
                      <select className="w-full border rounded p-1.5 text-sm bg-card">
                        <option>Intermediate</option>
                      </select>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Tags</div>
                      <div className="min-h-10 border rounded p-1.5 bg-card flex gap-1 flex-wrap">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                          react
                        </span>
                      </div>
                    </div>
                  </InspectorMetadata>
                </QuestionEditorInspector>
              </EditorSplitLayout>

              <QuestionEditorFooter className="border-t p-2 text-xs text-muted-foreground flex justify-between bg-muted/20">
                <span>Status: Draft</span>
                <span>Last saved: just now</span>
              </QuestionEditorFooter>
            </div>
          </QuestionEditorProvider>
        )}

        {tab === "GALLERY" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MCQEditor className="border rounded-lg p-4 h-64 bg-card shadow-sm flex flex-col items-center justify-center text-muted-foreground">
              Multiple Choice Editor Variant
            </MCQEditor>
            <CodingEditor className="border rounded-lg p-4 h-64 bg-card shadow-sm flex flex-col items-center justify-center text-muted-foreground">
              Coding Editor Variant
            </CodingEditor>
            <CaseStudyEditor className="border rounded-lg p-4 h-64 bg-card shadow-sm flex flex-col items-center justify-center text-muted-foreground">
              Case Study Editor Variant
            </CaseStudyEditor>
            <ComprehensionEditor className="border rounded-lg p-4 h-64 bg-card shadow-sm flex flex-col items-center justify-center text-muted-foreground">
              Comprehension Editor Variant
            </ComprehensionEditor>
            <QuestionPreview className="border rounded-lg p-4 h-64 bg-card shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 p-4 opacity-50 pointer-events-none">
                <QuestionCard className="h-full border rounded shadow-sm bg-background">
                  <QuestionCardHeader>
                    <QuestionTitle title="Preview Rendering" />
                  </QuestionCardHeader>
                  <QuestionCardBody>
                    <QuestionStatement>Matches FS-04.2 Architecture</QuestionStatement>
                  </QuestionCardBody>
                </QuestionCard>
              </div>
              <div className="z-10 bg-background/80 backdrop-blur-sm px-4 py-2 rounded border font-medium">
                Question Preview
              </div>
            </QuestionPreview>
            <EditorFocusLayout className="border rounded-lg p-4 h-64 bg-card shadow-sm flex flex-col items-center justify-center text-muted-foreground">
              Focus Layout
            </EditorFocusLayout>
          </div>
        )}

        {tab === "STRESS" && (
          <div className="space-y-12">
            <div>
              <h2 className="text-xl font-semibold mb-4">100 Editor Renders</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {Array.from({ length: 100 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-12 border rounded bg-card flex items-center justify-center text-xs text-muted-foreground"
                  >
                    Editor Shell {i + 1}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">50 Inspector Panels</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 border rounded bg-card flex items-center justify-center text-xs text-muted-foreground"
                  >
                    Inspector {i + 1}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">30 Preview Panels</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-24 border rounded bg-card flex items-center justify-center text-xs text-muted-foreground"
                  >
                    Preview {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditorPlayground;
