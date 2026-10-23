import React, { useState } from 'react';

export default function Disclosure({
  title,
  children,
  defaultOpen = false,
  badge,
  icon,
  className = '',
  style = {},
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: 'var(--surface)',
        overflow: 'hidden',
        marginBottom: 'var(--space-3)',
        transition: 'border-color var(--transition-fast)',
        ...style,
      }}
      className={`ui-disclosure ${isOpen ? 'is-open' : ''} ${className}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-4) var(--space-5)',
          background: 'none',
          border: 'none',
          textAlign: 'left',
          cursor: 'pointer',
          color: 'var(--ink)',
          fontSize: 'var(--text-base)',
          fontWeight: 600,
          gap: 'var(--space-3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {icon && <span style={{ fontSize: '1.2em' }} aria-hidden="true">{icon}</span>}
          <span>{title}</span>
          {badge && (
            <span
              style={{
                fontSize: 'var(--text-xs)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--surface-muted)',
                color: 'var(--ink-secondary)',
                fontWeight: 500,
              }}
            >
              {badge}
            </span>
          )}
        </div>

        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform var(--transition-normal)',
            color: 'var(--ink-muted)',
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div
          style={{
            padding: '0 var(--space-5) var(--space-5) var(--space-5)',
            borderTop: '1px solid var(--surface-muted)',
            paddingTop: 'var(--space-4)',
            color: 'var(--ink-secondary)',
            fontSize: 'var(--text-base)',
            lineHeight: 'var(--leading-relaxed)',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
