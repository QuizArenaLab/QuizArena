import { LeaderboardSummary } from '../models/LeaderboardReadModels';

export interface LeaderboardExportProvider {
  export(summary: LeaderboardSummary): Promise<Buffer | string>;
  getFormat(): string;
}

export class JsonLeaderboardExportProvider implements LeaderboardExportProvider {
  public async export(summary: LeaderboardSummary): Promise<string> {
    return JSON.stringify(summary, null, 2);
  }

  public getFormat(): string {
    return 'application/json';
  }
}

export class CsvLeaderboardExportProvider implements LeaderboardExportProvider {
  public async export(summary: LeaderboardSummary): Promise<string> {
    if (summary.topEntries.length === 0) return '';
    
    const headers = Object.keys(summary.topEntries[0]).join(',');
    const rows = summary.topEntries.map(entry => Object.values(entry).join(','));
    
    return [headers, ...rows].join('\n');
  }

  public getFormat(): string {
    return 'text/csv';
  }
}

export class PdfLeaderboardExportProvider implements LeaderboardExportProvider {
  public async export(summary: LeaderboardSummary): Promise<Buffer> {
    // Placeholder for PDF generation MVP
    return Buffer.from(`PDF Export for ${summary.competitionId}`);
  }

  public getFormat(): string {
    return 'application/pdf';
  }
}
