import { AstroTime, GeoVector, Ecliptic, Body, SiderealTime } from "astronomy-engine";

/* -------------------------------------------------------------
   ZODIAC SIGNS & NAKSHATRAS
------------------------------------------------------------- */
export const SIGNS = [
  { name: "Aries", sanskrit: "Mesha", lord: "Mars", element: "Fire", symbol: "♈" },
  { name: "Taurus", sanskrit: "Vrishabha", lord: "Venus", element: "Earth", symbol: "♉" },
  { name: "Gemini", sanskrit: "Mithuna", lord: "Mercury", element: "Air", symbol: "♊" },
  { name: "Cancer", sanskrit: "Karka", lord: "Moon", element: "Water", symbol: "♋" },
  { name: "Leo", sanskrit: "Simha", lord: "Sun", element: "Fire", symbol: "♌" },
  { name: "Virgo", sanskrit: "Kanya", lord: "Mercury", element: "Earth", symbol: "♍" },
  { name: "Libra", sanskrit: "Tula", lord: "Venus", element: "Air", symbol: "♎" },
  { name: "Scorpio", sanskrit: "Vrishchika", lord: "Mars", element: "Water", symbol: "♏" },
  { name: "Sagittarius", sanskrit: "Dhanu", lord: "Jupiter", element: "Fire", symbol: "♐" },
  { name: "Capricorn", sanskrit: "Makara", lord: "Saturn", element: "Earth", symbol: "♑" },
  { name: "Aquarius", sanskrit: "Kumbha", lord: "Saturn", element: "Air", symbol: "♒" },
  { name: "Pisces", sanskrit: "Meena", lord: "Jupiter", element: "Water", symbol: "♓" }
];

export const NAKSHATRAS = [
  { name: "Ashwini", hindi: "अश्विनी", lord: "Ketu", deity: "Ashwini Kumaras" },
  { name: "Bharani", hindi: "भरणी", lord: "Venus", deity: "Yama" },
  { name: "Krittika", hindi: "कृत्तिका", lord: "Sun", deity: "Agni" },
  { name: "Rohini", hindi: "रोहिणी", lord: "Moon", deity: "Brahma" },
  { name: "Mrigashira", hindi: "मृगशिरा", lord: "Mars", deity: "Soma" },
  { name: "Ardra", hindi: "आर्द्रा", lord: "Rahu", deity: "Rudra" },
  { name: "Punarvasu", hindi: "पुनर्वसु", lord: "Jupiter", deity: "Aditi" },
  { name: "Pushya", hindi: "पुष्य", lord: "Saturn", deity: "Brihaspati" },
  { name: "Ashlesha", hindi: "आश्लेषा", lord: "Mercury", deity: "Nagas" },
  { name: "Magha", hindi: "मघा", lord: "Ketu", deity: "Pitris" },
  { name: "Purva Phalguni", hindi: "पूर्वा फाल्गुनी", lord: "Venus", deity: "Bhaga" },
  { name: "Uttara Phalguni", hindi: "उत्तरा फाल्गुनी", lord: "Sun", deity: "Aryaman" },
  { name: "Hasta", hindi: "हस्त", lord: "Moon", deity: "Savitar" },
  { name: "Chitra", hindi: "चित्रा", lord: "Mars", deity: "Tvashtar" },
  { name: "Swati", hindi: "स्वाति", lord: "Rahu", deity: "Vayu" },
  { name: "Vishakha", hindi: "विशाखा", lord: "Jupiter", deity: "Indra-Agni" },
  { name: "Anuradha", hindi: "अनुराधा", lord: "Saturn", deity: "Mitra" },
  { name: "Jyeshtha", hindi: "ज्येष्ठा", lord: "Mercury", deity: "Indra" },
  { name: "Mula", hindi: "मूल", lord: "Ketu", deity: "Nirriti" },
  { name: "Purva Ashadha", hindi: "पूर्वाषाढ़ा", lord: "Venus", deity: "Apas" },
  { name: "Uttara Ashadha", hindi: "उत्तराषाढ़ा", lord: "Sun", deity: "Vishwadevas" },
  { name: "Shravana", hindi: "श्रवण", lord: "Moon", deity: "Vishnu" },
  { name: "Dhanishta", hindi: "धनिष्ठा", lord: "Mars", deity: "Ashta Vasus" },
  { name: "Shatabhisha", hindi: "शतभिषा", lord: "Rahu", deity: "Varuna" },
  { name: "Purva Bhadrapada", hindi: "पूर्वभाद्रपदा", lord: "Jupiter", deity: "Aja Ekapada" },
  { name: "Uttara Bhadrapada", hindi: "उत्तरभाद्रपदा", lord: "Saturn", deity: "Ahirbudhnya" },
  { name: "Revati", hindi: "रेवती", lord: "Mercury", deity: "Pushan" }
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
  const segment = 360 / 27; // 13°20' = 13.33333°
  const index = Math.floor(norm / segment);
  const pada = Math.floor((norm % segment) / (segment / 4)) + 1;
  const nak = NAKSHATRAS[index % 27];
  return {
    index,
    name: nak.name,
    hindi: nak.hindi,
    lord: nak.lord,
    pada,
    degInNak: norm % segment
  };
}

export function getLahiriAyanamsa(date) {
  // Epoch 2000.0 (J2000): 23.85° + precession rate ~50.29 arcsec/yr
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

  // Mean Lunar Nodes (Rahu / Ketu)
  const d = time.ut; // Days from J2000.0
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
  const eps = (23.439 * Math.PI) / 180; // Earth obliquity

  // Tropical Ascendant formula
  const y = Math.cos(theta);
  const x = - (Math.sin(theta) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps));
  let ascTropical = Math.atan2(y, x) * (180 / Math.PI);
  ascTropical = ((ascTropical % 360) + 360) % 360;

  // Convert to Sidereal with Lahiri Ayanamsa
  return applyLahiriAyanamsa(ascTropical, date);
}

export function evaluatePlanetStatus(planet, deg) {
  const signIdx = getSignIndex(deg);

  const dignities = {
    Sun: { exalted: 0, debilitated: 6, own: [4] },       // Aries (0), Libra (6), Leo (4)
    Moon: { exalted: 1, debilitated: 7, own: [3] },      // Taurus (1), Scorpio (7), Cancer (3)
    Mars: { exalted: 9, debilitated: 3, own: [0, 7] },   // Capricorn (9), Cancer (3), Aries (0), Scorpio (7)
    Mercury: { exalted: 5, debilitated: 11, own: [2, 5] },// Virgo (5), Pisces (11), Gemini (2), Virgo (5)
    Jupiter: { exalted: 3, debilitated: 9, own: [8, 11] },// Cancer (3), Capricorn (9), Sag (8), Pisces (11)
    Venus: { exalted: 11, debilitated: 5, own: [1, 6] }, // Pisces (11), Virgo (5), Taurus (1), Libra (6)
    Saturn: { exalted: 6, debilitated: 0, own: [9, 10] }, // Libra (6), Aries (0), Capricorn (9), Aquarius (10)
    Rahu: { exalted: 1, debilitated: 7, own: [10] },     // Taurus/Gemini, Scorpio/Sag
    Ketu: { exalted: 7, debilitated: 1, own: [8] }       // Scorpio/Sag, Taurus/Gemini
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
   COMPLETE VEDIC ANALYSIS GENERATOR
------------------------------------------------------------- */
export function generateVedicKundliData({ name, dob, tob, pob, lat, lon, lang = "en" }) {
  // Parse date properly (supporting local time and ISO string)
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

  // Panchang calculations
  const diffDeg = ((moonDeg - sunDeg + 360) % 360);
  const tithiIdx = Math.floor(diffDeg / 12) % 30;
  const tithiEn = TITHIS_EN[tithiIdx];
  const tithiHi = TITHIS_HI[tithiIdx];

  const yogaDeg = ((sunDeg + moonDeg) % 360);
  const yogaIdx = Math.floor(yogaDeg / (360 / 27)) % 27;
  const yogaName = YOGAS_LIST[yogaIdx];

  // Whole Sign Vedic Houses (Bhavas 1 to 12)
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

  // Planet table with house assignments
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

  // House interpretations
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

  // -------------------------------------------------------------
  // YOGAS DETECTION
  // -------------------------------------------------------------
  const detectedYogas = [];
  const detectedYogasHi = [];

  // Gajakesari Yoga (Jupiter in Kendra 1,4,7,10 from Moon)
  const jupHouse = planetHouseMap["Jupiter"];
  const moonHouse = planetHouseMap["Moon"];
  const kendraFromMoon = ((jupHouse - moonHouse + 12) % 12) + 1;
  if ([1, 4, 7, 10].includes(kendraFromMoon)) {
    detectedYogas.push("🌟 Gajakesari Yoga: Jupiter in Kendra from Moon bestows wisdom, enduring prosperity, societal honor, and high intellect.");
    detectedYogasHi.push("🌟 गजकेसरी योग: चंद्रमा से केंद्र में गुरु की स्थिति उत्तम विद्या, यश, दीर्घकालिक समृद्धि और मान-सम्मान प्रदान करती है।");
  }

  // Budhaditya Yoga (Sun + Mercury in same house)
  if (planetHouseMap["Sun"] === planetHouseMap["Mercury"]) {
    detectedYogas.push(`⚡ Budhaditya Yoga: Sun & Mercury conjoint in House ${planetHouseMap["Sun"]} grants exceptional sharp intellect, analytical brilliance, and leadership.`);
    detectedYogasHi.push(`⚡ बुधादित्य योग: सूर्य और बुध की युति भाव ${planetHouseMap["Sun"]} में प्रखर बुद्धि, प्रशासनिक क्षमता और उत्कृष्ट वाक्पटुता देती है।`);
  }

  // Chandra-Mangal Yoga (Moon + Mars together)
  if (planetHouseMap["Moon"] === planetHouseMap["Mars"]) {
    detectedYogas.push("💰 Chandra-Mangal Yoga: Conjunction of Moon & Mars activates profound financial acumen, enterprise, and material abundance.");
    detectedYogasHi.push("💰 चंद्र-मंगल योग: चंद्रमा और मंगल की युति धनार्जन की अद्भुत क्षमता और व्यवसाय में बड़ी सफलता का योग बनाती है।");
  }

  // Raja Yoga / Kendra-Trikona Lord connection
  detectedYogas.push(`✨ Kendra-Trikona Raj Yoga: Strong alignment between Lagna lord (${ascSign.lord}) and 9th/10th house lords supports rise in status.`);
  detectedYogasHi.push(`✨ केंद्र-त्रिकोण राजयोग: लग्न अधिपति (${ascSign.lord}) और शुभ भावों का संबंध निरंतर प्रगति और उच्च प्रतिष्ठा कारक है।`);

  // Manglik Check
  const marsH = planetHouseMap["Mars"];
  const isManglik = [1, 4, 7, 8, 12].includes(marsH);
  if (isManglik) {
    detectedYogas.push(`🔥 Mangal (Mars) Placement: Mars in House ${marsH} grants tremendous drive and energy; balanced communication in relationships brings great harmony.`);
    detectedYogasHi.push(`🔥 मंगल स्थिति: मंगल भाव ${marsH} में स्थित होकर असीम ऊर्जा व तेज प्रदान करता है; दांपत्य में धैर्य और समझदारी सुखद फल देगी।`);
  }

  // -------------------------------------------------------------
  // VIMSHOTTARI DASHA TIMELINE
  // -------------------------------------------------------------
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

  // -------------------------------------------------------------
  // REMEDIES & AUSPICIOUS ATTRIBUTES
  // -------------------------------------------------------------
  const luckyGemsByLagna = {
    Aries: { gem: "Red Coral (Moonga)", metal: "Copper / Gold", hiGem: "लाल मूंगा (Red Coral)" },
    Taurus: { gem: "Diamond / White Sapphire", metal: "Silver / Platinum", hiGem: "हीरा / सफेद पुखराज" },
    Gemini: { gem: "Emerald (Panna)", metal: "Bronze / Gold", hiGem: "पन्ना (Emerald)" },
    Cancer: { gem: "Pearl (Moti) / Moonstone", metal: "Silver", hiGem: "सच्चा मोती (Pearl)" },
    Leo: { gem: "Ruby (Manikya)", metal: "Gold / Copper", hiGem: "माणिक्य (Ruby)" },
    Virgo: { gem: "Emerald (Panna)", metal: "Gold / Bronze", hiGem: "पन्ना (Emerald)" },
    Libra: { gem: "Diamond / Opal", metal: "Silver / White Gold", hiGem: "ओपल / हीरा" },
    Scorpio: { gem: "Red Coral (Moonga) / Yellow Sapphire", metal: "Copper / Gold", hiGem: "लाल मूंगा / पुखराज" },
    Sagittarius: { gem: "Yellow Sapphire (Pukhraj)", metal: "Gold", hiGem: "पीला पुखराज (Yellow Sapphire)" },
    Capricorn: { gem: "Blue Sapphire (Neelam) / Blue Topaz", metal: "Silver / Iron", hiGem: "नीलम / जामुनिया" },
    Aquarius: { gem: "Blue Sapphire / Amethyst", metal: "Silver / Panchdhatu", hiGem: "नीलम / अमेथिस्ट" },
    Pisces: { gem: "Yellow Sapphire (Pukhraj) / Pearl", metal: "Gold", hiGem: "पीला पुखराज / मोती" }
  };

  const luckyInfo = luckyGemsByLagna[ascSign.name] || luckyGemsByLagna["Aries"];

  const luckyColors = {
    Aries: "Crimson Red, Saffron & Golden Yellow",
    Taurus: "Lotus White, Cream & Soft Pastels",
    Gemini: "Emerald Green, Mint & Turquoise",
    Cancer: "Pearl White, Silver & Sea Green",
    Leo: "Royal Gold, Orange & Ruby Red",
    Virgo: "Forest Green, Jade & Earthy Tones",
    Libra: "Silk White, Light Blue & Rose Pink",
    Scorpio: "Deep Maroon, Coral Red & Amber",
    Sagittarius: "Auspicious Yellow, Saffron & Gold",
    Capricorn: "Deep Navy Blue, Charcoal & Slate Grey",
    Aquarius: "Electric Blue, Violet & Sky Blue",
    Pisces: "Golden Yellow, Saffron & Aquamarine"
  }[ascSign.name];

  const luckyColorsHi = {
    Aries: "गहरा लाल, केसरिया और सुनहरा पीला",
    Taurus: "दूधिया सफेद, क्रीम और हल्का गुलाबी",
    Gemini: "पन्ना हरा, तोतिया और आसमानी",
    Cancer: "मोतिया सफेद, चांदी और हल्का नीला",
    Leo: "शाही सुनहरा, नारंगी और माणिक्य लाल",
    Virgo: "हरा, जामुनी और गहरा बादामी",
    Libra: "चमकीला सफेद, हल्का नीला और गुलाबी",
    Scorpio: "गहरा मैरून, सिंदूरी लाल और केसरिया",
    Sagittarius: "पीला, केसरिया और स्वर्णिम रंग",
    Capricorn: "गहरा नीला, नेवी ब्लू और स्लेटी",
    Aquarius: "नीला, बैंगनी और हल्का आसमानी",
    Pisces: "हल्दी पीला, केसरिया और हल्का हरा"
  }[ascSign.name];

  const luckyNumbers = {
    Aries: "1, 9, 3",
    Taurus: "6, 5, 8",
    Gemini: "5, 1, 6",
    Cancer: "2, 7, 9",
    Leo: "1, 5, 9",
    Virgo: "5, 6, 2",
    Libra: "6, 7, 1",
    Scorpio: "9, 3, 1",
    Sagittarius: "3, 1, 9",
    Capricorn: "8, 5, 6",
    Aquarius: "8, 4, 7",
    Pisces: "3, 2, 9"
  }[ascSign.name];

  const auspiciousDays = {
    Aries: "Tuesday, Sunday & Thursday",
    Taurus: "Friday, Saturday & Wednesday",
    Gemini: "Wednesday, Friday & Thursday",
    Cancer: "Monday, Tuesday & Thursday",
    Leo: "Sunday, Tuesday & Thursday",
    Virgo: "Wednesday, Friday & Saturday",
    Libra: "Friday, Saturday & Wednesday",
    Scorpio: "Tuesday, Thursday & Sunday",
    Sagittarius: "Thursday, Sunday & Tuesday",
    Capricorn: "Saturday, Friday & Wednesday",
    Aquarius: "Saturday, Wednesday & Friday",
    Pisces: "Thursday, Monday & Tuesday"
  }[ascSign.name];

  const auspiciousDaysHi = {
    Aries: "मंगलवार, रविवार और गुरुवार",
    Taurus: "शुक्रवार, शनिवार और बुधवार",
    Gemini: "बुधवार, शुक्रवार और गुरुवार",
    Cancer: "सोमवार, मंगलवार और गुरुवार",
    Leo: "रविवार, मंगलवार और गुरुवार",
    Virgo: "बुधवार, शुक्रवार और शनिवार",
    Libra: "शुक्रवार, शनिवार और बुधवार",
    Scorpio: "मंगलवार, गुरुवार और रविवार",
    Sagittarius: "गुरुवार, रविवार और मंगलवार",
    Capricorn: "शनिवार, शुक्रवार और बुधवार",
    Aquarius: "शनिवार, बुधवार और शुक्रवार",
    Pisces: "गुरुवार, सोमवार और मंगलवार"
  }[ascSign.name];

  // -------------------------------------------------------------
  // COMPREHENSIVE LIFE READINGS (EN / HI)
  // -------------------------------------------------------------
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

  return {
    lagna: `${ascSign.name} (${ascSign.sanskrit}) ${ascDeg.toFixed(1)}°`,
    rashi: `${moonSign.name} (${moonSign.sanskrit})`,
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
    longevity: longevityText,
    verdict: verdictText,
    houses,
    planetData
  };
}
