import { CompetitionWithRelations } from "../../../types";
import { ValidationItem } from "../types/validation.types";

export function validateScheduling(competition: CompetitionWithRelations): ValidationItem[] {
  const items: ValidationItem[] = [];

  // If both startsAt and endsAt are not provided, it's a manually triggered competition.
  // We only validate if one of them is provided.
  if (competition.startsAt || competition.endsAt) {
    // SCHED001: Start date missing (if scheduling)
    if (competition.endsAt && !competition.startsAt) {
      items.push({
        id: `sched-missing-start-${competition.id}`,
        category: "SCHEDULING",
        severity: "error",
        code: "SCHED001",
        title: "Missing Start Date",
        description: "An end date is specified, but the start date is missing.",
        affectedEntity: { type: "schedule", id: competition.id, label: "Start Date" },
        fixSuggestion: "Provide a start date for the competition.",
      });
    }

    // SCHED002: End date before start date
    if (competition.startsAt && competition.endsAt && competition.endsAt <= competition.startsAt) {
      items.push({
        id: `sched-end-before-start-${competition.id}`,
        category: "SCHEDULING",
        severity: "error",
        code: "SCHED002",
        title: "Invalid Schedule Window",
        description: "End date must be after the start date.",
        affectedEntity: { type: "schedule", id: competition.id, label: "End Date" },
        fixSuggestion: "Adjust the end date to be later than the start date.",
      });
    }

    // SCHED003: Duration exceeds schedule window
    if (competition.startsAt && competition.endsAt && competition.durationMinutes) {
      const windowMinutes =
        (competition.endsAt.getTime() - competition.startsAt.getTime()) / (1000 * 60);
      if (competition.durationMinutes > windowMinutes) {
        items.push({
          id: `sched-duration-exceeds-${competition.id}`,
          category: "SCHEDULING",
          severity: "warning",
          code: "SCHED003",
          title: "Duration Exceeds Window",
          description: "Competition duration is longer than the scheduled availability window.",
          affectedEntity: { type: "schedule", id: competition.id, label: "Duration" },
          fixSuggestion:
            "Ensure the schedule window allows enough time to complete the competition.",
        });
      }
    }

    // Note: SCHED004 (Start date in the past) and SCHED005 (Timezone) are better handled
    // at the time of actually scheduling (via the CompetitionSchedule model),
    // not strictly holding back the readiness status of the competition itself.
  }

  return items;
}
