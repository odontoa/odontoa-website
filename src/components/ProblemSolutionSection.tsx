'use client';

import ProblemSolutionSection from "@/components/ui/problem-solution-section"

const ProblemSolutionSectionComponent = () => {
  const problems = [
    {
      title: "Prekidi tokom rada",
      description: "Pozivi pacijenata prekidaju tretmane i odvlače fokus.",
      type: 'problem' as const,
    },
    {
      title: "Previše vremena na administraciju",
      description: "Papiri i kartoni oduzimaju sate dnevno.",
      type: 'problem' as const,
    },
    {
      title: "Propali termini i gubici",
      description: "15–20% prihoda nestaje zbog propuštenih pregleda.",
      type: 'problem' as const,
    },
    {
      title: "Bez uvida u istoriju pacijenata",
      description: "Papiri i tabele otežavaju praćenje terapija i kontrola.",
      type: 'problem' as const,
    },
    {
      title: "Nepregledna komunikacija sa tehničarima",
      description: "Usmeni dogovori prave nesporazume i kašnjenja.",
      type: 'problem' as const,
    },
    {
      title: "Bez jasne kontrole poslovanja",
      description: "Podaci rasuti po papirima, odluke donosite napamet.",
      type: 'problem' as const,
    },
    {
      title: "Ručno praćenje zaliha",
      description: "Papirne liste često vode do nestašica ili viška.",
      type: 'problem' as const,
    },
  ];

  const solutions = [
    {
      title: "Automatizovano zakazivanje",
      description: "Zakazivanje u par klikova, bez preklapanja termina.",
      type: 'solution' as const,
    },
    {
      title: "Digitalni kartoni i brza pretraga",
      description: "Podaci dostupni odmah, administracija svedena na minimum.",
      type: 'solution' as const,
    },
    {
      title: "Automatski podsetnici",
      description: "SMS/Email podsećaju pacijente, termini se popunjavaju i lojalnost raste.",
      type: 'solution' as const,
    },
    {
      title: "Kompletna digitalna evidencija",
      description: "Svi podaci pacijenta na jednom mestu, od prvog pregleda do poslednje terapije.",
      type: 'solution' as const,
    },
    {
      title: "Centralizovana komunikacija",
      description: "Porudžbine i statusi radova uvek vidljivi u sistemu.",
      type: 'solution' as const,
    },
    {
      title: "Finansijski dashboard",
      description: "Prihodi, troškovi i ključne brojke jasno prikazani u realnom vremenu.",
      type: 'solution' as const,
    },
    {
      title: "Automatsko praćenje zaliha",
      description: "Sistem u realnom vremenu prati potrošnju i upozorava na nedostatke.",
      type: 'solution' as const,
    },
  ];

  return <ProblemSolutionSection problems={problems} solutions={solutions} />
};

export default ProblemSolutionSectionComponent; 