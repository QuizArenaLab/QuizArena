import { CompetitionLifecycle } from '@/generated/prisma';

export type LifecycleHookFn = (competitionId: string, metadata?: any) => Promise<void>;

export interface LifecycleHooks {
  beforeReady: LifecycleHookFn[];
  afterReady: LifecycleHookFn[];
  beforeScheduled: LifecycleHookFn[];
  afterScheduled: LifecycleHookFn[];
  beforeLive: LifecycleHookFn[];
  afterLive: LifecycleHookFn[];
  beforeCompleted: LifecycleHookFn[];
  afterCompleted: LifecycleHookFn[];
  beforeArchived: LifecycleHookFn[];
  afterArchived: LifecycleHookFn[];
}

class CompetitionHooksService {
  private hooks: LifecycleHooks = {
    beforeReady: [], afterReady: [],
    beforeScheduled: [], afterScheduled: [],
    beforeLive: [], afterLive: [],
    beforeCompleted: [], afterCompleted: [],
    beforeArchived: [], afterArchived: [],
  };

  registerHook(stage: keyof LifecycleHooks, handler: LifecycleHookFn) {
    this.hooks[stage].push(handler);
  }

  async executeHooks(stage: keyof LifecycleHooks, competitionId: string, metadata?: any): Promise<void> {
    const handlers = this.hooks[stage];
    for (const handler of handlers) {
      await handler(competitionId, metadata);
    }
  }
}

export const competitionHooks = new CompetitionHooksService();
