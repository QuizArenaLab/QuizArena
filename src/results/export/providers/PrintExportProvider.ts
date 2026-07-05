import { ExportProvider } from '../ExportProvider';
import { ResultsReadModel } from '../../models/ResultsReadModel';

export class PrintExportProvider implements ExportProvider {
  public getFormat(): string {
    return 'PRINT';
  }

  public async export(data: ResultsReadModel): Promise<any> {
    console.log(`[PrintExportProvider] Exporting for print for result ${data.resultId}`);
    return '<html-print-view>';
  }
}
