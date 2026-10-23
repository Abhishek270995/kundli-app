import React from 'react';

export default function DailySubNavigation({
  currentSection,
  onNavigate,
  lang,
  className = '',
}) {
  const isHi = lang === 'hi';

  const subItems = [
    { id: 'panchang', path: '/panchang', label: isHi ? 'दैनिक पंचांग' : 'Panchang', icon: '🕉️' },
    { id: 'daily', path: '/daily', label: isHi ? 'दैनिक राशिफल' : 'Horoscope', icon: '☀️' },
    { id: 'muhurat', path: '/muhurat', label: isHi ? 'शुभ मुहूर्त' : 'Shubh Muhurat', icon: '⏳' },
    { id: 'festivals', path: '/festivals', label: isHi ? 'व्रत व त्यौहार' : 'Festivals & Vrats', icon: '🪔' },
  ];

  return (
    <div
      style={{
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        marginBottom: 'var(--space-6)',
      }}
      className={`daily-subnav ${className}`}
    >
      <div
        className="app-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          overflowX: 'auto',
          paddingTop: 'var(--space-2)',
          paddingBottom: 'var(--space-2)',
          scrollbarWidth: 'none',
        }}
      >
        <span
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--ink-muted)',
            letterSpacing: '0.05em',
            marginRight: 'var(--space-2)',
            whiteSpace: 'nowrap',
          }}
        >
          {isHi ? 'पंचांग खंड:' : 'Daily:'}
        </span>
        {subItems.map(item => {
          const isActive = currentSection === item.id;
          return (
            <a
              key={item.id}
              href={item.path}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.id, e);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-sm)',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--accent)' : 'var(--ink-secondary)',
                backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
                border: isActive ? '1px solid var(--border-focus)' : '1px solid transparent',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)',
              }}
              className={`daily-sublink ${isActive ? 'is-active' : ''}`}
            >
              <span aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
