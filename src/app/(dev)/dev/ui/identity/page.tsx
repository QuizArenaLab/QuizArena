"use client";

import React, { useState } from "react";
import {
  IdentityContextProvider,
  IdentityWorkspace,
  AuthenticationWorkspace,
  LoginFlow,
  RegisterFlow,
  ForgotPasswordFlow,
  ResetPasswordFlow,
  VerifyEmailFlow,
  EmailVerificationCard,
  EmailVerificationStatus,
  ForgotPasswordCard,
  ResetPasswordCard,
  PasswordUpdatedPlaceholder,
  UserProfileCard,
  UserAvatar,
  ProfileCompletion,
  SessionCard,
  CurrentSession,
  SessionDeviceCard,
  SessionStatus,
} from "@/features/identity";

export default function IdentityPlayground() {
  const [gallery, setGallery] = useState<
    "AUTH_STATES" | "PROFILE" | "SESSION" | "VERIFICATION" | "STRESS"
  >("AUTH_STATES");

  return (
    <IdentityContextProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <div className="border-b border-border bg-card p-4 sticky top-0 z-10 flex justify-between items-center shadow-sm">
          <div>
            <h1 className="text-xl font-bold">Enterprise Identity Foundation</h1>
            <p className="text-xs text-muted-foreground mt-1">
              FA-01.1 Presentation Architecture (Supabase-First)
            </p>
          </div>
          <div className="flex gap-2">
            {["AUTH_STATES", "PROFILE", "SESSION", "VERIFICATION", "STRESS"].map((g) => (
              <button
                key={g}
                className={`px-3 py-1 text-xs border rounded ${gallery === g ? "bg-primary text-white" : ""}`}
                onClick={() => setGallery(g as any)}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-6 bg-muted/10">
          <IdentityWorkspace className="max-w-6xl mx-auto space-y-6">
            {gallery === "AUTH_STATES" && (
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-bold border-b pb-2">Login Flows</h3>
                  <LoginFlow className="border rounded bg-card p-6 shadow-sm">
                    <h4 className="text-lg font-bold mb-4 text-center">Welcome Back</h4>
                    <button className="w-full py-2 border rounded font-medium flex items-center justify-center gap-2 mb-4 hover:bg-muted">
                      <span className="w-4 h-4 bg-slate-200 rounded-full inline-block"></span>{" "}
                      Continue with Google
                    </button>
                    <div className="relative flex py-4 items-center">
                      <div className="flex-grow border-t border-muted"></div>
                      <span className="flex-shrink-0 mx-4 text-muted-foreground text-xs uppercase">
                        Or
                      </span>
                      <div className="flex-grow border-t border-muted"></div>
                    </div>
                    <input
                      type="email"
                      placeholder="Email address"
                      className="w-full p-2 border rounded mb-2 text-sm"
                      readOnly
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full p-2 border rounded mb-4 text-sm"
                      readOnly
                    />
                    <button className="w-full py-2 bg-primary text-white rounded font-medium">
                      Sign In
                    </button>
                  </LoginFlow>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold border-b pb-2">Registration Flows</h3>
                  <RegisterFlow className="border rounded bg-card p-6 shadow-sm">
                    <h4 className="text-lg font-bold mb-4 text-center">Create Account</h4>
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full p-2 border rounded mb-2 text-sm"
                      readOnly
                    />
                    <input
                      type="email"
                      placeholder="Email address"
                      className="w-full p-2 border rounded mb-2 text-sm"
                      readOnly
                    />
                    <input
                      type="password"
                      placeholder="Create Password"
                      className="w-full p-2 border rounded mb-4 text-sm"
                      readOnly
                    />
                    <button className="w-full py-2 bg-primary text-white rounded font-medium">
                      Create Account
                    </button>
                  </RegisterFlow>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold border-b pb-2">Password Recovery</h3>
                  <ForgotPasswordFlow className="border rounded bg-card p-6 shadow-sm mb-4">
                    <h4 className="text-lg font-bold mb-2">Forgot Password</h4>
                    <p className="text-xs text-muted-foreground mb-4">
                      Enter your email and we&apos;ll send you a reset link.
                    </p>
                    <input
                      type="email"
                      placeholder="Email address"
                      className="w-full p-2 border rounded mb-4 text-sm"
                      readOnly
                    />
                    <button className="w-full py-2 bg-primary text-white rounded font-medium">
                      Send Link
                    </button>
                  </ForgotPasswordFlow>

                  <ResetPasswordFlow className="border rounded bg-card p-6 shadow-sm">
                    <h4 className="text-lg font-bold mb-2">Set New Password</h4>
                    <input
                      type="password"
                      placeholder="New Password"
                      className="w-full p-2 border rounded mb-2 text-sm"
                      readOnly
                    />
                    <button className="w-full py-2 bg-primary text-white rounded font-medium">
                      Update Password
                    </button>
                  </ResetPasswordFlow>
                </div>
              </div>
            )}

            {gallery === "PROFILE" && (
              <div className="space-y-8">
                <h2 className="text-lg font-bold">Avatar Strategy (100% Circular)</h2>
                <div className="flex gap-8">
                  <div className="flex flex-col items-center gap-2">
                    <UserAvatar className="w-24 h-24 text-2xl" initials="JD" />
                    <span className="text-sm font-medium">Initials Avatar</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <UserAvatar
                      className="w-24 h-24"
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                    />
                    <span className="text-sm font-medium">Google / Uploaded</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <UserAvatar className="w-24 h-24 bg-primary/10 text-primary" />
                    <span className="text-sm font-medium">Default Fallback</span>
                  </div>
                </div>

                <h2 className="text-lg font-bold border-t pt-8">Profile Completion Presentation</h2>
                <UserProfileCard className="max-w-md border rounded-lg bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <UserAvatar className="w-16 h-16 text-lg" initials="AS" />
                    <div>
                      <h4 className="font-bold text-lg">Alex Smith</h4>
                      <p className="text-sm text-muted-foreground">LEARNER</p>
                    </div>
                  </div>
                  <ProfileCompletion className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Profile Completeness</span>
                      <span>80%</span>
                    </div>
                    <div className="w-full bg-muted rounded h-2">
                      <div className="bg-primary h-2 rounded" style={{ width: "80%" }}></div>
                    </div>
                    <ul className="text-xs text-muted-foreground mt-4 space-y-1 list-disc pl-4">
                      <li className="text-green-600">Email Verified</li>
                      <li className="text-green-600">Avatar Uploaded</li>
                      <li>Add Display Name (Pending)</li>
                    </ul>
                  </ProfileCompletion>
                </UserProfileCard>
              </div>
            )}

            {gallery === "SESSION" && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold">Session Orchestration</h2>
                <div className="grid grid-cols-2 gap-6">
                  <CurrentSession className="border border-primary rounded-lg bg-primary/5 p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold">Current Session</h4>
                        <p className="text-sm text-muted-foreground">MacBook Pro • Chrome</p>
                      </div>
                      <SessionStatus className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-bold uppercase">
                        Active
                      </SessionStatus>
                    </div>
                    <p className="text-xs text-muted-foreground">Started: 2 hours ago</p>
                    <p className="text-xs text-muted-foreground">IP: 192.168.1.1</p>
                  </CurrentSession>

                  <SessionDeviceCard className="border rounded-lg bg-card p-6 shadow-sm opacity-60">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold">iPhone 13</h4>
                        <p className="text-sm text-muted-foreground">Safari Mobile</p>
                      </div>
                      <button className="text-xs text-red-600 font-bold hover:underline">
                        Revoke
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">Last active: 3 days ago</p>
                    <p className="text-xs text-muted-foreground">IP: 10.0.0.45</p>
                  </SessionDeviceCard>
                </div>
              </div>
            )}

            {gallery === "VERIFICATION" && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold">Email Verification Statuses</h2>
                <div className="grid grid-cols-2 gap-6">
                  <EmailVerificationCard className="border rounded bg-card p-6 shadow-sm flex flex-col items-center text-center gap-2">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xl mb-2">
                      !
                    </div>
                    <h4 className="font-bold">Verify your email</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Please check alex@example.com for a verification link.
                    </p>
                    <button className="py-2 px-4 border rounded text-sm font-medium hover:bg-muted">
                      Resend Link
                    </button>
                  </EmailVerificationCard>

                  <EmailVerificationCard className="border border-green-200 rounded bg-green-50 p-6 shadow-sm flex flex-col items-center text-center gap-2">
                    <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-xl mb-2">
                      ✓
                    </div>
                    <h4 className="font-bold text-green-900">Email Verified</h4>
                    <p className="text-sm text-green-700 mb-4">
                      Your account is fully secured and ready.
                    </p>
                    <button className="py-2 px-4 bg-green-600 text-white rounded text-sm font-medium">
                      Continue to Dashboard
                    </button>
                  </EmailVerificationCard>
                </div>
              </div>
            )}

            {gallery === "STRESS" && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold">
                  Stress Test: Massive Scale Identity Composition
                </h2>

                <div className="grid grid-cols-10 gap-2">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div
                      key={i}
                      className="border bg-card p-2 rounded text-center text-xs shadow-sm truncate"
                    >
                      Auth Card {i}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-10 gap-2">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-1 border p-2 rounded bg-muted/10 shadow-sm"
                    >
                      <UserAvatar className="w-6 h-6 text-[10px]" initials={`${i}`} />
                      <span className="text-[9px]">Profile {i}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-10 gap-2">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div
                      key={i}
                      className="border border-blue-200 bg-blue-50 p-2 rounded text-center text-[10px] text-blue-800 shadow-sm truncate"
                    >
                      Session {i}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </IdentityWorkspace>
        </div>
      </div>
    </IdentityContextProvider>
  );
}
