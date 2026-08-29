import { useState, useRef, useEffect } from "react";
import {
  generateVedicKundliData,
  calculateGunMilan,
  generateDailyHoroscope,
  calculateMarriagePrediction,
  calculateCareerPrediction,
  getLifeProblemRemedies,
  calculateDailyPanchang,
  getUpcomingShubhMuhurats,
  getUpcomingFestivalsAndVrats,
  SHUBH_MUHURAT_CATEGORIES,
  MAJOR_INDIAN_CITIES,
  LIFE_PROBLEMS_LIST,
  SIGNS
} from "./jyotishEngine";
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
  { id: "careerTiming", icon: "💼", labelEn: "Career & Job", labelHi: "करियर व नौकरी" },
  { id: "lifeProblems", icon: "🛡️", labelEn: "Problem Solver & Remedies", labelHi: "समस्या निवारण व उपाय" },
  { id: "marriageTiming", icon: "💍", labelEn: "Marriage & Spouse", labelHi: "विवाह व जीवनसाथी" },
  { id: "panchang", icon: "🕉️", labelEn: "Hindu Panchang", labelHi: "दैनिक पंचांग" },
  { id: "muhurat", icon: "⏳", labelEn: "Shubh Muhurat", labelHi: "शुभ मुहूर्त" },
  { id: "festivals", icon: "🪔", labelEn: "Festivals & Vrat", labelHi: "व्रत व त्यौहार" },
  { id: "daily", icon: "☀️", labelEn: "Daily Horoscope", labelHi: "दैनिक राशिफल" },
  { id: "forecast", icon: "📅", labelEn: "2026–2027 Forecast", labelHi: "वार्षिक राशिफल" },
  { id: "matchmaking", icon: "❤️", labelEn: "Kundli Milan", labelHi: "गुण मिलान" },
  { id: "consult", icon: "🔮", labelEn: "Talk to Astrologer", labelHi: "ज्योतिषी परामर्श" },
  { id: "store", icon: "💎", labelEn: "Gemstones & Remedies", labelHi: "रत्न व उपाय" },
  { id: "planets", icon: "🪐", labelEn: "Planets", labelHi: "ग्रह स्थिति" },
  { id: "houses", icon: "🏠", labelEn: "Houses", labelHi: "भाव विश्लेषण" },
  { id: "life", icon: "🌿", labelEn: "Life Areas", labelHi: "जीवन क्षेत्र" },
  { id: "predictions", icon: "🔮", labelEn: "Predictions", labelHi: "भविष्यवाणी" },
];

const UI = {
  en: {
    title: "JYOTISH KUNDLI",
    subtitle: "VEDIC BIRTH CHART & COSMIC LIFE READING",
    tagline: '"As above, so below — the stars illuminate the path of your soul"',
    formTitle: "Enter Your Birth Details",
    formSub: "Accurate planetary calculations according to traditional Parashari Vedic Astrology",
    fName: "Full Name", fDob: "Date of Birth", fTob: "Time of Birth", fPob: "Place of Birth",
    fTobHelp: "(12:00 PM if unsure)",
    phName: "e.g. Abhishek Kumar Singh", phPob: "e.g. Kanpur, Uttar Pradesh, India",
    btnGo: "Reveal My Kundli ✦", btnWait: "Consulting the Stars...",
    errFields: "Please fill in your Name, Date of Birth, and Place of Birth.",
    errPartnerFields: "Please enter partner name and date of birth.",
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
    partnerName: "Partner Name",
    partnerDob: "Date of Birth",
    partnerTob: "Time of Birth",
    partnerTobHelp: "(12:00 PM if unsure)",
    partnerFormTitle: "Enter Partner's Details:",
    calculateMatchBtn: "Calculate Gun Milan Compatibility ✦",
    currencyLabel: "Select Currency",
    deliveryTimeLabel: "Preferred Delivery Time",
    checkoutWhatsAppLabel: "Your WhatsApp / Mobile Number",
    checkoutWhatsAppHelp: "PDF report & confirmation will be sent here.",
    checkoutUtrLabel: "12-Digit UPI Ref / UTR No.",
    checkoutUtrHelp: "Found as 'UPI Ref No' or 'UTR' on your GPay/PhonePe receipt.",
    cardNumberLabel: "Card Number",
    cardExpiryLabel: "Card Expiry (MM/YY)",
    cardCvvLabel: "Security Code (CVV)",
    quickDailyPrompt: "Or check Today's Daily Vedic Horoscope & WhatsApp Alerts:",
    quickDailyBtn: "Daily Horoscope",
  },
  hi: {
    title: "ज्योतिष कुंडली",
    subtitle: "वैदिक जन्म कुंडली एवं ब्रह्मांडीय जीवन विश्लेषण",
    tagline: '"जैसा ऊपर, वैसा नीचे — नक्षत्र आपकी आत्मा के दिव्य मार्ग को प्रकाशित करते हैं"',
    formTitle: "अपना जन्म विवरण दर्ज करें",
    formSub: "पराशरी वैदिक ज्योतिष के प्रामाणिक सिद्धांतों पर आधारित सटीक गणना",
    fName: "पूरा नाम", fDob: "जन्म तिथि", fTob: "जन्म समय", fPob: "जन्म स्थान",
    fTobHelp: "(यदि निश्चित न हो तो दोपहर 12:00 रहने दें)",
    phName: "उदा. अभिषेक कुमार सिंह", phPob: "उदा. कानपुर, उत्तर प्रदेश, भारत",
    btnGo: "मेरी कुंडली प्रकट करें ✦", btnWait: "ग्रहों से परामर्श जारी है...",
    errFields: "कृपया अपना पूरा नाम, जन्म तिथि और जन्म स्थान भरें।",
    errPartnerFields: "कृपया जीवनसाथी का नाम और जन्म तिथि दर्ज करें।",
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
    partnerName: "जीवनसाथी (Partner) का पूरा नाम",
    partnerDob: "जन्म तिथि",
    partnerTob: "जन्म समय",
    partnerTobHelp: "(यदि निश्चित न हो तो दोपहर 12:00 रहने दें)",
    partnerFormTitle: "द्वितीय जातक (Partner) का विवरण दर्ज करें:",
    calculateMatchBtn: "गुण मिलान गणना करें ✦",
    currencyLabel: "मुद्रा चुनें (Select Currency)",
    deliveryTimeLabel: "प्राप्ति समय (Delivery Time)",
    checkoutWhatsAppLabel: "आपका व्हाट्सएप / मोबाइल नंबर",
    checkoutWhatsAppHelp: "PDF रिपोर्ट व पुष्टि इस नंबर पर भेजी जाएगी।",
    checkoutUtrLabel: "12-अंकों का UPI UTR / Ref No.",
    checkoutUtrHelp: "GPay / PhonePe / Paytm रसीद में 'UPI Ref No' या 'UTR' देखें।",
    cardNumberLabel: "कार्ड नंबर (Card Number)",
    cardExpiryLabel: "समाप्ति तिथि (MM/YY)",
    cardCvvLabel: "सुरक्षा कोड (CVV)",
    quickDailyPrompt: "या आज का दैनिक राशिफल व व्हाट्सएप अलर्ट्स देखें:",
    quickDailyBtn: "दैनिक राशिफल (Daily Horoscope)",
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
      <text x={xc} y={yc - 6} textAnchor="middle" fill="#F3D37A" fontSize="11" letterSpacing="1.5" fontWeight="700" opacity="0.9">LAGNA</text>
      <text x={xc} y={yc + 14} textAnchor="middle" fill="#F3D37A" fontSize="20" fontFamily="serif">ॐ</text>

      {houseLayout.map(({ n, cx, cy, isLagna }) => {
        const houseData = houses?.[n] || {};
        const signNum = getSignNum(houseData.sign);
        const planetsInHouse = houseData.planets || [];

        return (
          <g key={n} style={{ pointerEvents: "none" }}>
            {isLagna && (
              <g>
                <rect x={cx - 26} y={cy - 38} width="52" height="17" rx="4" fill="rgba(245,158,11,0.28)" stroke="#F59E0B" strokeWidth="1" />
                <text x={cx} y={cy - 26} textAnchor="middle" fill="#FDE68A" fontSize="12" fontWeight="800" letterSpacing="0.8">
                  {lang === "hi" ? "लग्न १" : "LAGNA 1"}
                </text>
              </g>
            )}

            <text x={cx} y={isLagna ? cy - 6 : cy - 12} textAnchor="middle" fill="#F3D37A" fontSize="15" fontWeight="800" fontFamily="'Outfit', sans-serif">
              {signNum}
            </text>

            {planetsInHouse.map((pName, idx) => {
              const pObj = PLANETS.find(x => x.name === pName) || { symbol: pName.slice(0, 2), color: "#D4AF37" };
              const yOffset = (isLagna ? cy + 14 : cy + 6) + idx * 15;
              return (
                <text key={idx} x={cx} y={yOffset} textAnchor="middle" fill={pObj.color} fontSize="14" fontWeight="800">
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

const CURRENCIES = {
  INR: { code: "INR", symbol: "₹", name: "INR (₹)", flag: "🇮🇳", baseRate: 1 },
  USD: { code: "USD", symbol: "$", name: "USD ($)", flag: "🇺🇸", baseRate: 0.012 },
  EUR: { code: "EUR", symbol: "€", name: "EUR (€)", flag: "🇪🇺", baseRate: 0.011 },
  GBP: { code: "GBP", symbol: "£", name: "GBP (£)", flag: "🇬🇧", baseRate: 0.0095 },
  CAD: { code: "CAD", symbol: "CA$", name: "CAD (CA$)", flag: "🇨🇦", baseRate: 0.016 },
  AUD: { code: "AUD", symbol: "AU$", name: "AUD (AU$)", flag: "🇦🇺", baseRate: 0.018 },
  AED: { code: "AED", symbol: "AED ", name: "AED (د.إ)", flag: "🇦🇪", baseRate: 0.044 },
};

const PRODUCT_PRICES = {
  dakshina: { INR: "₹108", USD: "$1.99", EUR: "€1.99", GBP: "£1.49", CAD: "CA$2.49", AUD: "AU$2.99", AED: "AED 9" },
  deluxeReport: { INR: "₹199", USD: "$2.99", EUR: "€2.99", GBP: "£2.49", CAD: "CA$3.99", AUD: "AU$4.49", AED: "AED 14" },
  annualReport: { INR: "₹149", USD: "$1.99", EUR: "€1.99", GBP: "£1.79", CAD: "CA$2.99", AUD: "AU$3.49", AED: "AED 10" },
  matchmakingReport: { INR: "₹149", USD: "$1.99", EUR: "€1.99", GBP: "£1.79", CAD: "CA$2.99", AUD: "AU$3.49", AED: "AED 10" },
  marriageTimingReport: { INR: "₹149", USD: "$1.99", EUR: "€1.99", GBP: "£1.79", CAD: "CA$2.99", AUD: "AU$3.49", AED: "AED 10" },
  careerReport: { INR: "₹149", USD: "$1.99", EUR: "€1.99", GBP: "£1.79", CAD: "CA$2.99", AUD: "AU$3.49", AED: "AED 10" },
  remediesReport: { INR: "₹149", USD: "$1.99", EUR: "€1.99", GBP: "£1.79", CAD: "CA$2.99", AUD: "AU$3.49", AED: "AED 10" },
  dailyMonthly: { INR: "₹49", USD: "$0.99", EUR: "€0.99", GBP: "£0.79", CAD: "CA$1.29", AUD: "AU$1.49", AED: "AED 4" },
  dailyYearly: { INR: "₹299", USD: "$4.99", EUR: "€4.99", GBP: "£3.99", CAD: "CA$6.99", AUD: "AU$7.99", AED: "AED 22" },
};

const detectDefaultCurrency = () => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const navLang = navigator.language || "";
    if (tz.includes("Calcutta") || tz.includes("Kolkata") || navLang.includes("en-IN") || navLang.includes("hi")) {
      return "INR";
    }
    if (tz.includes("Europe/London") || navLang.includes("en-GB")) return "GBP";
    if (tz.includes("Europe/")) return "EUR";
    if (tz.includes("Canada") || tz.includes("Toronto") || tz.includes("Vancouver")) return "CAD";
    if (tz.includes("Australia") || tz.includes("Sydney") || tz.includes("Melbourne")) return "AUD";
    if (tz.includes("Dubai")) return "AED";
    return "USD";
  } catch (e) {
    return "INR";
  }
};

// ── MONETIZATION CHECKOUT MODAL ──────────────────────────────────
const CheckoutModal = ({ item, onClose, onPaid, lang, currency, setCurrency }) => {
  const [method, setMethod] = useState(currency === "INR" ? "upi" : "card");
  const [checkoutStep, setCheckoutStep] = useState("pay"); // "pay" | "verify" | "success"
  const [utr, setUtr] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [verifyErr, setVerifyErr] = useState("");
  const [orderId, setOrderId] = useState("");
  const hi = lang === "hi";

  // Dynamic price formatted for the current currency
  const displayPrice = item.priceKey && PRODUCT_PRICES[item.priceKey]
    ? PRODUCT_PRICES[item.priceKey][currency] || PRODUCT_PRICES[item.priceKey].USD
    : item.price;

  // Inr numerical value for UPI URL
  const inrPriceVal = item.priceKey && PRODUCT_PRICES[item.priceKey]
    ? (PRODUCT_PRICES[item.priceKey].INR.match(/₹([0-9,]+)/)?.[1] || "199").replace(/,/g, "")
    : (item.price.match(/₹([0-9,]+)/)?.[1] || "199").replace(/,/g, "");

  // Dynamic NPCI-compliant UPI Intent URL with pre-filled locked amount and note
  const upiIntentUrl = `upi://pay?pa=8094199663@upi&pn=ABHISHEK%20KUMAR%20SINGH&am=${inrPriceVal}.00&cu=INR&tn=${encodeURIComponent(item.title)}`;
  const dynamicQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiIntentUrl)}&margin=10`;

  const handleProceedToVerify = () => {
    setCheckoutStep("verify");
    setVerifyErr("");
  };

  const handleConfirmPayment = () => {
    const cleanPhone = whatsapp.trim().replace(/\D/g, "");

    if (cleanPhone.length < 10) {
      setVerifyErr(hi ? "कृपया मान्य व्हाट्सएप नंबर दर्ज करें।" : "Please enter a valid WhatsApp / Mobile number.");
      return;
    }

    if (currency === "INR" && method === "upi" && utr.trim().length < 6) {
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
      `💰 *Amount:* ${displayPrice}\n` +
      `🧾 *Order ID:* ${orderId || "Pending"}\n` +
      `${currency === "INR" && utr ? `🔢 *UPI UTR / Ref No:* ${utr}\n` : ""}` +
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
                <span style={{ color: "#34D399", fontWeight: 700 }}>{displayPrice}</span>
              </div>
              {currency === "INR" && utr && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ color: "rgba(241,231,208,0.6)" }}>UPI UTR:</span>
                  <span style={{ color: "#FDE68A", fontWeight: 600 }}>{utr}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(241,231,208,0.6)" }}>WhatsApp:</span>
                <span style={{ color: "#FFF" }}>{whatsapp}</span>
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
                {item.title} — <b style={{ color: "#FDE68A" }}>{displayPrice}</b>
              </p>
            </div>

            <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 12, padding: "18px 16px", marginBottom: 16 }}>
              {/* WhatsApp Number Field */}
              <div style={{ marginBottom: currency === "INR" && method === "upi" ? 14 : 0 }}>
                <label htmlFor="checkout-whatsapp-input" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700, color: "#FDE68A", marginBottom: 8 }}>
                  <span>📱</span> {hi ? "आपका व्हाट्सएप / मोबाइल नंबर *" : "Your WhatsApp / Mobile Number *"}
                </label>
                <div style={{ display: "flex", gap: 6 }}>
                  <div style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8, padding: "11px 14px", color: "rgba(241,231,208,0.9)", fontSize: 14, fontWeight: 600 }}>
                    {CURRENCIES[currency]?.flag || "🌐"}
                  </div>
                  <input
                    id="checkout-whatsapp-input"
                    name="whatsapp"
                    type="tel"
                    required
                    aria-required="true"
                    aria-label={hi ? "व्हाट्सएप या मोबाइल नंबर" : "WhatsApp or Mobile Number"}
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    placeholder="e.g. +91 9876543210"
                    style={{ width: "100%", background: "rgba(0,0,0,0.6)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8, padding: "11px 14px", color: "#FFF", fontSize: 14.5 }}
                  />
                </div>
                <div style={{ fontSize: 12, color: "rgba(241,231,208,0.7)", marginTop: 5 }}>
                  {hi ? "PDF रिपोर्ट व पुष्टि इस नंबर पर भेजी जाएगी।" : "PDF report & confirmation will be sent here."}
                </div>
              </div>

              {/* 12-Digit UTR Field (Shown for Indian UPI payments) */}
              {currency === "INR" && method === "upi" && (
                <div>
                  <label htmlFor="checkout-utr-input" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700, color: "#FDE68A", marginBottom: 8 }}>
                    <span>🔢</span> {hi ? "12-अंकों का UPI UTR / Ref No. *" : "12-Digit UPI Ref / UTR No. *"}
                  </label>
                  <input
                    id="checkout-utr-input"
                    name="utr"
                    type="text"
                    required
                    aria-required="true"
                    aria-label={hi ? "12-अंकों का UPI UTR अथवा रेफरेंस नंबर" : "12-digit UPI UTR or Reference Number"}
                    maxLength={16}
                    value={utr}
                    onChange={e => setUtr(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
                    placeholder="e.g. 423819283746"
                    style={{ width: "100%", background: "rgba(0,0,0,0.6)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8, padding: "11px 14px", color: "#FFF", fontSize: 14.5, letterSpacing: 1 }}
                  />
                  <div style={{ fontSize: 12, color: "rgba(243,211,122,0.8)", marginTop: 5 }}>
                    💡 {hi ? "GPay / PhonePe / Paytm रसीद में 'UPI Ref No' या 'UTR' देखें।" : "Found as 'UPI Ref No' or 'UTR' on your GPay/PhonePe receipt."}
                  </div>
                </div>
              )}
            </div>

            {verifyErr && (
              <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", borderRadius: 8, padding: "10px 14px", color: "#FCA5A5", fontSize: 12.5, marginBottom: 14 }}>
                ⚠️ {verifyErr}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8 }}>
              <button
                onClick={() => setCheckoutStep("pay")}
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, color: "rgba(241,231,208,0.9)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                ← {hi ? "पीछे (Back)" : "Back"}
              </button>
              <button onClick={handleConfirmPayment} className="gold-cta-btn" style={{ padding: "13px 16px", fontSize: 14 }}>
                {hi ? "सत्यापित करें एवं अनलॉक करें ✦" : `Confirm & Unlock (${displayPrice}) ✦`}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 1: PAYMENT ── */}
        {checkoutStep === "pay" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <span style={{ fontSize: 34 }}>{item.icon || "💎"}</span>
              <h3 style={{ color: "#F3D37A", fontSize: 18, fontWeight: 700, marginTop: 4 }}>{item.title}</h3>
              <div style={{ color: "#FDE68A", fontSize: 28, fontWeight: 800, marginTop: 4 }}>{displayPrice}</div>
              <p style={{ color: "rgba(241,231,208,0.75)", fontSize: 13, marginTop: 4 }}>{item.desc}</p>
            </div>

            {/* Payment Mode Selector */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {[
                { id: "upi", name: currency === "INR" ? (hi ? "UPI / क्यूआर कोड" : "UPI / QR Code") : "UPI (INR Only)", icon: "📱" },
                { id: "card", name: hi ? "कार्ड्स / नेटबैंकिंग" : "Cards / NetBanking", icon: "💳" },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => {
                    if (m.id === "upi" && currency !== "INR" && setCurrency) {
                      setCurrency("INR");
                    }
                    setMethod(m.id);
                  }}
                  style={{
                    background: method === m.id ? "rgba(245,158,11,0.2)" : "rgba(11,8,25,0.6)",
                    border: `1px solid ${method === m.id ? "#F59E0B" : "rgba(212,175,55,0.2)"}`,
                    color: method === m.id ? "#FDE68A" : "#FFF",
                    borderRadius: 10,
                    padding: "11px 10px",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  <div>{m.icon}</div>
                  <div>{m.name}</div>
                </button>
              ))}
            </div>

            {method === "upi" ? (
              <div style={{ background: "rgba(11,8,25,0.8)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 12, padding: "18px 16px", textAlign: "center", marginBottom: 16 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 12, padding: "4px 12px", color: "#34D399", fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
                  <span>🔒</span> {hi ? `निर्धारित राशि: ₹${inrPriceVal}.00` : `Amount Locked: ₹${inrPriceVal}.00`}
                </div>

                {/* Amount-Enforced High-Contrast QR Code */}
                <div style={{ width: 195, height: 195, background: "#FFF", borderRadius: 12, margin: "0 auto", padding: 8, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #F59E0B", boxShadow: "0 6px 20px rgba(0,0,0,0.6)" }}>
                  <img
                    src={dynamicQrCodeUrl}
                    alt="Amount-Locked Dynamic UPI QR"
                    style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 4 }}
                  />
                </div>

                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#F3D37A" }}>{hi ? "प्राप्तकर्ता:" : "Payee:"} ABHISHEK KUMAR SINGH</div>
                  <div style={{ fontSize: 12.5, color: "rgba(241,231,208,0.85)", marginTop: 2 }}>UPI ID: <code style={{ color: "#FDE68A", fontWeight: 700 }}>8094199663@upi</code></div>
                </div>

                {/* Direct 1-Tap Mobile UPI Intent Link */}
                <a
                  href={upiIntentUrl}
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 14,
                    background: "rgba(245,158,11,0.15)",
                    border: "1px solid rgba(245,158,11,0.4)",
                    color: "#FDE68A",
                    padding: "11px 14px",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    textDecoration: "none"
                  }}
                >
                  🚀 {hi ? `GPay / PhonePe / Paytm से ₹${inrPriceVal} का भुगतान करें` : `Tap to Open GPay / PhonePe / Paytm (₹${inrPriceVal})`}
                </a>
              </div>
            ) : (
              <div style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: "rgba(243,211,122,0.9)", marginBottom: 10, fontWeight: 600 }}>
                  {hi ? `क्रेडिट / डेबिट कार्ड से भुगतान करें (${displayPrice})` : `Pay with Credit / Debit Card (${displayPrice})`}
                </div>
                <div style={{ marginBottom: 10 }}>
                  <label htmlFor="checkout-card-num" style={{ display: "block", fontSize: 12, color: "rgba(243,211,122,0.85)", marginBottom: 4, fontWeight: 600 }}>
                    {hi ? "कार्ड नंबर" : "Card Number"}
                  </label>
                  <input
                    id="checkout-card-num"
                    name="cardNumber"
                    aria-label={hi ? "कार्ड नंबर" : "Card Number"}
                    placeholder="0000 0000 0000 0000"
                    style={{ width: "100%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 6, padding: "10px 12px", color: "#FFF", fontSize: 13.5 }}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label htmlFor="checkout-card-exp" style={{ display: "block", fontSize: 12, color: "rgba(243,211,122,0.85)", marginBottom: 4, fontWeight: 600 }}>
                      {hi ? "समाप्ति (MM/YY)" : "Expiry (MM/YY)"}
                    </label>
                    <input
                      id="checkout-card-exp"
                      name="cardExpiry"
                      aria-label={hi ? "समाप्ति तिथि" : "Card Expiry"}
                      placeholder="MM/YY"
                      style={{ width: "100%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 6, padding: "10px 12px", color: "#FFF", fontSize: 13.5 }}
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-card-cvv" style={{ display: "block", fontSize: 12, color: "rgba(243,211,122,0.85)", marginBottom: 4, fontWeight: 600 }}>
                      {hi ? "सुरक्षा कोड (CVV)" : "Security Code (CVV)"}
                    </label>
                    <input
                      id="checkout-card-cvv"
                      name="cardCvv"
                      aria-label={hi ? "सुरक्षा कोड CVV" : "Card Security Code CVV"}
                      placeholder="CVV"
                      type="password"
                      maxLength={4}
                      style={{ width: "100%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 6, padding: "10px 12px", color: "#FFF", fontSize: 13.5 }}
                    />
                  </div>
                </div>
              </div>
            )}

            <button onClick={handleProceedToVerify} className="gold-cta-btn" style={{ padding: "14px 20px", fontSize: 15 }}>
              {hi ? `मैंने भुगतान कर दिया है (${displayPrice}) →` : `I Have Made the Payment (${displayPrice}) →`}
            </button>
            <div style={{ textAlign: "center", fontSize: 12, color: "rgba(243,211,122,0.6)", marginTop: 10 }}>
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
  const [currency, setCurrency] = useState(detectDefaultCurrency);
  const [lastCoords, setLastCoords] = useState({ lat: 26.8467, lon: 80.9462 });

  // Matchmaking State
  const [partnerForm, setPartnerForm] = useState({ name: "", dob: "", pob: "", tob: "" });
  const [milanResult, setMilanResult] = useState(null);

  // Daily Horoscope State
  const [dailySign, setDailySign] = useState("Aries");
  const [dailyChannel, setDailyChannel] = useState("whatsapp");
  const [dailyPlan, setDailyPlan] = useState("yearly");
  const [dailyTime, setDailyTime] = useState("07:00 AM");
  const [isDailySubscribed, setIsDailySubscribed] = useState(() => {
    try {
      return !!localStorage.getItem("jyotish_daily_sub");
    } catch {
      return false;
    }
  });

  // Monetization Modal State
  const [activeCheckout, setActiveCheckout] = useState(null);
  const [unlockedProReport, setUnlockedProReport] = useState(false);
  const [unlockedMarriageReport, setUnlockedMarriageReport] = useState(() => {
    try {
      return !!localStorage.getItem("jyotish_unlocked_marriage");
    } catch {
      return false;
    }
  });
  const [unlockedCareerReport, setUnlockedCareerReport] = useState(() => {
    try {
      return !!localStorage.getItem("jyotish_unlocked_career");
    } catch {
      return false;
    }
  });
  const [unlockedRemediesReport, setUnlockedRemediesReport] = useState(() => {
    try {
      return !!localStorage.getItem("jyotish_unlocked_remedies");
    } catch {
      return false;
    }
  });
  const [activeProblemId, setActiveProblemId] = useState("career_job");

  // Admin VIP Bypass State (Dedicated for Owner Abhishek)
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const adminParam = urlParams.get("admin") || urlParams.get("vip");
      if (adminParam && ["2709", "abhishek", "true", "owner"].includes(adminParam.toLowerCase())) {
        localStorage.setItem("jyotish_admin_mode", "true");
        return true;
      }
      return localStorage.getItem("jyotish_admin_mode") === "true";
    } catch {
      return false;
    }
  });

  const [showAdminPinModal, setShowAdminPinModal] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState("");
  const [adminPinErr, setAdminPinErr] = useState("");
  const [logoClickCount, setLogoClickCount] = useState(0);

  const effectiveMarriageUnlocked = isAdmin || unlockedMarriageReport;
  const effectiveCareerUnlocked = isAdmin || unlockedCareerReport;
  const effectiveRemediesUnlocked = isAdmin || unlockedRemediesReport;
  const effectiveDailySubscribed = isAdmin || isDailySubscribed;
  const effectiveProUnlocked = isAdmin || unlockedProReport;

  const [activePrintReport, setActivePrintReport] = useState("all");

  const handlePrintReport = (reportType = "all") => {
    setActivePrintReport(reportType);
    setTimeout(() => {
      window.print();
    }, 120);
  };

  const handleSecretTrigger = () => {
    setLogoClickCount(prev => {
      const next = prev + 1;
      if (next >= 3) {
        setShowAdminPinModal(true);
        setAdminPinErr("");
        return 0;
      }
      setTimeout(() => setLogoClickCount(0), 2500);
      return next;
    });
  };

  const handleVerifyAdminPin = () => {
    const clean = adminPinInput.trim().toLowerCase();
    if (clean === "2709" || clean === "abhishek" || clean === "admin") {
      try {
        localStorage.setItem("jyotish_admin_mode", "true");
      } catch (e) {}
      setIsAdmin(true);
      setShowAdminPinModal(false);
      setAdminPinInput("");
      setAdminPinErr("");
    } else {
      setAdminPinErr(hi ? "अमान्य एडमिन पिन! कृपया सही पासकी दर्ज करें।" : "Invalid Admin PIN! Please enter the correct passkey.");
    }
  };

  const handleToggleAdminMode = () => {
    const nextState = !isAdmin;
    setIsAdmin(nextState);
    try {
      if (nextState) {
        localStorage.setItem("jyotish_admin_mode", "true");
      } else {
        localStorage.removeItem("jyotish_admin_mode");
      }
    } catch (e) {}
  };

  const resultRef = useRef(null);
  const t = UI[lang];
  const hi = lang === "hi";

  // Standalone Feature State (Direct Access without Birth Details)
  const [mainSection, setMainSection] = useState("kundli"); // "kundli", "panchang", "muhurat", "festivals", "daily"
  const [panchangDate, setPanchangDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [panchangCity, setPanchangCity] = useState(MAJOR_INDIAN_CITIES[0]);
  const [choghadiyaPeriod, setChoghadiyaPeriod] = useState("day");
  const [muhuratCategory, setMuhuratCategory] = useState("all");
  const [festivalFilter, setFestivalFilter] = useState("all");
  const [festivalSearch, setFestivalSearch] = useState("");

  const panchangData = calculateDailyPanchang({
    dateStr: panchangDate,
    lat: panchangCity.lat,
    lon: panchangCity.lon,
    cityName: hi ? panchangCity.nameHi : panchangCity.name,
    lang
  });

  const filteredMuhurats = getUpcomingShubhMuhurats({
    category: muhuratCategory,
    lang
  });

  const filteredFestivals = getUpcomingFestivalsAndVrats({
    filter: festivalFilter,
    lang
  }).filter(f => {
    if (!festivalSearch.trim()) return true;
    const q = festivalSearch.toLowerCase();
    return f.nameEn.toLowerCase().includes(q) || f.nameHi.includes(q) || f.month.toLowerCase().includes(q);
  });

  // Sync daily horoscope sign when Kundli result loads
  useEffect(() => {
    if (result?.rashiSign) {
      setDailySign(result.rashiSign);
    }
  }, [result]);

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
      alert(t.errPartnerFields || (hi ? "कृपया जीवनसाथी का नाम और जन्म तिथि दर्ज करें।" : "Please enter partner name and date of birth."));
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
    if (err) {
      setErr(UI[newLang].errFields);
    }
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
    if (milanResult && partnerForm.name && partnerForm.dob) {
      try {
        const updatedMilan = calculateGunMilan({
          partner1: { name: form.name || "Primary Native", dob: form.dob, tob: form.tob },
          partner2: partnerForm
        });
        setMilanResult(updatedMilan);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // ── RENDER HELPER: HINDU PANCHANG ────────────────────────────────
  const renderPanchangContent = () => (
    <div className="glass-card" style={{ padding: "28px 26px", marginBottom: 26, animation: "fadeInCard 0.4s ease" }}>
      {/* Panchang Header Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, borderBottom: "1px solid rgba(212,175,55,0.25)", paddingBottom: 18, marginBottom: 20 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#F59E0B", fontSize: 12.5, fontWeight: 800, letterSpacing: 1 }}>
            <span>🕉️</span> {hi ? "वैदिक पंचांग गणना" : "DAILY SIDEREAL PANCHANG"}
          </div>
          <h3 style={{ color: "#F3D37A", fontSize: 22, fontWeight: 800, marginTop: 2 }}>
            {panchangData.displayDate}
          </h3>
          <div style={{ fontSize: 13, color: "rgba(243,211,122,0.85)", marginTop: 2 }}>
            {hi ? `विक्रम संवत ${panchangData.vikramSamvat} · शक संवत ${panchangData.shakaSamvat} · ${panchangData.masa} मास · ${panchangData.ritu}` : `Vikram Samvat ${panchangData.vikramSamvat} · Shaka ${panchangData.shakaSamvat} · ${panchangData.masa} Masa · ${panchangData.ritu}`}
          </div>
        </div>

        {/* Date & Location Switchers */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {/* Quick Date Switcher */}
          <div style={{ display: "flex", gap: 6, background: "rgba(0,0,0,0.4)", padding: "4px", borderRadius: 20, border: "1px solid rgba(212,175,55,0.2)" }}>
            <button
              onClick={() => {
                const d = new Date(panchangDate);
                d.setDate(d.getDate() - 1);
                setPanchangDate(d.toISOString().split("T")[0]);
              }}
              style={{ background: "transparent", border: "none", color: "#FDE68A", padding: "4px 10px", borderRadius: 14, fontSize: 12, cursor: "pointer" }}
              title="Yesterday"
            >
              ◀ {hi ? "कल" : "Prev"}
            </button>
            <button
              onClick={() => setPanchangDate(new Date().toISOString().split("T")[0])}
              style={{ background: "rgba(245,158,11,0.25)", border: "1px solid rgba(245,158,11,0.4)", color: "#FFF", padding: "4px 12px", borderRadius: 14, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
            >
              {hi ? "आज" : "Today"}
            </button>
            <button
              onClick={() => {
                const d = new Date(panchangDate);
                d.setDate(d.getDate() + 1);
                setPanchangDate(d.toISOString().split("T")[0]);
              }}
              style={{ background: "transparent", border: "none", color: "#FDE68A", padding: "4px 10px", borderRadius: 14, fontSize: 12, cursor: "pointer" }}
              title="Tomorrow"
            >
              {hi ? "कल" : "Next"} ▶
            </button>
          </div>

          {/* Date Picker */}
          <input
            type="date"
            aria-label="Panchang Date"
            value={panchangDate}
            onChange={e => setPanchangDate(e.target.value)}
            style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 10, padding: "7px 12px", color: "#FFF", fontSize: 13, colorScheme: "dark" }}
          />

          {/* City Selector */}
          <select
            aria-label="Panchang City"
            value={panchangCity.name}
            onChange={e => {
              const c = MAJOR_INDIAN_CITIES.find(city => city.name === e.target.value);
              if (c) setPanchangCity(c);
            }}
            style={{ background: "rgba(26,18,48,0.9)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 10, padding: "8px 12px", color: "#FDE68A", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            {MAJOR_INDIAN_CITIES.map(c => (
              <option key={c.name} value={c.name} style={{ background: "#0F0A1E", color: "#FFF" }}>
                📍 {hi ? c.nameHi : c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Core 4-Box Metric Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
        <div style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 12, color: "rgba(243,211,122,0.85)", fontWeight: 700 }}>🌙 {hi ? "तिथि एवं पक्ष" : "Tithi & Paksha"}</div>
          <div style={{ fontSize: 16.5, color: "#FDE68A", fontWeight: 800, marginTop: 4 }}>{panchangData.tithi}</div>
          <div style={{ fontSize: 12, color: "#34D399", fontWeight: 600, marginTop: 2 }}>{panchangData.paksha}</div>
        </div>

        <div style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 12, color: "rgba(243,211,122,0.85)", fontWeight: 700 }}>🌟 {hi ? "नक्षत्र एवं पद" : "Nakshatra & Pada"}</div>
          <div style={{ fontSize: 16.5, color: "#FDE68A", fontWeight: 800, marginTop: 4 }}>{panchangData.nakshatra}</div>
          <div style={{ fontSize: 12, color: "rgba(241,231,208,0.8)", marginTop: 2 }}>
            {hi ? `पद ${panchangData.pada} · स्वामी: ${panchangData.nakshatraLord}` : `Pada ${panchangData.pada} · Lord: ${panchangData.nakshatraLord}`}
          </div>
        </div>

        <div style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 12, color: "rgba(243,211,122,0.85)", fontWeight: 700 }}>⚡ {hi ? "योग एवं करण" : "Yoga & Karana"}</div>
          <div style={{ fontSize: 16.5, color: "#FDE68A", fontWeight: 800, marginTop: 4 }}>{panchangData.yoga} {hi ? "योग" : "Yoga"}</div>
          <div style={{ fontSize: 12, color: "rgba(241,231,208,0.8)", marginTop: 2 }}>
            {hi ? `${panchangData.karana} करण (स्वामी: ${panchangData.karanaRuler})` : `${panchangData.karana} Karana (${panchangData.karanaRuler})`}
          </div>
        </div>

        <div style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 12, color: "rgba(243,211,122,0.85)", fontWeight: 700 }}>☀️ {hi ? "वार एवं राशि स्थिति" : "Weekday & Moon/Sun"}</div>
          <div style={{ fontSize: 16.5, color: "#FDE68A", fontWeight: 800, marginTop: 4 }}>{panchangData.vaar}</div>
          <div style={{ fontSize: 12, color: "rgba(241,231,208,0.8)", marginTop: 2 }}>
            {hi ? `सूर्य: ${panchangData.sunSign} · चंद्र: ${panchangData.moonSign}` : `Sun: ${panchangData.sunSign} · Moon: ${panchangData.moonSign}`}
          </div>
        </div>
      </div>

      {/* 2 Columns: Auspicious Timings vs Inauspicious & Disha Shool */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18, marginBottom: 24 }}>
        {/* Auspicious Timings Card */}
        <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 14, padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, borderBottom: "1px solid rgba(16,185,129,0.2)", paddingBottom: 8 }}>
            <h4 style={{ color: "#34D399", fontSize: 15, fontWeight: 800, margin: 0 }}>
              ✨ {hi ? "शुभ काल एवं सूर्य-चंद्र चक्र" : "Auspicious Timings & Solar Cycle"}
            </h4>
            <span style={{ fontSize: 12, color: "rgba(241,231,208,0.8)" }}>📍 {panchangData.cityName}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14, background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: "10px 12px" }}>
            <div>
              <div style={{ fontSize: 11.5, color: "#FDE68A" }}>🌅 {hi ? "सूर्योदय" : "Sunrise"}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#FFF" }}>{panchangData.sunrise}</div>
            </div>
            <div>
              <div style={{ fontSize: 11.5, color: "#FDE68A" }}>🌇 {hi ? "सूर्यास्त" : "Sunset"}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#FFF" }}>{panchangData.sunset}</div>
            </div>
            <div>
              <div style={{ fontSize: 11.5, color: "#FDE68A" }}>🌙 {hi ? "चंद्रोदय" : "Moonrise"}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#FFF" }}>{panchangData.moonrise}</div>
            </div>
            <div>
              <div style={{ fontSize: 11.5, color: "#FDE68A" }}>🌚 {hi ? "चंद्रास्त" : "Moonset"}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#FFF" }}>{panchangData.moonset}</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", background: "rgba(16,185,129,0.1)", borderRadius: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#FDE68A" }}>🌟 {hi ? "अभिजीत मुहूर्त (सर्वश्रेष्ठ)" : "Abhijit Muhurat"}</span>
              <span style={{ fontSize: 13.5, fontWeight: 800, color: "#34D399" }}>{panchangData.muhurats.abhijit}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 6 }}>
              <span style={{ fontSize: 13, color: "rgba(241,231,208,0.9)" }}>🪷 {hi ? "ब्रह्म मुहूर्त (साधना)" : "Brahma Muhurat"}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#FDE68A" }}>{panchangData.muhurats.brahma}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 6 }}>
              <span style={{ fontSize: 13, color: "rgba(241,231,208,0.9)" }}>✨ {hi ? "अमृत काल" : "Amrit Kaal"}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#FDE68A" }}>{panchangData.muhurats.amritKaal}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 6 }}>
              <span style={{ fontSize: 13, color: "rgba(241,231,208,0.9)" }}>🏆 {hi ? "विजय मुहूर्त" : "Vijay Muhurat"}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#FDE68A" }}>{panchangData.muhurats.vijay}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 6 }}>
              <span style={{ fontSize: 13, color: "rgba(241,231,208,0.9)" }}>🌅 {hi ? "गोधूलि मुहूर्त" : "Godhuli Muhurat"}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#FDE68A" }}>{panchangData.muhurats.godhuli}</span>
            </div>
          </div>
        </div>

        {/* Inauspicious & Disha Shool Card */}
        <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 14, padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, borderBottom: "1px solid rgba(239,68,68,0.2)", paddingBottom: 8 }}>
            <h4 style={{ color: "#F87171", fontSize: 15, fontWeight: 800, margin: 0 }}>
              ⚠️ {hi ? "अशुभ काल व दिशाशूल (त्याज्य समय)" : "Inauspicious Timings & Disha Shool"}
            </h4>
            <span style={{ fontSize: 12, color: "#FCA5A5" }}>{hi ? "नए कार्य न करें" : "Avoid Key Launches"}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8 }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: "#FCA5A5" }}>⚠️ {hi ? "राहु काल (अति त्याज्य)" : "Rahu Kaal"}</div>
                <div style={{ fontSize: 11.5, color: "rgba(241,231,208,0.75)" }}>{hi ? "शुभ कार्य व यात्रा पूर्णतः वर्जित" : "Avoid any new auspicious beginnings"}</div>
              </div>
              <span style={{ fontSize: 14.5, fontWeight: 800, color: "#EF4444", alignSelf: "center" }}>{panchangData.inauspicious.rahuKaal}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 6 }}>
              <span style={{ fontSize: 13, color: "rgba(241,231,208,0.9)" }}>⛔ {hi ? "यमगण्ड काल" : "Yamaganda"}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#F87171" }}>{panchangData.inauspicious.yamaganda}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 6 }}>
              <span style={{ fontSize: 13, color: "rgba(241,231,208,0.9)" }}>🛑 {hi ? "गुलिक काल" : "Gulika Kaal"}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#F87171" }}>{panchangData.inauspicious.gulika}</span>
            </div>
          </div>

          {/* Disha Shool Banner */}
          <div style={{ background: "rgba(245,158,11,0.08)", border: "1px dashed rgba(245,158,11,0.35)", borderRadius: 8, padding: "12px 14px" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#FDE68A", marginBottom: 4 }}>
              🧭 {hi ? `आज का दिशाशूल: ${panchangData.dishashool}` : `Today's Disha Shool: ${panchangData.dishashool}`}
            </div>
            <div style={{ fontSize: 12.5, color: "rgba(241,231,208,0.85)", lineHeight: 1.5 }}>
              <b>{hi ? "निवारण उपाय:" : "Remedy:"}</b> {panchangData.dishashoolRemedy}
            </div>
          </div>
        </div>
      </div>

      {/* Full Daily Choghadiya Table */}
      <div style={{ background: "rgba(11,8,25,0.8)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 14, padding: "20px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 12, marginBottom: 16 }}>
          <div>
            <h4 style={{ color: "#F3D37A", fontSize: 16, fontWeight: 800, margin: 0 }}>
              ⏱️ {hi ? "दैनिक चौघड़िया चक्र (Choghadiya Muhurat)" : "Daily Choghadiya Planetary Clock"}
            </h4>
            <p style={{ fontSize: 12, color: "rgba(243,211,122,0.8)", margin: "2px 0 0" }}>
              {hi ? "यात्रा, क्रय-विक्रय व व्यावसायिक कार्यों हेतु समय का सटीक विभाजन" : "Classical 8-part astrological timing divisions"}
            </p>
          </div>

          <div style={{ display: "flex", background: "rgba(0,0,0,0.5)", borderRadius: 20, padding: 3, border: "1px solid rgba(212,175,55,0.25)" }}>
            <button
              onClick={() => setChoghadiyaPeriod("day")}
              style={{ background: choghadiyaPeriod === "day" ? "linear-gradient(135deg, #F59E0B, #D97706)" : "transparent", border: "none", color: choghadiyaPeriod === "day" ? "#0F0A1E" : "#FDE68A", padding: "6px 16px", borderRadius: 16, fontSize: 12.5, fontWeight: 800, cursor: "pointer" }}
            >
              ☀️ {hi ? "दिन का चौघड़िया" : "Day Choghadiya"}
            </button>
            <button
              onClick={() => setChoghadiyaPeriod("night")}
              style={{ background: choghadiyaPeriod === "night" ? "linear-gradient(135deg, #A78BFA, #6366F1)" : "transparent", border: "none", color: choghadiyaPeriod === "night" ? "#0F0A1E" : "#FDE68A", padding: "6px 16px", borderRadius: 16, fontSize: 12.5, fontWeight: 800, cursor: "pointer" }}
            >
              🌙 {hi ? "रात का चौघड़िया" : "Night Choghadiya"}
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10 }}>
          {(choghadiyaPeriod === "day" ? panchangData.dayChoghadiya : panchangData.nightChoghadiya).map((slot, i) => (
            <div key={i} style={{ background: "rgba(0,0,0,0.35)", border: `1px solid ${slot.color}35`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: slot.color }}>{slot.name}</span>
                <span style={{ fontSize: 11, background: `${slot.color}20`, color: slot.color, padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>
                  {slot.quality}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#FFF", fontWeight: 600 }}>{slot.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── RENDER HELPER: SHUBH MUHURAT DIRECTORY ────────────────────────
  const renderMuhuratContent = () => (
    <div className="glass-card" style={{ padding: "28px 26px", marginBottom: 26, animation: "fadeInCard 0.4s ease" }}>
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#F59E0B", fontSize: 12.5, fontWeight: 800, letterSpacing: 1 }}>
          <span>⏳</span> {hi ? "प्रामाणिक वैदिक मुहूर्त" : "AUTHENTIC AUSPICIOUS TIMINGS"}
        </div>
        <h3 style={{ color: "#F3D37A", fontSize: 22, fontWeight: 800, marginTop: 4 }}>
          {hi ? "आगामी सर्व शुभ मुहूर्त डायरेक्टरी (2026–2027)" : "Upcoming Auspicious Muhurats Directory"}
        </h3>
        <p style={{ color: "rgba(241,231,208,0.8)", fontSize: 13.5, maxWidth: 640, margin: "4px auto 0" }}>
          {hi ? "विवाह, गृह प्रवेश, वाहन क्रय, भूमि रजिस्ट्री, नवीन व्यापार व संस्कारों के शास्त्रीय मुहूर्त" : "Parashari certified timings for Weddings, Housewarmings, Vehicles, Property & Commercial Launches"}
        </p>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 22 }}>
        {SHUBH_MUHURAT_CATEGORIES.map(cat => {
          const isSel = muhuratCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setMuhuratCategory(cat.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: isSel ? "linear-gradient(135deg, #F59E0B, #D97706)" : "rgba(11,8,25,0.7)",
                border: isSel ? "none" : "1px solid rgba(212,175,55,0.25)",
                color: isSel ? "#0F0A1E" : "#FDE68A",
                padding: "7px 14px",
                borderRadius: 20,
                fontSize: 12.5,
                fontWeight: isSel ? 800 : 600,
                cursor: "pointer"
              }}
            >
              <span>{cat.icon}</span>
              <span>{hi ? cat.labelHi : cat.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Muhurats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        {filteredMuhurats.map((m, idx) => (
          <div key={idx} style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, borderBottom: "1px solid rgba(212,175,55,0.18)", paddingBottom: 8 }}>
              <span style={{ fontSize: 12, background: "rgba(245,158,11,0.18)", color: "#FDE68A", padding: "3px 10px", borderRadius: 12, fontWeight: 800 }}>
                {SHUBH_MUHURAT_CATEGORIES.find(c => c.id === m.category)?.[hi ? "labelHi" : "labelEn"] || m.category}
              </span>
              <span style={{ fontSize: 12, color: "#34D399", fontWeight: 700 }}>
                ✨ {hi ? m.yogaHi : m.yogaEn}
              </span>
            </div>

            <h4 style={{ color: "#FFF", fontSize: 17, fontWeight: 800, margin: "0 0 4px" }}>
              {new Date(m.date).toLocaleDateString(hi ? "hi-IN" : "en-US", { day: "numeric", month: "long", year: "numeric" })}, {hi ? m.dayHi : m.dayEn}
            </h4>

            <div style={{ fontSize: 12.5, color: "rgba(243,211,122,0.9)", marginBottom: 8 }}>
              🌙 {hi ? m.tithiHi : m.tithiEn} · 🌟 {hi ? m.nakshatraHi : m.nakshatraEn}
            </div>

            <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 8, padding: "8px 12px", color: "#34D399", fontSize: 13, fontWeight: 800, marginBottom: 10 }}>
              ⏱️ {hi ? m.timeHi : m.timeEn}
            </div>

            <p style={{ fontSize: 12.5, color: "rgba(241,231,208,0.85)", lineHeight: 1.6, margin: 0 }}>
              {hi ? m.noteHi : m.noteEn}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  // ── RENDER HELPER: HINDU FESTIVALS & VRAT CALENDAR ───────────────
  const renderFestivalsContent = () => (
    <div className="glass-card" style={{ padding: "28px 26px", marginBottom: 26, animation: "fadeInCard 0.4s ease" }}>
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#F59E0B", fontSize: 12.5, fontWeight: 800, letterSpacing: 1 }}>
          <span>🪔</span> {hi ? "सनातन धर्म के पावन पर्व" : "HINDU FESTIVALS & FASTING CALENDAR"}
        </div>
        <h3 style={{ color: "#F3D37A", fontSize: 22, fontWeight: 800, marginTop: 4 }}>
          {hi ? "हिंदू व्रत, पर्व एवं त्यौहार कैलेंडर (2026–2027)" : "Hindu Festivals, Fasting & Vrat Calendar"}
        </h3>
        <p style={{ color: "rgba(241,231,208,0.8)", fontSize: 13.5, maxWidth: 640, margin: "4px auto 0" }}>
          {hi ? "एकादशी, प्रदोष, दीपावली, छठ, नवरात्रि, शिवरात्रि, होली व समस्त व्रत तिथियां व पूजा मुहूर्त" : "Comprehensive Hindu calendar for Major Festivals, Ekadashis, Pradosh, Purnima & Sacred Fasts"}
        </p>
      </div>

      {/* Search & Filter Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        {/* Category Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            { id: "all", label: hi ? "समस्त पर्व (All)" : "All Festivals" },
            { id: "major", label: hi ? "🌟 प्रमुख त्यौहार" : "Major Festivals" },
            { id: "ekadashi", label: hi ? "🌸 एकादशी व्रत" : "Ekadashi Vrats" },
            { id: "purnima_amavasya", label: hi ? "🌕 पूर्णिमा/अमावस्या" : "Purnima & Amavasya" },
            { id: "vrat", label: hi ? "📿 उपवास व अन्य व्रत" : "Fasts & Vrats" },
          ].map(f => {
            const isSel = festivalFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFestivalFilter(f.id)}
                style={{
                  background: isSel ? "linear-gradient(135deg, #F59E0B, #D97706)" : "rgba(11,8,25,0.7)",
                  border: isSel ? "none" : "1px solid rgba(212,175,55,0.25)",
                  color: isSel ? "#0F0A1E" : "#FDE68A",
                  padding: "7px 14px",
                  borderRadius: 20,
                  fontSize: 12.5,
                  fontWeight: isSel ? 800 : 600,
                  cursor: "pointer"
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <input
          type="text"
          placeholder={hi ? "त्यौहार या व्रत खोजें..." : "Search festival (e.g. Diwali, Ekadashi)..."}
          value={festivalSearch}
          onChange={e => setFestivalSearch(e.target.value)}
          style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 20, padding: "8px 16px", color: "#FFF", fontSize: 13, minWidth: 220 }}
        />
      </div>

      {/* Festivals Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 16 }}>
        {filteredFestivals.map((fest) => (
          <div key={fest.id} style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 12, padding: "20px 22px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "#34D399", fontWeight: 800 }}>
                  📅 {new Date(fest.date).toLocaleDateString(hi ? "hi-IN" : "en-US", { day: "numeric", month: "short", year: "numeric" })} ({hi ? fest.dayHi : fest.dayEn})
                </span>
                <span style={{ fontSize: 11, background: "rgba(245,158,11,0.2)", color: "#FDE68A", padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>
                  {fest.month}
                </span>
              </div>

              <h4 style={{ color: "#F3D37A", fontSize: 18, fontWeight: 800, margin: "0 0 4px" }}>
                {hi ? fest.nameHi : fest.nameEn}
              </h4>

              <div style={{ fontSize: 12, color: "rgba(243,211,122,0.85)", marginBottom: 10 }}>
                🌙 {hi ? fest.tithiHi : fest.tithiEn}
              </div>

              <p style={{ fontSize: 13, color: "rgba(241,231,208,0.9)", lineHeight: 1.6, marginBottom: 12 }}>
                {hi ? fest.significanceHi : fest.significanceEn}
              </p>
            </div>

            <div style={{ borderTop: "1px solid rgba(212,175,55,0.15)", paddingTop: 10 }}>
              <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 6, padding: "6px 10px", color: "#FDE68A", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                🪔 <b>{hi ? "शुभ पूजा मुहूर्त:" : "Puja Muhurat:"}</b> {hi ? fest.pujaMuhuratHi : fest.pujaMuhuratEn}
              </div>
              <div style={{ fontSize: 11.5, color: "rgba(241,231,208,0.8)", lineHeight: 1.5 }}>
                <b>{hi ? "व्रत व पूजा नियम:" : "Fasting Rules:"}</b> {hi ? fest.fastingRulesHi : fest.fastingRulesEn}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

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
          onPaid={() => {
            setUnlockedProReport(true);
            if (activeCheckout?.isMarriageUnlock) {
              try {
                localStorage.setItem("jyotish_unlocked_marriage", "true");
                setUnlockedMarriageReport(true);
              } catch (e) {
                console.error(e);
              }
            }
            if (activeCheckout?.isCareerUnlock) {
              try {
                localStorage.setItem("jyotish_unlocked_career", "true");
                setUnlockedCareerReport(true);
              } catch (e) {
                console.error(e);
              }
            }
            if (activeCheckout?.isRemediesUnlock) {
              try {
                localStorage.setItem("jyotish_unlocked_remedies", "true");
                setUnlockedRemediesReport(true);
              } catch (e) {
                console.error(e);
              }
            }
            if (activeCheckout?.isDailySub) {
              try {
                localStorage.setItem("jyotish_daily_sub", JSON.stringify({
                  sign: dailySign,
                  channel: dailyChannel,
                  plan: dailyPlan,
                  time: dailyTime,
                  date: new Date().toISOString()
                }));
                setIsDailySubscribed(true);
              } catch (e) {
                console.error(e);
              }
            }
          }}
          lang={lang}
          currency={currency}
          setCurrency={setCurrency}
        />
      )}

      {/* Admin Secret PIN Modal */}
      {showAdminPinModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", padding: 20 }}>
          <div className="glass-card" style={{ maxWidth: 420, width: "100%", padding: "28px 24px", position: "relative", border: "1.5px solid rgba(245,158,11,0.6)", background: "linear-gradient(135deg, rgba(26,18,48,0.98), rgba(11,8,25,0.99))" }}>
            <button
              onClick={() => setShowAdminPinModal(false)}
              style={{ position: "absolute", top: 12, right: 14, background: "none", border: "none", color: "rgba(241,231,208,0.6)", fontSize: 20, cursor: "pointer" }}
            >
              ✕
            </button>
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <div style={{ fontSize: 36 }}>👑</div>
              <h3 style={{ color: "#F3D37A", fontSize: 18, fontWeight: 800, marginTop: 4 }}>
                Admin VIP Access Portal
              </h3>
              <p style={{ color: "rgba(241,231,208,0.7)", fontSize: 12, marginTop: 4 }}>
                {hi ? "वेबसाइट एडमिन हेतु सभी प्रीमियम फीचर्स की निःशुल्क पहुंच" : "Unlock all paid reports & VIP features for Owner/Admin without making payments"}
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label htmlFor="admin-pin-input" style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#FDE68A", marginBottom: 6 }}>
                {hi ? "एडमिन गुप्त पासकी (Admin PIN):" : "Enter Admin Secret PIN / Passkey:"}
              </label>
              <input
                id="admin-pin-input"
                name="adminPin"
                type="password"
                aria-label="Admin PIN"
                value={adminPinInput}
                onChange={e => { setAdminPinInput(e.target.value); setAdminPinErr(""); }}
                onKeyDown={e => e.key === "Enter" && handleVerifyAdminPin()}
                placeholder="Enter PIN (e.g. 2709)"
                style={{ width: "100%", background: "rgba(0,0,0,0.6)", border: "1px solid rgba(212,175,55,0.35)", borderRadius: 8, padding: "10px 14px", color: "#FFF", fontSize: 14, textAlign: "center", letterSpacing: 2 }}
                autoFocus
              />
            </div>

            {adminPinErr && (
              <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", borderRadius: 8, padding: "8px 12px", color: "#FCA5A5", fontSize: 11, marginBottom: 14, textAlign: "center" }}>
                ⚠️ {adminPinErr}
              </div>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={handleVerifyAdminPin}
                className="gold-cta-btn"
                style={{ flex: 1, padding: "11px 14px", fontSize: 13, fontWeight: 700 }}
              >
                👑 {hi ? "एडमिन मोड सक्रिय करें" : "Activate Admin VIP"}
              </button>
              {isAdmin && (
                <button
                  onClick={() => { handleToggleAdminMode(); setShowAdminPinModal(false); }}
                  style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)", color: "#FCA5A5", borderRadius: 10, padding: "11px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                >
                  {hi ? "एडमिन बंद करें" : "Turn Off"}
                </button>
              )}
            </div>
            <div style={{ fontSize: 10, color: "rgba(243,211,122,0.45)", textAlign: "center", marginTop: 12 }}>
              💡 Secret PIN is configured as <code style={{ color: "#FDE68A" }}>2709</code>
            </div>
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="no-print" style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(11, 8, 25, 0.88)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(212, 175, 55, 0.2)", padding: "14px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            onClick={handleSecretTrigger}
            style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}
            title="Click 3 times to open Admin VIP access portal"
          >
            <span style={{ fontSize: 24, animation: "pulseSlow 3s infinite" }}>🔯</span>
            <div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 17, fontWeight: 800, color: "#F3D37A", letterSpacing: 1.5 }}>JYOTISH KUNDLI</div>
              <div style={{ fontSize: 12, color: "rgba(243, 211, 122, 0.85)", letterSpacing: 0.5, fontWeight: 500 }}>{hi ? "वैदिक ज्योतिष एवं कुंडली मिलान" : "Vedic Astrology & Matchmaking"}</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {isAdmin && (
              <div
                onClick={() => setShowAdminPinModal(true)}
                style={{
                  background: "linear-gradient(135deg, #F59E0B, #D97706)",
                  color: "#0B0819",
                  padding: "6px 12px",
                  borderRadius: 20,
                  fontSize: 12.5,
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  boxShadow: "0 2px 10px rgba(245,158,11,0.4)"
                }}
                title="Admin VIP Mode is Active - Click to Manage"
              >
                <span>👑</span> VIP Admin
              </div>
            )}
            {/* Currency Selector */}
            <select
              id="header-currency-select"
              aria-label={t.currencyLabel}
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              style={{
                background: "rgba(26,18,48,0.95)",
                border: "1px solid rgba(212,175,55,0.4)",
                borderRadius: 20,
                padding: "7px 12px",
                color: "#FDE68A",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                outline: "none"
              }}
            >
              {Object.values(CURRENCIES).map(c => (
                <option key={c.code} value={c.code} style={{ background: "#0D0A1C", color: "#FFF" }}>
                  {c.flag} {c.code} ({c.symbol.trim()})
                </option>
              ))}
            </select>

            <button
              onClick={() => setActiveCheckout({
                title: hi ? "दक्षिणा / आध्यात्मिक सहयोग" : "Offer Dakshina (Support)",
                priceKey: "dakshina",
                price: PRODUCT_PRICES.dakshina[currency],
                desc: hi ? "वैदिक ज्योतिष अनुसंधान एवं सर्वर के रख-रखाव हेतु सहयोग" : "Support free spiritual Vedic Astrology research & maintenance",
                icon: "🪷"
              })}
              style={{ background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.4)", color: "#FDE68A", padding: "7px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
            >
              <span>🙏</span> {hi ? "दक्षिणा दें" : "Offer Dakshina"} ({PRODUCT_PRICES.dakshina[currency]})
            </button>

            {result && (
              <button
                onClick={() => handlePrintReport("all")}
                style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", border: "none", color: "#0F0A1E", padding: "8px 18px", borderRadius: 20, fontSize: 13, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 2px 10px rgba(245,158,11,0.35)" }}
              >
                <span>📥</span> {t.printBtn}
              </button>
            )}

            <button
              onClick={handleLangToggle}
              style={{ background: "linear-gradient(135deg, rgba(26,18,48,0.9), rgba(15,10,32,0.95))", border: "1px solid rgba(212, 175, 55, 0.4)", borderRadius: 24, padding: "7px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "#F3D37A", fontSize: 13, fontWeight: 700 }}
            >
              <span>{hi ? "🇬🇧" : "🇮🇳"}</span>
              <span>{t.langBtn}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ position: "relative", zIndex: 1, maxWidth: 960, margin: "0 auto", padding: "28px 20px 80px" }}>

        {/* ── TOP GLOBAL FEATURE NAVIGATION BAR (Instant Access Without Birth Details) ── */}
        <nav className="no-print" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 28 }}>
          {[
            { id: "kundli", icon: "🔯", label: hi ? "जन्म कुंडली" : "Natal Kundli" },
            { id: "panchang", icon: "🕉️", label: hi ? "दैनिक पंचांग" : "Today's Panchang" },
            { id: "muhurat", icon: "⏳", label: hi ? "शुभ मुहूर्त" : "Shubh Muhurat" },
            { id: "festivals", icon: "🪔", label: hi ? "व्रत व त्यौहार" : "Festivals & Vrat" },
            { id: "daily", icon: "☀️", label: hi ? "दैनिक राशिफल" : "Daily Horoscope" },
          ].map(feat => {
            const isSelected = mainSection === feat.id;
            return (
              <button
                key={feat.id}
                onClick={() => {
                  setMainSection(feat.id);
                  if (result && ["chart", "panchang", "muhurat", "festivals", "daily"].includes(feat.id)) {
                    setTab(feat.id === "kundli" ? "chart" : feat.id);
                  }
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: isSelected
                    ? "linear-gradient(135deg, rgba(245,158,11,0.35), rgba(217,119,6,0.45))"
                    : "rgba(26,18,48,0.85)",
                  border: isSelected ? "1.5px solid #F59E0B" : "1px solid rgba(212,175,55,0.3)",
                  borderRadius: 24,
                  padding: "10px 18px",
                  color: isSelected ? "#FDE68A" : "rgba(241,231,208,0.9)",
                  fontSize: 13.5,
                  fontWeight: isSelected ? 800 : 600,
                  cursor: "pointer",
                  boxShadow: isSelected ? "0 0 16px rgba(245,158,11,0.35)" : "none",
                  transition: "all 0.2s ease"
                }}
              >
                <span style={{ fontSize: 16 }}>{feat.icon}</span>
                <span>{feat.label}</span>
              </button>
            );
          })}
        </nav>

        {/* ── STANDALONE PANCHANG VIEW ── */}
        {mainSection === "panchang" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <button
                onClick={() => setMainSection("kundli")}
                style={{ background: "transparent", border: "1px solid rgba(212,175,55,0.3)", color: "#FDE68A", padding: "6px 14px", borderRadius: 16, fontSize: 12.5, cursor: "pointer" }}
              >
                ← {hi ? "जन्म कुंडली फॉर्म पर लौटें" : "Back to Kundli Generator"}
              </button>
            </div>
            {renderPanchangContent()}
          </div>
        )}

        {/* ── STANDALONE SHUBH MUHURAT VIEW ── */}
        {mainSection === "muhurat" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <button
                onClick={() => setMainSection("kundli")}
                style={{ background: "transparent", border: "1px solid rgba(212,175,55,0.3)", color: "#FDE68A", padding: "6px 14px", borderRadius: 16, fontSize: 12.5, cursor: "pointer" }}
              >
                ← {hi ? "जन्म कुंडली फॉर्म पर लौटें" : "Back to Kundli Generator"}
              </button>
            </div>
            {renderMuhuratContent()}
          </div>
        )}

        {/* ── STANDALONE FESTIVALS & VRAT VIEW ── */}
        {mainSection === "festivals" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <button
                onClick={() => setMainSection("kundli")}
                style={{ background: "transparent", border: "1px solid rgba(212,175,55,0.3)", color: "#FDE68A", padding: "6px 14px", borderRadius: 16, fontSize: 12.5, cursor: "pointer" }}
              >
                ← {hi ? "जन्म कुंडली फॉर्म पर लौटें" : "Back to Kundli Generator"}
              </button>
            </div>
            {renderFestivalsContent()}
          </div>
        )}

        {/* ── STANDALONE DAILY HOROSCOPE VIEW ── */}
        {mainSection === "daily" && !result && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <button
                onClick={() => setMainSection("kundli")}
                style={{ background: "transparent", border: "1px solid rgba(212,175,55,0.3)", color: "#FDE68A", padding: "6px 14px", borderRadius: 16, fontSize: 12.5, cursor: "pointer" }}
              >
                ← {hi ? "जन्म कुंडली फॉर्म पर लौटें" : "Back to Kundli Generator"}
              </button>
            </div>
            <div className="glass-card" style={{ padding: "26px 28px", marginBottom: 20 }}>
              <h3 style={{ color: "#F3D37A", fontSize: 20, fontWeight: 800, marginBottom: 6 }}>
                ☀️ {hi ? "दैनिक वैदिक राशिफल" : "Daily Vedic Horoscope"}
              </h3>
              <p style={{ color: "rgba(241,231,208,0.8)", fontSize: 13.5, marginBottom: 18 }}>
                {hi ? "अपनी चंद्र या सूर्य राशि चुनें और आज का सटीक वैदिक भविष्यफल प्राप्त करें:" : "Select your Moon / Sun sign for today's astrological guidance:"}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                {SIGNS.map(s => (
                  <button
                    key={s}
                    onClick={() => setDailySign(s)}
                    style={{
                      background: dailySign === s ? "linear-gradient(135deg, #F59E0B, #D97706)" : "rgba(11,8,25,0.7)",
                      border: dailySign === s ? "none" : "1px solid rgba(212,175,55,0.3)",
                      color: dailySign === s ? "#0F0A1E" : "#FDE68A",
                      padding: "8px 14px",
                      borderRadius: 16,
                      fontSize: 13,
                      fontWeight: dailySign === s ? 800 : 600,
                      cursor: "pointer"
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {(() => {
                const daily = generateDailyHoroscope(dailySign, lang);
                return (
                  <div style={{ background: "rgba(0,0,0,0.4)", borderRadius: 12, padding: "20px 22px", border: "1px solid rgba(212,175,55,0.2)" }}>
                    <h4 style={{ color: "#FDE68A", fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
                      {daily.sign} — {daily.prediction}
                    </h4>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginTop: 14 }}>
                      <div style={{ background: "rgba(245,158,11,0.1)", borderRadius: 8, padding: "10px 14px" }}>
                        <span style={{ fontSize: 12, color: "#FDE68A", fontWeight: 700 }}>🎨 {hi ? "शुभ रंग:" : "Lucky Color:"}</span>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#FFF", marginTop: 2 }}>{daily.luckyColor}</div>
                      </div>
                      <div style={{ background: "rgba(245,158,11,0.1)", borderRadius: 8, padding: "10px 14px" }}>
                        <span style={{ fontSize: 12, color: "#FDE68A", fontWeight: 700 }}>🔢 {hi ? "शुभ अंक:" : "Lucky Number:"}</span>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#FFF", marginTop: 2 }}>{daily.luckyNumber}</div>
                      </div>
                      <div style={{ background: "rgba(245,158,11,0.1)", borderRadius: 8, padding: "10px 14px" }}>
                        <span style={{ fontSize: 12, color: "#FDE68A", fontWeight: 700 }}>⏱️ {hi ? "शुभ समय:" : "Auspicious Time:"}</span>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#FFF", marginTop: 2 }}>{daily.luckyTime}</div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ── KUNDLI GENERATOR SECTION ── */}
        {mainSection === "kundli" && (
          <>
            {/* Hero Section */}
            <section className="no-print" style={{ textAlign: "center", marginBottom: 30 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(245, 158, 11, 0.12)", border: "1px solid rgba(245, 158, 11, 0.35)", borderRadius: 30, padding: "7px 18px", marginBottom: 14 }}>
                <span style={{ fontSize: 15 }}>✨</span>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: "#FDE68A", letterSpacing: 1.5 }}>
                  {hi ? "प्रामाणिक पराशरी गणना" : "AUTHENTIC SIDEREAL VEDIC COMPUTATION"}
                </span>
              </div>

              <h1 style={{ fontFamily: hi ? "'Noto Sans Devanagari', sans-serif" : "'Cinzel Decorative', serif", fontSize: "clamp(24px, 5.5vw, 42px)", background: "linear-gradient(90deg, #D4AF37 0%, #FDE68A 40%, #F59E0B 70%, #D4AF37 100%)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: hi ? 1 : 3, fontWeight: 800, marginBottom: 8 }}>
                {t.title}
              </h1>
              <p style={{ color: "#FDE68A", fontSize: hi ? 14 : 13.5, letterSpacing: hi ? 0 : 3, textTransform: "uppercase", fontWeight: 700 }}>
                {t.subtitle}
              </p>
              <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.6), transparent)", margin: "16px auto", maxWidth: 300 }} />
              <p style={{ color: "rgba(241, 231, 208, 0.85)", fontSize: 14.5, fontStyle: "italic", lineHeight: 1.6 }}>{t.tagline}</p>
            </section>

            {/* Standalone Feature Spotlight Cards (Direct 1-Click Access) */}
            {!result && (
              <div className="no-print" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginBottom: 28 }}>
                {/* 1. Panchang Card */}
                <div
                  onClick={() => setMainSection("panchang")}
                  style={{ background: "linear-gradient(135deg, rgba(26,18,48,0.9), rgba(15,10,32,0.95))", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 14, padding: "18px 20px", cursor: "pointer", transition: "transform 0.2s ease, border-color 0.2s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#F59E0B"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 22 }}>🕉️</span>
                    <span style={{ fontSize: 11.5, color: "#34D399", fontWeight: 700, background: "rgba(16,185,129,0.15)", padding: "2px 8px", borderRadius: 10 }}>
                      {hi ? "लाइव पंचांग" : "Live Daily"}
                    </span>
                  </div>
                  <h3 style={{ color: "#F3D37A", fontSize: 16, fontWeight: 800, margin: "4px 0" }}>
                    {hi ? "दैनिक हिंदू पंचांग" : "Today's Hindu Panchang"}
                  </h3>
                  <div style={{ fontSize: 12.5, color: "rgba(241,231,208,0.85)", marginBottom: 8 }}>
                    {panchangData.tithi} · {panchangData.nakshatra}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "#FDE68A", borderTop: "1px solid rgba(212,175,55,0.15)", paddingTop: 8 }}>
                    <span>🌟 {hi ? "अभिजीत:" : "Abhijit:"} {panchangData.muhurats.abhijit.split("-")[0]}</span>
                    <span>⚠️ {hi ? "राहुकाल:" : "Rahu:"} {panchangData.inauspicious.rahuKaal.split("-")[0]}</span>
                  </div>
                  <div style={{ marginTop: 10, color: "#F59E0B", fontSize: 12, fontWeight: 800, textAlign: "right" }}>
                    {hi ? "चौघड़िया व पंचांग देखें →" : "View Full Panchang →"}
                  </div>
                </div>

                {/* 2. Shubh Muhurat Card */}
                <div
                  onClick={() => setMainSection("muhurat")}
                  style={{ background: "linear-gradient(135deg, rgba(26,18,48,0.9), rgba(15,10,32,0.95))", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 14, padding: "18px 20px", cursor: "pointer", transition: "transform 0.2s ease, border-color 0.2s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#F59E0B"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 22 }}>⏳</span>
                    <span style={{ fontSize: 11.5, color: "#FDE68A", fontWeight: 700, background: "rgba(245,158,11,0.18)", padding: "2px 8px", borderRadius: 10 }}>
                      2026–2027
                    </span>
                  </div>
                  <h3 style={{ color: "#F3D37A", fontSize: 16, fontWeight: 800, margin: "4px 0" }}>
                    {hi ? "सर्व शुभ मुहूर्त डायरेक्टरी" : "Auspicious Muhurats"}
                  </h3>
                  <div style={{ fontSize: 12.5, color: "rgba(241,231,208,0.85)", marginBottom: 8 }}>
                    {hi ? "विवाह, गृह प्रवेश, वाहन, संपत्ति व व्यापार" : "Weddings, Housewarming, Vehicles & Business"}
                  </div>
                  <div style={{ fontSize: 11.5, color: "#34D399", borderTop: "1px solid rgba(212,175,55,0.15)", paddingTop: 8 }}>
                    ✨ {hi ? "सर्वार्थ सिद्धि व अमृत योग सहित" : "Certified Vedic Muhurat Windows"}
                  </div>
                  <div style={{ marginTop: 10, color: "#F59E0B", fontSize: 12, fontWeight: 800, textAlign: "right" }}>
                    {hi ? "शुभ मुहूर्त सूची देखें →" : "View All Muhurats →"}
                  </div>
                </div>

                {/* 3. Festivals & Vrat Card */}
                <div
                  onClick={() => setMainSection("festivals")}
                  style={{ background: "linear-gradient(135deg, rgba(26,18,48,0.9), rgba(15,10,32,0.95))", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 14, padding: "18px 20px", cursor: "pointer", transition: "transform 0.2s ease, border-color 0.2s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#F59E0B"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 22 }}>🪔</span>
                    <span style={{ fontSize: 11.5, color: "#F472B6", fontWeight: 700, background: "rgba(244,114,182,0.15)", padding: "2px 8px", borderRadius: 10 }}>
                      {hi ? "पर्व व उपवास" : "Festivals"}
                    </span>
                  </div>
                  <h3 style={{ color: "#F3D37A", fontSize: 16, fontWeight: 800, margin: "4px 0" }}>
                    {hi ? "हिंदू व्रत एवं त्यौहार कैलेंडर" : "Festivals & Vrat Calendar"}
                  </h3>
                  <div style={{ fontSize: 12.5, color: "rgba(241,231,208,0.85)", marginBottom: 8 }}>
                    {hi ? "एकादशी, प्रदोष, दीपावली, छठ, शिवरात्रि" : "Ekadashis, Pradosh, Diwali, Chhath & Fasts"}
                  </div>
                  <div style={{ fontSize: 11.5, color: "#FDE68A", borderTop: "1px solid rgba(212,175,55,0.15)", paddingTop: 8 }}>
                    📿 {hi ? "पूजा मुहूर्त व पारण समय सहित" : "With Puja Muhurat & Fasting Rules"}
                  </div>
                  <div style={{ marginTop: 10, color: "#F59E0B", fontSize: 12, fontWeight: 800, textAlign: "right" }}>
                    {hi ? "कैलेंडर देखें →" : "View Calendar →"}
                  </div>
                </div>
              </div>
            )}

            {/* Input Form Card */}
            <div className="glass-card form-section-card no-print" style={{ padding: "32px 34px", marginBottom: 36 }}>
              <div style={{ marginBottom: 24, textAlign: "center" }}>
                <h2 style={{ color: "#F3D37A", fontSize: 18, fontWeight: 800, letterSpacing: 0.5, marginBottom: 4 }}>{t.formTitle}</h2>
                <p style={{ color: "rgba(243, 211, 122, 0.8)", fontSize: 13.5 }}>{t.formSub}</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label htmlFor="birth-name" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#FDE68A", marginBottom: 8, letterSpacing: 0.5 }}>
                    <span>👤</span> {t.fName} *
                  </label>
                  <input
                    id="birth-name"
                    name="name"
                    type="text"
                    required
                    aria-required="true"
                    aria-label={t.fName}
                    value={form.name}
                    onChange={e => { setForm({ ...form, name: e.target.value }); if (err) setErr(""); }}
                    placeholder={t.phName}
                    style={{ width: "100%", background: "rgba(11, 8, 25, 0.65)", border: "1px solid rgba(212, 175, 55, 0.3)", borderRadius: 10, padding: "13px 16px", color: "#FFF", fontSize: 15, fontFamily: "inherit", colorScheme: "dark" }}
                  />
                </div>

                <div>
                  <label htmlFor="birth-dob" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#FDE68A", marginBottom: 8, letterSpacing: 0.5 }}>
                    <span>📅</span> {t.fDob} *
                  </label>
                  <input
                    id="birth-dob"
                    name="dob"
                    type="date"
                    required
                    aria-required="true"
                    aria-label={t.fDob}
                    value={form.dob}
                    onChange={e => { setForm({ ...form, dob: e.target.value }); if (err) setErr(""); }}
                    style={{ width: "100%", background: "rgba(11, 8, 25, 0.65)", border: "1px solid rgba(212, 175, 55, 0.3)", borderRadius: 10, padding: "13px 16px", color: "#FFF", fontSize: 15, fontFamily: "inherit", colorScheme: "dark" }}
                  />
                </div>

                <div>
                  <label htmlFor="birth-tob" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#FDE68A", marginBottom: 8, letterSpacing: 0.5 }}>
                    <span>⏰</span> {t.fTob} <span style={{ fontSize: 12, color: "rgba(243, 211, 122, 0.8)", fontWeight: 500 }}>{t.fTobHelp}</span>
                  </label>
                  <input
                    id="birth-tob"
                    name="tob"
                    type="time"
                    aria-label={t.fTob}
                    value={form.tob}
                    onChange={e => setForm({ ...form, tob: e.target.value })}
                    style={{ width: "100%", background: "rgba(11, 8, 25, 0.65)", border: "1px solid rgba(212, 175, 55, 0.3)", borderRadius: 10, padding: "13px 16px", color: "#FFF", fontSize: 15, fontFamily: "inherit", colorScheme: "dark" }}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label htmlFor="birth-pob" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#FDE68A", marginBottom: 8, letterSpacing: 0.5 }}>
                    <span>📍</span> {t.fPob} *
                  </label>
                  <input
                    id="birth-pob"
                    name="pob"
                    type="text"
                    required
                    aria-required="true"
                    aria-label={t.fPob}
                    value={form.pob}
                    onChange={e => { setForm({ ...form, pob: e.target.value }); if (err) setErr(""); }}
                    placeholder={t.phPob}
                    style={{ width: "100%", background: "rgba(11, 8, 25, 0.65)", border: "1px solid rgba(212, 175, 55, 0.3)", borderRadius: 10, padding: "13px 16px", color: "#FFF", fontSize: 15, fontFamily: "inherit", colorScheme: "dark" }}
                  />
                </div>
              </div>

              {err && (
                <div style={{ background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.35)", borderRadius: 8, padding: "12px 16px", color: "#FCA5A5", fontSize: 13.5, textAlign: "center", marginTop: 18 }}>
                  ⚠️ {err}
                </div>
              )}

              <button onClick={run} disabled={step > 0} className="gold-cta-btn" style={{ marginTop: 24, fontSize: 16 }}>
                {step > 0 ? t.btnWait : t.btnGo}
              </button>

              {/* Quick Daily Horoscope Access */}
              {!result && (
                <div style={{ marginTop: 20, textAlign: "center", borderTop: "1px solid rgba(212,175,55,0.2)", paddingTop: 16 }}>
                  <span style={{ fontSize: 13.5, color: "rgba(241,231,208,0.85)" }}>
                    {hi ? "या आज का दैनिक राशिफल व व्हाट्सएप अलर्ट्स देखें:" : "Or check Today's Daily Vedic Horoscope & WhatsApp Alerts:"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMainSection("daily");
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: "rgba(245,158,11,0.18)",
                      border: "1px solid rgba(245,158,11,0.4)",
                      borderRadius: 20,
                      padding: "7px 18px",
                      color: "#FDE68A",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      marginLeft: 10,
                      marginTop: 6
                    }}
                  >
                    <span>☀️</span> {hi ? "दैनिक राशिफल (Daily Horoscope)" : "Daily Horoscope"} →
                  </button>
                </div>
              )}
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
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            SCREEN VIEW (Interactive Tabs)
        ══════════════════════════════════════════════════════════════════════ */}
        {result && (
          <div ref={resultRef} className="screen-only-tabs" style={{ animation: "fadeInCard 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>

            {/* Profile Overview Header Card */}
            <div className="glass-card" style={{ padding: "28px 30px", marginBottom: 28, textAlign: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#F59E0B", fontWeight: 700, letterSpacing: 1.2, marginBottom: 6 }}>
                <span>✨</span> {hi ? "वैदिक जन्म विवरण" : "NATAL PROFILE"}
              </div>
              <h2 style={{ fontFamily: hi ? "'Noto Sans Devanagari', sans-serif" : "'Cinzel Decorative', serif", color: "#F3D37A", fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 800, marginBottom: 6 }}>
                {form.name.toUpperCase()}
              </h2>
              <p style={{ color: "rgba(241, 231, 208, 0.8)", fontSize: 13.5, letterSpacing: 0.5, fontWeight: 500 }}>
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
                  <div key={i} style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: 12, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 12, color: "rgba(243, 211, 122, 0.85)", letterSpacing: 0.5, fontWeight: 600 }}>{item.label}</div>
                      <div style={{ fontSize: 15, color: "#FDE68A", fontWeight: 800 }}>{item.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monetization Promotion Banner */}
            <div className="glass-card" style={{ padding: "20px 26px", marginBottom: 24, background: "linear-gradient(135deg, rgba(35,22,65,0.9), rgba(18,12,38,0.95))", border: "1px solid rgba(245,158,11,0.45)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.2)", borderRadius: 12, padding: "4px 12px", color: "#FDE68A", fontSize: 12, fontWeight: 800, marginBottom: 6 }}>
                  <span>⭐</span> {hi ? "प्रीमियम 50+ पेज महा-कुंडली रिपोर्ट" : "DELUXE 50+ PAGE LIFE REPORT"}
                </div>
                <h4 style={{ color: "#F3D37A", fontSize: 15.5, fontWeight: 700 }}>
                  {hi ? "वर्ष 2026-2027 वार्षिक गोचर, साढ़ेसाती व विस्तृत समाधान प्राप्त करें" : "Unlock Complete 2026-2027 Annual Transit Forecast & Remedies"}
                </h4>
              </div>
              <button
                onClick={() => setActiveCheckout({
                  title: hi ? "50-पेज गोल्डन महा-कुंडली रिपोर्ट" : "Golden Deluxe 50-Page Life Report",
                  priceKey: "deluxeReport",
                  price: PRODUCT_PRICES.deluxeReport[currency],
                  desc: hi ? "दशा विश्लेषण, साढ़ेसाती, करियर और व्यक्तिगत उपाय सहित विस्तृत PDF" : "Full life analysis, transit timing, Sade Sati & energized gemstones PDF",
                  icon: "📜"
                })}
                style={{ background: "linear-gradient(90deg, #F59E0B, #D97706)", border: "none", color: "#0F0A1E", padding: "12px 22px", borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 14px rgba(245,158,11,0.4)" }}
              >
                {hi ? "अनलॉक करें" : "Unlock Report"} ({PRODUCT_PRICES.deluxeReport[currency]})
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="tab-bar-nav" style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 28 }}>
              {TABS.map(tabItem => (
                <button
                  key={tabItem.id}
                  onClick={() => setTab(tabItem.id)}
                  className={`tab-btn ${tab === tabItem.id ? "active" : ""}`}
                  style={{ fontSize: 14, padding: "10px 18px" }}
                >
                  <span style={{ fontSize: 16 }}>{tabItem.icon}</span>
                  <span>{hi ? tabItem.labelHi : tabItem.labelEn}</span>
                </button>
              ))}
            </div>

            {/* ── TAB 1: CHART ── */}
            {tab === "chart" && (
              <div className="glass-card" style={{ padding: "30px 24px", marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
                  <div>
                    <h3 style={{ color: "#F3D37A", fontSize: 18, fontWeight: 800 }}>{t.chartTitle}</h3>
                    <p style={{ color: "rgba(241, 231, 208, 0.75)", fontSize: 13.5 }}>{t.chartSub}</p>
                  </div>

                  <div style={{ display: "flex", background: "rgba(11, 8, 25, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", borderRadius: 20, padding: 3 }}>
                    <button
                      onClick={() => setChartStyle("north")}
                      style={{ background: chartStyle === "north" ? "rgba(245, 158, 11, 0.25)" : "transparent", border: "none", color: chartStyle === "north" ? "#FDE68A" : "rgba(241, 231, 208, 0.75)", padding: "7px 14px", borderRadius: 16, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                    >
                      {t.chartStyleNorth}
                    </button>
                    <button
                      onClick={() => setChartStyle("south")}
                      style={{ background: chartStyle === "south" ? "rgba(245, 158, 11, 0.25)" : "transparent", border: "none", color: chartStyle === "south" ? "#FDE68A" : "rgba(241, 231, 208, 0.75)", padding: "7px 14px", borderRadius: 16, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
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
                  <div style={{ background: "rgba(245, 158, 11, 0.12)", border: "1px solid rgba(245, 158, 11, 0.35)", borderRadius: 12, padding: "14px 20px", marginBottom: 20, animation: "fadeInCard 0.2s ease" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ color: "#FDE68A", fontSize: 14.5, fontWeight: 800 }}>
                        {hi ? `भाव ${hoveredHouse}` : `House ${hoveredHouse}`}: {t.hnames[hoveredHouse - 1]}
                      </span>
                      <span style={{ color: "#F3D37A", fontSize: 13.5, fontWeight: 600 }}>
                        {result.houses[hoveredHouse]?.sign} ({result.houses[hoveredHouse]?.signSanskrit})
                      </span>
                    </div>
                    <p style={{ color: "rgba(241, 231, 208, 0.9)", fontSize: 13.5, lineHeight: 1.7 }}>
                      {result.houses[hoveredHouse]?.interpretation}
                    </p>
                  </div>
                )}

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 24 }}>
                  {PLANETS.map(p => (
                    <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(15, 10, 32, 0.8)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 8, padding: "6px 12px" }}>
                      <span style={{ color: p.color, fontWeight: "bold", fontSize: 13.5 }}>{p.symbol}</span>
                      <span style={{ color: "rgba(241, 231, 208, 0.85)", fontSize: 12.5, fontWeight: 600 }}>{hi ? p.sanskrit : p.name}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                  <div style={{ background: "rgba(15, 10, 32, 0.7)", border: "1px solid rgba(212, 175, 55, 0.2)", borderRadius: 12, padding: "20px 22px" }}>
                    <h4 style={{ color: "#F3D37A", fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                      <span>⚡</span> {t.sec.yogas}
                    </h4>
                    <div style={{ color: "rgba(241, 231, 208, 0.9)", fontSize: 14, lineHeight: 1.85, whiteSpace: "pre-wrap" }}>
                      {result.yogas}
                    </div>
                  </div>

                  <div style={{ background: "rgba(15, 10, 32, 0.7)", border: "1px solid rgba(212, 175, 55, 0.2)", borderRadius: 12, padding: "20px 22px" }}>
                    <h4 style={{ color: "#F3D37A", fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                      <span>⏱️</span> {t.sec.dasha}
                    </h4>
                    <div style={{ color: "rgba(241, 231, 208, 0.9)", fontSize: 14, lineHeight: 1.85, whiteSpace: "pre-wrap" }}>
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

            {/* ── TAB: CAREER, JOB & BUSINESS PREDICTION (FREEMIUM + PAID GATE) ── */}
            {tab === "careerTiming" && (() => {
              const cp = result.careerPrediction || calculateCareerPrediction({
                name: form.name || "User",
                dob: form.dob || "1998-01-01",
                lagnaSign: result.lagnaSign,
                rashiSign: result.rashiSign,
                lang
              });
              const unlockPrice = PRODUCT_PRICES.careerReport[currency];

              return (
                <div>
                  {/* Top Free Career Overview Card */}
                  <div className="glass-card" style={{ padding: "28px 30px", marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 16, marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                      <div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 12, padding: "4px 12px", color: "#FDE68A", fontSize: 12, fontWeight: 800, marginBottom: 4 }}>
                          <span>💼</span> {hi ? "दशम भाव कर्म स्थान एवं डी-१० दशांश विश्लेषण" : "10TH HOUSE KARMA & D10 ANALYSIS"}
                        </div>
                        <h3 style={{ color: "#F3D37A", fontSize: 19, fontWeight: 800, marginTop: 4 }}>
                          {form.name || "Native"} — {hi ? "करियर, नौकरी व व्यावसायिक मार्गदर्शन" : "Career, Job & Business Growth Blueprint"}
                        </h3>
                        <p style={{ color: "rgba(241,231,208,0.75)", fontSize: 13, marginTop: 3 }}>
                          {hi ? `दशम भाव राशि: ${cp.tenthSign} | कर्मेश: ${cp.tenthLord}` : `10th House Sign: ${cp.tenthSign} | 10th Lord: ${cp.tenthLord}`}
                        </p>
                      </div>

                      <div style={{ textAlign: "right", background: "rgba(11,8,25,0.6)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 12, padding: "10px 18px" }}>
                        <div style={{ fontSize: 12, color: "rgba(243,211,122,0.85)", fontWeight: 600 }}>{hi ? "करियर सफलता योग" : "Career Elevation Index"}</div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: "#34D399" }}>{cp.scores.corporate}%</div>
                      </div>
                    </div>

                    {/* Primary Archetype & Recommended Streams (FREE) */}
                    <div style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(11,8,25,0.8))", border: "1px solid rgba(245,158,11,0.35)", borderRadius: 14, padding: "20px 22px", marginBottom: 20 }}>
                      <div style={{ fontSize: 12, color: "#FDE68A", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>
                        🌟 {hi ? "आपका प्रधान करियर स्वभाव (Primary Career Archetype)" : "Dominant Professional Archetype"}
                      </div>
                      <h4 style={{ color: "#FFF", fontSize: 18, fontWeight: 800, marginTop: 4, marginBottom: 12 }}>
                        {cp.archetypeTitle}
                      </h4>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
                        {cp.primarySectors.map((sector, idx) => (
                          <div key={idx} style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ color: "#34D399", fontSize: 16 }}>✦</span>
                            <span style={{ color: "#FDE68A", fontSize: 13, fontWeight: 600 }}>{sector}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 4 Domain Suitability Spectrum (Govt vs Corporate vs Business vs Creative) (FREE) */}
                    <div style={{ marginBottom: 16 }}>
                      <h4 style={{ color: "#F3D37A", fontSize: 15.5, fontWeight: 800, marginBottom: 14 }}>
                        📊 {hi ? "क्षेत्र-वार अनुकूलता सूचकांक (Domain Suitability Spectrum)" : "Career Domain Suitability Spectrum"}
                      </h4>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12 }}>
                        {[
                          { name: hi ? "सरकारी व प्रशासनिक सेवा (Govt/PSU)" : "Government & Civil Administration", score: cp.scores.govt, icon: "🏛️", color: "#F59E0B" },
                          { name: hi ? "कॉर्पोरेट व आईटी नेतृत्व (Corporate/Tech)" : "Corporate & High-Tech Leadership", score: cp.scores.corporate, icon: "💼", color: "#60A5FA" },
                          { name: hi ? "स्वतंत्र व्यापार व उद्यम (Business/Startups)" : "Business & Scalable Startups", score: cp.scores.business, icon: "🚀", color: "#34D399" },
                          { name: hi ? "रिसर्च, मीडिया व कला (Creative/Research)" : "Creative Media & Advisory", score: cp.scores.creative, icon: "🎨", color: "#F472B6" },
                        ].map((domain, i) => (
                          <div key={i} style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: "14px 16px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                              <span style={{ color: "#FDE68A", fontSize: 13, fontWeight: 700 }}>{domain.icon} {domain.name}</span>
                              <span style={{ color: domain.color, fontSize: 14, fontWeight: 800 }}>{domain.score}%</span>
                            </div>
                            <div style={{ width: "100%", height: 7, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
                              <div style={{ width: `${domain.score}%`, height: "100%", background: domain.color, borderRadius: 4 }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Free Daily Career Mantra */}
                    <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 12, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                      <div style={{ color: "#34D399", fontSize: 13.5, fontWeight: 700 }}>
                        ☀️ {hi ? "दैनिक करियर सफलता मंत्र (Daily Career Mantra):" : "Daily Career Focus Mantra:"}
                      </div>
                      <div style={{ color: "#FDE68A", fontSize: 14.5, fontWeight: 800, letterSpacing: 0.5 }}>
                        {cp.dailyCareerMantra}
                      </div>
                    </div>
                  </div>

                  {/* ── PREMIUM LOCKED / BLURRED DEEP REPORT SECTION ── */}
                  <div style={{ position: "relative", marginBottom: 24 }}>
                    <div className="glass-card" style={{ padding: "28px 30px", filter: effectiveCareerUnlocked ? "none" : "blur(5px)", pointerEvents: effectiveCareerUnlocked ? "auto" : "none", userSelect: effectiveCareerUnlocked ? "auto" : "none", transition: "all 0.3s ease" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 14, marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 22 }}>📜</span>
                          <h4 style={{ color: "#F3D37A", fontSize: 16.5, fontWeight: 800 }}>
                            {hi ? "सटीक पदोन्नति कालखंड, नौकरी परिवर्तन व व्यापार ब्लूप्रिंट (Confidential Report)" : "Exact Promotion Windows, Job Switch Timing & Business Blueprint"}
                          </h4>
                        </div>
                        {effectiveCareerUnlocked && (
                          <div style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 12, padding: "3px 12px", color: "#34D399", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", gap: 4 }}>
                            <span>✓</span> {hi ? "प्रीमियम रिपोर्ट सक्रिय" : "Premium Report Active"}
                          </div>
                        )}
                      </div>

                      {/* Golden Career Timeline */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 14, marginBottom: 20 }}>
                        <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 12, padding: "16px 18px" }}>
                          <div style={{ color: "#34D399", fontSize: 13, fontWeight: 800, marginBottom: 4 }}>
                            📈 {hi ? "पदोन्नति व अप्रेजल काल" : "Next Promotion & Appraisal Window"}
                          </div>
                          <div style={{ color: "#FFF", fontSize: 14, fontWeight: 700 }}>
                            {cp.appraisalWindow}
                          </div>
                        </div>

                        <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.35)", borderRadius: 12, padding: "16px 18px" }}>
                          <div style={{ color: "#FDE68A", fontSize: 13, fontWeight: 800, marginBottom: 4 }}>
                            🔄 {hi ? "नौकरी परिवर्तन व वेतन वृद्धि" : "Job Switch & High-Package Timing"}
                          </div>
                          <div style={{ color: "#FFF", fontSize: 14, fontWeight: 700 }}>
                            {cp.jobChangeWindow}
                          </div>
                        </div>

                        <div style={{ background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.35)", borderRadius: 12, padding: "16px 18px" }}>
                          <div style={{ color: "#60A5FA", fontSize: 13, fontWeight: 800, marginBottom: 4 }}>
                            🌐 {hi ? "व्यापार विस्तार व वैश्विक अवसर" : "Business Launch & Expansion Phase"}
                          </div>
                          <div style={{ color: "#FFF", fontSize: 14, fontWeight: 700 }}>
                            {cp.expansionWindow}
                          </div>
                        </div>
                      </div>

                      {/* Workplace Obstacles & Doshas */}
                      <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 12, padding: "16px 18px", marginBottom: 20 }}>
                        <div style={{ color: "#F3D37A", fontSize: 14, fontWeight: 800, marginBottom: 6 }}>
                          ⚠️ {hi ? "कार्यक्षेत्र में आने वाले अवरोध व उनका ज्योतिषीय कारण" : "Workplace Friction & Astrological Diagnostics"}
                        </div>
                        <p style={{ color: "rgba(241,231,208,0.9)", fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>
                          {cp.obstacleAnalysis}
                        </p>
                      </div>

                      {/* Actionable Remedies */}
                      <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.35)", borderRadius: 12, padding: "18px 20px", marginBottom: 18 }}>
                        <div style={{ color: "#FDE68A", fontSize: 14.5, fontWeight: 800, marginBottom: 8 }}>
                          🛡️ {hi ? "करियर उन्नति के अचूक वैदिक उपाय व विधान" : "Actionable Vedic Remedies for Rapid Career Elevation"}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
                          {cp.remedies.map((rem, i) => (
                            <p key={i} style={{ color: "rgba(241,231,208,0.92)", fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>
                              {rem}
                            </p>
                          ))}
                        </div>
                      </div>

                      {effectiveCareerUnlocked && (
                        <div style={{ textAlign: "center", paddingTop: 10 }}>
                          <button onClick={() => handlePrintReport("career")} className="gold-cta-btn" style={{ padding: "10px 22px", fontSize: 13.5 }}>
                            📄 {hi ? "करियर PDF रिपोर्ट प्रिंट / सेव करें" : "Save / Print Career Report PDF"}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Paywall Overlay Banner (When Locked) */}
                    {!effectiveCareerUnlocked && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(11,8,25,0.86)", backdropFilter: "blur(6px)", borderRadius: 16, border: "2px solid rgba(245,158,11,0.5)", padding: "26px 22px", textAlign: "center", zIndex: 10 }}>
                        <div style={{ fontSize: 38, marginBottom: 8 }}>🔒</div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 12, padding: "4px 14px", color: "#FDE68A", fontSize: 12, fontWeight: 800, marginBottom: 8 }}>
                          PREMIUM CAREER & BUSINESS BLUEPRINT
                        </div>
                        <h3 style={{ color: "#F3D37A", fontSize: 19, fontWeight: 800, maxWidth: 540 }}>
                          {hi ? "सटीक पदोन्नति तिथियां, नौकरी परिवर्तन काल एवं सम्पूर्ण २०-पृष्ठीय करियर PDF अनलॉक करें" : "Unlock Exact Promotion Windows, High-Package Job Switch Dates & 20-Page Career PDF"}
                        </h3>
                        <p style={{ color: "rgba(241,231,208,0.85)", fontSize: 14, maxWidth: 560, margin: "10px 0 18px", lineHeight: 1.6 }}>
                          {hi
                            ? "जानें कब मिलेगा बड़ा वेतन इजाफा, विदेश में नौकरी के अवसर, कार्यक्षेत्र में विरोधियों की शांति एवं डी-१० दशांश चार्ट का सूक्ष्म विश्लेषण।"
                            : "Access your pinpoint promotion quarters, foreign relocation & overseas job yogas, office politics neutralization, and full D10 Dasamsa analysis."}
                        </p>
                        <button
                          onClick={() => setActiveCheckout({
                            title: hi ? "सम्पूर्ण करियर, पदोन्नति व व्यापार ब्लूप्रिंट (PDF)" : "Complete 20-Page Career & Business Growth Blueprint PDF",
                            priceKey: "careerReport",
                            price: unlockPrice,
                            desc: "Detailed D10 Dasamsa analysis, promotion calendar, and wealth timing",
                            icon: "💼",
                            isCareerUnlock: true
                          })}
                          className="gold-cta-btn"
                          style={{ padding: "14px 30px", fontSize: 15, fontWeight: 800, boxShadow: "0 6px 20px rgba(245,158,11,0.45)" }}
                        >
                          {hi ? `करियर ब्लूप्रिंट अनलॉक करें (${unlockPrice}) ✦` : `Unlock Complete Career Blueprint (${unlockPrice}) ✦`}
                        </button>
                        <div style={{ fontSize: 12, color: "rgba(243,211,122,0.75)", marginTop: 10, fontWeight: 600 }}>
                          🔒 Instant Lifetime Access + Printable PDF Dossier
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ── TAB: DAILY LIFE PROBLEMS & VEDIC REMEDIAL SOLVER (FREEMIUM + PAID GATE) ── */}
            {tab === "lifeProblems" && (() => {
              const activeRemedy = getLifeProblemRemedies({
                problemId: activeProblemId,
                lagnaSign: result.lagnaSign,
                rashiSign: result.rashiSign,
                lang
              });
              const unlockPrice = PRODUCT_PRICES.remediesReport[currency];

              return (
                <div>
                  {/* Category Pill Selector (FREE INTERACTIVE) */}
                  <div className="glass-card" style={{ padding: "16px 20px", marginBottom: 20, overflowX: "auto" }}>
                    <div style={{ fontSize: 13, color: "rgba(243,211,122,0.85)", fontWeight: 700, marginBottom: 10 }}>
                      ⚡ {hi ? "अपनी वर्तमान समस्या अथवा चिंता का विषय चुनें:" : "Select Your Current Active Challenge or Concern:"}
                    </div>
                    <div style={{ display: "flex", gap: 10, minWidth: "max-content", flexWrap: "wrap" }}>
                      {LIFE_PROBLEMS_LIST.map(p => {
                        const isSelected = activeProblemId === p.id;
                        return (
                          <button
                            key={p.id}
                            onClick={() => setActiveProblemId(p.id)}
                            style={{
                              background: isSelected ? "linear-gradient(135deg, #F59E0B, #D97706)" : "rgba(15,10,32,0.65)",
                              border: `1px solid ${isSelected ? "#F59E0B" : "rgba(212,175,55,0.25)"}`,
                              color: isSelected ? "#0F0A1E" : "#FDE68A",
                              padding: "10px 16px",
                              borderRadius: 12,
                              fontSize: 13.5,
                              fontWeight: isSelected ? 800 : 700,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              transition: "all 0.2s ease"
                            }}
                          >
                            <span style={{ fontSize: 18 }}>{p.icon}</span>
                            <span>{hi ? p.shortHi : p.shortEn}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Free Diagnostic Header Card */}
                  <div className="glass-card" style={{ padding: "26px 28px", marginBottom: 20 }}>
                    <div style={{ borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 16, marginBottom: 18 }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 12, padding: "4px 12px", color: "#FDE68A", fontSize: 12, fontWeight: 800, marginBottom: 6 }}>
                        <span>🛡️</span> {hi ? "वैदिक व लाल किताब समस्या विश्लेषण" : "VEDIC & LAL KITAB PROBLEM DIAGNOSTIC"}
                      </div>
                      <h3 style={{ color: "#F3D37A", fontSize: 20, fontWeight: 800, marginTop: 2 }}>
                        {activeRemedy.icon} {activeRemedy.problemTitle}
                      </h3>
                    </div>

                    {/* Astrological Root Cause Diagnostic (FREE) */}
                    <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.35)", borderRadius: 12, padding: "18px 20px", marginBottom: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#F87171", fontSize: 14, fontWeight: 800, marginBottom: 6 }}>
                        <span>🔍</span> {hi ? "ज्योतिषीय मूल कारण (Astrological Root Cause Diagnostic)" : "Astrological Root Cause Diagnostic"}
                      </div>
                      <p style={{ color: "rgba(241,231,208,0.92)", fontSize: 14, lineHeight: 1.75, margin: 0 }}>
                        {activeRemedy.rootCause}
                      </p>
                    </div>

                    {/* Free General Upay Teaser */}
                    <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span style={{ fontSize: 20 }}>🌿</span>
                      <div>
                        <div style={{ color: "#34D399", fontSize: 13.5, fontWeight: 700 }}>{hi ? "प्राथमिक दैनिक परामर्श (First Action Step):" : "Initial Daily Action Step:"}</div>
                        <div style={{ color: "rgba(241,231,208,0.9)", fontSize: 13.5, marginTop: 2 }}>{activeRemedy.dailyUpay[0] || "Maintain daily cleanliness and offer water to rising sun."}</div>
                      </div>
                    </div>
                  </div>

                  {/* ── PREMIUM LOCKED / BLURRED DEEP REMEDIAL PROTOCOL SECTION ── */}
                  <div style={{ position: "relative", marginBottom: 24 }}>
                    <div className="glass-card" style={{ padding: "28px 30px", filter: effectiveRemediesUnlocked ? "none" : "blur(5px)", pointerEvents: effectiveRemediesUnlocked ? "auto" : "none", userSelect: effectiveRemediesUnlocked ? "auto" : "none", transition: "all 0.3s ease" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 14, marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 22 }}>🕉️</span>
                          <h4 style={{ color: "#F3D37A", fontSize: 16.5, fontWeight: 800 }}>
                            {hi ? "सिद्ध बीज मंत्र, लाल किताब विधान व कवच (Confidential Remedial Dossier)" : "Sacred Beej Mantra, 3-Step Lal Kitab Ritual & Gemstone Shield"}
                          </h4>
                        </div>
                        {effectiveRemediesUnlocked && (
                          <div style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 12, padding: "3px 12px", color: "#34D399", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", gap: 4 }}>
                            <span>✓</span> {hi ? "उपाय गाइड अनलॉक है" : "Remedies Dossier Active"}
                          </div>
                        )}
                      </div>

                      {/* Sacred Beej Mantra & Japa Count */}
                      <div style={{ background: "linear-gradient(135deg, rgba(35,22,65,0.85), rgba(15,10,32,0.95))", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 14, padding: "20px 22px", marginBottom: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                          <div style={{ color: "#FDE68A", fontSize: 14, fontWeight: 800 }}>
                            🕉️ {hi ? "सिद्ध बीज मंत्र एवं जप विधि" : "Prescribed Sacred Beej Mantra & Timing"}
                          </div>
                          <div style={{ color: "#34D399", fontSize: 12.5, fontWeight: 700, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, padding: "3px 10px" }}>
                            ⏱️ {activeRemedy.mantraCount}
                          </div>
                        </div>
                        <div style={{ background: "rgba(0,0,0,0.5)", border: "1px dashed rgba(245,158,11,0.35)", borderRadius: 10, padding: "14px 18px", color: "#F3D37A", fontSize: 16, fontWeight: 800, letterSpacing: 0.5, lineHeight: 1.7, textAlign: "center" }}>
                          {activeRemedy.mantra}
                        </div>
                      </div>

                      {/* 3 Practical Daily Lal Kitab & Vedic Upay */}
                      <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 12, padding: "18px 20px", marginBottom: 20 }}>
                        <div style={{ color: "#34D399", fontSize: 14.5, fontWeight: 800, marginBottom: 10 }}>
                          🌿 {hi ? "नित्य सरल लाल किताब व वैदिक उपाय (Daily Action Steps)" : "3 Simple Daily Action Steps (Lal Kitab & Vedic)"}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
                          {activeRemedy.dailyUpay.map((upay, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                              <span style={{ color: "#FDE68A", fontSize: 16, marginTop: 1 }}>✦</span>
                              <span style={{ color: "rgba(241,231,208,0.92)", fontSize: 13.5, lineHeight: 1.7 }}>{upay}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Charity, Gem/Rudraksha & Vastu Grid */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginBottom: 18 }}>
                        <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: "16px 18px" }}>
                          <div style={{ color: "#FDE68A", fontSize: 13, fontWeight: 800, marginBottom: 4 }}>
                            🤲 {hi ? "दान एवं सेवा संकल्प (Charity & Daan)" : "Prescribed Charity & Daan"}
                          </div>
                          <p style={{ color: "rgba(241,231,208,0.85)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                            {activeRemedy.charity}
                          </p>
                        </div>

                        <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: "16px 18px" }}>
                          <div style={{ color: "#FDE68A", fontSize: 13, fontWeight: 800, marginBottom: 4 }}>
                            💎 {hi ? "रत्न, रुद्राक्ष एवं सुरक्षा कवच" : "Gemstone & Rudraksha Shield"}
                          </div>
                          <p style={{ color: "rgba(241,231,208,0.85)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                            {activeRemedy.gemRudraksha}
                          </p>
                        </div>

                        <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: "16px 18px" }}>
                          <div style={{ color: "#FDE68A", fontSize: 13, fontWeight: 800, marginBottom: 4 }}>
                            🏡 {hi ? "वास्तु एवं ऊर्जा शुद्धि (Vastu & Aura)" : "Home & Workplace Energy Alignment"}
                          </div>
                          <p style={{ color: "rgba(241,231,208,0.85)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                            {activeRemedy.vastuTip}
                          </p>
                        </div>
                      </div>

                      {/* 21-Day Sankalp Ritual Note */}
                      <div style={{ background: "rgba(245,158,11,0.08)", border: "1px dashed rgba(245,158,11,0.35)", borderRadius: 10, padding: "14px 16px", textAlign: "center", color: "rgba(241,231,208,0.9)", fontSize: 13 }}>
                        ✨ <b>{hi ? "२१-दिवसीय संकल्प नियम:" : "21-Day Sankalp Protocol:"}</b> {hi ? "उपरोक्त मंत्र व उपाय को लगातार २१ दिनों तक निष्ठापूर्वक करने से नकारात्मक ऊर्जा का शमन होकर शुभ फल प्रकट होने लगते हैं।" : "Practicing the prescribed mantra and daily upay consistently for 21 days creates a powerful protective aura and clears karmic obstructions."}
                      </div>

                      {effectiveRemediesUnlocked && (
                        <div style={{ textAlign: "center", paddingTop: 14 }}>
                          <button onClick={() => handlePrintReport("remedies")} className="gold-cta-btn" style={{ padding: "10px 22px", fontSize: 13.5 }}>
                            📄 {hi ? "उपाय PDF रिपोर्ट प्रिंट / सेव करें" : "Save / Print Remedies Dossier PDF"}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Paywall Overlay Banner (When Locked) */}
                    {!effectiveRemediesUnlocked && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(11,8,25,0.86)", backdropFilter: "blur(6px)", borderRadius: 16, border: "2px solid rgba(245,158,11,0.5)", padding: "26px 22px", textAlign: "center", zIndex: 10 }}>
                        <div style={{ fontSize: 38, marginBottom: 8 }}>🔒</div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 12, padding: "4px 14px", color: "#FDE68A", fontSize: 12, fontWeight: 800, marginBottom: 8 }}>
                          COMPLETE VEDIC DOSHA & REMEDIAL DOSSIER
                        </div>
                        <h3 style={{ color: "#F3D37A", fontSize: 19, fontWeight: 800, maxWidth: 540 }}>
                          {hi ? "सिद्ध बीज मंत्र, सम्पूर्ण लाल किताब उपाय एवं व्यक्तिगत सुरक्षा कवच अनलॉक करें" : "Unlock Sacred Beej Mantras, 3-Step Lal Kitab Shanti & Complete Remedial PDF"}
                        </h3>
                        <p style={{ color: "rgba(241,231,208,0.85)", fontSize: 14, maxWidth: 560, margin: "10px 0 18px", lineHeight: 1.6 }}>
                          {hi
                            ? "सभी ७ प्रमुख समस्याओं (करियर रुकावट, कर्ज मुक्ति, मानसिक तनाव, दांपत्य कलह, बुरी नजर निवारण) के सटीक तांत्रिक व वैदिक उपाय तुरंत प्राप्त करें।"
                            : "Get instant access to authentic energized Beej Mantras, Sade Sati & Rahu-Ketu Shanti, wealth attraction rituals, and custom gemstone shields."}
                        </p>
                        <button
                          onClick={() => setActiveCheckout({
                            title: hi ? "सम्पूर्ण वैदिक समस्या निवारण व लाल किताब उपाय (PDF)" : "Complete All-in-One Vedic & Lal Kitab Remedial Dossier PDF",
                            priceKey: "remediesReport",
                            price: unlockPrice,
                            desc: "Complete 7-issue remedial plans, Sade Sati peace rituals, and Yantra guidelines",
                            icon: "🛡️",
                            isRemediesUnlock: true
                          })}
                          className="gold-cta-btn"
                          style={{ padding: "14px 30px", fontSize: 15, fontWeight: 800, boxShadow: "0 6px 20px rgba(245,158,11,0.45)" }}
                        >
                          {hi ? `संपूर्ण उपाय गाइड अनलॉक करें (${unlockPrice}) ✦` : `Unlock Complete Remedies Dossier (${unlockPrice}) ✦`}
                        </button>
                        <div style={{ fontSize: 12, color: "rgba(243,211,122,0.75)", marginTop: 10, fontWeight: 600 }}>
                          🔒 Instant Lifetime Access + Printable PDF Dossier
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ── TAB: MARRIAGE AGE, TIMING & SPOUSE PREDICTION (FREEMIUM + PAID GATE) ── */}
            {tab === "marriageTiming" && (() => {
              const mp = result.marriagePrediction || calculateMarriagePrediction({
                name: form.name || "User",
                dob: form.dob || "1998-01-01",
                lagnaSign: result.lagnaSign,
                rashiSign: result.rashiSign,
                lang
              });
              const unlockPrice = PRODUCT_PRICES.marriageTimingReport[currency];

              return (
                <div>
                  {/* Top Free Vivah Overview Card */}
                  <div className="glass-card" style={{ padding: "26px 28px", marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 16, marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                      <div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 12, padding: "4px 12px", color: "#FDE68A", fontSize: 12, fontWeight: 800, marginBottom: 4 }}>
                          <span>💍</span> {hi ? "वैदिक विवाह आयु व योग गणना" : "PARASHARI VEDIC VIVAH YOG"}
                        </div>
                        <h3 style={{ color: "#F3D37A", fontSize: 19, fontWeight: 800, marginTop: 4 }}>
                          {form.name || "Native"} — {hi ? "विवाह समय, आयु एवं जीवनसाथी विश्लेषण" : "Marriage Timing, Age & Spouse Analysis"}
                        </h3>
                        <p style={{ color: "rgba(241,231,208,0.75)", fontSize: 13, marginTop: 3 }}>
                          {hi ? `सप्तम भाव राशि: ${mp.seventhSign} | भावेश: ${mp.seventhLord}` : `7th House Sign: ${mp.seventhSign} | 7th Lord: ${mp.seventhLord}`}
                        </p>
                      </div>

                      <div style={{ textAlign: "right", background: "rgba(11,8,25,0.6)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 12, padding: "10px 18px" }}>
                        <div style={{ fontSize: 12, color: "rgba(243,211,122,0.85)", fontWeight: 600 }}>{hi ? "विवाह योग प्रबलता" : "Vivah Alignment Score"}</div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: "#34D399" }}>{mp.probabilityScore}%</div>
                      </div>
                    </div>

                    {/* Free Highlights Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 22 }}>
                      {/* Probable Marriage Age */}
                      <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 12, padding: "18px 20px", textAlign: "center" }}>
                        <div style={{ fontSize: 22 }}>🎂</div>
                        <div style={{ fontSize: 12.5, color: "rgba(243,211,122,0.85)", fontWeight: 600, marginTop: 4 }}>
                          {hi ? "संभावित विवाह आयु (Marriage Age)" : "Probable Marriage Age Range"}
                        </div>
                        <div style={{ color: "#FDE68A", fontSize: 22, fontWeight: 800, marginTop: 4 }}>
                          {mp.ageRange}
                        </div>
                        <div style={{ fontSize: 12, color: "#34D399", fontWeight: 700, marginTop: 3 }}>
                          ✓ {hi ? "सप्तमेश व गुरु गोचर आधारित" : "Based on 7th Lord & Jupiter Transits"}
                        </div>
                      </div>

                      {/* Current Timing Phase */}
                      <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 12, padding: "18px 20px", textAlign: "center" }}>
                        <div style={{ fontSize: 22 }}>⚡</div>
                        <div style={{ fontSize: 12.5, color: "rgba(243,211,122,0.85)", fontWeight: 600, marginTop: 4 }}>
                          {hi ? "वर्तमान विवाह योग चरण" : "Current Vivah Yog Phase"}
                        </div>
                        <div style={{ color: "#34D399", fontSize: 16.5, fontWeight: 800, marginTop: 6 }}>
                          {mp.timingPhase}
                        </div>
                        <div style={{ fontSize: 12, color: "rgba(241,231,208,0.75)", marginTop: 3 }}>
                          {hi ? "विंशोत्तरी दशा व गोचर सक्रिय" : "Active Dasha & Planetary Influences"}
                        </div>
                      </div>

                      {/* 7th House / Spouse Aura */}
                      <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 12, padding: "18px 20px", textAlign: "center" }}>
                        <div style={{ fontSize: 22 }}>💖</div>
                        <div style={{ fontSize: 12.5, color: "rgba(243,211,122,0.85)", fontWeight: 600, marginTop: 4 }}>
                          {hi ? "सप्तम भाव व दांपत्य ऊर्जा" : "7th House Marital Energy"}
                        </div>
                        <div style={{ color: "#F3D37A", fontSize: 16.5, fontWeight: 800, marginTop: 6 }}>
                          {mp.seventhSign}
                        </div>
                        <div style={{ fontSize: 12, color: "rgba(241,231,208,0.75)", marginTop: 3 }}>
                          {hi ? `स्वामी ग्रह: ${mp.seventhLord}` : `Governed by ${mp.seventhLord}`}
                        </div>
                      </div>
                    </div>

                    {/* Free General Spouse Demeanor Teaser */}
                    <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 12, padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#34D399", fontSize: 14, fontWeight: 800, marginBottom: 6 }}>
                        <span>✨</span> {hi ? "जीवनसाथी का सामान्य स्वभाव (Spouse Nature Teaser)" : "Spouse Disposition & Compatibility Overview"}
                      </div>
                      <p style={{ color: "rgba(241,231,208,0.9)", fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>
                        {mp.spousePersonality}
                      </p>
                    </div>
                  </div>

                  {/* ── PREMIUM UNLOCKABLE / BLURRED DEEP REPORT SECTION ── */}
                  <div style={{ position: "relative", marginBottom: 24 }}>
                    <div className="glass-card" style={{ padding: "28px 30px", filter: effectiveMarriageUnlocked ? "none" : "blur(4px)", pointerEvents: effectiveMarriageUnlocked ? "auto" : "none", userSelect: effectiveMarriageUnlocked ? "auto" : "none", transition: "all 0.3s ease" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 14, marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 22 }}>📜</span>
                          <h4 style={{ color: "#F3D37A", fontSize: 16.5, fontWeight: 800 }}>
                            {hi ? "विस्तृत विवाह कालखंड, जीवनसाथी का पेशा व उपाय (Confidential Report)" : "Pinpoint Marriage Windows, Spouse Identity & Vedic Remedies"}
                          </h4>
                        </div>
                        {isAdmin && (
                          <div style={{ background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 12, padding: "3px 10px", color: "#FDE68A", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", gap: 4 }}>
                            <span>👑</span> {hi ? "एडमिन वीआईपी अनलॉक" : "Admin VIP Unlocked"}
                          </div>
                        )}
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 18 }}>
                        {/* Auspicious Marriage Years */}
                        <div style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: 16 }}>
                          <div style={{ fontSize: 12.5, color: "rgba(243,211,122,0.85)", fontWeight: 600 }}>📅 {hi ? "प्राथमिक शुभ विवाह कालखंड" : "Primary Auspicious Marriage Window"}</div>
                          <div style={{ color: "#34D399", fontSize: 16, fontWeight: 800, marginTop: 4 }}>{mp.primaryWindow}</div>
                          <div style={{ fontSize: 12.5, color: "rgba(241,231,208,0.75)", marginTop: 3 }}>{hi ? `द्वितीयक काल: ${mp.secondaryWindow}` : `Secondary: ${mp.secondaryWindow}`}</div>
                        </div>

                        {/* Peak Auspicious Months */}
                        <div style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: 16 }}>
                          <div style={{ fontSize: 12.5, color: "rgba(243,211,122,0.85)", fontWeight: 600 }}>🌟 {hi ? "सर्वोत्तम विवाह लग्न माह" : "Peak Favorable Vivah Months"}</div>
                          <div style={{ color: "#FDE68A", fontSize: 15, fontWeight: 800, marginTop: 4 }}>{mp.peakMonths}</div>
                          <div style={{ fontSize: 12.5, color: "rgba(241,231,208,0.75)", marginTop: 3 }}>{hi ? "गुरु एवं शुक्र शुभ दृष्टि" : "Aligned with Jupiter & Venus Transits"}</div>
                        </div>

                        {/* Spouse Career Field */}
                        <div style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: 16 }}>
                          <div style={{ fontSize: 12.5, color: "rgba(243,211,122,0.85)", fontWeight: 600 }}>💼 {hi ? "जीवनसाथी का संभावित कार्यक्षेत्र / पेशा" : "Spouse Likely Career Field"}</div>
                          <div style={{ color: "#F3D37A", fontSize: 15, fontWeight: 800, marginTop: 4 }}>{mp.spouseProfession}</div>
                        </div>

                        {/* Spouse Direction & Name Initials */}
                        <div style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: 16 }}>
                          <div style={{ fontSize: 12.5, color: "rgba(243,211,122,0.85)", fontWeight: 600 }}>🧭 {hi ? "जीवनसाथी के मूल स्थान की दिशा व नामाक्षर" : "Spouse Direction & Name Letters"}</div>
                          <div style={{ color: "#FDE68A", fontSize: 15, fontWeight: 800, marginTop: 4 }}>
                            {mp.spouseDirection} · <span style={{ color: "#34D399" }}>({mp.spouseNameLetters})</span>
                          </div>
                        </div>
                      </div>

                      {/* Obstacle Analysis & Remedies */}
                      <div style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                        <div style={{ fontSize: 13, color: "#F87171", fontWeight: 800, marginBottom: 6 }}>
                          ⚠️ {hi ? "विवाह में विलंब / बाधा विश्लेषण (Kalyana Dosha Check)" : "Delay & Obstacle Diagnostic"}
                        </div>
                        <p style={{ color: "rgba(241,231,208,0.9)", fontSize: 13.5, lineHeight: 1.75, margin: 0 }}>
                          {mp.obstacleAnalysis}
                        </p>
                      </div>

                      <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 10, padding: 16 }}>
                        <div style={{ fontSize: 13, color: "#FDE68A", fontWeight: 800, marginBottom: 8 }}>
                          🛡️ {hi ? "शीघ्र व कल्याणकारी विवाह हेतु अचूक वैदिक उपाय (Prescribed Upay)" : "Sacred Vedic Vivah Remedies & Mantras"}
                        </div>
                        <div style={{ color: "rgba(241,231,208,0.92)", fontSize: 13.5, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                          {mp.remedies}
                        </div>
                      </div>

                      {effectiveMarriageUnlocked && (
                        <div style={{ textAlign: "center", paddingTop: 14 }}>
                          <button onClick={() => handlePrintReport("marriage")} className="gold-cta-btn" style={{ padding: "10px 22px", fontSize: 13.5 }}>
                            📄 {hi ? "विवाह PDF रिपोर्ट प्रिंट / सेव करें" : "Save / Print Marriage Report PDF"}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Paywall Overlay Banner (When Locked) */}
                    {!effectiveMarriageUnlocked && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(11,8,25,0.84)", backdropFilter: "blur(6px)", borderRadius: 16, border: "2px solid rgba(245,158,11,0.5)", padding: "26px 22px", textAlign: "center", zIndex: 10 }}>
                        <div style={{ fontSize: 38, marginBottom: 8 }}>🔒</div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 12, padding: "4px 14px", color: "#FDE68A", fontSize: 12, fontWeight: 800, marginBottom: 8 }}>
                          PREMIUM VIVAH REPORT
                        </div>
                        <h3 style={{ color: "#F3D37A", fontSize: 19, fontWeight: 800, maxWidth: 520 }}>
                          {hi ? "विवाह के सटीक वर्ष, जीवनसाथी का पेशा, नामाक्षर व अचूक उपाय अनलॉक करें" : "Unlock Exact Auspicious Marriage Dates, Spouse Career, Direction & Vedic Upay"}
                        </h3>
                        <p style={{ color: "rgba(241,231,208,0.85)", fontSize: 14, maxWidth: 540, margin: "10px 0 18px", lineHeight: 1.6 }}>
                          {hi
                            ? "जानें किस महीने में बन रहा है सबसे मजबूत विवाह योग, जीवनसाथी किस क्षेत्र में कार्यरत होगा, और विवाह में आ रही रुकावटों को दूर करने के वैदिक समाधान।"
                            : "Discover your exact high-probability wedding dates, spouse's profession & origin, delay diagnosis, and sacred Vedic mantras for a prosperous union."}
                        </p>
                        <button
                          onClick={() => setActiveCheckout({
                            title: hi ? "विस्तृत विवाह भविष्यवाणी व जीवनसाथी रिपोर्ट (PDF)" : "Complete Marriage Timing & Spouse Prediction Report",
                            priceKey: "marriageTimingReport",
                            price: unlockPrice,
                            desc: "Pinpoint marriage dates, spouse profession, birthplace direction & Vedic remedies",
                            icon: "💍",
                            isMarriageUnlock: true
                          })}
                          className="gold-cta-btn"
                          style={{ padding: "14px 30px", fontSize: 15, fontWeight: 800, boxShadow: "0 6px 20px rgba(245,158,11,0.45)" }}
                        >
                          {hi ? `संपूर्ण रिपोर्ट अनलॉक करें (${unlockPrice}) ✦` : `Unlock Complete Marriage Report (${unlockPrice}) ✦`}
                        </button>
                        <div style={{ fontSize: 12, color: "rgba(243,211,122,0.75)", marginTop: 10, fontWeight: 600 }}>
                          🔒 Instant Lifetime Access + Printable PDF
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ── TAB: HINDU PANCHANG ── */}
            {tab === "panchang" && renderPanchangContent()}

            {/* ── TAB: SHUBH MUHURAT ── */}
            {tab === "muhurat" && renderMuhuratContent()}

            {/* ── TAB: FESTIVALS & VRAT ── */}
            {tab === "festivals" && renderFestivalsContent()}

            {/* ── TAB: DAILY HOROSCOPE & RECURRING MESSENGER SUBSCRIPTION ── */}
            {tab === "daily" && (() => {
              const daily = generateDailyHoroscope(dailySign, lang);
              const stars = (num) => "★".repeat(num) + "☆".repeat(5 - num);
              const activePrice = dailyPlan === "yearly" ? PRODUCT_PRICES.dailyYearly[currency] : PRODUCT_PRICES.dailyMonthly[currency];
              const activePriceKey = dailyPlan === "yearly" ? "dailyYearly" : "dailyMonthly";

              return (
                <div>
                  {/* Zodiac Sign Carousel / Pills */}
                  <div className="glass-card" style={{ padding: "16px 20px", marginBottom: 20, overflowX: "auto" }}>
                    <div style={{ display: "flex", gap: 10, minWidth: "max-content" }}>
                      {SIGNS.map(s => {
                        const isSelected = dailySign.toLowerCase() === s.name.toLowerCase();
                        return (
                          <button
                            key={s.name}
                            onClick={() => setDailySign(s.name)}
                            style={{
                              background: isSelected ? "linear-gradient(135deg, #F59E0B, #D97706)" : "rgba(15,10,32,0.65)",
                              border: `1px solid ${isSelected ? "#F59E0B" : "rgba(212,175,55,0.25)"}`,
                              color: isSelected ? "#0F0A1E" : "#FDE68A",
                              padding: "10px 16px",
                              borderRadius: 12,
                              fontSize: 13.5,
                              fontWeight: isSelected ? 800 : 700,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              transition: "all 0.2s ease"
                            }}
                          >
                            <span style={{ fontSize: 18 }}>{s.symbol}</span>
                            <span>{hi ? s.sanskrit : s.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Main Daily Horoscope Card */}
                  <div className="glass-card" style={{ padding: "28px 30px", marginBottom: 20 }}>
                    {/* Header with Alignment Score */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 16, marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                      <div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 12, padding: "4px 12px", color: "#FDE68A", fontSize: 12, fontWeight: 800, marginBottom: 4 }}>
                          <span>📅</span> {daily.dateStr}
                        </div>
                        <h3 style={{ color: "#F3D37A", fontSize: 19, fontWeight: 800, marginTop: 2 }}>
                          {daily.symbol} {daily.sign} ({daily.signSanskrit}) — {hi ? "आज का विस्तृत राशिफल" : "Today's Vedic Transit Reading"}
                        </h3>
                      </div>

                      <div style={{ textAlign: "right", background: "rgba(11,8,25,0.6)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 12, padding: "10px 18px" }}>
                        <div style={{ fontSize: 12, color: "rgba(243,211,122,0.85)", fontWeight: 600 }}>{hi ? "दैनिक ग्रहीय अनुकूलता" : "Cosmic Harmony Score"}</div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: "#34D399" }}>{daily.overallScore}%</div>
                      </div>
                    </div>

                    {/* 4 Category Ratings Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 22 }}>
                      {[
                        { name: hi ? "करियर व व्यवसाय" : "Career & Work", score: daily.careerScore, icon: "💼", color: "#60A5FA" },
                        { name: hi ? "प्रेम व दांपत्य" : "Love & Family", score: daily.loveScore, icon: "❤️", color: "#F472B6" },
                        { name: hi ? "धन व समृद्धि" : "Wealth & Gains", score: daily.wealthScore, icon: "💰", color: "#FBBF24" },
                        { name: hi ? "स्वास्थ्य व ऊर्जा" : "Health & Vitality", score: daily.healthScore, icon: "🌿", color: "#34D399" },
                      ].map((cat, idx) => (
                        <div key={idx} style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
                          <div style={{ fontSize: 18 }}>{cat.icon}</div>
                          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#FDE68A", marginTop: 3 }}>{cat.name}</div>
                          <div style={{ fontSize: 15, color: cat.color, marginTop: 4 }}>{stars(cat.score)}</div>
                        </div>
                      ))}
                    </div>

                    {/* What Will Go Good & What to be Cautious About (2 Column Split) */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 20 }}>
                      {/* 🟢 Positive / Opportunities */}
                      <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 12, padding: "18px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#34D399", fontSize: 14, fontWeight: 800, marginBottom: 8 }}>
                          <span>🟢</span> {hi ? "आज क्या शुभ रहेगा (Opportunities & Wins)" : "What Will Go Good Today"}
                        </div>
                        <p style={{ color: "rgba(241,231,208,0.9)", fontSize: 14, lineHeight: 1.75, margin: 0 }}>
                          {daily.good}
                        </p>
                      </div>

                      {/* 🔴 Cautionary Advice / Pitfalls */}
                      <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.35)", borderRadius: 12, padding: "18px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#F87171", fontSize: 14, fontWeight: 800, marginBottom: 8 }}>
                          <span>🔴</span> {hi ? "सावधानियां व चेतावनी (Alerts & Caution)" : "What to Watch Out For & Avoid"}
                        </div>
                        <p style={{ color: "rgba(241,231,208,0.9)", fontSize: 14, lineHeight: 1.75, margin: 0 }}>
                          {daily.caution}
                        </p>
                      </div>
                    </div>

                    {/* 🛡️ Daily Vedic Remedy & Sacred Mantra */}
                    <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.35)", borderRadius: 12, padding: "18px 20px", marginBottom: 20 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#FDE68A", fontSize: 14, fontWeight: 800, marginBottom: 8 }}>
                        <span>🛡️</span> {hi ? "आज का अचूक वैदिक उपाय व बीज मंत्र (Daily Upay)" : "Prescribed Vedic Remedy & Mantra of the Day"}
                      </div>
                      <p style={{ color: "rgba(241,231,208,0.92)", fontSize: 14, lineHeight: 1.75, margin: 0 }}>
                        {daily.remedy}
                      </p>
                    </div>

                    {/* 🎨 Daily Micro-Muhurat Card */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 12, padding: "16px 18px" }}>
                      <div>
                        <div style={{ fontSize: 12.5, color: "rgba(243,211,122,0.85)", fontWeight: 600 }}>🎨 {hi ? "भाग्यशाली रंग" : "Lucky Color"}</div>
                        <div style={{ color: "#FDE68A", fontSize: 14.5, fontWeight: 800, marginTop: 2 }}>{daily.luckyColor}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12.5, color: "rgba(243,211,122,0.85)", fontWeight: 600 }}>🔢 {hi ? "भाग्यशाली अंक" : "Lucky Number"}</div>
                        <div style={{ color: "#34D399", fontSize: 15, fontWeight: 800, marginTop: 2 }}>{daily.luckyNumber}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12.5, color: "rgba(243,211,122,0.85)", fontWeight: 600 }}>⏳ {hi ? "शुभ अभिजीत मुहूर्त" : "Auspicious Muhurat Window"}</div>
                        <div style={{ color: "#F3D37A", fontSize: 14, fontWeight: 800, marginTop: 2 }}>{daily.auspiciousWindow}</div>
                      </div>
                    </div>
                  </div>

                  {/* ── HIGH-CONVERTING WHATSAPP / EMAIL SUBSCRIPTION CARD ── */}
                  <div className="glass-card" style={{ padding: "28px 30px", background: "linear-gradient(135deg, rgba(26,18,48,0.95), rgba(11,8,25,0.98))", border: "1.5px solid rgba(245,158,11,0.5)", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, background: "radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />

                    {effectiveDailySubscribed ? (
                      <div style={{ textAlign: "center", padding: "10px 0" }}>
                        <span style={{ fontSize: 44 }}>👑</span>
                        <h3 style={{ color: "#34D399", fontSize: 20, fontWeight: 800, marginTop: 6 }}>
                          {hi ? "आपकी दैनिक राशिफल सदस्यता सक्रिय है!" : "VIP Daily Horoscope Subscription Active!"}
                        </h3>
                        {isAdmin && (
                          <div style={{ display: "inline-block", background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 12, padding: "3px 12px", color: "#FDE68A", fontSize: 12, fontWeight: 800, marginTop: 4 }}>
                            👑 Admin VIP Pass Active
                          </div>
                        )}
                        <p style={{ color: "rgba(241,231,208,0.88)", fontSize: 14, marginTop: 6, maxWidth: 540, margin: "8px auto 18px", lineHeight: 1.6 }}>
                          {hi
                            ? `आपकी राशि (${dailySign}) के लिए दैनिक अलर्ट, शुभ मुहूर्त व उपाय आपके चयनित मैसेंजर पर नित्य प्रातः 7:00 बजे भेजे जा रहे हैं।`
                            : `Personalized daily alerts, favorable muhurats & remedies for ${dailySign} are scheduled to your messenger every morning at 7:00 AM.`}
                        </p>
                        <a
                          href="https://wa.me/918094199663?text=Hi%20Jyotish%20Kundli%2C%20I%20am%20a%20subscribed%20user.%20Please%20verify%20my%20daily%20horoscope%20delivery."
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            background: "#25D366",
                            color: "#0F0A1E",
                            padding: "12px 24px",
                            borderRadius: 10,
                            fontSize: 14,
                            fontWeight: 800,
                            textDecoration: "none"
                          }}
                        >
                          <span>💬</span> Connect with WhatsApp Bot / Support
                        </a>
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
                          <div>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 12, padding: "4px 12px", color: "#FDE68A", fontSize: 12, fontWeight: 800, marginBottom: 6 }}>
                              <span>⚡</span> {hi ? "नियमित राशिफल सेवा" : "AUTOMATED MESSENGER DELIVERY"}
                            </div>
                            <h3 style={{ color: "#F3D37A", fontSize: 19, fontWeight: 800 }}>
                              {hi ? "📲 व्हाट्सएप पर नित्य प्रातः दैनिक राशिफल प्राप्त करें" : "📲 Get Your Personalized Daily Horoscope on WhatsApp / Email"}
                            </h3>
                            <p style={{ color: "rgba(241,231,208,0.85)", fontSize: 14, marginTop: 4, maxWidth: 640, lineHeight: 1.6 }}>
                              {hi
                                ? "दिन की शुरुआत से पहले जानें — आज क्या होगा शुभ, क्या सावधानियां रखनी हैं, और कौन सा समय सबसे फलदायी है। सीधे अपने व्हाट्सएप या ईमेल पर।"
                                : "Wake up with cosmic clarity: Auspicious hours, cautionary alerts, lucky numbers, and daily customized Vedic remedies delivered directly to your chat every morning."}
                            </p>
                          </div>
                        </div>

                        {/* Feature bullets */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, marginBottom: 18 }}>
                          {[
                            { icon: "🌅", titleEn: "Daily 7:00 AM Delivery", titleHi: "प्रातः 7:00 बजे सीधा प्रसारण" },
                            { icon: "🛡️", titleEn: "Customized Daily Upay", titleHi: "राशि अनुसार नित्य अचूक उपाय" },
                            { icon: "⏳", titleEn: "Abhijit Muhurat Timings", titleHi: "शुभ मुहूर्त व राहुकाल अलर्ट" },
                          ].map((f, i) => (
                            <div key={i} style={{ background: "rgba(11,8,25,0.6)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 18 }}>{f.icon}</span>
                              <span style={{ color: "#FDE68A", fontSize: 13, fontWeight: 700 }}>{hi ? f.titleHi : f.titleEn}</span>
                            </div>
                          ))}
                        </div>

                        {/* Delivery Customizer Controls */}
                        <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 12, padding: "18px 20px", marginBottom: 18 }}>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                            {/* Channel Picker */}
                            <div>
                              <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#FDE68A", marginBottom: 8 }}>
                                {hi ? "डिलीवरी माध्यम चुनें:" : "Choose Delivery Channel:"}
                              </label>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                                {[
                                  { id: "whatsapp", name: "WhatsApp", icon: "📱" },
                                  { id: "email", name: "Email", icon: "✉️" },
                                  { id: "telegram", name: "Telegram", icon: "✈️" },
                                ].map(ch => (
                                  <button
                                    key={ch.id}
                                    onClick={() => setDailyChannel(ch.id)}
                                    style={{
                                      background: dailyChannel === ch.id ? "rgba(245,158,11,0.2)" : "rgba(0,0,0,0.5)",
                                      border: `1px solid ${dailyChannel === ch.id ? "#F59E0B" : "rgba(212,175,55,0.2)"}`,
                                      color: dailyChannel === ch.id ? "#FDE68A" : "#FFF",
                                      borderRadius: 8,
                                      padding: "10px 6px",
                                      fontSize: 12.5,
                                      fontWeight: 700,
                                      cursor: "pointer"
                                    }}
                                  >
                                    <div style={{ fontSize: 16 }}>{ch.icon}</div>
                                    <div style={{ marginTop: 2 }}>{ch.name}</div>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Preferred Delivery Time */}
                            <div>
                              <label htmlFor="daily-delivery-time-select" style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#FDE68A", marginBottom: 8 }}>
                                {hi ? "प्राप्ति समय (Delivery Time):" : "Preferred Time:"}
                              </label>
                              <select
                                id="daily-delivery-time-select"
                                aria-label={t.deliveryTimeLabel}
                                value={dailyTime}
                                onChange={e => setDailyTime(e.target.value)}
                                style={{
                                  width: "100%",
                                  background: "rgba(0,0,0,0.6)",
                                  border: "1px solid rgba(212,175,55,0.3)",
                                  borderRadius: 8,
                                  padding: "11px 14px",
                                  color: "#FFF",
                                  fontSize: 13.5,
                                  fontWeight: 600,
                                  outline: "none"
                                }}
                              >
                                <option value="07:00 AM" style={{ background: "#0B0819" }}>{hi ? "🌅 07:00 AM (सूर्योदय - अनुशंसित)" : "🌅 07:00 AM (Morning Sunrise - Recommended)"}</option>
                                <option value="06:00 AM" style={{ background: "#0B0819" }}>{hi ? "🌄 06:00 AM (प्रातः काल)" : "🌄 06:00 AM (Early Morning Riser)"}</option>
                                <option value="08:00 PM" style={{ background: "#0B0819" }}>{hi ? "🌙 08:00 PM (एक शाम पूर्व पूर्वावलोकन)" : "🌙 08:00 PM (Night Before Preview)"}</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Subscription Plan Switcher (Monthly vs Yearly) */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                          {/* Yearly Plan */}
                          <div
                            onClick={() => setDailyPlan("yearly")}
                            style={{
                              background: dailyPlan === "yearly" ? "rgba(245,158,11,0.18)" : "rgba(11,8,25,0.6)",
                              border: `2px solid ${dailyPlan === "yearly" ? "#F59E0B" : "rgba(212,175,55,0.2)"}`,
                              borderRadius: 12,
                              padding: "16px 18px",
                              cursor: "pointer",
                              position: "relative",
                              transition: "all 0.2s ease"
                            }}
                          >
                            <div style={{ position: "absolute", top: -10, right: 12, background: "linear-gradient(90deg, #F59E0B, #D97706)", color: "#0F0A1E", padding: "3px 10px", borderRadius: 10, fontSize: 11, fontWeight: 800 }}>
                              BEST VALUE · 60% OFF
                            </div>
                            <div style={{ color: "#FDE68A", fontSize: 14, fontWeight: 700 }}>
                              {hi ? "वार्षिक सदस्यता (Yearly Pass)" : "1-Year VIP Subscription"}
                            </div>
                            <div style={{ color: "#34D399", fontSize: 22, fontWeight: 800, marginTop: 4 }}>
                              {PRODUCT_PRICES.dailyYearly[currency]} <span style={{ fontSize: 12, color: "rgba(241,231,208,0.7)", fontWeight: 500 }}>/ year</span>
                            </div>
                            <div style={{ fontSize: 12, color: "rgba(241,231,208,0.75)", marginTop: 3 }}>
                              {hi ? "पूरे 365 दिन दैनिक मार्गदर्शन" : "365 Days of daily alerts & remedies"}
                            </div>
                          </div>

                          {/* Monthly Plan */}
                          <div
                            onClick={() => setDailyPlan("monthly")}
                            style={{
                              background: dailyPlan === "monthly" ? "rgba(245,158,11,0.18)" : "rgba(11,8,25,0.6)",
                              border: `2px solid ${dailyPlan === "monthly" ? "#F59E0B" : "rgba(212,175,55,0.2)"}`,
                              borderRadius: 12,
                              padding: "16px 18px",
                              cursor: "pointer",
                              transition: "all 0.2s ease"
                            }}
                          >
                            <div style={{ color: "#FDE68A", fontSize: 14, fontWeight: 700 }}>
                              {hi ? "मासिक सदस्यता (Monthly Pass)" : "Monthly Subscription"}
                            </div>
                            <div style={{ color: "#FFF", fontSize: 22, fontWeight: 800, marginTop: 4 }}>
                              {PRODUCT_PRICES.dailyMonthly[currency]} <span style={{ fontSize: 12, color: "rgba(241,231,208,0.7)", fontWeight: 500 }}>/ month</span>
                            </div>
                            <div style={{ fontSize: 12, color: "rgba(241,231,208,0.75)", marginTop: 3 }}>
                              {hi ? "माह-दर-माह नवीकरणीय" : "Cancel or renew anytime"}
                            </div>
                          </div>
                        </div>

                        {/* CTA Button */}
                        <button
                          onClick={() => setActiveCheckout({
                            title: dailyPlan === "yearly"
                              ? `${dailySign} — 1-Year Daily Horoscope Subscription (${dailyChannel.toUpperCase()})`
                              : `${dailySign} — Monthly Daily Horoscope Subscription (${dailyChannel.toUpperCase()})`,
                            priceKey: activePriceKey,
                            price: activePrice,
                            desc: `Daily delivery to ${dailyChannel.toUpperCase()} at ${dailyTime} with custom remedies & alerts`,
                            icon: "☀️",
                            isDailySub: true
                          })}
                          className="gold-cta-btn"
                          style={{ width: "100%", padding: "15px 22px", fontSize: 15, fontWeight: 800 }}
                        >
                          {hi
                            ? `सदस्यता लें (${activePrice}) — व्हाट्सएप पर शुरू करें ✦`
                            : `Subscribe Now (${activePrice}) — Start Daily Delivery ✦`}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ── TAB 3: 2026–2027 ANNUAL FORECAST (REVENUE MAGNET) ── */}
            {tab === "forecast" && (
              <div>
                <div className="glass-card" style={{ padding: "28px 30px", marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                    <div>
                      <h3 style={{ color: "#F3D37A", fontSize: 18, fontWeight: 800 }}>
                        📅 {hi ? "वर्ष 2026–2027 वार्षिक गोचर एवं भविष्यवाणी" : "2026–2027 Annual Transit & Planetary Forecast"}
                      </h3>
                      <p style={{ color: "rgba(241,231,208,0.75)", fontSize: 13, marginTop: 2 }}>
                        {hi ? `मूल नक्षत्र: ${result.nakshatra} | चंद्र राशि: ${result.rashi}` : `Natal Nakshatra: ${result.nakshatra} | Moon: ${result.rashi}`}
                      </p>
                    </div>
                    <span style={{ padding: "6px 14px", borderRadius: 14, background: "rgba(245,158,11,0.15)", color: "#FDE68A", fontSize: 13, fontWeight: 700, border: "1px solid rgba(245,158,11,0.35)" }}>
                      {result.annualTransit.sadeSatiStatus}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 24 }}>
                    {result.annualTransit.transits.map((tr, i) => (
                      <div key={i} style={{ background: "rgba(15,10,32,0.7)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 12, padding: "16px 18px" }}>
                        <div style={{ color: "#FDE68A", fontSize: 14.5, fontWeight: 800, marginBottom: 4 }}>{tr.planet} in {tr.sign}</div>
                        <div style={{ color: "rgba(241,231,208,0.88)", fontSize: 13.5, lineHeight: 1.65 }}>{tr.effect}</div>
                      </div>
                    ))}
                  </div>

                  <h4 style={{ color: "#F3D37A", fontSize: 15.5, fontWeight: 800, marginBottom: 14 }}>
                    ⚡ {hi ? "त्रैमासिक स्कोरकार्ड (Quarterly Milestones)" : "Quarterly Life Milestones"}
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 22 }}>
                    {result.annualTransit.quarters.map((q, i) => (
                      <div key={i} style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: "14px 16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{ color: "#FDE68A", fontSize: 13.5, fontWeight: 800 }}>{q.quarter}</span>
                          <span style={{ color: "#34D399", fontSize: 12.5, fontWeight: 800 }}>{q.rating}</span>
                        </div>
                        <div style={{ color: "#F3D37A", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{q.theme}</div>
                        <div style={{ color: "rgba(241,231,208,0.85)", fontSize: 12.5, lineHeight: 1.55 }}>{q.impact}</div>
                      </div>
                    ))}
                  </div>

                  {/* Upsell to PDF */}
                  <div style={{ textAlign: "center", padding: "18px", background: "rgba(245,158,11,0.08)", border: "1px dashed rgba(245,158,11,0.4)", borderRadius: 12 }}>
                    <div style={{ color: "#FDE68A", fontSize: 14.5, fontWeight: 800, marginBottom: 6 }}>
                      {hi ? "महीने-दर-महीने संपूर्ण 2026-2027 PDF रिपोर्ट डाउनलोड करें" : "Download Full 2026-2027 Month-by-Month Forecast PDF"}
                    </div>
                    <button
                      onClick={() => setActiveCheckout({
                        title: "2026-2027 Annual Transit Forecast PDF",
                        priceKey: "annualReport",
                        price: PRODUCT_PRICES.annualReport[currency],
                        desc: "Detailed monthly predictions, wealth windows & auspicious dates",
                        icon: "📅"
                      })}
                      style={{ marginTop: 8, background: "linear-gradient(90deg, #F59E0B, #D97706)", border: "none", color: "#0F0A1E", padding: "10px 22px", borderRadius: 8, fontSize: 13.5, fontWeight: 800, cursor: "pointer" }}
                    >
                      {hi ? "पूर्ण रिपोर्ट प्राप्त करें" : "Get Full PDF"} ({PRODUCT_PRICES.annualReport[currency]})
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 4: KUNDLI MILAN (GUN MILAN 36 POINTS) ── */}
            {tab === "matchmaking" && (
              <div className="glass-card" style={{ padding: "28px 26px", marginBottom: 20 }}>
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <span style={{ fontSize: 34 }}>❤️</span>
                  <h3 style={{ color: "#F3D37A", fontSize: 18, fontWeight: 800, marginTop: 4 }}>
                    {hi ? "वैदिक कुंडली मिलान (अष्टकूट ३६ गुण मिलान)" : "Vedic Kundli Matchmaking (Ashtakoot 36 Gunas)"}
                  </h3>
                  <p style={{ color: "rgba(241,231,208,0.75)", fontSize: 13, marginTop: 2 }}>
                    {hi ? `प्रथम जातक: ${form.name || "User"} (चंद्र राशि: ${result.rashi})` : `Primary Native: ${form.name || "User"} (Moon: ${result.rashi})`}
                  </p>
                </div>

                {/* Partner Form */}
                <div style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 12, padding: "20px 22px", marginBottom: 20 }}>
                  <h4 style={{ color: "#FDE68A", fontSize: 14.5, fontWeight: 800, marginBottom: 14 }}>
                    {t.partnerFormTitle}
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
                    <div>
                      <label htmlFor="partner-name-input" style={{ fontSize: 12.5, color: "#FDE68A", display: "block", marginBottom: 6, fontWeight: 700 }}>
                        {t.partnerName} *
                      </label>
                      <input
                        id="partner-name-input"
                        name="partnerName"
                        required
                        aria-required="true"
                        aria-label={t.partnerName}
                        placeholder={hi ? "उदा. प्रिया शर्मा" : "e.g. Priya Sharma"}
                        value={partnerForm.name}
                        onChange={e => setPartnerForm({ ...partnerForm, name: e.target.value })}
                        style={{ width: "100%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 8, padding: "10px 14px", color: "#FFF", fontSize: 14 }}
                      />
                    </div>
                    <div>
                      <label htmlFor="partner-dob-input" style={{ fontSize: 12.5, color: "#FDE68A", display: "block", marginBottom: 6, fontWeight: 700 }}>
                        {t.partnerDob} *
                      </label>
                      <input
                        id="partner-dob-input"
                        name="partnerDob"
                        type="date"
                        required
                        aria-required="true"
                        aria-label={t.partnerDob}
                        value={partnerForm.dob}
                        onChange={e => setPartnerForm({ ...partnerForm, dob: e.target.value })}
                        style={{ width: "100%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 8, padding: "10px 14px", color: "#FFF", fontSize: 14, colorScheme: "dark" }}
                      />
                    </div>
                    <div>
                      <label htmlFor="partner-tob-input" style={{ fontSize: 12.5, color: "#FDE68A", display: "block", marginBottom: 6, fontWeight: 700 }}>
                        {t.partnerTob} <span style={{ fontSize: 11.5, color: "rgba(243,211,122,0.8)", fontWeight: 500 }}>{t.partnerTobHelp}</span>
                      </label>
                      <input
                        id="partner-tob-input"
                        name="partnerTob"
                        type="time"
                        aria-label={t.partnerTob}
                        value={partnerForm.tob}
                        onChange={e => setPartnerForm({ ...partnerForm, tob: e.target.value })}
                        style={{ width: "100%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 8, padding: "10px 14px", color: "#FFF", fontSize: 14, colorScheme: "dark" }}
                      />
                    </div>
                  </div>
                  <button onClick={handleRunGunMilan} className="gold-cta-btn" style={{ marginTop: 16, padding: "12px 20px", fontSize: 14 }}>
                    {t.calculateMatchBtn}
                  </button>
                </div>

                {/* Gun Milan Results */}
                {milanResult && (
                  <div style={{ background: "rgba(15,10,32,0.9)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 14, padding: "22px 24px", animation: "fadeInCard 0.4s ease" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(212,175,55,0.25)", paddingBottom: 16, marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                      <div>
                        <div style={{ fontSize: 13, color: "rgba(241,231,208,0.8)" }}>
                          {milanResult.p1.name} ({hi ? (milanResult.p1.signHi || milanResult.p1.sign) : milanResult.p1.sign}) × {milanResult.p2.name} ({hi ? (milanResult.p2.signHi || milanResult.p2.sign) : milanResult.p2.sign})
                        </div>
                        <h4 style={{ color: "#F3D37A", fontSize: 17, fontWeight: 800, marginTop: 2 }}>
                          {hi ? milanResult.verdictHi : milanResult.verdict}
                        </h4>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 26, fontWeight: 800, color: Number(milanResult.totalGunas) >= 18 ? "#34D399" : "#F87171" }}>
                          {milanResult.totalGunas} / {milanResult.maxGunas}
                        </div>
                        <div style={{ fontSize: 12, color: "rgba(243,211,122,0.85)", fontWeight: 600 }}>
                          {milanResult.percentage}% {hi ? "मिलान स्कोर" : "Match Score"}
                        </div>
                      </div>
                    </div>

                    {/* Kootas Breakdown */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 18 }}>
                      {milanResult.kootas.map((k, idx) => (
                        <div key={idx} style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.18)", borderRadius: 8, padding: "12px 14px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 800, color: "#FDE68A" }}>
                            <span>{hi ? (k.nameHi || k.name) : k.name}</span>
                            <span>{k.score}/{k.max}</span>
                          </div>
                          <div style={{ fontSize: 11.5, color: "rgba(241,231,208,0.75)", marginTop: 3 }}>
                            {hi ? (k.descHi || k.desc) : k.desc}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Manglik status */}
                    <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8, padding: "12px 16px", fontSize: 13.5, color: "#FDE68A", marginBottom: 18 }}>
                      🔥 <b>{hi ? "मांगलिक स्थिति व सामंजस्य:" : "Manglik Alignment:"}</b> {hi ? (milanResult.manglikStatusHi || milanResult.manglikStatus) : milanResult.manglikStatus}
                    </div>

                    {/* Pro compatibility report unlock */}
                    <div style={{ textAlign: "center", padding: "16px", background: "rgba(35,22,65,0.8)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 10 }}>
                      <div style={{ color: "#F3D37A", fontSize: 14.5, fontWeight: 800 }}>
                        {hi ? "विस्तृत दांपत्य भविष्य, संतान योग एवं निवारण रिपोर्ट (PDF)" : "Unlock Complete 25-Page Matrimonial Compatibility PDF"}
                      </div>
                      <button
                        onClick={() => setActiveCheckout({
                          title: "Kundli Milan Comprehensive PDF Report",
                          priceKey: "matchmakingReport",
                          price: PRODUCT_PRICES.matchmakingReport[currency],
                          desc: "In-depth Bhakoot/Nadi analysis, future timing, and harmony remedies",
                          icon: "❤️"
                        })}
                        style={{ marginTop: 10, background: "linear-gradient(90deg, #F59E0B, #D97706)", border: "none", color: "#0F0A1E", padding: "10px 22px", borderRadius: 8, fontSize: 13.5, fontWeight: 800, cursor: "pointer" }}
                      >
                        {hi ? "डाउनलोड करें" : "Unlock Report"} ({PRODUCT_PRICES.matchmakingReport[currency]})
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 5: 1-ON-1 ASTROLOGER CONSULTATION (COMING SOON) ── */}
            {tab === "consult" && (
              <div className="glass-card" style={{ padding: "38px 28px", marginBottom: 20, textAlign: "center" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.35)", borderRadius: 20, padding: "5px 14px", color: "#FDE68A", fontSize: 12, fontWeight: 800, marginBottom: 16 }}>
                  <span>⏳</span> {hi ? "जल्द आ रहा है · COMING SOON" : "COMING SOON · PRIORITY LAUNCH"}
                </div>

                <div style={{ fontSize: 48, marginBottom: 12 }}>🔮</div>
                <h3 style={{ color: "#F3D37A", fontSize: 22, fontWeight: 800, marginBottom: 10 }}>
                  {hi ? "1-on-1 प्रमाणित ज्योतिषी परामर्श सेवा" : "1-on-1 Certified Astrologer Consultation"}
                </h3>
                <p style={{ color: "rgba(241,231,208,0.85)", fontSize: 14, maxWidth: 560, margin: "0 auto 26px", lineHeight: 1.75 }}>
                  {hi 
                    ? "हम वर्तमान में उच्च योग्यता प्राप्त, अनुभवी एवं प्रामाणिक वैदिक विद्वानों को जोड़ रहे हैं। शीघ्र ही आप करियर, विवाह, स्वास्थ्य एवं व्यक्तिगत प्रश्नों पर सीधे ऑडियो/व्हाट्सएप परामर्श प्राप्त कर सकेंगे।" 
                    : "We are currently curating and verifying top-tier Vedic Astrologers and PhD scholars. Direct private 1-on-1 audio/video consultations for Career, Marriage & Life Guidance will be live shortly."}
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, maxWidth: 720, margin: "0 auto 28px", textAlign: "left" }}>
                  {[
                    { icon: "🛡️", title: hi ? "100% गोपनीय व सुरक्षित" : "100% Confidential", desc: hi ? "निजी परामर्श और पूर्ण गोपनीयता" : "Private & encrypted discussions" },
                    { icon: "📜", title: hi ? "सटीक पराशरी गणना" : "Parashari Principles", desc: hi ? "प्रामाणिक शास्त्रीय पद्धति" : "Classical Vedic astrological analysis" },
                    { icon: "⏱️", title: hi ? "कॉल व व्हाट्सएप सुविधा" : "Instant Audio / Chat", desc: hi ? "सुविधाजनक समय स्लॉट बुकिंग" : "Flexible scheduling & instant booking" },
                  ].map((feat, idx) => (
                    <div key={idx} style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: 16 }}>
                      <div style={{ fontSize: 22, marginBottom: 6 }}>{feat.icon}</div>
                      <div style={{ color: "#FDE68A", fontSize: 13.5, fontWeight: 800 }}>{feat.title}</div>
                      <div style={{ color: "rgba(241,231,208,0.75)", fontSize: 12.5, marginTop: 3 }}>{feat.desc}</div>
                    </div>
                  ))}
                </div>

                <a
                  href={`https://wa.me/918094199663?text=${encodeURIComponent("Namaste, I would like to join the Priority Waitlist for 1-on-1 Vedic Astrologer Consultation on Jyotish Kundli.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "linear-gradient(90deg, #F59E0B, #D97706)",
                    color: "#0F0A1E",
                    padding: "14px 28px",
                    borderRadius: 10,
                    fontSize: 14.5,
                    fontWeight: 800,
                    textDecoration: "none",
                    boxShadow: "0 4px 16px rgba(245,158,11,0.3)"
                  }}
                >
                  <span>💬</span> {hi ? "प्राथमिकता प्रतीक्षा सूची (Waitlist) में जुड़ें" : "Join Priority Waitlist on WhatsApp"}
                </a>
              </div>
            )}

            {/* ── TAB 6: VEDIC STORE & CERTIFIED REMEDIES (COMING SOON) ── */}
            {tab === "store" && (
              <div className="glass-card" style={{ padding: "30px 26px", marginBottom: 20 }}>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.35)", borderRadius: 20, padding: "5px 14px", color: "#FDE68A", fontSize: 12, fontWeight: 800, marginBottom: 12 }}>
                    <span>⏳</span> {hi ? "स्टोर जल्द उपलब्ध होगा · VENDOR ONBOARDING IN PROGRESS" : "STORE COMING SOON · CERTIFIED VENDOR ONBOARDING"}
                  </div>
                  <div style={{ fontSize: 36 }}>💎</div>
                  <h3 style={{ color: "#F3D37A", fontSize: 20, fontWeight: 800, marginTop: 4 }}>
                    {hi ? "आपकी कुंडली के अनुकूल निर्धारित रत्न एवं उपाय" : "Prescribed Gemstones & Astrological Remedies"}
                  </h3>
                  <p style={{ color: "rgba(241,231,208,0.75)", fontSize: 13.5, marginTop: 3 }}>
                    {hi ? `आपके लग्न (${result.lagnaSign}) के अनुसार शास्त्रीय ज्योतिषीय विश्लेषण` : `Astrological prescription tailored specifically for your ${result.lagnaSign} Lagna`}
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
                  {/* Prescribed Gemstone */}
                  <div style={{ background: "rgba(15,10,32,0.85)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 14, padding: "22px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontSize: 32 }}>💍</span>
                      <div style={{ color: "#FDE68A", fontSize: 12, fontWeight: 800, marginTop: 4 }}>PRESCRIBED LUCKY GEMSTONE</div>
                      <h4 style={{ color: "#F3D37A", fontSize: 17, fontWeight: 800 }}>{result.gemObj.gem}</h4>
                      <p style={{ color: "rgba(241,231,208,0.85)", fontSize: 13, marginTop: 6, lineHeight: 1.6 }}>
                        Certified natural, unheated gemstone recommended to strengthen your {result.lagnaSign} Lagna and enhance vitality & success.
                      </p>
                    </div>
                    <div style={{ marginTop: 18, borderTop: "1px solid rgba(212,175,55,0.15)", paddingTop: 14 }}>
                      <div style={{ background: "rgba(245,158,11,0.08)", border: "1px dashed rgba(245,158,11,0.3)", borderRadius: 8, padding: "10px 14px", textAlign: "center", color: "#FDE68A", fontSize: 12.5, fontWeight: 700 }}>
                        ⏳ {hi ? "प्रमाणित लैब रत्न स्टोर (जल्द शुरू)" : "Lab Certified Gemstone Store (Coming Soon)"}
                      </div>
                    </div>
                  </div>

                  {/* Energized Rudraksha */}
                  <div style={{ background: "rgba(15,10,32,0.85)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 14, padding: "22px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontSize: 32 }}>📿</span>
                      <div style={{ color: "#FDE68A", fontSize: 12, fontWeight: 800, marginTop: 4 }}>SACRED ENERGIZED RUDRAKSHA</div>
                      <h4 style={{ color: "#F3D37A", fontSize: 17, fontWeight: 800 }}>{result.rudraksha}</h4>
                      <p style={{ color: "rgba(241,231,208,0.85)", fontSize: 13, marginTop: 6, lineHeight: 1.6 }}>
                        Consecrated with sacred Vedic Beej Mantras for mental clarity, spiritual protection, and planetary peace.
                      </p>
                    </div>
                    <div style={{ marginTop: 18, borderTop: "1px solid rgba(212,175,55,0.15)", paddingTop: 14 }}>
                      <div style={{ background: "rgba(245,158,11,0.08)", border: "1px dashed rgba(245,158,11,0.3)", borderRadius: 8, padding: "10px 14px", textAlign: "center", color: "#FDE68A", fontSize: 12.5, fontWeight: 700 }}>
                        ⏳ {hi ? "सिद्ध रुद्राक्ष स्टोर (जल्द शुरू)" : "Energized Rudraksha Store (Coming Soon)"}
                      </div>
                    </div>
                  </div>

                  {/* Navagraha Yantra */}
                  <div style={{ background: "rgba(15,10,32,0.85)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 14, padding: "22px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontSize: 32 }}>🔯</span>
                      <div style={{ color: "#FDE68A", fontSize: 12, fontWeight: 800, marginTop: 4 }}>COPPER NAVAGRAHA YANTRA</div>
                      <h4 style={{ color: "#F3D37A", fontSize: 17, fontWeight: 800 }}>Shree Sampoorna Navagraha Yantra</h4>
                      <p style={{ color: "rgba(241,231,208,0.85)", fontSize: 13, marginTop: 6, lineHeight: 1.6 }}>
                        Pure copper geometric plate to balance planetary doshas in your residence or workspace.
                      </p>
                    </div>
                    <div style={{ marginTop: 18, borderTop: "1px solid rgba(212,175,55,0.15)", paddingTop: 14 }}>
                      <div style={{ background: "rgba(245,158,11,0.08)", border: "1px dashed rgba(245,158,11,0.3)", borderRadius: 8, padding: "10px 14px", textAlign: "center", color: "#FDE68A", fontSize: 12.5, fontWeight: 700 }}>
                        ⏳ {hi ? "वैदिक यंत्र स्टोर (जल्द शुरू)" : "Sacred Yantra Store (Coming Soon)"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 7: PLANETS ── */}
            {tab === "planets" && (
              <div>
                <div className="glass-card" style={{ padding: "26px 24px", marginBottom: 20 }}>
                  <h3 style={{ color: "#F3D37A", fontSize: 17, fontWeight: 800, marginBottom: 16 }}>{t.ptTitle}</h3>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
                      <thead>
                        <tr style={{ background: "rgba(245, 158, 11, 0.12)", borderBottom: "1px solid rgba(212, 175, 55, 0.3)" }}>
                          {t.pcols.map(col => (
                            <th key={col} style={{ padding: "12px 14px", color: "#FDE68A", fontSize: 13, fontWeight: 800, textAlign: "left", letterSpacing: 0.5 }}>{col}</th>
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
                            <tr key={p.name} style={{ borderBottom: "1px solid rgba(212, 175, 55, 0.1)", background: idx % 2 ? "rgba(255, 255, 255, 0.02)" : "transparent" }}>
                              <td style={{ padding: "12px 14px" }}>
                                <span style={{ color: p.color, fontWeight: "bold", fontSize: 14 }}>{p.symbol} {p.name}</span>
                                <div style={{ fontSize: 12, color: "rgba(241, 231, 208, 0.8)", marginTop: 2 }}>{p.sanskrit}</div>
                              </td>
                              <td style={{ padding: "12px 14px", color: "rgba(241, 231, 208, 0.95)", fontSize: 14, fontWeight: 600 }}>
                                {pd.sign} <span style={{ fontSize: 12.5, color: "rgba(243, 211, 122, 0.85)" }}>({pd.signSanskrit})</span>
                              </td>
                              <td style={{ padding: "12px 14px", color: "#FDE68A", fontSize: 14, fontWeight: 800 }}>
                                House {pd.house}
                              </td>
                              <td style={{ padding: "12px 14px", color: "rgba(241, 231, 208, 0.9)", fontSize: 13.5 }}>
                                {pd.degree}
                                <div style={{ fontSize: 12, color: "rgba(243, 211, 122, 0.85)", marginTop: 2 }}>{pd.nakshatra} (P{pd.pada})</div>
                              </td>
                              <td style={{ padding: "12px 14px" }}>
                                <span style={{
                                  padding: "4px 11px",
                                  borderRadius: 14,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  background: isExalted ? "rgba(16, 185, 129, 0.18)" : isDebilitated ? "rgba(239, 68, 68, 0.18)" : isOwn ? "rgba(245, 158, 11, 0.18)" : "rgba(212, 175, 55, 0.12)",
                                  color: isExalted ? "#34D399" : isDebilitated ? "#F87171" : isOwn ? "#FBBF24" : "#F3D37A",
                                  border: `1px solid ${isExalted ? "rgba(16, 185, 129, 0.4)" : isDebilitated ? "rgba(239, 68, 68, 0.4)" : isOwn ? "rgba(245, 158, 11, 0.4)" : "rgba(212, 175, 55, 0.25)"}`
                                }}>
                                  {pd.status || "—"}
                                </span>
                              </td>
                              <td style={{ padding: "12px 14px", color: "rgba(241, 231, 208, 0.9)", fontSize: 13.5, lineHeight: 1.6 }}>
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
                <div className="glass-card" style={{ padding: "26px 22px", marginBottom: 20 }}>
                  <h3 style={{ color: "#F3D37A", fontSize: 17, fontWeight: 800, marginBottom: 16 }}>{t.htTitle}</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                    {Array.from({ length: 12 }, (_, i) => {
                      const n = i + 1;
                      const d = result.houses?.[n] || {};
                      const sg = ZODIAC_SIGNS.find(z => z.name === d.sign || z.sanskrit === d.sign) || ZODIAC_SIGNS[i];
                      const pl = d.planets || [];

                      return (
                        <div key={n} style={{ background: "rgba(15, 10, 32, 0.75)", border: "1px solid rgba(212, 175, 55, 0.2)", borderRadius: 12, padding: "16px 18px", borderLeft: "4px solid #F59E0B" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                            <div>
                              <span style={{ color: "#FDE68A", fontSize: 14.5, fontWeight: 800 }}>
                                {hi ? `भाव ${n}` : `House ${n}`}
                              </span>
                              <div style={{ fontSize: 12, color: "rgba(243, 211, 122, 0.85)", marginTop: 2 }}>{t.hnames[i]}</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontSize: 20, color: "#F3D37A", lineHeight: 1 }}>{sg.symbol}</div>
                              <div style={{ fontSize: 11, color: "rgba(241, 231, 208, 0.7)", marginTop: 2 }}>{sg.sanskrit}</div>
                            </div>
                          </div>

                          {pl.length > 0 ? (
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                              {pl.map((p, j) => {
                                const pd = PLANETS.find(x => x.name === p);
                                return (
                                  <span key={j} style={{ padding: "3px 10px", borderRadius: 8, fontSize: 12, fontWeight: "bold", background: "rgba(245, 158, 11, 0.15)", color: pd?.color || "#F3D37A", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
                                    {p}
                                  </span>
                                );
                              })}
                            </div>
                          ) : (
                            <div style={{ fontSize: 12, color: "rgba(241, 231, 208, 0.5)", marginBottom: 8, fontStyle: "italic" }}>{t.nopl}</div>
                          )}

                          <p style={{ fontSize: 13.5, color: "rgba(241, 231, 208, 0.9)", lineHeight: 1.7 }}>{d.interpretation}</p>
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
            PRINT-ONLY FULL DETAILED REPORT (Dynamic based on activePrintReport)
        ══════════════════════════════════════════════════════════════════════ */}
        {result && (() => {
          const cp = result.careerPrediction || calculateCareerPrediction({
            name: form.name || "User",
            dob: form.dob || "1998-01-01",
            lagnaSign: result.lagnaSign,
            rashiSign: result.rashiSign,
            lang
          });

          const mp = result.marriagePrediction || calculateMarriagePrediction({
            name: form.name || "User",
            dob: form.dob || "1998-01-01",
            lagnaSign: result.lagnaSign,
            rashiSign: result.rashiSign,
            lang
          });

          return (
            <div className="print-only-report">
              {/* ══════════════════════════════════════════════════════════════════════
                  CASE 1: DEDICATED 20-PAGE CAREER & BUSINESS BLUEPRINT DOSSIER
              ══════════════════════════════════════════════════════════════════════ */}
              {activePrintReport === "career" && (
                <div>
                  {/* Title Cover Header */}
                  <div style={{ textAlign: "center", borderBottom: "2px solid #D4AF37", paddingBottom: 16, marginBottom: 24 }}>
                    <div style={{ fontSize: 26, marginBottom: 4 }}>💼 🔯</div>
                    <h1 style={{ fontFamily: "'Cinzel', serif", color: "#F3D37A", fontSize: 25, fontWeight: 800, letterSpacing: 1.5, margin: 0 }}>
                      {hi ? "सम्पूर्ण वैदिक करियर, पदोन्नति एवं व्यापार ब्लूप्रिंट" : "VEDIC CAREER, PROMOTION & BUSINESS GROWTH BLUEPRINT"}
                    </h1>
                    <div style={{ fontSize: 13, color: "#34D399", fontWeight: 800, marginTop: 4, letterSpacing: 1 }}>
                      ✦ CONFIDENTIAL PARASHARI & D10 DASAMSA HOROSCOPIC DOSSIER ✦
                    </div>
                    <p style={{ color: "rgba(243,211,122,0.9)", fontSize: 13, letterSpacing: 0.8, textTransform: "uppercase", marginTop: 6 }}>
                      {form.name.toUpperCase()} · DOB: {form.dob} · TOB: {form.tob || "12:00 PM"} · POB: {form.pob}
                    </p>
                  </div>

                  {/* Core Astrological Metrics Table */}
                  <div className="page-break-avoid" style={{ background: "rgba(26, 18, 48, 0.8)", border: "1px solid rgba(212, 175, 55, 0.4)", borderRadius: 12, padding: "16px 20px", marginBottom: 22 }}>
                    <h3 style={{ color: "#F3D37A", fontSize: 14.5, fontWeight: 800, marginBottom: 10, borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 6 }}>
                      ✦ CORE VEDIC HOROSCOPIC PARAMETERS
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, textAlign: "center" }}>
                      {[
                        { label: "Ascendant (Lagna)", val: result.lagna },
                        { label: "Moon Sign (Rashi)", val: result.rashi },
                        { label: "10th House (Karma)", val: `${cp.tenthSign} (${cp.tenthLord})` },
                        { label: "Elevation Score", val: `${cp.scores.corporate}%` },
                        { label: "Nakshatra & Pada", val: result.nakshatra },
                      ].map((p, i) => (
                        <div key={i} style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 8, padding: "8px 10px" }}>
                          <div style={{ fontSize: 11, color: "rgba(243,211,122,0.85)", marginBottom: 3, fontWeight: 600 }}>{p.label}</div>
                          <div style={{ fontSize: 13, color: "#FDE68A", fontWeight: 800 }}>{p.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chapter 1: 10th House Karma Sthana & D10 Dasamsa Analysis */}
                  <div className="page-break-avoid" style={{ marginBottom: 22, border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 18, background: "rgba(15,10,32,0.7)" }}>
                    <h3 style={{ color: "#F3D37A", fontSize: 15, fontWeight: 800, marginBottom: 8 }}>
                      🏛️ CHAPTER 1: 10TH HOUSE (KARMA STHANA) & D10 DASAMSA SYNTHESIS
                    </h3>
                    <p style={{ lineHeight: 1.8, fontSize: 13.5, color: "rgba(241,231,208,0.92)", margin: "0 0 10px" }}>
                      {hi
                        ? `दशम भाव कर्म, मान-सम्मान, पदोन्नति एवं सामाजिक प्रतिष्ठा का प्रधान केंद्र है। आपकी कुंडली में दशम भाव ${cp.tenthSign} राशि में स्थित है, जिसके स्वामी ग्रह '${cp.tenthLord}' हैं। यह विन्यास आपके भीतर असाधारण रणनीतिक दृष्टि, संगठनात्मक प्रबंधन तथा जटिल समस्याओं को सुलझाने की स्वाभाविक क्षमता को दर्शाता है।`
                        : `The 10th House (Karma Bhava) represents the pinnacle of executive authority, professional leadership, social status, and livelihood. In your natal chart, the 10th House falls in ${cp.tenthSign}, governed by Lord ${cp.tenthLord}. This stellar alignment bestows exceptional strategic vision, calculated risk tolerance, and sharp problem-solving intellect.`}
                    </p>
                    <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 8, padding: "10px 14px", color: "#FDE68A", fontSize: 13, fontWeight: 700 }}>
                      🌟 {hi ? "प्रधान करियर स्वभाव:" : "Primary Career Archetype:"} {cp.archetypeTitle}
                    </div>
                  </div>

                  {/* Chapter 2: D10 Dasamsa Planetary Positions & Career Influence Table */}
                  <div className="page-break-avoid" style={{ marginBottom: 22 }}>
                    <h3 style={{ color: "#F3D37A", fontSize: 14.5, fontWeight: 800, marginBottom: 10 }}>
                      📊 CHAPTER 2: D10 DASAMSA DIVISIONAL CHART PLANETARY INFLUENCES
                    </h3>
                    <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid rgba(212,175,55,0.3)" }}>
                      <thead>
                        <tr style={{ background: "rgba(245, 158, 11, 0.15)", borderBottom: "1px solid rgba(212,175,55,0.4)" }}>
                          <th style={{ padding: "8px 10px", color: "#FDE68A", fontSize: 12, textAlign: "left" }}>Planet</th>
                          <th style={{ padding: "8px 10px", color: "#FDE68A", fontSize: 12, textAlign: "left" }}>Sign & House</th>
                          <th style={{ padding: "8px 10px", color: "#FDE68A", fontSize: 12, textAlign: "left" }}>D10 Career Dignity</th>
                          <th style={{ padding: "8px 10px", color: "#FDE68A", fontSize: 12, textAlign: "left" }}>Direct Impact on Job, Promotion & CTC</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: "Sun (Surya)", sign: "Leo / Aries", dignity: "Digbala / Exalted", impact: hi ? "वरिष्ठ नेतृत्व, सरकारी मान्यता व निर्णय क्षमता" : "Executive command, government authority & leadership" },
                          { name: "Saturn (Shani)", sign: "Capricorn / Aquarius", dignity: "Swakshetra / Strong", impact: hi ? "दीर्घकालिक स्थिरता, टीम प्रबंधन व निष्ठा" : "Long-term career resilience, deep focus & team loyalty" },
                          { name: "Mercury (Budha)", sign: "Virgo / Gemini", dignity: "Exalted / Uchha", impact: hi ? "रणनीतिक बुद्धिमत्ता, डेटा एनालिटिक्स व संवाद" : "Sharp business acumen, systems logic & high communication" },
                          { name: "Jupiter (Guru)", sign: "Sagittarius / Cancer", dignity: "Mitra / Auspicious", impact: hi ? "वरिष्ठ अधिकारियों का मार्गदर्शन, बोनस व सलाहकार पद" : "Mentorship from C-suite, wealth expansion & advisory status" },
                          { name: "Mars (Mangal)", sign: "Capricorn / Scorpio", dignity: "Uchha / Powerful", impact: hi ? "परियोजना क्रियान्वयन, साहस व प्रतिस्पर्धा में विजय" : "Flawless execution, crisis management & competitive dominance" },
                          { name: "Venus (Shukra)", sign: "Pisces / Taurus", dignity: "Subha / Creative", impact: hi ? "ब्रांड वैल्यू, क्लाइंट नेटवर्किंग व उच्च जीवनशैली" : "Executive presence, stakeholder persuasion & lucrative packages" },
                          { name: "Rahu / Ketu", sign: "Gemini / Virgo", dignity: "Rajayoga Spark", impact: hi ? "विदेशी परियोजनाएं, आधुनिक तकनीक व अप्रत्याशित उछाल" : "Overseas projects, cutting-edge tech disruption & sudden hikes" },
                        ].map((row, idx) => (
                          <tr key={idx} style={{ borderBottom: "1px solid rgba(212,175,55,0.1)", background: idx % 2 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                            <td style={{ padding: "8px 10px", fontWeight: 700, color: "#FDE68A", fontSize: 12.5 }}>{row.name}</td>
                            <td style={{ padding: "8px 10px", fontSize: 12.5 }}>{row.sign}</td>
                            <td style={{ padding: "8px 10px", color: "#34D399", fontWeight: 700, fontSize: 12.5 }}>{row.dignity}</td>
                            <td style={{ padding: "8px 10px", fontSize: 12.5, color: "rgba(241,231,208,0.9)" }}>{row.impact}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="page-break-before" />

                  {/* Chapter 3: 4-Domain Suitability Spectrum */}
                  <div className="page-break-avoid" style={{ marginBottom: 22 }}>
                    <h3 style={{ color: "#F3D37A", fontSize: 14.5, fontWeight: 800, marginBottom: 10 }}>
                      📊 CHAPTER 3: DOMAIN SUITABILITY MATRIX & CAREER PATHWAYS
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                      {[
                        { title: hi ? "🏛️ प्रशासनिक व सरकारी सेवा (Govt/PSU)" : "🏛️ Government & Civil Administration", score: cp.scores.govt, desc: hi ? "UPSC, State PSC, सार्वजनिक उपक्रम एवं नीति निर्माण में उच्च सफलता योग।" : "Strong yogas for civil services, PSU leadership, and public sector governance." },
                        { title: hi ? "💼 कॉर्पोरेट व उच्च-तकनीकी प्रबंधन (Corporate/Tech)" : "💼 Corporate High-Tech Leadership", score: cp.scores.corporate, desc: hi ? "क्लाउड, एआई, ग्लोबल प्रोडक्ट मैनेजमेंट एवं सी-लेवल एक्जीक्यूटिव संवर्ग।" : "High-velocity capability for Fortune 500 tech architecture, strategy & C-suite." },
                        { title: hi ? "🚀 स्वतंत्र उद्यम व स्टार्टअप (Business/Startups)" : "🚀 Scalable Startups & Global Trade", score: cp.scores.business, desc: hi ? "ई-कॉमर्स, विनिर्माण, रियल एस्टेट एवं स्वतंत्र व्यापारिक उद्यम।" : "Favorable planetary support for self-built scalable enterprises and equity." },
                        { title: hi ? "🎨 रिसर्च, मीडिया व कानूनी परामर्श (Creative/Legal)" : "🎨 Creative Media & Strategic Advisory", score: cp.scores.creative, desc: hi ? "डिजिटल मीडिया, बौद्धिक संपदा, डेटा साइंस एवं स्वतंत्र सलाहकार पद।" : "Strong affinity for high-impact media, analytics, research and corporate legal counsel." },
                      ].map((item, i) => (
                        <div key={i} style={{ border: "1px solid rgba(212,175,55,0.25)", borderRadius: 8, padding: "12px 14px", background: "rgba(15,10,32,0.65)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                            <span style={{ color: "#FDE68A", fontSize: 13, fontWeight: 800 }}>{item.title}</span>
                            <span style={{ color: "#34D399", fontSize: 14, fontWeight: 800 }}>{item.score}%</span>
                          </div>
                          <p style={{ fontSize: 12.5, color: "rgba(241,231,208,0.85)", margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chapter 4: Multi-Year Golden Timeline (2026–2030) */}
                  <div className="page-break-avoid" style={{ marginBottom: 22 }}>
                    <h3 style={{ color: "#F3D37A", fontSize: 14.5, fontWeight: 800, marginBottom: 10 }}>
                      📅 CHAPTER 4: MULTI-YEAR PROMOTION, JOB SWITCH & EXPANSION CALENDAR (2026–2030)
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                      <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 10, padding: "14px 16px" }}>
                        <div style={{ color: "#34D399", fontSize: 13, fontWeight: 800, marginBottom: 4 }}>📈 Next Promotion & Appraisal Window</div>
                        <div style={{ color: "#FFF", fontSize: 13.5, fontWeight: 700 }}>{cp.appraisalWindow}</div>
                        <p style={{ fontSize: 12, color: "rgba(241,231,208,0.8)", marginTop: 6, lineHeight: 1.5 }}>
                          {hi ? "गुरु व शनि का शुभ गोचर आपके कार्य मूल्यांकन को नई ऊंचाई प्रदान करेगा।" : "Aligned transit of Jupiter & 10th Lord brings executive elevation."}
                        </p>
                      </div>

                      <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.35)", borderRadius: 10, padding: "14px 16px" }}>
                        <div style={{ color: "#FDE68A", fontSize: 13, fontWeight: 800, marginBottom: 4 }}>🔄 Senior Job Switch & Package Hike</div>
                        <div style={{ color: "#FFF", fontSize: 13.5, fontWeight: 700 }}>{cp.jobChangeWindow}</div>
                        <p style={{ fontSize: 12, color: "rgba(241,231,208,0.8)", marginTop: 6, lineHeight: 1.5 }}>
                          {hi ? "बुध एवं शुक्र का प्रभाव उच्च वेतनमान तथा पदोन्नति का मार्ग प्रशस्त करेगा।" : "Mercury-Venus trigger creates high CTC negotiation leverage."}
                        </p>
                      </div>

                      <div style={{ background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.35)", borderRadius: 10, padding: "14px 16px" }}>
                        <div style={{ color: "#60A5FA", fontSize: 13, fontWeight: 800, marginBottom: 4 }}>🌐 Global Relocation & Business Phase</div>
                        <div style={{ color: "#FFF", fontSize: 13.5, fontWeight: 700 }}>{cp.expansionWindow}</div>
                        <p style={{ fontSize: 12, color: "rgba(241,231,208,0.8)", marginTop: 6, lineHeight: 1.5 }}>
                          {hi ? "नवम व द्वादश भाव सक्रिय होने से विदेश यात्रा तथा वैश्विक उद्यम का योग।" : "9th & 12th house activation supports overseas visa & foreign equity."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Chapter 5: Workplace Obstacles & Neutralization */}
                  <div className="page-break-avoid" style={{ marginBottom: 22, border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "16px 18px", background: "rgba(239,68,68,0.06)" }}>
                    <h3 style={{ color: "#F87171", fontSize: 14.5, fontWeight: 800, marginBottom: 6 }}>
                      ⚠️ CHAPTER 5: WORKPLACE FRICTION, OFFICE POLITICS & OBSTACLE DIAGNOSTICS
                    </h3>
                    <p style={{ lineHeight: 1.75, fontSize: 13, color: "rgba(241,231,208,0.92)", margin: 0 }}>
                      {cp.obstacleAnalysis}
                    </p>
                  </div>

                  <div className="page-break-before" />

                  {/* Chapter 6: Actionable Vedic Career Remedies */}
                  <div className="page-break-avoid" style={{ marginBottom: 22, border: "1px solid rgba(245,158,11,0.4)", borderRadius: 10, padding: "18px 20px", background: "rgba(245,158,11,0.08)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <h3 style={{ color: "#FDE68A", fontSize: 15, fontWeight: 800, margin: 0 }}>
                        🛡️ CHAPTER 6: PRESCRIPTION OF VEDIC CAREER REMEDIES & SACRED PROTOCOLS
                      </h3>
                      <div style={{ color: "#34D399", fontSize: 12.5, fontWeight: 700 }}>☀️ {cp.dailyCareerMantra}</div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
                      {cp.remedies.map((rem, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <span style={{ color: "#FDE68A", fontSize: 15, marginTop: 2 }}>✦</span>
                          <span style={{ color: "rgba(241,231,208,0.92)", fontSize: 13, lineHeight: 1.7 }}>{rem}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chapter 7: 12 Houses Career Influence Table */}
                  <div className="page-break-avoid" style={{ marginBottom: 22 }}>
                    <h3 style={{ color: "#F3D37A", fontSize: 14.5, fontWeight: 800, marginBottom: 10 }}>
                      🏠 CHAPTER 7: 12 HOUSES KARMA & WEALTH ACCELERATION MATRIX
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {Array.from({ length: 12 }, (_, i) => {
                        const n = i + 1;
                        const d = result.houses?.[n] || {};
                        return (
                          <div key={n} style={{ border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8, padding: "10px 12px", background: "rgba(15,10,32,0.6)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                              <span style={{ color: "#FDE68A", fontSize: 12.5, fontWeight: 800 }}>House {n}: {t.hnames[i]}</span>
                              <span style={{ color: "#34D399", fontSize: 12 }}>{d.sign}</span>
                            </div>
                            <p style={{ fontSize: 12, lineHeight: 1.55, color: "rgba(241,231,208,0.85)", margin: 0 }}>{d.interpretation}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sign-off verdict */}
                  <div className="page-break-avoid" style={{ border: "1px solid rgba(245,158,11,0.5)", borderRadius: 10, padding: 18, background: "linear-gradient(135deg, rgba(35,22,65,0.9), rgba(18,12,38,0.95))", textAlign: "center" }}>
                    <h3 style={{ color: "#F3D37A", fontSize: 15, fontWeight: 800, marginBottom: 6 }}>✨ VEDIC ASTROLOGER BLESSING & FINAL VERDICT</h3>
                    <p style={{ fontSize: 13.5, lineHeight: 1.8, color: "#FFF", margin: "0 0 10px" }}>{result.verdict}</p>
                    <div style={{ color: "rgba(243,211,122,0.75)", fontSize: 12, letterSpacing: 1.5, fontWeight: 600 }}>
                      ✦ OM SHANTI SHANTI SHANTI ✦ — JYOTISH KUNDLI CERTIFIED DOSSIER
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════════════════
                  CASE 2: DEDICATED ALL-IN-ONE VEDIC & LAL KITAB REMEDIAL DOSSIER
              ══════════════════════════════════════════════════════════════════════ */}
              {activePrintReport === "remedies" && (
                <div>
                  <div style={{ textAlign: "center", borderBottom: "2px solid #D4AF37", paddingBottom: 16, marginBottom: 24 }}>
                    <div style={{ fontSize: 26, marginBottom: 4 }}>🛡️ 🕉️</div>
                    <h1 style={{ fontFamily: "'Cinzel', serif", color: "#F3D37A", fontSize: 25, fontWeight: 800, letterSpacing: 1.5, margin: 0 }}>
                      {hi ? "सम्पूर्ण वैदिक दोष शांति एवं लाल किताब समस्या निवारण गाइड" : "COMPLETE VEDIC DOSHA SHANTI & LAL KITAB REMEDIAL DOSSIER"}
                    </h1>
                    <div style={{ fontSize: 13, color: "#34D399", fontWeight: 800, marginTop: 4, letterSpacing: 1 }}>
                      ✦ CONFIDENTIAL TANTRA, MANTRA, YANTRA & VASTU SHIELD ✦
                    </div>
                    <p style={{ color: "rgba(243,211,122,0.9)", fontSize: 13, letterSpacing: 0.8, textTransform: "uppercase", marginTop: 6 }}>
                      {form.name.toUpperCase()} · DOB: {form.dob} · TOB: {form.tob || "12:00 PM"} · POB: {form.pob}
                    </p>
                  </div>

                  {/* All 7 Problems Remedial Breakdown */}
                  {LIFE_PROBLEMS_LIST.map((prob, idx) => {
                    const r = getLifeProblemRemedies({ problemId: prob.id, lagnaSign: result.lagnaSign, rashiSign: result.rashiSign, lang });
                    return (
                      <div key={prob.id} className="page-break-avoid" style={{ marginBottom: 20, border: "1px solid rgba(212,175,55,0.3)", borderRadius: 10, padding: "16px 18px", background: "rgba(15,10,32,0.7)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 8, marginBottom: 10 }}>
                          <h4 style={{ color: "#F3D37A", fontSize: 14.5, fontWeight: 800, margin: 0 }}>
                            {r.icon} SECTION {idx + 1}: {r.problemTitle}
                          </h4>
                          <span style={{ color: "#34D399", fontSize: 12, fontWeight: 700 }}>⏱️ {r.mantraCount}</span>
                        </div>

                        <div style={{ fontSize: 12.5, color: "rgba(241,231,208,0.9)", lineHeight: 1.65, marginBottom: 10 }}>
                          <b>🔍 Root Cause:</b> {r.rootCause}
                        </div>

                        <div style={{ background: "rgba(0,0,0,0.5)", border: "1px dashed rgba(245,158,11,0.35)", borderRadius: 8, padding: "8px 12px", color: "#FDE68A", fontSize: 13.5, fontWeight: 800, textAlign: "center", marginBottom: 10 }}>
                          🕉️ {r.mantra}
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8, fontSize: 12 }}>
                          <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 6, padding: "6px 8px" }}>
                            <b style={{ color: "#34D399" }}>🌿 Daily Upay:</b> {r.dailyUpay[0]}
                          </div>
                          <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 6, padding: "6px 8px" }}>
                            <b style={{ color: "#FDE68A" }}>🤲 Charity:</b> {r.charity}
                          </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
                          <div style={{ background: "rgba(11,8,25,0.6)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 6, padding: "6px 8px" }}>
                            <b style={{ color: "#FDE68A" }}>💎 Gem & Rudraksha:</b> {r.gemRudraksha}
                          </div>
                          <div style={{ background: "rgba(11,8,25,0.6)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 6, padding: "6px 8px" }}>
                            <b style={{ color: "#FDE68A" }}>🏡 Vastu Tip:</b> {r.vastuTip}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* 21-Day Sankalp Ritual Page */}
                  <div className="page-break-avoid" style={{ border: "1px solid rgba(245,158,11,0.5)", borderRadius: 10, padding: 18, background: "linear-gradient(135deg, rgba(35,22,65,0.9), rgba(18,12,38,0.95))", textAlign: "center", marginTop: 20 }}>
                    <h3 style={{ color: "#F3D37A", fontSize: 15, fontWeight: 800, marginBottom: 8 }}>✨ २१-दिवसीय दैनिक संकल्प एवं अनुष्ठान नियम</h3>
                    <p style={{ fontSize: 13, lineHeight: 1.75, color: "rgba(241,231,208,0.9)", margin: "0 0 10px" }}>
                      {hi
                        ? "उपरोक्त किसी भी एक मुख्य समस्या के मंत्र एवं उपाय को लगातार २१ दिनों तक ब्रह्म मुहूर्त में शुद्ध भाव से करने पर नकारात्मक ऊर्जा समाप्त होकर ईश्वरीय कृपा प्राप्त होती है।"
                        : "Consistently practicing the prescribed beej mantra, charity, and daily upay for 21 days creates a powerful protective aura and clears long-standing karmic obstructions."}
                    </p>
                    <div style={{ color: "rgba(243,211,122,0.75)", fontSize: 12, letterSpacing: 1.5, fontWeight: 600 }}>
                      ✦ SARVA MANOKAMNA SIDDHI ✦ — JYOTISH KUNDLI VEDIC DOSSIER
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════════════════
                  CASE 3: DEDICATED VEDIC VIVAH & SPOUSE PREDICTION REPORT
              ══════════════════════════════════════════════════════════════════════ */}
              {activePrintReport === "marriage" && (
                <div>
                  <div style={{ textAlign: "center", borderBottom: "2px solid #D4AF37", paddingBottom: 16, marginBottom: 24 }}>
                    <div style={{ fontSize: 26, marginBottom: 4 }}>💍 💖</div>
                    <h1 style={{ fontFamily: "'Cinzel', serif", color: "#F3D37A", fontSize: 25, fontWeight: 800, letterSpacing: 1.5, margin: 0 }}>
                      {hi ? "वैदिक विवाह समय, आयु एवं जीवनसाथी सम्पूर्ण विश्लेषण" : "PARASHARI VEDIC VIVAH & SPOUSE PREDICTION REPORT"}
                    </h1>
                    <div style={{ fontSize: 13, color: "#34D399", fontWeight: 800, marginTop: 4, letterSpacing: 1 }}>
                      ✦ 7TH HOUSE, NAVAMSHA (D9) & MATRIMONIAL MUHURAT DOSSIER ✦
                    </div>
                    <p style={{ color: "rgba(243,211,122,0.9)", fontSize: 13, letterSpacing: 0.8, textTransform: "uppercase", marginTop: 6 }}>
                      {form.name.toUpperCase()} · DOB: {form.dob} · TOB: {form.tob || "12:00 PM"} · POB: {form.pob}
                    </p>
                  </div>

                  <div className="page-break-avoid" style={{ background: "rgba(26, 18, 48, 0.8)", border: "1px solid rgba(212, 175, 55, 0.4)", borderRadius: 12, padding: "16px 20px", marginBottom: 22 }}>
                    <h3 style={{ color: "#F3D37A", fontSize: 14.5, fontWeight: 800, marginBottom: 10, borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 6 }}>
                      ✦ VIVAH TIMING & MARITAL ASTROLOGICAL PARAMETERS
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, textAlign: "center" }}>
                      {[
                        { label: "Vivah Score", val: `${mp.probabilityScore}%` },
                        { label: "Probable Age", val: mp.ageRange },
                        { label: "7th House Sign", val: mp.seventhSign },
                        { label: "7th Lord", val: mp.seventhLord },
                      ].map((p, i) => (
                        <div key={i} style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 8, padding: "8px 10px" }}>
                          <div style={{ fontSize: 11, color: "rgba(243,211,122,0.85)", marginBottom: 3, fontWeight: 600 }}>{p.label}</div>
                          <div style={{ fontSize: 14, color: "#FDE68A", fontWeight: 800 }}>{p.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="page-break-avoid" style={{ marginBottom: 20, border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 18, background: "rgba(15,10,32,0.7)" }}>
                    <h4 style={{ color: "#F3D37A", fontSize: 14.5, fontWeight: 800, marginBottom: 6 }}>📅 Auspicious Timing Windows & Peak Months</h4>
                    <p style={{ fontSize: 13, lineHeight: 1.75, color: "rgba(241,231,208,0.92)", margin: "0 0 8px" }}>
                      <b>Primary Window:</b> {mp.primaryWindow} | <b>Secondary Window:</b> {mp.secondaryWindow}
                    </p>
                    <p style={{ fontSize: 13, lineHeight: 1.75, color: "#34D399", margin: 0 }}>
                      <b>Peak Favorable Months:</b> {mp.peakMonths}
                    </p>
                  </div>

                  <div className="page-break-avoid" style={{ marginBottom: 20, border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 18, background: "rgba(15,10,32,0.7)" }}>
                    <h4 style={{ color: "#F3D37A", fontSize: 14.5, fontWeight: 800, marginBottom: 6 }}>👰/🤵 Spouse Physical Traits, Profession & Direction</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 13 }}>
                      <div><b>Nature & Demeanor:</b> {mp.spousePersonality}</div>
                      <div><b>Profession / Field:</b> {mp.spouseProfession}</div>
                      <div><b>Birth Direction:</b> {mp.spouseDirection}</div>
                      <div><b>Name Initial Letter:</b> {mp.spouseNameInitial}</div>
                    </div>
                  </div>

                  <div className="page-break-avoid" style={{ marginBottom: 20, border: "1px solid rgba(245,158,11,0.35)", borderRadius: 10, padding: 18, background: "rgba(245,158,11,0.08)" }}>
                    <h4 style={{ color: "#FDE68A", fontSize: 14.5, fontWeight: 800, marginBottom: 6 }}>🛡️ Prescribed Vivah Delay & Kalyana Remedies</h4>
                    <div style={{ fontSize: 13, lineHeight: 1.75, color: "rgba(241,231,208,0.92)", whiteSpace: "pre-wrap" }}>
                      {mp.remedies}
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════════════════
                  CASE 4: COMPLETE DELUXE NATAL KUNDLI & LIFE REPORT (Default All)
              ══════════════════════════════════════════════════════════════════════ */}
              {activePrintReport === "all" && (
                <div>
                  <div style={{ textAlign: "center", borderBottom: "2px solid #D4AF37", paddingBottom: 16, marginBottom: 24 }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>🔯</div>
                    <h1 style={{ fontFamily: "'Cinzel', serif", color: "#F3D37A", fontSize: 26, fontWeight: 800, letterSpacing: 2 }}>
                      JYOTISH KUNDLI — COMPLETE VEDIC LIFE DOSSIER
                    </h1>
                    <p style={{ color: "rgba(243,211,122,0.9)", fontSize: 13, letterSpacing: 1, textTransform: "uppercase" }}>
                      {form.name.toUpperCase()} · DOB: {form.dob} · TOB: {form.tob || "12:00 PM"} · POB: {form.pob}
                    </p>
                  </div>

                  <div className="page-break-avoid" style={{ background: "rgba(26, 18, 48, 0.8)", border: "1px solid rgba(212, 175, 55, 0.4)", borderRadius: 12, padding: "18px 22px", marginBottom: 24 }}>
                    <h3 style={{ color: "#F3D37A", fontSize: 15, fontWeight: 800, marginBottom: 12, borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 6 }}>
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
                        <div key={i} style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 8, padding: "10px 12px" }}>
                          <div style={{ fontSize: 12, color: "rgba(243,211,122,0.85)", marginBottom: 4, fontWeight: 600 }}>{p.label}</div>
                          <div style={{ fontSize: 14, color: "#FDE68A", fontWeight: 800 }}>{p.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="page-break-avoid" style={{ textAlign: "center", marginBottom: 28 }}>
                    <h3 style={{ color: "#F3D37A", fontSize: 16, fontWeight: 800, marginBottom: 12 }}>
                      ✦ NATAL LAGNA KUNDLI CHART
                    </h3>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <NorthIndianChart houses={result.houses} lang={lang} />
                    </div>
                  </div>

                  <div className="page-break-avoid" style={{ marginBottom: 28 }}>
                    <h3 style={{ color: "#F3D37A", fontSize: 15, fontWeight: 800, marginBottom: 12 }}>
                      ✦ PLANETARY POSITIONS, HOUSES & DIGNITIES
                    </h3>
                    <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid rgba(212,175,55,0.3)" }}>
                      <thead>
                        <tr style={{ background: "rgba(245, 158, 11, 0.15)", borderBottom: "1px solid rgba(212,175,55,0.4)" }}>
                          <th style={{ padding: "10px 12px", color: "#FDE68A", fontSize: 12.5, textAlign: "left" }}>Planet</th>
                          <th style={{ padding: "10px 12px", color: "#FDE68A", fontSize: 12.5, textAlign: "left" }}>Sign</th>
                          <th style={{ padding: "10px 12px", color: "#FDE68A", fontSize: 12.5, textAlign: "left" }}>House</th>
                          <th style={{ padding: "10px 12px", color: "#FDE68A", fontSize: 12.5, textAlign: "left" }}>Degree & Nakshatra</th>
                          <th style={{ padding: "10px 12px", color: "#FDE68A", fontSize: 12.5, textAlign: "left" }}>Dignity</th>
                          <th style={{ padding: "10px 12px", color: "#FDE68A", fontSize: 12.5, textAlign: "left" }}>Astrological Effect</th>
                        </tr>
                      </thead>
                      <tbody>
                        {PLANETS.map((p, idx) => {
                          const pd = result.planetData?.[p.name] || {};
                          return (
                            <tr key={p.name} style={{ borderBottom: "1px solid rgba(212,175,55,0.1)", background: idx % 2 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                              <td style={{ padding: "10px 12px", fontWeight: 700, color: p.color, fontSize: 13 }}>{p.symbol} {p.name} ({p.sanskrit})</td>
                              <td style={{ padding: "10px 12px", fontSize: 13 }}>{pd.sign} ({pd.signSanskrit})</td>
                              <td style={{ padding: "10px 12px", fontWeight: 700, color: "#FDE68A", fontSize: 13 }}>House {pd.house}</td>
                              <td style={{ padding: "10px 12px", fontSize: 13 }}>{pd.degree} · {pd.nakshatra} (P{pd.pada})</td>
                              <td style={{ padding: "10px 12px", fontSize: 13 }}>{pd.status}</td>
                              <td style={{ padding: "10px 12px", fontSize: 13 }}>{pd.effect}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="page-break-before" />

                  <div className="page-break-avoid" style={{ marginBottom: 20, border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 20, background: "rgba(15,10,32,0.6)" }}>
                    <h3 style={{ color: "#F3D37A", fontSize: 15, fontWeight: 800, marginBottom: 10 }}>🌟 {t.sec.blueprint}</h3>
                    <p style={{ lineHeight: 1.85, fontSize: 14, color: "rgba(241,231,208,0.92)" }}>{result.overview}</p>
                  </div>

                  <div className="page-break-avoid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                    <div style={{ border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 18, background: "rgba(15,10,32,0.6)" }}>
                      <h4 style={{ color: "#F3D37A", fontSize: 14, fontWeight: 800, marginBottom: 8 }}>⚡ {t.sec.yogas}</h4>
                      <div style={{ lineHeight: 1.8, fontSize: 13.5, whiteSpace: "pre-wrap" }}>{result.yogas}</div>
                    </div>
                    <div style={{ border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 18, background: "rgba(15,10,32,0.6)" }}>
                      <h4 style={{ color: "#F3D37A", fontSize: 14, fontWeight: 800, marginBottom: 8 }}>⏱️ {t.sec.dasha}</h4>
                      <div style={{ lineHeight: 1.8, fontSize: 13.5, whiteSpace: "pre-wrap" }}>{result.dasha}</div>
                    </div>
                  </div>

                  <div className="page-break-avoid" style={{ marginBottom: 20 }}>
                    <h3 style={{ color: "#F3D37A", fontSize: 15, fontWeight: 800, marginBottom: 12 }}>🏠 {t.htTitle}</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      {Array.from({ length: 12 }, (_, i) => {
                        const n = i + 1;
                        const d = result.houses?.[n] || {};
                        return (
                          <div key={n} style={{ border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8, padding: 12, background: "rgba(15,10,32,0.6)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                              <span style={{ color: "#FDE68A", fontSize: 13, fontWeight: 800 }}>House {n}: {t.hnames[i]}</span>
                              <span style={{ color: "#F3D37A", fontSize: 12 }}>{d.sign}</span>
                            </div>
                            <p style={{ fontSize: 12.5, lineHeight: 1.6, color: "rgba(241,231,208,0.85)" }}>{d.interpretation}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="page-break-before" />

                  <div className="page-break-avoid" style={{ marginBottom: 20 }}>
                    <h3 style={{ color: "#F3D37A", fontSize: 15, fontWeight: 800, marginBottom: 12 }}>🌿 LIFE DOMAIN ANALYSIS</h3>
                    {[
                      { title: t.sec.health, icon: "🌿", content: result.health },
                      { title: t.sec.wealth, icon: "💰", content: result.wealth },
                      { title: t.sec.education, icon: "📚", content: result.education },
                      { title: t.sec.career, icon: "🏆", content: result.career },
                      { title: t.sec.marriage, icon: "💑", content: result.marriage },
                    ].map(sec => (
                      <div key={sec.title} style={{ border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8, padding: "14px 16px", marginBottom: 10, background: "rgba(15,10,32,0.6)" }}>
                        <h4 style={{ color: "#FDE68A", fontSize: 13.5, fontWeight: 800, marginBottom: 6 }}>{sec.icon} {sec.title}</h4>
                        <p style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(241,231,208,0.9)" }}>{sec.content}</p>
                      </div>
                    ))}
                  </div>

                  <div className="page-break-avoid" style={{ marginBottom: 20, border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 18, background: "rgba(15,10,32,0.6)" }}>
                    <h3 style={{ color: "#F3D37A", fontSize: 15, fontWeight: 800, marginBottom: 8 }}>🔮 {t.sec.pred}</h3>
                    <p style={{ lineHeight: 1.85, fontSize: 13, whiteSpace: "pre-wrap", color: "rgba(241,231,208,0.9)" }}>{result.pred}</p>
                  </div>

                  <div className="page-break-avoid" style={{ marginBottom: 20, border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 18, background: "rgba(15,10,32,0.6)" }}>
                    <h3 style={{ color: "#F3D37A", fontSize: 15, fontWeight: 800, marginBottom: 12 }}>💎 {t.sec.gems}</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
                      {[
                        { title: t.sec.colours, val: result.colours },
                        { title: t.sec.numbers, val: result.numbers },
                        { title: t.sec.days, val: result.days },
                        { title: t.sec.rudraksha, val: result.rudraksha },
                      ].map(item => (
                        <div key={item.title} style={{ border: "1px solid rgba(212,175,55,0.2)", borderRadius: 6, padding: 10, background: "rgba(11,8,25,0.7)" }}>
                          <div style={{ fontSize: 11, color: "#FDE68A", fontWeight: 700 }}>{item.title}</div>
                          <div style={{ fontSize: 12.5, color: "rgba(241,231,208,0.9)", marginTop: 2 }}>{item.val}</div>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: 13, lineHeight: 1.75, whiteSpace: "pre-wrap", color: "rgba(241,231,208,0.9)" }}>{result.gems}</p>
                  </div>

                  <div className="page-break-avoid" style={{ border: "1px solid rgba(245,158,11,0.5)", borderRadius: 10, padding: 18, background: "linear-gradient(135deg, rgba(35,22,65,0.9), rgba(18,12,38,0.95))" }}>
                    <h3 style={{ color: "#F3D37A", fontSize: 15, fontWeight: 800, marginBottom: 8 }}>✨ {t.sec.verdict}</h3>
                    <p style={{ fontSize: 14, lineHeight: 1.85, color: "#FFF" }}>{result.verdict}</p>
                    <div style={{ textAlign: "center", marginTop: 16, color: "rgba(243,211,122,0.75)", fontSize: 12, letterSpacing: 1.5, fontWeight: 600 }}>
                      ✦ OM TAT SAT ✦ — {t.footer2}
                    </div>
                  </div>
                </div>
              )}

            </div>
          );
        })()}

        {/* Screen Footer with Secret Admin Trigger */}
        <footer
          onClick={handleSecretTrigger}
          className="no-print"
          style={{ textAlign: "center", marginTop: 56, color: "rgba(243, 211, 122, 0.7)", fontSize: 13, letterSpacing: 1.5, cursor: "pointer", userSelect: "none" }}
          title="Click 3 times for Admin VIP Portal"
        >
          <div style={{ marginBottom: 6, fontWeight: 700, fontSize: 14 }}>{t.footer1}</div>
          <div style={{ fontSize: 12.5, letterSpacing: 0.5, color: "rgba(241, 231, 208, 0.75)" }}>{t.footer2}</div>
        </footer>

        {/* Floating Admin Switcher Widget (When in Admin Mode) */}
        {isAdmin && (
          <aside
            aria-label="Admin Mode Controls"
            className="no-print"
            style={{
              position: "fixed",
              bottom: 18,
              right: 18,
              zIndex: 90,
              background: "linear-gradient(135deg, rgba(35,22,65,0.95), rgba(18,12,38,0.98))",
              border: "1.5px solid #F59E0B",
              borderRadius: 30,
              padding: "8px 16px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.7), 0 0 12px rgba(245,158,11,0.35)",
              display: "flex",
              alignItems: "center",
              gap: 10
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 800, color: "#FDE68A", display: "flex", alignItems: "center", gap: 6 }}>
              <span>👑</span> VIP Admin Mode
            </div>
            <button
              onClick={handleToggleAdminMode}
              style={{
                background: "rgba(245,158,11,0.2)",
                border: "1px solid rgba(245,158,11,0.5)",
                color: "#F3D37A",
                borderRadius: 20,
                padding: "4px 10px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer"
              }}
              title="Click to test regular user paywalls"
            >
              Test User View
            </button>
          </aside>
        )}

      </main>
    </div>
  );
}

// ── REUSABLE SECTION CARD ─────────────────────────────────────────
const SectionCard = ({ icon, title, content, highlight = false }) => (
  <div
    className="glass-card"
    style={{
      padding: "26px 30px",
      marginBottom: 20,
      border: highlight ? "1px solid rgba(245, 158, 11, 0.45)" : "1px solid rgba(212, 175, 55, 0.22)",
      background: highlight ? "linear-gradient(135deg, rgba(35, 22, 65, 0.8) 0%, rgba(18, 12, 38, 0.95) 100%)" : undefined,
    }}
  >
    <h3 style={{ color: "#F3D37A", fontSize: 16, fontWeight: 800, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 20 }}>{icon}</span> {title}
    </h3>
    <div style={{ color: "rgba(241, 231, 208, 0.94)", fontSize: 15, lineHeight: 1.9, whiteSpace: "pre-wrap" }}>
      {content}
    </div>
  </div>
);
