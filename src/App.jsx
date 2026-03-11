import { useState, useRef } from "react";

const ZODIAC_SIGNS = [
  { name: "Aries", symbol: "♈", sanskrit: "Mesh" },
  { name: "Taurus", symbol: "♉", sanskrit: "Vrishabh" },
  { name: "Gemini", symbol: "♊", sanskrit: "Mithun" },
  { name: "Cancer", symbol: "♋", sanskrit: "Kark" },
  { name: "Leo", symbol: "♌", sanskrit: "Simha" },
  { name: "Virgo", symbol: "♍", sanskrit: "Kanya" },
  { name: "Libra", symbol: "♎", sanskrit: "Tula" },
  { name: "Scorpio", symbol: "♏", sanskrit: "Vrishchik" },
  { name: "Sagittarius", symbol: "♐", sanskrit: "Dhanu" },
  { name: "Capricorn", symbol: "♑", sanskrit: "Makar" },
  { name: "Aquarius", symbol: "♒", sanskrit: "Kumbh" },
  { name: "Pisces", symbol: "♓", sanskrit: "Meen" },
];

const PLANETS = [
  { name: "Sun", symbol: "Su", color: "#FFB800", sanskrit: "Surya" },
  { name: "Moon", symbol: "Mo", color: "#C0C0C0", sanskrit: "Chandra" },
  { name: "Mars", symbol: "Ma", color: "#FF4444", sanskrit: "Mangal" },
  { name: "Mercury", symbol: "Me", color: "#00CC88", sanskrit: "Budha" },
  { name: "Jupiter", symbol: "Ju", color: "#FF9900", sanskrit: "Guru" },
  { name: "Venus", symbol: "Ve", color: "#FF69B4", sanskrit: "Shukra" },
  { name: "Saturn", symbol: "Sa", color: "#9988CC", sanskrit: "Shani" },
  { name: "Rahu", symbol: "Ra", color: "#888888", sanskrit: "Rahu" },
  { name: "Ketu", symbol: "Ke", color: "#AA6644", sanskrit: "Ketu" },
];

// UI translations
const UI = {
  en: {
    appTitle: "JYOTISH KUNDLI",
    appSubtitle: "VEDIC BIRTH CHART & COSMIC LIFE READING",
    appTagline: '"As above, so below — the stars illuminate the path of your soul"',
    formTitle: "ENTER YOUR BIRTH DETAILS",
    fieldName: "Full Name *",
    fieldDob: "Date of Birth *",
    fieldTob: "Time of Birth",
    fieldPob: "Place of Birth *",
    fieldNamePh: "Your complete name",
    fieldPobPh: "City, State, Country",
    btnReveal: "✦ REVEAL MY KUNDLI ✦",
    btnLoading: "✦ CONSULTING THE STARS ✦",
    errorFields: "Please fill Name, Date of Birth and Place of Birth.",
    errorApi: "The cosmos whispered too softly. Please try again.",
    consulting: "CONSULTING THE COSMOS...",
    calculating: "Calculating your planetary positions...",
    chartTitle: "NORTH INDIAN KUNDLI CHART",
    chartSub: "House 1 at top • Planets shown in their natal positions",
    planetTable: "PLANETARY POSITIONS TABLE",
    housesTitle: "ALL 12 HOUSES ANALYSIS",
    tabs: {
      chart: "Chart", overview: "Overview", planets: "Planets",
      houses: "Houses", life: "Life Areas", predictions: "Predictions",
      lifestyle: "Lifestyle", remedies: "Remedies"
    },
    sections: {
      cosmicBlueprint: "Your Cosmic Blueprint",
      yogas: "Special Planetary Yogas",
      spiritual: "Spiritual Path & Dharma",
      verdict: "The Stars' Final Verdict",
      planetaryAnalysis: "Detailed Planetary Analysis",
      houseAnalysis: "Key House Lords & Their Impact",
      dasha: "Dasha Periods",
      dashaFull: "Dasha Periods & Timing",
      health: "Health & Vitality",
      wealth: "Wealth & Prosperity",
      education: "Education & Intellect",
      career: "Career & Profession",
      marriage: "Marriage & Relationships",
      children: "Children & Legacy",
      predictions: "Life Predictions — Decade by Decade",
      adopt: "What to Adopt for a Blessed Life",
      avoid: "What to Avoid for Harmony",
      mantras: "Sacred Mantras for Your Chart",
      colours: "Lucky Colours",
      numbers: "Lucky Numbers",
      days: "Auspicious Days",
      rudraksha: "Rudraksha",
      gemstones: "Gemstone Recommendations",
      longevity: "Longevity & Life Vitality",
    },
    pills: { lagna: "Lagna", rashi: "Rashi", nakshatra: "Nakshatra", tithi: "Tithi", yoga: "Yoga" },
    planetCols: ["Planet", "Sign", "House", "Degree", "Status", "Effect"],
    houseNames: ["Self & Personality","Wealth & Family","Siblings & Courage","Home & Mother","Education & Children","Health & Enemies","Marriage & Partner","Death & Transformation","Fortune & Philosophy","Career & Status","Gains & Friends","Losses & Spirituality"],
    noPlanets: "No planets",
    footer1: "✦ OM TAT SAT ✦",
    footer2: "For spiritual guidance only • Consult a professional astrologer for life decisions",
    langBtn: "हिंदी में देखें",
  },
  hi: {
    appTitle: "ज्योतिष कुंडली",
    appSubtitle: "वैदिक जन्म कुंडली और ब्रह्मांडीय जीवन विश्लेषण",
    appTagline: '"जैसा ऊपर, वैसा नीचे — तारे आपकी आत्मा का मार्ग प्रकाशित करते हैं"',
    formTitle: "अपना जन्म विवरण दर्ज करें",
    fieldName: "पूरा नाम *",
    fieldDob: "जन्म तिथि *",
    fieldTob: "जन्म समय",
    fieldPob: "जन्म स्थान *",
    fieldNamePh: "आपका पूरा नाम",
    fieldPobPh: "शहर, राज्य, देश",
    btnReveal: "✦ मेरी कुंडली प्रकट करें ✦",
    btnLoading: "✦ ग्रहों से परामर्श हो रहा है ✦",
    errorFields: "कृपया नाम, जन्म तिथि और जन्म स्थान भरें।",
    errorApi: "ब्रह्मांड की आवाज़ बहुत धीमी थी। कृपया पुनः प्रयास करें।",
    consulting: "ब्रह्मांड से परामर्श हो रहा है...",
    calculating: "आपकी ग्रह स्थितियों की गणना हो रही है...",
    chartTitle: "उत्तर भारतीय कुंडली चार्ट",
    chartSub: "भाव १ शीर्ष पर • ग्रह उनकी जन्मकालीन स्थिति में दर्शाए गए हैं",
    planetTable: "ग्रह स्थिति तालिका",
    housesTitle: "सभी १२ भावों का विश्लेषण",
    tabs: {
      chart: "चार्ट", overview: "सिंहावलोकन", planets: "ग्रह",
      houses: "भाव", life: "जीवन क्षेत्र", predictions: "भविष्यवाणी",
      lifestyle: "जीवनशैली", remedies: "उपाय"
    },
    sections: {
      cosmicBlueprint: "आपका ब्रह्मांडीय青प्रारूप",
      yogas: "विशेष ग्रह योग",
      spiritual: "आध्यात्मिक मार्ग और धर्म",
      verdict: "तारों का अंतिम संदेश",
      planetaryAnalysis: "विस्तृत ग्रह विश्लेषण",
      houseAnalysis: "प्रमुख भाव स्वामी और उनका प्रभाव",
      dasha: "दशा काल",
      dashaFull: "दशा काल और समय",
      health: "स्वास्थ्य और शक्ति",
      wealth: "धन और समृद्धि",
      education: "शिक्षा और बुद्धि",
      career: "करियर और व्यवसाय",
      marriage: "विवाह और संबंध",
      children: "संतान और विरासत",
      predictions: "जीवन भविष्यवाणी — दशक दर दशक",
      adopt: "सुखी जीवन के लिए क्या अपनाएं",
      avoid: "सद्भाव के लिए क्या टालें",
      mantras: "आपकी कुंडली के पवित्र मंत्र",
      colours: "शुभ रंग",
      numbers: "भाग्यशाली अंक",
      days: "शुभ दिन",
      rudraksha: "रुद्राक्ष",
      gemstones: "रत्न अनुशंसाएं",
      longevity: "आयु और जीवन शक्ति",
    },
    pills: { lagna: "लग्न", rashi: "राशि", nakshatra: "नक्षत्र", tithi: "तिथि", yoga: "योग" },
    planetCols: ["ग्रह", "राशि", "भाव", "अंश", "स्थिति", "प्रभाव"],
    houseNames: ["स्वयं और व्यक्तित्व","धन और परिवार","भाई-बहन और साहस","घर और माता","शिक्षा और संतान","स्वास्थ्य और शत्रु","विवाह और साथी","मृत्यु और परिवर्तन","भाग्य और दर्शन","करियर और प्रतिष्ठा","लाभ और मित्र","व्यय और अध्यात्म"],
    noPlanets: "कोई ग्रह नहीं",
    footer1: "✦ ॐ तत् सत् ✦",
    footer2: "केवल आध्यात्मिक मार्गदर्शन के लिए • जीवन निर्णयों के लिए किसी ज्योतिषी से परामर्श लें",
    langBtn: "View in English",
  }
};

const SECTIONS_LIST = [
  { id: "chart", icon: "🔯" },
  { id: "overview", icon: "🌟" },
  { id: "planets", icon: "🪐" },
  { id: "houses", icon: "🏠" },
  { id: "life", icon: "🌿" },
  { id: "predictions", icon: "🔮" },
  { id: "lifestyle", icon: "☯️" },
  { id: "remedies", icon: "💎" },
];

const NorthIndianChart = ({ chartData }) => {
  const S = 420;
  const h = chartData?.houses || {};
  const getHouse = (n) => {
    const d = h[n] || h[String(n)] || {};
    const sign = d.sign || "";
    const signData = ZODIAC_SIGNS.find(z => z.name === sign || z.sanskrit === sign) || ZODIAC_SIGNS[(n - 1) % 12];
    return { signData, planets: d.planets || [] };
  };
  const renderHouseText = (n, cx, cy) => {
    const { signData, planets } = getHouse(n);
    const pObjs = planets.map(p => ({ text: PLANETS.find(pl => pl.name === p || pl.symbol === p)?.symbol || p, color: PLANETS.find(pl => pl.name === p || pl.symbol === p)?.color || "#d4af37" }));
    return (
      <g key={n}>
        <text x={cx} y={cy - 14} textAnchor="middle" fill="rgba(212,175,55,0.45)" fontSize="10" fontFamily="Cinzel,serif">{n}</text>
        <text x={cx} y={cy + 2} textAnchor="middle" fill="#d4af37" fontSize="14">{signData.symbol}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="rgba(212,175,55,0.55)" fontSize="8" fontFamily="serif">{signData.sanskrit}</text>
        {pObjs.map((p, i) => <text key={i} x={cx + (i - (pObjs.length - 1) / 2) * 14} y={cy + 26} textAnchor="middle" fill={p.color} fontSize="9" fontWeight="bold">{p.text}</text>)}
      </g>
    );
  };
  const c = S / 2, q = S / 4;
  return (
    <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
      <svg width={S} height={S} style={{ filter: "drop-shadow(0 0 30px rgba(212,175,55,0.15))", maxWidth: "100%" }}>
        <rect x="1" y="1" width={S-2} height={S-2} fill="rgba(8,4,20,0.97)" stroke="#d4af37" strokeWidth="2" rx="4"/>
        <line x1={c} y1="1" x2={c} y2={S-1} stroke="rgba(212,175,55,0.5)" strokeWidth="1"/>
        <line x1="1" y1={c} x2={S-1} y2={c} stroke="rgba(212,175,55,0.5)" strokeWidth="1"/>
        <line x1="1" y1="1" x2={S-1} y2={S-1} stroke="rgba(212,175,55,0.4)" strokeWidth="1"/>
        <line x1={S-1} y1="1" x2="1" y2={S-1} stroke="rgba(212,175,55,0.4)" strokeWidth="1"/>
        <polygon points={`${c},${q} ${S-q},${c} ${c},${S-q} ${q},${c}`} fill="rgba(15,8,40,0.95)" stroke="#d4af37" strokeWidth="1.5"/>
        <line x1={c} y1={q} x2={q} y2={c} stroke="rgba(212,175,55,0.3)" strokeWidth="1"/>
        <line x1={c} y1={q} x2={S-q} y2={c} stroke="rgba(212,175,55,0.3)" strokeWidth="1"/>
        <line x1={c} y1={S-q} x2={q} y2={c} stroke="rgba(212,175,55,0.3)" strokeWidth="1"/>
        <line x1={c} y1={S-q} x2={S-q} y2={c} stroke="rgba(212,175,55,0.3)" strokeWidth="1"/>
        <text x={c} y={c+12} textAnchor="middle" fill="#d4af37" fontSize="30" fontFamily="serif" opacity="0.9">ॐ</text>
        {renderHouseText(1, c, q * 0.65)}
        {renderHouseText(2, q * 0.65, q * 0.65)}
        {renderHouseText(3, q * 0.28, c - q * 0.4)}
        {renderHouseText(4, q * 0.65, c)}
        {renderHouseText(5, q * 0.28, c + q * 0.4)}
        {renderHouseText(6, q * 0.65, S - q * 0.65)}
        {renderHouseText(7, c, S - q * 0.65)}
        {renderHouseText(8, S - q * 0.65, S - q * 0.65)}
        {renderHouseText(9, S - q * 0.28, c + q * 0.4)}
        {renderHouseText(10, S - q * 0.65, c)}
        {renderHouseText(11, S - q * 0.28, c - q * 0.4)}
        {renderHouseText(12, S - q * 0.65, q * 0.65)}
      </svg>
    </div>
  );
};

const PlanetTable = ({ planetData, lang, t }) => {
  if (!planetData) return null;
  return (
    <div style={{ background: "rgba(10,5,30,0.95)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 16, overflow: "hidden", marginBottom: 24 }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
          <thead>
            <tr style={{ background: "rgba(212,175,55,0.15)" }}>
              {t.planetCols.map(h => <th key={h} style={{ padding: "10px 12px", fontFamily: lang === "hi" ? "'Noto Sans Devanagari', serif" : "'Cinzel', serif", color: "#d4af37", fontSize: 10, letterSpacing: 1, borderBottom: "1px solid rgba(212,175,55,0.2)", textAlign: "left" }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {PLANETS.map((p, i) => {
              const pd = planetData[p.name] || {};
              return (
                <tr key={p.name} style={{ borderBottom: "1px solid rgba(212,175,55,0.08)", background: i % 2 === 0 ? "transparent" : "rgba(212,175,55,0.02)" }}>
                  <td style={{ padding: "9px 12px" }}>
                    <span style={{ color: p.color, fontWeight: "bold", fontFamily: "'Cinzel', serif", fontSize: 12 }}>{p.symbol} {p.name}</span>
                    <div style={{ fontSize: 9, color: "rgba(212,175,55,0.35)" }}>{p.sanskrit}</div>
                  </td>
                  <td style={{ padding: "9px 12px", color: "rgba(230,210,180,0.8)", fontSize: 12 }}>{pd.sign || "—"}</td>
                  <td style={{ padding: "9px 12px", color: "rgba(230,210,180,0.8)", fontSize: 12 }}>H{pd.house || "—"}</td>
                  <td style={{ padding: "9px 12px", color: "rgba(230,210,180,0.8)", fontSize: 12 }}>{pd.degree || "—"}</td>
                  <td style={{ padding: "9px 12px" }}>
                    <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 10,
                      background: pd.status === "Exalted" || pd.status === "उच्च" ? "rgba(0,200,100,0.15)" : pd.status === "Debilitated" || pd.status === "नीच" ? "rgba(255,80,80,0.15)" : "rgba(212,175,55,0.1)",
                      color: pd.status === "Exalted" || pd.status === "उच्च" ? "#00c864" : pd.status === "Debilitated" || pd.status === "नीच" ? "#ff5050" : "#d4af37",
                      border: `1px solid ${pd.status === "Exalted" || pd.status === "उच्च" ? "rgba(0,200,100,0.3)" : pd.status === "Debilitated" || pd.status === "नीच" ? "rgba(255,80,80,0.3)" : "rgba(212,175,55,0.2)"}`,
                    }}>{pd.status || "—"}</span>
                  </td>
                  <td style={{ padding: "9px 12px", color: "rgba(230,210,180,0.65)", fontSize: 11 }}>{pd.effect || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const HouseGrid = ({ houseData, t, lang }) => {
  if (!houseData) return null;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
      {Array.from({ length: 12 }, (_, i) => {
        const n = i + 1;
        const d = houseData[n] || houseData[String(n)] || {};
        const signData = ZODIAC_SIGNS.find(z => z.name === d.sign || z.sanskrit === d.sign) || ZODIAC_SIGNS[i];
        const planets = d.planets || [];
        return (
          <div key={n} style={{ background: "rgba(10,5,30,0.95)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 12, padding: "14px 16px", borderLeft: "3px solid rgba(212,175,55,0.5)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <span style={{ fontFamily: lang === "hi" ? "'Noto Sans Devanagari', serif" : "'Cinzel', serif", color: "#d4af37", fontSize: 12, fontWeight: 600 }}>
                  {lang === "hi" ? `भाव ${n}` : `House ${n}`}
                </span>
                <div style={{ fontSize: 9, color: "rgba(212,175,55,0.45)", marginTop: 2, fontFamily: lang === "hi" ? "'Noto Sans Devanagari', serif" : "inherit" }}>{t.houseNames[i]}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 20, color: "#d4af37", lineHeight: 1 }}>{signData.symbol}</div>
                <div style={{ fontSize: 8, color: "rgba(212,175,55,0.45)", marginTop: 2 }}>{signData.sanskrit}</div>
              </div>
            </div>
            {planets.length > 0 ? (
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 7 }}>
                {planets.map((p, j) => {
                  const pd = PLANETS.find(pl => pl.name === p || pl.symbol === p);
                  return <span key={j} style={{ padding: "2px 7px", borderRadius: 10, fontSize: 10, background: "rgba(212,175,55,0.08)", color: pd?.color || "#d4af37", border: "1px solid rgba(212,175,55,0.15)" }}>{p}</span>;
                })}
              </div>
            ) : <div style={{ fontSize: 10, color: "rgba(212,175,55,0.25)", marginBottom: 7, fontStyle: "italic" }}>{t.noPlanets}</div>}
            <p style={{ fontSize: 11, color: "rgba(230,210,180,0.65)", lineHeight: 1.6, fontFamily: lang === "hi" ? "'Noto Sans Devanagari', serif" : "inherit" }}>{d.interpretation || ""}</p>
          </div>
        );
      })}
    </div>
  );
};

const SectionBlock = ({ title, content, icon, lang }) => (
  <div style={{ background: "linear-gradient(135deg, rgba(20,10,40,0.9), rgba(10,5,30,0.95))", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 16, padding: "26px 30px", marginBottom: 22, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #d4af37, transparent)" }} />
    <h3 style={{ fontFamily: lang === "hi" ? "'Noto Sans Devanagari', serif" : "'Cinzel Decorative', serif", color: "#d4af37", fontSize: lang === "hi" ? 16 : 14, marginBottom: 14, display: "flex", alignItems: "center", gap: 9, letterSpacing: lang === "hi" ? 0 : 1.5 }}>
      <span style={{ fontSize: 18 }}>{icon}</span>{title}
    </h3>
    <div style={{ color: "rgba(230,210,180,0.88)", fontFamily: lang === "hi" ? "'Noto Sans Devanagari', serif" : "'EB Garamond', serif", fontSize: lang === "hi" ? 15 : 16, lineHeight: 2, whiteSpace: "pre-wrap" }}>{content}</div>
  </div>
);

const StarField = () => {
  const stars = Array.from({ length: 100 }, (_, i) => ({ id: i, x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 2 + 0.5, delay: Math.random() * 4, dur: 2 + Math.random() * 3 }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {stars.map(s => <div key={s.id} style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, borderRadius: "50%", background: `rgba(255,220,150,0.6)`, animation: `twinkle ${s.dur}s ${s.delay}s infinite alternate` }} />)}
    </div>
  );
};

const Spinner = ({ t, lang }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "60px 0" }}>
    <div style={{ position: "relative", width: 110, height: 110 }}>
      {[0, 1, 2].map(i => <div key={i} style={{ position: "absolute", inset: i * 14, border: `2px solid rgba(212,175,55,${0.8 - i * 0.2})`, borderRadius: "50%", animation: `spin ${3 + i}s linear infinite ${i % 2 ? "reverse" : ""}`, borderTopColor: "transparent" }} />)}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, animation: "pulse 2s ease-in-out infinite" }}>🔯</div>
    </div>
    <p style={{ color: "#d4af37", fontFamily: lang === "hi" ? "'Noto Sans Devanagari', serif" : "'Cinzel', serif", fontSize: 12, letterSpacing: lang === "hi" ? 0 : 3, textAlign: "center" }}>{t.consulting}</p>
    <p style={{ color: "rgba(212,175,55,0.35)", fontSize: 12, fontFamily: lang === "hi" ? "'Noto Sans Devanagari', serif" : "'EB Garamond', serif", textAlign: "center" }}>{t.calculating}</p>
  </div>
);

// Language Toggle Button
const LangToggle = ({ lang, setLang, t }) => (
  <button onClick={() => setLang(lang === "en" ? "hi" : "en")}
    style={{
      position: "fixed", top: 20, right: 20, zIndex: 100,
      background: "linear-gradient(135deg, rgba(20,10,45,0.95), rgba(10,5,30,0.98))",
      border: "1px solid rgba(212,175,55,0.5)", borderRadius: 30,
      padding: "9px 18px", cursor: "pointer",
      display: "flex", alignItems: "center", gap: 8,
      boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
      transition: "all 0.3s ease",
    }}>
    <span style={{ fontSize: 18 }}>{lang === "en" ? "🇮🇳" : "🇬🇧"}</span>
    <span style={{
      color: "#d4af37",
      fontFamily: lang === "en" ? "'Noto Sans Devanagari', serif" : "'Cinzel', serif",
      fontSize: lang === "en" ? 13 : 11,
      letterSpacing: lang === "en" ? 0 : 1,
      fontWeight: 600,
    }}>{t.langBtn}</span>
  </button>
);

export default function KundliApp() {
  const [form, setForm] = useState({ name: "", dob: "", pob: "", tob: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeSection, setActiveSection] = useState("chart");
  const [error, setError] = useState("");
  const [lang, setLang] = useState("en");
  const resultRef = useRef(null);

  const t = UI[lang];
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const generateKundli = async () => {
    if (!form.name || !form.dob || !form.pob) { setError(t.errorFields); return; }
    setError(""); setLoading(true); setResult(null);

    const isHindi = lang === "hi";
    const langInstruction = isHindi
      ? "IMPORTANT: Write ALL text values in Hindi (Devanagari script). Only keep planet names, zodiac sign names, and technical terms in English within the JSON keys. All interpretation, analysis, prediction, and descriptive text must be in fluent, natural Hindi."
      : "Write all text values in English.";

    const prompt = `You are a master Vedic astrologer. Generate a complete Kundli for:
Name: ${form.name}
DOB: ${form.dob}
Place: ${form.pob}
Time: ${form.tob || "12:00"}

${langInstruction}

Return ONLY valid JSON (no markdown, no backticks) with these exact keys:

{
  "lagna": "${isHindi ? "लग्न राशि नाम" : "Ascendant sign"}",
  "rashi": "${isHindi ? "चंद्र राशि" : "Moon sign"}",
  "nakshatra": "${isHindi ? "जन्म नक्षत्र और चरण" : "Birth star and pada"}",
  "tithi": "${isHindi ? "तिथि नाम" : "Lunar day"}",
  "yoga": "${isHindi ? "योग नाम" : "Yoga name"}",
  "karana": "${isHindi ? "करण" : "Karana"}",

  "planetData": {
    "Sun": { "sign": "Leo", "house": 5, "degree": "15°20'", "status": "${isHindi ? "उच्च/नीच/स्वगृही/सम" : "Exalted/Debilitated/Own Sign/Neutral"}", "effect": "${isHindi ? "हिंदी में प्रभाव" : "brief effect in English"}" },
    "Moon": { "sign": "Cancer", "house": 4, "degree": "8°45'", "status": "${isHindi ? "स्वगृही" : "Own Sign"}", "effect": "${isHindi ? "हिंदी में" : "in English"}" },
    "Mars": { "sign": "Aries", "house": 1, "degree": "22°10'", "status": "${isHindi ? "स्वगृही" : "Own Sign"}", "effect": "${isHindi ? "हिंदी में" : "in English"}" },
    "Mercury": { "sign": "Virgo", "house": 6, "degree": "5°30'", "status": "${isHindi ? "उच्च" : "Exalted"}", "effect": "${isHindi ? "हिंदी में" : "in English"}" },
    "Jupiter": { "sign": "Cancer", "house": 4, "degree": "18°55'", "status": "${isHindi ? "उच्च" : "Exalted"}", "effect": "${isHindi ? "हिंदी में" : "in English"}" },
    "Venus": { "sign": "Taurus", "house": 2, "degree": "12°25'", "status": "${isHindi ? "स्वगृही" : "Own Sign"}", "effect": "${isHindi ? "हिंदी में" : "in English"}" },
    "Saturn": { "sign": "Libra", "house": 7, "degree": "28°40'", "status": "${isHindi ? "उच्च" : "Exalted"}", "effect": "${isHindi ? "हिंदी में" : "in English"}" },
    "Rahu": { "sign": "Gemini", "house": 3, "degree": "14°15'", "status": "${isHindi ? "सम" : "Neutral"}", "effect": "${isHindi ? "हिंदी में" : "in English"}" },
    "Ketu": { "sign": "Sagittarius", "house": 9, "degree": "14°15'", "status": "${isHindi ? "सम" : "Neutral"}", "effect": "${isHindi ? "हिंदी में" : "in English"}" }
  },

  "houses": {
    "1": { "sign": "Aries", "planets": ["Mars"], "interpretation": "${isHindi ? "भाव १ की व्याख्या हिंदी में २ वाक्य" : "2 sentence interpretation in English"}" },
    "2": { "sign": "Taurus", "planets": [], "interpretation": "${isHindi ? "हिंदी में" : "in English"}" },
    "3": { "sign": "Gemini", "planets": ["Rahu"], "interpretation": "${isHindi ? "हिंदी में" : "in English"}" },
    "4": { "sign": "Cancer", "planets": ["Moon","Jupiter"], "interpretation": "${isHindi ? "हिंदी में" : "in English"}" },
    "5": { "sign": "Leo", "planets": ["Sun"], "interpretation": "${isHindi ? "हिंदी में" : "in English"}" },
    "6": { "sign": "Virgo", "planets": ["Mercury"], "interpretation": "${isHindi ? "हिंदी में" : "in English"}" },
    "7": { "sign": "Libra", "planets": ["Saturn"], "interpretation": "${isHindi ? "हिंदी में" : "in English"}" },
    "8": { "sign": "Scorpio", "planets": [], "interpretation": "${isHindi ? "हिंदी में" : "in English"}" },
    "9": { "sign": "Sagittarius", "planets": ["Ketu"], "interpretation": "${isHindi ? "हिंदी में" : "in English"}" },
    "10": { "sign": "Capricorn", "planets": [], "interpretation": "${isHindi ? "हिंदी में" : "in English"}" },
    "11": { "sign": "Aquarius", "planets": [], "interpretation": "${isHindi ? "हिंदी में" : "in English"}" },
    "12": { "sign": "Pisces", "planets": [], "interpretation": "${isHindi ? "हिंदी में" : "in English"}" }
  },

  "overview": "${isHindi ? "200 शब्दों में व्यक्तिगत ब्रह्मांडीय अवलोकन हिंदी में" : "200 word personalized cosmic overview in English"}",
  "planetaryAnalysis": "${isHindi ? "सभी ९ ग्रहों का विस्तृत विश्लेषण हिंदी में" : "Detailed analysis of all 9 planets in English"}",
  "houseAnalysis": "${isHindi ? "प्रमुख भावों और उनके स्वामियों का विश्लेषण हिंदी में" : "Analysis of significant houses and lords in English"}",
  "yogas": "${isHindi ? "विशेष ग्रह योगों का विवरण हिंदी में" : "Special planetary yogas description in English"}",
  "dasha": "${isHindi ? "वर्तमान और आगामी दशा-अंतर्दशा का विवरण हिंदी में" : "Current and upcoming Dasha periods in English"}",
  "health": "${isHindi ? "स्वास्थ्य विश्लेषण हिंदी में" : "Health analysis in English"}",
  "wealth": "${isHindi ? "धन विश्लेषण हिंदी में" : "Wealth analysis in English"}",
  "education": "${isHindi ? "शिक्षा विश्लेषण हिंदी में" : "Education analysis in English"}",
  "career": "${isHindi ? "करियर विश्लेषण हिंदी में" : "Career analysis in English"}",
  "marriage": "${isHindi ? "विवाह विश्लेषण हिंदी में" : "Marriage analysis in English"}",
  "children": "${isHindi ? "संतान विश्लेषण हिंदी में" : "Children analysis in English"}",
  "predictions": "${isHindi ? "दशक दर दशक जीवन भविष्यवाणी हिंदी में: आयु 0-10, 10-20, 20-30, 30-40, 40-50, 50-60, 60-70, 70+" : "Decade by decade life predictions 0-10, 10-20, 20-30, 30-40, 40-50, 50-60, 60-70, 70+"}",
  "lifestyle_adopt": "${isHindi ? "क्या अपनाएं हिंदी में" : "What lifestyle habits to adopt in English"}",
  "lifestyle_avoid": "${isHindi ? "क्या टालें हिंदी में" : "What to avoid in English"}",
  "favourable_colours": "${isHindi ? "शुभ रंग और कारण हिंदी में" : "Lucky colors with reasoning in English"}",
  "favourable_numbers": "${isHindi ? "भाग्यशाली अंक हिंदी में" : "Lucky numbers in English"}",
  "favourable_days": "${isHindi ? "शुभ दिन हिंदी में" : "Auspicious days in English"}",
  "gemstones": "${isHindi ? "रत्न अनुशंसाएं हिंदी में" : "Gemstone recommendations in English"}",
  "rudraksha": "${isHindi ? "रुद्राक्ष अनुशंसाएं हिंदी में" : "Rudraksha recommendations in English"}",
  "mantras": "${isHindi ? "मंत्र निर्देश हिंदी में" : "Mantra instructions in English"}",
  "longevity": "${isHindi ? "आयु विश्लेषण हिंदी में" : "Longevity assessment in English"}",
  "spiritual_path": "${isHindi ? "आध्यात्मिक मार्ग हिंदी में" : "Spiritual path in English"}",
  "summary_verdict": "${isHindi ? "१२० शब्दों में अंतिम ब्रह्मांडीय संदेश हिंदी में" : "120 word final cosmic message in English"}"
}`;

    try {
      const response = await fetch("/api/claude-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          system: `You are an expert Vedic astrologer. Return only valid JSON with no markdown, no backticks. All house keys must be string numbers like "1","2" etc. ${isHindi ? "Write ALL descriptive/analytical text in fluent Hindi (Devanagari script)." : "Write all text in English."}`,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const raw = data.content.map(b => b.text || "").join("");
      const cleaned = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      setResult(parsed);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      setError(t.errorApi);
    }
    setLoading(false);
  };

  const bodyFont = lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "'EB Garamond', Georgia, serif";
  const headFont = lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "'Cinzel', serif";

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0520 0%, #050215 40%, #0d0828 70%, #08041a 100%)", color: "#e6d4b0", fontFamily: bodyFont, position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');
        @keyframes twinkle{from{opacity:0.2;transform:scale(1)}to{opacity:1;transform:scale(1.5)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
        @keyframes fadeSlideIn{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        input:focus{outline:none;border-color:rgba(212,175,55,0.8)!important;box-shadow:0 0 20px rgba(212,175,55,0.15)}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#050215}
        ::-webkit-scrollbar-thumb{background:#d4af37;border-radius:3px}
      `}</style>

      <StarField />
      <LangToggle lang={lang} setLang={setLang} t={t} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 920, margin: "0 auto", padding: "40px 20px 80px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 12, animation: "pulse 3s ease-in-out infinite" }}>🔯</div>
          <h1 style={{ fontFamily: lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "'Cinzel Decorative', serif", fontSize: "clamp(20px, 5vw, 38px)", background: "linear-gradient(90deg, #8b6914, #d4af37, #f5d87a, #d4af37, #8b6914)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 4s linear infinite", letterSpacing: lang === "hi" ? 2 : 4, marginBottom: 10, fontWeight: 700 }}>{t.appTitle}</h1>
          <p style={{ color: "rgba(212,175,55,0.55)", fontFamily: headFont, fontSize: lang === "hi" ? 12 : 10, letterSpacing: lang === "hi" ? 0 : 4 }}>{t.appSubtitle}</p>
          <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #d4af37, transparent)", margin: "16px auto", maxWidth: 280 }} />
          <p style={{ color: "rgba(230,210,180,0.35)", fontSize: 13, fontStyle: "italic", fontFamily: bodyFont }}>{t.appTagline}</p>
        </div>

        {/* Form */}
        <div style={{ background: "linear-gradient(135deg, rgba(20,10,45,0.95), rgba(10,5,30,0.98))", border: "1px solid rgba(212,175,55,0.4)", borderRadius: 20, padding: "34px", marginBottom: 40, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #8b6914, #d4af37, #f5d87a, #d4af37, #8b6914)" }} />
          <h2 style={{ fontFamily: headFont, color: "#d4af37", fontSize: lang === "hi" ? 15 : 13, letterSpacing: lang === "hi" ? 0 : 3, marginBottom: 22, textAlign: "center" }}>{t.formTitle}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { name: "name", label: t.fieldName, placeholder: t.fieldNamePh, type: "text", full: true },
              { name: "dob", label: t.fieldDob, placeholder: "", type: "date", full: false },
              { name: "tob", label: t.fieldTob, placeholder: "", type: "time", full: false },
              { name: "pob", label: t.fieldPob, placeholder: t.fieldPobPh, type: "text", full: true },
            ].map(f => (
              <div key={f.name} style={{ gridColumn: f.full ? "1 / -1" : "span 1" }}>
                <label style={{ display: "block", fontFamily: headFont, fontSize: lang === "hi" ? 11 : 9, color: "rgba(212,175,55,0.65)", letterSpacing: lang === "hi" ? 0 : 2, marginBottom: 6 }}>{f.label}</label>
                <input type={f.type} name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder}
                  style={{ width: "100%", background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.22)", borderRadius: 9, padding: "11px 15px", color: "#e6d4b0", fontFamily: bodyFont, fontSize: 15, transition: "all 0.3s", colorScheme: "dark" }} />
              </div>
            ))}
          </div>
          {error && <p style={{ color: "#e87d7d", fontFamily: headFont, fontSize: 11, textAlign: "center", marginTop: 12 }}>⚠ {error}</p>}
          <button onClick={generateKundli} disabled={loading}
            style={{ display: "block", width: "100%", marginTop: 22, background: loading ? "rgba(212,175,55,0.15)" : "linear-gradient(135deg, #8b6914, #d4af37, #f5d87a, #d4af37, #8b6914)", backgroundSize: "200% auto", border: "none", borderRadius: 11, padding: "14px", color: loading ? "rgba(212,175,55,0.4)" : "#0a0520", fontFamily: lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "'Cinzel', serif", fontSize: lang === "hi" ? 15 : 13, letterSpacing: lang === "hi" ? 0 : 3, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", animation: loading ? "none" : "shimmer 3s linear infinite" }}>
            {loading ? t.btnLoading : t.btnReveal}
          </button>
        </div>

        {loading && <Spinner t={t} lang={lang} />}

        {result && (
          <div ref={resultRef} style={{ animation: "fadeSlideIn 0.8s ease forwards" }}>

            {/* Person Header */}
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 30, marginBottom: 8 }}>✨</div>
              <h2 style={{ fontFamily: lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "'Cinzel Decorative', serif", color: "#d4af37", fontSize: "clamp(15px, 4vw, 24px)", letterSpacing: lang === "hi" ? 1 : 3 }}>{form.name.toUpperCase()}</h2>
              <p style={{ color: "rgba(212,175,55,0.45)", fontFamily: headFont, fontSize: 10, letterSpacing: 2, marginTop: 5 }}>{form.dob} • {form.pob}{form.tob ? ` • ${form.tob}` : ""}</p>
              <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #d4af37, transparent)", margin: "14px auto", maxWidth: 380 }} />

              {/* Info Pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center" }}>
                {[[t.pills.lagna, result.lagna],[t.pills.rashi, result.rashi],[t.pills.nakshatra, result.nakshatra],[t.pills.tithi, result.tithi],[t.pills.yoga, result.yoga]].map(([label, value]) => value && (
                  <div key={label} style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 18, padding: "5px 12px" }}>
                    <span style={{ fontFamily: headFont, fontSize: 8, color: "rgba(212,175,55,0.5)", letterSpacing: 1 }}>{label}: </span>
                    <span style={{ fontFamily: lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "'Cinzel', serif", fontSize: 10, color: "#d4af37", fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginBottom: 28 }}>
              {SECTIONS_LIST.map(s => (
                <button key={s.id} onClick={() => setActiveSection(s.id)}
                  style={{ background: activeSection === s.id ? "linear-gradient(135deg, #d4af37, #8b6914)" : "rgba(212,175,55,0.07)", border: `1px solid ${activeSection === s.id ? "#d4af37" : "rgba(212,175,55,0.25)"}`, color: activeSection === s.id ? "#0a0520" : "#d4af37", fontFamily: lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "'Cinzel', serif", fontSize: lang === "hi" ? 12 : 10, letterSpacing: lang === "hi" ? 0 : 1, padding: "7px 13px", borderRadius: 28, cursor: "pointer", transition: "all 0.25s", fontWeight: activeSection === s.id ? 700 : 400 }}>
                  {s.icon} {t.tabs[s.id]}
                </button>
              ))}
            </div>

            {/* CHART */}
            {activeSection === "chart" && (
              <div>
                <div style={{ textAlign: "center", marginBottom: 14 }}>
                  <h3 style={{ fontFamily: lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "'Cinzel', serif", color: "#d4af37", fontSize: 13, letterSpacing: lang === "hi" ? 0 : 2 }}>{t.chartTitle}</h3>
                  <p style={{ color: "rgba(212,175,55,0.35)", fontSize: 11, marginTop: 4, fontFamily: bodyFont }}>{t.chartSub}</p>
                </div>
                <NorthIndianChart chartData={{ houses: result.houses }} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center", marginBottom: 24 }}>
                  {PLANETS.map(p => (
                    <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(10,5,30,0.8)", border: "1px solid rgba(212,175,55,0.18)", borderRadius: 10, padding: "4px 10px" }}>
                      <span style={{ color: p.color, fontWeight: "bold", fontSize: 11 }}>{p.symbol}</span>
                      <span style={{ color: "rgba(230,210,180,0.55)", fontSize: 10 }}>{lang === "hi" ? p.sanskrit : p.name}</span>
                    </div>
                  ))}
                </div>
                {result.yogas && <SectionBlock title={t.sections.yogas} icon="⚡" content={result.yogas} lang={lang} />}
                {result.dasha && <SectionBlock title={t.sections.dasha} icon="⏱️" content={result.dasha} lang={lang} />}
              </div>
            )}

            {activeSection === "overview" && (
              <div>
                <SectionBlock title={t.sections.cosmicBlueprint} icon="🌟" content={result.overview} lang={lang} />
                <SectionBlock title={t.sections.yogas} icon="⚡" content={result.yogas} lang={lang} />
                <SectionBlock title={t.sections.spiritual} icon="🕉️" content={result.spiritual_path} lang={lang} />
                <SectionBlock title={t.sections.verdict} icon="✨" content={result.summary_verdict} lang={lang} />
              </div>
            )}

            {activeSection === "planets" && (
              <div>
                <h3 style={{ fontFamily: headFont, color: "#d4af37", fontSize: 12, letterSpacing: lang === "hi" ? 0 : 2, marginBottom: 14, textAlign: "center" }}>{t.planetTable}</h3>
                <PlanetTable planetData={result.planetData} lang={lang} t={t} />
                <SectionBlock title={t.sections.planetaryAnalysis} icon="🪐" content={result.planetaryAnalysis} lang={lang} />
              </div>
            )}

            {activeSection === "houses" && (
              <div>
                <h3 style={{ fontFamily: headFont, color: "#d4af37", fontSize: 12, letterSpacing: lang === "hi" ? 0 : 2, marginBottom: 14, textAlign: "center" }}>{t.housesTitle}</h3>
                <HouseGrid houseData={result.houses} t={t} lang={lang} />
                <SectionBlock title={t.sections.houseAnalysis} icon="🏠" content={result.houseAnalysis} lang={lang} />
              </div>
            )}

            {activeSection === "life" && (
              <div>
                <SectionBlock title={t.sections.health} icon="🌿" content={result.health} lang={lang} />
                <SectionBlock title={t.sections.wealth} icon="💰" content={result.wealth} lang={lang} />
                <SectionBlock title={t.sections.education} icon="📚" content={result.education} lang={lang} />
                <SectionBlock title={t.sections.career} icon="🏆" content={result.career} lang={lang} />
                <SectionBlock title={t.sections.marriage} icon="💑" content={result.marriage} lang={lang} />
                <SectionBlock title={t.sections.children} icon="👶" content={result.children} lang={lang} />
              </div>
            )}

            {activeSection === "predictions" && (
              <div>
                <SectionBlock title={t.sections.predictions} icon="🔮" content={result.predictions} lang={lang} />
                <SectionBlock title={t.sections.dashaFull} icon="⏱️" content={result.dasha} lang={lang} />
              </div>
            )}

            {activeSection === "lifestyle" && (
              <div>
                <SectionBlock title={t.sections.adopt} icon="🌱" content={result.lifestyle_adopt} lang={lang} />
                <SectionBlock title={t.sections.avoid} icon="⚠️" content={result.lifestyle_avoid} lang={lang} />
                <SectionBlock title={t.sections.mantras} icon="🕉️" content={result.mantras} lang={lang} />
              </div>
            )}

            {activeSection === "remedies" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
                  {[
                    { title: t.sections.colours, icon: "🎨", key: "favourable_colours" },
                    { title: t.sections.numbers, icon: "🔢", key: "favourable_numbers" },
                    { title: t.sections.days, icon: "📅", key: "favourable_days" },
                    { title: t.sections.rudraksha, icon: "📿", key: "rudraksha" },
                  ].map(item => (
                    <div key={item.key} style={{ background: "rgba(10,5,30,0.95)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 13, padding: "18px" }}>
                      <h3 style={{ fontFamily: lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "'Cinzel', serif", color: "#d4af37", fontSize: lang === "hi" ? 13 : 11, letterSpacing: lang === "hi" ? 0 : 1.5, marginBottom: 9 }}>{item.icon} {item.title}</h3>
                      <p style={{ color: "rgba(230,210,180,0.8)", fontFamily: bodyFont, fontSize: lang === "hi" ? 13 : 14, lineHeight: 1.8 }}>{result[item.key]}</p>
                    </div>
                  ))}
                </div>
                <SectionBlock title={t.sections.gemstones} icon="💎" content={result.gemstones} lang={lang} />
                <SectionBlock title={t.sections.longevity} icon="⏳" content={result.longevity} lang={lang} />
              </div>
            )}

          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 56, color: "rgba(212,175,55,0.2)", fontSize: 10, fontFamily: headFont, letterSpacing: 2 }}>
          <div style={{ marginBottom: 5 }}>{t.footer1}</div>
          <div style={{ fontSize: 9, fontFamily: bodyFont, letterSpacing: 0 }}>{t.footer2}</div>
        </div>
      </div>
    </div>
  );
}