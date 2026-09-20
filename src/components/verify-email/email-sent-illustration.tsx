import { cn } from "@/lib/utils";

// Decorative "email sent" artwork matching the reference design. Rendered as
// static server JSX (rendering-hoist-jsx) and themed entirely with the
// currentColor / card tokens so it adapts to dark mode automatically.
export function EmailSentIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 440 320"
      fill="none"
      role="img"
      aria-label="An open envelope with a verified checkmark and a paper plane flying away"
      className={cn("text-primary", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Clouds */}
      <g fill="currentColor" fillOpacity=".1">
        <path d="M48 128c-11 0-20-9-20-20s9-20 20-20c5-13 17-22 32-22 14 0 27 9 32 22 11 0 20 9 20 20s-9 20-20 20Z" />
        <path d="M330 236c-9 0-16-7-16-16s7-16 16-16c4-10 14-17 25-17 12 0 21 7 25 17 9 0 16 7 16 16s-7 16-16 16Z" />
      </g>

      {/* Sparkles above the letter */}
      <g stroke="currentColor" strokeWidth="7" strokeLinecap="round">
        <path d="M186 52l-9-14" />
        <path d="M220 46V30" />
        <path d="M254 52l9-14" />
      </g>

      {/* Envelope body */}
      <rect
        x="130"
        y="150"
        width="180"
        height="112"
        rx="10"
        fill="currentColor"
        fillOpacity=".28"
      />

      {/* Folded-back side flaps */}
      <path d="M130 150h58l-58 58Z" fill="currentColor" fillOpacity=".9" />
      <path d="M310 150h-58l58 58Z" fill="currentColor" fillOpacity=".9" />

      {/* Letter with verified badge */}
      <rect
        x="163"
        y="82"
        width="114"
        height="130"
        rx="10"
        className="fill-card"
        stroke="currentColor"
        strokeOpacity=".12"
        strokeWidth="2"
      />
      <circle cx="220" cy="134" r="27" fill="currentColor" />
      <path
        d="M208 134l9 9 17-18"
        className="stroke-primary-foreground"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Front flap */}
      <path d="M131 260l89-72 89 72Z" fill="currentColor" fillOpacity=".45" />

      {/* Dashed flight path */}
      <path
        d="M262 148c26-6 16-34 40-40 18-4 16-20 4-20-11 0-12 14 1 17 15 3 29-6 39-17"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="6 9"
      />

      {/* Paper plane */}
      <path d="M336 58l68-24-46 50-8-26Z" fill="currentColor" />
      <path
        d="M358 84L404 34L350 66Z"
        fill="currentColor"
        fillOpacity=".5"
      />
    </svg>
  );
}
