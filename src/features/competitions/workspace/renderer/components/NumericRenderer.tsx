import { QuestionRendererProps, rendererRegistry } from "../registry";
import { useState, useEffect } from "react";

export function NumericRenderer({ question, selectedOptionId, onSelectOption, isSubmitting }: QuestionRendererProps) {
  const [value, setValue] = useState(selectedOptionId || "");

  useEffect(() => {
    setValue(selectedOptionId || "");
  }, [selectedOptionId]);

  const handleBlur = () => {
    if (value !== selectedOptionId) {
      onSelectOption(value);
    }
  };

  return (
    <div className="max-w-md">
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        disabled={isSubmitting}
        placeholder="Enter your numerical answer..."
        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}

rendererRegistry.register("NUMERIC", NumericRenderer);
