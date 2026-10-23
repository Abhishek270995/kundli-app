import React from 'react';

export default function Tabs({
  items,
  activeId,
  onChange,
  variant = 'pills',
  className = '',
  style = {},
}) {
  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % items.length;
      onChange(items[nextIndex].id);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + items.length) % items.length;
      onChange(items[prevIndex].id);
    }
  };

  return (
    <div
      role="tablist"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: variant === 'segments' ? '2px' : 'var(--space-2)',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: variant === 'segments' ? '4px' : 'var(--space-1) 0',
        backgroundColor: variant === 'segments' ? 'var(--surface-muted)' : 'transparent',
        borderRadius: variant === 'segments' ? 'var(--radius-md)' : undefined,
        borderBottom: variant === 'underline' ? '1px solid var(--border)' : undefined,
        scrollbarWidth: 'none',
        ...style,
      }}
      className={`ui-tabs ui-tabs-${variant} ${className}`}
    >
      {items.map((item, index) => {
        const isActive = item.id === activeId;

        let tabStyle = {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          padding: 'var(--space-2) var(--space-4)',
          borderRadius: variant === 'pills' || variant === 'segments' ? 'var(--radius-full)' : '0',
          border: 'none',
          background: 'none',
          fontSize: 'var(--text-sm)',
          fontWeight: isActive ? 600 : 500,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          color: isActive ? 'var(--ink)' : 'var(--ink-secondary)',
          transition: 'all var(--transition-fast)',
        };

        if (variant === 'pills') {
          tabStyle = {
            ...tabStyle,
            backgroundColor: isActive ? 'var(--surface)' : 'transparent',
            color: isActive ? 'var(--accent)' : 'var(--ink-secondary)',
            border: isActive ? '1px solid var(--border)' : '1px solid transparent',
            boxShadow: isActive ? 'var(--shadow-xs)' : 'none',
          };
        } else if (variant === 'segments') {
          tabStyle = {
            ...tabStyle,
            backgroundColor: isActive ? 'var(--surface)' : 'transparent',
            color: isActive ? 'var(--ink)' : 'var(--ink-muted)',
            boxShadow: isActive ? 'var(--shadow-xs)' : 'none',
            borderRadius: 'var(--radius-sm)',
          };
        } else if (variant === 'underline') {
          tabStyle = {
            ...tabStyle,
            borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
            color: isActive ? 'var(--accent)' : 'var(--ink-secondary)',
            marginBottom: '-1px',
          };
        }

        return (
          <button
            key={item.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(item.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            style={tabStyle}
            className={`ui-tab-btn ${isActive ? 'is-active' : ''}`}
          >
            {item.icon && <span aria-hidden="true">{item.icon}</span>}
            <span>{item.label}</span>
            {item.count !== undefined && (
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isActive ? 'var(--accent-light)' : 'var(--surface-muted)',
                  color: isActive ? 'var(--accent)' : 'var(--ink-muted)',
                  fontWeight: 600,
                }}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
