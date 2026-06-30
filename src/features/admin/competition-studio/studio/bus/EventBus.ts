/**
 * Event Bus
 * 
 * Central event publisher for the Competition Studio.
 * Future phases will subscribe to these events for reactive updates.
 */

export type StudioEventType = 
  | 'StudioOpened'
  | 'CompetitionLoaded'
  | 'NavigationChanged'
  | 'LayoutChanged'
  | 'InspectorOpened'
  | 'InspectorClosed'
  | 'LockAcquired'
  | 'SaveStarted'
  | 'SaveCompleted'
  | 'SaveFailed'
  | 'LockReleased'
  | 'ExplorerOpened'
  | 'SearchExecuted'
  | 'QuestionSelected'
  | 'QuestionDeselected'
  | 'QuestionPreviewOpened'
  | 'BasketCommitted'
  | 'RecommendationAccepted'
  | 'DuplicateDetected'
  | 'SectionCreated'
  | 'SectionUpdated'
  | 'SectionDeleted'
  | 'QuestionAdded'
  | 'QuestionMoved'
  | 'QuestionRemoved'
  | 'QuestionReplaced'
  | 'QuestionDuplicated'
  | 'CompositionUpdated'
  | 'CompositionSaved'
  | 'CompositionSnapshotCreated'
  | 'CompositionHealthUpdated'
  | 'SelectionChanged'
  | 'AnalysisStarted'
  | 'AnalysisCompleted'
  | 'RecommendationCreated'
  | 'RecommendationResolved'
  | 'HealthChanged'
  | 'CoverageChanged'
  | 'RiskChanged'
  | 'FingerprintChanged'
  | 'SnapshotCreated'
  | 'ReadinessEvaluationStarted'
  | 'ReadinessEvaluationCompleted'
  | 'PublishGatePassed'
  | 'PublishGateBlocked'
  | 'IssueResolved'
  | 'IssueCreated'
  | 'ReadinessImproved'
  | 'ReadinessRegressed';

export interface StudioEvent<T = any> {
  type: StudioEventType;
  payload?: T;
  timestamp: number;
}

type EventHandler = (event: StudioEvent) => void;

class EventBusService {
  private listeners: Map<StudioEventType, EventHandler[]> = new Map();

  subscribe(type: StudioEventType, handler: EventHandler) {
    const currentListeners = this.listeners.get(type) || [];
    this.listeners.set(type, [...currentListeners, handler]);
    
    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(type) || [];
      this.listeners.set(type, listeners.filter(h => h !== handler));
    };
  }

  publish(type: StudioEventType, payload?: any) {
    const event: StudioEvent = {
      type,
      payload,
      timestamp: Date.now()
    };

    console.debug(`[EventBus] Published: ${event.type}`, event.payload);
    const listeners = this.listeners.get(type) || [];
    
    listeners.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error(`[EventBus] Error in listener for event ${event.type}:`, error);
      }
    });
  }
}

export const EventBus = new EventBusService();
