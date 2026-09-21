// Client-side auth operations. These run in the browser via the Supabase
// browser client, which writes the session cookies the Proxy reads.
import { createClient } from "@/lib/supabase/client";

export type AuthResult = { ok: true } | { ok: false; message: string };

function messageFrom(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Something went wrong. Please try again.";
}

/** Email + password sign in. */
export async function signInWithEmail(
  email: string,
  password: string,
): Promise<AuthResult> {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { ok: false, message: error.message };
    return { ok: true };
  } catch (error) {
    return { ok: false, message: messageFrom(error) };
  }
}

/**
 * Email + password sign up. When email confirmation is enabled in the project,
 * the user is created but not signed in — the confirmation link points back at
 * /auth/callback, which exchanges the code and completes the session.
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string,
): Promise<{ ok: true; needsVerification: boolean } | { ok: false; message: string }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) return { ok: false, message: error.message };
    // A session is returned only when confirmation is disabled / already valid.
    const needsVerification = !data.session;
    return { ok: true, needsVerification };
  } catch (error) {
    return { ok: false, message: messageFrom(error) };
  }
}

/** OAuth redirect (Google / GitHub). Navigates away on success. */
export async function signInWithProvider(
  provider: "google" | "github",
): Promise<AuthResult> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error || !data?.url) {
      return {
        ok: false,
        message:
          error?.message ??
          `${provider} is not configured for this project yet.`,
      };
    }
    window.location.assign(data.url);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: messageFrom(error) };
  }
}

/** Resend the email-confirmation message. */
export async function resendConfirmation(email: string): Promise<AuthResult> {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) return { ok: false, message: error.message };
    return { ok: true };
  } catch (error) {
    return { ok: false, message: messageFrom(error) };
  }
}

/**
 * Send a password-reset link. The link lands on /auth/callback with
 * type=recovery, which verifies the token and forwards the (recovery) session
 * to /reset-password where the new password is set.
 */
export async function resetPassword(email: string): Promise<AuthResult> {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    if (error) return { ok: false, message: error.message };
    return { ok: true };
  } catch (error) {
    return { ok: false, message: messageFrom(error) };
  }
}

/** Set a new password for the signed-in (recovery) session. */
export async function updatePassword(newPassword: string): Promise<AuthResult> {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { ok: false, message: error.message };
    return { ok: true };
  } catch (error) {
    return { ok: false, message: messageFrom(error) };
  }
}

/**
 * Whether a session cookie exists (used to guard the reset-password page when
 * it is opened outside the recovery flow).
 */
export async function hasSession(): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    return Boolean(data.session);
  } catch {
    return false;
  }
}

/** Sign the current user out so the caller can redirect to the sign-in page. */
export async function signOut(): Promise<AuthResult> {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) return { ok: false, message: error.message };
    return { ok: true };
  } catch (error) {
    return { ok: false, message: messageFrom(error) };
  }
}
