import { IdentityGateway } from "../gateway/IdentityGateway";
import { AuthConfig } from "../config/AuthConfig";
export class PasswordRecoveryService {
  static async requestReset(email: string) {
    return IdentityGateway.getAuth().resetPasswordForEmail(email, {
      redirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}${AuthConfig.routes.resetPassword}`
          : undefined,
    });
  }
  static async updatePassword(password: string) {
    return IdentityGateway.getAuth().updateUser({ password });
  }
}
