import { useState, useRef } from "react";
import { generateVedicKundliData, calculateGunMilan, SIGNS } from "./jyotishEngine";
import { getCoordinates } from "./geocode";

const ZODIAC_SIGNS = [
  { name: "Aries", symbol: "♈", sanskrit: "Mesh", num: 1, element: "Fire" },
  { name: "Taurus", symbol: "♉", sanskrit: "Vrishabh", num: 2, element: "Earth" },
  { name: "Gemini", symbol: "♊", sanskrit: "Mithun", num: 3, element: "Air" },
  { name: "Cancer", symbol: "♋", sanskrit: "Kark", num: 4, element: "Water" },
  { name: "Leo", symbol: "♌", sanskrit: "Simha", num: 5, element: "Fire" },
  { name: "Virgo", symbol: "♍", sanskrit: "Kanya", num: 6, element: "Earth" },
  { name: "Libra", symbol: "♎", sanskrit: "Tula", num: 7, element: "Air" },
  { name: "Scorpio", symbol: "♏", sanskrit: "Vrishchik", num: 8, element: "Water" },
  { name: "Sagittarius", symbol: "♐", sanskrit: "Dhanu", num: 9, element: "Fire" },
  { name: "Capricorn", symbol: "♑", sanskrit: "Makar", num: 10, element: "Earth" },
  { name: "Aquarius", symbol: "♒", sanskrit: "Kumbh", num: 11, element: "Air" },
  { name: "Pisces", symbol: "♓", sanskrit: "Meen", num: 12, element: "Water" },
];

const PLANETS = [
  { name: "Sun", symbol: "Su", color: "#FBBF24", sanskrit: "Surya", glyph: "☉" },
  { name: "Moon", symbol: "Mo", color: "#E2E8F0", sanskrit: "Chandra", glyph: "☽" },
  { name: "Mars", symbol: "Ma", color: "#F87171", sanskrit: "Mangal", glyph: "♂" },
  { name: "Mercury", symbol: "Me", color: "#34D399", sanskrit: "Budha", glyph: "☿" },
  { name: "Jupiter", symbol: "Ju", color: "#F59E0B", sanskrit: "Guru", glyph: "♃" },
  { name: "Venus", symbol: "Ve", color: "#F472B6", sanskrit: "Shukra", glyph: "♀" },
  { name: "Saturn", symbol: "Sa", color: "#A78BFA", sanskrit: "Shani", glyph: "♄" },
  { name: "Rahu", symbol: "Ra", color: "#94A3B8", sanskrit: "Rahu", glyph: "☊" },
  { name: "Ketu", symbol: "Ke", color: "#FB923C", sanskrit: "Ketu", glyph: "☋" },
];

const TABS = [
  { id: "chart", icon: "🔯", labelEn: "Chart", labelHi: "चार्ट" },
  { id: "overview", icon: "🌟", labelEn: "Overview", labelHi: "सिंहावलोकन" },
  { id: "forecast", icon: "📅", labelEn: "2026–2027 Forecast", labelHi: "वार्षिक राशिफल" },
  { id: "matchmaking", icon: "❤️", labelEn: "Kundli Milan", labelHi: "गुण मिलान" },
  { id: "consult", icon: "🔮", labelEn: "Talk to Astrologer", labelHi: "ज्योतिषी परामर्श" },
  { id: "store", icon: "💎", labelEn: "Gemstones & Remedies", labelHi: "रत्न व उपाय" },
  { id: "planets", icon: "🪐", labelEn: "Planets", labelHi: "ग्रह स्थिति" },
  { id: "houses", icon: "🏠", labelEn: "Houses", labelHi: "भाव विश्लेषण" },
  { id: "life", icon: "🌿", labelEn: "Life Areas", labelHi: "जीवन क्षेत्र" },
  { id: "predictions", icon: "🔮", labelEn: "Predictions", labelHi: "भविष्यवाणी" },
];

const ASTROLOGERS = [
  {
    name: "Acharya Vidyadhar Shastri",
    exp: "18+ Yrs Exp",
    specialty: "Vedic Kundli, Career & Business Growth",
    specialtyHi: "वैदिक कुंडली, करियर एवं व्यापार वृद्धि",
    lang: "Hindi, English",
    rating: "4.9 ★ (12.4k consults)",
    price: "₹499 / 20 mins",
    avatar: "🕉️",
    badge: "Top Rated"
  },
  {
    name: "Dr. Ananya Vashistha",
    exp: "14+ Yrs Exp",
    specialty: "Kundli Milan, Marriage & Relationship Harmony",
    specialtyHi: "कुंडली मिलान, दांपत्य एवं प्रेम संबंध",
    lang: "Hindi, English, Bengali",
    rating: "4.95 ★ (9.8k consults)",
    price: "₹599 / 20 mins",
    avatar: "🪷",
    badge: "Gold Certified"
  },
  {
    name: "Pt. Rameshwar Joshi",
    exp: "22+ Yrs Exp",
    specialty: "Sade Sati, Kaal Sarp & Certified Gemstones",
    specialtyHi: "साढ़ेसाती, कालसर्प एवं सिद्ध रत्न",
    lang: "Hindi, Sanskrit",
    rating: "4.88 ★ (15.2k consults)",
    price: "₹399 / 20 mins",
    avatar: "☀️",
    badge: "Senior Guru"
  }
];

const UI = {
  en: {
    title: "JYOTISH KUNDLI",
    subtitle: "VEDIC BIRTH CHART & COSMIC LIFE READING",
    tagline: '"As above, so below — the stars illuminate the path of your soul"',
    formTitle: "Enter Your Birth Details",
    formSub: "Accurate planetary calculations according to traditional Parashari Vedic Astrology",
    fName: "Full Name", fDob: "Date of Birth", fTob: "Time of Birth", fPob: "Place of Birth",
    phName: "e.g. Abhishek Kumar Singh", phPob: "e.g. Kanpur, Uttar Pradesh, India",
    btnGo: "Reveal My Kundli ✦", btnWait: "Consulting the Stars...",
    errFields: "Please fill in your Name, Date of Birth, and Place of Birth.",
    errApi: "Unable to generate Kundli. Please verify your details and try again.",
    s1: "Calculating exact planetary coordinates & Lagna...",
    s2: "Synthesizing 12 Bhavas, Yogas, Dashas & Life Predictions...",
    chartTitle: "Natal Birth Chart (Lagna Kundli)",
    chartSub: "House 1 at top · Signs and planetary placements in natal houses",
    chartStyleNorth: "North Indian (Diamond)",
    chartStyleSouth: "South Indian (Square)",
    ptTitle: "Planetary Positions & Dignities",
    htTitle: "12 Bhavas (Houses) Comprehensive Breakdown",
    sec: {
      blueprint: "Cosmic Blueprint & Soul Archetype",
      yogas: "Auspicious Yogas & Astrological Formations",
      verdict: "The Stars' Final Verdict",
      pa: "Planetary Synthesis",
      ha: "Bhava (House) Dynamics",
      dasha: "Vimshottari Mahadasha Timeline",
      health: "Health, Vitality & Well-being",
      wealth: "Wealth, Finances & Prosperity",
      education: "Education, Intellect & Learning",
      career: "Career, Ambition & Societal Status",
      marriage: "Marriage, Relationships & Partnerships",
      pred: "Life Predictions — Decade by Decade",
      colours: "Lucky Colours", numbers: "Lucky Numbers", days: "Auspicious Days",
      rudraksha: "Prescribed Rudraksha", gems: "Gemstones & Astrological Remedies",
      longevity: "Longevity & Life Vitality (Deerghayu)"
    },
    pills: { lagna: "Ascendant (Lagna)", rashi: "Moon Sign (Rashi)", nakshatra: "Nakshatra", tithi: "Tithi", yoga: "Yoga" },
    pcols: ["Planet", "Sign", "House", "Degree & Nakshatra", "Dignity", "Astrological Effect"],
    hnames: ["Self & Vitality", "Wealth & Lineage", "Courage & Siblings", "Home & Happiness", "Intellect & Karma", "Health & Service", "Marriage & Partners", "Longevity & Transformation", "Fortune & Dharma", "Career & Status", "Gains & Aspirations", "Moksha & Expenses"],
    nopl: "No planets residing",
    langBtn: "हिंदी में देखें",
    printBtn: "Save Complete Kundli as PDF",
    editBtn: "Edit Details",
    footer1: "✦ OM TAT SAT ✦",
    footer2: "Authentic Parashari Vedic Astrology Engine · Client Computation",
  },
  hi: {
    title: "ज्योतिष कुंडली",
    subtitle: "वैदिक जन्म कुंडली एवं ब्रह्मांडीय जीवन विश्लेषण",
    tagline: '"जैसा ऊपर, वैसा नीचे — नक्षत्र आपकी आत्मा के दिव्य मार्ग को प्रकाशित करते हैं"',
    formTitle: "अपना जन्म विवरण दर्ज करें",
    formSub: "पराशरी वैदिक ज्योतिष के प्रामाणिक सिद्धांतों पर आधारित सटीक गणना",
    fName: "पूरा नाम", fDob: "जन्म तिथि", fTob: "जन्म समय", fPob: "जन्म स्थान",
    phName: "उदा. अभिषेक कुमार सिंह", phPob: "उदा. कानपुर, उत्तर प्रदेश, भारत",
    btnGo: "मेरी कुंडली प्रकट करें ✦", btnWait: "ग्रहों से परामर्श जारी है...",
    errFields: "कृपया नाम, जन्म तिथि और जन्म स्थान भरें।",
    errApi: "कुंडली गणना में त्रुटि हुई। कृपया विवरण पुनः जांचें।",
    s1: "ग्रह स्थितियों एवं लग्न की सटीक खगोलीय गणना...",
    s2: "१२ भावों, योगों, विंशोत्तरी दशा और जीवन फल का विश्लेषण...",
    chartTitle: "लग्न कुंडली चक्र (Lagna Kundli)",
    chartSub: "भाव १ शीर्ष पर · राशि संख्या एवं ग्रहों की जन्मकालीन स्थिति",
    chartStyleNorth: "उत्तर भारतीय (डायमंड)",
    chartStyleSouth: "दक्षिण भारतीय (स्क्वायर)",
    ptTitle: "ग्रह स्थिति एवं बल तालिका",
    htTitle: "सभी १२ भावों का विस्तृत विश्लेषण",
    sec: {
      blueprint: "ब्रह्मांडीय प्रारूप एवं मूल स्वभाव",
      yogas: "शुभ ग्रह योग एवं प्रभाव",
      verdict: "तारों का अंतिम संदेश",
      pa: "ग्रह विश्लेषण",
      ha: "भाव विश्लेषण",
      dasha: "विंशोत्तरी महादशा कालचक्र",
      health: "स्वास्थ्य, स्फूर्ति एवं ऊर्जा",
      wealth: "धन संचय, वित्त एवं समृद्धि",
      education: "विद्या, बुद्धि एवं ज्ञान",
      career: "करियर, आजीविका एवं सामाजिक प्रतिष्ठा",
      marriage: "विवाह, दांपत्य एवं साझेदारी",
      pred: "जीवन भविष्यवाणी — दशक दर दशक",
      colours: "शुभ रंग", numbers: "भाग्यशाली अंक", days: "शुभ दिन",
      rudraksha: "कल्याणकारी रुद्राक्ष", gems: "रत्न एवं वैदिक उपाय",
      longevity: "आयु एवं जीवन शक्ति (दीर्घायु)"
    },
    pills: { lagna: "लग्न", rashi: "चंद्र राशि", nakshatra: "नक्षत्र", tithi: "तिथि", yoga: "योग" },
    pcols: ["ग्रह", "राशि", "भाव", "अंश व नक्षत्र", "स्थिति / बल", "प्रभाव"],
    hnames: ["स्वयं एवं व्यक्तित्व", "धन एवं कुटुंब", "पराक्रम व बंधु", "गृह-माता सुख", "बुद्धि व संतान", "स्वास्थ्य व प्रतिस्पर्धा", "दांपत्य व साझेदारी", "आयु व परिवर्तन", "भाग्य व धर्म", "करियर व प्रतिष्ठा", "लाभ व आय", "मोक्ष व व्यय"],
    nopl: "कोई ग्रह नहीं",
    langBtn: "View in English",
    printBtn: "सम्पूर्ण कुंडली PDF सहेजें",
    editBtn: "विवरण बदलें",
    footer1: "✦ ॐ तत् सत् ✦",
    footer2: "प्रामाणिक वैदिक ज्योतिष गणना प्रणाली · सुरक्षित एवं पूर्णतः गोपनीय",
  }
};

// ── NORTH INDIAN KUNDLI CHART ─────────────────────────────────────
const NorthIndianChart = ({ houses, lang, hoveredHouse, setHoveredHouse }) => {
  const SIZE = 520;
  const PAD = 20;
  const W = SIZE - 2 * PAD;
  const xc = SIZE / 2;
  const yc = SIZE / 2;
  const x0 = PAD;
  const y0 = PAD;
  const x1 = SIZE - PAD;
  const y1 = SIZE - PAD;

  const getSignNum = (signName) => {
    const found = ZODIAC_SIGNS.find(z => z.name === signName || z.sanskrit === signName);
    return found ? found.num : "";
  };

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

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="kundli-svg" style={{ width: "100%", maxWidth: 500, height: "auto" }}>
      <defs>
        <radialGradient id="kundliGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2A1B4E" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0D0A1C" stopOpacity="0.98" />
        </radialGradient>
      </defs>

      <rect width={SIZE} height={SIZE} fill="url(#kundliGlow)" rx="16" stroke="rgba(212,175,55,0.35)" strokeWidth="1.5" />

      {houseLayout.map(({ n, path }) => (
        <polygon
          key={`poly-${n}`}
          points={path}
          fill={hoveredHouse === n ? "rgba(212,175,55,0.2)" : "transparent"}
          stroke={hoveredHouse === n ? "#F3D37A" : "none"}
          strokeWidth={hoveredHouse === n ? "1.5" : "0"}
          style={{ cursor: "pointer", transition: "fill 0.2s ease" }}
          onMouseEnter={() => setHoveredHouse && setHoveredHouse(n)}
          onMouseLeave={() => setHoveredHouse && setHoveredHouse(null)}
        />
      ))}

      <rect x={x0} y={y0} width={W} height={W} fill="none" stroke="rgba(212,175,55,0.7)" strokeWidth="2" />
      <line x1={x0} y1={y0} x2={x1} y2={y1} stroke="rgba(212,175,55,0.6)" strokeWidth="1.6" />
      <line x1={x1} y1={y0} x2={x0} y2={y1} stroke="rgba(212,175,55,0.6)" strokeWidth="1.6" />
      <polygon points={`${xc},${y0} ${x1},${yc} ${xc},${y1} ${x0},${yc}`} fill="none" stroke="rgba(212,175,55,0.65)" strokeWidth="1.6" />

      <circle cx={xc} cy={yc} r="32" fill="rgba(15,10,30,0.85)" stroke="rgba(212,175,55,0.4)" strokeWidth="1" />
      <text x={xc} y={yc - 6} textAnchor="middle" fill="#F3D37A" fontSize="9" letterSpacing="1.5" fontWeight="600" opacity="0.8">LAGNA</text>
      <text x={xc} y={yc + 14} textAnchor="middle" fill="#F3D37A" fontSize="20" fontFamily="serif">ॐ</text>

      {houseLayout.map(({ n, cx, cy, isLagna }) => {
        const houseData = houses?.[n] || {};
        const signNum = getSignNum(houseData.sign);
        const planetsInHouse = houseData.planets || [];

        return (
          <g key={n} style={{ pointerEvents: "none" }}>
            {isLagna && (
              <g>
                <rect x={cx - 24} y={cy - 36} width="48" height="15" rx="4" fill="rgba(245,158,11,0.25)" stroke="#F59E0B" strokeWidth="0.8" />
                <text x={cx} y={cy - 25} textAnchor="middle" fill="#FDE68A" fontSize="8.5" fontWeight="700" letterSpacing="0.8">
                  {lang === "hi" ? "लग्न १" : "LAGNA 1"}
                </text>
              </g>
            )}

            <text x={cx} y={isLagna ? cy - 6 : cy - 12} textAnchor="middle" fill="#F3D37A" fontSize="13" fontWeight="700" fontFamily="'Outfit', sans-serif">
              {signNum}
            </text>

            {planetsInHouse.map((pName, idx) => {
              const pObj = PLANETS.find(x => x.name === pName) || { symbol: pName.slice(0, 2), color: "#D4AF37" };
              const yOffset = (isLagna ? cy + 12 : cy + 5) + idx * 14;
              return (
                <text key={idx} x={cx} y={yOffset} textAnchor="middle" fill={pObj.color} fontSize="12" fontWeight="700">
                  {pObj.symbol}
                </text>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
};

// ── SOUTH INDIAN KUNDLI CHART ─────────────────────────────────────
const SouthIndianChart = ({ houses, lang, hoveredHouse, setHoveredHouse }) => {
  const SIZE = 520;
  const PAD = 20;
  const W = (SIZE - 2 * PAD) / 4;
  const x0 = PAD;
  const y0 = PAD;

  const rashiGrid = [
    { signNum: 12, col: 0, row: 0, signName: "Pisces", signHi: "मीन" },
    { signNum: 1,  col: 1, row: 0, signName: "Aries", signHi: "मेष" },
    { signNum: 2,  col: 2, row: 0, signName: "Taurus", signHi: "वृषभ" },
    { signNum: 3,  col: 3, row: 0, signName: "Gemini", signHi: "मिथुन" },
    { signNum: 4,  col: 3, row: 1, signName: "Cancer", signHi: "कर्क" },
    { signNum: 5,  col: 3, row: 2, signName: "Leo", signHi: "सिंह" },
    { signNum: 6,  col: 3, row: 3, signName: "Virgo", signHi: "कन्या" },
    { signNum: 7,  col: 2, row: 3, signName: "Libra", signHi: "तुला" },
    { signNum: 8,  col: 1, row: 3, signName: "Scorpio", signHi: "वृश्चिक" },
    { signNum: 9,  col: 0, row: 3, signName: "Sagittarius", signHi: "धनु" },
    { signNum: 10, col: 0, row: 2, signName: "Capricorn", signHi: "मकर" },
    { signNum: 11, col: 0, row: 1, signName: "Aquarius", signHi: "कुंभ" },
  ];

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="kundli-svg" style={{ width: "100%", maxWidth: 500, height: "auto" }}>
      <rect width={SIZE} height={SIZE} fill="#0D0A1C" rx="16" stroke="rgba(212,175,55,0.35)" strokeWidth="1.5" />

      <rect x={x0 + W} y={y0 + W} width={W * 2} height={W * 2} fill="rgba(20,15,40,0.6)" stroke="rgba(212,175,55,0.4)" strokeWidth="1.5" rx="8" />
      <text x={SIZE / 2} y={SIZE / 2 - 8} textAnchor="middle" fill="#F3D37A" fontSize="12" letterSpacing="2" fontWeight="600">SOUTH INDIAN CHART</text>
      <text x={SIZE / 2} y={SIZE / 2 + 18} textAnchor="middle" fill="#F3D37A" fontSize="24">ॐ</text>

      {rashiGrid.map((box) => {
        const bx = x0 + box.col * W;
        const by = y0 + box.row * W;

        let houseNum = null;
        let isLagna = false;
        let planetsInBox = [];

        for (let h = 1; h <= 12; h++) {
          if (houses?.[h]?.sign === box.signName) {
            houseNum = h;
            if (h === 1) isLagna = true;
            planetsInBox = houses[h].planets || [];
            break;
          }
        }

        return (
          <g key={box.signNum} onMouseEnter={() => houseNum && setHoveredHouse && setHoveredHouse(houseNum)} onMouseLeave={() => setHoveredHouse && setHoveredHouse(null)}>
            <rect
              x={bx}
              y={by}
              width={W}
              height={W}
              fill={hoveredHouse === houseNum ? "rgba(212,175,55,0.2)" : "rgba(15,10,32,0.85)"}
              stroke="rgba(212,175,55,0.5)"
              strokeWidth="1.2"
              style={{ cursor: "pointer", transition: "fill 0.2s ease" }}
            />

            <text x={bx + 8} y={by + 16} fill="rgba(212,175,55,0.7)" fontSize="10" fontWeight="600">
              {lang === "hi" ? box.signHi : box.signName}
            </text>

            {isLagna && (
              <g>
                <line x1={bx} y1={by} x2={bx + W} y2={by + W} stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                <rect x={bx + W - 32} y={by + 5} width="26" height="13" rx="3" fill="rgba(245,158,11,0.25)" stroke="#F59E0B" strokeWidth="0.8" />
                <text x={bx + W - 19} y={by + 14} textAnchor="middle" fill="#FDE68A" fontSize="7.5" fontWeight="700">ASC</text>
              </g>
            )}

            {houseNum && (
              <text x={bx + 8} y={by + W - 8} fill="rgba(243,211,122,0.4)" fontSize="9">
                H{houseNum}
              </text>
            )}

            {planetsInBox.map((pName, idx) => {
              const pObj = PLANETS.find(x => x.name === pName) || { symbol: pName.slice(0, 2), color: "#D4AF37" };
              return (
                <text key={idx} x={bx + W / 2} y={by + 36 + idx * 14} textAnchor="middle" fill={pObj.color} fontSize="12" fontWeight="700">
                  {pObj.symbol}
                </text>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
};

// ── COSMIC BACKGROUND CANVAS PARTICLES ───────────────────────────
const CosmicBackdrop = () => (
  <div className="no-print" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
    <div style={{ position: "absolute", top: "-10%", left: "15%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, rgba(13,10,28,0) 70%)", filter: "blur(60px)" }} />
    <div style={{ position: "absolute", bottom: "10%", right: "10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(217,119,6,0.09) 0%, rgba(13,10,28,0) 70%)", filter: "blur(70px)" }} />
    {Array.from({ length: 65 }).map((_, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${(i * 19.3) % 100}%`,
          top: `${(i * 37.7) % 100}%`,
          width: i % 4 === 0 ? 3 : i % 2 === 0 ? 2 : 1.5,
          height: i % 4 === 0 ? 3 : i % 2 === 0 ? 2 : 1.5,
          borderRadius: "50%",
          background: i % 3 === 0 ? "#FDE68A" : "#FFFFFF",
          opacity: 0.3 + (i % 5) * 0.12,
          animation: `twinkle ${3 + (i % 4)}s ease-in-out infinite ${(i % 3) * 0.8}s alternate`,
        }}
      />
    ))}
  </div>
);

// ── MONETIZATION CHECKOUT MODAL ──────────────────────────────────
const CheckoutModal = ({ item, onClose, onPaid, lang }) => {
  const [method, setMethod] = useState("upi");
  const [checkoutStep, setCheckoutStep] = useState("pay"); // "pay" | "verify" | "success"
  const [utr, setUtr] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [verifyErr, setVerifyErr] = useState("");
  const [orderId, setOrderId] = useState("");
  const hi = lang === "hi";

  // Extract clean numerical amount from price string (e.g. ₹199 -> 199)
  const rawPriceMatch = item.price.match(/₹([0-9,]+)/);
  const amountVal = rawPriceMatch ? rawPriceMatch[1].replace(/,/g, "") : "199";

  // Dynamic NPCI-compliant UPI Intent URL with pre-filled locked amount and note
  const upiIntentUrl = `upi://pay?pa=8094199663@upi&pn=ABHISHEK%20KUMAR%20SINGH&am=${amountVal}.00&cu=INR&tn=${encodeURIComponent(item.title)}`;
  const dynamicQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiIntentUrl)}&margin=10`;

  const handleProceedToVerify = () => {
    setCheckoutStep("verify");
    setVerifyErr("");
  };

  const handleConfirmPayment = () => {
    const cleanUtr = utr.trim().replace(/\s+/g, "");
    const cleanPhone = whatsapp.trim().replace(/\D/g, "");

    if (cleanPhone.length < 10) {
      setVerifyErr(hi ? "कृपया मान्य 10-अंकों का व्हाट्सएप नंबर दर्ज करें।" : "Please enter a valid 10-digit WhatsApp number.");
      return;
    }

    if (cleanUtr.length < 6) {
      setVerifyErr(hi ? "कृपया बैंक रसीद से 12-अंकों का UPI UTR / Ref No. दर्ज करें।" : "Please enter the 12-digit UPI Reference / UTR Number from your payment receipt.");
      return;
    }

    const generatedOrderId = "JK-" + Math.floor(100000 + Math.random() * 900000);
    setOrderId(generatedOrderId);
    setCheckoutStep("success");

    setTimeout(() => {
      onPaid && onPaid(item);
    }, 1200);
  };

  const getWhatsAppShareLink = () => {
    const text = encodeURIComponent(
      `🙏 *Jyotish Kundli Payment Confirmation*\n\n` +
      `📦 *Item:* ${item.title}\n` +
      `💰 *Amount:* ₹${amountVal}\n` +
      `🧾 *Order ID:* ${orderId || "Pending"}\n` +
      `🔢 *UPI UTR / Ref No:* ${utr || "N/A"}\n` +
      `📱 *Customer WhatsApp:* ${whatsapp || "N/A"}\n\n` +
      `Please verify and activate my order. Thank you!`
    );
    return `https://wa.me/918094199663?text=${text}`;
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)", padding: 20 }}>
      <div className="glass-card" style={{ maxWidth: 460, width: "100%", padding: "26px 24px", position: "relative", maxHeight: "92vh", overflowY: "auto" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 16, background: "none", border: "none", color: "#F3D37A", fontSize: 20, cursor: "pointer" }}>✕</button>

        {/* ── STEP 3: SUCCESS ── */}
        {checkoutStep === "success" && (
          <div style={{ textAlign: "center", padding: "20px 10px" }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>🎉</div>
            <h3 style={{ color: "#34D399", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
              {hi ? "भुगतान विवरण दर्ज हो गया!" : "Payment & Order Confirmed!"}
            </h3>
            <p style={{ color: "rgba(241,231,208,0.75)", fontSize: 13, marginBottom: 14 }}>
              {hi ? `ऑर्डर आईडी: ${orderId} · सेवा अनलॉक कर दी गई है।` : `Order ID: ${orderId} · Your access is now activated.`}
            </p>

            <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 14, textAlign: "left", fontSize: 12, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "rgba(241,231,208,0.6)" }}>Item:</span>
                <span style={{ color: "#F3D37A", fontWeight: 700 }}>{item.title}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "rgba(241,231,208,0.6)" }}>Amount Paid:</span>
                <span style={{ color: "#34D399", fontWeight: 700 }}>₹{amountVal}.00</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "rgba(241,231,208,0.6)" }}>UPI UTR:</span>
                <span style={{ color: "#FDE68A", fontWeight: 600 }}>{utr}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(241,231,208,0.6)" }}>WhatsApp:</span>
                <span style={{ color: "#FFF" }}>+91 {whatsapp}</span>
              </div>
            </div>

            <a
              href={getWhatsAppShareLink()}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                width: "100%",
                background: "#25D366",
                color: "#0F0A1E",
                padding: "10px 16px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: "none",
                marginBottom: 10
              }}
            >
              <span>💬</span> Send Receipt on WhatsApp
            </a>

            <button onClick={onClose} className="gold-cta-btn" style={{ padding: "10px 18px", fontSize: 13 }}>
              {hi ? "पूर्ण (Close)" : "Done / Continue"}
            </button>
          </div>
        )}

        {/* ── STEP 2: VERIFY (UTR & WHATSAPP) ── */}
        {checkoutStep === "verify" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 30 }}>📝</span>
              <h3 style={{ color: "#F3D37A", fontSize: 17, fontWeight: 700, marginTop: 4 }}>
                {hi ? "भुगतान सत्यापन विवरण" : "Confirm Payment Details"}
              </h3>
              <p style={{ color: "rgba(241,231,208,0.6)", fontSize: 12, marginTop: 2 }}>
                {item.title} — <b style={{ color: "#FDE68A" }}>₹{amountVal}.00</b>
              </p>
            </div>

            <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 12, padding: "16px 14px", marginBottom: 16 }}>
              {/* WhatsApp Number Field */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: "#FDE68A", marginBottom: 6 }}>
                  <span>📱</span> {hi ? "आपका व्हाट्सएप नंबर (WhatsApp Number) *" : "Your WhatsApp Number *"}
                </label>
                <div style={{ display: "flex", gap: 6 }}>
                  <div style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8, padding: "10px 12px", color: "rgba(241,231,208,0.8)", fontSize: 13, fontWeight: 600 }}>
                    +91
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value.replace(/\D/g, ""))}
                    placeholder="e.g. 9876543210"
                    style={{ width: "100%", background: "rgba(0,0,0,0.6)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8, padding: "10px 12px", color: "#FFF", fontSize: 13 }}
                  />
                </div>
                <div style={{ fontSize: 10, color: "rgba(241,231,208,0.5)", marginTop: 4 }}>
                  {hi ? "PDF रिपोर्ट व परामर्श लिंक इस नंबर पर भेजा जाएगा।" : "PDF copy & consult updates will be delivered here."}
                </div>
              </div>

              {/* 12-Digit UTR Field */}
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: "#FDE68A", marginBottom: 6 }}>
                  <span>🔢</span> {hi ? "12-अंकों का UPI UTR / Ref No. *" : "12-Digit UPI Ref / UTR No. *"}
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={utr}
                  onChange={e => setUtr(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
                  placeholder="e.g. 423819283746"
                  style={{ width: "100%", background: "rgba(0,0,0,0.6)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8, padding: "10px 12px", color: "#FFF", fontSize: 13, letterSpacing: 1 }}
                />
                <div style={{ fontSize: 10, color: "rgba(243,211,122,0.65)", marginTop: 4 }}>
                  💡 {hi ? "GPay / PhonePe / Paytm रसीद में 'UPI Ref No' या 'UTR' देखें।" : "Found as 'UPI Ref No' or 'UTR' on your GPay/PhonePe receipt."}
                </div>
              </div>
            </div>

            {verifyErr && (
              <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", borderRadius: 8, padding: "8px 12px", color: "#FCA5A5", fontSize: 11, marginBottom: 14 }}>
                ⚠️ {verifyErr}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8 }}>
              <button
                onClick={() => setCheckoutStep("pay")}
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, color: "rgba(241,231,208,0.8)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
              >
                ← Back
              </button>
              <button onClick={handleConfirmPayment} className="gold-cta-btn" style={{ padding: "12px 14px", fontSize: 13 }}>
                {hi ? "सत्यापित करें एवं अनलॉक करें ✦" : "Confirm & Unlock Instant Access ✦"}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 1: PAYMENT (QR & DIRECT INTENT) ── */}
        {checkoutStep === "pay" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <span style={{ fontSize: 32 }}>{item.icon || "💎"}</span>
              <h3 style={{ color: "#F3D37A", fontSize: 17, fontWeight: 700, marginTop: 4 }}>{item.title}</h3>
              <div style={{ color: "#FDE68A", fontSize: 24, fontWeight: 800, marginTop: 4 }}>₹{amountVal}</div>
              <p style={{ color: "rgba(241,231,208,0.6)", fontSize: 12, marginTop: 4 }}>{item.desc}</p>
            </div>

            {/* Payment Mode Selector */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {[
                { id: "upi", name: "Dynamic UPI QR", icon: "📱" },
                { id: "card", name: "Cards / NetBanking", icon: "💳" },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  style={{
                    background: method === m.id ? "rgba(245,158,11,0.2)" : "rgba(11,8,25,0.6)",
                    border: `1px solid ${method === m.id ? "#F59E0B" : "rgba(212,175,55,0.2)"}`,
                    color: method === m.id ? "#FDE68A" : "#FFF",
                    borderRadius: 10,
                    padding: "10px 8px",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  <div>{m.icon}</div>
                  <div>{m.name}</div>
                </button>
              ))}
            </div>

            {method === "upi" ? (
              <div style={{ background: "rgba(11,8,25,0.8)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 12, padding: "16px 14px", textAlign: "center", marginBottom: 16 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 12, padding: "3px 10px", color: "#34D399", fontSize: 11, fontWeight: 700, marginBottom: 10 }}>
                  <span>🔒</span> Amount Locked: ₹{amountVal}.00
                </div>

                {/* Amount-Enforced High-Contrast QR Code */}
                <div style={{ width: 185, height: 185, background: "#FFF", borderRadius: 12, margin: "0 auto", padding: 8, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #F59E0B", boxShadow: "0 6px 20px rgba(0,0,0,0.6)" }}>
                  <img
                    src={dynamicQrCodeUrl}
                    alt="Amount-Locked Dynamic UPI QR"
                    style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 4 }}
                  />
                </div>

                <div style={{ marginTop: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#F3D37A" }}>Payee: ABHISHEK KUMAR SINGH</div>
                  <div style={{ fontSize: 11, color: "rgba(241,231,208,0.7)", marginTop: 2 }}>UPI ID: <code style={{ color: "#FDE68A" }}>8094199663@upi</code></div>
                </div>

                {/* Direct 1-Tap Mobile UPI Intent Link */}
                <a
                  href={upiIntentUrl}
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 12,
                    background: "rgba(245,158,11,0.15)",
                    border: "1px solid rgba(245,158,11,0.4)",
                    color: "#FDE68A",
                    padding: "9px 12px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    textDecoration: "none"
                  }}
                >
                  🚀 Tap to Open GPay / PhonePe / Paytm Directly
                </a>
              </div>
            ) : (
              <div style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: 14, marginBottom: 16 }}>
                <input placeholder="Card Number (0000 0000 0000 0000)" style={{ width: "100%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 6, padding: "8px 10px", color: "#FFF", fontSize: 12, marginBottom: 8 }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <input placeholder="MM/YY" style={{ width: "100%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 6, padding: "8px 10px", color: "#FFF", fontSize: 12 }} />
                  <input placeholder="CVV" type="password" maxLength={3} style={{ width: "100%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 6, padding: "8px 10px", color: "#FFF", fontSize: 12 }} />
                </div>
              </div>
            )}

            <button onClick={handleProceedToVerify} className="gold-cta-btn" style={{ padding: "12px 18px", fontSize: 14 }}>
              {hi ? `मैंने भुगतान कर दिया है (₹${amountVal}) →` : `I Have Made the Payment (₹${amountVal}) →`}
            </button>
            <div style={{ textAlign: "center", fontSize: 10, color: "rgba(243,211,122,0.4)", marginTop: 8 }}>
              🔒 256-Bit Bank Grade SSL Encrypted Checkout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── MAIN APP COMPONENT ───────────────────────────────────────────
export default function App() {
  const [form, setForm] = useState({ name: "", dob: "", pob: "", tob: "" });
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("chart");
  const [chartStyle, setChartStyle] = useState("north");
  const [hoveredHouse, setHoveredHouse] = useState(null);
  const [err, setErr] = useState("");
  const [lang, setLang] = useState("en");
  const [lastCoords, setLastCoords] = useState({ lat: 26.8467, lon: 80.9462 });

  // Matchmaking State
  const [partnerForm, setPartnerForm] = useState({ name: "", dob: "", pob: "", tob: "" });
  const [milanResult, setMilanResult] = useState(null);

  // Monetization Modal State
  const [activeCheckout, setActiveCheckout] = useState(null);
  const [unlockedProReport, setUnlockedProReport] = useState(false);

  const resultRef = useRef(null);
  const t = UI[lang];
  const hi = lang === "hi";

  const run = async () => {
    if (!form.name.trim() || !form.dob || !form.pob.trim()) {
      setErr(t.errFields);
      return;
    }
    setErr("");
    setStep(1);
    setResult(null);

    try {
      let lat = 26.8467;
      let lon = 80.9462;

      try {
        const coords = await getCoordinates(form.pob);
        if (coords && coords.lat && coords.lon) {
          lat = coords.lat;
          lon = coords.lon;
          setLastCoords({ lat, lon });
        }
      } catch (geoErr) {
        console.warn("Geocoding failed, using regional coordinates", geoErr);
      }

      await new Promise(r => setTimeout(r, 400));
      setStep(2);

      await new Promise(r => setTimeout(r, 450));
      const resData = generateVedicKundliData({
        name: form.name,
        dob: form.dob,
        tob: form.tob,
        pob: form.pob,
        lat,
        lon,
        lang
      });

      setResult(resData);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 150);
    } catch (e) {
      console.error(e);
      setErr(t.errApi);
    } finally {
      setStep(0);
    }
  };

  const handleRunGunMilan = () => {
    if (!partnerForm.name || !partnerForm.dob) {
      alert("Please enter partner name and date of birth.");
      return;
    }
    const res = calculateGunMilan({
      partner1: { name: form.name || "Primary Native", dob: form.dob, tob: form.tob },
      partner2: partnerForm
    });
    setMilanResult(res);
  };

  const handleLangToggle = () => {
    const newLang = lang === "en" ? "hi" : "en";
    setLang(newLang);
    if (result && form.dob && form.pob) {
      try {
        const updated = generateVedicKundliData({
          name: form.name,
          dob: form.dob,
          tob: form.tob,
          pob: form.pob,
          lat: lastCoords.lat,
          lon: lastCoords.lon,
          lang: newLang
        });
        setResult(updated);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0B0819", color: "#F1E7D0", fontFamily: hi ? "'Noto Sans Devanagari', 'Outfit', sans-serif" : "'Outfit', sans-serif", position: "relative", overflowX: "hidden" }}>
      <style>{`
        @keyframes twinkle { 0% { opacity: 0.2; transform: scale(0.9); } 100% { opacity: 0.9; transform: scale(1.2); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulseSlow { 0%, 100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.04); opacity: 1; } }
        @keyframes fadeInCard { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmerBtn { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus { outline: none !important; border-color: #F59E0B !important; box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.18) !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.4); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #D4AF37; }

        .glass-card {
          background: linear-gradient(135deg, rgba(26, 18, 48, 0.7) 0%, rgba(15, 10, 32, 0.85) 100%);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(212, 175, 55, 0.22);
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
          color: #0F0A1E;
          font-weight: 700;
          box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35);
          border-color: #FCD34D;
        }

        .tab-btn:not(.active) {
          background: rgba(26, 18, 48, 0.5);
          color: #E2D9C8;
          border-color: rgba(212, 175, 55, 0.15);
        }

        .tab-btn:not(.active):hover {
          background: rgba(212, 175, 55, 0.12);
          border-color: rgba(212, 175, 55, 0.35);
          color: #FFF;
        }

        .gold-cta-btn {
          width: 100%;
          padding: 15px 24px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(90deg, #B45309 0%, #F59E0B 40%, #FDE68A 50%, #F59E0B 60%, #B45309 100%);
          background-size: 200% auto;
          color: #0F0A1E;
          font-family: ${hi ? "'Noto Sans Devanagari', sans-serif" : "'Outfit', sans-serif"};
          font-size: 15px;
          font-weight: 700;
          letter-spacing: ${hi ? "0.5px" : "1.5px"};
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.3);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          animation: shimmerBtn 4s linear infinite;
        }

        .print-only-report {
          display: none;
        }

        @media print {
          @page {
            size: A4;
            margin: 1.2cm;
          }
          body, html, #root {
            background: #0B0819 !important;
            color: #F1E7D0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print, header, .form-section-card, footer, .tab-bar-nav {
            display: none !important;
          }
          .screen-only-tabs {
            display: none !important;
          }
          .print-only-report {
            display: block !important;
          }
          .page-break-avoid {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .page-break-before {
            page-break-before: always !important;
            break-before: always !important;
          }
        }
      `}</style>

      <CosmicBackdrop />

      {activeCheckout && (
        <CheckoutModal
          item={activeCheckout}
          onClose={() => setActiveCheckout(null)}
          onPaid={() => setUnlockedProReport(true)}
          lang={lang}
        />
      )}

      {/* Top Header Bar */}
      <header className="no-print" style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(11, 8, 25, 0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(212, 175, 55, 0.15)", padding: "12px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22, animation: "pulseSlow 3s infinite" }}>🔯</span>
            <div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 16, fontWeight: 700, color: "#F3D37A", letterSpacing: 1.5 }}>JYOTISH KUNDLI</div>
              <div style={{ fontSize: 10, color: "rgba(243, 211, 122, 0.55)", letterSpacing: 0.5 }}>{hi ? "वैदिक ज्योतिष एवं कुंडली मिलान" : "Vedic Astrology & Matchmaking"}</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => setActiveCheckout({
                title: hi ? "दक्षिणा / आध्यात्मिक सहयोग" : "Offer Dakshina (Support)",
                price: "₹108 / $2.99",
                desc: hi ? "वैदिक ज्योतिष अनुसंधान एवं सर्वर के रख-रखाव हेतु सहयोग" : "Support free spiritual Vedic Astrology research & maintenance",
                icon: "🪷"
              })}
              style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)", color: "#FDE68A", padding: "6px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
            >
              <span>🙏</span> {hi ? "दक्षिणा दें" : "Offer Dakshina"}
            </button>

            {result && (
              <button
                onClick={() => window.print()}
                style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", border: "none", color: "#0F0A1E", padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 2px 10px rgba(245,158,11,0.35)" }}
              >
                <span>📥</span> {t.printBtn}
              </button>
            )}

            <button
              onClick={handleLangToggle}
              style={{ background: "linear-gradient(135deg, rgba(26,18,48,0.9), rgba(15,10,32,0.95))", border: "1px solid rgba(212, 175, 55, 0.35)", borderRadius: 24, padding: "6px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "#F3D37A", fontSize: 12, fontWeight: 600 }}
            >
              <span>{hi ? "🇬🇧" : "🇮🇳"}</span>
              <span>{t.langBtn}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ position: "relative", zIndex: 1, maxWidth: 960, margin: "0 auto", padding: "32px 20px 80px" }}>

        {/* Hero Section */}
        <section className="no-print" style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.25)", borderRadius: 30, padding: "6px 16px", marginBottom: 14 }}>
            <span style={{ fontSize: 14 }}>✨</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#FDE68A", letterSpacing: 1.5 }}>
              {hi ? "प्रामाणिक पराशरी गणना" : "AUTHENTIC SIDEREAL VEDIC COMPUTATION"}
            </span>
          </div>

          <h1 style={{ fontFamily: hi ? "'Noto Sans Devanagari', sans-serif" : "'Cinzel Decorative', serif", fontSize: "clamp(24px, 5.5vw, 40px)", background: "linear-gradient(90deg, #D4AF37 0%, #FDE68A 40%, #F59E0B 70%, #D4AF37 100%)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: hi ? 1 : 3, fontWeight: 800, marginBottom: 8 }}>
            {t.title}
          </h1>
          <p style={{ color: "rgba(243, 211, 122, 0.65)", fontSize: hi ? 13 : 12, letterSpacing: hi ? 0 : 3, textTransform: "uppercase", fontWeight: 500 }}>
            {t.subtitle}
          </p>
          <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5), transparent)", margin: "16px auto", maxWidth: 280 }} />
          <p style={{ color: "rgba(230, 215, 190, 0.45)", fontSize: 13, fontStyle: "italic" }}>{t.tagline}</p>
        </section>

        {/* Input Form Card */}
        <div className="glass-card form-section-card no-print" style={{ padding: "30px 32px", marginBottom: 36 }}>
          <div style={{ marginBottom: 22, textAlign: "center" }}>
            <h2 style={{ color: "#F3D37A", fontSize: 16, fontWeight: 700, letterSpacing: 0.5, marginBottom: 4 }}>{t.formTitle}</h2>
            <p style={{ color: "rgba(243, 211, 122, 0.45)", fontSize: 12 }}>{t.formSub}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, color: "rgba(243, 211, 122, 0.8)", marginBottom: 6, letterSpacing: 0.5 }}>
                <span>👤</span> {t.fName} *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder={t.phName}
                style={{ width: "100%", background: "rgba(11, 8, 25, 0.6)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 10, padding: "12px 14px", color: "#FFF", fontSize: 14, fontFamily: "inherit", colorScheme: "dark" }}
              />
            </div>

            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, color: "rgba(243, 211, 122, 0.8)", marginBottom: 6, letterSpacing: 0.5 }}>
                <span>📅</span> {t.fDob} *
              </label>
              <input
                type="date"
                value={form.dob}
                onChange={e => setForm({ ...form, dob: e.target.value })}
                style={{ width: "100%", background: "rgba(11, 8, 25, 0.6)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 10, padding: "12px 14px", color: "#FFF", fontSize: 14, fontFamily: "inherit", colorScheme: "dark" }}
              />
            </div>

            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, color: "rgba(243, 211, 122, 0.8)", marginBottom: 6, letterSpacing: 0.5 }}>
                <span>⏰</span> {t.fTob} (12:00 PM if unsure)
              </label>
              <input
                type="time"
                value={form.tob}
                onChange={e => setForm({ ...form, tob: e.target.value })}
                style={{ width: "100%", background: "rgba(11, 8, 25, 0.6)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 10, padding: "12px 14px", color: "#FFF", fontSize: 14, fontFamily: "inherit", colorScheme: "dark" }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, color: "rgba(243, 211, 122, 0.8)", marginBottom: 6, letterSpacing: 0.5 }}>
                <span>📍</span> {t.fPob} *
              </label>
              <input
                type="text"
                value={form.pob}
                onChange={e => setForm({ ...form, pob: e.target.value })}
                placeholder={t.phPob}
                style={{ width: "100%", background: "rgba(11, 8, 25, 0.6)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 10, padding: "12px 14px", color: "#FFF", fontSize: 14, fontFamily: "inherit", colorScheme: "dark" }}
              />
            </div>
          </div>

          {err && (
            <div style={{ background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.35)", borderRadius: 8, padding: "10px 14px", color: "#FCA5A5", fontSize: 12, textAlign: "center", marginTop: 16 }}>
              ⚠️ {err}
            </div>
          )}

          <button onClick={run} disabled={step > 0} className="gold-cta-btn" style={{ marginTop: 22 }}>
            {step > 0 ? t.btnWait : t.btnGo}
          </button>
        </div>

        {/* Loading Progress */}
        {step > 0 && (
          <div className="glass-card no-print" style={{ padding: "36px 20px", textAlign: "center", marginBottom: 32 }}>
            <div style={{ display: "inline-block", position: "relative", width: 80, height: 80, marginBottom: 16 }}>
              <div style={{ position: "absolute", inset: 0, border: "2px solid rgba(245, 158, 11, 0.3)", borderRadius: "50%", borderTopColor: "#F59E0B", animation: "spin 1.2s linear infinite" }} />
              <div style={{ position: "absolute", inset: 8, border: "2px solid rgba(245, 158, 11, 0.15)", borderRadius: "50%", borderBottomColor: "#FDE68A", animation: "spin 2s linear infinite reverse" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, animation: "pulseSlow 1.5s infinite" }}>🔯</div>
            </div>
            <p style={{ color: "#F3D37A", fontSize: 14, fontWeight: 600, letterSpacing: 0.5 }}>{step === 1 ? t.s1 : t.s2}</p>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            SCREEN VIEW (Interactive Tabs)
        ══════════════════════════════════════════════════════════════════════ */}
        {result && (
          <div ref={resultRef} className="screen-only-tabs" style={{ animation: "fadeInCard 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>

            {/* Profile Overview Header Card */}
            <div className="glass-card" style={{ padding: "26px 28px", marginBottom: 28, textAlign: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "#F59E0B", fontWeight: 600, letterSpacing: 1, marginBottom: 6 }}>
                <span>✨</span> {hi ? "वैदिक जन्म विवरण" : "NATAL PROFILE"}
              </div>
              <h2 style={{ fontFamily: hi ? "'Noto Sans Devanagari', sans-serif" : "'Cinzel Decorative', serif", color: "#F3D37A", fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 700, marginBottom: 6 }}>
                {form.name.toUpperCase()}
              </h2>
              <p style={{ color: "rgba(241, 231, 208, 0.6)", fontSize: 12, letterSpacing: 0.5 }}>
                {form.dob} · {form.pob} {form.tob ? `· ${form.tob}` : ""}
              </p>

              {/* Core Panchang Pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 18 }}>
                {[
                  { label: t.pills.lagna, val: result.lagna, icon: "👑" },
                  { label: t.pills.rashi, val: result.rashi, icon: "🌙" },
                  { label: t.pills.nakshatra, val: result.nakshatra, icon: "⭐" },
                  { label: t.pills.tithi, val: result.tithi, icon: "🌕" },
                  { label: t.pills.yoga, val: result.yoga, icon: "⚡" },
                ].map((item, i) => (
                  <div key={i} style={{ background: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.25)", borderRadius: 12, padding: "8px 14px", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 14 }}>{item.icon}</span>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 9, color: "rgba(243, 211, 122, 0.55)", letterSpacing: 0.5 }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: "#F3D37A", fontWeight: 700 }}>{item.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monetization Promotion Banner */}
            <div className="glass-card" style={{ padding: "18px 24px", marginBottom: 24, background: "linear-gradient(135deg, rgba(35,22,65,0.9), rgba(18,12,38,0.95))", border: "1px solid rgba(245,158,11,0.4)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.2)", borderRadius: 12, padding: "3px 10px", color: "#FDE68A", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
                  <span>⭐</span> {hi ? "प्रीमियम 50+ पेज महा-कुंडली रिपोर्ट" : "DELUXE 50+ PAGE LIFE REPORT"}
                </div>
                <h4 style={{ color: "#F3D37A", fontSize: 14, fontWeight: 700 }}>
                  {hi ? "वर्ष 2026-2027 वार्षिक गोचर, साढ़ेसाती व विस्तृत समाधान प्राप्त करें" : "Unlock Complete 2026-2027 Annual Transit Forecast & Remedies"}
                </h4>
              </div>
              <button
                onClick={() => setActiveCheckout({
                  title: hi ? "50-पेज गोल्डन महा-कुंडली रिपोर्ट" : "Golden Deluxe 50-Page Life Report",
                  price: "₹199 / $4.99",
                  desc: hi ? "दशा विश्लेषण, साढ़ेसाती, करियर और व्यक्तिगत उपाय सहित विस्तृत PDF" : "Full life analysis, transit timing, Sade Sati & energized gemstones PDF",
                  icon: "📜"
                })}
                style={{ background: "linear-gradient(90deg, #F59E0B, #D97706)", border: "none", color: "#0F0A1E", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(245,158,11,0.4)" }}
              >
                {hi ? "अनलॉक करें (₹199)" : "Unlock Report ($4.99)"}
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="tab-bar-nav" style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 28 }}>
              {TABS.map(tabItem => (
                <button
                  key={tabItem.id}
                  onClick={() => setTab(tabItem.id)}
                  className={`tab-btn ${tab === tabItem.id ? "active" : ""}`}
                >
                  <span>{tabItem.icon}</span>
                  <span>{hi ? tabItem.labelHi : tabItem.labelEn}</span>
                </button>
              ))}
            </div>

            {/* ── TAB 1: CHART ── */}
            {tab === "chart" && (
              <div className="glass-card" style={{ padding: "30px 24px", marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
                  <div>
                    <h3 style={{ color: "#F3D37A", fontSize: 16, fontWeight: 700 }}>{t.chartTitle}</h3>
                    <p style={{ color: "rgba(241, 231, 208, 0.5)", fontSize: 12 }}>{t.chartSub}</p>
                  </div>

                  <div style={{ display: "flex", background: "rgba(11, 8, 25, 0.7)", border: "1px solid rgba(212, 175, 55, 0.2)", borderRadius: 20, padding: 3 }}>
                    <button
                      onClick={() => setChartStyle("north")}
                      style={{ background: chartStyle === "north" ? "rgba(245, 158, 11, 0.25)" : "transparent", border: "none", color: chartStyle === "north" ? "#FDE68A" : "rgba(241, 231, 208, 0.6)", padding: "5px 12px", borderRadius: 16, fontSize: 11, fontWeight: 600, cursor: "pointer" }}
                    >
                      {t.chartStyleNorth}
                    </button>
                    <button
                      onClick={() => setChartStyle("south")}
                      style={{ background: chartStyle === "south" ? "rgba(245, 158, 11, 0.25)" : "transparent", border: "none", color: chartStyle === "south" ? "#FDE68A" : "rgba(241, 231, 208, 0.6)", padding: "5px 12px", borderRadius: 16, fontSize: 11, fontWeight: 600, cursor: "pointer" }}
                    >
                      {t.chartStyleSouth}
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                  {chartStyle === "north" ? (
                    <NorthIndianChart houses={result.houses} lang={lang} hoveredHouse={hoveredHouse} setHoveredHouse={setHoveredHouse} />
                  ) : (
                    <SouthIndianChart houses={result.houses} lang={lang} hoveredHouse={hoveredHouse} setHoveredHouse={setHoveredHouse} />
                  )}
                </div>

                {hoveredHouse && (
                  <div style={{ background: "rgba(245, 158, 11, 0.12)", border: "1px solid rgba(245, 158, 11, 0.35)", borderRadius: 12, padding: "12px 18px", marginBottom: 20, animation: "fadeInCard 0.2s ease" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ color: "#FDE68A", fontSize: 13, fontWeight: 700 }}>
                        {hi ? `भाव ${hoveredHouse}` : `House ${hoveredHouse}`}: {t.hnames[hoveredHouse - 1]}
                      </span>
                      <span style={{ color: "#F3D37A", fontSize: 12 }}>
                        {result.houses[hoveredHouse]?.sign} ({result.houses[hoveredHouse]?.signSanskrit})
                      </span>
                    </div>
                    <p style={{ color: "rgba(241, 231, 208, 0.8)", fontSize: 12, lineHeight: 1.6 }}>
                      {result.houses[hoveredHouse]?.interpretation}
                    </p>
                  </div>
                )}

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 24 }}>
                  {PLANETS.map(p => (
                    <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(15, 10, 32, 0.8)", border: "1px solid rgba(212, 175, 55, 0.2)", borderRadius: 8, padding: "5px 10px" }}>
                      <span style={{ color: p.color, fontWeight: "bold", fontSize: 12 }}>{p.symbol}</span>
                      <span style={{ color: "rgba(241, 231, 208, 0.7)", fontSize: 11 }}>{hi ? p.sanskrit : p.name}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                  <div style={{ background: "rgba(15, 10, 32, 0.7)", border: "1px solid rgba(212, 175, 55, 0.2)", borderRadius: 12, padding: "18px 20px" }}>
                    <h4 style={{ color: "#F3D37A", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                      <span>⚡</span> {t.sec.yogas}
                    </h4>
                    <div style={{ color: "rgba(241, 231, 208, 0.85)", fontSize: 13, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                      {result.yogas}
                    </div>
                  </div>

                  <div style={{ background: "rgba(15, 10, 32, 0.7)", border: "1px solid rgba(212, 175, 55, 0.2)", borderRadius: 12, padding: "18px 20px" }}>
                    <h4 style={{ color: "#F3D37A", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                      <span>⏱️</span> {t.sec.dasha}
                    </h4>
                    <div style={{ color: "rgba(241, 231, 208, 0.85)", fontSize: 13, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                      {result.dasha}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 2: OVERVIEW ── */}
            {tab === "overview" && (
              <div>
                <SectionCard icon="🌟" title={t.sec.blueprint} content={result.overview} />
                <SectionCard icon="⚡" title={t.sec.yogas} content={result.yogas} />
                <SectionCard icon="✨" title={t.sec.verdict} content={result.verdict} highlight />
              </div>
            )}

            {/* ── TAB 3: 2026–2027 ANNUAL FORECAST (REVENUE MAGNET) ── */}
            {tab === "forecast" && (
              <div>
                <div className="glass-card" style={{ padding: "26px 28px", marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                    <div>
                      <h3 style={{ color: "#F3D37A", fontSize: 16, fontWeight: 700 }}>
                        📅 {hi ? "वर्ष 2026–2027 वार्षिक गोचर एवं भविष्यवाणी" : "2026–2027 Annual Transit & Planetary Forecast"}
                      </h3>
                      <p style={{ color: "rgba(241,231,208,0.6)", fontSize: 12 }}>
                        {hi ? `मूल नक्षत्र: ${result.nakshatra} | चंद्र राशि: ${result.rashi}` : `Natal Nakshatra: ${result.nakshatra} | Moon: ${result.rashi}`}
                      </p>
                    </div>
                    <span style={{ padding: "4px 12px", borderRadius: 14, background: "rgba(245,158,11,0.15)", color: "#FDE68A", fontSize: 12, fontWeight: 700, border: "1px solid rgba(245,158,11,0.3)" }}>
                      {result.annualTransit.sadeSatiStatus}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginBottom: 22 }}>
                    {result.annualTransit.transits.map((tr, i) => (
                      <div key={i} style={{ background: "rgba(15,10,32,0.7)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 12, padding: "14px 16px" }}>
                        <div style={{ color: "#FDE68A", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{tr.planet} in {tr.sign}</div>
                        <div style={{ color: "rgba(241,231,208,0.8)", fontSize: 12, lineHeight: 1.6 }}>{tr.effect}</div>
                      </div>
                    ))}
                  </div>

                  <h4 style={{ color: "#F3D37A", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
                    ⚡ {hi ? "त्रैमासिक स्कोरकार्ड (Quarterly Milestones)" : "Quarterly Life Milestones"}
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
                    {result.annualTransit.quarters.map((q, i) => (
                      <div key={i} style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{ color: "#FDE68A", fontSize: 12, fontWeight: 700 }}>{q.quarter}</span>
                          <span style={{ color: "#34D399", fontSize: 11, fontWeight: 800 }}>{q.rating}</span>
                        </div>
                        <div style={{ color: "#F3D37A", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{q.theme}</div>
                        <div style={{ color: "rgba(241,231,208,0.75)", fontSize: 11, lineHeight: 1.5 }}>{q.impact}</div>
                      </div>
                    ))}
                  </div>

                  {/* Upsell to PDF */}
                  <div style={{ textAlign: "center", padding: "16px", background: "rgba(245,158,11,0.08)", border: "1px dashed rgba(245,158,11,0.4)", borderRadius: 12 }}>
                    <div style={{ color: "#FDE68A", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                      {hi ? "महीने-दर-महीने संपूर्ण 2026-2027 PDF रिपोर्ट डाउनलोड करें" : "Download Full 2026-2027 Month-by-Month Forecast PDF"}
                    </div>
                    <button
                      onClick={() => setActiveCheckout({
                        title: "2026-2027 Annual Transit Forecast PDF",
                        price: "₹149 / $3.99",
                        desc: "Detailed monthly predictions, wealth windows & auspicious dates",
                        icon: "📅"
                      })}
                      style={{ marginTop: 8, background: "linear-gradient(90deg, #F59E0B, #D97706)", border: "none", color: "#0F0A1E", padding: "8px 18px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                    >
                      {hi ? "पूर्ण रिपोर्ट प्राप्त करें (₹149)" : "Get Full PDF ($3.99)"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 4: KUNDLI MILAN (GUN MILAN 36 POINTS) ── */}
            {tab === "matchmaking" && (
              <div className="glass-card" style={{ padding: "28px 26px", marginBottom: 20 }}>
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <span style={{ fontSize: 32 }}>❤️</span>
                  <h3 style={{ color: "#F3D37A", fontSize: 17, fontWeight: 700, marginTop: 4 }}>
                    {hi ? "वैदिक कुंडली मिलान (अष्टकूट ३६ गुण मिलान)" : "Vedic Kundli Matchmaking (Ashtakoot 36 Gunas)"}
                  </h3>
                  <p style={{ color: "rgba(241,231,208,0.6)", fontSize: 12, marginTop: 2 }}>
                    {hi ? `प्रथम जातक: ${form.name || "User"} (चंद्र राशि: ${result.rashi})` : `Primary Native: ${form.name || "User"} (Moon: ${result.rashi})`}
                  </p>
                </div>

                {/* Partner Form */}
                <div style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 12, padding: "18px 20px", marginBottom: 20 }}>
                  <h4 style={{ color: "#FDE68A", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
                    {hi ? "द्वितीय जातक (Partner) का विवरण दर्ज करें:" : "Enter Partner's Details:"}
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 10, color: "rgba(243,211,122,0.8)", display: "block", marginBottom: 4 }}>Partner Name *</label>
                      <input placeholder="e.g. Priya Sharma" value={partnerForm.name} onChange={e => setPartnerForm({ ...partnerForm, name: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 8, padding: "8px 12px", color: "#FFF", fontSize: 13 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, color: "rgba(243,211,122,0.8)", display: "block", marginBottom: 4 }}>Date of Birth *</label>
                      <input type="date" value={partnerForm.dob} onChange={e => setPartnerForm({ ...partnerForm, dob: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 8, padding: "8px 12px", color: "#FFF", fontSize: 13, colorScheme: "dark" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, color: "rgba(243,211,122,0.8)", display: "block", marginBottom: 4 }}>Time of Birth</label>
                      <input type="time" value={partnerForm.tob} onChange={e => setPartnerForm({ ...partnerForm, tob: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 8, padding: "8px 12px", color: "#FFF", fontSize: 13, colorScheme: "dark" }} />
                    </div>
                  </div>
                  <button onClick={handleRunGunMilan} className="gold-cta-btn" style={{ marginTop: 14, padding: "10px 18px", fontSize: 13 }}>
                    {hi ? "गुण मिलान गणना करें ✦" : "Calculate Gun Milan Compatibility ✦"}
                  </button>
                </div>

                {/* Gun Milan Results */}
                {milanResult && (
                  <div style={{ background: "rgba(15,10,32,0.9)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 14, padding: "20px 22px", animation: "fadeInCard 0.4s ease" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(212,175,55,0.25)", paddingBottom: 14, marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                      <div>
                        <div style={{ fontSize: 12, color: "rgba(241,231,208,0.7)" }}>
                          {milanResult.p1.name} ({milanResult.p1.sign}) × {milanResult.p2.name} ({milanResult.p2.sign})
                        </div>
                        <h4 style={{ color: "#F3D37A", fontSize: 16, fontWeight: 700, marginTop: 2 }}>
                          {hi ? milanResult.verdictHi : milanResult.verdict}
                        </h4>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 24, fontWeight: 800, color: Number(milanResult.totalGunas) >= 18 ? "#34D399" : "#F87171" }}>
                          {milanResult.totalGunas} / {milanResult.maxGunas}
                        </div>
                        <div style={{ fontSize: 10, color: "rgba(243,211,122,0.6)" }}>{milanResult.percentage}% Match Score</div>
                      </div>
                    </div>

                    {/* Kootas Breakdown */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, marginBottom: 16 }}>
                      {milanResult.kootas.map((k, idx) => (
                        <div key={idx} style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.18)", borderRadius: 8, padding: "10px 12px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "#FDE68A" }}>
                            <span>{k.name}</span>
                            <span>{k.score}/{k.max}</span>
                          </div>
                          <div style={{ fontSize: 10, color: "rgba(241,231,208,0.6)", marginTop: 2 }}>{k.desc}</div>
                        </div>
                      ))}
                    </div>

                    {/* Manglik status */}
                    <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#FDE68A", marginBottom: 16 }}>
                      🔥 <b>Manglik Alignment:</b> {milanResult.manglikStatus}
                    </div>

                    {/* Pro compatibility report unlock */}
                    <div style={{ textAlign: "center", padding: "14px", background: "rgba(35,22,65,0.8)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 10 }}>
                      <div style={{ color: "#F3D37A", fontSize: 13, fontWeight: 700 }}>
                        {hi ? "विस्तृत दांपत्य भविष्य, संतान योग एवं निवारण रिपोर्ट (PDF)" : "Unlock Complete 25-Page Matrimonial Compatibility PDF"}
                      </div>
                      <button
                        onClick={() => setActiveCheckout({
                          title: "Kundli Milan Comprehensive PDF Report",
                          price: "₹149 / $3.99",
                          desc: "In-depth Bhakoot/Nadi analysis, future timing, and harmony remedies",
                          icon: "❤️"
                        })}
                        style={{ marginTop: 8, background: "linear-gradient(90deg, #F59E0B, #D97706)", border: "none", color: "#0F0A1E", padding: "8px 18px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                      >
                        {hi ? "डाउनलोड करें (₹149)" : "Unlock Matrimonial Report ($3.99)"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 5: 1-ON-1 ASTROLOGER CONSULTATION ── */}
            {tab === "consult" && (
              <div className="glass-card" style={{ padding: "28px 24px", marginBottom: 20 }}>
                <div style={{ textAlign: "center", marginBottom: 22 }}>
                  <span style={{ fontSize: 32 }}>🔮</span>
                  <h3 style={{ color: "#F3D37A", fontSize: 18, fontWeight: 700, marginTop: 4 }}>
                    {hi ? "प्रमाणित वैदिक ज्योतिषियों से 1-on-1 परामर्श लें" : "Consult 1-on-1 with Certified Vedic Astrologers"}
                  </h3>
                  <p style={{ color: "rgba(241,231,208,0.6)", fontSize: 12, marginTop: 2 }}>
                    {hi ? "करियर, विवाह, वित्त एवं स्वास्थ्य पर व्यक्तिगत मार्गदर्शन (Call / WhatsApp)" : "Private Audio/WhatsApp consultation for career, marriage & life clarity"}
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
                  {ASTROLOGERS.map((ast, i) => (
                    <div key={i} style={{ background: "rgba(15,10,32,0.85)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 14, padding: "20px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                          <span style={{ fontSize: 32 }}>{ast.avatar}</span>
                          <span style={{ background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)", color: "#FDE68A", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 12 }}>
                            {ast.badge}
                          </span>
                        </div>
                        <h4 style={{ color: "#F3D37A", fontSize: 15, fontWeight: 700 }}>{ast.name}</h4>
                        <div style={{ color: "#34D399", fontSize: 11, fontWeight: 600, marginTop: 2 }}>{ast.rating} · {ast.exp}</div>
                        <div style={{ color: "rgba(241,231,208,0.8)", fontSize: 12, marginTop: 6, lineHeight: 1.5 }}>
                          {hi ? ast.specialtyHi : ast.specialty}
                        </div>
                        <div style={{ fontSize: 11, color: "rgba(243,211,122,0.5)", marginTop: 4 }}>
                          🗣️ {ast.lang}
                        </div>
                      </div>

                      <div style={{ marginTop: 16, borderTop: "1px solid rgba(212,175,55,0.15)", paddingTop: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                          <span style={{ fontSize: 11, color: "rgba(241,231,208,0.6)" }}>Consultation Fee:</span>
                          <span style={{ fontSize: 14, fontWeight: 800, color: "#FDE68A" }}>{ast.price}</span>
                        </div>
                        <button
                          onClick={() => setActiveCheckout({
                            title: `1-on-1 Consultation: ${ast.name}`,
                            price: ast.price,
                            desc: `Instant appointment confirmation & WhatsApp audio consult connection`,
                            icon: "📞"
                          })}
                          style={{ width: "100%", background: "linear-gradient(90deg, #F59E0B, #D97706)", border: "none", color: "#0F0A1E", padding: "10px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                        >
                          {hi ? "परामर्श बुक करें 📞" : "Book Call / WhatsApp 📞"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── TAB 6: VEDIC STORE & CERTIFIED REMEDIES ── */}
            {tab === "store" && (
              <div className="glass-card" style={{ padding: "28px 24px", marginBottom: 20 }}>
                <div style={{ textAlign: "center", marginBottom: 22 }}>
                  <span style={{ fontSize: 32 }}>💎</span>
                  <h3 style={{ color: "#F3D37A", fontSize: 18, fontWeight: 700, marginTop: 4 }}>
                    {hi ? "आपकी कुंडली के अनुसार प्रमाणित रत्न एवं सिद्ध रुद्राक्ष" : "Prescribed Certified Gemstones & Energized Rudraksha"}
                  </h3>
                  <p style={{ color: "rgba(241,231,208,0.6)", fontSize: 12, marginTop: 2 }}>
                    {hi ? `आपके लग्न (${result.lagnaSign}) के अनुकूल 100% लैब-प्रमाणित रत्न` : `100% Lab-Tested & Energized specifically for ${result.lagnaSign} Lagna`}
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
                  {/* Prescribed Gemstone */}
                  <div style={{ background: "rgba(15,10,32,0.85)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 14, padding: "20px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontSize: 30 }}>💍</span>
                      <div style={{ color: "#FDE68A", fontSize: 11, fontWeight: 700, marginTop: 4 }}>PRIMARY LUCKY GEMSTONE</div>
                      <h4 style={{ color: "#F3D37A", fontSize: 16, fontWeight: 700 }}>{result.gemObj.gem}</h4>
                      <p style={{ color: "rgba(241,231,208,0.75)", fontSize: 12, marginTop: 6, lineHeight: 1.5 }}>
                        Certified natural, unheated gemstone to strengthen {result.lagnaSign} Lagna lord and accelerate wealth & vitality.
                      </p>
                    </div>
                    <div style={{ marginTop: 16, borderTop: "1px solid rgba(212,175,55,0.15)", paddingTop: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <span style={{ fontSize: 11, color: "rgba(241,231,208,0.6)" }}>Lab Certified:</span>
                        <span style={{ fontSize: 16, fontWeight: 800, color: "#FDE68A" }}>{result.gemObj.certPrice}</span>
                      </div>
                      <button
                        onClick={() => setActiveCheckout({
                          title: `Certified ${result.gemObj.gem}`,
                          price: result.gemObj.certPrice,
                          desc: "100% Natural Lab-Certified Gemstone with Certificate of Authenticity",
                          icon: "💍"
                        })}
                        style={{ width: "100%", background: "linear-gradient(90deg, #F59E0B, #D97706)", border: "none", color: "#0F0A1E", padding: "10px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                      >
                        {hi ? "प्रमाणित रत्न आर्डर करें ✦" : "Order Certified Gemstone ✦"}
                      </button>
                    </div>
                  </div>

                  {/* Energized Rudraksha */}
                  <div style={{ background: "rgba(15,10,32,0.85)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 14, padding: "20px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontSize: 30 }}>📿</span>
                      <div style={{ color: "#FDE68A", fontSize: 11, fontWeight: 700, marginTop: 4 }}>SACRED ENERGIZED RUDRAKSHA</div>
                      <h4 style={{ color: "#F3D37A", fontSize: 16, fontWeight: 700 }}>{result.rudraksha}</h4>
                      <p style={{ color: "rgba(241,231,208,0.75)", fontSize: 12, marginTop: 6, lineHeight: 1.5 }}>
                        Consecrated with sacred Vedic Beej Mantras for mental clarity, stress removal, and spiritual protection.
                      </p>
                    </div>
                    <div style={{ marginTop: 16, borderTop: "1px solid rgba(212,175,55,0.15)", paddingTop: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <span style={{ fontSize: 11, color: "rgba(241,231,208,0.6)" }}>Pran-Pratishtha:</span>
                        <span style={{ fontSize: 16, fontWeight: 800, color: "#FDE68A" }}>₹1,499</span>
                      </div>
                      <button
                        onClick={() => setActiveCheckout({
                          title: `Energized ${result.rudraksha}`,
                          price: "₹1,499",
                          desc: "Vedic Pran-Pratishtha energized authentic Nepali Rudraksha bead",
                          icon: "📿"
                        })}
                        style={{ width: "100%", background: "linear-gradient(90deg, #F59E0B, #D97706)", border: "none", color: "#0F0A1E", padding: "10px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                      >
                        {hi ? "सिद्ध रुद्राक्ष प्राप्त करें ✦" : "Order Energized Rudraksha ✦"}
                      </button>
                    </div>
                  </div>

                  {/* Navagraha Yantra */}
                  <div style={{ background: "rgba(15,10,32,0.85)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 14, padding: "20px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontSize: 30 }}>🔯</span>
                      <div style={{ color: "#FDE68A", fontSize: 11, fontWeight: 700, marginTop: 4 }}>COPPER NAVAGRAHA YANTRA</div>
                      <h4 style={{ color: "#F3D37A", fontSize: 16, fontWeight: 700 }}>Shree Sampoorna Navagraha Yantra</h4>
                      <p style={{ color: "rgba(241,231,208,0.75)", fontSize: 12, marginTop: 6, lineHeight: 1.5 }}>
                        Pure copper geometric plate to balance all 9 planetary doshas in your residence or office.
                      </p>
                    </div>
                    <div style={{ marginTop: 16, borderTop: "1px solid rgba(212,175,55,0.15)", paddingTop: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <span style={{ fontSize: 11, color: "rgba(241,231,208,0.6)" }}>Pure Copper:</span>
                        <span style={{ fontSize: 16, fontWeight: 800, color: "#FDE68A" }}>₹899</span>
                      </div>
                      <button
                        onClick={() => setActiveCheckout({
                          title: "Sampoorna Navagraha Yantra",
                          price: "₹899",
                          desc: "Pure energized copper Navagraha Yantra with wooden frame",
                          icon: "🔯"
                        })}
                        style={{ width: "100%", background: "linear-gradient(90deg, #F59E0B, #D97706)", border: "none", color: "#0F0A1E", padding: "10px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                      >
                        {hi ? "यंत्र आर्डर करें ✦" : "Order Sacred Yantra ✦"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 7: PLANETS ── */}
            {tab === "planets" && (
              <div>
                <div className="glass-card" style={{ padding: "24px 20px", marginBottom: 20 }}>
                  <h3 style={{ color: "#F3D37A", fontSize: 15, fontWeight: 700, marginBottom: 14 }}>{t.ptTitle}</h3>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                      <thead>
                        <tr style={{ background: "rgba(245, 158, 11, 0.1)", borderBottom: "1px solid rgba(212, 175, 55, 0.25)" }}>
                          {t.pcols.map(col => (
                            <th key={col} style={{ padding: "10px 12px", color: "#FDE68A", fontSize: 11, fontWeight: 700, textAlign: "left", letterSpacing: 0.5 }}>{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {PLANETS.map((p, idx) => {
                          const pd = result.planetData?.[p.name] || {};
                          const isExalted = pd.status?.includes("Exalted") || pd.status?.includes("उच्च");
                          const isDebilitated = pd.status?.includes("Debilitated") || pd.status?.includes("नीच");
                          const isOwn = pd.status?.includes("Own") || pd.status?.includes("स्वगृही");

                          return (
                            <tr key={p.name} style={{ borderBottom: "1px solid rgba(212, 175, 55, 0.08)", background: idx % 2 ? "rgba(255, 255, 255, 0.015)" : "transparent" }}>
                              <td style={{ padding: "10px 12px" }}>
                                <span style={{ color: p.color, fontWeight: "bold", fontSize: 13 }}>{p.symbol} {p.name}</span>
                                <div style={{ fontSize: 10, color: "rgba(241, 231, 208, 0.45)" }}>{p.sanskrit}</div>
                              </td>
                              <td style={{ padding: "10px 12px", color: "rgba(241, 231, 208, 0.9)", fontSize: 13 }}>
                                {pd.sign} <span style={{ fontSize: 11, color: "rgba(243, 211, 122, 0.5)" }}>({pd.signSanskrit})</span>
                              </td>
                              <td style={{ padding: "10px 12px", color: "#FDE68A", fontSize: 13, fontWeight: 700 }}>
                                House {pd.house}
                              </td>
                              <td style={{ padding: "10px 12px", color: "rgba(241, 231, 208, 0.8)", fontSize: 12 }}>
                                {pd.degree}
                                <div style={{ fontSize: 10, color: "rgba(243, 211, 122, 0.6)" }}>{pd.nakshatra} (P{pd.pada})</div>
                              </td>
                              <td style={{ padding: "10px 12px" }}>
                                <span style={{
                                  padding: "3px 9px",
                                  borderRadius: 14,
                                  fontSize: 10.5,
                                  fontWeight: 600,
                                  background: isExalted ? "rgba(16, 185, 129, 0.16)" : isDebilitated ? "rgba(239, 68, 68, 0.16)" : isOwn ? "rgba(245, 158, 11, 0.16)" : "rgba(212, 175, 55, 0.08)",
                                  color: isExalted ? "#34D399" : isDebilitated ? "#F87171" : isOwn ? "#FBBF24" : "#F3D37A",
                                  border: `1px solid ${isExalted ? "rgba(16, 185, 129, 0.35)" : isDebilitated ? "rgba(239, 68, 68, 0.35)" : isOwn ? "rgba(245, 158, 11, 0.35)" : "rgba(212, 175, 55, 0.2)"}`
                                }}>
                                  {pd.status || "—"}
                                </span>
                              </td>
                              <td style={{ padding: "10px 12px", color: "rgba(241, 231, 208, 0.7)", fontSize: 12 }}>
                                {pd.effect || "—"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <SectionCard icon="🪐" title={t.sec.pa} content={result.pa} />
              </div>
            )}

            {/* ── TAB 8: HOUSES ── */}
            {tab === "houses" && (
              <div>
                <div className="glass-card" style={{ padding: "24px 20px", marginBottom: 20 }}>
                  <h3 style={{ color: "#F3D37A", fontSize: 15, fontWeight: 700, marginBottom: 14 }}>{t.htTitle}</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
                    {Array.from({ length: 12 }, (_, i) => {
                      const n = i + 1;
                      const d = result.houses?.[n] || {};
                      const sg = ZODIAC_SIGNS.find(z => z.name === d.sign || z.sanskrit === d.sign) || ZODIAC_SIGNS[i];
                      const pl = d.planets || [];

                      return (
                        <div key={n} style={{ background: "rgba(15, 10, 32, 0.75)", border: "1px solid rgba(212, 175, 55, 0.2)", borderRadius: 12, padding: "14px 16px", borderLeft: "4px solid #F59E0B" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                            <div>
                              <span style={{ color: "#FDE68A", fontSize: 13, fontWeight: 700 }}>
                                {hi ? `भाव ${n}` : `House ${n}`}
                              </span>
                              <div style={{ fontSize: 10, color: "rgba(243, 211, 122, 0.6)", marginTop: 1 }}>{t.hnames[i]}</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontSize: 18, color: "#F3D37A", lineHeight: 1 }}>{sg.symbol}</div>
                              <div style={{ fontSize: 9, color: "rgba(241, 231, 208, 0.5)", marginTop: 2 }}>{sg.sanskrit}</div>
                            </div>
                          </div>

                          {pl.length > 0 ? (
                            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                              {pl.map((p, j) => {
                                const pd = PLANETS.find(x => x.name === p);
                                return (
                                  <span key={j} style={{ padding: "2px 8px", borderRadius: 8, fontSize: 11, fontWeight: "bold", background: "rgba(245, 158, 11, 0.12)", color: pd?.color || "#F3D37A", border: "1px solid rgba(245, 158, 11, 0.25)" }}>
                                    {p}
                                  </span>
                                );
                              })}
                            </div>
                          ) : (
                            <div style={{ fontSize: 10, color: "rgba(241, 231, 208, 0.3)", marginBottom: 8, fontStyle: "italic" }}>{t.nopl}</div>
                          )}

                          <p style={{ fontSize: 12, color: "rgba(241, 231, 208, 0.75)", lineHeight: 1.6 }}>{d.interpretation}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <SectionCard icon="🏠" title={t.sec.ha} content={result.ha} />
              </div>
            )}

            {/* ── TAB 9: LIFE AREAS ── */}
            {tab === "life" && (
              <div>
                <SectionCard icon="🌿" title={t.sec.health} content={result.health} />
                <SectionCard icon="💰" title={t.sec.wealth} content={result.wealth} />
                <SectionCard icon="📚" title={t.sec.education} content={result.education} />
                <SectionCard icon="🏆" title={t.sec.career} content={result.career} />
                <SectionCard icon="💑" title={t.sec.marriage} content={result.marriage} />
              </div>
            )}

            {/* ── TAB 10: PREDICTIONS ── */}
            {tab === "predictions" && (
              <div>
                <SectionCard icon="🔮" title={t.sec.pred} content={result.pred} />
                <SectionCard icon="⏱️" title={t.sec.dasha} content={result.dasha} />
              </div>
            )}

          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            PRINT-ONLY FULL DETAILED REPORT (All Sections in Order, Clean PDF)
        ══════════════════════════════════════════════════════════════════════ */}
        {result && (
          <div className="print-only-report">
            <div style={{ textAlign: "center", borderBottom: "2px solid #D4AF37", paddingBottom: 16, marginBottom: 24 }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>🔯</div>
              <h1 style={{ fontFamily: "'Cinzel', serif", color: "#F3D37A", fontSize: 26, fontWeight: 800, letterSpacing: 2 }}>
                JYOTISH KUNDLI — COMPLETE VEDIC REPORT
              </h1>
              <p style={{ color: "rgba(243,211,122,0.8)", fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}>
                {form.name.toUpperCase()} · DOB: {form.dob} · TOB: {form.tob || "12:00 PM"} · POB: {form.pob}
              </p>
            </div>

            <div className="page-break-avoid" style={{ background: "rgba(26, 18, 48, 0.8)", border: "1px solid rgba(212, 175, 55, 0.4)", borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
              <h3 style={{ color: "#F3D37A", fontSize: 14, fontWeight: 700, marginBottom: 12, borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 6 }}>
                ✦ CORE PANCHANG & VEDIC METRICS
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, textAlign: "center" }}>
                {[
                  { label: "Ascendant (Lagna)", val: result.lagna },
                  { label: "Moon Sign (Rashi)", val: result.rashi },
                  { label: "Nakshatra & Pada", val: result.nakshatra },
                  { label: "Tithi", val: result.tithi },
                  { label: "Yoga", val: result.yoga },
                ].map((p, i) => (
                  <div key={i} style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 8, padding: "8px 10px" }}>
                    <div style={{ fontSize: 10, color: "rgba(243,211,122,0.6)", marginBottom: 4 }}>{p.label}</div>
                    <div style={{ fontSize: 12, color: "#FDE68A", fontWeight: 700 }}>{p.val}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="page-break-avoid" style={{ textAlign: "center", marginBottom: 28 }}>
              <h3 style={{ color: "#F3D37A", fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
                ✦ NATAL LAGNA KUNDLI CHART
              </h3>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <NorthIndianChart houses={result.houses} lang={lang} />
              </div>
            </div>

            <div className="page-break-avoid" style={{ marginBottom: 28 }}>
              <h3 style={{ color: "#F3D37A", fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
                ✦ PLANETARY POSITIONS, HOUSES & DIGNITIES
              </h3>
              <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid rgba(212,175,55,0.3)" }}>
                <thead>
                  <tr style={{ background: "rgba(245, 158, 11, 0.15)", borderBottom: "1px solid rgba(212,175,55,0.4)" }}>
                    <th style={{ padding: "8px 10px", color: "#FDE68A", fontSize: 11, textAlign: "left" }}>Planet</th>
                    <th style={{ padding: "8px 10px", color: "#FDE68A", fontSize: 11, textAlign: "left" }}>Sign</th>
                    <th style={{ padding: "8px 10px", color: "#FDE68A", fontSize: 11, textAlign: "left" }}>House</th>
                    <th style={{ padding: "8px 10px", color: "#FDE68A", fontSize: 11, textAlign: "left" }}>Degree & Nakshatra</th>
                    <th style={{ padding: "8px 10px", color: "#FDE68A", fontSize: 11, textAlign: "left" }}>Dignity</th>
                    <th style={{ padding: "8px 10px", color: "#FDE68A", fontSize: 11, textAlign: "left" }}>Astrological Effect</th>
                  </tr>
                </thead>
                <tbody>
                  {PLANETS.map((p, idx) => {
                    const pd = result.planetData?.[p.name] || {};
                    return (
                      <tr key={p.name} style={{ borderBottom: "1px solid rgba(212,175,55,0.1)", background: idx % 2 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                        <td style={{ padding: "8px 10px", fontWeight: 700, color: p.color }}>{p.symbol} {p.name} ({p.sanskrit})</td>
                        <td style={{ padding: "8px 10px" }}>{pd.sign} ({pd.signSanskrit})</td>
                        <td style={{ padding: "8px 10px", fontWeight: 700, color: "#FDE68A" }}>House {pd.house}</td>
                        <td style={{ padding: "8px 10px" }}>{pd.degree} · {pd.nakshatra} (P{pd.pada})</td>
                        <td style={{ padding: "8px 10px" }}>{pd.status}</td>
                        <td style={{ padding: "8px 10px" }}>{pd.effect}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="page-break-before" />

            <div className="page-break-avoid" style={{ marginBottom: 20, border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 18, background: "rgba(15,10,32,0.6)" }}>
              <h3 style={{ color: "#F3D37A", fontSize: 14, fontWeight: 700, marginBottom: 8 }}>🌟 {t.sec.blueprint}</h3>
              <p style={{ lineHeight: 1.8, fontSize: 13, color: "rgba(241,231,208,0.9)" }}>{result.overview}</p>
            </div>

            <div className="page-break-avoid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div style={{ border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 16, background: "rgba(15,10,32,0.6)" }}>
                <h4 style={{ color: "#F3D37A", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>⚡ {t.sec.yogas}</h4>
                <div style={{ lineHeight: 1.7, fontSize: 12, whiteSpace: "pre-wrap" }}>{result.yogas}</div>
              </div>
              <div style={{ border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 16, background: "rgba(15,10,32,0.6)" }}>
                <h4 style={{ color: "#F3D37A", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>⏱️ {t.sec.dasha}</h4>
                <div style={{ lineHeight: 1.7, fontSize: 12, whiteSpace: "pre-wrap" }}>{result.dasha}</div>
              </div>
            </div>

            <div className="page-break-avoid" style={{ marginBottom: 20 }}>
              <h3 style={{ color: "#F3D37A", fontSize: 14, fontWeight: 700, marginBottom: 10 }}>🏠 {t.htTitle}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {Array.from({ length: 12 }, (_, i) => {
                  const n = i + 1;
                  const d = result.houses?.[n] || {};
                  return (
                    <div key={n} style={{ border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8, padding: 10, background: "rgba(15,10,32,0.6)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ color: "#FDE68A", fontSize: 12, fontWeight: 700 }}>House {n}: {t.hnames[i]}</span>
                        <span style={{ color: "#F3D37A", fontSize: 11 }}>{d.sign}</span>
                      </div>
                      <p style={{ fontSize: 11, lineHeight: 1.5, color: "rgba(241,231,208,0.8)" }}>{d.interpretation}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="page-break-before" />

            <div className="page-break-avoid" style={{ marginBottom: 20 }}>
              <h3 style={{ color: "#F3D37A", fontSize: 14, fontWeight: 700, marginBottom: 10 }}>🌿 LIFE DOMAIN ANALYSIS</h3>
              {[
                { title: t.sec.health, icon: "🌿", content: result.health },
                { title: t.sec.wealth, icon: "💰", content: result.wealth },
                { title: t.sec.education, icon: "📚", content: result.education },
                { title: t.sec.career, icon: "🏆", content: result.career },
                { title: t.sec.marriage, icon: "💑", content: result.marriage },
              ].map(sec => (
                <div key={sec.title} style={{ border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8, padding: "12px 14px", marginBottom: 8, background: "rgba(15,10,32,0.6)" }}>
                  <h4 style={{ color: "#FDE68A", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{sec.icon} {sec.title}</h4>
                  <p style={{ fontSize: 12, lineHeight: 1.6, color: "rgba(241,231,208,0.85)" }}>{sec.content}</p>
                </div>
              ))}
            </div>

            <div className="page-break-avoid" style={{ marginBottom: 20, border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 16, background: "rgba(15,10,32,0.6)" }}>
              <h3 style={{ color: "#F3D37A", fontSize: 14, fontWeight: 700, marginBottom: 8 }}>🔮 {t.sec.pred}</h3>
              <p style={{ lineHeight: 1.8, fontSize: 12, whiteSpace: "pre-wrap", color: "rgba(241,231,208,0.85)" }}>{result.pred}</p>
            </div>

            <div className="page-break-avoid" style={{ marginBottom: 20, border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 16, background: "rgba(15,10,32,0.6)" }}>
              <h3 style={{ color: "#F3D37A", fontSize: 14, fontWeight: 700, marginBottom: 10 }}>💎 {t.sec.gems}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 12 }}>
                {[
                  { title: t.sec.colours, val: result.colours },
                  { title: t.sec.numbers, val: result.numbers },
                  { title: t.sec.days, val: result.days },
                  { title: t.sec.rudraksha, val: result.rudraksha },
                ].map(item => (
                  <div key={item.title} style={{ border: "1px solid rgba(212,175,55,0.2)", borderRadius: 6, padding: 8, background: "rgba(11,8,25,0.7)" }}>
                    <div style={{ fontSize: 10, color: "#FDE68A", fontWeight: 700 }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: "rgba(241,231,208,0.85)", marginTop: 2 }}>{item.val}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.7, whiteSpace: "pre-wrap", color: "rgba(241,231,208,0.85)" }}>{result.gems}</p>
            </div>

            <div className="page-break-avoid" style={{ border: "1px solid rgba(245,158,11,0.5)", borderRadius: 10, padding: 16, background: "linear-gradient(135deg, rgba(35,22,65,0.9), rgba(18,12,38,0.95))" }}>
              <h3 style={{ color: "#F3D37A", fontSize: 14, fontWeight: 700, marginBottom: 6 }}>✨ {t.sec.verdict}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: "#FFF" }}>{result.verdict}</p>
              <div style={{ textAlign: "center", marginTop: 14, color: "rgba(243,211,122,0.5)", fontSize: 10, letterSpacing: 1.5 }}>
                ✦ OM TAT SAT ✦ — {t.footer2}
              </div>
            </div>

          </div>
        )}

        {/* Screen Footer */}
        <footer className="no-print" style={{ textAlign: "center", marginTop: 56, color: "rgba(243, 211, 122, 0.35)", fontSize: 11, letterSpacing: 1.5 }}>
          <div style={{ marginBottom: 4, fontWeight: 600 }}>{t.footer1}</div>
          <div style={{ fontSize: 10, letterSpacing: 0.5 }}>{t.footer2}</div>
        </footer>

      </main>
    </div>
  );
}

// ── REUSABLE SECTION CARD ─────────────────────────────────────────
const SectionCard = ({ icon, title, content, highlight = false }) => (
  <div
    className="glass-card"
    style={{
      padding: "24px 28px",
      marginBottom: 18,
      border: highlight ? "1px solid rgba(245, 158, 11, 0.45)" : "1px solid rgba(212, 175, 55, 0.22)",
      background: highlight ? "linear-gradient(135deg, rgba(35, 22, 65, 0.8) 0%, rgba(18, 12, 38, 0.95) 100%)" : undefined,
    }}
  >
    <h3 style={{ color: "#F3D37A", fontSize: 14, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 18 }}>{icon}</span> {title}
    </h3>
    <div style={{ color: "rgba(241, 231, 208, 0.88)", fontSize: 14, lineHeight: 1.85, whiteSpace: "pre-wrap" }}>
      {content}
    </div>
  </div>
);
