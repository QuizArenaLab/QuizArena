import { create } from 'zustand';
import { IntelligenceSnapshot } from '../services/DecisionPipeline';
import { AssessmentRecommendation } from '../services/RecommendationEngine';

interface IntelligenceState {
  currentSnapshot: IntelligenceSnapshot | null;
  activeRecommendations: AssessmentRecommendation[];
  setSnapshot: (snapshot: IntelligenceSnapshot) => void;
  setActiveRecommendations: (recommendations: AssessmentRecommendation[]) => void;
  dismissRecommendation: (id: string) => void;
}

export const useIntelligenceStore = create<IntelligenceState>((set) => ({
  currentSnapshot: null,
  activeRecommendations: [],
  
  setSnapshot: (snapshot) => set({ currentSnapshot: snapshot }),
  
  setActiveRecommendations: (recommendations) => set({ activeRecommendations: recommendations }),
  
  dismissRecommendation: (id) => set((state) => ({
    activeRecommendations: state.activeRecommendations.filter(r => r.id !== id)
  }))
}));
