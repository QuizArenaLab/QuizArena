import * as fs from 'fs';
import * as path from 'path';

export class IndexGenerator {
  static generate(modulePath: string, exportsList: string[]) {
    const indexPath = path.join(modulePath, 'index.ts');
    
    let content = `// Auto-generated module entry point\n// Exposes public API for this feature\n\n`;
    
    exportsList.forEach(exp => {
      content += `export * from '${exp}';\n`;
    });
    
    fs.writeFileSync(indexPath, content);
  }
}
