import React from 'react';

export default function GovernanceWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <header className="flex items-center justify-between bg-indigo-900 px-6 py-4 text-white shadow-md">
        <div className="flex items-center gap-4">
          <div className="text-xl font-bold tracking-tight">Competition Governance Platform</div>
          <div className="rounded bg-indigo-800 px-2 py-1 text-xs font-medium text-indigo-100">SA-05 Command Center</div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-gray-200 bg-white p-4 overflow-y-auto">
          <nav className="space-y-1">
            <NavItem href="/governance/workspace" label="Dashboard" />
            <NavItem href="/governance/workspace/competitions" label="Competitions" />
            <NavItem href="/governance/workspace/reviews" label="Reviews" />
            <NavItem href="/governance/workspace/approvals" label="Approvals" />
            <NavItem href="/governance/workspace/scheduling" label="Scheduling" />
            <NavItem href="/governance/workspace/freeze" label="Freeze" />
            <NavItem href="/governance/workspace/publishing" label="Publishing" />
            <NavItem href="/governance/workspace/deployments" label="Deployments" />
            <NavItem href="/governance/workspace/health" label="Runtime Health" />
            <NavItem href="/governance/workspace/timeline" label="Timeline" />
            <NavItem href="/governance/workspace/reports" label="Reports" />
            <NavItem href="/governance/workspace/audit" label="Audit" />
            <NavItem href="/governance/workspace/policies" label="Policies" />
            <NavItem href="/governance/workspace/emergency" label="Emergency Center" className="text-red-600 hover:bg-red-50" />
            <NavItem href="/governance/workspace/certification" label="Certification" />
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
