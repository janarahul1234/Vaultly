// Vault add/edit form validation (Zod v4). One schema drives both sheets —
// conditional rules (login needs a password, note needs content) live in a
// superRefine close to the definition, keyed off the in-form `type` field.
// Trim transforms run in the resolver, so submit handlers receive clean
// output values and no longer call .trim() themselves.

import { z } from "zod";

import { categoryOptions } from "@/data/password";

import type { VaultCategory } from "@/types/password";

// Runtime options stay single-sourced in @/data/password; the cast just
// re-tells Zod what `categoryOptions` is already typed as.
const VaultCategorySchema = z.enum(
  categoryOptions as [VaultCategory, ...VaultCategory[]],
);

export const VaultItemSchema = z
  .object({
    type: z.enum(["login", "note"]),
    name: z.string().trim().min(1, { error: "Title is required." }),
    website: z.string().trim(),
    username: z.string().trim(),
    password: z.string(),
    // "" means "no category selected" in the sheet's Select control.
    category: VaultCategorySchema.or(z.literal("")).transform((value) =>
      value === "" ? null : value,
    ),
    tags: z.array(z.string()),
    notes: z.string().trim(),
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
