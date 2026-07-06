import { useState, useEffect, useCallback } from 'react';

export interface QueuedAnswer {
  id: string;
  questionId: string;
  answerData: any;
  timestamp: number;
}

export function useOfflineQueue(queueKey: string = 'quizarena_offline_queue') {
  const [queue, setQueue] = useState<QueuedAnswer[]>([]);

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(queueKey);
      if (stored) {
        setQueue(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load offline queue', e);
    }
  }, [queueKey]);

  // Enqueue
  const enqueue = useCallback((answer: Omit<QueuedAnswer, 'id' | 'timestamp'>) => {
    setQueue(prev => {
      const newQueue = [...prev, {
        ...answer,
        id: crypto.randomUUID(),
        timestamp: Date.now()
      }];
      localStorage.setItem(queueKey, JSON.stringify(newQueue));
      return newQueue;
    });
  }, [queueKey]);

  // Dequeue (remove items that were successfully synced)
  const dequeue = useCallback((idsToRemove: string[]) => {
    setQueue(prev => {
      const newQueue = prev.filter(item => !idsToRemove.includes(item.id));
      localStorage.setItem(queueKey, JSON.stringify(newQueue));
      return newQueue;
    });
  }, [queueKey]);

  return { queue, enqueue, dequeue };
}
