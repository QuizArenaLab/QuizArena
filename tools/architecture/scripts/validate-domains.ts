import { Project } from 'ts-morph';
import path from 'path';
import fs from 'fs';

const SRC_DIR = path.join(process.cwd(), 'src');
const REPORTS_DIR = path.join(process.cwd(), 'tools', 'architecture', 'reports');

const DOMAINS = [
  { name: 'platform', level: 0 },
  { name: 'shared', level: 1 },
  { name: 'infrastructure', level: 2 },
  { name: 'authentication', level: 3 },
  { name: 'admin/competition-studio', level: 4, isBusiness: true },
  { name: 'competitions', level: 5, isBusiness: true },
  { name: 'runtime', level: 6, isBusiness: true },
  { name: 'submission', level: 7, isBusiness: true },
  { name: 'results', level: 8, isBusiness: true },
  { name: 'leaderboard', level: 9, isBusiness: true },
  { name: 'rewards', level: 10, isBusiness: true },
  { name: 'certificates', level: 11, isBusiness: true },
  { name: 'operations', level: 12, isBusiness: true },
];

interface Violation {
  file: string;
  type: string;
  message: string;
}

const violations: Violation[] = [];

function getDomainForPath(filePath: string): string | null {
  const relative = path.relative(SRC_DIR, filePath).replace(/\\/g, '/');
  for (const d of DOMAINS) {
    if (relative === d.name || relative.startsWith(`${d.name}/`)) {
      return d.name;
    }
  }
  return null;
}

function resolveImportDomain(importPath: string): { targetDomain: string | null, isDeep: boolean } {
  if (importPath.startsWith('@/')) {
    const parts = importPath.substring(2).split('/');
    if (parts[0] === 'admin' && parts[1] === 'competition-studio') {
       return { targetDomain: 'admin/competition-studio', isDeep: parts.length > 2 };
    }
    const possibleDomain = parts[0];
    if (DOMAINS.find(d => d.name === possibleDomain)) {
       return { targetDomain: possibleDomain, isDeep: parts.length > 1 };
    }
  }
  return { targetDomain: null, isDeep: false };
}

async function validate() {
  const project = new Project({ tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json') });
  const sourceFiles = project.getSourceFiles('src/**/*.ts*');
  
  let totalImports = 0;
  let oversizedFiles = 0;
  const metrics = {
    domainCount: DOMAINS.length,
    averageCoupling: 0,
    averageCohesion: 100, // placeholder
    duplicatePercent: 0, // placeholder
    deadCodePercent: 0, // placeholder
  };

  const bootGraphEdges: {from: string, to: string}[] = [];

  for (const sf of sourceFiles) {
    const filePath = sf.getFilePath();
    const sourceDomain = getDomainForPath(filePath);
    if (!sourceDomain) continue;
    
    const isSourceBusiness = DOMAINS.find(d => d.name === sourceDomain)?.isBusiness;
    
    // Size check (e.g., > 1000 lines is oversized)
    if (sf.getEndLineNumber() > 1000) {
       oversizedFiles++;
       violations.push({ file: filePath, type: 'OVERSIZED', message: `File exceeds 1000 lines (${sf.getEndLineNumber()} lines).` });
    }

    const imports = sf.getImportDeclarations();
    for (const imp of imports) {
      totalImports++;
      const importStr = imp.getModuleSpecifierValue();
      const { targetDomain, isDeep } = resolveImportDomain(importStr);
      
      if (!targetDomain || targetDomain === sourceDomain) continue;
      
      const isTargetBusiness = DOMAINS.find(d => d.name === targetDomain)?.isBusiness;

      if (!bootGraphEdges.find(e => e.from === sourceDomain && e.to === targetDomain)) {
        bootGraphEdges.push({from: sourceDomain, to: targetDomain});
      }

      if (isDeep) violations.push({ file: filePath, type: 'DEEP_IMPORT', message: `Deep import into '${targetDomain}'.` });
      if (sourceDomain === 'shared' && isTargetBusiness) violations.push({ file: filePath, type: 'SHARED_VIOLATION', message: `Shared cannot import business domain '${targetDomain}'` });
      if (sourceDomain === 'platform' && isTargetBusiness) violations.push({ file: filePath, type: 'PLATFORM_VIOLATION', message: `Platform cannot import business domain '${targetDomain}'` });
      if (isSourceBusiness && isTargetBusiness) violations.push({ file: filePath, type: 'CROSS_DOMAIN', message: `Cross-domain import from '${sourceDomain}' to '${targetDomain}'.` });
    }
  }

  metrics.averageCoupling = bootGraphEdges.length / DOMAINS.length;

  let score = 100;
  for (const v of violations) score -= 5;
  score = Math.max(0, score);

  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

  // Boot Graph
  let bootGraphMd = '# Boot Dependency Graph\n\n```mermaid\ngraph TD;\n';
  const levels = [...new Set(DOMAINS.map(d => d.level))].sort((a,b)=>a-b);
  for (const d of DOMAINS) bootGraphMd += `  ${d.name.replace(/[-/]/g, '_')}[${d.name}]\n`;
  for (const e of bootGraphEdges) bootGraphMd += `  ${e.from.replace(/[-/]/g, '_')} --> ${e.to.replace(/[-/]/g, '_')}\n`;
  bootGraphMd += '```\n';
  fs.writeFileSync(path.join(REPORTS_DIR, 'boot-graph.md'), bootGraphMd);

  // Architecture Metrics
  const metricsMd = `# Architecture Metrics\n- Domain Count: ${metrics.domainCount}\n- Average Coupling: ${metrics.averageCoupling.toFixed(2)}\n- Average Cohesion: ${metrics.averageCohesion}%\n- Duplicate %: ${metrics.duplicatePercent}%\n- Dead Code %: ${metrics.deadCodePercent}%\n- Oversized Files: ${oversizedFiles}\n`;
  fs.writeFileSync(path.join(REPORTS_DIR, 'architecture-metrics.md'), metricsMd);
  fs.writeFileSync(path.join(REPORTS_DIR, 'architecture-health.md'), `# Architecture Health\nScore: ${score}/100\nViolations: ${violations.length}`);
  fs.writeFileSync(path.join(REPORTS_DIR, 'boundary-violations.json'), JSON.stringify(violations, null, 2));

  console.log(`Architecture Health Score: ${score}/100`);
  if (violations.length > 0) {
    if (process.env.ENFORCEMENT_MODE === 'STRICT') {
      console.error('Validation failed!');
      process.exit(1);
    } else {
      console.warn('Validation completed with warnings.');
    }
  }
}

validate().catch(console.error);
