import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import ExpandableFeatureList from "./ExpandableFeatureList";

const GetStartedSection = () => {
  return (
    <section className="w-full py-20 px-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="relative">
          {/* Background overlay with image */}
          <div 
            className="absolute inset-0 bg-[#0D0D0D] opacity-90 outline outline-1 outline-[#252525] outline-offset-[-1px]"
            style={{
              backgroundImage: 'url(/images/1dentist-smiling.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          
          {/* Content */}
          <div className="relative flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 lg:gap-12 p-6 lg:p-10 min-h-[600px] lg:min-h-[500px]">
            {/* Right side - White card (now takes full width on mobile) */}
            <div className="w-full max-w-md lg:w-[420px] lg:max-w-none bg-white rounded-xl p-6 py-[42px] lg:self-center flex-shrink-0 lg:ml-auto">
              <motion.h2 
                className="text-[#09090B] text-2xl lg:text-[27px] font-bold leading-tight lg:leading-[44px] mb-6 w-full"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                Vaš put ka digitalnoj ordinaciji počinje danas
              </motion.h2>
              
              <Button className="bg-white text-[#0D0D0D] text-sm font-medium border border-gray-200 hover:bg-gray-50 px-5 py-3 mb-8 transition-colors duration-200" style={{borderRadius: '8px'}}>
                Započni besplatno
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <div className="mt-6">
                <ExpandableFeatureList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetStartedSection;
