// Account / auth-flow types — profile, sign-in, sign-up, and email verification.

import type { LucideIcon } from "lucide-react";

/** Profile-menu link entry (MenuLink props). */
export type ProfileMenuLink = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

/**
 * Props for email-verification flow components. `email` is null when the page
 * was opened without a valid `?email=` parameter (e.g. a direct visit), in
 * which case no address-specific action can be offered.
 */
export type UserEmailProps = {
  email: string | null;
};

/** Props of the signup page showcase aside. */
export type SignupShowcaseProps = {
  headline?: string;
};

/** Props of the decorative "email sent" illustration. */
export type EmailSentIllustrationProps = {
  className?: string;
};
