import * as fs from 'fs';
import * as path from 'path';

export class ReadmeGenerator {
  static generate(modulePath: string, featureName: string) {
    const readmePath = path.join(modulePath, 'README.md');
    
    const content = `# ${featureName}

## Purpose
Describe the bounded context and purpose of this feature.

## Responsibilities
- [ ] List core responsibilities

## Public API
- Everything exported from \`index.ts\` is considered the public API.
- Do not deep-import files from this module.

## Folder Structure
Follows standard QuizArena module architecture.

## Dependencies
- Document external module dependencies here.

## Extension Guidelines
- How to add new capabilities to this feature safely.
`;

    fs.writeFileSync(readmePath, content);
  }
}
