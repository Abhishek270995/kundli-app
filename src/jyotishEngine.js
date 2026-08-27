import { AstroTime, GeoVector, Ecliptic, Body, SiderealTime } from "astronomy-engine";

/* -------------------------------------------------------------
   ZODIAC SIGNS & NAKSHATRAS
------------------------------------------------------------- */
export const SIGNS = [
  { name: "Aries", sanskrit: "Mesha", lord: "Mars", element: "Fire", symbol: "♈", varna: "Kshatriya", vashya: "Chatushpada" },
  { name: "Taurus", sanskrit: "Vrishabha", lord: "Venus", element: "Earth", symbol: "♉", varna: "Vaishya", vashya: "Chatushpada" },
  { name: "Gemini", sanskrit: "Mithuna", lord: "Mercury", element: "Air", symbol: "♊", varna: "Shudra", vashya: "Dwipada" },
  { name: "Cancer", sanskrit: "Karka", lord: "Moon", element: "Water", symbol: "♋", varna: "Brahmin", vashya: "Jalachara" },
  { name: "Leo", sanskrit: "Simha", lord: "Sun", element: "Fire", symbol: "♌", varna: "Kshatriya", vashya: "Vanachara" },
  { name: "Virgo", sanskrit: "Kanya", lord: "Mercury", element: "Earth", symbol: "♍", varna: "Vaishya", vashya: "Dwipada" },
  { name: "Libra", sanskrit: "Tula", lord: "Venus", element: "Air", symbol: "♎", varna: "Shudra", vashya: "Dwipada" },
  { name: "Scorpio", sanskrit: "Vrishchika", lord: "Mars", element: "Water", symbol: "♏", varna: "Brahmin", vashya: "Keeta" },
  { name: "Sagittarius", sanskrit: "Dhanu", lord: "Jupiter", element: "Fire", symbol: "♐", varna: "Kshatriya", vashya: "Dwipada" },
  { name: "Capricorn", sanskrit: "Makara", lord: "Saturn", element: "Earth", symbol: "♑", varna: "Vaishya", vashya: "Jalachara" },
  { name: "Aquarius", sanskrit: "Kumbha", lord: "Saturn", element: "Air", symbol: "♒", varna: "Shudra", vashya: "Dwipada" },
  { name: "Pisces", sanskrit: "Meena", lord: "Jupiter", element: "Water", symbol: "♓", varna: "Brahmin", vashya: "Jalachara" }
];

export const NAKSHATRAS = [
  { name: "Ashwini", hindi: "अश्विनी", lord: "Ketu", gana: "Deva", yoni: "Horse", nadi: "Adi" },
  { name: "Bharani", hindi: "भरणी", lord: "Venus", gana: "Manushya", yoni: "Elephant", nadi: "Madhya" },
  { name: "Krittika", hindi: "कृत्तिका", lord: "Sun", gana: "Rakshasa", yoni: "Sheep", nadi: "Antya" },
  { name: "Rohini", hindi: "रोहिणी", lord: "Moon", gana: "Manushya", yoni: "Serpent", nadi: "Antya" },
  { name: "Mrigashira", hindi: "मृगशिरा", lord: "Mars", gana: "Deva", yoni: "Serpent", nadi: "Madhya" },
  { name: "Ardra", hindi: "आर्द्रा", lord: "Rahu", gana: "Manushya", yoni: "Dog", nadi: "Adi" },
  { name: "Punarvasu", hindi: "पुनर्वसु", lord: "Jupiter", gana: "Deva", yoni: "Cat", nadi: "Adi" },
  { name: "Pushya", hindi: "पुष्य", lord: "Saturn", gana: "Deva", yoni: "Sheep", nadi: "Madhya" },
  { name: "Ashlesha", hindi: "आश्लेषा", lord: "Mercury", gana: "Rakshasa", yoni: "Cat", nadi: "Antya" },
  { name: "Magha", hindi: "मघा", lord: "Ketu", gana: "Rakshasa", yoni: "Rat", nadi: "Antya" },
  { name: "Purva Phalguni", hindi: "पूर्वा फाल्गुनी", lord: "Venus", gana: "Manushya", yoni: "Rat", nadi: "Madhya" },
  { name: "Uttara Phalguni", hindi: "उत्तरा फाल्गुनी", lord: "Sun", gana: "Manushya", yoni: "Cow", nadi: "Adi" },
  { name: "Hasta", hindi: "हस्त", lord: "Moon", gana: "Deva", yoni: "Buffalo", nadi: "Adi" },
  { name: "Chitra", hindi: "चित्रा", lord: "Mars", gana: "Rakshasa", yoni: "Tiger", nadi: "Madhya" },
  { name: "Swati", hindi: "स्वाति", lord: "Rahu", gana: "Deva", yoni: "Buffalo", nadi: "Antya" },
  { name: "Vishakha", hindi: "विशाखा", lord: "Jupiter", gana: "Rakshasa", yoni: "Tiger", nadi: "Antya" },
  { name: "Anuradha", hindi: "अनुराधा", lord: "Saturn", gana: "Deva", yoni: "Deer", nadi: "Madhya" },
  { name: "Jyeshtha", hindi: "ज्येष्ठा", lord: "Mercury", gana: "Rakshasa", yoni: "Deer", nadi: "Adi" },
  { name: "Mula", hindi: "मूल", lord: "Ketu", gana: "Rakshasa", yoni: "Dog", nadi: "Adi" },
  { name: "Purva Ashadha", hindi: "पूर्वाषाढ़ा", lord: "Venus", gana: "Manushya", yoni: "Monkey", nadi: "Madhya" },
  { name: "Uttara Ashadha", hindi: "उत्तराषाढ़ा", lord: "Sun", gana: "Manushya", yoni: "Mongoose", nadi: "Antya" },
  { name: "Shravana", hindi: "श्रवण", lord: "Moon", gana: "Deva", yoni: "Monkey", nadi: "Antya" },
  { name: "Dhanishta", hindi: "धनिष्ठा", lord: "Mars", gana: "Rakshasa", yoni: "Lion", nadi: "Madhya" },
  { name: "Shatabhisha", hindi: "शतभिषा", lord: "Rahu", gana: "Rakshasa", yoni: "Horse", nadi: "Adi" },
  { name: "Purva Bhadrapada", hindi: "पूर्वभाद्रपदा", lord: "Jupiter", gana: "Manushya", yoni: "Lion", nadi: "Adi" },
  { name: "Uttara Bhadrapada", hindi: "उत्तरभाद्रपदा", lord: "Saturn", gana: "Manushya", yoni: "Cow", nadi: "Madhya" },
  { name: "Revati", hindi: "रेवती", lord: "Mercury", gana: "Deva", yoni: "Elephant", nadi: "Antya" }
];

export const TITHIS_EN = [
  "Shukla Pratipada", "Shukla Dwitiya", "Shukla Tritiya", "Shukla Chaturthi", "Shukla Panchami",
  "Shukla Shashthi", "Shukla Saptami", "Shukla Ashtami", "Shukla Navami", "Shukla Dashami",
  "Shukla Ekadashi", "Shukla Dwadashi", "Shukla Trayodashi", "Shukla Chaturdashi", "Purnima",
  "Krishna Pratipada", "Krishna Dwitiya", "Krishna Tritiya", "Krishna Chaturthi", "Krishna Panchami",
  "Krishna Shashthi", "Krishna Saptami", "Krishna Ashtami", "Krishna Navami", "Krishna Dashami",
  "Krishna Ekadashi", "Krishna Dwadashi", "Krishna Trayodashi", "Krishna Chaturdashi", "Amavasya"
];

export const TITHIS_HI = [
  "शुक्ल प्रतिपदा", "शुक्ल द्वितीया", "शुक्ल तृतीया", "शुक्ल चतुर्थी", "शुक्ल पंचमी",
  "शुक्ल षष्ठी", "शुक्ल सप्तमी", "शुक्ल अष्टमी", "शुक्ल नवमी", "शुक्ल दशमी",
  "शुक्ल एकादशी", "शुक्ल द्वादशी", "शुक्ल त्रयोदशी", "शुक्ल चतुर्दशी", "पूर्णिमा",
  "कृष्ण प्रतिपदा", "कृष्ण द्वितीया", "कृष्ण तृतीया", "कृष्ण चतुर्थी", "कृष्ण पंचमी",
  "कृष्ण षष्ठी", "कृष्ण सप्तमी", "कृष्ण अष्टमी", "कृष्ण नवमी", "कृष्ण दशमी",
  "कृष्ण एकादशी", "कृष्ण द्वादशी", "कृष्ण त्रयोदशी", "कृष्ण चतुर्दशी", "अमावस्या"
];

export const YOGAS_LIST = [
  "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma",
  "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra",
  "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha",
  "Shukla", "Brahma", "Indra", "Vaidhriti"
];

const DASHA_PERIODS = [
  { lord: "Ketu", years: 7 },
  { lord: "Venus", years: 20 },
  { lord: "Sun", years: 6 },
  { lord: "Moon", years: 10 },
  { lord: "Mars", years: 7 },
  { lord: "Rahu", years: 18 },
  { lord: "Jupiter", years: 16 },
  { lord: "Saturn", years: 19 },
  { lord: "Mercury", years: 17 }
];

/* -------------------------------------------------------------
   CALCULATIONS
------------------------------------------------------------- */
export function getSignIndex(deg) {
  return Math.floor(((deg % 360) + 360) % 360 / 30);
}

export function degreeToSign(deg) {
  return SIGNS[getSignIndex(deg)].name;
}

export function getNakshatraInfo(deg) {
  const norm = ((deg % 360) + 360) % 360;
  const segment = 360 / 27;
  const index = Math.floor(norm / segment);
  const pada = Math.floor((norm % segment) / (segment / 4)) + 1;
  const nak = NAKSHATRAS[index % 27];
  return {
    index: index % 27,
    name: nak.name,
    hindi: nak.hindi,
    lord: nak.lord,
    gana: nak.gana,
    yoni: nak.yoni,
    nadi: nak.nadi,
    pada,
    degInNak: norm % segment
  };
}

export function getLahiriAyanamsa(date) {
  const yr = date.getFullYear() + (date.getMonth() * 30 + date.getDate()) / 365.25;
  return 23.85 + (yr - 2000) * 0.01397;
}

export function applyLahiriAyanamsa(lon, date) {
  const ayanamsa = getLahiriAyanamsa(date);
  return ((lon - ayanamsa) % 360 + 360) % 360;
}

export function calculatePlanets(date) {
  const time = new AstroTime(date);
  const bodies = {
    Sun: Body.Sun,
    Moon: Body.Moon,
    Mars: Body.Mars,
    Mercury: Body.Mercury,
    Jupiter: Body.Jupiter,
    Venus: Body.Venus,
    Saturn: Body.Saturn
  };

  const planets = {};
  for (const [name, body] of Object.entries(bodies)) {
    const vec = GeoVector(body, time, false);
    const ecl = Ecliptic(vec);
    let lon = ((ecl.elon % 360) + 360) % 360;
    planets[name] = applyLahiriAyanamsa(lon, date);
  }

  const d = time.ut;
  const T = d / 36525.0;
  let rahuMean = 125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T) / 450000;
  rahuMean = ((rahuMean % 360) + 360) % 360;

  const ayanamsa = getLahiriAyanamsa(date);
  const siderealRahu = ((rahuMean - ayanamsa) % 360 + 360) % 360;
  const siderealKetu = (siderealRahu + 180) % 360;

  planets["Rahu"] = siderealRahu;
  planets["Ketu"] = siderealKetu;

  return planets;
}

export function calculateAscendant(date, lat, lon) {
  const time = new AstroTime(date);
  const gmstHours = SiderealTime(time);
  const lstDeg = ((gmstHours * 15 + lon) % 360 + 360) % 360;

  const theta = (lstDeg * Math.PI) / 180;
  const phi = (lat * Math.PI) / 180;
  const eps = (23.439 * Math.PI) / 180;

  const y = Math.cos(theta);
  const x = - (Math.sin(theta) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps));
  let ascTropical = Math.atan2(y, x) * (180 / Math.PI);
  ascTropical = ((ascTropical % 360) + 360) % 360;

  return applyLahiriAyanamsa(ascTropical, date);
}

export function evaluatePlanetStatus(planet, deg) {
  const signIdx = getSignIndex(deg);

  const dignities = {
    Sun: { exalted: 0, debilitated: 6, own: [4] },
    Moon: { exalted: 1, debilitated: 7, own: [3] },
    Mars: { exalted: 9, debilitated: 3, own: [0, 7] },
    Mercury: { exalted: 5, debilitated: 11, own: [2, 5] },
    Jupiter: { exalted: 3, debilitated: 9, own: [8, 11] },
    Venus: { exalted: 11, debilitated: 5, own: [1, 6] },
    Saturn: { exalted: 6, debilitated: 0, own: [9, 10] },
    Rahu: { exalted: 1, debilitated: 7, own: [10] },
    Ketu: { exalted: 7, debilitated: 1, own: [8] }
  };

  const info = dignities[planet];
  if (!info) return { status: "Neutral", statusHi: "सम राशि", effect: "Moderate results", effectHi: "संतुलित फल" };

  if (signIdx === info.exalted) {
    return {
      status: "Exalted",
      statusHi: "उच्च (Exalted)",
      effect: "Extremely auspicious & powerful energy",
      effectHi: "अत्यंत शुभ और प्रभावशाली फल"
    };
  }
  if (signIdx === info.debilitated) {
    return {
      status: "Debilitated",
      statusHi: "नीच (Debilitated)",
      effect: "Requires conscious effort & remedies",
      effectHi: "सतर्कता और उपाय द्वारा शुभता प्राप्त होगी"
    };
  }
  if (info.own.includes(signIdx)) {
    return {
      status: "Own Sign",
      statusHi: "स्वगृही (Own Sign)",
      effect: "Very strong, comfortable & protective",
      effectHi: "अत्यंत मजबूत और सुरक्षात्मक स्थिति"
    };
  }

  return {
    status: "Direct",
    statusHi: "मित्र/सम राशि",
    effect: `Placed comfortably in ${SIGNS[signIdx].name}`,
    effectHi: `${SIGNS[signIdx].sanskrit} राशि में स्थित`
  };
}

/* -------------------------------------------------------------
   KUNDLI MILAN / ASHTAKOOTA COMPATIBILITY ENGINE (36 GUNAS)
------------------------------------------------------------- */
export function calculateGunMilan({ partner1, partner2 }) {
  const d1 = new Date(`${partner1.dob}T${partner1.tob || "12:00"}`);
  const d2 = new Date(`${partner2.dob}T${partner2.tob || "12:00"}`);

  const p1Planets = calculatePlanets(d1);
  const p2Planets = calculatePlanets(d2);

  const m1Deg = p1Planets["Moon"];
  const m2Deg = p2Planets["Moon"];

  const s1Idx = getSignIndex(m1Deg);
  const s2Idx = getSignIndex(m2Deg);

  const sign1 = SIGNS[s1Idx];
  const sign2 = SIGNS[s2Idx];

  const nak1 = getNakshatraInfo(m1Deg);
  const nak2 = getNakshatraInfo(m2Deg);

  // 1. Varna (1 Point)
  const varnaRank = { Brahmin: 4, Kshatriya: 3, Vaishya: 2, Shudra: 1 };
  let varnaScore = varnaRank[sign1.varna] >= varnaRank[sign2.varna] ? 1 : 0;

  // 2. Vashya (2 Points)
  let vashyaScore = sign1.vashya === sign2.vashya ? 2 : (sign1.element === sign2.element ? 1 : 0.5);

  // 3. Tara (3 Points)
  const taraDist = (nak2.index - nak1.index + 27) % 9;
  let taraScore = [1, 2, 4, 6, 8].includes(taraDist) ? 3 : 1.5;

  // 4. Yoni (4 Points)
  let yoniScore = nak1.yoni === nak2.yoni ? 4 : 2;

  // 5. Graha Maitri (5 Points)
  let maitriScore = sign1.lord === sign2.lord ? 5 : (sign1.element === sign2.element ? 4 : 3);

  // 6. Gana (6 Points)
  let ganaScore = 0;
  if (nak1.gana === nak2.gana) ganaScore = 6;
  else if (nak1.gana === "Deva" && nak2.gana === "Manushya") ganaScore = 5;
  else if (nak1.gana === "Manushya" && nak2.gana === "Deva") ganaScore = 5;
  else ganaScore = 1;

  // 7. Bhakoot (7 Points)
  const signDist = (s2Idx - s1Idx + 12) % 12 + 1;
  const isBhakootDosha = [2, 12, 6, 8, 9, 5].includes(signDist);
  let bhakootScore = isBhakootDosha ? 0 : 7;

  // 8. Nadi (8 Points)
  const isNadiDosha = nak1.nadi === nak2.nadi;
  let nadiScore = isNadiDosha ? 0 : 8;

  const totalGunas = varnaScore + vashyaScore + taraScore + yoniScore + maitriScore + ganaScore + bhakootScore + nadiScore;

  // Manglik Check
  const mars1H = ((getSignIndex(p1Planets["Mars"]) - s1Idx + 12) % 12) + 1;
  const mars2H = ((getSignIndex(p2Planets["Mars"]) - s2Idx + 12) % 12) + 1;
  const p1Manglik = [1, 4, 7, 8, 12].includes(mars1H);
  const p2Manglik = [1, 4, 7, 8, 12].includes(mars2H);

  let matchVerdict = "Excellent Match (Uttam)";
  let matchVerdictHi = "उत्कृष्ट एवं अत्यंत शुभ मिलान (उत्तम)";
  if (totalGunas < 18) {
    matchVerdict = "Challenging Compatibility (Remedies Advised)";
    matchVerdictHi = "सावधानी एवं वैदिक उपाय आवश्यक (चुनौतीपूर्ण)";
  } else if (totalGunas <= 25) {
    matchVerdict = "Good & Harmonious Match (Madhyam)";
    matchVerdictHi = "शुभ एवं सामंजस्यपूर्ण मिलान (मध्यम)";
  }

  return {
    totalGunas: totalGunas.toFixed(1),
    maxGunas: 36,
    percentage: ((totalGunas / 36) * 100).toFixed(0),
    verdict: matchVerdict,
    verdictHi: matchVerdictHi,
    p1: { name: partner1.name, sign: sign1.name, signHi: sign1.sanskrit, nak: nak1.name, nakHi: nak1.hindi, pada: nak1.pada, manglik: p1Manglik },
    p2: { name: partner2.name, sign: sign2.name, signHi: sign2.sanskrit, nak: nak2.name, nakHi: nak2.hindi, pada: nak2.pada, manglik: p2Manglik },
    kootas: [
      {
        name: "Varna Koota (Spiritual / Work Ego)",
        nameHi: "वर्ण कूट (आत्मिक व कार्य स्वभाव)",
        score: varnaScore,
        max: 1,
        desc: "Soul temperament and spiritual compatibility",
        descHi: "आत्मिक स्वभाव एवं आध्यात्मिक अनुकूलता"
      },
      {
        name: "Vashya Koota (Dominance / Harmony)",
        nameHi: "वश्य कूट (परस्पर आकर्षण व नियंत्रण)",
        score: vashyaScore,
        max: 2,
        desc: "Mutual attraction, influence and emotional alignment",
        descHi: "परस्पर आकर्षण, भावनात्मक प्रभाव व संतुलन"
      },
      {
        name: "Tara Koota (Destiny / Health)",
        nameHi: "तारा कूट (भाग्य व स्वास्थ्य सुरक्षा)",
        score: taraScore,
        max: 3,
        desc: "Longevity, health resilience and fortune bonding",
        descHi: "दीर्घायु, आरोग्य एवं भाग्योदय का सम्बंध"
      },
      {
        name: "Yoni Koota (Physical / Biology)",
        nameHi: "योनि कूट (शारीरिक व जैविक आकर्षण)",
        score: yoniScore,
        max: 4,
        desc: "Physical harmony, biological chemistry and intimacy",
        descHi: "शारीरिक सामंजस्य, जैविक आकर्षण व अंतरंगता"
      },
      {
        name: "Graha Maitri (Psychological Bond)",
        nameHi: "ग्रह मैत्री (मानसिक व वैचारिक तालमेल)",
        score: maitriScore,
        max: 5,
        desc: "Intellectual friendship and daily worldview resonance",
        descHi: "बौद्धिक मित्रता एवं वैचारिक तालमेल"
      },
      {
        name: "Gana Koota (Temperament / Behavior)",
        nameHi: "गण कूट (स्वभाव व सामाजिक व्यवहार)",
        score: ganaScore,
        max: 6,
        desc: "Social behavior, core lifestyle and lifestyle values",
        descHi: "सामाजिक व्यवहार, स्वभाव व जीवन मूल्य"
      },
      {
        name: "Bhakoot Koota (Family / Prosperity)",
        nameHi: "भकूट कूट (पारिवारिक समृद्धि व संतान सुख)",
        score: bhakootScore,
        max: 7,
        desc: "Financial growth, emotional longevity and offspring",
        descHi: "आर्थिक उन्नति, भावनात्मक दीर्घायु व संतान सुख"
      },
      {
        name: "Nadi Koota (Genetic / Prana Resonance)",
        nameHi: "नाड़ी कूट (प्राण ऊर्जा व आनुवंशिक सामंजस्य)",
        score: nadiScore,
        max: 8,
        desc: "Hereditary vitality, neurological harmony and progeny",
        descHi: "आनुवंशिक आरोग्य, प्राण ऊर्जा व स्वस्थ संतति"
      }
    ],
    manglikStatus: (p1Manglik === p2Manglik)
      ? "Both charts have matching Manglik energies — cancellation applies."
      : "One partner is Manglik — simple Kumbh Vivah / Hanuman Chalisa remedies recommended for lasting harmony.",
    manglikStatusHi: (p1Manglik === p2Manglik)
      ? "दोनों कुंडलियों में समान मांगलिक ऊर्जा है — मांगलिक दोष का स्वतः परिहार (शमन) होता है।"
      : "एक जातक मांगलिक है — वैवाहिक सुख व शांति हेतु सरल कुंभ विवाह / हनुमान चालीसा पाठ श्रेष्ठ है।"
  };
}

/* -------------------------------------------------------------
   ANNUAL TRANSIT & FORECAST (2026–2027)
------------------------------------------------------------- */
export function generateAnnualTransitReport({ name, ascSignName, moonSignName, lang = "en" }) {
  const isHi = lang === "hi";

  const quarters = [
    {
      quarter: "Q1 (Jan – Mar 2026)",
      theme: isHi ? "करियर विस्तार एवं नई शुरुआत" : "Career Expansion & Strategic Launches",
      impact: isHi ? "गुरु का अनुकूल प्रभाव आपके नए व्यावसायिक प्रस्तावों और पदोन्नति को गति देगा। कार्यक्षेत्र में वरिष्ठों का सहयोग प्राप्त होगा।" : "Benefic Jupiter transits activate high professional recognition, lucrative projects, and strategic career pivots.",
      rating: "9.2/10"
    },
    {
      quarter: "Q2 (Apr – Jun 2026)",
      theme: isHi ? "आर्थिक स्थिरता एवं संपत्ति लाभ" : "Asset Consolidation & Financial Inflows",
      impact: isHi ? "धन भाव में शुभ गोचर संचित पूंजी में वृद्धि और दीर्घकालिक निवेशों से अप्रत्याशित लाभ प्रदान करेगा।" : "Favorable solar and mercurial trines stimulate secondary income channels and high-value property/investment consolidation.",
      rating: "8.8/10"
    },
    {
      quarter: "Q3 (Jul – Sep 2026)",
      theme: isHi ? "पारिवारिक सुख एवं आध्यात्मिक यात्रा" : "Domestic Harmony & Spiritual Journeys",
      impact: isHi ? "परिवार में मांगलिक कार्य के योग। विदेश अथवा तीर्थ यात्रा की योजनाएं फलीभूत होंगी। मन में गहन शांति रहेगी।" : "Harmonious Venus and Moon transits nurture relationship bonding, sacred pilgrimages, and inner creative equilibrium.",
      rating: "9.0/10"
    },
    {
      quarter: "Q4 (Oct – Dec 2026)",
      theme: isHi ? "महत्वाकांक्षाओं की पूर्णता एवं विजय" : "Peak Triumph & Multi-Source Wealth",
      impact: isHi ? "वर्ष के अंतिम चरण में शनि और मंगल का शुभ गोचर सभी लंबित कार्यों को संपन्न कराएगा और मान-प्रतिष्ठा में वृद्धि करेगा।" : "Saturn and Mars transits solidify authority, resolving protracted hurdles and delivering monumental milestone triumphs.",
      rating: "9.5/10"
    }
  ];

  return {
    year: "2026–2027",
    sadeSatiStatus: ["Capricorn", "Aquarius", "Pisces"].includes(moonSignName)
      ? (isHi ? "शनि की साढ़ेसाती का प्रभाव (सकारात्मक रूपांतरण एवं अनुशासन काल)" : "Active Saturn Sade Sati Phase (Period of high discipline & monumental maturity)")
      : (isHi ? "साढ़ेसाती का कोई प्रतिकूल प्रभाव नहीं है (शुभ गोचर)" : "Free from Sade Sati (Smooth and expansive planetary transits)"),
    transits: [
      { planet: "Jupiter (Guru)", sign: "Gemini / Cancer", effect: isHi ? "पंचम व नवम भाव पर अमृत दृष्टि — ज्ञान व भाग्य में वृद्धि" : "Exalted divine trines on natal Kendra houses conferring wealth & wisdom" },
      { planet: "Saturn (Shani)", sign: "Pisces", effect: isHi ? "कर्म भाव में अनुशासन — दीर्घकालिक सफलता की नींव" : "Deep karmic structural realignment and enduring executive mastery" },
      { planet: "Rahu & Ketu", sign: "Aquarius / Leo", effect: isHi ? "इनोवेशन, तकनीक एवं अचानक वित्तीय लाभ के प्रबल योग" : "Radical technological breakthroughs, international networks & unexpected windfalls" }
    ],
    quarters
  };
}

/* -------------------------------------------------------------
   COMPLETE VEDIC ANALYSIS GENERATOR
------------------------------------------------------------- */
export function generateVedicKundliData({ name, dob, tob, pob, lat, lon, lang = "en" }) {
  let birthDate;
  if (dob.includes("T")) {
    birthDate = new Date(dob);
  } else {
    const timeStr = tob && tob.trim() ? tob.trim() : "12:00";
    birthDate = new Date(`${dob}T${timeStr}`);
  }

  if (isNaN(birthDate.getTime())) {
    birthDate = new Date();
  }

  const validLat = Number.isFinite(lat) ? lat : 26.8467;
  const validLon = Number.isFinite(lon) ? lon : 80.9462;

  const planets = calculatePlanets(birthDate);
  const ascDeg = calculateAscendant(birthDate, validLat, validLon);

  const ascSignIdx = getSignIndex(ascDeg);
  const ascSign = SIGNS[ascSignIdx];
  const ascNak = getNakshatraInfo(ascDeg);

  const moonDeg = planets["Moon"];
  const moonSignIdx = getSignIndex(moonDeg);
  const moonSign = SIGNS[moonSignIdx];
  const moonNak = getNakshatraInfo(moonDeg);

  const sunDeg = planets["Sun"];
  const sunSignIdx = getSignIndex(sunDeg);
  const sunSign = SIGNS[sunSignIdx];

  const diffDeg = ((moonDeg - sunDeg + 360) % 360);
  const tithiIdx = Math.floor(diffDeg / 12) % 30;
  const tithiEn = TITHIS_EN[tithiIdx];
  const tithiHi = TITHIS_HI[tithiIdx];

  const yogaDeg = ((sunDeg + moonDeg) % 360);
  const yogaIdx = Math.floor(yogaDeg / (360 / 27)) % 27;
  const yogaName = YOGAS_LIST[yogaIdx];

  const houses = {};
  for (let h = 1; h <= 12; h++) {
    const currentSignIdx = (ascSignIdx + (h - 1)) % 12;
    houses[h] = {
      sign: SIGNS[currentSignIdx].name,
      signSanskrit: SIGNS[currentSignIdx].sanskrit,
      lord: SIGNS[currentSignIdx].lord,
      planets: [],
      interpretation: ""
    };
  }

  const planetData = {};
  const planetHouseMap = {};

  Object.entries(planets).forEach(([planet, deg]) => {
    const pSignIdx = getSignIndex(deg);
    const houseNum = ((pSignIdx - ascSignIdx + 12) % 12) + 1;
    const nakInfo = getNakshatraInfo(deg);
    const evalData = evaluatePlanetStatus(planet, deg);

    planetData[planet] = {
      degree: (deg % 30).toFixed(2) + "°",
      totalDegree: deg.toFixed(2),
      sign: SIGNS[pSignIdx].name,
      signSanskrit: SIGNS[pSignIdx].sanskrit,
      house: houseNum,
      nakshatra: nakInfo.name,
      nakshatraHi: nakInfo.hindi,
      pada: nakInfo.pada,
      status: lang === "hi" ? evalData.statusHi : evalData.status,
      effect: lang === "hi" ? evalData.effectHi : evalData.effect
    };

    planetHouseMap[planet] = houseNum;
    houses[houseNum].planets.push(planet);
  });

  const houseMeaningsEn = [
    "Personality, physical appearance, vitality, and primary life focus.",
    "Wealth accumulation, family lineage, speech, and material resources.",
    "Courage, siblings, short journeys, communication, and creative skills.",
    "Home, inner happiness, mother, land, vehicles, and emotional peace.",
    "Intellect, children, creativity, past karma (Purva Punya), and investments.",
    "Daily work routine, challenges, health resilience, overcoming competition.",
    "Marriage, spouse personality, long-term partnerships, public connections.",
    "Longevity, sudden transformations, occult knowledge, research, and inheritances.",
    "Higher fortune (Bhagya), guru's grace, spirituality, and long journeys.",
    "Career, leadership, reputation, societal impact, and achievements.",
    "Gains, fulfillment of desires, social network, elder siblings, income flow.",
    "Spiritual liberation (Moksha), foreign travels, expenditures, meditation."
  ];

  const houseMeaningsHi = [
    "व्यक्तित्व, शारीरिक ऊर्जा, आत्म-विश्वास और जीवन की दिशा।",
    "धन संचय, पारिवारिक सुख, वाणी और पैतृक संपत्ति।",
    "पराक्रम, छोटे भाई-बहन, संचार, साहस और रचनात्मक कौशल।",
    "गृह सुख, माता का स्नेह, भूमि-वाहन और मानसिक शांति।",
    "बुद्धि, संतान सुख, पूर्व पुण्य, रचनात्मकता और ज्ञान।",
    "कर्मठता, स्वास्थ्य सजगता, रोग-शत्रु पर विजय और सेवा।",
    "दांपत्य सुख, जीवनसाथी का स्वभाव, व्यापारिक साझेदारी।",
    "आयु, आकस्मिक परिवर्तन, गूढ़ विद्या और आंतरिक शोध।",
    "भाग्य वृद्धि, धर्म, गुरु कृपा और उच्च ज्ञान।",
    "करियर, सामाजिक प्रतिष्ठा, नेतृत्व और उच्च उपलब्धियां।",
    "आय में वृद्धि, महत्वाकांक्षाओं की पूर्ति, मित्र और लाभ।",
    "अध्यात्म, मोक्ष, विदेश यात्रा, ध्यान और दान-पुण्य।"
  ];

  for (let h = 1; h <= 12; h++) {
    const plList = houses[h].planets;
    const hDesc = lang === "hi" ? houseMeaningsHi[h - 1] : houseMeaningsEn[h - 1];
    let plDesc = "";
    if (plList.length > 0) {
      plDesc = lang === "hi"
        ? ` ${plList.join(", ")} ग्रह की उपस्थिति इस भाव को विशेष ऊर्जा प्रदान करती है।`
        : ` Influenced strongly by ${plList.join(", ")}.`;
    }
    houses[h].interpretation = hDesc + plDesc;
  }

  // Yogas
  const detectedYogas = [];
  const detectedYogasHi = [];

  const jupHouse = planetHouseMap["Jupiter"];
  const moonHouse = planetHouseMap["Moon"];
  const kendraFromMoon = ((jupHouse - moonHouse + 12) % 12) + 1;
  if ([1, 4, 7, 10].includes(kendraFromMoon)) {
    detectedYogas.push("🌟 Gajakesari Yoga: Jupiter in Kendra from Moon bestows wisdom, enduring prosperity, societal honor, and high intellect.");
    detectedYogasHi.push("🌟 गजकेसरी योग: चंद्रमा से केंद्र में गुरु की स्थिति उत्तम विद्या, यश, दीर्घकालिक समृद्धि और मान-सम्मान प्रदान करती है।");
  }

  if (planetHouseMap["Sun"] === planetHouseMap["Mercury"]) {
    detectedYogas.push(`⚡ Budhaditya Yoga: Sun & Mercury conjoint in House ${planetHouseMap["Sun"]} grants exceptional sharp intellect, analytical brilliance, and leadership.`);
    detectedYogasHi.push(`⚡ बुधादित्य योग: सूर्य और बुध की युति भाव ${planetHouseMap["Sun"]} में प्रखर बुद्धि, प्रशासनिक क्षमता और उत्कृष्ट वाक्पटुता देती है।`);
  }

  if (planetHouseMap["Moon"] === planetHouseMap["Mars"]) {
    detectedYogas.push("💰 Chandra-Mangal Yoga: Conjunction of Moon & Mars activates profound financial acumen, enterprise, and material abundance.");
    detectedYogasHi.push("💰 चंद्र-मंगल योग: चंद्रमा और मंगल की युति धनार्जन की अद्भुत क्षमता और व्यवसाय में बड़ी सफलता का योग बनाती है।");
  }

  detectedYogas.push(`✨ Kendra-Trikona Raj Yoga: Strong alignment between Lagna lord (${ascSign.lord}) and 9th/10th house lords supports rise in status.`);
  detectedYogasHi.push(`✨ केंद्र-त्रिकोण राजयोग: लग्न अधिपति (${ascSign.lord}) और शुभ भावों का संबंध निरंतर प्रगति और उच्च प्रतिष्ठा कारक है।`);

  const marsH = planetHouseMap["Mars"];
  const isManglik = [1, 4, 7, 8, 12].includes(marsH);
  if (isManglik) {
    detectedYogas.push(`🔥 Mangal (Mars) Placement: Mars in House ${marsH} grants tremendous drive and energy; balanced communication in relationships brings great harmony.`);
    detectedYogasHi.push(`🔥 मंगल स्थिति: मंगल भाव ${marsH} में स्थित होकर असीम ऊर्जा व तेज प्रदान करता है; दांपत्य में धैर्य और समझदारी सुखद फल देगी।`);
  }

  // Dashas
  const birthNakIdx = moonNak.index;
  const dashaLord = moonNak.lord;
  const dashaIdx = Math.max(0, DASHA_PERIODS.findIndex(d => d.lord === dashaLord));
  const totalDashaYears = DASHA_PERIODS[dashaIdx].years;
  const fractionPassed = moonNak.degInNak / (360 / 27);
  const balanceYears = totalDashaYears * (1 - fractionPassed);

  const dashaSchedule = [];
  const birthYear = birthDate.getFullYear();
  let currentYear = birthYear + balanceYears;

  dashaSchedule.push(`${dashaLord} Mahadasha (At birth till ${Math.round(currentYear)})`);

  for (let i = 1; i <= 5; i++) {
    const nextIdx = (dashaIdx + i) % DASHA_PERIODS.length;
    const item = DASHA_PERIODS[nextIdx];
    const endY = currentYear + item.years;
    dashaSchedule.push(`${item.lord} Mahadasha (${Math.round(currentYear)} – ${Math.round(endY)})`);
    currentYear = endY;
  }

  const luckyGemsByLagna = {
    Aries: { gem: "Red Coral (Moonga)", metal: "Copper / Gold", hiGem: "लाल मूंगा (Red Coral)", certPrice: "₹2,499" },
    Taurus: { gem: "Diamond / White Sapphire", metal: "Silver / Platinum", hiGem: "हीरा / सफेद पुखराज", certPrice: "₹3,999" },
    Gemini: { gem: "Emerald (Panna)", metal: "Bronze / Gold", hiGem: "पन्ना (Emerald)", certPrice: "₹3,499" },
    Cancer: { gem: "Pearl (Moti) / Moonstone", metal: "Silver", hiGem: "सच्चा मोती (Pearl)", certPrice: "₹1,999" },
    Leo: { gem: "Ruby (Manikya)", metal: "Gold / Copper", hiGem: "माणिक्य (Ruby)", certPrice: "₹3,499" },
    Virgo: { gem: "Emerald (Panna)", metal: "Gold / Bronze", hiGem: "पन्ना (Emerald)", certPrice: "₹3,499" },
    Libra: { gem: "Diamond / Opal", metal: "Silver / White Gold", hiGem: "ओपल / हीरा", certPrice: "₹2,999" },
    Scorpio: { gem: "Red Coral (Moonga) / Yellow Sapphire", metal: "Copper / Gold", hiGem: "लाल मूंगा / पुखराज", certPrice: "₹2,499" },
    Sagittarius: { gem: "Yellow Sapphire (Pukhraj)", metal: "Gold", hiGem: "पीला पुखराज (Yellow Sapphire)", certPrice: "₹4,999" },
    Capricorn: { gem: "Blue Sapphire (Neelam) / Blue Topaz", metal: "Silver / Iron", hiGem: "नीलम / जामुनिया", certPrice: "₹4,499" },
    Aquarius: { gem: "Blue Sapphire / Amethyst", metal: "Silver / Panchdhatu", hiGem: "नीलम / अमेथिस्ट", certPrice: "₹4,499" },
    Pisces: { gem: "Yellow Sapphire (Pukhraj) / Pearl", metal: "Gold", hiGem: "पीला पुखराज / मोती", certPrice: "₹4,999" }
  };

  const luckyInfo = luckyGemsByLagna[ascSign.name] || luckyGemsByLagna["Aries"];

  const luckyColors = {
    Aries: "Crimson Red, Saffron & Golden Yellow", Taurus: "Lotus White, Cream & Soft Pastels",
    Gemini: "Emerald Green, Mint & Turquoise", Cancer: "Pearl White, Silver & Sea Green",
    Leo: "Royal Gold, Orange & Ruby Red", Virgo: "Forest Green, Jade & Earthy Tones",
    Libra: "Silk White, Light Blue & Rose Pink", Scorpio: "Deep Maroon, Coral Red & Amber",
    Sagittarius: "Auspicious Yellow, Saffron & Gold", Capricorn: "Deep Navy Blue, Charcoal & Slate Grey",
    Aquarius: "Electric Blue, Violet & Sky Blue", Pisces: "Golden Yellow, Saffron & Aquamarine"
  }[ascSign.name];

  const luckyColorsHi = {
    Aries: "गहरा लाल, केसरिया और सुनहरा पीला", Taurus: "दूधिया सफेद, क्रीम और हल्का गुलाबी",
    Gemini: "पन्ना हरा, तोतिया और आसमानी", Cancer: "मोतिया सफेद, चांदी और हल्का नीला",
    Leo: "शाही सुनहरा, नारंगी और माणिक्य लाल", Virgo: "हरा, जामुनी और गहरा बादामी",
    Libra: "चमकीला सफेद, हल्का नीला और गुलाबी", Scorpio: "गहरा मैरून, सिंदूरी लाल और केसरिया",
    Sagittarius: "पीला, केसरिया और स्वर्णिम रंग", Capricorn: "गहरा नीला, नेवी ब्लू और स्लेटी",
    Aquarius: "नीला, बैंगनी और हल्का आसमानी", Pisces: "हल्दी पीला, केसरिया और हल्का हरा"
  }[ascSign.name];

  const luckyNumbers = {
    Aries: "1, 9, 3", Taurus: "6, 5, 8", Gemini: "5, 1, 6", Cancer: "2, 7, 9",
    Leo: "1, 5, 9", Virgo: "5, 6, 2", Libra: "6, 7, 1", Scorpio: "9, 3, 1",
    Sagittarius: "3, 1, 9", Capricorn: "8, 5, 6", Aquarius: "8, 4, 7", Pisces: "3, 2, 9"
  }[ascSign.name];

  const auspiciousDays = {
    Aries: "Tuesday, Sunday & Thursday", Taurus: "Friday, Saturday & Wednesday",
    Gemini: "Wednesday, Friday & Thursday", Cancer: "Monday, Tuesday & Thursday",
    Leo: "Sunday, Tuesday & Thursday", Virgo: "Wednesday, Friday & Saturday",
    Libra: "Friday, Saturday & Wednesday", Scorpio: "Tuesday, Thursday & Sunday",
    Sagittarius: "Thursday, Sunday & Tuesday", Capricorn: "Saturday, Friday & Wednesday",
    Aquarius: "Saturday, Wednesday & Friday", Pisces: "Thursday, Monday & Tuesday"
  }[ascSign.name];

  const auspiciousDaysHi = {
    Aries: "मंगलवार, रविवार और गुरुवार", Taurus: "शुक्रवार, शनिवार और बुधवार",
    Gemini: "बुधवार, शुक्रवार और गुरुवार", Cancer: "सोमवार, मंगलवार और गुरुवार",
    Leo: "रविवार, मंगलवार और गुरुवार", Virgo: "बुधवार, शुक्रवार और शनिवार",
    Libra: "शुक्रवार, शनिवार और बुधवार", Scorpio: "मंगलवार, गुरुवार और रविवार",
    Sagittarius: "गुरुवार, रविवार और मंगलवार", Capricorn: "शनिवार, शुक्रवार और बुधवार",
    Aquarius: "शनिवार, बुधवार और शुक्रवार", Pisces: "गुरुवार, सोमवार और मंगलवार"
  }[ascSign.name];

  const isHi = lang === "hi";

  const overviewText = isHi
    ? `आपकी जन्म कुंडली के अनुसार आपका लग्न ${ascSign.sanskrit} (${ascSign.name}) एवं चंद्र राशि ${moonSign.sanskrit} (${moonSign.name}) है। आपका जन्म ${moonNak.hindi} नक्षत्र के ${moonNak.pada} चरण में हुआ है। आपका लग्न स्वामी ${ascSign.lord} आपके जीवन में आत्मबल, नेतृत्व और निरंतर उन्नति प्रदान करता है। कुंडली में ग्रहों की अनुकूल स्थिति आपके बहुमुखी व्यक्तित्व और गहन बौद्धिक क्षमता को दर्शाती है। आप प्राकृतिक रूप से कर्मठ, दूरदर्शी और अपने कार्यक्षेत्र में सम्मान अर्जित करने वाले व्यक्तित्व के धनी हैं।`
    : `According to your Vedic birth chart, your Ascendant (Lagna) is ${ascSign.name} (${ascSign.sanskrit}) and Moon Sign (Rashi) is ${moonSign.name} (${moonSign.sanskrit}). You were born in ${moonNak.name} Nakshatra (Pada ${moonNak.pada}) under the divine lordship of ${moonNak.lord}. Your Lagna lord ${ascSign.lord} bestows you with strong vitality, strategic clarity, and natural leadership. The planetary alignments indicate a driven, visionary individual capable of achieving substantial societal impact and enduring fulfillment through steady devotion to purposeful action.`;

  const planetaryAnalysisText = isHi
    ? `आपकी कुंडली में सूर्य ${planetData["Sun"]?.signSanskrit} में स्थित होकर आत्मविश्वास और प्रतिष्ठा में वृद्धि करता है। चंद्रमा ${planetData["Moon"]?.signSanskrit} में मन की एकाग्रता और रचनात्मक सोच प्रदान करता है। गुरु और बुध की स्थिति आपको विश्लेषण, ज्ञान और वित्तीय समझ में प्रवीण बनाती है। शनि और मंगल की ऊर्जा आपको कठिन परिस्थितियों में भी धैर्यपूर्वक विजय प्राप्त करने का सामर्थ्य देती है।`
    : `The Sun positioned in ${planetData["Sun"]?.sign} elevates your self-assurance and administrative command. The Moon in ${planetData["Moon"]?.sign} imparts emotional depth and sharp intuitive perception. Benefic influences from Jupiter and Mercury enrich your analytical faculties, decision-making prowess, and commercial intelligence, while Mars and Saturn grant relentless tenacity to overcome competitive hurdles.`;

  const houseAnalysisText = isHi
    ? `प्रथम भाव (${ascSign.sanskrit}) आपके व्यक्तित्व और स्वास्थ्य की सुदृढ़ नींव रखता है। द्वितीय भाव (धन) और एकादश भाव (लाभ) का संबंध निरंतर आर्थिक वृद्धि और संचित पूंजी का योग बनाता है। दशम भाव (करियर) में शुभ प्रभाव आपके पेशेवर जीवन में उच्च पद, नेतृत्व और मान-सम्मान को सुनिश्चित करते हैं। चतुर्थ और नवम भाव का समन्वय पारिवारिक सुख, आध्यात्मिक चेतना और भाग्य की कृपा प्रदान करता है।`
    : `House 1 (${ascSign.name}) lays a resilient foundation for physical vigor and self-expression. Strong interplay between House 2 (Wealth) and House 11 (Gains) indicates consistent accumulation of assets and diversified income channels. House 10 (Career) receives auspicious planetary rays, promising professional ascension and authoritative recognition. The 4th and 9th houses ensure domestic contentment and the protective grace of fortunate circumstances (Bhagya).`;

  const healthText = isHi
    ? `आपका सामान्य स्वास्थ्य और रोग प्रतिरोधक क्षमता अच्छी है। लग्न स्वामी की शक्ति आपको स्वाभाविक स्फूर्ति प्रदान करती है। मौसमी परिवर्तनों में संतुलित दिनचर्या, योग और पर्याप्त जल सेवन आपके मानसिक व शारीरिक संतुलन को हमेशा उत्कृष्ट बनाए रखेगा।`
    : `Your constitutional vitality and immune resilience are fundamentally sound. Your Lagna lord provides strong natural recuperative powers. Maintaining a steady daily rhythm, regular yoga or mindfulness, and hydration will sustain peak physical energy and clear mental focus across all seasons.`;

  const wealthText = isHi
    ? `आपकी कुंडली में धन भाव (२रा) और लाभ भाव (११वां) अत्यंत सक्रिय हैं। आपके पास एक से अधिक स्रोतों से धन अर्जित करने और दीर्घकालिक निवेशों से लाभ प्राप्त करने की अद्भुत क्षमता है। ३० वर्ष की आयु के पश्चात आपकी आर्थिक स्थिति में द्रुत गति से स्थिरता और समृद्धि आएगी।`
    : `The cosmic financial axes (Houses 2 and 11) show strong vitality. You possess a natural aptitude for strategic asset allocation and creating multi-stream revenues. Long-term investments, real estate, or enterprise ventures yield profound compound growth, with financial maturity accelerating rapidly after age 30.`;

  const educationText = isHi
    ? `पंचम भाव (विद्या व बुद्धि) में बुध और गुरु का सकारात्मक प्रभाव आपकी ग्रहण शक्ति को प्रखर बनाता है। आप तार्किक विषयों, प्रबंधन, विज्ञान या उच्च अनुसंधान में उत्कृष्ट प्रदर्शन करने में सक्षम हैं। निरंतर स्वाध्याय आपके जीवन की सबसे बड़ी शक्ति है।`
    : `The 5th house of intellect and discernment enjoys positive vibratory support from Mercury and Jupiter. You exhibit exceptional capacity for rapid learning, analytical synthesis, management, and technical or philosophical mastery. Continuous self-education serves as your supreme competitive advantage.`;

  const careerText = isHi
    ? `दशम भाव में कर्म की दिशा अत्यंत प्रभावशाली है। आप स्वतंत्र निर्णय लेने, टीम का मार्गदर्शन करने और जटिल परियोजनाओं को सफलतापूर्वक पूर्ण करने में दक्ष हैं। प्रशासन, प्रौद्योगिकी, परामर्श या व्यापार में आपका कद निरंतर बढ़ता रहेगा।`
    : `Your 10th house of career indicates outstanding executive capabilities. You thrive in environments that reward strategic autonomy, problem-solving, and organizational leadership. Fields related to technology, consulting, governance, finance, or innovative entrepreneurship offer exceptional heights of success.`;

  const marriageText = isHi
    ? `सप्तम भाव (दांपत्य) एक बौद्धिक, संवेदनशील और सहयोगी जीवनसाथी का संकेत देता है। आपसी समझ, संवाद और एक-दूसरे के लक्ष्यों का सम्मान आपके वैवाहिक जीवन में प्रेम और सामंजस्य को चिरस्थायी बनाए रखेगा।`
    : `The 7th house indicates a thoughtful, supportive, and intellectually compatible life partner. Open communication, mutual respect for individual ambitions, and shared spiritual or ethical values will nurture a deeply harmonious and enduring matrimonial bond.`;

  const decadePredictionsText = isHi
    ? `• 0-10 वर्ष: जिज्ञासु स्वभाव, पारिवारिक स्नेह और प्रारंभिक शिक्षा की मजबूत नींव।\n• 10-20 वर्ष: शैक्षणिक उपलब्धियां, कौशल विकास और भविष्य की योजनाओं का निर्माण।\n• 20-30 वर्ष: करियर की ठोस शुरुआत, पेशेवर पहचान, यात्राएं एवं व्यक्तिगत स्वतंत्रता।\n• 30-40 वर्ष: महान आर्थिक प्रगति, पदोन्नति, पारिवारिक स्थायित्व एवं सामाजिक प्रतिष्ठा।\n• 40-50 वर्ष: नेतृत्व के शीर्ष अवसर, संपत्ति निर्माण, संतान सुख और व्यापक प्रभाव।\n• 50+ वर्ष: आध्यात्मिक परिपक्वता, परामर्शदाता की भूमिका, स्थायी शांति और परम संतोष।`
    : `• Ages 0–10: High curiosity, warm nurturing environment, and solid foundation in fundamental learning.\n• Ages 10–20: Academic brilliance, emergence of core talents, skill mastery, and formative ambitions.\n• Ages 20–30: Career launch, establishing professional independence, meaningful connections, and travels.\n• Ages 30–40: Significant wealth expansion, leadership roles, familial stability, and respected reputation.\n• Ages 40–50: Pinnacle career accomplishments, mentorship, asset consolidation, and societal influence.\n• Ages 50+: Spiritual wisdom, lasting peace, legacy building, and deep philosophical fulfillment.`;

  const remediesGemsText = isHi
    ? `• भाग्यशाली रत्न: ${luckyInfo.hiGem} को ${luckyInfo.metal} में धारण करें।\n• रुद्राक्ष: ${ascSign.name === "Leo" ? "1 मुखी / 12 मुखी" : ascSign.name === "Aries" || ascSign.name === "Scorpio" ? "3 मुखी" : "5 मुखी अथवा 7 मुखी"} रुद्राक्ष धारण करना अत्यंत कल्याणकारी है।\n• नित्य प्रातः सूर्य देव को तांबे के लोटे से जल अर्पित करें और "ॐ नमो भगवते वासुदेवाय" अथवा "ॐ नमः शिवाय" का ११ बार जप करें।`
    : `• Prescribed Gemstone: Wear ${luckyInfo.gem} set in ${luckyInfo.metal} on an auspicious morning after cleansing.\n• Sacred Rudraksha: 5-Mukhi or 7-Mukhi Rudraksha brings tremendous peace, mental fortitude, and protective aura.\n• Daily Practice: Offer water to the rising Sun and recite the sacred Gayatri Mantra or "Om Namah Shivaya" 11 times for sustained vitality.`;

  const longevityText = isHi
    ? `अष्टम भाव और लग्न स्वामी की सुदृढ़ स्थिति दीर्घायु (दीर्घ जीवन) का शुभ योग बनाती है। सात्विक आहार, नियमित प्राणायाम और सकारात्मक चिंतन आपके जीवन को ऊर्जावान व निरोगी बनाए रखेगा।`
    : `The auspicious strength of the Ascendant lord and 8th house attributes point toward Deerghayu (Long and Vital Life). Adopting a balanced lifestyle, mindful nutrition, and regular breathwork (Pranayama) sustains lifelong vitality.`;

  const verdictText = isHi
    ? `आपकी जन्म कुंडली एक अत्यंत सामर्थ्यवान, परिश्रमी और प्रगतिशील आत्मा का प्रतीक है। अपने आत्म-विश्वास को सर्वोच्च प्राथमिकता दें, किसी भी तात्कालिक बाधा से विचलित न हों। आपका पुरुषार्थ और ग्रहों का आशीर्वाद मिलकर आपको जीवन में उच्चतम सफलता दिलाएंगे।`
    : `Your Vedic birth chart is a powerful cosmic blueprint of resilience, high intellect, and purposeful ambition. Trust your intuitive wisdom, remain anchored in ethical action, and embrace calculated risks. The cosmic forces stand aligned to reward your dedication with lasting success and inner harmony.`;

  const annualTransit = generateAnnualTransitReport({
    name,
    ascSignName: ascSign.name,
    moonSignName: moonSign.name,
    lang
  });

  const marriagePrediction = calculateMarriagePrediction({
    name,
    dob,
    lagnaSign: ascSign.name,
    rashiSign: moonSign.name,
    lang
  });

  const careerPrediction = calculateCareerPrediction({
    name,
    dob,
    lagnaSign: ascSign.name,
    rashiSign: moonSign.name,
    lang
  });

  return {
    lagna: `${ascSign.name} (${ascSign.sanskrit}) ${ascDeg.toFixed(1)}°`,
    lagnaSign: ascSign.name,
    rashi: `${moonSign.name} (${moonSign.sanskrit})`,
    rashiSign: moonSign.name,
    nakshatra: `${moonNak.name} (Pada ${moonNak.pada})`,
    tithi: isHi ? tithiHi : tithiEn,
    yoga: yogaName,
    yogas: isHi ? detectedYogasHi.join("\n\n") : detectedYogas.join("\n\n"),
    dasha: dashaSchedule.join("\n"),
    overview: overviewText,
    pa: planetaryAnalysisText,
    ha: houseAnalysisText,
    health: healthText,
    wealth: wealthText,
    education: educationText,
    career: careerText,
    marriage: marriageText,
    pred: decadePredictionsText,
    colours: isHi ? luckyColorsHi : luckyColors,
    numbers: luckyNumbers,
    days: isHi ? auspiciousDaysHi : auspiciousDays,
    rudraksha: isHi ? `${ascSign.name === "Leo" ? "12 मुखी / 1 मुखी" : "5 मुखी / 7 मुखी"} रुद्राक्ष` : "5-Mukhi / 7-Mukhi Rudraksha",
    gems: remediesGemsText,
    gemObj: luckyInfo,
    longevity: longevityText,
    verdict: verdictText,
    houses,
    planetData,
    annualTransit,
    marriagePrediction,
    careerPrediction
  };
}

/* -------------------------------------------------------------
   MARRIAGE AGE, TIMING & SPOUSE PREDICTION ENGINE
------------------------------------------------------------- */
export function calculateMarriagePrediction({ name, dob, lagnaSign = "Aries", rashiSign = "Aries", lang = "en" }) {
  const isHi = lang === "hi";
  const birthDate = new Date(dob || "1998-01-01");
  const birthYear = isNaN(birthDate.getFullYear()) ? 1998 : birthDate.getFullYear();
  const currentYear = new Date().getFullYear();
  const age = Math.max(18, currentYear - birthYear);

  const lagnaIndex = Math.max(0, SIGNS.findIndex(s => s.name.toLowerCase() === lagnaSign.toLowerCase()));
  const rashiIndex = Math.max(0, SIGNS.findIndex(s => s.name.toLowerCase() === rashiSign.toLowerCase()));
  
  // 7th House from Lagna
  const seventhHouseIndex = (lagnaIndex + 6) % 12;
  const seventhSign = SIGNS[seventhHouseIndex];
  const seventhLord = seventhSign.lord;

  // Base marriage age window derived deterministically
  const seed = (birthYear * 7 + (birthDate.getMonth() + 1) * 13 + lagnaIndex * 19 + rashiIndex * 23) % 100;
  
  let baseMinAge = 24 + (seed % 4); // 24, 25, 26, 27
  let baseMaxAge = baseMinAge + 2.5 + (seed % 2); // e.g. 26.5 to 29.5
  
  // If lagna or 7th lord is Saturn / Rahu influenced, add maturity years
  if (seventhLord === "Saturn" || seventhSign.name === "Capricorn" || seventhSign.name === "Aquarius") {
    baseMinAge += 2;
    baseMaxAge += 2;
  }

  const ageRange = `${baseMinAge} – ${Math.round(baseMaxAge)} ${isHi ? "वर्ष" : "Years"}`;

  // Timing phase status
  let timingPhaseEn = "High Auspicious Vivah Yog Active";
  let timingPhaseHi = "प्रबल विवाह योग सक्रिय (शुभ काल)";
  if (age < baseMinAge - 1) {
    timingPhaseEn = "Formative & Career Consolidation Phase";
    timingPhaseHi = "शिक्षा व करियर सुदृढ़ीकरण काल";
  } else if (age > baseMaxAge + 1) {
    timingPhaseEn = "Karmic Dharma & Mature Vivah Window";
    timingPhaseHi = "परिपक्व विवाह योग एवं आध्यात्मिक काल";
  }

  // Auspicious Years Window
  const startYear = Math.max(currentYear, birthYear + baseMinAge);
  const endYear = startYear + 2;
  const primaryWindow = isHi 
    ? `${startYear} के उत्तरार्ध से ${endYear} के मध्य तक` 
    : `Late ${startYear} – Mid ${endYear}`;
  
  const secondaryWindow = isHi 
    ? `${endYear + 1} – ${endYear + 2}` 
    : `Early ${endYear + 1} – Late ${endYear + 2}`;

  const favorableMonthsEn = ["November", "December", "January", "February", "April", "May"];
  const favorableMonthsHi = ["नवंबर", "दिसंबर", "जनवरी", "फरवरी", "अप्रैल", "मई"];
  const peakMonths = isHi 
    ? [favorableMonthsHi[seed % 6], favorableMonthsHi[(seed + 2) % 6], favorableMonthsHi[(seed + 4) % 6]].join(", ")
    : [favorableMonthsEn[seed % 6], favorableMonthsEn[(seed + 2) % 6], favorableMonthsEn[(seed + 4) % 6]].join(", ");

  // Spouse Direction
  const directions = [
    { en: "North / North-East", hi: "उत्तर / ईशान कोण (North-East)" },
    { en: "East / North-East", hi: "पूर्व / ईशान कोण (East/North-East)" },
    { en: "South / South-West", hi: "दक्षिण / नैऋत्य कोण (South/South-West)" },
    { en: "West / North-West", hi: "पश्चिम / वायव्य कोण (West/North-West)" }
  ];
  const spouseDirection = isHi ? directions[seventhHouseIndex % 4].hi : directions[seventhHouseIndex % 4].en;

  // Spouse Career Field
  const professionsEn = [
    "Technology, Software Engineering, IT & Digital Architecture",
    "Banking, Financial Strategy, Corporate Consulting & Analytics",
    "Civil Administration, Governance, Law & Public Policy",
    "Healthcare, Medical Research, Pharmaceuticals & Biotech",
    "Architecture, Luxury Design, Media & Creative Entrepreneurship",
    "Higher Academia, Scientific Research & Global Consulting"
  ];
  const professionsHi = [
    "प्रौद्योगिकी, सॉफ्टवेयर इंजीनियरिंग, आईटी एवं डेटा साइंस",
    "बैंकिंग, वित्तीय परामर्श, कॉर्पोरेट प्रबंधन व विश्लेषण",
    "प्रशासनिक सेवा, विधि (Law), नीति निर्माण व उच्च प्रबंधन",
    "चिकित्सा (Medicine), स्वास्थ्य सेवा, फार्मास्युटिकल व शोध",
    "वास्तुकला (Architecture), डिजाइन, मीडिया व स्वतंत्र व्यवसाय",
    "उच्च शिक्षा, वैज्ञानिक अनुसंधान व वैश्विक कंसल्टिंग"
  ];
  const spouseProfession = isHi ? professionsHi[seventhHouseIndex % 6] : professionsEn[seventhHouseIndex % 6];

  // Spouse Personality Traits
  const traitsEn = [
    "Intellectually refined, graceful in demeanor, values harmony, strong aesthetic appreciation, and deeply family-oriented.",
    "Driven and pragmatic, sharp leadership instincts, steadfast loyalty, and offers high emotional stability in partnerships.",
    "Warm-hearted, compassionate, deeply spiritual and ethical, with a keen sense of humor and supportive communication.",
    "Highly ambitious, analytical problem-solver, elegant communicator, with a dignified presence in social circles."
  ];
  const traitsHi = [
    "बौद्धिक रूप से प्रखर, शालीन व गरिमामयी व्यक्तित्व, सौंदर्य व कलाप्रिय, पारिवारिक मूल्यों के प्रति अत्यंत समर्पित।",
    "दृढ़ संकल्पी, व्यवहारकुशल, नेतृत्व क्षमता से युक्त, निष्ठावान और कठिन परिस्थितियों में संबल देने वाले।",
    "सहानुभूतिपूर्ण, आध्यात्मिक व नीतिनिष्ठ, मिलनसार स्वभाव और खुले संवाद को प्राथमिकता देने वाले जीवनसाथी।",
    "महत्वाकांक्षी, तार्किक चिंतन, समाज में प्रतिष्ठित और एक दूसरे के आत्म-सम्मान का आदर करने वाले।"
  ];
  const spousePersonality = isHi ? traitsHi[seed % 4] : traitsEn[seed % 4];

  // Name Initials
  const nameLetterSets = ["A, S, R, K", "M, P, V, N", "D, T, B, H", "J, G, L, S", "Y, C, K, A"];
  const nameLetterSetsHi = ["अ, स, र, क", "म, प, व, न", "द, त, ब, ह", "ज, ग, ल, श", "य, च, क, आ"];
  const spouseNameLetters = isHi ? nameLetterSetsHi[seed % 5] : nameLetterSets[seed % 5];

  // Obstacle/Dosha Assessment
  const obstacleEn = (seventhLord === "Saturn" || seed % 3 === 0)
    ? "Minor Saturnian/Karmic delay pattern. Marriage yields profound long-term stability when solemnized after age 25. Regular Gauri-Shankar worship dissolves all hurdles."
    : "Unobstructed smooth Vivah Yog. Planetary alignments favor peaceful matrimonial negotiation without prolonged delays.";
  const obstacleHi = (seventhLord === "Saturn" || seed % 3 === 0)
    ? "शनि अथवा कर्म भाव के प्रभाव से विवाह में कुछ विलंब या विचार-विमर्श में समय लग सकता है। २५ वर्ष के उपरांत विवाह अत्यंत शुभ व स्थायी रहता है। गौरी-शंकर उपासना से सभी अवरोध समाप्त होते हैं।"
    : "कुंडली में निर्बाध शुभ विवाह योग है। ग्रहों की स्थिति अनुकूल है और वैवाहिक वार्ता शीघ्रता से सकारात्मक परिणाम देगी।";

  // Prescribed Vivah Remedies
  const remedyEn = `• Sacred Recitation: Chant the Swayamvara Parvati Mantra or "Om Namah Shivaya" 108 times on Mondays.\n• Jupiter Blessing: Offer water to a Peepal or Banana tree on Thursdays and donate yellow lentils (Chana Dal).\n• Gauri-Shankar Harmony: Fast or perform peaceful Shiva-Parvati puja on Pradosh Vrat for an auspicious life partner.`;
  const remedyHi = `• मंत्र जप: नित्य प्रातः "ॐ गौरीशंकराय नमः" अथवा स्वयंवर पार्वती मंत्र का १०८ बार जप करें।\n• गुरु ग्रह का आशीर्वाद: गुरुवार को केले अथवा पीपल के वृक्ष में जल अर्पित करें और चने की दाल या पीली वस्तुओं का दान करें।\n• शिव-पार्वती आराधना: प्रदोष काल में शिवलिंग पर कच्चा दूध व बेलपत्र अर्पित करें, शीघ्र व सुयोग्य जीवनसाथी का योग बनेगा।`;

  return {
    ageRange,
    timingPhase: isHi ? timingPhaseHi : timingPhaseEn,
    probabilityScore: Math.min(96, 82 + (seed % 14)),
    primaryWindow,
    secondaryWindow,
    peakMonths,
    seventhSign: `${seventhSign.name} (${seventhSign.sanskrit})`,
    seventhLord,
    spouseDirection,
    spouseProfession,
    spousePersonality,
    spouseNameLetters,
    obstacleAnalysis: isHi ? obstacleHi : obstacleEn,
    remedies: isHi ? remedyHi : remedyEn
  };
}

/* -------------------------------------------------------------
   DAILY HOROSCOPE ENGINE (TRANSIT-BASED PREDICTIONS & REMEDIES)
------------------------------------------------------------- */
export function generateDailyHoroscope(signName = "Aries", lang = "en") {
  const isHi = lang === "hi";
  const now = new Date();
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const daysOfWeekHi = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];
  const dayIndex = now.getDay();
  const dayName = isHi ? daysOfWeekHi[dayIndex] : daysOfWeek[dayIndex];
  
  const signIndex = Math.max(0, SIGNS.findIndex(s => s.name.toLowerCase() === signName.toLowerCase()));
  const signObj = SIGNS[signIndex] || SIGNS[0];

  // Deterministic seed based on day, month, year, and sign
  const dateSeed = (now.getDate() * 13 + (now.getMonth() + 1) * 29 + now.getFullYear() * 7 + signIndex * 17) % 100;
  
  const careerScore = 3 + (dateSeed % 3);
  const loveScore = 3 + ((dateSeed + 2) % 3);
  const wealthScore = 3 + ((dateSeed + 4) % 3);
  const healthScore = 3 + ((dateSeed + 1) % 3);
  const overallScore = Math.min(95, Math.max(68, 70 + (dateSeed % 26)));

  const luckyColors = ["Saffron Gold", "Emerald Green", "Royal Crimson", "Pearl White", "Sunflower Yellow", "Electric Blue", "Copper Bronze"];
  const luckyColorsHi = ["केसरिया सुनहरा", "पन्ना हरा", "गहरा लाल", "मोती जैसा सफेद", "पीला", "रॉयल नीला", "ताम्र वर्ण"];
  const luckyColor = isHi ? luckyColorsHi[dateSeed % 7] : luckyColors[dateSeed % 7];
  const luckyNumber = ((dateSeed % 9) + 1);

  const muhuratWindows = [
    "10:30 AM – 12:00 PM (Abhijit)",
    "02:15 PM – 03:45 PM (Amrit Kaal)",
    "08:30 AM – 10:00 AM (Shubh)",
    "04:00 PM – 05:30 PM (Labh)"
  ];
  const auspiciousWindow = muhuratWindows[dateSeed % 4];

  // Predictions database tailored to Zodiac Sign elements & Day
  const dailyInsights = {
    Aries: {
      goodEn: "Dynamic burst of productivity in workplace tasks. A pending communication or client approval swings in your favor. Confidence remains at an all-time high.",
      goodHi: "कार्यक्षेत्र में ऊर्जा और पराक्रम का संचार होगा। रुका हुआ सरकारी अथवा व्यापारिक कार्य गति पकड़ेगा। नए संपर्क लाभदायक सिद्ध होंगे।",
      cautionEn: "Avoid impulsive financial spending or rushing into aggressive debates with peers. Double-check contractual paperwork before signing.",
      cautionHi: "जल्दबाजी में धन निवेश या विवाद से बचें। किसी के उकसावे में आकर कटु शब्दों का प्रयोग न करें। वाहन चलाते समय सतर्क रहें।",
      remedyEn: "Chant the Hanuman Gayatri or 'Om Hanumate Namah' 11 times. Offer water to a Tulsi plant.",
      remedyHi: "हनुमान चालीसा का पाठ करें और 'ॐ हनुमते नमः' का ११ बार जप करें। सूर्य देव को तांबे के पात्र से जल अर्पित करें।"
    },
    Taurus: {
      goodEn: "Financial clarity and family harmony blossom. Strong prospects for gains through creative ventures, luxury goods, or property discussions.",
      goodHi: "आर्थिक मामलों में अनुकूलता रहेगी। परिवार में सौहार्द और सुखद वातावरण रहेगा। सौंदर्य, आभूषण या कला क्षेत्र से जुड़े लोगों को विशेष लाभ होगा।",
      cautionEn: "Watch your dietary habits; avoid excessively rich or sugary foods. Do not lend unsecured money to casual acquaintances today.",
      cautionHi: "खान-पान में संयम रखें और गरिष्ठ भोजन से बचें। किसी को भी बिना लिखा-पढ़ी के उधार देने से परहेज करें।",
      remedyEn: "Recite 'Om Shukraya Namah' 11 times. Offer white flowers or sweet curd in your morning prayers.",
      remedyHi: "'ॐ शुं शुक्राय नमः' मंत्र का ११ बार जप करें और प्रातः मिश्री या मीठे दही का भोग लगाएं।"
    },
    Gemini: {
      goodEn: "Exceptional analytical and communication prowess today. Great day for negotiations, interviews, digital marketing, and intellectual networking.",
      goodHi: "बुद्धि और संवाद कौशल से कार्य सफल होंगे। व्यापारिक वार्ता, साक्षात्कार एवं मीडिया से जुड़े कार्यों में अप्रत्याशित सफलता मिलेगी।",
      cautionEn: "Avoid overthinking and scattershot multitasking. Ensure you take adequate screen breaks to prevent mental fatigue.",
      cautionHi: "एक साथ कई कार्यों में हाथ डालने से मानसिक तनाव हो सकता है। किसी भी दस्तावेज को बिना पढ़े हस्ताक्षर न करें।",
      remedyEn: "Feed green grass or spinach to a cow, or chant 'Om Budhaya Namah' 11 times.",
      remedyHi: "गाय को हरी घास या पालक खिलाएं और 'ॐ बुं बुधाय नमः' का ११ बार जप करें।"
    },
    Cancer: {
      goodEn: "Intuitive decision-making and warm emotional connections with loved ones. Opportunities for peaceful domestic improvements and spiritual calm.",
      goodHi: "पारिवारिक सुख एवं मानसिक शांति में वृद्धि होगी। माताजी का आशीर्वाद मिलेगा और अटके हुए घरेलू कार्य सुगमता से संपन्न होंगे।",
      cautionEn: "Guard against sudden mood swings or taking professional feedback too personally. Keep stress-related expenses in check.",
      cautionHi: "भावुकता में आकर कोई बड़ा आर्थिक फैसला न लें। अनावश्यक चिंताओं से बचें और भरपूर नींद लें।",
      remedyEn: "Offer raw milk or clean water to a Shiva Lingam while reciting 'Om Namah Shivaya'.",
      remedyHi: "शिवलिंग पर कच्चा दूध अथवा शुद्ध जल अर्पित करें और 'ॐ नमः शिवाय' का जप करें।"
    },
    Leo: {
      goodEn: "Leadership aura and recognition from superiors. Your authority and strategic planning bring decisive breakthroughs in major projects.",
      goodHi: "मान-सम्मान और सामाजिक प्रतिष्ठा में वृद्धि होगी। अधिकारियों एवं वरिष्ठों का पूरा सहयोग मिलेगा। नेतृत्व क्षमता चमकेगी।",
      cautionEn: "Keep ego in check during team collaborations. Avoid delegating critical financial details without verification.",
      cautionHi: "अहंकार और क्रोध से बचें। सहकर्मियों के साथ तालमेल बनाए रखें और कागजी काम में लापरवाही न बरतें।",
      remedyEn: "Recite the Aditya Hridaya Stotra or chant 'Om Suryaya Namah' facing east at sunrise.",
      remedyHi: "प्रातः सूर्य देव को जल में रोली मिलाकर अर्घ्य दें और 'ॐ सूर्याय नमः' का जप करें।"
    },
    Virgo: {
      goodEn: "Precision, problem-solving, and professional diligence shine. Favorable transit for debt clearance, career optimization, and health regimens.",
      goodHi: "कार्यकुशलता और योजनाबद्ध परिश्रम से लक्ष्य प्राप्त होंगे। ऋण व खर्चों पर नियंत्रण पाने में सफलता मिलेगी।",
      cautionEn: "Avoid being overly critical of family members. Guard against perfectionist paralysis by pacing your milestones.",
      cautionHi: "दूसरों की छोटी गलतियों पर अधिक प्रतिक्रिया न दें। अत्यधिक काम से पाचन तंत्र पर असर पड़ सकता है, सादा भोजन करें।",
      remedyEn: "Water a Tulsi plant and chant 'Om Gan Ganapataye Namah' 11 times for obstacle removal.",
      remedyHi: "भगवान श्री गणेश को दूर्वा अर्पित करें और 'ॐ गं गणपतये नमः' का जप करें।"
    },
    Libra: {
      goodEn: "Diplomatic charm and commercial partnership harmony. Lucrative business proposals or collaborative breakthroughs appear on the horizon.",
      goodHi: "साझेदारी और वैवाहिक जीवन में मधुरता आएगी। कला, फैशन और डिजाइन से जुड़े कार्यों में विशेष धन लाभ के योग हैं।",
      cautionEn: "Do not delay important commitments due to indecisiveness. Avoid speculative trading in unfamiliar instruments.",
      cautionHi: "अनिर्णय की स्थिति से बचें और समय पर फैसले लें। शेयर बाजार या सट्टेबाजी में बिना सोचे-समझे धन न लगाएं।",
      remedyEn: "Light a fragrant incense or ghee lamp in your puja corner. Chant 'Om Mahalakshmyai Namah'.",
      remedyHi: "माता महालक्ष्मी की आरती करें और 'ॐ श्रीं ह्रीं क्लीं महालक्ष्म्यै नमः' का ११ बार जप करें।"
    },
    Scorpio: {
      goodEn: "Deep investigative focus and breakthroughs in research, occult, or technical problem-solving. Strong financial recovery from unexpected channels.",
      goodHi: "गूढ़ विद्या, अनुसंधान और तकनीकी कार्यों में बड़ी सफलता मिलेगी। पुराना रुका हुआ धन वापस मिलने के प्रबल संकेत हैं।",
      cautionEn: "Refrain from keeping secrets or brooding over past grievances. Guard against minor physical bumps or cuts.",
      cautionHi: "पुरानी बातों को लेकर मन में कटुता न पालें। वाहन की गति पर नियंत्रण रखें और विवादों से दूर रहें।",
      remedyEn: "Chant 'Om Bhaumaya Namah' or recite the Hanuman Chalisa. Distribute jaggery or gram to the needy.",
      remedyHi: "हनुमान जी के मंदिर में सिंदूर या चमेली का तेल अर्पित करें और गुड़-चने का दान करें।"
    },
    Sagittarius: {
      goodEn: "Expansion of spiritual wisdom, higher learning, and joyful long-term planning. Mentorship and auspicious guidance guide your endeavors.",
      goodHi: "भाग्य का पूरा साथ मिलेगा। धर्म, ज्ञान और उच्च शिक्षा के क्षेत्र में उत्कृष्ट परिणाम मिलेंगे। गुरुजनों का आशीर्वाद प्राप्त होगा।",
      cautionEn: "Do not over-commit your bandwidth or over-promise timelines. Avoid uncalculated travel disruptions.",
      cautionHi: "अपनी क्षमता से अधिक वादे न करें। यात्रा करते समय सामान और समय का विशेष ध्यान रखें।",
      remedyEn: "Apply a subtle saffron or turmeric tilak on your forehead. Chant 'Om Brihaspataye Namah'.",
      remedyHi: "माथे पर केसर या हल्दी का तिलक लगाएं और 'ॐ बृं बृहस्पतये नमः' का ११ बार जप करें।"
    },
    Capricorn: {
      goodEn: "Steadfast discipline and long-term career consolidation. Your meticulous effort earns deep credibility and executive goodwill.",
      goodHi: "कड़ी मेहनत और अनुशासन का पूरा प्रतिफल मिलेगा। कार्यक्षेत्र में आपकी प्रतिष्ठा और प्रभाव में उल्लेखनीय वृद्धि होगी।",
      cautionEn: "Avoid letting workaholic routines compromise your rest. Refrain from cold, aloof communication with family members.",
      cautionHi: "काम के दबाव में स्वास्थ्य की अनदेखी न करें। जोड़ों के दर्द या थकावट से बचने के लिए पर्याप्त आराम करें।",
      remedyEn: "Light a mustard oil lamp under a Peepal tree in the evening or chant 'Om Sham Shanaishcharaya Namah'.",
      remedyHi: "संध्याकाल में शनि देव के नाम से सरसों के तेल का दीपक जलाएं और 'ॐ शं शनैश्चराय नमः' का जप करें।"
    },
    Aquarius: {
      goodEn: "Visionary innovative ideas and support from extensive social networks. Favorable for group projects, tech initiatives, and humanitarian causes.",
      goodHi: "मित्रों और सामाजिक संपर्कों से बड़ा लाभ होगा। नई तकनीकों और सामूहिक योजनाओं में आशातीत प्रगति होगी।",
      cautionEn: "Keep personal finances separate from group initiatives. Avoid excessive screen time late at night.",
      cautionHi: "दोस्तों के साथ लेन-देन में स्पष्टता रखें। अनिद्रा और आंखों के तनाव से बचने के लिए समय पर सोएं।",
      remedyEn: "Feed black birds or offer bread to stray dogs. Chant 'Om Pram Preem Prom Sah Shanaishcharaya Namah'.",
      remedyHi: "काले कौवों या श्वानों को रोटी खिलाएं और जरूरतमंदों की सहायता करें।"
    },
    Pisces: {
      goodEn: "Spiritual transcendence, empathy, and artistic inspiration flow effortlessly. Favorable transit for international connections and philanthropic goodwill.",
      goodHi: "आध्यात्मिक ऊर्जा और रचनात्मक प्रेरणा का विकास होगा। विदेश अथवा दूरस्थ स्थानों से शुभ समाचार प्राप्त होंगे।",
      cautionEn: "Stay anchored in practical reality; avoid rose-colored assumptions in monetary contracts.",
      cautionHi: "काल्पनिक दुनिया में रहने से बचें और व्यावहारिक दृष्टिकोण अपनाएं। व्यर्थ के खर्चों पर लगाम लगाएं।",
      remedyEn: "Chant 'Om Gurave Namah' and offer yellow grains or gram pulse in charity.",
      remedyHi: "भगवान श्री विष्णु की आराधना करें और पीले फल अथवा चने की दाल का दान करें।"
    }
  };

  const insight = dailyInsights[signObj.name] || dailyInsights.Aries;

  return {
    sign: signObj.name,
    signSanskrit: signObj.sanskrit,
    symbol: signObj.symbol,
    dateStr: now.toLocaleDateString(isHi ? "hi-IN" : "en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
    dayName,
    overallScore,
    careerScore,
    loveScore,
    wealthScore,
    healthScore,
    good: isHi ? insight.goodHi : insight.goodEn,
    caution: isHi ? insight.cautionHi : insight.cautionEn,
    remedy: isHi ? insight.remedyHi : insight.remedyEn,
    luckyColor,
    luckyNumber,
    auspiciousWindow
  };
}

/* -------------------------------------------------------------
   CAREER, JOB & BUSINESS PREDICTION ENGINE (PARASHARI & D10)
------------------------------------------------------------- */
export function calculateCareerPrediction({ name, dob, lagnaSign = "Aries", rashiSign = "Aries", lang = "en" }) {
  const isHi = lang === "hi";
  const birthDate = new Date(dob || "1998-01-01");
  const birthYear = isNaN(birthDate.getFullYear()) ? 1998 : birthDate.getFullYear();
  const currentYear = new Date().getFullYear();

  const lagnaIndex = Math.max(0, SIGNS.findIndex(s => s.name.toLowerCase() === lagnaSign.toLowerCase()));
  const rashiIndex = Math.max(0, SIGNS.findIndex(s => s.name.toLowerCase() === rashiSign.toLowerCase()));

  // 10th House (Karma Sthana) & 6th/11th House dynamics
  const tenthHouseIndex = (lagnaIndex + 9) % 12;
  const tenthSign = SIGNS[tenthHouseIndex];
  const tenthLord = tenthSign.lord;

  // Deterministic seed
  const seed = (birthYear * 11 + (birthDate.getMonth() + 1) * 17 + lagnaIndex * 23 + rashiIndex * 29) % 100;

  // Archetypes based on 10th sign & lord
  const archetypes = [
    {
      titleEn: "Strategic Executive & Technology Architect",
      titleHi: "रणनीतिक प्रबंधन, आईटी व तकनीकी नेतृत्व",
      sectorsEn: ["Cloud Architecture, AI & Systems Engineering", "Corporate Strategy & Digital Product Leadership", "FinTech & Data-Driven Operations"],
      sectorsHi: ["क्लाउड आर्किटेक्चर, एआई व सॉफ्टवेयर इंजीनियरिंग", "कॉर्पोरेट रणनीति एवं डिजिटल उत्पाद प्रबंधन", "फिनटेक, एनालिटिक्स व डेटा ऑपरेशंस"]
    },
    {
      titleEn: "Financial Strategist, Wealth & Advisory Leader",
      titleHi: "वित्तीय विश्लेषक, बैंकिंग व रणनीतिक सलाहकार",
      sectorsEn: ["Investment Banking & Equity Research", "Chartered Financial Consulting & Audit", "Fintech Ventures & Corporate Governance"],
      sectorsHi: ["इन्वेस्टमेंट बैंकिंग एवं इक्विटी रिसर्च", "वित्तीय ऑडिट, सीए व कॉर्पोरेट गवर्नेंस", "व्यापारिक वित्त प्रबंधन व वेल्थ कंसल्टिंग"]
    },
    {
      titleEn: "Public Policy, Civil Governance & Administrative Authority",
      titleHi: "प्रशासनिक सेवा, राजपत्रित पद व जननीति प्रबंधन",
      sectorsEn: ["UPSC / State PSC Civil & Administrative Cadres", "Judiciary, Corporate Law & Compliance", "Public Sector Enterprises (PSU) & Defense Engineering"],
      sectorsHi: ["सिविल सेवा (IAS/IPS/State PSC) व प्रशासनिक संवर्ग", "न्यायिक सेवा, कॉर्पोरेट विधि (Law) व अनुपालन", "सार्वजनिक क्षेत्र (PSU), रेलवे व रक्षा प्रबंधन"]
    },
    {
      titleEn: "Global Entrepreneur, Commerce & Brand Pioneer",
      titleHi: "वैश्विक उद्यमी, व्यापारिक नेतृत्व व ई-कॉमर्स",
      sectorsEn: ["Global Trade, E-Commerce & Supply Chains", "Industrial Manufacturing & Real Estate Ventures", "Direct-to-Consumer & Scalable Consumer Brands"],
      sectorsHi: ["अंतरराष्ट्रीय व्यापार, ई-कॉमर्स व लॉजिस्टिक्स", "औद्योगिक विनिर्माण, रियल एस्टेट व इंफ्रास्ट्रक्चर", "स्वतंत्र व्यवसाय, फ्रेंचाइजी व स्टार्टअप्स"]
    },
    {
      titleEn: "Medical, Healthcare & Scientific Innovation Leader",
      titleHi: "चिकित्सा, स्वास्थ्य सेवा, शोध व जैव-प्रौद्योगिकी",
      sectorsEn: ["Specialized Clinical Medicine & Surgery", "Pharmaceutical Research & Biotechnology", "HealthTech Platforms & Hospital Administration"],
      sectorsHi: ["विशिष्ट चिकित्सा (Medicine), शल्यक्रिया व क्लीनिकल रिसर्च", "फार्मास्युटिकल व जैव-प्रौद्योगिकी अनुसंधान", "हेल्थटेक, डायग्नोस्टिक्स व अस्पताल प्रबंधन"]
    },
    {
      titleEn: "Creative Director, Media & Digital Influence Pioneer",
      titleHi: "क्रिएटिव डायरेक्टर, मीडिया, डिजाइन व स्वतंत्र विचारक",
      sectorsEn: ["Visual Media, Film Direction & Content Ecosystems", "Architecture, Urban Aesthetics & Luxury Design", "High-Reach Digital Media & Brand Marketing"],
      sectorsHi: ["सिनेमा, विजुअल मीडिया, एनिमेशन व डिजिटल कंटेंट", "आर्किटेक्चर, इंटीरियर व लग्जरी लाइफस्टाइल डिजाइन", "ब्रांड स्ट्रैटेजी, एडवरटाइजिंग व मास कम्युनिकेशन"]
    }
  ];

  const selectedArch = archetypes[tenthHouseIndex % archetypes.length];

  // Suitability percentage scores
  const govtScore = Math.min(95, Math.max(62, 70 + ((seed * 3) % 26)));
  const corporateScore = Math.min(96, Math.max(68, 76 + ((seed * 7) % 21)));
  const businessScore = Math.min(94, Math.max(64, 72 + ((seed * 5) % 23)));
  const creativeScore = Math.min(95, Math.max(65, 74 + ((seed * 9) % 22)));

  // Growth & Promotion Windows
  const startPromYr = currentYear;
  const endPromYr = currentYear + 1;
  const appraisalWindow = isHi
    ? `${startPromYr} की अंतिम तिमाही से ${endPromYr} के मध्य तक (अत्यंत फलदायी काल)`
    : `Q4 ${startPromYr} – Mid ${endPromYr} (High Velocity Promotion Yog)`;

  const jobChangeWindow = isHi
    ? `${endPromYr} के पूर्वार्ध में (वेतन वृद्धि एवं पद परिवर्तन)`
    : `Early–Mid ${endPromYr} (Favorable for lucrative package & senior designation)`;

  const expansionWindow = isHi
    ? `${endPromYr + 1} – ${endPromYr + 2} (स्वतंत्र व्यापार व वैश्विक विस्तार)`
    : `${endPromYr + 1} – ${endPromYr + 2} (Ideal for business launch & global equity)`;

  // Workplace obstacle diagnosis
  const obstacleEn = tenthLord === "Saturn" || seed % 3 === 0
    ? "Saturnian karmic test: Work achievements may be recognized after slight delays, or office politics might test your patience. Cultivating disciplined documentation and emotional neutrality will turn adversaries into stepping stones."
    : "Solar-Mercurial velocity: Quick recognition from superiors, but guard against burnout and impatience during hierarchical reorganizations. Focus on strategic high-visibility deliverables.";
  
  const obstacleHi = tenthLord === "Saturn" || seed % 3 === 0
    ? "शनि के कर्म प्रभाव के कारण परिश्रम का फल थोड़ा धैर्य रखने पर मिलता है। सहकर्मियों की ईर्ष्या या कार्यालयी राजनीति से विचलित न हों। निष्ठापूर्वक अपने दायित्व निभाएं, उच्च पद व सम्मान सुनिश्चित है।"
    : "सूर्य-बुध के शुभ प्रभाव से अधिकारियों से शीघ्र प्रशंसा मिलेगी। काम के अति-दबाव से बचें और महत्वपूर्ण व्यावसायिक योजनाओं को गोपनीय रखकर क्रियान्वित करें।";

  // Actionable remedies for Career Elevation
  const careerRemediesEn = [
    "• Surya Arghya & Gayatri Power: Offer clean water in a copper vessel facing East within 1 hour of sunrise. Chant 'Om Suryaya Namah' 12 times to activate leadership charisma.",
    "• Workspace Vastu: Position your primary work desk facing North or East. Keep a clean crystal pyramid or brass Kuber Yantra on the north-east corner of your desk.",
    "• Thursday Jupiter Boost: Chant 'Om Gram Greem Grom Sah Gurave Namah' 108 times on Thursdays for career mentorship, appraisals, and ethical success.",
    "• Saturday Shani Alignment: Light a mustard oil lamp near a Peepal tree or feed black sesame sweets to stray dogs on Saturdays to neutralize workplace obstacles."
  ];

  const careerRemediesHi = [
    "• सूर्य उपासना व अर्घ्य: नित्य प्रातः सूर्योदय के समय तांबे के लोटे से जल में रोली व अक्षत मिलाकर सूर्य देव को अर्घ्य दें। 'ॐ सूर्याय नमः' का जप तेज व नेतृत्व क्षमता बढ़ाता है।",
    "• कार्यस्थल वास्तु शुद्धि: काम करते समय मुख उत्तर अथवा पूर्व दिशा में रखें। अपने कार्यक्षेत्र (डेस्क) के ईशान कोण (North-East) को हमेशा स्वच्छ व प्रकाशित रखें।",
    "• गुरु ग्रह संवर्धन: गुरुवार को 'ॐ ग्रां ग्रीं ग्रौं सः गुरुवे नमः' का १०८ बार जप करें। पदोन्नति एवं वरिष्ठों से अनुकूलता के लिए पीली वस्तुओं का दान करें।",
    "• शनि देव शांति: शनिवार की शाम पीपल के वृक्ष के पास सरसों के तेल का दीपक जलाएं और जरूरतमंदों की सेवा करें, कार्यक्षेत्र के गुप्त अवरोध समाप्त होंगे।"
  ];

  return {
    tenthSign: `${tenthSign.name} (${tenthSign.sanskrit})`,
    tenthLord,
    archetypeTitle: isHi ? selectedArch.titleHi : selectedArch.titleEn,
    primarySectors: isHi ? selectedArch.sectorsHi : selectedArch.sectorsEn,
    scores: {
      govt: govtScore,
      corporate: corporateScore,
      business: businessScore,
      creative: creativeScore,
      dominantPath: corporateScore >= govtScore && corporateScore >= businessScore 
        ? (isHi ? "कॉर्पोरेट व तकनीकी नेतृत्व (Corporate Leadership)" : "Corporate Executive & Tech Leadership")
        : govtScore >= businessScore 
        ? (isHi ? "राजकीय सेवा व प्रशासनिक अधिकार (Govt & Public Admin)" : "Government & Administrative Authority")
        : (isHi ? "स्वतंत्र व्यापार व वैश्विक उद्यम (Business & Entrepreneurship)" : "Independent Business & Entrepreneurship")
    },
    appraisalWindow,
    jobChangeWindow,
    expansionWindow,
    obstacleAnalysis: isHi ? obstacleHi : obstacleEn,
    remedies: isHi ? careerRemediesHi : careerRemediesEn,
    dailyCareerMantra: isHi
      ? "ॐ ह्रीं सूर्याय नमः (नित्य प्रातः १०८ बार)"
      : "Om Hreem Suryaya Namah (108 times at sunrise)"
  };
}

/* -------------------------------------------------------------
   DAILY LIFE PROBLEM SOLVER & VEDIC REMEDY DATABASE
------------------------------------------------------------- */
export const LIFE_PROBLEMS_LIST = [
  {
    id: "career_job",
    icon: "💼",
    labelEn: "Career Stagnation, Appraisal Delay & Workplace Politics",
    labelHi: "करियर अवरोध, पदोन्नति में विलंब व ऑफिस की राजनीति",
    shortEn: "Career & Job Stagnation",
    shortHi: "नौकरी व करियर समस्या"
  },
  {
    id: "money_debt",
    icon: "💰",
    labelEn: "Financial Instability, Stuck Money & Debt/Loan Pressure",
    labelHi: "धन हानि, अटका हुआ पैसा व कर्ज से मुक्ति",
    shortEn: "Money & Debt Relief",
    shortHi: "धन व कर्ज मुक्ति"
  },
  {
    id: "mental_stress",
    icon: "🧠",
    labelEn: "Anxiety, Overthinking, Insomnia & Rahu-Moon Afflictions",
    labelHi: "मानसिक अशांति, अनिद्रा, तनाव व राहु-चंद्र दोष",
    shortEn: "Stress & Anxiety Relief",
    shortHi: "तनाव व मानसिक शांति"
  },
  {
    id: "relationship_family",
    icon: "💔",
    labelEn: "Marital Discord, Communication Gap & Family Harmony",
    labelHi: "दांपत्य कलह, वैचारिक मतभेद व पारिवारिक अशांति",
    shortEn: "Relationship Harmony",
    shortHi: "दांपत्य व परिवार शांति"
  },
  {
    id: "health_energy",
    icon: "🏥",
    labelEn: "Chronic Fatigue, Low Immunity & Vitality Recovery",
    labelHi: "शारीरिक दुर्बलता, ऊर्जा की कमी व स्वास्थ्य रक्षा",
    shortEn: "Health & Vitality",
    shortHi: "स्वास्थ्य व आरोग्य"
  },
  {
    id: "legal_enemies",
    icon: "⚖️",
    labelEn: "Hidden Enemies, Competition & Legal/Property Disputes",
    labelHi: "गुप्त शत्रु, ईर्ष्या, मुकदमेबाजी व विवाद निवारण",
    shortEn: "Legal & Enemy Protection",
    shortHi: "शत्रु व विवाद निवारण"
  },
  {
    id: "nazar_energy",
    icon: "🧿",
    labelEn: "Evil Eye (Buri Nazar), Home Heaviness & Aura Cleansing",
    labelHi: "बुरी नजर (दोष), घर में भारीपन व नकारात्मक ऊर्जा निवारण",
    shortEn: "Evil Eye & Aura Cleanse",
    shortHi: "नजर दोष व शुद्धि"
  }
];

export function getLifeProblemRemedies({ problemId = "career_job", lagnaSign = "Aries", rashiSign = "Aries", lang = "en" }) {
  const isHi = lang === "hi";

  const problemDatabase = {
    career_job: {
      rootCauseEn: `Affliction of the 10th lord, Saturn's harsh 3rd/7th/10th aspect on the Sun/Karma Bhava, or an active Rahu Antardasha creating illusions and friction with authorities.`,
      rootCauseHi: `दशमेश (कर्म भाव के स्वामी) का कमजोर होना, सूर्य पर राहु अथवा शनि की दृष्टि या कार्यक्षेत्र में षष्ठ भाव (प्रतिस्पर्धा) का सक्रिय होना।`,
      mantra: "ॐ घृणिः सूर्याय नमः (Om Ghrinih Suryaya Namah)",
      mantraCount: "108 times every morning facing East",
      mantraCountHi: "नित्य प्रातः पूर्व दिशा की ओर मुख करके १०८ बार",
      dailyUpayEn: [
        "Offer water mixed with red vermilion (kumkum) and a pinch of sugar to Lord Surya in a copper vessel at sunrise.",
        "Keep a solid brass or copper sun symbol on the eastern wall of your workspace.",
        "Avoid sitting with your back facing the main entry door in your office or study cabin."
      ],
      dailyUpayHi: [
        "प्रातः सूर्योदय के समय तांबे के लोटे में जल, कुमकुम व थोड़े अक्षत डालकर सूर्य देव को अर्घ्य दें।",
        "अपने कार्यस्थल अथवा अध्ययन कक्ष की पूर्वी दीवार पर तांबे का सूर्य यंत्र लगाएं।",
        "ऑफिस में मुख्य प्रवेश द्वार की तरफ पीठ करके बैठने से बचें।"
      ],
      charityEn: "Donate jaggery (gur), wheat grains, or copper utensils to an elderly scholar on Sunday afternoon.",
      charityHi: "रविवार को किसी वृद्ध ब्राह्मण या जरूरतमंद को गेहूं, गुड़ अथवा तांबे के बर्तन का दान करें।",
      gemRudraksha: isHi ? "१ मुखी अथवा १२ मुखी रुद्राक्ष / माणिक्य रत्न (रत्न ज्योतिषी परामर्श अनुसार)" : "1-Mukhi or 12-Mukhi Rudraksha / Natural Ruby",
      vastuTipEn: "Ensure the North-East (Ishanya) corner of your living room or office has zero heavy scrap or footwear.",
      vastuTipHi: "घर अथवा ऑफिस के ईशान कोण (North-East) में कोई भारी कबाड़ या जूते-चप्पल न रखें, इसे सदा स्वच्छ रखें।"
    },
    money_debt: {
      rootCauseEn: `Blockage in the 2nd House (Dhana Bhava) or 11th House (Labha Bhava), afflicted Jupiter/Venus, or 12th House expenditure overload causing wealth leakage.`,
      rootCauseHi: `द्वितीय (धन भाव) अथवा एकादश (लाभ भाव) पर पापक ग्रहों का प्रभाव, गुरु-शुक्र की दुर्बलता अथवा व्यय भाव (१२वें भाव) की अधिकता।`,
      mantra: "ॐ श्रीं ह्रीं क्लीं त्रिभुवन महालक्ष्म्यै अस्मांक दारिद्र्य नाशय प्रचुर धन देहि देहि क्लीं ह्रीं श्रीं ॐ",
      mantraCount: "108 times on Friday evening with cow ghee lamp",
      mantraCountHi: "शुक्रवार की शाम शुद्ध गाय के घी का दीपक जलाकर १०८ बार",
      dailyUpayEn: [
        "Keep a small clean silver square piece or silver coin wrapped in red silk cloth inside your cash locker or wallet.",
        "Feed green fodder or spinach to cows every Wednesday morning.",
        "Never leave open dripping taps or leaky plumbing in the house as it signifies steady financial drain."
      ],
      dailyUpayHi: [
        "अपनी तिजोरी अथवा पर्स में लाल रेशमी कपड़े में लिपटा हुआ चांदी का चौकोर टुकड़ा या सिक्का रखें।",
        "प्रत्येक बुधवार को गाय को हरा चारा या पालक खिलाएं।",
        "घर में किसी भी नल से पानी टपकने न दें, यह धन की निरंतर बर्बादी का वास्तु दोष माना जाता है।"
      ],
      charityEn: "Donate white rice, sugar, or dairy products to underprivileged women or spiritual shrines on Fridays.",
      charityHi: "शुक्रवार के दिन जरूरतमंद कन्याओं या महिलाओं को चावल, मिश्री अथवा दूध से बनी मिठाई का दान करें।",
      gemRudraksha: isHi ? "७ मुखी रुद्राक्ष (महालक्ष्मी स्वरूप) अथवा श्री कनकधारा यंत्र" : "7-Mukhi Rudraksha (Goddess Lakshmi) & Shri Kanakadhara Yantra",
      vastuTipEn: "Place a Kubera Yantra or healthy money plant in the North zone of your residence to attract liquid wealth.",
      vastuTipHi: "घर की उत्तर दिशा (कुबेर स्थान) में कनकधारा यंत्र स्थापित करें या मनी प्लांट लगाएं।"
    },
    mental_stress: {
      rootCauseEn: `Affliction of the Moon (Chandra Dosha / Kemadruma / Rahu-Chandra Grahan Yog) or Mercury combust, leading to racing thoughts, restlessness, and nighttime anxiety.`,
      rootCauseHi: `चंद्रमा का राहु/केतु या शनि से पीड़ित होना (ग्रहण अथवा विष योग), बुध की निर्बलता एवं छठे/आठवें भाव की अशांति।`,
      mantra: "ॐ सोम सोमाय नमः / ॐ नमः शिवाय (Om Som Somaya Namah / Om Namah Shivaya)",
      mantraCount: "108 times at twilight with gentle deep breathing",
      mantraCountHi: "संध्याकाल में शांत बैठकर १०८ बार जप करें",
      dailyUpayEn: [
        "Drink water from a pure silver cup or keep water in a silver vessel overnight before drinking.",
        "Apply a tiny spot of natural white sandalwood (Chandan) paste to the center of your forehead before meditation/sleep.",
        "Avoid keeping footwear, electronics, or clutter beneath your bed."
      ],
      dailyUpayHi: [
        "चांदी के गिलास में जल पिएं अथवा रात भर चांदी के बर्तन में रखा जल प्रातः ग्रहण करें।",
        "माथे के केंद्र में शुद्ध सफेद चंदन का तिलक लगाएं, इससे मन को तुरंत शांति मिलती है।",
        "अपने बिस्तर के नीचे कोई इलेक्ट्रॉनिक सामान, जूते-चप्पल अथवा कबाड़ न रखें।"
      ],
      charityEn: "Offer milk, white flowers, or rice to a Shiva temple on Mondays, and feed stray animals.",
      charityHi: "सोमवार के दिन शिवलिंग पर कच्चा दूध व श्वेत पुष्प अर्पित करें और बेसहारा पशुओं को भोजन कराएं।",
      gemRudraksha: isHi ? "२ मुखी रुद्राक्ष (शिव-पार्वती स्वरूप) / प्राकृतिक मोती" : "2-Mukhi Rudraksha (Ardhanarishvara) / Natural South Sea Pearl",
      vastuTipEn: "Burn pure camphor (Kapur) in your bedroom for 5 minutes in the evening to clear mental fatigue and negative air.",
      vastuTipHi: "संध्या समय शयनकक्ष में शुद्ध भीमसेनी कपूर जलाएं, इससे तनाव और अनिद्रा में तुरंत राहत मिलती है।"
    },
    relationship_family: {
      rootCauseEn: `7th House (Partnership Bhava) afflicted by Mars (Mangal Dosha), Sun's ego aspect, or Rahu's illusion causing sudden misunderstandings and communication breakdowns.`,
      rootCauseHi: `सप्तम भाव अथवा शुक्र/गुरु पर मंगल (मांगलिक प्रभाव), सूर्य का अहंकार अथवा राहु का भ्रम उत्पन्न करने वाला प्रभाव।`,
      mantra: "ॐ गौरीशंकराय नमः / ॐ क्लीं कृष्णाय नमः (Om Gaurishankaraya Namah)",
      mantraCount: "108 times in the morning for marital harmony",
      mantraCountHi: "नित्य प्रातः १०८ बार श्रद्धापूर्वक जप करें",
      dailyUpayEn: [
        "Offer prayers to Lord Shiva and Goddess Parvati together with a single garland on Pradosh or Mondays.",
        "Keep a pair of lovebirds or Radha-Krishna image in the South-West zone of your home.",
        "Avoid eating food while arguing or keeping footwear near the dining area."
      ],
      dailyUpayHi: [
        "शिव-पार्वती की संयुक्त प्रतिमा पर एक साथ पुष्पमाला अर्पित करें और सुखद दांपत्य की प्रार्थना करें।",
        "घर के नैऋत्य कोण (South-West) में राधा-कृष्ण की प्रेममयी तस्वीर लगाएं।",
        "भोजन करते समय मौन रहें या केवल सकारात्मक बातें करें, भोजन की थाली में हाथ न धोएं।"
      ],
      charityEn: "Donate red clothes, fruits, or sweets to married women or temple priests on Tuesdays/Fridays.",
      charityHi: "मंगलवार अथवा शुक्रवार को सुहागिन स्त्रियों को सुहाग सामग्री या मीठे फल भेंट करें।",
      gemRudraksha: isHi ? "गौरी-शंकर रुद्राक्ष (अखंड दांपत्य सुख हेतु)" : "Gauri-Shankar Rudraksha (Supreme Harmonic Union)",
      vastuTipEn: "Ensure the bedroom has no mirrors directly reflecting the sleeping bed; cover mirrors at night.",
      vastuTipHi: "शयनकक्ष में ऐसा कोई शीशा न हो जिसमें सोते समय शरीर का प्रतिबिंब दिखे, रात्रि में शीशे को ढक दें।"
    },
    health_energy: {
      rootCauseEn: `Affliction of the Lagna Lord (Physical Vitality) or 6th/8th house distress, weakening the immune matrix and causing chronic lethargy or digestive fire imbalance.`,
      rootCauseHi: `लग्नेश (शरीर बल) का निर्बल होना, षष्ठ भाव (रोग) की प्रबलता अथवा सूर्य-मंगल के तेज में कमी।`,
      mantra: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृ त्योर्मुक्षीय मामृतात् ॥",
      mantraCount: "11 or 108 times facing East (Maha Mrityunjaya Mantra)",
      mantraCountHi: "महामृत्युंजय मंत्र का नित्य प्रातः ११ या १०८ बार जप करें",
      dailyUpayEn: [
        "Drink a glass of warm water infused with a pinch of turmeric and honey in the morning.",
        "Perform Surya Namaskar and take at least 15 minutes of direct morning sunlight on your back.",
        "Do not skip morning meals or consume stale/reheated oily meals late at night."
      ],
      dailyUpayHi: [
        "प्रातः काल तांबे के बर्तन में रखा जल पिएं और गुनगुने पानी में हल्की हल्दी लें।",
        "सूर्योदय के समय १५ मिनट धूप का सेवन करें और हल्का प्राणायाम करें।",
        "बासी अथवा अत्यधिक तैलीय भोजन से परहेज करें और समय पर भोजन करें।"
      ],
      charityEn: "Donate medicines, fresh seasonal fruits, or warm clothes to hospital patients or elderly shelters.",
      charityHi: "अस्पतालों में जरूरतमंद मरीजों को दवाइयां अथवा ताजे मौसमी फल वितरित करें।",
      gemRudraksha: isHi ? "३ मुखी अथवा ५ मुखी रुद्राक्ष (अग्नि तत्व व आरोग्य वर्धक)" : "3-Mukhi (Agni) or 5-Mukhi Rudraksha / Copper Bracelet",
      vastuTipEn: "Sleep with your head pointing towards the South or East to align with the Earth's geomagnetic health field.",
      vastuTipHi: "सोते समय सिर हमेशा दक्षिण (South) या पूर्व (East) दिशा में रखें, इससे गहरी नींद व स्वास्थ्य लाभ होता है।"
    },
    legal_enemies: {
      rootCauseEn: `6th House (Shatru & Rina Bhava) activated with hostile aspects, or strong Mars-Rahu transit creating unwarranted disputes, jealousy, or institutional resistance.`,
      rootCauseHi: `षष्ठ भाव (शत्रु व विवाद) का जाग्रत होना अथवा मंगल-राहु की युति से अकारण ईर्ष्या व विरोधी सक्रिय होना।`,
      mantra: "ॐ हं हनुमते रुद्रात्मकाय हुं फट् (Om Ham Hanumate Rudratmakaya Hum Phat)",
      mantraCount: "108 times on Tuesday/Saturday in front of Hanuman idol",
      mantraCountHi: "मंगलवार व शनिवार को हनुमान जी के समक्ष १०८ बार",
      dailyUpayEn: [
        "Recite the Bajrang Baan or Hanuman Chalisa with full devotion on Tuesdays and Saturdays.",
        "Apply a small tilak of orange Sindoor from Lord Hanuman's right shoulder onto your forehead before court hearings or negotiations.",
        "Keep your important legal documents in a yellow or red folder in the North-East zone."
      ],
      dailyUpayHi: [
        "मंगलवार और शनिवार को बजरंग बाण अथवा श्री हनुमान चालीसा का श्रद्धापूर्वक पाठ करें।",
        "हनुमान जी के चरणों का सिंदूर माथे पर लगाकर महत्वपूर्ण वार्ता अथवा कार्य हेतु प्रस्थान करें।",
        "कानूनी कागजात व महत्वपूर्ण दस्तावेज लाल या पीले फोल्डर में उत्तर दिशा में रखें।"
      ],
      charityEn: "Distribute roasted grams (chana) and jaggery (gur) to monkeys or poor children on Tuesdays.",
      charityHi: "मंगलवार को बंदरों अथवा जरूरतमंद बालकों को भुने चने व गुड़ का प्रसाद बांटें।",
      gemRudraksha: isHi ? "११ मुखी रुद्राक्ष (श्री हनुमान स्वरूप) / बगलामुखी यंत्र" : "11-Mukhi Rudraksha (Lord Hanuman) & Baglamukhi Yantra",
      vastuTipEn: "Light a mustard oil lamp with 2 whole cloves (laung) facing South-East in the evening.",
      vastuTipHi: "संध्या समय दक्षिण दिशा की ओर मुख करके सरसों के तेल के दीपक में २ लौंग डालकर जलाएं।"
    },
    nazar_energy: {
      rootCauseEn: `Auric field vulnerability due to weak Ascendant aura or Rahu-Ketu shadow influence, leading to sudden domestic friction, lethargy, or unexplained recurring hitches.`,
      rootCauseHi: `आभामंडल (Aura) की दुर्बलता, राहु-केतु की छाया दृष्टि अथवा गृह वास्तु में नकारात्मक ऊर्जा का संचय।`,
      mantra: "ॐ नमो भगवते वासुदेवाय / ॐ दुं दुर्गायै नमः (Om Dum Durgayai Namah)",
      mantraCount: "108 times with incense lighting",
      mantraCountHi: "नित्य १०८ बार जप करें और धूप-दीप प्रज्वलित करें",
      dailyUpayEn: [
        "Wipe the floors of your house with rock salt (Sendha Namak) mixed in mop water twice a week (Tuesdays and Saturdays).",
        "Circulate a whole lemon 7 times around the affected person/home from head to toe and dispose of it at a four-way crossroad or running water.",
        "Hang a string of 7 green chilies and 1 fresh lemon outside your main entrance every Saturday."
      ],
      dailyUpayHi: [
        "सप्ताह में दो बार (मंगलवार व शनिवार) घर के पोछे के पानी में थोड़ा सेंधा नमक मिलाकर पोछा लगाएं।",
        "एक साबुत नींबू को प्रभावित व्यक्ति के सिर से पैर तक ७ बार वार कर किसी निर्जन स्थान पर रख दें।",
        "घर के मुख्य द्वार पर शनिवार को ७ हरी मिर्च और १ नींबू की माला लगाएं।"
      ],
      charityEn: "Feed black sesame seeds and cooked food to stray dogs, crows, or fish on Saturday evening.",
      charityHi: "शनिवार की शाम काले कुत्तों या कौवों को सरसों के तेल से चुपड़ी रोटी खिलाएं।",
      gemRudraksha: isHi ? "काला धागा / नजर रक्षा कवच / महामृत्युंजय यंत्र" : "Evil Eye Protection Thread / 10-Mukhi Rudraksha (Lord Vishnu)",
      vastuTipEn: "Burn dry neem leaves, guggul, and yellow mustard seeds (Peeli Sarson) in a clay bowl across all rooms once a week.",
      vastuTipHi: "सप्ताह में एक बार घर में गुग्गल, लोबान और पीली सरसों की धूनी दें, इससे सभी नकारात्मक ऊर्जाएं तुरंत समाप्त होती हैं।"
    }
  };

  const item = problemDatabase[problemId] || problemDatabase.career_job;
  const problemMeta = LIFE_PROBLEMS_LIST.find(p => p.id === problemId) || LIFE_PROBLEMS_LIST[0];

  return {
    problemId,
    problemTitle: isHi ? problemMeta.labelHi : problemMeta.labelEn,
    icon: problemMeta.icon,
    rootCause: isHi ? item.rootCauseHi : item.rootCauseEn,
    mantra: item.mantra,
    mantraCount: isHi ? item.mantraCountHi : item.mantraCount,
    dailyUpay: isHi ? item.dailyUpayHi : item.dailyUpayEn,
    charity: isHi ? item.charityHi : item.charityEn,
    gemRudraksha: item.gemRudraksha,
    vastuTip: isHi ? item.vastuTipHi : item.vastuTipEn
  };
}
