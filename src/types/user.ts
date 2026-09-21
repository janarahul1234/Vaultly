// Account / auth-flow types — profile, sign-in, sign-up, and email verification.

import type { LucideIcon } from "lucide-react";

/** Displayed account identity (profile menu). */
export type UserAccount = {
  name: string;
  email: string;
};

/** Profile-menu link entry (MenuLink props). */
export type ProfileMenuLink = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

/** Props for email-verification flow components scoped to a single address. */
export type UserEmailProps = {
  email: string;
};

/** Props of the signup page showcase aside. */
export type SignupShowcaseProps = {
  headline?: string;
};

/** Props of the decorative "email sent" illustration. */
export type EmailSentIllustrationProps = {
  className?: string;
};
