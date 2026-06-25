"use client";

import React, { useState } from "react";
import { PrimaryOperationalCards } from "./PrimaryOperationalCards";
import { OperationalQueueTable } from "./OperationalQueueTable";

interface OperationsCenterClientProps {
  initialMetrics: any;
  initialIssues: any[];
}

export function OperationsCenterClient({ initialMetrics, initialIssues }: OperationsCenterClientProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [issues, setIssues] = useState(initialIssues);
  const [metrics, setMetrics] = useState(initialMetrics);
  const [isLoading, setIsLoading] = useState(false);

  const fetchIssues = async (filter?: string | null) => {
    setIsLoading(true);
    try {
      const url = new URL(window.location.origin + "/api/admin/operations/issues");
      if (filter) url.searchParams.set("issueType", filter);
      const res = await fetch(url.toString());
      const data = await res.json();
      setIssues(data.issues);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAll = async () => {
    try {
      const res = await fetch("/api/admin/operations/metrics");
      const metricsData = await res.json();
      setMetrics(metricsData);
      await fetchIssues(activeFilter);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectFilter = (filter: string) => {
    if (activeFilter === filter) {
      setActiveFilter(null);
      fetchIssues(null);
    } else {
      setActiveFilter(filter);
      fetchIssues(filter);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold mb-4 tracking-tight">Question Operations Center</h2>
        <PrimaryOperationalCards 
          metrics={metrics} 
          onSelectFilter={handleSelectFilter} 
          activeFilter={activeFilter} 
        />
      </section>

      <section>
        <OperationalQueueTable 
          issues={issues} 
          onRefresh={refreshAll} 
          isLoading={isLoading} 
        />
      </section>
    </div>
  );
}
