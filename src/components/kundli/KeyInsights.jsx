import React from 'react';
import Card from '../ui/Card';

export default function KeyInsights({
  result,
  lang,
  onSelectTopic,
}) {
  const isHi = lang === 'hi';

  const activeMaha = result.detailedDashas?.activeMahadasha || result.dashaDetails?.activeMahadasha;
  const activeAntar = result.detailedDashas?.currentActiveAntardasha || result.dashaDetails?.currentActiveAntardasha;

  const topYogas = (result.detectedYogas || ['Gajakesari Yoga', 'Raj Yoga']).slice(0, 2);

  return (
    <div style={{ marginBottom: 'var(--space-6)' }} className="key-insights-container no-print">
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--ink)' }}>
          {isHi ? 'प्रमुख ३ जीवन सूत्र (Key Insights)' : 'Key Insights at a Glance'}
        </h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-secondary)', margin: 0 }}>
          {isHi
            ? 'आपकी कुंडली की मुख्य ऊर्जा, सक्रिय ग्रह दशा एवं प्रमुख सामर्थ्य का संक्षिप्त निष्कर्ष'
            : 'Three core takeaways synthesized from your birth chart, planetary era, and soul blueprint'}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 'var(--space-4)',
        }}
      >
        {/* Insight 1: Temperament */}
        <Card
          variant="default"
          padding="md"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
              <span style={{ fontSize: '1.3rem' }} aria-hidden="true">👑</span>
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, margin: 0, color: 'var(--ink)' }}>
                {isHi ? 'आत्मबल व स्वभाव' : 'Temperament & Soul Path'}
              </h4>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-secondary)', lineHeight: 'var(--leading-normal)', margin: 0 }}>
              {isHi
                ? `लग्न ${result.lagna} एवं चंद्र राशि ${result.rashi} का योग आपको स्वाभाविक नेतृत्व, अंतर्दृष्टि और धैर्यवान संकल्प प्रदान करता है।`
                : `Ascendant in ${result.lagna} paired with Moon in ${result.rashi} gives you a resilient personal foundation, steady discernment, and strategic focus.`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectTopic('chart')}
            style={{
              marginTop: 'var(--space-3)',
              background: 'none',
              border: 'none',
              color: 'var(--accent)',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: 0,
            }}
          >
            <span>{isHi ? 'लग्न व वर्ग चक्र देखें' : 'View Natal Chart'}</span> →
          </button>
        </Card>

        {/* Insight 2: Active Dasha */}
        <Card
          variant="default"
          padding="md"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
              <span style={{ fontSize: '1.3rem' }} aria-hidden="true">⏳</span>
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, margin: 0, color: 'var(--ink)' }}>
                {isHi ? 'सक्रिय महादशा काल' : 'Active Planetary Era'}
              </h4>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-secondary)', lineHeight: 'var(--leading-normal)', margin: 0 }}>
              {activeMaha && activeMaha.lord
                ? (isHi
                  ? `वर्तमान में ${activeMaha.lord} की महादशा (${activeMaha.startYear}–${activeMaha.endYear}) सक्रिय है${activeAntar ? ` (अंतर्दशा: ${activeAntar.antardashaLord})` : ''}। यह समय आपके कर्म व व्यक्तिगत उत्थान को गति दे रहा है।`
                  : `Currently navigating ${activeMaha.lord} Mahadasha (${activeMaha.startYear}–${activeMaha.endYear})${activeAntar ? ` with ${activeAntar.antardashaLord} Antardasha` : ''}, driving major milestones.`)
                : (isHi
                  ? 'आपकी विंशोत्तरी दशा का वर्तमान चरण महत्वपूर्ण जीवन परिवर्तनों का संकेत दे रहा है।'
                  : 'Your active Vimshottari cycle indicates important developmental growth.')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectTopic('predictions')}
            style={{
              marginTop: 'var(--space-3)',
              background: 'none',
              border: 'none',
              color: 'var(--accent)',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: 0,
            }}
          >
            <span>{isHi ? 'दशा कालक्रम देखें' : 'View Dasha Timeline'}</span> →
          </button>
        </Card>

        {/* Insight 3: Auspicious Formations */}
        <Card
          variant="default"
          padding="md"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
              <span style={{ fontSize: '1.3rem' }} aria-hidden="true">🌟</span>
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, margin: 0, color: 'var(--ink)' }}>
                {isHi ? 'प्रमुख शुभ योग' : 'Auspicious Yogas'}
              </h4>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: 'var(--space-2)' }}>
              {topYogas.map((y, idx) => {
                const name = typeof y === 'string' ? y.split(':')[0].replace(/[🌟⚡✨💰🔥]/g, '').trim() : 'Raj Yoga';
                return (
                  <span
                    key={idx}
                    style={{
                      fontSize: 'var(--text-xs)',
                      backgroundColor: 'var(--accent-light)',
                      border: '1px solid var(--border-focus)',
                      color: 'var(--accent)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 600,
                    }}
                  >
                    ✨ {name}
                  </span>
                );
              })}
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-secondary)', lineHeight: 'var(--leading-normal)', margin: 0 }}>
              {isHi
                ? 'केंद्र व त्रिकोण के शुभ ग्रह संबंध निरंतर मान-सम्मान एवं स्थायित्व को सुदृढ़ बनाते हैं।'
                : 'Fortunate angular and trinal house alignments reinforce sustained progress and protection.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectTopic('doshas')}
            style={{
              marginTop: 'var(--space-3)',
              background: 'none',
              border: 'none',
              color: 'var(--accent)',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: 0,
            }}
          >
            <span>{isHi ? 'योग व दोष विवरण' : 'Explore All Yogas'}</span> →
          </button>
        </Card>
      </div>
    </div>
  );
}
