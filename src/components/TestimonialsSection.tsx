'use client';

import { motion } from "framer-motion";
import { TestimonialsSection as TestimonialsMarquee } from "@/components/ui/testimonials-with-marquee";

const TestimonialsSection = () => {
  const testimonials = [
    {
      author: {
        name: "Dr Marija Stojanović",
        handle: "Porodični stomatolog • Ordinacija 'Svetlost', Kragujevac",
        avatar: "https://images.unsplash.com/photo-1594824475545-9d0c7c4951c1?w=150&h=150&fit=crop&crop=face"
      },
      text: "Imam svoju ordinaciju 12 godina i oduvek sam mrzela da vodim papire - kartone, zakazivanja, telefon. Odontoa mi je vratila mir u poslu. Sada mogu kafu da popijem između pacijenata umesto da tražim karton po celoj ordinaciji."
    },
    {
      author: {
        name: "Dr Petar Milenković",
        handle: "Stomatolog • Ordinacija 'Milenković', Beograd",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      },
      text: "Radio sam sa sestrom koja je vodila sve termine u velikoj svesci. Kad je otišla u penziju, osećao sam se izgubljeno. Odontoa je bila spas. Za nedelju dana sam shvatio kako funkcioniše. Sada radim sam i imam više pacijenata nego ranije sa sestrom."
    },
    {
      author: {
        name: "Dr Ana Ristić",
        handle: "Ortodont • Ordinacija 'Ortodont', Novi Sad",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
      },
      text: "Sa ortodoncijom radiš sa istim detetom 2-3 godine. Problem je što roditelji zaborave da dođu na mesečne kontrole. Program sam pozove roditelje kada treba da dođu. Od kako koristim Odontoa, nijedna deca ne prekidaju lečenje zbog zaborava."
    },
    {
      author: {
        name: "Dr Miloš Janković",
        handle: "Stomatolog • Ordinacija 'Janković', Valjevo",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      text: "Imam malu ordinaciju, 25-30 pacijenata dnevno. Žena mi pomaže oko zakazivanja, ali grešimo - zakažemo dva pacijenta u isto vreme ili zaboravimo da pozovemo nekoga. Otkad koristimo Odontoa, nema više grešaka."
    }
  ];

  return (
    <section className="section-spacing">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <TestimonialsMarquee
          title="Šta kažu naši korisnici?"
          description="Stomatolozi iz regiona već koriste Odontoa da pojednostave svoj posao i posvete se onome što je najvažnije - pacijentima."
          testimonials={testimonials}
          className="bg-background text-foreground font-sans"
        />
      </motion.div>
    </section>
  );
};

export default TestimonialsSection; 