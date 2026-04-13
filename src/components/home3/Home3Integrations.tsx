import Image from 'next/image';

export default function Home3Integrations() {
  return (
    <section className="home3-integrations">
      <div className="home3-integrations__inner">
        {/* Label */}
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '-0.18px',
            color: '#6e51e0',
            margin: 0,
            marginBottom: 16,
            textAlign: 'center',
          }}
        >
          Sigurnost podataka
        </p>

        {/* Heading */}
        <h2
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 44,
            fontWeight: 500,
            lineHeight: '57.6px',
            letterSpacing: '-1.25px',
            color: '#060b13',
            margin: 0,
            marginBottom: 48,
            textAlign: 'center',
          }}
        >
          Vaši podaci. Vaša kontrola.
          <br />
          Uvek dostupni.
        </h2>

        {/* Icons grid — exported directly from Figma at 2x */}
        <div className="home3-integrations__grid-img">
          <Image
            src="/images/home3/integrations-grid.png"
            alt="Odontoa funkcije: zakazivanje, kartoni pacijenata, zalihe, naplata, analitika"
            width={2016}
            height={790}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        {/* Body text */}
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 16,
            fontWeight: 400,
            lineHeight: '32px',
            letterSpacing: '-0.18px',
            color: '#353d4f',
            textAlign: 'center',
            margin: '48px 0 32px',
            maxWidth: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Cloud pristup, rezervne kopije i sigurno čuvanje podataka.
        </p>

        {/* CTA button */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <a
            href="#funkcionalnosti"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              height: 40,
              paddingLeft: 20,
              paddingRight: 20,
              borderRadius: 999,
              background: '#6e51e0',
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: '-0.18px',
              color: '#ffffff',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Pogledajte sve funkcije
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
