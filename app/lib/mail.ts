import { Resend } from "resend";
import VerificationEmailTemplate from "../components/mail/verification-email-template";
import ResetPasswordEmailTemplate from "../components/mail/reset-password-email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Confirm your email",
    react: VerificationEmailTemplate({ token }),
  });
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Reset your password",
    react: ResetPasswordEmailTemplate({ token }),
  });
};
