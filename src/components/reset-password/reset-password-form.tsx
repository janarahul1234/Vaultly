"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon, KeyRoundIcon, ShieldAlertIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
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
  hasSession,
  updatePassword,
} from "@/lib/supabase/auth-actions";
import {
  ResetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/schemas/auth";

type SessionState = "checking" | "ready" | "expired";

export function ResetPasswordForm() {
  const router = useRouter();
  const [sessionState, setSessionState] = useState<SessionState>("checking");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  // The page is only usable with the recovery session created when the reset
  // link was opened; a direct visit or an expired link gets a clear message.
  useEffect(() => {
    let active = true;
    hasSession().then((ok) => {
      if (active) setSessionState(ok ? "ready" : "expired");
    });
    return () => {
      active = false;
    };
  }, []);

  const onValid = (values: ResetPasswordFormValues) => {
    startTransition(async () => {
      const result = await updatePassword(values.password);
      if (!result.ok) {
        toast.add({
          type: "error",
          title: "Could not update password",
          description: result.message,
        });
        return;
      }
      toast.add({
        type: "success",
        title: "Password updated",
        description: "Your new password is set. Opening your vault...",
      });
      router.push("/dashboard");
      router.refresh();
    });
  };

  if (sessionState === "checking") {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Spinner />
        Checking your reset link...
      </div>
    );
  }

  if (sessionState === "expired") {
    return (
      <Card className="w-full max-w-md text-center [--card-spacing:--spacing(6)]">
        <CardHeader>
          <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlertIcon />
          </span>
          <CardTitle>Link invalid or expired</CardTitle>
          <CardDescription>
            This password reset link no longer works. Request a fresh one from
            the sign-in page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            nativeButton={false}
            render={<Link href="/signin" />}
            className="w-full font-sans"
          >
            Back to sign in
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md [--card-spacing:--spacing(6)]">
      <CardHeader>
        <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
          <KeyRoundIcon />
        </span>
        <CardTitle>Choose a new password</CardTitle>
        <CardDescription>
          Enter a new password for your Vaultly account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onValid)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="new-password">New password</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <KeyRoundIcon />
                </InputGroupAddon>
                <InputGroupInput
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((visible) => !visible)}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldError errors={[errors.password]} />
            </Field>

            <Field data-invalid={!!errors.confirmPassword}>
              <FieldLabel htmlFor="confirm-password">
                Confirm new password
              </FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <KeyRoundIcon />
                </InputGroupAddon>
                <InputGroupInput
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter your new password"
                  aria-invalid={!!errors.confirmPassword}
                  {...register("confirmPassword")}
                />
              </InputGroup>
              <FieldError errors={[errors.confirmPassword]} />
            </Field>

            <Button
              type="submit"
              className="mt-1 h-11 w-full font-sans"
              disabled={isPending}
            >
              {isPending ? <Spinner data-icon="inline-start" /> : null}
              {isPending ? "Updating..." : "Update password"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
