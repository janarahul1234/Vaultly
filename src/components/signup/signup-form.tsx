"use client";

import { GitHubIcon, GoogleIcon } from "@/components/landing/brand-icons";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import {
  ArrowRightIcon,
  CircleCheckIcon,
  CircleIcon,
  EyeIcon,
  EyeOffIcon,
  LockKeyholeIcon,
  MailIcon,
  UserIcon,
} from "lucide-react";
import { useState, useTransition } from "react";

// Hoisted so the patterns are compiled once, not per render or per keystroke
// (js-hoist-regexp).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordRequirements = [
  {
    id: "length",
    label: "Use at least 8 characters",
    test: (value: string) => value.length >= 8,
  },
  {
    id: "upper",
    label: "Include an uppercase letter",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    id: "number",
    label: "Include a number",
    test: (value: string) => /\d/.test(value),
  },
  {
    id: "special",
    label: "Include a special character",
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
];

function socialToast(provider: string) {
  toast.add({
    type: "info",
    title: `${provider} sign-up is not available in this demo`,
    description: "Use the email form to create your account.",
  });
}

export function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Derived during render, no effect needed (rerender-derived-state-no-effect).
  const metCount = passwordRequirements.reduce(
    (count, req) => (req.test(password) ? count + 1 : count),
    0,
  );

  const nameError =
    submitted && !fullName.trim() ? "Please enter your full name." : undefined;
  const emailError =
    submitted && !EMAIL_PATTERN.test(email)
      ? "Please enter a valid email address."
      : undefined;
  const passwordError =
    submitted && !password ? "Please create a password." : undefined;
  const agreedError =
    submitted && !agreed ? "You must accept the terms to continue." : undefined;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    if (
      !fullName.trim() ||
      !EMAIL_PATTERN.test(email) ||
      !password ||
      !agreed
    ) {
      toast.add({
        type: "error",
        title: "Please fix the highlighted fields",
        description: "All fields are required to create your account.",
      });
      return;
    }

    // Demo submit — replace with a server action / API call.
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      toast.add({
        type: "success",
        title: "Account created",
        description: `Welcome to Vaultly, ${fullName.trim().split(" ")[0]}! Your vault is ready.`,
      });
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h2 className="font-heading text-3xl font-semibold tracking-tight">
          Create your account
        </h2>
        <p className="text-muted-foreground text-sm">
          Join thousands who trust Vaultly to keep their digital life secure.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          className="h-10 font-sans"
          onClick={() => socialToast("Google")}
        >
          <GoogleIcon data-icon="inline-start" />
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-10 font-sans"
          onClick={() => socialToast("GitHub")}
        >
          <GitHubIcon data-icon="inline-start" />
          Continue with GitHub
        </Button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <FieldGroup>
          <FieldSeparator>or</FieldSeparator>

          <Field data-invalid={!!nameError}>
            <FieldLabel htmlFor="full-name">Full name</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <UserIcon />
              </InputGroupAddon>
              <InputGroupInput
                id="full-name"
                name="name"
                autoComplete="name"
                placeholder="John Doe"
                aria-invalid={!!nameError}
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />
            </InputGroup>
            <FieldError>{nameError}</FieldError>
          </Field>

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
                autoComplete="new-password"
                placeholder="Create a strong password"
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

            {/* Strength segments */}
            <div
              className="flex gap-1.5 pt-1"
              role="progressbar"
              aria-label="Password strength"
              aria-valuenow={metCount}
              aria-valuemin={0}
              aria-valuemax={passwordRequirements.length}
            >
              {passwordRequirements.map((req, index) => (
                <span
                  key={req.id}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    index < metCount
                      ? metCount <= 1
                        ? "bg-destructive"
                        : metCount <= 3
                          ? "bg-primary/50"
                          : "bg-primary"
                      : "bg-muted",
                  )}
                />
              ))}
            </div>

            {/* Requirements checklist */}
            <div className="grid gap-x-6 gap-y-2 pt-1">
              {passwordRequirements.map((req) => {
                const met = req.test(password);
                return (
                  <span
                    key={req.id}
                    className={cn(
                      "flex items-center gap-2 text-sm transition-colors",
                      met ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {met ? (
                      <CircleCheckIcon size={18} />
                    ) : (
                      <CircleIcon size={18} />
                    )}
                    {req.label}
                  </span>
                );
              })}
            </div>
          </Field>

          <Button
            type="submit"
            className="mt-1 h-10 w-full font-sans"
            disabled={isPending}
          >
            {isPending ? <Spinner data-icon="inline-start" /> : null}
            {isPending ? "Creating account..." : "Create account"}
            {isPending ? null : <ArrowRightIcon data-icon="inline-end" />}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
