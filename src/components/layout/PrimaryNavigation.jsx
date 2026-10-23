import React from 'react';

export default function PrimaryNavigation({
  currentSection,
  onNavigate,
  lang,
  hasResult = false,
  className = '',
}) {
  const isHi = lang === 'hi';

  // 4 Primary high-level destinations (+ Chart result if available)
  const navItems = [
    {
      id: 'kundli',
      path: '/',
      label: hasResult ? (isHi ? 'मेरी कुंडली' : 'My Kundli') : (isHi ? 'कुंडली' : 'Kundli'),
      icon: '🔯',
      isActive: currentSection === 'kundli',
    },
    {
      id: 'daily',
      path: '/daily',
      label: isHi ? 'दैनिक पंचांग व राशिफल' : 'Daily & Calendar',
      icon: '☀️',
      isActive: ['daily', 'panchang', 'muhurat', 'festivals'].includes(currentSection),
    },
    {
      id: 'matchmaking',
      path: '/matchmaking',
      label: isHi ? 'कुंडली मिलान' : 'Kundli Milan',
      icon: '💍',
      isActive: currentSection === 'matchmaking',
    },
    {
      id: 'tools',
      path: '/tools',
      label: isHi ? 'ज्योतिष टूल्स' : 'Astrology Tools',
      icon: '🛠️',
      isActive: currentSection === 'tools',
    },
  ];

  return (
    <nav
      className={`primary-navigation ${className}`}
      role="navigation"
      aria-label="Main Navigation"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
      }}
    >
      {navItems.map(item => (
        <a
          key={item.id}
          href={item.path}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(item.id, e);
          }}
          aria-current={item.isActive ? 'page' : undefined}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--text-sm)',
            fontWeight: item.isActive ? 600 : 500,
            color: item.isActive ? 'var(--accent)' : 'var(--ink-secondary)',
            backgroundColor: item.isActive ? 'var(--accent-light)' : 'transparent',
            border: item.isActive ? '1px solid var(--border-focus)' : '1px solid transparent',
            textDecoration: 'none',
            transition: 'all var(--transition-fast)',
            whiteSpace: 'nowrap',
          }}
          className={`nav-link ${item.isActive ? 'is-active' : ''}`}
        >
          <span style={{ fontSize: '1.1em' }} aria-hidden="true">{item.icon}</span>
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}
