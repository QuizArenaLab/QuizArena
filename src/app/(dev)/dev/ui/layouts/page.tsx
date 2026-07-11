"use client";

import React from "react";
import {
  AppShell,
  WorkspaceLayout,
  NavigationSlot,
  HeaderSlot,
  ToolbarSlot,
  ContentSlot,
  AsideSlot,
  FooterSlot,
} from "@/layouts/workspace";
import { WorkspaceContainer } from "@/layouts/workspace";

export default function LayoutsPlaygroundPage() {
  return (
    <div className="flex flex-col gap-8 p-4">
      <h1 className="text-3xl font-bold">Workspace Layout Showcase</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">Default Layout</h2>
        <div className="h-[400px] border border-slate-300 rounded overflow-hidden">
          <AppShell>
            <WorkspaceLayout>
              <NavigationSlot>
                <div className="w-64 h-full bg-slate-800 text-white p-4">Navigation</div>
              </NavigationSlot>
              <HeaderSlot>
                <div className="h-16 bg-white border-b flex items-center p-4">Header</div>
              </HeaderSlot>
              <ContentSlot>
                <div className="p-4 bg-slate-100 h-full">Content Area</div>
              </ContentSlot>
              <AsideSlot>
                <div className="w-64 h-full bg-slate-50 border-l p-4">Aside</div>
              </AsideSlot>
            </WorkspaceLayout>
          </AppShell>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Wide Layout</h2>
        <div className="h-[400px] border border-slate-300 rounded overflow-hidden">
          <AppShell>
            <WorkspaceLayout>
              <NavigationSlot>
                <div className="w-20 h-full bg-slate-800 text-white p-4">Nav</div>
              </NavigationSlot>
              <HeaderSlot>
                <div className="h-16 bg-white border-b flex items-center p-4">Header</div>
              </HeaderSlot>
              <ContentSlot>
                <WorkspaceContainer className="max-w-[2560px]">
                  <div className="p-4 bg-slate-100 h-full">Wide Content Area</div>
                </WorkspaceContainer>
              </ContentSlot>
            </WorkspaceLayout>
          </AppShell>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Narrow Layout</h2>
        <div className="h-[400px] border border-slate-300 rounded overflow-hidden flex justify-center bg-slate-200 p-8">
          <div className="w-full max-w-4xl border border-slate-300 bg-white rounded overflow-hidden shadow-lg">
            <AppShell>
              <WorkspaceLayout>
                <HeaderSlot>
                  <div className="h-16 bg-white border-b flex items-center p-4">Narrow Header</div>
                </HeaderSlot>
                <ContentSlot>
                  <div className="p-4 bg-slate-100 h-full">Centered Narrow Content</div>
                </ContentSlot>
              </WorkspaceLayout>
            </AppShell>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Mobile Preview</h2>
        <div className="flex justify-center">
          <div className="h-[667px] w-[375px] border-[8px] border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
            <AppShell>
              <WorkspaceLayout>
                <HeaderSlot>
                  <div className="h-14 bg-white border-b flex items-center p-4 justify-between">
                    <span>Menu</span>
                    <span>Title</span>
                    <span>Profile</span>
                  </div>
                </HeaderSlot>
                <ContentSlot>
                  <div className="p-4 bg-slate-100 h-full flex flex-col gap-4 overflow-y-auto">
                    <div className="h-32 bg-white rounded shadow-sm p-4">Card 1</div>
                    <div className="h-32 bg-white rounded shadow-sm p-4">Card 2</div>
                    <div className="h-32 bg-white rounded shadow-sm p-4">Card 3</div>
                    <div className="h-32 bg-white rounded shadow-sm p-4">Card 4</div>
                  </div>
                </ContentSlot>
                <FooterSlot>
                  <div className="h-16 bg-white border-t flex items-center justify-around p-2">
                    <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                    <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                    <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                  </div>
                </FooterSlot>
              </WorkspaceLayout>
            </AppShell>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Desktop Preview</h2>
        <div className="h-[600px] border-[12px] border-slate-800 rounded-xl overflow-hidden shadow-2xl relative bg-slate-900">
          <div className="absolute inset-0 top-6 bg-white overflow-hidden rounded-b">
            <AppShell>
              <WorkspaceLayout>
                <NavigationSlot>
                  <div className="w-64 h-full bg-slate-800 text-white p-4 flex flex-col gap-2">
                    <div className="h-10 bg-slate-700 rounded"></div>
                    <div className="h-10 bg-slate-700 rounded mt-4"></div>
                    <div className="h-10 bg-slate-700 rounded"></div>
                  </div>
                </NavigationSlot>
                <HeaderSlot>
                  <div className="h-16 bg-white border-b flex items-center p-4 px-8 justify-between">
                    <div className="w-64 h-8 bg-slate-100 rounded"></div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                      <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                    </div>
                  </div>
                </HeaderSlot>
                <ToolbarSlot>
                  <div className="h-12 bg-slate-50 border-b flex items-center p-2 px-8">
                    <div className="flex gap-2">
                      <div className="w-20 h-8 bg-white border rounded"></div>
                      <div className="w-20 h-8 bg-white border rounded"></div>
                    </div>
                  </div>
                </ToolbarSlot>
                <ContentSlot>
                  <div className="p-8 bg-slate-100 h-full overflow-y-auto">
                    <div className="h-64 bg-white rounded shadow-sm p-4 mb-4"></div>
                    <div className="h-64 bg-white rounded shadow-sm p-4"></div>
                  </div>
                </ContentSlot>
              </WorkspaceLayout>
            </AppShell>
          </div>
        </div>
      </section>
    </div>
  );
}
