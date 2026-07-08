import React from 'react';

export default function GovernanceHealthPage() {
  const healthMetrics = [
    { name: 'Authoring', score: 100 },
    { name: 'Freeze', score: 100 },
    { name: 'Deployment', score: 98 },
    { name: 'Runtime', score: 100 },
    { name: 'Submission', score: 100 },
    { name: 'Results', score: 100 },
    { name: 'Leaderboard', score: 100 },
    { name: 'Revenue', score: 100 },
    { name: 'Certificates', score: 99 },
    { name: 'Notifications', score: 100 },
    { name: 'Operations', score: 100 },
    { name: 'Platform', score: 100 },
  ];

  const overallScore = Math.round(healthMetrics.reduce((acc, m) => acc + m.score, 0) / healthMetrics.length);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Competition Health Center</h1>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-medium text-gray-700">Platform-Wide Health Aggregation</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Overall Score</span>
            <span className={`text-3xl font-bold ${overallScore >= 99 ? 'text-green-600' : 'text-yellow-600'}`}>
              {overallScore}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {healthMetrics.map(metric => (
            <div key={metric.name} className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-sm font-medium text-gray-500 mb-2">{metric.name}</span>
              <span className={`text-xl font-semibold ${metric.score === 100 ? 'text-green-600' : 'text-yellow-600'}`}>
                {metric.score}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
