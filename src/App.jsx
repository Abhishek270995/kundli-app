import { useState, useRef } from "react";

const ZODIAC_SIGNS = [
  { name:"Aries",symbol:"♈",sanskrit:"Mesh" },{ name:"Taurus",symbol:"♉",sanskrit:"Vrishabh" },
  { name:"Gemini",symbol:"♊",sanskrit:"Mithun" },{ name:"Cancer",symbol:"♋",sanskrit:"Kark" },
  { name:"Leo",symbol:"♌",sanskrit:"Simha" },{ name:"Virgo",symbol:"♍",sanskrit:"Kanya" },
  { name:"Libra",symbol:"♎",sanskrit:"Tula" },{ name:"Scorpio",symbol:"♏",sanskrit:"Vrishchik" },
  { name:"Sagittarius",symbol:"♐",sanskrit:"Dhanu" },{ name:"Capricorn",symbol:"♑",sanskrit:"Makar" },
  { name:"Aquarius",symbol:"♒",sanskrit:"Kumbh" },{ name:"Pisces",symbol:"♓",sanskrit:"Meen" },
];

const PLANETS = [
  { name:"Sun",symbol:"Su",color:"#FFB800",sanskrit:"Surya" },
  { name:"Moon",symbol:"Mo",color:"#C0C0C0",sanskrit:"Chandra" },
  { name:"Mars",symbol:"Ma",color:"#FF4444",sanskrit:"Mangal" },
  { name:"Mercury",symbol:"Me",color:"#00CC88",sanskrit:"Budha" },
  { name:"Jupiter",symbol:"Ju",color:"#FF9900",sanskrit:"Guru" },
  { name:"Venus",symbol:"Ve",color:"#FF69B4",sanskrit:"Shukra" },
  { name:"Saturn",symbol:"Sa",color:"#9988CC",sanskrit:"Shani" },
  { name:"Rahu",symbol:"Ra",color:"#888888",sanskrit:"Rahu" },
  { name:"Ketu",symbol:"Ke",color:"#AA6644",sanskrit:"Ketu" },
];

const TABS = [
  { id:"chart",icon:"🔯" },{ id:"overview",icon:"🌟" },{ id:"planets",icon:"🪐" },
  { id:"houses",icon:"🏠" },{ id:"life",icon:"🌿" },{ id:"predictions",icon:"🔮" },{ id:"remedies",icon:"💎" },
];

const UI = {
  en:{
    title:"JYOTISH KUNDLI",subtitle:"VEDIC BIRTH CHART & COSMIC LIFE READING",
    tagline:'"As above, so below — the stars illuminate the path of your soul"',
    formTitle:"ENTER YOUR BIRTH DETAILS",
    fName:"Full Name *",fDob:"Date of Birth *",fTob:"Time of Birth",fPob:"Place of Birth *",
    phName:"Your complete name",phPob:"City, State, Country",
    btnGo:"✦ REVEAL MY KUNDLI ✦",btnWait:"✦ CONSULTING THE STARS ✦",
    errFields:"Please fill Name, Date of Birth and Place of Birth.",
    errApi:"Something went wrong. Please try again.",
    s1:"Step 1/2: Calculating planetary positions...",
    s2:"Step 2/2: Generating your life readings...",
    chartTitle:"NORTH INDIAN KUNDLI CHART",chartSub:"House 1 at top · Planets in natal positions",
    ptTitle:"PLANETARY POSITIONS TABLE",htTitle:"ALL 12 HOUSES ANALYSIS",
    tabs:{ chart:"Chart",overview:"Overview",planets:"Planets",houses:"Houses",life:"Life Areas",predictions:"Predictions",remedies:"Remedies" },
    sec:{ blueprint:"Cosmic Blueprint",yogas:"Planetary Yogas",verdict:"Stars' Final Verdict",
          pa:"Planetary Analysis",ha:"House Analysis",dasha:"Dasha Periods",
          health:"Health & Vitality",wealth:"Wealth & Prosperity",education:"Education",career:"Career",marriage:"Marriage",
          pred:"Life Predictions — Decade by Decade",
          colours:"Lucky Colours",numbers:"Lucky Numbers",days:"Auspicious Days",rudraksha:"Rudraksha",gems:"Gemstones",longevity:"Longevity" },
    pills:{ lagna:"Lagna",rashi:"Rashi",nakshatra:"Nakshatra",tithi:"Tithi",yoga:"Yoga" },
    pcols:["Planet","Sign","House","Degree","Status","Effect"],
    hnames:["Self & Personality","Wealth & Family","Siblings & Courage","Home & Mother","Education & Children","Health & Enemies","Marriage & Partner","Death & Transformation","Fortune","Career & Status","Gains & Friends","Losses & Spirituality"],
    nopl:"No planets",langBtn:"हिंदी में देखें",
    footer1:"✦ OM TAT SAT ✦",footer2:"For spiritual guidance only",
  },
  hi:{
    title:"ज्योतिष कुंडली",subtitle:"वैदिक जन्म कुंडली और ब्रह्मांडीय जीवन विश्लेषण",
    tagline:'"जैसा ऊपर, वैसा नीचे — तारे आपकी आत्मा का मार्ग प्रकाशित करते हैं"',
    formTitle:"अपना जन्म विवरण दर्ज करें",
    fName:"पूरा नाम *",fDob:"जन्म तिथि *",fTob:"जन्म समय",fPob:"जन्म स्थान *",
    phName:"आपका पूरा नाम",phPob:"शहर, राज्य, देश",
    btnGo:"✦ मेरी कुंडली प्रकट करें ✦",btnWait:"✦ ग्रहों से परामर्श हो रहा है ✦",
    errFields:"कृपया नाम, जन्म तिथि और जन्म स्थान भरें।",
    errApi:"कुछ गलत हुआ। कृपया पुनः प्रयास करें।",
    s1:"चरण १/२: ग्रह स्थितियों की गणना...",
    s2:"चरण २/२: जीवन रीडिंग तैयार हो रही है...",
    chartTitle:"उत्तर भारतीय कुंडली चार्ट",chartSub:"भाव १ शीर्ष पर · ग्रह जन्मकालीन स्थिति में",
    ptTitle:"ग्रह स्थिति तालिका",htTitle:"सभी १२ भावों का विश्लेषण",
    tabs:{ chart:"चार्ट",overview:"सिंहावलोकन",planets:"ग्रह",houses:"भाव",life:"जीवन क्षेत्र",predictions:"भविष्यवाणी",remedies:"उपाय" },
    sec:{ blueprint:"ब्रह्मांडीय प्रारूप",yogas:"ग्रह योग",verdict:"तारों का संदेश",
          pa:"ग्रह विश्लेषण",ha:"भाव विश्लेषण",dasha:"दशा काल",
          health:"स्वास्थ्य",wealth:"धन",education:"शिक्षा",career:"करियर",marriage:"विवाह",
          pred:"जीवन भविष्यवाणी — दशक दर दशक",
          colours:"शुभ रंग",numbers:"भाग्यशाली अंक",days:"शुभ दिन",rudraksha:"रुद्राक्ष",gems:"रत्न",longevity:"आयु" },
    pills:{ lagna:"लग्न",rashi:"राशि",nakshatra:"नक्षत्र",tithi:"तिथि",yoga:"योग" },
    pcols:["ग्रह","राशि","भाव","अंश","स्थिति","प्रभाव"],
    hnames:["स्वयं","धन","भाई-बहन","घर-माता","शिक्षा","स्वास्थ्य","विवाह","परिवर्तन","भाग्य","करियर","लाभ","व्यय"],
    nopl:"कोई ग्रह नहीं",langBtn:"View in English",
    footer1:"✦ ॐ तत् सत् ✦",footer2:"केवल आध्यात्मिक मार्गदर्शन हेतु",
  }
};

// ── API HELPER ────────────────────────────────────────────────────
async function callAPI(prompt, max = 1500) {
  const res = await fetch("/api/claude-proxy", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      model:"claude-sonnet-4-20250514", max_tokens: max,
      system:"Expert Vedic astrologer. Return ONLY valid compact JSON. No markdown, no backticks, no extra text. Be concise.",
      messages:[{ role:"user", content: prompt }],
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || "API error");
  const raw = data.content.map(b => b.text||"").join("");
  return JSON.parse(raw.replace(/```json|```/g,"").trim());
}

// ── NORTH INDIAN KUNDLI CHART ─────────────────────────────────────
const Chart = ({ houses }) => {
  /*
    Exact structure (all straight lines):
    ┌──────┬────┬──────┐
    │  \   │ 1  │  /   │
    │ 2  \ │    │ / 12 │
    ├─────\┼────┼/─────┤
    │  3   │    │  11  │
    ├──────┤ OM ├──────┤
    │  4   │    │  10  │
    ├─────/┼────┼\─────┤
    │ 5  / │    │ \ 9  │
    │  /   │ 7  │  \   │
    ├──────┼────┼──────┤
    │  6   │    │  8   │  ← bottom row has NO diagonals
    └──────┴────┴──────┘

    Actually correct layout:
    Corner cells (2,12,6,8): square boxes in 4 corners
    Top/Bottom center (1,7): triangles with diagonals from nearby corners
    Left/Right center (4,10): rectangles (middle of left/right edge)
    Side triangles (3,5,9,11): triangles between corners and center diamond

    Diamond center points:
    - Top:    (cx, gy0)          — top edge midpoint
    - Bottom: (cx, gy1)          — bottom edge midpoint
    - Left:   (gx0, cy)          — left edge midpoint
    - Right:  (gx1, cy)          — right edge midpoint

    Lines:
    - Outer rect border
    - Horizontal line at cy (full width)
    - Vertical line at cx (full height)
    - 4 diagonals from each corner to center (cx,cy)
  */

  const W=500, H=420;
  const pad=22;
  const gx0=pad, gy0=pad, gx1=W-pad, gy1=H-pad;
  const gw=gx1-gx0, gh=gy1-gy0;
  const cx=gx0+gw/2, cy=gy0+gh/2;

  // The 4 points where the inner diamond touches the outer border midpoints
  const mTop   ={x:cx,   y:gy0};  // top edge midpoint
  const mBot   ={x:cx,   y:gy1};  // bottom edge midpoint
  const mLeft  ={x:gx0,  y:cy};   // left edge midpoint
  const mRight ={x:gx1,  y:cy};   // right edge midpoint

  // The 4 corner cells: top-left, top-right, bottom-left, bottom-right
  // divided by vertical (cx) and horizontal (cy) lines
  // House layout (North Indian, H1 at top):
  //   Top-left corner=H2, Top-right corner=H12
  //   Left-mid=H3(top),H4(center),H5(bottom)  Right-mid=H11,H10,H9
  //   Bottom-left=H6, Bottom-right=H8, Bottom-center=H7, Top-center=H1

  const lc="#7A5C14";
  const lw=1.4;

  // Curve bow for center petal arcs (inward curves)
  const bow=62;

  const getHouse = n => {
    const d=houses?.[n]||houses?.[String(n)]||{};
    const sg=ZODIAC_SIGNS.find(z=>z.name===d.sign||z.sanskrit===d.sign)||ZODIAC_SIGNS[(n-1)%12];
    const pl=(d.planets||[]).map(p=>PLANETS.find(x=>x.name===p||x.symbol===p)||{symbol:p.slice(0,2),color:"#333"});
    return {sg,pl};
  };

  const PlanetColors = {
    Sun:"#CC8800",Moon:"#555599",Mars:"#CC2200",Mercury:"#006644",
    Jupiter:"#CC6600",Venus:"#AA0066",Saturn:"#6644AA",Rahu:"#555555",Ketu:"#774422"
  };

  const Cell = ({n,x,y,fs=9}) => {
    const {sg,pl}=getHouse(n);
    return (
      <g>
        <text x={x} y={y-20} textAnchor="middle" fill="#888050" fontSize="8" fontWeight="bold">{n}</text>
        <text x={x} y={y-7}  textAnchor="middle" fill="#880000" fontSize={fs+4} fontFamily="serif">{sg.symbol}</text>
        <text x={x} y={y+8}  textAnchor="middle" fill="#554400" fontSize="8">{sg.sanskrit}</text>
        <g>
          {pl.map((p,i)=>{
            const pc=PlanetColors[p.name]||p.color||"#333";
            return <text key={i} x={x+(i-(pl.length-1)/2)*15} y={y+21}
              textAnchor="middle" fill={pc} fontSize="9" fontWeight="bold">{p.symbol}</text>;
          })}
        </g>
      </g>
    );
  };

  // Decorative border squares
  const sq=10;
  const deco=[
    // outer corners
    {x:gx0-sq/2,y:gy0-sq/2},{x:gx1-sq/2,y:gy0-sq/2},
    {x:gx0-sq/2,y:gy1-sq/2},{x:gx1-sq/2,y:gy1-sq/2},
    // edge midpoints
    {x:cx-sq/2,y:gy0-sq/2},{x:cx-sq/2,y:gy1-sq/2},
    {x:gx0-sq/2,y:cy-sq/2},{x:gx1-sq/2,y:cy-sq/2},
  ];

  return (
    <div style={{display:"flex",justifyContent:"center",marginBottom:26}}>
      <div style={{background:"#f5eedc",borderRadius:5,padding:3,
        boxShadow:"0 8px 40px rgba(0,0,0,0.6),0 0 0 2px #8B6914",maxWidth:"100%"}}>
        <svg width={W} height={H} style={{display:"block",maxWidth:"100%",fontFamily:"'Noto Sans Devanagari',Georgia,serif"}}>

          {/* Background */}
          <rect width={W} height={H} fill="#f5eedc"/>

          {/* Outer double border */}
          <rect x={gx0-7} y={gy0-7} width={gw+14} height={gh+14} fill="none" stroke={lc} strokeWidth="2.5"/>
          <rect x={gx0}   y={gy0}   width={gw}     height={gh}    fill="none" stroke={lc} strokeWidth="1.5"/>

          {/* Decorative squares at border intersections */}
          {deco.map((d,i)=><rect key={i} x={d.x} y={d.y} width={sq} height={sq} fill={lc}/>)}

          {/* ── THE 5 STRAIGHT STRUCTURAL LINES ── */}
          {/* Horizontal center line: full width */}
          <line x1={gx0} y1={cy} x2={gx1} y2={cy} stroke={lc} strokeWidth={lw}/>
          {/* Vertical center line: full height */}
          <line x1={cx} y1={gy0} x2={cx} y2={gy1} stroke={lc} strokeWidth={lw}/>
          {/* 4 corner-to-center diagonals */}
          <line x1={gx0} y1={gy0} x2={cx} y2={cy} stroke={lc} strokeWidth={lw}/>
          <line x1={gx1} y1={gy0} x2={cx} y2={cy} stroke={lc} strokeWidth={lw}/>
          <line x1={gx0} y1={gy1} x2={cx} y2={cy} stroke={lc} strokeWidth={lw}/>
          <line x1={gx1} y1={gy1} x2={cx} y2={cy} stroke={lc} strokeWidth={lw}/>

          {/* ── CENTER DIAMOND PETAL (4 inward-bowing curves) ── */}
          {/* The 4 diamond tips are: mTop, mBot, mLeft, mRight */}
          {/* Each pair of adjacent tips is connected by TWO curves bowing INWARD */}
          {/* creating the classic "petal" / "eye" shapes */}

          {/* Top petal: mLeft ↔ mTop, curving inward (downward) */}
          <path d={`M ${mLeft.x} ${mLeft.y} Q ${cx-bow*0.5} ${cy-bow*0.5} ${mTop.x} ${mTop.y}`}
            fill="none" stroke={lc} strokeWidth="1.5"/>
          <path d={`M ${mTop.x} ${mTop.y} Q ${cx+bow*0.5} ${cy-bow*0.5} ${mRight.x} ${mRight.y}`}
            fill="none" stroke={lc} strokeWidth="1.5"/>

          {/* Bottom petal: mLeft ↔ mBot */}
          <path d={`M ${mLeft.x} ${mLeft.y} Q ${cx-bow*0.5} ${cy+bow*0.5} ${mBot.x} ${mBot.y}`}
            fill="none" stroke={lc} strokeWidth="1.5"/>
          <path d={`M ${mBot.x} ${mBot.y} Q ${cx+bow*0.5} ${cy+bow*0.5} ${mRight.x} ${mRight.y}`}
            fill="none" stroke={lc} strokeWidth="1.5"/>

          {/* Left petal: mTop ↔ mBot curving left */}
          <path d={`M ${mTop.x} ${mTop.y} Q ${cx-bow} ${cy} ${mBot.x} ${mBot.y}`}
            fill="none" stroke={lc} strokeWidth="1.5"/>

          {/* Right petal: mTop ↔ mBot curving right */}
          <path d={`M ${mTop.x} ${mTop.y} Q ${cx+bow} ${cy} ${mBot.x} ${mBot.y}`}
            fill="none" stroke={lc} strokeWidth="1.5"/>

          {/* Fill the 4 petal shapes with slightly darker cream */}
          {/* Left petal fill */}
          <path d={`M ${mTop.x} ${mTop.y} Q ${cx-bow} ${cy} ${mBot.x} ${mBot.y} Q ${cx-bow*0.5} ${cy+bow*0.5} ${mLeft.x} ${mLeft.y} Q ${cx-bow*0.5} ${cy-bow*0.5} ${mTop.x} ${mTop.y} Z`}
            fill="#e6dcc8" stroke="none"/>
          {/* Right petal fill */}
          <path d={`M ${mTop.x} ${mTop.y} Q ${cx+bow*0.5} ${cy-bow*0.5} ${mRight.x} ${mRight.y} Q ${cx+bow*0.5} ${cy+bow*0.5} ${mBot.x} ${mBot.y} Q ${cx+bow} ${cy} ${mTop.x} ${mTop.y} Z`}
            fill="#e6dcc8" stroke="none"/>
          {/* Top petal fill */}
          <path d={`M ${mLeft.x} ${mLeft.y} Q ${cx-bow*0.5} ${cy-bow*0.5} ${mTop.x} ${mTop.y} Q ${cx+bow*0.5} ${cy-bow*0.5} ${mRight.x} ${mRight.y} Q ${cx} ${cy-bow*1.1} ${mLeft.x} ${mLeft.y} Z`}
            fill="#e6dcc8" stroke="none"/>
          {/* Bottom petal fill */}
          <path d={`M ${mLeft.x} ${mLeft.y} Q ${cx} ${cy+bow*1.1} ${mRight.x} ${mRight.y} Q ${cx+bow*0.5} ${cy+bow*0.5} ${mBot.x} ${mBot.y} Q ${cx-bow*0.5} ${cy+bow*0.5} ${mLeft.x} ${mLeft.y} Z`}
            fill="#e6dcc8" stroke="none"/>

          {/* Redraw curves on top */}
          <path d={`M ${mLeft.x} ${mLeft.y} Q ${cx-bow*0.5} ${cy-bow*0.5} ${mTop.x} ${mTop.y}`} fill="none" stroke={lc} strokeWidth="1.5"/>
          <path d={`M ${mTop.x} ${mTop.y} Q ${cx+bow*0.5} ${cy-bow*0.5} ${mRight.x} ${mRight.y}`} fill="none" stroke={lc} strokeWidth="1.5"/>
          <path d={`M ${mLeft.x} ${mLeft.y} Q ${cx-bow*0.5} ${cy+bow*0.5} ${mBot.x} ${mBot.y}`} fill="none" stroke={lc} strokeWidth="1.5"/>
          <path d={`M ${mBot.x} ${mBot.y} Q ${cx+bow*0.5} ${cy+bow*0.5} ${mRight.x} ${mRight.y}`} fill="none" stroke={lc} strokeWidth="1.5"/>
          <path d={`M ${mTop.x} ${mTop.y} Q ${cx-bow} ${cy} ${mBot.x} ${mBot.y}`} fill="none" stroke={lc} strokeWidth="1.5"/>
          <path d={`M ${mTop.x} ${mTop.y} Q ${cx+bow} ${cy} ${mBot.x} ${mBot.y}`} fill="none" stroke={lc} strokeWidth="1.5"/>

          {/* Center label */}
          <text x={cx} y={cy-8} textAnchor="middle" fill="#880000" fontSize="12" fontWeight="bold">लग्न कुंडली</text>
          <text x={cx} y={cy+14} textAnchor="middle" fill="#AA4400" fontSize="22" fontFamily="serif">ॐ</text>

          {/* ── 12 HOUSE CONTENT ── */}
          {/* H1  — top center triangle     */} <Cell n={1}  x={cx}              y={gy0+gh*0.17}  />
          {/* H2  — top-left corner box     */} <Cell n={2}  x={gx0+gw*0.17}    y={gy0+gh*0.17}  />
          {/* H3  — left-top triangle       */} <Cell n={3}  x={gx0+gw*0.1}     y={cy-gh*0.22}   />
          {/* H4  — left center rect        */} <Cell n={4}  x={gx0+gw*0.17}    y={cy}            />
          {/* H5  — left-bottom triangle    */} <Cell n={5}  x={gx0+gw*0.1}     y={cy+gh*0.22}   />
          {/* H6  — bottom-left corner box  */} <Cell n={6}  x={gx0+gw*0.17}    y={gy0+gh*0.83}  />
          {/* H7  — bottom center triangle  */} <Cell n={7}  x={cx}              y={gy0+gh*0.83}  />
          {/* H8  — bottom-right corner box */} <Cell n={8}  x={gx0+gw*0.83}    y={gy0+gh*0.83}  />
          {/* H9  — right-bottom triangle   */} <Cell n={9}  x={gx0+gw*0.9}     y={cy+gh*0.22}   />
          {/* H10 — right center rect       */} <Cell n={10} x={gx0+gw*0.83}    y={cy}            />
          {/* H11 — right-top triangle      */} <Cell n={11} x={gx0+gw*0.9}     y={cy-gh*0.22}   />
          {/* H12 — top-right corner box    */} <Cell n={12} x={gx0+gw*0.83}    y={gy0+gh*0.17}  />

        </svg>
      </div>
    </div>
  );
};

// ── PLANET TABLE ──────────────────────────────────────────────────
const PTable = ({ data, t }) => (
  <div style={{background:"rgba(10,5,30,0.95)",border:"1px solid rgba(212,175,55,0.28)",borderRadius:13,overflow:"hidden",marginBottom:20}}>
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",minWidth:500}}>
        <thead><tr style={{background:"rgba(212,175,55,0.11)"}}>
          {t.pcols.map(h=><th key={h} style={{padding:"9px 10px",color:"#d4af37",fontSize:10,borderBottom:"1px solid rgba(212,175,55,0.16)",textAlign:"left",letterSpacing:1}}>{h}</th>)}
        </tr></thead>
        <tbody>{PLANETS.map((p,i)=>{
          const pd=data?.[p.name]||{};
          const good=["Exalted","Own Sign","उच्च","स्वगृही"].includes(pd.status);
          const bad=["Debilitated","नीच"].includes(pd.status);
          return (
            <tr key={p.name} style={{borderBottom:"1px solid rgba(212,175,55,0.06)",background:i%2?"rgba(212,175,55,0.015)":"transparent"}}>
              <td style={{padding:"8px 10px"}}>
                <span style={{color:p.color,fontWeight:"bold",fontSize:12}}>{p.symbol} {p.name}</span>
                <div style={{fontSize:9,color:"rgba(212,175,55,0.28)"}}>{p.sanskrit}</div>
              </td>
              <td style={{padding:"8px 10px",color:"rgba(230,210,180,0.72)",fontSize:12}}>{pd.sign||"—"}</td>
              <td style={{padding:"8px 10px",color:"rgba(230,210,180,0.72)",fontSize:12}}>H{pd.house||"—"}</td>
              <td style={{padding:"8px 10px",color:"rgba(230,210,180,0.72)",fontSize:11}}>{pd.degree||"—"}</td>
              <td style={{padding:"8px 10px"}}>
                <span style={{padding:"2px 7px",borderRadius:20,fontSize:10,
                  background:good?"rgba(0,200,100,0.11)":bad?"rgba(255,80,80,0.11)":"rgba(212,175,55,0.07)",
                  color:good?"#00c864":bad?"#ff5050":"#d4af37",
                  border:`1px solid ${good?"rgba(0,200,100,0.22)":bad?"rgba(255,80,80,0.22)":"rgba(212,175,55,0.15)"}`
                }}>{pd.status||"—"}</span>
              </td>
              <td style={{padding:"8px 10px",color:"rgba(230,210,180,0.55)",fontSize:11}}>{pd.effect||"—"}</td>
            </tr>
          );
        })}</tbody>
      </table>
    </div>
  </div>
);

// ── HOUSE GRID ────────────────────────────────────────────────────
const HGrid = ({ data, t, lang }) => (
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,marginBottom:20}}>
    {Array.from({length:12},(_,i)=>{
      const n=i+1, d=data?.[n]||data?.[String(n)]||{};
      const sg=ZODIAC_SIGNS.find(z=>z.name===d.sign||z.sanskrit===d.sign)||ZODIAC_SIGNS[i];
      const pl=d.planets||[];
      return (
        <div key={n} style={{background:"rgba(10,5,30,0.95)",border:"1px solid rgba(212,175,55,0.16)",borderRadius:10,padding:"12px 14px",borderLeft:"3px solid rgba(212,175,55,0.4)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
            <div>
              <span style={{color:"#d4af37",fontSize:11,fontWeight:600}}>{lang==="hi"?`भाव ${n}`:`House ${n}`}</span>
              <div style={{fontSize:8,color:"rgba(212,175,55,0.38)",marginTop:2}}>{t.hnames[i]}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:18,color:"#d4af37",lineHeight:1}}>{sg.symbol}</div>
              <div style={{fontSize:7,color:"rgba(212,175,55,0.38)",marginTop:2}}>{sg.sanskrit}</div>
            </div>
          </div>
          {pl.length>0
            ?<div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:5}}>{pl.map((p,j)=>{const pd=PLANETS.find(x=>x.name===p||x.symbol===p);return <span key={j} style={{padding:"1px 6px",borderRadius:8,fontSize:10,background:"rgba(212,175,55,0.06)",color:pd?.color||"#d4af37",border:"1px solid rgba(212,175,55,0.1)"}}>{p}</span>;})}</div>
            :<div style={{fontSize:9,color:"rgba(212,175,55,0.18)",marginBottom:5,fontStyle:"italic"}}>{t.nopl}</div>
          }
          <p style={{fontSize:11,color:"rgba(230,210,180,0.58)",lineHeight:1.55}}>{d.interpretation||""}</p>
        </div>
      );
    })}
  </div>
);

// ── BLOCK ─────────────────────────────────────────────────────────
const Block = ({ title, content, icon }) => (
  <div style={{background:"linear-gradient(135deg,rgba(18,9,38,0.92),rgba(10,5,28,0.96))",border:"1px solid rgba(212,175,55,0.25)",borderRadius:14,padding:"22px 26px",marginBottom:18,position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#d4af37,transparent)"}}/>
    <h3 style={{color:"#d4af37",fontSize:13,marginBottom:12,display:"flex",alignItems:"center",gap:8,fontWeight:600}}>
      <span style={{fontSize:16}}>{icon}</span>{title}
    </h3>
    <div style={{color:"rgba(230,210,180,0.86)",fontSize:15,lineHeight:1.9,whiteSpace:"pre-wrap"}}>{content}</div>
  </div>
);

// ── PROGRESS ──────────────────────────────────────────────────────
const Progress = ({ step, t }) => (
  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16,padding:"48px 0"}}>
    <div style={{position:"relative",width:90,height:90}}>
      {[0,1,2].map(i=><div key={i} style={{position:"absolute",inset:i*12,border:`2px solid rgba(212,175,55,${0.8-i*0.2})`,borderRadius:"50%",animation:`spin ${3+i}s linear infinite ${i%2?"reverse":""}`,borderTopColor:"transparent"}}/>)}
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,animation:"pulse 2s ease-in-out infinite"}}>🔯</div>
    </div>
    <div style={{width:260,background:"rgba(212,175,55,0.07)",borderRadius:20,overflow:"hidden",border:"1px solid rgba(212,175,55,0.18)"}}>
      <div style={{height:5,background:"linear-gradient(90deg,#8b6914,#d4af37,#f5d87a)",borderRadius:20,width:step===1?"45%":"100%",transition:"width 1.2s ease"}}/>
    </div>
    <p style={{color:"#d4af37",fontSize:12,letterSpacing:2,textAlign:"center"}}>{step===1?t.s1:t.s2}</p>
  </div>
);

// ── STARS ─────────────────────────────────────────────────────────
const Stars = () => {
  const s=Array.from({length:80},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,sz:Math.random()*2+0.4,d:Math.random()*4,dur:2+Math.random()*3}));
  return <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>{s.map(x=><div key={x.id} style={{position:"absolute",left:`${x.x}%`,top:`${x.y}%`,width:x.sz,height:x.sz,borderRadius:"50%",background:"rgba(255,220,150,0.6)",animation:`twinkle ${x.dur}s ${x.d}s infinite alternate`}}/>)}</div>;
};

// ── APP ───────────────────────────────────────────────────────────
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
    if (!form.name||!form.dob||!form.pob){setErr(t.errFields);return;}
    setErr("");setStep(1);setResult(null);
    const L=hi?"All descriptive text in fluent Hindi (Devanagari). Keep JSON keys in English.":"All text in English.";
    try {
      // ── CALL 1: Chart + planets + houses (compact) ────────────
      const p1=`Vedic astrologer. Compact birth chart for: Name:${form.name}, DOB:${form.dob}, Place:${form.pob}, Time:${form.tob||"12:00"}. ${L}
Return ONLY this JSON structure (no markdown):
{"lagna":"","rashi":"","nakshatra":"","tithi":"","yoga":"",
"pl":{"Sun":{"s":"Leo","h":5,"d":"15°20'","st":"Own Sign","e":"${hi?"प्रभाव":"1 line effect"}"},"Moon":{"s":"","h":0,"d":"","st":"","e":""},"Mars":{"s":"","h":0,"d":"","st":"","e":""},"Mercury":{"s":"","h":0,"d":"","st":"","e":""},"Jupiter":{"s":"","h":0,"d":"","st":"","e":""},"Venus":{"s":"","h":0,"d":"","st":"","e":""},"Saturn":{"s":"","h":0,"d":"","st":"","e":""},"Rahu":{"s":"","h":0,"d":"","st":"","e":""},"Ketu":{"s":"","h":0,"d":"","st":"","e":""}},
"hs":{"1":{"sg":"Aries","pl":["Mars"],"i":"${hi?"हिंदी में":"1 sentence"}"},"2":{"sg":"","pl":[],"i":""},"3":{"sg":"","pl":[],"i":""},"4":{"sg":"","pl":[],"i":""},"5":{"sg":"","pl":[],"i":""},"6":{"sg":"","pl":[],"i":""},"7":{"sg":"","pl":[],"i":""},"8":{"sg":"","pl":[],"i":""},"9":{"sg":"","pl":[],"i":""},"10":{"sg":"","pl":[],"i":""},"11":{"sg":"","pl":[],"i":""},"12":{"sg":"","pl":[],"i":""}},
"yogas":"${hi?"योग हिंदी में":"yogas 2 sentences"}","dasha":"${hi?"दशा हिंदी में":"dasha 2 sentences"}"}`;

      const r1=await callAPI(p1,1400);

      // remap compact keys to full keys for chart rendering
      const houses={};
      if(r1.hs){Object.entries(r1.hs).forEach(([k,v])=>{houses[k]={sign:v.sg||v.sign,planets:v.pl||v.planets||[],interpretation:v.i||v.interpretation||""};});}
      const planetData={};
      if(r1.pl){Object.entries(r1.pl).forEach(([k,v])=>{planetData[k]={sign:v.s||v.sign,house:v.h||v.house,degree:v.d||v.degree,status:v.st||v.status,effect:v.e||v.effect};});}

      setStep(2);

      // ── CALL 2: Life readings only (no chart data) ────────────
      const p2=`Vedic astrologer. Life readings for ${form.name}, Lagna:${r1.lagna}, Rashi:${r1.rashi}, Nakshatra:${r1.nakshatra}. ${L}
Return ONLY this JSON (no markdown), each value max 4 sentences:
{"overview":"${hi?"अवलोकन":"overview"}","pa":"${hi?"ग्रह विश्लेषण":"planetary analysis"}","ha":"${hi?"भाव विश्लेषण":"house analysis"}","health":"${hi?"स्वास्थ्य":"health"}","wealth":"${hi?"धन":"wealth"}","education":"${hi?"शिक्षा":"education"}","career":"${hi?"करियर":"career"}","marriage":"${hi?"विवाह":"marriage"}","pred":"${hi?"दशक भविष्यवाणी 0-10,10-20,20-30,30-40,40-50,50+":"decade predictions 0-10,10-20,20-30,30-40,40-50,50+"}","colours":"${hi?"रंग":"colours"}","numbers":"${hi?"अंक":"numbers"}","days":"${hi?"दिन":"days"}","gems":"${hi?"रत्न":"gemstones"}","rudraksha":"${hi?"रुद्राक्ष":"rudraksha"}","longevity":"${hi?"आयु":"longevity"}","verdict":"${hi?"अंतिम संदेश":"final verdict 3 sentences"}"}`;

      const r2=await callAPI(p2,1400);

      setResult({...r1, houses, planetData, ...r2});
      setTimeout(()=>ref.current?.scrollIntoView({behavior:"smooth"}),100);
    } catch(e){setErr(t.errApi);}
    setStep(0);
  };

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0a0520,#050215,#0d0828)",color:"#e6d4b0",fontFamily:bf,position:"relative"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap');
        @keyframes twinkle{from{opacity:0.2}to{opacity:1}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        input:focus{outline:none!important;border-color:rgba(212,175,55,0.7)!important;box-shadow:0 0 15px rgba(212,175,55,0.1)!important}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#d4af37;border-radius:2px}
      `}</style>

      <Stars/>

      {/* Lang Toggle */}
      <button onClick={()=>setLang(lang==="en"?"hi":"en")} style={{position:"fixed",top:16,right:16,zIndex:100,background:"rgba(10,5,30,0.95)",border:"1px solid rgba(212,175,55,0.4)",borderRadius:26,padding:"7px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,boxShadow:"0 3px 16px rgba(0,0,0,0.5)"}}>
        <span style={{fontSize:16}}>{hi?"🇬🇧":"🇮🇳"}</span>
        <span style={{color:"#d4af37",fontSize:hi?11:12,fontWeight:600}}>{t.langBtn}</span>
      </button>

      <div style={{position:"relative",zIndex:1,maxWidth:880,margin:"0 auto",padding:"38px 18px 70px"}}>

        {/* Header */}
        <div style={{textAlign:"center",marginBottom:42}}>
          <div style={{fontSize:44,marginBottom:10,animation:"pulse 3s ease-in-out infinite"}}>🔯</div>
          <h1 style={{fontFamily:hi?"'Noto Sans Devanagari',sans-serif":"'Cinzel Decorative',serif",fontSize:"clamp(19px,5vw,34px)",background:"linear-gradient(90deg,#8b6914,#d4af37,#f5d87a,#d4af37,#8b6914)",backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmer 4s linear infinite",letterSpacing:hi?2:4,marginBottom:8,fontWeight:700}}>{t.title}</h1>
          <p style={{color:"rgba(212,175,55,0.48)",fontSize:hi?12:10,letterSpacing:hi?0:4}}>{t.subtitle}</p>
          <div style={{height:1,background:"linear-gradient(90deg,transparent,#d4af37,transparent)",margin:"14px auto",maxWidth:250}}/>
          <p style={{color:"rgba(230,210,180,0.28)",fontSize:12,fontStyle:"italic"}}>{t.tagline}</p>
        </div>

        {/* Form */}
        <div style={{background:"linear-gradient(135deg,rgba(18,9,42,0.96),rgba(10,5,28,0.98))",border:"1px solid rgba(212,175,55,0.36)",borderRadius:17,padding:"30px",marginBottom:34,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#8b6914,#d4af37,#f5d87a,#d4af37,#8b6914)"}}/>
          <h2 style={{color:"#d4af37",fontSize:hi?14:12,letterSpacing:hi?0:3,marginBottom:19,textAlign:"center",fontWeight:600}}>{t.formTitle}</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {[{n:"name",l:t.fName,ph:t.phName,tp:"text",full:true},{n:"dob",l:t.fDob,ph:"",tp:"date",full:false},{n:"tob",l:t.fTob,ph:"",tp:"time",full:false},{n:"pob",l:t.fPob,ph:t.phPob,tp:"text",full:true}].map(f=>(
              <div key={f.n} style={{gridColumn:f.full?"1 / -1":"span 1"}}>
                <label style={{display:"block",fontSize:hi?11:9,color:"rgba(212,175,55,0.58)",letterSpacing:hi?0:2,marginBottom:5}}>{f.l}</label>
                <input type={f.tp} name={f.n} value={form[f.n]} onChange={e=>setForm({...form,[e.target.name]:e.target.value})} placeholder={f.ph}
                  style={{width:"100%",background:"rgba(212,175,55,0.04)",border:"1px solid rgba(212,175,55,0.19)",borderRadius:8,padding:"10px 13px",color:"#e6d4b0",fontFamily:bf,fontSize:15,transition:"all 0.25s",colorScheme:"dark"}}/>
              </div>
            ))}
          </div>
          {err&&<p style={{color:"#e87d7d",fontSize:11,textAlign:"center",marginTop:10}}>⚠ {err}</p>}
          <button onClick={run} disabled={step>0} style={{display:"block",width:"100%",marginTop:19,background:step>0?"rgba(212,175,55,0.1)":"linear-gradient(135deg,#8b6914,#d4af37,#f5d87a,#d4af37,#8b6914)",backgroundSize:"200% auto",border:"none",borderRadius:9,padding:"13px",color:step>0?"rgba(212,175,55,0.3)":"#0a0520",fontFamily:hi?"'Noto Sans Devanagari',sans-serif":"'Cinzel',serif",fontSize:hi?14:12,letterSpacing:hi?0:3,fontWeight:700,cursor:step>0?"not-allowed":"pointer",animation:step>0?"none":"shimmer 3s linear infinite"}}>
            {step>0?t.btnWait:t.btnGo}
          </button>
        </div>

        {step>0&&<Progress step={step} t={t}/>}

        {result&&(
          <div ref={ref} style={{animation:"fadeIn 0.65s ease forwards"}}>

            {/* Person header */}
            <div style={{textAlign:"center",marginBottom:24}}>
              <div style={{fontSize:26,marginBottom:7}}>✨</div>
              <h2 style={{fontFamily:hi?"'Noto Sans Devanagari',sans-serif":"'Cinzel Decorative',serif",color:"#d4af37",fontSize:"clamp(14px,4vw,22px)",letterSpacing:hi?1:3}}>{form.name.toUpperCase()}</h2>
              <p style={{color:"rgba(212,175,55,0.38)",fontSize:10,letterSpacing:2,marginTop:4}}>{form.dob} · {form.pob}{form.tob?` · ${form.tob}`:""}</p>
              <div style={{height:1,background:"linear-gradient(90deg,transparent,#d4af37,transparent)",margin:"12px auto",maxWidth:340}}/>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center"}}>
                {[[t.pills.lagna,result.lagna],[t.pills.rashi,result.rashi],[t.pills.nakshatra,result.nakshatra],[t.pills.tithi,result.tithi],[t.pills.yoga,result.yoga]].map(([l,v])=>v&&(
                  <div key={l} style={{background:"rgba(212,175,55,0.07)",border:"1px solid rgba(212,175,55,0.2)",borderRadius:15,padding:"4px 10px"}}>
                    <span style={{fontSize:8,color:"rgba(212,175,55,0.42)",letterSpacing:1}}>{l}: </span>
                    <span style={{fontSize:10,color:"#d4af37",fontWeight:600}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div style={{display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center",marginBottom:24}}>
              {TABS.map(s=>(
                <button key={s.id} onClick={()=>setTab(s.id)} style={{background:tab===s.id?"linear-gradient(135deg,#d4af37,#8b6914)":"rgba(212,175,55,0.06)",border:`1px solid ${tab===s.id?"#d4af37":"rgba(212,175,55,0.2)"}`,color:tab===s.id?"#0a0520":"#d4af37",fontFamily:hi?"'Noto Sans Devanagari',sans-serif":"'Cinzel',serif",fontSize:hi?12:10,letterSpacing:hi?0:1,padding:"6px 12px",borderRadius:24,cursor:"pointer",transition:"all 0.2s",fontWeight:tab===s.id?700:400}}>
                  {s.icon} {t.tabs[s.id]}
                </button>
              ))}
            </div>

            {/* ── CHART TAB ── */}
            {tab==="chart"&&(
              <div>
                <div style={{textAlign:"center",marginBottom:11}}>
                  <h3 style={{color:"#d4af37",fontSize:12,letterSpacing:hi?0:2}}>{t.chartTitle}</h3>
                  <p style={{color:"rgba(212,175,55,0.28)",fontSize:10,marginTop:3}}>{t.chartSub}</p>
                </div>
                <Chart houses={result.houses}/>
                <div style={{display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center",marginBottom:20}}>
                  {PLANETS.map(p=><div key={p.name} style={{display:"flex",alignItems:"center",gap:4,background:"rgba(10,5,30,0.8)",border:"1px solid rgba(212,175,55,0.13)",borderRadius:8,padding:"3px 8px"}}><span style={{color:p.color,fontWeight:"bold",fontSize:10}}>{p.symbol}</span><span style={{color:"rgba(230,210,180,0.45)",fontSize:10}}>{hi?p.sanskrit:p.name}</span></div>)}
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
                <h3 style={{color:"#d4af37",fontSize:11,letterSpacing:hi?0:2,marginBottom:12,textAlign:"center"}}>{t.ptTitle}</h3>
                <PTable data={result.planetData} t={t}/>
                <Block title={t.sec.pa} icon="🪐" content={result.pa}/>
              </div>
            )}

            {/* ── HOUSES TAB ── */}
            {tab==="houses"&&(
              <div>
                <h3 style={{color:"#d4af37",fontSize:11,letterSpacing:hi?0:2,marginBottom:12,textAlign:"center"}}>{t.htTitle}</h3>
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
                    <div key={item.key} style={{background:"rgba(10,5,30,0.95)",border:"1px solid rgba(212,175,55,0.2)",borderRadius:11,padding:"15px"}}>
                      <h3 style={{color:"#d4af37",fontSize:hi?13:11,marginBottom:7,fontWeight:600}}>{item.icon} {item.title}</h3>
                      <p style={{color:"rgba(230,210,180,0.75)",fontSize:hi?13:14,lineHeight:1.75}}>{result[item.key]}</p>
                    </div>
                  ))}
                </div>
                <Block title={t.sec.gems} icon="💎" content={result.gems}/>
                <Block title={t.sec.longevity} icon="⏳" content={result.longevity}/>
              </div>
            )}

          </div>
        )}

        <div style={{textAlign:"center",marginTop:48,color:"rgba(212,175,55,0.16)",fontSize:10,letterSpacing:2}}>
          <div style={{marginBottom:3}}>{t.footer1}</div>
          <div style={{fontSize:9,letterSpacing:0}}>{t.footer2}</div>
        </div>
      </div>
    </div>
  );
}