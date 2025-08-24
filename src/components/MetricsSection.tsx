
'use client';

import { motion } from "framer-motion";
import CountUp from "react-countup";
import { ArrowRight, Calendar, Bell, TrendingUp } from "lucide-react";

const MetricsSection = () => {
  const metrics = [
    {
      icon: Calendar,
      number: 180,
      suffix: " minuta dnevno uštede",
      description: "Vreme koje uštedite na telefonskim pozivima i vođenju papirnih kartona"
    },
    {
      icon: Bell,
      number: 3,
      suffix: "x više pacijenata se vraća",
      description: "Jer ih automatski podsetimo na kontrole i čišćenje zuba"
    },
    {
      icon: TrendingUp,
      number: 92,
      suffix: "% manje propuštenih termina",
      description: "Zahvaljujući pametnom SMS/email sistemu podsetnika"
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
        {/* Heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-normal text-foreground mb-4">
            Kompletan pregled rada ordinacije, u realnom vremenu.
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Pratite ključne metrike i vidite kako vaša ordinacija postaje efikasnija svaki dan.
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
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
                <metric.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-3xl md:text-4xl font-normal text-foreground mb-2">
                  <CountUp
                    end={metric.number}
                    duration={2.5}
                    separator=","
                    enableScrollSpy
                    scrollSpyOnce
                  />
                  <span className="text-xl md:text-2xl font-normal">
                    {metric.suffix}
                  </span>
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                  {metric.description}
                </p>
              </div>
              {index < metrics.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-6 h-6 text-primary" />
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
