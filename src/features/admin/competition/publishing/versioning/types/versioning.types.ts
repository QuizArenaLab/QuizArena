export interface CompetitionVersionInfo {
  id: string;
  versionNumber: number;
  publishedAt: string | null;
  publishedBy: {
    id: string;
    name: string;
  } | null;
  changelog: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface VersionSnapshot {
  competition: CompetitionCoreSnapshot;
  sections: SectionSnapshot[];
  questions: QuestionMappingSnapshot[];
  rules: RulesSnapshot;
  config: ConfigSnapshot;
  metadata: VersionMetadata;
}

export interface CompetitionCoreSnapshot {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  type: string;
  difficulty: string;
  language: string;
  durationMinutes: number;
  totalQuestions: number;
  maximumMarks: number;
}

export interface SectionSnapshot {
  id: string;
  title: string;
  description: string | null;
  displayOrder: number;
}

export interface QuestionMappingSnapshot {
  questionId: string;
  sectionId: string | null;
  marks: number;
  negativeMarks: number;
  displayOrder: number;
  isMandatory: boolean;
}

export interface RulesSnapshot {
  attemptLimit: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  allowReview: boolean;
  allowNavigation: boolean;
  showResults: boolean;
  strictMode: boolean;
}

export interface ConfigSnapshot {
  entryFee: number | null;
  rewardPool: number | null;
  currency: string;
  eligibilityCriteria: any; // Complex JSON structure
}

export interface VersionMetadata {
  schemaVersion: string;
  generatedAt: string;
}
