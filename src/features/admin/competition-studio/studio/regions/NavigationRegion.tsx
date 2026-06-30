import React, { useEffect, useState } from 'react';
import { ModuleRegistry } from '../registry/ModuleRegistry';
import { useCompetitionStudioContext } from '../context/CompetitionStudioProvider';

export const NavigationRegion: React.FC = () => {
  const { commandBus, eventBus } = useCompetitionStudioContext();
  const [activeId, setActiveId] = useState<string | null>(null);

  const modules = ModuleRegistry.getAllModules();

  useEffect(() => {
    const unsubscribe = eventBus.subscribe('NavigationChanged', (event) => {
      if (event.payload?.moduleId) {
        setActiveId(event.payload.moduleId);
      }
    });
    return unsubscribe;
  }, [eventBus]);

  return (
    <aside className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col shrink-0">
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {modules.map((mod) => (
          <button
            key={mod.id}
            onClick={() => commandBus.dispatch({ type: 'NavigateStudio', payload: { moduleId: mod.id } })}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeId === mod.id
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
            }`}
          >
            {/* Placeholder for actual icon rendering */}
            <span className="w-5 h-5 mr-3 flex items-center justify-center bg-gray-300 rounded text-[10px] text-white">
              {mod.icon.charAt(0)}
            </span>
            {mod.label}
          </button>
        ))}
        {modules.length === 0 && (
          <div className="text-sm text-gray-500 p-2">No modules registered.</div>
        )}
      </nav>
    </aside>
  );
};
