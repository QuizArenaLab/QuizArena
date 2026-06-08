"use client";

import { useFormContext } from "react-hook-form";
import {
  QUESTION_CATEGORIES,
  COMMON_SUBJECTS,
  LANGUAGE_OPTIONS,
  TAG_PRESETS,
  DIFFICULTY_CONFIG,
} from "@/features/admin/services/question-bank/constants";

export function MetadataStep() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const formData = watch();

  const toggleTag = (tag: string) => {
    const currentTags = formData.tags || [];
    if (currentTags.includes(tag)) {
      setValue(
        "tags",
        currentTags.filter((t: string) => t !== tag),
        { shouldValidate: true, shouldDirty: true }
      );
    } else {
      if (currentTags.length < 20) {
        setValue("tags", [...currentTags, tag], { shouldValidate: true, shouldDirty: true });
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">
          Classification
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              {...register("category")}
              className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white ${errors.category ? "border-red-300" : "border-gray-300"}`}
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
              {...register("subject")}
              className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white ${errors.subject ? "border-red-300" : "border-gray-300"}`}
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
              {...register("topic")}
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
                  onClick={() =>
                    setValue("difficulty", key as any, { shouldValidate: true, shouldDirty: true })
                  }
                  className={`flex-1 px-3 py-2.5 text-sm font-semibold rounded-xl border-2 transition-all ${
                    formData.difficulty === key
                      ? "shadow-sm"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                  style={
                    formData.difficulty === key
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
              {...register("language")}
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
                {...register("marks", { valueAsNumber: true })}
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
                {...register("negativeMarks", { valueAsNumber: true })}
                min={0}
                max={1}
                step={0.25}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {TAG_PRESETS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                (formData.tags || []).includes(tag)
                  ? "bg-indigo-50 text-indigo-700 border-indigo-300"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
