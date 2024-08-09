import { v4 as uuid } from "uuid";
import { getVerificationTokenByEmail } from "../data/verification-token";
import { db } from "./db";
import { getResetPasswordTokenByEmail } from "../data/reset-password-token";

export const generateVerificationToken = async (email: string) => {
  const token = uuid();
  // 1 hour
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  // Delete the existing token
  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  // Create the new verification token
  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      expires,
      token,
    },
  });

  return verificationToken;
};

export const generateResetPasswordToken = async (email: string) => {
  const token = uuid();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getResetPasswordTokenByEmail(email);

  // Delete the existing token
  if (existingToken) {
    await db.resetPasswordToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  // Create a new reset password token

  const resetPasswordToken = await db.resetPasswordToken.create({
    data: {
      email,
      expires,
      token,
    },
  });

  return resetPasswordToken;
};
