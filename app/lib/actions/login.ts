"use server";
import { getUserByEmail } from "@/app/data/user";
import { loginSchema } from "@/app/schemas/login";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "../tokens";
import { sendVerificationEmail } from "../mail";

export interface LoginState {
  message?: string;
  fields?: Record<string, string>;
  issues?: string[];
}

export default async function login(_: LoginState, formData: FormData) {
  // Validate the form data
  const data = Object.fromEntries(formData);
  const validatedFields = loginSchema.safeParse(data);

  // Send back the original fields
  if (!validatedFields.success) {
    // const fields: Record<string, string> = {};
    // for (const key in Object.keys(data)) {
    //   fields[key] = data[key].toString();
    // }
    return {
      message: "Invalid form data.",
      fields: {
        email: data?.email.toString() ?? "",
      },
      issues: validatedFields.error.issues.map((issue) => issue.message),
    };
  }

  const { email } = validatedFields.data;

  const user = await getUserByEmail(email);

  // Invalid credentials or oauth
  if (!user || !user.email || !user.password) {
    return {
      message: "Invalid credentials.",
    };
  }

  if (!user.emailVerified) {
    // The user does not verified his email yet
    // Generate a new verification token
    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return {
      message: "Confirmation email sent.",
    };
  }

  try {
    // next auth signIn
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Invalid credentials.",
            fields: {
              email,
            },
          };
        default:
          return {
            message: "An error occurred.",
            fields: {
              email,
            },
          };
      }
    }
    throw error;
  }
}
