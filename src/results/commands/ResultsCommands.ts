export interface ResultsCommand {
  type: string;
  payload: any;
  timestamp: Date;
}

export interface ViewResult extends ResultsCommand {
  type: 'ViewResult';
  payload: { resultId: string; userId: string };
}

export interface ExportResult extends ResultsCommand {
  type: 'ExportResult';
  payload: { resultId: string; format: string };
}

export interface ShareResult extends ResultsCommand {
  type: 'ShareResult';
  payload: { resultId: string; target: string };
}

export interface DownloadResult extends ResultsCommand {
  type: 'DownloadResult';
  payload: { resultId: string; format: string };
}

export interface ArchiveResult extends ResultsCommand {
  type: 'ArchiveResult';
  payload: { resultId: string };
}
