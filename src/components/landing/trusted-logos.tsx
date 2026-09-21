import { trustedBrands as brands } from "@/data/landing";

export function TrustedLogos() {
  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-4 py-12 md:px-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Trusted by thousands
          </h2>
          <p className="text-sm text-muted-foreground">
            People around the world trust Vaultly to protect what matters.
          </p>
        </div>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 text-muted-foreground/70">
          {brands.map((brand) => (
            <li
              key={brand.name}
              className="flex items-center gap-2 font-heading text-lg font-semibold"
            >
              <brand.icon />
              {brand.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
