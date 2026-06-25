export async function notifyIssue(issueId: string, eventType: "NEW_CRITICAL_ISSUE" | "SEVERITY_INCREASED" | "AUTO_RESOLVED") {
  // In a full implementation, this might dispatch to Slack, Email, or an in-app notification system.
  // For now, we simply log it to demonstrate the decoupling.
  console.log(`[Notification Dispatcher] Event: ${eventType} for Issue ID: ${issueId}`);
}
