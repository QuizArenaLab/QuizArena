/**
 * Shared Data Transfer Objects (DTOs)
 * 
 * Used across the Studio and Runtime domains to ensure consistency
 * without tight coupling between features.
 */

export interface CompetitionDTO {
  id: string;
  title: string;
  slug: string;
  description?: string;
  status: string; // Will map to enum
  // Add other properties as needed
}

export interface QuestionDTO {
  id: string;
  questionCode?: string;
  question: string;
  // Add other properties as needed
}

export interface SectionDTO {
  id: string;
  title: string;
  order: number;
}

export interface AssessmentDTO {
  id: string;
  competitionId: string;
  sections: SectionDTO[];
}

export interface SnapshotDTO {
  id: string;
  version: number;
  data: any; // Specify later
}

export interface RuntimeDTO {
  sessionId: string;
  competitionId: string;
  userId: string;
}

export interface SubmissionDTO {
  attemptId: string;
  answers: any[]; // Specify later
}
