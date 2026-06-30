import React from 'react';

/**
 * Explorer Health Summary
 * 
 * Displays repository statistics updated live.
 */
export const ExplorerHealthSummary: React.FC = () => {
  const stats = [
    { label: 'Available', value: '102,450', color: 'text-gray-900' },
    { label: 'Healthy', value: '89,200', color: 'text-green-600' },
    { label: 'Needs Review', value: '4,100', color: 'text-orange-500' },
    { label: 'Archived', value: '8,000', color: 'text-gray-400' },
    { label: 'Duplicates', value: '350', color: 'text-red-500' },
  ];

  return (
    <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Repository Health</h3>
      <div className="grid grid-cols-2 gap-3">
        {stats.map(stat => (
          <div key={stat.label} className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">{stat.label}</span>
            <span className={`text-sm font-semibold ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
