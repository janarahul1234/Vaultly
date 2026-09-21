"use client";

import { useEffect, useTransition } from "react";
import { MailIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { resetPassword } from "@/lib/supabase/auth-actions";
import {
  ForgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/schemas/auth";

type ForgotPasswordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Reads the email currently typed in the sign-in form when the dialog opens. */
  getCurrentEmail: () => string;
};

export function ForgotPasswordDialog({
  open,
  onOpenChange,
  getCurrentEmail,
}: ForgotPasswordDialogProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  // Prefill (and clear previous input) each time the dialog opens.
  useEffect(() => {
    if (open) reset({ email: getCurrentEmail() });
  }, [open, reset, getCurrentEmail]);

  const onValid = (values: ForgotPasswordFormValues) => {
    startTransition(async () => {
      const result = await resetPassword(values.email);
      if (!result.ok) {
        toast.add({
          type: "error",
          title: "Could not send reset link",
          description: result.message,
        });
        return;
      }
      toast.add({
        type: "success",
        title: "Reset link sent",
        description: "If an account exists for that email, a reset link is on its way.",
      });
      onOpenChange(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset your password</DialogTitle>
          <DialogDescription>
            Enter your account email and we&apos;ll send you a link to choose a
            new password.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onValid)} noValidate className="flex flex-col gap-4">
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="reset-email">Email address</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <MailIcon />
              </InputGroupAddon>
              <InputGroupInput
                id="reset-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
            </InputGroup>
            <FieldError errors={[errors.email]} />
          </Field>

          <Button
            type="submit"
            className="w-full font-sans"
            disabled={isPending}
          >
            {isPending ? <Spinner data-icon="inline-start" /> : null}
            {isPending ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
