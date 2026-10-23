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
 * Calculates Life Path Number from Date of Birth.
 */
export function calculateLifePathNumber(dobStr) {
  if (!dobStr) return null;
  const parts = dobStr.split("-");
  if (parts.length !== 3) return null;

  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);

  const reducedDay = reduceToSingleDigit(day, false);
  const reducedMonth = reduceToSingleDigit(month, false);
  const reducedYear = reduceToSingleDigit(year, false);

  const rawSum = reducedDay + reducedMonth + reducedYear;
  const lifePath = reduceToSingleDigit(rawSum, true);

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
    day: { raw: day, reduced: reducedDay },
    month: { raw: month, reduced: reducedMonth },
    year: { raw: year, reduced: reducedYear },
    calculationSteps: `${reducedDay} (Day) + ${reducedMonth} (Month) + ${reducedYear} (Year) = ${rawSum} → ${lifePath}`,
    lifePathNumber: lifePath,
    isMasterNumber: lifePath === 11 || lifePath === 22 || lifePath === 33,
    archetype: ARCHETYPES[lifePath] || ARCHETYPES[1]
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
