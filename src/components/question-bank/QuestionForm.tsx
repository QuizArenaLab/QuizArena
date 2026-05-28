"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createQuestion } from "@/actions/question-bank";
import {
  QUESTION_CATEGORIES,
  COMMON_SUBJECTS,
  LANGUAGE_OPTIONS,
  TAG_PRESETS,
  DIFFICULTY_CONFIG,
} from "@/lib/question-bank/constants";
import { Plus, Trash2, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface OptionInput {
  optionText: string;
  isCorrect: boolean;
  order: number;
}

export function QuestionForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [question, setQuestion] = useState("");
  const [explanation, setExplanation] = useState("");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<string>("MEDIUM");
  const [language, setLanguage] = useState("en");
  const [marks, setMarks] = useState(1);
  const [negativeMarks, setNegativeMarks] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [options, setOptions] = useState<OptionInput[]>([
    { optionText: "", isCorrect: false, order: 0 },
    { optionText: "", isCorrect: false, order: 1 },
    { optionText: "", isCorrect: false, order: 2 },
    { optionText: "", isCorrect: false, order: 3 },
  ]);

  const addOption = () => {
    if (options.length >= 6) return;
    setOptions([...options, { optionText: "", isCorrect: false, order: options.length }]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions.map((opt, i) => ({ ...opt, order: i })));
  };

  const updateOption = (index: number, field: string, value: string | boolean) => {
    const newOptions = [...options];
    if (field === "isCorrect") {
      // Only one correct answer
      newOptions.forEach((opt, i) => {
        opt.isCorrect = i === index;
      });
    } else {
      newOptions[index] = { ...newOptions[index], [field]: value };
    }
    setOptions(newOptions);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setWarning(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const result = await createQuestion({
        question,
        explanation: explanation || undefined,
        category,
        subject,
        topic: topic || undefined,
        difficulty,
        language,
        marks,
        negativeMarks,
        tags: selectedTags,
        options,
      });

      if (result.success) {
        setSuccess(`Question created successfully! Code: ${result.questionCode}`);
        if (result.warning) {
          setWarning(result.warning);
        }
        setTimeout(() => {
          router.push("/dashboard/admin/question-bank");
          router.refresh();
        }, 1500);
      } else {
        setError(result.error || "Failed to create question");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Status Messages */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      {warning && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-700">{warning}</p>
        </div>
      )}
      {success && (
        <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
          <p className="text-sm text-emerald-700">{success}</p>
        </div>
      )}

      {/* Section: Classification */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">
          Classification
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              <option value="">Select category</option>
              {QUESTION_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Subject <span className="text-red-500">*</span>
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              <option value="">Select subject</option>
              {COMMON_SUBJECTS.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Compound Interest"
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Difficulty <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDifficulty(key)}
                  className={`flex-1 px-3 py-2.5 text-sm font-semibold rounded-xl border-2 transition-all ${
                    difficulty === key
                      ? "shadow-sm"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                  style={
                    difficulty === key
                      ? {
                          borderColor: config.color,
                          backgroundColor: config.bgColor,
                          color: config.color,
                        }
                      : undefined
                  }
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              {LANGUAGE_OPTIONS.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Marks</label>
              <input
                type="number"
                value={marks}
                onChange={(e) => setMarks(parseInt(e.target.value) || 1)}
                min={1}
                max={10}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Negative Marks
              </label>
              <input
                type="number"
                value={negativeMarks}
                onChange={(e) => setNegativeMarks(parseFloat(e.target.value) || 0)}
                min={0}
                max={1}
                step={0.25}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section: Tags */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {TAG_PRESETS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                selectedTags.includes(tag)
                  ? "bg-indigo-50 text-indigo-700 border-indigo-300"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Section: Question Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">
          Question Content
        </h3>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Question <span className="text-red-500">*</span>
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              rows={4}
              minLength={10}
              maxLength={2000}
              placeholder="Enter the question text…"
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
            />
            <p className="text-[11px] text-gray-400 mt-1 text-right">{question.length}/2000</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Explanation</label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={3}
              maxLength={3000}
              placeholder="Provide a detailed explanation for the correct answer…"
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
            />
          </div>
        </div>
      </div>

      {/* Section: Options */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Answer Options
          </h3>
          <span className="text-xs text-gray-400">Select the correct answer</span>
        </div>

        <div className="space-y-3">
          {options.map((opt, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                opt.isCorrect
                  ? "border-emerald-300 bg-emerald-50/50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <button
                type="button"
                onClick={() => updateOption(index, "isCorrect", true)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  opt.isCorrect
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-white" />}
              </button>

              <span className="text-xs font-bold text-gray-400 w-6 text-center shrink-0">
                {String.fromCharCode(65 + index)}
              </span>

              <input
                type="text"
                value={opt.optionText}
                onChange={(e) => updateOption(index, "optionText", e.target.value)}
                required
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              />

              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {options.length < 6 && (
          <button
            type="button"
            onClick={addOption}
            className="mt-3 flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Option
          </button>
        )}
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-indigo-600 to-violet-600 rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Creating…" : "Create Question"}
        </button>
      </div>
    </form>
  );
}
