import React from 'react';
import Card from '../ui/Card';

export default function PopularTools({
  tools,
  isHi,
  onSelect,
}) {
  // Take at most 4 top tools
  const popularList = tools.filter(t => t.priority === 'POPULAR' || t.priority === 'HIGH PRIORITY').slice(0, 4);

  if (!popularList.length) return null;

  return (
    <div style={{ marginBottom: 'var(--space-8)' }} className="popular-tools-section">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-3)' }}>
        <span style={{ fontSize: '1.2rem' }} aria-hidden="true">⭐</span>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>
          {isHi ? 'सर्वाधिक लोकप्रिय ज्योतिषीय टूल्स' : 'Featured & Popular Calculators'}
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--space-4)',
        }}
      >
        {popularList.map(tool => (
          <Card
            key={tool.id}
            variant="default"
            padding="md"
            interactive
            onClick={(e) => onSelect(tool, e)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderLeft: '3px solid var(--accent)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: '1.4rem' }} aria-hidden="true">{tool.icon}</span>
                <span
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--accent)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  {tool.category.toUpperCase()}
                </span>
              </div>
              <h3
                style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: 700,
                  color: 'var(--ink)',
                  marginBottom: 'var(--space-1)',
                  lineHeight: 'var(--leading-snug)',
                }}
              >
                {isHi ? tool.titleHi : tool.titleEn}
              </h3>
              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--ink-secondary)',
                  margin: 0,
                  lineHeight: 'var(--leading-normal)',
                }}
              >
                {(isHi ? tool.descHi : tool.descEn).split('.')[0]}.
              </p>
            </div>

            <div
              style={{
                marginTop: 'var(--space-3)',
                fontSize: 'var(--text-xs)',
                color: 'var(--accent)',
                fontWeight: 700,
              }}
            >
              {isHi ? 'गणना शुरू करें' : 'Start Calculation'} →
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
