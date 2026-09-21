// Secure-note domain data — the note flavor of a vault item. There is no
// static note seed data yet (notes are created at runtime inside vault
// items), so this file owns the note-form copy used by the add/edit sheets.

/** Placeholder/label copy for the secure-note tab of the item sheets. */
export const noteFormCopy = {
  titlePlaceholder: "e.g., Wi-Fi keys, Recovery codes",
  notePlaceholder: "Write your secure note...",
  notesPlaceholder: "Add any additional notes...",
} as const;
