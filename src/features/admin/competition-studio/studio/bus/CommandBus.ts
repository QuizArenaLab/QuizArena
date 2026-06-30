/**
 * Command Bus
 * 
 * Central command dispatcher for the Competition Studio.
 * All mutations flow through commands; UI components must not mutate state directly.
 */

export type StudioCommandType = 
  | 'OpenStudio'
  | 'RefreshStudio'
  | 'NavigateStudio'
  | 'UpdateMetadata'
  | 'ResizePanel'
  | 'ToggleInspector'
  | 'AcquireLock'
  | 'ReleaseLock'
  | 'PreviewCompetition'
  | 'OpenHistory'
  | 'OpenExplorer'
  | 'FocusSearch'
  | 'ClearFilters'
  | 'OpenRecommendations'
  | 'ShowDuplicates'
  | 'ToggleBasket'
  | 'SelectAll'
  | 'AddSection'
  | 'DeleteSection'
  | 'DuplicateSection'
  | 'MoveSection'
  | 'AddQuestion'
  | 'ReplaceQuestion'
  | 'RemoveQuestion'
  | 'PreviewQuestion'
  | 'CollapseAll'
  | 'AnalyzeAssessment'
  | 'RefreshIntelligence'
  | 'DismissRecommendation'
  | 'OpenCoverage'
  | 'OpenDifficulty'
  | 'OpenHealth'
  | 'OpenRisk'
  | 'EvaluateReadiness'
  | 'RefreshReadiness'
  | 'OpenChecklist'
  | 'ResolveIssue'
  | 'GenerateReport';

export interface StudioCommand<T = any> {
  type: StudioCommandType;
  payload?: T;
}

type CommandHandler = (command: StudioCommand) => void | Promise<void>;

class CommandBusService {
  private handlers: Map<StudioCommandType, CommandHandler[]> = new Map();

  register(type: StudioCommandType, handler: CommandHandler) {
    const currentHandlers = this.handlers.get(type) || [];
    this.handlers.set(type, [...currentHandlers, handler]);
    
    // Return unsubscribe function
    return () => {
      const handlers = this.handlers.get(type) || [];
      this.handlers.set(type, handlers.filter(h => h !== handler));
    };
  }

  dispatch(command: StudioCommand) {
    console.debug(`[CommandBus] Dispatched: ${command.type}`, command.payload);
    const handlers = this.handlers.get(command.type) || [];
    
    if (handlers.length === 0) {
      console.warn(`[CommandBus] No handlers registered for command: ${command.type}`);
    }

    handlers.forEach(handler => {
      try {
        handler(command);
      } catch (error) {
        console.error(`[CommandBus] Error handling command ${command.type}:`, error);
      }
    });
  }
}

export const CommandBus = new CommandBusService();
