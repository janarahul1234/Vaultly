// Auth form validation schemas (Zod v4) shared by the sign-in and sign-up
// forms. Error messages match the copy previously inlined in the components.
// Inferred form types stay here — runtime contracts in src/types are
// unaffected because these shapes never leave the client.

import { z } from "zod";

export const SignInSchema = z.object({
  email: z.email({ error: "Please enter a valid email address." }).trim(),
  password: z.string().min(1, { error: "Please enter your password." }),
  keepSignedIn: z.boolean(),
});

// Checklist rendered under the sign-up password field — hoisted here so the
// strength meter, requirement list and any future schema rules share one
// source of truth for the predicates.
export const passwordRequirements = [
  {
    id: "length",
    label: "Use at least 8 characters",
    test: (value: string) => value.length >= 8,
  },
  {
    id: "upper",
    label: "Include an uppercase letter",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    id: "number",
    label: "Include a number",
    test: (value: string) => /\d/.test(value),
  },
  {
    id: "special",
    label: "Include a special character",
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
] as const;

// Sign-up keeps a non-empty password as a hard requirement (same as before);
// the strength checklist stays advisory guidance in the UI.
const SignUpPasswordSchema = z
  .string()
  .min(1, { error: "Please create a password." });

export const SignUpSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, { error: "Please enter your full name." }),
  email: z.email({ error: "Please enter a valid email address." }).trim(),
  password: SignUpPasswordSchema,
});

export type SignInFormValues = z.input<typeof SignInSchema>;
export type SignInFormOutput = z.output<typeof SignInSchema>;
export type SignUpFormValues = z.input<typeof SignUpSchema>;
export type SignUpFormOutput = z.output<typeof SignUpSchema>;

// Password-reset forms: the email prompt on the sign-in dialog and the new
// password form reached through the recovery link.
export const ForgotPasswordSchema = z.object({
  email: z.email({ error: "Please enter a valid email address." }).trim(),
});

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, { error: "Please create a new password." }),
    confirmPassword: z
      .string()
      .min(1, { error: "Please confirm your new password." }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match.",
  });

export type ForgotPasswordFormValues = z.input<typeof ForgotPasswordSchema>;
export type ResetPasswordFormValues = z.input<typeof ResetPasswordSchema>;
