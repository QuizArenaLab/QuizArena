import { QuestionRendererProps, rendererRegistry } from "../registry";
import { Check } from "lucide-react";

export function MultipleChoiceRenderer({ question, selectedOptionId, onSelectOption, isSubmitting }: QuestionRendererProps) {
  // Assume selectedOptionId is a comma-separated string of IDs for multiple choice
  const selectedIds = selectedOptionId ? selectedOptionId.split(",") : [];

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectOption(selectedIds.filter(i => i !== id).join(","));
    } else {
      onSelectOption([...selectedIds, id].join(","));
    }
  };

  return (
    <div className="space-y-3 max-w-3xl">
      {question.options.map((option: any) => {
        const isSelected = selectedIds.includes(option.id);
        return (
          <button
            key={option.id}
            onClick={() => handleToggle(option.id)}
            disabled={isSubmitting}
            className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
              isSelected
                ? "bg-blue-500/10 border-blue-500/50 text-white shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600"
            } ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            <div
              className={`mt-0.5 w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                isSelected ? "border-blue-500 bg-blue-500" : "border-slate-600"
              }`}
            >
              {isSelected && <Check className="w-4 h-4 text-white" />}
            </div>
            <div className="flex-1 text-base leading-relaxed pt-0.5">
              <span className="font-bold mr-2 text-slate-500">{option.displayLabel}.</span>
              {option.text}
            </div>
          </button>
        );
      })}
    </div>
  );
}

rendererRegistry.register("MULTIPLE_CHOICE", MultipleChoiceRenderer);
