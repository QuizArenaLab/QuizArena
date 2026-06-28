import { prisma } from '@/lib/prisma';
import { BulkJobStatus, LifecycleActorType } from '@/generated/prisma';
import { competitionLifecycle } from './competition-lifecycle.service';

export class BulkOperationService {
  async startBulkPublish(competitionIds: string[], actorId: string): Promise<string> {
    const job = await prisma.bulkOperationJob.create({
      data: {
        operationType: 'PUBLISH_COMPETITIONS',
        totalItems: competitionIds.length,
        startedBy: actorId,
        status: BulkJobStatus.RUNNING
      }
    });

    // Run asynchronously
    this.processBulkPublish(job.id, competitionIds, actorId).catch(console.error);

    return job.id;
  }

  private async processBulkPublish(jobId: string, competitionIds: string[], actorId: string) {
    let processed = 0;
    let failed = 0;
    const errors: any[] = [];

    for (const id of competitionIds) {
      try {
        await competitionLifecycle.moveToReady(id, actorId, LifecycleActorType.ADMIN);
        processed++;
      } catch (e: any) {
        failed++;
        errors.push({ id, error: e.message });
      }

      // Update progress every 5 items or at the end
      if ((processed + failed) % 5 === 0 || (processed + failed) === competitionIds.length) {
        await prisma.bulkOperationJob.update({
          where: { id: jobId },
          data: {
            processedItems: processed,
            failedItems: failed,
            status: (processed + failed) === competitionIds.length ? BulkJobStatus.COMPLETED : BulkJobStatus.RUNNING,
            results: errors,
            completedAt: (processed + failed) === competitionIds.length ? new Date() : null
          }
        });
      }
    }
  }

  async getJobStatus(jobId: string) {
    return prisma.bulkOperationJob.findUnique({ where: { id: jobId } });
  }
}

export const bulkOperationService = new BulkOperationService();
