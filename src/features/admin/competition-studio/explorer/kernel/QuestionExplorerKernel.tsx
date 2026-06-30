import React from 'react';
import { ModuleRegistry } from '../../studio/registry/ModuleRegistry';
import { useCompetitionStudioContext } from '../../studio/context/CompetitionStudioProvider';

/**
 * Question Explorer Kernel
 * 
 * The main module for the Question Explorer Engine.
 * Supports multiple operating modes (Browse, Selection, Replace, etc.)
 */
export const QuestionExplorerKernel: React.FC = () => {
  const { eventBus } = useCompetitionStudioContext();

  React.useEffect(() => {
    eventBus.publish('ExplorerOpened');
  }, [eventBus]);

  return (
    <div className="flex h-full w-full bg-white text-gray-900">
      {/* Search and Filters Sidebar */}
      <aside className="w-80 border-r border-gray-200 bg-gray-50 p-4 flex flex-col gap-4 overflow-y-auto">
        <h2 className="font-semibold text-lg">Question Explorer</h2>
        <div className="bg-white p-3 rounded border border-gray-200 shadow-sm text-sm text-gray-500">
          Search Placeholder (Ctrl+K to focus)
        </div>
        <div className="bg-white p-3 rounded border border-gray-200 shadow-sm text-sm text-gray-500">
          Filters Placeholder
        </div>
        <div className="bg-white p-3 rounded border border-gray-200 shadow-sm text-sm text-gray-500">
          Coverage Panel Placeholder
        </div>
      </aside>

      {/* Main Results Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-14 border-b border-gray-200 flex items-center px-6 shrink-0 bg-white shadow-sm z-10">
          <h3 className="font-medium text-gray-700">Results</h3>
          <div className="ml-auto text-xs text-gray-500">Mode: Browse</div>
        </header>

        {/* Grid Area */}
        <div className="flex-1 overflow-auto bg-gray-50 p-6 relative">
          <div className="w-full max-w-5xl mx-auto space-y-4">
            <div className="p-12 text-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
              Virtualized Grid Placeholder (react-virtual)
            </div>
          </div>
        </div>

        {/* Selection Basket Footer */}
        <footer className="border-t border-gray-200 bg-white p-4 shadow-lg shrink-0 flex items-center justify-between">
          <div className="text-sm font-medium text-gray-700">Selection Basket: 0 Items</div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors disabled:opacity-50" disabled>
            Review Selection
          </button>
        </footer>
      </main>

      {/* Preview / Comparison Panel (Right side) */}
      <aside className="w-96 border-l border-gray-200 bg-white hidden xl:flex flex-col shrink-0">
        <header className="h-14 border-b border-gray-200 flex items-center px-4 font-medium text-gray-800">
          Preview
        </header>
        <div className="flex-1 p-4 text-center text-sm text-gray-400 flex items-center justify-center">
          Select a question to preview
        </div>
      </aside>
    </div>
  );
};

// Register the module with the Studio Kernel
ModuleRegistry.registerModule({
  id: 'question-explorer',
  label: 'Explorer',
  icon: 'Q', // Placeholder icon character
  component: QuestionExplorerKernel,
});
