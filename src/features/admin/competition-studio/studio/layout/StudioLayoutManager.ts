/**
 * Studio Layout Manager
 * 
 * Centralized service to manage and persist layout configuration.
 * Avoids scattering layout logic across hooks.
 */

export interface StudioLayoutConfig {
  sidebarWidth: number;
  inspectorWidth: number;
  sidebarCollapsed: boolean;
  inspectorCollapsed: boolean;
  activePanel?: string;
  splitterPositions: Record<string, number>;
  zoomLevel: number;
}

const DEFAULT_LAYOUT: StudioLayoutConfig = {
  sidebarWidth: 250,
  inspectorWidth: 300,
  sidebarCollapsed: false,
  inspectorCollapsed: false,
  splitterPositions: {},
  zoomLevel: 100,
};

const STORAGE_KEY = 'competition_studio_layout';

class LayoutManagerService {
  private config: StudioLayoutConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): StudioLayoutConfig {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return { ...DEFAULT_LAYOUT, ...JSON.parse(stored) };
        }
      } catch (e) {
        console.error('Failed to load studio layout config', e);
      }
    }
    return { ...DEFAULT_LAYOUT };
  }

  private saveConfig() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
      } catch (e) {
        console.error('Failed to save studio layout config', e);
      }
    }
  }

  getConfig(): StudioLayoutConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<StudioLayoutConfig>) {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
  }

  resetLayout() {
    this.config = { ...DEFAULT_LAYOUT };
    this.saveConfig();
  }
}

export const StudioLayoutManager = new LayoutManagerService();
