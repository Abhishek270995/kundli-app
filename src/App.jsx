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

const UI = {
  en: {
    appTitle: "JYOTISH KUNDLI", appSubtitle: "VEDIC BIRTH CHART & COSMIC LIFE READING",
    appTagline: '"As above, so below — the stars illuminate the path of your soul"',
    formTitle: "ENTER YOUR BIRTH DETAILS", fieldName: "Full Name *", fieldDob: "Date of Birth *",
    fieldTob: "Time of Birth", fieldPob: "Place of Birth *", fieldNamePh: "Your complete name", fieldPobPh: "City, State, Country",
    btnReveal: "✦ REVEAL MY KUNDLI ✦", btnLoading: "✦ CONSULTING THE STARS ✦",
    errorFields: "Please fill Name, Date of Birth and Place of Birth.", errorApi: "The cosmos whispered too softly. Please try again.",
    step1: "Step 1/2: Calculating planetary positions...", step2: "Step 2/2: Generating your life readings...",
    chartTitle: "NORTH INDIAN KUNDLI CHART", chartSub: "House 1 at top • Planets in natal positions",
    planetTable: "PLANETARY POSITIONS TABLE", housesTitle: "ALL 12 HOUSES ANALYSIS",
    tabs: { chart:"Chart", overview:"Overview", planets:"Planets", houses:"Houses", life:"Life Areas", predictions:"Predictions", lifestyle:"Lifestyle", remedies:"Remedies" },
    sections: {
      cosmicBlueprint:"Your Cosmic Blueprint", yogas:"Special Planetary Yogas", spiritual:"Spiritual Path & Dharma",
      verdict:"The Stars' Final Verdict", planetaryAnalysis:"Detailed Planetary Analysis", houseAnalysis:"Key House Lords & Impact",
      dasha:"Dasha Periods", dashaFull:"Dasha Periods & Timing", health:"Health & Vitality", wealth:"Wealth & Prosperity",
      education:"Education & Intellect", career:"Career & Profession", marriage:"Marriage & Relationships", children:"Children & Legacy",
      predictions:"Life Predictions — Decade by Decade", adopt:"What to Adopt for a Blessed Life",
      avoid:"What to Avoid for Harmony", mantras:"Sacred Mantras", colours:"Lucky Colours",
      numbers:"Lucky Numbers", days:"Auspicious Days", rudraksha:"Rudraksha", gemstones:"Gemstone Recommendations", longevity:"Longevity & Life Vitality",
    },
    pills: { lagna:"Lagna", rashi:"Rashi", nakshatra:"Nakshatra", tithi:"Tithi", yoga:"Yoga" },
    planetCols: ["Planet","Sign","House","Degree","Status","Effect"],
    houseNames: ["Self & Personality","Wealth & Family","Siblings & Courage","Home & Mother","Education & Children","Health & Enemies","Marriage & Partner","Death & Transformation","Fortune & Philosophy","Career & Status","Gains & Friends","Losses & Spirituality"],
    noPlanets:"No planets", footer1:"✦ OM TAT SAT ✦", footer2:"For spiritual guidance only • Consult a professional astrologer for life decisions", langBtn:"हिंदी में देखें",
  },
  hi: {
    appTitle: "ज्योतिष कुंडली", appSubtitle: "वैदिक जन्म कुंडली और ब्रह्मांडीय जीवन विश्लेषण",
    appTagline: '"जैसा ऊपर, वैसा नीचे — तारे आपकी आत्मा का मार्ग प्रकाशित करते हैं"',
    formTitle: "अपना जन्म विवरण दर्ज करें", fieldName: "पूरा नाम *", fieldDob: "जन्म तिथि *",
    fieldTob: "जन्म समय", fieldPob: "जन्म स्थान *", fieldNamePh: "आपका पूरा नाम", fieldPobPh: "शहर, राज्य, देश",
    btnReveal: "✦ मेरी कुंडली प्रकट करें ✦", btnLoading: "✦ ग्रहों से परामर्श हो रहा है ✦",
    errorFields: "कृपया नाम, जन्म तिथि और जन्म स्थान भरें।", errorApi: "ब्रह्मांड की आवाज़ बहुत धीमी थी। कृपया पुनः प्रयास करें।",
    step1: "चरण १/२: ग्रह स्थितियों की गणना हो रही है...", step2: "चरण २/२: आपकी जीवन रीडिंग तैयार हो रही है...",
    chartTitle: "उत्तर भारतीय कुंडली चार्ट", chartSub: "भाव १ शीर्ष पर • ग्रह जन्मकालीन स्थिति में",
    planetTable: "ग्रह स्थिति तालिका", housesTitle: "सभी १२ भावों का विश्लेषण",
    tabs: { chart:"चार्ट", overview:"सिंहावलोकन", planets:"ग्रह", houses:"भाव", life:"जीवन क्षेत्र", predictions:"भविष्यवाणी", lifestyle:"जीवनशैली", remedies:"उपाय" },
    sections: {
      cosmicBlueprint:"आपका ब्रह्मांडीय प्रारूप", yogas:"विशेष ग्रह योग", spiritual:"आध्यात्मिक मार्ग और धर्म",
      verdict:"तारों का अंतिम संदेश", planetaryAnalysis:"विस्तृत ग्रह विश्लेषण", houseAnalysis:"प्रमुख भाव स्वामी और प्रभाव",
      dasha:"दशा काल", dashaFull:"दशा काल और समय", health:"स्वास्थ्य और शक्ति", wealth:"धन और समृद्धि",
      education:"शिक्षा और बुद्धि", career:"करियर और व्यवसाय", marriage:"विवाह और संबंध", children:"संतान और विरासत",
      predictions:"जीवन भविष्यवाणी — दशक दर दशक", adopt:"सुखी जीवन के लिए क्या अपनाएं",
      avoid:"सद्भाव के लिए क्या टालें", mantras:"पवित्र मंत्र", colours:"शुभ रंग",
      numbers:"भाग्यशाली अंक", days:"शुभ दिन", rudraksha:"रुद्राक्ष", gemstones:"रत्न अनुशंसाएं", longevity:"आयु और जीवन शक्ति",
    },
    pills: { lagna:"लग्न", rashi:"राशि", nakshatra:"नक्षत्र", tithi:"तिथि", yoga:"योग" },
    planetCols: ["ग्रह","राशि","भाव","अंश","स्थिति","प्रभाव"],
    houseNames: ["स्वयं और व्यक्तित्व","धन और परिवार","भाई-बहन और साहस","घर और माता","शिक्षा और संतान","स्वास्थ्य और शत्रु","विवाह और साथी","मृत्यु और परिवर्तन","भाग्य और दर्शन","करियर और प्रतिष्ठा","लाभ और मित्र","व्यय और अध्यात्म"],
    noPlanets:"कोई ग्रह नहीं", footer1:"✦ ॐ तत् सत् ✦", footer2:"केवल आध्यात्मिक मार्गदर्शन के लिए • जीवन निर्णयों के लिए किसी ज्योतिषी से परामर्श लें", langBtn:"View in English",
  }
};

// ── API CALL HELPER ──────────────────────────────────────────────
async function callClaude(prompt, systemMsg, maxTokens = 1800) {
  const res = await fetch("/api/claude-proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      system: systemMsg,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  const raw = data.content.map(b => b.text || "").join("");
  return JSON.parse(raw.replace(/```json|```/g, "").trim());
}

// ── CHART COMPONENT ──────────────────────────────────────────────
const NorthIndianChart = ({ houses }) => {
  const S = 400, c = S / 2, q = S / 4;
  const getHouse = (n) => {
    const d = houses[n] || houses[String(n)] || {};
    const signData = ZODIAC_SIGNS.find(z => z.name === d.sign || z.sanskrit === d.sign) || ZODIAC_SIGNS[(n-1)%12];
    return { signData, planets: d.planets || [] };
  };
  const HouseCell = ({ n, cx, cy }) => {
    const { signData, planets } = getHouse(n);
    const pList = planets.map(p => PLANETS.find(pl => pl.name===p||pl.symbol===p) || { symbol: p.slice(0,2), color: "#d4af37" });
    return (
      <g>
        <text x={cx} y={cy-16} textAnchor="middle" fill="rgba(212,175,55,0.4)" fontSize="9" fontFamily="Cinzel,serif">{n}</text>
        <text x={cx} y={cy} textAnchor="middle" fill="#d4af37" fontSize="15">{signData.symbol}</text>
        <text x={cx} y={cy+13} textAnchor="middle" fill="rgba(212,175,55,0.5)" fontSize="7">{signData.sanskrit}</text>
        {pList.map((p,i) => <text key={i} x={cx+(i-(pList.length-1)/2)*13} y={cy+25} textAnchor="middle" fill={p.color} fontSize="8" fontWeight="bold">{p.symbol}</text>)}
      </g>
    );
  };
  return (
    <div style={{ display:"flex", justifyContent:"center", marginBottom:28 }}>
      <svg width={S} height={S} style={{ maxWidth:"100%", filter:"drop-shadow(0 0 25px rgba(212,175,55,0.12))" }}>
        <rect x="1" y="1" width={S-2} height={S-2} fill="rgba(8,4,20,0.97)" stroke="#d4af37" strokeWidth="2" rx="3"/>
        <line x1={c} y1="1" x2={c} y2={S-1} stroke="rgba(212,175,55,0.45)" strokeWidth="1"/>
        <line x1="1" y1={c} x2={S-1} y2={c} stroke="rgba(212,175,55,0.45)" strokeWidth="1"/>
        <line x1="1" y1="1" x2={S-1} y2={S-1} stroke="rgba(212,175,55,0.35)" strokeWidth="1"/>
        <line x1={S-1} y1="1" x2="1" y2={S-1} stroke="rgba(212,175,55,0.35)" strokeWidth="1"/>
        <polygon points={`${c},${q} ${S-q},${c} ${c},${S-q} ${q},${c}`} fill="rgba(15,8,40,0.95)" stroke="#d4af37" strokeWidth="1.5"/>
        {[[c,q,q,c],[c,q,S-q,c],[c,S-q,q,c],[c,S-q,S-q,c]].map(([x1,y1,x2,y2],i)=><line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(212,175,55,0.25)" strokeWidth="1"/>)}
        <text x={c} y={c+11} textAnchor="middle" fill="#d4af37" fontSize="28" fontFamily="serif" opacity="0.85">ॐ</text>
        <HouseCell n={1} cx={c} cy={q*0.62}/>
        <HouseCell n={2} cx={q*0.62} cy={q*0.62}/>
        <HouseCell n={3} cx={q*0.25} cy={c-q*0.38}/>
        <HouseCell n={4} cx={q*0.62} cy={c}/>
        <HouseCell n={5} cx={q*0.25} cy={c+q*0.38}/>
        <HouseCell n={6} cx={q*0.62} cy={S-q*0.62}/>
        <HouseCell n={7} cx={c} cy={S-q*0.62}/>
        <HouseCell n={8} cx={S-q*0.62} cy={S-q*0.62}/>
        <HouseCell n={9} cx={S-q*0.25} cy={c+q*0.38}/>
        <HouseCell n={10} cx={S-q*0.62} cy={c}/>
        <HouseCell n={11} cx={S-q*0.25} cy={c-q*0.38}/>
        <HouseCell n={12} cx={S-q*0.62} cy={q*0.62}/>
      </svg>
    </div>
  );
};

// ── PLANET TABLE ──────────────────────────────────────────────────
const PlanetTable = ({ planetData, t }) => (
  <div style={{ background:"rgba(10,5,30,0.95)", border:"1px solid rgba(212,175,55,0.3)", borderRadius:14, overflow:"hidden", marginBottom:22 }}>
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"collapse", minWidth:520 }}>
        <thead><tr style={{ background:"rgba(212,175,55,0.12)" }}>
          {t.planetCols.map(h=><th key={h} style={{ padding:"9px 11px", color:"#d4af37", fontSize:10, borderBottom:"1px solid rgba(212,175,55,0.18)", textAlign:"left", letterSpacing:1 }}>{h}</th>)}
        </tr></thead>
        <tbody>{PLANETS.map((p,i)=>{
          const pd = planetData?.[p.name] || {};
          const isGood = pd.status==="Exalted"||pd.status==="उच्च"||pd.status==="Own Sign"||pd.status==="स्वगृही";
          const isBad = pd.status==="Debilitated"||pd.status==="नीच";
          return (
            <tr key={p.name} style={{ borderBottom:"1px solid rgba(212,175,55,0.07)", background:i%2?"rgba(212,175,55,0.02)":"transparent" }}>
              <td style={{ padding:"8px 11px" }}>
                <span style={{ color:p.color, fontWeight:"bold", fontSize:12 }}>{p.symbol} {p.name}</span>
                <div style={{ fontSize:9, color:"rgba(212,175,55,0.3)" }}>{p.sanskrit}</div>
              </td>
              <td style={{ padding:"8px 11px", color:"rgba(230,210,180,0.75)", fontSize:12 }}>{pd.sign||"—"}</td>
              <td style={{ padding:"8px 11px", color:"rgba(230,210,180,0.75)", fontSize:12 }}>H{pd.house||"—"}</td>
              <td style={{ padding:"8px 11px", color:"rgba(230,210,180,0.75)", fontSize:11 }}>{pd.degree||"—"}</td>
              <td style={{ padding:"8px 11px" }}>
                <span style={{ padding:"2px 7px", borderRadius:20, fontSize:10,
                  background:isGood?"rgba(0,200,100,0.12)":isBad?"rgba(255,80,80,0.12)":"rgba(212,175,55,0.08)",
                  color:isGood?"#00c864":isBad?"#ff5050":"#d4af37",
                  border:`1px solid ${isGood?"rgba(0,200,100,0.25)":isBad?"rgba(255,80,80,0.25)":"rgba(212,175,55,0.18)"}`,
                }}>{pd.status||"—"}</span>
              </td>
              <td style={{ padding:"8px 11px", color:"rgba(230,210,180,0.6)", fontSize:11 }}>{pd.effect||"—"}</td>
            </tr>
          );
        })}</tbody>
      </table>
    </div>
  </div>
);

// ── HOUSE GRID ────────────────────────────────────────────────────
const HouseGrid = ({ houseData, t, lang }) => (
  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:22 }}>
    {Array.from({length:12},(_,i)=>{
      const n=i+1, d=houseData?.[n]||houseData?.[String(n)]||{};
      const signData=ZODIAC_SIGNS.find(z=>z.name===d.sign||z.sanskrit===d.sign)||ZODIAC_SIGNS[i];
      const planets=d.planets||[];
      return (
        <div key={n} style={{ background:"rgba(10,5,30,0.95)", border:"1px solid rgba(212,175,55,0.18)", borderRadius:11, padding:"13px 15px", borderLeft:"3px solid rgba(212,175,55,0.45)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:7 }}>
            <div>
              <span style={{ color:"#d4af37", fontSize:12, fontWeight:600 }}>{lang==="hi"?`भाव ${n}`:`House ${n}`}</span>
              <div style={{ fontSize:9, color:"rgba(212,175,55,0.4)", marginTop:2 }}>{t.houseNames[i]}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:19, color:"#d4af37", lineHeight:1 }}>{signData.symbol}</div>
              <div style={{ fontSize:8, color:"rgba(212,175,55,0.4)", marginTop:2 }}>{signData.sanskrit}</div>
            </div>
          </div>
          {planets.length>0
            ? <div style={{ display:"flex", gap:3, flexWrap:"wrap", marginBottom:6 }}>
                {planets.map((p,j)=>{const pd=PLANETS.find(pl=>pl.name===p||pl.symbol===p);return <span key={j} style={{ padding:"2px 6px", borderRadius:9, fontSize:10, background:"rgba(212,175,55,0.07)", color:pd?.color||"#d4af37", border:"1px solid rgba(212,175,55,0.12)" }}>{p}</span>;})}
              </div>
            : <div style={{ fontSize:10, color:"rgba(212,175,55,0.2)", marginBottom:6, fontStyle:"italic" }}>{t.noPlanets}</div>
          }
          <p style={{ fontSize:11, color:"rgba(230,210,180,0.6)", lineHeight:1.6 }}>{d.interpretation||""}</p>
        </div>
      );
    })}
  </div>
);

// ── SECTION BLOCK ─────────────────────────────────────────────────
const Block = ({ title, content, icon, lang }) => (
  <div style={{ background:"linear-gradient(135deg,rgba(20,10,40,0.9),rgba(10,5,30,0.95))", border:"1px solid rgba(212,175,55,0.28)", borderRadius:15, padding:"24px 28px", marginBottom:20, position:"relative", overflow:"hidden" }}>
    <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,#d4af37,transparent)" }}/>
    <h3 style={{ color:"#d4af37", fontSize:lang==="hi"?15:13, marginBottom:13, display:"flex", alignItems:"center", gap:8, fontWeight:600, letterSpacing:lang==="hi"?0:1 }}>
      <span style={{ fontSize:17 }}>{icon}</span>{title}
    </h3>
    <div style={{ color:"rgba(230,210,180,0.88)", fontSize:lang==="hi"?15:16, lineHeight:1.95, whiteSpace:"pre-wrap" }}>{content}</div>
  </div>
);

// ── LOADING PROGRESS ──────────────────────────────────────────────
const LoadingBar = ({ step, t }) => (
  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:18, padding:"50px 0" }}>
    <div style={{ position:"relative", width:100, height:100 }}>
      {[0,1,2].map(i=><div key={i} style={{ position:"absolute", inset:i*13, border:`2px solid rgba(212,175,55,${0.8-i*0.2})`, borderRadius:"50%", animation:`spin ${3+i}s linear infinite ${i%2?"reverse":""}`, borderTopColor:"transparent" }}/>)}
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, animation:"pulse 2s ease-in-out infinite" }}>🔯</div>
    </div>
    <div style={{ width:280, background:"rgba(212,175,55,0.08)", borderRadius:20, overflow:"hidden", border:"1px solid rgba(212,175,55,0.2)" }}>
      <div style={{ height:6, background:"linear-gradient(90deg,#8b6914,#d4af37,#f5d87a)", borderRadius:20, width:step===1?"50%":"100%", transition:"width 1s ease" }}/>
    </div>
    <p style={{ color:"#d4af37", fontSize:12, letterSpacing:2, textAlign:"center" }}>{step===1?t.step1:t.step2}</p>
  </div>
);

// ── STAR FIELD ────────────────────────────────────────────────────
const StarField = () => {
  const stars = Array.from({length:90},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,s:Math.random()*2+0.5,d:Math.random()*4,dur:2+Math.random()*3}));
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      {stars.map(s=><div key={s.id} style={{ position:"absolute", left:`${s.x}%`, top:`${s.y}%`, width:s.s, height:s.s, borderRadius:"50%", background:"rgba(255,220,150,0.6)", animation:`twinkle ${s.dur}s ${s.d}s infinite alternate` }}/>)}
    </div>
  );
};

// ── LANG TOGGLE ───────────────────────────────────────────────────
const LangToggle = ({ lang, setLang, t }) => (
  <button onClick={()=>setLang(lang==="en"?"hi":"en")} style={{ position:"fixed", top:18, right:18, zIndex:100, background:"rgba(10,5,30,0.95)", border:"1px solid rgba(212,175,55,0.45)", borderRadius:28, padding:"8px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:7, boxShadow:"0 4px 20px rgba(0,0,0,0.5)", transition:"all 0.3s" }}>
    <span style={{ fontSize:17 }}>{lang==="en"?"🇮🇳":"🇬🇧"}</span>
    <span style={{ color:"#d4af37", fontSize:lang==="en"?13:11, fontWeight:600 }}>{t.langBtn}</span>
  </button>
);

// ── MAIN APP ──────────────────────────────────────────────────────
export default function KundliApp() {
  const [form, setForm] = useState({ name:"", dob:"", pob:"", tob:"" });
  const [loadStep, setLoadStep] = useState(0); // 0=idle, 1=step1, 2=step2
  const [result, setResult] = useState(null);
  const [activeSection, setActiveSection] = useState("chart");
  const [error, setError] = useState("");
  const [lang, setLang] = useState("en");
  const resultRef = useRef(null);
  const t = UI[lang];
  const isHindi = lang === "hi";
  const bodyFont = isHindi ? "'Noto Sans Devanagari',sans-serif" : "'EB Garamond',Georgia,serif";

  const handleChange = e => setForm({...form,[e.target.name]:e.target.value});

  const generateKundli = async () => {
    if (!form.name||!form.dob||!form.pob) { setError(t.errorFields); return; }
    setError(""); setLoadStep(1); setResult(null);

    const langNote = isHindi
      ? "Write ALL descriptive text values in fluent Hindi (Devanagari). Keep only JSON keys and planet/sign names in English."
      : "Write all text in English.";

    try {
      // ── CALL 1: Chart data only (fast, ~1500 tokens) ──────────
      const chartPrompt = `Vedic astrologer. Birth chart for:
Name: ${form.name}, DOB: ${form.dob}, Place: ${form.pob}, Time: ${form.tob||"12:00"}
${langNote}
Return ONLY JSON (no markdown):
{
  "lagna":"sign","rashi":"sign","nakshatra":"star+pada","tithi":"name","yoga":"name","karana":"name",
  "planetData":{
    "Sun":{"sign":"Leo","house":5,"degree":"15°20'","status":"Own Sign","effect":"${isHindi?"हिंदी में":"brief effect"}"},
    "Moon":{"sign":"Cancer","house":4,"degree":"8°45'","status":"Own Sign","effect":"${isHindi?"हिंदी में":"brief effect"}"},
    "Mars":{"sign":"Aries","house":1,"degree":"22°10'","status":"Own Sign","effect":"${isHindi?"हिंदी में":"brief effect"}"},
    "Mercury":{"sign":"Virgo","house":6,"degree":"5°30'","status":"Exalted","effect":"${isHindi?"हिंदी में":"brief effect"}"},
    "Jupiter":{"sign":"Cancer","house":4,"degree":"18°55'","status":"Exalted","effect":"${isHindi?"हिंदी में":"brief effect"}"},
    "Venus":{"sign":"Taurus","house":2,"degree":"12°25'","status":"Own Sign","effect":"${isHindi?"हिंदी में":"brief effect"}"},
    "Saturn":{"sign":"Libra","house":7,"degree":"28°40'","status":"Exalted","effect":"${isHindi?"हिंदी में":"brief effect"}"},
    "Rahu":{"sign":"Gemini","house":3,"degree":"14°15'","status":"Neutral","effect":"${isHindi?"हिंदी में":"brief effect"}"},
    "Ketu":{"sign":"Sagittarius","house":9,"degree":"14°15'","status":"Neutral","effect":"${isHindi?"हिंदी में":"brief effect"}"}
  },
  "houses":{
    "1":{"sign":"Aries","planets":["Mars"],"interpretation":"${isHindi?"हिंदी में २ वाक्य":"2 sentences"}"},
    "2":{"sign":"Taurus","planets":[],"interpretation":"${isHindi?"हिंदी में":"2 sentences"}"},
    "3":{"sign":"Gemini","planets":["Rahu"],"interpretation":"${isHindi?"हिंदी में":"2 sentences"}"},
    "4":{"sign":"Cancer","planets":["Moon","Jupiter"],"interpretation":"${isHindi?"हिंदी में":"2 sentences"}"},
    "5":{"sign":"Leo","planets":["Sun"],"interpretation":"${isHindi?"हिंदी में":"2 sentences"}"},
    "6":{"sign":"Virgo","planets":["Mercury"],"interpretation":"${isHindi?"हिंदी में":"2 sentences"}"},
    "7":{"sign":"Libra","planets":["Saturn"],"interpretation":"${isHindi?"हिंदी में":"2 sentences"}"},
    "8":{"sign":"Scorpio","planets":[],"interpretation":"${isHindi?"हिंदी में":"2 sentences"}"},
    "9":{"sign":"Sagittarius","planets":["Ketu"],"interpretation":"${isHindi?"हिंदी में":"2 sentences"}"},
    "10":{"sign":"Capricorn","planets":[],"interpretation":"${isHindi?"हिंदी में":"2 sentences"}"},
    "11":{"sign":"Aquarius","planets":[],"interpretation":"${isHindi?"हिंदी में":"2 sentences"}"},
    "12":{"sign":"Pisces","planets":[],"interpretation":"${isHindi?"हिंदी में":"2 sentences"}"}
  },
  "yogas":"${isHindi?"विशेष योगों का संक्षिप्त वर्णन हिंदी में":"Special yogas present in this chart"}",
  "dasha":"${isHindi?"वर्तमान दशा-अंतर्दशा हिंदी में":"Current and next Mahadasha/Antardasha periods"}"
}`;

      const part1 = await callClaude(chartPrompt,
        `Expert Vedic astrologer. Return ONLY valid JSON, no markdown, no backticks. House keys must be strings "1"-"12". ${langNote}`, 1800);

      setLoadStep(2);

      // ── CALL 2: Life readings only (split from chart data) ────
      const readingsPrompt = `Vedic astrologer reading for ${form.name} (DOB: ${form.dob}, Place: ${form.pob}).
Lagna: ${part1.lagna}, Rashi: ${part1.rashi}, Nakshatra: ${part1.nakshatra}.
${langNote}
Return ONLY JSON (no markdown) with these keys, each value 3-5 sentences:
{
  "overview":"${isHindi?"150 शब्दों में ब्रह्मांडीय अवलोकन हिंदी में":"150 word cosmic overview"}",
  "planetaryAnalysis":"${isHindi?"सभी ९ ग्रहों का विश्लेषण हिंदी में":"All 9 planets analysis"}",
  "houseAnalysis":"${isHindi?"प्रमुख भावों का विश्लेषण हिंदी में":"Key houses analysis"}",
  "health":"${isHindi?"स्वास्थ्य विश्लेषण हिंदी में":"Health analysis"}",
  "wealth":"${isHindi?"धन विश्लेषण हिंदी में":"Wealth analysis"}",
  "education":"${isHindi?"शिक्षा विश्लेषण हिंदी में":"Education analysis"}",
  "career":"${isHindi?"करियर विश्लेषण हिंदी में":"Career analysis"}",
  "marriage":"${isHindi?"विवाह विश्लेषण हिंदी में":"Marriage analysis"}",
  "children":"${isHindi?"संतान विश्लेषण हिंदी में":"Children analysis"}",
  "predictions":"${isHindi?"दशक दर दशक भविष्यवाणी (0-10, 10-20, 20-30, 30-40, 40-50, 50+) हिंदी में":"Decade predictions 0-10,10-20,20-30,30-40,40-50,50+"}",
  "lifestyle_adopt":"${isHindi?"क्या अपनाएं हिंदी में":"Lifestyle to adopt"}",
  "lifestyle_avoid":"${isHindi?"क्या टालें हिंदी में":"Lifestyle to avoid"}",
  "mantras":"${isHindi?"मंत्र हिंदी में":"Mantras with instructions"}",
  "favourable_colours":"${isHindi?"शुभ रंग हिंदी में":"Lucky colours"}",
  "favourable_numbers":"${isHindi?"भाग्यशाली अंक हिंदी में":"Lucky numbers"}",
  "favourable_days":"${isHindi?"शुभ दिन हिंदी में":"Auspicious days"}",
  "gemstones":"${isHindi?"रत्न सुझाव हिंदी में":"Gemstone recommendations"}",
  "rudraksha":"${isHindi?"रुद्राक्ष सुझाव हिंदी में":"Rudraksha recommendations"}",
  "longevity":"${isHindi?"आयु विश्लेषण हिंदी में":"Longevity assessment"}",
  "spiritual_path":"${isHindi?"आध्यात्मिक मार्ग हिंदी में":"Spiritual path"}",
  "summary_verdict":"${isHindi?"अंतिम संदेश १०० शब्द हिंदी में":"100 word final cosmic message"}"
}`;

      const part2 = await callClaude(readingsPrompt,
        `Expert Vedic astrologer. Return ONLY valid JSON, no markdown, no backticks. ${langNote}`, 1800);

      setResult({ ...part1, ...part2 });
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior:"smooth" }), 100);

    } catch (err) {
      setError(t.errorApi);
    }
    setLoadStep(0);
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0a0520 0%,#050215 40%,#0d0828 70%,#08041a 100%)", color:"#e6d4b0", fontFamily:bodyFont, position:"relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');
        @keyframes twinkle{from{opacity:0.2;transform:scale(1)}to{opacity:1;transform:scale(1.5)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
        @keyframes fadeSlideIn{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        input:focus{outline:none;border-color:rgba(212,175,55,0.8)!important;box-shadow:0 0 18px rgba(212,175,55,0.12)}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#050215}::-webkit-scrollbar-thumb{background:#d4af37;border-radius:3px}
      `}</style>

      <StarField/>
      <LangToggle lang={lang} setLang={setLang} t={t}/>

      <div style={{ position:"relative", zIndex:1, maxWidth:900, margin:"0 auto", padding:"40px 20px 80px" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:46 }}>
          <div style={{ fontSize:46, marginBottom:11, animation:"pulse 3s ease-in-out infinite" }}>🔯</div>
          <h1 style={{ fontFamily:isHindi?"'Noto Sans Devanagari',sans-serif":"'Cinzel Decorative',serif", fontSize:"clamp(20px,5vw,36px)", background:"linear-gradient(90deg,#8b6914,#d4af37,#f5d87a,#d4af37,#8b6914)", backgroundSize:"200% auto", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", animation:"shimmer 4s linear infinite", letterSpacing:isHindi?2:4, marginBottom:9, fontWeight:700 }}>{t.appTitle}</h1>
          <p style={{ color:"rgba(212,175,55,0.5)", fontSize:isHindi?12:10, letterSpacing:isHindi?0:4 }}>{t.appSubtitle}</p>
          <div style={{ height:1, background:"linear-gradient(90deg,transparent,#d4af37,transparent)", margin:"15px auto", maxWidth:260 }}/>
          <p style={{ color:"rgba(230,210,180,0.3)", fontSize:13, fontStyle:"italic" }}>{t.appTagline}</p>
        </div>

        {/* Form */}
        <div style={{ background:"linear-gradient(135deg,rgba(20,10,45,0.95),rgba(10,5,30,0.98))", border:"1px solid rgba(212,175,55,0.38)", borderRadius:18, padding:"32px", marginBottom:36, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,#8b6914,#d4af37,#f5d87a,#d4af37,#8b6914)" }}/>
          <h2 style={{ color:"#d4af37", fontSize:isHindi?15:13, letterSpacing:isHindi?0:3, marginBottom:20, textAlign:"center", fontWeight:600 }}>{t.formTitle}</h2>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:15 }}>
            {[
              {name:"name",label:t.fieldName,placeholder:t.fieldNamePh,type:"text",full:true},
              {name:"dob",label:t.fieldDob,placeholder:"",type:"date",full:false},
              {name:"tob",label:t.fieldTob,placeholder:"",type:"time",full:false},
              {name:"pob",label:t.fieldPob,placeholder:t.fieldPobPh,type:"text",full:true},
            ].map(f=>(
              <div key={f.name} style={{ gridColumn:f.full?"1 / -1":"span 1" }}>
                <label style={{ display:"block", fontSize:isHindi?11:9, color:"rgba(212,175,55,0.6)", letterSpacing:isHindi?0:2, marginBottom:5 }}>{f.label}</label>
                <input type={f.type} name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder}
                  style={{ width:"100%", background:"rgba(212,175,55,0.05)", border:"1px solid rgba(212,175,55,0.2)", borderRadius:8, padding:"11px 14px", color:"#e6d4b0", fontFamily:bodyFont, fontSize:15, transition:"all 0.3s", colorScheme:"dark" }}/>
              </div>
            ))}
          </div>
          {error&&<p style={{ color:"#e87d7d", fontSize:11, textAlign:"center", marginTop:11 }}>⚠ {error}</p>}
          <button onClick={generateKundli} disabled={loadStep>0}
            style={{ display:"block", width:"100%", marginTop:20, background:loadStep>0?"rgba(212,175,55,0.12)":"linear-gradient(135deg,#8b6914,#d4af37,#f5d87a,#d4af37,#8b6914)", backgroundSize:"200% auto", border:"none", borderRadius:10, padding:"14px", color:loadStep>0?"rgba(212,175,55,0.35)":"#0a0520", fontFamily:isHindi?"'Noto Sans Devanagari',sans-serif":"'Cinzel',serif", fontSize:isHindi?15:13, letterSpacing:isHindi?0:3, fontWeight:700, cursor:loadStep>0?"not-allowed":"pointer", animation:loadStep>0?"none":"shimmer 3s linear infinite" }}>
            {loadStep>0?t.btnLoading:t.btnReveal}
          </button>
        </div>

        {loadStep>0&&<LoadingBar step={loadStep} t={t}/>}

        {result&&(
          <div ref={resultRef} style={{ animation:"fadeSlideIn 0.7s ease forwards" }}>

            {/* Person header */}
            <div style={{ textAlign:"center", marginBottom:26 }}>
              <div style={{ fontSize:28, marginBottom:7 }}>✨</div>
              <h2 style={{ fontFamily:isHindi?"'Noto Sans Devanagari',sans-serif":"'Cinzel Decorative',serif", color:"#d4af37", fontSize:"clamp(14px,4vw,23px)", letterSpacing:isHindi?1:3 }}>{form.name.toUpperCase()}</h2>
              <p style={{ color:"rgba(212,175,55,0.4)", fontSize:10, letterSpacing:2, marginTop:5 }}>{form.dob} • {form.pob}{form.tob?` • ${form.tob}`:""}</p>
              <div style={{ height:1, background:"linear-gradient(90deg,transparent,#d4af37,transparent)", margin:"13px auto", maxWidth:360 }}/>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, justifyContent:"center" }}>
                {[[t.pills.lagna,result.lagna],[t.pills.rashi,result.rashi],[t.pills.nakshatra,result.nakshatra],[t.pills.tithi,result.tithi],[t.pills.yoga,result.yoga]].map(([label,value])=>value&&(
                  <div key={label} style={{ background:"rgba(212,175,55,0.07)", border:"1px solid rgba(212,175,55,0.22)", borderRadius:16, padding:"4px 11px" }}>
                    <span style={{ fontSize:8, color:"rgba(212,175,55,0.45)", letterSpacing:1 }}>{label}: </span>
                    <span style={{ fontSize:10, color:"#d4af37", fontWeight:600 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:5, justifyContent:"center", marginBottom:26 }}>
              {SECTIONS_LIST.map(s=>(
                <button key={s.id} onClick={()=>setActiveSection(s.id)}
                  style={{ background:activeSection===s.id?"linear-gradient(135deg,#d4af37,#8b6914)":"rgba(212,175,55,0.06)", border:`1px solid ${activeSection===s.id?"#d4af37":"rgba(212,175,55,0.22)"}`, color:activeSection===s.id?"#0a0520":"#d4af37", fontFamily:isHindi?"'Noto Sans Devanagari',sans-serif":"'Cinzel',serif", fontSize:isHindi?12:10, letterSpacing:isHindi?0:1, padding:"7px 12px", borderRadius:26, cursor:"pointer", transition:"all 0.22s", fontWeight:activeSection===s.id?700:400 }}>
                  {s.icon} {t.tabs[s.id]}
                </button>
              ))}
            </div>

            {/* ── TAB CONTENT ── */}
            {activeSection==="chart"&&(
              <div>
                <div style={{ textAlign:"center", marginBottom:12 }}>
                  <h3 style={{ color:"#d4af37", fontSize:13, letterSpacing:isHindi?0:2 }}>{t.chartTitle}</h3>
                  <p style={{ color:"rgba(212,175,55,0.3)", fontSize:11, marginTop:3 }}>{t.chartSub}</p>
                </div>
                <NorthIndianChart houses={result.houses}/>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, justifyContent:"center", marginBottom:22 }}>
                  {PLANETS.map(p=>(
                    <div key={p.name} style={{ display:"flex", alignItems:"center", gap:4, background:"rgba(10,5,30,0.8)", border:"1px solid rgba(212,175,55,0.15)", borderRadius:9, padding:"3px 9px" }}>
                      <span style={{ color:p.color, fontWeight:"bold", fontSize:10 }}>{p.symbol}</span>
                      <span style={{ color:"rgba(230,210,180,0.5)", fontSize:10 }}>{isHindi?p.sanskrit:p.name}</span>
                    </div>
                  ))}
                </div>
                {result.yogas&&<Block title={t.sections.yogas} icon="⚡" content={result.yogas} lang={lang}/>}
                {result.dasha&&<Block title={t.sections.dasha} icon="⏱️" content={result.dasha} lang={lang}/>}
              </div>
            )}

            {activeSection==="overview"&&(
              <div>
                <Block title={t.sections.cosmicBlueprint} icon="🌟" content={result.overview} lang={lang}/>
                <Block title={t.sections.yogas} icon="⚡" content={result.yogas} lang={lang}/>
                <Block title={t.sections.spiritual} icon="🕉️" content={result.spiritual_path} lang={lang}/>
                <Block title={t.sections.verdict} icon="✨" content={result.summary_verdict} lang={lang}/>
              </div>
            )}

            {activeSection==="planets"&&(
              <div>
                <h3 style={{ color:"#d4af37", fontSize:12, letterSpacing:isHindi?0:2, marginBottom:13, textAlign:"center" }}>{t.planetTable}</h3>
                <PlanetTable planetData={result.planetData} t={t}/>
                <Block title={t.sections.planetaryAnalysis} icon="🪐" content={result.planetaryAnalysis} lang={lang}/>
              </div>
            )}

            {activeSection==="houses"&&(
              <div>
                <h3 style={{ color:"#d4af37", fontSize:12, letterSpacing:isHindi?0:2, marginBottom:13, textAlign:"center" }}>{t.housesTitle}</h3>
                <HouseGrid houseData={result.houses} t={t} lang={lang}/>
                <Block title={t.sections.houseAnalysis} icon="🏠" content={result.houseAnalysis} lang={lang}/>
              </div>
            )}

            {activeSection==="life"&&(
              <div>
                <Block title={t.sections.health} icon="🌿" content={result.health} lang={lang}/>
                <Block title={t.sections.wealth} icon="💰" content={result.wealth} lang={lang}/>
                <Block title={t.sections.education} icon="📚" content={result.education} lang={lang}/>
                <Block title={t.sections.career} icon="🏆" content={result.career} lang={lang}/>
                <Block title={t.sections.marriage} icon="💑" content={result.marriage} lang={lang}/>
                <Block title={t.sections.children} icon="👶" content={result.children} lang={lang}/>
              </div>
            )}

            {activeSection==="predictions"&&(
              <div>
                <Block title={t.sections.predictions} icon="🔮" content={result.predictions} lang={lang}/>
                <Block title={t.sections.dashaFull} icon="⏱️" content={result.dasha} lang={lang}/>
              </div>
            )}

            {activeSection==="lifestyle"&&(
              <div>
                <Block title={t.sections.adopt} icon="🌱" content={result.lifestyle_adopt} lang={lang}/>
                <Block title={t.sections.avoid} icon="⚠️" content={result.lifestyle_avoid} lang={lang}/>
                <Block title={t.sections.mantras} icon="🕉️" content={result.mantras} lang={lang}/>
              </div>
            )}

            {activeSection==="remedies"&&(
              <div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:13, marginBottom:16 }}>
                  {[
                    {title:t.sections.colours,icon:"🎨",key:"favourable_colours"},
                    {title:t.sections.numbers,icon:"🔢",key:"favourable_numbers"},
                    {title:t.sections.days,icon:"📅",key:"favourable_days"},
                    {title:t.sections.rudraksha,icon:"📿",key:"rudraksha"},
                  ].map(item=>(
                    <div key={item.key} style={{ background:"rgba(10,5,30,0.95)", border:"1px solid rgba(212,175,55,0.22)", borderRadius:12, padding:"16px" }}>
                      <h3 style={{ color:"#d4af37", fontSize:isHindi?13:11, letterSpacing:isHindi?0:1.5, marginBottom:8, fontWeight:600 }}>{item.icon} {item.title}</h3>
                      <p style={{ color:"rgba(230,210,180,0.78)", fontSize:isHindi?13:14, lineHeight:1.8 }}>{result[item.key]}</p>
                    </div>
                  ))}
                </div>
                <Block title={t.sections.gemstones} icon="💎" content={result.gemstones} lang={lang}/>
                <Block title={t.sections.longevity} icon="⏳" content={result.longevity} lang={lang}/>
              </div>
            )}

          </div>
        )}

        <div style={{ textAlign:"center", marginTop:52, color:"rgba(212,175,55,0.18)", fontSize:10, letterSpacing:2 }}>
          <div style={{ marginBottom:4 }}>{t.footer1}</div>
          <div style={{ fontSize:9, letterSpacing:0 }}>{t.footer2}</div>
        </div>
      </div>
    </div>
  );
}