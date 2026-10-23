import React from 'react';

export default function ToolSearch({
  query,
  onQueryChange,
  isHi,
  className = '',
}) {
  return (
    <div style={{ marginBottom: 'var(--space-6)', width: '100%', maxWidth: '640px' }} className={`tool-search ${className}`}>
      <label
        htmlFor="tool-search-input"
        style={{
          display: 'block',
          fontSize: 'var(--text-sm)',
          fontWeight: 700,
          color: 'var(--ink)',
          marginBottom: 'var(--space-2)',
        }}
      >
        🔍 {isHi ? 'ज्योतिष टूल्स में खोजें (२१ कैलकुलेटर)' : 'Search 21 Astrology Calculators'}
      </label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          id="tool-search-input"
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={isHi ? 'उदा. विंशोत्तरी, केपी, मूलांक, मुहूर्त, गोचर...' : 'e.g. Vimshottari, KP sublord, Numerology, Prashna, Tara Bala...'}
          style={{
            paddingLeft: 'var(--space-8)',
            paddingRight: query ? 'var(--space-8)' : 'var(--space-4)',
          }}
        />
        <span
          style={{
            position: 'absolute',
            left: '12px',
            color: 'var(--ink-muted)',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          🔍
        </span>
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange('')}
            aria-label="Clear search"
            style={{
              position: 'absolute',
              right: '10px',
              background: 'none',
              border: 'none',
              color: 'var(--ink-muted)',
              fontSize: 'var(--text-base)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
