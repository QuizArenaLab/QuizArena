import { PrismaClient } from "../generated/prisma";

import { initializeEventBus } from "../infrastructure/events/EventRegistry";

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// Start event bus and listeners
if (typeof window === "undefined") {
  initializeEventBus();
}

export { prisma };

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
