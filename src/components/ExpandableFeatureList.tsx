import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const ExpandableFeatureList = () => {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const toggleItem = (itemId: string) => {
    setOpenItem(prev => prev === itemId ? null : itemId);
  };

  const features = [
    {
      id: "create-profile",
      title: "Kreirajte profil ordinacije",
      description: "",
      expandedContent: "Unesimo osnovne informacije o vašoj ordinaciji - adresu, kontakt podatke i specijalizacije. Potrebno je manje od 5 minuta."
    },
    {
      id: "add-doctors-patients",
      title: "Dodajte doktore i pacijente",
      description: "",
      expandedContent: "Uvezite postojeće kartone pacijenata ili počnite ispočetka. Dodajte člane tima sa odgovarajućim pristupima sistemu."
    },
    {
      id: "start-booking",
      title: "Počnite da zakazujete, beležite i pratite svaki tretman",
      description: "",
      expandedContent: "Sistem je spreman za rad! Zakazujte termine, evidentirajte tretmane i pratite uspeh ordinacije u realnom vremenu."
    }
  ];

  return <div className="flex flex-col gap-3">
      {features.map((feature, index) => <div key={feature.id}>
          <Collapsible open={openItem === feature.id} onOpenChange={() => toggleItem(feature.id)}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between gap-3 cursor-pointer">
                <div className="text-left flex-1">
                  <div className="text-[#09090B] text-xl font-medium leading-[26px]">
                    {feature.title}
                  </div>
                  {feature.description}
                </div>
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-2">
              <div className="text-[#717179] text-sm font-normal leading-[18.2px]">
                {feature.expandedContent}
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          {index < features.length - 1 && <div className="h-px bg-[#52525A] opacity-20 my-3" />}
        </div>)}
    </div>;
};

export default ExpandableFeatureList;
