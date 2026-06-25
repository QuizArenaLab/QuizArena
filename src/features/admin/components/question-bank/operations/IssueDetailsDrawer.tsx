"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface IssueDetailsDrawerProps {
  issueId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResolved: () => void;
}

export function IssueDetailsDrawer({ issueId, open, onOpenChange, onResolved }: IssueDetailsDrawerProps) {
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [resolveNotes, setResolveNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && issueId) {
      setLoading(true);
      // In a real app, use SWR/React Query or a Server Action here.
      // Mocking fetch for simplicity in this component structure.
      fetch(`/api/admin/operations/issues/${issueId}`)
        .then(res => res.json())
        .then(data => setIssue(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setIssue(null);
      setResolveNotes("");
    }
  }, [issueId, open]);

  const handleAction = async (action: "RESOLVE" | "DISMISS") => {
    if (!issueId) return;
    setIsSubmitting(true);
    try {
      await fetch(`/api/admin/operations/issues/${issueId}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason: resolveNotes }),
      });
      onResolved();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Issue Details</SheetTitle>
          <SheetDescription>
            {issue?.issueFingerprint}
          </SheetDescription>
        </SheetHeader>

        {loading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">Loading issue details...</div>
        ) : issue ? (
          <div className="mt-6 space-y-6">
            {/* Context Section */}
            <div className="space-y-3 border rounded-md p-4 bg-slate-50/50">
              <h4 className="text-sm font-semibold">Question Information</h4>
              <div className="text-sm">
                <span className="font-semibold">Code:</span> {issue.question.questionCode}
              </div>
              <div className="text-sm">
                <span className="font-semibold">Category:</span> {issue.question.category}
              </div>
              <div className="text-sm">
                <span className="font-semibold">Content:</span> 
                <p className="mt-1 line-clamp-3 text-muted-foreground bg-white border p-2 rounded-sm">
                  {issue.question.question}
                </p>
              </div>
            </div>

            {/* Evaluation History Section */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Evaluation History</h4>
              <div className="grid grid-cols-2 gap-2 text-sm border rounded-md p-3 bg-white">
                <div>
                  <span className="text-muted-foreground">Detected:</span><br/>
                  {format(new Date(issue.detectedAt), "PPp")}
                </div>
                <div>
                  <span className="text-muted-foreground">Last Evaluated:</span><br/>
                  {format(new Date(issue.lastEvaluatedAt), "PPp")}
                </div>
                <div>
                  <span className="text-muted-foreground">Previous Severity:</span><br/>
                  <Badge variant="outline">{issue.previousSeverity || "N/A"}</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Current Severity:</span><br/>
                  <Badge>{issue.severity}</Badge>
                </div>
              </div>
            </div>

            {/* Smart Recommendation */}
            <div className="space-y-3 border-l-4 border-primary pl-4 py-1">
              <h4 className="text-sm font-semibold">Smart Recommendation</h4>
              <p className="text-sm text-muted-foreground">
                {issue.issueType === "MISSING_EXPLANATION" && "The question is missing an explanation. Add a detailed explanation to help users understand the correct answer."}
                {issue.issueType === "DUPLICATE_CANDIDATE" && "Merge this question with the detected candidates or archive it if it is redundant."}
                {issue.issueType === "HIGH_REPORTS" && "Inspect the reports and evaluate if the question is factually incorrect or ambiguous."}
                {issue.issueType === "LOW_CONFIDENCE" && "Data quality is LOW. Wait for more attempts or adjust the question difficulty."}
                {issue.issueType === "UNUSED" && "Include this question in future practice pools or tournaments."}
                {issue.issueType === "OUTDATED" && "Review this dynamic question to ensure its content is still relevant."}
                {issue.issueType === "NO_ATTEMPTS" && "This question was served but not attempted. It might be too long or skipped often."}
              </p>
            </div>

            {/* Resolution Form */}
            <div className="space-y-3 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="notes">Resolution Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Explain why this issue is being resolved or dismissed..."
                  value={resolveNotes}
                  onChange={(e) => setResolveNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Audit History */}
            {issue.audits && issue.audits.length > 0 && (
              <div className="space-y-3 pt-4 border-t">
                <h4 className="text-sm font-semibold">Action History</h4>
                <div className="space-y-2">
                  {issue.audits.map((audit: any) => (
                    <div key={audit.id} className="text-xs border p-2 rounded bg-slate-50">
                      <div className="flex justify-between font-medium">
                        <span>{audit.action.replace(/_/g, " ")}</span>
                        <span className="text-muted-foreground">{format(new Date(audit.createdAt), "PP")}</span>
                      </div>
                      {audit.actor && <div className="text-muted-foreground mt-1">By: {audit.actor.name}</div>}
                      {audit.reason && <div className="text-muted-foreground italic mt-1">&quot;{audit.reason}&quot;</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-muted-foreground">Failed to load issue.</div>
        )}

        <SheetFooter className="mt-6 flex sm:justify-between border-t pt-4">
           <Button variant="outline" onClick={() => window.location.href = `/dashboard/admin/question-bank/${issue?.questionId}/edit`}>
             Edit Question
           </Button>
           <div className="space-x-2">
            <Button variant="outline" disabled={isSubmitting} onClick={() => handleAction("DISMISS")}>
              Dismiss Issue
            </Button>
            <Button variant="default" disabled={isSubmitting} onClick={() => handleAction("RESOLVE")}>
              Resolve Issue
            </Button>
           </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
