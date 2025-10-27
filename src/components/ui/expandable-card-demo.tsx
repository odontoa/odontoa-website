import { ProjectStatusCard } from "@/components/ui/expandable-card"

type KPI = { label: string; value: string }
type Bullet = { text: string; good?: boolean }

function ExpandableCardDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ProjectStatusCard
        title="Trenutno stanje u ordinacijama"
        badge={{ text: "Pain points", tone: "rose" }}
        kpis={[
          { label: "Propušteni termini", value: "15–20%" },
          { label: "Zakazivanje", value: "sporo" },
          { label: "Administracija", value: "oduzima sate" },
        ] as KPI[]}
        bullets={[
          { text: "Prekidi tokom rada zbog poziva" },
          { text: "Papiri i administracija oduzimaju sate" },
          { text: "Teško praćenje pacijenata i terapija" },
          { text: "Nesporazumi sa tehničarima" },
          { text: "Papirne liste zaliha → nestašice ili višak" },
        ] as Bullet[]}
        trust={{ rating: 5, text: "Koriste nas klinike u BG, NS, Nišu" }}
        info={["Bez automatizacije", "Ručno zakazivanje", "Rizik od no-show"]}
        primaryCta={undefined}
        secondaryCta={{ label: "Saznajte više o problemima", href: "/blog/problemi-u-ordinaciji" }}
        gradientBg="bg-rose-50 border border-rose-200"
      />

      <ProjectStatusCard
        title="Sa Odontoa sistemom"
        badge={{ text: "Rezultati posle 30 dana", tone: "emerald" }}
        kpis={[
          { label: "No-show", value: "−15–20%" },
          { label: "Zakazivanje", value: "< 20s" },
          { label: "Implementacija", value: "1–3 dana" },
        ] as KPI[]}
        bullets={[
          { text: "Zakazivanje u par klikova (prosek < 20s)", good: true },
          { text: "Automatski SMS/Email podsetnici (smanjuju no-show 15–20%)", good: true },
          { text: "Digitalni kartoni i brza pretraga podataka", good: true },
          { text: "Centralizovana komunikacija tima i tehničara", good: true },
          { text: "Finansijski dashboard i praćenje zaliha", good: true },
        ] as Bullet[]}
        trust={{ rating: 5, text: "Ocena 4.9/5 na osnovu 120+ preporuka" }}
        info={["Implementacija: 1–3 dana", "Obuka tima uključena", "SMS/Email podsetnici uključeni"]}
        primaryCta={{ label: "Zakažite demo", href: "/demo" }}
        secondaryCta={{ label: "Pogledajte kratak video (90s)", href: "/video" }}
        gradientBg="bg-emerald-50 border border-emerald-200"
      />
    </div>
  )
}

export { ExpandableCardDemo };
