// Secure-note types — the "note" flavor of a vault item and its form fields.

import type {
  ItemDraft,
  ItemEditDraft,
  VaultItem,
} from "@/types/password";

/** A vault item narrowed to the `note` type. */
export type NoteVaultItem = VaultItem & { type: "note" };

/** Note-tab fields emitted by the add sheet (no login credentials). */
export type NoteDraft = Pick<
  ItemDraft,
  "type" | "name" | "category" | "tags" | "notes"
>;

/** Note-tab fields emitted by the edit sheet. */
export type NoteEditDraft = Pick<
  ItemEditDraft,
  "type" | "name" | "category" | "tags" | "notes"
>;

/** Props of the read-only notes textarea (view sheet). */
export type NoteFieldProps = {
  id: string;
  value: string;
};
