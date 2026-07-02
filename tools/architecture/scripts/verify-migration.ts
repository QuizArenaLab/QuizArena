import { MigrationVerification } from '../verification/MigrationVerification';
import { Logger } from '../core/Logger';

function verify() {
  const isValid = MigrationVerification.validatePipeline();
  if (isValid) {
    Logger.info('Migration Verification Passed.');
  } else {
    Logger.error('Migration Verification Failed.');
    process.exit(1);
  }
}

verify();
