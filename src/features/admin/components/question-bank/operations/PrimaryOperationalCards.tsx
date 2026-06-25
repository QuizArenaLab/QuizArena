"use client";

import React from "react";
import { 
  AlertTriangle, 
  HelpCircle, 
  FileText, 
  Copy, 
  Activity, 
  Clock, 
  CheckCircle,
  EyeOff
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface OperationsDashboardMetrics {
  missingExplanations: number;
  duplicateCandidates: number;
  highReports: number;
  lowConfidence: number;
  unused: number;
  outdated: number;
  noAttempts: number;
  autoResolvedToday: number;
}

interface PrimaryOperationalCardsProps {
  metrics: OperationsDashboardMetrics;
  onSelectFilter: (filter: string) => void;
  activeFilter?: string | null;
}

export function PrimaryOperationalCards({ metrics, onSelectFilter, activeFilter }: PrimaryOperationalCardsProps) {
  const cards = [
    {
      id: "MISSING_EXPLANATION",
      title: "Missing Explanations",
      count: metrics.missingExplanations,
      severity: "HIGH",
      icon: <FileText className="h-5 w-5" />,
      color: "bg-orange-500/10 text-orange-500 border-orange-200",
    },
    {
      id: "DUPLICATE_CANDIDATE",
      title: "Duplicate Candidates",
      count: metrics.duplicateCandidates,
      severity: "MEDIUM",
      icon: <Copy className="h-5 w-5" />,
      color: "bg-blue-500/10 text-blue-500 border-blue-200",
    },
    {
      id: "HIGH_REPORTS",
      title: "High Reports",
      count: metrics.highReports,
      severity: "CRITICAL",
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "bg-red-500/10 text-red-500 border-red-200",
    },
    {
      id: "LOW_CONFIDENCE",
      title: "Low Confidence",
      count: metrics.lowConfidence,
      severity: "HIGH",
      icon: <HelpCircle className="h-5 w-5" />,
      color: "bg-yellow-500/10 text-yellow-500 border-yellow-200",
    },
    {
      id: "UNUSED",
      title: "Unused Questions",
      count: metrics.unused,
      severity: "LOW",
      icon: <EyeOff className="h-5 w-5" />,
      color: "bg-slate-500/10 text-slate-500 border-slate-200",
    },
    {
      id: "OUTDATED",
      title: "Outdated",
      count: metrics.outdated,
      severity: "MEDIUM",
      icon: <Clock className="h-5 w-5" />,
      color: "bg-indigo-500/10 text-indigo-500 border-indigo-200",
    },
    {
      id: "NO_ATTEMPTS",
      title: "No Attempts",
      count: metrics.noAttempts,
      severity: "LOW",
      icon: <Activity className="h-5 w-5" />,
      color: "bg-stone-500/10 text-stone-500 border-stone-200",
    },
    {
      id: "AUTO_RESOLVED",
      title: "Auto Resolved Today",
      count: metrics.autoResolvedToday,
      severity: "SUCCESS",
      icon: <CheckCircle className="h-5 w-5" />,
      color: "bg-green-500/10 text-green-500 border-green-200",
      isInformational: true,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card 
          key={card.id}
          className={cn(
            "transition-all cursor-pointer hover:shadow-md border",
            activeFilter === card.id ? "ring-2 ring-primary border-transparent" : "",
            card.color,
            card.isInformational ? "opacity-90" : ""
          )}
          onClick={() => {
            if (!card.isInformational) {
              onSelectFilter(card.id);
            }
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.count}</div>
            <p className={cn(
              "text-xs mt-1 font-semibold",
              card.severity === "CRITICAL" ? "text-red-600" :
              card.severity === "HIGH" ? "text-orange-600" :
              card.severity === "SUCCESS" ? "text-green-600" :
              "text-muted-foreground"
            )}>
              {card.isInformational ? "System Maintained" : `${card.severity} PRIORITY`}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
