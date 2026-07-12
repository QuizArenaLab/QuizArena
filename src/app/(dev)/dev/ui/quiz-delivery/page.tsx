"use client";
import React, { useState } from "react";
import {
  QuizDeliveryState,
  QuizDeliveryStage,
  DeliveryStagePresentation,
} from "@/features/quizzes/delivery";
import { QuizDeliveryProvider } from "@/features/quizzes/providers";
import { DeliveryShell } from "@/features/quizzes/components/delivery/composition";
import {
  ReadyStage,
  InstructionsStage,
  ActiveStage,
  PausedStage,
  ReviewStage,
  SubmittingStage,
  ResultsStage,
  SessionRegion,
  PlayerRegion,
  NavigationRegion,
  TimerRegion,
  ReviewRegion,
  ResultsRegion,
  StatusRegion,
  DeliverySplitLayout,
  DeliveryFocusedLayout,
} from "@/features/quizzes/components/delivery";

const MOCK_STAGE_PRESENTATION: Record<QuizDeliveryStage, DeliveryStagePresentation> = {
  [QuizDeliveryStage.READY]: {
    stage: QuizDeliveryStage.READY,
    title: "Ready to Begin",
    description:
      "Please ensure you have a stable internet connection. The timer will begin as soon as you start.",
    icon: "🏁",
    availableActions: ["Start Assessment"],
  },
  [QuizDeliveryStage.INSTRUCTIONS]: {
    stage: QuizDeliveryStage.INSTRUCTIONS,
    title: "Instructions",
    subtitle: "Read all instructions carefully.",
    description:
      "1. You have 60 minutes.\n2. Do not refresh the page.\n3. You can review your answers at the end.",
    availableActions: ["I Understand, Continue"],
  },
  [QuizDeliveryStage.ACTIVE]: {
    stage: QuizDeliveryStage.ACTIVE,
    title: "Active",
    availableActions: ["Pause", "Finish"],
  },
  [QuizDeliveryStage.PAUSED]: {
    stage: QuizDeliveryStage.PAUSED,
    title: "Session Paused",
    description: "Your session is currently paused. Time is not running.",
    icon: "⏸️",
    availableActions: ["Resume Assessment"],
  },
  [QuizDeliveryStage.REVIEW]: {
    stage: QuizDeliveryStage.REVIEW,
    title: "Review Answers",
    availableActions: ["Submit Assessment"],
  },
  [QuizDeliveryStage.SUBMITTING]: {
    stage: QuizDeliveryStage.SUBMITTING,
    title: "Submitting...",
    description: "Please wait while your answers are being securely uploaded.",
    availableActions: [],
  },
  [QuizDeliveryStage.RESULTS]: {
    stage: QuizDeliveryStage.RESULTS,
    title: "Results",
    availableActions: ["Back to Dashboard"],
  },
};

export default function QuizDeliveryPlayground() {
  const [activeTab, setActiveTab] = useState("journey");

  // Journey state
  const journeyStages = [
    QuizDeliveryStage.READY,
    QuizDeliveryStage.INSTRUCTIONS,
    QuizDeliveryStage.ACTIVE,
    QuizDeliveryStage.PAUSED,
    QuizDeliveryStage.ACTIVE,
    QuizDeliveryStage.REVIEW,
    QuizDeliveryStage.SUBMITTING,
    QuizDeliveryStage.RESULTS,
  ];
  const [journeyIndex, setJourneyIndex] = useState(0);
  const currentJourneyStage = journeyStages[journeyIndex];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="bg-white p-6 rounded-xl shadow-sm">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Quiz Delivery Workspace Platform
          </h1>
          <p className="text-gray-500">FS-06.7 Orchestration Layer & Composition Shell</p>

          <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
            {[
              { id: "journey", label: "Learner Journey" },
              { id: "stages", label: "Stage Gallery" },
              { id: "layouts", label: "Layouts" },
              { id: "regions", label: "Regions" },
              { id: "stress", label: "Stress Test" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {activeTab === "journey" && (
          <section className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold">Complete Learner Journey</h2>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setJourneyIndex(Math.max(0, journeyIndex - 1))}
                  disabled={journeyIndex === 0}
                  className="px-4 py-2 bg-gray-100 disabled:opacity-50 rounded"
                >
                  Previous
                </button>
                <span className="font-mono bg-gray-100 px-3 py-1 rounded">
                  {currentJourneyStage}
                </span>
                <button
                  onClick={() =>
                    setJourneyIndex(Math.min(journeyStages.length - 1, journeyIndex + 1))
                  }
                  disabled={journeyIndex === journeyStages.length - 1}
                  className="px-4 py-2 bg-indigo-600 text-white disabled:opacity-50 rounded"
                >
                  Next
                </button>
              </div>
            </div>
            <div className="h-[700px] border-4 border-indigo-100 rounded-xl overflow-hidden shadow-xl">
              <QuizDeliveryProvider
                initialState={{
                  state: QuizDeliveryState.ACTIVE,
                  deliveryStage: currentJourneyStage,
                  stagePresentation: MOCK_STAGE_PRESENTATION[currentJourneyStage],
                }}
              >
                <DeliveryShell />
              </QuizDeliveryProvider>
            </div>
          </section>
        )}

        {activeTab === "stages" && (
          <section className="space-y-8">
            <h2 className="text-2xl font-bold">Stage Gallery</h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {(Object.values(QuizDeliveryStage) as QuizDeliveryStage[]).map((stage) => (
                <div key={stage} className="space-y-2">
                  <h3 className="font-bold text-gray-700">{stage}</h3>
                  <div className="h-[500px] rounded-xl overflow-hidden shadow">
                    <QuizDeliveryProvider
                      initialState={{
                        state: QuizDeliveryState.ACTIVE,
                        deliveryStage: stage,
                        stagePresentation: MOCK_STAGE_PRESENTATION[stage],
                      }}
                    >
                      <DeliveryShell />
                    </QuizDeliveryProvider>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "layouts" && (
          <section className="space-y-8">
            <h2 className="text-2xl font-bold">Layout Gallery</h2>
            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="font-bold text-gray-700">Split Layout (Standard)</h3>
                <div className="h-[400px] border border-gray-200 rounded-xl overflow-hidden">
                  <DeliverySplitLayout
                    topSlot={
                      <div className="bg-indigo-600 w-full h-full text-white px-4 py-2">
                        Top Slot
                      </div>
                    }
                    sidebarSlot={<div className="p-4">Sidebar Slot</div>}
                    canvasSlot={<div className="p-4">Canvas Slot</div>}
                    footerSlot={<div className="p-4">Footer Slot</div>}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-gray-700">Focused Layout (Results/Full Page)</h3>
                <div className="h-[400px] border border-gray-200 rounded-xl overflow-hidden">
                  <DeliveryFocusedLayout
                    topSlot={
                      <div className="bg-indigo-600 w-full h-full text-white px-4 py-2">
                        Top Slot
                      </div>
                    }
                    canvasSlot={<div className="p-4">Focused Canvas Slot</div>}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "regions" && (
          <section className="space-y-8">
            <h2 className="text-2xl font-bold">Region Wrappers</h2>
            <p className="text-gray-600 mb-4">
              Each region acts as a strict composition boundary wrapping previous platforms.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "SessionRegion", Component: SessionRegion },
                { name: "PlayerRegion", Component: PlayerRegion },
                { name: "NavigationRegion", Component: NavigationRegion },
                { name: "TimerRegion", Component: TimerRegion },
                { name: "ReviewRegion", Component: ReviewRegion },
                { name: "ResultsRegion", Component: ResultsRegion },
                { name: "StatusRegion", Component: StatusRegion },
              ].map((region) => (
                <div
                  key={region.name}
                  className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center h-48 text-center text-gray-400 font-medium"
                >
                  <div className="text-indigo-600 mb-2 font-mono text-sm">{region.name}</div>
                  <div>Wraps its respective platform</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "stress" && (
          <section className="space-y-8">
            <h2 className="text-2xl font-bold">Stress Test (10 Delivery Workspaces)</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[300px] rounded-xl overflow-hidden border-2 border-red-100 shadow"
                >
                  <QuizDeliveryProvider
                    initialState={{
                      state: QuizDeliveryState.ACTIVE,
                      deliveryStage: QuizDeliveryStage.ACTIVE,
                      stagePresentation: MOCK_STAGE_PRESENTATION[QuizDeliveryStage.ACTIVE],
                    }}
                  >
                    <DeliveryShell />
                  </QuizDeliveryProvider>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
