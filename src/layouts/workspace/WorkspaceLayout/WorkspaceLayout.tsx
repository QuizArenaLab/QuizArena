"use client";

import React, { Children, isValidElement } from "react";
import { WorkspaceLayoutProps } from "./WorkspaceLayout.types";
import { ComponentRegistry } from "@/registry";
import { NavigationSlot } from "../NavigationSlot";
import { HeaderSlot } from "../HeaderSlot";
import { ToolbarSlot } from "../ToolbarSlot";
import { ContentSlot } from "../ContentSlot";
import { AsideSlot } from "../AsideSlot";
import { FooterSlot } from "../FooterSlot";

import { WorkspaceBody } from "../WorkspaceBody";
import { WorkspaceContent } from "../WorkspaceContent";
import { WorkspaceMain } from "../WorkspaceMain";
import { WorkspaceContainer } from "../WorkspaceContainer";

export function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  let navigation: React.ReactNode = null;
  let header: React.ReactNode = null;
  let toolbar: React.ReactNode = null;
  let content: React.ReactNode = null;
  let aside: React.ReactNode = null;
  let footer: React.ReactNode = null;

  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      // We check by displayName or type name to survive minification/bundling issues occasionally
      const childType = child.type as { displayName?: string; name?: string };
      const typeName = childType?.displayName || childType?.name;

      if (typeName === "NavigationSlot" || child.type === NavigationSlot) navigation = child;
      if (typeName === "HeaderSlot" || child.type === HeaderSlot) header = child;
      if (typeName === "ToolbarSlot" || child.type === ToolbarSlot) toolbar = child;
      if (typeName === "ContentSlot" || child.type === ContentSlot) content = child;
      if (typeName === "AsideSlot" || child.type === AsideSlot) aside = child;
      if (typeName === "FooterSlot" || child.type === FooterSlot) footer = child;
    }
  });

  return (
    <div className="flex h-full w-full min-h-[100dvh]">
      {navigation}
      <div className="flex flex-col flex-1 w-full min-w-0">
        {header}
        {toolbar}
        <WorkspaceBody>
          <WorkspaceContent>
            <WorkspaceContainer>
              <WorkspaceMain>{content}</WorkspaceMain>
            </WorkspaceContainer>
            {footer}
          </WorkspaceContent>
          {aside}
        </WorkspaceBody>
      </div>
    </div>
  );
}

ComponentRegistry.register({
  id: "layout-workspace-layout",
  name: "WorkspaceLayout",
  category: "layout",
  version: "1.0.0",
  status: "stable",
  owner: "FS-02.1",
});
