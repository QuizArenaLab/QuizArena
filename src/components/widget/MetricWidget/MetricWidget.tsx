import React from "react";
import { WidgetHeader, WidgetBody } from "../index";
import { MetricCard } from "../../kpi";
import { MetricFormat } from "@/kpi/MetricFormat";
import { useWidget } from "../../../widget";

export interface MetricWidgetProps {
  data?: any;
  options?: any;
}

export const MetricWidget: React.FC<MetricWidgetProps> = ({ data, options }) => {
  const { manifest } = useWidget();
  return (
    <>
      <WidgetHeader />
      <WidgetBody>
        <MetricCard
          label={options?.label || manifest.metadata.name}
          metric={{ value: data?.value || "N/A", format: MetricFormat.NUMBER }}
        />
      </WidgetBody>
    </>
  );
};
