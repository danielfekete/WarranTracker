"use server";
import { registerSchema } from "@/app/schemas/register";
import bcrypt from "bcrypt";
import { db } from "../db";
import { getUserByEmail } from "@/app/data/user";
import { generateVerificationToken } from "../tokens";
import { sendVerificationEmail } from "../mail";

export interface RegisterState {
  message?: string;
  fields?: Record<string, string>;
  issues?: string[];
}

export default async function register(_: RegisterState, formData: FormData) {
  // Validate the form data
  const data = Object.fromEntries(formData);
  const validatedFields = registerSchema.safeParse(data);

  // Send back the original form fields
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

  const { password, email } = validatedFields.data;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await getUserByEmail(email);

  if (user) {
    return {
      message: "Email already in use.",
      fields: {
        email: validatedFields.data.email,
      },
    };
  }

  try {
    // Insert the new user into the database
    await db.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  } catch (e) {
    return {
      message: "An error occurred.",
      fields: {
        email: validatedFields.data.email,
      },
    };
  }

  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return {
    message: "Confirmation email sent.",
  };
}
