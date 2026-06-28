import { CompetitionWithRelations } from "../../../types";
import { ValidationItem } from "../types/validation.types";

export function validateBusiness(competition: CompetitionWithRelations): ValidationItem[] {
  const items: ValidationItem[] = [];

  const economics = competition.economics;

  // BUSI001: Paid challenge missing entry fee
  if (competition.competitionType === "PAID_CHALLENGE") {
    if (!economics?.entryFee || economics.entryFee <= 0) {
      items.push({
        id: `busi-entry-fee-${competition.id}`,
        category: "BUSINESS",
        severity: "error",
        code: "BUSI001",
        title: "Missing Entry Fee",
        description: "A Paid Challenge must have an entry fee greater than 0.",
        affectedEntity: { type: "economics", id: competition.id, label: "Entry Fee" },
        fixSuggestion: "Set a valid entry fee for this paid competition.",
      });
    }
  }

  // BUSI002: Reward pool exceeds entry fee total logic - (simplified for now as a warning if reward > 0 but entry fee is 0 for non-open practices)
  if (economics && economics.rewardPool > 0) {
    if (
      competition.competitionType !== "OPEN_PRACTICE" &&
      (!economics.entryFee || economics.entryFee === 0)
    ) {
      items.push({
        id: `busi-reward-pool-${competition.id}`,
        category: "BUSINESS",
        severity: "warning",
        code: "BUSI002",
        title: "Reward Pool Without Entry Fee",
        description: "This competition has a reward pool but no entry fee.",
        affectedEntity: { type: "economics", id: competition.id, label: "Reward Pool" },
        fixSuggestion: "Ensure the economics align with your business model.",
      });
    }
  }

  return items;
}
