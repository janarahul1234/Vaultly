"use client";

import Link from "next/link";
import { GitHubIcon, GoogleIcon } from "@/components/landing/brand-icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import {
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
  LockKeyholeIcon,
  MailIcon,
} from "lucide-react";
import { useState, useTransition } from "react";

// Hoisted so the pattern is compiled once, not per render or per keystroke
// (js-hoist-regexp).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function socialToast(provider: string) {
  toast.add({
    type: "info",
    title: `${provider} sign-in is not available in this demo`,
    description: "Use the email form to sign in to your account.",
  });
}

export function SigninForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const emailError =
    submitted && !EMAIL_PATTERN.test(email)
      ? "Please enter a valid email address."
      : undefined;
  const passwordError =
    submitted && !password ? "Please enter your password." : undefined;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    if (!EMAIL_PATTERN.test(email) || !password) {
      toast.add({
        type: "error",
        title: "Please fix the highlighted fields",
        description: "Your email and password are required to sign in.",
      });
      return;
    }

    // Demo submit — replace with a server action / API call.
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      toast.add({
        type: "success",
        title: "Signed in",
        description: `Welcome back! Opening your vault for ${email}...`,
      });
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h2 className="font-heading text-3xl font-semibold tracking-tight">
          Sign in
        </h2>
        <p className="text-muted-foreground text-sm">
          Welcome back! Sign in to your account.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full font-sans"
          onClick={() => socialToast("Google")}
        >
          <GoogleIcon data-icon="inline-start" />
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full font-sans"
          onClick={() => socialToast("GitHub")}
        >
          <GitHubIcon data-icon="inline-start" />
          Continue with GitHub
        </Button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <FieldGroup>
          <FieldSeparator>or</FieldSeparator>

          <Field data-invalid={!!emailError}>
            <FieldLabel htmlFor="email">Email address</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <MailIcon />
              </InputGroupAddon>
              <InputGroupInput
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={!!emailError}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </InputGroup>
            <FieldError>{emailError}</FieldError>
          </Field>

          <Field data-invalid={!!passwordError}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <LockKeyholeIcon />
              </InputGroupAddon>
              <InputGroupInput
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                aria-invalid={!!passwordError}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-xs"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <FieldError>{passwordError}</FieldError>
          </Field>

          <div className="flex items-center justify-between gap-4">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                name="remember"
                checked={keepSignedIn}
                onCheckedChange={(checked) => setKeepSignedIn(!!checked)}
              />
              Keep me signed in
            </label>
            <Button
              nativeButton={false}
              render={<Link href="#" />}
              variant="link"
              className="h-auto p-0 font-sans text-sm font-normal"
            >
              Forgot password?
            </Button>
          </div>

          <Button
            type="submit"
            className="mt-1 h-11 w-full font-sans"
            disabled={isPending}
          >
            {isPending ? <Spinner data-icon="inline-start" /> : null}
            {isPending ? "Signing in..." : "Sign in"}
            {isPending ? null : <ArrowRightIcon data-icon="inline-end" />}
          </Button>
        </FieldGroup>
      </form>

      <p className="sm:px-6 text-center text-sm leading-normal text-muted-foreground">
        By signing in, you agree to our{" "}
        <a
          href="#"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
