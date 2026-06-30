/**
 * COMPETITION STUDIO - FEATURE REGISTRY
 * 
 * All exports from the Competition Studio domain must go through this file.
 * Cross-feature communication must happen through these exported public APIs.
 * No feature may import another feature's internal files directly.
 */

// Core orchestration
export { CompetitionStudioKernel } from './studio/kernel/CompetitionStudioKernel';

// Ensure Explorer registers itself
import './explorer/kernel/QuestionExplorerKernel';

// Ensure Composer registers itself
import './composer/kernel/AssessmentComposerKernel';

// Ensure Intelligence registers itself
import './intelligence/kernel/AssessmentIntelligenceKernel';

// Ensure Readiness registers itself
import './readiness/kernel/CompetitionReadinessKernel';

// Other modules will be exported here as they are migrated.
