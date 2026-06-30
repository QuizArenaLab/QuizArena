"use client";

import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { CommandBus } from '../bus/CommandBus';
import { EventBus } from '../bus/EventBus';
import { useWorkspaceStatus } from '../status/WorkspaceStatusEngine';
import { CompetitionDTO } from '@/shared/types/competition.dto';

interface CompetitionStudioContextValue {
  competitionId: string;
  competition?: CompetitionDTO;
  // Expose buses for hooks to use easily if needed, though they are singletons
  commandBus: typeof CommandBus;
  eventBus: typeof EventBus;
}

const CompetitionStudioContext = createContext<CompetitionStudioContextValue | undefined>(undefined);

export interface CompetitionStudioProviderProps {
  competitionId: string;
  initialCompetition?: CompetitionDTO;
  children: ReactNode;
}

/**
 * CompetitionStudioProvider
 * 
 * Wraps the entire Studio.
 * Provides Kernel, Command Bus, Event Bus, Workspace Status, Navigation, and Current Competition.
 * Every module consumes this Provider.
 */
export const CompetitionStudioProvider: React.FC<CompetitionStudioProviderProps> = ({
  competitionId,
  initialCompetition,
  children
}) => {
  const setStatus = useWorkspaceStatus((state) => state.setStatus);

  useEffect(() => {
    // Initialize studio
    setStatus('READY');
    EventBus.publish('StudioOpened', { competitionId });
    
    return () => {
      // Cleanup
    };
  }, [competitionId, setStatus]);

  const value: CompetitionStudioContextValue = {
    competitionId,
    competition: initialCompetition,
    commandBus: CommandBus,
    eventBus: EventBus,
  };

  return (
    <CompetitionStudioContext.Provider value={value}>
      {children}
    </CompetitionStudioContext.Provider>
  );
};

export const useCompetitionStudioContext = () => {
  const context = useContext(CompetitionStudioContext);
  if (context === undefined) {
    throw new Error('useCompetitionStudioContext must be used within a CompetitionStudioProvider');
  }
  return context;
};
