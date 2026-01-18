import Image from "next/image";
import Link from "next/link";
import { ArrowRightCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BlogHero() {
  return (
    <section className="w-full border-b bg-gradient-to-b from-slate-50 via-white to-sky-50/40 py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:gap-16 lg:grid-cols-2 items-center">
          {/* Left: text + buttons */}
          <div className="flex flex-col gap-6 max-w-xl">
            {/* Label */}
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400 mb-2">
              Odontoa blog
            </p>

            {/* H1 */}
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight text-foreground">
              Digitalni vodič kroz organizaciju vaše ordinacije
            </h1>

            {/* Paragraph */}
            <p className="text-base md:text-lg text-slate-600 max-w-lg leading-relaxed">
              Praktični saveti, studije slučaja i vodiči za digitalizaciju kartona pacijenata,
              zakazivanje, zalihe i timski rad – iz perspektive svakodnevnog života u ordinaciji.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                asChild
                size="lg"
                variant="default"
                className="gap-2 shadow-sm w-full sm:w-auto text-white"
              >
                <Link href="#latest-posts">
                  Pogledaj najnovije članke
                  <ArrowRightCircle className="w-4 h-4" />
                </Link>
              </Button>
              
              <Button
                asChild
                size="lg"
                variant="outline"
                className="gap-2 w-full sm:w-auto"
              >
                <Link href="/o-nama">
                  Saznaj više o Odontoa
                  <BookOpen className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: image */}
          <div className="relative w-full max-w-xl ml-auto">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-100 bg-slate-100 shadow-[0_24px_80px_rgba(15,23,42,0.12)] transition-transform duration-300 hover:scale-[1.01]">
              <Image
                src="/images/blog-cover-new.png"
                alt="Stomatolog radi u digitalnoj ordinaciji"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 500px, 100vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


