"use client";

import React, { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { createSubscriptionIntent, activateSubscription } from "@/features/billing/services/monetization";
import { SubscriptionPlan, SubscriptionStatus, UserSubscription } from "@/generated/prisma";
import { cn } from "@/lib/utils";

export function SubscriptionClient({
  plans,
  activeSubscription,
}: {
  plans: SubscriptionPlan[];
  activeSubscription: (UserSubscription & { plan: SubscriptionPlan }) | null;
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    try {
      setLoadingId(planId);
      setError(null);

      // 1. Create intent
      const { subscriptionId } = await createSubscriptionIntent(planId);

      // 2. Mock payment verification (Razorpay logic would go here)
      const mockPaymentReference = "pay_" + crypto.randomUUID();

      // 3. Activate
      await activateSubscription(subscriptionId, mockPaymentReference);

      alert("Subscription Activated Successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to process subscription");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full">
      {error && <div className="p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50">{error}</div>}

      {activeSubscription && activeSubscription.status === SubscriptionStatus.ACTIVE && (
        <div className="mb-10 bg-linear-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-navy">
              Current Plan: {activeSubscription.plan.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Valid until:{" "}
              {activeSubscription.expiresAt
                ? new Date(activeSubscription.expiresAt).toLocaleDateString()
                : "Forever"}
            </p>
          </div>
          <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-100 text-sm font-medium text-emerald-600">
            Active
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => {
          const isCurrent = activeSubscription?.planId === plan.id;
          const features = (plan.features as string[]) || [];

          return (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-md",
                plan.slug === "premium"
                  ? "border-indigo-500 shadow-indigo-100 ring-1 ring-indigo-500"
                  : "border-gray-200"
              )}
            >
              {plan.slug === "premium" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-navy mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-500 min-h-[40px]">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-navy font-display">
                  ${plan.price}
                </span>
                <span className="text-gray-500 font-medium">
                  /{plan.duration === 30 ? "mo" : plan.duration === 365 ? "yr" : "term"}
                </span>
              </div>

              <ul className="flex-1 space-y-4 mb-8">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <Check className="w-5 h-5 text-indigo-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isCurrent || loadingId === plan.id}
                className={cn(
                  "w-full py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2",
                  isCurrent
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : plan.slug === "premium"
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                      : "bg-navy text-white hover:bg-navy-light"
                )}
              >
                {loadingId === plan.id && <Loader2 className="w-4 h-4 animate-spin" />}
                {isCurrent
                  ? "Current Plan"
                  : loadingId === plan.id
                    ? "Processing..."
                    : "Subscribe Now"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
