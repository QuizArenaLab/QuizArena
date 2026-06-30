import React from 'react';
import { WorkspaceModuleLoader } from '../registry/WorkspaceModuleLoader';

export const WorkspaceRegion: React.FC = () => {
  return (
    <main className="flex-1 min-w-0 bg-white relative overflow-hidden flex flex-col">
      <WorkspaceModuleLoader />
    </main>
  );
};
