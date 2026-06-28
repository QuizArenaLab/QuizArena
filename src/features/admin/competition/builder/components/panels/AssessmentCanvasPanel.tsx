"use client";

import { useBuilderStore } from "../../context/useBuilderStore";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { GripVertical, Plus, Settings2, Trash2, ChevronDown } from "lucide-react";
import { useState } from "react";
import { BuilderQuestion } from "../../types/builder.types";

export function AssessmentCanvasPanel() {
  const { sections, sectionOrder, questions, moveQuestion, removeQuestion } = useBuilderStore();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index)
      return;

    moveQuestion(draggableId, destination.droppableId, destination.index);
  };

  // Group questions by section
  const sectionQuestions = sectionOrder.reduce(
    (acc, sectionId) => {
      acc[sectionId] = Object.values(questions)
        .filter((q) => q.sectionId === sectionId)
        .sort((a, b) => a.displayOrder - b.displayOrder);
      return acc;
    },
    {} as Record<string, BuilderQuestion[]>
  );

  // Also handle questions that are in a 'default' section if no sections exist yet
  const defaultQuestions = Object.values(questions)
    .filter((q) => q.sectionId === "default" || !q.sectionId)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white z-10 shadow-sm">
        <h2 className="text-sm font-bold text-gray-800">Assessment Document</h2>
        <button className="px-3 py-1.5 text-xs font-bold text-orange-700 bg-orange-100 hover:bg-orange-200 rounded-lg flex items-center gap-1.5 transition-colors">
          <Plus className="w-3.5 h-3.5" />
          Add Section
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
        <DragDropContext onDragEnd={onDragEnd}>
          {/* Default Section (if any questions exist without explicit sections) */}
          {defaultQuestions.length > 0 && (
            <div className="mb-8">
              <Droppable droppableId="default">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`space-y-3 min-h-[100px] p-2 rounded-xl transition-colors ${snapshot.isDraggingOver ? "bg-orange-50/50 border-2 border-dashed border-orange-200" : ""}`}
                  >
                    {defaultQuestions.map((q, index) => (
                      <QuestionRow
                        key={q.id}
                        question={q}
                        index={index}
                        onRemove={() => removeQuestion(q.id)}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          )}

          {/* Sections */}
          {sectionOrder.map((sectionId, sectionIndex) => {
            const section = sections[sectionId];
            const qs = sectionQuestions[sectionId] || [];
            const isExpanded = expandedSections[sectionId] !== false;

            return (
              <div
                key={sectionId}
                className="mb-6 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
              >
                <div
                  className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setExpandedSections((prev) => ({ ...prev, [sectionId]: !isExpanded }))
                  }
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-md bg-white border border-gray-200 shadow-sm">
                      <GripVertical className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-800">
                        Section {sectionIndex + 1}: {section?.title}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">
                        {qs.length} Questions • {qs.reduce((sum, q) => sum + q.config.marks, 0)}{" "}
                        Marks
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                </div>

                {isExpanded && (
                  <Droppable droppableId={sectionId}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`p-4 space-y-3 min-h-[100px] transition-colors ${snapshot.isDraggingOver ? "bg-orange-50/30" : ""}`}
                      >
                        {qs.map((q, index) => (
                          <QuestionRow
                            key={q.id}
                            question={q}
                            index={index}
                            onRemove={() => removeQuestion(q.id)}
                          />
                        ))}
                        {provided.placeholder}

                        {qs.length === 0 && !snapshot.isDraggingOver && (
                          <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm font-medium">
                            Drag questions here or click &quot;Insert&quot;
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                )}
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
}

function QuestionRow({
  question,
  index,
  onRemove,
}: {
  question: BuilderQuestion;
  index: number;
  onRemove: () => void;
}) {
  return (
    <Draggable draggableId={question.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...(provided.draggableProps as any)}
          className={`flex items-start gap-3 p-3 bg-white border rounded-xl transition-all ${snapshot.isDragging ? "border-orange-500 shadow-lg scale-[1.02] z-50" : "border-gray-200 hover:border-gray-300 shadow-sm"}`}
        >
          <div
            {...provided.dragHandleProps}
            className="mt-1 flex items-center justify-center w-6 h-6 rounded-md hover:bg-gray-100 text-gray-400 cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-gray-500">Q{index + 1}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${question.original.difficulty === "BEGINNER" ? "bg-green-50 text-green-700" : question.original.difficulty === "MEDIUM" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}
              >
                {question.original.difficulty}
              </span>
              {question.config.isBonus && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-700">
                  BONUS
                </span>
              )}
            </div>
            <p className="text-sm text-gray-800 font-medium line-clamp-2 leading-relaxed">
              {question.original.question}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                defaultValue={question.config.marks}
                className="w-12 h-7 text-xs font-bold text-center bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none"
              />
              <span className="text-xs font-bold text-gray-400">M</span>
            </div>

            <div className="flex items-center gap-1">
              <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                <Settings2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onRemove}
                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
