import { prisma } from "@/lib/prisma";
import { paymentGateway } from "../gateways/payment.gateway";
import { RegistrationState, PaymentOrderStatus } from "@/generated/prisma";

export class RegistrationService {
  async registerForCompetition(userId: string, competitionId: string) {
    return prisma.$transaction(async (tx) => {
      // 1. Get competition and eligibility with row-level lock (if needed, but simple read for now)
      const competition = await tx.competition.findUnique({
        where: { id: competitionId },
        include: { eligibility: true },
      });

      if (!competition) throw new Error("Competition not found");

      // 2. Check limits
      if (competition.eligibility?.maxParticipants) {
        const currentCount = await tx.registration.count({
          where: { competitionId },
        });
        if (currentCount >= competition.eligibility.maxParticipants) {
          throw new Error("Competition capacity is full");
        }
      }

      // 3. Get the active pricing policy
      const pricingPolicy = await tx.competitionPricingPolicy.findFirst({
        where: { competitionId, isActive: true },
        orderBy: { version: "desc" },
      });

      if (!pricingPolicy) {
        throw new Error("No active pricing policy found for this competition.");
      }

      // Check if already registered
      const existing = await tx.registration.findUnique({
        where: { userId_competitionId: { userId, competitionId } },
      });
      if (existing) {
        throw new Error("User is already registered or in-progress");
      }

      // 4. Handle Free vs Paid
      if (pricingPolicy.baseFee === 0) {
        // FREE COMPETITION
        const registration = await tx.registration.create({
          data: {
            userId,
            competitionId,
            pricingPolicyId: pricingPolicy.id,
            state: RegistrationState.ENROLLED,
            enrolledAt: new Date(),
          },
        });

        return {
          registrationId: registration.id,
          status: "ENROLLED",
          amount: 0,
          currency: pricingPolicy.currency,
        };
      }

      // PAID COMPETITION
      const registration = await tx.registration.create({
        data: {
          userId,
          competitionId,
          pricingPolicyId: pricingPolicy.id,
          state: RegistrationState.PAYMENT_PENDING,
        },
      });

      // Create the order in Razorpay (note: usually doing network calls in a transaction is bad practice,
      // but keeping it simple for the scope)
      const paymentResult = await paymentGateway.createOrder({
        amount: pricingPolicy.baseFee,
        currency: pricingPolicy.currency,
        receiptId: registration.id,
      });

      const paymentOrder = await tx.paymentOrder.create({
        data: {
          registrationId: registration.id,
          userId,
          competitionId,
          amount: pricingPolicy.baseFee,
          currency: pricingPolicy.currency,
          razorpayOrderId: paymentResult.orderId,
          status: PaymentOrderStatus.CREATED,
        },
      });

      return {
        registrationId: registration.id,
        orderId: paymentResult.orderId,
        amount: paymentResult.amount,
        currency: paymentResult.currency,
        status: "PAYMENT_PENDING",
      };
    });
  }
}

export const registrationService = new RegistrationService();
