import { useCallback, useState } from 'react';

export interface SyncConflict {
  questionId: string;
  localAnswer: any;
  serverAnswer: any;
  localTimestamp: number;
  serverTimestamp: number;
}

export function useSyncConflictDetection() {
  const [conflicts, setConflicts] = useState<SyncConflict[]>([]);

  const detectConflict = useCallback((localAnswer: any, serverAnswer: any, localTimestamp: number, serverTimestamp: number, questionId: string) => {
    // If there is a server answer and it has a newer timestamp than our local answer, there might be a conflict.
    // Or if the server has an answer but we have a different one offline.
    if (serverAnswer && localAnswer && JSON.stringify(serverAnswer) !== JSON.stringify(localAnswer)) {
      if (serverTimestamp > localTimestamp) {
        // Server wins, or we notify user
        setConflicts(prev => [...prev, { questionId, localAnswer, serverAnswer, localTimestamp, serverTimestamp }]);
        return true;
      }
    }
    return false;
  }, []);

  const resolveConflict = useCallback((questionId: string, resolution: 'local' | 'server') => {
    setConflicts(prev => prev.filter(c => c.questionId !== questionId));
    return resolution; // The caller will then use this resolution to update the queue or the server
  }, []);

  return { conflicts, detectConflict, resolveConflict };
}
