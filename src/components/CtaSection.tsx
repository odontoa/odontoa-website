import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const CtaSection = () => {
  return <section className="w-full py-20 px-6 bg-black">
      <div className="max-w-6xl mx-auto bg-white relative overflow-hidden px-8 py-[65px]">
        {/* Decorative borders */}
        <div className="absolute inset-y-0 left-0 w-px bg-[#E7E7E7]"></div>
        <div className="absolute inset-y-0 right-0 w-px bg-[#E7E7E7]"></div>
        
        {/* Corner dots */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-transparent"></div>
        <div className="absolute -top-2 -right-2 w-4 h-4 border border-[#D9D9D9] rounded-full bg-white"></div>
        
        {/* Content */}
        <div className="text-center py-8">
          <motion.h2 
            className="text-4xl font-bold text-[#09090B] mb-4 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            Zakažite besplatan demo sa našim timom.
          </motion.h2>
          <motion.p 
            className="text-lg text-[#717179] font-medium mb-8 max-w-md mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Pokazaćemo vam kako Odontoa može da digitalizuje vašu ordinaciju u manje od 30 minuta.
          </motion.p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="bg-[#1565C0] text-white hover:bg-[#0D47A1] px-8 py-3 text-sm font-medium transition-colors duration-200" style={{borderRadius: '8px'}}>
              Započni besplatno
            </Button>
            <Button className="bg-[#4a9489] text-white hover:bg-[#3a7a6f] px-8 py-3 text-sm font-medium transition-colors duration-200" style={{borderRadius: '8px'}}>
              Zakaži demo
            </Button>
          </div>
        </div>
        
        {/* Decorative cards */}
        <div className="absolute left-4 lg:left-20 bottom-4 w-32 h-14 border-2 border-[#D9D9D9] rounded-xl opacity-50 hidden sm:block">
          <div className="p-4 flex flex-col gap-1">
            <div className="w-8 h-1 bg-[#1B1B1B] opacity-15 rounded"></div>
            <div className="w-18 h-1 bg-[#727272] opacity-10 rounded"></div>
          </div>
        </div>
        
        <div className="absolute right-4 lg:right-20 top-4 w-32 h-14 border-2 border-[#D9D9D9] rounded-xl opacity-50 hidden sm:block">
          <div className="p-4 flex flex-col gap-1">
            <div className="w-8 h-1 bg-[#1B1B1B] opacity-15 rounded"></div>
            <div className="w-18 h-1 bg-[#727272] opacity-10 rounded"></div>
          </div>
        </div>
      </div>
    </section>;
};

export default CtaSection;
