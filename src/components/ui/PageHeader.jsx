import React from 'react';

export default function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  align = 'left',
  className = '',
  style = {},
}) {
  return (
    <header
      style={{
        marginBottom: 'var(--space-8)',
        textAlign: align,
        display: 'flex',
        flexDirection: align === 'center' ? 'column' : 'row',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'var(--space-4)',
        ...style,
      }}
      className={`ui-page-header ${className}`}
    >
      <div style={{ maxWidth: align === 'center' ? 'var(--width-narrow)' : '720px' }}>
        {eyebrow && (
          <div
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--accent)',
              marginBottom: 'var(--space-2)',
            }}
          >
            {eyebrow}
          </div>
        )}
        <h1
          style={{
            margin: 0,
            color: 'var(--ink)',
            lineHeight: 'var(--leading-tight)',
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            style={{
              marginTop: 'var(--space-2)',
              marginBottom: 0,
              fontSize: 'var(--text-md)',
              color: 'var(--ink-secondary)',
              lineHeight: 'var(--leading-normal)',
            }}
          >
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            flexWrap: 'wrap',
            alignSelf: align === 'center' ? 'center' : 'flex-start',
            marginTop: align === 'center' ? 'var(--space-4)' : 0,
          }}
        >
          {actions}
        </div>
      )}
    </header>
  );
}
