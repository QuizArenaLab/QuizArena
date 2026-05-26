"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { createChallenge } from "@/actions/manage/challenge-management";
import { createChallengeSchema } from "@/lib/validations/challenge";

interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
  difficulty?: string;
  durationInMinutes?: string;
  totalQuestions?: string;
  totalMarks?: string;
}

export default function CreateChallengePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructions: "",
    category: "",
    difficulty: "MEDIUM",
    durationInMinutes: 30,
    totalQuestions: 25,
    totalMarks: 100,
    negativeMarking: false,
    negativeMarkPercentage: 0.25,
  });

  const validateForm = (): boolean => {
    try {
      createChallengeSchema.parse({
        title: formData.title,
        description: formData.description || undefined,
        instructions: formData.instructions || undefined,
        category: formData.category || undefined,
        difficulty: formData.difficulty,
        durationInMinutes: formData.durationInMinutes,
        totalQuestions: formData.totalQuestions,
        totalMarks: formData.totalMarks,
        negativeMarking: formData.negativeMarking,
        negativeMarkPercentage: formData.negativeMarkPercentage,
      });
      setErrors({});
      return true;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "issues" in error) {
        const zodError = error as { issues: Array<{ path: string[]; message: string }> };
        const newErrors: FormErrors = {};
        zodError.issues.forEach((issue) => {
          const field = issue.path[0] as keyof FormErrors;
          newErrors[field] = issue.message;
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
      const result = await createChallenge({
        title: formData.title,
        description: formData.description || undefined,
        instructions: formData.instructions || undefined,
        category: formData.category || undefined,
        difficulty: formData.difficulty,
        durationInMinutes: formData.durationInMinutes,
        totalQuestions: formData.totalQuestions,
        totalMarks: formData.totalMarks,
        negativeMarking: formData.negativeMarking,
        negativeMarkPercentage: formData.negativeMarkPercentage,
      });

      if (result.success && result.challengeId) {
        router.push(ROUTES.MODERATOR.CHALLENGE_EDIT(result.challengeId));
      } else {
        setErrors({ title: result.error || "Failed to create challenge" });
      }
    } catch {
      setErrors({ title: "An unexpected error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
            ? parseInt(value, 10)
            : value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link
          href={ROUTES.MODERATOR.CHALLENGES}
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
          Back to Challenges
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create Challenge</h1>
        <p className="text-sm text-gray-500 mt-1">Set up a new challenge for your users</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., SSC Daily Reasoning Challenge"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Brief description of the challenge..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="instructions"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Instructions
              </label>
              <textarea
                id="instructions"
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                rows={2}
                placeholder="Instructions for users attempting this challenge..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Category & Difficulty</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Exam Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="SSC">SSC</option>
                <option value="BANKING">Banking</option>
                <option value="RAILWAYS">Railways</option>
                <option value="STATE_PSC">State PSC</option>
              </select>
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty <span className="text-red-500">*</span>
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              >
                <option value="BEGINNER">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARDCORE">Hard</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Challenge Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="durationInMinutes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Duration (minutes) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="durationInMinutes"
                name="durationInMinutes"
                value={formData.durationInMinutes}
                onChange={handleChange}
                min={5}
                max={180}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              />
              {errors.durationInMinutes && (
                <p className="text-red-500 text-sm mt-1">{errors.durationInMinutes}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="totalQuestions"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Total Questions <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="totalQuestions"
                name="totalQuestions"
                value={formData.totalQuestions}
                onChange={handleChange}
                min={1}
                max={200}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              />
              {errors.totalQuestions && (
                <p className="text-red-500 text-sm mt-1">{errors.totalQuestions}</p>
              )}
            </div>

            <div>
              <label htmlFor="totalMarks" className="block text-sm font-medium text-gray-700 mb-1">
                Total Marks <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="totalMarks"
                name="totalMarks"
                value={formData.totalMarks}
                onChange={handleChange}
                min={1}
                max={1000}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              />
              {errors.totalMarks && (
                <p className="text-red-500 text-sm mt-1">{errors.totalMarks}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Scoring Rules</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="negativeMarking"
                name="negativeMarking"
                checked={formData.negativeMarking}
                onChange={handleChange}
                className="w-4 h-4 text-[#6366F1] border-gray-300 rounded focus:ring-[#6366F1]"
              />
              <label htmlFor="negativeMarking" className="text-sm font-medium text-gray-700">
                Enable negative marking
              </label>
            </div>

            {formData.negativeMarking && (
              <div>
                <label
                  htmlFor="negativeMarkPercentage"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Negative Mark Percentage
                </label>
                <select
                  id="negativeMarkPercentage"
                  name="negativeMarkPercentage"
                  value={formData.negativeMarkPercentage}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                >
                  <option value={0.25}>25% (0.25 marks per wrong answer)</option>
                  <option value={0.33}>33% (0.33 marks per wrong answer)</option>
                  <option value={0.5}>50% (0.50 marks per wrong answer)</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4">
          <Link
            href={ROUTES.MODERATOR.CHALLENGES}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-medium text-white bg-[#6366F1] rounded-lg hover:bg-[#4F46E5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Create Challenge"}
          </button>
        </div>
      </form>
    </div>
  );
}
