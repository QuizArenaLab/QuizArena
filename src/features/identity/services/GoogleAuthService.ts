import { IdentityGateway } from "../gateway/IdentityGateway";
import { AuthConfig } from "../config/AuthConfig";
export class GoogleAuthService {
  static async signIn() {
    return IdentityGateway.getAuth().signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}${AuthConfig.routes.callback}`
            : undefined,
      },
    });
  }
}
