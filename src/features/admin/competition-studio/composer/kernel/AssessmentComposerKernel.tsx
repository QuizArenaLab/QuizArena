import React, { useEffect } from 'react';
import { ModuleRegistry } from '../../studio/registry/ModuleRegistry';
import { useCompetitionStudioContext } from '../../studio/context/CompetitionStudioProvider';

/**
 * Assessment Composer Kernel
 * 
 * The main module for the Assessment Composer Engine.
 * Provides the visual workspace for organizing questions and sections.
 */
export const AssessmentComposerKernel: React.FC = () => {
  const { eventBus } = useCompetitionStudioContext();

  useEffect(() => {
    // Publish a generic loaded event (or specific ones as per architecture)
    // eventBus.publish('ComposerOpened');
  }, [eventBus]);

  return (
    <div className="flex h-full w-full bg-white text-gray-900 overflow-hidden">
      {/* Section Navigator (Left Sidebar) */}
      <aside className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col shrink-0">
        <header className="h-14 border-b border-gray-200 flex items-center px-4 font-semibold text-gray-700">
          Sections
        </header>
        <div className="flex-1 p-4 text-sm text-gray-500 text-center flex items-center justify-center">
          Section List Placeholder
        </div>
      </aside>

      {/* Main Canvas Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-gray-100">
        <header className="h-14 border-b border-gray-200 flex items-center px-6 shrink-0 bg-white shadow-sm z-10 justify-between">
          <h3 className="font-medium text-gray-700">Assessment Canvas</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">
              Add Section
            </button>
            <button className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">
              Add Question
            </button>
          </div>
        </header>

        {/* Canvas Scroll Area */}
        <div className="flex-1 overflow-auto p-8 relative">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-12 text-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg bg-white">
              Composer Canvas Placeholder (dnd-kit)
            </div>
          </div>
        </div>
      </main>

      {/* Inspector / Analytics Panel (Right side) */}
      <aside className="w-80 border-l border-gray-200 bg-white flex flex-col shrink-0">
        <header className="h-14 border-b border-gray-200 flex items-center px-4 font-medium text-gray-800">
          Inspector
        </header>
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm text-gray-600 text-center">
            Composition Analytics Placeholder
          </div>
          <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm text-gray-600 text-center">
            Health Score Placeholder
          </div>
        </div>
      </aside>
    </div>
  );
};

// Register the module with the Studio Kernel
ModuleRegistry.registerModule({
  id: 'assessment-composer',
  label: 'Composer',
  icon: 'C', // Placeholder icon character
  component: AssessmentComposerKernel,
});
