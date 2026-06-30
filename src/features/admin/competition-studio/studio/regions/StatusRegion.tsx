import React from 'react';
import { useWorkspaceStatus } from '../status/WorkspaceStatusEngine';

export const StatusRegion: React.FC = () => {
  const status = useWorkspaceStatus(state => state.status);
  
  return (
    <footer className="h-8 border-t border-gray-200 bg-white flex items-center justify-between px-4 shrink-0 text-xs text-gray-500">
      <div className="flex items-center space-x-4">
        <span>Workspace: {status}</span>
        {/* Placeholder for Edit Lock indicator */}
        <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div> Lock Acquired</span>
      </div>
      <div className="flex items-center space-x-4">
        <span>Version: Draft (v1)</span>
        <span>Online</span>
      </div>
    </footer>
  );
};
