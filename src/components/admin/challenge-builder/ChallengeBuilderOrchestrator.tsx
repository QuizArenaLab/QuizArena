"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, Save } from "lucide-react";
import { saveChallengeDraft } from "@/actions/challenge-builder";
import toast from "react-hot-toast";
import QuestionDiscoveryPanel from "./QuestionDiscoveryPanel";
import BalancingMetrics from "./BalancingMetrics";
import DraggableQuestionList from "./DraggableQuestionList";
import ChallengePreviewer from "./ChallengePreviewer";
import { Button } from "@/components/ui/button"; // Assuming standard UI exists
import { cn } from "@/lib/utils"; // Assuming utils exists

const STEPS = [
  { id: "metadata", title: "Metadata" },
  { id: "selection", title: "Question Selection" },
  { id: "balancing", title: "Balancing" },
  { id: "ordering", title: "Ordering & Preview" },
];

export default function ChallengeBuilderOrchestrator({ challenge }: { challenge: any }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSaveDraft = async () => {
    setIsSaving(true);
    const res = await saveChallengeDraft(challenge.id);
    setIsSaving(false);
    if (res.success) {
      toast.success("Draft saved successfully");
      router.push("/dashboard/admin/challenges");
    } else {
      toast.error(res.error || "Failed to save draft");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      {/* Header & Stepper */}
      <div className="border-b px-6 py-4 flex items-center justify-between bg-card">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold">{challenge.title} (Draft)</h1>
          <p className="text-sm text-muted-foreground">Challenge Builder Workspace</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            Save & Exit
          </Button>
        </div>
      </div>

      <div className="px-6 py-4 border-b bg-muted/20">
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center space-x-8">
            {STEPS.map((step, index) => {
              const isCurrent = currentStep === index;
              const isPast = currentStep > index;

              return (
                <li key={step.id} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(index)}
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium transition-colors",
                      isCurrent
                        ? "border-primary bg-primary text-primary-foreground"
                        : isPast
                          ? "border-primary bg-primary/20 text-primary"
                          : "border-muted-foreground/30 text-muted-foreground"
                    )}
                  >
                    {isPast ? <Check className="w-4 h-4" /> : index + 1}
                  </button>
                  <span
                    className={cn(
                      "ml-3 text-sm font-medium",
                      isCurrent || isPast ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                  {index !== STEPS.length - 1 && <div className="ml-8 w-12 h-px bg-border" />}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-background p-6">
        {currentStep === 0 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="text-lg font-medium">Challenge Metadata</h2>
              <p className="text-sm text-muted-foreground">Basic information and rules.</p>
            </div>
            {/* Implement generic metadata form here. Placeholder for now as the prompt focuses on composition. */}
            <div className="p-4 border rounded-lg bg-card text-muted-foreground text-sm">
              Metadata form: Title, Category, Duration, Instructions. (Skipped deep implementation
              of this specific step to focus on composition engine as requested)
            </div>
            <Button onClick={() => setCurrentStep(1)}>Continue to Selection</Button>
          </div>
        )}

        {currentStep === 1 && <QuestionDiscoveryPanel challenge={challenge} />}

        {currentStep === 2 && (
          <div className="max-w-4xl mx-auto space-y-6">
            <BalancingMetrics challenge={challenge} />
            <div className="flex justify-end">
              <Button onClick={() => setCurrentStep(3)}>Approve & Continue</Button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            <div className="flex flex-col space-y-4">
              <h2 className="text-lg font-medium">Question Ordering</h2>
              <p className="text-sm text-muted-foreground">Drag to arrange deterministic order.</p>
              <DraggableQuestionList challenge={challenge} />
            </div>
            <div className="flex flex-col space-y-4 border-l pl-8">
              <h2 className="text-lg font-medium">Simulation Preview</h2>
              <p className="text-sm text-muted-foreground">Test runtime visibility.</p>
              <ChallengePreviewer challenge={challenge} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
