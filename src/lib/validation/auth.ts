import { z } from "zod";

// Website password rule for NEW passwords: at least 8 characters with a letter and a number.
// Stricter than Firebase's 6-character minimum used by Android; login accepts any existing password.
export const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters.")
  .max(128, "Use at most 128 characters.")
  .regex(/[A-Za-z]/, "Include at least one letter.")
  .regex(/[0-9]/, "Include at least one number.");

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Enter your email.")
  .email("Enter a valid email address.")
  .max(150);

export const phoneSchema = z
  .string()
  .trim()
  .min(9, "Enter a valid phone number.")
  .max(20, "Enter a valid phone number.")
  .regex(/^\+?[0-9 ()-]{9,20}$/, "Use digits only, e.g. 0712 345 678 or +255712345678.");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password."),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name.").max(100),
    email: emailSchema,
    phone: phoneSchema,
    role: z.enum(["CUSTOMER", "BUSINESS_OWNER"], { message: "Choose an account type." }),
    password: passwordSchema,
    confirm: z.string(),
    terms: z.literal("on", { message: "Please accept the terms to continue." }),
  })
  .refine((d) => d.password === d.confirm, {
    path: ["confirm"],
    message: "Passwords do not match.",
  });

export const forgotSchema = z.object({ email: emailSchema });

export const resetSchema = z
  .object({ password: passwordSchema, confirm: z.string() })
  .refine((d) => d.password === d.confirm, {
    path: ["confirm"],
    message: "Passwords do not match.",
  });
