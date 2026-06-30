import React, { useEffect } from 'react';
import { ModuleRegistry } from '../../studio/registry/ModuleRegistry';
import { useCompetitionStudioContext } from '../../studio/context/CompetitionStudioProvider';

/**
 * Assessment Intelligence Kernel
 * 
 * Orchestrates the Intelligence Pipeline when compositions update.
 * Renders the Intelligence Inspector Dashboards (Health, Coverage, Risk).
 */
export const AssessmentIntelligenceKernel: React.FC = () => {
  const { eventBus } = useCompetitionStudioContext();

  useEffect(() => {
    // Listen to Composition updates and feed them to the Intelligence Queue
    const unsubscribe = eventBus.subscribe('CompositionUpdated', (payload) => {
      // In full implementation, this forwards to IntelligencePipelineQueue
      console.log('Intelligence Kernel detected composition update:', payload);
    });

    return unsubscribe;
  }, [eventBus]);

  return (
    <div className="flex h-full w-full bg-white flex-col p-4 space-y-4 overflow-y-auto border-l border-gray-200">
      <header className="border-b border-gray-100 pb-3 mb-2">
        <h2 className="font-semibold text-lg text-gray-800">Intelligence</h2>
        <p className="text-xs text-gray-500">Live Assessment Analytics</p>
      </header>

      {/* Health Score Summary */}
      <div className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="font-medium text-blue-900">Health Score</h3>
          <p className="text-sm text-blue-700">Healthy</p>
        </div>
        <div className="text-3xl font-bold text-blue-600">92</div>
      </div>

      {/* Risks */}
      <div className="border border-red-100 bg-red-50/50 rounded-lg p-3">
        <h3 className="text-sm font-semibold text-red-800 mb-1">Operational Risks</h3>
        <ul className="text-xs text-red-600 space-y-1">
          <li>⚠ Section 2 is oversized (15 questions)</li>
        </ul>
      </div>

      {/* Recommendations */}
      <div className="border border-amber-100 bg-amber-50/50 rounded-lg p-3">
        <h3 className="text-sm font-semibold text-amber-800 mb-1">Recommendations</h3>
        <ul className="text-xs text-amber-700 space-y-1">
          <li>✨ Add 2 Medium difficulty questions (98% Conf)</li>
        </ul>
      </div>

      {/* Coverage Mini Chart Placeholder */}
      <div className="border border-gray-200 rounded-lg p-3 bg-white">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Topic Coverage</h3>
        <div className="h-24 bg-gray-50 flex items-center justify-center text-xs text-gray-400 rounded">
          Coverage Matrix
        </div>
      </div>
    </div>
  );
};

// Register the module with the Studio Kernel
ModuleRegistry.registerModule({
  id: 'assessment-intelligence',
  label: 'Intelligence',
  icon: 'I', // Placeholder icon character
  component: AssessmentIntelligenceKernel,
});
