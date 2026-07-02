import { MigrationOrchestrator } from '../migration/MigrationOrchestrator';

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');

MigrationOrchestrator.execute(isDryRun).catch(e => {
  console.error(e);
  process.exit(1);
});
