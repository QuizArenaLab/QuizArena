"use client";

import { useQuestionAuthoringStore } from "@/features/admin/store/question-authoring";
import {
  QUESTION_CATEGORIES,
  COMMON_SUBJECTS,
  LANGUAGE_OPTIONS,
  TAG_PRESETS,
  DIFFICULTY_CONFIG,
} from "@/features/admin/services/question-bank/constants";

export function MetadataStep() {
  const { formData, setFormData } = useQuestionAuthoringStore();

  const toggleTag = (tag: string) => {
    const currentTags = formData.tags || [];
    if (currentTags.includes(tag)) {
      setFormData({ tags: currentTags.filter((t) => t !== tag) });
    } else {
      if (currentTags.length < 20) {
        setFormData({ tags: [...currentTags, tag] });
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
              value={formData.category || ""}
              onChange={(e) => setFormData({ category: e.target.value })}
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
              value={formData.subject || ""}
              onChange={(e) => setFormData({ subject: e.target.value })}
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
              value={formData.topic || ""}
              onChange={(e) => setFormData({ topic: e.target.value })}
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
                  onClick={() => setFormData({ difficulty: key as any })}
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
              value={formData.language || "en"}
              onChange={(e) => setFormData({ language: e.target.value })}
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
                value={formData.marks ?? 1}
                onChange={(e) => setFormData({ marks: parseInt(e.target.value) || 1 })}
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
                value={formData.negativeMarks ?? 0}
                onChange={(e) => setFormData({ negativeMarks: parseFloat(e.target.value) || 0 })}
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
