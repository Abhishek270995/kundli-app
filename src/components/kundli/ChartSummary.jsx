import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function ChartSummary({
  form,
  result,
  lang,
  onResetDetails,
  onPrintReport,
}) {
  const isHi = lang === 'hi';

  const metrics = [
    { label: isHi ? 'लग्न' : 'Lagna (Ascendant)', val: result.lagna, icon: '👑' },
    { label: isHi ? 'चंद्र राशि' : 'Moon Sign (Rashi)', val: result.rashi, icon: '🌙' },
    { label: isHi ? 'नक्षत्र' : 'Nakshatra', val: result.nakshatra, icon: '⭐' },
    { label: isHi ? 'तिथि' : 'Tithi', val: result.tithi, icon: '🌕' },
    { label: isHi ? 'योग' : 'Yoga', val: result.yoga, icon: '⚡' },
  ];

  return (
    <Card
      variant="default"
      padding="md"
      style={{
        marginBottom: 'var(--space-6)',
        backgroundColor: 'var(--surface)',
      }}
      className="chart-summary-card no-print"
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
          borderBottom: '1px solid var(--border)',
          paddingBottom: 'var(--space-4)',
          marginBottom: 'var(--space-4)',
        }}
      >
        <div>
          <div
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '2px',
            }}
          >
            {isHi ? 'वैदिक जन्म पत्रिका' : 'Vedic Natal Profile'}
          </div>
          <h2
            style={{
              fontSize: 'var(--text-xl)',
              color: 'var(--ink)',
              fontWeight: 800,
              margin: 0,
            }}
          >
            {form.name || (isHi ? 'जातक' : 'Seeker')}
          </h2>
          <div
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--ink-secondary)',
              marginTop: '4px',
            }}
          >
            📅 {form.dob} · ⏰ {form.tob || '12:00'} · 📍 {form.pob}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={onResetDetails}
            icon="✏️"
          >
            {isHi ? 'विवरण बदलें' : 'Edit Birth Details'}
          </Button>

          {onPrintReport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onPrintReport}
              icon="🖨️"
            >
              {isHi ? 'प्रिंट / PDF रिपोर्ट' : 'Print / PDF Report'}
            </Button>
          )}
        </div>
      </div>

      {/* Compact Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 'var(--space-3)',
        }}
      >
        {metrics.map((m, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: 'var(--surface-muted)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-3)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
            }}
          >
            <span style={{ fontSize: '1.4rem' }} aria-hidden="true">{m.icon}</span>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', fontWeight: 600 }}>
                {m.label}
              </div>
              <div style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', fontWeight: 700 }}>
                {m.val || '—'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
