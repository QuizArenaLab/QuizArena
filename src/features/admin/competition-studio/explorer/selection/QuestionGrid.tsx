"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { QuestionSearchRepository } from '../repositories/QuestionSearchRepository';
import { QuestionSearchResultDTO } from '../services/SearchScoringEngine';

/**
 * Question Grid
 * 
 * Virtualized rendering for 100k+ questions using @tanstack/react-virtual.
 */
export const QuestionGrid: React.FC = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  
  // This state would normally be managed by explorer.store.ts with useInfiniteQuery
  const [questions, setQuestions] = useState<QuestionSearchResultDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock fetch on mount
  useEffect(() => {
    const fetchInitial = async () => {
      setIsLoading(true);
      const res = await QuestionSearchRepository.searchQuestions({});
      setQuestions(res);
      setIsLoading(false);
    };
    fetchInitial();
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: questions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // estimated height of QuestionRow in px
    overscan: 5,
  });

  return (
    <div 
      ref={parentRef} 
      className="h-full w-full overflow-auto bg-gray-50 p-4 border rounded shadow-inner"
    >
      {isLoading && questions.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">Loading...</div>
      ) : (
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const question = questions[virtualRow.index];
            return (
              <div
                key={virtualRow.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                className="py-1"
              >
                {/* Question Row Component */}
                <div className="bg-white border border-gray-200 rounded p-4 h-full flex items-center justify-between hover:border-blue-300 transition-colors cursor-pointer group">
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-semibold text-gray-900 truncate">{question.title}</span>
                    <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                      <span className={`px-1.5 py-0.5 rounded ${question.difficulty === 'HARD' ? 'bg-red-100 text-red-800' : question.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {question.difficulty}
                      </span>
                      <span>•</span>
                      <span>Usage: {question.usageCount}</span>
                      <span>•</span>
                      <span className="text-blue-600 font-medium">Fit: 96%</span>
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-gray-100 hover:bg-blue-50 text-blue-600 text-xs font-medium rounded transition-all">
                    Select
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
