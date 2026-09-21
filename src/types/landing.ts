// Shared types for the marketing / landing components.

import type { ComponentProps } from "react";

/** Base props for the inline brand SVGs in landing/brand-icons.tsx. */
export type IconProps = ComponentProps<"svg">;

/** Props of the Vaultly brand lockup. */
export type VaultLogoProps = {
  className?: string;
};

/** Props of the pill badge shown above section headings. */
export type SectionBadgeProps = {
  label: string;
  className?: string;
};
