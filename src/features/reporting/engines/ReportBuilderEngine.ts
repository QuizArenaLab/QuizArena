export class ReportBuilderEngine {
  public buildSection(title: string, content: any): any {
    return { title, content, type: 'section' };
  }

  public buildChart(type: string, data: any): any {
    return { type, data, component: 'chart' };
  }

  public buildTable(columns: string[], rows: any[]): any {
    return { columns, rows, type: 'table' };
  }

  public buildKpi(label: string, value: string | number): any {
    return { label, value, type: 'kpi' };
  }

  public buildNarrative(text: string): any {
    return { text, type: 'narrative' };
  }
}
