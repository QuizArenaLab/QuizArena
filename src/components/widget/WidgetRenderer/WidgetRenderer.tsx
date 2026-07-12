import React from "react";
import { useWidget, WidgetCategory, WidgetState } from "../../../widget";

// Lazy loading or direct imports for compositions
import { KPIWidget } from "../KPIWidget";
import { ChartWidget } from "../ChartWidget";
import { StatisticWidget } from "../StatisticWidget";
import { MetricWidget } from "../MetricWidget";
import { SummaryWidget } from "../SummaryWidget";
import { TableWidget } from "../TableWidget";
import { ListWidget } from "../ListWidget";
import { ActivityWidget } from "../ActivityWidget";
import { FeedWidget } from "../FeedWidget";
import { PlaceholderWidget } from "../PlaceholderWidget";
import { ComingSoonWidget } from "../ComingSoonWidget";
import { WidgetPlaceholder } from "../WidgetPlaceholderState";

export interface WidgetRendererProps {
  data?: any;
  options?: any;
  children?: React.ReactNode;
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = (props) => {
  const { manifest, state } = useWidget();

  if (state !== WidgetState.READY && state !== WidgetState.LOADING) {
    if (manifest.capabilities.supportsPlaceholder) {
      return <WidgetPlaceholder />;
    }
    return null; // Return null if it doesn't support placeholders
  }

  // Dispatch based on category
  switch (manifest.metadata.category) {
    case WidgetCategory.KPI:
      return <KPIWidget {...props} />;
    case WidgetCategory.CHART:
      return <ChartWidget {...props} />;
    case WidgetCategory.TABLE:
      return <TableWidget {...props} />;
    case WidgetCategory.LIST:
      return <ListWidget {...props} />;
    case WidgetCategory.SUMMARY:
      return <SummaryWidget {...props} />;
    case WidgetCategory.ACTIVITY:
      return <ActivityWidget {...props} />;
    case WidgetCategory.FEED:
      return <FeedWidget {...props} />;
    case WidgetCategory.PLACEHOLDER:
      return <PlaceholderWidget />;
    case WidgetCategory.CUSTOM:
      return <>{props.children}</>;
    default:
      return <ComingSoonWidget />;
  }
};
