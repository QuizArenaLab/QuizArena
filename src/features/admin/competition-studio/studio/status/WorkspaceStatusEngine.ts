/**
 * Workspace Status Engine
 * 
 * Centralized status model for the Competition Studio.
 * Every region reads this status to determine its UI state.
 */

export type WorkspaceStatus = 
  | 'READY'
  | 'LOADING'
  | 'SAVING'
  | 'SYNCING'
  | 'ERROR'
  | 'OFFLINE'
  | 'LOCKED'
  | 'READ_ONLY';

// In a full implementation, this might be a Zustand slice or part of the StudioContext
// For the architectural shell, we define the types and a simple observable or state hook pattern.

import { create } from 'zustand';

interface WorkspaceStatusState {
  status: WorkspaceStatus;
  message?: string;
  setStatus: (status: WorkspaceStatus, message?: string) => void;
}

export const useWorkspaceStatus = create<WorkspaceStatusState>((set) => ({
  status: 'LOADING',
  message: undefined,
  setStatus: (status, message) => set({ status, message }),
}));
