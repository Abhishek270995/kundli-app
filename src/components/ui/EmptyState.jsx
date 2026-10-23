import React from 'react';

export default function EmptyState({
  icon = '🔍',
  title,
  description,
  action = null,
  compact = false,
  className = '',
  style = {},
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: compact ? 'var(--space-6) var(--space-4)' : 'var(--space-12) var(--space-6)',
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px dashed var(--border)',
        ...style,
      }}
      className={`ui-empty-state ${className}`}
    >
      {icon && (
        <div
          style={{
            fontSize: compact ? '2rem' : '3rem',
            marginBottom: 'var(--space-3)',
            opacity: 0.85,
          }}
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <h3
        style={{
          margin: 0,
          fontSize: compact ? 'var(--text-md)' : 'var(--text-lg)',
          color: 'var(--ink)',
          fontWeight: 600,
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            marginTop: 'var(--space-2)',
            marginBottom: action ? 'var(--space-5)' : 0,
            maxWidth: '460px',
            fontSize: 'var(--text-sm)',
            color: 'var(--ink-secondary)',
            lineHeight: 'var(--leading-normal)',
          }}
        >
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
