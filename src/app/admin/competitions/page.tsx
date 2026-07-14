'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CompetitionDTO } from '@/features/competitions/types/dto';

export default function CompetitionsList() {
  const [competitions, setCompetitions] = useState<CompetitionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/competitions')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch competitions');
        return res.json();
      })
      .then((data) => {
        setCompetitions(data.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Competitions</h1>
      <Link href="/admin/competitions/new">
        <button style={{ marginBottom: '20px' }}>Create New Competition</button>
      </Link>
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Title</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Slug</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Type</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>State</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {competitions.map((comp) => (
            <tr key={comp.id}>
              <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{comp.title}</td>
              <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{comp.slug}</td>
              <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{comp.competitionType}</td>
              <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{comp.lifecycleState}</td>
              <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                <Link href={`/admin/competitions/${comp.id}`}>
                  <button>View/Edit</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
