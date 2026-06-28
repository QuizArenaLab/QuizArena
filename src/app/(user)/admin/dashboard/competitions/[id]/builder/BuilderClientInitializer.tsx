"use client";

import { useEffect, useRef, useState } from "react";
import { useBuilderStore } from "@/features/admin/competition/builder/context/useBuilderStore";
import { BuilderHydrationData } from "@/features/admin/competition/builder/types/builder.types";
import { AssessmentBuilderLayout } from "@/features/admin/competition/builder/components/AssessmentBuilderLayout";
import { QuestionExplorerPanel } from "@/features/admin/competition/builder/components/panels/QuestionExplorerPanel";
import { AssessmentCanvasPanel } from "@/features/admin/competition/builder/components/panels/AssessmentCanvasPanel";
import { CompetitionSummaryPanel } from "@/features/admin/competition/builder/components/panels/CompetitionSummaryPanel";

interface Props {
  hydrationData: BuilderHydrationData;
}

export function BuilderClientInitializer({ hydrationData }: Props) {
  const { hydrate } = useBuilderStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (!hydratedRef.current) {
      hydrate(hydrationData);
      hydratedRef.current = true;
      setIsHydrated(true);
    }
  }, [hydrate, hydrationData]);

  if (!isHydrated) {
    return <div className="flex-1 flex items-center justify-center p-8 text-gray-500">Initializing builder...</div>;
  }

  return (
    <AssessmentBuilderLayout
      leftPanel={<QuestionExplorerPanel />}
      centerPanel={<AssessmentCanvasPanel />}
      rightPanel={<CompetitionSummaryPanel />}
      previewPanel={
        <div className="flex items-center justify-center h-full text-gray-500 font-medium">
          Preview Mode Active (Student View Simulation)
        </div>
      }
    />
  );
}
