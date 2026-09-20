import Link from "next/link";
import {
  ArrowLeftIcon,
  CircleHelpIcon,
  MailIcon,
  MessageCircleIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { EmailSentIllustration } from "@/components/verify-email/email-sent-illustration";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldSeparator } from "@/components/ui/field";
import { ResendEmailButton } from "./resend-email-button";

// Hoisted static content so the footer rows are plain data mapped at render.
const helpItems = [
  {
    icon: CircleHelpIcon,
    title: "Need help?",
    description: "Visit our help center",
  },
  {
    icon: MessageCircleIcon,
    title: "Contact support",
    description: "We're here to help",
  },
  {
    icon: ShieldCheckIcon,
    title: "Secure & private",
    description: "Your data is always safe",
  },
];

export function VerifyEmailCard({ email }: { email: string }) {
  return (
    <Card className="w-full max-w-2xl [--card-spacing:--spacing(8)] rounded-3xl">
      <CardHeader className="text-center">
        <EmailSentIllustration className="mx-auto w-full max-w-65" />
        <CardTitle className="text-3xl font-semibold tracking-tight mb-1">
          Check your email
        </CardTitle>
        <CardDescription className="flex flex-col items-center gap-1">
          <span>We've sent a confirmation link to</span>
          <span className="font-semibold text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <p className="text-center text-muted-foreground sm:px-4">
          Please check your inbox and click the link to verify your email
          address and activate your account.
        </p>

        {/* Action overlays the alert only from sm up; on mobile it flows
            below the text so nothing overlaps the Resend button. */}
        <Alert className="grid-cols-[auto_1fr] items-center gap-x-4 rounded-xl bg-muted/50 p-4 max-sm:pr-4! sm:pr-40!">
          <span
            aria-hidden
            className="row-span-2 flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
          >
            <MailIcon className="translate-y-0" />
          </span>
          <AlertTitle className="font-semibold">
            Didn't receive the email?
          </AlertTitle>
          <AlertDescription>
            Check your spam folder or request a new link.
          </AlertDescription>
          <AlertAction className="relative inset-auto mt-2 translate-y-0 justify-self-start col-start-2 sm:absolute sm:top-1/2 sm:right-4 sm:mt-0 sm:-translate-y-1/2">
            <ResendEmailButton email={email} />
          </AlertAction>
        </Alert>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/signin" />}
          className="h-10 w-full max-w-40 self-center font-sans"
        >
          <ArrowLeftIcon data-icon="inline-start" />
          Back to Sign in
        </Button>
      </CardContent>

      <CardFooter className="grid gap-3 border-t-0 bg-card sm:grid-cols-3">
        {helpItems.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border bg-background text-muted-foreground">
              <Icon size={18} />
            </span>
            <div className="flex flex-col gap-0.5 text-left">
              <span className="text-sm font-semibold">{title}</span>
              <span className="text-xs text-muted-foreground">
                {description}
              </span>
            </div>
          </div>
        ))}
      </CardFooter>
    </Card>
  );
}
