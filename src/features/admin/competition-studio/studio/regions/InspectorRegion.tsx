import React from 'react';
import { InspectorRegistry } from '../registry/InspectorRegistry';

export const InspectorRegion: React.FC = () => {
  const panels = InspectorRegistry.getPanels();

  return (
    <aside className="w-80 border-l border-gray-200 bg-gray-50 flex flex-col shrink-0 overflow-y-auto">
      {panels.map(panel => {
        const PanelComponent = panel.component;
        return (
          <div key={panel.id} className="border-b border-gray-200">
            <div className="px-4 py-3 bg-gray-100/50 font-medium text-sm text-gray-700">
              {panel.title}
            </div>
            <div className="p-4">
              <PanelComponent />
            </div>
          </div>
        );
      })}
      {panels.length === 0 && (
        <div className="p-8 text-center text-sm text-gray-500">
          No inspector panels registered.
        </div>
      )}
    </aside>
  );
};
