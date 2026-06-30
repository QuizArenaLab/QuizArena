"use client";

import React, { useEffect, useState } from 'react';
import { ModuleRegistry } from './ModuleRegistry';
import { useCompetitionStudioContext } from '../context/CompetitionStudioProvider';

export const WorkspaceModuleLoader: React.FC = () => {
  const { eventBus } = useCompetitionStudioContext();
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  useEffect(() => {
    // Listen for navigation changes to load the correct module
    const unsubscribe = eventBus.subscribe('NavigationChanged', (event) => {
      if (event.payload?.moduleId) {
        setActiveModuleId(event.payload.moduleId);
      }
    });

    return unsubscribe;
  }, [eventBus]);

  if (!activeModuleId) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-gray-50 text-gray-400">
        <p>No composition created yet.</p>
      </div>
    );
  }

  const activeModule = ModuleRegistry.getModule(activeModuleId);

  if (!activeModule) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-gray-50 text-red-400">
        <p>Module "{activeModuleId}" not found.</p>
      </div>
    );
  }

  const ModuleComponent = activeModule.component;

  return (
    <div className="workspace-module-container h-full w-full overflow-auto">
      <ModuleComponent />
    </div>
  );
};
