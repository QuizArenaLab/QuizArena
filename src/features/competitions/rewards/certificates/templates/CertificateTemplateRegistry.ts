export interface CertificateTemplate {
  id: string;
  version: string;
  orientation: "LANDSCAPE" | "PORTRAIT";
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  borderColor: string;
  hasSeal: boolean;
  signatureAsset: string;
}

export class CertificateTemplateRegistry {
  private static templates: Record<string, CertificateTemplate> = {
    "PARTICIPATION_1.0": {
      id: "PARTICIPATION",
      version: "1.0",
      orientation: "LANDSCAPE",
      primaryColor: "#0F172A", 
      secondaryColor: "#475569", 
      accentColor: "#3B82F6", // Blue accent
      borderColor: "#E5E7EB",
      hasSeal: false,
      signatureAsset: "/images/signatures/admin_default.png"
    },
    "EXCELLENCE_1.0": {
      id: "EXCELLENCE",
      version: "1.0",
      orientation: "LANDSCAPE",
      primaryColor: "#0F172A",
      secondaryColor: "#475569",
      accentColor: "#C98A00", // Gold accent
      borderColor: "#E5E7EB",
      hasSeal: false,
      signatureAsset: "/images/signatures/admin_default.png"
    },
    "WINNER_1.0": {
      id: "WINNER",
      version: "1.0",
      orientation: "LANDSCAPE",
      primaryColor: "#0F172A",
      secondaryColor: "#475569",
      accentColor: "#C98A00", // Gold accent
      borderColor: "#E5E7EB",
      hasSeal: true,
      signatureAsset: "/images/signatures/admin_default.png"
    },
    "TOP_PERFORMER_1.0": {
      id: "TOP_PERFORMER",
      version: "1.0",
      orientation: "LANDSCAPE",
      primaryColor: "#0F172A",
      secondaryColor: "#475569",
      accentColor: "#0F172A", // Dark Navy
      borderColor: "#C98A00", // Gold Border
      hasSeal: true,
      signatureAsset: "/images/signatures/admin_default.png"
    }
  };

  public static getTemplate(type: string, version: string): CertificateTemplate {
    const key = `${type}_${version}`;
    const template = this.templates[key];
    if (!template) {
      return this.templates["PARTICIPATION_1.0"];
    }
    return template;
  }
}
