import { QuestionAuthoringWizard } from "@/components/question-bank/authoring/QuestionAuthoringWizard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Question | Question Bank",
  description: "Create a new governed question",
};

export default function CreateQuestionPage() {
  return (
    <div className="mx-auto space-y-6">
      <QuestionAuthoringWizard />
    </div>
  );
}
