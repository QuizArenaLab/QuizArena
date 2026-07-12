import React from "react";
import { WidgetHeader, WidgetBody, WidgetFooter } from "../index";
import {
  KPICard,
  KPICardHeader,
  KPICardBody,
  KPICardFooter,
  MetricLabel,
  MetricValue,
  TrendIndicator,
  ComparisonBadge,
} from "../../kpi";
import { KPITrend } from "@/kpi/KPITrend";
import { ComparisonType } from "@/kpi/KPITypes";
import { MetricFormat } from "@/kpi/MetricFormat";
import { useWidget } from "../../../widget";

export interface KPIWidgetProps {
  data?: any;
  options?: any;
}

export const KPIWidget: React.FC<KPIWidgetProps> = ({ data, options }) => {
  const { manifest } = useWidget();
  return (
    <>
      <WidgetHeader />
      <WidgetBody>
        <KPICard>
          <KPICardHeader>
            <MetricLabel>{manifest.metadata.name}</MetricLabel>
          </KPICardHeader>
          <KPICardBody>
            <MetricValue metric={{ value: data?.value || "N/A", format: MetricFormat.NUMBER }} />
            {data?.trend && (
              <TrendIndicator trend={data.trendType === "up" ? KPITrend.UP : KPITrend.DOWN} />
            )}
          </KPICardBody>
          <KPICardFooter>
            {data?.comparison && (
              <ComparisonBadge type={"positive" as ComparisonType}>
                {data.comparison}
              </ComparisonBadge>
            )}
          </KPICardFooter>
        </KPICard>
      </WidgetBody>
      {manifest.capabilities.supportsFooter && <WidgetFooter>{options?.footerText}</WidgetFooter>}
    </>
  );
};
