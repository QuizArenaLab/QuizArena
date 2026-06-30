import React from 'react';
import { CompetitionStudioProvider } from '../context/CompetitionStudioProvider';
import { HeaderRegion } from '../regions/HeaderRegion';
import { NavigationRegion } from '../regions/NavigationRegion';
import { WorkspaceRegion } from '../regions/WorkspaceRegion';
import { InspectorRegion } from '../regions/InspectorRegion';
import { StatusRegion } from '../regions/StatusRegion';

interface CompetitionStudioKernelProps {
  competitionId?: string;
  children?: React.ReactNode;
}

/**
 * CompetitionStudioKernel
 * 
 * Central orchestration module for Competition Studio.
 * Everything in the studio enters through this kernel.
 */
export const CompetitionStudioKernel: React.FC<CompetitionStudioKernelProps> = ({
  competitionId,
}) => {
  if (!competitionId) {
    return <div>Error: No Competition ID provided.</div>;
  }

  return (
    <CompetitionStudioProvider competitionId={competitionId}>
      <div className="flex flex-col h-screen w-full bg-white text-gray-900 overflow-hidden font-sans">
        <HeaderRegion />
        
        <div className="flex flex-1 overflow-hidden">
          <NavigationRegion />
          <WorkspaceRegion />
          <InspectorRegion />
        </div>
        
        <StatusRegion />
      </div>
    </CompetitionStudioProvider>
  );
};
