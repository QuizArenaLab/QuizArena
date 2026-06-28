import { CertificateSnapshot, BadgeSnapshot, RewardLedger } from "@/generated/prisma";
import { BadgeMetadata } from "../badges/registry/BadgeRegistry";

export interface CertificateReadModel {
  id: string;
  type: string;
  competitionName: string;
  issueDate: string;
  pdfUrl: string | null;
  verificationUrl: string;
}

export interface BadgeReadModel {
  id: string;
  type: string;
  competitionId: string | null;
  issuedAt: string;
  metadata: BadgeMetadata;
}

export interface RewardHistoryReadModel {
  id: string;
  event: string;
  type: string;
  status: string;
  date: string;
  reason: string | null;
}

export interface UserRewardsReadModel {
  certificates: CertificateReadModel[];
  badges: BadgeReadModel[];
  history: RewardHistoryReadModel[];
}
