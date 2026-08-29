import { z } from "zod";

// Login only needs email + password. Same approach as registerSchema:
// presence/shape checks only — the backend DTO owns real validation
// (credential correctness, lockouts, etc.).

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
