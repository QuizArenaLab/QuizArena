import React from "react";
import { WidgetHeader, WidgetBody, WidgetFooter } from "../index";
import { StatisticCard } from "../../kpi";
import { MetricFormat } from "@/kpi/MetricFormat";
import { useWidget } from "../../../widget";

export interface StatisticWidgetProps {
  data?: any;
  options?: any;
}

export const StatisticWidget: React.FC<StatisticWidgetProps> = ({ data, options }) => {
  const { manifest } = useWidget();
  return (
    <>
      <WidgetHeader />
      <WidgetBody>
        <StatisticCard
          statistic={{
            label: options?.title || manifest.metadata.name,
            metric: { value: data?.value || "N/A", format: MetricFormat.NUMBER },
            description: options?.description || manifest.metadata.description,
          }}
        />
      </WidgetBody>
    </>
  );
};
