import { IdentityGateway } from "../gateway/IdentityGateway";
export class SessionService {
  static async getSession() {
    return IdentityGateway.getAuth().getSession();
  }
  static async signOut() {
    return IdentityGateway.getAuth().signOut();
  }
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return IdentityGateway.getAuth().onAuthStateChange(callback);
  }
}
