import React from 'react';

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  icon = null,
  className = '',
  style = {},
}) {
  const sizeMap = {
    sm: {
      padding: '2px 7px',
      fontSize: 'var(--text-xs)',
    },
    md: {
      padding: '4px 10px',
      fontSize: 'var(--text-sm)',
    },
  };

  const variantMap = {
    neutral: {
      backgroundColor: 'var(--surface-muted)',
      color: 'var(--ink-secondary)',
      borderColor: 'var(--border)',
    },
    accent: {
      backgroundColor: 'var(--accent-light)',
      color: 'var(--accent)',
      borderColor: 'var(--border-focus)',
    },
    success: {
      backgroundColor: 'var(--success-bg)',
      color: 'var(--success)',
      borderColor: 'var(--success-border)',
    },
    warning: {
      backgroundColor: 'var(--warning-bg)',
      color: 'var(--warning)',
      borderColor: 'var(--warning-border)',
    },
    danger: {
      backgroundColor: 'var(--danger-bg)',
      color: 'var(--danger)',
      borderColor: 'var(--danger-border)',
    },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        borderRadius: 'var(--radius-full)',
        fontWeight: 600,
        lineHeight: 1.2,
        border: '1px solid',
        whiteSpace: 'nowrap',
        ...sizeMap[size],
        ...variantMap[variant],
        ...style,
      }}
      className={`ui-badge ui-badge-${variant} ${className}`}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
