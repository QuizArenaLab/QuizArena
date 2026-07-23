import { IdentityGateway } from "../gateway/IdentityGateway";
import { AuthConfig } from "../config/AuthConfig";
import { EnvironmentService } from "@/platform/env/EnvironmentService";

export class PasswordRecoveryService {
  static async requestReset(email: string) {
    return IdentityGateway.getAuth().resetPasswordForEmail(email, {
      redirectTo: `${EnvironmentService.getOrigin()}${AuthConfig.routes.resetPassword}`,
    });
  }
  static async updatePassword(password: string) {
    return IdentityGateway.getAuth().updateUser({ password });
  }
}
