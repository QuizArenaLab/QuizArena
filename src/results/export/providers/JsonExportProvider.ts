import { ExportProvider } from '../ExportProvider';
import { ResultsReadModel } from '../../models/ResultsReadModel';

export class JsonExportProvider implements ExportProvider {
  public getFormat(): string {
    return 'JSON';
  }

  public async export(data: ResultsReadModel): Promise<any> {
    console.log(`[JsonExportProvider] Exporting to JSON for result ${data.resultId}`);
    return JSON.stringify(data, null, 2);
  }
}
