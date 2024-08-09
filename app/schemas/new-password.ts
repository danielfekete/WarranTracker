import { z } from "zod";

export const newPasswordSchema = z.object({
  password: z.string().min(6),
  confirmPassword: z.string(),
});
