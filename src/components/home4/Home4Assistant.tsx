import Home4AssistantChat from './Home4AssistantChat';
import Reveal from './Reveal';

export default function Home4Assistant() {
  return (
    <section className="home4-assistant">
      <div className="home4-assistant__inner">
        <div className="home4-assistant__split">
          <div className="home4-assistant__text">
            <Reveal>
              <p className="home4-assistant__eyebrow">Ugrađeni asistent</p>
              <h2 className="home4-h2">Pomoćnik koji radi u sistemu, ne pored njega.</h2>
              <p className="home4-assistant__lead">
                Pitaj bilo šta o pacijentima, terminima i finansijama. Asistent zna tvoju bazu
                i odgovara odmah, bez traženja po menijima.
              </p>
            </Reveal>
          </div>

          <div className="home4-assistant__visual">
            <Reveal delay={0.12}>
              <Home4AssistantChat />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
