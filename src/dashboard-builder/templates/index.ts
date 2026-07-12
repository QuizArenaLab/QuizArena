import { DashboardTemplateRegistry } from "../registry/DashboardTemplateRegistry";
import { SingleColumnLayoutTemplate } from "./SingleColumnLayout";
import { TwoColumnLayoutTemplate } from "./TwoColumnLayout";
import { ThreeColumnLayoutTemplate } from "./ThreeColumnLayout";
import { AnalyticsLayoutTemplate } from "./AnalyticsLayout";
import { ExecutiveLayoutTemplate } from "./ExecutiveLayout";
import { DenseLayoutTemplate } from "./DenseLayout";
import { BlankLayoutTemplate } from "./BlankLayout";

// Auto-register templates
DashboardTemplateRegistry.register(SingleColumnLayoutTemplate);
DashboardTemplateRegistry.register(TwoColumnLayoutTemplate);
DashboardTemplateRegistry.register(ThreeColumnLayoutTemplate);
DashboardTemplateRegistry.register(AnalyticsLayoutTemplate);
DashboardTemplateRegistry.register(ExecutiveLayoutTemplate);
DashboardTemplateRegistry.register(DenseLayoutTemplate);
DashboardTemplateRegistry.register(BlankLayoutTemplate);

export * from "./SingleColumnLayout";
export * from "./TwoColumnLayout";
export * from "./ThreeColumnLayout";
export * from "./AnalyticsLayout";
export * from "./ExecutiveLayout";
export * from "./DenseLayout";
export * from "./BlankLayout";
