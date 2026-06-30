import React, { useState } from 'react';

interface BulkPreviewControllerProps {
  questionIds: string[];
  onClose: () => void;
}

/**
 * Bulk Preview Controller
 * 
 * Allows previewing multiple selected questions.
 * Navigates using Previous/Next without closing preview.
 */
export const BulkPreviewController: React.FC<BulkPreviewControllerProps> = ({ questionIds, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!questionIds || questionIds.length === 0) return null;

  const handleNext = () => {
    if (currentIndex < questionIds.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col">
      <header className="h-14 border-b border-gray-200 flex items-center justify-between px-4 shrink-0 bg-gray-50">
        <div className="font-medium text-gray-700">
          Previewing {currentIndex + 1} of {questionIds.length}
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handlePrev} 
            disabled={currentIndex === 0}
            className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Prev
          </button>
          <button 
            onClick={handleNext} 
            disabled={currentIndex === questionIds.length - 1}
            className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
          <div className="w-4" />
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            Close (Esc)
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-3xl mx-auto bg-white border border-gray-200 shadow-sm rounded-lg p-8">
          <h2 className="text-xl font-bold mb-4">Question ID: {questionIds[currentIndex]}</h2>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-400">
            Preview Content (Lazy Loaded)
          </div>
        </div>
      </div>
    </div>
  );
};
