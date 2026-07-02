export enum Layer {
  Page = 'Page',
  Layout = 'Layout',
  Route = 'Route',
  Component = 'Component',
  Hook = 'Hook',
  Store = 'Store',
  Service = 'Service',
  Repository = 'Repository',
  Controller = 'Controller',
  Kernel = 'Kernel',
  Validator = 'Validator',
  Action = 'Action',
  Context = 'Context',
  Provider = 'Provider',
  Middleware = 'Middleware',
  Utility = 'Utility',
  Type = 'Type',
  Event = 'Event',
  Command = 'Command',
  Schema = 'Schema',
  Configuration = 'Configuration',
  Script = 'Script',
  Unknown = 'Unknown'
}

export enum Domain {
  Platform = 'Platform',
  Authentication = 'Authentication',
  CompetitionStudio = 'Competition Studio',
  Competitions = 'Competitions',
  Runtime = 'Runtime',
  Submission = 'Submission',
  Results = 'Results',
  Leaderboard = 'Leaderboard',
  Rewards = 'Rewards',
  Certificates = 'Certificates',
  Operations = 'Operations',
  Shared = 'Shared',
  Infrastructure = 'Infrastructure',
  Unknown = 'Unknown'
}

export enum Classification {
  ACTIVE = 'ACTIVE',
  SHARED = 'SHARED',
  MIGRATE = 'MIGRATE',
  LEGACY = 'LEGACY',
  OBSOLETE = 'OBSOLETE',
  DELETE = 'DELETE',
  UNKNOWN = 'UNKNOWN'
}

export interface FileMetadata {
  absolutePath: string;
  relativePath: string;
  extension: string;
  size: number;
  lastModified: number;
}

export interface OwnershipMetadata {
  domain: Domain;
  feature: string;
  layer: Layer;
  responsibility: string;
  confidenceScore: number;
}

export interface DependencyMetadata {
  internalImports: string[];
  externalImports: string[];
  circularDependencies: string[];
  brokenImports: string[];
  unusedExports: string[];
  barrelExports: string[];
  relativeImports: string[];
  absoluteImports: string[];
  importCount: number;
  exportCount: number;
  dependencyCount: number;
  reverseDependencyCount: number;
}

export interface FileClassification {
  status: Classification;
  reason: string;
}

export interface FileRecord {
  metadata: FileMetadata;
  ownership?: OwnershipMetadata;
  dependencies?: DependencyMetadata;
  classification?: FileClassification;
}

export interface ArchitectureSummary {
  pages: number;
  layouts: number;
  components: number;
  services: number;
  repositories: number;
  stores: number;
  hooks: number;
  validators: number;
  types: number;
  contexts: number;
  utilities: number;
  actions: number;
  controllers: number;
  events: number;
  commands: number;
  prismaModels: number;
  totalFiles: number;
  totalDirectories: number;
  largestFeature: string;
  mostDuplicatedLayer: string;
  sharedCandidateCount: number;
  legacyCount: number;
  deleteCandidateCount: number;
  migrationCandidateCount: number;
  totalDomains: number;
  largestDomain: string;
  duplicateCount: number;
  averageImportsPerFile: number;
  averageExportsPerFile: number;
  dependencyDepth: number;
  circularDependencyCount: number;
  unknownOwnershipCount: number;
}
