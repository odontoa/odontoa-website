import Link from 'next/link';
import AssistantChat from './AssistantChat';
import Reveal from '@/components/shared/Reveal';

export default function AssistantSection() {
  return (
    <section className="assistant">
      <div className="assistant__inner">
        <div className="assistant__split">
          <div className="assistant__text">
            <Reveal>
              <p className="assistant__eyebrow">Ugrađeni asistent</p>
              <h2 className="section-title">Pomoćnik koji radi u sistemu, ne pored njega.</h2>
              <p className="assistant__lead">
                Pitaj bilo šta o pacijentima, terminima i finansijama. Asistent zna tvoju bazu
                i odgovara odmah, bez traženja po menijima.
              </p>
              {/* Stoji u tekstualnoj koloni, pa ne dira chat animaciju u koloni pored. */}
              <Link href="/funkcionalnosti/ai-asistent" className="assistant__more">
                Saznaj više o AI asistentu
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M3 8h10m0 0l-4-4m4 4l-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </Reveal>
          </div>

          <div className="assistant__visual">
            <Reveal delay={0.12}>
              <AssistantChat />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
