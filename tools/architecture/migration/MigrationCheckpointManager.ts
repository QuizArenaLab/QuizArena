import * as fs from 'fs';
import * as path from 'path';
import { ROOT_DIR } from '../core/Constants';
import { Logger } from '../core/Logger';

export interface MigrationCheckpoint {
  batchId: string;
  timestamp: string;
  migratedModules: string[];
  redirectedImports: { oldPath: string, newPath: string }[];
  deletedModules: string[];
  validationResults: boolean;
}

export class MigrationCheckpointManager {
  private static checkpointDir = path.join(ROOT_DIR, 'tools', 'architecture', 'reports', 'checkpoints');

  static save(checkpoint: MigrationCheckpoint) {
    if (!fs.existsSync(this.checkpointDir)) {
      fs.mkdirSync(this.checkpointDir, { recursive: true });
    }
    
    const filename = `checkpoint-${checkpoint.batchId}.json`;
    fs.writeFileSync(path.join(this.checkpointDir, filename), JSON.stringify(checkpoint, null, 2));
    Logger.info(`Checkpoint saved: ${filename}`);
  }

  static getLatest(): MigrationCheckpoint | null {
    if (!fs.existsSync(this.checkpointDir)) return null;
    
    const files = fs.readdirSync(this.checkpointDir).filter(f => f.startsWith('checkpoint-'));
    if (files.length === 0) return null;
    
    // Naive sort by filename, which works if batchId is sequential or timestamped
    files.sort(); 
    const latest = files[files.length - 1];
    
    const content = fs.readFileSync(path.join(this.checkpointDir, latest), 'utf8');
    return JSON.parse(content) as MigrationCheckpoint;
  }
}
