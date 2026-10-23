import React, { useState } from 'react';
import PrimaryNavigation from './PrimaryNavigation';
import MobileNavigation from './MobileNavigation';

export default function AppHeader({
  currentSection,
  onNavigate,
  lang,
  onToggleLang,
  currency,
  onSetCurrency,
  currencies,
  isAdmin,
  onOpenAdmin,
  handleSecretTrigger,
  hasResult,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isHi = lang === 'hi';

  return (
    <header
      className="site-header no-print"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div
        className="app-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
          gap: 'var(--space-4)',
        }}
      >
        {/* Logo & Brand Link */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('kundli', e);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: 'var(--ink)',
            flexShrink: 0,
          }}
          aria-label="Jyotish Paramarsh Home"
        >
          <img
            src="/logo.webp"
            alt="Jyotish Paramarsh Logo"
            width="36"
            height="36"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '1.5px solid var(--accent)',
              objectFit: 'cover',
            }}
          />
          <div>
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '15px',
                fontWeight: 800,
                color: 'var(--brand)',
                letterSpacing: '0.04em',
                lineHeight: 1.1,
              }}
            >
              JYOTISH PARAMARSH
            </div>
            <div
              style={{
                fontSize: '11px',
                color: 'var(--ink-muted)',
                fontWeight: 500,
                display: 'none',
              }}
              className="header-tagline-desktop"
            >
              {isHi ? 'वैदिक ज्योतिष एवं मार्गदर्शन' : 'Vedic Astrology & Life Guidance'}
            </div>
          </div>
        </a>

        {/* Desktop Primary Navigation */}
        <div className="header-nav-desktop" style={{ display: 'none' }}>
          <PrimaryNavigation
            currentSection={currentSection}
            onNavigate={onNavigate}
            lang={lang}
            hasResult={hasResult}
          />
        </div>

        {/* Right Utility Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {isAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              style={{
                backgroundColor: 'var(--accent)',
                color: '#FFF',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              title="Admin VIP Mode Active"
            >
              <span>👑</span> VIP
            </button>
          )}

          {/* Currency Select - Desktop */}
          {currencies && (
            <select
              id="header-currency-select"
              aria-label="Currency"
              value={currency}
              onChange={(e) => onSetCurrency(e.target.value)}
              className="header-currency-desktop"
              style={{
                display: 'none',
                padding: '5px 8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface-muted)',
                color: 'var(--ink)',
                fontSize: 'var(--text-xs)',
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

          {/* Language Toggle */}
          <button
            type="button"
            onClick={onToggleLang}
            aria-label={isHi ? 'Switch to English' : 'हिंदी में बदलें'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface-muted)',
              color: 'var(--ink)',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            <span>{isHi ? 'EN' : 'हिन्दी'}</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label="Open navigation menu"
            className="mobile-nav-trigger"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              padding: '6px',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--surface)',
              color: 'var(--ink)',
              cursor: 'pointer',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentSection={currentSection}
        onNavigate={onNavigate}
        lang={lang}
        onToggleLang={onToggleLang}
        currency={currency}
        onSetCurrency={onSetCurrency}
        currencies={currencies}
        hasResult={hasResult}
      />

      <style>{`
        @media (min-width: 900px) {
          .header-nav-desktop {
            display: flex !important;
          }
          .header-tagline-desktop {
            display: block !important;
          }
          .header-currency-desktop {
            display: inline-block !important;
          }
          .mobile-nav-trigger {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
