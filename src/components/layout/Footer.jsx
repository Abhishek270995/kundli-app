import React from 'react';

export default function Footer({
  lang,
  onNavigate,
  hasResult,
  onSecretTrigger,
}) {
  const isHi = lang === 'hi';

  const handleLinkClick = (sectionId, e) => {
    e.preventDefault();
    onNavigate(sectionId, e);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="site-footer no-print"
      style={{
        marginTop: 'var(--space-16)',
        backgroundColor: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        paddingTop: 'var(--space-12)',
        paddingBottom: 'var(--space-8)',
        color: 'var(--ink-secondary)',
      }}
    >
      <div className="app-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-8)',
            marginBottom: 'var(--space-8)',
          }}
        >
          {/* Column 1: Brand Info */}
          <div>
            <div
              onClick={onSecretTrigger}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: 'var(--space-3)',
                cursor: 'pointer',
              }}
              title="Jyotish Paramarsh"
            >
              <img
                src="/logo.webp"
                alt="Jyotish Paramarsh"
                width="36"
                height="36"
                style={{
                  borderRadius: '50%',
                  border: '1.5px solid var(--accent)',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '16px',
                  fontWeight: 800,
                  color: 'var(--brand)',
                  letterSpacing: '0.04em',
                }}
              >
                JYOTISH PARAMARSH
              </span>
            </div>
            <p
              style={{
                fontSize: 'var(--text-sm)',
                lineHeight: 'var(--leading-relaxed)',
                color: 'var(--ink-secondary)',
                marginBottom: 'var(--space-3)',
              }}
            >
              {isHi
                ? 'महर्षि पराशर विरचित बृहत्पाराशर होराशास्त्र के सिद्धांती सूत्रों एवं आधुनिक खगोलीय सूक्ष्म अयनांश पर आधारित संपूर्ण जीवन मार्गदर्शन।'
                : 'Dedicated to authentic Parashari Vedic astrological principles and arc-second astronomical precision.'}
            </p>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-muted)' }}>
              ✦ {isHi ? 'सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः' : 'Pure Vedic Wisdom For Every Seeker'} ✦
            </div>
          </div>

          {/* Column 2: Core Calculators */}
          <div>
            <h4
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                color: 'var(--ink)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 'var(--space-3)',
              }}
            >
              {isHi ? 'मुख्य सेवाएं' : 'Main Features'}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--text-sm)' }}>
              <li>
                <a href="/" onClick={(e) => handleLinkClick('kundli', e)}>
                  {isHi ? 'जन्म कुंडली व षोडशवर्ग चक्र' : 'Kundli & Shodashvargas'}
                </a>
              </li>
              <li>
                <a href="/matchmaking" onClick={(e) => handleLinkClick('matchmaking', e)}>
                  {isHi ? 'कुंडली मिलान (३६ गुण परीक्षण)' : 'Kundli Milan (36 Gunas)'}
                </a>
              </li>
              <li>
                <a href="/tools" onClick={(e) => handleLinkClick('tools', e)}>
                  {isHi ? '२१ ज्योतिष टूल्स डायरेक्टरी' : '21 Astrology Calculators'}
                </a>
              </li>
              <li>
                <a href="/tools/vimshottari-dasha" onClick={(e) => handleLinkClick('tools', e)}>
                  {isHi ? 'विंशोत्तरी महादशा कैलकुलेटर' : 'Vimshottari Dasha Calculator'}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Daily & Calendar */}
          <div>
            <h4
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                color: 'var(--ink)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 'var(--space-3)',
              }}
            >
              {isHi ? 'दैनिक पंचांग व काल' : 'Daily & Calendar'}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--text-sm)' }}>
              <li>
                <a href="/panchang" onClick={(e) => handleLinkClick('panchang', e)}>
                  {isHi ? 'दैनिक पंचांग व चौघड़िया' : 'Daily Panchang & Choghadiya'}
                </a>
              </li>
              <li>
                <a href="/daily" onClick={(e) => handleLinkClick('daily', e)}>
                  {isHi ? 'दैनिक राशिफल (१२ राशियां)' : 'Daily Horoscope (12 Signs)'}
                </a>
              </li>
              <li>
                <a href="/muhurat" onClick={(e) => handleLinkClick('muhurat', e)}>
                  {isHi ? 'शुभ मुहूर्त (विवाह, गृह प्रवेश, वाहन)' : 'Shubh Muhurat Timings'}
                </a>
              </li>
              <li>
                <a href="/festivals" onClick={(e) => handleLinkClick('festivals', e)}>
                  {isHi ? 'व्रत व त्यौहार सूची' : 'Hindu Festivals & Vrats Calendar'}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Ethical & Scientific Commitment */}
          <div>
            <h4
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                color: 'var(--ink)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 'var(--space-3)',
              }}
            >
              {isHi ? 'गोपनीयता एवं प्रतिबद्धता' : 'Privacy & Trust'}
            </h4>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)', lineHeight: 'var(--leading-normal)', marginBottom: 'var(--space-2)' }}>
              🔒 {isHi
                ? '१००% क्लाइंट-साइड गणना। आपका जन्म विवरण कभी भी किसी तीसरे पक्ष के साथ साझा या बेचा नहीं जाता।'
                : '100% Client-side compute. Your birth data is never shared or sold to third parties.'}
            </p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)', lineHeight: 'var(--leading-normal)', margin: 0 }}>
              🌿 {isHi
                ? 'निःशुल्क सेवा पहल। स्वेच्छानुसार आप सर्वर संचालन हेतु श्रद्धा दक्षिणा अर्पित कर सकते हैं।'
                : '100% Free initiative. Voluntary Dakshina supports server hosting and continuous research.'}
            </p>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: 'var(--space-4)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--space-2)',
            fontSize: 'var(--text-xs)',
            color: 'var(--ink-muted)',
          }}
        >
          <div>
            © {new Date().getFullYear()} Jyotish Paramarsh. {isHi ? 'सर्वाधिकार सुरक्षित।' : 'All rights reserved.'}
          </div>
          <div>
            {isHi
              ? 'वैदिक ज्योतिष व्यक्तिगत मार्गदर्शन व आत्मबोध हेतु है।'
              : 'Vedic astrology serves as reflective guidance and self-awareness.'}
          </div>
        </div>
      </div>
    </footer>
  );
}
