import nodemailer from "nodemailer";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

// Initialize SES Client with environment credentials
const sesClient = new SESv2Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// Configure Nodemailer to use SES Transport
const transporter = nodemailer.createTransport({
  SES: { sesClient, SendEmailCommand },
} as any);

// Shared Email Template Wrapper
const getHtmlTemplate = (
  title: string,
  bodyText: string,
  ctaLink: string,
  ctaText: string,
  footerText: string
) => `
  <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 20px; background-color: #F8FAFC;">
    <div style="max-width: 520px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
      <div style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #F1F5F9;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px;">
          <span style="color: #0a1c40;">Quiz</span><span style="color: #e6701e;">Arena</span>
        </h1>
      </div>
      <div style="padding: 32px;">
        <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #0F172A;">${title}</h2>
        <p style="margin: 0 0 24px; font-size: 15px; color: #475569; line-height: 1.6;">${bodyText}</p>
        <div style="text-align: center; margin: 36px 0;">
          <a href="${ctaLink}" style="display: inline-block; background-color: #0B1B3D; color: #FFFFFF; font-weight: 600; font-size: 15px; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 2px 4px rgba(11, 27, 61, 0.2);">${ctaText}</a>
        </div>
        <p style="margin: 0; font-size: 14px; color: #64748B; line-height: 1.5;">${footerText}</p>
      </div>
      <div style="padding: 24px 32px; background-color: #F8FAFC; text-align: center; border-top: 1px solid #F1F5F9;">
        <p style="margin: 0; font-size: 13px; color: #94A3B8;">&copy; ${new Date().getFullYear()} QuizArena. All rights reserved.</p>
      </div>
    </div>
  </div>
`;

export const sendPasswordResetEmail = async (email: string, resetLink: string) => {
  const fromEmail = process.env.EMAIL_FROM || "support@quizarena.pro";
  const fromName = "QuizArena Security";

  const mailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to: email,
    subject: "Password Reset Request - QuizArena",
    html: getHtmlTemplate(
      "Reset your password",
      "We received a request to securely reset your password. Click the button below to choose a new password. This link is valid for <strong>5 minutes</strong>.",
      resetLink,
      "Reset Password",
      "If you didn't request a password reset, you can safely ignore this email. Your account remains fully secure."
    ),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(
      `[SES_MAILER_SUCCESS] Password reset email sent to ${email}. MessageId: ${info.messageId}`
    );
    return { success: true };
  } catch (error) {
    console.error("[SES_MAILER_ERROR] Failed to send password reset email:", error);
    return { success: false, error };
  }
};

export const sendVerificationEmail = async (email: string, verifyLink: string) => {
  const fromEmail = process.env.EMAIL_FROM || "support@quizarena.pro";
  const fromName = "QuizArena Security";

  const mailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to: email,
    subject: "Verify your email address - QuizArena",
    html: getHtmlTemplate(
      "Verify your email address",
      "Welcome to QuizArena! Please confirm your email address to unlock full access to your account. This link is valid for <strong>24 hours</strong>.",
      verifyLink,
      "Verify Email",
      "If you didn't create an account with QuizArena, you can safely ignore this email."
    ),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(
      `[SES_MAILER_SUCCESS] Verification email sent to ${email}. MessageId: ${info.messageId}`
    );
    return { success: true };
  } catch (error) {
    console.error("[SES_MAILER_ERROR] Failed to send verification email:", error);
    return { success: false, error };
  }
};
