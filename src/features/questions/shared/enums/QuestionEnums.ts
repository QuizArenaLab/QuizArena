export enum QuestionType {
  MCQ = "MCQ",
  MSQ = "MSQ",
  TRUE_FALSE = "TRUE_FALSE",
  FILL_BLANK = "FILL_BLANK",
  MATCHING = "MATCHING",
  SEQUENCE = "SEQUENCE",
  ASSERTION_REASON = "ASSERTION_REASON",
  NUMERICAL = "NUMERICAL",
  SUBJECTIVE = "SUBJECTIVE",
  CODING = "CODING",
  CASE_STUDY = "CASE_STUDY",
  COMPREHENSION = "COMPREHENSION",
}

export enum QuestionDifficulty {
  BEGINNER = "BEGINNER",
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
  EXPERT = "EXPERT",
}

export enum QuestionLanguage {
  EN = "EN",
  HI = "HI",
  FR = "FR",
  ES = "ES",
  DE = "DE",
}

export enum RevisionStatus {
  DRAFT = "DRAFT",
  IN_REVIEW = "IN_REVIEW",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
  DEPRECATED = "DEPRECATED",
}

export enum QuestionSourceType {
  MANUAL = "MANUAL",
  AI = "AI",
  IMPORT = "IMPORT",
  COPY = "COPY",
  MARKETPLACE = "MARKETPLACE",
  SYSTEM = "SYSTEM",
}

export enum AssetAssignmentType {
  QUESTION = "QUESTION",
  OPTION = "OPTION",
  EXPLANATION = "EXPLANATION",
  HINT = "HINT",
  REFERENCE = "REFERENCE",
}
