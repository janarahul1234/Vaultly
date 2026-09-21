// Vault data model + password-specific types shared across the dashboard.
// Extracted from @/data/password and the add/edit sheets so the
// model lives independently of the mock data and UI code.

export type VaultCategory =
  | "Work"
  | "Personal"
  | "Entertainment"
  | "Shopping"
  | "Social";

export type VaultItemType = "login" | "note" | "card";

/** The two editable item types exposed by the add/edit sheets. */
export type VaultFormType = Exclude<VaultItemType, "card">;

/** Passwords-panel type filter value — "all" or a concrete item type. */
export type VaultTypeFilter = VaultItemType | "all";

export type VaultIconKey =
  | "github"
  | "google"
  | "notion"
  | "spotify"
  | "netflix"
  | "amazon"
  | "x"
  | "linkedin"
  /** Fallback for user-created items — renders the generic globe icon. */
  | "generic";

export type VaultItem = {
  id: string;
  name: string;
  username: string;
  website: string;
  category: VaultCategory;
  tags: string[];
  type: VaultItemType;
  favorite: boolean;
  /** Days since last update — used for sorting. */
  updatedAt: number;
  /** Human-readable relative time — used for display. */
  updatedLabel: string;
  iconKey: VaultIconKey;
  /** Stored secret — masked until revealed in the details panel. */
  password?: string;
  /** Free-form secure note shown in the details panel. */
  notes?: string;
  /** Absolute creation timestamp — shown in the details panel footer. */
  createdAt?: string;
  /** Absolute last-update timestamp — shown in the details panel footer. */
  updatedAtLabel?: string;
};

// Shape emitted by the add sheet — the Dashboard owns VaultItem construction.
export type ItemDraft = {
  type: VaultFormType;
  name: string;
  website: string;
  username: string;
  password: string;
  category: VaultCategory | null;
  tags: string[];
  notes: string;
};

// Editable subset of a VaultItem — the Dashboard merges this back into the
// stored record and owns timestamps/id, mirroring the ItemDraft contract.
export type ItemEditDraft = {
  type: VaultFormType;
  name: string;
  website: string;
  username: string;
  password: string;
  category: VaultCategory;
  tags: string[];
  notes: string;
};

/** Password strength levels used by the add/edit sheet meters. */
export type PasswordStrength = "weak" | "fair" | "strong";

/** Display metadata for one strength level (label, meter %, colors). */
export type PasswordStrengthMeta = {
  label: string;
  pct: number;
  progress: string;
};

/** Props of the category select shared by the add/edit sheets. */
export type CategoryFieldProps = {
  value: string;
  onValueChange: (value: string) => void;
};

/** Props of the tag chip editor shared by the add/edit sheets. */
export type TagsFieldProps = {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
};

// ── Persistence contract (Supabase `public.vault_items`) ───────────────────

/** Raw row shape as stored/returned by Postgres (snake_case). */
export type VaultItemRow = {
  id: string;
  user_id: string;
  type: VaultItemType;
  name: string;
  website: string | null;
  username: string | null;
  category: VaultCategory;
  tags: string[];
  favorite: boolean;
  password: string | null;
  notes: string | null;
  icon_key: VaultIconKey;
  /** ISO-8601 timestamps (serialized to strings across the RSC boundary). */
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

/**
 * Result of a vault Server Action. On success the authoritative, freshly
 * mapped row is returned so the client can reconcile its local state without
 * a second read; on failure `message` carries a user-safe reason.
 */
export type VaultItemResult =
  | { ok: true; item: VaultItem }
  | { ok: false; message: string };

/** Result for actions that don't need to hand a row back (e.g. hard delete). */
export type VaultResult = { ok: true } | { ok: false; message: string };
