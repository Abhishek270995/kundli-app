import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  href,
  ...props
}) {
  const baseStyles = {
    display: fullWidth ? 'flex' : 'inline-flex',
    width: fullWidth ? '100%' : 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontWeight: 600,
    fontFamily: 'inherit',
    borderRadius: 'var(--radius-sm)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.65 : 1,
    transition: 'all var(--transition-fast)',
    textDecoration: 'none',
    border: '1px solid transparent',
    boxSizing: 'border-box',
    lineHeight: 1.25,
  };

  const sizeStyles = {
    sm: { padding: '0.45rem 0.85rem', fontSize: 'var(--text-sm)' },
    md: { padding: '0.7rem 1.35rem', fontSize: 'var(--text-base)' },
    lg: { padding: '0.9rem 1.85rem', fontSize: 'var(--text-md)' },
  };

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--accent)',
      color: '#FFFFFF',
      borderColor: 'transparent',
      boxShadow: 'var(--shadow-sm)',
    },
    secondary: {
      backgroundColor: 'var(--surface-muted)',
      color: 'var(--ink)',
      borderColor: 'var(--border)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--accent)',
      borderColor: 'var(--accent)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--ink-secondary)',
      borderColor: 'transparent',
    },
    danger: {
      backgroundColor: 'var(--danger-bg)',
      color: 'var(--danger)',
      borderColor: 'var(--danger-border)',
    },
  };

  const combinedStyles = {
    ...baseStyles,
    ...(sizeStyles[size] || sizeStyles.md),
    ...(variantStyles[variant] || variantStyles.primary),
  };

  const content = (
    <>
      {loading ? (
        <span
          style={{
            display: 'inline-block',
            width: '1em',
            height: '1em',
            border: '2px solid currentColor',
            borderRightColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }}
          aria-hidden="true"
        />
      ) : (
        icon && iconPosition === 'left' && <span className="btn-icon" aria-hidden="true">{icon}</span>
      )}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className="btn-icon" aria-hidden="true">{icon}</span>
      )}
    </>
  );

  if (href && !disabled) {
    return (
      <a
        href={href}
        style={combinedStyles}
        className={`ui-btn ui-btn-${variant} ${className}`}
        onClick={onClick}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      style={combinedStyles}
      className={`ui-btn ui-btn-${variant} ${className}`}
      onClick={onClick}
      {...props}
    >
      {content}
    </button>
  );
}
