"use client";

import React, { useState } from "react";
import { HeaderProvider } from "@/providers/HeaderProvider";
import { Topbar } from "@/components/header/Topbar";
import { WorkspaceHeader } from "@/components/header/WorkspaceHeader";
import { WorkspaceTitle } from "@/components/header/WorkspaceTitle";
import { WorkspaceSubtitle } from "@/components/header/WorkspaceSubtitle";
import { HeaderActions } from "@/components/header/HeaderActions";
import { GlobalActionArea } from "@/components/header/GlobalActionArea";
import { UserProfileMenu } from "@/components/header/UserProfileMenu";
import { WorkspaceSwitcher } from "@/components/header/WorkspaceSwitcher";
import { NotificationBell } from "@/components/header/NotificationBell";
import { Icon } from "@/icons/Icon";

export default function HeaderPlayground() {
  const [isCompact, setIsCompact] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const [simulateMobile, setSimulateMobile] = useState(false);

  return (
    <div
      className={`min-h-screen bg-gray-50 flex flex-col font-sans ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Playground Controls */}
      <div className="bg-white border-b border-gray-200 p-4 shrink-0 shadow-sm z-50 sticky top-0">
        <h1 className="text-xl font-bold mb-4 text-navy">Header Platform Playground</h1>
        <div className="flex gap-4 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isCompact}
              onChange={(e) => setIsCompact(e.target.checked)}
            />
            <span className="text-sm">Compact Mode</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isRTL} onChange={(e) => setIsRTL(e.target.checked)} />
            <span className="text-sm">RTL Mode</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={simulateMobile}
              onChange={(e) => setSimulateMobile(e.target.checked)}
            />
            <span className="text-sm">Simulate Mobile View (320px)</span>
          </label>
        </div>
      </div>

      {/* Main Content Area showing variations */}
      <div className="flex-1 overflow-auto p-4 md:p-8 space-y-12">
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            1. Full Featured Enterprise Header
          </h2>
          <div
            className={`bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm ${simulateMobile ? "max-w-[320px] mx-auto" : "w-full"}`}
          >
            <HeaderProvider defaultTitle="Marketing Campaign 2026" defaultCompact={isCompact}>
              <Topbar>
                <WorkspaceSwitcher
                  workspaceName="Acme Corp"
                  workspaceDescription="Enterprise Plan"
                />
                <WorkspaceHeader
                  leftNode={
                    <>
                      <WorkspaceTitle />
                      <WorkspaceSubtitle subtitle="Dashboard and Analytics for Q3" />
                    </>
                  }
                  rightNode={
                    <>
                      <HeaderActions
                        primaryActionOverride={
                          <button className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                            Publish
                          </button>
                        }
                        secondaryActionOverride={
                          <button className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                            Preview
                          </button>
                        }
                      />
                      <GlobalActionArea>
                        <NotificationBell unreadCount={5} />
                        <UserProfileMenu
                          displayName="Sarah Connor"
                          role="Admin"
                          organization="Acme Corp"
                        />
                      </GlobalActionArea>
                    </>
                  }
                />
              </Topbar>
            </HeaderProvider>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            2. Very Long Title & Actions Overflow
          </h2>
          <div
            className={`bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm ${simulateMobile ? "max-w-[320px] mx-auto" : "max-w-[800px]"}`}
          >
            <HeaderProvider
              defaultTitle="Super Extremely Long Workspace Title That Might Definitely Truncate On Smaller Screens"
              defaultCompact={isCompact}
            >
              <Topbar>
                <WorkspaceHeader
                  leftNode={
                    <>
                      <WorkspaceTitle />
                      <WorkspaceSubtitle subtitle="No workspace switcher here" />
                    </>
                  }
                  rightNode={
                    <HeaderActions
                      overflowActionsOverride={[
                        <button
                          key="btn1"
                          className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600"
                        >
                          <Icon name="Share" size={18} />
                        </button>,
                        <button
                          key="btn2"
                          className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600"
                        >
                          <Icon name="Settings" size={18} />
                        </button>,
                        <button
                          key="btn3"
                          className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600"
                        >
                          <Icon name="MoreVertical" size={18} />
                        </button>,
                      ]}
                    />
                  }
                />
              </Topbar>
            </HeaderProvider>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            3. Minimal Header (No Subtitle, Actions Only)
          </h2>
          <div
            className={`bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm ${simulateMobile ? "max-w-[320px] mx-auto" : "w-full"}`}
          >
            <HeaderProvider defaultTitle="Settings" defaultCompact={isCompact}>
              <Topbar>
                <WorkspaceHeader
                  leftNode={<WorkspaceTitle />}
                  rightNode={
                    <GlobalActionArea>
                      <NotificationBell isEmpty={true} />
                      <UserProfileMenu displayName="John Doe" />
                    </GlobalActionArea>
                  }
                />
              </Topbar>
            </HeaderProvider>
          </div>
        </section>
      </div>
    </div>
  );
}
