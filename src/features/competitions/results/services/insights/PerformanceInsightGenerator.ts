import { PerformanceInsight, QuestionReviewItem } from "../../types/results.types";

export class PerformanceInsightGenerator {
  /**
   * Deterministically generates insights based on the immutable attempt data.
   */
  public static generate(
    reviews: QuestionReviewItem[],
    accuracy: number,
    timeTakenSeconds: number,
    totalQuestions: number
  ): PerformanceInsight[] {
    const insights: PerformanceInsight[] = [];
    if (reviews.length === 0) return insights;

    // 1. Consistency Insight
    const skipped = reviews.filter(r => r.isSkipped).length;
    if (skipped > totalQuestions * 0.2) {
      insights.push({
        type: "CONSISTENCY",
        title: "High Skip Rate",
        description: "You skipped a significant portion of questions. Consider attempting more questions to maximize your scoring potential, unless negative marking strategies apply.",
        metricValue: `${Math.round((skipped / totalQuestions) * 100)}%`
      });
    } else if (accuracy > 80) {
      insights.push({
        type: "CONSISTENCY",
        title: "Highly Consistent",
        description: "You maintained a strong accuracy rate throughout the competition.",
        metricValue: `${Math.round(accuracy)}% Accuracy`
      });
    }

    // 2. Time Management Insight
    const avgTime = timeTakenSeconds / totalQuestions;
    if (avgTime < 10) {
      insights.push({
        type: "TIME_MANAGEMENT",
        title: "Speedy Execution",
        description: "Your average time per question was very fast. Ensure you are reading questions thoroughly to avoid silly mistakes.",
        metricValue: `${Math.round(avgTime)}s/question`
      });
    } else if (avgTime > 60) {
      insights.push({
        type: "TIME_MANAGEMENT",
        title: "Methodical Pacing",
        description: "You spent considerable time per question. Practicing timed mocks may help improve your overall speed.",
        metricValue: `${Math.round(avgTime)}s/question`
      });
    } else {
       insights.push({
        type: "TIME_MANAGEMENT",
        title: "Optimal Pacing",
        description: "Your time management was balanced, allowing adequate time per question without rushing.",
        metricValue: `${Math.round(avgTime)}s/question`
      });
    }

    // 3. Topic Insights (Mocking categories if not fully mapped in QuestionReviewItem for this iteration)
    // In a full implementation, `QuestionReviewItem` would include `category` or `tags` to group performance.
    
    return insights;
  }
}
