import { SiteHeader } from "@/components/landing/site-header";
import { Hero } from "@/components/landing/hero";
import { TrustedLogos } from "@/components/landing/trusted-logos";
import { Features } from "@/components/landing/features";
import { Security } from "@/components/landing/security";
import { Testimonials } from "@/components/landing/testimonials";
import { CallToAction } from "@/components/landing/cta";
import { Faq } from "@/components/landing/faq";
import { SiteFooter } from "@/components/landing/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <TrustedLogos />
        <Features />
        <Security />
        <Testimonials />
        <CallToAction />
        <Faq />
      </main>
      <SiteFooter />
    </>
  );
}
