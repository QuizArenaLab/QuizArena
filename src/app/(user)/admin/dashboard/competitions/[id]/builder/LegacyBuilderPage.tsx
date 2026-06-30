import { fetchBuilderHydrationData } from "@/features/admin/competition/builder/actions/composition.actions";
import { notFound } from "next/navigation";
import { BuilderClientInitializer } from "./BuilderClientInitializer";

export default async function AssessmentBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const res = await fetchBuilderHydrationData(id);

  if (!res.success || !res.data) {
    return notFound();
  }

  return <BuilderClientInitializer hydrationData={res.data} />;
}
