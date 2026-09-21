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
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  signUpWithEmail,
  signInWithProvider,
} from "@/lib/supabase/auth-actions";
import {
  SignUpSchema,
  passwordRequirements,
  type SignUpFormValues,
} from "@/lib/schemas/auth";

function socialErrorToast(provider: string, message: string) {
  toast.add({
    type: "error",
    title: `Could not start ${provider} sign-up`,
    description: message,
  });
}

export function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const password = useWatch({ control, name: "password" });

  // Derived during render, no effect needed (rerender-derived-state-no-effect).
  const metCount = passwordRequirements.reduce(
    (count, req) => (req.test(password) ? count + 1 : count),
    0,
  );

  const onValid = (values: SignUpFormValues) => {
    startTransition(async () => {
      const result = await signUpWithEmail(
        values.email,
        values.password,
        values.fullName,
      );
      if (!result.ok) {
        toast.add({
          type: "error",
          title: "Could not create account",
          description: result.message,
        });
        return;
      }

      if (result.needsVerification) {
        toast.add({
          type: "success",
          title: "Account created",
          description: "We sent you a confirmation link. Check your inbox.",
        });
        router.push(
          `/verify-email?email=${encodeURIComponent(values.email)}`,
        );
        return;
      }

      toast.add({
        type: "success",
        title: "Account created",
        description: "Welcome to Vaultly! Opening your vault...",
      });
      router.push("/dashboard");
      router.refresh();
    });
  };

  const onInvalid = () => {
    toast.add({
      type: "error",
      title: "Please fix the highlighted fields",
      description: "All fields are required to create your account.",
    });
  };

  const handleSocial = (provider: "google" | "github") => {
    startTransition(async () => {
      const result = await signInWithProvider(provider);
      if (!result.ok) socialErrorToast(provider, result.message);
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
          disabled={isPending}
          onClick={() => handleSocial("google")}
        >
          <GoogleIcon data-icon="inline-start" />
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-10 font-sans"
          disabled={isPending}
          onClick={() => handleSocial("github")}
        >
          <GitHubIcon data-icon="inline-start" />
          Continue with GitHub
        </Button>
      </div>

      <form onSubmit={handleSubmit(onValid, onInvalid)} noValidate>
        <FieldGroup>
          <FieldSeparator>or</FieldSeparator>

          <Field data-invalid={!!errors.fullName}>
            <FieldLabel htmlFor="full-name">Full name</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <UserIcon />
              </InputGroupAddon>
              <InputGroupInput
                id="full-name"
                autoComplete="name"
                placeholder="John Doe"
                aria-invalid={!!errors.fullName}
                {...register("fullName")}
              />
            </InputGroup>
            <FieldError errors={[errors.fullName]} />
          </Field>

          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Email address</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <MailIcon />
              </InputGroupAddon>
              <InputGroupInput
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
            </InputGroup>
            <FieldError errors={[errors.email]} />
          </Field>

          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <LockKeyholeIcon />
              </InputGroupAddon>
              <InputGroupInput
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create a strong password"
                aria-invalid={!!errors.password}
                {...register("password")}
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
            <FieldError errors={[errors.password]} />

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
