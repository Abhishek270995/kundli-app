import React, { useEffect } from 'react';

export default function MobileNavigation({
  isOpen,
  onClose,
  currentSection,
  onNavigate,
  lang,
  onToggleLang,
  currency,
  onSetCurrency,
  currencies,
  hasResult,
}) {
  const isHi = lang === 'hi';

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleItemClick = (id, e) => {
    e.preventDefault();
    onNavigate(id, e);
    onClose();
  };

  const mainLinks = [
    { id: 'kundli', path: '/', label: hasResult ? (isHi ? 'मेरी कुंडली' : 'My Kundli') : (isHi ? 'जन्म कुंडली' : 'Kundli (Birth Chart)'), icon: '🔯' },
    { id: 'matchmaking', path: '/matchmaking', label: isHi ? 'कुंडली मिलान' : 'Kundli Milan (Matchmaking)', icon: '💍' },
    { id: 'tools', path: '/tools', label: isHi ? 'ज्योतिष टूल्स (२१ कैलकुलेटर)' : 'Astrology Tools (21 Calculators)', icon: '🛠️' },
  ];

  const dailyLinks = [
    { id: 'panchang', path: '/panchang', label: isHi ? 'दैनिक पंचांग' : 'Panchang (Daily Almanac)', icon: '🕉️' },
    { id: 'daily', path: '/daily', label: isHi ? 'दैनिक राशिफल' : 'Daily Horoscope', icon: '☀️' },
    { id: 'muhurat', path: '/muhurat', label: isHi ? 'शुभ मुहूर्त' : 'Shubh Muhurat', icon: '⏳' },
    { id: 'festivals', path: '/festivals', label: isHi ? 'व्रत व त्यौहार' : 'Festivals & Vrats', icon: '🪔' },
  ];

  return (
    <div
      id="mobile-nav-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(20, 16, 30, 0.6)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
        aria-hidden="true"
      />

      {/* Slide-out Drawer */}
      <div
        style={{
          position: 'relative',
          marginLeft: 'auto',
          width: '85%',
          maxWidth: '360px',
          height: '100%',
          backgroundColor: 'var(--surface)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          overflowY: 'auto',
          padding: 'var(--space-5)',
        }}
      >
        {/* Header with Close */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-6)',
            paddingBottom: 'var(--space-4)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/logo.webp" alt="Jyotish Paramarsh" width="28" height="28" style={{ borderRadius: '50%' }} />
            <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>
              JYOTISH PARAMARSH
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            style={{
              background: 'none',
              border: 'none',
              padding: '6px',
              cursor: 'pointer',
              color: 'var(--ink)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Primary Sections */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 'var(--space-3)', letterSpacing: '0.06em' }}>
            {isHi ? 'मुख्य सेवाएं' : 'Main Features'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {mainLinks.map(link => {
              const isActive = currentSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.path}
                  onClick={(e) => handleItemClick(link.id, e)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--text-base)',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--accent)' : 'var(--ink)',
                    backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
                    textDecoration: 'none',
                  }}
                >
                  <span aria-hidden="true" style={{ fontSize: '1.2em' }}>{link.icon}</span>
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Daily Section */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 'var(--space-3)', letterSpacing: '0.06em' }}>
            {isHi ? 'दैनिक पंचांग व काल' : 'Daily & Calendar'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {dailyLinks.map(link => {
              const isActive = currentSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.path}
                  onClick={(e) => handleItemClick(link.id, e)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--text-base)',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--accent)' : 'var(--ink)',
                    backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
                    textDecoration: 'none',
                  }}
                >
                  <span aria-hidden="true" style={{ fontSize: '1.2em' }}>{link.icon}</span>
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Preferences / Utilities */}
        <div style={{ marginTop: 'auto', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 'var(--space-3)', letterSpacing: '0.06em' }}>
            {isHi ? 'भाषा व प्राथमिकताएं' : 'Language & Preferences'}
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
            <button
              type="button"
              onClick={onToggleLang}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface-muted)',
                color: 'var(--ink)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              🌐 {isHi ? 'English में बदलें' : 'हिंदी में देखें'}
            </button>

            {currencies && (
              <select
                value={currency}
                onChange={(e) => onSetCurrency(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface-muted)',
                  color: 'var(--ink)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {Object.values(currencies).map(c => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
