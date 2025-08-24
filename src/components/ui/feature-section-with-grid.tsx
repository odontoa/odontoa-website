import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  FolderOpen,
  Calendar,
  FileText,
  Receipt,
  Package,
  BarChart3
} from "lucide-react";

const features = [
  {
    title: "Digitalni kartoni pacijenata",
    description: "Brz pristup istoriji pregleda, terapijama, fotografijama i RTG snimcima – bez traženja po fasciklama.",
    icon: FolderOpen,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop&crop=center"
  },
  {
    title: "Zakazivanje i podsetnici",
    description: "Pametno upravljanje terminima uz automatske SMS i Email podsetnike pacijentima.",
    icon: Calendar,
    image: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=800&h=600&fit=crop&crop=center"
  },
  {
    title: "Radni nalozi za tehničare",
    description: "Kreirajte naloge za krunice, proteze i druge radove i pošaljite ih tehničaru u jednom kliku.",
    icon: FileText,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=center"
  },
  {
    title: "Fakture i predračuni",
    description: "Generišite profesionalne fakture i predračune direktno iz kartona pacijenta.",
    icon: Receipt,
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop&crop=center"
  },
  {
    title: "Upravljanje zalihama",
    description: "Pratite stanje potrošnog materijala i dobijajte obaveštenja kada nešto ponestaje.",
    icon: Package,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=600&fit=crop&crop=center",
    comingSoon: true
  },
  {
    title: "Statistika i analitika",
    description: "Vidite koliko ste zaradili ovaj mesec. Jednostavne tabele pokazuju koliko novca ulazi, ko duguje, koje usluge se najviše traže.",
    icon: BarChart3,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center"
  }
];

function Feature() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <motion.div 
            className="flex gap-4 flex-col items-start"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <Badge variant="secondary">Funkcionalnosti</Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-normal text-left text-foreground">
                Glavne funkcionalnosti
              </h2>
              <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground text-left">
                Od prvog zakazivanja do završnog računa – Odontoa povezuje sve procese u vašoj ordinaciji i štedi vreme timu.
              </p>
            </div>
          </motion.div>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                className="flex flex-col gap-2 group"
                variants={itemVariants}
              >
                <div className="relative bg-muted rounded-md aspect-video mb-2 overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-3 left-3 p-2 bg-background/80 backdrop-blur-sm rounded-lg">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  {feature.comingSoon && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="outline" className="bg-orange-400/20 text-orange-300 border-orange-400/30">
                        Uskoro stiže!
                      </Badge>
                    </div>
                  )}
                </div>
                <h3 className="text-xl tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export { Feature }; 