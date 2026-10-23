import React from 'react';
import Card from '../ui/Card';

export default function ToolCard({
  tool,
  isHi,
  onSelect,
}) {
  const title = isHi ? tool.titleHi : tool.titleEn;
  const desc = isHi ? tool.descHi : tool.descEn;

  // Concise 1-sentence summary
  const shortDesc = desc.split('.')[0] + '.';

  return (
    <Card
      variant="default"
      padding="md"
      interactive
      onClick={(e) => onSelect(tool, e)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        backgroundColor: 'var(--surface)',
      }}
      className="tool-card"
    >
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            marginBottom: 'var(--space-3)',
          }}
        >
          <span style={{ fontSize: '1.6rem' }} aria-hidden="true">{tool.icon}</span>
          {tool.priority === 'POPULAR' && (
            <span
              style={{
                fontSize: 'var(--text-xs)',
                backgroundColor: 'var(--accent-light)',
                border: '1px solid var(--border-focus)',
                color: 'var(--accent)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
              }}
            >
              ⭐ {isHi ? 'लोकप्रिय' : 'Popular'}
            </span>
          )}
        </div>

        <h3
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 700,
            color: 'var(--ink)',
            marginBottom: 'var(--space-2)',
            lineHeight: 'var(--leading-snug)',
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--ink-secondary)',
            lineHeight: 'var(--leading-normal)',
            margin: 0,
          }}
        >
          {shortDesc}
        </p>
      </div>

      <div
        style={{
          marginTop: 'var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border)',
          paddingTop: 'var(--space-3)',
        }}
      >
        <span
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--ink-muted)',
            fontWeight: 600,
          }}
        >
          {tool.badge || (isHi ? 'सटीक गणना' : 'Calculator')}
        </span>

        <span
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--accent)',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {isHi ? 'उपयोग करें' : 'Open Tool'} →
        </span>
      </div>
    </Card>
  );
}
