import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ChallengeBuilderOrchestrator from "@/components/admin/challenge-builder/ChallengeBuilderOrchestrator";

export default async function ChallengeBuilderPage({
  params,
}: {
  params: { challengeId: string };
}) {
  const challenge = await prisma.challenge.findUnique({
    where: { id: params.challengeId },
    include: {
      questions: {
        orderBy: { orderIndex: "asc" },
        include: {
          question: true,
        },
      },
    },
  });

  if (!challenge) {
    notFound();
  }

  return <ChallengeBuilderOrchestrator challenge={challenge} />;
}
