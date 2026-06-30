import React from 'react';
import { useCompetitionStudioContext } from '../context/CompetitionStudioProvider';
import { useWorkspaceStatus } from '../status/WorkspaceStatusEngine';
import { StudioSearch } from '../search/StudioSearch';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { CommandPalette } from '../commands/CommandPalette';

export const HeaderRegion: React.FC = () => {
  const { competition, commandBus } = useCompetitionStudioContext();
  const status = useWorkspaceStatus((state) => state.status);

  return (
    <>
      <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <h1 className="font-semibold text-gray-900 truncate max-w-xs">
              {competition?.title || 'Untitled Competition'}
            </h1>
            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              {competition?.status || 'DRAFT'}
            </span>
          </div>
          <div className="hidden md:block border-l border-gray-200 pl-6">
            <StudioSearch />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-500 flex items-center space-x-2 mr-4">
            {status === 'SAVING' && <span className="text-blue-500">Saving...</span>}
            {status === 'READY' && <span className="text-green-500">Saved</span>}
          </div>
          <NotificationCenter />
          <button 
            onClick={() => commandBus.dispatch({ type: 'PreviewCompetition' })}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            Preview
          </button>
          <button 
            onClick={() => commandBus.dispatch({ type: 'UpdateMetadata' })}
            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Publish
          </button>
        </div>
      </header>
      <CommandPalette />
    </>
  );
};
