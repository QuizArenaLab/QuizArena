import { createClient } from "@/lib/supabase/client";
export class IdentityGateway {
  private static client = createClient();
  static getAuth() {
    return this.client.auth;
  }
}
