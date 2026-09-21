// Shared callback for OAuth logins and email confirmation links.
// Supabase redirects here with either a PKCE `code` or a `token_hash` + `type`.
import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

// OTP types accepted when verifying an email link via `token_hash`.
type EmailOtpType =
  | "signup"
  | "invite"
  | "magiclink"
  | "recovery"
  | "email_change"
  | "email";

const EMAIL_OTP_TYPES = [
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
] as const;

// Validate the attacker-controlled `type` at runtime instead of casting, so an
// unexpected value is treated as absent rather than forwarded to `verifyOtp`.
function isEmailOtpType(value: string | null): value is EmailOtpType {
  return value !== null && (EMAIL_OTP_TYPES as readonly string[]).includes(value);
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = isEmailOtpType(searchParams.get("type"))
    ? searchParams.get("type")
    : null;
  const next = searchParams.get("next") ?? "/dashboard";
  const error = searchParams.get("error") ?? searchParams.get("error_description");

  // Always land inside the app, never on an absolute external URL.
  const redirectTo = next.startsWith("/") ? `${origin}${next}` : origin;

  const supabase = await createClient();

  if (code) {
    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      return NextResponse.redirect(redirectTo);
    }
    return NextResponse.redirect(
      `${origin}/signin?error=${encodeURIComponent(exchangeError.message)}`,
    );
  }

  if (tokenHash && type) {
    const { error: verifyError } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (!verifyError) {
      return NextResponse.redirect(redirectTo);
    }
    return NextResponse.redirect(
      `${origin}/signin?error=${encodeURIComponent(verifyError.message)}`,
    );
  }

  // Provider returned an error, or the link is missing its parameters.
  return NextResponse.redirect(
    `${origin}/signin?error=${encodeURIComponent(
      error ?? "We couldn't complete that sign-in. Please try again.",
    )}`,
  );
}
