"use server";

import { getResetPasswordTokenByToken } from "@/app/data/reset-password-token";
import { getUserByEmail } from "@/app/data/user";
import { newPasswordSchema } from "@/app/schemas/new-password";
import bcrypt from "bcrypt";
import { db } from "../db";

export interface NewPasswordState {
  message?: string;
  issues?: string[];
}

export const newPassword = async (
  { token }: { token: string },
  _: NewPasswordState,
  formData: FormData
) => {
  const data = Object.fromEntries(formData);
  const validatedFields = newPasswordSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      message: "Invalid form data.",
      issues: validatedFields.error.issues.map(({ message }) => message),
    };
  }

  const resetPasswordToken = await getResetPasswordTokenByToken(token);

  if (!resetPasswordToken) {
    return {
      message: "Token does not exists.",
    };
  }

  const tokenExpired = new Date(resetPasswordToken.expires) < new Date();

  if (tokenExpired) {
    return {
      message: "Token has expired.",
    };
  }

  const user = await getUserByEmail(resetPasswordToken.email);

  if (!user) {
    return {
      message: "User does not exists.",
    };
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(validatedFields.data.password, 10);

  // Update the user password
  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  // Delete the token
  await db.resetPasswordToken.delete({
    where: {
      id: resetPasswordToken.id,
    },
  });

  return {
    message: "Password successfully updated.",
  };
};
