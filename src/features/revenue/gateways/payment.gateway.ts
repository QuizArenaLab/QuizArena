import { razorpayClient } from '../providers/razorpay.provider';

export interface CreateOrderParams {
  amount: number; // Amount in INR (not paise, gateway will convert to paise)
  currency?: string;
  receiptId: string;
}

export interface PaymentOrderResult {
  orderId: string;
  amount: number;
  currency: string;
}

export class PaymentGateway {
  async createOrder(params: CreateOrderParams): Promise<PaymentOrderResult> {
    const amountInPaise = Math.round(params.amount * 100);
    
    const order = await razorpayClient.orders.create({
      amount: amountInPaise,
      currency: params.currency || 'INR',
      receipt: params.receiptId,
      payment_capture: true,
    });

    return {
      orderId: order.id,
      amount: params.amount,
      currency: order.currency || 'INR',
    };
  }
}

export const paymentGateway = new PaymentGateway();
