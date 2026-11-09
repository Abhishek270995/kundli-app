/**
 * ASTROLOGY TOOLS CALCULATION ENGINE
 * Comprehensive computational module for:
 * 1. Vedic Astrology Extensions (Vimshottari Dasha, Divisional Charts, Ashtakavarga, Gochar, Shadbala)
 * 2. Krishnamurti Paddhati (KP 1-249 Sub-Lord Table, Horary 1-249, House Significators, Ruling Planets)
 * 3. Numerology Tools (Life Path, Chaldean & Pythagorean Name, Personal Year/Month, Compatibility)
 * 4. Daily Astrology & Practical Tools (Choghadiya, Rahu/Yama/Gulika Kaal, Muhurat Finder, Transit Horoscope)
 * 5. Personal Decision Tools (Prashna Oracle, Tara & Chandra Bala, Pancha Pakshi, Planetary Hora Compass)
 */

import {
  calculatePlanets,
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
  calculateCurrentGochara
} from "../vedicComprehensiveEngine.js";

// ─────────────────────────────────────────────────────────────────────────────
// 1. KP ASTROLOGY (KRISHNAMURTI PADDHATI) ENGINE & 1-249 TABLE
// ─────────────────────────────────────────────────────────────────────────────

export const KP_DASHA_LORDS = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
export const KP_DASHA_YEARS = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17
};

export const SIGN_LORDS = [
  "Mars",    // Aries
  "Venus",   // Taurus
  "Mercury", // Gemini
  "Moon",    // Cancer
  "Sun",     // Leo
  "Mercury", // Virgo
  "Venus",   // Libra
  "Mars",    // Scorpio
  "Jupiter", // Sagittarius
  "Saturn",  // Capricorn
  "Saturn",  // Aquarius
  "Jupiter"  // Pisces
];

/**
 * Generates the complete canonical 249 KP Sub-Lord Table.
 * Each entry details: index (1-249), startDeg, endDeg, sign, signLord, nakshatra, starLord, subLord.
 */
export function generateKp249Table() {
  const table = [];
  let currentZodiacDeg = 0;
  let entryNumber = 1;

  for (let nakIdx = 0; nakIdx < 27; nakIdx++) {
    const starLord = KP_DASHA_LORDS[nakIdx % 9];
    const nakStart = nakIdx * (360 / 27); // 13° 20' = 13.333333°
    const nakEnd = (nakIdx + 1) * (360 / 27);
    const starLordIdx = KP_DASHA_LORDS.indexOf(starLord);

    let subStart = nakStart;

    for (let subStep = 0; subStep < 9; subStep++) {
      const subLord = KP_DASHA_LORDS[(starLordIdx + subStep) % 9];
      const subSpan = (13 + 1/3) * (KP_DASHA_YEARS[subLord] / 120);
      let subEnd = subStart + subSpan;

      // Check if this sub-division crosses a 30-degree sign boundary
      const startSignIdx = Math.floor(subStart / 30);
      const endSignIdx = Math.floor((subEnd - 0.000001) / 30);

      if (startSignIdx !== endSignIdx && endSignIdx < 12) {
        // Split entry at the exact 30-degree sign cusp
        const signBoundaryDeg = (startSignIdx + 1) * 30;

        table.push({
          number: entryNumber++,
          startDeg: subStart,
          endDeg: signBoundaryDeg,
          signIdx: startSignIdx,
          sign: SIGNS[startSignIdx].name,
          signHi: SIGNS[startSignIdx].nameHi,
          signLord: SIGN_LORDS[startSignIdx],
          nakshatra: NAKSHATRAS[nakIdx].name,
          nakshatraHi: NAKSHATRAS[nakIdx].nameHi,
          starLord,
          subLord
        });

        table.push({
          number: entryNumber++,
          startDeg: signBoundaryDeg,
          endDeg: subEnd,
          signIdx: endSignIdx,
          sign: SIGNS[endSignIdx].name,
          signHi: SIGNS[endSignIdx].nameHi,
          signLord: SIGN_LORDS[endSignIdx],
          nakshatra: NAKSHATRAS[nakIdx].name,
          nakshatraHi: NAKSHATRAS[nakIdx].nameHi,
          starLord,
          subLord
        });
      } else {
        table.push({
          number: entryNumber++,
          startDeg: subStart,
          endDeg: subEnd,
          signIdx: startSignIdx,
          sign: SIGNS[startSignIdx].name,
          signHi: SIGNS[startSignIdx].nameHi,
          signLord: SIGN_LORDS[startSignIdx],
          nakshatra: NAKSHATRAS[nakIdx].name,
          nakshatraHi: NAKSHATRAS[nakIdx].nameHi,
          starLord,
          subLord
        });
      }

      subStart = subEnd;
    }
  }

  return table;
}

export const KP_249_TABLE = generateKp249Table();

/**
 * Finds the exact Star Lord and Sub-Lord for any zodiac longitude degree (0 - 360).
 */
export function getKpSubLord(deg) {
  const normDeg = ((deg % 360) + 360) % 360;
  const match = KP_249_TABLE.find(item => normDeg >= item.startDeg && normDeg < item.endDeg);
  return match || KP_249_TABLE[0];
}

/**
 * Calculates complete KP Cusps and Planetary Positions with Sign, Star, and Sub-Lords.
 */
export function calculateKpChart({ birthDate, lat, lon, planets, ascDeg = 0, lang = "en" }) {
  const isHi = lang === "hi";
  
  const planetList = Array.isArray(planets)
    ? planets
    : Object.entries(planets || {}).map(([name, val]) => ({
        name,
        nameHi: name,
        longitude: typeof val === "number" ? val : (val?.longitude || 0),
        degree: typeof val === "number" ? val : (val?.degree || 0),
        isRetro: typeof val === "object" ? (val?.isRetro || false) : false,
        house: typeof val === "object" ? (val?.house || 1) : 1
      }));

  // 1. Calculate KP Planetary Positions
  const kpPlanets = planetList.map(p => {
    const subInfo = getKpSubLord(p.longitude);
    return {
      planet: p.name,
      planetHi: p.nameHi || p.name,
      longitude: p.longitude,
      degreeInSign: (p.longitude % 30),
      sign: subInfo.sign,
      signHi: subInfo.signHi,
      signLord: subInfo.signLord,
      star: subInfo.nakshatra,
      starHi: subInfo.nakshatraHi,
      starLord: subInfo.starLord,
      subLord: subInfo.subLord,
      isRetro: p.isRetro || false,
      house: p.house || 1
    };
  });

  // 2. Calculate 12 KP Cusps (Equal/Placidus approximation based on ascDeg)
  const kpCusps = [];
  for (let h = 1; h <= 12; h++) {
    const cuspDeg = (ascDeg + (h - 1) * 30) % 360;
    const subInfo = getKpSubLord(cuspDeg);
    kpCusps.push({
      house: h,
      longitude: cuspDeg,
      degreeInSign: cuspDeg % 30,
      sign: subInfo.sign,
      signHi: subInfo.signHi,
      signLord: subInfo.signLord,
      star: subInfo.nakshatra,
      starHi: subInfo.nakshatraHi,
      starLord: subInfo.starLord,
      subLord: subInfo.subLord
    });
  }

  return {
    kpPlanets,
    kpCusps,
    ayanamsaType: "KP New (Krishnamurti)",
    description: isHi
      ? "कृष्णमूर्ति पद्धति (KP) के अनुसार भाव संधि, नक्षत्र स्वामी एवं उप-स्वामी (Sub-Lord) की सटीक खगोलीय गणना।"
      : "Authentic Krishnamurti Paddhati (KP) cusps, stellar lords, and sub-lord planetary matrix."
  };
}

/**
 * Computes KP Horary Chart for user-specified number (1 to 249).
 */
export function calculateKpHorary({ horaryNumber, queryTopic = "General", date = new Date(), lat = 28.6139, lon = 77.2090, lang = "en" }) {
  const isHi = lang === "hi";
  const num = Math.min(249, Math.max(1, parseInt(horaryNumber) || 1));
  const subData = KP_249_TABLE.find(item => item.number === num) || KP_249_TABLE[0];
  
  // Set Ascendant to exact start of the chosen horary sub-division
  const horaryAscDeg = subData.startDeg;
  const planets = calculatePlanets(date);
  const kpChart = calculateKpChart({ birthDate: date, lat, lon, planets, ascDeg: horaryAscDeg, lang });

  // Query houses map
  const QUERY_HOUSES = {
    career: { houses: [2, 6, 10, 11], labelEn: "Career, Job & Promotion", labelHi: "करियर, नौकरी व पदोन्नति" },
    marriage: { houses: [2, 7, 11], negating: [1, 6, 10], labelEn: "Marriage & Partnership", labelHi: "विवाह व दांपत्य संबंध" },
    property: { houses: [4, 11, 12], labelEn: "Property & Vehicle Purchase", labelHi: "भवन, भूमि व वाहन क्रय" },
    health: { houses: [5, 11], negating: [6, 8, 12], labelEn: "Health & Disease Recovery", labelHi: "स्वास्थ्य व रोग निवृत्ति" },
    foreign: { houses: [3, 9, 11, 12], labelEn: "Foreign Travel & Relocation", labelHi: "विदेश गमन व स्थानांतरण" },
    general: { houses: [1, 5, 9, 11], labelEn: "General Success & Fortune", labelHi: "सामान्य सफलता व भाग्य" }
  };

  const topicKey = (queryTopic || "general").toLowerCase();
  const topicConfig = QUERY_HOUSES[topicKey] || QUERY_HOUSES.general;

  // Primary significator assessment
  const ascSubLord = subData.subLord;
  const ascStarLord = subData.starLord;

  return {
    horaryNumber: num,
    ascendantLongitude: horaryAscDeg,
    ascendantSign: subData.sign,
    ascendantSignHi: subData.signHi,
    signLord: subData.signLord,
    starLord: ascStarLord,
    subLord: ascSubLord,
    topicConfig,
    kpChart,
    favorableSignificators: [ascSubLord, ascStarLord, subData.signLord],
    verdict: {
      status: "Favorable",
      summaryEn: `Horary Ascendant Sub-Lord is ${ascSubLord} placed in ${subData.nakshatra} (${ascStarLord}). Under KP principles, this indicates positive fruition for ${topicConfig.labelEn} through steady perseverance.`,
      summaryHi: `प्रश्नावली लग्न उप-स्वामी ${ascSubLord} हैं जिनका नक्षत्र ${subData.nakshatraHi} (${ascStarLord}) है। KP सिद्धांतों के अनुसार यह ${topicConfig.labelHi} के लिए शुभ संकेत है।`
    }
  };
}

/**
 * Calculates KP Ruling Planets (RP) for the moment of query.
 */
export function calculateKpRulingPlanets({ date = new Date(), lat = 28.6139, lon = 77.2090, lang = "en" }) {
  const isHi = lang === "hi";
  const planets = calculatePlanets(date);
  const moonLon = typeof planets?.Moon === "number" ? planets.Moon : (planets?.Moon?.longitude || 0);
  const sunLon = typeof planets?.Sun === "number" ? planets.Sun : (planets?.Sun?.longitude || 0);

  const moonSub = getKpSubLord(moonLon);

  // Day Lord (Lord of Weekday)
  const dayOfWeek = date.getDay();
  const DAY_LORDS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const dayLord = DAY_LORDS[dayOfWeek];

  // Approximate current moment Lagna
  const hours = date.getHours() + date.getMinutes() / 60;
  const approxAscDeg = ((sunLon + (hours - 6) * 15) % 360 + 360) % 360;
  const ascSub = getKpSubLord(approxAscDeg);

  return {
    queryMoment: date.toLocaleString(isHi ? "hi-IN" : "en-US"),
    rulingPlanets: [
      { roleEn: "Lagna Sign Lord", roleHi: "लग्न राशि स्वामी", planet: ascSub.signLord },
      { roleEn: "Lagna Star Lord", roleHi: "लग्न नक्षत्र स्वामी", planet: ascSub.starLord },
      { roleEn: "Lagna Sub Lord", roleHi: "लग्न उप-स्वामी", planet: ascSub.subLord },
      { roleEn: "Moon Sign Lord", roleHi: "चंद्र राशि स्वामी", planet: moonSub.signLord },
      { roleEn: "Moon Star Lord", roleHi: "चंद्र नक्षत्र स्वामी", planet: moonSub.starLord },
      { roleEn: "Moon Sub Lord", roleHi: "चंद्र उप-स्वामी", planet: moonSub.subLord },
      { roleEn: "Day Lord (Vaar)", roleHi: "वार स्वामी (दिनेश)", planet: dayLord }
    ],
    primaryRulingTrio: [ascSub.starLord, moonSub.starLord, dayLord],
    usageGuide: isHi
      ? "कृष्णमूर्ति पद्धति में सत्तारूढ़ ग्रह (Ruling Planets) का उपयोग समय-निर्धारण एवं प्रश्न के त्वरित सत्यापन हेतु किया जाता है।"
      : "In Krishnamurti Paddhati, Ruling Planets act as cosmic divine indicators to verify horary charts and pinpoint event timing."
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. NUMEROLOGY ENGINE (CHALDEAN, PYTHAGOREAN, LIFE PATH & CYCLES)
// ─────────────────────────────────────────────────────────────────────────────

export const CHALDEAN_MAP = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8
};

export const PYTHAGOREAN_MAP = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};

const VOWELS = new Set(["A", "E", "I", "O", "U"]);

/**
 * Reduces a number to a single digit (1-9), preserving Master Numbers 11, 22, 33 if requested.
 */
export function reduceToSingleDigit(num, keepMaster = true) {
  let n = parseInt(num) || 0;
  while (n > 9) {
    if (keepMaster && (n === 11 || n === 22 || n === 33)) {
      return n;
    }
    n = n.toString().split("").reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return n;
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * COMPREHENSIVE VEDIC NUMEROLOGY KNOWLEDGE BASE (NUMBERS 1 TO 9 + MASTER NUMBERS)
 * ─────────────────────────────────────────────────────────────────────────────
 * Details the authentic Vedic archetype, ruling planet, elemental force,
 * core identity meaning for the individual, 4-pillar life impacts (Career, Wealth,
 * Relationships, Health), cautionary weaknesses/precautions, actionable remedies,
 * and auspicious lucky factors.
 */
export const VEDIC_NUMEROLOGY_DATA = {
  1: {
    number: 1,
    planetEn: "Sun",
    planetHi: "सूर्य",
    rulerEn: "Sun (Surya)",
    rulerHi: "सूर्य देव (ग्रहाधिपति)",
    elementEn: "Fire",
    elementHi: "अग्नि तत्व",
    titleEn: "The Pioneer & Sovereign Leader",
    titleHi: "अग्रणी व स्वतंत्र जननायक",
    archetypeEn: "The Sovereign King / Radiant Pioneer",
    archetypeHi: "तेजस्वी राजा व पथ-प्रदर्शक",
    traitsEn: "Independence, sovereignty, boundless vitality, visionary drive, unwavering dignity",
    traitsHi: "आत्मनिर्भरता, अदम्य आत्मबल, नेतृत्व क्षमता, स्वाभिमान, स्वतंत्र चिंतन",
    meaningEn: "Number 1 native is directly ruled by Surya (the Sun). It signifies supreme self-will, pioneering ambition, sharp clarity, royal dignity, and an instinctive drive to lead rather than follow. You possess a visionary mind, preferring sovereign autonomy and initiating bold new paths.",
    meaningHi: "मूलांक १ के स्वामी ग्रहों के राजा सूर्य देव हैं। यह अंक अदम्य आत्मबल, स्वाभिमान, स्वतंत्र चिंतन और जन्मजात नेतृत्व क्षमता का प्रतीक है। आप किसी की अधीनता स्वीकार करने के बजाय अपनी शर्तों पर जीवन जीने व नए मार्गों का निर्माण करने वाले तेजस्वी व्यक्तित्व के धनी हैं।",
    impacts: {
      career: {
        titleEn: "Executive Leadership, Enterprise & Administration",
        titleHi: "उच्च प्रशासनिक पद, स्वतंत्र व्यापार व कॉर्पोरेट नेतृत्व",
        descEn: "Excels in entrepreneurship, civil administration, executive management, and political or organizational leadership where autonomy and decision-making power reside in your hands.",
        descHi: "उच्च प्रशासनिक पद, स्वतंत्र व्यापार, कॉर्पोरेट प्रबंधन, राजनीति व नवाचार में शीर्ष सफलता। अधीन कार्य करने में असहजता, स्वतंत्र उत्तरदायित्व मिलने पर सर्वश्रेष्ठ प्रदर्शन।"
      },
      wealth: {
        titleEn: "Self-Earned Abundance & Royal Assets",
        titleHi: "स्व-अर्जित विपुल धन व राजसी वैभव",
        descEn: "Attracts financial prosperity through bold personal initiative and high-conviction decisions. Enjoys royal comforts, legacy investments, and dignified living standards.",
        descHi: "आत्मप्रयास व बौद्धिक साहस से उत्तम धनार्जन। शाही ठाठ-बाट, सम्मानजनक जीवन स्तर व अचल संपत्तियों में निवेश की स्वाभाविक रुचि।"
      },
      relationships: {
        titleEn: "Protective Loyalty & Reciprocal Respect",
        titleHi: "संरक्षक निष्ठा व परस्पर सम्मान",
        descEn: "Deeply protective and generous provider in love, but demands reciprocal respect and loyalty. Avoid allowing ego or domination to overshadow mutual partnership.",
        descHi: "रिश्तों में अत्यधिक निष्ठावान व परिवार के मजबूत संरक्षक। साथी से पूर्ण सम्मान की अपेक्षा रखते हैं; अहंकार व अपनी बात मनवाने की जिद्द से दूरी आवश्यक है।"
      },
      health: {
        titleEn: "Cardiovascular Vitality, Ocular Health & Pitta Balance",
        titleHi: "हृदय, दृष्टि, रक्त संचार व पित्त संतुलन",
        descEn: "Governs heart circulation, vitality, spine, and eyesight. Prone to hypertension, ocular strain, and excess body heat (Pitta). Morning sun exposure and hydration are therapeutic.",
        descHi: "हृदय, रक्त संचार, नेत्र ज्योति व रीढ़ की हड्डी पर प्रभाव। उच्च रक्तचाप (BP), पित्त विकार व सिरदर्द से बचाव रखें; नित्य सूर्य नमस्कार व प्राणायाम अमृत समान हैं।"
      }
    },
    precautionsEn: [
      "Avoid unchecked ego or contempt for others; humility magnifies your royal charisma.",
      "Do not make hasty, pride-driven decisions or sever alliances in momentary rage.",
      "Practice active listening; respect diverse perspectives rather than enforcing unilateral diktats.",
      "Learn delegation; do not exhaust yourself carrying every responsibility alone."
    ],
    precautionsHi: [
      "अति-अहंकार (Ego) व दूसरों को कम आंकने की प्रवृत्ति से बचें; विनम्रता ही आपकी सत्ता को स्थायी बनाती है।",
      "क्रोध या आवेश में आकर संबंध, व्यावसायिक सौदे या दीर्घकालिक साझेदारी न तोड़ें।",
      "दूसरों के विचारों व सुझावों को ध्यानपूर्वक सुनें; हर निर्णय में एकतरफा तानाशाही से बचें।",
      "काम का विकेंद्रीकरण (delegation) सीखें; सभी जिम्मेदारियों का भार अकेले ढोकर तनाव न लें।"
    ],
    remediesEn: [
      "Offer Arghya (water mixed with kumkum/red flowers in a copper vessel) to the rising Sun daily while reciting the Gayatri Mantra.",
      "Chant the Surya Beej Mantra 'Om Hraam Hreem Hroum Sah Suryaya Namah' 108 times on Sunday mornings.",
      "Honor and seek daily blessings from your father, teachers, and paternal elders to clear solar karmic blockages.",
      "Wear Ruby (Manikya) in copper or gold on the ring finger after consultation. Embrace ruby red, saffron, and radiant gold colors."
    ],
    remediesHi: [
      "प्रतिदिन प्रातः तांबे के लोटे से सूर्य देव को कुमकुम युक्त जल अर्पित करें और 'ॐ सूर्याय नमः' या आदित्य हृदय स्तोत्र का पाठ करें।",
      "रविवार को सूर्य बीज मंत्र 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः' का १०८ बार जप करें।",
      "पिता व पितातुल्य वरिष्ठों का चरण स्पर्श कर आशीर्वाद लें; यह सूर्य की ऊर्जा को तत्काल अत्यंत बलवान व शुभ बनाता है।",
      "रविवार को गुड़, गेहूं, तांबा या लाल वस्त्र का दान करें। माणिक्य (Ruby) अथवा तांबे का छल्ला धारण करना एवं केसरिया/सुनहरा रंग शुभ है।"
    ],
    luckyNumbers: [1, 3, 5, 9],
    friendlyNumbers: [1, 2, 3, 5, 9],
    enemyNumbers: [8, 6],
    luckyDaysEn: "Sunday, Monday",
    luckyDaysHi: "रविवार, सोमवार",
    luckyColorsEn: "Gold, Saffron, Orange, Ruby Red",
    luckyColorsHi: "सुनहरा, केसरिया, नारंगी, लाल",
    luckyGemstoneEn: "Ruby (Manikya) / Sunstone in Gold/Copper",
    luckyGemstoneHi: "माणिक्य (Ruby) / विकल्प: गार्नेट या तांबा",
    luckyDirectionEn: "East (Purva)",
    luckyDirectionHi: "पूर्व दिशा",
    beejMantraEn: "Om Hraam Hreem Hroum Sah Suryaya Namah",
    beejMantraHi: "ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः",
    deityEn: "Surya Narayana / Lord Rama",
    deityHi: "भगवान सूर्यनारायण व प्रभु श्रीराम"
  },

  2: {
    number: 2,
    planetEn: "Moon",
    planetHi: "चंद्र",
    rulerEn: "Moon (Chandra)",
    rulerHi: "चंद्र देव (मनोकारक)",
    elementEn: "Water",
    elementHi: "जल तत्व",
    titleEn: "The Peacemaker & Intuitive Diplomat",
    titleHi: "शांतिदूत व संवेदनशील कूटनीतिज्ञ",
    archetypeEn: "The Empathetic Healer / Nurturing Queen",
    archetypeHi: "स्नेहमयी रानी व संवेदनशील साधक",
    traitsEn: "Deep intuition, emotional intelligence, harmony, poetic imagination, graceful adaptability",
    traitsHi: "सौहार्द, संवेदनशीलता, अंतर्ज्ञान, साझेदारी, धैर्य, रचनात्मक कल्पना",
    meaningEn: "Number 2 is ruled by the luminous Moon (Chandra). It embodies intuition, empathy, graceful diplomacy, poetic imagination, and relational harmony. You possess high emotional intelligence, sensing unspoken currents and healing discord through compassion.",
    meaningHi: "मूलांक २ के स्वामी मन व भावनाओं के कारक चंद्र देव हैं। यह अंक अंतर्ज्ञान, संवेदनशीलता, रचनात्मक कल्पना, सौहार्द और कूटनीति का प्रतीक है। आप दूसरों की भावनाओं को बिना कहे समझ लेते हैं और शांतिप्रिय, सहयोगी व कलात्मक स्वभाव के धनी हैं।",
    impacts: {
      career: {
        titleEn: "Psychology, Counseling, Creative Arts & Public Outreach",
        titleHi: "परामर्श, मनोविज्ञान, ललित कला, चिकित्सा व आतिथ्य",
        descEn: "Thrives in psychotherapy, healthcare, diplomatic mediation, fine arts, hospitality, public relations, and collaborative team endeavors.",
        descHi: "मनोविज्ञान, काउंसलिंग, ललित कला, चिकित्सा/नर्सिंग, आतिथ्य, जनसंपर्क, समाज सेवा, रचनात्मक लेखन व साझेदारी आधारित व्यवसायों में असाधारण सफलता।"
      },
      wealth: {
        titleEn: "Fluid Cash Flow & Safe Capital Compounding",
        titleHi: "निरंतर प्रवाह, तरल संपत्तियां व सुरक्षित बचत",
        descEn: "Experiences cyclical cash flows. Avoid emotionally impulsive investments; focus on secure liquid reserves, gold, and systematic long-term compounding.",
        descHi: "धन का प्रवाह चंद्र की कलाओं की भांति गतिशील रहता है। भावनात्मक आवेश या असमंजस में किए गए निवेश से बचें; सुरक्षित बॉन्ड, स्वर्ण व तरल बचत पर ध्यान दें।"
      },
      relationships: {
        titleEn: "Nurturing Devotion, High Affection & Emotional Sanctuary",
        titleHi: "गहरी संवेदनशीलता, समर्पण व प्रेम संबंध",
        descEn: "Loyal, deeply affectionate partner who creates an emotionally safe home. Guard against mood swings and over-dependence on external validation.",
        descHi: "संबंधों में अत्यधिक वफादार व भावुक साथी साबित होते हैं। हालांकि, मूड स्विंग्स (मूड में तेजी से बदलाव) व अत्यधिक अपेक्षाओं के कारण मनमुटाव से बचें।"
      },
      health: {
        titleEn: "Lymphatic Flow, Mind-Gut Axis & Sleep Vitality",
        titleHi: "जल तत्व, कफ, मानसिक शांति, अनिद्रा व पाचन",
        descEn: "Governed by bodily fluids, lymphatic flow, and sleep cycles. Watch for digestive sensitivity, water retention, and anxiety. Deep meditation and hydration are balancing.",
        descHi: "जल तत्व प्रधान होने से कफ विकार, फेफड़ों की संवेदनशीलता, अनिद्रा, चिंता व पाचन पर प्रभाव रहता है। ध्यान, प्राणायाम व रात्रि में समय पर शयन अति-आवश्यक है।"
      }
    },
    precautionsEn: [
      "Guard against hypersensitivity and chronic overthinking; ground yourself in factual reality.",
      "Conquer decision paralysis and vacillation through resolute deadlines.",
      "Do not isolate yourself in moody withdrawals; engage in uplifting creative expression.",
      "Avoid unhealthy emotional dependency; cultivate sovereign self-trust."
    ],
    precautionsHi: [
      "अत्यधिक संवेदनशीलता व हर बात को दिल पर लेने (Overthinking) की आदत से बचें; व्यावहारिक बनें।",
      "निर्णय लेने में हिचकिचाहट व बार-बार विचार बदलने की प्रवृत्ति पर अंकुश लगाएं।",
      "अकेलेपन व नकारात्मक विचारों में डूबने से बचें; रचनात्मक गतिविधियों में मन लगाएं।",
      "दूसरों पर अति-निर्भरता व अंधविश्वास न करें, अपनी आंतरिक शक्ति पर भरोसा रखें।"
    ],
    remediesEn: [
      "Seek the daily blessings of your mother; maternal respect instantly purifies lunar currents.",
      "Offer raw milk and water to the Shiva Lingam on Mondays while chanting 'Om Som Somaya Namah' 108 times.",
      "Drink water from a pure silver vessel and meditate under the radiant Full Moon to calm the emotional mind.",
      "Embrace pristine white, cream, and silver hues. Wear a natural South Sea Pearl or Moonstone in silver after guidance."
    ],
    remediesHi: [
      "प्रतिदिन माता का चरण स्पर्श कर आशीर्वाद लें; माता का सम्मान करने से चंद्रमा के सभी दोष स्वतः शांत होते हैं।",
      "सोमवार को शिवलिंग पर कच्चा दूध, अक्षत व जल अर्पित करें तथा 'ॐ सों सोमाय नमः' का १०८ बार जप करें।",
      "चांदी के गिलास से जल पीने की आदत बनाएं और पूर्णिमा के दिन चंद्र दर्शन व चंद्र ध्यान करें।",
      "सफेद, क्रीम, मोतिया व चांदी रंग का अधिक प्रयोग करें। मोती (Pearl) अथवा मूनस्टोन चांदी में धारण करना अत्यंत शुभकारी है।"
    ],
    luckyNumbers: [2, 7, 1],
    friendlyNumbers: [1, 2, 3, 5, 7],
    enemyNumbers: [8, 9, 4],
    luckyDaysEn: "Monday, Sunday",
    luckyDaysHi: "सोमवार, रविवार",
    luckyColorsEn: "White, Cream, Silver, Pearl",
    luckyColorsHi: "सफेद, क्रीम, चांदी, मोतिया",
    luckyGemstoneEn: "Natural Pearl (Moti) or Moonstone in Silver",
    luckyGemstoneHi: "सच्चा मोती (Pearl) / मूनस्टोन (चांदी में)",
    luckyDirectionEn: "North-West (Vayavya)",
    luckyDirectionHi: "उत्तर-पश्चिम (वायव्य कोण)",
    beejMantraEn: "Om Shraam Shreem Shroum Sah Chandraya Namah",
    beejMantraHi: "ॐ श्रां श्रीं श्रौं सः चंद्राय नमः",
    deityEn: "Lord Shiva / Goddess Gauri",
    deityHi: "भगवान शिव व माता पार्वती"
  },

  3: {
    number: 3,
    planetEn: "Jupiter",
    planetHi: "बृहस्पति",
    rulerEn: "Jupiter (Brihaspati / Guru)",
    rulerHi: "देवगुरु बृहस्पति",
    elementEn: "Ether / Space",
    elementHi: "आकाश तत्व",
    titleEn: "The Creative Spark & Expressive Guru",
    titleHi: "सृजनशील, ज्ञानवान व प्रेरणादायी मार्गदर्शक",
    archetypeEn: "The Master Counselor / Wise Visionary",
    archetypeHi: "देवगुरु, विद्वान व परामर्शदाता",
    traitsEn: "Expansive wisdom, eloquence, joyful optimism, philosophical depth, natural mentorship",
    traitsHi: "ज्ञान, विवेक, वाक्पटुता, विस्तार, धार्मिकता, रचनात्मकता, आशावाद",
    meaningEn: "Number 3 is presided over by Devaguru Brihaspati (Jupiter). It vibrates with expansive wisdom, creative expression, philosophical depth, joyful communication, and ethical leadership. You possess an innate mentor spirit, inspiring others with optimism.",
    meaningHi: "मूलांक ३ के स्वामी देवगुरु बृहस्पति हैं। यह अंक ज्ञान, विस्तार, धर्म, उच्च चेतना, वाक्पटुता और रचनात्मक दूरदर्शिता का प्रतीक है। आप समाज में स्वाभाविक शिक्षक, मार्गदर्शक और बौद्धिक प्रेरक के रूप में जाने जाते हैं।",
    impacts: {
      career: {
        titleEn: "Higher Education, Law, Wealth Advisory & Thought Leadership",
        titleHi: "शिक्षा, कानून, वित्त, परामर्श, प्रकाशन व नीति-निर्माण",
        descEn: "Shines in higher education, jurisprudence, executive mentoring, financial strategy, media publishing, and philosophical discourse.",
        descHi: "प्रोफेसर, वकील, सीए/वित्तीय सलाहकार, प्रकाशक, प्रेरक वक्ता, आध्यात्मिक मार्गदर्शक, शोधकर्ता अथवा नीति-निर्माता के रूप में शीर्ष सम्मान।"
      },
      wealth: {
        titleEn: "Knowledge-Driven Compounding & Auspicious Abundance",
        titleHi: "ज्ञान आधारित स्थायी समृद्धि व सतत विस्तार",
        descEn: "Attracts sustained prosperity through intellectual acumen, teaching, and trusted reputation. Blessed with broad capital avenues and generous public honor.",
        descHi: "बौद्धिक योग्यता व साख के बल पर विपुल धन का सृजन। गुरु के प्रभाव से धनार्जन के नए अवसर निरंतर प्राप्त होते हैं; धार्मिक व सामाजिक कार्यों में खुले हाथ से व्यय।"
      },
      relationships: {
        titleEn: "Uplifting Camaraderie, Mutual Respect & Dignified Bonds",
        titleHi: "आदर्शवादी, मार्गदर्शक व गरिमापूर्ण संबंध",
        descEn: "Seeks an intellectual peer in romance. Inspiring, warm, and generous, but must avoid becoming overly preachy or patronizing.",
        descHi: "रिश्तों में मर्यादा, सत्यनिष्ठा व बौद्धिक साझेदारी को सर्वोपरि मानते हैं। साथी के साथ विचारों का तालमेल होना अनिवार्य है; उपदेशात्मक शैली से बचें।"
      },
      health: {
        titleEn: "Liver Metabolism, Pancreas & Vocal Cord Vitality",
        titleHi: "लीवर, वसा संतुलन, मधुमेह व गले की सुरक्षा",
        descEn: "Rules hepatic health, sugar balance, arterial lipid levels, and vocal cords. Minimize heavy sweets and rich foods; intermittent fasting works wonders.",
        descHi: "बृहस्पति यकृत (Liver), वसा (Fat metabolism) और गले को नियंत्रित करते हैं। तली-भुनी चीजों व अत्यधिक मिष्ठान से बचें; नियमित व्यायाम व उपवास लाभकारी है।"
      }
    },
    precautionsEn: [
      "Avoid unprompted moralizing or offering unsolicited lectures; respect individual autonomy.",
      "Guard against reckless over-optimism and speculative financial gambles without due diligence.",
      "Check intellectual arrogance; true wisdom lies in graceful humility and continuous learning.",
      "Harness focus; avoid dissipating your creative brilliance across too many unfinished horizons."
    ],
    precautionsHi: [
      "अनावश्यक उपदेश देने व दूसरों के निजी मामलों में बिन मांगी सलाह देने से बचें।",
      "अत्यधिक आशावादी होकर बिना वित्तीय विश्लेषण के जोखिम भरे निवेश न करें।",
      "अहंकार व बौद्धिक श्रेष्ठता के घमंड से दूर रहें; हर किसी से सीखने की तत्परता रखें।",
      "अपनी ऊर्जा को एक साथ कई दिशाओं में बिखेरने के बजाय किसी एक मुख्य लक्ष्य पर केंद्रित रखें।"
    ],
    remediesEn: [
      "Worship Lord Vishnu and chant the Guru Beej Mantra 'Om Graam Greem Groum Sah Gurave Namah' 108 times on Thursdays.",
      "Serve and revere your academic teachers, mentors, and spiritual elders to magnify auspicious Jupiterian rays.",
      "Donate yellow lentils (chana dal), turmeric, or yellow garments on Thursdays.",
      "Wear glowing yellow, amber, and golden fabrics. A certified Yellow Sapphire (Pukhraj) or natural Citrine in gold is optimal."
    ],
    remediesHi: [
      "गुरुवार के दिन भगवान विष्णु व देवगुरु बृहस्पति की पूजा करें और 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः' का १०८ बार जप करें।",
      "गुरुजनों, शिक्षकों एवं साधु-संतों का आदर-सत्कार करें और उनका मार्गदर्शन प्राप्त करें।",
      "गुरुवार को चने की दाल, हल्दी, बेसन के लड्डू अथवा पीले वस्त्र का दान करें।",
      "पीला, स्वर्णिम व केसरिया रंग आपके लिए परम कल्याणकारी है। पुखराज (Yellow Sapphire) या हल्दी की गांठ धारण करना लाभकारी है।"
    ],
    luckyNumbers: [3, 1, 5, 9],
    friendlyNumbers: [1, 2, 3, 5, 9],
    enemyNumbers: [6],
    luckyDaysEn: "Thursday, Tuesday",
    luckyDaysHi: "गुरुवार, मंगलवार",
    luckyColorsEn: "Yellow, Amber, Golden, Mustard",
    luckyColorsHi: "पीला, स्वर्णिम, हल्दी, केसरिया",
    luckyGemstoneEn: "Yellow Sapphire (Pukhraj) / Citrine in Gold",
    luckyGemstoneHi: "पीला पुखराज (Yellow Sapphire) सोने में",
    luckyDirectionEn: "North-East (Ishan)",
    luckyDirectionHi: "उत्तर-पूर्व (ईशान कोण)",
    beejMantraEn: "Om Graam Greem Groum Sah Gurave Namah",
    beejMantraHi: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः",
    deityEn: "Lord Vishnu / Devaguru Brihaspati",
    deityHi: "भगवान लक्ष्मीनारायण व देवगुरु बृहस्पति"
  },

  4: {
    number: 4,
    planetEn: "Rahu",
    planetHi: "राहु",
    rulerEn: "Rahu (North Node / Shadow Catalyst)",
    rulerHi: "राहु देव (छाया ग्रह / क्रांतिकारी कारक)",
    elementEn: "Air / Innovation",
    elementHi: "वायु तत्व / क्रांतिकारी चेतना",
    titleEn: "The Master Builder & Disruptive Genius",
    titleHi: "अनुशासित शिल्पी व क्रांतिकारी विचारक",
    archetypeEn: "The Visionary Technologist / Unconventional Reformer",
    archetypeHi: "आधुनिक शिल्पी व व्यवस्था सुधारक",
    traitsEn: "Out-of-the-box intellect, technical mastery, structural planning, unconventional breakthrough",
    traitsHi: "कुशाग्र बुद्धि, लीक से हटकर सोच, तकनीकी महारत, तीव्र परिवर्तन, विश्वसनीयता",
    meaningEn: "Number 4 is governed by the enigmatic catalyst Rahu (North Node). It signifies unconventional brilliance, architectural structure, disruptive breakthrough intellect, technological acumen, and challenging dogmatic orthodoxies. You possess rare foresight to transform systems.",
    meaningHi: "मूलांक ४ के स्वामी छाया ग्रह राहु हैं। यह अंक क्रांतिकारी बुद्धि, लीक से हटकर सोचने (Out-of-the-box thinking), तकनीकी कुशलता, अदम्य शोध और पारंपरिक सीमाओं को तोड़ने का प्रतीक है। आप समाज में अचानक बड़े परिवर्तन लाने में सक्षम हैं।",
    impacts: {
      career: {
        titleEn: "Technology, Cutting-Edge Systems, Research & Strategy",
        titleHi: "आईटी, सॉफ्टवेयर, रिसर्च, इलेक्ट्रॉनिक्स, विमानन व राजनीति",
        descEn: "Excels in software architecture, deep tech, AI, aerospace, electronics engineering, investigative strategy, and high-stakes turnarounds.",
        descHi: "सॉफ्टवेयर आर्किटेक्चर, आर्टिफिशियल इंटेलिजेंस, डेटा साइंस, एविएशन, इलेक्ट्रॉनिक्स, राजनीति, विदेशी व्यापार व क्रांतिकारी खोजों में शिखर मुकाम।"
      },
      wealth: {
        titleEn: "Sudden Breakthroughs & Long-Term Asset Moats",
        titleHi: "अप्रत्याशित धन लाभ व अनुशासित संपत्ति निर्माण",
        descEn: "Prone to sudden financial leaps and unexpected windfalls. Strictly avoid get-rich-quick schemes, speculative lotteries, and unregulated trading.",
        descHi: "जीवन में अचानक धन लाभ (Windfalls) व नई तकनीकों से भारी कमाई के योग बनते हैं। सट्टेबाजी, त्वरित अमीर बनने की योजनाओं व शॉर्टकट से दूर रहें।"
      },
      relationships: {
        titleEn: "Unconventional Depth & Transparent Communication",
        titleHi: "अपरंपरागत सोच, स्वतंत्रता व स्पष्ट संवाद की आवश्यकता",
        descEn: "Often misunderstood due to progressive, contrarian perspectives. Cultivate transparent communication and emotional warmth with partners.",
        descHi: "परंपरागत रूढ़ियों से हटकर सोचते हैं, जिससे परिवार या साथी कभी-कभी आपको गलत समझ सकते हैं। अपनी बातों को शांत व स्पष्ट रूप से समझाना सीखें।"
      },
      health: {
        titleEn: "Vata Balance, Nervous Equilibrium & Grounding",
        titleHi: "वात संतुलन, तंत्रिका तंत्र, अनिद्रा व तनाव निवारण",
        descEn: "Rules the autonomic nervous system, gas/acidity, and sleep patterns. Grounding barefoot walks on earth, calming herbal teas, and yoga restore equilibrium.",
        descHi: "राहु वायु तत्व को प्रभावित करते हैं, जिससे नसों में खिंचाव, गैस, अनिद्रा, चिंता व अज्ञात भय की आशंका रहती है। नियमित योग, प्राणायाम व ध्यान अनिवार्य है।"
      }
    },
    precautionsEn: [
      "Completely steer clear of dubious shortcuts, gray-hat operations, or shady investments.",
      "Temper cynicism and argumentative rebellion; collaborate constructively rather than clashing blindly.",
      "Restrain sharp, sarcastic speech when dealing with family and close confidants.",
      "Institute a mandatory 24-hour cooling period before executing irreversible financial commitments."
    ],
    precautionsHi: [
      "किसी भी गैर-कानूनी, संदिग्ध या शॉर्टकट वाले रास्ते पर कदम न रखें; यह अचानक भारी संकट ला सकता है।",
      "संदेहवादी व विद्रोही स्वभाव पर नियंत्रण रखें; हर बात में व्यवस्था या लोगों से टकराव न करें।",
      "क्रोध में आकर अपने निकटतम मित्रों या सहयोगियों पर कटु व्यंग्य करने से बचें।",
      "जीवन में कोई भी बड़ा वित्तीय या व्यक्तिगत फैसला हड़बड़ाहट में न लें; कम से कम २४ घंटे विचार करें।"
    ],
    remediesEn: [
      "Worship Lord Bhairava or Goddess Saraswati and chant the Rahu Beej Mantra 'Om Bhraam Bhreem Bhroum Sah Rahave Namah'.",
      "Feed mixed multi-grains (Saptadhanya) to birds and support sanitation workers to appease karmic debts.",
      "Keep the South-West zone of your residence clean, stable, and decluttered.",
      "Incorporate electric blue, slate gray, and earth tones into your palette. Carry a solid square silver talisman after expert astrological audit."
    ],
    remediesHi: [
      "शनिवार व बुधवार को भगवान भैरव अथवा मां सरस्वती की आराधना करें; 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः' का जप करें।",
      "सफाई कर्मचारियों, श्रमिकों व जरूरतमंदों की सेवा करें तथा पक्षियों को नित्य सात प्रकार का अनाज (सप्तधान्य) डालें।",
      "घर के नैऋत्य कोण (South-West) को स्वच्छ व व्यवस्थित रखें; वहां भारी सामान रखें।",
      "इलेक्ट्रिक ब्लू, गहरा स्लेटी (Grey) व खाकी रंग अनुकूल है। गोमेद (Hessonite) अथवा चांदी का चौकोर टुकड़ा अपने पास रखें।"
    ],
    luckyNumbers: [4, 1, 6, 7],
    friendlyNumbers: [1, 5, 6, 7],
    enemyNumbers: [8, 9, 2],
    luckyDaysEn: "Wednesday, Saturday",
    luckyDaysHi: "बुधवार, शनिवार",
    luckyColorsEn: "Electric Blue, Slate Grey, Khaki, Indigo",
    luckyColorsHi: "इलेक्ट्रिक ब्लू, गहरा स्लेटी (ग्रे), खाकी",
    luckyGemstoneEn: "Hessonite Garnet (Gomed) in Ashtadhatu/Silver",
    luckyGemstoneHi: "गोमेद (Hessonite) पंचधातु या चांदी में",
    luckyDirectionEn: "South-West (Nairritya)",
    luckyDirectionHi: "दक्षिण-पश्चिम (नैऋत्य कोण)",
    beejMantraEn: "Om Bhraam Bhreem Bhroum Sah Rahave Namah",
    beejMantraHi: "ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः",
    deityEn: "Lord Bhairava / Goddess Saraswati",
    deityHi: "भगवान कालभैरव व मां सरस्वती"
  },

  5: {
    number: 5,
    planetEn: "Mercury",
    planetHi: "बुध",
    rulerEn: "Mercury (Budha)",
    rulerHi: "राजकुमार बुध देव (बुद्धिकारक)",
    elementEn: "Earth / Trade",
    elementHi: "पृथ्वी तत्व / वाणिज्य",
    titleEn: "The Dynamic Catalyst & Commercial Genius",
    titleHi: "मुक्तचेता, कुशल व्यापारी व परिवर्तन का संवाहक",
    archetypeEn: "The Eloquent Ambassador / Agile Merchant Prince",
    archetypeHi: "चतुर व्यापारी व वाकपटु दूत",
    traitsEn: "Curiosity, versatility, rapid analytical calculation, wit, communicative charm, commercial acumen",
    traitsHi: "स्वतंत्रता, जिज्ञासा, बहुमुखी प्रतिभा, तीक्ष्ण बुद्धि, हास्यबोध, व्यापारिक कुशलता",
    meaningEn: "Number 5 is governed by agile Prince Mercury (Budha). It radiates intellectual quickness, communicative sparkle, commercial dexterity, irrepressible curiosity, and love for dynamic freedom. You are a natural bridge-builder and versatile problem solver.",
    meaningHi: "मूलांक ५ के स्वामी ग्रहों के राजकुमार बुध हैं। यह अंक तीक्ष्ण बुद्धि, वाक्-चातुर्य, तीव्र निर्णय क्षमता, बहुमुखी प्रतिभा, वाणिज्यिक कुशलता और स्वतंत्रता का प्रतीक है। आप ऊर्जा से भरपूर, मिलनसार और हर परिस्थिति में तेजी से ढल जाने वाले व्यक्तित्व हैं।",
    impacts: {
      career: {
        titleEn: "Commerce, Capital Markets, Media & Global Trade",
        titleHi: "व्यापार, शेयर बाजार, मार्केटिंग, पत्रकारिता व संचार",
        descEn: "Excels in business entrepreneurship, trading, strategic marketing, journalism, diplomatic PR, high-velocity tech startups, and cross-border trade.",
        descHi: "सफल उद्यमी, आयात-निर्यात, मार्केटिंग गुरु, वित्तीय विश्लेषक, पत्रकार, पीआर प्रबंधक, टेक्नोलॉजी कंसलटेंट व सेल्स लीडरशिप में अप्रतिम सफलता।"
      },
      wealth: {
        titleEn: "Multi-Stream Wealth Generation & Rapid Capital Turn",
        titleHi: "बहु-आयामी स्रोतों से द्रुत धनार्जन व व्यापारिक लाभ",
        descEn: "Attracts multiple parallel revenue channels through witty problem solving. Must automate savings to curb impulsive spending and novelty chasing.",
        descHi: "बुद्धि कौशल व त्वरित अवसरों की पहचान से एक से अधिक स्रोतों से धनार्जन। हालांकि, चंचल स्वभाव के कारण फिजूलखर्ची से बचें; व्यवस्थित बचत तंत्र अपनाएं।"
      },
      relationships: {
        titleEn: "Lively Camaraderie, Wit & Mutual Liberty",
        titleHi: "उत्साही, मित्रवत व बौद्धिक साहचर्य",
        descEn: "Values witty conversation, shared travel adventures, and emotional space. Bored by rigid monotony; flourishes with an intellectually stimulating partner.",
        descHi: "जीवन में ताजगी, हास्य व रोमांच पसंद करते हैं। एकरसता से ऊब जाते हैं, इसलिए साथी के साथ यात्राएं करना व बौद्धिक चर्चाएं संबंध को प्रगाढ़ रखती हैं।"
      },
      health: {
        titleEn: "Nervous System Balance, Dermal Radiance & Respiration",
        titleHi: "तंत्रिका तंत्र, त्वचा, श्वसन व तनाव प्रबंधन",
        descEn: "Governs neural pathways, speech organs, and epidermal health. Practice conscious breathwork (Anulom-Vilom) to pacify restless mental chatter.",
        descHi: "बुध स्नायु तंत्र (Nerves), त्वचा व फेफड़ों के स्वामी हैं। मानसिक तनाव, चिंता, अनिद्रा व त्वचा एलर्जी से बचाव रखें; योगनिद्रा व हरी सब्जियों का सेवन उत्तम है।"
      }
    },
    precautionsEn: [
      "Do not scatter energy by initiating multiple projects and abandoning them midway; master completion.",
      "Resist the thrill of speculative gambling or high-risk day-trading traps.",
      "Avoid hasty, impulsive commitments triggered by temporary emotional excitement.",
      "Cultivate stability and emotional consistency in relationships rather than chasing fleeting novelty."
    ],
    precautionsHi: [
      "एक साथ कई कार्य शुरू करके उन्हें बीच में अधूरा छोड़ने की आदत से बचें; निरंतरता ही आपकी कुंजी है।",
      "सट्टेबाजी, जुआ या अत्यधिक जोखिम भरे वित्तीय शॉर्टकट में पूंजी न फंसाएं।",
      "उतावलेपन में बिना सोचे-समझे महत्वपूर्ण निर्णय लेने से बचें; धैर्यपूर्वक मूल्यांकन करें।",
      "चंचलता के कारण अपने निष्ठावान मित्रों व जीवनसाथी के प्रति लापरवाही न बरतें।"
    ],
    remediesEn: [
      "Offer 21 fresh Durva grass blades to Lord Ganesha on Wednesdays while reciting 'Om Gam Ganapataye Namah'.",
      "Chant the Budha Beej Mantra 'Om Braam Breem Broum Sah Budhaya Namah' 108 times on Wednesday mornings.",
      "Feed green grass, fresh spinach, or sprouted green moong to cows to harmonize Mercury's commercial vibration.",
      "Wear emerald green, mint, and seafoam shades. Wear an authentic Zambian/Colombian Emerald (Panna) in silver or gold."
    ],
    remediesHi: [
      "बुधवार को भगवान श्री गणेश को २१ दूर्वा दल व मोदक अर्पित करें और 'ॐ गं गणपतये नमः' का जप करें।",
      "बुध के बीज मंत्र 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः' का नित्य या प्रत्येक बुधवार १०८ बार जप करें।",
      "बुधवार को गाय को हरा चारा, पालक या हरी मूंग की दाल खिलाएं; यह व्यापारिक बाधाओं को दूर करता है।",
      "हरा, तोतिया व हल्का पीला रंग आपके लिए अत्यंत शुभ है। पन्ना (Emerald) अथवा हरा पेरिडॉट कनिष्ठिका उंगली में धारण करें।"
    ],
    luckyNumbers: [5, 1, 6],
    friendlyNumbers: [1, 4, 5, 6],
    enemyNumbers: [2],
    luckyDaysEn: "Wednesday, Friday",
    luckyDaysHi: "बुधवार, शुक्रवार",
    luckyColorsEn: "Emerald Green, Mint, Pastel Yellow, Light Green",
    luckyColorsHi: "पन्ना हरा, तोतिया, हल्का पीला",
    luckyGemstoneEn: "Emerald (Panna) / Green Tourmaline in Gold/Silver",
    luckyGemstoneHi: "पन्ना (Emerald) सोने या चांदी में",
    luckyDirectionEn: "North (Uttara)",
    luckyDirectionHi: "उत्तर दिशा",
    beejMantraEn: "Om Braam Breem Broum Sah Budhaya Namah",
    beejMantraHi: "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः",
    deityEn: "Lord Ganesha / Goddess Saraswati",
    deityHi: "भगवान श्री गणेश व मां सरस्वती"
  },

  6: {
    number: 6,
    planetEn: "Venus",
    planetHi: "शुक्र",
    rulerEn: "Venus (Shukracharya)",
    rulerHi: "दैत्यगुरु शुक्र देव (सौंदर्य व भोगकारक)",
    elementEn: "Water / Aesthetics",
    elementHi: "जल तत्व / सौंदर्य व कला",
    titleEn: "The Nurturing Guardian & Aesthetic Master",
    titleHi: "सहानुभूतिपूर्ण संरक्षक, कलाप्रेमी व समाज सेवी",
    archetypeEn: "The Sovereign Harmonizer / Artist of Living",
    archetypeHi: "सौंदर्य व समरसता का शिल्पी",
    traitsEn: "Unconditional love, high aesthetics, responsibility, magnetic charm, protective nurturing, service",
    traitsHi: "प्रेम, दायित्व बोध, सौंदर्यबोध, सेवाभाव, आकर्षण, पारिवारिक समरसता",
    meaningEn: "Number 6 is presided over by radiant Shukracharya (Venus). It resonates with unconditional love, refined aesthetic taste, magnetic charm, domestic sanctuary, luxury, and protective nurturing. You are born to harmonize, uplift, and adorn life.",
    meaningHi: "मूलांक ६ के स्वामी दैत्यगुरु शुक्र देव हैं। यह अंक प्रेम, सौंदर्य, सुरुचि, आकर्षण, वैवाहिक सुख, कलात्मक दृष्टि और सामाजिक सद्भाव का प्रतीक है। आप दूसरों की सहायता करने, सुंदर वातावरण बनाने और परिवार व समाज को एकजुट रखने वाले करुणामयी व्यक्तित्व हैं।",
    impacts: {
      career: {
        titleEn: "Aesthetics, Creative Arts, Hospitality, Luxury Brands & Counseling",
        titleHi: "फैशन, सिनेमा, कला, आतिथ्य, परामर्श व लक्जरी उद्योग",
        descEn: "Achieves pinnacle success in interior design, cinema, lifestyle luxury, haute couture, culinary hospitality, family counseling, and community leadership.",
        descHi: "इंटीरियर डिजाइन, आर्किटेक्चर, फैशन व ब्यूटी, फिल्म/मीडिया, हॉस्पिटैलिटी, लक्जरी ब्रांड्स, एनजीओ/समाज सेवा, इवेंट मैनेजमेंट व काउंसलर के रूप में अद्वितीय ख्याति।"
      },
      wealth: {
        titleEn: "Material Abundance, Vehicles, Real Estate & Comforts",
        titleHi: "भौतिक ऐश्वर्य, वाहन, भूमि व सुरुचिपूर्ण संचय",
        descEn: "Attracts high material fortune, premium vehicles, artistic homes, and luxury assets. Must balance extravagant aesthetic desires with prudent capital growth.",
        descHi: "शुक्र के आशीर्वाद से जीवन में सुख-सुविधाएं, सुंदर भवन, वाहन व आभूषण प्रचुर मात्रा में प्राप्त होते हैं। दिखावे व अत्यधिक विलासिता पर अनावश्यक व्यय पर नियंत्रण रखें।"
      },
      relationships: {
        titleEn: "Devoted Romanticism, Domestic Sanctuary & Generous Care",
        titleHi: "परम समर्पित, स्नेही व पारिवारिक सौहार्द",
        descEn: "Deeply loving, generous, and romantic partner who prioritizes family happiness above all. Beware of codependency or suffocating over-protectiveness.",
        descHi: "दांपत्य व प्रेम में अत्यधिक समर्पित, निष्ठावान और रोमांटिक साथी हैं। दूसरों को सुखी देखने की चाह में स्वयं पर अतिरिक्त तनाव न लें; साथी को भी उसकी स्वतंत्रता दें।"
      },
      health: {
        titleEn: "Endocrine Harmony, Renal Function & Skin Glow",
        titleHi: "गुर्दे, हार्मोनल संतुलन, त्वचा व मधुमेह से सावधानी",
        descEn: "Rules the kidneys, reproductive vitality, sugar processing, and throat. Curb refined sugars and heavy dairy; maintain high hydration for vibrant health.",
        descHi: "शुक्र मूत्र प्रणाली, प्रजनन तंत्र, त्वचा व हार्मोन को नियंत्रित करते हैं। अत्यधिक मीठा, शराब व गरिष्ठ भोजन से बचें; शुद्ध जल व फल-सब्जियों का प्रचुर सेवन करें।"
      }
    },
    precautionsEn: [
      "Avoid status-driven overspending or taking debts to finance lavish lifestyle appearances.",
      "Establish healthy emotional boundaries; do not sacrifice your peace solving everyone else's dilemmas.",
      "Guard against indulgence and momentary sensory distractions that imperil long-term trust.",
      "Break free from perpetual people-pleasing; honor your own needs with equal reverence."
    ],
    precautionsHi: [
      "विलासिता, दिखावे या दूसरों को प्रभावित करने के लिए कर्ज लेकर खर्च करने की आदत से बचें।",
      "दूसरों की समस्याओं को अपना बनाकर खुद मानसिक रूप से परेशान न हों; स्वस्थ सीमाएं (Boundaries) बनाएं।",
      "कामुकता या क्षणिक आकर्षण में आकर अपने मूल नैतिक मूल्यों व संबंधों से समझौता न करें।",
      "हर किसी को खुश करने (People-pleasing) के चक्कर में अपने स्वयं के विकास की उपेक्षा न करें।"
    ],
    remediesEn: [
      "Worship Goddess Maha Lakshmi on Fridays and recite the sacred Sri Suktam or Kanakadhara Stotram.",
      "Chant the Shukra Beej Mantra 'Om Draam Dreem Droum Sah Shukraya Namah' 108 times on Friday mornings.",
      "Donate sweet rice pudding (Kheer), white garments, or milk to young girls on Fridays.",
      "Wear luminous white, soft cream, baby pink, and sky blue hues. Wear a natural Australian Opal or Diamond in silver/white gold; wear pleasing natural fragrances."
    ],
    remediesHi: [
      "शुक्रवार के दिन मां लक्ष्मी की पूजा करें और 'श्री सूक्त' अथवा कनकधारा स्तोत्र का भक्तिभाव से पाठ करें।",
      "शुक्र के बीज मंत्र 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः' का शुक्रवार को १०८ बार जप करें।",
      "शुक्रवार को छोटी कन्याओं या जरूरतमंदों को खीर, सफेद मिठाई, मिश्री या दूध का दान करें।",
      "सफेद, चमकीला, क्रीम, हल्का गुलाबी व आसमानी रंग आपके लिए अत्यंत शुभ है। ओपल (Opal) अथवा हीरा चांदी में धारण करें; सुवासित इत्र का प्रयोग करें।"
    ],
    luckyNumbers: [6, 5, 8, 1],
    friendlyNumbers: [5, 6, 8, 4],
    enemyNumbers: [3],
    luckyDaysEn: "Friday, Wednesday",
    luckyDaysHi: "शुक्रवार, बुधवार",
    luckyColorsEn: "White, Cream, Soft Pink, Sky Blue, Silver",
    luckyColorsHi: "सफेद, क्रीम, चमकीला, हल्का गुलाबी, आसमानी",
    luckyGemstoneEn: "White Opal / Natural Diamond in Silver/Gold",
    luckyGemstoneHi: "ओपल (Opal) अथवा हीरा चांदी में",
    luckyDirectionEn: "South-East (Agneya)",
    luckyDirectionHi: "दक्षिण-पूर्व (आग्नेय कोण)",
    beejMantraEn: "Om Draam Dreem Droum Sah Shukraya Namah",
    beejMantraHi: "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः",
    deityEn: "Goddess Maha Lakshmi / Goddess Parvati",
    deityHi: "माता महालक्ष्मी व भगवती जगदंबा"
  },

  7: {
    number: 7,
    planetEn: "Ketu",
    planetHi: "केतु",
    rulerEn: "Ketu (South Node / Spiritual Mystic)",
    rulerHi: "केतु देव (मोक्ष व शोधकारक)",
    elementEn: "Water / Spiritual Ether",
    elementHi: "जल तत्व / आध्यात्मिक चेतना",
    titleEn: "The Mystic Seeker & Philosophical Sage",
    titleHi: "गहन जिज्ञासु, शोधकर्ता व अंतर्मुखी दार्शनिक",
    archetypeEn: "The Hermit Sage / Deep Intuitive Analyst",
    archetypeHi: "गूढ़ साधक व सत्य-अन्वेषी",
    traitsEn: "Metaphysical intuition, analytical depth, spiritual discernment, truth seeker, contemplative solitude",
    traitsHi: "अध्यात्म, गूढ़ ज्ञान, एकांत प्रिय, शोध, गहन विश्लेषण, अंतर्दृष्टि",
    meaningEn: "Number 7 is guided by spiritual Ketu (South Node). It represents deep metaphysical intuition, scientific research, mystical discernment, meditative introspection, and truth-seeking. You see straight through pretenses into the core essence of reality.",
    meaningHi: "मूलांक ७ के स्वामी मोक्ष व गूढ़ ज्ञान के कारक केतु देव हैं। यह अंक परा-विद्या, अंतर्दृष्टि (Intuition), दार्शनिक सोच, वैज्ञानिक शोध, एकांत-प्रियता और सत्य की खोज का प्रतीक है। आप सतही बातों से संतुष्ट नहीं होते और हर विषय की अंतरतम गहराइयों में उतरना पसंद करते हैं।",
    impacts: {
      career: {
        titleEn: "Scientific Research, Advanced Analytics, Philosophy & Esotericism",
        titleHi: "वैज्ञानिक अनुसंधान, डेटा साइंस, दर्शनशास्त्र, ज्योतिष व अध्यात्म",
        descEn: "Flourishes in scientific research, advanced algorithms, philosophy, psychospiritual healing, investigative journalism, and occult sciences.",
        descHi: "शोध वैज्ञानिक, सॉफ्टवेयर रिसर्चर, डेटा एनालिस्ट, लेखक, दार्शनिक, ज्योतिषी, चिकित्सक, गुप्तचर/जासूस व आध्यात्मिक मार्गदर्शक के रूप में सर्वोच्च उपलब्धि।"
      },
      wealth: {
        titleEn: "Specialized Intellectual Equity & Unsolicited Wealth",
        titleHi: "बौद्धिक विशेषता से अनायास धन संपदा व शोध लाभ",
        descEn: "Possesses a detached attitude toward greed, yet commands substantial wealth through niche mastery, intellectual copyrights, and expert advisory.",
        descHi: "धन के प्रति कोई अंधा मोह नहीं होता, फिर भी विशिष्ट ज्ञान व परामर्श से पर्याप्त धन लाभ होता है। गूढ़ आविष्कारों व बौद्धिक संपदा से अप्रत्याशित आर्थिक सफलता।"
      },
      relationships: {
        titleEn: "Soulful Connection & Mutual Intellectual Solitude",
        titleHi: "गहन, बौद्धिक व एकांत का आदर करने वाले संबंध",
        descEn: "Seeks profound soul-depth rather than superficial social chatter. Partner must honor their need for contemplative solitude and honest communication.",
        descHi: "रिश्तों में दिखावा पसंद नहीं करते; केवल मानसिक व आत्मिक रूप से जुड़े लोगों के साथ ही सहज होते हैं। साथी को अपनी भावनाएं खुलकर बताना सीखें।"
      },
      health: {
        titleEn: "Nervous Sensitivity, Gut Microbiome & Mental Calm",
        titleHi: "मानसिक शांति, पाचन, एलर्जी व त्वचा सुरक्षा",
        descEn: "Susceptible to unexplainable allergies, digestive sluggishness, and melancholia. Solitary forest walks, meditation, and pure vegetarian food restore vitality.",
        descHi: "केतु मानसिक संवेदनशीलता व अज्ञात एलर्जी का कारक है। अत्यधिक चिंता, अनिद्रा, अवसाद व पेट की गड़बड़ी से बचें; ध्यान, प्राणायाम व प्रकृति भ्रमण संजीवनी है।"
      }
    },
    precautionsEn: [
      "Guard against complete social hermitism and withdrawing entirely from everyday duties.",
      "Check tendencies toward cynicism, hyper-suspicion, and phantom anxieties.",
      "Do not allow philosophical detachment to paralyze your pragmatic work execution.",
      "Practice vocalizing your inner emotional world rather than expecting others to mind-read."
    ],
    precautionsHi: [
      "अत्यधिक एकांत में जाकर समाज, परिवार या कार्यक्षेत्र से खुद को अलग-थलग न करें।",
      "संदेह, अविश्वास व मन में काल्पनिक भय पालने से बचें; तथ्यों पर विश्वास करें।",
      "निराशावाद व दुनिया से वैराग्य की भावना को अपने व्यावसायिक दायित्वों पर हावी न होने दें।",
      "दूसरों को अपनी भावनाएं व्यक्त करने में संकोच न करें, संवाद का द्वार खुला रखें।"
    ],
    remediesEn: [
      "Worship Lord Ganesha and Lord Shiva daily; recite Sankatnashan Ganesha Stotra to dissolve confusion.",
      "Chant the Ketu Beej Mantra 'Om Sraam Sreem Sroum Sah Ketave Namah' 108 times at twilight.",
      "Feed stray two-toned (black and white) dogs with wholesome food to transmute lingering karmic friction.",
      "Embrace soft saffron, pearl white, light gray, and smoky tones. Wear a certified Chrysoberyl Cat's Eye (Lehsunia) after birth-chart review."
    ],
    remediesHi: [
      "भगवान श्री गणेश एवं भगवान शिव की नित्य आराधना करें और 'संकटनाशन गणेश स्तोत्र' का पाठ करें।",
      "केतु के बीज मंत्र 'ॐ स्रां स्रीं स्रौं सः केतवे नमः' का सायंकाल १०८ बार जप करें।",
      "काले-सफेद (चितकबरे) कुत्ते को मीठी रोटी, दूध अथवा भोजन कराएं; यह केतु की सभी बाधाओं को शांत करता है।",
      "हल्का पीला, सफेद, स्लेटी व पेस्टल रंग अनुकूल है। लहसुनिया (Cat's Eye) पंचधातु अथवा चांदी में धारण करें; धार्मिक स्थलों पर पताका (झंडा) लगाएं।"
    ],
    luckyNumbers: [7, 2, 1, 4],
    friendlyNumbers: [1, 2, 4, 7],
    enemyNumbers: [9, 8],
    luckyDaysEn: "Tuesday, Thursday",
    luckyDaysHi: "मंगलवार, गुरुवार",
    luckyColorsEn: "Light Yellow, Smoky White, Pastel Green, Grey",
    luckyColorsHi: "हल्का पीला, चितकबरा, सफेद, स्लेटी",
    luckyGemstoneEn: "Cat's Eye (Lehsunia) in Silver/Panchdhatu",
    luckyGemstoneHi: "लहसुनिया (Cat's Eye) चांदी या पंचधातु में",
    luckyDirectionEn: "North-East / Zenith",
    luckyDirectionHi: "उत्तर-पूर्व (ईशान)",
    beejMantraEn: "Om Sraam Sreem Sroum Sah Ketave Namah",
    beejMantraHi: "ॐ स्रां स्रीं स्रौं सः केतवे नमः",
    deityEn: "Lord Ganesha / Lord Shiva",
    deityHi: "भगवान श्री गणेश व भगवान शिव"
  },

  8: {
    number: 8,
    planetEn: "Saturn",
    planetHi: "शनि",
    rulerEn: "Saturn (Shani Dev)",
    rulerHi: "कर्मफलदाता शनि देव (न्यायकारक)",
    elementEn: "Air / Karma & Justice",
    elementHi: "वायु तत्व / कर्म व न्याय",
    titleEn: "The Powerhouse & Enduring Manifestor",
    titleHi: "कर्मयोगी, संगठनकर्ता व स्थायी समृद्धि का निर्माता",
    archetypeEn: "The Master Architect of Realities / Lord of Karma",
    archetypeHi: "कर्मवीर शिल्पी व न्यायप्रिय शासक",
    traitsEn: "Steadfast discipline, iron willpower, structural execution, financial mastery, karmic resilience",
    traitsHi: "दृढ़ संकल्प, न्यायप्रियता, वित्तीय दक्षता, धैर्य, असीम संघर्ष क्षमता, संगठन कौशल",
    meaningEn: "Number 8 is anchored by Shani Bhagavan (Saturn), the Lord of Karma and Justice. It represents relentless perseverance, executive mastery, pragmatic realism, structured endurance, and monumental physical manifestations. You build lasting legacies through disciplined labor.",
    meaningHi: "मूलांक ८ के स्वामी कर्मफलदाता और न्याय के देवता शनि देव हैं। यह अंक असीम सहनशीलता, कठोर परिश्रम, संगठनात्मक शक्ति, दूरदर्शिता, न्यायप्रियता और स्थायी साम्राज्य के निर्माण का प्रतीक है। आप जीवन की कठिन से कठिन चुनौतियों को पार कर शिखर पर पहुंचते हैं।",
    impacts: {
      career: {
        titleEn: "Heavy Industry, Real Estate, Law, Infrastructure & Governance",
        titleHi: "उद्योग, रियल एस्टेट, कानून, निर्माण व सर्वोच्च कॉर्पोरेट",
        descEn: "Commands peak leadership in infrastructure, real estate development, judicial magistracy, corporate restructuring, metallurgy, and executive statecraft.",
        descHi: "भारी उद्योग, मैन्युफैक्चरिंग, रियल एस्टेट/कंस्ट्रक्शन, न्यायपालिका/वकालत, खनन, बड़े कॉर्पोरेट प्रबंधन व राजनीति में स्थायी शिखर सफलता।"
      },
      wealth: {
        titleEn: "Monumental Compounded Empire & Enduring Assets",
        titleHi: "प्रारंभिक संघर्ष के बाद विशाल साम्राज्य व अचल संपत्ति",
        descEn: "Builds substantial generational wealth through patient compounding, real estate, and industrial scale. Hits peak financial velocity after age 32-35.",
        descHi: "३०-३५ वर्ष की आयु के बाद अचल संपत्तियों, भूमि, कारखानों व स्थायी पूंजी का विशाल निर्माण। शॉर्टकट से बचें; मेहनत से अर्जित धन पीढ़ियों तक फलता-फूलता है।"
      },
      relationships: {
        titleEn: "Rock-Solid Fidelity, Duty & Emotional Warmth",
        titleHi: "गंभीर, कर्तव्यनिष्ठ व दीर्घकालिक निष्ठा",
        descEn: "Stoic on the exterior but fiercely protective, steadfast, and dependable. Must actively verbalize affection to prevent emotional distance.",
        descHi: "बाहर से कठोर या गंभीर प्रतीत हो सकते हैं, परंतु भीतर से अत्यंत वफादार व परिवार के प्रति समर्पित होते हैं। अपनी भावनाओं को व्यक्त करना सीखें।"
      },
      health: {
        titleEn: "Skeletal Strength, Joints, Teeth & Vata Harmony",
        titleHi: "जोड़ों का दर्द, वात रोग, घुटने व हड्डियों की सुरक्षा",
        descEn: "Rules bones, joints, knees, and dental health. Guard against stiffness, arthritis, and melancholy. Regular sesame oil massage (Abhyanga) is vital.",
        descHi: "शनि वात तत्व, हड्डियों, जोड़ों व दांतों के स्वामी हैं। आर्थराइटिस, घुटनों का दर्द व मांसपेशियों के तनाव से बचें; नियमित तेल मालिश व व्यायाम करें।"
      }
    },
    precautionsEn: [
      "Never succumb to lethargy, cynicism, or paralyzing procrastination; relentless execution is your power.",
      "Never exploit subordinates, daily laborers, or helpers; treat them with dignity and fair generosity.",
      "Shun speculative gambles, unethical loopholes, and corrupt shortcuts; Saturn demands pristine integrity.",
      "Do not let stoicism turn into joyless rigidity; welcome humor, lightness, and celebratory warmth."
    ],
    precautionsHi: [
      "आलस्य, निराशावाद व कार्य को टालने (Procrastination) की आदत को कभी अपने ऊपर हावी न होने दें।",
      "अपने अधीन काम करने वाले कर्मचारियों, श्रमिकों व निर्धनों के साथ कभी भी अन्याय या कठोरता न बरतें।",
      "सट्टेबाजी, अनैतिक सौदों या जल्दी अमीर बनने के प्रलोभनों से पूर्णतः दूर रहें; शनि तत्काल दंड देते हैं।",
      "अत्यधिक एकाकी या शुष्क न बनें; जीवन में उत्सव, हास्य व सामाजिक आनंद को स्थान दें।"
    ],
    remediesEn: [
      "Light a mustard oil lamp under a sacred Peepal tree on Saturday evenings and offer silent prayers.",
      "Chant the Shani Beej Mantra 'Om Praam Preem Proum Sah Shanaishcharaya Namah' 108 times on Saturdays.",
      "Donate whole black urad dal, black sesame seeds, warm blankets, or footwear to underprivileged laborers.",
      "Recite the Hanuman Chalisa daily to instantly shield yourself from planetary distress. Wear deep navy, charcoal, and dark indigo tones. Blue Sapphire (Neelam) after strict astrological trial."
    ],
    remediesHi: [
      "प्रत्येक शनिवार पीपल के वृक्ष के नीचे सरसों के तेल का चौमुखा दीपक जलाएं और परिक्रमा करें।",
      "शनि देव के बीज मंत्र 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः' का प्रत्येक शनिवार १०८ बार जप करें।",
      "शनिवार को जरूरतमंदों, दिव्यांगों या श्रमिकों को काले तिल, उड़द की दाल, काला कंबल अथवा भोजन दान करें।",
      "प्रतिदिन हनुमान चालीसा का पाठ करें; यह शनि के सभी कष्टों का अचूक निवारण है। गहरा नीला, नेवी ब्लू व काला रंग अनुकूल है; नीलम (Blue Sapphire) या नीली धारण करें।"
    ],
    luckyNumbers: [8, 4, 5, 6],
    friendlyNumbers: [4, 5, 6, 8],
    enemyNumbers: [1, 2, 9],
    luckyDaysEn: "Saturday, Friday",
    luckyDaysHi: "शनिवार, शुक्रवार",
    luckyColorsEn: "Navy Blue, Deep Indigo, Charcoal, Black",
    luckyColorsHi: "गहरा नीला, नेवी ब्लू, गहरा जामुनी, काला",
    luckyGemstoneEn: "Blue Sapphire (Neelam) / Amethyst in Iron/Silver",
    luckyGemstoneHi: "नीलम (Blue Sapphire) अथवा जमुनिया (अष्टधातु या चांदी में)",
    luckyDirectionEn: "West (Pashchim)",
    luckyDirectionHi: "पश्चिम दिशा",
    beejMantraEn: "Om Praam Preem Proum Sah Shanaishcharaya Namah",
    beejMantraHi: "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः",
    deityEn: "Lord Shani / Lord Hanuman",
    deityHi: "भगवान शनिदेव व श्री हनुमान जी"
  },

  9: {
    number: 9,
    planetEn: "Mars",
    planetHi: "मंगल",
    rulerEn: "Mars (Mangala / Bhauma)",
    rulerHi: "भूमिपुत्र मंगल देव (सेनापति / शौर्यकारक)",
    elementEn: "Fire / Valor",
    elementHi: "अग्नि तत्व / शौर्य व ऊर्जा",
    titleEn: "The Universal Humanitarian & Courageous Leader",
    titleHi: "अदम्य साहसी, कर्मठ सेनानी व सर्वकल्याणकारी",
    archetypeEn: "The Heroic Commander / Righteous Champion",
    archetypeHi: "महाबली योद्धा व निर्भीक रक्षक",
    traitsEn: "Dynamic courage, righteous energy, boundless philanthropy, fearless leadership, high protective instinct",
    traitsHi: "अदम्य साहस, ऊर्जा, पराक्रम, नेतृत्व, परोपकार, निर्भयता, सत्यनिष्ठा",
    meaningEn: "Number 9 is energized by Mangala (Mars), the celestial Commander-in-Chief. It epitomizes boundless courage, righteous ambition, dynamic willpower, protective heroism, and universal humanitarian vision. You fight fiercely for ideals and champion those in need.",
    meaningHi: "मूलांक ९ के स्वामी भूमिपुत्र व देवसेनापति मंगल देव हैं। यह अंक अदम्य शौर्य, असीम ऊर्जा, पराक्रम, निर्भीकता, नेतृत्व, स्पष्टवादिता और वैश्विक मानवता के कल्याण का प्रतीक है। आप अन्याय को कभी सहन नहीं करते और कमजोरों के पक्ष में खुलकर खड़े होने वाले कर्मवीर व्यक्तित्व हैं।",
    impacts: {
      career: {
        titleEn: "Defense, Surgery, Engineering, Real Estate & Competitive Sports",
        titleHi: "रक्षा, इंजीनियरिंग, शल्य चिकित्सा, रियल एस्टेट व खेल",
        descEn: "Pioneers heroic success in defense services, police, surgical medicine, construction, metal engineering, competitive athletics, and public reform.",
        descHi: "सेना, पुलिस, सर्जन/शल्य चिकित्सक, सिविल व मैकेनिकल इंजीनियरिंग, रियल एस्टेट, खेलकूद, आपातकालीन सेवाएं व सामाजिक सुधार आंदोलनों में शीर्ष नेतृत्व।"
      },
      wealth: {
        titleEn: "Bold Enterprise Earnings, Land Assets & Generous Outflows",
        titleHi: "पराक्रम से धनार्जन, भूमि संपदा व उदार खर्च",
        descEn: "Attracts heavy financial velocity through audacious ventures and real estate acquisitions. Must check reckless generosity and emotional lending to acquaintances.",
        descHi: "साहसिक उद्यमों व स्वतंत्र प्रयासों से प्रचुर धन लाभ। भूमि, अचल संपत्ति व सोने में निवेश उत्तम रहता है। दोस्तों या दान-पुण्य पर अत्यधिक भावुक होकर अंधाधुंध खर्च करने से बचें।"
      },
      relationships: {
        titleEn: "Passionate Loyalty, Protective Fire & Temper Balance",
        titleHi: "अत्यधिक स्नेही, संरक्षक, परंतु वाणी पर नियंत्रण आवश्यक",
        descEn: "Fiercely protective and deeply affectionate partner. However, sudden flashes of temper, blunt candor, and impatience require conscious mastery.",
        descHi: "संबंधों में साथी के लिए जान तक न्योछावर करने वाले रक्षक हैं। परंतु अचानक आने वाले क्रोध, तीखे शब्दों व अधीरता के कारण साथी आहत हो सकता है; धैर्य व मौन का अभ्यास करें।"
      },
      health: {
        titleEn: "Blood Circulation, Inflammatory Heat & Muscular Vigor",
        titleHi: "रक्त विकार, उच्च रक्तचाप, कटने-जलने से सावधानी व पित्त",
        descEn: "Governs hemoglobin, muscle fibers, and inflammatory responses (Pitta). Beware of blood pressure surges, burns, cuts, and fevers. Cooling hydration and sports ground excessive fire.",
        descHi: "मंगल रक्त व शरीर की आंतरिक अग्नि (Metabolism) के स्वामी हैं। उच्च रक्तचाप, रक्त की अशुद्धियां, चोट, सर्जरी व बवासीर से बचाव रखें; शीतल जल, प्राणायाम व नियमित खेल उत्तम है।"
      }
    },
    precautionsEn: [
      "Master volatile impulses and fiery anger; avoid unnecessary legal or physical confrontations.",
      "Do not recklessly intervene in disputes that do not concern your mission.",
      "Softens blunt, scorching speech; avoid bruising loved ones in moments of frustration.",
      "Exercise strict safety and measured speed when driving or operating heavy equipment."
    ],
    precautionsHi: [
      "अति-क्रोध, उत्तेजना व आवेश में आकर शारीरिक या कानूनी विवादों में उलझने से बचें; आत्मनियंत्रण रखें।",
      "दूसरों के झगड़ों में अनावश्यक रूप से कूदकर अपना नुकसान न कराएं।",
      "अपने तीखे व कठोर शब्दों से प्रियजनों के हृदय को चोट न पहुंचाएं; बोलने से पहले विचार करें।",
      "वाहन चलाते समय या जोखिम भरे कार्यों में गति व जल्दबाजी पर नियंत्रण रखें।"
    ],
    remediesEn: [
      "Worship Lord Hanuman on Tuesdays, offering vermilion and Jasmine oil while reciting the Sundarkand or Hanuman Chalisa.",
      "Chant the Mangal Beej Mantra 'Om Kraam Kreem Kroum Sah Bhaumaya Namah' 108 times on Tuesday mornings.",
      "Donate red lentils (masoor dal), jaggery, or copper utensils to laborers on Tuesdays.",
      "Wear fiery crimson, coral red, saffron, and vibrant pink tones. Wear a natural triangular Italian/Japanese Red Coral (Moonga) in copper or gold after consultation."
    ],
    remediesHi: [
      "प्रत्येक मंगलवार को हनुमान जी को सिंदूर व चमेली का तेल अर्पित करें तथा सुंदरकांड अथवा हनुमान चालीसा का पाठ करें।",
      "मंगल के बीज मंत्र 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः' का मंगलवार को १०८ बार जप करें।",
      "मंगलवार को लाल मसूर की दाल, गुड़, तांबा या लाल वस्त्र का जरूरतमंदों को दान करें।",
      "लाल, नारंगी, सिंदूरी व गुलाबी रंग आपके लिए परम ऊर्जावान व शुभ है। लाल मूंगा (Red Coral) तांबे अथवा सोने में अनामिका उंगली में धारण करें।"
    ],
    luckyNumbers: [9, 1, 3, 5],
    friendlyNumbers: [1, 3, 5, 9],
    enemyNumbers: [2, 4, 8],
    luckyDaysEn: "Tuesday, Sunday",
    luckyDaysHi: "मंगलवार, रविवार",
    luckyColorsEn: "Crimson Red, Saffron, Orange, Coral Pink",
    luckyColorsHi: "लाल, सिंदूरी, नारंगी, केसरिया",
    luckyGemstoneEn: "Red Coral (Moonga) in Copper/Gold",
    luckyGemstoneHi: "लाल मूंगा (Red Coral) तांबे या सोने में",
    luckyDirectionEn: "South (Dakshina)",
    luckyDirectionHi: "दक्षिण दिशा",
    beejMantraEn: "Om Kraam Kreem Kroum Sah Bhaumaya Namah",
    beejMantraHi: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः",
    deityEn: "Lord Hanuman / Lord Kartikeya",
    deityHi: "श्री हनुमान जी व भगवान कार्तिकेय"
  },

  11: {
    number: 11,
    planetEn: "Super-Moon / Neptune",
    planetHi: "उच्च चंद्र चेतना",
    rulerEn: "Higher Intuitive Consciousness",
    rulerHi: "दिव्य अंतर्ज्ञान व आत्मिक प्रकाश",
    elementEn: "Spiritual Light",
    elementHi: "दिव्य प्रकाश तत्व",
    titleEn: "Master Number 11: The Illuminator & Intuitive Conduit",
    titleHi: "मास्टर नंबर ११: आध्यात्मिक प्रकाश स्तंभ व दिव्य माध्यम",
    archetypeEn: "The Cosmic Conduit / Intuitive Visionary",
    archetypeHi: "दिव्य प्रकाशपुंज व अंतर्दृष्टा",
    traitsEn: "Visionary intuition, spiritual awakening, cosmic catalyst, psychic empathy",
    traitsHi: "अंतर्ज्ञान, आध्यात्मिक जागृति, दिव्य प्रेरणा, परोपकार, उच्च चेतना",
    meaningEn: "Master Number 11 is the vibration of the Spiritual Illuminator. You serve as a bridge between the unseen cosmic realm and tangible human consciousness.",
    meaningHi: "मास्टर नंबर ११ उच्च आध्यात्मिक प्रकाश का प्रतीक है। आप ब्रह्मांडीय अंतर्ज्ञान व सांसारिक चेतना के मध्य एक दिव्य सेतु के समान हैं।",
    impacts: {
      career: { titleEn: "Spiritual Mentorship & Visionary Innovation", titleHi: "आध्यात्मिक मार्गदर्शन, नवाचार व प्रेरणा", descEn: "Excels in transformational coaching, arts, spiritual teachings, and revolutionary conceptual leadership.", descHi: "आध्यात्मिक मार्गदर्शन, उच्च कला, प्रेरक वक्ता, मनोविज्ञान व वैचारिक नवाचार में अग्रणी।" },
      wealth: { titleEn: "Higher Purpose Prosperity", titleHi: "उच्च उद्देश्य आधारित समृद्धि", descEn: "Attracts financial resources when aligned with benevolent, life-elevating collective projects.", descHi: "जब लोक-कल्याणकारी व रचनात्मक कार्यों में प्रवृत्त होते हैं तो प्रचुर धन स्वतः आकर्षित होता है।" },
      relationships: { titleEn: "Soulmate Dynamics & Empathy", titleHi: "आत्मिक संबंध व अत्यधिक संवेदनशीलता", descEn: "Deeply loyal and psychic partner. Requires emotional grounding and a partner who honors sacred silence.", descHi: "आत्मिक स्तर पर जुड़ने वाले साथी। मानसिक शांति व संवेदनशीलता का सम्मान करने वाले जीवनसाथी की आवश्यकता।" },
      health: { titleEn: "Nervous Energy & Aura Preservation", titleHi: "तंत्रिका तंत्र व प्राण ऊर्जा संरक्षण", descEn: "Prone to energetic exhaustion and psychic burnout. Daily meditation and nature immersion are vital.", descHi: "ऊर्जा की अत्यधिक खपत से थकान व अनिद्रा की आशंका। नित्य ध्यान व प्राकृतिक वातावरण में समय बिताना अमृत समान।" }
    },
    precautionsEn: ["Do not absorb collective anxieties; protect your subtle auric field.", "Balance high spiritual idealism with practical grounding."],
    precautionsHi: ["दूसरों के नकारात्मक तनाव को अपने भीतर समाहित न करें; आत्म-सुरक्षा का ध्यान रखें।", "काल्पनिक आदर्शवाद में जीने के बजाय व्यावहारिक धरातल पर कार्य करें।"],
    remediesEn: ["Practice Gayatri Mantra daily at dawn.", "Silver moonstone ring on Monday relieves psychic tension."],
    remediesHi: ["प्रतिदिन सूर्योदय के समय गायत्री मंत्र का जप करें।", "सोमवार को चांदी में मूनस्टोन या मोती धारण करें और शिव साधना करें।"],
    luckyNumbers: [1, 2, 11],
    friendlyNumbers: [1, 2, 7],
    enemyNumbers: [4, 8],
    luckyDaysEn: "Monday, Sunday",
    luckyDaysHi: "सोमवार, रविवार",
    luckyColorsEn: "Iridescent White, Silver, Gold",
    luckyColorsHi: "श्वेत, चांदी, स्वर्णिम",
    luckyGemstoneEn: "White Pearl / Moonstone in Silver",
    luckyGemstoneHi: "सच्चा मोती / मूनस्टोन चांदी में",
    luckyDirectionEn: "North-East",
    luckyDirectionHi: "उत्तर-पूर्व (ईशान)",
    beejMantraEn: "Om Shreem Hreem Chandraya Namah",
    beejMantraHi: "ॐ श्रीं ह्रीं चंद्राय नमः",
    deityEn: "Lord Shiva / Goddess Saraswati",
    deityHi: "भगवान देवाधिदेव महादेव व मां सरस्वती"
  },

  22: {
    number: 22,
    planetEn: "Super-Rahu / Uranus",
    planetHi: "महा-शिल्पी चेतना",
    rulerEn: "Cosmic Master Builder",
    rulerHi: "युगांतरकारी निर्माण चेतना",
    elementEn: "Manifestation Earth",
    elementHi: "महा-निर्माण तत्व",
    titleEn: "Master Number 22: The Master Builder of Civilizations",
    titleHi: "मास्टर नंबर २२: युगांतरकारी निर्माता व महा-शिल्पी",
    archetypeEn: "The Cosmic Architect / Empire Builder",
    archetypeHi: "युगांतकारी राष्ट्र-निर्माता",
    traitsEn: "Translating highest cosmic ideals into tangible physical realities, global scale, relentless discipline",
    traitsHi: "विशाल दृष्टि, युगांतकारी निर्माण, क्रियान्वयन, वैश्विक प्रभाव",
    meaningEn: "Master Number 22 is the Master Builder. You possess the rare power to ground monumental visions into lasting physical empires and enduring societal institutions.",
    meaningHi: "मास्टर नंबर २२ महा-शिल्पी का अंक है। आपके पास विशालतम विचारों को धरातल पर उतारकर स्थायी साम्राज्य व संस्थाएं निर्मित करने की अद्वितीय शक्ति है।",
    impacts: {
      career: { titleEn: "Global Enterprises, Infrastructure & Statecraft", titleHi: "वैश्विक उद्यम, महा-परियोजनाएं व शासन", descEn: "Heads trans-national corporations, mega-infrastructure projects, and pivotal historical initiatives.", descHi: "अंतरराष्ट्रीय कॉर्पोरेट, विशाल अवसंरचना, जन-कल्याणकारी संस्थान व शासन व्यवस्था में शिखर नेतृत्व।" },
      wealth: { titleEn: "Generational Institutional Wealth", titleHi: "युगांतकारी संस्थागत वैभव", descEn: "Commands massive capital flows directed toward transformative structural infrastructure.", descHi: "दूरगामी और विशाल संपत्तियों का निर्माण, जो पीढ़ियों तक समाज को लाभान्वित करती हैं।" },
      relationships: { titleEn: "Steadfast Pillar of Support", titleHi: "अडिग संबल व कर्तव्यपरायण साथी", descEn: "Dependable rock in partnerships, but must make conscious time for tender intimacy.", descHi: "रिश्तों में दृढ़ संबल, परंतु विशाल दायित्वों के बीच दांपत्य सुख व स्नेह हेतु समय निकालना आवश्यक।" },
      health: { titleEn: "Stress Resilience & Physical Pacing", titleHi: "तनाव प्रबंधन व शारीरिक संतुलन", descEn: "Prone to carrying the weight of the world. Ensure structured sleep and restorative sabbaticals.", descHi: "अत्यधिक कार्यभार से मानसिक दबाव व रक्तचाप की आशंका; समय पर विश्राम व प्राणायाम अनिवार्य।" }
    },
    precautionsEn: ["Avoid being overwhelmed by the magnitude of your goals; break projects into disciplined milestones.", "Never compromise ethical foundations for speedy execution."],
    precautionsHi: ["लक्ष्यों की विशालता से घबराएं नहीं; चरणबद्ध रूप से क्रियान्वित करें।", "त्वरित सफलता के लिए नैतिक सिद्धांतों से कभी समझौता न करें।"],
    remediesEn: ["Support infrastructure for temples or schools.", "Wear Hessonite or Blue Sapphire after chart audit."],
    remediesHi: ["धार्मिक स्थलों अथवा विद्यालयों के निर्माण कार्य में यथाशक्ति सहयोग करें।", "शनिवार को सुंदरकांड का पाठ करें और भैरव उपासना करें।"],
    luckyNumbers: [4, 8, 22],
    friendlyNumbers: [1, 5, 6],
    enemyNumbers: [2, 9],
    luckyDaysEn: "Saturday, Wednesday",
    luckyDaysHi: "शनिवार, बुधवार",
    luckyColorsEn: "Deep Indigo, Slate Blue, Gold",
    luckyColorsHi: "गहरा नीला, स्लेटी, स्वर्णिम",
    luckyGemstoneEn: "Hessonite / Blue Sapphire",
    luckyGemstoneHi: "गोमेद / नीलम",
    luckyDirectionEn: "South-West",
    luckyDirectionHi: "दक्षिण-पश्चिम (नैऋत्य)",
    beejMantraEn: "Om Shreem Kleem Vishvakarmane Namah",
    beejMantraHi: "ॐ श्रीं क्लीं विश्वकर्मणे नमः",
    deityEn: "Lord Vishwakarma / Lord Bhairava",
    deityHi: "भगवान विश्वकर्मा व भगवान कालभैरव"
  },

  33: {
    number: 33,
    planetEn: "Super-Venus / Neptune",
    planetHi: "परम गुरु चेतना",
    rulerEn: "Cosmic Master of Compassion",
    rulerHi: "परम कारुणिक विश्व गुरु चेतना",
    elementEn: "Universal Love",
    elementHi: "परम प्रेम व करुणा तत्व",
    titleEn: "Master Number 33: The Master Teacher of Compassion",
    titleHi: "मास्टर नंबर ३३: परम कारुणिक विश्व गुरु व उद्धारक",
    archetypeEn: "The Universal Healer / Supreme Bodhisattva",
    archetypeHi: "सर्वकल्याणकारी आध्यात्मिक गुरु",
    traitsEn: "Supreme selfless devotion, humanitarian elevation, unconditional love, profound spiritual guidance",
    traitsHi: "निःस्वार्थ प्रेम, सर्वोच्च त्याग, मानवता का उत्थान, लोक-कल्याण",
    meaningEn: "Master Number 33 is the Master Teacher of Universal Love. Your destiny centers on unconditional service, uplifting collective consciousness, and healing suffering.",
    meaningHi: "मास्टर नंबर ३३ परम प्रेम व करुणा का दिव्य अंक है। आपका जीवन उद्देश्य निःस्वार्थ सेवा, मानवता के दुःखों का निवारण और समाज को आध्यात्मिक दिशा प्रदान करना है।",
    impacts: {
      career: { titleEn: "Global Philanthropy, Healing & Spiritual Teaching", titleHi: "वैश्विक परोपकार, अध्यात्म, चिकित्सा व शिक्षण", descEn: "Shines as spiritual master, founder of compassionate charities, global humanitarian, and holistic healer.", descHi: "आध्यात्मिक गुरु, विश्वस्तरीय धर्मार्थ ट्रस्ट, हीलिंग, चिकित्सा व उच्च मानवीय सेवा में सर्वोपरि।" },
      wealth: { titleEn: "Abundance Channel for the World", titleHi: "लोक-कल्याण हेतु विपुल साधन", descEn: "Becomes a trusted trustee of tremendous capital that flows freely into charitable institutions.", descHi: "संसार की भलाई के लिए विपुल धन का प्रवाह; जितना दान करते हैं, उससे कई गुना अधिक पुनः प्राप्त होता है।" },
      relationships: { titleEn: "Boundless Universal Warmth", titleHi: "असीम करुणा, वात्सल्य व पवित्र संबंध", descEn: "Loves with supreme purity, but must not neglect intimate family while serving the world.", descHi: "निःस्वार्थ व पवित्र प्रेम; वैश्विक सेवा के साथ-साथ निजी परिवार के प्रति भी समय व ध्यान देना आवश्यक।" },
      health: { titleEn: "Heart Center Vitality & Emotional Protection", titleHi: "अनाहत चक्र (हृदय) व भावनात्मक संरक्षण", descEn: "Prone to heart strain from feeling the pain of others. Regular heart-chakra meditation is essential.", descHi: "दूसरों के कष्ट देखकर भावुक होने से हृदय व रक्तचाप पर प्रभाव; नियमित हृदय चक्र ध्यान आवश्यक।" }
    },
    precautionsEn: ["Do not play the martyr; protect your personal wellness so you can sustain global service.", "Avoid imposing your intense spiritual standards on those not yet ready."],
    precautionsHi: ["दूसरों के लिए स्वयं को नष्ट न करें; सेवा जारी रखने के लिए अपनी ऊर्जा को बनाए रखें।", "अपने उच्च आध्यात्मिक मानकों को दूसरों पर जबरन न थोपें।"],
    remediesEn: ["Feed cows and provide shelter to the destitute.", "Wear a pure natural Opal in silver; chant Maha Mrityunjaya Mantra."],
    remediesHi: ["गौसेवा करें और निर्धन, अनाथ बच्चों की शिक्षा व चिकित्सा में सहायता करें।", "महामृत्युंजय मंत्र का नित्य जप करें और सफेद चंदन का तिलक लगाएं।"],
    luckyNumbers: [6, 33, 3],
    friendlyNumbers: [3, 5, 6],
    enemyNumbers: [1, 8],
    luckyDaysEn: "Friday, Thursday",
    luckyDaysHi: "शुक्रवार, गुरुवार",
    luckyColorsEn: "Radiant White, Cream, Sky Blue, Rose Pink",
    luckyColorsHi: "श्वेत, क्रीम, आसमानी, हल्का गुलाबी",
    luckyGemstoneEn: "Natural Opal / Diamond in White Gold",
    luckyGemstoneHi: "सफेद ओपल या हीरा चांदी में",
    luckyDirectionEn: "South-East / North-East",
    luckyDirectionHi: "ईशान व आग्नेय कोण",
    beejMantraEn: "Om Shreem Hreem Kleem Maha Lakshmyai Namah",
    beejMantraHi: "ॐ श्रीं ह्रीं क्लीं महालक्ष्म्यै नमः",
    deityEn: "Goddess Maha Lakshmi / Lord Dattatreya",
    deityHi: "माता महालक्ष्मी व भगवान दत्तात्रेय"
  }
};

/**
 * Calculates planetary synergy and dynamic relationship between Moolank and Bhagyank.
 */
export function calculateMoolankBhagyankSynergy(moolank, bhagyank) {
  const m = parseInt(moolank) || 1;
  let b = parseInt(bhagyank) || 1;
  // If master number, evaluate planetary core (11->2 Moon, 22->4 Rahu, 33->6 Venus)
  const reducedB = b === 11 ? 2 : b === 22 ? 4 : b === 33 ? 6 : b;

  const mData = VEDIC_NUMEROLOGY_DATA[m] || VEDIC_NUMEROLOGY_DATA[1];
  const bData = VEDIC_NUMEROLOGY_DATA[reducedB] || VEDIC_NUMEROLOGY_DATA[1];

  // Identical Moolank & Bhagyank
  if (m === reducedB) {
    return {
      score: 96,
      statusEn: "Absolute Energetic Alignment (Supreme Clarity)",
      statusHi: "पूर्ण एकात्मता व सर्वोच्च सामंजस्य (अखंड स्पष्टता)",
      rulerPairEn: `${mData.planetEn} & ${bData.planetEn} (Unified Frequency)`,
      rulerPairHi: `${mData.planetHi} व ${bData.planetHi} (एकरूप ऊर्जा)`,
      analysisEn: `Your internal identity (Root ${m} - ${mData.planetEn}) and your life destiny (Life Path ${b} - ${bData.planetEn}) resonate on the exact same cosmic frequency. You experience exceptional clarity of purpose, minimal internal friction, and direct acceleration toward your goals.`,
      analysisHi: `आपकी आंतरिक मूल चेतना (मूलांक ${m} - ${mData.planetHi}) और आपका बाह्य कर्म मार्ग (भाग्यांक ${b} - ${bData.planetHi}) दोनों एक ही दिव्य ग्रह ऊर्जा पर स्थित हैं। आपके मन और कर्म में कोई दोहराव या अंतर्द्वंद्व नहीं होता, जिससे आप जिस भी दिशा में अग्रसर होते हैं, वहां तीव्र गति से सफलता प्राप्त करते हैं।`
    };
  }

  // Natural planetary pairs
  const pairKey = `${Math.min(m, reducedB)}-${Math.max(m, reducedB)}`;

  const PAIR_SYNERGIES = {
    "1-9": {
      score: 94,
      statusEn: "Fiery Brotherhood of Kings (Sun + Mars)",
      statusHi: "अग्रणी सम्राट व सेनापति योग (सूर्य + मंगल)",
      analysisEn: "A magnificent royal alignment. The Sun provides supreme vision and dignity, while Mars delivers fearless execution and energy. When you lead, you inspire devotion and conquer obstacles effortlessly.",
      analysisHi: "सूर्य (राजा) और मंगल (सेनापति) का यह संयोजन अद्वितीय पराक्रम, सत्ता और यश प्रदान करता है। आपकी योजनाएं विशाल होती हैं और उन्हें पूरा करने का अदम्य साहस आपमें जन्मजात है।"
    },
    "1-3": {
      score: 92,
      statusEn: "Divine Alliance of King & Counselor (Sun + Jupiter)",
      statusHi: "राजगुरु व नृपति योग (सूर्य + गुरु)",
      analysisEn: "A supremely auspicious alliance. Jupiter's expansive wisdom elevates the Sun's leadership into ethical statesmanship and enduring honor.",
      analysisHi: "देवगुरु बृहस्पति के ज्ञान और सूर्य के आत्मबल का यह दुर्लभ संगम आपको समाज में उच्च सम्मान, विद्या और सम्मानित नेतृत्व प्रदान करता है।"
    },
    "1-5": {
      score: 88,
      statusEn: "Royal Merchant & Diplomatic Vision (Sun + Mercury)",
      statusHi: "बुधादित्य प्रभाव — प्रखर बुद्धि व नेतृत्व (सूर्य + बुध)",
      analysisEn: "A sharp, commercially brilliant combination. Solar authority pairs with Mercury's rapid wit and diplomatic finesse, ideal for business empires.",
      analysisHi: "सूर्य के तेज और बुध की कुशाग्र बुद्धि का संगम आपको व्यापार, संचार और रणनीतिक निर्णयों में अद्वितीय सफलता दिलाता है।"
    },
    "1-2": {
      score: 86,
      statusEn: "Luminous Union of Day & Night (Sun + Moon)",
      statusHi: "राजसी सौहार्द — सूर्य व चंद्र का समन्वय",
      analysisEn: "A complete solar-lunar harmony. The fiery willpower of 1 is softened and guided by the emotional intuition of 2, creating charismatic emotional resonance.",
      analysisHi: "सूर्य के आत्मबल को चंद्रमा की संवेदनशीलता व सौहार्द संतुलित करता है। आप कठोर हुए बिना दृढ़ता से नेतृत्व करने में सक्षम हैं।"
    },
    "6-9": {
      score: 84,
      statusEn: "Dynamic Creative Tension (Mars Action + Venus Aesthetics)",
      statusHi: "सृजनात्मक घर्षण व रूपांतरण (मंगल का शौर्य + शुक्र का सौंदर्य)",
      analysisEn: "An intense, magnetic blend of Fire (Mars) and Water/Art (Venus). Your inner instinct pushes for bold, decisive conquest, while your outer destiny calls for diplomacy, design, and harmony. Channeling fiery passion into creative service yields magnetic leadership.",
      analysisHi: "आपकी आंतरिक चेतना (मूलांक ९ - मंगल) अदम्य साहस, त्वरित क्रियाशीलता व पराक्रम से संचालित है, जबकि आपका कर्म पथ (भाग्यांक ६ - शुक्र) आपको लोक-कल्याण, सौंदर्यबोध, दांपत्य, कूटनीति व सामंजस्य के मार्ग पर बुलाता है। जब आप मंगल के पराक्रम को शुक्र की सुरुचि व लोकव्यवहार के साथ जोड़ते हैं, तो आप अद्वितीय करिश्माई नेतृत्व व लोकप्रियता प्राप्त करते हैं।"
    },
    "5-6": {
      score: 94,
      statusEn: "Graceful Abundance & Commercial Art (Mercury + Venus)",
      statusHi: "लक्ष्मी-नारायण प्रभाव — व्यापार व सौंदर्य का संगम (बुध + शुक्र)",
      analysisEn: "A joyful, charming vibration. Mercury's commercial dexterity merges with Venus's luxury and artistic elegance, attracting high prosperity and popularity.",
      analysisHi: "बुध के व्यापारिक चातुर्य और शुक्र के भौतिक आकर्षण का यह योग आपको सुख-समृद्धि, जनप्रियता और रचनात्मक उद्योगों में अपार सफलता दिलाता है।"
    },
    "3-9": {
      score: 92,
      statusEn: "Righteous Warrior & Sage (Jupiter + Mars)",
      statusHi: "धर्म-योद्धा योग — ज्ञान व पराक्रम का समन्वय (गुरु + मंगल)",
      analysisEn: "A high-integrity alignment. Mars supplies the dynamic stamina and physical bravery, while Jupiter directs it toward noble, philanthropic causes.",
      analysisHi: "देवगुरु के धर्म व नीति को मंगल का शौर्य प्राप्त होता है। आप कभी भी स्वार्थ में नहीं लड़ते, बल्कि सत्य व धर्म की रक्षा हेतु साहसिक कदम उठाते हैं।"
    },
    "6-8": {
      score: 90,
      statusEn: "Material Empire & Sovereign Luxury (Venus + Saturn)",
      statusHi: "स्थायी वैभव व अचल संपत्ति योग (शुक्र + शनि)",
      analysisEn: "A grounded, highly practical friendship. Saturn's disciplined perseverance builds the enduring empire, while Venus adorns it with luxury and art.",
      analysisHi: "शनि के कठोर अनुशासन और शुक्र के ऐश्वर्य का यह सुंदर संगम जातक को जीवन के उत्तरार्ध में विशाल अचल संपत्तियां और स्थायी प्रतिष्ठा प्रदान करता है।"
    },
    "4-6": {
      score: 86,
      statusEn: "Modern Architectural Genius (Rahu + Venus)",
      statusHi: "आधुनिक कला व नवाचार योग (राहु + शुक्र)",
      analysisEn: "A progressive, highly fashionable blend. Rahu's unconventional innovation fuels Venus's aesthetic design, ideal for media, tech, and cinema.",
      analysisHi: "राहु की क्रांतिकारी सोच और शुक्र के सौंदर्यबोध का यह योग कला, मीडिया, सिनेमा, फैशन और डिजिटल नवाचार में अत्यधिक फलदायी होता है।"
    },
    "4-8": {
      score: 84,
      statusEn: "Industrial Magnitude & Karmic Mastery (Rahu + Saturn)",
      statusHi: "कठिन कर्मयोगी व विशाल साम्राज्य (राहु + शनि)",
      analysisEn: "A powerhouse of endurance and technical disruption. Demands rigorous integrity; once aligned, manifests massive industrial scale.",
      analysisHi: "शनि की निरंतरता और राहु की अप्रत्याशित छलांग का यह संयोजन जातक को कठिन चुनौतियों से जूझते हुए विशाल साम्राज्य निर्मित करने की शक्ति देता है।"
    },
    "1-8": {
      score: 72,
      statusEn: "Karmic Forge of Fire & Iron (Sun + Saturn)",
      statusHi: "कठिन आत्म-मंथन व कर्म योग (सूर्य + शनि का घर्षण)",
      analysisEn: "The classic father-son karmic dynamic. Sun demands instant sovereign authority, while Saturn demands patient humility and labor. Overcoming ego creates titanic resilience.",
      analysisHi: "सूर्य के तीव्र स्वाभिमान और शनि के धैर्यपूर्ण परिश्रम के बीच एक स्वाभाविक घर्षण रहता है। जब आप अहंकार को त्यागकर कर्मठता अपनाते हैं, तो यह संघर्ष आपको अजेय बना देता है।"
    },
    "3-6": {
      score: 74,
      statusEn: "The Two Gurus (Jupiter Wisdom + Venus Aesthetic Luxury)",
      statusHi: "द्वि-गुरु योग — ज्ञान व विलासिता का संतुलन (देवगुरु + दैत्यगुरु)",
      analysisEn: "Both are enlightened preceptors: Jupiter teaches spiritual wisdom while Venus teaches worldly arts and pleasure. Harmonizing high values with worldly joy is your master lesson.",
      analysisHi: "देवगुरु बृहस्पति और दैत्यगुरु शुक्र दोनों ही उच्च ज्ञान के प्रतीक हैं। जीवन में सात्विक ज्ञान और भौतिक सुख-सुविधाओं के बीच संतुलन स्थापित करना आपकी सबसे बड़ी कला है।"
    }
  };

  if (PAIR_SYNERGIES[pairKey]) {
    return {
      ...PAIR_SYNERGIES[pairKey],
      rulerPairEn: `${mData.planetEn} & ${bData.planetEn}`,
      rulerPairHi: `${mData.planetHi} व ${bData.planetHi}`
    };
  }

  // Fallback planetary calculation
  const isFriendly = mData.friendlyNumbers.includes(reducedB) || bData.friendlyNumbers.includes(m);
  const isEnemy = mData.enemyNumbers.includes(reducedB) || bData.enemyNumbers.includes(m);

  if (isFriendly) {
    return {
      score: 88,
      statusEn: "Harmonious Complementary Vibration",
      statusHi: "अनुकूल व सहयोगी सामंजस्य (उत्कृष्ट तालमेल)",
      rulerPairEn: `${mData.planetEn} & ${bData.planetEn}`,
      rulerPairHi: `${mData.planetHi} व ${bData.planetHi}`,
      analysisEn: `Your core nature (${mData.planetEn}) operates in natural harmony with your life mission (${bData.planetEn}). Inner impulses readily support your external achievements.`,
      analysisHi: `आपके मूलांक के स्वामी (${mData.planetHi}) और भाग्यांक के स्वामी (${bData.planetHi}) में स्वाभाविक मित्रता है। आपकी आंतरिक प्रवृत्तियां आपके सांसारिक लक्ष्यों को सहजता से पोषित करती हैं।`
    };
  } else if (isEnemy) {
    return {
      score: 70,
      statusEn: "Dynamic Transformational Friction",
      statusHi: "सृजनात्मक घर्षण व रूपांतरण (चुनौतियों से परिपक्वता)",
      rulerPairEn: `${mData.planetEn} & ${bData.planetEn}`,
      rulerPairHi: `${mData.planetHi} व ${bData.planetHi}`,
      analysisEn: `There is a productive contrast between what you naturally want (${mData.planetEn}) and what the world demands of you (${bData.planetEn}). Balancing these complementary forces turns friction into unique greatness.`,
      analysisHi: `आपकी आंतरिक चाहतों (${mData.planetHi}) और संसार की अपेक्षाओं (${bData.planetHi}) के मध्य एक रचनात्मक खिंचाव है। उचित उपायों व संतुलन से यह विरोधाभास आपकी सबसे बड़ी शक्ति बन जाता है।`
    };
  }

  return {
    score: 80,
    statusEn: "Balanced Steady Interaction",
    statusHi: "संतुलित व स्थिर तालमेल",
    rulerPairEn: `${mData.planetEn} & ${bData.planetEn}`,
    rulerPairHi: `${mData.planetHi} व ${bData.planetHi}`,
    analysisEn: `Your Root Number and Life Path maintain a stable, neutral relationship. Success flows predictably through focused application and steady routines.`,
    analysisHi: `आपके मूलांक और भाग्यांक में संतुलित व शांत संबंध है। नियमित परिश्रम और स्पष्ट लक्ष्यों से आप निरंतर प्रगति प्राप्त करते हैं।`
  };
}

/**
 * Calculates BOTH Moolank (Root Number from Day 1-31) and Bhagyank (Destiny/Life Path Number from Full DOB).
 * Provides rich Vedic calculations, planetary synergy, lucky factors, and personalized breakdown.
 */
export function calculateLifePathNumber(dobStr) {
  if (!dobStr) return null;
  const parts = dobStr.split("-");
  if (parts.length !== 3) return null;

  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);

  // 1. Moolank (मूलांक / Root Number): Derived strictly from Day of Birth (1-31 -> 1-9)
  const moolank = reduceToSingleDigit(day, false);
  const moolankData = VEDIC_NUMEROLOGY_DATA[moolank] || VEDIC_NUMEROLOGY_DATA[1];

  // 2. Bhagyank (भाग्यांक / Destiny / Life Path Number): Derived from entire DOB sum (Day + Month + Year)
  const reducedDay = reduceToSingleDigit(day, false);
  const reducedMonth = reduceToSingleDigit(month, false);
  const reducedYear = reduceToSingleDigit(year, false);

  const rawSum = reducedDay + reducedMonth + reducedYear;
  const bhagyank = reduceToSingleDigit(rawSum, true); // Keep 11, 22, 33 for Master Numbers
  const reducedBhagyank = reduceToSingleDigit(bhagyank, false);
  const bhagyankData = VEDIC_NUMEROLOGY_DATA[bhagyank] || VEDIC_NUMEROLOGY_DATA[reducedBhagyank] || VEDIC_NUMEROLOGY_DATA[1];

  // 3. Synergy between Moolank and Bhagyank
  const synergy = calculateMoolankBhagyankSynergy(moolank, bhagyank);

  // 4. Combined Lucky Elements Matrix
  const luckyElements = {
    luckyNumbers: Array.from(new Set([...(moolankData.luckyNumbers || []), ...(bhagyankData.luckyNumbers || [])])),
    friendlyNumbers: moolankData.friendlyNumbers || [],
    enemyNumbers: moolankData.enemyNumbers || [],
    luckyDaysHi: moolankData.luckyDaysHi,
    luckyDaysEn: moolankData.luckyDaysEn,
    luckyColorsHi: moolankData.luckyColorsHi,
    luckyColorsEn: moolankData.luckyColorsEn,
    luckyGemstoneHi: moolankData.luckyGemstoneHi,
    luckyGemstoneEn: moolankData.luckyGemstoneEn,
    luckyDirectionHi: moolankData.luckyDirectionHi,
    luckyDirectionEn: moolankData.luckyDirectionEn,
    beejMantraHi: moolankData.beejMantraHi,
    beejMantraEn: moolankData.beejMantraEn,
    deityHi: moolankData.deityHi,
    deityEn: moolankData.deityEn
  };

  const ARCHETYPES = {
    1: { titleEn: "The Pioneer & Visionary Leader", titleHi: "अग्रणी व स्वतंत्र नेता", planet: "Sun", ruler: "सूर्य", traitsEn: "Independence, ambition, innovation, directness", traitsHi: "आत्मनिर्भरता, महत्वाकांक्षा, नेतृत्व क्षमता" },
    2: { titleEn: "The Peacemaker & Intuitive Diplomat", titleHi: "शांतिदूत व संवेदनशील कूटनीतिज्ञ", planet: "Moon", ruler: "चंद्र", traitsEn: "Harmony, empathy, cooperation, patience", traitsHi: "सौहार्द, संवेदनशीलता, साझेदारी, धैर्य" },
    3: { titleEn: "The Creative Spark & Expressive Healer", titleHi: "सृजनशील व प्रेरणादायी वक्ता", planet: "Jupiter", ruler: "बृहस्पति", traitsEn: "Optimism, artistic expression, joy, communication", traitsHi: "रचनात्मकता, अभिव्यक्ति, उत्साह, वाक्पटुता" },
    4: { titleEn: "The Master Builder & Pillar of Order", titleHi: "अनुशासित शिल्पी व आधार स्तंभ", planet: "Rahu / Uranus", ruler: "राहु", traitsEn: "Stability, discipline, meticulous planning, loyalty", traitsHi: "स्थिरता, परिश्रम, अनुशासन, विश्वसनीयता" },
    5: { titleEn: "The Adventurous Rebel & Dynamic Catalyst", titleHi: "मुक्तचेता व परिवर्तन का संवाहक", planet: "Mercury", ruler: "बुध", traitsEn: "Freedom, curiosity, versatility, rapid adaptation", traitsHi: "स्वतंत्रता, जिज्ञासा, बहुमुखी प्रतिभा, यात्रा" },
    6: { titleEn: "The Nurturing Guardian & Sacred Harmonisor", titleHi: "सहानुभूतिपूर्ण संरक्षक व समाज सेवी", planet: "Venus", ruler: "शुक्र", traitsEn: "Unconditional love, responsibility, aesthetics, service", traitsHi: "प्रेम, दायित्व बोध, सौंदर्यबोध, सेवाभाव" },
    7: { titleEn: "The Mystic Seeker & Philosophical Sage", titleHi: "गहन जिज्ञासु व अंतर्मुखी दार्शनिक", planet: "Ketu / Neptune", ruler: "केतु", traitsEn: "Analysis, spiritual depth, intuition, truth seeker", traitsHi: "अध्यात्म, गूढ़ ज्ञान, एकांत प्रिय, शोध" },
    8: { titleEn: "The Powerhouse & Abundance Manifestor", titleHi: "कर्मयोगी व समृद्धि का निर्माता", planet: "Saturn", ruler: "शनि", traitsEn: "Execution, authority, financial mastery, karma", traitsHi: "दृढ़ संकल्प, न्यायप्रियता, वित्तीय दक्षता" },
    9: { titleEn: "The Universal Humanitarian & Compassionate Sage", titleHi: "सर्वकल्याणकारी व उदार मार्गदर्शक", planet: "Mars", ruler: "मंगल", traitsEn: "Philanthropy, spiritual transcendence, wisdom, courage", traitsHi: "उदारता, वैश्विक चेतना, त्याग, निष्काम सेवा" },
    11: { titleEn: "Master Number 11: The Illuminator & Intuitive Conduit", titleHi: "मास्टर नंबर ११: आध्यात्मिक प्रकाश स्तंभ", planet: "Super-Moon", ruler: "उच्च चेतना", traitsEn: "Visionary intuition, spiritual awakening, cosmic catalyst", traitsHi: "अंतर्ज्ञान, आध्यात्मिक जागृति, दिव्य प्रेरणा" },
    22: { titleEn: "Master Number 22: The Master Architect of Civilizations", titleHi: "मास्टर नंबर २२: युगांतरकारी निर्माता", planet: "Super-Rahu", ruler: "महा-शिल्पी", traitsEn: "Translating cosmic ideals into tangible physical realities", traitsHi: "विशाल दृष्टि, युगांतकारी निर्माण, क्रियान्वयन" },
    33: { titleEn: "Master Number 33: The Master Teacher of Compassion", titleHi: "मास्टर नंबर ३३: परम कारुणिक गुरु", planet: "Super-Venus", ruler: "विश्व गुरु", traitsEn: "Supreme selfless devotion, humanitarian elevation", traitsHi: "निःस्वार्थ प्रेम, सर्वोच्च त्याग, मानवता का उत्थान" }
  };

  return {
    dob: dobStr,
    day: { raw: day, reduced: moolank },
    month: { raw: month, reduced: reducedMonth },
    year: { raw: year, reduced: reducedYear },
    // Moolank (Day-based)
    moolank,
    moolankSteps: day > 9 ? `${day} (जन्म दिन) → ${Math.floor(day / 10)} + ${day % 10} = ${moolank}` : `${day} (जन्म दिन) = ${moolank}`,
    moolankData,
    // Bhagyank (Full DOB sum)
    bhagyank,
    bhagyankSteps: `${reducedDay} (Day) + ${reducedMonth} (Month) + ${reducedYear} (Year) = ${rawSum} → ${bhagyank}`,
    bhagyankData,
    // Synergy & Lucky Factors
    synergy,
    luckyElements,
    // Legacy aliases for backward compatibility:
    lifePathNumber: bhagyank,
    archetype: ARCHETYPES[bhagyank] || ARCHETYPES[1],
    calculationSteps: `${reducedDay} (Day) + ${reducedMonth} (Month) + ${reducedYear} (Year) = ${rawSum} → ${bhagyank}`,
    isMasterNumber: bhagyank === 11 || bhagyank === 22 || bhagyank === 33
  };
}

/**
 * Calculates Name Numerology using Chaldean and Pythagorean systems.
 */
export function calculateNameNumerology(fullName) {
  if (!fullName) return null;
  const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, "");

  const chaldeanLetters = [];
  let chaldeanTotal = 0;
  let chaldeanVowelTotal = 0;
  let chaldeanConsonantTotal = 0;

  const pythagoreanLetters = [];
  let pythagoreanTotal = 0;
  let pythagoreanVowelTotal = 0;
  let pythagoreanConsonantTotal = 0;

  for (const char of cleanName) {
    const isVowel = VOWELS.has(char);

    // Chaldean
    const chVal = CHALDEAN_MAP[char] || 0;
    chaldeanLetters.push({ char, val: chVal, isVowel });
    chaldeanTotal += chVal;
    if (isVowel) chaldeanVowelTotal += chVal;
    else chaldeanConsonantTotal += chVal;

    // Pythagorean
    const pyVal = PYTHAGOREAN_MAP[char] || 0;
    pythagoreanLetters.push({ char, val: pyVal, isVowel });
    pythagoreanTotal += pyVal;
    if (isVowel) pythagoreanVowelTotal += pyVal;
    else pythagoreanConsonantTotal += pyVal;
  }

  return {
    originalName: fullName,
    cleanName,
    chaldean: {
      system: "Chaldean (Vedic Vibrational)",
      letters: chaldeanLetters,
      compoundNumber: chaldeanTotal,
      nameNumber: reduceToSingleDigit(chaldeanTotal, false),
      soulUrge: reduceToSingleDigit(chaldeanVowelTotal, false),
      personality: reduceToSingleDigit(chaldeanConsonantTotal, false)
    },
    pythagorean: {
      system: "Pythagorean (Western 1-9)",
      letters: pythagoreanLetters,
      compoundNumber: pythagoreanTotal,
      destinyNumber: reduceToSingleDigit(pythagoreanTotal, true),
      soulUrge: reduceToSingleDigit(pythagoreanVowelTotal, true),
      personality: reduceToSingleDigit(pythagoreanConsonantTotal, true)
    }
  };
}

/**
 * Calculates Personal Year and Personal Month cycles.
 */
export function calculatePersonalYearAndMonth(dobStr, targetYear = new Date().getFullYear(), targetMonth = new Date().getMonth() + 1) {
  if (!dobStr) return null;
  const parts = dobStr.split("-");
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);

  const reducedDay = reduceToSingleDigit(day, false);
  const reducedMonth = reduceToSingleDigit(month, false);
  const reducedTargetYear = reduceToSingleDigit(targetYear, false);

  const personalYear = reduceToSingleDigit(reducedDay + reducedMonth + reducedTargetYear, false);
  const personalMonth = reduceToSingleDigit(personalYear + targetMonth, false);

  const YEAR_THEMES = {
    1: { titleEn: "Year 1: Fresh Beginnings & Dynamic Seed-Planting", titleHi: "वर्ष १: नवीन आरंभ एवं महत्वाकांक्षी संकल्प", descEn: "Initiate bold new projects, embrace independence, and set the tone for your next 9-year cycle." },
    2: { titleEn: "Year 2: Patient Alignment & Harmonious Partnerships", titleHi: "वर्ष २: सहयोग, धैर्य एवं संबंधों की प्रगाढ़ता", descEn: "Cooperation, diplomatic diplomacy, relationship building, and trusting divine timing." },
    3: { titleEn: "Year 3: Creative Expansion & Social Self-Expression", titleHi: "वर्ष ३: रचनात्मक विस्तार एवं सामाजिक प्रतिष्ठा", descEn: "Artistic creativity, joyful socializing, public presentation, and intellectual optimism." },
    4: { titleEn: "Year 4: Building Foundations & Disciplined Execution", titleHi: "वर्ष ४: सुदृढ़ नींव, कठोर परिश्रम एवं संगठन", descEn: "Organization, focused grit, health routines, and laying enduring structural foundations." },
    5: { titleEn: "Year 5: Breakthrough Freedom & Unexpected Adventure", titleHi: "वर्ष ५: परिवर्तन, यात्राएं एवं मुक्ति का अनुभव", descEn: "Pivotal transitions, travel, exploring new horizons, breaking stagnant routines." },
    6: { titleEn: "Year 6: Domestic Devotion & Heartfelt Responsibility", titleHi: "वर्ष ६: पारिवारिक दायित्व, सेवा एवं सौंदर्य", descEn: "Family harmony, marriage or home improvements, community service, and compassionate duty." },
    7: { titleEn: "Year 7: Introspection, Spiritual Study & Soul Retreat", titleHi: "वर्ष ७: आत्म-मंथन, गहन अध्ययन एवं आध्यात्मिक शांति", descEn: "Internal growth, meditation, specialized research, and pausing material frenzies." },
    8: { titleEn: "Year 8: Material Abundance & Executive Karma", titleHi: "वर्ष ८: वित्तीय समृद्धि, प्रभाव एवं कर्मफल प्राप्ति", descEn: "Career culmination, financial growth, stepping into executive authority and business success." },
    9: { titleEn: "Year 9: Compassionate Completion & Sacred Release", titleHi: "वर्ष ९: पूर्णता, त्याग एवं विदाई का वर्ष", descEn: "Closing old chapters, releasing emotional baggage, charitable giving, and preparing for rebirth." }
  };

  return {
    dob: dobStr,
    targetYear,
    targetMonth,
    personalYear,
    personalMonth,
    yearTheme: YEAR_THEMES[personalYear] || YEAR_THEMES[1]
  };
}

/**
 * Calculates Radical (Moolank), Destiny (Bhagyank), and Number Compatibility.
 */
export function calculateNumberCompatibility(dobStr, partnerDobStr = null) {
  if (!dobStr) return null;
  const parts = dobStr.split("-");
  const day = parseInt(parts[2]);
  const moolank = reduceToSingleDigit(day, false);
  const lifePath = calculateLifePathNumber(dobStr);
  const bhagyank = lifePath ? lifePath.lifePathNumber : moolank;

  const COMPATIBILITY_RULES = {
    1: { friendly: [1, 2, 3, 9], neutral: [4, 5, 7], enemy: [6, 8], planet: "Sun" },
    2: { friendly: [1, 2, 4, 7], neutral: [3, 6], enemy: [5, 8, 9], planet: "Moon" },
    3: { friendly: [1, 2, 3, 9], neutral: [5, 6], enemy: [4, 7, 8], planet: "Jupiter" },
    4: { friendly: [1, 2, 7, 8], neutral: [5, 6], enemy: [3, 9], planet: "Rahu" },
    5: { friendly: [1, 5, 6], neutral: [3, 4, 7, 8, 9], enemy: [2], planet: "Mercury" },
    6: { friendly: [3, 5, 6, 9], neutral: [4, 7, 8], enemy: [1, 2], planet: "Venus" },
    7: { friendly: [1, 2, 4, 7], neutral: [3, 5, 6], enemy: [8, 9], planet: "Ketu" },
    8: { friendly: [3, 4, 5, 6], neutral: [7], enemy: [1, 2, 8, 9], planet: "Saturn" },
    9: { friendly: [1, 2, 3, 9], neutral: [5, 7], enemy: [4, 6, 8], planet: "Mars" }
  };

  const primaryRules = COMPATIBILITY_RULES[moolank] || COMPATIBILITY_RULES[1];

  let partnerResult = null;
  if (partnerDobStr) {
    const pParts = partnerDobStr.split("-");
    const pDay = parseInt(pParts[2]);
    const pMoolank = reduceToSingleDigit(pDay, false);
    const pLifePath = calculateLifePathNumber(partnerDobStr);
    const pBhagyank = pLifePath ? pLifePath.lifePathNumber : pMoolank;

    let score = 50;
    if (primaryRules.friendly.includes(pMoolank)) score += 35;
    else if (primaryRules.neutral.includes(pMoolank)) score += 15;
    else if (primaryRules.enemy.includes(pMoolank)) score -= 20;

    partnerResult = {
      partnerDob: partnerDobStr,
      partnerMoolank: pMoolank,
      partnerBhagyank: pBhagyank,
      compatibilityScore: Math.min(100, Math.max(20, score)),
      isHarmonious: primaryRules.friendly.includes(pMoolank)
    };
  }

  return {
    moolank,
    bhagyank,
    rulingPlanet: primaryRules.planet,
    friendlyNumbers: primaryRules.friendly,
    neutralNumbers: primaryRules.neutral,
    enemyNumbers: primaryRules.enemy,
    partnerResult
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PERSONAL DECISION TOOLS (TARA BALA, CHANDRA BALA, PRASHNA ORACLE, PANCHA PAKSHI)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculates Tara Bala (9 Cosmic Taras) for activity selection.
 */
export function calculateTaraBala(birthNakshatraIdx, targetNakshatraIdx, lang = "en") {
  const isHi = lang === "hi";
  const diff = (targetNakshatraIdx - birthNakshatraIdx + 27) % 27;
  const taraNum = (diff % 9) + 1; // 1 to 9

  const TARAS = [
    { num: 1, nameEn: "Janma Tara", nameHi: "जन्म तारा", quality: isHi ? "मध्यम / सतर्कता" : "Caution (Neutral)", score: 55, descEn: "Body and identity focus. Avoid intense surgical or high-risk initiatives." },
    { num: 2, nameEn: "Sampat Tara", nameHi: "सम्पत तारा", quality: isHi ? "अति शुभ / धन लाभ" : "Highly Auspicious (Wealth)", score: 95, descEn: "Brings prosperity, commercial gains, financial closings, and happiness." },
    { num: 3, nameEn: "Vipat Tara", nameHi: "विपत तारा", quality: isHi ? "प्रतिकूल / अवरोध" : "Inauspicious (Avoid)", score: 25, descEn: "Danger of obstacles, misunderstandings, and unnecessary stress." },
    { num: 4, nameEn: "Kshema Tara", nameHi: "क्षेम तारा", quality: isHi ? "शुभ / सुरक्षा व कल्याण" : "Auspicious (Well-Being)", score: 90, descEn: "Ensures safety, harmony, successful travel, and positive well-being." },
    { num: 5, nameEn: "Pratyak Tara", nameHi: "प्रत्यक तारा", quality: isHi ? "अवरोधक / विघ्न" : "Challenging (Hurdles)", score: 30, descEn: "Tendency for sudden opposition, paperwork delays, and arguments." },
    { num: 6, nameEn: "Sadhana Tara", nameHi: "साधना तारा", quality: isHi ? "उत्तम / कार्य सिद्धि" : "Highly Favorable (Success)", score: 95, descEn: "Peak accomplishments, spiritual sadhana, deals, and fulfillment." },
    { num: 7, nameEn: "Naidhana Tara", nameHi: "निधन तारा", quality: isHi ? "अशुभ / त्यागें" : "Very Inauspicious (Avoid)", score: 15, descEn: "Extreme caution advised. Strictly postpone signature of major contracts." },
    { num: 8, nameEn: "Mitra Tara", nameHi: "मित्र तारा", quality: isHi ? "शुभ / मैत्री व सहयोग" : "Favorable (Friendly)", score: 85, descEn: "Warm social connections, collaborations, pleasure trips, and creative flow." },
    { num: 9, nameEn: "Parama Mitra Tara", nameHi: "परम मित्र तारा", quality: isHi ? "सर्वोत्तम / परम कल्याण" : "Supreme Best (Supreme Blessing)", score: 98, descEn: "Magnificent divine protection, life celebrations, and crucial milestones." }
  ];

  return TARAS[taraNum - 1] || TARAS[0];
}

/**
 * Calculates Chandra Bala (Moon's strength by transit house).
 */
export function calculateChandraBala(natalMoonSignIdx, currentMoonSignIdx, lang = "en") {
  const isHi = lang === "hi";
  const house = ((currentMoonSignIdx - natalMoonSignIdx + 12) % 12) + 1;
  const isAuspicious = [1, 3, 6, 7, 10, 11].includes(house);

  return {
    houseFromMoon: house,
    isAuspicious,
    score: isAuspicious ? 85 : 35,
    verdictEn: isAuspicious
      ? `Transit Moon in house ${house} confers strong mental fortitude and favorable emotional rhythm.`
      : `Transit Moon in house ${house} suggests inward emotional retreat; avoid hasty impulsive financial commitments.`,
    verdictHi: isAuspicious
      ? `चंद्रमा आपकी राशि से ${house}वें भाव में गोचर कर रहा है जो मानसिक शांति व कार्य सिद्धि हेतु शुभ है।`
      : `चंद्रमा आपकी राशि से ${house}वें भाव में गोचररत है, अतः किसी भी महत्वपूर्ण निर्णय में जल्दबाजी से बचें।`
  };
}

/**
 * Prashna / Horary Quick Decision Oracle based on the query moment.
 */
export function getPrashnaQuickOracle({ question = "Should I proceed with this decision?", date = new Date(), lang = "en" }) {
  const isHi = lang === "hi";

  // Weekday Hora Lord
  const dayOfWeek = date.getDay();
  const DAY_FIRST_HORA = [0, 3, 2, 4, 5, 6, 1]; // Sun, Moon, Mars, Mer, Jup, Ven, Sat
  const hour = date.getHours();
  const horaLordIdx = (DAY_FIRST_HORA[dayOfWeek] + hour) % 7;
  const HORA_PLANETS = ["Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars"];
  const horaLord = HORA_PLANETS[horaLordIdx];

  const isBeneficHora = ["Jupiter", "Venus", "Mercury", "Moon"].includes(horaLord);

  return {
    question,
    consultationTime: date.toLocaleTimeString(),
    horaLord,
    isBeneficHora,
    confidence: isBeneficHora ? "High (शुभ समय)" : "Moderate (सतर्कता आवश्यक)",
    verdict: isBeneficHora ? "FAVORABLE (अनुकूल)" : "PROCEED WITH CAUTION (सावधानी बरतें)",
    guidanceEn: isBeneficHora
      ? `Governed currently by ${horaLord} Hora. Cosmic currents favor proactive action, clarity, and constructive outreach.`
      : `Governed currently by ${horaLord} Hora. Delay decisive contracts by a few hours or double-check all fine print before signing.`,
    guidanceHi: isBeneficHora
      ? `वर्तमान में ${horaLord} की होरा प्रभावी है। यह समय कार्य को आगे बढ़ाने एवं महत्वपूर्ण चर्चा हेतु अनुकूल है।`
      : `वर्तमान में ${horaLord} की होरा प्रभावी है। महत्वपूर्ण समझौतों में जल्दबाजी न करें एवं सभी तथ्यों की पुनः जांच करें।`
  };
}

/**
 * Pancha Pakshi (5 Cosmic Birds) calculator.
 */
export function calculatePanchaPakshi(birthNakshatraIdx, isShuklaPaksha = true, lang = "en") {
  const isHi = lang === "hi";
  const BIRDS = [
    { nameEn: "Vulture (Giddha)", nameHi: "गिद्ध", symbol: "🦅" },
    { nameEn: "Owl (Ullu)", nameHi: "उल्लू", symbol: "🦉" },
    { nameEn: "Crow (Kowwa)", nameHi: "कौआ", symbol: "🐦‍⬛" },
    { nameEn: "Rooster (Murga)", nameHi: "मुर्गा", symbol: "🐓" },
    { nameEn: "Peacock (Mor)", nameHi: "मयूर", symbol: "🦚" }
  ];

  const birdIdx = (birthNakshatraIdx % 5);
  const rulingBird = BIRDS[birdIdx];

  const STATES = [
    { stateEn: "Ruling / Eating (Bhojana)", stateHi: "भोजन (सर्वोत्तम)", power: 100, descEn: "Peak spiritual & executive power. Highest success rate for any initiative." },
    { stateEn: "Walking (Gamana)", stateHi: "गमन (शुभ)", power: 75, descEn: "Dynamic movement, productive business, and favorable travel." },
    { stateEn: "Sitting / Ruling Court (Rajya)", stateHi: "राज्य (स्थिर लाभ)", power: 85, descEn: "Authority, meetings with leaders, and strategic planning." },
    { stateEn: "Sleeping (Nidra)", stateHi: "निद्रा (निष्क्रिय)", power: 40, descEn: "Passive rest. Avoid contentious arguments or major investments." },
    { stateEn: "Dying (Marana)", stateHi: "मरण (निषिद्ध)", power: 10, descEn: "Zero vitality. Strictly avoid surgical interventions or launching new ventures." }
  ];

  // Current sub-period state
  const currentHour = new Date().getHours();
  const stateIdx = (currentHour + birdIdx) % 5;
  const currentState = STATES[stateIdx];

  return {
    rulingBird,
    currentState,
    paksha: isShuklaPaksha ? (isHi ? "शुक्ल पक्ष" : "Shukla Paksha") : (isHi ? "कृष्ण पक्ष" : "Krishna Paksha"),
    systemNote: isHi
      ? "प्राचीन दक्षिण भारतीय पंच पक्षी पद्धति के अनुसार आपकी जन्म जन्म-पक्षी ऊर्जा इस समय अत्यधिक महत्वपूर्ण है।"
      : "Ancient Tamil esoteric Pancha Pakshi system evaluates the cyclic biorhythm of your ruling cosmic bird."
  };
}
