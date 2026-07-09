export class ReportTemplateEngine {
  public getTemplate(type: 'Executive' | 'Operational' | 'Financial' | 'Technical' | 'Compliance' | 'Audit', version: string): any {
    return { type, version };
  }
}
