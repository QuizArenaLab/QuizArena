import { useEffect, useState } from 'react';

export interface SessionState {
  attemptId: string;
  lastQuestionId: string | null;
  savedAt: number;
}

export function useSessionReconciliation(attemptId: string) {
  const [recoveredState, setRecoveredState] = useState<SessionState | null>(null);
  
  useEffect(() => {
    if (!attemptId) return;
    const key = `quizarena_session_${attemptId}`;
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setRecoveredState(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Session reconciliation failed', e);
    }
  }, [attemptId]);

  const saveState = (lastQuestionId: string | null) => {
    if (!attemptId) return;
    const state: SessionState = { attemptId, lastQuestionId, savedAt: Date.now() };
    localStorage.setItem(`quizarena_session_${attemptId}`, JSON.stringify(state));
  };

  const clearState = () => {
    if (!attemptId) return;
    localStorage.removeItem(`quizarena_session_${attemptId}`);
  }

  return { recoveredState, saveState, clearState };
}
