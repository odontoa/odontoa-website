import Reveal from './Reveal';

export default function Home4Assistant() {
  return (
    <section className="home4-assistant">
      <div className="home4-assistant__inner">
        <Reveal>
          <p className="home4-assistant__eyebrow">Ugrađeni asistent</p>
          <h2 className="home4-h2">Pomoćnik koji radi u sistemu, ne pored njega.</h2>
          <p className="home4-assistant__lead">
            Asistent odgovara na pitanja o pacijentima, terminima i snalaženju u aplikaciji,
            direktno u sistemu. Uskoro i zakazivanje termina i upiti po bazi.
          </p>
        </Reveal>

        {/* Placeholder chat vizual - bice zamenjen kasnije */}
        <Reveal delay={0.12}>
          <div className="home4-assistant__chat">
            <div className="home4-assistant__bubble home4-assistant__bubble--q">
              Termini za sutra?
            </div>
            <div className="home4-assistant__bubble home4-assistant__bubble--a">
              Imate 6 termina, prvi u 09:00.
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
