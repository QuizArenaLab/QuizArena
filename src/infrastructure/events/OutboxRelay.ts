import { PrismaClient } from "../../../generated/prisma";
import { PlatformEventBus } from "./PlatformEventBus";
import { PlatformEvent } from "./types";

const prisma = new PrismaClient();

export class OutboxRelay {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;
  private readonly pollIntervalMs = 5000; // Poll every 5 seconds for MVP

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log(`[OutboxRelay] Started polling every ${this.pollIntervalMs}ms`);
    
    this.intervalId = setInterval(() => {
      this.processOutbox().catch((err) => {
        console.error(`[OutboxRelay] Error processing outbox:`, err);
      });
    }, this.pollIntervalMs);
  }

  stop() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public async processOutbox() {
    // 1. Fetch unpublished messages
    const messages = await prisma.outboxMessage.findMany({
      where: {
        publishedAt: null,
      },
      take: 50, // Batch size
      orderBy: {
        createdAt: "asc",
      },
    });

    if (messages.length === 0) return;

    for (const msg of messages) {
      try {
        // 2. Reconstruct event
        const event: PlatformEvent = {
          eventId: msg.id,
          eventType: msg.eventType,
          payload: msg.payload,
          aggregateId: msg.aggregateId || undefined,
          aggregateType: msg.aggregateType || undefined,
          timestamp: msg.createdAt,
        };

        // 3. Emit to memory bus
        PlatformEventBus.emit(event);

        // 4. Mark as published
        await prisma.outboxMessage.update({
          where: { id: msg.id },
          data: { publishedAt: new Date() },
        });

      } catch (error: any) {
        console.error(`[OutboxRelay] Failed to process message ${msg.id}:`, error);
        await prisma.outboxMessage.update({
          where: { id: msg.id },
          data: { error: error?.message || "Unknown error" },
        });
      }
    }
  }
}

export const platformOutboxRelay = new OutboxRelay();
