import { ChartRegistry } from "../../chart";
import { createDefaultChartManifest } from "./manifests";

let registered = false;

/**
 * Initializes and registers all enterprise chart wrappers.
 * This should be called during app initialization (e.g., inside ChartProvider)
 * to avoid module-load side effects.
 */
export function registerAllCharts() {
  if (registered) return;
  registered = true;

  ChartRegistry.register(
    createDefaultChartManifest("line-chart", "Line Chart", "Standard Line Chart")
  );
  ChartRegistry.register(
    createDefaultChartManifest("area-chart", "Area Chart", "Standard Area Chart")
  );
  ChartRegistry.register(
    createDefaultChartManifest("bar-chart", "Bar Chart", "Standard Bar Chart")
  );
  ChartRegistry.register(
    createDefaultChartManifest(
      "stacked-bar-chart",
      "Stacked Bar Chart",
      "Standard Stacked Bar Chart"
    )
  );
  ChartRegistry.register(
    createDefaultChartManifest(
      "horizontal-bar-chart",
      "Horizontal Bar Chart",
      "Standard Horizontal Bar Chart"
    )
  );
  ChartRegistry.register(
    createDefaultChartManifest("pie-chart", "Pie Chart", "Standard Pie Chart")
  );
  ChartRegistry.register(
    createDefaultChartManifest("donut-chart", "Donut Chart", "Standard Donut Chart")
  );
  ChartRegistry.register(
    createDefaultChartManifest("radar-chart", "Radar Chart", "Standard Radar Chart")
  );
  ChartRegistry.register(
    createDefaultChartManifest("radial-chart", "Radial Chart", "Standard Radial Chart")
  );
  ChartRegistry.register(
    createDefaultChartManifest("scatter-chart", "Scatter Chart", "Standard Scatter Chart")
  );
  ChartRegistry.register(
    createDefaultChartManifest("bubble-chart", "Bubble Chart", "Standard Bubble Chart")
  );
}
