import fs from 'fs';
import path from 'path';

const SRC_DIR = path.join(process.cwd(), 'src');

const DOMAINS = [
  { name: 'platform', level: 0 },
  { name: 'shared', level: 1 },
  { name: 'infrastructure', level: 2 },
  { name: 'authentication', level: 3 },
  { name: 'admin/competition-studio', level: 4, manifestName: 'CompetitionStudio' },
  { name: 'competitions', level: 5 },
  { name: 'runtime', level: 6 },
  { name: 'submission', level: 7 },
  { name: 'results', level: 8 },
  { name: 'leaderboard', level: 9 },
  { name: 'rewards', level: 10 },
  { name: 'certificates', level: 11 },
  { name: 'operations', level: 12 },
];

const SUB_DIRS = [
  'application/use-cases',
  'application/handlers',
  'factories',
  'policies',
  'adapters',
  'mappers',
  'actions',
  'commands',
  'components',
  'controllers',
  'events',
  'hooks',
  'kernel',
  'repositories',
  'services',
  'shared',
  'stores',
  'types',
  'validators',
  'views',
  'contracts',
  'sdk'
];

function toPascalCase(str: string) {
  return str.split(/[-/]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

async function scaffold() {
  for (const domain of DOMAINS) {
    const domainPath = path.join(SRC_DIR, domain.name);
    
    // Create domain directory
    if (!fs.existsSync(domainPath)) {
      fs.mkdirSync(domainPath, { recursive: true });
    }

    // Create subdirectories
    for (const subDir of SUB_DIRS) {
      const subDirPath = path.join(domainPath, subDir);
      if (!fs.existsSync(subDirPath)) {
        fs.mkdirSync(subDirPath, { recursive: true });
      }
    }

    // Create index.ts
    const indexPath = path.join(domainPath, 'index.ts');
    if (!fs.existsSync(indexPath)) {
      fs.writeFileSync(indexPath, `// Public API for ${domain.name} domain\n`);
    }

    // Create Manifest
    const manifestPrefix = domain.manifestName || toPascalCase(domain.name);
    const manifestName = `${manifestPrefix}Manifest.ts`;
    const manifestPath = path.join(domainPath, manifestName);
    
    if (!fs.existsSync(manifestPath)) {
      const manifestContent = `export const ${manifestPrefix}Manifest = {
  name: '${domain.name}',
  version: '1.0.0',
  level: ${domain.level},
  dependencies: [],
  eventsPublished: [],
  eventsConsumed: [],
  commands: [],
  publicAPIs: []
};
`;
      fs.writeFileSync(manifestPath, manifestContent);
    }
    
    // Create README
    const readmePath = path.join(domainPath, 'README.md');
    if (!fs.existsSync(readmePath)) {
       fs.writeFileSync(readmePath, `# ${domain.name} Domain\n\nLevel: ${domain.level}\n`);
    }
  }
  console.log('Domain scaffolding complete.');
}

scaffold().catch(console.error);
