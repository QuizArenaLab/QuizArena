"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { QuestionNode } from '../engine/CompositionEngine';
import { MultiSelectionEngine } from '../selection/MultiSelectionEngine';

interface QuestionBlockProps {
  question: QuestionNode;
}

/**
 * Question Block
 * 
 * A dnd-kit Sortable item. Displays inline warnings (Duplicate, Inactive, Low Health, etc.).
 */
export const QuestionBlock: React.FC<QuestionBlockProps> = ({ question }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: question.id,
    data: { type: 'Question', question }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

  const handleSelect = (e: React.MouseEvent) => {
    MultiSelectionEngine.select(question.id, 'QUESTION', e.shiftKey || e.ctrlKey || e.metaKey);
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      onClick={handleSelect}
      className={`bg-white border rounded p-3 mb-2 flex items-center shadow-sm transition-all cursor-pointer hover:border-blue-300 ${isDragging ? 'shadow-lg border-blue-500' : 'border-gray-200'}`}
    >
      <div {...attributes} {...listeners} className="cursor-grab text-gray-300 hover:text-gray-500 mr-3 p-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path></svg>
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-800">Question ID: {question.questionId}</span>
          <div className="flex space-x-2 text-xs font-medium">
            <span className="text-gray-500">{question.marks} Marks</span>
            <span className="text-red-500">-{question.negativeMarks}</span>
          </div>
        </div>
        
        {/* Inline Intelligence Indicators */}
        {question.marks === 0 && (
          <div className="mt-1 text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded w-fit border border-orange-100 flex items-center">
            <span className="mr-1">⚠</span> Missing marks allocation
          </div>
        )}
      </div>
    </div>
  );
};
