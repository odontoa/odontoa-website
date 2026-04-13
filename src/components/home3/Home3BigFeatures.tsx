import Image from 'next/image';
import { ClipboardList, CalendarDays, BarChart2 } from 'lucide-react';

const FEATURES = [
  {
    icon: ClipboardList,
    title: 'Digitalni kartoni',
    description:
      'Anamneza, terapije, saglasnosti, RTG snimci i fotografije na jednom mestu.',
  },
  {
    icon: CalendarDays,
    title: 'Zakazivač termina',
    description: 'Pregledan kalendar, brže izmene termina i podsetnici za pacijente.',
  },
  {
    icon: BarChart2,
    title: 'Finansije i administracija',
    description: 'Predračuni, uplate, cenovnik i dokumentacija bez dodatnog haosa.',
  },
];

export default function Home3BigFeatures() {
  return (
    <section className="home3-big-features">
      <div className="home3-big-features__inner">
        {/* Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2
            className="text-[58px] leading-[1.1] font-medium tracking-tight mb-6"
            style={{ color: 'var(--stellar-heading)' }}
          >
            Ceo rad ordinacije. Jedan sistem.
          </h2>
          <p
            className="text-base leading-relaxed"
            style={{ color: 'var(--stellar-body)' }}
          >
            Od zakazivanja do dokumentacije, sve je povezano i pregledno.
          </p>
        </div>

        {/* Cards row */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-5 border" style={{ borderColor: 'var(--stellar-border)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium" style={{ color: 'var(--stellar-heading)' }}>Digitalni kartoni</span>
              <div className="w-1 h-4 rounded-full" style={{ background: 'var(--stellar-border)' }} />
            </div>
            <div className="flex gap-2 mb-3">
              {['Termini', 'Pacijenti', 'Tim'].map((t) => (
                <span key={t} className="text-xs px-3 py-1 rounded-full" style={{ background: 'var(--stellar-bg-light)', color: 'var(--stellar-body)' }}>{t}</span>
              ))}
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'var(--stellar-bg-light)' }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color: 'var(--stellar-heading)' }}>Dnevni pregled</span>
                <span className="text-xs" style={{ color: 'var(--stellar-muted)' }}>✕</span>
              </div>
              <span className="text-xs" style={{ color: 'var(--stellar-muted)' }}>Pregled dana: termini, statusi poseta i brze akcije.</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border flex flex-col items-center justify-center" style={{ borderColor: 'var(--stellar-border)' }}>
            <span className="text-sm font-medium mb-4" style={{ color: 'var(--stellar-heading)' }}>Zakazivač termina</span>
            <Image
              src="/images/home3/big-feature-card.png"
              alt="Raspored po doktorima i stolicama"
              width={253}
              height={85}
              className="object-contain"
            />
          </div>

          <div className="bg-white rounded-xl p-5 border" style={{ borderColor: 'var(--stellar-border)' }}>
            <span className="text-sm font-medium mb-4 block" style={{ color: 'var(--stellar-heading)' }}>Finansije i administracija</span>
            <div className="flex flex-col gap-3 mt-3">
              {[
                { label: 'Prihodi', value: '94%' },
                { label: 'Popunjenost', value: '83%' },
                { label: 'KPI', value: '72%' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-xs w-16" style={{ color: 'var(--stellar-body)' }}>{item.label}</span>
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--stellar-bg-light)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: item.value, background: 'var(--stellar-accent)' }}
                    />
                  </div>
                  <span className="text-xs" style={{ color: 'var(--stellar-body)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature items */}
        <div className="grid grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="flex flex-col items-start">
              <feature.icon
                size={32}
                style={{ color: 'var(--stellar-accent)' }}
                className="mb-3"
              />
              <h3
                className="text-[22px] font-medium mb-2"
                style={{ color: 'var(--stellar-heading)' }}
              >
                {feature.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--stellar-body)' }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
