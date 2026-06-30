import React, { useEffect, useState } from 'react';
import { useCompetitionStudioContext } from '../context/CompetitionStudioProvider';

/**
 * Command Palette
 * 
 * Triggered by Ctrl/Cmd + K
 * Provides a unified quick-action interface for all Studio commands.
 */
export const CommandPalette: React.FC = () => {
  const { commandBus } = useCompetitionStudioContext();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/20">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center">
          <input 
            type="text" 
            autoFocus
            placeholder="Search commands or data..." 
            className="w-full text-lg outline-none bg-transparent placeholder-gray-400 text-gray-900"
          />
        </div>
        <div className="p-2 text-sm text-gray-500 max-h-64 overflow-y-auto">
          <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Commands</div>
          <button 
            className="w-full text-left px-3 py-2 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors flex items-center"
            onClick={() => { commandBus.dispatch({ type: 'PreviewCompetition' }); setIsOpen(false); }}
          >
            Preview Competition
          </button>
          <button 
            className="w-full text-left px-3 py-2 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors flex items-center"
            onClick={() => { commandBus.dispatch({ type: 'UpdateMetadata' }); setIsOpen(false); }}
          >
            Publish Settings
          </button>
        </div>
      </div>
    </div>
  );
};
