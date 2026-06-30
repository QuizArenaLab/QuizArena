import { CompositionGraph } from '../../composer/engine/CompositionEngine';
import { IAnalyzer, AnalyzerResult, AnalyzerRegistry } from './AnalyzerRegistry';
import { ExplainabilityEngine } from './ExplainabilityEngine';
import { RecommendationEngine } from './RecommendationEngine';
import { ConfidenceEngine } from './ConfidenceEngine';
import { AssessmentHealthEngine } from './AssessmentHealthEngine';
import { RiskEngine } from './RiskEngine';

class CoverageAnalyzerService implements IAnalyzer {
  id = 'coverage_analyzer';
  priority = 'HIGH' as const;
  dependsOn = ['sections', 'questions']; // Minimal dependencies

  async analyze(graph: CompositionGraph, previousState?: any): Promise<AnalyzerResult> {
    // In a real execution, we would call AssessmentAnalyticsRepository to get topic definitions
    const totalQuestions = graph.sections.reduce((acc, s) => acc + s.questions.length, 0);
    
    // Evaluate Coverage
    let coverageHealth = 100;
    
    if (totalQuestions === 0) {
      coverageHealth = 0;
    }

    // Example logic
    if (coverageHealth < 50) {
      const explanation = ExplainabilityEngine.generateExplanation(
        'Poor Topic Coverage',
        'Assessment has virtually no questions mapping to key syllabus topics.',
        `Found ${totalQuestions} total questions vs required 50.`,
        [], [], 'High chance of unfair assessment', 'Add at least 30 more questions across core topics'
      );
      
      const confidence = ConfidenceEngine.calculateConfidence(totalQuestions, 0);
      
      RecommendationEngine.generateRecommendation(
        'rec_cov_1',
        'Improve Topic Coverage',
        'CRITICAL',
        confidence,
        explanation
      );

      RiskEngine.reportRisk('risk_cov_1', 'Incomplete Assessment', 'CRITICAL', explanation);
    }

    AssessmentHealthEngine.updateHealth('coverageHealth', coverageHealth);

    return {
      analyzerId: this.id,
      data: {
        coverageScore: coverageHealth
      },
      healthScore: coverageHealth
    };
  }
}

export const CoverageAnalyzer = new CoverageAnalyzerService();

// Register self
AnalyzerRegistry.register(CoverageAnalyzer);
