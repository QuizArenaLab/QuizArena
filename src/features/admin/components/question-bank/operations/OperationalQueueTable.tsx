"use client";

import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { IssueDetailsDrawer } from "./IssueDetailsDrawer";

interface OperationalQueueTableProps {
  issues: any[];
  onRefresh: () => void;
  isLoading: boolean;
}

export function OperationalQueueTable({ issues, onRefresh, isLoading }: OperationalQueueTableProps) {
  const [selectedIssueIds, setSelectedIssueIds] = useState<Set<string>>(new Set());
  const [inspectIssueId, setInspectIssueId] = useState<string | null>(null);

  const toggleSelectAll = () => {
    if (selectedIssueIds.size === issues.length && issues.length > 0) {
      setSelectedIssueIds(new Set());
    } else {
      setSelectedIssueIds(new Set(issues.map(i => i.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIssueIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIssueIds(newSet);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return <Badge variant="destructive">CRITICAL</Badge>;
      case "HIGH": return <Badge className="bg-orange-500 hover:bg-orange-600">HIGH</Badge>;
      case "MEDIUM": return <Badge className="bg-blue-500 hover:bg-blue-600">MEDIUM</Badge>;
      case "LOW": return <Badge variant="secondary">LOW</Badge>;
      default: return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getSuggestedAction = (issueType: string) => {
    switch (issueType) {
      case "MISSING_EXPLANATION": return "Add Explanation";
      case "MISSING_TOPIC": return "Assign Topic";
      case "DUPLICATE_CANDIDATE": return "Review & Merge";
      case "LOW_CONFIDENCE": return "Review Data Quality";
      case "HIGH_REPORTS": return "Inspect Feedback";
      case "UNUSED": return "Include in Pools";
      case "OUTDATED": return "Refresh Content";
      case "NO_ATTEMPTS": return "Promote Question";
      default: return "Inspect";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Operational Queue</h3>
        {selectedIssueIds.size > 0 && (
          <div className="flex space-x-2">
            <span className="text-sm text-muted-foreground self-center mr-2">
              {selectedIssueIds.size} selected
            </span>
            <Button variant="outline" size="sm">Archive</Button>
            <Button variant="outline" size="sm">Assign Topic</Button>
            <Button variant="outline" size="sm">Dismiss</Button>
            <Button variant="default" size="sm">Bulk Resolve</Button>
          </div>
        )}
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={selectedIssueIds.size === issues.length && issues.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Question ID</TableHead>
              <TableHead>Issue Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Detected</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Loading operational queue...
                </TableCell>
              </TableRow>
            ) : issues.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No issues found. The Question Bank is healthy.
                </TableCell>
              </TableRow>
            ) : (
              issues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedIssueIds.has(issue.id)}
                      onCheckedChange={() => toggleSelect(issue.id)}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-xs">{issue.question.questionCode ?? issue.questionId.slice(0, 8)}</TableCell>
                  <TableCell className="font-medium">
                    {issue.issueType.replace(/_/g, " ")}
                  </TableCell>
                  <TableCell>{getSeverityBadge(issue.severity)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(issue.detectedAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={issue.status === "IN_PROGRESS" ? "default" : "outline"}>
                      {issue.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => setInspectIssueId(issue.id)}>
                      Inspect
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setInspectIssueId(issue.id)}>
                      {getSuggestedAction(issue.issueType)}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <IssueDetailsDrawer 
        issueId={inspectIssueId} 
        open={!!inspectIssueId} 
        onOpenChange={(open) => {
          if (!open) setInspectIssueId(null);
        }}
        onResolved={() => {
          setInspectIssueId(null);
          onRefresh();
        }}
      />
    </div>
  );
}
