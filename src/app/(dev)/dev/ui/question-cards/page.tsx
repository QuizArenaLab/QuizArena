"use client";

import React, { useState } from "react";
import {
  MCQCard,
  MSQCard,
  TrueFalseCard,
  FillBlankCard,
  MatchFollowingCard,
  SequenceCard,
  AssertionReasonCard,
  NumericalCard,
  SubjectiveCard,
  CodingCard,
  CaseStudyCard,
  ComprehensionCard,
  QuestionCard,
  QuestionCardHeader,
  QuestionCardBody,
  QuestionCardFooter,
  QuestionTitle,
  QuestionDescription,
  QuestionStatement,
  QuestionPassage,
  QuestionDifficultyBadge,
  QuestionStatusBadge,
  QuestionVisibilityBadge,
  QuestionTagGroup,
  QuestionOptions,
  QuestionOption,
  QuestionOptionLabel,
  QuestionOptionContent,
  QuestionExplanationPlaceholder,
  QuestionImagePlaceholder,
  QuestionCodePlaceholder,
} from "@/features/questions/client/components";

export default function QuestionCardsPlayground() {
  const [stressTest, setStressTest] = useState(false);

  // Generate 200 dummy cards
  const dummyCards = Array.from({ length: 200 }).map((_, i) => ({
    id: `card-${i}`,
    title: `Stress Test Card ${i + 1}`,
  }));

  // Generate 1000 dummy options
  const dummyOptions = Array.from({ length: 1000 }).map((_, i) => ({
    id: `opt-${i}`,
    label: `Option ${i + 1}`,
  }));

  const tags50 = Array.from({ length: 50 }).map((_, i) => `Tag-${i + 1}`);
  const options30 = Array.from({ length: 30 }).map((_, i) => ({
    id: `o-${i}`,
    label: `Option ${i + 1}`,
  }));

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="border-b border-border bg-card p-6">
        <h1 className="text-2xl font-bold">Enterprise Question Cards</h1>
        <p className="text-sm text-muted-foreground mt-1">FS-04.2 Core Presentation Architecture</p>

        <div className="mt-4 flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={stressTest}
              onChange={(e) => setStressTest(e.target.checked)}
              className="rounded border-input text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium">200-Card / 1000-Option Stress Test</span>
          </label>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-12">
        {!stressTest && (
          <>
            <section className="space-y-6">
              <h2 className="text-xl font-semibold border-b pb-2">Long Passage (Comprehension)</h2>
              <ComprehensionCard className="border rounded-lg p-4 bg-card shadow-sm">
                <QuestionCardHeader>
                  <QuestionTitle title="Reading Comprehension" />
                  <QuestionDifficultyBadge level="expert" />
                </QuestionCardHeader>
                <QuestionCardBody className="mt-4 space-y-4">
                  <QuestionPassage>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde
                    omnis iste natus error sit voluptatem accusantium doloremque laudantium.
                  </QuestionPassage>
                  <QuestionStatement>What is the central theme of the passage?</QuestionStatement>
                  <QuestionOptions>
                    <QuestionOption>
                      <QuestionOptionContent>Option 1</QuestionOptionContent>
                    </QuestionOption>
                    <QuestionOption>
                      <QuestionOptionContent>Option 2</QuestionOptionContent>
                    </QuestionOption>
                  </QuestionOptions>
                </QuestionCardBody>
              </ComprehensionCard>
            </section>

            <section className="space-y-6">
              <h2 className="text-xl font-semibold border-b pb-2">30 Options</h2>
              <MCQCard className="border rounded-lg p-4 bg-card shadow-sm">
                <QuestionCardHeader>
                  <QuestionTitle title="Massive Select" />
                </QuestionCardHeader>
                <QuestionCardBody className="mt-4">
                  <QuestionStatement>Select from the following 30 options:</QuestionStatement>
                  <QuestionOptions className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                    {options30.map((o) => (
                      <QuestionOption key={o.id}>
                        <QuestionOptionLabel>{o.id}</QuestionOptionLabel>
                        <QuestionOptionContent>{o.label}</QuestionOptionContent>
                      </QuestionOption>
                    ))}
                  </QuestionOptions>
                </QuestionCardBody>
              </MCQCard>
            </section>

            <section className="space-y-6">
              <h2 className="text-xl font-semibold border-b pb-2">50 Tags</h2>
              <QuestionCard className="border rounded-lg p-4 bg-card shadow-sm">
                <QuestionCardHeader>
                  <QuestionTitle title="Tag Overload" />
                </QuestionCardHeader>
                <QuestionCardFooter className="mt-4 border-t pt-4">
                  <QuestionTagGroup tags={tags50} />
                </QuestionCardFooter>
              </QuestionCard>
            </section>

            <section className="space-y-6">
              <h2 className="text-xl font-semibold border-b pb-2">
                Extremely Long Title & Missing Image
              </h2>
              <QuestionCard className="border rounded-lg p-4 bg-card shadow-sm">
                <QuestionCardHeader>
                  <QuestionTitle title="This is an extremely long title that just keeps going on and on because we want to test how the layout wraps and whether it breaks the flexbox containment or spills out of the boundaries of the card container unexpectedly." />
                </QuestionCardHeader>
                <QuestionCardBody className="mt-4">
                  <QuestionImagePlaceholder />
                  <QuestionStatement className="mt-4">
                    Identify the missing diagram above.
                  </QuestionStatement>
                </QuestionCardBody>
              </QuestionCard>
            </section>

            <section className="space-y-6">
              <h2 className="text-xl font-semibold border-b pb-2">
                Empty Explanation & Large Code Block
              </h2>
              <CodingCard className="border rounded-lg p-4 bg-card shadow-sm">
                <QuestionCardHeader>
                  <QuestionTitle title="Algorithm Optimization" />
                </QuestionCardHeader>
                <QuestionCardBody className="mt-4">
                  <QuestionCodePlaceholder />
                  <QuestionExplanationPlaceholder className="mt-4" />
                </QuestionCardBody>
              </CodingCard>
            </section>
          </>
        )}

        {stressTest && (
          <section className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2">200-Card Stress Test (CSS Grid)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {dummyCards.map((c, i) => (
                <QuestionCard
                  key={c.id}
                  className="border rounded-lg p-4 bg-card shadow-sm h-48 flex flex-col justify-between"
                >
                  <div>
                    <QuestionCardHeader>
                      <QuestionTitle title={c.title} />
                    </QuestionCardHeader>
                    <QuestionCardBody className="mt-2 text-sm text-muted-foreground">
                      Contains {i % 2 === 0 ? "MCQ" : "Subjective"} layout testing parameters.
                    </QuestionCardBody>
                  </div>
                  <QuestionCardFooter>
                    <QuestionStatusBadge status="published" />
                  </QuestionCardFooter>
                </QuestionCard>
              ))}
            </div>

            <h2 className="text-xl font-semibold border-b pb-2 mt-8">1000-Option Rendering Test</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
              {dummyOptions.map((o) => (
                <QuestionOption
                  key={o.id}
                  className="border rounded p-2 text-xs flex items-center justify-center bg-muted/20"
                >
                  {o.label}
                </QuestionOption>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
