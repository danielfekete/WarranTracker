import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({
      invalid_type_error: "Email is required.",
      required_error: "Email is required.",
    })
    .email(),
  password: z.string({
    invalid_type_error: "Password is required.",
    required_error: "Password is required.",
  }),
});
