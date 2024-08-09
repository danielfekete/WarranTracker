"use server";

import { getUserByEmail } from "@/app/data/user";
import { resetPasswordSchema } from "@/app/schemas/reset-password";
import { generateResetPasswordToken } from "../tokens";
import { sendResetPasswordEmail } from "../mail";

export interface ResetPasswordState {
  message?: string;
  issues?: string[];
  field?: string;
}

export const resetPassword = async (
  _: ResetPasswordState,
  formData: FormData
) => {
  const data = Object.fromEntries(formData);
  const validatedFields = resetPasswordSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      message: "Invalid form data.",
      issues: validatedFields.error.issues.map(({ message }) => message),
      field: data?.email.toString() || "",
    };
  }

  const email = validatedFields.data.email;

  const user = await getUserByEmail(email);

  if (!user) {
    return {
      message: "Email does not exists.",
      field: email,
    };
  }

  // Generate reset password token and send the email
  const resetPasswordToken = await generateResetPasswordToken(email);
  await sendResetPasswordEmail(
    resetPasswordToken.email,
    resetPasswordToken.token
  );

  return {
    message: "Reset email sent.",
  };
};
