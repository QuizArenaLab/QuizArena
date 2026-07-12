import { IdentityGateway } from "../gateway/IdentityGateway";
export class EmailAuthService {
  static async signIn(email: string, password: string) {
    return IdentityGateway.getAuth().signInWithPassword({ email, password });
  }
  static async signUp(email: string, password: string, fullName: string) {
    return IdentityGateway.getAuth().signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
  }
}
