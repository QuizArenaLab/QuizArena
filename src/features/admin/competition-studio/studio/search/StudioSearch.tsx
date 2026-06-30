import React from 'react';

/**
 * Studio Search
 * 
 * Future global search infrastructure (Questions, Sections, Settings).
 * Currently a placeholder UI.
 */
export const StudioSearch: React.FC = () => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {/* Search icon placeholder */}
        <span className="text-gray-400 text-xs">🔍</span>
      </div>
      <input
        type="text"
        placeholder="Search (Ctrl+K)"
        className="block w-64 pl-10 pr-3 py-1.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition duration-150 ease-in-out"
        readOnly // ReadOnly in this phase, actual search logic deferred
      />
    </div>
  );
};
