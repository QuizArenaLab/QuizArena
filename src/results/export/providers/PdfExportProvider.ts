import { ExportProvider } from '../ExportProvider';
import { ResultsReadModel } from '../../models/ResultsReadModel';

export class PdfExportProvider implements ExportProvider {
  public getFormat(): string {
    return 'PDF';
  }

  public async export(data: ResultsReadModel): Promise<any> {
    console.log(`[PdfExportProvider] Exporting to PDF for result ${data.resultId}`);
    return Buffer.from('mock-pdf-buffer');
  }
}
