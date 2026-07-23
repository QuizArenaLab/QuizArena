import { IdentityGateway } from "../gateway/IdentityGateway";
import { AuthConfig } from "../config/AuthConfig";
export class GoogleAuthService {
  static async signIn() {
    return IdentityGateway.getAuth().signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          typeof window !== "undefined"
            ? `${process.env.NEXT_PUBLIC_APP_URL}${AuthConfig.routes.callback}`
            : undefined,
      },
    });
  }
}
