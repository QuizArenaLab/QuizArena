"use client";

import React, { useState } from "react";
import {
  QuestionAuthoringWorkspace,
  AuthoringSidebar,
  AuthoringCanvas,
  AuthoringToolbar,
  BasicInformationSection,
  StatementSection,
  AnswerSection,
  ExplanationSection,
  PreviewSection,
  QuestionCompletionEngine,
  CompletionMeter,
  QualityChecklist,
  WarningPanel,
  SuggestionPanel,
  ReadinessIndicator,
  AuthoringInspector,
  InspectorQuality,
  InspectorStatistics,
  InspectorMetadata,
  InspectorReadiness,
  InspectorWordCount,
  QuestionPreview,
} from "@/features/questions";
import {
  QuestionCard,
  QuestionCardHeader,
  QuestionTitle,
  QuestionCardBody,
  QuestionStatement,
} from "@/features/questions/client/components";

export default function AuthoringPlayground() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b border-border bg-card p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Question Authoring Workspace</h1>
          <p className="text-xs text-muted-foreground mt-1">
            FS-04.5 SME-First Progressive Authoring
          </p>
        </div>
        <div className="text-sm font-medium border px-3 py-1 rounded bg-muted/20">
          SME Journey Demo
        </div>
      </div>

      <div className="flex-1 p-6">
        <QuestionAuthoringWorkspace className="h-[800px] border rounded-lg shadow-sm flex flex-col bg-card overflow-hidden">
          <AuthoringToolbar className="h-12 border-b flex items-center justify-between px-4 bg-muted/20">
            <div className="font-semibold text-sm">Create Multiple Choice Question</div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs border rounded hover:bg-muted">Preview</button>
              <button className="px-3 py-1 text-xs border rounded hover:bg-muted text-destructive">
                Reset
              </button>
              <button className="px-3 py-1 text-xs border rounded hover:bg-muted">Duplicate</button>
              <button className="px-3 py-1 text-xs border rounded hover:bg-muted">
                Collapse Sidebar
              </button>
              <button className="px-3 py-1 text-xs border rounded bg-primary text-primary-foreground">
                Fullscreen
              </button>
            </div>
          </AuthoringToolbar>

          <div className="flex-1 flex overflow-hidden">
            <AuthoringSidebar className="w-64 border-r bg-muted/5 flex flex-col">
              <div className="p-4 border-b text-xs font-semibold uppercase text-muted-foreground">
                Authoring Flow
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                <button
                  onClick={() => setActiveStep(1)}
                  className={`w-full text-left p-2 rounded text-sm flex justify-between items-center ${activeStep === 1 ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50"}`}
                >
                  Basic Information {activeStep > 1 && <span className="text-green-600">✓</span>}
                </button>
                <button
                  onClick={() => setActiveStep(2)}
                  className={`w-full text-left p-2 rounded text-sm flex justify-between items-center ${activeStep === 2 ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50"}`}
                >
                  Statement {activeStep > 2 && <span className="text-green-600">✓</span>}
                </button>
                <button
                  onClick={() => setActiveStep(3)}
                  className={`w-full text-left p-2 rounded text-sm flex justify-between items-center ${activeStep === 3 ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50"}`}
                >
                  Answers {activeStep > 3 && <span className="text-green-600">✓</span>}
                </button>
                <button
                  onClick={() => setActiveStep(4)}
                  className={`w-full text-left p-2 rounded text-sm flex justify-between items-center ${activeStep === 4 ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50"}`}
                >
                  Explanation <span className="text-muted-foreground text-xs">(Optional)</span>
                </button>
                <button
                  onClick={() => setActiveStep(5)}
                  className={`w-full text-left p-2 rounded text-sm flex justify-between items-center ${activeStep === 5 ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50"}`}
                >
                  Hints <span className="text-muted-foreground text-xs">(Optional)</span>
                </button>
                <button
                  onClick={() => setActiveStep(6)}
                  className={`w-full text-left p-2 rounded text-sm flex justify-between items-center ${activeStep === 6 ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50"}`}
                >
                  Attachments <span className="text-muted-foreground text-xs">(Optional)</span>
                </button>
                <button
                  onClick={() => setActiveStep(7)}
                  className={`w-full text-left p-2 rounded text-sm flex justify-between items-center ${activeStep === 7 ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50"}`}
                >
                  Preview <span className="text-orange-500 font-bold">⚠</span>
                </button>
              </div>
            </AuthoringSidebar>

            <AuthoringCanvas className="flex-1 bg-background overflow-y-auto p-8 flex flex-col items-center">
              <div className="w-full max-w-3xl space-y-8">
                {activeStep >= 1 && (
                  <BasicInformationSection
                    className={`p-6 border rounded-lg bg-card shadow-sm transition-opacity ${activeStep !== 1 ? "opacity-50" : "opacity-100 ring-2 ring-primary/20"}`}
                  >
                    <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">
                          Question Type
                        </label>
                        <select className="w-full border rounded p-2 text-sm bg-background">
                          <option>Multiple Choice</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">
                          Difficulty
                        </label>
                        <select className="w-full border rounded p-2 text-sm bg-background">
                          <option>Intermediate</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Category</label>
                        <select className="w-full border rounded p-2 text-sm bg-background">
                          <option>Software Engineering</option>
                        </select>
                      </div>
                    </div>
                    {activeStep === 1 && (
                      <button
                        onClick={() => setActiveStep(2)}
                        className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded text-sm w-full font-medium"
                      >
                        Continue to Statement
                      </button>
                    )}
                  </BasicInformationSection>
                )}

                {activeStep >= 2 && (
                  <StatementSection
                    className={`p-6 border rounded-lg bg-card shadow-sm transition-opacity ${activeStep !== 2 ? "opacity-50" : "opacity-100 ring-2 ring-primary/20"}`}
                  >
                    <h2 className="text-lg font-semibold mb-4">Question Statement</h2>
                    <textarea
                      className="w-full h-32 border rounded p-3 text-sm resize-none bg-background placeholder:text-muted-foreground"
                      placeholder="Write your question here..."
                    ></textarea>
                    {activeStep === 2 && (
                      <button
                        onClick={() => setActiveStep(3)}
                        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded text-sm w-full font-medium"
                      >
                        Continue to Answers
                      </button>
                    )}
                  </StatementSection>
                )}

                {activeStep >= 3 && (
                  <AnswerSection
                    className={`p-6 border rounded-lg bg-card shadow-sm transition-opacity ${activeStep !== 3 ? "opacity-50" : "opacity-100 ring-2 ring-primary/20"}`}
                  >
                    <h2 className="text-lg font-semibold mb-4">Answers</h2>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="correct" className="w-4 h-4 text-primary" />
                        <input
                          type="text"
                          className="flex-1 border rounded p-2 text-sm"
                          placeholder="Option A"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="correct" className="w-4 h-4 text-primary" />
                        <input
                          type="text"
                          className="flex-1 border rounded p-2 text-sm"
                          placeholder="Option B"
                        />
                      </div>
                      <button className="text-sm text-primary font-medium mt-2 hover:underline">
                        + Add Option
                      </button>
                    </div>
                    {activeStep === 3 && (
                      <button
                        onClick={() => setActiveStep(4)}
                        className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded text-sm w-full font-medium"
                      >
                        Continue to Explanations
                      </button>
                    )}
                  </AnswerSection>
                )}

                {activeStep >= 4 && activeStep <= 6 && (
                  <ExplanationSection
                    className={`p-6 border border-dashed rounded-lg bg-card/50 transition-opacity ${activeStep !== 4 ? "opacity-50" : "opacity-100 ring-2 ring-primary/20"}`}
                  >
                    <h2 className="text-lg font-semibold mb-2">Optional Additions</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      You can optionally add explanations, hints, or attachments.
                    </p>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 border bg-card rounded text-sm font-medium hover:bg-muted">
                        Add Explanation
                      </button>
                      <button className="px-3 py-1.5 border bg-card rounded text-sm font-medium hover:bg-muted">
                        Add Hints
                      </button>
                      <button className="px-3 py-1.5 border bg-card rounded text-sm font-medium hover:bg-muted">
                        Add Attachments
                      </button>
                    </div>
                    {activeStep === 4 && (
                      <button
                        onClick={() => setActiveStep(7)}
                        className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded text-sm w-full font-medium"
                      >
                        Preview Question
                      </button>
                    )}
                  </ExplanationSection>
                )}

                {activeStep === 7 && (
                  <PreviewSection className="p-6 border rounded-lg bg-card shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Live Preview</h2>
                    <QuestionPreview className="border rounded-lg overflow-hidden bg-muted/10 p-6">
                      <QuestionCard className="bg-background border rounded shadow-sm">
                        <QuestionCardHeader>
                          <QuestionTitle title="Sample Question Preview" />
                        </QuestionCardHeader>
                        <QuestionCardBody>
                          <QuestionStatement>
                            This represents exactly what the learner will see.
                          </QuestionStatement>
                        </QuestionCardBody>
                      </QuestionCard>
                    </QuestionPreview>
                  </PreviewSection>
                )}
              </div>
            </AuthoringCanvas>

            <AuthoringInspector className="w-80 border-l bg-muted/5 flex flex-col overflow-y-auto">
              <QuestionCompletionEngine>
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm">Question Ready</span>
                    <span className="font-bold text-primary">
                      {Math.min(100, activeStep * 15)}%
                    </span>
                  </div>
                  <CompletionMeter className="h-2 w-full bg-muted rounded overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${Math.min(100, activeStep * 15)}%` }}
                    ></div>
                  </CompletionMeter>
                </div>

                <InspectorQuality className="p-4 border-b">
                  <div className="text-xs font-semibold uppercase text-muted-foreground mb-3">
                    Quality Score ★★★☆☆
                  </div>
                  <QualityChecklist className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span> Basic Information
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={activeStep > 2 ? "text-green-600" : "text-muted-foreground"}>
                        {activeStep > 2 ? "✓" : "○"}
                      </span>{" "}
                      Statement Written
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={activeStep > 3 ? "text-green-600" : "text-muted-foreground"}>
                        {activeStep > 3 ? "✓" : "○"}
                      </span>{" "}
                      Correct Answer Set
                    </div>
                  </QualityChecklist>
                </InspectorQuality>

                <div className="p-4 border-b space-y-4">
                  <WarningPanel className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-md">
                    <div className="flex gap-2 text-sm text-orange-700 dark:text-orange-400">
                      <span className="font-bold">⚠</span>
                      <div>
                        <strong>No Explanation</strong>
                        <p className="text-xs mt-1">
                          Questions with explanations perform 40% better.
                        </p>
                      </div>
                    </div>
                  </WarningPanel>

                  <SuggestionPanel className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
                    <div className="flex gap-2 text-sm text-blue-700 dark:text-blue-400">
                      <span className="font-bold">ℹ</span>
                      <div>
                        <strong>Add Tags</strong>
                        <p className="text-xs mt-1">
                          This question could be tagged with &quot;React&quot;.
                        </p>
                      </div>
                    </div>
                  </SuggestionPanel>
                </div>

                <InspectorStatistics className="p-4 border-b space-y-3">
                  <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                    Statistics
                  </div>
                  <InspectorWordCount className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Word Count</span>
                    <span className="font-medium">124</span>
                  </InspectorWordCount>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Est. Time</span>
                    <span className="font-medium">2 mins</span>
                  </div>
                </InspectorStatistics>
              </QuestionCompletionEngine>
            </AuthoringInspector>
          </div>
        </QuestionAuthoringWorkspace>
      </div>
    </div>
  );
}
