import React, { useEffect } from 'react';
import { ModuleRegistry } from '../../studio/registry/ModuleRegistry';
import { useCompetitionStudioContext } from '../../studio/context/CompetitionStudioProvider';
import { useReadinessStore } from '../stores/readiness.store';

/**
 * Competition Readiness Kernel
 * 
 * Orchestrates the Readiness Engine UI, displaying the final 
 * Readiness Score, Blocking Tree, and the Publish Eligibility.
 */
export const CompetitionReadinessKernel: React.FC = () => {
  const { eventBus, commandBus } = useCompetitionStudioContext();
  const { currentSnapshot, domainScores } = useReadinessStore();

  useEffect(() => {
    // Listen to Fingerprint changes to evaluate readiness
    const unsubscribe = eventBus.subscribe('FingerprintChanged', (payload) => {
      // Typically, this would enqueue a run to the ReadinessPipeline
      console.log('Readiness Kernel detected Fingerprint update:', payload);
    });

    return unsubscribe;
  }, [eventBus]);

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200 overflow-y-auto w-full">
      <header className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col shrink-0 space-y-2">
        <h2 className="font-semibold text-lg text-gray-800">Publish Readiness</h2>
        
        {/* Overall Readiness Score */}
        <div className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Overall Score</span>
            <div className="text-2xl font-bold text-gray-800">
              {currentSnapshot ? currentSnapshot.overallScore : 'Pending'}
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
              {currentSnapshot?.decision || 'EVALUATING'}
            </span>
          </div>
        </div>
      </header>

      <main className="p-4 flex-1 space-y-4">
        {/* Domain Scores */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Domain Readiness</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 border border-gray-100 bg-gray-50 rounded">
              <span className="text-gray-500 block mb-1">Metadata</span>
              <span className="font-medium text-gray-800">{domainScores.metadata}/100</span>
            </div>
            <div className="p-2 border border-gray-100 bg-gray-50 rounded">
              <span className="text-gray-500 block mb-1">Composition</span>
              <span className="font-medium text-gray-800">{domainScores.composition}/100</span>
            </div>
            {/* More domains... */}
          </div>
        </section>

        {/* Blocking Tree Placeholder */}
        <section className="border border-red-100 bg-red-50/30 rounded-lg p-3">
          <h3 className="text-sm font-semibold text-red-800 mb-2">Blocking Issues (Tree)</h3>
          <ul className="text-xs text-red-700 space-y-1 font-mono">
            <li>└─ Publishing</li>
            <li className="pl-2">└─ Configuration</li>
            <li className="pl-4">└─ ⚠ Duration Missing (Section 1)</li>
          </ul>
        </section>

        {/* Publish Impact Preview Placeholder */}
        <section className="border border-blue-100 bg-blue-50/30 rounded-lg p-3">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Publish Impact Preview</h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>✓ Version Freeze</li>
            <li>✓ Generate Runtime Snapshot</li>
            <li>✓ Initialize Leaderboard</li>
          </ul>
        </section>
      </main>

      <footer className="p-4 border-t border-gray-100 shrink-0 bg-white">
        <button 
          className="w-full py-2 bg-black text-white rounded font-medium text-sm hover:bg-gray-800 disabled:opacity-50"
          onClick={() => commandBus.dispatch({ type: 'EvaluateReadiness' })}
        >
          Publish Version
        </button>
      </footer>
    </div>
  );
};

// Register the module with the Studio Kernel
ModuleRegistry.registerModule({
  id: 'competition-readiness',
  label: 'Readiness',
  icon: 'R', // Placeholder icon
  component: CompetitionReadinessKernel,
});
