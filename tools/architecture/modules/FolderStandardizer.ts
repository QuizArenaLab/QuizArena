import { Logger } from '../core/Logger';

export class FolderStandardizer {
  static readonly ALLOWED_ROOT_DIRS = [
    'actions', 'commands', 'components', 'controllers', 'events', 
    'hooks', 'kernel', 'repositories', 'services', 'shared', 
    'stores', 'types', 'validators', 'views'
  ];

  static readonly ALLOWED_OPTIONAL_DIRS = [
    'analytics', 'drawers', 'dialogs', 'summary', 'timeline', 
    'charts', 'providers', 'adapters', 'mappers', 'policies', 
    'factories', 'strategies'
  ];

  static normalize(directoryPath: string): string {
    // Normalizes directory names to lowercase, kebab-case
    // E.g. "CompetitionStudio" -> "competition-studio"
    const baseName = directoryPath.split('/').pop() || '';
    const normalized = baseName
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();
    
    return directoryPath.replace(baseName, normalized);
  }

  static isStandardLayout(structure: string[]): boolean {
    // Verifies if the structure consists only of allowed directories
    const allAllowed = [...this.ALLOWED_ROOT_DIRS, ...this.ALLOWED_OPTIONAL_DIRS];
    return structure.every(dir => allAllowed.includes(dir));
  }
}
