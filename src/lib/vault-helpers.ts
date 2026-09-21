// Pure vault/format helpers shared by the dashboard components. These are
// behavior, not data, so they live in @/lib rather than @/data. Regexes and
// character sets are hoisted or imported from @/data so nothing is rebuilt
// per render (js-hoist-regexp).

import { toast } from "@/components/ui/toast";
import { passwordSets } from "@/data/password";

import type { PasswordStrength } from "@/types/password";

// "Jan 10, 2024, 3:24 PM" — the absolute format used by the details panel.
export function formatVaultDate(date: Date) {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// Hoisted so the strength patterns are compiled once, not per keystroke.
const HAS_LOWER = /[a-z]/;
const HAS_UPPER = /[A-Z]/;
const HAS_DIGIT = /\d/;
const HAS_SPECIAL = /[^A-Za-z0-9]/;

export function scorePassword(password: string): PasswordStrength | null {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 14) score += 1;
  if (HAS_LOWER.test(password) && HAS_UPPER.test(password)) score += 1;
  if (HAS_DIGIT.test(password)) score += 1;
  if (HAS_SPECIAL.test(password)) score += 1;
  if (score <= 2) return "weak";
  if (score <= 4) return "fair";
  return "strong";
}

function randomIndex(max: number) {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

export function generatePassword(length = 20) {
  const all = passwordSets.join("");
  const pick = (chars: string) => chars[randomIndex(chars.length)];
  const chars = passwordSets.map(pick);
  while (chars.length < length) chars.push(pick(all));
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = randomIndex(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

// Unified clipboard action with toast feedback (view/edit sheets & actions).
export async function copyToClipboard(label: string, value: string) {
  if (!value) {
    toast.add({
      title: "Nothing to copy",
      description: `This ${label.toLowerCase()} is empty.`,
      type: "error",
    });
    return;
  }
  try {
    await navigator.clipboard.writeText(value);
    toast.add({
      title: `${label} copied`,
      description: value,
      type: "success",
    });
  } catch {
    toast.add({
      title: "Copy failed",
      description: "Clipboard is not available.",
      type: "error",
    });
  }
}
