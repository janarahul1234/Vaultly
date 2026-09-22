// Vault add/edit validation (Zod v4) shared by BOTH sides of the wire:
// - the sheets use `VaultItemSchema` through the RHF resolver (UX), and
// - the Server Actions re-validate their raw arguments with the
//   `*InputSchema` variants below (trust boundary — a Server Action is a
//   public endpoint, its args are untrusted regardless of the TS signature).
// One `vaultFieldLimits` source keeps the two layers from drifting apart.
// Conditional rules (login needs a password, note needs content) live in a
// superRefine close to the definition, keyed off the in-form `type` field.
// Trim transforms run in the resolver/parser, so downstream code never
// calls .trim() itself.

import { z } from "zod";

import { categoryOptions } from "@/data/password";

import type { VaultCategory } from "@/types/password";

/** Max stored lengths, mirrored by the Server Actions and the form schema. */
export const vaultFieldLimits = {
  name: 120,
  website: 500,
  username: 300,
  password: 1024,
  notes: 20_000,
  tag: 50,
  tags: 25,
} as const;

// Runtime options stay single-sourced in @/data/password; the cast just
// re-tells Zod what `categoryOptions` is already typed as.
const VaultCategorySchema = z.enum(
  categoryOptions as [VaultCategory, ...VaultCategory[]],
);

export const VaultItemSchema = z
  .object({
    type: z.enum(["login", "note"]),
    name: z
      .string()
      .trim()
      .min(1, { error: "Title is required." })
      .max(vaultFieldLimits.name, {
        error: "Title is too long.",
      }),
    website: z.string().trim().max(vaultFieldLimits.website),
    username: z.string().trim().max(vaultFieldLimits.username),
    password: z.string().max(vaultFieldLimits.password),
    // "" means "no category selected" in the sheet's Select control.
    category: VaultCategorySchema.or(z.literal("")).transform((value) =>
      value === "" ? null : value,
    ),
    tags: z.array(z.string().trim().min(1).max(vaultFieldLimits.tag)).max(
      vaultFieldLimits.tags,
    ),
    notes: z
      .string()
      .trim()
      .max(vaultFieldLimits.notes, { error: "Note is too long." }),
  })
  .superRefine((data, ctx) => {
    if (data.type === "login" && !data.password) {
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message: "Password is required.",
      });
    }
    if (data.type === "note" && !data.notes) {
      ctx.addIssue({
        code: "custom",
        path: ["notes"],
        message: "Note content is required.",
      });
    }
  });

/** Raw form state shape (what the inputs bind to, pre-transform). */
export type VaultItemFormValues = z.input<typeof VaultItemSchema>;

/** Validated + transformed shape handed to onSave. */
export type VaultItemFormOutput = z.output<typeof VaultItemSchema>;

// ── Server Action input contracts ──────────────────────────────────────────
// These parse the *output* the sheets send (already trimmed / ""→null), but
// via `.loose()`-free strict parsing on `unknown` — a crafted request can
// send anything, so the action re-validates every field, applies the same
// limits, and normalizes defensively (coerce nulls, defaults).

const DraftCategorySchema = VaultCategorySchema.nullish().transform(
  (value) => value ?? "Personal",
);

const DraftTagsSchema = z
  .array(z.string().trim().min(1).max(vaultFieldLimits.tag))
  .max(vaultFieldLimits.tags)
  .default([]);

/** `createVaultItem` argument: the full ItemDraft shape. */
export const VaultItemDraftInputSchema = z
  .object({
    type: z.enum(["login", "note"]),
    name: z
      .string()
      .trim()
      .min(1, { error: "Title is required." })
      .max(vaultFieldLimits.name),
    website: z.string().trim().max(vaultFieldLimits.website).nullish(),
    username: z.string().trim().max(vaultFieldLimits.username).nullish(),
    password: z.string().max(vaultFieldLimits.password).nullish().default(""),
    category: DraftCategorySchema,
    tags: DraftTagsSchema,
    notes: z.string().trim().max(vaultFieldLimits.notes).nullish().default(""),
  })
  .superRefine((data, ctx) => {
    // Same business rules as the form — enforced again on the server.
    if (data.type === "login" && !data.password) {
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message: "Password is required.",
      });
    }
    if (data.type === "note" && !data.notes) {
      ctx.addIssue({
        code: "custom",
        path: ["notes"],
        message: "Note content is required.",
      });
    }
  });

/** `updateVaultItem` argument: same editable subset as the draft. */
export const VaultItemEditInputSchema = VaultItemDraftInputSchema;

/** Row ids used by the id-based actions (toggle/trash/restore/delete/tag). */
export const VaultItemIdSchema = z.string().uuid({
  error: "Invalid item id.",
});

/** Tag value for `removeVaultItemTag`. */
export const VaultItemTagSchema = z
  .string()
  .trim()
  .min(1)
  .max(vaultFieldLimits.tag);

/** First validation issue as a user-safe message (for action results). */
export function firstIssueMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Invalid input.";
}
