import React from 'react';

export default function ReportingWorkspace() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Enterprise Reporting & Data Governance Workspace</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Core Reporting */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Reporting</h2>
          <ul className="space-y-2">
            <li><a href="#" className="text-blue-600 hover:underline">Dashboard</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">Reports</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">Builder</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">Templates</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">Registry</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">Scheduler</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">Exports</a></li>
          </ul>
        </section>

        {/* Compliance & Governance */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Governance</h2>
          <ul className="space-y-2">
            <li><a href="#" className="text-blue-600 hover:underline">Compliance</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">Governance</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">Datasets</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">Retention</a></li>
          </ul>
        </section>

        {/* Audit & API */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Audit & API</h2>
          <ul className="space-y-2">
            <li><a href="#" className="text-blue-600 hover:underline">Evidence</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">Audit</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">API</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">History</a></li>
          </ul>
        </section>

        {/* System */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">System</h2>
          <ul className="space-y-2">
            <li><a href="#" className="text-blue-600 hover:underline">Settings</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
