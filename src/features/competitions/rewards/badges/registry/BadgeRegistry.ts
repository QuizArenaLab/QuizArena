export interface BadgeMetadata {
  id: string;
  name: string;
  description: string;
  iconAsset: string;
  rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
}

export class BadgeRegistry {
  private static badges: Record<string, BadgeMetadata> = {
    "TOP_10": {
      id: "TOP_10",
      name: "Top 10 Finisher",
      description: "Finished in the top 10 of a competition.",
      iconAsset: "/badges/top-10.svg",
      rarity: "EPIC"
    },
    "PERFECT_SCORE": {
      id: "PERFECT_SCORE",
      name: "Perfect Score",
      description: "Achieved 100% accuracy.",
      iconAsset: "/badges/perfect-score.svg",
      rarity: "LEGENDARY"
    },
    "PARTICIPANT": {
      id: "PARTICIPANT",
      name: "Competitor",
      description: "Successfully submitted a competition attempt.",
      iconAsset: "/badges/participant.svg",
      rarity: "COMMON"
    }
  };

  public static getBadge(badgeType: string): BadgeMetadata {
    return this.badges[badgeType] || {
      id: badgeType,
      name: badgeType.replace(/_/g, " "),
      description: "Earned a special badge.",
      iconAsset: "/badges/default.svg",
      rarity: "COMMON"
    };
  }
}
