import { z } from "zod";

// Maps directly to the Prisma fields:
// firstName String, lastName String, dob DateTime?, password String,
// email String @unique, phone String?
//
// Business-rule validation (password strength, phone format, min age, etc.)
// is intentionally NOT duplicated here — the backend DTO already owns that.
// This schema only checks presence/shape so react-hook-form has something
// to validate against and the payload is well-typed.

export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),

  lastName: z.string().min(1, "Last name is required"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),

  // Optional in Prisma (String?) -> input may be empty.
  phone: z.string().optional().or(z.literal("")),

  // Optional in Prisma (DateTime?) -> comes from <input type="date">
  // as "YYYY-MM-DD" or empty string.
  dob: z.string().optional().or(z.literal("")),

  password: z.string().min(1, "Password is required"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

// Shape actually sent to the backend (normalizes empty optional strings to
// undefined so the DTO sees them as genuinely absent).
export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dob?: string;
  phone?: string;
};

export function toRegisterPayload(values: RegisterFormValues): RegisterPayload {
  return {
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    password: values.password,
    dob: values.dob || undefined,
    phone: values.phone || undefined,
  };
}
