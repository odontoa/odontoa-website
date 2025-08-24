'use client';

import { GlowCard } from "@/components/ui/spotlight-card";
import { User, Users, Building2 } from "lucide-react";

export function SpotlightCardTest() {
  const testCards = [
    {
      icon: User,
      title: "Samostalni stomatolozi",
      description: "Vi radite sa pacijentima, Odontoa brine o ostalom.",
      glowColor: 'green' as const
    },
    {
      icon: Users,
      title: "Ortodonti i specijalisti", 
      description: "Tretmani traju i do 3 godine – Odontoa šalje mesečne podsetnike.",
      glowColor: 'blue' as const
    },
    {
      icon: Building2,
      title: "Veće ordinacije",
      description: "Na jednom ekranu raspored svih doktora.",
      glowColor: 'purple' as const
    }
  ];

  return (
    <div className="section-spacing w-full px-6 bg-black">
      <div className="max-w-screen-xl mx-auto">
        <div className="bg-black/40 backdrop-blur-sm rounded-3xl p-12 shadow-sm border border-gray-200">
          
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 border border-white/20 rounded-lg mb-6">
              <span className="text-white text-sm font-medium">Test Spotlight Cards</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-normal text-white mb-6 leading-tight">
              Spotlight Card Demo
            </h2>
            <p className="text-white/80 text-xl max-w-3xl mx-auto leading-relaxed">
              Move your mouse around to see the spotlight effect!
            </p>
          </div>
          
          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testCards.map((card, index) => (
              <div key={index} className="group relative">
                <GlowCard 
                  glowColor={card.glowColor}
                  customSize={true}
                  className="w-full h-full min-h-[400px] bg-black/20 backdrop-blur-sm rounded-xl"
                >
                  <div className="relative flex flex-col items-center text-center h-full justify-center p-6">
                    {/* Icon container */}
                    <div className="relative p-5 bg-white/10 rounded-xl mb-8 group-hover:bg-white/20 transition-all duration-500 group-hover:scale-110 backdrop-blur-sm">
                      <card.icon className="relative w-10 h-10 text-white drop-shadow-lg" />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-white/90 transition-colors duration-300 leading-tight">
                      {card.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-white/80 leading-relaxed text-base group-hover:text-white/90 transition-colors duration-300">
                      {card.description}
                    </p>
                  </div>
                </GlowCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 