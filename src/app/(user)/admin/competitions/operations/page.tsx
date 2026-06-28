import { prisma } from '@/lib/prisma';
import { CompetitionLifecycle } from '@/generated/prisma';
import Link from 'next/link';

export default async function OperationsDashboard({
  searchParams,
}: {
  searchParams: { tab?: string; page?: string; q?: string };
}) {
  const tab = searchParams.tab || 'upcoming';
  const page = parseInt(searchParams.page || '1', 10);
  const q = searchParams.q || '';
  const take = 20;
  const skip = (page - 1) * take;

  const getLifecycleState = (tab: string) => {
    switch (tab) {
      case 'upcoming': return { in: [CompetitionLifecycle.READY, CompetitionLifecycle.SCHEDULED] };
      case 'live': return { equals: CompetitionLifecycle.LIVE };
      case 'completed': return { equals: CompetitionLifecycle.COMPLETED };
      case 'archived': return { equals: CompetitionLifecycle.ARCHIVED };
      case 'cancelled': return { equals: CompetitionLifecycle.CANCELLED };
      default: return { in: [CompetitionLifecycle.READY, CompetitionLifecycle.SCHEDULED] };
    }
  };

  const where = {
    lifecycleState: getLifecycleState(tab),
    ...(q ? { title: { contains: q, mode: 'insensitive' as const } } : {})
  };

  const [competitions, total] = await Promise.all([
    prisma.competition.findMany({
      where,
      take,
      skip,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.competition.count({ where })
  ]);

  const tabs = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'live', label: 'Live' },
    { id: 'completed', label: 'Completed' },
    { id: 'archived', label: 'Archived' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Operations Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage competition lifecycles, health, and emergencies.</p>
        </div>
      </div>

      <div className="flex gap-4 border-b mb-6 pb-2">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={`?tab=${t.id}`}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              tab === t.id
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="flex justify-between mb-4">
        <form className="flex gap-2">
          <input type="hidden" name="tab" value={tab} />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search competitions..."
            className="px-4 py-2 border rounded-md"
          />
          <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
            Search
          </button>
        </form>
      </div>

      <div className="border rounded-md">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Status</th>
              <th className="p-4">Health</th>
              <th className="p-4">Readiness</th>
              <th className="p-4">Starts At</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {competitions.map((comp) => (
              <tr key={comp.id} className="border-t">
                <td className="p-4 font-medium">{comp.title}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-secondary rounded-full text-xs">
                    {comp.lifecycleState}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${comp.healthStatus === 'CRITICAL' ? 'bg-red-100 text-red-800' : comp.healthStatus === 'WARNING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {comp.healthStatus}
                  </span>
                </td>
                <td className="p-4">{comp.readinessScore}%</td>
                <td className="p-4">{comp.startsAt ? new Date(comp.startsAt).toLocaleDateString() : 'N/A'}</td>
                <td className="p-4">
                  <button className="text-blue-600 hover:underline">Manage</button>
                </td>
              </tr>
            ))}
            {competitions.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  No competitions found in this state.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-muted-foreground">
          Showing {competitions.length} of {total} results
        </p>
        <div className="flex gap-2">
          {page > 1 && (
            <Link href={`?tab=${tab}&page=${page - 1}${q ? `&q=${q}` : ''}`} className="px-3 py-1 border rounded hover:bg-muted">
              Previous
            </Link>
          )}
          {skip + take < total && (
            <Link href={`?tab=${tab}&page=${page + 1}${q ? `&q=${q}` : ''}`} className="px-3 py-1 border rounded hover:bg-muted">
              Next
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
