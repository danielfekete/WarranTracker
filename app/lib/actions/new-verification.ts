"use server";

import { getUserByEmail } from "@/app/data/user";
import { getVerificationTokenByToken } from "@/app/data/verification-token";
import { db } from "../db";

export interface NewVerificationState {
  error?: string;
  success?: string;
}

export const newVerification = async (
  { token }: { token: string },
  _: NewVerificationState
) => {
  // Get verification token data from db
  const verificationToken = await getVerificationTokenByToken(token);

  if (!verificationToken) {
    return {
      error: "Token does not exists.",
    };
  }

  const hasExpired = new Date(verificationToken.expires) < new Date();

  if (hasExpired) {
    return {
      error: "Token has expired.",
    };
  }

  // Get user from db
  const user = await getUserByEmail(verificationToken.email);

  if (!user) {
    return {
      error: "Email does not exists.",
    };
  }

  // Update user verified and email field
  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerified: new Date(),
      email: verificationToken.email,
    },
  });

  // Delete the verification token
  await db.verificationToken.delete({
    where: {
      id: verificationToken.id,
    },
  });

  return {
    success: "Email verified.",
  };
};
