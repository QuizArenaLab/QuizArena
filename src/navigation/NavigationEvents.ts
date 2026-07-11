export interface NavigationEventPayloads {
  ItemSelected: { id: string; route: string };
  GroupExpanded: { id: string };
  GroupCollapsed: { id: string };
  SidebarCollapsed: { trigger: "user" | "responsive" | "system" };
  SidebarExpanded: { trigger: "user" | "responsive" | "system" };
}

export type NavigationEventType = keyof NavigationEventPayloads;

export type NavigationEventHandler<T extends NavigationEventType> = (
  payload: NavigationEventPayloads[T]
) => void;

class NavigationEventBusClass {
  private listeners: { [K in NavigationEventType]?: NavigationEventHandler<K>[] } = {};

  subscribe<T extends NavigationEventType>(
    event: T,
    handler: NavigationEventHandler<T>
  ): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    // Type assertion needed because TypeScript can't easily map the indexed generic tuple here
    (this.listeners[event] as any).push(handler);

    return () => {
      this.listeners[event] = (this.listeners[event] as any).filter((h: any) => h !== handler);
    };
  }

  dispatch<T extends NavigationEventType>(event: T, payload: NavigationEventPayloads[T]): void {
    const handlers = this.listeners[event];
    if (handlers) {
      handlers.forEach((handler) => handler(payload));
    }
  }
}

export const NavigationEventBus = new NavigationEventBusClass();
