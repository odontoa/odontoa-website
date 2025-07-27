
'use client';

import { motion } from "framer-motion";
import CountUp from "react-countup";
import { ArrowRight, Calendar, Bell, TrendingUp } from "lucide-react";

const MetricsSection = () => {
  const metrics = [
    {
      icon: Calendar,
      number: 95,
      suffix: "%",
      description: "popunjenost termina uz pametno zakazivanje"
    },
    {
      icon: Bell,
      number: 85,
      suffix: "%",
      description: "pacijenata dolazi na vreme uz automatske podsetnike"
    },
    {
      icon: TrendingUp,
      number: 40,
      suffix: "%",
      description: "veći mesečni prihod kroz optimizaciju rasporeda"
    }
  ];

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
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className="w-full py-16 px-6">
      <div className="max-w-screen-xl mx-auto">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {metrics.map((metric, index) => (
            <motion.div 
              key={index} 
              className="text-center relative"
              variants={itemVariants}
            >
              <div className="flex flex-col items-center">
                <metric.icon className="w-8 h-8 text-[#4a9489] mb-4" />
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  <CountUp
                    end={metric.number}
                    duration={2.5}
                    separator=","
                    suffix={metric.suffix}
                    enableScrollSpy
                    scrollSpyOnce
                  />
                </h2>
                <p className="text-[#a1a1aa] text-sm leading-relaxed max-w-xs mx-auto">
                  {metric.description}
                </p>
              </div>
              {index < metrics.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-6 h-6 text-[#4a9489]" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default MetricsSection;
