'use client';

import { motion } from "framer-motion";
import { User, Users, Building2 } from "lucide-react";
import { GlowCard } from "@/components/ui/spotlight-card";
import Navigation from "@/components/Navigation";

const TargetAudienceSection = () => {
  const audiences = [
    {
      icon: User,
      title: "Samostalni stomatolozi",
      description: "Vi radite sa pacijentima, Odontoa brine o ostalom. Automatski podsetnici i digitalni kartoni uvek su pri ruci.",
      glowColor: 'green' as const
    },
    {
      icon: Users,
      title: "Ortodonti i specijalisti",
      description: "Tretmani traju i do 3 godine – Odontoa šalje mesečne podsetnike, čuva slike i beleške o napretku. Vi radite terapiju, aplikacija vodi evidenciju.",
      glowColor: 'blue' as const
    },
    {
      icon: Building2,
      title: "Veće ordinacije",
      description: "Na jednom ekranu raspored svih doktora. Sestra zakazuje bez poziva i provera. Nema preklapanja ni praznih termina.",
      glowColor: 'purple' as const
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
    <section className="w-full py-24 px-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="bg-background/50 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-border">
          
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-muted border border-border rounded-full mb-6">
              <span className="text-foreground text-sm font-medium">Ciljna grupa</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-normal text-foreground mb-6">
              Za koga je Odontoa?
            </h2>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
              Prilagodili smo platformu tako da odgovara različitim tipovima ordinacija – od solo prakse do velikih timova.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {audiences.map((audience, index) => (
              <motion.div 
                key={index} 
                className="group relative"
                variants={itemVariants}
              >
                <GlowCard 
                  glowColor={audience.glowColor}
                  customSize={true}
                  className="w-full h-full min-h-[400px] bg-background/20 backdrop-blur-sm"
                >
                  <div className="relative flex flex-col items-center text-center h-full justify-center p-6">
                    <div className="relative p-5 bg-muted rounded-2xl mb-8 group-hover:bg-muted/80 transition-all duration-500 group-hover:scale-110 backdrop-blur-sm">
                      <audience.icon className="relative w-10 h-10 text-primary drop-shadow-lg" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-foreground mb-6 group-hover:text-foreground/90 transition-colors duration-300">
                      {audience.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed text-base group-hover:text-muted-foreground/90 transition-colors duration-300">
                      {audience.description}
                    </p>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Opcija 1 - Svetloplava pozadina
const TargetAudienceSectionVariant1 = () => {
  const audiences = [
    {
      icon: User,
      title: "Samostalni stomatolozi",
      description: "Vi radite sa pacijentima, Odontoa brine o ostalom. Automatski podsetnici i digitalni kartoni uvek su pri ruci.",
      glowColor: 'green' as const
    },
    {
      icon: Users,
      title: "Ortodonti i specijalisti",
      description: "Tretmani traju i do 3 godine – Odontoa šalje mesečne podsetnike, čuva slike i beleške o napretku. Vi radite terapiju, aplikacija vodi evidenciju.",
      glowColor: 'blue' as const
    },
    {
      icon: Building2,
      title: "Veće ordinacije",
      description: "Na jednom ekranu raspored svih doktora. Sestra zakazuje bez poziva i provera. Nema preklapanja ni praznih termina.",
      glowColor: 'purple' as const
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
    <section className="w-full py-24 px-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="bg-[#EFF6FF] rounded-3xl p-12 shadow-2xl border border-[#DBEAFE]">
          
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-white border border-[#DBEAFE] rounded-full mb-6 shadow-sm">
              <span className="text-[#1E40AF] text-sm font-medium">Ciljna grupa</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-normal text-[#1E3A8A] mb-6">
              Za koga je Odontoa?
            </h2>
            <p className="text-[#374151] text-xl max-w-3xl mx-auto leading-relaxed">
              Prilagodili smo platformu tako da odgovara različitim tipovima ordinacija – od solo prakse do velikih timova.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {audiences.map((audience, index) => (
              <motion.div 
                key={index} 
                className="group relative"
                variants={itemVariants}
              >
                <div className="w-full h-full min-h-[400px] bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 group-hover:scale-105">
                  <div className="relative flex flex-col items-center text-center h-full justify-center p-6">
                    <div className="relative p-5 bg-[#F0F9FF] rounded-2xl mb-8 group-hover:bg-[#E0F2FE] transition-all duration-500 group-hover:scale-110">
                      <audience.icon className="relative w-10 h-10 text-[#0284C7] drop-shadow-lg" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-[#1E3A8A] mb-6 group-hover:text-[#1E40AF] transition-colors duration-300">
                      {audience.title}
                    </h3>
                    
                    <p className="text-[#374151] leading-relaxed text-base group-hover:text-[#4B5563] transition-colors duration-300">
                      {audience.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Opcija 2 - Bela pozadina sa tankim obojenim borderima
const TargetAudienceSectionVariant2 = () => {
  const audiences = [
    {
      icon: User,
      title: "Samostalni stomatolozi",
      description: "Vi radite sa pacijentima, Odontoa brine o ostalom. Automatski podsetnici i digitalni kartoni uvek su pri ruci.",
      borderColor: 'border-[#0284C7]',
      hoverBg: 'hover:bg-[#F0F9FF]'
    },
    {
      icon: Users,
      title: "Ortodonti i specijalisti",
      description: "Tretmani traju i do 3 godine – Odontoa šalje mesečne podsetnike, čuva slike i beleške o napretku. Vi radite terapiju, aplikacija vodi evidenciju.",
      borderColor: 'border-[#10B981]',
      hoverBg: 'hover:bg-[#F0FDF4]'
    },
    {
      icon: Building2,
      title: "Veće ordinacije",
      description: "Na jednom ekranu raspored svih doktora. Sestra zakazuje bez poziva i provera. Nema preklapanja ni praznih termina.",
      borderColor: 'border-[#F59E0B]',
      hoverBg: 'hover:bg-[#FFFBEB]'
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
    <section className="w-full py-24 px-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="bg-white rounded-3xl p-12 shadow-2xl border border-[#E5E7EB]">
          
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full mb-6">
              <span className="text-[#374151] text-sm font-medium">Ciljna grupa</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-normal text-[#111827] mb-6">
              Za koga je Odontoa?
            </h2>
            <p className="text-[#6B7280] text-xl max-w-3xl mx-auto leading-relaxed">
              Prilagodili smo platformu tako da odgovara različitim tipovima ordinacija – od solo prakse do velikih timova.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {audiences.map((audience, index) => (
              <motion.div 
                key={index} 
                className="group relative"
                variants={itemVariants}
              >
                <div className={`w-full h-full min-h-[400px] bg-white rounded-2xl border-2 ${audience.borderColor} shadow-sm ${audience.hoverBg} transition-all duration-500 group-hover:scale-105 group-hover:shadow-lg`}>
                  <div className="relative flex flex-col items-center text-center h-full justify-center p-6">
                    <div className="relative p-5 bg-[#F9FAFB] rounded-2xl mb-8 group-hover:bg-[#F3F4F6] transition-all duration-500 group-hover:scale-110">
                      <audience.icon className="relative w-10 h-10 text-[#374151] drop-shadow-lg" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-[#111827] mb-6 group-hover:text-[#1F2937] transition-colors duration-300">
                      {audience.title}
                    </h3>
                    
                    <p className="text-[#6B7280] leading-relaxed text-base group-hover:text-[#4B5563] transition-colors duration-300">
                      {audience.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Opcija 3 - Gradient pozadina za ceo box
const TargetAudienceSectionVariant3 = () => {
  const audiences = [
    {
      icon: User,
      title: "Samostalni stomatolozi",
      description: "Vi radite sa pacijentima, Odontoa brine o ostalom. Automatski podsetnici i digitalni kartoni uvek su pri ruci.",
      iconBg: 'bg-[#0284C7]'
    },
    {
      icon: Users,
      title: "Ortodonti i specijalisti",
      description: "Tretmani traju i do 3 godine – Odontoa šalje mesečne podsetnike, čuva slike i beleške o napretku. Vi radite terapiju, aplikacija vodi evidenciju.",
      iconBg: 'bg-[#10B981]'
    },
    {
      icon: Building2,
      title: "Veće ordinacije",
      description: "Na jednom ekranu raspored svih doktora. Sestra zakazuje bez poziva i provera. Nema preklapanja ni praznih termina.",
      iconBg: 'bg-[#F59E0B]'
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
    <section className="w-full py-24 px-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="bg-gradient-to-r from-[#F9FAFB] via-[#EFF6FF] to-[#ECFDF5] rounded-3xl p-12 shadow-2xl border border-[#E5E7EB]">
          
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-[#E5E7EB] rounded-full mb-6 shadow-sm">
              <span className="text-[#374151] text-sm font-medium">Ciljna grupa</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-normal text-[#111827] mb-6">
              Za koga je Odontoa?
            </h2>
            <p className="text-[#6B7280] text-xl max-w-3xl mx-auto leading-relaxed">
              Prilagodili smo platformu tako da odgovara različitim tipovima ordinacija – od solo prakse do velikih timova.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {audiences.map((audience, index) => (
              <motion.div 
                key={index} 
                className="group relative"
                variants={itemVariants}
              >
                <div className="w-full h-full min-h-[400px] bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 group-hover:scale-105">
                  <div className="relative flex flex-col items-center text-center h-full justify-center p-6">
                    <div className={`relative p-5 ${audience.iconBg} rounded-full mb-8 group-hover:scale-110 transition-all duration-500 shadow-lg`}>
                      <audience.icon className="relative w-10 h-10 text-white drop-shadow-lg" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-[#111827] mb-6 group-hover:text-[#1F2937] transition-colors duration-300">
                      {audience.title}
                    </h3>
                    
                    <p className="text-[#6B7280] leading-relaxed text-base group-hover:text-[#4B5563] transition-colors duration-300">
                      {audience.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const DesignVariantsPage = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="pt-16">
        <div className="max-w-screen-xl mx-auto px-6 py-12">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-normal text-white mb-6">
              Dizajn Varijante
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Istražite različite pristupe dizajnu za TargetAudienceSection komponentu
            </p>
          </div>
        </div>

        {/* Original Variant */}
        <div className="mb-20">
          <div className="max-w-screen-xl mx-auto px-6 mb-8">
            <h2 className="text-3xl font-normal text-white mb-4">Originalna Varijanta</h2>
            <p className="text-gray-300">Trenutni dizajn sa tamnom pozadinom i glow efektima</p>
          </div>
          <TargetAudienceSection />
        </div>

        {/* Variant 1 - Svetloplava pozadina */}
        <div className="mb-20">
          <div className="max-w-screen-xl mx-auto px-6 mb-8">
            <h2 className="text-3xl font-normal text-white mb-4">Opcija 1 – Svetloplava pozadina</h2>
            <p className="text-gray-300">Svetloplava pozadina (#EFF6FF) sa belim karticama i plavim ikonicama</p>
          </div>
          <TargetAudienceSectionVariant1 />
        </div>

        {/* Variant 2 - Bela pozadina sa tankim obojenim borderima */}
        <div className="mb-20">
          <div className="max-w-screen-xl mx-auto px-6 mb-8">
            <h2 className="text-3xl font-normal text-white mb-4">Opcija 2 – Bela pozadina sa tankim obojenim borderima</h2>
            <p className="text-gray-300">Bela pozadina sa karticama koje imaju obojene bordere i hover efekte</p>
          </div>
          <TargetAudienceSectionVariant2 />
        </div>

        {/* Variant 3 - Gradient pozadina */}
        <div className="mb-20">
          <div className="max-w-screen-xl mx-auto px-6 mb-8">
            <h2 className="text-3xl font-normal text-white mb-4">Opcija 3 – Gradient pozadina</h2>
            <p className="text-gray-300">Gradient pozadina (sivo–plava–zelena) sa obojenim kružićima za ikone</p>
          </div>
          <TargetAudienceSectionVariant3 />
        </div>
      </div>
    </div>
  );
};

export default DesignVariantsPage; 