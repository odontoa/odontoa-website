// MKB-10 dental/oral disease codes — sourced from the provided MKB-10 Baza document.
// This is a static dataset; full integration with a REST endpoint is a future TODO.

export type Mkb10Entry = {
  code: string;
  name: string;
};

export const MKB10_DATA: Mkb10Entry[] = [
  // K00 — Poremećaji razvoja i nicanja zuba
  { code: "K00",   name: "Poremećaji razvoja i nicanja zuba" },
  { code: "K00.0", name: "Urođeni nedostatak zuba (Anodontia)" },
  { code: "K00.1", name: "Prekobrojni zubi (Dentes supernumerarii)" },
  { code: "K00.2", name: "Nepravilan oblik i veličina zuba" },
  { code: "K00.3", name: "Šareni zubi (Dentes versicolores)" },
  { code: "K00.4", name: "Poremećaji stvaranja zuba" },
  { code: "K00.5", name: "Nasledne anomalije strukture zuba" },
  { code: "K00.6", name: "Poremećaji nicanja zuba" },
  { code: "K00.7", name: "Sindrom izbijanja zuba" },
  { code: "K00.8", name: "Drugi poremećaji razvoja zuba" },
  { code: "K00.9", name: "Poremećaj razvoja zuba, neoznačen" },

  // K01 — Neiznikao i uklešten zub
  { code: "K01",   name: "Neiznikao zub i uklešten zub" },
  { code: "K01.0", name: "Neiznikao zub (Retentio dentis)" },
  { code: "K01.1", name: "Uklešteni zubi (Impactio dentis)" },

  // K02 — Karijes
  { code: "K02",   name: "Karijes — kvar zuba (Caries dentium)" },
  { code: "K02.0", name: "Karijes gleđi zuba" },
  { code: "K02.1", name: "Karijes dentina zuba" },
  { code: "K02.2", name: "Karijes cementa zuba" },
  { code: "K02.3", name: "Zaustavljen karijes zuba" },
  { code: "K02.4", name: "Kružni karijes zuba (Odontoclasia)" },
  { code: "K02.8", name: "Drugi karijes zuba" },
  { code: "K02.9", name: "Karijes zuba, neoznačen" },

  // K03 — Druge bolesti tvrdih tkiva
  { code: "K03",   name: "Druge bolesti tvrdih tkiva zuba" },
  { code: "K03.0", name: "Trošenje zuba (Attritio dentium)" },
  { code: "K03.1", name: "Izravnanje zuba (Abrasio dentium)" },
  { code: "K03.2", name: "Nagrizanje zuba (Erosio dentium)" },
  { code: "K03.3", name: "Patološka resorpcija zuba" },
  { code: "K03.4", name: "Hipercementoza" },
  { code: "K03.5", name: "Ankiloza zuba" },
  { code: "K03.6", name: "Naslage na zubu (Sedimenta dentis)" },
  { code: "K03.7", name: "Promena boje posle nicanja zuba" },
  { code: "K03.8", name: "Druge označene bolesti tvrdih tkiva zuba" },
  { code: "K03.9", name: "Bolest tvrdih tkiva zuba, neoznačena" },

  // K04 — Bolesti pulpe i periapikalnog tkiva
  { code: "K04",   name: "Bolesti pulpe zuba i tkiva oko vrha zuba" },
  { code: "K04.0", name: "Zapaljenje zubne pulpe (Pulpitis)" },
  { code: "K04.1", name: "Izumiranje zubne pulpe (Necrosis pulpae)" },
  { code: "K04.2", name: "Degeneracija zubne pulpe" },
  { code: "K04.3", name: "Nenormalno formiranje tvrdog tkiva u pulpi" },
  { code: "K04.4", name: "Akutni apikalni periodontitis" },
  { code: "K04.5", name: "Hronični apikalni periodontitis" },
  { code: "K04.6", name: "Zagnoj vrha korena sa fistulom" },
  { code: "K04.7", name: "Zagnoj vrha korena bez fistule" },
  { code: "K04.8", name: "Cista korena zuba (Cystis radicularis)" },
  { code: "K04.9", name: "Druge i neoznačene bolesti pulpe i periapiksa" },

  // K05 — Gingivitis i parodontalne bolesti
  { code: "K05",   name: "Gingivitis i bolesti okoline zuba" },
  { code: "K05.0", name: "Akutno zapaljenje desni (Gingivitis acuta)" },
  { code: "K05.1", name: "Hronično zapaljenje desni (Gingivitis chronica)" },
  { code: "K05.2", name: "Akutni periodontitis" },
  { code: "K05.3", name: "Hronični periodontitis" },
  { code: "K05.4", name: "Periodontosis — degenerativno oboljenje" },
  { code: "K05.5", name: "Druge bolesti okoline zuba" },
  { code: "K05.6", name: "Bolesti okoline zuba, neoznačene" },

  // K06 — Druge bolesti desni
  { code: "K06",   name: "Druge bolesti desni i bezubog alveolnog nastavka" },
  { code: "K06.0", name: "Povlačenje desni (Recessio gingivae)" },
  { code: "K06.1", name: "Zadebljanje tkiva desni (Hypertrophia gingivae)" },
  { code: "K06.2", name: "Traumatsko oštećenje desni i alveolnog nastavka" },
  { code: "K06.8", name: "Druge označene bolesti desni" },
  { code: "K06.9", name: "Bolest desni i bezubog alveolnog nastavka, neoznačena" },

  // K07 — Dentofacijalne anomalije
  { code: "K07",   name: "Anomalije zuba i kostiju lica (uključujući malokluziju)" },
  { code: "K07.0", name: "Veće anomalije vilica (Gnathanomaliae majores)" },
  { code: "K07.1", name: "Anomalije odnosa vilica i baze lobanje" },
  { code: "K07.2", name: "Anomalije zubnih lukova" },
  { code: "K07.3", name: "Anomalije položaja zuba (Malpositiones dentis)" },
  { code: "K07.4", name: "Nenormalan zagrižaj, neoznačen" },
  { code: "K07.5", name: "Nenormalni zagrižaj zuba" },
  { code: "K07.6", name: "Poremećaji temporomandibularnog zgloba" },
  { code: "K07.8", name: "Druge anomalije zagrižaja zuba" },
  { code: "K07.9", name: "Anomalija zagrižaja, neoznačena" },

  // K08 — Druge bolesti zuba
  { code: "K08",   name: "Druge bolesti zuba i potpornog tkiva" },
  { code: "K08.0", name: "Ljuštenje zuba u sistemskim bolestima" },
  { code: "K08.1", name: "Gubitak zuba zbog akcidenta, vađenja ili bolesti parodoncijuma" },
  { code: "K08.2", name: "Usahlost bezubnog alveolnog nastavka" },
  { code: "K08.3", name: "Zaostali koren zuba" },
  { code: "K08.8", name: "Druge označene bolesti zuba i potpornog tkiva" },
  { code: "K08.9", name: "Bolest zuba i potpornog tkiva, neoznačena" },

  // K09 — Ciste usta
  { code: "K09",   name: "Ciste usta" },
  { code: "K09.0", name: "Razvojne zubne ciste (Cystes odontogenales)" },
  { code: "K09.1", name: "Razvojne nezubne ciste" },
  { code: "K09.2", name: "Druge ciste gornje vilice" },
  { code: "K09.8", name: "Druge ciste usta" },
  { code: "K09.9", name: "Cista usta, neoznačena" },

  // K10 — Druge bolesti vilica
  { code: "K10",   name: "Druge bolesti vilica" },
  { code: "K10.0", name: "Razvojni poremećaji vilica" },
  { code: "K10.1", name: "Centralni čvorasti tumor velikih ćelija (Granuloma gigantocellulare)" },
  { code: "K10.2", name: "Zapaljenja vilica" },
  { code: "K10.3", name: "Zapaljenje čašice zuba (Alveolitis)" },
  { code: "K10.8", name: "Druge označene bolesti vilica" },
  { code: "K10.9", name: "Bolest vilice, neoznačena" },

  // K11 — Bolesti pljuvačnih žlezda
  { code: "K11",   name: "Bolesti pljuvačnih žlezda" },
  { code: "K11.0", name: "Usahlost pljuvačne žlezde" },
  { code: "K11.1", name: "Uvećanje pljuvačne žlezde" },
  { code: "K11.2", name: "Zapaljenje pljuvačne žlezde (Sialoadenitis)" },
  { code: "K11.3", name: "Zagnoj pljuvačne žlezde" },
  { code: "K11.4", name: "Fistula pljuvačne žlezde" },
  { code: "K11.5", name: "Kamenci u pljuvačnoj žlezdi (Sialolithiasis)" },
  { code: "K11.6", name: "Sluzna cista pljuvačne žlezde (Mucocele)" },
  { code: "K11.7", name: "Poremećaj lučenja pljuvačke" },
  { code: "K11.8", name: "Druge bolesti pljuvačnih žlezda" },
  { code: "K11.9", name: "Bolest pljuvačne žlezde, neoznačena" },

  // K12 — Stomatitis
  { code: "K12",   name: "Zapaljenje sluznice usta (Stomatitis)" },
  { code: "K12.0", name: "Povratne afte usta (Aphtae oris recurrentes)" },
  { code: "K12.1", name: "Drugi oblici stomatitisa" },
  { code: "K12.2", name: "Flegmona i zagnoj usta" },

  // K13 — Druge bolesti usne i sluznice
  { code: "K13",   name: "Druge bolesti usne i sluznice usta" },
  { code: "K13.0", name: "Bolesti usne (Morbi labii)" },
  { code: "K13.1", name: "Ujed obraza i usne" },
  { code: "K13.2", name: "Leukoplakija i drugi poremećaji epitela usta i jezika" },
  { code: "K13.3", name: "Leukoplakija sa dlakama (Leucoplakia pilosa)" },
  { code: "K13.4", name: "Čvorasti tumor i zrakasta oštećenja sluznice usta" },
  { code: "K13.5", name: "Bujanje vezivnog tkiva podsluznice usta" },
  { code: "K13.6", name: "Nadražajno bujanje sluznice usta" },
  { code: "K13.7", name: "Druga i neoznačena oštećenja sluznice usta" },

  // K14 — Bolesti jezika
  { code: "K14",   name: "Bolesti jezika (Morbi linguae)" },
];
