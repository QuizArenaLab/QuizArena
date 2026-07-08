import { CompetitionGovernanceCertificationService } from '../services/CompetitionGovernanceCertificationService';

async function certify() {
  const service = new CompetitionGovernanceCertificationService();
  const result = await service.runFullCertification();

  console.log(`\nCompetition Governance Certification Result:`);
  console.log(`Score: ${result.score}%`);
  
  for (const [check, passed] of Object.entries(result.checks)) {
    console.log(`${passed ? '✓' : '✗'} ${check}`);
  }

  if (result.isCertified) {
    console.log(`\nProduction Certified`);
    process.exit(0);
  } else {
    console.error(`\nCertification Failed`);
    process.exit(1);
  }
}

certify().catch((err) => {
  console.error("Certification script failed:", err);
  process.exit(1);
});
