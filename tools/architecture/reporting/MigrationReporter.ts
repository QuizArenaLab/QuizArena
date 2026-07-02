import * as fs from 'fs';
import * as path from 'path';
import { ROOT_DIR } from '../core/Constants';
import { DryRunReport } from '../migration/DryRunEngine';

export class MigrationReporter {
  private static reportsDir = path.join(ROOT_DIR, 'tools', 'architecture', 'reports');

  static generateDryRunReport(report: DryRunReport) {
    const content = `# Dry Run Report\n\n## Migrated Modules\n${report.migratedModules.join('\n')}\n\n## Deleted Files\n${report.deletedFiles.join('\n')}\n\n## Risk Summary\n${report.riskSummary}`;
    this.writeMarkdown('dry-run-report.md', content);
    this.writeJson('dry-run-report.json', report);
  }

  private static writeJson(filename: string, data: any) {
    if (!fs.existsSync(this.reportsDir)) fs.mkdirSync(this.reportsDir, { recursive: true });
    fs.writeFileSync(path.join(this.reportsDir, filename), JSON.stringify(data, null, 2));
  }

  private static writeMarkdown(filename: string, content: string) {
    if (!fs.existsSync(this.reportsDir)) fs.mkdirSync(this.reportsDir, { recursive: true });
    fs.writeFileSync(path.join(this.reportsDir, filename), content);
  }
}
