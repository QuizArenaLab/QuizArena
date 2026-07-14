'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CompetitionDTO } from '@/features/competitions/types/dto';
import { use } from 'react';

export default function CompetitionDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [competition, setCompetition] = useState<CompetitionDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompetition = () => {
    setLoading(true);
    fetch(`/api/admin/competitions/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch competition');
        return res.json();
      })
      .then((data) => setCompetition(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCompetition();
  }, [id]);

  const handlePublish = async () => {
    setError(null);
    try {
      const res = await fetch(`/api/admin/competitions/${id}/publish`, {
        method: 'POST',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to publish');
      }
      fetchCompetition(); // Refresh data
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!competition) return <div>Not Found</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Competition Detail: {competition.title}</h1>
      <button onClick={() => router.push('/admin/competitions')} style={{ marginBottom: '20px' }}>Back to List</button>
      
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <p><strong>ID:</strong> {competition.id}</p>
        <p><strong>Slug:</strong> {competition.slug}</p>
        <p><strong>Type:</strong> {competition.competitionType}</p>
        <p><strong>State:</strong> {competition.lifecycleState}</p>
        <p><strong>Status:</strong> {competition.status}</p>
        <p><strong>Duration:</strong> {competition.durationMinutes} minutes</p>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        {competition.lifecycleState === 'DRAFT' && (
          <button 
            onClick={handlePublish} 
            style={{ backgroundColor: 'green', color: 'white', padding: '10px' }}
          >
            Publish Competition
          </button>
        )}
      </div>
    </div>
  );
}
