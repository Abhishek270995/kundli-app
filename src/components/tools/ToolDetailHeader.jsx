import React, { useState } from 'react';
import Button from '../ui/Button';

export default function ToolDetailHeader({
  tool,
  isHi,
  onBack,
  onCopyUrl,
  hasCopied,
}) {
  return (
    <div
      style={{
        marginBottom: 'var(--space-6)',
        borderBottom: '1px solid var(--border)',
        paddingBottom: 'var(--space-4)',
      }}
      className="tool-detail-header"
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-4)',
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: 0,
          }}
        >
          <span>←</span>
          <span>{isHi ? 'समस्त २१ ज्योतिष टूल्स पर वापस जाएं' : 'Back to all 21 tools'}</span>
        </button>

        <Button
          variant="secondary"
          size="sm"
          onClick={onCopyUrl}
          icon="🔗"
        >
          {hasCopied
            ? (isHi ? '✓ लिंक कॉपी हो गया' : '✓ Copied Tool Link')
            : (isHi ? 'टूल लिंक शेयर करें' : 'Share Tool')}
        </Button>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
        <span style={{ fontSize: '2.5rem' }} aria-hidden="true">{tool.icon}</span>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--accent)',
                letterSpacing: '0.06em',
              }}
            >
              {tool.category.toUpperCase()} ASTROLOGY
            </span>
            {tool.badge && (
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  backgroundColor: 'var(--surface-muted)',
                  border: '1px solid var(--border)',
                  color: 'var(--ink-secondary)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 600,
                }}
              >
                {tool.badge}
              </span>
            )}
          </div>
          <h1
            style={{
              fontSize: 'clamp(1.5rem, 3vw, var(--text-2xl))',
              fontWeight: 800,
              color: 'var(--ink)',
              margin: '0 0 var(--space-2) 0',
            }}
          >
            {isHi ? tool.titleHi : tool.titleEn}
          </h1>
          <p
            style={{
              fontSize: 'var(--text-base)',
              color: 'var(--ink-secondary)',
              maxWidth: '800px',
              margin: 0,
              lineHeight: 'var(--leading-normal)',
            }}
          >
            {isHi ? tool.descHi : tool.descEn}
          </p>
        </div>
      </div>
    </div>
  );
}
