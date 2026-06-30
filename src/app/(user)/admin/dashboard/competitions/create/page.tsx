import React from 'react';
import LegacyWizardPage from './LegacyWizardPage';
import { CompetitionStudioKernel } from '@/features/admin/competition-studio';

export default function CreateCompetitionPage() {
  const isStudioEnabled = process.env.FEATURE_COMPETITION_STUDIO === 'true';

  if (isStudioEnabled) {
    return (
      <CompetitionStudioKernel>
        {/* Placeholder for the new Studio Wizard */}
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Competition Studio: Create</h1>
          <p className="text-gray-600">The new Studio Architecture is enabled.</p>
        </div>
      </CompetitionStudioKernel>
    );
  }

  return <LegacyWizardPage />;
}
