import { IdentityGateway } from "../gateway/IdentityGateway";
import { AuthConfig } from "../config/AuthConfig";
import { EnvironmentService } from "@/platform/env/EnvironmentService";

export class GoogleAuthService {
  static async signIn() {
    return IdentityGateway.getAuth().signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${EnvironmentService.getOrigin()}${AuthConfig.routes.callback}`,
      },
    });
  }
}
