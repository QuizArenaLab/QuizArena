import { QuestionRendererProps, rendererRegistry } from "../registry";

export function TrueFalseRenderer({ question, selectedOptionId, onSelectOption, isSubmitting }: QuestionRendererProps) {
  return (
    <div className="space-y-3 max-w-xl">
      {["True", "False"].map((value) => {
        const isSelected = selectedOptionId === value;
        return (
          <button
            key={value}
            onClick={() => onSelectOption(value)}
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center p-4 rounded-xl border font-bold transition-all ${
              isSelected
                ? "bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600"
            } ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            {value}
          </button>
        );
      })}
    </div>
  );
}

rendererRegistry.register("TRUE_FALSE", TrueFalseRenderer);
