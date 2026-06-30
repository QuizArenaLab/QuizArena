import { create } from 'zustand';
import { ReadinessDecision, ReadinessSnapshot } from '../types/readiness.types';

interface ReadinessState {
  currentSnapshot: ReadinessSnapshot | null;
  domainScores: Record<string, number>;
  blockingTree: any; // Hierarchical tree of issues
  publishImpact: any[];
  
  setSnapshot: (snapshot: ReadinessSnapshot) => void;
  setDomainScores: (scores: Record<string, number>) => void;
  setBlockingTree: (tree: any) => void;
  setPublishImpact: (impact: any[]) => void;
}

export const useReadinessStore = create<ReadinessState>((set) => ({
  currentSnapshot: null,
  domainScores: {
    metadata: 0,
    configuration: 0,
    composition: 0,
    coverage: 0,
    publishing: 0
  },
  blockingTree: {},
  publishImpact: [],
  
  setSnapshot: (snapshot) => set({ currentSnapshot: snapshot }),
  setDomainScores: (scores) => set({ domainScores: scores }),
  setBlockingTree: (tree) => set({ blockingTree: tree }),
  setPublishImpact: (impact) => set({ publishImpact: impact })
}));
