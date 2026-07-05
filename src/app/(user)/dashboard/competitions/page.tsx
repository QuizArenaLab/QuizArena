import { fetchDiscoverableCompetitionsAction } from "@/competitions/actions/discovery.actions";
import { CompetitionDiscoveryKernel } from "@/features/competitions/discovery/components/CompetitionDiscoveryKernel";

export default async function CompetitionDiscoveryPage() {
  const response = await fetchDiscoverableCompetitionsAction();
  
  return (
    <CompetitionDiscoveryKernel initialCompetitions={response.success ? response.data.items : []} />
  );
}
