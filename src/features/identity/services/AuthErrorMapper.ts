export class AuthErrorMapper {
  static map(error: any): string {
    const msg = error?.message?.toLowerCase() || "";
    if (msg.includes("invalid login credentials")) return "Invalid email or password.";
    if (msg.includes("email not confirmed")) return "Please verify your email before signing in.";
    if (msg.includes("user already registered"))
      return "An account already exists with this email.";
    if (msg.includes("password should be at least")) return "Password is too weak.";
    return error?.message || "An unexpected error occurred.";
  }
}
