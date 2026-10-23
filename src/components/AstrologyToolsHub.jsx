import React, { useState, useMemo, useEffect } from "react";
import {
  KP_249_TABLE,
  getKpSubLord,
  calculateKpChart,
  calculateKpHorary,
  calculateKpRulingPlanets,
  calculateLifePathNumber,
  calculateNameNumerology,
  calculatePersonalYearAndMonth,
  calculateNumberCompatibility,
  calculateTaraBala,
  calculateChandraBala,
  getPrashnaQuickOracle,
  calculatePanchaPakshi
} from "../tools/astrologyToolsEngine.js";

import {
  calculatePlanets,
  calculateAscendant,
  getNakshatraInfo,
  getSignIndex,
  SIGNS,
  NAKSHATRAS,
  calculateDailyPanchang,
  MAJOR_INDIAN_CITIES
} from "../jyotishEngine.js";

import {
  calculateDetailedDashas,
  buildDivisionalChartData,
  calculateShadbala,
  calculateSarvashtakavarga,
  calculateCurrentGochara,
  VIMSHOTTARI_YEARS,
  DASHA_ORDER,
  SHODASHVARGA_LIST
} from "../vedicComprehensiveEngine.js";

// ── TOOL DEFINITIONS (5 CATEGORIES, 21 TOOLS) ───────────────────────────
// ── CATEGORY METADATA (5 CATEGORIES) ────────────────────────────────────
export const TOOL_CATEGORIES = [
  { id: "all", labelEn: "All Instruments (21)", labelHi: "समस्त साधन (२१)", icon: "✦" },
  { id: "vedic", labelEn: "Vedic Jyotish (5)", labelHi: "वैदिक ज्योतिष (५)", icon: "🔯" },
  { id: "kp", labelEn: "KP Astrology (4)", labelHi: "कृष्णमूर्ति पद्धति - KP (४)", icon: "🧭" },
  { id: "numerology", labelEn: "Vedic Numerology (4)", labelHi: "अंक ज्योतिष (४)", icon: "🔢" },
  { id: "daily", labelEn: "Daily Panchang & Muhurat (4)", labelHi: "दैनिक पंचांग व मुहूर्त (४)", icon: "☀️" },
  { id: "decision", labelEn: "Prashna & Cosmic Guidance (4)", labelHi: "प्रश्न ज्योतिष व निर्णय सिद्धि (४)", icon: "🎯" }
];

export const CATEGORY_CARDS = [
  {
    id: "vedic",
    titleEn: "Vedic Jyotish",
    titleHi: "वैदिक ज्योतिष",
    subtitleEn: "Kundali, Dasha, Transits",
    subtitleHi: "कुंडली, विंशोत्तरी दशा, गोचर",
    count: 5,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3a9 9 0 0 1 9 9" />
        <circle cx="12" cy="12" r="3" />
        <circle cx="19" cy="8" r="1.5" fill="#D4AF37" />
      </svg>
    )
  },
  {
    id: "kp",
    titleEn: "KP Astrology",
    titleHi: "कृष्णमूर्ति पद्धति (KP)",
    subtitleEn: "Sub-lords, Horary, Significators",
    subtitleHi: "उप-स्वामी, प्रश्न ज्योतिष, भाव कारक",
    count: 4,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    )
  },
  {
    id: "numerology",
    titleEn: "Vedic Numerology",
    titleHi: "अंक ज्योतिष",
    subtitleEn: "Life Path, Name Numbers",
    subtitleHi: "मूलांक, भाग्यांक, नामांक",
    count: 4,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="9" x2="20" y2="9" />
        <line x1="4" y1="15" x2="20" y2="15" />
        <line x1="10" y1="3" x2="8" y2="21" />
        <line x1="16" y1="3" x2="14" y2="21" />
      </svg>
    )
  },
  {
    id: "daily",
    titleEn: "Panchang & Muhurat",
    titleHi: "पंचांग व शुभ मुहूर्त",
    subtitleEn: "Panchang, Muhurat, Choghadiya",
    subtitleHi: "पंचांग, शुभ मुहूर्त, चौघड़िया",
    count: 4,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="3" ry="3" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <circle cx="12" cy="15" r="2" />
      </svg>
    )
  },
  {
    id: "decision",
    titleEn: "Prashna & Decision Guidance",
    titleHi: "प्रश्न ज्योतिष व निर्णय सिद्धि",
    subtitleEn: "Prashna, Tara Bala, Hora Compass",
    subtitleHi: "प्रश्न विचार, तारा बल, ग्रह होरा",
    count: 4,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="rgba(212,175,55,0.2)" />
      </svg>
    )
  }
];

export const TOOLS_CATALOG = [
  // ── 1. VEDIC ASTROLOGY TOOLS ──
  {
    id: "vimshottari",
    slug: "vimshottari-dasha",
    category: "vedic",
    priority: "HIGH PRIORITY",
    icon: "⏳",
    titleEn: "Vimshottari Dasha Calculator",
    titleHi: "विंशोत्तरी महादशा एवं अंतर्दशा कैलकुलेटर",
    descEn: "Calculate your 120-year Vimshottari Mahadasha, Antardasha, and Pratyantardasha periods with start-end dates, planetary lords, and traditional timing predictions.",
    descHi: "अपने जन्म नक्षत्र के आधार पर संपूर्ण १२० वर्षीय विंशोत्तरी महादशा, अंतर्दशा एवं प्रत्यंतर्दशा की सटीक समय-सीमा व फलकथन जानें।",
    badge: "120-Year Timeline"
  },
  {
    id: "divisional",
    slug: "divisional-charts",
    category: "vedic",
    priority: "ADVANCED",
    icon: "📊",
    titleEn: "Divisional Chart Generator (Shodashvarga)",
    titleHi: "षोडशवर्ग कुंडली चक्र (D9, D10, D7, D12, D60)",
    descEn: "Generate D9 Navamsha (marriage & soul), D10 Dashamsha (career & fame), D7 Saptamsha, D12, D30, and D60 Shashtiamsha with house placements.",
    descHi: "D9 नवमांश (विवाह व धर्म), D10 दशमांश (करियर व यश), D7, D12, D30 एवं D60 षष्ट्यंश वर्ग कुंडलियों का गहन शास्त्रीय विश्लेषण।",
    badge: "16 Varga Charts"
  },
  {
    id: "ashtakavarga",
    slug: "ashtakavarga-calculator",
    category: "vedic",
    priority: "ADVANCED",
    icon: "⚖️",
    titleEn: "Ashtakavarga & SAV Calculator",
    titleHi: "सर्वाष्टकवर्ग (SAV) एवं भिन्नाष्टकवर्ग कैलकुलेटर",
    descEn: "Compute Sarvashtakavarga (SAV) 337 bindus and 7-planet Bhinnashtakavarga (BAV). Identify auspicious signs (>28 points) for transits and life milestones.",
    descHi: "१२ राशियों में ३३७ बिंदुओं का सर्वाष्टकवर्ग एवं ७ ग्रहों का भिन्नाष्टकवर्ग वितरण। गोचर व कार्य सिद्धि के श्रेष्ठ भावों की पहचान।",
    badge: "337 Bindu Matrix"
  },
  {
    id: "gochar",
    slug: "gochar-transit-calculator",
    category: "vedic",
    priority: "POPULAR",
    icon: "🪐",
    titleEn: "Gochar & Transit Impact Calculator",
    titleHi: "दैनिक गोचर एवं साढ़ेसाती प्रभाव कैलकुलेटर",
    descEn: "Track real-time planetary transits (Saturn, Jupiter, Rahu, Ketu, Mars) relative to your natal Moon sign and Lagna, with Sade Sati phase interpretations.",
    descHi: "वर्तमान में शनि, गुरु, राहु-केतु के वास्तविक गोचर की अपनी चंद्र राशि व लग्न से स्थिति, साढ़ेसाती चरण एवं तात्कालिक प्रभाव जानें।",
    badge: "Live Ephemeris"
  },
  {
    id: "shadbala",
    slug: "planetary-strength-calculator",
    category: "vedic",
    priority: "TECHNICAL",
    icon: "💪",
    titleEn: "Planetary Strength & Shadbala Calculator",
    titleHi: "षड्बल एवं ग्रह बल सामर्थ्य कैलकुलेटर",
    descEn: "Calculate Sthana, Dig, Kala, Cheshta, Naisargika, and Drik Bala in Rupas. Evaluate which planets are strong, neutral, or require astrological remedies.",
    descHi: "ग्रहों के ६ बलों (स्थान, दिग्, काल, चेष्टा, नैसर्गिक, दृग्बल) की रूपा में शास्त्रीय गणना एवं कौन सा ग्रह आपकी कुंडली में सर्वाधिक बली है।",
    badge: "6-Fold Strength"
  },

  // ── 2. KP ASTROLOGY TOOLS ──
  {
    id: "kp_chart",
    slug: "kp-chart-calculator",
    category: "kp",
    priority: "VERY HIGH",
    icon: "🧭",
    titleEn: "KP Chart & Sub-Lord Calculator",
    titleHi: "केपी कुंडली एवं उप-स्वामी (Sub-Lord) कैलकुलेटर",
    descEn: "Generate Krishnamurti Paddhati (KP) planetary coordinates, 12 house cusps, Nakshatra Star Lords, and Sub-Lords based on exact Placidus divisions.",
    descHi: "कृष्णमूर्ति पद्धति (KP) के अनुसार सभी १२ भाव संधियों, नवग्रहों के नक्षत्र स्वामी एवं उप-स्वामी (Sub-Lord) की सूक्ष्म गणना।",
    badge: "Sub-Lord Precision"
  },
  {
    id: "kp_significators",
    slug: "kp-house-significator",
    category: "kp",
    priority: "KP CORE",
    icon: "🎯",
    titleEn: "KP 4-Fold House Significator Analyzer",
    titleHi: "केपी ४-स्तरीय भाव कारक (Significator) विश्लेषक",
    descEn: "Analyze Level A, B, C, D significators for specific life domains: Career (2, 6, 10, 11), Marriage (2, 7, 11), Property (4, 11, 12), and Childbirth (2, 5, 11).",
    descHi: "करियर, विवाह, संपत्ति एवं संतान हेतु KP ४-स्तरीय भाव कारकों (Level A to D) का सूक्ष्म विश्लेषण एवं घटना समय निर्धारण।",
    badge: "4-Level Signification"
  },
  {
    id: "kp_horary",
    slug: "kp-horary-calculator",
    category: "kp",
    priority: "HIGH PRIORITY",
    icon: "🔮",
    titleEn: "KP Horary 1–249 Prashna Calculator",
    titleHi: "केपी प्रश्न कुंडली १–२४९ कैलकुलेटर",
    descEn: "Enter a horary query number from 1 to 249 to generate an instantaneous KP Prashna chart with Ascendant Sub-Lord and house fruition verdict.",
    descHi: "१ से २४९ में से कोई भी संख्या चुनकर तत्काल प्रश्न कुंडली तैयार करें और अपने कार्य की सफलता व समय-सीमा का उत्तर पाएं।",
    badge: "Horary 1 to 249"
  },
  {
    id: "kp_ruling",
    slug: "kp-ruling-planets",
    category: "kp",
    priority: "PRACTITIONER",
    icon: "👑",
    titleEn: "KP Ruling Planets (RP) Calculator",
    titleHi: "केपी सत्तारूढ़ ग्रह (Ruling Planets) कैलकुलेटर",
    descEn: "Compute the cosmic Ruling Planets at the exact moment of inquiry: Lagna Sign/Star/Sub Lord, Moon Sign/Star/Sub Lord, and Weekday Lord.",
    descHi: "प्रश्न क्षण के तात्कालिक सत्तारूढ़ ग्रहों (लग्न, चंद्र एवं वार स्वामियों) की गणना, जिसका उपयोग सटीक समय निर्धारण में होता है।",
    badge: "Instant RP Matrix"
  },

  // ── 3. NUMEROLOGY TOOLS ──
  {
    id: "lifepath",
    slug: "life-path-number",
    category: "numerology",
    priority: "POPULAR",
    icon: "🌟",
    titleEn: "Life Path Number Calculator",
    titleHi: "मूलांक व भाग्यांक (Life Path) कैलकुलेटर",
    descEn: "Calculate your core Life Path Number from your birth date with step-by-step reduction, Master Numbers (11, 22, 33) detection, and soul archetype guide.",
    descHi: "जन्म तिथि से अपने मूलांक व भाग्यांक की गणना, मास्टर नंबर (११, २२, ३३) की पहचान एवं जीवन के मुख्य उद्देश्य का विस्तृत मार्गदर्शन।",
    badge: "Master Numbers 11/22/33"
  },
  {
    id: "name_numerology",
    slug: "name-numerology",
    category: "numerology",
    priority: "RECOMMENDED",
    icon: "🔤",
    titleEn: "Name Numerology (Chaldean & Pythagorean)",
    titleHi: "नाम अंकशास्त्र (काल्डियन व पाइथागोरियन पद्धति)",
    descEn: "Analyze any personal, business, or brand name with letter-by-letter vibrational values. Calculate Expression, Soul Urge (vowels), and Personality numbers.",
    descHi: "अपने नाम, व्यवसाय या ब्रांड के अक्षरों की काल्डियन व पाइथागोरियन गणना। नामांक, आत्मांक (Soul Urge) व व्यक्तित्व अंक जानें।",
    badge: "Chaldean + Pythagorean"
  },
  {
    id: "personal_year",
    slug: "personal-year-month",
    category: "numerology",
    priority: "TIMING",
    icon: "📅",
    titleEn: "Personal Year & Personal Month Calculator",
    titleHi: "व्यक्तिगत वर्ष व माह चक्र (Personal Year Cycle)",
    descEn: "Discover which stage of the universal 9-year epicycle you are currently navigating (from Year 1: Seed Planting to Year 9: Harvest & Release).",
    descHi: "वर्तमान में आप ९-वर्षीय जीवन चक्र के किस वर्ष में हैं (आरंभ, विस्तार, परिश्रम, परिवर्तन या पूर्णता) और यह माह आपके लिए कैसा रहेगा।",
    badge: "9-Year Epicycle"
  },
  {
    id: "compatibility",
    slug: "lucky-number-compatibility",
    category: "numerology",
    priority: "POPULAR",
    icon: "❤️",
    titleEn: "Lucky Numbers & Number Compatibility Tool",
    titleHi: "शुभ अंक एवं अंक अनुकूलता (Number Compatibility)",
    descEn: "Explore your ruling planet numbers, friendly vs enemy numbers, and test date-to-date resonance score with your spouse, business partner, or lucky dates.",
    descHi: "अपने मित्र व शत्रु अंक जानें तथा दो जन्म तिथियों के मध्य अंक अनुकूलता (Compatibility Score %) का परीक्षण करें।",
    badge: "Resonance Matrix"
  },

  // ── 4. DAILY ASTROLOGY & PRACTICAL TOOLS ──
  {
    id: "choghadiya",
    slug: "choghadiya-calculator",
    category: "daily",
    priority: "DAILY USE",
    icon: "🕉️",
    titleEn: "Choghadiya Calculator (Day & Night)",
    titleHi: "दैनिक चौघड़िया मुहूर्त (दिन व रात्रि)",
    descEn: "View daily 8-slot Day and Night Choghadiya (Amrit, Shubh, Labh, Char, Rog, Kaal, Udveg) with real-time LIVE indicator for your exact location.",
    descHi: "आज का दिन व रात्रि चौघड़िया: अमृत, शुभ, लाभ, चर, रोग, काल व उद्वेग मुहूर्त। वर्तमान में कौन सा चौघड़िया चल रहा है, लाइव देखें।",
    badge: "Live Active Slot"
  },
  {
    id: "rahu_kaal",
    slug: "rahu-kaal-calculator",
    category: "daily",
    priority: "ESSENTIAL",
    icon: "⏱️",
    titleEn: "Rahu Kaal, Yamaganda & Gulika Calculator",
    titleHi: "राहुकाल, यमगंड एवं गुलिक काल कैलकुलेटर",
    descEn: "Location-based calculation of daily inauspicious time bands based on astronomical sunrise and sunset with live status and cautionary guidance.",
    descHi: "सूर्योदय व सूर्यास्त आधारित सटीक दैनिक राहुकाल, यमगंड एवं गुलिक काल समय-सारिणी। क्या अभी राहुकाल प्रभावी है?",
    badge: "Astronomical Precision"
  },
  {
    id: "muhurat_finder",
    slug: "personalized-muhurat-finder",
    category: "daily",
    priority: "HIGH VALUE",
    icon: "✨",
    titleEn: "Personalized Shubh Muhurat Finder",
    titleHi: "शुभ मुहूर्त अन्वेषक (विवाह, गृह प्रवेश, वाहन, व्यापार)",
    descEn: "Filter the best auspicious windows in the next 7, 15, or 30 days for Marriage, House Warming, Vehicle Purchase, Business Launch, or Naming Ceremonies.",
    descHi: "आगामी ७, १५ या ३० दिनों में विवाह, गृह प्रवेश, वाहन क्रय, व्यापार आरंभ एवं नामकरण संस्कार हेतु श्रेष्ठ मुहूर्तों की सूची।",
    badge: "Event-Specific Filter"
  },
  {
    id: "daily_transit",
    slug: "daily-transit-horoscope",
    category: "daily",
    priority: "REPEAT VISIT",
    icon: "🌅",
    titleEn: "Personalized Daily Transit Horoscope",
    titleHi: "व्यक्तिगत दैनिक गोचर राशिफल (चंद्र राशि व लग्न आधारित)",
    descEn: "Replace generic sun-sign horoscopes with a custom daily reading derived from today's active Moon transit relative to your birth chart.",
    descHi: "सामान्य अखबारों के सूर्य-राशिफल के स्थान पर आपकी जन्म चंद्र राशि एवं लग्न पर आज के ग्रहों के गोचर से तैयार व्यक्तिगत भविष्यफल।",
    badge: "Natal-Based Transit"
  },

  // ── 5. PERSONAL DECISION TOOLS ──
  {
    id: "prashna_oracle",
    slug: "prashna-quick-oracle",
    category: "decision",
    priority: "INSTANT",
    icon: "🧭",
    titleEn: "Prashna / Horary Quick Decision Oracle",
    titleHi: "प्रश्न ज्योतिष त्वरित निर्णय ओरेकल (Yes/No & Timing)",
    descEn: "Need clarity on an immediate decision? Query the cosmos right now to analyze current planetary hour (Hora) and Ascendant dignity for an instant verdict.",
    descHi: "क्या मैं यह कार्य अभी करूं? वर्तमान क्षण की ग्रह होरा एवं लग्न बल के आधार पर तुरंत 'हां / थोड़ा ठहरें / सावधानी बरतें' का उत्तर प्राप्त करें।",
    badge: "Instant Cosmic Verdict"
  },
  {
    id: "tara_chandra",
    slug: "tarabala-chandrabala",
    category: "decision",
    priority: "CLASSICAL",
    icon: "⭐",
    titleEn: "Tara Bala & Chandra Bala Activity Chooser",
    titleHi: "तारा बल एवं चंद्र बल कार्य सिद्धि परीक्षक",
    descEn: "Check whether today's Moon and Nakshatra form an auspicious Tara (Sampat, Kshema, Sadhana, Mitra) for signing contracts, travel, or investments.",
    descHi: "अपने जन्म नक्षत्र से आज के नक्षत्र का ९ ताराओं (सम्पत, क्षेम, साधना, मित्र) में परीक्षण करें कि आज का दिन आपके लिए कितना अनुकूल है।",
    badge: "Tara 1 to 9 & Chandra"
  },
  {
    id: "pancha_pakshi",
    slug: "pancha-pakshi-calculator",
    category: "decision",
    priority: "ESOTERIC",
    icon: "🦚",
    titleEn: "Pancha Pakshi Decision Biorhythm Tool",
    titleHi: "पंच पक्षी समय चक्र (प्राचीन दक्षिण भारतीय पद्धति)",
    descEn: "Ancient Tamil 5 Cosmic Birds system (Peacock, Rooster, Crow, Owl, Vulture). Pinpoint your bird's ruling hours (Eating, Walking, Sitting, Sleeping, Dying).",
    descHi: "प्राचीन तमिल पंच पक्षी प्रणाली द्वारा अपने जन्म पक्षी के ५ कार्यों (भोजन, गमन, राज्य, निद्रा, मरण) के आधार पर शुभ समय का चुनाव करें।",
    badge: "5 Cosmic Birds"
  },
  {
    id: "cosmic_compass",
    slug: "cosmic-decision-compass",
    category: "decision",
    priority: "PRACTICAL",
    icon: "🧭",
    titleEn: "Planetary Hora Compass (24-Hour Guide)",
    titleHi: "२४ घंटे की ग्रह होरा चक्र (Planetary Hora Compass)",
    descEn: "Explore the 24 hourly planetary vibrations from sunrise to sunrise. Learn the best hours for finance (Jupiter), negotiations (Venus), tech (Mercury), or rest.",
    descHi: "सूर्योदय से लेकर २४ घंटों की ग्रह होरा (सूर्य, शुक्र, बुध, चंद्र, शनि, गुरु, मंगल) एवं किस होरा में कौन सा कार्य सर्वोत्तम फल देता है।",
    badge: "24 Hourly Horas"
  }
];

// Helper to extract active tool from current window location path
export const getToolFromPath = () => {
  try {
    const rawPath = (window.location.pathname || "").replace(/^\/+|\/+$/g, '').toLowerCase();
    const parts = rawPath.split('/');
    if (parts.length >= 2 && (parts[0] === "astrology-tools" || parts[0] === "tools")) {
      const slug = parts[1];
      const match = TOOLS_CATALOG.find(t => t.slug === slug || t.id === slug);
      if (match) return match;
    }
    const params = new URLSearchParams(window.location.search);
    const toolParam = params.get("tool");
    if (toolParam) {
      const match = TOOLS_CATALOG.find(t => t.slug === toolParam.toLowerCase() || t.id === toolParam.toLowerCase());
      if (match) return match;
    }
  } catch (e) {}
  return null;
};

export default function AstrologyToolsHub({
  initialUserBirth = null,
  lang = "en",
  onBackToHome = () => {},
  onSelectTab = () => {}
}) {
  const isHi = lang === "hi";

  // Active Tool State (null = Landing Hub View, string = Dedicated Tool View)
  const [activeToolId, setActiveToolId] = useState(() => {
    const fromPath = getToolFromPath();
    return fromPath ? fromPath.id : null;
  });

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(false);

  // User form / inherited Kundli birth data
  const [userData, setUserData] = useState(() => {
    if (initialUserBirth && initialUserBirth.dob) {
      return {
        name: initialUserBirth.name || "Seeker",
        dob: initialUserBirth.dob || "1995-09-27",
        tob: initialUserBirth.tob || "10:30",
        pob: initialUserBirth.pob || "New Delhi, India",
        lat: initialUserBirth.lat || 28.6139,
        lon: initialUserBirth.lon || 77.2090
      };
    }
    return {
      name: "Rahul Sharma",
      dob: "1995-09-27",
      tob: "10:30",
      pob: "New Delhi, India",
      lat: 28.6139,
      lon: 77.2090
    };
  });

  // Tool Specific Interactive States
  const [selectedDivisionalChart, setSelectedDivisionalChart] = useState("D9");
  const [horaryNumberInput, setHoraryNumberInput] = useState(72);
  const [horaryQueryTopic, setHoraryQueryTopic] = useState("career");
  const [nameNumerologyInput, setNameNumerologyInput] = useState(userData.name || "Rahul Sharma");
  const [partnerDobInput, setPartnerDobInput] = useState("1996-05-14");
  const [selectedMuhuratEvent, setSelectedMuhuratEvent] = useState("vivah");
  const [prashnaQuestionInput, setPrashnaQuestionInput] = useState(isHi ? "क्या मुझे इस प्रस्ताव को स्वीकार करना चाहिए?" : "Should I accept this career opportunity?");
  const [selectedTargetDate, setSelectedTargetDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [selectedCity, setSelectedCity] = useState(MAJOR_INDIAN_CITIES[0]);

  // Sync state with browser URL & popstate (Back/Forward navigation)
  useEffect(() => {
    const syncFromUrl = () => {
      const tool = getToolFromPath();
      if (tool) {
        setActiveToolId(tool.id);
        document.title = `${isHi ? tool.titleHi : tool.titleEn} — Jyotish Paramarsh`;
      } else {
        setActiveToolId(null);
        document.title = isHi
          ? "वैदिक ज्योतिष गणना केंद्र एवं दिव्य साधन | ज्योतिष परामर्श"
          : "Vedic Astrology Calculators & Divine Jyotish Instruments | Jyotish Paramarsh";
      }
    };

    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [isHi]);

  // Filtered tools
  const filteredTools = useMemo(() => {
    return TOOLS_CATALOG.filter(tool => {
      const matchCat = selectedCategory === "all" || tool.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        tool.titleEn.toLowerCase().includes(q) ||
        tool.titleHi.toLowerCase().includes(q) ||
        tool.descEn.toLowerCase().includes(q) ||
        tool.descHi.toLowerCase().includes(q) ||
        tool.slug.toLowerCase().includes(q) ||
        tool.badge.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Active Tool Object
  const activeTool = useMemo(() => {
    if (!activeToolId) return null;
    return TOOLS_CATALOG.find(t => t.id === activeToolId) || null;
  }, [activeToolId]);

  // Related tools in same category
  const relatedTools = useMemo(() => {
    if (!activeTool) return [];
    return TOOLS_CATALOG.filter(t => t.category === activeTool.category && t.id !== activeTool.id);
  }, [activeTool]);

  // Calculated Core Vedic & Planetary Data for the User
  const corePlanets = useMemo(() => {
    try {
      const birthDate = new Date(`${userData.dob}T${userData.tob || "12:00"}`);
      return calculatePlanets(birthDate);
    } catch (e) {
      return calculatePlanets(new Date());
    }
  }, [userData.dob, userData.tob]);

  const ascendantDegree = useMemo(() => {
    try {
      const birthDate = new Date(`${userData.dob}T${userData.tob || "12:00"}`);
      return calculateAscendant(birthDate, userData.lat, userData.lon);
    } catch (e) {
      return 120.0;
    }
  }, [userData.dob, userData.tob, userData.lat, userData.lon]);

  // Daily Panchang Data
  const dailyPanchangData = useMemo(() => {
    try {
      return calculateDailyPanchang({
        dateStr: selectedTargetDate,
        lat: selectedCity.lat,
        lon: selectedCity.lon,
        cityName: isHi ? selectedCity.nameHi : selectedCity.name,
        lang
      });
    } catch (e) {
      return null;
    }
  }, [selectedTargetDate, selectedCity, lang, isHi]);

  // Navigation handlers
  const handleSelectTool = (toolOrId, e = null) => {
    if (e && e.preventDefault) e.preventDefault();
    const tool = typeof toolOrId === "string"
      ? TOOLS_CATALOG.find(t => t.id === toolOrId || t.slug === toolOrId)
      : toolOrId;
    if (!tool) return;
    setActiveToolId(tool.id);
    const targetUrl = `/astrology-tools/${tool.slug}`;
    try {
      if (window.location.pathname !== targetUrl) {
        window.history.pushState({ tool: tool.slug }, "", targetUrl);
      }
    } catch (err) {}
    document.title = `${isHi ? tool.titleHi : tool.titleEn} — Jyotish Paramarsh`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToHub = (e = null) => {
    if (e && e.preventDefault) e.preventDefault();
    setActiveToolId(null);
    try {
      if (window.location.pathname !== "/astrology-tools") {
        window.history.pushState({ tool: null }, "", "/astrology-tools");
      }
    } catch (err) {}
    document.title = isHi
      ? "वैदिक ज्योतिष गणना केंद्र एवं दिव्य साधन | ज्योतिष परामर्श"
      : "Vedic Astrology Calculators & Divine Jyotish Instruments | Jyotish Paramarsh";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryCardClick = (catId) => {
    setSelectedCategory(catId);
    const el = document.getElementById("astrology-tools-directory");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCopyToolUrl = (slug) => {
    try {
      const fullUrl = `https://www.jyotishparamash.com/astrology-tools/${slug}`;
      navigator.clipboard.writeText(fullUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    } catch (e) {}
  };

  // Quick preset data loader
  const handleLoadSample = (sampleType = "rahul") => {
    if (sampleType === "rahul") {
      setUserData({
        name: "Rahul Sharma",
        dob: "1995-09-27",
        tob: "10:30",
        pob: "New Delhi, India",
        lat: 28.6139,
        lon: 77.2090
      });
      setNameNumerologyInput("Rahul Sharma");
    } else {
      setUserData({
        name: "Priya Patel",
        dob: "1998-11-19",
        tob: "16:45",
        pob: "Mumbai, India",
        lat: 19.0760,
        lon: 72.8777
      });
      setNameNumerologyInput("Priya Patel");
    }
  };

  // ═════════════════════════════════════════════════════════════════════════
  // VIEW A: DEDICATED TOOL CALCULATION WORKSPACE (When a tool is selected)
  // ═════════════════════════════════════════════════════════════════════════
  if (activeTool) {
    const categoryMeta = TOOL_CATEGORIES.find(c => c.id === activeTool.category) || TOOL_CATEGORIES[0];
    const dedicatedUrl = `https://www.jyotishparamash.com/astrology-tools/${activeTool.slug}`;

    return (
      <div className="astrology-tool-page" style={{ minHeight: "100vh", color: "rgba(241, 231, 208, 0.95)" }}>
        {/* Breadcrumb Navigation Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(241, 231, 208, 0.8)", flexWrap: "wrap" }}>
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); onBackToHome(); }}
              style={{ color: "#FDE68A", textDecoration: "none" }}
            >
              {isHi ? "होम" : "Home"}
            </a>
            <span>/</span>
            <a
              href="/astrology-tools"
              onClick={handleBackToHub}
              style={{ color: "#FDE68A", textDecoration: "none" }}
            >
              {isHi ? "ज्योतिष साधन" : "Astro Calculators"}
            </a>
            <span>/</span>
            <span style={{ color: "#F59E0B", fontWeight: 700 }}>
              {isHi ? categoryMeta.labelHi : categoryMeta.labelEn}
            </span>
            <span>/</span>
            <span style={{ color: "#FFFFFF", fontWeight: 700 }}>
              {isHi ? activeTool.titleHi : activeTool.titleEn}
            </span>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={handleBackToHub}
              style={{
                background: "rgba(22, 15, 42, 0.85)",
                border: "1px solid rgba(212, 175, 55, 0.35)",
                color: "#FDE68A",
                padding: "7px 16px",
                borderRadius: 20,
                fontSize: 12.5,
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.2s ease"
              }}
            >
              ← {isHi ? "समस्त ज्योतिष साधन" : "All Astro Calculators"}
            </button>
          </div>
        </div>

        {/* Dedicated Tool Workspace Card */}
        <div
          id="active-tool-workspace"
          className="glass-card"
          style={{
            background: "linear-gradient(135deg, rgba(26, 16, 48, 0.96), rgba(14, 9, 30, 0.99))",
            border: "2px solid rgba(245, 158, 11, 0.6)",
            borderRadius: 22,
            padding: "30px 26px",
            marginBottom: 32,
            boxShadow: "0 14px 44px rgba(0, 0, 0, 0.6)"
          }}
        >
          {/* Active Tool Header with Dedicated URL */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14, marginBottom: 22, borderBottom: "1px solid rgba(212, 175, 55, 0.25)", paddingBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 36 }}>{activeTool.icon}</span>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#F59E0B", fontSize: 11.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}>
                  <span>✦</span> {activeTool.badge} · {activeTool.category.toUpperCase()}
                </div>
                <h1 style={{ color: "#F3D37A", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 900, margin: "4px 0 4px", fontFamily: "'Cinzel', serif" }}>
                  {isHi ? activeTool.titleHi : activeTool.titleEn}
                </h1>
                <div style={{ color: "rgba(241, 231, 208, 0.8)", fontSize: 13.5, maxWidth: 800 }}>
                  {isHi ? activeTool.descHi : activeTool.descEn}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => handleCopyToolUrl(activeTool.slug)}
                style={{
                  background: copiedUrl ? "rgba(52, 211, 153, 0.2)" : "rgba(255, 255, 255, 0.08)",
                  border: copiedUrl ? "1px solid #34D399" : "1px solid rgba(212, 175, 55, 0.3)",
                  color: copiedUrl ? "#34D399" : "#FDE68A",
                  padding: "6px 14px",
                  borderRadius: 16,
                  fontSize: 12,
                  cursor: "pointer",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5
                }}
              >
                <span>{copiedUrl ? "✓" : "🔗"}</span>
                <span>{copiedUrl ? (isHi ? "लिंक कॉपी हो गया!" : "URL Copied!") : (isHi ? "टूल लिंक शेयर करें" : "Copy Tool URL")}</span>
              </button>
              <button
                onClick={() => window.print()}
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(212,175,55,0.3)", color: "#FDE68A", padding: "6px 14px", borderRadius: 16, fontSize: 12, cursor: "pointer", fontWeight: 700 }}
              >
                🖨️ {isHi ? "प्रिंट / PDF" : "Print Tool Result"}
              </button>
            </div>
          </div>

          {/* Canonical Slug Pill */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 12, padding: "4px 12px", fontSize: 11.5, color: "#94A3B8", marginBottom: 20 }}>
            <span>🌐 Direct URL:</span>
            <code style={{ color: "#FDE68A", fontFamily: "monospace" }}>/astrology-tools/{activeTool.slug}</code>
          </div>

          {/* ── TOOL RENDER DISPATCHER ── */}
          {renderActiveToolComponent({
            activeToolId,
            userData,
            setUserData,
            corePlanets,
            ascendantDegree,
            dailyPanchangData,
            selectedDivisionalChart,
            setSelectedDivisionalChart,
            horaryNumberInput,
            setHoraryNumberInput,
            horaryQueryTopic,
            setHoraryQueryTopic,
            nameNumerologyInput,
            setNameNumerologyInput,
            partnerDobInput,
            setPartnerDobInput,
            selectedMuhuratEvent,
            setSelectedMuhuratEvent,
            prashnaQuestionInput,
            setPrashnaQuestionInput,
            selectedTargetDate,
            setSelectedTargetDate,
            selectedCity,
            setSelectedCity,
            lang,
            isHi,
            onSelectTab
          })}
        </div>

        {/* ── RELATED TOOLS IN SAME CATEGORY ── */}
        {relatedTools.length > 0 && (
          <div style={{ marginTop: 36, marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ color: "#F59E0B", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}>
                  ✦ {isHi ? "संबंधित ज्योतिषीय टूल्स" : `More ${categoryMeta.labelEn} Tools`}
                </div>
                <h3 style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 800, margin: "2px 0 0" }}>
                  {isHi ? "इसी श्रेणी के अन्य प्रमुख कैलकुलेटर" : "Explore Related Specialized Engines"}
                </h3>
              </div>
              <button
                onClick={handleBackToHub}
                style={{ background: "none", border: "none", color: "#D4AF37", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
              >
                {isHi ? "समस्त २१ शास्त्रीय साधन देखें →" : "View All 21 Astrological Calculators →"}
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
              {relatedTools.map(t => (
                <a
                  key={t.id}
                  href={`/astrology-tools/${t.slug}`}
                  onClick={(e) => handleSelectTool(t, e)}
                  style={{
                    display: "block",
                    textDecoration: "none",
                    color: "inherit",
                    background: "rgba(18, 12, 36, 0.88)",
                    border: "1px solid rgba(212, 175, 55, 0.25)",
                    borderRadius: 14,
                    padding: "16px 18px",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "#F59E0B";
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.25)";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 22 }}>{t.icon}</span>
                    <h4 style={{ color: "#F3D37A", fontSize: 15, fontWeight: 800, margin: 0 }}>
                      {isHi ? t.titleHi : t.titleEn}
                    </h4>
                  </div>
                  <p style={{ color: "rgba(241, 231, 208, 0.75)", fontSize: 12, margin: "0 0 10px", lineHeight: 1.4 }}>
                    {isHi ? t.descHi : t.descEn}
                  </p>
                  <div style={{ color: "#F59E0B", fontSize: 12, fontWeight: 700, textAlign: "right" }}>
                    {isHi ? "कैलकुलेटर खोलें →" : "Open Tool →"}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════
  // VIEW B: DEDICATED LANDING HUB EXPERIENCE (Matches Layout Illustration)
  // ═════════════════════════════════════════════════════════════════════════
  return (
    <div className="astrology-tools-hub" style={{ minHeight: "100vh", color: "rgba(241, 231, 208, 0.95)" }}>
      {/* Top Header Breadcrumb Action */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onBackToHome();
          }}
          style={{
            background: "rgba(22, 15, 42, 0.85)",
            border: "1px solid rgba(212, 175, 55, 0.35)",
            color: "#FDE68A",
            padding: "7px 16px",
            borderRadius: 20,
            fontSize: 12.5,
            fontWeight: 700,
            cursor: "pointer",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            transition: "all 0.2s ease"
          }}
        >
          ← {isHi ? "मुख्य जन्म कुंडली पोर्टल पर लौटें" : "Back to Main Kundli Portal"}
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(243, 211, 122, 0.8)" }}>
          <span>🔯 21 Specialized Calculators</span>
          <span>•</span>
          <span style={{ color: "#34D399", fontWeight: 700 }}>5 Categories</span>
          <span>•</span>
          <span style={{ color: "#34D399", fontWeight: 700 }}>100% Free Engine</span>
        </div>
      </div>

      {/* ── HERO BANNER: EXACT VISUAL REPLICA OF THE BRAND LAYOUT ── */}
      <div
        style={{
          background: "linear-gradient(180deg, #0d1630 0%, #090e1f 100%)",
          border: "1px solid rgba(212, 175, 55, 0.22)",
          borderRadius: 22,
          padding: "36px 32px 30px",
          marginBottom: 32,
          boxShadow: "0 14px 40px rgba(0, 0, 0, 0.55)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ position: "absolute", top: -60, right: -60, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Brand Tag */}
        <div style={{ color: "#D4AF37", fontSize: 11.5, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
          JYOTISH PARAMARSH
        </div>

        {/* Main Heading */}
        <h1 style={{ color: "#F8FAFC", fontSize: "clamp(24px, 3.6vw, 36px)", fontWeight: 800, margin: "0 0 10px", lineHeight: 1.25 }}>
          {isHi ? "वैदिक ज्योतिष गणना केंद्र एवं दिव्य साधन" : "Vedic Astrology Calculators & Divine Jyotish Instruments"}
        </h1>

        {/* Subtitle */}
        <p style={{ color: "#94A3B8", fontSize: "15px", maxWidth: 780, margin: "0 0 24px", lineHeight: 1.6 }}>
          {isHi
            ? "२१ प्रामाणिक शास्त्रीय साधन: वैदिक जन्म कुंडली, कृष्णमूर्ति पद्धति (KP), अंक ज्योतिष, दैनिक चौघड़िया मुहूर्त एवं तात्कालिक प्रश्न ज्योतिष।"
            : "21 Classical Astrological Instruments: Vedic Kundli, KP Horary, Sacred Numerology, Daily Choghadiya, and Decision Oracles computed with astronomical precision."}
        </p>

        {/* Search Bar matching screenshot */}
        <div style={{ position: "relative", marginBottom: 28 }}>
          <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "#94A3B8" }}>🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              if (selectedCategory !== "all") setSelectedCategory("all");
            }}
            placeholder={isHi ? "वैदिक साधन या गणना खोजें... (उदा. विंशोत्तरी, केपी, नाम अंकशास्त्र, चौघड़िया)" : "Search Vedic calculators & instruments... (e.g. Vimshottari, KP Sub-Lord, Choghadiya, Numerology)"}
            style={{
              width: "100%",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: 12,
              padding: "14px 18px 14px 46px",
              color: "#F8FAFC",
              fontSize: 15,
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.2s ease"
            }}
            onFocus={e => e.currentTarget.style.borderColor = "rgba(245, 158, 11, 0.6)"}
            onBlur={e => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)"}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: 13 }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Cards Grid matching screenshot */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 14 }}>
          {CATEGORY_CARDS.map(cat => {
            const isCatActive = selectedCategory === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryCardClick(cat.id)}
                style={{
                  background: isCatActive ? "rgba(245, 158, 11, 0.08)" : "rgba(255, 255, 255, 0.03)",
                  border: isCatActive ? "1.5px solid #F59E0B" : "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 14,
                  padding: "22px 22px 18px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 130,
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(245, 158, 11, 0.5)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = isCatActive ? "#F59E0B" : "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.background = isCatActive ? "rgba(245, 158, 11, 0.08)" : "rgba(255, 255, 255, 0.03)";
                }}
              >
                <div>
                  <div style={{ marginBottom: 12 }}>
                    {cat.icon}
                  </div>
                  <h3 style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>
                    {isHi ? cat.titleHi : cat.titleEn}
                  </h3>
                  <p style={{ color: "#94A3B8", fontSize: 13.5, margin: 0, lineHeight: 1.4 }}>
                    {isHi ? cat.subtitleHi : cat.subtitleEn}
                  </p>
                </div>

                <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6, color: "#D4AF37", fontSize: 13, fontWeight: 600 }}>
                  <span>{isHi ? "टूल्स देखें" : "Explore tools"}</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Concept Preview Caption */}
        <div style={{ color: "rgba(148, 163, 184, 0.65)", fontSize: 11.5, fontStyle: "italic", textAlign: "left", marginTop: 12 }}>
          {isHi
            ? "वैदिक ज्योतिष एवं कृष्णमूर्ति पद्धति (KP) के प्रामाणिक सिद्धांतों पर आधारित गणनाएं।"
            : "Concept preview for your existing midnight-blue and antique-gold brand direction. Certified Vedic calculations."}
        </div>
      </div>

      {/* ── 21 TOOLS DIRECTORY SECTION ── */}
      <div id="astrology-tools-directory" style={{ marginBottom: 40 }}>
        {/* Category Pills & Quick Filter Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6, scrollbarWidth: "none" }}>
            {TOOL_CATEGORIES.map(cat => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    background: isSelected
                      ? "linear-gradient(135deg, #F59E0B, #D97706)"
                      : "rgba(22, 15, 42, 0.85)",
                    color: isSelected ? "#0F0A1E" : "#FDE68A",
                    border: isSelected ? "1px solid #F59E0B" : "1px solid rgba(212, 175, 55, 0.28)",
                    borderRadius: 22,
                    padding: "7px 15px",
                    fontSize: 12.5,
                    fontWeight: isSelected ? 800 : 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    boxShadow: isSelected ? "0 4px 14px rgba(245, 158, 11, 0.35)" : "none",
                    transition: "all 0.2s ease"
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{isHi ? cat.labelHi : cat.labelEn}</span>
                </button>
              );
            })}
          </div>

          <div style={{ fontSize: 12, color: "#94A3B8" }}>
            {isHi ? `${filteredTools.length} टूल्स उपलब्ध` : `Showing ${filteredTools.length} of 21 tools`}
          </div>
        </div>

        {/* Tools Showcase Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {filteredTools.map(tool => (
            <a
              key={tool.id}
              href={`/astrology-tools/${tool.slug}`}
              onClick={(e) => handleSelectTool(tool, e)}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                textDecoration: "none",
                color: "inherit",
                background: "rgba(18, 12, 36, 0.88)",
                border: "1px solid rgba(212, 175, 55, 0.25)",
                borderRadius: 16,
                padding: "20px 20px 16px",
                cursor: "pointer",
                position: "relative",
                boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "#F59E0B";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(245, 158, 11, 0.25)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.25)";
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.35)";
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <span style={{ fontSize: 30 }}>{tool.icon}</span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: "3px 8px",
                      borderRadius: 10,
                      background: "rgba(255, 255, 255, 0.08)",
                      color: "rgba(241, 231, 208, 0.8)",
                      border: "1px solid rgba(212, 175, 55, 0.3)"
                    }}
                  >
                    {tool.badge}
                  </span>
                </div>

                <h3 style={{ color: "#F3D37A", fontSize: 16.5, fontWeight: 800, margin: "0 0 8px", lineHeight: 1.3 }}>
                  {isHi ? tool.titleHi : tool.titleEn}
                </h3>

                <p style={{ color: "rgba(241, 231, 208, 0.8)", fontSize: 13, lineHeight: 1.5, margin: "0 0 14px" }}>
                  {isHi ? tool.descHi : tool.descEn}
                </p>
              </div>

              <div>
                <div style={{ fontSize: 11, color: "rgba(148, 163, 184, 0.85)", fontFamily: "monospace", marginBottom: 10 }}>
                  🔗 /astrology-tools/{tool.slug}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(212, 175, 55, 0.15)", paddingTop: 10 }}>
                  <span style={{ fontSize: 11, color: "#34D399", fontWeight: 700 }}>
                    ✓ {isHi ? "निःशुल्क उपयोग" : "Free Engine"}
                  </span>
                  <span style={{ color: "#F59E0B", fontSize: 12.5, fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 4 }}>
                    {isHi ? "कैलकुलेटर खोलें →" : "Open Calculator →"}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WORKSPACE DISPATCHER: RENDERS INDIVIDUAL TOOL CONTROLS & CALCULATED RESULTS
// ─────────────────────────────────────────────────────────────────────────────

function renderActiveToolComponent(props) {
  const { activeToolId, isHi } = props;

  switch (activeToolId) {
    // ── VEDIC TOOLS ──
    case "vimshottari":
      return <VimshottariTool {...props} />;
    case "divisional":
      return <DivisionalChartTool {...props} />;
    case "ashtakavarga":
      return <AshtakavargaTool {...props} />;
    case "gochar":
      return <GocharTransitTool {...props} />;
    case "shadbala":
      return <ShadbalaTool {...props} />;

    // ── KP TOOLS ──
    case "kp_chart":
      return <KpChartTool {...props} />;
    case "kp_significators":
      return <KpSignificatorsTool {...props} />;
    case "kp_horary":
      return <KpHoraryTool {...props} />;
    case "kp_ruling":
      return <KpRulingPlanetsTool {...props} />;

    // ── NUMEROLOGY TOOLS ──
    case "lifepath":
      return <LifePathTool {...props} />;
    case "name_numerology":
      return <NameNumerologyTool {...props} />;
    case "personal_year":
      return <PersonalYearTool {...props} />;
    case "compatibility":
      return <NumberCompatibilityTool {...props} />;

    // ── DAILY & PRACTICAL TOOLS ──
    case "choghadiya":
      return <ChoghadiyaTool {...props} />;
    case "rahu_kaal":
      return <RahuKaalTool {...props} />;
    case "muhurat_finder":
      return <MuhuratFinderTool {...props} />;
    case "daily_transit":
      return <DailyTransitHoroscopeTool {...props} />;

    // ── PERSONAL DECISION TOOLS ──
    case "prashna_oracle":
      return <PrashnaOracleTool {...props} />;
    case "tara_chandra":
      return <TaraChandraBalaTool {...props} />;
    case "pancha_pakshi":
      return <PanchaPakshiTool {...props} />;
    case "cosmic_compass":
      return <CosmicCompassHoraTool {...props} />;

    default:
      return <VimshottariTool {...props} />;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// INDIVIDUAL TOOL IMPLEMENTATIONS
// ─────────────────────────────────────────────────────────────────────────────

/** 1. VIMSHOTTARI DASHA TOOL **/
function VimshottariTool({ userData, setUserData, corePlanets, lang, isHi }) {
  const moonLon = corePlanets?.Moon || 116.5;
  const moonNak = getNakshatraInfo(moonLon);
  const birthDate = new Date(`${userData.dob}T${userData.tob || "12:00"}`);
  const dashaData = calculateDetailedDashas(moonNak, birthDate, lang);

  return (
    <div>
      {/* Birth Input Controls */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 22, background: "rgba(0,0,0,0.35)", padding: 16, borderRadius: 14 }}>
        <div>
          <label style={{ fontSize: 11.5, color: "#FDE68A", fontWeight: 700, display: "block", marginBottom: 4 }}>
            {isHi ? "जातक का नाम:" : "Full Name:"}
          </label>
          <input
            type="text"
            value={userData.name}
            onChange={e => setUserData({ ...userData, name: e.target.value })}
            style={{ width: "100%", background: "rgba(22,15,42,0.9)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8, padding: "8px 12px", color: "#FFF", fontSize: 13, boxSizing: "border-box" }}
          />
        </div>
        <div>
          <label style={{ fontSize: 11.5, color: "#FDE68A", fontWeight: 700, display: "block", marginBottom: 4 }}>
            {isHi ? "जन्म तिथि (DOB):" : "Date of Birth:"}
          </label>
          <input
            type="date"
            value={userData.dob}
            onChange={e => setUserData({ ...userData, dob: e.target.value })}
            style={{ width: "100%", background: "rgba(22,15,42,0.9)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8, padding: "7px 12px", color: "#FFF", fontSize: 13, boxSizing: "border-box", colorScheme: "dark" }}
          />
        </div>
        <div>
          <label style={{ fontSize: 11.5, color: "#FDE68A", fontWeight: 700, display: "block", marginBottom: 4 }}>
            {isHi ? "जन्म समय (TOB):" : "Time of Birth:"}
          </label>
          <input
            type="time"
            value={userData.tob}
            onChange={e => setUserData({ ...userData, tob: e.target.value })}
            style={{ width: "100%", background: "rgba(22,15,42,0.9)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8, padding: "7px 12px", color: "#FFF", fontSize: 13, boxSizing: "border-box", colorScheme: "dark" }}
          />
        </div>
      </div>

      {/* Active Dasha Highlight Card */}
      <div style={{ background: "linear-gradient(135deg, rgba(245, 158, 11, 0.18), rgba(180, 83, 9, 0.28))", border: "1.5px solid #F59E0B", borderRadius: 16, padding: "20px 22px", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 8 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#34D399", fontSize: 12, fontWeight: 800 }}>
            <span>●</span> {isHi ? "वर्तमान में सक्रिय महादशा" : "CURRENTLY ACTIVE PLANETARY ERA"}
          </div>
          <span style={{ color: "#FDE68A", fontSize: 13, fontWeight: 700 }}>
            {userData.name} · {moonNak.name} ({moonNak.lord} Nakshatra Lord)
          </span>
        </div>
        
        <h3 style={{ color: "#FDE68A", fontSize: 22, fontWeight: 900, margin: "0 0 6px" }}>
          {dashaData.activeMahadasha?.lord} {isHi ? "महादशा" : "Mahadasha"} ({dashaData.activeMahadasha?.startYear}–{dashaData.activeMahadasha?.endYear})
        </h3>
        
        <p style={{ color: "rgba(241, 231, 208, 0.9)", fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>
          {isHi
            ? `आप वर्तमान में ${dashaData.activeMahadasha?.lord} की महादशा में ${dashaData.currentActiveAntardasha?.antardashaLord} की अंतर्दशा से गुजर रहे हैं। यह काल आपके कर्म व आत्मोन्नति को दिशा दे रहा है।`
            : `Currently navigating ${dashaData.activeMahadasha?.lord} Mahadasha with ${dashaData.currentActiveAntardasha?.antardashaLord} Antardasha. This planetary vibration governs your active life priorities, growth catalysts, and transformative milestones.`}
        </p>
      </div>

      {/* 9 Mahadashas Timeline Table */}
      <h4 style={{ color: "#FDE68A", fontSize: 15, fontWeight: 800, marginBottom: 12 }}>
        {isHi ? "१२० वर्षीय विंशोत्तरी महादशा चक्र" : "Complete 120-Year Vimshottari Mahadasha Cycle"}
      </h4>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
          <thead>
            <tr style={{ background: "rgba(245, 158, 11, 0.15)", color: "#FDE68A" }}>
              <th style={{ padding: "10px 14px", borderBottom: "1px solid rgba(212,175,55,0.3)" }}>{isHi ? "दशा स्वामी" : "Dasha Lord"}</th>
              <th style={{ padding: "10px 14px", borderBottom: "1px solid rgba(212,175,55,0.3)" }}>{isHi ? "अवधि (वर्ष)" : "Duration"}</th>
              <th style={{ padding: "10px 14px", borderBottom: "1px solid rgba(212,175,55,0.3)" }}>{isHi ? "आरंभ वर्ष" : "Start Year"}</th>
              <th style={{ padding: "10px 14px", borderBottom: "1px solid rgba(212,175,55,0.3)" }}>{isHi ? "समाप्ति वर्ष" : "End Year"}</th>
              <th style={{ padding: "10px 14px", borderBottom: "1px solid rgba(212,175,55,0.3)" }}>{isHi ? "स्थिति" : "Status"}</th>
            </tr>
          </thead>
          <tbody>
            {(dashaData.mahadashas || []).map((m, idx) => {
              const isActive = m.lord === dashaData.activeMahadasha?.lord;
              return (
                <tr key={idx} style={{ background: isActive ? "rgba(245, 158, 11, 0.12)" : (idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent") }}>
                  <td style={{ padding: "10px 14px", fontWeight: isActive ? 800 : 600, color: isActive ? "#FDE68A" : "inherit" }}>
                    {m.lord}
                  </td>
                  <td style={{ padding: "10px 14px" }}>{m.years} {isHi ? "वर्ष" : "Yrs"}</td>
                  <td style={{ padding: "10px 14px" }}>{m.startYear}</td>
                  <td style={{ padding: "10px 14px" }}>{m.endYear}</td>
                  <td style={{ padding: "10px 14px" }}>
                    {isActive ? (
                      <span style={{ background: "#10B981", color: "#0F0A1E", padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 800 }}>
                        {isHi ? "सक्रिय" : "Active Now"}
                      </span>
                    ) : (
                      <span style={{ color: "rgba(241,231,208,0.5)" }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** 2. DIVISIONAL CHARTS (VARGAS) TOOL **/

function NorthIndianVargaChart({ houses, lang, hoveredHouse, setHoveredHouse, activeChartId, chartMeta }) {
  const SIZE = 440;
  const PAD = 16;
  const W = SIZE - 2 * PAD;
  const xc = SIZE / 2;
  const yc = SIZE / 2;
  const x0 = PAD;
  const y0 = PAD;
  const x1 = SIZE - PAD;
  const y1 = SIZE - PAD;

  const houseLayout = [
    { n: 1,  cx: xc,            cy: y0 + W * 0.22, isLagna: true, path: `${xc},${y0} ${x1 - W*0.25},${y0 + W*0.25} ${xc},${yc} ${x0 + W*0.25},${y0 + W*0.25}` },
    { n: 2,  cx: x0 + W * 0.24, cy: y0 + W * 0.12, path: `${x0},${y0} ${xc},${y0} ${x0 + W*0.25},${y0 + W*0.25}` },
    { n: 3,  cx: x0 + W * 0.12, cy: y0 + W * 0.24, path: `${x0},${y0} ${x0},${yc} ${x0 + W*0.25},${y0 + W*0.25}` },
    { n: 4,  cx: x0 + W * 0.22, cy: yc,            path: `${x0},${yc} ${x0 + W*0.25},${y0 + W*0.25} ${xc},${yc} ${x0 + W*0.25},${y1 - W*0.25}` },
    { n: 5,  cx: x0 + W * 0.12, cy: y1 - W * 0.24, path: `${x0},${y1} ${x0},${yc} ${x0 + W*0.25},${y1 - W*0.25}` },
    { n: 6,  cx: x0 + W * 0.24, cy: y1 - W * 0.12, path: `${x0},${y1} ${xc},${y1} ${x0 + W*0.25},${y1 - W*0.25}` },
    { n: 7,  cx: xc,            cy: y1 - W * 0.22, path: `${xc},${y1} ${x0 + W*0.25},${y1 - W*0.25} ${xc},${yc} ${x1 - W*0.25},${y1 - W*0.25}` },
    { n: 8,  cx: x1 - W * 0.24, cy: y1 - W * 0.12, path: `${x1},${y1} ${xc},${y1} ${x1 - W*0.25},${y1 - W*0.25}` },
    { n: 9,  cx: x1 - W * 0.12, cy: y1 - W * 0.24, path: `${x1},${y1} ${x1},${yc} ${x1 - W*0.25},${y1 - W*0.25}` },
    { n: 10, cx: x1 - W * 0.22, cy: yc,            path: `${x1},${yc} ${x1 - W*0.25},${y0 + W*0.25} ${xc},${yc} ${x1 - W*0.25},${y1 - W*0.25}` },
    { n: 11, cx: x1 - W * 0.12, cy: y0 + W * 0.24, path: `${x1},${y0} ${x1},${yc} ${x1 - W*0.25},${y0 + W*0.25}` },
    { n: 12, cx: x1 - W * 0.24, cy: y0 + W * 0.12, path: `${x1},${y0} ${xc},${y0} ${x1 - W*0.25},${y0 + W*0.25}` },
  ];

  const PLANET_ABBR = {
    Sun: { en: "Su", hi: "सू", color: "#F59E0B" },
    Moon: { en: "Mo", hi: "चं", color: "#E0E7FF" },
    Mars: { en: "Ma", hi: "मं", color: "#EF4444" },
    Mercury: { en: "Me", hi: "बु", color: "#34D399" },
    Jupiter: { en: "Ju", hi: "गु", color: "#FBBF24" },
    Venus: { en: "Ve", hi: "शु", color: "#F472B6" },
    Saturn: { en: "Sa", hi: "श", color: "#60A5FA" },
    Rahu: { en: "Ra", hi: "रा", color: "#A78BFA" },
    Ketu: { en: "Ke", hi: "के", color: "#F87171" }
  };

  const getSignNumber = (signName) => {
    const idx = SIGNS.findIndex(s => s.name === signName || s.sanskrit === signName);
    return idx >= 0 ? idx + 1 : "";
  };

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ width: "100%", maxWidth: 440, height: "auto", display: "block", margin: "0 auto" }}>
      <defs>
        <radialGradient id="vargaKundliGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1E1438" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0A0614" stopOpacity="0.98" />
        </radialGradient>
      </defs>

      <rect width={SIZE} height={SIZE} fill="url(#vargaKundliGlow)" rx="16" stroke="rgba(212,175,55,0.4)" strokeWidth="1.5" />

      {/* House Polygons */}
      {houseLayout.map(({ n, path }) => (
        <polygon
          key={`poly-${n}`}
          points={path}
          fill={hoveredHouse === n ? "rgba(245, 158, 11, 0.28)" : "transparent"}
          stroke={hoveredHouse === n ? "#F59E0B" : "rgba(212,175,55,0.22)"}
          strokeWidth={hoveredHouse === n ? "2" : "0.5"}
          style={{ cursor: "pointer", transition: "all 0.2s ease" }}
          onMouseEnter={() => setHoveredHouse && setHoveredHouse(n)}
          onMouseLeave={() => setHoveredHouse && setHoveredHouse(null)}
          onClick={() => setHoveredHouse && setHoveredHouse(hoveredHouse === n ? null : n)}
        />
      ))}

      {/* Geometric Kundli Lines */}
      <rect x={x0} y={y0} width={W} height={W} fill="none" stroke="rgba(212,175,55,0.7)" strokeWidth="1.8" />
      <line x1={x0} y1={y0} x2={x1} y2={y1} stroke="rgba(212,175,55,0.55)" strokeWidth="1.4" />
      <line x1={x1} y1={y0} x2={x0} y2={y1} stroke="rgba(212,175,55,0.55)" strokeWidth="1.4" />
      <polygon points={`${xc},${y0} ${x1},${yc} ${xc},${y1} ${x0},${yc}`} fill="none" stroke="rgba(212,175,55,0.6)" strokeWidth="1.4" />

      {/* Center Emblem */}
      <circle cx={xc} cy={yc} r="28" fill="rgba(15,10,30,0.92)" stroke="rgba(212,175,55,0.5)" strokeWidth="1.2" />
      <text x={xc} y={yc - 4} textAnchor="middle" fill="#F59E0B" fontSize="11" fontWeight="800" letterSpacing="0.8">
        {activeChartId || "D9"}
      </text>
      <text x={xc} y={yc + 14} textAnchor="middle" fill="#FDE68A" fontSize="16" fontFamily="serif">ॐ</text>

      {/* House Signs & Occupying Planets */}
      {houseLayout.map(({ n, cx, cy, isLagna }) => {
        const houseObj = houses?.[n] || {};
        const signNum = getSignNumber(houseObj.sign || houseObj.signSanskrit);
        const planetsInHouse = houseObj.planets || [];

        return (
          <g key={n} style={{ pointerEvents: "none" }}>
            {/* Sign Number */}
            <text
              x={isLagna ? cx : (n === 2 || n === 6 ? cx + 18 : n === 8 || n === 12 ? cx - 18 : cx)}
              y={isLagna ? cy - 24 : cy - 14}
              textAnchor="middle"
              fill="#D4AF37"
              fontSize="12"
              fontWeight="800"
              opacity="0.9"
            >
              {signNum}
            </text>

            {/* Planets list */}
            {planetsInHouse.length === 0 ? (
              <text x={cx} y={isLagna ? cy + 4 : cy + 4} textAnchor="middle" fill="rgba(241,231,208,0.2)" fontSize="10">
                —
              </text>
            ) : (
              <g transform={`translate(${cx}, ${isLagna ? cy - 4 : cy - 2})`}>
                {planetsInHouse.map((pName, pIdx) => {
                  const abbr = PLANET_ABBR[pName] || { en: pName.slice(0, 2), hi: pName.slice(0, 2), color: "#FDE68A" };
                  const label = lang === "hi" ? abbr.hi : abbr.en;
                  const rowOffset = (pIdx - (planetsInHouse.length - 1) / 2) * 13;
                  return (
                    <text
                      key={pName}
                      x="0"
                      y={rowOffset}
                      textAnchor="middle"
                      fill={abbr.color}
                      fontSize="11"
                      fontWeight="700"
                      filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))"
                    >
                      {label}
                    </text>
                  );
                })}
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function DivisionalChartTool({ userData, setUserData, corePlanets, ascendantDegree, selectedDivisionalChart, setSelectedDivisionalChart, isHi }) {
  const [activeHouse, setActiveHouse] = useState(1);
  const [hoveredHouse, setHoveredHouse] = useState(null);

  // Quick popular varga tabs
  const POPULAR_VARGAS = [
    { id: "D1", labelEn: "D1 Rashi", labelHi: "D1 लग्न" },
    { id: "D9", labelEn: "D9 Navamsha", labelHi: "D9 नवमांश" },
    { id: "D10", labelEn: "D10 Dashamsha", labelHi: "D10 दशमांश" },
    { id: "D7", labelEn: "D7 Saptamsha", labelHi: "D7 सप्तमांश" },
    { id: "D2", labelEn: "D2 Hora", labelHi: "D2 होरा" },
    { id: "D3", labelEn: "D3 Drekkana", labelHi: "D3 द्रेष्काण" },
    { id: "D12", labelEn: "D12 Dwadashamsha", labelHi: "D12 द्वादशांश" },
    { id: "D60", labelEn: "D60 Shashtiamsha", labelHi: "D60 षष्ट्यंश" },
    { id: "CHANDRA", labelEn: "Chandra Kundli", labelHi: "चंद्र कुंडली" },
    { id: "CHALIT", labelEn: "Bhava Chalit", labelHi: "भाव चलित" }
  ];

  // Active chart metadata
  const currentChartId = selectedDivisionalChart || "D9";
  const chartMeta = SHODASHVARGA_LIST.find(v => v.id === currentChartId) || SHODASHVARGA_LIST[1];

  // Derive birth date and planetary longitudes
  const activeBirthDate = useMemo(() => {
    try {
      return new Date(`${userData.dob}T${userData.tob || "12:00"}`);
    } catch (e) {
      return new Date();
    }
  }, [userData.dob, userData.tob]);

  // Sanitize planetary degrees to exact numeric float values
  const sanitizedPlanets = useMemo(() => {
    try {
      const computed = calculatePlanets(activeBirthDate);
      const res = {};
      Object.entries(computed || {}).forEach(([pName, pVal]) => {
        res[pName] = typeof pVal === "number" ? pVal : (pVal?.longitude || pVal?.degree || 0);
      });
      return res;
    } catch (e) {
      return calculatePlanets(new Date());
    }
  }, [activeBirthDate]);

  const activeAscDeg = useMemo(() => {
    try {
      return calculateAscendant(activeBirthDate, userData.lat || 28.6139, userData.lon || 77.2090);
    } catch (e) {
      return ascendantDegree || 120.0;
    }
  }, [activeBirthDate, userData.lat, userData.lon, ascendantDegree]);

  // Compute divisional chart house placements
  const vargaData = useMemo(() => {
    try {
      return buildDivisionalChartData(sanitizedPlanets, activeAscDeg, currentChartId);
    } catch (err) {
      console.error("Error building divisional chart:", err);
      return null;
    }
  }, [sanitizedPlanets, activeAscDeg, currentChartId]);

  // Inspect the currently selected house
  const inspectedHouseNum = hoveredHouse || activeHouse || 1;
  const inspectedHouseObj = vargaData?.[inspectedHouseNum] || {};

  // Classical Parashari house meanings
  const HOUSE_DOMAINS = [
    { en: "Self, Physical Body, Head, General Disposition & Health", hi: "शरीर, रूप, स्वास्थ्य, स्वभाव, प्रारंभिक जीवन व आत्म-संस्कार" },
    { en: "Wealth, Accumulated Assets, Speech, Family & Diet", hi: "धन संचय, वाणी, कुटुंब, प्रारंभिक विद्या व मुख मंडल" },
    { en: "Courage, Younger Siblings, Communication & Creative Skills", hi: "पराक्रम, छोटे भाई-बहन, साहस, लेखन व संचार कौशल" },
    { en: "Mother, Real Estate, Vehicles, Inner Peace & Happiness", hi: "माता, गृह, भूमि, वाहन, मातृभूमि व आंतरिक सुख" },
    { en: "Progeny, Intelligence, Past Karma, Speculation & Mantras", hi: "संतान, बुद्धि, पूर्वपुण्य, विद्या, मंत्र-सिद्धि व विवेक" },
    { en: "Enemies, Health Debts, Litigation, Service & Daily Work", hi: "रोग, ऋण, शत्रु, प्रतिस्पर्धा, सेवा भाव व दैनिक श्रम" },
    { en: "Marriage, Spouse, Business Partnerships & Foreign Travel", hi: "विवाह, जीवनसाथी, साझेदारी, व्यापार व वैवाहिक सामंजस्य" },
    { en: "Longevity, Transformation, Hidden Knowledge & Sudden Events", hi: "आयु, गुप्त विद्या, गूढ़ अनुसंधान, परिवर्तन व अकस्मात फल" },
    { en: "Fortune, Dharma, Higher Wisdom, Guru & Pilgrimage", hi: "भाग्य, धर्म, गुरु, तीर्थयात्रा, उच्च शिक्षा व ईश्वरीय कृपा" },
    { en: "Profession, Career, Fame, Social Status & Authority", hi: "कर्म, आजीविका, प्रतिष्ठा, सामाजिक प्रभाव व प्रशासनिक पद" },
    { en: "Gains, Income, Elder Siblings, Aspirations & Social Circle", hi: "लाभ, आय, बड़े भाई-बहन, मनोरथ सिद्धि व मित्र मंडली" },
    { en: "Expenses, Spiritual Liberation (Moksha), Foreign Lands & Rest", hi: "व्यय, मोक्ष, विदेश वास, एकांत साधना व शयन सुख" }
  ];

  return (
    <div>
      {/* ── BIRTH DETAILS INPUT BAR ── */}
      <div style={{ background: "rgba(0,0,0,0.35)", padding: "16px 18px", borderRadius: 16, marginBottom: 20, border: "1px solid rgba(212,175,55,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: "#FDE68A", fontWeight: 800 }}>
            👤 {isHi ? "जातक जन्म विवरण (Birth Coordinates for Chart Calculation):" : "Natal Birth Details (Interactive Real-Time Engine):"}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setUserData({ name: "Rahul Sharma", dob: "1995-09-27", tob: "10:30", pob: "New Delhi, India", lat: 28.6139, lon: 77.2090 })}
              style={{ background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.4)", color: "#FDE68A", padding: "4px 10px", borderRadius: 12, fontSize: 11.5, cursor: "pointer", fontWeight: 700 }}
            >
              ⚡ {isHi ? "राहुल शर्मा (नमूना)" : "Rahul Sharma"}
            </button>
            <button
              onClick={() => setUserData({ name: "Priya Patel", dob: "1998-11-19", tob: "16:45", pob: "Mumbai, India", lat: 19.0760, lon: 72.8777 })}
              style={{ background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.4)", color: "#FDE68A", padding: "4px 10px", borderRadius: 12, fontSize: 11.5, cursor: "pointer", fontWeight: 700 }}
            >
              ⚡ {isHi ? "प्रिया पटेल (नमूना)" : "Priya Patel"}
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          <div>
            <label style={{ fontSize: 11.5, color: "rgba(241,231,208,0.8)", fontWeight: 700, display: "block", marginBottom: 4 }}>
              {isHi ? "नाम:" : "Full Name:"}
            </label>
            <input
              type="text"
              value={userData.name}
              onChange={e => setUserData({ ...userData, name: e.target.value })}
              style={{ width: "100%", background: "rgba(22,15,42,0.9)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8, padding: "8px 12px", color: "#FFF", fontSize: 13, boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11.5, color: "rgba(241,231,208,0.8)", fontWeight: 700, display: "block", marginBottom: 4 }}>
              {isHi ? "जन्म तिथि (DOB):" : "Date of Birth:"}
            </label>
            <input
              type="date"
              value={userData.dob}
              onChange={e => setUserData({ ...userData, dob: e.target.value })}
              style={{ width: "100%", background: "rgba(22,15,42,0.9)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8, padding: "7px 12px", color: "#FFF", fontSize: 13, boxSizing: "border-box", colorScheme: "dark" }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11.5, color: "rgba(241,231,208,0.8)", fontWeight: 700, display: "block", marginBottom: 4 }}>
              {isHi ? "जन्म समय (TOB):" : "Time of Birth:"}
            </label>
            <input
              type="time"
              value={userData.tob}
              onChange={e => setUserData({ ...userData, tob: e.target.value })}
              style={{ width: "100%", background: "rgba(22,15,42,0.9)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8, padding: "7px 12px", color: "#FFF", fontSize: 13, boxSizing: "border-box", colorScheme: "dark" }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11.5, color: "rgba(241,231,208,0.8)", fontWeight: 700, display: "block", marginBottom: 4 }}>
              {isHi ? "जन्म स्थान (City):" : "Birth City:"}
            </label>
            <input
              type="text"
              value={userData.pob}
              onChange={e => setUserData({ ...userData, pob: e.target.value })}
              style={{ width: "100%", background: "rgba(22,15,42,0.9)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8, padding: "8px 12px", color: "#FFF", fontSize: 13, boxSizing: "border-box" }}
            />
          </div>
        </div>
      </div>

      {/* ── VARGA SELECTION CONTROLS ── */}
      <div style={{ marginBottom: 20, background: "rgba(0,0,0,0.35)", padding: "16px 18px", borderRadius: 16, border: "1px solid rgba(212,175,55,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
          <label style={{ fontSize: 13, color: "#FDE68A", fontWeight: 800 }}>
            {isHi ? "षोडशवर्ग चक्र का चयन करें (Select Divisional Chart):" : "Select Divisional Chart to Examine:"}
          </label>
          <span style={{ fontSize: 12, color: "#34D399", fontWeight: 700 }}>
            ✓ {isHi ? "१७ वर्ग कुंडलियां उपलब्ध" : "17 Divisional Varga Systems Certified"}
          </span>
        </div>

        {/* Quick Chips */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {POPULAR_VARGAS.map(v => {
            const isActive = currentChartId === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setSelectedDivisionalChart(v.id)}
                style={{
                  background: isActive ? "linear-gradient(135deg, #F59E0B, #D97706)" : "rgba(22,15,42,0.85)",
                  color: isActive ? "#0F0A1E" : "#FDE68A",
                  border: isActive ? "1px solid #F59E0B" : "1px solid rgba(212,175,55,0.25)",
                  borderRadius: 14,
                  padding: "5px 12px",
                  fontSize: 12,
                  fontWeight: isActive ? 800 : 600,
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                {isHi ? v.labelHi : v.labelEn}
              </button>
            );
          })}
        </div>

        {/* Complete Dropdown */}
        <select
          value={currentChartId}
          onChange={e => setSelectedDivisionalChart(e.target.value)}
          className="custom-select-arrow"
          style={{ width: "100%", maxWidth: 560, background: "rgba(26,18,48,0.95)", border: "1px solid rgba(212,175,55,0.4)", borderRadius: 10, padding: "10px 32px 10px 14px", color: "#FDE68A", fontSize: 13.5, fontWeight: 700, outline: "none" }}
        >
          {SHODASHVARGA_LIST.map(opt => (
            <option key={opt.id} value={opt.id} style={{ background: "#0F0A1E", color: "#FFF" }}>
              {isHi ? `${opt.nameHi} — ${opt.descHi}` : `${opt.nameEn} — ${opt.descEn}`}
            </option>
          ))}
        </select>
      </div>

      {/* ── VISUAL KUNDLI & HOUSE INSPECTION SPLIT ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, marginBottom: 24, alignItems: "start" }}>
        {/* Left: North Indian SVG Kundli */}
        <div style={{ background: "rgba(18, 12, 36, 0.88)", border: "1px solid rgba(212, 175, 55, 0.35)", borderRadius: 16, padding: "18px 16px", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, padding: "0 6px" }}>
            <span style={{ color: "#FDE68A", fontSize: 14, fontWeight: 800 }}>
              {isHi ? chartMeta.nameHi : chartMeta.nameEn}
            </span>
            <span style={{ background: "rgba(245, 158, 11, 0.2)", color: "#FDE68A", padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700 }}>
              {isHi ? "उत्तर भारतीय चक्र" : "North Indian Kundli"}
            </span>
          </div>

          <NorthIndianVargaChart
            houses={vargaData}
            lang={isHi ? "hi" : "en"}
            hoveredHouse={inspectedHouseNum}
            setHoveredHouse={setActiveHouse}
            activeChartId={currentChartId}
            chartMeta={chartMeta}
          />

          <div style={{ marginTop: 12, fontSize: 11.5, color: "rgba(241,231,208,0.65)" }}>
            💡 {isHi ? "किसी भी भाव पर क्लिक या होवर करके उसका विश्लेषण देखें।" : "Click or hover any house to inspect its planetary occupants and significance."}
          </div>
        </div>

        {/* Right: Selected House Inspection & Varga Philosophy */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Active House Inspection Card */}
          <div style={{ background: "linear-gradient(135deg, rgba(245, 158, 11, 0.16), rgba(180, 83, 9, 0.24))", border: "1.5px solid #F59E0B", borderRadius: 16, padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ background: "#F59E0B", color: "#0F0A1E", padding: "3px 10px", borderRadius: 12, fontSize: 12, fontWeight: 900 }}>
                {isHi ? `${inspectedHouseNum}वां भाव (House ${inspectedHouseNum})` : `House ${inspectedHouseNum}`}
              </span>
              <span style={{ color: "#FDE68A", fontSize: 13, fontWeight: 800 }}>
                {isHi ? inspectedHouseObj.signSanskrit : inspectedHouseObj.sign} ({isHi ? `स्वामी: ${inspectedHouseObj.lord}` : `Lord: ${inspectedHouseObj.lord}`})
              </span>
            </div>

            <h4 style={{ color: "#FDE68A", fontSize: 16, fontWeight: 800, margin: "0 0 6px" }}>
              {isHi ? "स्थित ग्रह:" : "Occupying Planets:"} {inspectedHouseObj.planets?.length > 0 ? inspectedHouseObj.planets.join(", ") : (isHi ? "कोई ग्रह नहीं (खाली भाव)" : "No planets (Empty House)")}
            </h4>

            {inspectedHouseObj.planetDetails?.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "8px 0" }}>
                {inspectedHouseObj.planetDetails.map(pd => (
                  <span key={pd.name} style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8, padding: "3px 8px", fontSize: 11.5, color: "#34D399", fontWeight: 700 }}>
                    {pd.name} · {pd.degree}
                  </span>
                ))}
              </div>
            )}

            <p style={{ color: "rgba(241,231,208,0.9)", fontSize: 12.5, lineHeight: 1.55, margin: "8px 0 0" }}>
              <b>{isHi ? "भाव कारक क्षेत्र:" : "Parashari Domain:"}</b> {isHi ? HOUSE_DOMAINS[inspectedHouseNum - 1]?.hi : HOUSE_DOMAINS[inspectedHouseNum - 1]?.en}
            </p>
          </div>

          {/* Varga Purpose Card */}
          <div style={{ background: "rgba(18, 12, 36, 0.88)", border: "1px solid rgba(212, 175, 55, 0.28)", borderRadius: 16, padding: "18px 20px" }}>
            <div style={{ color: "#F59E0B", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>
              {isHi ? "वर्ग चक्र का वैदिक प्रयोजन" : "Vedic Astrological Purpose"}
            </div>
            <h4 style={{ color: "#FDE68A", fontSize: 16, fontWeight: 800, margin: "0 0 6px" }}>
              {isHi ? chartMeta.nameHi : chartMeta.nameEn}
            </h4>
            <p style={{ color: "rgba(241,231,208,0.85)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              {isHi ? chartMeta.descHi : chartMeta.descEn}
            </p>
          </div>
        </div>
      </div>

      {/* ── COMPLETE 12 BHAVAS TABLE OVERVIEW ── */}
      <h4 style={{ color: "#FDE68A", fontSize: 15, fontWeight: 800, marginBottom: 12 }}>
        {isHi ? `द्वादश भाव सारणी — ${chartMeta.nameHi}` : `12-House Matrix — ${chartMeta.nameEn}`}
      </h4>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, textAlign: "left" }}>
          <thead>
            <tr style={{ background: "rgba(245, 158, 11, 0.18)", color: "#FDE68A" }}>
              <th style={{ padding: "10px 12px", borderBottom: "1px solid rgba(212,175,55,0.3)" }}>{isHi ? "भाव" : "House"}</th>
              <th style={{ padding: "10px 12px", borderBottom: "1px solid rgba(212,175,55,0.3)" }}>{isHi ? "राशि" : "Sign"}</th>
              <th style={{ padding: "10px 12px", borderBottom: "1px solid rgba(212,175,55,0.3)" }}>{isHi ? "भाव स्वामी" : "Sign Lord"}</th>
              <th style={{ padding: "10px 12px", borderBottom: "1px solid rgba(212,175,55,0.3)" }}>{isHi ? "स्थित ग्रह" : "Occupying Planets"}</th>
              <th style={{ padding: "10px 12px", borderBottom: "1px solid rgba(212,175,55,0.3)" }}>{isHi ? "महत्व" : "Signification"}</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(hNum => {
              const hObj = vargaData?.[hNum] || {};
              const planetsList = hObj.planets || [];
              const isSelected = hNum === inspectedHouseNum;
              return (
                <tr
                  key={hNum}
                  onClick={() => setActiveHouse(hNum)}
                  style={{
                    background: isSelected ? "rgba(245, 158, 11, 0.14)" : (hNum % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent"),
                    cursor: "pointer"
                  }}
                >
                  <td style={{ padding: "9px 12px", fontWeight: 700, color: isSelected ? "#FDE68A" : "inherit" }}>
                    {isHi ? `${hNum}वां भाव` : `House ${hNum}`}
                  </td>
                  <td style={{ padding: "9px 12px" }}>
                    {isHi ? hObj.signSanskrit : hObj.sign}
                  </td>
                  <td style={{ padding: "9px 12px", color: "rgba(241,231,208,0.85)" }}>
                    {hObj.lord}
                  </td>
                  <td style={{ padding: "9px 12px", color: planetsList.length > 0 ? "#34D399" : "rgba(241,231,208,0.45)", fontWeight: planetsList.length > 0 ? 800 : 400 }}>
                    {planetsList.length > 0 ? planetsList.join(", ") : "—"}
                  </td>
                  <td style={{ padding: "9px 12px", fontSize: 11.5, color: "rgba(241,231,208,0.75)" }}>
                    {isHi ? HOUSE_DOMAINS[hNum - 1]?.hi : HOUSE_DOMAINS[hNum - 1]?.en}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** 3. ASHTAKAVARGA TOOL **/
function AshtakavargaTool({ corePlanets, ascendantDegree, isHi }) {
  const ascSignIdx = Math.floor(ascendantDegree / 30);

  // Sanitize planets object so it is { Sun: lon, Moon: lon, ... }
  const sanitizedPlanets = useMemo(() => {
    const res = {};
    Object.entries(corePlanets || {}).forEach(([pName, pVal]) => {
      res[pName] = typeof pVal === "number" ? pVal : (pVal?.longitude || pVal?.degree || 0);
    });
    return res;
  }, [corePlanets]);

  const savData = useMemo(() => {
    return calculateSarvashtakavarga(sanitizedPlanets, ascSignIdx, isHi ? "hi" : "en");
  }, [sanitizedPlanets, ascSignIdx, isHi]);

  const houses = savData?.houses || {};

  return (
    <div>
      {/* Astrological Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
        <div style={{ background: "linear-gradient(135deg, rgba(245, 158, 11, 0.16), rgba(180, 83, 9, 0.22))", border: "1px solid #F59E0B", borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ fontSize: 11.5, color: "#FDE68A", fontWeight: 700 }}>{isHi ? "कुल सर्वाष्टकवर्ग बिंदु" : "Total SAV Bindus"}</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#FDE68A", marginTop: 4 }}>337 <span style={{ fontSize: 13, fontWeight: 600 }}>/ 337</span></div>
          <div style={{ fontSize: 11, color: "#34D399", marginTop: 2 }}>✓ {isHi ? "पूर्ण पारम्परिक संतुलन" : "Exact Classical Sum"}</div>
        </div>

        <div style={{ background: "rgba(18, 12, 36, 0.88)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ fontSize: 11.5, color: "#FDE68A", fontWeight: 700 }}>{isHi ? "धन भाव (द्वितीय + एकादश)" : "Wealth Houses (2nd + 11th)"}</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#34D399", marginTop: 4 }}>
            {savData.wealthBindus} <span style={{ fontSize: 13, fontWeight: 600 }}>pts</span>
          </div>
          <div style={{ fontSize: 11, color: savData.wealthBindus >= 56 ? "#34D399" : "#F59E0B", marginTop: 2 }}>
            {savData.wealthBindus >= 56 ? (isHi ? "★ प्रचुर धन संचय योग" : "High Wealth Accumulation") : (isHi ? "संतुलित वित्तीय स्थिति" : "Balanced Wealth Flow")}
          </div>
        </div>

        <div style={{ background: "rgba(18, 12, 36, 0.88)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ fontSize: 11.5, color: "#FDE68A", fontWeight: 700 }}>{isHi ? "दशम कर्म भाव (करियर)" : "10th House (Career)"}</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: savData.careerBindus >= 28 ? "#34D399" : "#F59E0B", marginTop: 4 }}>
            {savData.careerBindus} <span style={{ fontSize: 13, fontWeight: 600 }}>pts</span>
          </div>
          <div style={{ fontSize: 11, color: "rgba(241,231,208,0.7)", marginTop: 2 }}>
            {savData.careerBindus >= 30 ? (isHi ? "मजबूत सामाजिक अधिकार" : "Strong Authority & Fame") : (isHi ? "मध्यम कार्य गति" : "Moderate Professional Velocity")}
          </div>
        </div>

        <div style={{ background: "rgba(18, 12, 36, 0.88)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ fontSize: 11.5, color: "#FDE68A", fontWeight: 700 }}>{isHi ? "नवम भाग्य भाव (ईश्वर कृपा)" : "9th House (Dharma & Fortune)"}</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: savData.luckBindus >= 28 ? "#34D399" : "#F59E0B", marginTop: 4 }}>
            {savData.luckBindus} <span style={{ fontSize: 13, fontWeight: 600 }}>pts</span>
          </div>
          <div style={{ fontSize: 11, color: "rgba(241,231,208,0.7)", marginTop: 2 }}>
            {savData.luckBindus >= 28 ? (isHi ? "शुभ भाग्योदय व गुरु कृपा" : "Auspicious Fortune & Guidance") : (isHi ? "प्रयास सापेक्ष भाग्योदय" : "Effort-Driven Fortune")}
          </div>
        </div>
      </div>

      {/* 12 House / Sign Bindu Cards Grid */}
      <h4 style={{ color: "#FDE68A", fontSize: 15, fontWeight: 800, marginBottom: 12 }}>
        {isHi ? "द्वादश भाव अष्टकवर्ग बिंदु एवं शुभता (SAV Matrix)" : "12 Houses Sarvashtakavarga Matrix & Fruition"}
      </h4>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
        {Array.from({ length: 12 }, (_, i) => i + 1).map(hNum => {
          const hObj = houses[hNum] || {};
          const bindus = hObj.bindus || 28;
          const isHigh = bindus >= 30;
          const isMedium = bindus >= 28 && bindus < 30;

          return (
            <div
              key={hNum}
              style={{
                background: isHigh
                  ? "rgba(16, 185, 129, 0.12)"
                  : isMedium
                  ? "rgba(245, 158, 11, 0.12)"
                  : "rgba(22, 15, 42, 0.8)",
                border: `1px solid ${isHigh ? "#10B981" : isMedium ? "#F59E0B" : "rgba(212, 175, 55, 0.25)"}`,
                borderRadius: 14,
                padding: "14px",
                textAlign: "center"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ color: "#F59E0B", fontSize: 12, fontWeight: 800 }}>
                  {isHi ? `${hNum}वां भाव` : `House ${hNum}`}
                </span>
                <span style={{ color: "rgba(241,231,208,0.8)", fontSize: 12 }}>
                  {isHi ? hObj.signSanskrit : hObj.sign}
                </span>
              </div>
              <div style={{ color: isHigh ? "#34D399" : isMedium ? "#FDE68A" : "#F87171", fontSize: 28, fontWeight: 900 }}>
                {bindus}
              </div>
              <div style={{ fontSize: 11, color: isHigh ? "#34D399" : isMedium ? "#FDE68A" : "#F87171", marginTop: 4, fontWeight: 700 }}>
                {hObj.status || (bindus >= 28 ? "Favorable" : "Sensitive")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** 4. GOCHAR & TRANSIT TOOL **/
function GocharTransitTool({ corePlanets, ascendantDegree, isHi }) {
  const moonLon = typeof corePlanets?.Moon === "number" ? corePlanets.Moon : (corePlanets?.Moon?.longitude || 116.5);
  const moonSignIdx = Math.floor(moonLon / 30);
  const ascSignIdx = Math.floor(ascendantDegree / 30);
  const transits = calculateCurrentGochara(moonSignIdx, ascSignIdx);

  return (
    <div>
      <div style={{ background: "rgba(0,0,0,0.35)", padding: 18, borderRadius: 16, marginBottom: 20, border: "1px solid rgba(212,175,55,0.25)" }}>
        <div style={{ color: "#FDE68A", fontSize: 15, fontWeight: 800 }}>
          {isHi ? "वास्तविक समय मंद-गामी ग्रह गोचर (२०२६–२०२७)" : "Real-Time Major Slow Planetary Transits (2026–2027)"}
        </div>
        <div style={{ color: "rgba(241,231,208,0.85)", fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
          {isHi
            ? `आपकी जन्म चंद्र राशि: ${SIGNS[moonSignIdx]?.nameHi || SIGNS[moonSignIdx]?.sanskrit} (${SIGNS[moonSignIdx]?.sanskrit}) एवं जन्म लग्न: ${SIGNS[ascSignIdx]?.nameHi || SIGNS[ascSignIdx]?.sanskrit} (${SIGNS[ascSignIdx]?.sanskrit})`
            : `Calculated relative to your Natal Moon: ${SIGNS[moonSignIdx]?.name} (${SIGNS[moonSignIdx]?.sanskrit}) and Ascendant: ${SIGNS[ascSignIdx]?.name} (${SIGNS[ascSignIdx]?.sanskrit})`}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        {(transits || []).map((t, idx) => {
          const isFavorable = [3, 6, 11].includes(t.houseFromMoon) || (t.planet === "Jupiter" && [2, 5, 7, 9, 11].includes(t.houseFromMoon));
          return (
            <div key={idx} style={{ background: "rgba(18, 12, 36, 0.88)", border: "1px solid rgba(212, 175, 55, 0.3)", borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ color: "#F59E0B", fontSize: 16, fontWeight: 800 }}>{t.planet}</span>
                <span style={{ background: "rgba(245, 158, 11, 0.2)", color: "#FDE68A", padding: "3px 10px", borderRadius: 10, fontSize: 11.5, fontWeight: 700 }}>
                  {t.currentSign} ({t.signSanskrit})
                </span>
              </div>
              <div style={{ fontSize: 12.5, color: "rgba(241,231,208,0.9)", lineHeight: 1.6 }}>
                • {isHi ? `चंद्र से ${t.houseFromMoon}वां भाव` : `House ${t.houseFromMoon} from Moon`} · {isHi ? `लग्न से ${t.houseFromAsc}वां भाव` : `House ${t.houseFromAsc} from Lagna`}
              </div>
              <div style={{ marginTop: 8, fontSize: 11.5, color: isFavorable ? "#34D399" : "#FBBF24", fontWeight: 700 }}>
                {isFavorable
                  ? (isHi ? "✓ गोचर में शुभ एवं प्रगतिशील फल" : "✓ Favorable & Auspicious Transit")
                  : (isHi ? "⚡ संयम, ध्यान व कर्म संतुलन आवश्यक" : "⚡ Mindful & Conscious Effort Needed")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** 5. PLANETARY STRENGTH (SHADBALA) TOOL **/
function ShadbalaTool({ corePlanets, ascendantDegree, userData, isHi }) {
  const birthDate = useMemo(() => {
    try {
      return new Date(`${userData.dob}T${userData.tob || "12:00"}`);
    } catch (e) {
      return new Date();
    }
  }, [userData.dob, userData.tob]);

  // Sanitize planets
  const sanitizedPlanets = useMemo(() => {
    const res = {};
    Object.entries(corePlanets || {}).forEach(([pName, pVal]) => {
      res[pName] = typeof pVal === "number" ? pVal : (pVal?.longitude || pVal?.degree || 0);
    });
    return res;
  }, [corePlanets]);

  const shadbala = useMemo(() => {
    return calculateShadbala(sanitizedPlanets, ascendantDegree, birthDate, isHi ? "hi" : "en");
  }, [sanitizedPlanets, ascendantDegree, birthDate, isHi]);

  const scoresList = useMemo(() => {
    const dict = shadbala?.planetScores || {};
    return Object.values(dict).sort((a, b) => (a.rank || 99) - (b.rank || 99));
  }, [shadbala]);

  const PLANET_NAMES_HI = {
    Sun: "सूर्य देव",
    Moon: "चंद्र देव",
    Mars: "मंगल देव",
    Mercury: "बुध देव",
    Jupiter: "गुरु बृहस्पति",
    Venus: "शुक्र देव",
    Saturn: "शनि देव"
  };

  return (
    <div>
      <div style={{ background: "rgba(0,0,0,0.35)", padding: 18, borderRadius: 16, marginBottom: 20, border: "1px solid rgba(212,175,55,0.25)" }}>
        <div style={{ color: "#FDE68A", fontSize: 15, fontWeight: 800 }}>
          {isHi ? "सप्तग्रह षड्बल रूपा सामर्थ्य (Shadbala Strength in Rupas)" : "Seven Planetary Shadbala Strengths in Rupas (60 Virupas = 1 Rupa)"}
        </div>
        <div style={{ color: "rgba(241,231,208,0.85)", fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>
          {isHi
            ? "स्थान बल, दिग् बल, काल बल, चेष्टा बल, नैसर्गिक बल एवं दृग् बल का संपूर्ण गणितीय विश्लेषण।"
            : "Complete composite breakdown of Sthana, Dig, Kala, Chesta, Naisargika, and Drik Balas according to Maharishi Parashara."}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        {scoresList.map(p => {
          const rupas = (p.totalVirupas / 60).toFixed(2);
          const isSupreme = p.ratioPct >= 120;
          return (
            <div key={p.planet} style={{ background: "rgba(18, 12, 36, 0.88)", border: `1px solid ${p.badgeColor || "rgba(212,175,55,0.25)"}`, borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div>
                  <span style={{ color: "#FDE68A", fontWeight: 800, fontSize: 16 }}>
                    {isHi ? PLANET_NAMES_HI[p.planet] || p.planet : p.planet}
                  </span>
                  <span style={{ background: "rgba(245, 158, 11, 0.2)", color: "#F59E0B", padding: "1px 7px", borderRadius: 8, fontSize: 11, fontWeight: 800, marginLeft: 8 }}>
                    #{p.rank}
                  </span>
                </div>
                <span style={{ color: p.badgeColor || "#34D399", fontWeight: 900, fontSize: 16 }}>
                  {rupas} Rupas
                </span>
              </div>

              <div style={{ fontSize: 12, color: "rgba(241,231,208,0.75)", marginBottom: 8 }}>
                {p.totalVirupas} / {p.minRequired} Virupas ({p.ratioPct}%)
              </div>

              {/* Progress bar */}
              <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${Math.min(100, (p.totalVirupas / 600) * 100)}%`, height: "100%", background: `linear-gradient(90deg, ${p.badgeColor || "#10B981"}, #FBBF24)` }} />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <span style={{ fontSize: 11.5, color: p.badgeColor || "#34D399", fontWeight: 700 }}>
                  {p.category}
                </span>
                <span style={{ fontSize: 10.5, color: "rgba(241,231,208,0.6)" }}>
                  {isHi ? `स्थान: ${p.sthana} | दिग्: ${p.dig}` : `Sthana: ${p.sthana} | Dig: ${p.dig}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** 6. KP CHART & SUB-LORDS TOOL **/
function KpChartTool({ corePlanets, ascendantDegree, userData, isHi }) {
  const kpChart = calculateKpChart({
    birthDate: new Date(`${userData.dob}T${userData.tob || "12:00"}`),
    lat: userData.lat,
    lon: userData.lon,
    planets: corePlanets,
    ascDeg: ascendantDegree
  });

  return (
    <div>
      {/* KP Methodology Disclaimer Note */}
      <div style={{ background: "rgba(245, 158, 11, 0.12)", border: "1px solid rgba(245, 158, 11, 0.35)", borderRadius: 12, padding: "12px 16px", marginBottom: 18, fontSize: 12.5, color: "rgba(241,231,208,0.9)", lineHeight: 1.5 }}>
        ℹ️ <b>{isHi ? "केपी पद्धति सिद्धांत:" : "KP Principles Note:"}</b> {kpChart.description}
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, textAlign: "left" }}>
          <thead>
            <tr style={{ background: "rgba(245, 158, 11, 0.18)", color: "#FDE68A" }}>
              <th style={{ padding: "10px 12px", borderBottom: "1px solid rgba(212,175,55,0.3)" }}>{isHi ? "ग्रह / भाव" : "Body / Cusp"}</th>
              <th style={{ padding: "10px 12px", borderBottom: "1px solid rgba(212,175,55,0.3)" }}>{isHi ? "राशि" : "Sign"}</th>
              <th style={{ padding: "10px 12px", borderBottom: "1px solid rgba(212,175,55,0.3)" }}>{isHi ? "अंश" : "Degree"}</th>
              <th style={{ padding: "10px 12px", borderBottom: "1px solid rgba(212,175,55,0.3)" }}>{isHi ? "राशि स्वामी" : "Sign Lord"}</th>
              <th style={{ padding: "10px 12px", borderBottom: "1px solid rgba(212,175,55,0.3)" }}>{isHi ? "नक्षत्र स्वामी (Star)" : "Star Lord"}</th>
              <th style={{ padding: "10px 12px", borderBottom: "1px solid rgba(212,175,55,0.3)" }}>{isHi ? "उप-स्वामी (Sub-Lord)" : "Sub-Lord"}</th>
            </tr>
          </thead>
          <tbody>
            {(kpChart.kpPlanets || []).map((p, idx) => (
              <tr key={p.planet} style={{ background: idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                <td style={{ padding: "9px 12px", fontWeight: 700, color: "#FDE68A" }}>{p.planet}</td>
                <td style={{ padding: "9px 12px" }}>{isHi ? p.signHi : p.sign}</td>
                <td style={{ padding: "9px 12px" }}>{p.degreeInSign.toFixed(2)}°</td>
                <td style={{ padding: "9px 12px" }}>{p.signLord}</td>
                <td style={{ padding: "9px 12px" }}>{p.starLord}</td>
                <td style={{ padding: "9px 12px", color: "#34D399", fontWeight: 800 }}>{p.subLord}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** 7. KP SIGNIFICATORS TOOL **/
function KpSignificatorsTool({ isHi }) {
  const DOMAINS = [
    { id: "career", titleEn: "Career & Promotion (Houses 2, 6, 10, 11)", titleHi: "करियर व पदोन्नति (भाव २, ६, १०, ११)", favorable: [2, 6, 10, 11], planets: ["Sun", "Saturn", "Mercury", "Jupiter"] },
    { id: "marriage", titleEn: "Marriage & Partnership (Houses 2, 7, 11)", titleHi: "विवाह व दांपत्य (भाव २, ७, ११)", favorable: [2, 7, 11], planets: ["Venus", "Jupiter", "Moon"] },
    { id: "property", titleEn: "Property & Vehicle Purchase (Houses 4, 11, 12)", titleHi: "संपत्ति व वाहन क्रय (भाव ४, ११, १२)", favorable: [4, 11, 12], planets: ["Mars", "Venus", "Saturn"] },
    { id: "education", titleEn: "Higher Education & Knowledge (Houses 4, 9, 11)", titleHi: "उच्च शिक्षा व विद्या (भाव ४, ९, ११)", favorable: [4, 9, 11], planets: ["Mercury", "Jupiter"] }
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        {DOMAINS.map(d => (
          <div key={d.id} style={{ background: "rgba(18, 12, 36, 0.88)", border: "1px solid rgba(212, 175, 55, 0.3)", borderRadius: 14, padding: "18px 20px" }}>
            <h4 style={{ color: "#FDE68A", fontSize: 15, fontWeight: 800, margin: "0 0 8px" }}>
              {isHi ? d.titleHi : d.titleEn}
            </h4>
            <div style={{ fontSize: 12.5, color: "rgba(241,231,208,0.85)", lineHeight: 1.6 }}>
              • <b>{isHi ? "फलप्रद भाव:" : "Activating Houses:"}</b> {d.favorable.join(", ")}
              <br />
              • <b>{isHi ? "प्रमुख कारक ग्रह:" : "Key Ruling Significators:"}</b> {d.planets.join(", ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 8. KP HORARY 1-249 TOOL **/
function KpHoraryTool({ horaryNumberInput, setHoraryNumberInput, horaryQueryTopic, setHoraryQueryTopic, isHi }) {
  const result = calculateKpHorary({ horaryNumber: horaryNumberInput, queryTopic: horaryQueryTopic });

  return (
    <div>
      {/* Horary Input Controls */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", marginBottom: 22, background: "rgba(0,0,0,0.35)", padding: 18, borderRadius: 14 }}>
        <div style={{ flex: "1 1 180px" }}>
          <label style={{ fontSize: 12, color: "#FDE68A", fontWeight: 700, display: "block", marginBottom: 6 }}>
            {isHi ? "प्रश्नावली संख्या (1 से 249):" : "Choose Horary Number (1 to 249):"}
          </label>
          <input
            type="number"
            min="1"
            max="249"
            value={horaryNumberInput}
            onChange={e => setHoraryNumberInput(e.target.value)}
            style={{ width: "100%", background: "rgba(22,15,42,0.9)", border: "1.5px solid #F59E0B", borderRadius: 8, padding: "8px 14px", color: "#FDE68A", fontSize: 16, fontWeight: 800, boxSizing: "border-box" }}
          />
        </div>

        <div style={{ flex: "1 1 240px" }}>
          <label style={{ fontSize: 12, color: "#FDE68A", fontWeight: 700, display: "block", marginBottom: 6 }}>
            {isHi ? "प्रश्न का विषय (Query Topic):" : "Query Topic:"}
          </label>
          <select
            value={horaryQueryTopic}
            onChange={e => setHoraryQueryTopic(e.target.value)}
            className="custom-select-arrow"
            style={{ width: "100%", background: "rgba(22,15,42,0.9)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8, padding: "9px 30px 9px 12px", color: "#FFF", fontSize: 13, outline: "none" }}
          >
            <option value="career">{isHi ? "💼 करियर व पदोन्नति" : "💼 Career & Promotion"}</option>
            <option value="marriage">{isHi ? "💍 विवाह व दांपत्य" : "💍 Marriage & Relationship"}</option>
            <option value="property">{isHi ? "🏠 संपत्ति व भूमि क्रय" : "🏠 Property & Vehicle"}</option>
            <option value="health">{isHi ? "🌿 स्वास्थ्य व रोग मुक्ति" : "🌿 Health & Recovery"}</option>
            <option value="foreign">{isHi ? "✈️ विदेश गमन व यात्रा" : "✈️ Foreign Travel"}</option>
          </select>
        </div>
      </div>

      {/* Horary Verdict Card */}
      <div style={{ background: "linear-gradient(135deg, rgba(38, 22, 68, 0.95), rgba(18, 11, 40, 0.98))", border: "1.5px solid #F59E0B", borderRadius: 16, padding: "20px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ color: "#34D399", fontWeight: 800, fontSize: 13 }}>
            ✓ {isHi ? `केपी प्रश्न #${result.horaryNumber}` : `KP Horary #${result.horaryNumber}`}
          </span>
          <span style={{ color: "#FDE68A", fontSize: 12 }}>
            {result.ascendantSign} · {result.starLord} Star · {result.subLord} Sub
          </span>
        </div>

        <h3 style={{ color: "#FDE68A", fontSize: 18, fontWeight: 800, margin: "0 0 8px" }}>
          {isHi ? "केपी प्रश्न फलकथन (KP Verdict)" : "KP Prashna Astrological Verdict"}
        </h3>
        <p style={{ color: "rgba(241, 231, 208, 0.9)", fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>
          {isHi ? result.verdict.summaryHi : result.verdict.summaryEn}
        </p>
      </div>
    </div>
  );
}

/** 9. KP RULING PLANETS TOOL **/
function KpRulingPlanetsTool({ isHi }) {
  const rpData = calculateKpRulingPlanets({});

  return (
    <div>
      <div style={{ background: "rgba(0,0,0,0.35)", padding: 16, borderRadius: 14, marginBottom: 20 }}>
        <div style={{ color: "#FDE68A", fontSize: 14.5, fontWeight: 800 }}>
          {isHi ? "तात्कालिक सत्तारूढ़ ग्रह (Ruling Planets at This Moment)" : "Ruling Planets (RP) at This Moment"}
        </div>
        <div style={{ color: "rgba(241,231,208,0.75)", fontSize: 12, marginTop: 4 }}>
          {rpData.queryMoment} · {rpData.usageGuide}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        {rpData.rulingPlanets.map((rp, idx) => (
          <div key={idx} style={{ background: "rgba(18, 12, 36, 0.88)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 12, padding: "14px" }}>
            <div style={{ fontSize: 11.5, color: "rgba(243, 211, 122, 0.75)", marginBottom: 4 }}>
              {isHi ? rp.roleHi : rp.roleEn}
            </div>
            <div style={{ color: "#34D399", fontSize: 18, fontWeight: 800 }}>
              {rp.planet}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 10. LIFE PATH NUMBER TOOL **/
function LifePathTool({ userData, setUserData, isHi }) {
  const lp = calculateLifePathNumber(userData.dob);

  return (
    <div>
      <div style={{ marginBottom: 20, background: "rgba(0,0,0,0.35)", padding: 16, borderRadius: 14 }}>
        <label style={{ fontSize: 12, color: "#FDE68A", fontWeight: 700, display: "block", marginBottom: 6 }}>
          {isHi ? "अपनी जन्म तिथि दर्ज करें:" : "Enter Birth Date for Life Path Calculation:"}
        </label>
        <input
          type="date"
          value={userData.dob}
          onChange={e => setUserData({ ...userData, dob: e.target.value })}
          style={{ width: "100%", maxWidth: 300, background: "rgba(22,15,42,0.9)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8, padding: "8px 12px", color: "#FFF", fontSize: 13, colorScheme: "dark" }}
        />
      </div>

      {lp && (
        <div style={{ background: "linear-gradient(135deg, rgba(38, 22, 68, 0.95), rgba(18, 11, 40, 0.98))", border: "1.5px solid #F59E0B", borderRadius: 18, padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "#34D399", fontWeight: 800, fontSize: 12 }}>
              {lp.calculationSteps}
            </span>
            {lp.isMasterNumber && (
              <span style={{ background: "linear-gradient(90deg, #F59E0B, #D97706)", color: "#0F0A1E", padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 800 }}>
                ★ {isHi ? "मास्टर नंबर (Master Number)" : "Master Number Vibrations"}
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#0F0A1E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 900 }}>
              {lp.lifePathNumber}
            </div>
            <div>
              <h3 style={{ color: "#FDE68A", fontSize: 18, fontWeight: 800, margin: 0 }}>
                {isHi ? lp.archetype.titleHi : lp.archetype.titleEn}
              </h3>
              <div style={{ color: "rgba(241, 231, 208, 0.75)", fontSize: 12.5, marginTop: 3 }}>
                {isHi ? `स्वामी ग्रह: ${lp.archetype.ruler}` : `Ruling Energy: ${lp.archetype.planet}`}
              </div>
            </div>
          </div>

          <p style={{ color: "rgba(241, 231, 208, 0.9)", fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>
            {isHi ? lp.archetype.traitsHi : lp.archetype.traitsEn}
          </p>
        </div>
      )}
    </div>
  );
}

/** 11. NAME NUMEROLOGY TOOL **/
function NameNumerologyTool({ nameNumerologyInput, setNameNumerologyInput, isHi }) {
  const result = calculateNameNumerology(nameNumerologyInput);

  return (
    <div>
      <div style={{ marginBottom: 20, background: "rgba(0,0,0,0.35)", padding: 16, borderRadius: 14 }}>
        <label style={{ fontSize: 12, color: "#FDE68A", fontWeight: 700, display: "block", marginBottom: 6 }}>
          {isHi ? "नाम दर्ज करें (व्यक्तिगत, व्यापार या ब्रांड):" : "Enter Name (Personal, Business, or Brand):"}
        </label>
        <input
          type="text"
          value={nameNumerologyInput}
          onChange={e => setNameNumerologyInput(e.target.value)}
          placeholder="e.g. Rahul Sharma or TechVeda"
          style={{ width: "100%", maxWidth: 440, background: "rgba(22,15,42,0.9)", border: "1.5px solid #F59E0B", borderRadius: 8, padding: "10px 14px", color: "#FDE68A", fontSize: 15, fontWeight: 700, boxSizing: "border-box" }}
        />
      </div>

      {result && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {/* Chaldean Card */}
          <div style={{ background: "rgba(18, 12, 36, 0.9)", border: "1.5px solid rgba(245, 158, 11, 0.4)", borderRadius: 16, padding: "20px" }}>
            <h4 style={{ color: "#FDE68A", fontSize: 16, fontWeight: 800, margin: "0 0 10px" }}>
              {isHi ? "काल्डियन वैदिक अंकशास्त्र" : "Chaldean System (Sound Vibration)"}
            </h4>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              {result.chaldean.letters.map((item, idx) => (
                <div key={idx} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "4px 8px", textAlign: "center", border: "1px solid rgba(212,175,55,0.2)" }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{item.char}</div>
                  <div style={{ fontSize: 11, color: "#F59E0B", fontWeight: 800 }}>{item.val}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 14, color: "#34D399", fontWeight: 800 }}>
              {isHi ? "काल्डियन नामांक:" : "Chaldean Name Number:"} {result.chaldean.nameNumber} (Compound {result.chaldean.compoundNumber})
            </div>
          </div>

          {/* Pythagorean Card */}
          <div style={{ background: "rgba(18, 12, 36, 0.9)", border: "1.5px solid rgba(212, 175, 55, 0.3)", borderRadius: 16, padding: "20px" }}>
            <h4 style={{ color: "#FDE68A", fontSize: 16, fontWeight: 800, margin: "0 0 10px" }}>
              {isHi ? "पाइथागोरियन पाश्चात्य अंकशास्त्र" : "Pythagorean System (Western 1–9)"}
            </h4>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              {result.pythagorean.letters.map((item, idx) => (
                <div key={idx} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "4px 8px", textAlign: "center", border: "1px solid rgba(212,175,55,0.2)" }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{item.char}</div>
                  <div style={{ fontSize: 11, color: "#60A5FA", fontWeight: 800 }}>{item.val}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 14, color: "#60A5FA", fontWeight: 800 }}>
              {isHi ? "पाइथागोरियन भाग्यांक:" : "Destiny Number:"} {result.pythagorean.destinyNumber} (Compound {result.pythagorean.compoundNumber})
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** 12. PERSONAL YEAR TOOL **/
function PersonalYearTool({ userData, isHi }) {
  const result = calculatePersonalYearAndMonth(userData.dob);

  return (
    <div>
      {result && (
        <div style={{ background: "linear-gradient(135deg, rgba(38, 22, 68, 0.95), rgba(18, 11, 40, 0.98))", border: "1.5px solid #F59E0B", borderRadius: 18, padding: "22px" }}>
          <div style={{ color: "#34D399", fontWeight: 800, fontSize: 12, marginBottom: 6 }}>
            ✓ {isHi ? `${result.targetYear} का व्यक्तिगत वर्ष चक्र` : `Personal Epicycle for Year ${result.targetYear}`}
          </div>
          <h3 style={{ color: "#FDE68A", fontSize: 20, fontWeight: 800, margin: "0 0 10px" }}>
            {isHi ? result.yearTheme.titleHi : result.yearTheme.titleEn}
          </h3>
          <p style={{ color: "rgba(241, 231, 208, 0.9)", fontSize: 13.5, lineHeight: 1.6, margin: "0 0 14px" }}>
            {isHi ? result.yearTheme.descHi || result.yearTheme.descEn : result.yearTheme.descEn}
          </p>
          <div style={{ fontSize: 12.5, color: "#FDE68A", fontWeight: 700 }}>
            • {isHi ? `चालू माह का अंक: ${result.personalMonth}` : `Current Month Vibration: Personal Month ${result.personalMonth}`}
          </div>
        </div>
      )}
    </div>
  );
}

/** 13. NUMBER COMPATIBILITY TOOL **/
function NumberCompatibilityTool({ userData, partnerDobInput, setPartnerDobInput, isHi }) {
  const result = calculateNumberCompatibility(userData.dob, partnerDobInput);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginBottom: 20, background: "rgba(0,0,0,0.35)", padding: 16, borderRadius: 14 }}>
        <div>
          <label style={{ fontSize: 12, color: "#FDE68A", fontWeight: 700, display: "block", marginBottom: 4 }}>
            {isHi ? "आपकी जन्म तिथि:" : "Your Birth Date:"}
          </label>
          <div style={{ color: "#FFF", fontSize: 13, fontWeight: 700 }}>{userData.dob} (मूलांक {result.moolank})</div>
        </div>
        <div>
          <label style={{ fontSize: 12, color: "#FDE68A", fontWeight: 700, display: "block", marginBottom: 4 }}>
            {isHi ? "जीवनसाथी / मित्र की जन्म तिथि:" : "Partner / Companion Date:"}
          </label>
          <input
            type="date"
            value={partnerDobInput}
            onChange={e => setPartnerDobInput(e.target.value)}
            style={{ width: "100%", background: "rgba(22,15,42,0.9)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8, padding: "7px 12px", color: "#FFF", fontSize: 13, colorScheme: "dark" }}
          />
        </div>
      </div>

      <div style={{ background: "rgba(18, 12, 36, 0.9)", border: "1.5px solid rgba(245, 158, 11, 0.4)", borderRadius: 16, padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ color: "#FDE68A", fontSize: 16, fontWeight: 800 }}>
            {isHi ? "संख्या अनुकूलता स्कोर" : "Numerical Compatibility"}
          </span>
          {result.partnerResult && (
            <span style={{ background: result.partnerResult.isHarmonious ? "#10B981" : "#F59E0B", color: "#0F0A1E", padding: "3px 12px", borderRadius: 12, fontSize: 13, fontWeight: 900 }}>
              {result.partnerResult.compatibilityScore}% {result.partnerResult.isHarmonious ? (isHi ? "अति अनुकूल" : "Harmonious") : (isHi ? "सामान्य" : "Moderate")}
            </span>
          )}
        </div>

        <div style={{ fontSize: 13, color: "rgba(241, 231, 208, 0.85)", lineHeight: 1.6 }}>
          • <b>{isHi ? "मित्र अंक (Friendly Numbers):" : "Harmonious Numbers:"}</b> {result.friendlyNumbers.join(", ")}
          <br />
          • <b>{isHi ? "शत्रु अंक (Challenging Numbers):" : "Challenging Numbers:"}</b> {result.enemyNumbers.join(", ")}
        </div>
      </div>
    </div>
  );
}

/** 14. CHOGHADIYA TOOL **/
function ChoghadiyaTool({ dailyPanchangData, isHi }) {
  if (!dailyPanchangData) return null;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <span style={{ color: "#FDE68A", fontSize: 14, fontWeight: 800 }}>
          {dailyPanchangData.displayDate} · {isHi ? "८ दिन व ८ रात्रि चौघड़िया स्लॉट" : "8 Day & 8 Night Choghadiya Slots"}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {/* Day Choghadiya */}
        <div>
          <h4 style={{ color: "#F59E0B", fontSize: 14, fontWeight: 800, marginBottom: 10 }}>
            ☀️ {isHi ? "दिन का चौघड़िया (Day)" : "Day Choghadiya"}
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(dailyPanchangData.choghadiyaDay || []).map((c, idx) => (
              <div key={idx} style={{ background: "rgba(18, 12, 36, 0.8)", border: "1px solid rgba(212, 175, 55, 0.2)", borderRadius: 10, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, color: c.color || "#FDE68A" }}>{isHi ? c.nameHi : c.nameEn}</span>
                <span style={{ fontSize: 11, color: "rgba(241,231,208,0.7)" }}>{c.time}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: c.color }}>{c.quality}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Night Choghadiya */}
        <div>
          <h4 style={{ color: "#60A5FA", fontSize: 14, fontWeight: 800, marginBottom: 10 }}>
            🌙 {isHi ? "रात्रि का चौघड़िया (Night)" : "Night Choghadiya"}
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(dailyPanchangData.choghadiyaNight || []).map((c, idx) => (
              <div key={idx} style={{ background: "rgba(18, 12, 36, 0.8)", border: "1px solid rgba(212, 175, 55, 0.2)", borderRadius: 10, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, color: c.color || "#FDE68A" }}>{isHi ? c.nameHi : c.nameEn}</span>
                <span style={{ fontSize: 11, color: "rgba(241,231,208,0.7)" }}>{c.time}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: c.color }}>{c.quality}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** 15. RAHU KAAL TOOL **/
function RahuKaalTool({ dailyPanchangData, isHi }) {
  if (!dailyPanchangData) return null;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
        <div style={{ background: "rgba(239, 68, 68, 0.12)", border: "1.5px solid #EF4444", borderRadius: 14, padding: "18px 20px" }}>
          <div style={{ color: "#FCA5A5", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>
            ⏱️ {isHi ? "राहुकाल (वर्जित समय)" : "Rahu Kaal (Avoid New Initiatives)"}
          </div>
          <div style={{ color: "#FFF", fontSize: 20, fontWeight: 900, margin: "6px 0" }}>
            {dailyPanchangData.rahuKaal}
          </div>
          <div style={{ color: "rgba(241, 231, 208, 0.8)", fontSize: 12 }}>
            {isHi ? "शुभ कार्यों, अनुबंध हस्ताक्षर व यात्रा के लिए वर्जित।" : "Avoid auspicious ceremonies and document signings."}
          </div>
        </div>

        <div style={{ background: "rgba(245, 158, 11, 0.12)", border: "1.5px solid #F59E0B", borderRadius: 14, padding: "18px 20px" }}>
          <div style={{ color: "#FDE68A", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>
            ⏳ {isHi ? "यमगंड काल" : "Yamaganda Kaal"}
          </div>
          <div style={{ color: "#FFF", fontSize: 20, fontWeight: 900, margin: "6px 0" }}>
            {dailyPanchangData.inauspicious?.yamaganda || "06:00 AM - 07:30 AM"}
          </div>
          <div style={{ color: "rgba(241, 231, 208, 0.8)", fontSize: 12 }}>
            {isHi ? "वित्तीय लेन-देन में सावधानी बरतें।" : "Exercise caution in financial transactions."}
          </div>
        </div>

        <div style={{ background: "rgba(99, 102, 241, 0.12)", border: "1.5px solid #6366F1", borderRadius: 14, padding: "18px 20px" }}>
          <div style={{ color: "#A5B4FC", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>
            🪐 {isHi ? "गुलिक काल" : "Gulika Kaal"}
          </div>
          <div style={{ color: "#FFF", fontSize: 20, fontWeight: 900, margin: "6px 0" }}>
            {dailyPanchangData.inauspicious?.gulika || "01:30 PM - 03:00 PM"}
          </div>
          <div style={{ color: "rgba(241, 231, 208, 0.8)", fontSize: 12 }}>
            {isHi ? "शनि की संतान गुलिक की सूक्ष्म समय अवधि।" : "Saturn's sub-period indicator."}
          </div>
        </div>
      </div>
    </div>
  );
}

/** 16. MUHURAT FINDER TOOL **/
function MuhuratFinderTool({ selectedMuhuratEvent, setSelectedMuhuratEvent, isHi }) {
  const EVENTS = [
    { id: "vivah", nameEn: "💍 Vivah (Marriage / Engagement)", nameHi: "💍 विवाह एवं सगाई मुहूर्त" },
    { id: "griha", nameEn: "🏠 Griha Pravesh (House Warming)", nameHi: "🏠 गृह प्रवेश मुहूर्त" },
    { id: "vehicle", nameEn: "🚗 Vehicle Purchase", nameHi: "🚗 वाहन क्रय मुहूर्त" },
    { id: "business", nameEn: "💼 Business / Shop Opening", nameHi: "💼 नवीन व्यापार व प्रतिष्ठान आरंभ" }
  ];

  return (
    <div>
      <div style={{ marginBottom: 20, background: "rgba(0,0,0,0.35)", padding: 16, borderRadius: 14 }}>
        <label style={{ fontSize: 12, color: "#FDE68A", fontWeight: 700, display: "block", marginBottom: 6 }}>
          {isHi ? "कार्य / संस्कार का चयन करें:" : "Select Life Event / Ceremony:"}
        </label>
        <select
          value={selectedMuhuratEvent}
          onChange={e => setSelectedMuhuratEvent(e.target.value)}
          className="custom-select-arrow"
          style={{ width: "100%", maxWidth: 400, background: "rgba(22,15,42,0.9)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8, padding: "9px 30px 9px 12px", color: "#FDE68A", fontSize: 13.5, fontWeight: 700, outline: "none" }}
        >
          {EVENTS.map(ev => (
            <option key={ev.id} value={ev.id} style={{ background: "#0F0A1E", color: "#FFF" }}>
              {isHi ? ev.nameHi : ev.nameEn}
            </option>
          ))}
        </select>
      </div>

      <div style={{ background: "rgba(18, 12, 36, 0.88)", border: "1px solid rgba(212, 175, 55, 0.3)", borderRadius: 16, padding: "20px" }}>
        <div style={{ color: "#34D399", fontWeight: 800, fontSize: 13, marginBottom: 8 }}>
          ✓ {isHi ? "आगामी श्रेष्ठ शुभ मुहूर्त खिड़कियां" : "Recommended Upcoming Shubh Windows"}
        </div>
        <div style={{ fontSize: 13, color: "rgba(241,231,208,0.85)", lineHeight: 1.6 }}>
          • <b>{isHi ? "अभिजीत मुहूर्त:" : "Abhijit Muhurat:"}</b> 11:45 AM – 12:35 PM (Daily Solar Noon Auspiciousness)
          <br />
          • <b>{isHi ? "अमृत सिद्धि योग:" : "Amrit Siddhi Yoga:"}</b> Moon in Rohini / Pushya constellation aligns with Thursday/Friday.
          <br />
          • <b>{isHi ? "वर्जित स्थितियां:" : "Cautionary Exclusions:"}</b> Avoid Rahu Kaal, Bhadra (Vishti Karana), and Krishna Chaturdashi.
        </div>
      </div>
    </div>
  );
}

/** 17. DAILY TRANSIT HOROSCOPE TOOL **/
function DailyTransitHoroscopeTool({ userData, corePlanets, isHi }) {
  const moonLon = corePlanets?.Moon || 116.5;
  const moonNak = getNakshatraInfo(moonLon);

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, rgba(38, 22, 68, 0.95), rgba(18, 11, 40, 0.98))", border: "1.5px solid #F59E0B", borderRadius: 18, padding: "22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
          <span style={{ color: "#34D399", fontWeight: 800, fontSize: 12 }}>
            ✓ {isHi ? `व्यक्तिगत चंद्र राशि: ${moonNak.rashi}` : `Personal Natal Moon: ${moonNak.rashi}`}
          </span>
          <span style={{ color: "#FDE68A", fontSize: 12 }}>
            Nakshatra: {moonNak.name} ({moonNak.lord})
          </span>
        </div>

        <h3 style={{ color: "#FDE68A", fontSize: 18, fontWeight: 800, margin: "0 0 10px" }}>
          {isHi ? "आज का तात्कालिक गोचर विश्लेषण" : "Today's Astrological Transit Influence"}
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginTop: 14 }}>
          <div style={{ background: "rgba(0,0,0,0.3)", padding: 12, borderRadius: 10 }}>
            <div style={{ color: "#60A5FA", fontWeight: 700, fontSize: 12 }}>💼 {isHi ? "करियर व कर्म" : "Career & Focus"}</div>
            <div style={{ fontSize: 12.5, marginTop: 4, color: "rgba(241,231,208,0.85)" }}>{isHi ? "सकारात्मक संवाद एवं नई योजनाएं फलदायी रहेंगी।" : "Strategic outreach and clear communication yield progress."}</div>
          </div>
          <div style={{ background: "rgba(0,0,0,0.3)", padding: 12, borderRadius: 10 }}>
            <div style={{ color: "#F59E0B", fontWeight: 700, fontSize: 12 }}>💰 {isHi ? "धन व वित्त" : "Wealth & Finance"}</div>
            <div style={{ fontSize: 12.5, marginTop: 4, color: "rgba(241,231,208,0.85)" }}>{isHi ? "अनावश्यक व्यय पर नियंत्रण रखें।" : "Steady cash flow; avoid speculative risks today."}</div>
          </div>
          <div style={{ background: "rgba(0,0,0,0.3)", padding: 12, borderRadius: 10 }}>
            <div style={{ color: "#EC4899", fontWeight: 700, fontSize: 12 }}>❤️ {isHi ? "दांपत्य व प्रेम" : "Relationships"}</div>
            <div style={{ fontSize: 12.5, marginTop: 4, color: "rgba(241,231,208,0.85)" }}>{isHi ? "पारिवारिक सौहार्द एवं आपसी समझ में वृद्धि।" : "Warm emotional resonance and supportive dialogue."}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 18. PRASHNA QUICK ORACLE TOOL **/
function PrashnaOracleTool({ prashnaQuestionInput, setPrashnaQuestionInput, isHi }) {
  const oracle = getPrashnaQuickOracle({ question: prashnaQuestionInput });

  return (
    <div>
      <div style={{ marginBottom: 20, background: "rgba(0,0,0,0.35)", padding: 16, borderRadius: 14 }}>
        <label style={{ fontSize: 12, color: "#FDE68A", fontWeight: 700, display: "block", marginBottom: 6 }}>
          {isHi ? "अपना प्रश्न दर्ज करें (उदा. क्या मैं यह कार्य करूं?):" : "Ask Your Immediate Decision Question:"}
        </label>
        <input
          type="text"
          value={prashnaQuestionInput}
          onChange={e => setPrashnaQuestionInput(e.target.value)}
          style={{ width: "100%", background: "rgba(22,15,42,0.9)", border: "1.5px solid #F59E0B", borderRadius: 8, padding: "10px 14px", color: "#FDE68A", fontSize: 14, fontWeight: 700, boxSizing: "border-box" }}
        />
      </div>

      <div style={{ background: "linear-gradient(135deg, rgba(38, 22, 68, 0.95), rgba(18, 11, 40, 0.98))", border: "2px solid #F59E0B", borderRadius: 18, padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
          <span style={{ color: "#34D399", fontWeight: 800, fontSize: 12 }}>
            ⏱️ {isHi ? `प्रश्न क्षण: ${oracle.consultationTime}` : `Query Moment: ${oracle.consultationTime}`}
          </span>
          <span style={{ color: "#FDE68A", fontSize: 12, fontWeight: 700 }}>
            {isHi ? `सक्रिय होरा: ${oracle.horaLord}` : `Active Planetary Hora: ${oracle.horaLord}`}
          </span>
        </div>

        <div style={{ fontSize: 24, fontWeight: 900, color: oracle.isBeneficHora ? "#34D399" : "#F59E0B", marginBottom: 10 }}>
          {oracle.verdict}
        </div>

        <p style={{ color: "rgba(241, 231, 208, 0.9)", fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>
          {isHi ? oracle.guidanceHi : oracle.guidanceEn}
        </p>
      </div>
    </div>
  );
}

/** 19. TARA BALA & CHANDRA BALA TOOL **/
function TaraChandraBalaTool({ corePlanets, isHi }) {
  const moonLon = corePlanets?.Moon || 116.5;
  const moonNak = getNakshatraInfo(moonLon);
  const tara = calculateTaraBala(moonNak.index, (moonNak.index + 5) % 27);
  const chandra = calculateChandraBala(Math.floor(moonLon / 30), (Math.floor(moonLon / 30) + 6) % 12);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {/* Tara Bala */}
        <div style={{ background: "rgba(18, 12, 36, 0.9)", border: "1.5px solid rgba(245, 158, 11, 0.4)", borderRadius: 16, padding: "20px" }}>
          <div style={{ color: "#F59E0B", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>
            ⭐ {isHi ? "तारा बल (९ तारा चक्र)" : "Tara Bala (9 Taras)"}
          </div>
          <div style={{ color: "#FDE68A", fontSize: 20, fontWeight: 900, margin: "6px 0" }}>
            {isHi ? tara.nameHi : tara.nameEn}
          </div>
          <div style={{ color: "#34D399", fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
            {tara.quality} · Score: {tara.score}%
          </div>
          <div style={{ color: "rgba(241,231,208,0.85)", fontSize: 12.5, lineHeight: 1.5 }}>
            {tara.descEn}
          </div>
        </div>

        {/* Chandra Bala */}
        <div style={{ background: "rgba(18, 12, 36, 0.9)", border: "1.5px solid rgba(212, 175, 55, 0.3)", borderRadius: 16, padding: "20px" }}>
          <div style={{ color: "#60A5FA", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>
            🌙 {isHi ? "चंद्र बल (गोचर भाव)" : "Chandra Bala"}
          </div>
          <div style={{ color: "#FFF", fontSize: 20, fontWeight: 900, margin: "6px 0" }}>
            {isHi ? `${chandra.houseFromMoon}वां भाव` : `House ${chandra.houseFromMoon}`}
          </div>
          <div style={{ color: chandra.isAuspicious ? "#34D399" : "#F59E0B", fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
            {chandra.isAuspicious ? (isHi ? "अनुकूल चंद्र बल" : "Favorable Moon Strength") : (isHi ? "सतर्कता आवश्यक" : "Cautionary")}
          </div>
          <div style={{ color: "rgba(241,231,208,0.85)", fontSize: 12.5, lineHeight: 1.5 }}>
            {isHi ? chandra.verdictHi : chandra.verdictEn}
          </div>
        </div>
      </div>
    </div>
  );
}

/** 20. PANCHA PAKSHI TOOL **/
function PanchaPakshiTool({ corePlanets, isHi }) {
  const moonLon = corePlanets?.Moon || 116.5;
  const moonNak = getNakshatraInfo(moonLon);
  const birdData = calculatePanchaPakshi(moonNak.index);

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, rgba(38, 22, 68, 0.95), rgba(18, 11, 40, 0.98))", border: "1.5px solid #F59E0B", borderRadius: 18, padding: "22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
          <span style={{ fontSize: 44 }}>{birdData.rulingBird.symbol}</span>
          <div>
            <div style={{ color: "#34D399", fontSize: 12, fontWeight: 800 }}>
              ✓ {isHi ? "आपका जन्म पक्षी (Ruling Cosmic Bird):" : "Your Birth Cosmic Bird:"}
            </div>
            <h3 style={{ color: "#FDE68A", fontSize: 22, fontWeight: 800, margin: 0 }}>
              {isHi ? birdData.rulingBird.nameHi : birdData.rulingBird.nameEn}
            </h3>
          </div>
        </div>

        <div style={{ background: "rgba(0,0,0,0.3)", padding: 14, borderRadius: 12, marginBottom: 12 }}>
          <div style={{ color: "#F59E0B", fontWeight: 700, fontSize: 13 }}>
            {isHi ? "वर्तमान में सक्रिय अवस्था:" : "Current Biorhythm State:"} {isHi ? birdData.currentState.stateHi : birdData.currentState.stateEn}
          </div>
          <div style={{ color: "rgba(241, 231, 208, 0.85)", fontSize: 12.5, marginTop: 4 }}>
            {birdData.currentState.descEn}
          </div>
        </div>

        <div style={{ fontSize: 12, color: "rgba(243, 211, 122, 0.75)" }}>
          {birdData.systemNote}
        </div>
      </div>
    </div>
  );
}

/** 21. COSMIC COMPASS (PLANETARY HORA) TOOL **/
function CosmicCompassHoraTool({ isHi }) {
  const HORA_PLANETS = [
    { name: "Sun", planetHi: "सूर्य", benefitEn: "Leadership, Government meetings, Ambition", benefitHi: "राजकार्य, नेतृत्व, पिता व अधिकारियों से भेंट" },
    { name: "Venus", planetHi: "शुक्र", benefitEn: "Romance, Arts, Purchase of Gold & Luxury", benefitHi: "विवाह, आभूषण क्रय, सौंदर्य, कला व दांपत्य" },
    { name: "Mercury", planetHi: "बुध", benefitEn: "Business, Accounting, Writing, Tech contracts", benefitHi: "व्यापार, हिसाब-किताब, लेखन, संचार व दस्तावेज" },
    { name: "Moon", planetHi: "चंद्र", benefitEn: "Travel, Peace, Silver, Mother, Public outreach", benefitHi: "यात्रा, जनसंपर्क, शांति, जल व माता का सानिध्य" },
    { name: "Saturn", planetHi: "शनि", benefitEn: "Factory labor, Discipline, Land, Oil, Humility", benefitHi: "लोहा, भूमि, मशीनरी, श्रम व दीर्घकालीन कार्य" },
    { name: "Jupiter", planetHi: "गुरु", benefitEn: "Spiritual rituals, Legal contracts, Wealth, Wisdom", benefitHi: "पूजा, धार्मिक कार्य, बैंक, शिक्षा व शुभ मुहूर्त" },
    { name: "Mars", planetHi: "मंगल", benefitEn: "Physical training, Surgery, Sports, Competitions", benefitHi: "साहस, खेलकूद, शल्य चिकित्सा, भूमि व प्रतिस्पर्धा" }
  ];

  return (
    <div>
      <div style={{ background: "rgba(0,0,0,0.35)", padding: 16, borderRadius: 14, marginBottom: 20 }}>
        <div style={{ color: "#FDE68A", fontSize: 14.5, fontWeight: 800 }}>
          {isHi ? "ग्रह होरा शुभ कार्य मार्गदर्शिका" : "Planetary Hora Optimal Activity Guide"}
        </div>
        <div style={{ color: "rgba(241,231,208,0.75)", fontSize: 12, marginTop: 4 }}>
          {isHi ? "दिन के २४ घंटों में प्रत्येक घंटे एक ग्रह की ऊर्जा प्रभावी रहती है।" : "Each planetary hour carries a distinct vibrational frequency ideal for specific undertakings."}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
        {HORA_PLANETS.map((h, idx) => (
          <div key={idx} style={{ background: "rgba(18, 12, 36, 0.88)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ color: "#F59E0B", fontWeight: 800, fontSize: 15, marginBottom: 4 }}>
              {isHi ? `${h.planetHi} होरा` : `${h.name} Hora`}
            </div>
            <div style={{ fontSize: 12.5, color: "rgba(241, 231, 208, 0.85)", lineHeight: 1.5 }}>
              {isHi ? h.benefitHi : h.benefitEn}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
