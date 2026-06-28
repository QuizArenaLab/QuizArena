"use client";

import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from "react-resizable-panels";
import { useBuilderStore } from "../context/useBuilderStore";
import { BuilderCommandBar } from "./BuilderCommandBar";

interface Props {
  leftPanel: React.ReactNode;
  centerPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  previewPanel: React.ReactNode;
}

export function AssessmentBuilderLayout({
  leftPanel,
  centerPanel,
  rightPanel,
  previewPanel,
}: Props) {
  const { isPreviewMode, isLeftPanelOpen, leftPanelWidth, rightPanelWidth } = useBuilderStore();

  if (isPreviewMode) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <BuilderCommandBar />
        <div className="flex-1 bg-gray-50 overflow-hidden">{previewPanel}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <BuilderCommandBar />

      <div className="flex-1 overflow-hidden bg-white">
        {/* @ts-expect-error - react-resizable-panels typings issue */}
        <PanelGroup direction="horizontal">
          {isLeftPanelOpen && (
            <>
              <Panel
                defaultSize={leftPanelWidth}
                minSize={20}
                maxSize={40}
                className="bg-gray-50 border-r border-gray-200"
              >
                {leftPanel}
              </Panel>
              <PanelResizeHandle className="w-1.5 bg-gray-100 hover:bg-orange-200 cursor-col-resize transition-colors duration-150" />
            </>
          )}

          <Panel
            defaultSize={100 - (isLeftPanelOpen ? leftPanelWidth : 0) - rightPanelWidth}
            minSize={40}
          >
            {centerPanel}
          </Panel>

          <PanelResizeHandle className="w-1.5 bg-gray-100 hover:bg-orange-200 cursor-col-resize transition-colors duration-150" />

          <Panel
            defaultSize={rightPanelWidth}
            minSize={20}
            maxSize={35}
            className="bg-gray-50 border-l border-gray-200"
          >
            {rightPanel}
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
