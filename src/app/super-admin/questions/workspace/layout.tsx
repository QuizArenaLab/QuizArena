import React from 'react';

export default function QuestionWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <header className="flex items-center justify-between bg-zinc-900 px-6 py-4 text-white shadow-md">
        <div className="flex items-center gap-4">
          <div className="text-xl font-bold tracking-tight">Question Intelligence Platform</div>
          <div className="rounded bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-100">SA-09 Content Governance</div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-gray-200 bg-white p-4 overflow-y-auto">
          <nav className="space-y-1">
            <NavItem href="/super-admin/questions/workspace" label="Dashboard" />
            <NavItem href="/super-admin/questions/workspace/library" label="Library" />
            <NavItem href="/super-admin/questions/workspace/builder" label="Builder" />
            <NavItem href="/super-admin/questions/workspace/review" label="Review" />
            <NavItem href="/super-admin/questions/workspace/certification" label="Certification" />
            <NavItem href="/super-admin/questions/workspace/blueprints" label="Blueprints" />
            <NavItem href="/super-admin/questions/workspace/collections" label="Collections" />
            <NavItem href="/super-admin/questions/workspace/media" label="Media" />
            <NavItem href="/super-admin/questions/workspace/analytics" label="Analytics" />
            <NavItem href="/super-admin/questions/workspace/recommendations" label="Recommendations" />
            <NavItem href="/super-admin/questions/workspace/coverage" label="Coverage" />
            <NavItem href="/super-admin/questions/workspace/reports" label="Reports" />
            <NavItem href="/super-admin/questions/workspace/audit" label="Audit" />
            <NavItem href="/super-admin/questions/workspace/settings" label="Settings" />
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({ href, label, className = '' }: { href: string; label: string; className?: string }) {
  return (
    <a
      href={href}
      className={`block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 ${className}`}
    >
      {label}
    </a>
  );
}
