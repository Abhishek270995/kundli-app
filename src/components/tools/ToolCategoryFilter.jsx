import React from 'react';

export default function ToolCategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  isHi,
  totalMatching,
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'var(--space-3)',
        marginBottom: 'var(--space-6)',
      }}
      className="tool-category-filter-bar"
    >
      <div
        role="tablist"
        aria-label="Tool Categories"
        style={{
          display: 'flex',
          gap: 'var(--space-2)',
          overflowX: 'auto',
          paddingBottom: '4px',
          scrollbarWidth: 'none',
        }}
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectCategory(cat.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: isSelected ? '1px solid var(--border-focus)' : '1px solid var(--border)',
                backgroundColor: isSelected ? 'var(--accent)' : 'var(--surface)',
                color: isSelected ? '#FFFFFF' : 'var(--ink-secondary)',
                fontSize: 'var(--text-sm)',
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)',
              }}
            >
              <span aria-hidden="true">{cat.icon}</span>
              <span>{isHi ? cat.labelHi : cat.labelEn}</span>
            </button>
          );
        })}
      </div>

      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', fontWeight: 600 }}>
        {isHi ? `${totalMatching} टूल्स प्रदर्शित` : `Showing ${totalMatching} tools`}
      </div>
    </div>
  );
}
