
import { motion } from "framer-motion";
import { HoverEffect } from "./ui/hover-effect";
import {
  LayoutDashboard,
  LineChart,
  Workflow,
  Users,
  FolderOpen,
  Package
} from "lucide-react";

const FeatureSection = () => {
  const features = [
    {
      title: "Kontrolna tabla",
      description: "Pregled poslovanja u realnom vremenu: zakazivanja, dolasci, prihodi i tim — sve na jednom mestu, bez papira i Excela.",
      link: "#kontrolna-tabla",
      icon: LayoutDashboard
    },
    {
      title: "Analiza tretmana i termina",
      description: "Statistika najčešćih intervencija, trajanja procedura i iskorišćenosti termina — za precizno planiranje.",
      link: "#analize",
      icon: LineChart
    },
    {
      title: "Pametni workflow",
      description: "Automatski podsetnici, zadaci i evidencija zaliha — sistem sam vodi brigu o operativi.",
      link: "#workflow",
      icon: Workflow
    },
    {
      title: "Timska koordinacija",
      description: "Sinhronizovani kalendari i deljene beleške za timski rad bez greške, čak i u više smena.",
      link: "#tim",
      icon: Users
    },
    {
      title: "Digitalni karton pacijenta",
      description: "Sve na dohvat ruke: istorija tretmana, napomene, dokumenti i slike — brzo dostupni i bez papirologije.",
      link: "#karton",
      icon: FolderOpen
    },
    {
      title: "Evidencija zaliha",
      description: "Automatsko praćenje potrošnog materijala uz podsetnike za nabavke. Uvek znaš šta fali i kada naručiti.",
      link: "#zalihe",
      icon: Package
    }
  ];

  return (
    <section className="w-full py-20 px-6">
      <div className="max-w-screen-xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pametan alat za vođenje ordinacije - jednostavno, precizno i bez greške.
          </h1>
          <p className="text-xl text-[#a1a1aa] max-w-2xl mx-auto">
            Odontoa automatizuje vaše dnevne obaveze: zakazivanja, timsku koordinaciju, zalihe i podsetnike. Fokus ostaje na pacijentu, ne na papirologiji.
          </p>
        </motion.div>
        
        <div className="relative">
          <HoverEffect items={features} className="max-w-5xl mx-auto" />
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
