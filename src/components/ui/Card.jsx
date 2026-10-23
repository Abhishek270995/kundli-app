import React from 'react';

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  interactive = false,
  className = '',
  onClick,
  style = {},
  as: Component = 'div',
  ...props
}) {
  const paddingMap = {
    none: '0',
    sm: 'var(--space-3)',
    md: 'var(--space-5)',
    lg: 'var(--space-6)',
  };

  const variantStyles = {
    default: {
      backgroundColor: 'var(--surface)',
      borderColor: 'var(--border)',
      boxShadow: 'var(--shadow-xs)',
    },
    muted: {
      backgroundColor: 'var(--surface-muted)',
      borderColor: 'var(--border)',
      boxShadow: 'none',
    },
    elevated: {
      backgroundColor: 'var(--surface-raised)',
      borderColor: 'var(--border)',
      boxShadow: 'var(--shadow-md)',
    },
    accent: {
      backgroundColor: 'var(--accent-light)',
      borderColor: 'var(--border-focus)',
      boxShadow: 'var(--shadow-xs)',
    },
  };

  const cardStyle = {
    borderRadius: 'var(--radius-md)',
    border: '1px solid',
    padding: paddingMap[padding] || paddingMap.md,
    transition: interactive ? 'transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast)' : undefined,
    cursor: interactive || onClick ? 'pointer' : undefined,
    ...variantStyles[variant],
    ...style,
  };

  return (
    <Component
      style={cardStyle}
      className={`ui-card ui-card-${variant} ${interactive ? 'ui-card-interactive' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
}
