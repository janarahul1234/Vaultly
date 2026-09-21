"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
  LockKeyholeIcon,
  MailIcon,
} from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { ForgotPasswordDialog } from "@/components/signin/forgot-password-dialog";

import {
  signInWithEmail,
  signInWithProvider,
} from "@/lib/supabase/auth-actions";
import { SignInSchema, type SignInFormValues } from "@/lib/schemas/auth";

export function SigninForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: "", password: "", keepSignedIn: true },
  });

  const keepSignedIn = useWatch({ control, name: "keepSignedIn" });

  // Surface an error handed back from the OAuth / email-confirmation callback
  // (e.g. "Email not confirmed") as a toast on first mount. The ref guards
  // against the StrictMode double-invoke, and the param is stripped from the
  // URL so a later re-mount never replays the toast.
  const errorCallbackShownRef = useRef(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const message = params.get("error");
    if (!message || errorCallbackShownRef.current) return;
    errorCallbackShownRef.current = true;
    params.delete("error");
    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}`,
    );
    // Deferred by one task: on a hard (redirect-driven) load this effect runs
    // before the root <Toaster /> subscribes to the toast manager, so a
    // synchronous add() would be dropped. The toast is global, so no cleanup
    // is needed — the StrictMode remount is already blocked by the ref.
    window.setTimeout(() => {
      toast.add({
        type: "error",
        title: "Unable to sign in",
        description: message,
      });
    }, 0);
  }, []);

  const onValid = (values: SignInFormValues) => {
    startTransition(async () => {
      const result = await signInWithEmail(values.email, values.password);
      if (!result.ok) {
        toast.add({
          type: "error",
          title: "Unable to sign in",
          description: result.message,
        });
        return;
      }
      toast.add({
        type: "success",
        title: "Signed in",
        description: "Welcome back! Opening your vault...",
      });
      router.push("/dashboard");
      router.refresh();
    });
  };

  const onInvalid = () => {
    toast.add({
      type: "error",
      title: "Please fix the highlighted fields",
      description: "Your email and password are required to sign in.",
    });
  };

  const handleSocial = (provider: "google" | "github") => {
    startTransition(async () => {
      const result = await signInWithProvider(provider);
      if (!result.ok) {
        toast.add({
          type: "error",
          title: `Could not start ${provider} sign-in`,
          description: result.message,
        });
      }
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
          disabled={isPending}
          onClick={() => handleSocial("google")}
        >
          <GoogleIcon data-icon="inline-start" />
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full font-sans"
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
                autoComplete="current-password"
                placeholder="Enter your password"
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
          </Field>

          <div className="flex items-center justify-between gap-4">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                name="keepSignedIn"
                checked={keepSignedIn}
                onCheckedChange={(checked) =>
                  setValue("keepSignedIn", !!checked)
                }
              />
              Keep me signed in
            </label>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 font-sans text-sm font-normal"
              onClick={() => setResetOpen(true)}
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
          href="/legal/terms"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="/legal/privacy"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Privacy Policy
        </a>
        .
      </p>

      <ForgotPasswordDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        getCurrentEmail={() => getValues("email")}
      />
    </div>
  );
}
