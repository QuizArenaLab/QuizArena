import { Resend } from 'resend';

export interface NotificationPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface INotificationService {
  send(payload: NotificationPayload): Promise<boolean>;
}

export class NotificationService implements INotificationService {
  private resend: Resend | null = null;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production';
    if (process.env.RESEND_API_KEY) {
      this.resend = new Resend(process.env.RESEND_API_KEY);
    }
  }

  async send(payload: NotificationPayload): Promise<boolean> {
    if (this.resend && !this.isDevelopment) {
      try {
        await this.resend.emails.send({
          from: 'QuizArena <noreply@quizarena.com>',
          to: payload.to,
          subject: payload.subject,
          html: payload.html,
          text: payload.text,
        });
        return true;
      } catch (error) {
        console.error('[NotificationService] Failed to send email via Resend:', error);
        return false;
      }
    } else {
      // Console Logger Fallback
      console.log('===================================================');
      console.log(`[NotificationService] Sending Email to: ${payload.to}`);
      console.log(`[NotificationService] Subject: ${payload.subject}`);
      console.log(`[NotificationService] HTML: ${payload.html}`);
      console.log('===================================================');
      return true;
    }
  }
}

export const notificationService = new NotificationService();
