
'use client';

import { motion } from "framer-motion";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";

const DashboardSection = () => {
  return (
    <section className="w-full py-12 px-6 relative overflow-visible">
      <div className="max-w-screen-xl mx-auto">
        {/* Gradient background image */}
        <div 
          className="absolute inset-0 w-full h-full -mb-[200px]"
          style={{
            backgroundImage: 'url(/images/a6d750ce-ddca-401d-8a91-2077ddd4bb92.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        <div className="relative">
          <div className="text-center mb-8">
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              Kompletan pregled rada ordinacije, u realnom vremenu.
            </motion.p>
          </div>
          <div className="bg-card shadow-2xl overflow-hidden border border-border rounded-3xl relative">
            {/* Animated Grid Pattern behind dashboard image */}
            <div className="absolute inset-0 pointer-events-none">
              <AnimatedGridPattern
                numSquares={12}
                maxOpacity={0.06}
                duration={15}
                repeatDelay={8}
                width={100}
                height={100}
                className={cn(
                  "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
                  "opacity-40",
                )}
              />
            </div>
            <img 
              alt="Odontoa dashboard pregled ordinacije u realnom vremenu" 
              className="w-full h-auto object-cover object-top relative z-10" 
              src="/images/odontoa dashboard.png"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;
