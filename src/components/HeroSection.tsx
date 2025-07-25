import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className="w-full pt-32 pb-20 px-6">
      <div className="max-w-screen-xl mx-auto">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
            variants={itemVariants}
          >
            Digitalizujte vašu ordinaciju.
          </motion.h1>
          
          <motion.p 
            className="text-xl text-[#a1a1aa] mb-8 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Jedna aplikacija za zakazivanje, tim, kartone i zalihe – za stomatologe i ortodonte.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            variants={itemVariants}
          >
            <Button size="lg" className="bg-[#1565C0] text-white hover:bg-[#0D47A1] px-8 py-4 shadow-sm transition-colors duration-200" style={{borderRadius: '8px'}}>
              Započni besplatno
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button size="lg" className="bg-white text-slate-950 hover:bg-[#4a9489] hover:text-white hover:border-[#4a9489] shadow-sm border border-slate-300 px-8 py-4 transition-colors duration-200" style={{borderRadius: '8px'}}>
              <Zap className="mr-2 h-4 w-4" />
              Zakaži demo
            </Button>
          </motion.div>

          <motion.div
            className="flex items-center justify-center text-[#a1a1aa] text-sm"
            variants={itemVariants}
          >
            <Shield className="w-4 h-4 mr-2 text-[#1565C0]" />
            <span>Koristi ga 40+ ordinacija u Srbiji</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
