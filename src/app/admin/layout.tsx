import React from 'react';
import { GlobalSearchUI } from '../../platform/components/GlobalSearchUI';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col">
      <GlobalSearchUI />
      <header className="border-b border-gray-800 bg-gray-950 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          QuizArena Admin Platform
        </h1>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <div className="mr-4 text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded flex items-center gap-1 border border-gray-700">
            <span>Press</span> <kbd className="font-mono text-gray-200">⌘K</kbd> <span>to search</span>
          </div>
          <a href="/admin/operations" className="text-gray-300 hover:text-white transition-colors">Operations</a>
          <a href="/admin/users" className="text-gray-300 hover:text-white transition-colors">Users & Roles</a>
          <a href="/admin/audit" className="text-gray-300 hover:text-white transition-colors">Audit Explorer</a>
          <a href="/admin/settings" className="text-gray-300 hover:text-white transition-colors">Settings</a>
        </nav>
      </header>
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
