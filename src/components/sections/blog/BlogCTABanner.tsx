import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function BlogCTABanner() {
  return (
    <section className="w-full py-16 md:py-20 bg-background">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Image */}
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full min-h-[300px]">
              <Image
                src="/images/odontoa dashboard.png"
                alt="Odontoa dashboard - digitalna ordinacija"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority={false}
              />
            </div>

            {/* Right Column - Content */}
            <div className="p-8 lg:p-12 flex flex-col gap-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-foreground">
                Uvedite red u ordinaciju bez komplikacija.
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Kartoni, zakazivanje, zalihe i tim na jednom mestu. Pogledajte kako izgleda u praksi.
              </p>
              <div className="mt-4">
                <Button
                  asChild
                  variant="pillPrimary"
                  size="pill"
                >
                  <Link href="/kontakt">
                    Zakaži demo
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
