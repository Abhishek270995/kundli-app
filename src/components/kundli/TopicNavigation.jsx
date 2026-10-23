import React, { useState } from 'react';
import Card from '../ui/Card';

export const TOPIC_GROUPS = [
  {
    id: 'core',
    icon: '📊',
    labelEn: 'Birth Chart & Planets',
    labelHi: 'लग्न व ग्रह चक्र',
    topics: [
      { id: 'chart', icon: '🔯', labelEn: 'Chart & Shodashvarga', labelHi: 'लग्न व वर्ग कुंडलियां' },
      { id: 'overview', icon: '🌟', labelEn: 'Overview & Panchang', labelHi: 'सिंहावलोकन व पंचांग' },
      { id: 'planets', icon: '🪐', labelEn: 'Planetary Dignities', labelHi: 'ग्रह स्थिति' },
      { id: 'houses', icon: '🏠', labelEn: '12 Houses (Bhavas)', labelHi: 'भाव विश्लेषण' },
      { id: 'shadbala', icon: '⚖️', labelEn: 'Shadbala & SAV', labelHi: 'षड्बल व अष्टकवर्ग' },
    ],
  },
  {
    id: 'predictions',
    icon: '🔮',
    labelEn: 'Predictions & Timing',
    labelHi: 'भविष्यफल व दशा',
    topics: [
      { id: 'predictions', icon: '⏳', labelEn: 'Dasha & Transits', labelHi: 'दशा व गोचर' },
      { id: 'careerTiming', icon: '💼', labelEn: 'Career & Wealth', labelHi: 'करियर व नौकरी' },
      { id: 'marriageTiming', icon: '💍', labelEn: 'Marriage & Spouse', labelHi: 'विवाह व दांपत्य' },
      { id: 'life', icon: '🌿', labelEn: 'Life Areas & Growth', labelHi: 'जीवन क्षेत्र' },
    ],
  },
  {
    id: 'remedies',
    icon: '🛡️',
    labelEn: 'Remedies & Yogas',
    labelHi: 'दोष व उपाय',
    topics: [
      { id: 'doshas', icon: '⚡', labelEn: 'Doshas & Auspicious Yogas', labelHi: 'दोष व योग निदान' },
      { id: 'lifeProblems', icon: '🛡️', labelEn: 'Problem Remedies', labelHi: 'समस्या निवारण' },
      { id: 'store', icon: '💎', labelEn: 'Gemstones & Lal Kitab', labelHi: 'रत्न व लाल किताब' },
    ],
  },
  {
    id: 'universal',
    icon: '🌐',
    labelEn: 'Compatibility & Calendar',
    labelHi: 'मिलान व पंचांग',
    topics: [
      { id: 'matchmaking', icon: '❤️', labelEn: 'Kundli Milan (36 Gunas)', labelHi: 'गुण मिलान' },
      { id: 'panchang', icon: '🕉️', labelEn: 'Panchang Today', labelHi: 'दैनिक पंचांग' },
      { id: 'muhurat', icon: '⏳', labelEn: 'Shubh Muhurat', labelHi: 'शुभ मुहूर्त' },
      { id: 'festivals', icon: '🪔', labelEn: 'Festivals & Vrat', labelHi: 'व्रत व त्यौहार' },
      { id: 'daily', icon: '☀️', labelEn: 'Daily Horoscope', labelHi: 'दैनिक राशिफल' },
      { id: 'forecast', icon: '📅', labelEn: 'Yearly Forecast', labelHi: 'वार्षिक राशिफल' },
      { id: 'consult', icon: '🧙‍♂️', labelEn: 'Talk to Astrologer', labelHi: 'ज्योतिषी परामर्श' },
    ],
  },
];

export default function TopicNavigation({
  activeTab,
  onSelectTab,
  lang,
}) {
  const isHi = lang === 'hi';

  // Find which group contains the activeTab
  const currentGroup = TOPIC_GROUPS.find(g => g.topics.some(t => t.id === activeTab)) || TOPIC_GROUPS[0];
  const [activeGroupId, setActiveGroupId] = useState(currentGroup.id);
  const [showAllDropdown, setShowAllDropdown] = useState(false);

  const displayGroup = TOPIC_GROUPS.find(g => g.id === activeGroupId) || currentGroup;

  const handleGroupClick = (groupId) => {
    setActiveGroupId(groupId);
    const grp = TOPIC_GROUPS.find(g => g.id === groupId);
    if (grp && !grp.topics.some(t => t.id === activeTab)) {
      onSelectTab(grp.topics[0].id);
    }
  };

  return (
    <nav
      aria-label="Chart Report Topics"
      style={{ marginBottom: 'var(--space-6)' }}
      className="topic-navigation-bar no-print"
    >
      {/* Group Level Buttons (4 Primary Pillars + Quick Jump Select) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-2)',
          borderBottom: '1px solid var(--border)',
          paddingBottom: 'var(--space-3)',
          marginBottom: 'var(--space-3)',
        }}
      >
        <div
          role="tablist"
          aria-label="Topic Categories"
          style={{
            display: 'flex',
            gap: 'var(--space-2)',
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {TOPIC_GROUPS.map((grp) => {
            const isGroupSelected = grp.id === activeGroupId;
            const containsActiveTab = grp.topics.some(t => t.id === activeTab);

            return (
              <button
                key={grp.id}
                type="button"
                role="tab"
                aria-selected={isGroupSelected}
                onClick={() => handleGroupClick(grp.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: isGroupSelected ? '1px solid var(--border-focus)' : '1px solid var(--border)',
                  backgroundColor: isGroupSelected ? 'var(--accent-light)' : 'var(--surface)',
                  color: isGroupSelected ? 'var(--accent)' : 'var(--ink)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: isGroupSelected ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all var(--transition-fast)',
                  boxShadow: isGroupSelected ? 'var(--shadow-xs)' : 'none',
                }}
              >
                <span aria-hidden="true">{grp.icon}</span>
                <span>{isHi ? grp.labelHi : grp.labelEn}</span>
                {containsActiveTab && !isGroupSelected && (
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent)',
                    }}
                    title="Active topic inside"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Dropdown for All 19 Topics */}
        <div style={{ position: 'relative' }}>
          <select
            aria-label={isHi ? 'सभी १९ विषय' : 'All 19 Topics'}
            value={activeTab}
            onChange={(e) => {
              const selectedId = e.target.value;
              const parent = TOPIC_GROUPS.find(g => g.topics.some(t => t.id === selectedId));
              if (parent) setActiveGroupId(parent.id);
              onSelectTab(selectedId);
            }}
            style={{
              padding: '6px 12px',
              fontSize: 'var(--text-xs)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface-muted)',
              color: 'var(--ink)',
              fontWeight: 600,
              cursor: 'pointer',
              width: 'auto',
            }}
          >
            <option value="" disabled>
              {isHi ? '✦ समस्त १९ विषय...' : '✦ Jump to any topic (19)...'}
            </option>
            {TOPIC_GROUPS.map((grp) => (
              <optgroup key={grp.id} label={`${grp.icon} ${isHi ? grp.labelHi : grp.labelEn}`}>
                {grp.topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.icon} {isHi ? t.labelHi : t.labelEn}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      {/* Focused Sub-topics Pills for Active Group */}
      <div
        role="tablist"
        aria-label="Section Topics"
        style={{
          display: 'flex',
          gap: 'var(--space-2)',
          overflowX: 'auto',
          padding: 'var(--space-1) 0',
          scrollbarWidth: 'none',
        }}
      >
        {displayGroup.topics.map((topic) => {
          const isActive = topic.id === activeTab;
          return (
            <button
              key={topic.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectTab(topic.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                border: isActive ? '1px solid var(--accent)' : '1px solid var(--border)',
                backgroundColor: isActive ? 'var(--accent)' : 'var(--surface)',
                color: isActive ? '#FFFFFF' : 'var(--ink-secondary)',
                fontSize: 'var(--text-sm)',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)',
              }}
            >
              <span aria-hidden="true">{topic.icon}</span>
              <span>{isHi ? topic.labelHi : topic.labelEn}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
