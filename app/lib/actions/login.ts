"use server";
import { loginSchema } from "@/app/schemas/login";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

type State = {
  message?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export default async function login(_: State, formData: FormData) {
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
              email: validatedFields.data.email,
            },
          };
        default:
          return {
            message: "An error occurred.",
            fields: {
              email: validatedFields.data.email,
            },
          };
      }
    }
    throw error;
  }
}
