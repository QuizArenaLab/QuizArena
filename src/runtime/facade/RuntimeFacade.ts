import { RuntimeContext } from '../context/RuntimeContext';
import { NavigationManager } from '../services/NavigationManager';
import { AnswerStateManager } from '../services/AnswerStateManager';
import { AutoSavePipeline } from '../services/AutoSavePipeline';

export class RuntimeFacade {
  constructor(
    private navigation: NavigationManager,
    private answers: AnswerStateManager,
    private syncPipeline: AutoSavePipeline
  ) {}

  public async navigate(context: RuntimeContext, questionId: string): Promise<void> {
    await this.navigation.navigateTo(context, questionId);
  }

  public async submitAnswer(context: RuntimeContext, questionId: string, payload: any): Promise<void> {
    await this.answers.setAnswer(context, questionId, payload);
    await this.syncPipeline.queueSync(questionId, payload);
  }

  public async markReview(context: RuntimeContext, questionId: string, isMarked: boolean): Promise<void> {
    await this.answers.markForReview(context, questionId, isMarked);
  }
}
