import { ModuleMigrationEngine } from '../modules/ModuleMigrationEngine';
import { ModuleReporter } from '../reporting/ModuleReporter';
import { Logger } from '../core/Logger';

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');

function main() {
  Logger.info('Starting Folder Standardization Engine...');
  
  // Simulated migration of a module
  ModuleMigrationEngine.migrate('src/legacy/builder', isDryRun);
  
  // Generate reports
  ModuleReporter.generateComplianceReports();
  
  Logger.info('Architecture Modules compliance verification completed.');
}

main();
