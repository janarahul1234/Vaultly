import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SignupForm } from "@/components/signup/signup-form";
import { SignupShowcase } from "@/components/signup/signup-showcase";

export const metadata: Metadata = {
  title: "Create your account — Vaultly",
  description:
    "Sign up for Vaultly and keep your passwords, notes, and files in one secure, end-to-end encrypted place.",
};

export default function SignUpPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-muted/50 px-4 py-8 sm:px-6 lg:py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border bg-card shadow-2xl shadow-foreground/5 lg:grid-cols-2">
        <SignupShowcase />

        <section className="flex flex-col gap-10 p-6 sm:p-8">
          <div className="flex items-center justify-end gap-3 text-sm text-muted-foreground">
            Already have an account?
            <Button
              nativeButton={false}
              render={<Link href="/signin" />}
              className="font-sans"
            >
              Sign in
            </Button>
          </div>
          <SignupForm />
        </section>
      </div>
    </main>
  );
}
