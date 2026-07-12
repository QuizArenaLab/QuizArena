import { GoogleAuthService } from "./GoogleAuthService";
import { EmailAuthService } from "./EmailAuthService";
import { SessionService } from "./SessionService";
import { PasswordRecoveryService } from "./PasswordRecoveryService";

export class AuthenticationService {
  static google = GoogleAuthService;
  static email = EmailAuthService;
  static session = SessionService;
  static password = PasswordRecoveryService;
}
