import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

function Hero() {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col gap-8 items-center text-center">
          <div className="flex gap-4 flex-col max-w-4xl">
            <motion.div 
              className="flex gap-4 flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <motion.h1 
                className="text-5xl md:text-7xl max-w-4xl tracking-tighter font-regular"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                Zašto postoji Odontoa?
              </motion.h1>
              <motion.p 
                className="text-xl leading-relaxed tracking-tight text-muted-foreground max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Od digitalnog kalendara do sigurnog vođenja kartona – razvili smo platformu koja stomatolozima štedi vreme i donosi više fokusa na pacijente.
              </motion.p>
            </motion.div>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-foreground/10 rounded-lg border p-0.5">
                <Button size="lg" className="rounded-lg px-5 py-3 text-base text-white h-auto w-full">
                  Zakaži poziv <PhoneCall className="ml-2 h-4 w-4 text-white" />
                </Button>
              </div>
              <Button size="lg" variant="outline" className="rounded-xl px-5 h-12">
                Prijavi se ovde <MoveRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
          
          <motion.div 
            className="w-full max-w-5xl"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="bg-muted rounded-xl overflow-hidden shadow-2xl">
              <img 
                src="/images/kanc-nova-4.png" 
                alt="Moderna Odontoa kancelarija" 
                className="w-full h-auto object-contain"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
