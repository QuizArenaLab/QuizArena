import { prisma } from '@/lib/prisma';
import { paymentGateway } from '../gateways/payment.gateway';
import { RegistrationState, PaymentOrderStatus } from '@/generated/prisma';

export class RegistrationService {
  async registerForCompetition(userId: string, competitionId: string) {
    // 1. Get the active pricing policy
    const pricingPolicy = await prisma.competitionPricingPolicy.findFirst({
      where: { competitionId, isActive: true },
      orderBy: { version: 'desc' },
    });

    if (!pricingPolicy) {
      throw new Error('No active pricing policy found for this competition.');
    }

    // 2. Create the Registration
    const registration = await prisma.registration.create({
      data: {
        userId,
        competitionId,
        pricingPolicyId: pricingPolicy.id,
        state: RegistrationState.PAYMENT_PENDING,
      },
    });

    // 3. Create the order in Razorpay
    const paymentResult = await paymentGateway.createOrder({
      amount: pricingPolicy.baseFee,
      currency: pricingPolicy.currency,
      receiptId: registration.id,
    });

    // 4. Create the PaymentOrder internally
    const paymentOrder = await prisma.paymentOrder.create({
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
    };
  }
}

export const registrationService = new RegistrationService();
