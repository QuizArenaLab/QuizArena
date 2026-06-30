import React from 'react';
import LegacyBuilderPage from './LegacyBuilderPage';
import { CompetitionStudioKernel } from '@/features/admin/competition-studio';

export default async function BuilderPageWrapper({ params }: { params: Promise<{ id: string }> }) {
  const isStudioEnabled = process.env.FEATURE_COMPETITION_STUDIO === 'true';

  if (isStudioEnabled) {
    const { id } = await params;
    return (
      <CompetitionStudioKernel competitionId={id}>
        {/* Placeholder for the new Studio Composer */}
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Competition Studio: Composer</h1>
          <p className="text-gray-600">The new Studio Architecture is enabled for ID: {id}.</p>
        </div>
      </CompetitionStudioKernel>
    );
  }

  return <LegacyBuilderPage params={params} />;
}
