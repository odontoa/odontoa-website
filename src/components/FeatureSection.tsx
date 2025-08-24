
'use client';

import { Badge } from "./ui/badge";
import { AnimatedGridPattern } from "./ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import {
  FolderOpen,
  Calendar,
  FileText,
  Receipt,
  Package,
  BarChart3
} from "lucide-react";

const FeatureSection = () => {
  const features = [
    {
      title: "Digitalni kartoni pacijenata",
      description: "Brz pristup istoriji pregleda, terapijama, fotografijama i RTG snimcima – bez traženja po fasciklama.",
      icon: FolderOpen,
      image: "/images/digitalni-karton-pacijenta.png"
    },
    {
      title: "Zakazivanje i podsetnici",
      description: "Pametno upravljanje terminima uz automatske SMS i Email podsetnike pacijentima.",
      icon: Calendar,
      image: "/images/zakzaivanje termina.png"
    },
    {
      title: "Radni nalozi za tehničare",
      description: "Kreirajte naloge za krunice, proteze i druge radove i pošaljite ih tehničaru u jednom kliku.",
      icon: FileText,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=800&fit=crop&crop=center&q=90"
    },
    {
      title: "Fakture i predračuni",
      description: "Generišite profesionalne fakture i predračune direktno iz kartona pacijenta.",
      icon: Receipt,
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=800&fit=crop&crop=center&q=90"
    },
    {
      title: "Upravljanje zalihama",
      description: "Pratite stanje potrošnog materijala i dobijajte obaveštenja kada nešto ponestaje.",
      icon: Package,
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1200&h=800&fit=crop&crop=center&q=90",
      comingSoon: true
    },
    {
      title: "Statistika i analitika",
      description: "Vidite koliko ste zaradili ovaj mesec. Jednostavne tabele pokazuju koliko novca ulazi, ko duguje, koje usluge se najviše traže.",
      icon: BarChart3,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&crop=center&q=90"
    }
  ];

  return (
    <div className="w-full py-20 lg:py-40 relative">
      {/* Animated Grid Pattern Background */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatedGridPattern
          numSquares={25}
          maxOpacity={0.025}
          duration={10}
          repeatDelay={4}
          width={70}
          height={70}
          className={cn(
            "[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]",
            "opacity-30",
          )}
        />
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col gap-10">
          <div className="flex gap-4 flex-col items-start">
            <div>
              <Badge>Funkcionalnosti</Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-normal text-left">
                Glavne funkcionalnosti
              </h2>
              <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground text-left">
                Od prvog zakazivanja do završnog računa – Odontoa povezuje sve procese u vašoj ordinaciji i štedi vreme timu.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <div className="bg-muted rounded-md aspect-video mb-2 overflow-hidden flex items-center justify-center">
                  {feature.image ? (
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-contain bg-gray-100"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        // Ako slika ne učita, prikaži placeholder
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`bg-muted rounded-md aspect-video ${feature.image ? 'hidden' : ''}`}></div>
                </div>
                <h3 className="text-xl tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
