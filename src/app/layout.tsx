import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

import { Toaster } from "@/components/ui/toast";

const geistHeading = Geist({ subsets: ["latin"], variable: "--font-heading" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vaultly — Keep your digital life safe and simple",
  description:
    "Store your passwords, notes, files, and more in one secure place. Accessible anytime, anywhere. Free and open source.",
};

// Applies the stored theme before first paint to avoid a dark-mode flash
// (rendering-hydration-no-flicker).
const themeInitScript = `
try{
  const t = localStorage.getItem("theme");
  const dark = t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", dark);
}catch{}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/* Blocking inline script: restores the saved theme before first
            paint so dark-mode users never see a light flash. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={cn(
          "min-h-full flex flex-col font-mono antialiased",
          geistSans.variable,
          geistMono.variable,
          geistHeading.variable,
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
