"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { createQuestion } from "@/actions/manage/question-management";
import { COMMON_SUBJECTS, createQuestionSchema } from "@/lib/validations/question";
import { cn } from "@/lib/utils";

interface Option {
  id: string;
  optionText: string;
  isCorrect: boolean;
  order: number;
}

interface FormErrors {
  question?: string;
  subject?: string;
  options?: string;
  general?: string;
}

export default function CreateQuestionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    question: "",
    explanation: "",
    subject: "",
    topic: "",
    difficulty: "MEDIUM",
    marks: 1,
    negativeMarks: 0,
  });
  const [options, setOptions] = useState<Option[]>([
    { id: "1", optionText: "", isCorrect: false, order: 0 },
    { id: "2", optionText: "", isCorrect: false, order: 1 },
    { id: "3", optionText: "", isCorrect: false, order: 2 },
    { id: "4", optionText: "", isCorrect: false, order: 3 },
  ]);

  const validateForm = (): boolean => {
    try {
      createQuestionSchema.parse({
        ...formData,
        options: options.map((opt) => ({
          optionText: opt.optionText,
          isCorrect: opt.isCorrect,
          order: opt.order,
        })),
      });
      setErrors({});
      return true;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "issues" in error) {
        const zodError = error as { issues: Array<{ path: string[]; message: string }> };
        const newErrors: FormErrors = {};
        zodError.issues.forEach((issue) => {
          const field = issue.path[0] as keyof FormErrors;
          if (field === "options") {
            newErrors.options = issue.message;
          } else {
            newErrors[field] = issue.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await createQuestion({
        question: formData.question,
        explanation: formData.explanation || undefined,
        subject: formData.subject,
        topic: formData.topic || undefined,
        difficulty: formData.difficulty,
        language: "en",
        marks: formData.marks,
        negativeMarks: formData.negativeMarks,
        options: options.map((opt) => ({
          optionText: opt.optionText,
          isCorrect: opt.isCorrect,
          order: opt.order,
        })),
      });

      if (result.success && result.questionId) {
        router.push(ROUTES.MODERATOR.QUESTION_EDIT(result.questionId));
      } else {
        setErrors({ general: result.error || "Failed to create question" });
      }
    } catch {
      setErrors({ general: "An unexpected error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOptionChange = (id: string, value: string) => {
    setOptions((prev) => prev.map((opt) => (opt.id === id ? { ...opt, optionText: value } : opt)));
  };

  const handleCorrectChange = (id: string) => {
    setOptions((prev) =>
      prev.map((opt) => ({
        ...opt,
        isCorrect: opt.id === id,
      }))
    );
  };

  const addOption = () => {
    if (options.length >= 6) return;
    const newId = String(Date.now());
    setOptions((prev) => [
      ...prev,
      { id: newId, optionText: "", isCorrect: false, order: prev.length },
    ]);
  };

  const removeOption = (id: string) => {
    if (options.length <= 2) return;
    setOptions((prev) =>
      prev.filter((opt) => opt.id !== id).map((opt, idx) => ({ ...opt, order: idx }))
    );
  };

  const correctCount = options.filter((opt) => opt.isCorrect).length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href={ROUTES.MODERATOR.QUESTIONS}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Questions
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create Question</h1>
        <p className="text-sm text-gray-500 mt-1">Add a new question to your question bank</p>
      </div>

      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Question Details</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                Question Statement <span className="text-red-500">*</span>
              </label>
              <textarea
                id="question"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                rows={4}
                placeholder="Enter your question here..."
                className={cn(
                  "w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent",
                  errors.question ? "border-red-500" : "border-gray-300"
                )}
              />
              {errors.question && <p className="text-red-500 text-sm mt-1">{errors.question}</p>}
            </div>

            <div>
              <label htmlFor="explanation" className="block text-sm font-medium text-gray-700 mb-1">
                Explanation
              </label>
              <textarea
                id="explanation"
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                rows={3}
                placeholder="Explain the correct answer..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Options</h2>
          <p className="text-sm text-gray-500 mb-4">
            Select the radio button next to the correct answer
          </p>

          {errors.options && <p className="text-red-500 text-sm mb-4">{errors.options}</p>}

          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={option.id} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="correct-answer"
                  checked={option.isCorrect}
                  onChange={() => handleCorrectChange(option.id)}
                  className="w-4 h-4 text-[#6366F1] border-gray-300 focus:ring-[#6366F1]"
                  disabled={correctCount > 0 && !option.isCorrect && correctCount >= 1}
                />
                <span className="text-sm font-medium text-gray-700 w-8">
                  {String.fromCharCode(65 + index)}.
                </span>
                <input
                  type="text"
                  value={option.optionText}
                  onChange={(e) => handleOptionChange(option.id, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(option.id)}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          {options.length < 6 && (
            <button
              type="button"
              onClick={addOption}
              className="mt-4 text-sm text-[#6366F1] hover:text-[#4F46E5] font-medium"
            >
              + Add Option
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Classification & Scoring</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject <span className="text-red-500">*</span>
              </label>
              <select
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className={cn(
                  "w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent",
                  errors.subject ? "border-red-500" : "border-gray-300"
                )}
              >
                <option value="">Select subject</option>
                {COMMON_SUBJECTS.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
              </select>
              {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
            </div>

            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                Topic
              </label>
              <input
                type="text"
                id="topic"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g., Percentage, Algebra"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                id="difficulty"
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              >
                <option value="BEGINNER">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARDCORE">Hard</option>
              </select>
            </div>

            <div>
              <label htmlFor="marks" className="block text-sm font-medium text-gray-700 mb-1">
                Marks
              </label>
              <input
                type="number"
                id="marks"
                value={formData.marks}
                onChange={(e) =>
                  setFormData({ ...formData, marks: parseInt(e.target.value, 10) || 1 })
                }
                min={1}
                max={10}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="negativeMarks"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Negative Marks
              </label>
              <select
                id="negativeMarks"
                value={formData.negativeMarks}
                onChange={(e) =>
                  setFormData({ ...formData, negativeMarks: parseFloat(e.target.value) })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              >
                <option value={0}>No negative marks</option>
                <option value={0.25}>25%</option>
                <option value={0.33}>33%</option>
                <option value={0.5}>50%</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4">
          <Link
            href={ROUTES.MODERATOR.QUESTIONS}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-medium text-white bg-[#6366F1] rounded-lg hover:bg-[#4F46E5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Create Question"}
          </button>
        </div>
      </form>
    </div>
  );
}
