import { ResultsReadModel } from '../models/ResultsReadModel';

export interface ExportProvider {
  /**
   * Identifies the format supported by this provider (e.g., 'PDF', 'JSON').
   */
  getFormat(): string;

  /**
   * Generates the export payload (buffer, url, or string).
   */
  export(data: ResultsReadModel): Promise<any>;
}
