import React from 'react';

export default function FormField({
  id,
  label,
  required = false,
  optional = false,
  helperText,
  error,
  children,
  className = '',
  style = {},
}) {
  const helperId = helperText ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined;

  // Clone child input to inject aria-describedby, aria-invalid, id if not already present
  const renderChild = () => {
    if (!React.isValidElement(children)) return children;
    return React.cloneElement(children, {
      id: children.props.id || id,
      'aria-invalid': error ? 'true' : undefined,
      'aria-describedby': describedBy,
      style: {
        ...(children.props.style || {}),
        borderColor: error ? 'var(--danger)' : children.props.style?.borderColor,
      },
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 'var(--space-4)',
        width: '100%',
        ...style,
      }}
      className={`ui-form-field ${error ? 'has-error' : ''} ${className}`}
    >
      {label && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 'var(--space-2)',
          }}
        >
          <label
            htmlFor={id}
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--ink)',
            }}
          >
            {label}
            {required && (
              <span style={{ color: 'var(--danger)', marginLeft: '4px' }} aria-hidden="true">*</span>
            )}
          </label>
          {optional && (
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-muted)' }}>
              (Optional)
            </span>
          )}
        </div>
      )}

      {renderChild()}

      {helperText && !error && (
        <div
          id={helperId}
          style={{
            marginTop: 'var(--space-1)',
            fontSize: 'var(--text-xs)',
            color: 'var(--ink-muted)',
            lineHeight: 'var(--leading-snug)',
          }}
        >
          {helperText}
        </div>
      )}

      {error && (
        <div
          id={errorId}
          role="alert"
          style={{
            marginTop: 'var(--space-1)',
            fontSize: 'var(--text-xs)',
            color: 'var(--danger)',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span aria-hidden="true">⚠️</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
