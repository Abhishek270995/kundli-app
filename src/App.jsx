import { useState, useRef } from "react";
import { generateVedicKundliData, SIGNS } from "./jyotishEngine";
import { getCoordinates } from "./geocode";

const ZODIAC_SIGNS = [
  { name:"Aries",symbol:"♈",sanskrit:"Mesh",num:1 },
  { name:"Taurus",symbol:"♉",sanskrit:"Vrishabh",num:2 },
  { name:"Gemini",symbol:"♊",sanskrit:"Mithun",num:3 },
  { name:"Cancer",symbol:"♋",sanskrit:"Kark",num:4 },
  { name:"Leo",symbol:"♌",sanskrit:"Simha",num:5 },
  { name:"Virgo",symbol:"♍",sanskrit:"Kanya",num:6 },
  { name:"Libra",symbol:"♎",sanskrit:"Tula",num:7 },
  { name:"Scorpio",symbol:"♏",sanskrit:"Vrishchik",num:8 },
  { name:"Sagittarius",symbol:"♐",sanskrit:"Dhanu",num:9 },
  { name:"Capricorn",symbol:"♑",sanskrit:"Makar",num:10 },
  { name:"Aquarius",symbol:"♒",sanskrit:"Kumbh",num:11 },
  { name:"Pisces",symbol:"♓",sanskrit:"Meen",num:12 },
];

const PLANETS = [
  { name:"Sun",symbol:"Su",color:"#FFB800",sanskrit:"Surya" },
  { name:"Moon",symbol:"Mo",color:"#E0E8F0",sanskrit:"Chandra" },
  { name:"Mars",symbol:"Ma",color:"#FF4D4D",sanskrit:"Mangal" },
  { name:"Mercury",symbol:"Me",color:"#00E676",sanskrit:"Budha" },
  { name:"Jupiter",symbol:"Ju",color:"#FFA726",sanskrit:"Guru" },
  { name:"Venus",symbol:"Ve",color:"#FF80AB",sanskrit:"Shukra" },
  { name:"Saturn",symbol:"Sa",color:"#B39DDB",sanskrit:"Shani" },
  { name:"Rahu",symbol:"Ra",color:"#9E9E9E",sanskrit:"Rahu" },
  { name:"Ketu",symbol:"Ke",color:"#FFAB91",sanskrit:"Ketu" },
];

const TABS = [
  { id:"chart",icon:"🔯" },
  { id:"overview",icon:"🌟" },
  { id:"planets",icon:"🪐" },
  { id:"houses",icon:"🏠" },
  { id:"life",icon:"🌿" },
  { id:"predictions",icon:"🔮" },
  { id:"remedies",icon:"💎" },
];

const UI = {
  en:{
    title:"JYOTISH KUNDLI",
    subtitle:"VEDIC BIRTH CHART & COSMIC LIFE READING",
    tagline:'"As above, so below — the stars illuminate the path of your soul"',
    formTitle:"ENTER YOUR BIRTH DETAILS",
    fName:"Full Name *",fDob:"Date of Birth *",fTob:"Time of Birth",fPob:"Place of Birth *",
    phName:"Your complete name",phPob:"City, State, Country (e.g. Kanpur, India)",
    btnGo:"✦ REVEAL MY KUNDLI ✦",btnWait:"✦ CONSULTING THE STARS ✦",
    errFields:"Please fill Name, Date of Birth and Place of Birth.",
    errApi:"Unable to generate Kundli. Please verify your details and try again.",
    s1:"Step 1/2: Calculating planetary coordinates & Ascendant (Lagna)...",
    s2:"Step 2/2: Synthesizing Bhavas, Yogas, Dashas & Life Readings...",
    chartTitle:"NORTH INDIAN KUNDLI CHART (LAGNA KUNDLI)",
    chartSub:"House 1 at top · Rashi numbers & Natal planetary placements",
    ptTitle:"PLANETARY POSITIONS TABLE",
    htTitle:"ALL 12 HOUSES (BHAVAS) ANALYSIS",
    tabs:{ chart:"Chart",overview:"Overview",planets:"Planets",houses:"Houses",life:"Life Areas",predictions:"Predictions",remedies:"Remedies" },
    sec:{ blueprint:"Cosmic Blueprint",yogas:"Planetary Yogas",verdict:"Stars' Final Verdict",
          pa:"Planetary Analysis",ha:"House Analysis",dasha:"Vimshottari Dasha Periods",
          health:"Health & Vitality",wealth:"Wealth & Prosperity",education:"Education & Intellect",career:"Career & Status",marriage:"Marriage & Partnerships",
          pred:"Life Predictions — Decade by Decade",
          colours:"Lucky Colours",numbers:"Lucky Numbers",days:"Auspicious Days",rudraksha:"Prescribed Rudraksha",gems:"Gemstones & Upaya",longevity:"Longevity (Deerghayu)" },
    pills:{ lagna:"Lagna",rashi:"Rashi",nakshatra:"Nakshatra",tithi:"Tithi",yoga:"Yoga" },
    pcols:["Planet","Sign","House","Degree","Dignity / Status","Astrological Effect"],
    hnames:["Self & Personality","Wealth & Family","Courage & Siblings","Home & Mother","Intellect & Children","Health & Obstacles","Marriage & Partner","Longevity & Transformation","Fortune & Spirituality","Career & Status","Gains & Desires","Moksha & Expenses"],
    nopl:"No planets present",langBtn:"हिंदी में देखें",
    footer1:"✦ OM TAT SAT ✦",footer2:"Authentic Vedic Astrological Calculations",
  },
  hi:{
    title:"ज्योतिष कुंडली",
    subtitle:"वैदिक जन्म कुंडली और ब्रह्मांडीय जीवन विश्लेषण",
    tagline:'"जैसा ऊपर, वैसा नीचे — तारे आपकी आत्मा का मार्ग प्रकाशित करते हैं"',
    formTitle:"अपना जन्म विवरण दर्ज करें",
    fName:"पूरा नाम *",fDob:"जन्म तिथि *",fTob:"जन्म समय",fPob:"जन्म स्थान *",
    phName:"आपका पूरा नाम",phPob:"शहर, राज्य, देश (उदा. कानपुर, भारत)",
    btnGo:"✦ मेरी कुंडली प्रकट करें ✦",btnWait:"✦ ग्रहों से परामर्श हो रहा है ✦",
    errFields:"कृपया नाम, जन्म तिथि और जन्म स्थान भरें।",
    errApi:"कुंडली गणना में त्रुटि हुई। कृपया विवरण पुनः जांचें।",
    s1:"चरण १/२: ग्रह स्थितियों एवं लग्न की सटीक गणना...",
    s2:"चरण २/२: भाव, योग, विंशोत्तरी दशा और जीवन फल तैयार हो रहे हैं...",
    chartTitle:"उत्तर भारतीय लग्न कुंडली चार्ट",
    chartSub:"भाव १ शीर्ष पर · राशि संख्या एवं ग्रहों की जन्मकालीन स्थिति",
    ptTitle:"ग्रह स्थिति तालिका",
    htTitle:"सभी १२ भावों का विस्तृत विश्लेषण",
    tabs:{ chart:"चार्ट",overview:"सिंहावलोकन",planets:"ग्रह",houses:"भाव",life:"जीवन क्षेत्र",predictions:"भविष्यवाणी",remedies:"उपाय" },
    sec:{ blueprint:"ब्रह्मांडीय प्रारूप",yogas:"ग्रह योग",verdict:"तारों का संदेश",
          pa:"ग्रह विश्लेषण",ha:"भाव विश्लेषण",dasha:"विंशोत्तरी दशा काल",
          health:"स्वास्थ्य एवं ऊर्जा",wealth:"धन एवं समृद्धि",education:"शिक्षा एवं बुद्धि",career:"करियर एवं प्रतिष्ठा",marriage:"विवाह एवं दांपत्य",
          pred:"जीवन भविष्यवाणी — दशक दर दशक",
          colours:"शुभ रंग",numbers:"भाग्यशाली अंक",days:"शुभ दिन",rudraksha:"कल्याणकारी रुद्राक्ष",gems:"रत्न एवं उपाय",longevity:"आयु (दीर्घायु)" },
    pills:{ lagna:"लग्न",rashi:"राशि",nakshatra:"नक्षत्र",tithi:"तिथि",yoga:"योग" },
    pcols:["ग्रह","राशि","भाव","अंश","स्थिति","प्रभाव"],
    hnames:["स्वयं एवं व्यक्तित्व","धन एवं कुटुंब","पराक्रम व भाई-बहन","गृह-माता सुख","बुद्धि व संतान","स्वास्थ्य व शत्रु","विवाह व साझेदारी","आयु व परिवर्तन","भाग्य व धर्म","करियर व प्रतिष्ठा","लाभ व आय","मोक्ष व व्यय"],
    nopl:"कोई ग्रह नहीं",langBtn:"View in English",
    footer1:"✦ ॐ तत् सत् ✦",footer2:"प्रामाणिक वैदिक ज्योतिष गणना",
  }
};

// ── NORTH INDIAN KUNDLI CHART ─────────────────────────────────────
const Chart = ({ houses, lang }) => {
  const SIZE = 520;
  const PAD = 20;
  const W = SIZE - 2 * PAD;
  const xc = SIZE / 2;
  const yc = SIZE / 2;
  const x0 = PAD;
  const y0 = PAD;
  const x1 = SIZE - PAD;
  const y1 = SIZE - PAD;

  const gold = "#d4af37";
  const line = "rgba(212,175,55,0.75)";
  const bg = "rgba(8,4,22,0.98)";

  const getSignNum = (signName) => {
    const found = ZODIAC_SIGNS.find(z => z.name === signName || z.sanskrit === signName);
    return found ? found.num : "";
  };

  // Classical North Indian House Positions (Centers & labels)
  const houseLayout = [
    { n:1,  cx: xc,            cy: y0 + W * 0.22, isLagna: true },  // Top diamond
    { n:2,  cx: x0 + W * 0.24, cy: y0 + W * 0.12 },                 // Top-left triangle
    { n:3,  cx: x0 + W * 0.12, cy: y0 + W * 0.24 },                 // Left-top triangle
    { n:4,  cx: x0 + W * 0.22, cy: yc },                            // Left diamond
    { n:5,  cx: x0 + W * 0.12, cy: y1 - W * 0.24 },                 // Left-bottom triangle
    { n:6,  cx: x0 + W * 0.24, cy: y1 - W * 0.12 },                 // Bottom-left triangle
    { n:7,  cx: xc,            cy: y1 - W * 0.22 },                 // Bottom diamond
    { n:8,  cx: x1 - W * 0.24, cy: y1 - W * 0.12 },                 // Bottom-right triangle
    { n:9,  cx: x1 - W * 0.12, cy: y1 - W * 0.24 },                 // Right-bottom triangle
    { n:10, cx: x1 - W * 0.22, cy: yc },                            // Right diamond
    { n:11, cx: x1 - W * 0.12, cy: y0 + W * 0.24 },                 // Right-top triangle
    { n:12, cx: x1 - W * 0.24, cy: y0 + W * 0.12 },                 // Top-right triangle
  ];

  return (
    <div style={{display:"flex",justifyContent:"center",marginBottom:26}}>
      <svg width={SIZE} height={SIZE} style={{maxWidth:"100%",borderRadius:12,boxShadow:"0 0 0 1px rgba(212,175,55,0.4), 0 12px 40px rgba(0,0,0,0.85)"}}>
        <rect width={SIZE} height={SIZE} fill={bg} rx="12" />

        {/* Outer Square */}
        <rect x={x0} y={y0} width={W} height={W} fill="none" stroke={line} strokeWidth="2.2" />

        {/* Main Corner Diagonals */}
        <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={line} strokeWidth="1.8" />
        <line x1={x1} y1={y0} x2={x0} y2={y1} stroke={line} strokeWidth="1.8" />

        {/* Inner Diamond connecting side midpoints */}
        <polygon points={`${xc},${y0} ${x1},${yc} ${xc},${y1} ${x0},${yc}`} fill="none" stroke={line} strokeWidth="1.8" />

        {/* Center Om Watermark */}
        <text x={xc} y={yc - 8} textAnchor="middle" fill="rgba(212,175,55,0.22)" fontSize="10" letterSpacing="2" fontWeight="bold">LAGNA KUNDLI</text>
        <text x={xc} y={yc + 16} textAnchor="middle" fill="rgba(212,175,55,0.28)" fontSize="26">ॐ</text>

        {/* Render 12 Houses */}
        {houseLayout.map(({ n, cx, cy, isLagna }) => {
          const houseData = houses?.[n] || {};
          const signNum = getSignNum(houseData.sign);
          const planetsInHouse = houseData.planets || [];

          return (
            <g key={n}>
              {/* Lagna Badge in House 1 */}
              {isLagna && (
                <rect x={cx - 24} y={cy - 34} width="48" height="16" rx="4" fill="rgba(212,175,55,0.12)" stroke="rgba(212,175,55,0.6)" strokeWidth="0.8" />
              )}
              {isLagna && (
                <text x={cx} y={cy - 22} textAnchor="middle" fill="#f5d87a" fontSize="9" fontWeight="bold" letterSpacing="1">
                  {lang === "hi" ? "लग्न" : "LAGNA"}
                </text>
              )}

              {/* Rashi Number in house (North Indian convention) */}
              <text x={cx} y={isLagna ? cy - 4 : cy - 10} textAnchor="middle" fill="#d4af37" fontSize="13" fontWeight="bold" fontFamily="serif">
                {signNum}
              </text>

              {/* Planets in house */}
              {planetsInHouse.map((pName, idx) => {
                const pObj = PLANETS.find(x => x.name === pName) || { symbol: pName.slice(0,2), color: gold };
                return (
                  <text key={idx} x={cx} y={(isLagna ? cy + 12 : cy + 6) + idx * 13} textAnchor="middle" fill={pObj.color} fontSize="12" fontWeight="bold">
                    {pObj.symbol}
                  </text>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ── PLANET TABLE ──────────────────────────────────────────────────
const PTable = ({ data, t }) => (
  <div style={{background:"rgba(10,5,30,0.95)",border:"1px solid rgba(212,175,55,0.28)",borderRadius:13,overflow:"hidden",marginBottom:20}}>
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",minWidth:500}}>
        <thead><tr style={{background:"rgba(212,175,55,0.11)"}}>
          {t.pcols.map(h=><th key={h} style={{padding:"10px 12px",color:"#d4af37",fontSize:11,borderBottom:"1px solid rgba(212,175,55,0.16)",textAlign:"left",letterSpacing:1}}>{h}</th>)}
        </tr></thead>
        <tbody>{PLANETS.map((p,i)=>{
          const pd=data?.[p.name]||{};
          const good=["Exalted","Own Sign","उच्च (Exalted)","स्वगृही (Own Sign)"].includes(pd.status);
          const bad=["Debilitated","नीच (Debilitated)"].includes(pd.status);
          return (
            <tr key={p.name} style={{borderBottom:"1px solid rgba(212,175,55,0.06)",background:i%2?"rgba(212,175,55,0.02)":"transparent"}}>
              <td style={{padding:"9px 12px"}}>
                <span style={{color:p.color,fontWeight:"bold",fontSize:13}}>{p.symbol} {p.name}</span>
                <div style={{fontSize:10,color:"rgba(212,175,55,0.38)"}}>{p.sanskrit}</div>
              </td>
              <td style={{padding:"9px 12px",color:"rgba(230,210,180,0.85)",fontSize:13}}>{pd.sign||"—"} ({pd.signSanskrit||""})</td>
              <td style={{padding:"9px 12px",color:"#f5d87a",fontSize:13,fontWeight:"600"}}>H{pd.house||"—"}</td>
              <td style={{padding:"9px 12px",color:"rgba(230,210,180,0.75)",fontSize:12}}>{pd.degree||"—"}<div style={{fontSize:9,color:"rgba(212,175,55,0.4)"}}>{pd.nakshatra} (P{pd.pada})</div></td>
              <td style={{padding:"9px 12px"}}>
                <span style={{padding:"3px 8px",borderRadius:20,fontSize:10,fontWeight:"600",
                  background:good?"rgba(0,200,100,0.14)":bad?"rgba(255,80,80,0.14)":"rgba(212,175,55,0.09)",
                  color:good?"#00e676":bad?"#ff5252":"#d4af37",
                  border:`1px solid ${good?"rgba(0,200,100,0.3)":bad?"rgba(255,80,80,0.3)":"rgba(212,175,55,0.2)"}`
                }}>{pd.status||"—"}</span>
              </td>
              <td style={{padding:"9px 12px",color:"rgba(230,210,180,0.65)",fontSize:12}}>{pd.effect||"—"}</td>
            </tr>
          );
        })}</tbody>
      </table>
    </div>
  </div>
);

// ── HOUSE GRID ────────────────────────────────────────────────────
const HGrid = ({ data, t, lang }) => (
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
    {Array.from({length:12},(_,i)=>{
      const n=i+1, d=data?.[n]||{};
      const sg=ZODIAC_SIGNS.find(z=>z.name===d.sign||z.sanskrit===d.sign)||ZODIAC_SIGNS[i];
      const pl=d.planets||[];
      return (
        <div key={n} style={{background:"rgba(10,5,30,0.95)",border:"1px solid rgba(212,175,55,0.18)",borderRadius:11,padding:"14px 16px",borderLeft:"3px solid #d4af37"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
            <div>
              <span style={{color:"#d4af37",fontSize:13,fontWeight:600}}>{lang==="hi"?`भाव ${n}`:`House ${n}`}</span>
              <div style={{fontSize:10,color:"rgba(212,175,55,0.5)",marginTop:2}}>{t.hnames[i]}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:20,color:"#d4af37",lineHeight:1}}>{sg.symbol}</div>
              <div style={{fontSize:9,color:"rgba(212,175,55,0.45)",marginTop:2}}>{sg.sanskrit} ({sg.name})</div>
            </div>
          </div>
          {pl.length>0
            ?<div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:6}}>
              {pl.map((p,j)=>{
                const pd=PLANETS.find(x=>x.name===p||x.symbol===p);
                return <span key={j} style={{padding:"2px 8px",borderRadius:10,fontSize:11,fontWeight:"bold",background:"rgba(212,175,55,0.08)",color:pd?.color||"#d4af37",border:"1px solid rgba(212,175,55,0.2)"}}>{p}</span>;
              })}
            </div>
            :<div style={{fontSize:10,color:"rgba(212,175,55,0.22)",marginBottom:6,fontStyle:"italic"}}>{t.nopl}</div>
          }
          <p style={{fontSize:12,color:"rgba(230,210,180,0.7)",lineHeight:1.6}}>{d.interpretation||""}</p>
        </div>
      );
    })}
  </div>
);

// ── BLOCK ─────────────────────────────────────────────────────────
const Block = ({ title, content, icon }) => (
  <div style={{background:"linear-gradient(135deg,rgba(18,9,38,0.94),rgba(10,5,28,0.98))",border:"1px solid rgba(212,175,55,0.25)",borderRadius:14,padding:"22px 26px",marginBottom:18,position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#d4af37,transparent)"}}/>
    <h3 style={{color:"#d4af37",fontSize:14,marginBottom:12,display:"flex",alignItems:"center",gap:8,fontWeight:600}}>
      <span style={{fontSize:18}}>{icon}</span>{title}
    </h3>
    <div style={{color:"rgba(230,210,180,0.88)",fontSize:15,lineHeight:1.9,whiteSpace:"pre-wrap"}}>{content}</div>
  </div>
);

// ── PROGRESS ──────────────────────────────────────────────────────
const Progress = ({ step, t }) => (
  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16,padding:"40px 0"}}>
    <div style={{position:"relative",width:90,height:90}}>
      {[0,1,2].map(i=><div key={i} style={{position:"absolute",inset:i*12,border:`2px solid rgba(212,175,55,${0.8-i*0.2})`,borderRadius:"50%",animation:`spin ${3+i}s linear infinite ${i%2?"reverse":""}`,borderTopColor:"transparent"}}/>)}
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,animation:"pulse 2s ease-in-out infinite"}}>🔯</div>
    </div>
    <div style={{width:280,background:"rgba(212,175,55,0.08)",borderRadius:20,overflow:"hidden",border:"1px solid rgba(212,175,55,0.2)"}}>
      <div style={{height:5,background:"linear-gradient(90deg,#8b6914,#d4af37,#f5d87a)",borderRadius:20,width:step===1?"50%":"100%",transition:"width 0.8s ease"}}/>
    </div>
    <p style={{color:"#d4af37",fontSize:13,letterSpacing:1.5,textAlign:"center"}}>{step===1?t.s1:t.s2}</p>
  </div>
);

// ── STARS ─────────────────────────────────────────────────────────
const Stars = () => {
  const s=Array.from({length:80},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,sz:Math.random()*2+0.4,d:Math.random()*4,dur:2+Math.random()*3}));
  return <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>{s.map(x=><div key={x.id} style={{position:"absolute",left:`${x.x}%`,top:`${x.y}%`,width:x.sz,height:x.sz,borderRadius:"50%",background:"rgba(255,220,150,0.6)",animation:`twinkle ${x.dur}s ${x.d}s infinite alternate`}}/>)}</div>;
};

// ── MAIN APP COMPONENT ───────────────────────────────────────────
export default function App() {
  const [form,setForm]=useState({name:"",dob:"",pob:"",tob:""});
  const [step,setStep]=useState(0);
  const [result,setResult]=useState(null);
  const [tab,setTab]=useState("chart");
  const [err,setErr]=useState("");
  const [lang,setLang]=useState("en");
  const ref=useRef(null);
  const t=UI[lang];
  const hi=lang==="hi";
  const bf=hi?"'Noto Sans Devanagari',sans-serif":"'EB Garamond',Georgia,serif";

  const run = async () => {
    if (!form.name||!form.dob||!form.pob){
      setErr(t.errFields);
      return;
    }
    setErr("");
    setStep(1);
    setResult(null);

    try {
      let lat = 26.8467;  // Fallback lat (Lucknow/Kanpur region)
      let lon = 80.9462;  // Fallback lon

      try {
        const coords = await getCoordinates(form.pob);
        if (coords && coords.lat && coords.lon) {
          lat = coords.lat;
          lon = coords.lon;
        }
      } catch (geoErr) {
        console.warn("Geocoding failed, using regional coordinates", geoErr);
      }

      // Step 1: Compute astronomy & planetary positions
      await new Promise(r => setTimeout(r, 450));
      setStep(2);

      // Step 2: Compute full Vedic astrology readings
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
      setTimeout(()=>ref.current?.scrollIntoView({behavior:"smooth"}), 150);
    } catch(e) {
      console.error(e);
      setErr(t.errApi);
    } finally {
      setStep(0);
    }
  };

  // Re-generate current result if language changes
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
          lat: 26.8467,
          lon: 80.9462,
          lang: newLang
        });
        setResult(updated);
      } catch(e) {
        console.error(e);
      }
    }
  };

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0a0520,#050215,#0d0828)",color:"#e6d4b0",fontFamily:bf,position:"relative"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap');
        @keyframes twinkle{from{opacity:0.2}to{opacity:1}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        input:focus{outline:none!important;border-color:rgba(212,175,55,0.7)!important;box-shadow:0 0 15px rgba(212,175,55,0.1)!important}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#d4af37;border-radius:3px}
      `}</style>

      <Stars/>

      {/* Lang Toggle */}
      <button onClick={handleLangToggle} style={{position:"fixed",top:16,right:16,zIndex:100,background:"rgba(10,5,30,0.95)",border:"1px solid rgba(212,175,55,0.4)",borderRadius:26,padding:"7px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,boxShadow:"0 3px 16px rgba(0,0,0,0.5)"}}>
        <span style={{fontSize:16}}>{hi?"🇬🇧":"🇮🇳"}</span>
        <span style={{color:"#d4af37",fontSize:hi?11:12,fontWeight:600}}>{t.langBtn}</span>
      </button>

      <div style={{position:"relative",zIndex:1,maxWidth:880,margin:"0 auto",padding:"38px 18px 70px"}}>

        {/* Header */}
        <div style={{textAlign:"center",marginBottom:42}}>
          <div style={{fontSize:44,marginBottom:10,animation:"pulse 3s ease-in-out infinite"}}>🔯</div>
          <h1 style={{fontFamily:hi?"'Noto Sans Devanagari',sans-serif":"'Cinzel Decorative',serif",fontSize:"clamp(20px,5vw,36px)",background:"linear-gradient(90deg,#8b6914,#d4af37,#f5d87a,#d4af37,#8b6914)",backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmer 4s linear infinite",letterSpacing:hi?2:4,marginBottom:8,fontWeight:700}}>{t.title}</h1>
          <p style={{color:"rgba(212,175,55,0.48)",fontSize:hi?12:11,letterSpacing:hi?0:3}}>{t.subtitle}</p>
          <div style={{height:1,background:"linear-gradient(90deg,transparent,#d4af37,transparent)",margin:"14px auto",maxWidth:250}}/>
          <p style={{color:"rgba(230,210,180,0.32)",fontSize:13,fontStyle:"italic"}}>{t.tagline}</p>
        </div>

        {/* Form */}
        <div style={{background:"linear-gradient(135deg,rgba(18,9,42,0.96),rgba(10,5,28,0.98))",border:"1px solid rgba(212,175,55,0.36)",borderRadius:17,padding:"30px",marginBottom:34,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#8b6914,#d4af37,#f5d87a,#d4af37,#8b6914)"}}/>
          <h2 style={{color:"#d4af37",fontSize:hi?14:12,letterSpacing:hi?0:3,marginBottom:19,textAlign:"center",fontWeight:600}}>{t.formTitle}</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {[{n:"name",l:t.fName,ph:t.phName,tp:"text",full:true},{n:"dob",l:t.fDob,ph:"",tp:"date",full:false},{n:"tob",l:t.fTob,ph:"",tp:"time",full:false},{n:"pob",l:t.fPob,ph:t.phPob,tp:"text",full:true}].map(f=>(
              <div key={f.n} style={{gridColumn:f.full?"1 / -1":"span 1"}}>
                <label style={{display:"block",fontSize:hi?11:10,color:"rgba(212,175,55,0.65)",letterSpacing:hi?0:2,marginBottom:5}}>{f.l}</label>
                <input type={f.tp} name={f.n} value={form[f.n]} onChange={e=>setForm({...form,[e.target.name]:e.target.value})} placeholder={f.ph}
                  style={{width:"100%",background:"rgba(212,175,55,0.04)",border:"1px solid rgba(212,175,55,0.22)",borderRadius:8,padding:"10px 13px",color:"#e6d4b0",fontFamily:bf,fontSize:15,transition:"all 0.25s",colorScheme:"dark"}}/>
              </div>
            ))}
          </div>
          {err&&<p style={{color:"#ff6b6b",fontSize:12,textAlign:"center",marginTop:12}}>⚠ {err}</p>}
          <button onClick={run} disabled={step>0} style={{display:"block",width:"100%",marginTop:20,background:step>0?"rgba(212,175,55,0.1)":"linear-gradient(135deg,#8b6914,#d4af37,#f5d87a,#d4af37,#8b6914)",backgroundSize:"200% auto",border:"none",borderRadius:9,padding:"14px",color:step>0?"rgba(212,175,55,0.3)":"#0a0520",fontFamily:hi?"'Noto Sans Devanagari',sans-serif":"'Cinzel',serif",fontSize:hi?14:13,letterSpacing:hi?0:3,fontWeight:700,cursor:step>0?"not-allowed":"pointer",animation:step>0?"none":"shimmer 3s linear infinite"}}>
            {step>0?t.btnWait:t.btnGo}
          </button>
        </div>

        {step>0&&<Progress step={step} t={t}/>}

        {result&&(
          <div ref={ref} style={{animation:"fadeIn 0.65s ease forwards"}}>

            {/* Person header */}
            <div style={{textAlign:"center",marginBottom:24}}>
              <div style={{fontSize:26,marginBottom:7}}>✨</div>
              <h2 style={{fontFamily:hi?"'Noto Sans Devanagari',sans-serif":"'Cinzel Decorative',serif",color:"#d4af37",fontSize:"clamp(16px,4vw,24px)",letterSpacing:hi?1:3}}>{form.name.toUpperCase()}</h2>
              <p style={{color:"rgba(212,175,55,0.45)",fontSize:11,letterSpacing:2,marginTop:4}}>{form.dob} · {form.pob}{form.tob?` · ${form.tob}`:""}</p>
              <div style={{height:1,background:"linear-gradient(90deg,transparent,#d4af37,transparent)",margin:"12px auto",maxWidth:340}}/>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
                {[[t.pills.lagna,result.lagna],[t.pills.rashi,result.rashi],[t.pills.nakshatra,result.nakshatra],[t.pills.tithi,result.tithi],[t.pills.yoga,result.yoga]].map(([l,v])=>v&&(
                  <div key={l} style={{background:"rgba(212,175,55,0.08)",border:"1px solid rgba(212,175,55,0.25)",borderRadius:16,padding:"5px 12px"}}>
                    <span style={{fontSize:9,color:"rgba(212,175,55,0.5)",letterSpacing:1}}>{l}: </span>
                    <span style={{fontSize:11,color:"#d4af37",fontWeight:600}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center",marginBottom:26}}>
              {TABS.map(s=>(
                <button key={s.id} onClick={()=>setTab(s.id)} style={{background:tab===s.id?"linear-gradient(135deg,#d4af37,#8b6914)":"rgba(212,175,55,0.06)",border:`1px solid ${tab===s.id?"#d4af37":"rgba(212,175,55,0.2)"}`,color:tab===s.id?"#0a0520":"#d4af37",fontFamily:hi?"'Noto Sans Devanagari',sans-serif":"'Cinzel',serif",fontSize:hi?12:11,letterSpacing:hi?0:1,padding:"7px 14px",borderRadius:24,cursor:"pointer",transition:"all 0.2s",fontWeight:tab===s.id?700:500}}>
                  {s.icon} {t.tabs[s.id]}
                </button>
              ))}
            </div>

            {/* ── CHART TAB ── */}
            {tab==="chart"&&(
              <div>
                <div style={{textAlign:"center",marginBottom:14}}>
                  <h3 style={{color:"#d4af37",fontSize:13,letterSpacing:hi?0:2}}>{t.chartTitle}</h3>
                  <p style={{color:"rgba(212,175,55,0.38)",fontSize:11,marginTop:3}}>{t.chartSub}</p>
                </div>
                <Chart houses={result.houses} lang={lang}/>
                <div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center",marginBottom:22}}>
                  {PLANETS.map(p=>(
                    <div key={p.name} style={{display:"flex",alignItems:"center",gap:5,background:"rgba(10,5,30,0.85)",border:"1px solid rgba(212,175,55,0.18)",borderRadius:8,padding:"4px 10px"}}>
                      <span style={{color:p.color,fontWeight:"bold",fontSize:11}}>{p.symbol}</span>
                      <span style={{color:"rgba(230,210,180,0.6)",fontSize:11}}>{hi?p.sanskrit:p.name}</span>
                    </div>
                  ))}
                </div>
                {result.yogas&&<Block title={t.sec.yogas} icon="⚡" content={result.yogas}/>}
                {result.dasha&&<Block title={t.sec.dasha} icon="⏱️" content={result.dasha}/>}
              </div>
            )}

            {/* ── OVERVIEW TAB ── */}
            {tab==="overview"&&(
              <div>
                <Block title={t.sec.blueprint} icon="🌟" content={result.overview}/>
                <Block title={t.sec.yogas} icon="⚡" content={result.yogas}/>
                <Block title={t.sec.verdict} icon="✨" content={result.verdict}/>
              </div>
            )}

            {/* ── PLANETS TAB ── */}
            {tab==="planets"&&(
              <div>
                <h3 style={{color:"#d4af37",fontSize:12,letterSpacing:hi?0:2,marginBottom:12,textAlign:"center"}}>{t.ptTitle}</h3>
                <PTable data={result.planetData} t={t}/>
                <Block title={t.sec.pa} icon="🪐" content={result.pa}/>
              </div>
            )}

            {/* ── HOUSES TAB ── */}
            {tab==="houses"&&(
              <div>
                <h3 style={{color:"#d4af37",fontSize:12,letterSpacing:hi?0:2,marginBottom:12,textAlign:"center"}}>{t.htTitle}</h3>
                <HGrid data={result.houses} t={t} lang={lang}/>
                <Block title={t.sec.ha} icon="🏠" content={result.ha}/>
              </div>
            )}

            {/* ── LIFE TAB ── */}
            {tab==="life"&&(
              <div>
                <Block title={t.sec.health} icon="🌿" content={result.health}/>
                <Block title={t.sec.wealth} icon="💰" content={result.wealth}/>
                <Block title={t.sec.education} icon="📚" content={result.education}/>
                <Block title={t.sec.career} icon="🏆" content={result.career}/>
                <Block title={t.sec.marriage} icon="💑" content={result.marriage}/>
              </div>
            )}

            {/* ── PREDICTIONS TAB ── */}
            {tab==="predictions"&&(
              <div>
                <Block title={t.sec.pred} icon="🔮" content={result.pred}/>
                <Block title={t.sec.dasha} icon="⏱️" content={result.dasha}/>
              </div>
            )}

            {/* ── REMEDIES TAB ── */}
            {tab==="remedies"&&(
              <div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:15}}>
                  {[{title:t.sec.colours,icon:"🎨",key:"colours"},{title:t.sec.numbers,icon:"🔢",key:"numbers"},{title:t.sec.days,icon:"📅",key:"days"},{title:t.sec.rudraksha,icon:"📿",key:"rudraksha"}].map(item=>(
                    <div key={item.key} style={{background:"rgba(10,5,30,0.95)",border:"1px solid rgba(212,175,55,0.2)",borderRadius:11,padding:"16px"}}>
                      <h3 style={{color:"#d4af37",fontSize:hi?13:12,marginBottom:7,fontWeight:600}}>{item.icon} {item.title}</h3>
                      <p style={{color:"rgba(230,210,180,0.85)",fontSize:hi?13:14,lineHeight:1.75}}>{result[item.key]}</p>
                    </div>
                  ))}
                </div>
                <Block title={t.sec.gems} icon="💎" content={result.gems}/>
                <Block title={t.sec.longevity} icon="⏳" content={result.longevity}/>
              </div>
            )}

          </div>
        )}

        <div style={{textAlign:"center",marginTop:48,color:"rgba(212,175,55,0.25)",fontSize:11,letterSpacing:2}}>
          <div style={{marginBottom:3}}>{t.footer1}</div>
          <div style={{fontSize:10,letterSpacing:0}}>{t.footer2}</div>
        </div>
      </div>
    </div>
  );
}
