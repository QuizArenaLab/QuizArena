/**
 * Assessment Health Engine
 * 
 * Aggregates specialized health scores into one unified 0-100 metric.
 */

export interface DetailedHealth {
  overallHealth: number;
  coverageHealth: number;
  difficultyHealth: number;
  questionHealth: number;
  sectionHealth: number;
  timeHealth: number;
  marksHealth: number;
}

class AssessmentHealthEngineService {
  private currentHealth: DetailedHealth = {
    overallHealth: 100,
    coverageHealth: 100,
    difficultyHealth: 100,
    questionHealth: 100,
    sectionHealth: 100,
    timeHealth: 100,
    marksHealth: 100,
  };

  updateHealth(component: keyof Omit<DetailedHealth, 'overallHealth'>, score: number) {
    this.currentHealth[component] = score;
    this.recalculateOverall();
  }

  private recalculateOverall() {
    // Weightings based on user specs:
    // Coverage 20%, Difficulty 20%, Question 20%, Section 15%, Time 10%, Marks 10%, Structural 5%
    // Simplified computation for the current active components
    const h = this.currentHealth;
    this.currentHealth.overallHealth = Math.floor(
      (h.coverageHealth * 0.20) +
      (h.difficultyHealth * 0.20) +
      (h.questionHealth * 0.20) +
      (h.sectionHealth * 0.15) +
      (h.timeHealth * 0.10) +
      (h.marksHealth * 0.10) +
      (100 * 0.05) // Base 5% for structural integrity
    );
  }

  getHealth(): DetailedHealth {
    return { ...this.currentHealth };
  }
}

export const AssessmentHealthEngine = new AssessmentHealthEngineService();
