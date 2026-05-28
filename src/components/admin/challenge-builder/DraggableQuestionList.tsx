"use client";

import { useState, useEffect } from "react";
import { GripVertical } from "lucide-react";
import { reorderChallengeQuestions } from "@/actions/challenge-builder";
import toast from "react-hot-toast";

export default function DraggableQuestionList({ challenge }: { challenge: any }) {
  const [items, setItems] = useState(challenge.questions);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(challenge.questions);
  }, [challenge.questions]);

  const onDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
    // For visual ghost
    const target = e.target as HTMLElement;
    e.dataTransfer.setDragImage(target, 20, 20);
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;

    const newItems = [...items];
    const draggedItem = newItems[draggedIdx];
    newItems.splice(draggedIdx, 1);
    newItems.splice(index, 0, draggedItem);

    setDraggedIdx(index);
    setItems(newItems);
  };

  const onDrop = async () => {
    if (draggedIdx === null) return;
    setDraggedIdx(null);

    // Save new order to backend
    const questionIds = items.map((item: any) => item.questionId);
    setIsSaving(true);
    const res = await reorderChallengeQuestions({ challengeId: challenge.id, questionIds });
    setIsSaving(false);

    if (!res.success) {
      toast.error(res.error || "Failed to save order");
      setItems(challenge.questions); // revert
    } else {
      toast.success("Order saved");
    }
  };

  if (items.length === 0) {
    return (
      <div className="p-8 text-center border rounded-lg bg-card text-muted-foreground">
        No questions selected.
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${isSaving ? "opacity-50 pointer-events-none" : ""}`}>
      {items.map((item: any, index: number) => {
        const q = item.question;
        return (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDragEnd={onDrop}
            className="flex items-center p-3 border rounded-md bg-card shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground mr-3 cursor-grab" />
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground mb-1">
                  Q{index + 1}
                </span>
                <span className="text-xs border px-2 py-0.5 rounded-full">{q.difficulty}</span>
              </div>
              <p className="text-sm font-medium line-clamp-1">{q.question}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
