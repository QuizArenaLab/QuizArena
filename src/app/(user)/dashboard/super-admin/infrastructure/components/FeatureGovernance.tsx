"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import { updateFeatureControl } from "@/features/super-admin/services/infrastructure/platform-controls";
import { INFRASTRUCTURE_KEYS, type InfrastructureKey } from "@/features/super-admin/services/infrastructure/keys";

interface FeatureState {
  enabled: boolean;
  message?: string;
}

interface FeatureGovernanceProps {
  features: {
    registration: FeatureState;
    challengeSystem: FeatureState;
    moderationWorkflows: FeatureState;
    analyticsSystem: FeatureState;
    leaderboard: FeatureState;
  };
}

export function FeatureGovernance({ features }: FeatureGovernanceProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleToggle = async (key: InfrastructureKey, currentState: boolean, name: string) => {
    const reason = window.prompt(`Provide an audit reason for toggling ${name}:`);
    if (!reason) return;

    setLoading(key);
    try {
      const res = await updateFeatureControl(key, { enabled: !currentState }, reason);
      if (!res.success) {
        alert(res.error || "Failed to update feature");
      }
    } catch {
      alert("An unexpected error occurred");
    } finally {
      setLoading(null);
    }
  };

  const featureList = [
    {
      id: INFRASTRUCTURE_KEYS.REGISTRATION_ENABLED,
      name: "New User Registration",
      description: "Allow new users to sign up for the platform.",
      state: features.registration.enabled,
    },
    {
      id: INFRASTRUCTURE_KEYS.CHALLENGE_SYSTEM_ENABLED,
      name: "Challenge System",
      description: "Allow users to start and submit new challenges.",
      state: features.challengeSystem.enabled,
    },
    {
      id: INFRASTRUCTURE_KEYS.MODERATION_WORKFLOWS_ENABLED,
      name: "Moderation Workflows",
      description: "Enable the question moderation and review pipelines.",
      state: features.moderationWorkflows.enabled,
    },
    {
      id: INFRASTRUCTURE_KEYS.ANALYTICS_SYSTEM_ENABLED,
      name: "Analytics Aggregation",
      description: "Run background analytics and performance aggregations.",
      state: features.analyticsSystem.enabled,
    },
    {
      id: INFRASTRUCTURE_KEYS.LEADERBOARD_ENABLED,
      name: "Global Leaderboards",
      description: "Show global rankings and competitive leaderboards.",
      state: features.leaderboard.enabled,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-[#0A1C40] flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-500" />
          Platform Feature Governance
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Toggle platform-wide features. Changes take effect immediately and are logged.
        </p>
      </div>
      <div className="divide-y divide-gray-100">
        {featureList.map((feature) => (
          <div
            key={feature.id}
            className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="pr-4">
              <h4 className="text-sm font-semibold text-gray-900">{feature.name}</h4>
              <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
            </div>
            <button
              onClick={() => handleToggle(feature.id, feature.state, feature.name)}
              disabled={loading === feature.id}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#E6701E] focus:ring-offset-2 disabled:opacity-50 ${
                feature.state ? "bg-green-500" : "bg-gray-200"
              }`}
            >
              <span className="sr-only">Toggle {feature.name}</span>
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  feature.state ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
