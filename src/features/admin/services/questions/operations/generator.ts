import { prisma } from "@/lib/prisma";
import type { DetectedIssue } from "./types";
import { logOperationalAudit } from "./logger";
import { notifyIssue } from "./notifier";

export async function processDetectedIssues(detectedIssues: DetectedIssue[]): Promise<{
  processed: number;
  newIssues: number;
  autoResolved: number;
}> {
  let newIssuesCount = 0;
  let autoResolvedCount = 0;

  // Track the fingerprints we've seen in this evaluation
  const activeFingerprints = new Set<string>();

  for (const issue of detectedIssues) {
    const fingerprint = `${issue.questionId}_${issue.issueType}`;
    activeFingerprints.add(fingerprint);

    const existingIssue = await prisma.operationalIssue.findUnique({
      where: { issueFingerprint: fingerprint },
    });

    if (!existingIssue) {
      // New issue
      const newIssue = await prisma.operationalIssue.create({
        data: {
          issueFingerprint: fingerprint,
          questionId: issue.questionId,
          issueType: issue.issueType,
          severity: issue.severity,
          status: "OPEN",
          priority: issue.severity, // Default priority to severity initially
        },
      });
      newIssuesCount++;

      await logOperationalAudit({
        issueId: newIssue.id,
        action: "DETECTED",
      });

      if (issue.severity === "CRITICAL") {
        await notifyIssue(newIssue.id, "NEW_CRITICAL_ISSUE");
      }
    } else {
      // Existing issue
      const updates: any = { lastEvaluatedAt: new Date() };
      let severityIncreased = false;

      // Reopen if it was auto-resolved or resolved but detected again
      if (existingIssue.status === "RESOLVED" || existingIssue.status === "AUTO_RESOLVED" || existingIssue.status === "DISMISSED") {
         updates.status = "OPEN";
         await logOperationalAudit({
           issueId: existingIssue.id,
           action: "REOPENED",
           reason: `Re-detected by operations evaluator`,
         });
      }

      // Check severity changes
      if (existingIssue.severity !== issue.severity) {
        updates.previousSeverity = existingIssue.severity;
        updates.severity = issue.severity;
        
        // Severity mapping for comparison
        const severityScores = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
        if (severityScores[issue.severity] > severityScores[existingIssue.severity]) {
          severityIncreased = true;
        }
      }

      await prisma.operationalIssue.update({
        where: { id: existingIssue.id },
        data: updates,
      });

      if (severityIncreased) {
        await logOperationalAudit({
           issueId: existingIssue.id,
           action: "SEVERITY_INCREASED",
        });
        await notifyIssue(existingIssue.id, "SEVERITY_INCREASED");
      }
    }
  }

  // Find all previously OPEN or IN_PROGRESS issues whose fingerprints were NOT seen in this evaluation
  // Those issues have naturally disappeared and should be marked AUTO_RESOLVED
  const noLongerActiveIssues = await prisma.operationalIssue.findMany({
    where: {
      status: { in: ["OPEN", "IN_PROGRESS"] },
    },
    select: { id: true, issueFingerprint: true },
  });

  for (const issue of noLongerActiveIssues) {
    if (!activeFingerprints.has(issue.issueFingerprint)) {
      await prisma.operationalIssue.update({
        where: { id: issue.id },
        data: {
          status: "AUTO_RESOLVED",
          resolvedAt: new Date(),
        },
      });
      autoResolvedCount++;

      await logOperationalAudit({
        issueId: issue.id,
        action: "AUTO_RESOLVED",
        reason: "Issue no longer detected during background evaluation",
      });
      await notifyIssue(issue.id, "AUTO_RESOLVED");
    }
  }

  return {
    processed: detectedIssues.length,
    newIssues: newIssuesCount,
    autoResolved: autoResolvedCount,
  };
}
