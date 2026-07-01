import { Project, SourceFile, SyntaxKind } from 'ts-morph';
import madge from 'madge';
import * as fs from 'fs';
import * as path from 'path';

const ARTIFACTS_DIR = process.argv[2] || process.cwd();
const SRC_DIR = path.join(process.cwd(), 'src');

async function runAudit() {
  console.log('Starting architecture audit...');
  
  const project = new Project({
    tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
    skipAddingFilesFromTsConfig: true
  });
  
  project.addSourceFilesAtPaths("src/**/*.{ts,tsx}");
  const files = project.getSourceFiles();
  
  const moduleMap: Record<string, any> = {};
  const sharedCandidates: string[] = [];
  const legacyFiles: string[] = [];
  
  let crossDomainViolations = 0;
  
  // Categorize files and analyze imports
  for (const file of files) {
    const filePath = file.getFilePath();
    const relativePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
    
    // Determine Domain and Feature
    let domain = 'Shared';
    let feature = 'Unknown';
    let layer = 'Unknown';
    let status = 'ACTIVE';
    let owner = 'Platform';
    
    if (relativePath.includes('/features/')) {
      const parts = relativePath.split('/features/')[1].split('/');
      domain = parts[0];
      feature = parts[1] || 'Unknown';
      
      // Determine layer from standard folders
      const standardLayers = ['actions', 'components', 'controllers', 'kernel', 'repositories', 'services', 'stores', 'validators', 'hooks', 'events', 'commands', 'types', 'shared'];
      for (const l of standardLayers) {
        if (relativePath.includes(`/${l}/`)) {
          layer = l;
          break;
        }
      }
    } else if (relativePath.includes('/app/')) {
      domain = 'Routing';
      layer = 'UI';
    } else if (relativePath.includes('/shared/')) {
      domain = 'Shared';
      layer = relativePath.split('/shared/')[1].split('/')[0] || 'Unknown';
      sharedCandidates.push(relativePath);
    }
    
    // Mark legacy
    if (relativePath.toLowerCase().includes('legacy') || relativePath.toLowerCase().includes('old') || relativePath.includes('v2') || relativePath.includes('backup') || relativePath.includes('archive')) {
      status = 'LEGACY';
      legacyFiles.push(relativePath);
    }
    
    // Dependencies
    const imports = file.getImportDeclarations();
    let importCount = imports.length;
    let exportCount = file.getExportDeclarations().length + (file.getExportedDeclarations().size);
    
    // Domain boundary validation
    for (const imp of imports) {
      const moduleSpecifier = imp.getModuleSpecifierValue();
      if (moduleSpecifier.startsWith('@/features/')) {
        const importParts = moduleSpecifier.split('@/features/')[1].split('/');
        const importDomain = importParts[0];
        
        if (domain !== 'Routing' && domain !== 'Shared' && importDomain !== domain) {
          // Cross-domain import detected!
          crossDomainViolations++;
        }
      }
    }
    
    moduleMap[relativePath] = {
      Domain: domain,
      Feature: feature,
      Layer: layer,
      Owner: owner,
      ImportCount: importCount,
      ExportCount: exportCount,
      DependencyCount: importCount, // simplified
      Status: status,
      MigrationTarget: status === 'LEGACY' ? 'TBD' : 'None'
    };
  }
  
  // Save module-map.json
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'module-map.json'), JSON.stringify(moduleMap, null, 2));
  
  // Run Madge for circular dependencies & dependency graph
  console.log('Running Madge dependency analysis...');
  const res = await madge('src', { fileExtensions: ['ts', 'tsx'], tsConfig: 'tsconfig.json' });
  const graph = res.obj();
  const circular = res.circular();
  
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'dependency-graph.json'), JSON.stringify(graph, null, 2));
  
  // Shared Candidates
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'shared-candidates.md'), `# Shared Candidates\n\n` + sharedCandidates.map(c => `- [ ] ${c}`).join('\n'));
  
  // Legacy Report
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'legacy-report.md'), `# Legacy Files\n\n` + legacyFiles.map(c => `- [ ] ${c}`).join('\n'));
  
  // Architecture Audit Report
  const auditReport = `# Architecture Audit Report

## Summary
- **Total Files Analyzed**: ${files.length}
- **Cross-Domain Violations**: ${crossDomainViolations}
- **Circular Dependencies**: ${circular.length}

## Circular Dependencies
${circular.length > 0 ? circular.map(c => `- ${c.join(' -> ')}`).join('\n') : '✅ None detected!'}

## Validation Status
- **Domain Boundaries**: ${crossDomainViolations === 0 ? '✅ Passed' : '❌ Failed'}
- **Circular Imports**: ${circular.length === 0 ? '✅ Passed' : '❌ Failed'}
`;

  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'architecture-audit.md'), auditReport);
  console.log('Audit completed successfully.');
}

runAudit().catch(console.error);
