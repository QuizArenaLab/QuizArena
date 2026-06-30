import React from 'react';

/**
 * Live Coverage Panel
 * 
 * Visualizes the assessment coverage based on the current composition vs the selected requirements.
 * Recommends areas where more questions are needed.
 */
export const LiveCoveragePanel: React.FC = () => {
  const coverageData = [
    { label: 'Quantitative', percent: 70 },
    { label: 'Reasoning', percent: 90 },
    { label: 'English', percent: 40 },
    { label: 'Current Affairs', percent: 20 },
  ];

  return (
    <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Live Coverage</h3>
      <div className="space-y-3">
        {coverageData.map((item) => (
          <div key={item.label} className="flex flex-col">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-700">{item.label}</span>
              <span className="text-gray-500">{item.percent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${item.percent < 50 ? 'bg-orange-500' : 'bg-green-500'}`} 
                style={{ width: `${item.percent}%` }} 
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-blue-600 font-medium cursor-pointer hover:underline">
        View recommendations for weak areas &rarr;
      </div>
    </div>
  );
};
