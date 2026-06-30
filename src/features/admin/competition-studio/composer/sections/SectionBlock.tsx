"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SectionNode } from '../engine/CompositionEngine';
import { QuestionBlock } from '../questions/QuestionBlock';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface SectionBlockProps {
  section: SectionNode;
}

/**
 * Section Block
 * 
 * A dnd-kit Sortable container for a Section.
 * Holds multiple Question Blocks.
 */
export const SectionBlock: React.FC<SectionBlockProps> = ({ section }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: section.id,
    data: { type: 'Section', section }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <header 
        className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50 rounded-t-lg"
      >
        <div className="flex items-center space-x-3">
          <div {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600">
            {/* Drag Handle Icon */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path></svg>
          </div>
          <h2 className="font-semibold text-lg text-gray-800">{section.title}</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-xs text-gray-500 font-medium">{section.questions.length} Questions</div>
          {/* Inline Intelligence Indicator */}
          {section.questions.length === 0 && (
            <div className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 flex items-center">
              <span className="mr-1">⚠</span> Empty Section
            </div>
          )}
        </div>
      </header>
      
      <div className="p-4 min-h-[100px] bg-gray-50/50">
        <SortableContext 
          items={section.questions.map(q => q.id)} 
          strategy={verticalListSortingStrategy}
        >
          {section.questions.map(q => (
            <QuestionBlock key={q.id} question={q} />
          ))}
          {section.questions.length === 0 && (
            <div className="text-center text-sm text-gray-400 py-8 border-2 border-dashed border-gray-200 rounded">
              Drag questions here
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};
