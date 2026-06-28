import { RecommendationAction, NextAction } from "../../types/results.types";

export class RecommendationService {
  /**
   * Generates deterministic recommendations based on the attempt data.
   */
  public static generateRecommendations(
    accuracy: number,
    percentage: number,
    status: string,
    competitionSlug: string
  ): RecommendationAction[] {
    const recommendations: RecommendationAction[] = [];

    if (percentage < 50) {
      recommendations.push({
        type: "RETRY",
        title: "Retry Competition",
        description: "Your score indicates room for improvement. Review your mistakes and retry this competition to reinforce concepts.",
        targetUrl: `/dashboard/competitions/${competitionSlug}`
      });
      
      recommendations.push({
        type: "PRACTICE",
        title: "Focus on Fundamentals",
        description: "Review the theoretical concepts before attempting again to improve accuracy."
      });
    } else if (percentage >= 80) {
      recommendations.push({
        type: "LEADERBOARD",
        title: "Check Leaderboard Rankings",
        description: "Excellent performance! Check out where you stand on the global leaderboard.",
        targetUrl: `/dashboard/competitions/${competitionSlug}/leaderboard`
      });
      
      recommendations.push({
        type: "PRACTICE",
        title: "Attempt Harder Difficulties",
        description: "You have mastered this level. Try searching for higher difficulty competitions to challenge yourself."
      });
    } else {
      recommendations.push({
        type: "PRACTICE",
        title: "Practice Weak Areas",
        description: "Identify the questions you got wrong and focus your practice sessions on those specific topics."
      });
    }

    return recommendations;
  }

  /**
   * Determines contextual UI next actions based on attempt state.
   */
  public static generateNextActions(
    competitionSlug: string,
    status: string
  ): NextAction[] {
    return [
      {
        id: "retry",
        label: "Retry Competition",
        action: "RETRY_COMPETITION",
        url: `/dashboard/competitions/${competitionSlug}`,
        isPrimary: true
      },
      {
        id: "leaderboard",
        label: "View Leaderboard",
        action: "VIEW_LEADERBOARD",
        url: `/dashboard/competitions/${competitionSlug}/leaderboard`,
        isPrimary: false
      }
    ];
  }
}
