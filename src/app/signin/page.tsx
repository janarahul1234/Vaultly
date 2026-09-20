import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toast";
import { SigninForm } from "@/components/signin/signin-form";
import { SignupShowcase } from "@/components/signup/signup-showcase";

export const metadata: Metadata = {
  title: "Sign in — Vaultly",
  description:
    "Welcome back! Sign in to your Vaultly account and access your passwords, notes, and files from anywhere.",
};

export default function SignInPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-muted/50 px-4 py-8 sm:px-6 lg:py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border bg-card shadow-2xl shadow-foreground/5 lg:grid-cols-2">
        <SignupShowcase headline="Secure what matters most" />

        <section className="flex flex-col gap-12 sm:gap-16 p-6 sm:p-8">
          <div className="flex items-center justify-end gap-3 text-sm text-muted-foreground">
            New to Vaultly?
            <Button
              nativeButton={false}
              render={<Link href="/signup" />}
              className="font-sans"
            >
              Create account
            </Button>
          </div>
          <SigninForm />
        </section>
      </div>
      <Toaster />
    </main>
  );
}
