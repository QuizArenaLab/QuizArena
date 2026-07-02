import { Logger } from '../core/Logger';

export class NamingStandardizer {
  static normalizeFileName(fileName: string): string {
    // E.g. "CompetitionStudioLayout.tsx" is fine.
    // We enforce PascalCase for files, unless they are standard like index.ts
    if (fileName === 'index.ts' || fileName === 'page.tsx' || fileName === 'layout.tsx') {
      return fileName;
    }

    const baseName = fileName.substring(0, fileName.lastIndexOf('.'));
    const extension = fileName.substring(fileName.lastIndexOf('.'));
    
    // Convert to PascalCase if it's not
    const pascal = baseName
      .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
      .replace(/^[a-z]/, c => c.toUpperCase());
    
    return pascal + extension;
  }

  static normalizeFolderName(folderName: string): string {
    // lowercase, kebab-case
    return folderName
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();
  }
}
