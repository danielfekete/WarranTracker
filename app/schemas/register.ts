import { z } from "zod";

export const registerSchema = z
  .object({
    email: z
      .string({
        invalid_type_error: "Email is required.",
        required_error: "Email is required.",
      })
      .email({
        message: "Invalid email address.",
      }),
    password: z
      .string({
        invalid_type_error: "Password is required.",
        required_error: "Password is required.",
      })
      .min(6, {
        message: "Password has to be at least 6 characters long.",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });
//   .refine(
//     async ({ email }) =>
//       (
//         await sql`
//         SELECT COUNT(*) FROM users WHERE email = ${email};
//         `
//       ).rows[0].count === "0" || true,
//     {
//       message: "User with this email already exists",
//       path: ["email"],
//     }
//   );
