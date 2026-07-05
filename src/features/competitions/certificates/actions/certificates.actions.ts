"use server";

import { requireUser } from "@/features/rbac/constants/authorization";
import { CertificateFacade } from "../facade/CertificateFacade";

export async function getUserCertificatesAction() {
  try {
    const user = await requireUser();
    const certificates = await CertificateFacade.getUserCertificates(user.id);
    return { success: true, data: certificates };
  } catch (error: any) {
    console.error("[CertificatesAction] Failed to load certificates:", error);
    return { success: false, error: "Failed to load certificates" };
  }
}

export async function verifyCertificateAction(token: string) {
  try {
    const certificate = await CertificateFacade.verifyCertificate(token);
    if (!certificate) {
      return { success: false, error: "Certificate not found or invalid." };
    }
    return { success: true, data: certificate };
  } catch (error: any) {
    console.error("[CertificatesAction] Failed to verify certificate:", error);
    return { success: false, error: "Failed to verify certificate" };
  }
}
