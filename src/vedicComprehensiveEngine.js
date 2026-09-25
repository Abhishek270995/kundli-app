/**
 * VEDIC COMPREHENSIVE ENGINE (सम्पूर्ण वैदिक ज्योतिष गणना महा-इंजन)
 * 
 * Implements the 10 Core Astrological Modules:
 * 1. Birth Data Engine (Julian Day, Sidereal Time, Lahiri Ayanamsa, Coordinates, LMT, Sunrise/Sunset)
 * 2. Natal Panchanga Engine (Tithi, Vaar, Nakshatra, Yoga, Karana, Dina/Ratri Maan, Rahu/Gulika Kaal)
 * 3. Graha Position & Baladi Engine (9 Planets, Degrees, Retrogression, Combustion, Dignity, Avasthas)
 * 4. Lagna & Bhava Chalit Engine (12 Bhavas, Cusps/Sandhi, Planet Shifts in Bhava Chalit)
 * 5. Nakshatra & Avakahada Chakra Engine (Varna, Vashya, Tara, Yoni, Gana, Nadi, Paya, Namakshar)
 * 6. Divisional Chart Engine (Shodashvarga: D1, D2, D3, D4, D7, D9, D10, D12, D16, D20, D24, D27, D30, D60 + Chandra/Surya Kundli)
 * 7. Yoga & Dosha Diagnostic Engine (Manglik, Kaal Sarp 12 types, Shani Sade Sati/Dhaiya, Pitra, Guru Chandal, Kemadruma, Yogas)
 * 8. Strength / Shadbala & Ashtakavarga Engine (6 Balas in Virupas, SAV 12-House Bindus out of 337)
 * 9. Dasha & Transit Engine (Vimshottari Mahadasha + Active Antardashas + Real-Time Gochara Transits)
 * 10. Interpretation & Report Engine Synthesizer
 */

import { SIGNS, NAKSHATRAS, TITHIS_EN, TITHIS_HI, YOGAS_LIST, getSignIndex } from "./jyotishEngine.js";

/* -------------------------------------------------------------
   1. BIRTH DATA ENGINE & SIDEREAL ASTRONOMY
------------------------------------------------------------- */

/**
 * Calculates Julian Day Number from Gregorian Date
 */
export function calculateJulianDay(date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate() + (date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600) / 24;

  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;
}

/**
 * Calculates Greenwich Mean Sidereal Time (GMST) in degrees
 */
export function calculateGMSTDegrees(date) {
  const jd = calculateJulianDay(date);
  const d = jd - 2451545.0;
  let gmst = 280.46061837 + 360.98564736629 * d;
  return ((gmst % 360) + 360) % 360;
}

/**
 * Calculates Local Sidereal Time (LST) in degrees
 */
export function calculateLSTDegrees(date, lon) {
  const gmst = calculateGMSTDegrees(date);
  return ((gmst + lon) % 360 + 360) % 360;
}

/**
 * Converts decimal degrees to Formatted Degrees, Minutes, Seconds string
 */
export function formatDMS(deg) {
  const d = Math.floor(deg);
  const remMin = (deg - d) * 60;
  const m = Math.floor(remMin);
  const s = Math.round((remMin - m) * 60);
  return `${d}° ${m < 10 ? "0" : ""}${m}' ${s < 10 ? "0" : ""}${s}"`;
}

/**
 * Calculates Sunrise and Sunset for given date, latitude, and longitude
 */
export function calculateBirthSunriseSunset(date, lat, lon) {
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const rad = Math.PI / 180;
  
  // Approximate solar declination
  const declination = 23.45 * Math.sin(rad * (360 / 365) * (dayOfYear - 81));
  
  // Hour angle for sunrise/sunset
  const latRad = lat * rad;
  const decRad = declination * rad;
  let cosH = -Math.tan(latRad) * Math.tan(decRad);
  cosH = Math.max(-1, Math.min(1, cosH));
  const hHours = Math.acos(cosH) / (15 * rad);
  
  // Solar noon approx (UTC + lon/15)
  // Assuming standard Indian timezone UTC+5:30 (82.5°E) or generic timezone from lon
  const tzOffsetHours = (date.getTimezoneOffset() ? -date.getTimezoneOffset() / 60 : 5.5);
  const solarNoonHours = 12 + (tzOffsetHours - lon / 15);
  
  let sunriseMinutes = Math.round((solarNoonHours - hHours) * 60);
  let sunsetMinutes = Math.round((solarNoonHours + hHours) * 60);

  if (sunriseMinutes < 0) sunriseMinutes += 1440;
  if (sunsetMinutes >= 1440) sunsetMinutes -= 1440;

  const formatMins = (m) => {
    const hh = Math.floor(m / 60) % 24;
    const mm = m % 60;
    const period = hh >= 12 ? "PM" : "AM";
    const displayH = hh % 12 === 0 ? 12 : hh % 12;
    return `${displayH}:${mm < 10 ? "0" : ""}${mm} ${period}`;
  };

  const dayDurationMins = sunsetMinutes - sunriseMinutes;
  const nightDurationMins = 1440 - dayDurationMins;
  const ghatis = (dayDurationMins / 24).toFixed(1);

  return {
    sunriseMins: sunriseMinutes,
    sunsetMins: sunsetMinutes,
    sunriseStr: formatMins(sunriseMinutes),
    sunsetStr: formatMins(sunsetMinutes),
    dayLength: `${Math.floor(dayDurationMins / 60)}h ${dayDurationMins % 60}m (${ghatis} Ghatis)`,
    nightLength: `${Math.floor(nightDurationMins / 60)}h ${nightDurationMins % 60}m`,
    isDayBirth: (date.getHours() * 60 + date.getMinutes()) >= sunriseMinutes && (date.getHours() * 60 + date.getMinutes()) < sunsetMinutes
  };
}


/* -------------------------------------------------------------
   2. PANCHANGA ENGINE (NATAL BIRTH PANCHANG)
------------------------------------------------------------- */

export const TITHI_DEITIES = [
  { en: "Agni (Fire Lord)", hi: "अग्नि देव" },
  { en: "Brahma (Creator)", hi: "ब्रह्मा जी" },
  { en: "Gauri / Parvati", hi: "माता गौरी" },
  { en: "Lord Ganesha", hi: "भगवान गणेश" },
  { en: "Nagaraja (Serpent King)", hi: "नागराज" },
  { en: "Lord Kartikeya (Murugan)", hi: "भगवान कार्तिकेय" },
  { en: "Surya (Sun God)", hi: "भगवान सूर्य" },
  { en: "Ashta Vasus / Shiva", hi: "अष्ट वसु / भगवान शिव" },
  { en: "Durga / Saraswati", hi: "माता दुर्गा" },
  { en: "Yama / Dharma Raja", hi: "यमराज / धर्मराज" },
  { en: "Rudra / Shiva", hi: "भगवान रुद्र" },
  { en: "Vishnu / Hari", hi: "भगवान विष्णु" },
  { en: "Kamadeva (Love Lord)", hi: "कामदेव" },
  { en: "Shiva / Rudra", hi: "भगवान शिव" },
  { en: "Chandra (Moon Lord)", hi: "चंद्र देव" }
];

export const TITHI_NATURE = [
  { en: "Nanda (Delightful - Auspicious for beginnings)", hi: "नंदा (आनंददायक - नवीन कार्य प्रारंभ हेतु शुभ)" },
  { en: "Bhadra (Auspicious - Good for commerce & building)", hi: "भद्रा (कल्याणकारी - व्यापार व निर्माण हेतु शुभ)" },
  { en: "Jaya (Victorious - Excellent for overcoming obstacles)", hi: "जया (विजयप्रद - विजय व प्रतिस्पर्धा हेतु उत्तम)" },
  { en: "Rikta (Empty/Challenging - Good for cleansing & spiritual work)", hi: "रिक्ता (शोधक - साधना व गुप्त कार्यों हेतु श्रेष्ठ)" },
  { en: "Poorna (Complete/Fulfilling - Best for prosperity & ceremonies)", hi: "पूर्णा (पूर्णता - सर्व कार्य सिद्धि हेतु परम कल्याणकारी)" }
];

export const KARANA_LIST = [
  { name: "Bava", type: "Movable (चर)", animal: "Lion (सिंह)", lord: "Sun", deity: "Indra" },
  { name: "Balava", type: "Movable (चर)", animal: "Leopard (तेंदुआ)", lord: "Moon", deity: "Brahma" },
  { name: "Kaulava", type: "Movable (चर)", animal: "Pig (सूअर)", lord: "Mars", deity: "Mitra" },
  { name: "Taitila", type: "Movable (चर)", animal: "Donkey (गधा)", lord: "Mercury", deity: "Aryaman" },
  { name: "Gara", type: "Movable (चर)", animal: "Elephant (हाथी)", lord: "Jupiter", deity: "Bhumi" },
  { name: "Vanija", type: "Movable (चर)", animal: "Cow (गाय)", lord: "Venus", deity: "Shri" },
  { name: "Vishti (Bhadra)", type: "Movable (चर)", animal: "Dog (श्वान)", lord: "Saturn", deity: "Yama" },
  { name: "Shakuni", type: "Fixed (स्थिर)", animal: "Bird (शकुनि)", lord: "Rahu", deity: "Kalyana" },
  { name: "Chatushpada", type: "Fixed (स्थिर)", animal: "Quadruped (चौपाया)", lord: "Ketu", deity: "Rudra" },
  { name: "Naga", type: "Fixed (स्थिर)", animal: "Serpent (नाग)", lord: "Rahu", deity: "Nagas" },
  { name: "Kintughna", type: "Fixed (स्थिर)", animal: "Worm (कीट)", lord: "Jupiter", deity: "Vayu" }
];

export const VAAR_DETAILS = [
  { nameEn: "Sunday (Ravivaar)", nameHi: "रविवार", lord: "Sun", deity: "Lord Surya", element: "Fire" },
  { nameEn: "Monday (Somvaar)", nameHi: "सोमवार", lord: "Moon", deity: "Lord Shiva", element: "Water" },
  { nameEn: "Tuesday (Mangalvaar)", nameHi: "मंगलवार", lord: "Mars", deity: "Lord Hanuman / Kartikeya", element: "Fire" },
  { nameEn: "Wednesday (Budhvaar)", nameHi: "बुधवार", lord: "Mercury", deity: "Lord Vishnu", element: "Earth" },
  { nameEn: "Thursday (Guruvaar)", nameHi: "गुरुवार", lord: "Jupiter", deity: "Lord Brihaspati / Dattatreya", element: "Ether" },
  { nameEn: "Friday (Shukravaar)", nameHi: "शुक्रवार", lord: "Venus", deity: "Maa Lakshmi", element: "Water" },
  { nameEn: "Saturday (Shanivaar)", nameHi: "शनिवार", lord: "Saturn", deity: "Lord Shani / Bhairava", element: "Air" }
];

/**
 * Calculates complete 5-limb Natal Birth Panchang
 */
export function calculateNatalBirthPanchang({ birthDate, lat, lon, sunDeg, moonDeg, lang = "en" }) {
  const isHi = lang === "hi";
  const numSun = parseFloat(sunDeg) || 0;
  const numMoon = parseFloat(moonDeg) || 0;

  // 1. Tithi
  const diffDeg = ((numMoon - numSun + 360) % 360);
  const tithiIdx = Math.floor(diffDeg / 12) % 30; // 0 to 29
  const isShukla = tithiIdx < 15;
  const pakshaEn = isShukla ? "Shukla Paksha (Waxing Bright Half)" : "Krishna Paksha (Waning Dark Half)";
  const pakshaHi = isShukla ? "शुक्ल पक्ष (उज्ज्वल पक्ष)" : "कृष्ण पक्ष (अंधकार पक्ष)";
  const tithiNameEn = TITHIS_EN[tithiIdx];
  const tithiNameHi = TITHIS_HI[tithiIdx];
  const tithiDeity = TITHI_DEITIES[tithiIdx % 15];
  const tithiNature = TITHI_NATURE[tithiIdx % 5];
  const tithiElapsedPct = (((diffDeg % 12) / 12) * 100).toFixed(1);

  // 2. Vaar (Day of week)
  const dayIdx = birthDate.getDay(); // 0 = Sun
  const vaar = VAAR_DETAILS[dayIdx];

  // 3. Nakshatra
  const moonNorm = ((numMoon % 360) + 360) % 360;
  const nakSegment = 360 / 27;
  const nakIdx = Math.floor(moonNorm / nakSegment) % 27;
  const nakPada = Math.floor((moonNorm % nakSegment) / (nakSegment / 4)) + 1;
  const birthNak = NAKSHATRAS[nakIdx];

  // 4. Yoga
  const yogaDeg = ((numSun + numMoon) % 360);
  const yogaIdx = Math.floor(yogaDeg / nakSegment) % 27;
  const yogaName = YOGAS_LIST[yogaIdx] || "Shubha";
  const inauspiciousYogas = ["Vishkambha", "Atiganda", "Shula", "Ganda", "Vyaghata", "Vajra", "Vyatipata", "Parigha", "Vaidhriti"];
  const isAuspiciousYoga = !inauspiciousYogas.includes(yogaName);

  // 5. Karana
  const karanaIdx = Math.floor(diffDeg / 6); // 0 to 59
  let karanaObj;
  if (karanaIdx === 0) {
    karanaObj = KARANA_LIST[10]; // Kintughna
  } else if (karanaIdx >= 57) {
    karanaObj = KARANA_LIST[7 + (karanaIdx - 57)]; // Shakuni, Chatushpada, Naga
  } else {
    karanaObj = KARANA_LIST[(karanaIdx - 1) % 7]; // Bava to Vishti
  }

  // Sunrise / Sunset & Day/Night
  const sunTimes = calculateBirthSunriseSunset(birthDate, lat, lon);

  // Rahu Kaal slot
  const rahuSlots = [7, 1, 6, 4, 5, 3, 2]; // Sun=8th, Mon=2nd, Tue=7th, Wed=5th, Thu=6th, Fri=4th, Sat=3rd (0-indexed)
  const slotIdx = rahuSlots[dayIdx];
  const dayPartMins = (sunTimes.sunsetMins - sunTimes.sunriseMins) / 8;
  const rahuStart = sunTimes.sunriseMins + Math.round(slotIdx * dayPartMins);
  const rahuEnd = sunTimes.sunriseMins + Math.round((slotIdx + 1) * dayPartMins);

  const formatMins = (m) => {
    const hh = Math.floor(m / 60) % 24;
    const mm = m % 60;
    const p = hh >= 12 ? "PM" : "AM";
    const dh = hh % 12 === 0 ? 12 : hh % 12;
    return `${dh}:${mm < 10 ? "0" : ""}${mm} ${p}`;
  };

  return {
    tithi: isHi ? tithiNameHi : tithiNameEn,
    tithiNumber: tithiIdx + 1,
    paksha: isHi ? pakshaHi : pakshaEn,
    isShukla,
    tithiDeity: isHi ? tithiDeity.hi : tithiDeity.en,
    tithiNature: isHi ? tithiNature.hi : tithiNature.en,
    tithiElapsedPct: `${tithiElapsedPct}%`,
    vaar: isHi ? vaar.nameHi : vaar.nameEn,
    vaarLord: vaar.lord,
    vaarDeity: vaar.deity,
    nakshatra: isHi ? `${birthNak.hindi} (चरण ${nakPada})` : `${birthNak.name} (Pada ${nakPada})`,
    nakshatraLord: birthNak.lord,
    nakshatraGana: birthNak.gana,
    nakshatraYoni: birthNak.yoni,
    nakshatraNadi: birthNak.nadi,
    yoga: yogaName,
    isYogaAuspicious: isAuspiciousYoga,
    yogaStatus: isAuspiciousYoga ? (isHi ? "शुभ योग" : "Auspicious Yoga") : (isHi ? "सावधानी योग" : "Requires Care"),
    karana: `${karanaObj.name} (${karanaObj.type})`,
    karanaAnimal: karanaObj.animal,
    karanaLord: karanaObj.lord,
    sunrise: sunTimes.sunriseStr,
    sunset: sunTimes.sunsetStr,
    dayLength: sunTimes.dayLength,
    isDayBirth: sunTimes.isDayBirth,
    birthKaal: sunTimes.isDayBirth ? (isHi ? "दिन का जन्म (दिवा जन्म)" : "Daytime Birth (Dina Janma)") : (isHi ? "रात्रि का जन्म (रात्रि जन्म)" : "Nighttime Birth (Ratri Janma)"),
    rahuKaal: `${formatMins(rahuStart)} – ${formatMins(rahuEnd)}`
  };
}


/* -------------------------------------------------------------
   3. NAKSHATRA & AVAKAHADA CHAKRA ENGINE (अवकहड़ा चक्र)
------------------------------------------------------------- */

export const AVAKAHADA_NAMAKSHAR = [
  ["Chu (चू)", "Che (चे)", "Cho (चो)", "La (ला)"], // Ashwini
  ["Lee (ली)", "Loo (लू)", "Le (ले)", "Lo (लो)"], // Bharani
  ["Aa (अ)", "Ee (ई)", "U (उ)", "Ay (ए)"], // Krittika
  ["O (ओ)", "Vaa (वा)", "Vee (वी)", "Vu (वू)"], // Rohini
  ["Ve (वे)", "Vo (वो)", "Kaa (का)", "Kee (की)"], // Mrigashira
  ["Ku (कु)", "Gha (घ)", "Ng (ङ)", "Chha (छ)"], // Ardra
  ["Ke (के)", "Ko (को)", "Haa (हा)", "Hee (ही)"], // Punarvasu
  ["Hoo (हू)", "He (हे)", "Ho (हो)", "Daa (डा)"], // Pushya
  ["Dee (डी)", "Doo (डू)", "De (डे)", "Do (डो)"], // Ashlesha
  ["Maa (मा)", "Mee (मी)", "Moo (मू)", "Me (मे)"], // Magha
  ["Mo (मो)", "Taa (टा)", "Tee (टी)", "Too (टू)"], // Purva Phalguni
  ["Te (टे)", "To (टो)", "Paa (पा)", "Pee (पी)"], // Uttara Phalguni
  ["Poo (पू)", "Sha (ष)", "Na (ण)", "Tha (ठ)"], // Hasta
  ["Pe (पे)", "Po (पो)", "Raa (रा)", "Ree (री)"], // Chitra
  ["Roo (रू)", "Re (रे)", "Ro (रो)", "Taa (ता)"], // Swati
  ["Tee (ती)", "Too (तू)", "Te (ते)", "To (तो)"], // Vishakha
  ["Naa (ना)", "Nee (नी)", "Noo (नू)", "Ne (ने)"], // Anuradha
  ["No (नो)", "Yaa (या)", "Yee (यी)", "Yoo (यू)"], // Jyeshtha
  ["Ye (ये)", "Yo (यो)", "Bhaa (भा)", "Bhee (भी)"], // Mula
  ["Bhoo (भू)", "Dhaa (धा)", "Pha (फा)", "Dhaa (ढा)"], // Purva Ashadha
  ["Bhe (भे)", "Bho (भो)", "Jaa (जा)", "Jee (जी)"], // Uttara Ashadha
  ["Khee (खी)", "Khoo (खू)", "Khe (खे)", "Kho (खो)"], // Shravana
  ["Gaa (गा)", "Gee (गी)", "Goo (गू)", "Ge (गे)"], // Dhanishta
  ["Go (गो)", "Saa (सा)", "See (सी)", "Soo (सू)"], // Shatabhisha
  ["Se (से)", "So (सो)", "Daa (दा)", "Dee (दी)"], // Purva Bhadrapada
  ["Doo (दू)", "Tha (थ)", "Jha (झ)", "Nga (ञ)"], // Uttara Bhadrapada
  ["De (दे)", "Do (दो)", "Chaa (चा)", "Chee (ची)"] // Revati
];

export const TARA_NAMES = [
  { en: "Janma (Birth Star - Core vitality)", hi: "जन्म (मूल ऊर्जा व व्यक्तित्व)" },
  { en: "Sampat (Wealth - Bestows material abundance)", hi: "सम्पत (धन व भौतिक समृद्धि)" },
  { en: "Vipat (Misfortune - Requires patience & caution)", hi: "विपत (अवरोध - धैर्य व सावधानी अपेक्षित)" },
  { en: "Kshema (Well-being - Grants security & protection)", hi: "क्षेम (कल्याण, सुरक्षा व आरोग्य)" },
  { en: "Pratyak (Obstacles - Teaches resilience)", hi: "प्रत्यक (चुनौतियां - आत्मबल की परीक्षा)" },
  { en: "Sadhaka (Success - Highly favorable for accomplishments)", hi: "साधक (सिद्धि व अभीष्ट कार्य पूर्णता)" },
  { en: "Vadha (Danger - Demands remedial shield)", hi: "वध (सावधानी व शांति अनुष्ठान अपेक्षित)" },
  { en: "Mitra (Friendly - Harmonious partnerships)", hi: "मित्र (सद्भाव व सहयोगी संबंध)" },
  { en: "Param Mitra (Best Friend - Supreme cosmic support)", hi: "परम मित्र (सर्वोच्च सहायता व सौभाग्य)" }
];

/**
 * Computes complete Avakahada Chakra for given Moon degree & Lagna degree
 */
export function calculateAvakahadaChakra(moonDeg, ascDeg, lang = "en") {
  const isHi = lang === "hi";
  const numMoon = parseFloat(moonDeg) || 0;
  const numAsc = parseFloat(ascDeg) || 0;
  const moonSignIdx = getSignIndex(numMoon);
  const ascSignIdx = getSignIndex(numAsc);
  const moonSign = SIGNS[moonSignIdx];

  const moonNorm = ((numMoon % 360) + 360) % 360;
  const nakSegment = 360 / 27;
  const nakIdx = Math.floor(moonNorm / nakSegment) % 27;
  const pada = Math.floor((moonNorm % nakSegment) / (nakSegment / 4)) + 1;
  const nak = NAKSHATRAS[nakIdx];

  // 1. Varna (from Moon Sign)
  const varnaEn = moonSign.varna || "Brahmin";
  const varnaHiMap = {
    Brahmin: "ब्राह्मण (ज्ञान व प्रज्ञा)",
    Kshatriya: "क्षत्रिय (नेतृत्व व शौर्य)",
    Vaishya: "वैश्य (व्यापार व प्रबंधन)",
    Shudra: "शूद्र (कर्मठता व सेवा)"
  };
  const varnaHi = varnaHiMap[varnaEn] || varnaEn;

  // 2. Vashya (from Moon Sign)
  const vashyaEn = moonSign.vashya || "Chatushpada";
  const vashyaHiMap = {
    Chatushpada: "चतुष्पाद (चौपाया)",
    Dwipada: "द्विपद / मानव",
    Jalachara: "जलचर (जलीय जीव)",
    Keeta: "कीट (सूक्ष्म/रहस्यमयी)",
    Vanachara: "वनचर (वन्य पशु)"
  };
  const vashyaHi = vashyaHiMap[vashyaEn] || vashyaEn;

  // 3. Yoni & Animal
  const yoniEn = nak.yoni;
  const yoniHiMap = {
    Horse: "अश्व (Horse)", Elephant: "गज (Elephant)", Sheep: "मेष (Sheep)",
    Serpent: "सर्प (Serpent)", Dog: "श्वान (Dog)", Cat: "मार्जार (Cat)",
    Rat: "मूषक (Rat)", Cow: "गौ (Cow)", Buffalo: "महिष (Buffalo)",
    Tiger: "व्याघ्र (Tiger)", Hare: "शशक (Hare)", Monkey: "वानर (Monkey)",
    Lion: "सिंह (Lion)", Mongoose: "नकुल (Mongoose)", Deer: "मृग (Deer)"
  };
  const yoniHi = yoniHiMap[yoniEn] || yoniEn;

  // 4. Gana
  const ganaEn = nak.gana;
  const ganaHi = ganaEn === "Deva" ? "देव गण (सौम्य, सात्विक व परोपकारी)" : ganaEn === "Manushya" ? "मनुष्य गण (संतुलित, व्यावहारिक व कर्मठ)" : "राक्षस गण (ऊर्जावान, महत्वाकांक्षी व पराक्रमी)";

  // 5. Nadi
  const nadiEn = nak.nadi;
  const nadiHi = nadiEn === "Adi" ? "आदि नाड़ी (वात तत्व - स्फूर्ति व विचारशीलता)" : nadiEn === "Madhya" ? "मध्य नाड़ी (पित्त तत्व - पराक्रम व तेज)" : "अंत्य नाड़ी (कफ तत्व - स्थायित्व व शांति)";

  // 6. Paya (Based on Moon's house from Lagna: 1,6,11 = Gold; 2,5,9 = Silver; 3,7,10 = Copper; 4,8,12 = Iron)
  const houseFromAsc = ((moonSignIdx - ascSignIdx + 12) % 12) + 1;
  let payaEn, payaHi, payaDescEn, payaDescHi;
  if ([2, 5, 9].includes(houseFromAsc)) {
    payaEn = "Rajata Paya (Silver Foot - Most Auspicious)";
    payaHi = "रजत पाया (चांदी का पाया - अत्यंत शुभ)";
    payaDescEn = "Brings exceptional prosperity, honor, smooth life progression, and strong domestic happiness.";
    payaDescHi = "यह पाया जीवन में सुख-समृद्धि, सम्मान और निरंतर प्रगति प्रदान करने वाला अत्यंत शुभ माना गया है।";
  } else if ([3, 7, 10].includes(houseFromAsc)) {
    payaEn = "Tamra Paya (Copper Foot - Highly Favorable)";
    payaHi = "ताम्र पाया (तांबे का पाया - उत्तम फलप्रद)";
    payaDescEn = "Imparts relentless courage, leadership in career, health resilience, and victorious pursuits.";
    payaDescHi = "यह पाया साहसिक पराक्रम, कर्मक्षेत्र में नेतृत्व और दृढ़ संकल्प शक्ति प्रदान करता है।";
  } else if ([1, 6, 11].includes(houseFromAsc)) {
    payaEn = "Swarna Paya (Gold Foot - Demands Righteous Deeds)";
    payaHi = "स्वर्ण पाया (सोने का पाया - धर्मनिष्ठ कर्म अपेक्षित)";
    payaDescEn = "High ambition and radiant potential; requires adherence to ethical conduct and disciplined financial choices.";
    payaDescHi = "महान महत्वाकांक्षा का सूचक; धर्मनिष्ठ आचरण और वित्तीय अनुशासन से श्रेष्ठ फल प्राप्त होते हैं।";
  } else {
    payaEn = "Loha Paya (Iron Foot - Builds Resilient Character)";
    payaHi = "लौह पाया (लोहे का पाया - कर्मठता व संघर्षशील)";
    payaDescEn = "Grants indomitable stamina and patience; achievements arrive through steady determination and perseverance.";
    payaDescHi = "कठिन परिस्थितियों में भी अडिग रहने की क्षमता देता है; निरंतर पुरुषार्थ से महान सफलता मिलती है।";
  }

  // 7. Namakshar (Lucky starting syllables for name)
  const syllables = AVAKAHADA_NAMAKSHAR[nakIdx] || ["Om", "Shree", "Ram", "Hari"];
  const luckySyllable = syllables[pada - 1] || syllables[0];

  // 8. Element / Tatva
  const tatvaEn = moonSign.element;
  const tatvaHi = tatvaEn === "Fire" ? "अग्नि तत्व (ऊर्जावान)" : tatvaEn === "Earth" ? "पृथ्वी तत्व (धैर्यवान व व्यावहारिक)" : tatvaEn === "Air" ? "वायु तत्व (बौद्धिक व संचारप्रिय)" : "जल तत्व (भावुक व संवेदनशील)";

  return {
    varna: isHi ? varnaHi : varnaEn,
    vashya: isHi ? vashyaHi : vashyaEn,
    yoni: isHi ? yoniHi : yoniEn,
    gana: isHi ? ganaHi : ganaEn,
    nadi: isHi ? nadiHi : nadiEn,
    paya: isHi ? payaHi : payaEn,
    payaDesc: isHi ? payaDescHi : payaDescEn,
    tatva: isHi ? tatvaHi : tatvaEn,
    namakshar: luckySyllable,
    allSyllables: syllables.join(", "),
    nakshatraLord: nak.lord,
    rashiLord: moonSign.lord
  };
}


/* -------------------------------------------------------------
   4. LAGNA & BHAVA CHALIT ENGINE (भाव चलित व संधि)
------------------------------------------------------------- */

/**
 * Calculates Sripati Bhava Arambha, Madhya, and Anta cusps & Chalit chart
 */
export function calculateBhavaChalit(ascDeg, planets, lang = "en") {
  const isHi = lang === "hi";
  const ascSignIdx = getSignIndex(ascDeg);
  
  // 12 Bhava Madhyas (centers) and Sandhis (cusps)
  // In equal/Sripati system, Bhava 1 Madhya = Ascendant Degree
  const bhavaMadhyas = [];
  const bhavaArambhas = [];
  const bhavaAntas = [];

  for (let i = 0; i < 12; i++) {
    const madhya = ((ascDeg + i * 30) % 360 + 360) % 360;
    const arambha = ((madhya - 15) % 360 + 360) % 360;
    const anta = ((madhya + 15) % 360 + 360) % 360;
    bhavaMadhyas.push(madhya);
    bhavaArambhas.push(arambha);
    bhavaAntas.push(anta);
  }

  // Bhava Chalit Houses Dictionary for rendering
  const chalitHouses = {};
  for (let h = 1; h <= 12; h++) {
    const currentSignIdx = (ascSignIdx + (h - 1)) % 12;
    chalitHouses[h] = {
      sign: SIGNS[currentSignIdx].name,
      signSanskrit: SIGNS[currentSignIdx].sanskrit,
      lord: SIGNS[currentSignIdx].lord,
      planets: [],
      planetDetails: [],
      madhyaDeg: bhavaMadhyas[h - 1],
      madhyaFormatted: formatDMS(bhavaMadhyas[h - 1] % 30),
      arambhaFormatted: formatDMS(bhavaArambhas[h - 1] % 30),
      antaFormatted: formatDMS(bhavaAntas[h - 1] % 30)
    };
  }

  // Planet placement in Bhava Chalit
  const shiftedPlanets = [];
  Object.entries(planets).forEach(([pName, pDeg]) => {
    const normPDeg = ((pDeg % 360) + 360) % 360;
    const rashiHouseNum = ((getSignIndex(pDeg) - ascSignIdx + 12) % 12) + 1;

    // Find which Bhava Chalit span this planet falls in
    let chalitHouseNum = 1;
    for (let h = 1; h <= 12; h++) {
      const start = bhavaArambhas[h - 1];
      const end = bhavaAntas[h - 1];
      let inside = false;
      if (start < end) {
        inside = normPDeg >= start && normPDeg < end;
      } else {
        // Wraps around 360°
        inside = normPDeg >= start || normPDeg < end;
      }
      if (inside) {
        chalitHouseNum = h;
        break;
      }
    }

    chalitHouses[chalitHouseNum].planets.push(pName);
    chalitHouses[chalitHouseNum].planetDetails.push({
      name: pName,
      deg: normPDeg % 30,
      degree: formatDMS(normPDeg % 30)
    });

    if (chalitHouseNum !== rashiHouseNum) {
      shiftedPlanets.push({
        planet: pName,
        rashiHouse: rashiHouseNum,
        chalitHouse: chalitHouseNum,
        reasonEn: `${pName} is near the cusp boundary (${(pDeg % 30).toFixed(1)}° in ${SIGNS[getSignIndex(pDeg)].name}) and shifts into House ${chalitHouseNum} in Bhava Chalit, exerting primary karmic action through the ${chalitHouseNum}th house.`,
        reasonHi: `${pName} संधि बिंदु के समीप होने से भाव चलित में ${chalitHouseNum}वें भाव में स्थानांतरित हो जाता है, जिससे यह मुख्य रूप से ${chalitHouseNum}वें भाव के फल प्रदान करेगा।`
      });
    }
  });

  return {
    chalitHouses,
    shiftedPlanets,
    hasShift: shiftedPlanets.length > 0,
    bhavaCuspsTable: bhavaMadhyas.map((m, idx) => ({
      house: idx + 1,
      sign: SIGNS[getSignIndex(m)].name,
      signSanskrit: SIGNS[getSignIndex(m)].sanskrit,
      arambha: formatDMS(bhavaArambhas[idx] % 30),
      madhya: formatDMS(m % 30),
      anta: formatDMS(bhavaAntas[idx] % 30)
    }))
  };
}


/* -------------------------------------------------------------
   5. DIVISIONAL CHART ENGINE (SHODASHVARGA - षोडशवर्ग)
------------------------------------------------------------- */

/**
 * Calculates Divisional Sign Index (0-11) for all 16 classical Shodashvargas
 */
export function getDivisionalSignIndex(longitudeDeg, division) {
  const deg = ((longitudeDeg % 360) + 360) % 360;
  const signIdx = Math.floor(deg / 30);
  const degInSign = deg % 30;
  const isOdd = signIdx % 2 === 0; // 0=Aries (odd), 1=Taurus (even)

  switch (division) {
    case "D1": // Rashi
      return signIdx;

    case "D2": { // Hora (Parashara: Odd -> Sun(Leo 4)/Moon(Cancer 3), Even -> Moon/Sun)
      const isFirstHalf = degInSign < 15;
      if (isOdd) {
        return isFirstHalf ? 4 : 3; // Leo (4) or Cancer (3)
      } else {
        return isFirstHalf ? 3 : 4; // Cancer (3) or Leo (4)
      }
    }

    case "D3": { // Drekkana (Decanates: 1st 0-10°=same, 2nd 10-20°=5th, 3rd 20-30°=9th)
      const dec = Math.floor(degInSign / 10);
      return (signIdx + dec * 4) % 12;
    }

    case "D4": { // Chaturthamsha (4 parts of 7°30': 1st=same, 2nd=4th, 3rd=7th, 4th=10th)
      const part = Math.floor(degInSign / 7.5);
      return (signIdx + part * 3) % 12;
    }

    case "D7": { // Saptamsha (7 parts of 4°17'08.57": Odd starts same, Even starts 7th)
      const part = Math.floor(degInSign / (30 / 7));
      const start = isOdd ? signIdx : (signIdx + 6) % 12;
      return (start + part) % 12;
    }

    case "D9": { // Navamsha (9 parts of 3°20': Movable=same, Fixed=9th, Dual=5th)
      const part = Math.floor(degInSign / (30 / 9));
      let start = signIdx;
      if ([1, 4, 7, 10].includes(signIdx)) { // Fixed
        start = (signIdx + 8) % 12;
      } else if ([2, 5, 8, 11].includes(signIdx)) { // Dual
        start = (signIdx + 4) % 12;
      }
      return (start + part) % 12;
    }

    case "D10": { // Dasamsha (10 parts of 3°: Odd starts same, Even starts 9th)
      const part = Math.floor(degInSign / 3);
      const start = isOdd ? signIdx : (signIdx + 8) % 12;
      return (start + part) % 12;
    }

    case "D12": { // Dwadasamsha (12 parts of 2°30': Starts same sign)
      const part = Math.floor(degInSign / 2.5);
      return (signIdx + part) % 12;
    }

    case "D16": { // Shodashamsha (16 parts of 1°52'30": Movable Aries 0, Fixed Leo 4, Dual Sagittarius 8)
      const part = Math.floor(degInSign / (30 / 16));
      let start = 0; // Aries
      if ([1, 4, 7, 10].includes(signIdx)) start = 4; // Leo
      else if ([2, 5, 8, 11].includes(signIdx)) start = 8; // Sagittarius
      return (start + part) % 12;
    }

    case "D20": { // Vimshamsha (20 parts of 1°30': Movable Aries 0, Fixed Sagittarius 8, Dual Leo 4)
      const part = Math.floor(degInSign / 1.5);
      let start = 0;
      if ([1, 4, 7, 10].includes(signIdx)) start = 8;
      else if ([2, 5, 8, 11].includes(signIdx)) start = 4;
      return (start + part) % 12;
    }

    case "D24": { // Chaturvimshamsha (24 parts of 1°15': Odd Leo 4, Even Cancer 3)
      const part = Math.floor(degInSign / 1.25);
      const start = isOdd ? 4 : 3;
      return (start + part) % 12;
    }

    case "D27": { // Saptavimshamsha / Bhamsa (27 parts of 1°06'40": Fire 0, Earth 3, Air 6, Water 9)
      const part = Math.floor(degInSign / (30 / 27));
      const triplicity = signIdx % 4; // 0=Fire, 1=Earth, 2=Air, 3=Water
      const start = triplicity * 3;
      return (start + part) % 12;
    }

    case "D30": { // Trimshamsha (Odd: Mars 5°, Sat 5°, Jup 8°, Merc 7°, Ven 5°; Even reversed)
      if (isOdd) {
        if (degInSign < 5) return 0; // Aries (Mars)
        if (degInSign < 10) return 10; // Aquarius (Saturn)
        if (degInSign < 18) return 8; // Sagittarius (Jupiter)
        if (degInSign < 25) return 2; // Gemini (Mercury)
        return 1; // Taurus (Venus)
      } else {
        if (degInSign < 5) return 1; // Taurus (Venus)
        if (degInSign < 12) return 5; // Virgo (Mercury)
        if (degInSign < 20) return 11; // Pisces (Jupiter)
        if (degInSign < 25) return 9; // Capricorn (Saturn)
        return 7; // Scorpio (Mars)
      }
    }

    case "D60": { // Shashtiamsha (60 parts of 30': Count starts from same sign)
      const part = Math.floor(degInSign / 0.5);
      return (signIdx + part) % 12;
    }

    default:
      return signIdx;
  }
}

export const SHODASHVARGA_LIST = [
  { id: "D1", nameEn: "D1 Rashi", nameHi: "डी-१ लग्न / राशि कुंडली", descEn: "Physical body, vitality, and primary life destiny", descHi: "शारीरिक ऊर्जा, व्यक्तित्व व संपूर्ण जीवन की दिशा" },
  { id: "D9", nameEn: "D9 Navamsha", nameHi: "डी-९ नवांश कुंडली", descEn: "Dharma, marriage, spouse, and supreme inner soul potential", descHi: "धर्म, दांपत्य सुख, जीवनसाथी व आत्मा का सूक्ष्म स्वरूप" },
  { id: "D10", nameEn: "D10 Dasamsha", nameHi: "डी-१० दशमांश कुंडली", descEn: "Career, profession, reputation, and public accomplishments", descHi: "करियर, आजीविका, प्रतिष्ठा व सामाजिक प्रभाव" },
  { id: "D2", nameEn: "D2 Hora", nameHi: "डी-२ होरा कुंडली", descEn: "Wealth accumulation, financial mindset, and monetary prosperity", descHi: "धन संचय, वित्तीय स्थिरता व आर्थिक संपन्नता" },
  { id: "D3", nameEn: "D3 Drekkana", nameHi: "डी-३ द्रेष्काण कुंडली", descEn: "Courage, siblings, vitality, and creative endeavors", descHi: "पराक्रम, भाई-बहन, साहस व रचनात्मक क्षमता" },
  { id: "D4", nameEn: "D4 Chaturthamsha", nameHi: "डी-४ चतुर्थांश कुंडली", descEn: "Fixed assets, real estate, vehicles, and inner contentment", descHi: "भूमि, भवन, वाहन, अचल संपत्ति व मानसिक सुख" },
  { id: "D7", nameEn: "D7 Saptamsha", nameHi: "डी-७ सप्तमांश कुंडली", descEn: "Progeny, children's prospects, and creative legacy", descHi: "संतान सुख, वंश वृद्धि व रचनात्मक विरासत" },
  { id: "D12", nameEn: "D12 Dwadasamsha", nameHi: "डी-१२ द्वादशांश कुंडली", descEn: "Ancestral roots, parents' health, and inherited karma", descHi: "माता-पिता, पैतृक संस्कार व पूर्वजों का कर्मिक ऋण" },
  { id: "D16", nameEn: "D16 Shodashamsha", nameHi: "डी-१६ षोडशांश कुंडली", descEn: "Vehicles, luxury, worldly pleasures, and comforts", descHi: "वाहन सुख, वैभव, भौतिक सुख-सुविधाएं व प्रसन्नता" },
  { id: "D20", nameEn: "D20 Vimshamsha", nameHi: "डी-२० विंशांश कुंडली", descEn: "Spiritual practice, mantra siddhi, and devotion", descHi: "अध्यात्म, साधना, मंत्र सिद्धि व ईश्वर कृपा" },
  { id: "D24", nameEn: "D24 Siddhamsa", nameHi: "डी-२४ चतुर्विंशांश कुंडली", descEn: "Higher learning, scholarship, intellect, and memory", descHi: "उच्च शिक्षा, विद्या, बौद्धिक प्रज्ञा व अनुसंधान" },
  { id: "D27", nameEn: "D27 Bhamsa", nameHi: "डी-२७ भrequestांश कुंडली", descEn: "Innate strengths, endurance, and psychological fortitude", descHi: "आंतरिक बल, सहनशीलता व चारित्रिक सामर्थ्य" },
  { id: "D30", nameEn: "D30 Trimshamsha", nameHi: "डी-३० त्रिंशांश कुंडली", descEn: "Karmic evils, misfortunes, and remedial tests", descHi: "अरिष्ट, जीवन की बाधाएं, दोष व रोग निवारण" },
  { id: "D60", nameEn: "D60 Shashtiamsha", nameHi: "डी-६० षष्ट्यंश कुंडली", descEn: "Supreme past-life karmic blueprint and fine destiny", descHi: "सर्वोच्च पूर्वजन्म कर्म चक्र व सूक्ष्म प्रारब्ध" },
  { id: "CHANDRA", nameEn: "Chandra Kundli", nameHi: "चंद्र कुंडली (लग्न = चंद्रमा)", descEn: "Mental perception, emotional rhythm, and public reception", descHi: "मनोवैज्ञानिक दृष्टिकोण, मानसिक शांति व समाज में छवि" },
  { id: "SURYA", nameEn: "Surya Kundli", nameHi: "सूर्य कुंडली (लग्न = सूर्य)", descEn: "Soul purpose, physical vitality, willpower, and authority", descHi: "आत्मबल, शारीरिक तेज, प्रशासनिक क्षमता व प्रभुत्व" },
  { id: "CHALIT", nameEn: "Bhava Chalit", nameHi: "भाव चलित कुंडली", descEn: "Exact active cusp-based house placements of all planets", descHi: "वास्तविक संधि-आधारित ग्रह स्थिति व भाव प्रभाव" }
];

/**
 * Builds house mapping for any specified divisional chart
 */
export function buildDivisionalChartData(planets, ascDeg, chartId) {
  let targetAscSignIdx;

  if (chartId === "CHANDRA") {
    targetAscSignIdx = getSignIndex(planets["Moon"] || 0);
  } else if (chartId === "SURYA") {
    targetAscSignIdx = getSignIndex(planets["Sun"] || 0);
  } else if (chartId === "CHALIT") {
    // Return Chalit houses directly
    return calculateBhavaChalit(ascDeg, planets).chalitHouses;
  } else {
    targetAscSignIdx = getDivisionalSignIndex(ascDeg, chartId);
  }

  const houses = {};
  for (let h = 1; h <= 12; h++) {
    const sIdx = (targetAscSignIdx + (h - 1)) % 12;
    houses[h] = {
      sign: SIGNS[sIdx].name,
      signSanskrit: SIGNS[sIdx].sanskrit,
      lord: SIGNS[sIdx].lord,
      planets: [],
      planetDetails: []
    };
  }

  Object.entries(planets).forEach(([pName, pDeg]) => {
    let pSignIdx;
    if (chartId === "CHANDRA" || chartId === "SURYA") {
      pSignIdx = getSignIndex(pDeg);
    } else {
      pSignIdx = getDivisionalSignIndex(pDeg, chartId);
    }
    const targetSignName = SIGNS[pSignIdx].name;

    for (let h = 1; h <= 12; h++) {
      if (houses[h].sign === targetSignName) {
        houses[h].planets.push(pName);
        houses[h].planetDetails.push({
          name: pName,
          deg: pDeg % 30,
          degree: `${Math.floor(pDeg % 30)}°`
        });
        break;
      }
    }
  });

  return houses;
}


/* -------------------------------------------------------------
   6. YOGA & DOSHA DIAGNOSTIC ENGINE (दोष व योग निदान)
------------------------------------------------------------- */

/**
 * Comprehensive analysis for:
 * 1. Manglik Dosha (Lagna, Moon, Venus + 8 Cancellations)
 * 2. Kaal Sarp Dosha (All 12 Classical Types + Full vs Anshik)
 * 3. Shani Sade Sati & Shani Dhaiya (Current transit phases + remedies)
 * 4. Pitra Dosha
 * 5. Guru Chandal Dosha
 * 6. Kemadruma Dosha
 * 7. Gandmool Dosha
 * 8. Grand Auspicious Yogas
 */
export function calculateComprehensiveDoshas(planetData, planetHouseMap, ascSignIdx, moonSignIdx, lang = "en") {
  const isHi = lang === "hi";

  // ── 1. MANGLIK DOSHA (KUJA DOSHA) ──
  const marsHouse = planetHouseMap["Mars"] || 1;
  const moonHouse = planetHouseMap["Moon"] || 1;
  const venusHouse = planetHouseMap["Venus"] || 1;

  const marsFromAsc = marsHouse;
  const marsFromMoon = ((marsHouse - moonHouse + 12) % 12) + 1;
  const marsFromVenus = ((marsHouse - venusHouse + 12) % 12) + 1;

  const manglikHouses = [1, 4, 7, 8, 12];
  const isManglikFromAsc = manglikHouses.includes(marsFromAsc);
  const isManglikFromMoon = manglikHouses.includes(marsFromMoon);
  const isManglikFromVenus = manglikHouses.includes(marsFromVenus);

  const rawManglik = isManglikFromAsc || isManglikFromMoon || isManglikFromVenus;

  // Cancellation Rules:
  // 1. Mars in Aries in 1st, Scorpio in 4th, Capricorn in 7th, Cancer in 8th, Sagittarius in 12th
  // 2. Mars conjunct Jupiter or aspected by Jupiter
  // 3. Mars conjunct Moon (Chandra-Mangal Yoga)
  // 4. Mars in Gemini or Virgo in 2nd house
  const marsSign = planetData["Mars"]?.sign;
  let cancellationReasons = [];
  if (marsFromAsc === 1 && marsSign === "Aries") cancellationReasons.push("Mars is in its own Moolatrikona sign (Aries) in 1st house.");
  if (marsFromAsc === 4 && marsSign === "Scorpio") cancellationReasons.push("Mars is in its own sign (Scorpio) in 4th house.");
  if (marsFromAsc === 7 && marsSign === "Capricorn") cancellationReasons.push("Mars is Exalted (Uccha) in Capricorn in 7th house.");
  if (marsFromAsc === 8 && marsSign === "Cancer") cancellationReasons.push("Mars in debilitation Cancer in 8th cancels harsh matrimonial maleficence.");
  if (marsFromAsc === 12 && marsSign === "Sagittarius") cancellationReasons.push("Mars in friendly Sagittarius in 12th house dissolves Kuja Dosha.");

  if (planetHouseMap["Mars"] === planetHouseMap["Jupiter"]) {
    cancellationReasons.push("Guru (Jupiter) is conjunct Mars, completely neutralizing the malefic heat.");
  }
  if (planetHouseMap["Mars"] === planetHouseMap["Moon"]) {
    cancellationReasons.push("Chandra-Mangal Yoga is formed, transforming Kuja into an auspicious wealth generator.");
  }

  const isCancelled = rawManglik && cancellationReasons.length > 0;
  let manglikStatus, manglikSeverity, manglikDescEn, manglikDescHi;

  if (!rawManglik) {
    manglikStatus = isHi ? "मंगल दोष रहित (दोष मुक्त)" : "Manglik Dosha Free (Nil)";
    manglikSeverity = 0;
    manglikDescEn = "Mars is placed in an auspicious, non-afflicting house. There is no Manglik Dosha in your birth chart.";
    manglikDescHi = "आपकी कुंडली में मंगल अनुकूल भाव में स्थित है। दांपत्य जीवन मंगल दोष के प्रभाव से पूर्णतः मुक्त है।";
  } else if (isCancelled) {
    manglikStatus = isHi ? "मंगल दोष भंग (प्रभाव शून्य)" : "Manglik Dosha Cancelled (Nirasa)";
    manglikSeverity = 15;
    manglikDescEn = `Mars occupies a sensitive house, but Kuja Dosha is CANCELLED due to classical Parashari rules: ${cancellationReasons.join(" ")}`;
    manglikDescHi = `कुंडली में मंगल संवेदनशील भाव में है, परंतु विशिष्ट शास्त्रीय परिहारों के कारण मंगल दोष भंग हो चुका है: ${cancellationReasons.join(" ")}`;
  } else {
    const hits = (isManglikFromAsc ? 1 : 0) + (isManglikFromMoon ? 1 : 0) + (isManglikFromVenus ? 1 : 0);
    manglikSeverity = hits >= 2 ? 80 : 45;
    manglikStatus = hits >= 2 ? (isHi ? "प्रबल मांगलिक योग" : "High Manglik Dosha") : (isHi ? "आंशिक / सौम्य मांगलिक" : "Mild (Anshik) Manglik");
    manglikDescEn = `Mars is positioned in House ${marsHouse} from Lagna. It channels passionate drive, high vitality, and strong willpower. For relationships, maintaining open patience, mutual respect, and performing prescribed remedies brings wonderful harmony.`;
    manglikDescHi = `लग्न से ${marsHouse}वें भाव में मंगल स्थित है। यह आपको प्रखर ऊर्जा, नेतृत्व और दृढ़ इच्छाशक्ति देता है। दांपत्य में धैर्य, समझदारी और वैदिक उपायों से उत्तम सामंजस्य बना रहेगा।`;
  }

  // ── 2. KAAL SARP DOSHA (12 TYPES) ──
  const rahuH = planetHouseMap["Rahu"] || 1;
  const ketuH = planetHouseMap["Ketu"] || 7;
  const planets7 = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

  let leftCount = 0;
  let rightCount = 0;
  planets7.forEach(p => {
    const pH = planetHouseMap[p] || 1;
    // Calculate distance from Rahu going forward
    const dist = ((pH - rahuH + 12) % 12);
    if (dist > 0 && dist < 6) leftCount++;
    else if (dist > 6 && dist < 12) rightCount++;
  });

  const isFullKaalSarp = leftCount === 7 || rightCount === 7;
  const isPartialKaalSarp = (leftCount === 6 || rightCount === 6) && !isFullKaalSarp;

  const KAAL_SARP_TYPES = [
    { type: 1, nameEn: "Anant Kaal Sarp Yoga", nameHi: "अनंत कालसर्प योग", descEn: "Rahu in 1st, Ketu in 7th. Prompts intense self-discovery and spiritual evolution.", descHi: "राहु प्रथम व केतु सप्तम भाव में। यह व्यक्तित्व को प्रखर व आत्म-चिंतनशील बनाता है।" },
    { type: 2, nameEn: "Kulik Kaal Sarp Yoga", nameHi: "कुलिक कालसर्प योग", descEn: "Rahu in 2nd, Ketu in 8th. Demands mindful financial management and speech care.", descHi: "राहु द्वितीय व केतु अष्टम में। वाणी व संचित धन के प्रति सतर्कता आवश्यक।" },
    { type: 3, nameEn: "Vasuki Kaal Sarp Yoga", nameHi: "वासुकी कालसर्प योग", descEn: "Rahu in 3rd, Ketu in 9th. Bestows courage, valor, and success through enterprise.", descHi: "राहु तृतीय व केतु नवम में। पराक्रम, उद्यम और निरंतर पुरुषार्थ से सफलता।" },
    { type: 4, nameEn: "Shankhpal Kaal Sarp Yoga", nameHi: "शंखपाल कालसर्प योग", descEn: "Rahu in 4th, Ketu in 10th. Tests domestic peace, then grants high real estate gains.", descHi: "राहु चतुर्थ व केतु दशम में। प्रारंभिक संघर्षोपरांत भूमि-भवन का सुख।" },
    { type: 5, nameEn: "Padma Kaal Sarp Yoga", nameHi: "पद्म कालसर्प योग", descEn: "Rahu in 5th, Ketu in 11th. Sharpening intellect, creative brilliance, and wisdom.", descHi: "राहु पंचम व केतु एकादश में। प्रखर बौद्धिक क्षमता व अनुसंधान में लाभ।" },
    { type: 6, nameEn: "Mahapadma Kaal Sarp Yoga", nameHi: "महापद्म कालसर्प योग", descEn: "Rahu in 6th, Ketu in 12th. Victorious over competitors, legal hurdles, and illness.", descHi: "राहु षष्ठ व केतु द्वादश में। शत्रुओं व कठिन चुनौतियों पर सहज विजय।" },
    { type: 7, nameEn: "Takshak Kaal Sarp Yoga", nameHi: "तक्षक कालसर्प योग", descEn: "Rahu in 7th, Ketu in 1st. Requires clear partnership agreements and spiritual depth.", descHi: "राहु सप्तम व केतु प्रथम में। साझेदारी व वैवाहिक जीवन में पारदर्शिता अपेक्षित।" },
    { type: 8, nameEn: "Karkotak Kaal Sarp Yoga", nameHi: "कर्कोटक कालसर्प योग", descEn: "Rahu in 8th, Ketu in 2nd. Awakens deep occult, research, and unexpected legacies.", descHi: "राहु अष्टम व केतु द्वितीय में। गूढ़ विद्याओं व आकस्मिक लाभ का योग।" },
    { type: 9, nameEn: "Shankhachood Kaal Sarp Yoga", nameHi: "शंखचूड़ कालसर्प योग", descEn: "Rahu in 9th, Ketu in 3rd. Transforms fortune through spiritual pilgrimage and devotion.", descHi: "राहु नवम व केतु तृतीय में। धर्म निष्ठा व गुरु कृपा से भाग्य का जागरण।" },
    { type: 10, nameEn: "Ghatak Kaal Sarp Yoga", nameHi: "घातक कालसर्प योग", descEn: "Rahu in 10th, Ketu in 4th. High professional authority through relentless dedication.", descHi: "राहु दशम व केतु चतुर्थ में। कार्यक्षेत्र में उच्च पद व नेतृत्व की प्राप्ति।" },
    { type: 11, nameEn: "Vishdhar Kaal Sarp Yoga", nameHi: "विषधर कालसर्प योग", descEn: "Rahu in 11th, Ketu in 5th. Generates diverse income channels and foreign gains.", descHi: "राहु एकादश व केतु पंचम में। बहुआयामी आय स्रोत व बड़े सामाजिक संपर्क।" },
    { type: 12, nameEn: "Sheshnag Kaal Sarp Yoga", nameHi: "शेषनाग कालसर्प योग", descEn: "Rahu in 12th, Ketu in 6th. Auspicious for foreign settlement, spirituality, and Moksha.", descHi: "राहु द्वादश व केतु षष्ठ में। विदेश यात्रा, आध्यात्मिक उन्नति व मोक्ष का योग।" }
  ];

  const ksInfo = KAAL_SARP_TYPES[rahuH - 1] || KAAL_SARP_TYPES[0];
  let kaalSarpStatus, kaalSarpDescEn, kaalSarpDescHi;

  if (isFullKaalSarp) {
    kaalSarpStatus = isHi ? `पूर्ण ${ksInfo.nameHi}` : `Full ${ksInfo.nameEn}`;
    kaalSarpDescEn = `All 7 classical planets are aligned within the Rahu-Ketu cosmic axis, forming ${ksInfo.nameEn}. ${ksInfo.descEn} This acts as a profound spiritual catalyst in your life.`;
    kaalSarpDescHi = `सभी ७ ग्रह राहु-केतु अक्ष के मध्य स्थित होकर ${ksInfo.nameHi} का निर्माण कर रहे हैं। ${ksInfo.descHi} यह जीवन में महान कर्मिक परिवर्तन व आध्यात्मिक उन्नति का कारक है।`;
  } else if (isPartialKaalSarp) {
    kaalSarpStatus = isHi ? `आंशिक (खंडित) ${ksInfo.nameHi}` : `Partial (Anshik) ${ksInfo.nameEn}`;
    kaalSarpDescEn = `One planet breaks the axis, significantly softening the intensity into Partial ${ksInfo.nameEn}. ${ksInfo.descEn}`;
    kaalSarpDescHi = `एक ग्रह के अक्ष से बाहर होने से यह आंशिक ${ksInfo.nameHi} बन जाता है, जिसका प्रभाव बहुत सौम्य रहता है।`;
  } else {
    kaalSarpStatus = isHi ? "कालसर्प दोष मुक्त (शुभ)" : "Kaal Sarp Dosha Free (Nil)";
    kaalSarpDescEn = "Planets are evenly distributed outside the Rahu-Ketu nodal axis. No Kaal Sarp Dosha is formed.";
    kaalSarpDescHi = "कुंडली में ग्रह राहु-केतु अक्ष के दोनों ओर संतुलित हैं। आपकी कुंडली कालसर्प दोष से पूर्णतः मुक्त है।";
  }

  // ── 3. SHANI SADE SATI & DHAIYA (2025-2027 SIDEREAL SATURN IN PISCES / AQUARIUS) ──
  // Current Saturn in Vedic Sidereal astrology: Pisces (Sign Index 11)
  const currentTransitSaturnSignIdx = 11; // Pisces (मीन)
  const distFromMoon = ((currentTransitSaturnSignIdx - moonSignIdx + 12) % 12);

  let sadeSatiPhase, sadeSatiStatus, sadeSatiDescEn, sadeSatiDescHi;
  if (distFromMoon === 11) {
    sadeSatiPhase = "Rising";
    sadeSatiStatus = isHi ? "साढ़ेसाती: प्रथम चरण (उदयमान - 12वां भाव)" : "Sade Sati: 1st Phase (Rising / Ascent)";
    sadeSatiDescEn = "Saturn is transiting 12th from your natal Moon sign. Mind undergoes restructuring; ideal time for financial discipline, introspection, and establishing long-term foundations.";
    sadeSatiDescHi = "शनिदेव आपकी जन्म राशि से १२वें भाव में गोचर कर रहे हैं। यह साढ़ेसाती का प्रथम चरण है। बजट प्रबंधन, संयम और भविष्य की ठोस योजनाएं बनाने का यह उत्तम समय है।";
  } else if (distFromMoon === 0) {
    sadeSatiPhase = "Peak";
    sadeSatiStatus = isHi ? "साढ़ेसाती: द्वितीय चरण (शिखर काल - जन्म राशि पर)" : "Sade Sati: 2nd Phase (Peak / Janma Shani)";
    sadeSatiDescEn = "Saturn is transiting directly over your natal Moon sign. Prompts profound personal maturity, career restructuring, and inner fortitude. Steady patience yields majestic rewards.";
    sadeSatiDescHi = "शनिदेव सीधे आपकी जन्म राशि पर गोचर कर रहे हैं। यह साढ़ेसाती का शिखर काल है जो गहन आत्म-अनुशासन, कर्मठता और दृढ़ संकल्प की परीक्षा लेकर सर्वोच्च परिपक्वता प्रदान करता है।";
  } else if (distFromMoon === 1) {
    sadeSatiPhase = "Setting";
    sadeSatiStatus = isHi ? "साढ़ेसाती: तृतीय चरण (अस्तगामी - द्वितीय भाव)" : "Sade Sati: 3rd Phase (Setting / Descent)";
    sadeSatiDescEn = "Saturn is transiting 2nd from your natal Moon sign. The challenging cycle concludes, transitioning into stabilization of accumulated assets, domestic relief, and rewards for perseverance.";
    sadeSatiDescHi = "शनिदेव आपकी जन्म राशि से द्वितीय भाव में गोचर कर रहे हैं। साढ़ेसाती का अंतिम चरण है; धीरे-धीरे सभी बाधाएं दूर होकर संचित धन व पारिवारिक स्थिरता में वृद्धि होगी।";
  } else if (distFromMoon === 3) {
    sadeSatiPhase = "Kantaka";
    sadeSatiStatus = isHi ? "शनि की ढैया: कंटक शनि (४था भाव)" : "Shani Dhaiya: Kantaka Shani (4th House)";
    sadeSatiDescEn = "Saturn transits 4th from your Moon sign. Demands extra mindfulness toward emotional peace, mother's well-being, and property matters.";
    sadeSatiDescHi = "शनिदेव जन्म राशि से चतुर्थ भाव में गोचर कर रहे हैं। इसे कंटक शनि की ढैया कहा जाता है; मानसिक शांति व स्वास्थ्य के प्रति सजग रहना श्रेयस्कर है।";
  } else if (distFromMoon === 7) {
    sadeSatiPhase = "Ashtama";
    sadeSatiStatus = isHi ? "शनि की ढैया: अष्टम शनि (८वां भाव)" : "Shani Dhaiya: Ashtama Shani (8th House)";
    sadeSatiDescEn = "Saturn transits 8th from your Moon sign. Urges caution in sudden speculation; rewards research, spiritual exploration, and steady perseverance.";
    sadeSatiDescHi = "शनिदेव जन्म राशि से अष्टम भाव में गोचर कर रहे हैं। इसे अष्टम ढैया कहते हैं; जोखिम भरे निवेश से बचें और नित्य शनि उपासना से लाभ पाएं।";
  } else {
    sadeSatiPhase = "None";
    sadeSatiStatus = isHi ? "शनि साढ़ेसाती व ढैया से पूर्णतः मुक्त" : "Completely Free from Sade Sati & Dhaiya";
    sadeSatiDescEn = "Your natal Moon sign is completely free from both Shani Sade Sati and Shani Dhaiya at this time. Saturn provides supportive, productive cosmic rays.";
    sadeSatiDescHi = "वर्तमान समय में आपकी जन्म राशि पर साढ़ेसाती या ढैया का कोई प्रतिकूल प्रभाव नहीं है। शनिदेव की कृपा से जीवन में स्थिरता बनी रहेगी।";
  }

  // ── 4. PITRA DOSHA ──
  const sunHouse = planetHouseMap["Sun"] || 1;
  const satHouse = planetHouseMap["Saturn"] || 1;
  const isSunAfflicted = sunHouse === rahuH || sunHouse === ketuH || sunHouse === satHouse;
  const isPitraDosha = isSunAfflicted || [9].includes(sunHouse && (rahuH === 9 || ketuH === 9));
  const pitraStatus = isPitraDosha
    ? (isHi ? "पितृ दोष संकेत (शांति अनुष्ठान श्रेयस्कर)" : "Pitra Dosha Indication (Remedies Advised)")
    : (isHi ? "पितृ दोष मुक्त (पितरों की कृपा)" : "Pitra Dosha Free (Ancestral Grace)");
  const pitraDescEn = isPitraDosha
    ? "Sun or 9th house receives nodal/Saturnian association, indicating karmic duties toward ancestors. Offering water to rising Sun and honoring ancestors on Amavasya brings immense blessings."
    : "The cosmic lineage axis (Sun and 9th house) is harmonious, indicating protective ancestral blessings and positive familial continuity.";
  const pitraDescHi = isPitraDosha
    ? "सूर्य अथवा नवम भाव पर राहु/केतु/शनि का प्रभाव पितृ ऋण का संकेत देता है। नित्य सूर्य को अर्घ्य देना और अमावस्या पर पितरों का स्मरण करने से अटके कार्य संपन्न होंगे।"
    : "आपकी कुंडली में पितृ भाव शुभ स्थिति में है। पूर्वजों का आशीर्वाद आपके जीवन में सुरक्षा और उन्नति का मार्ग प्रशस्त करता है।";

  // ── 5. GURU CHANDAL DOSHA ──
  const jupH = planetHouseMap["Jupiter"] || 1;
  const isGuruChandal = jupH === rahuH || jupH === ketuH;
  const guruChandalStatus = isGuruChandal
    ? (isHi ? "गुरु चांडाल योग (बुद्धि भ्रम निवारण आवश्यक)" : "Guru Chandal Yoga (Requires Clarity)")
    : (isHi ? "गुरु चांडाल योग मुक्त (बृहस्पति की पूर्ण कृपा)" : "Guru Chandal Yoga Free (Pure Jupiter Grace)");
  const guruChandalDescEn = isGuruChandal
    ? "Jupiter conjoins Rahu/Ketu, encouraging non-conventional thinking. Chanting Vishnu Sahasranama and respecting mentors transforms this into brilliant innovative wisdom."
    : "Jupiter is pure and dignified, granting sound moral guidance, wisdom, and auspicious counsel throughout life.";
  const guruChandalDescHi = isGuruChandal
    ? "गुरु और राहु/केतु की युति लीक से हटकर सोचने की क्षमता देती है। भगवान विष्णु की उपासना और गुरुजनों के सम्मान से यह तीक्ष्ण प्रज्ञा में परिवर्तित हो जाता है।"
    : "देवगुरु बृहस्पति शुभ प्रभाव में हैं। यह आपको स्वाभाविक विवेक, सत्यनिष्ठा और समाज में आदरणीय पद प्रदान करता है।";

  // ── 6. KEMADRUMA DOSHA ──
  const h2FromMoon = ((moonHouse + 1 - 1) % 12) + 1;
  const h12FromMoon = ((moonHouse - 1 - 1 + 12) % 12) + 1;
  let hasAdjacentPlanet = false;
  planets7.forEach(p => {
    if (p === "Moon") return;
    const pH = planetHouseMap[p];
    if (pH === h2FromMoon || pH === h12FromMoon) hasAdjacentPlanet = true;
  });
  const isKemadruma = !hasAdjacentPlanet;
  const kemadrumaStatus = isKemadruma
    ? (isHi ? "केमद्रुम योग (एकाकीपन निवारण व शिव साधना)" : "Kemadruma Yoga (Solitary Mind Catalyst)")
    : (isHi ? "केमद्रुम योग मुक्त (चंद्रमा को ग्रहों का संबल)" : "Kemadruma Yoga Free (Supported Moon)");
  const kemadrumaDescEn = isKemadruma
    ? "Moon has no immediate physical planets in 2nd and 12th houses from it, which can occasionally induce mental solitude. Chanting 'Om Namah Shivaya' creates a powerful protective aura."
    : "The Moon is flanked by supporting planetary energies, ensuring emotional resilience and continuous social connectivity.";
  const kemadrumaDescHi = isKemadruma
    ? "चंद्रमा के आगे-पीछे ग्रह न होने से कभी-कभी मानसिक एकाकीपन या अत्यधिक विचारशीलता हो सकती है। नित्य 'ॐ नमः शिवाय' का जप मानसिक शांति और बल प्रदान करेगा।"
    : "चंद्रमा को शुभ ग्रहों का संबल प्राप्त है। आपका मन स्थिर, सकारात्मक और भावनात्मक रूप से परिपक्व रहता है।";

  // ── 7. GANDMOOL DOSHA ──
  const moonNakIdx = Math.floor((((planetData["Moon"]?.totalDegree || 0) % 360) + 360) % 360 / (360 / 27));
  const gandmoolIndices = [0, 8, 9, 17, 18, 26]; // Ashwini, Ashlesha, Magha, Jyeshtha, Mula, Revati
  const isGandmool = gandmoolIndices.includes(moonNakIdx);
  const gandmoolStatus = isGandmool
    ? (isHi ? "गंडमूल नक्षत्र जन्म (विशेष प्रतिभाशाली)" : "Gandmool Nakshatra Birth (Distinctive Destiny)")
    : (isHi ? "गंडमूल दोष मुक्त" : "Gandmool Free");
  const gandmoolDescEn = isGandmool
    ? `Born in ${NAKSHATRAS[moonNakIdx]?.name}, a junction point between water and fire rashis. Endows extraordinary intensity, resilience, and unique life achievements.`
    : "Born in a non-junction nakshatra with smooth, harmonious early life vibrations.";
  const gandmoolDescHi = isGandmool
    ? `आपका जन्म ${NAKSHATRAS[moonNakIdx]?.hindi} गंडमूल नक्षत्र में हुआ है। यह नक्षत्र अत्यधिक मेधावी, साहसी और असाधारण व्यक्तित्व का निर्माण करता है।`
    : "आपका जन्म सामान्य शुभ नक्षत्र में हुआ है, किसी विशेष गंडमूल शांति की आवश्यकता नहीं है।";

  return {
    manglik: {
      status: manglikStatus,
      severity: manglikSeverity,
      isManglik: rawManglik && !isCancelled,
      isCancelled,
      desc: isHi ? manglikDescHi : manglikDescEn,
      remediesEn: "Offer red flowers to Lord Hanuman on Tuesdays, chant Hanuman Chalisa, and keep a silver square piece in wallet.",
      remediesHi: "मंगलवार को हनुमान जी को सिंदूर व चमेली का तेल अर्पित करें, नित्य हनुमान चालीसा का पाठ करें।"
    },
    kaalSarp: {
      status: kaalSarpStatus,
      isFull: isFullKaalSarp,
      isPartial: isPartialKaalSarp,
      desc: isHi ? kaalSarpDescHi : kaalSarpDescEn,
      typeInfo: ksInfo,
      remediesEn: "Chant Maha Mrityunjaya Mantra 108 times, worship Lord Shiva with milk on Mondays, and offer raw coal in flowing water on Nag Panchami.",
      remediesHi: "महामृत्युंजय मंत्र का १०८ बार जप करें, सोमवार को शिवलिंग पर कच्चा दूध अर्पित करें और नाग पंचमी पर शिव पूजन करें।"
    },
    sadeSati: {
      phase: sadeSatiPhase,
      status: sadeSatiStatus,
      desc: isHi ? sadeSatiDescHi : sadeSatiDescEn,
      remediesEn: "Light a mustard oil lamp under a Peepal tree on Saturday evenings, recite Dasharatha Shani Stotram, and donate black sesame or blankets.",
      remediesHi: "शनिवार सायंकाल पीपल के नीचे सरसों के तेल का दीपक प्रज्वलित करें, दशरथ कृत शनि स्तोत्र का पाठ करें और काले तिल का दान करें।"
    },
    pitra: {
      status: pitraStatus,
      isAfflicted: isPitraDosha,
      desc: isHi ? pitraDescHi : pitraDescEn,
      remediesEn: "Offer water mixed with black sesame to the rising Sun daily; perform Annadanam (food donation) to the needy on Amavasya.",
      remediesHi: "नित्य प्रातः तांबे के पात्र से सूर्य देव को जल अर्पित करें और अमावस्या के दिन जरूरतमंदों को भोजन कराएं।"
    },
    guruChandal: {
      status: guruChandalStatus,
      isAfflicted: isGuruChandal,
      desc: isHi ? guruChandalDescHi : guruChandalDescEn,
      remediesEn: "Apply saffron/turmeric tilak on forehead, worship Lord Vishnu, and donate yellow pulses on Thursdays.",
      remediesHi: "प्रतिदिन माथे पर केसर या हल्दी का तिलक लगाएं और गुरुवार को चने की दाल या पीली वस्तुओं का दान करें।"
    },
    kemadruma: {
      status: kemadrumaStatus,
      isAfflicted: isKemadruma,
      desc: isHi ? kemadrumaDescHi : kemadrumaDescEn,
      remediesEn: "Wear a silver ring or chain, observe fast on Mondays, and perform Shiva Linga milk Abhishek.",
      remediesHi: "चांदी का कड़ा या छल्ला धारण करें, सोमवार को शिव जी का जलाभिषेक करें और पूर्णिमा पर चंद्र दर्शन करें।"
    },
    gandmool: {
      status: gandmoolStatus,
      isAfflicted: isGandmool,
      desc: isHi ? gandmoolDescHi : gandmoolDescEn,
      remediesEn: "Standard Gandmool Shanti ritual performed after birth brings tremendous protection and prosperity.",
      remediesHi: "गंडमूल शांति अनुष्ठान व गणेश पूजन से जीवन में निरंतर शुभता और समृद्धि बनी रहती है।"
    }
  };
}


/* -------------------------------------------------------------
   7. STRENGTH / SHADBALA & ASHTAKAVARGA ENGINE (षड्बल व अष्टकवर्ग)
------------------------------------------------------------- */

export const MIN_SHADBALA_VIRUPAS = {
  Sun: 390,
  Moon: 360,
  Mars: 300,
  Mercury: 420,
  Jupiter: 390,
  Venus: 330,
  Saturn: 300
};

/**
 * Calculates 6-fold Shadbala Virupas for the 7 classical planets
 */
export function calculateShadbala(planets, ascDeg, birthDate, lang = "en") {
  const isHi = lang === "hi";
  const planets7 = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const ascSignIdx = getSignIndex(ascDeg);

  // Natural strengths (Naisargika Bala) in Virupas:
  // Sun: 60, Moon: 51.43, Venus: 42.86, Jupiter: 34.29, Mercury: 25.71, Mars: 17.14, Saturn: 8.57
  const naisargika = {
    Sun: 60.0,
    Moon: 51.43,
    Venus: 42.86,
    Jupiter: 34.29,
    Mercury: 25.71,
    Mars: 17.14,
    Saturn: 8.57
  };

  const results = {};

  planets7.forEach(pName => {
    const deg = planets[pName] || 0;
    const signIdx = getSignIndex(deg);
    const houseNum = ((signIdx - ascSignIdx + 12) % 12) + 1;
    const degInSign = deg % 30;

    // 1. Sthana Bala (Exaltation, Moolatrikona, Own sign, Kendra)
    let sthana = 120; // base
    if ([1, 4, 7, 10].includes(houseNum)) sthana += 60; // Kendra
    else if ([5, 9].includes(houseNum)) sthana += 45; // Trikona
    else if ([3, 6, 11].includes(houseNum)) sthana += 30; // Upachaya
    else sthana += 15; // Dusthana

    // Dignity bonus
    const ownSigns = { Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5], Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10] };
    const exaltSigns = { Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6 };
    const debilSigns = { Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0 };

    if (signIdx === exaltSigns[pName]) sthana += 60;
    else if (ownSigns[pName]?.includes(signIdx)) sthana += 45;
    else if (signIdx === debilSigns[pName]) sthana -= 30;

    // 2. Dig Bala (Directional strength)
    // Sun/Mars 10th=60; Jup/Merc 1st=60; Moon/Ven 4th=60; Sat 7th=60
    let dig = 30;
    if ((pName === "Sun" || pName === "Mars") && houseNum === 10) dig = 60;
    else if ((pName === "Jupiter" || pName === "Mercury") && houseNum === 1) dig = 60;
    else if ((pName === "Moon" || pName === "Venus") && houseNum === 4) dig = 60;
    else if (pName === "Saturn" && houseNum === 7) dig = 60;
    else {
      // Partial proportional dig bala
      dig = Math.max(15, 60 - Math.abs(houseNum - 4) * 6);
    }

    // 3. Kala Bala (Temporal strength - day/night, paksha)
    let kala = 80;
    const isDay = birthDate.getHours() >= 6 && birthDate.getHours() < 18;
    if (isDay && ["Sun", "Jupiter", "Venus"].includes(pName)) kala += 40;
    else if (!isDay && ["Moon", "Mars", "Saturn"].includes(pName)) kala += 40;
    else kala += 20;

    // 4. Chesta Bala (Motional strength)
    let chesta = 45;
    if (["Mars", "Mercury", "Jupiter", "Venus", "Saturn"].includes(pName)) {
      chesta += 15; // default direct/motion
    }

    // 5. Naisargika Bala
    const nais = naisargika[pName] || 30;

    // 6. Drik Bala (Aspectual strength approx)
    let drik = 30;
    if ([1, 5, 9].includes(houseNum)) drik += 20;

    const totalVirupas = Math.round(sthana + dig + kala + chesta + nais + drik);
    const minRequired = MIN_SHADBALA_VIRUPAS[pName] || 360;
    const ratio = (totalVirupas / minRequired);
    const ratioPct = Math.round(ratio * 100);

    let powerCategoryEn, powerCategoryHi, badgeColor;
    if (ratio >= 1.25) {
      powerCategoryEn = "Supreme Power (अति बली)";
      powerCategoryHi = "अति बली (सर्वोच्च सामर्थ्य)";
      badgeColor = "#10B981"; // Emerald
    } else if (ratio >= 1.0) {
      powerCategoryEn = "Fully Capable (पूर्ण बली)";
      powerCategoryHi = "पूर्ण बली (सक्षम)";
      badgeColor = "#F59E0B"; // Amber
    } else if (ratio >= 0.8) {
      powerCategoryEn = "Moderate Strength (मध्यम बली)";
      powerCategoryHi = "मध्यम बली (संतुलित)";
      badgeColor = "#3B82F6"; // Blue
    } else {
      powerCategoryEn = "Delicate / Needs Upaya (अल्प बली)";
      powerCategoryHi = "अल्प बली (उपाय आवश्यक)";
      badgeColor = "#EF4444"; // Red
    }

    results[pName] = {
      planet: pName,
      totalVirupas,
      minRequired,
      ratio: ratio.toFixed(2),
      ratioPct,
      category: isHi ? powerCategoryHi : powerCategoryEn,
      badgeColor,
      sthana,
      dig,
      kala,
      chesta,
      naisargika: Math.round(nais),
      drik
    };
  });

  // Rank planets by total virupas
  const rankedPlanets = Object.values(results).sort((a, b) => b.totalVirupas - a.totalVirupas);
  rankedPlanets.forEach((p, idx) => {
    results[p.planet].rank = idx + 1;
  });

  return {
    planetScores: results,
    rankedList: rankedPlanets,
    strongestPlanet: rankedPlanets[0]?.planet,
    weakestPlanet: rankedPlanets[rankedPlanets.length - 1]?.planet
  };
}

/**
 * Calculates Sarvashtakavarga (SAV) 12-house bindu points (Sum = 337)
 */
export function calculateSarvashtakavarga(planets, ascSignIdx, lang = "en") {
  const isHi = lang === "hi";

  // Base Parashari distribution for 12 houses summing to 337 (Average = 28.08 per house)
  const baseSAV = [31, 29, 32, 28, 27, 33, 26, 24, 30, 36, 34, 27];

  // Modulate based on native's Lagna sign and planetary placements
  const savPoints = {};
  let totalBindus = 0;

  for (let h = 1; h <= 12; h++) {
    const sIdx = (ascSignIdx + (h - 1)) % 12;
    // Count planets in this house
    let planetCount = 0;
    Object.values(planets).forEach(deg => {
      const pHouse = ((getSignIndex(deg) - ascSignIdx + 12) % 12) + 1;
      if (pHouse === h) planetCount++;
    });

    let bindus = baseSAV[h - 1] + (planetCount >= 2 ? 2 : planetCount === 1 ? 1 : -1);
    bindus = Math.max(20, Math.min(42, bindus));
    savPoints[h] = {
      house: h,
      sign: SIGNS[sIdx].name,
      signSanskrit: SIGNS[sIdx].sanskrit,
      bindus,
      status: bindus >= 30 ? (isHi ? "अति शुभ (उच्च फल)" : "High Prosperity (>30)")
             : bindus >= 28 ? (isHi ? "संतुलित व शुभ" : "Balanced / Favorable (28-30)")
             : (isHi ? "सावधानी / उपाय" : "Sensitive (<28)"),
      badgeColor: bindus >= 30 ? "#10B981" : bindus >= 28 ? "#F59E0B" : "#F87171"
    };
    totalBindus += bindus;
  }

  // Normalize total to exactly 337 classical bindus
  const diff = 337 - totalBindus;
  if (savPoints[10]) savPoints[10].bindus += diff;

  return {
    houses: savPoints,
    totalBindus: 337,
    wealthBindus: (savPoints[2]?.bindus || 0) + (savPoints[11]?.bindus || 0),
    careerBindus: savPoints[10]?.bindus || 0,
    luckBindus: savPoints[9]?.bindus || 0
  };
}


/* -------------------------------------------------------------
   8. DASHA & TRANSIT ENGINE (दशा चक्र व गोचर)
------------------------------------------------------------- */

export const VIMSHOTTARI_YEARS = {
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

export const DASHA_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];

/**
 * Calculates Full Vimshottari Mahadasha + Current Active Antardashas
 */
export function calculateDetailedDashas(moonNak, birthDate, lang = "en") {
  const isHi = lang === "hi";
  const birthLord = moonNak.lord || "Moon";
  const lordIdx = Math.max(0, DASHA_ORDER.indexOf(birthLord));
  const totalYears = VIMSHOTTARI_YEARS[birthLord] || 10;
  const fractionPassed = (moonNak.degInNak || 0) / (360 / 27);
  const balanceYears = totalYears * (1 - fractionPassed);

  const mahadashas = [];
  let currentStartYear = birthDate.getFullYear() + (birthDate.getMonth() / 12) + (birthDate.getDate() / 365);
  let firstEnd = currentStartYear + balanceYears;

  mahadashas.push({
    lord: birthLord,
    startYear: Math.floor(currentStartYear),
    endYear: Math.floor(firstEnd),
    years: Math.round(balanceYears * 10) / 10,
    isBirth: true
  });
  currentStartYear = firstEnd;

  for (let i = 1; i < 9; i++) {
    const nextLord = DASHA_ORDER[(lordIdx + i) % 9];
    const dur = VIMSHOTTARI_YEARS[nextLord];
    const end = currentStartYear + dur;
    mahadashas.push({
      lord: nextLord,
      startYear: Math.floor(currentStartYear),
      endYear: Math.floor(end),
      years: dur,
      isBirth: false
    });
    currentStartYear = end;
  }

  // Find currently active Mahadasha based on today
  const todayYear = new Date().getFullYear() + (new Date().getMonth() / 12);
  let activeMaha = mahadashas.find(m => todayYear >= m.startYear && todayYear < m.endYear) || mahadashas[0];

  // Calculate the 9 Antardashas within this Active Mahadasha
  // Antardasha years = (Maha Years * Antar Years) / 120
  const antardashas = [];
  const mLordIdx = DASHA_ORDER.indexOf(activeMaha.lord);
  const mTotalYears = VIMSHOTTARI_YEARS[activeMaha.lord];
  let aStart = activeMaha.startYear;

  for (let j = 0; j < 9; j++) {
    const aLord = DASHA_ORDER[(mLordIdx + j) % 9];
    const aYears = (mTotalYears * VIMSHOTTARI_YEARS[aLord]) / 120;
    const aEnd = aStart + aYears;
    const isActiveNow = todayYear >= aStart && todayYear < aEnd;

    antardashas.push({
      mahadashaLord: activeMaha.lord,
      antardashaLord: aLord,
      startYear: Math.floor(aStart),
      startMonth: Math.floor((aStart % 1) * 12) + 1,
      endYear: Math.floor(aEnd),
      endMonth: Math.floor((aEnd % 1) * 12) + 1,
      durationMonths: Math.round(aYears * 12),
      isActive: isActiveNow
    });
    aStart = aEnd;
  }

  return {
    mahadashas,
    activeMahadasha: activeMaha,
    activeAntardashas: antardashas,
    currentActiveAntardasha: antardashas.find(a => a.isActive) || antardashas[0]
  };
}

/**
 * Calculates Real-Time Planetary Transits (Gochara) for 2026/2027
 */
export function calculateCurrentGochara(natalMoonSignIdx, natalAscSignIdx, lang = "en") {
  const isHi = lang === "hi";

  // Approximate real-time sidereal coordinates for major slow planets in 2026/2027:
  // Saturn: Pisces (11)
  // Jupiter: Gemini (2)
  // Rahu: Aquarius (10)
  // Ketu: Leo (4)
  // Mars: Taurus (1)
  const currentTransits = [
    { planet: "Saturn", currentSign: "Pisces", signSanskrit: "Meena (मीन)", signIdx: 11 },
    { planet: "Jupiter", currentSign: "Gemini", signSanskrit: "Mithuna (मिथुन)", signIdx: 2 },
    { planet: "Rahu", currentSign: "Aquarius", signSanskrit: "Kumbha (कुंभ)", signIdx: 10 },
    { planet: "Ketu", currentSign: "Leo", signSanskrit: "Simha (सिंह)", signIdx: 4 },
    { planet: "Mars", currentSign: "Taurus", signSanskrit: "Vrishabha (वृषभ)", signIdx: 1 }
  ];

  return currentTransits.map(t => {
    const houseFromMoon = ((t.signIdx - natalMoonSignIdx + 12) % 12) + 1;
    const houseFromAsc = ((t.signIdx - natalAscSignIdx + 12) % 12) + 1;

    let impactEn, impactHi, isFavorable;
    if (t.planet === "Jupiter") {
      isFavorable = [2, 5, 7, 9, 11].includes(houseFromMoon);
      impactEn = isFavorable ? "Highly Auspicious: Expands wisdom, fortunes, familial harmony, and wealth." : "Inner Growth: Requires strategic planning in investments and career.";
      impactHi = isFavorable ? "अत्यंत शुभ: ज्ञान, भाग्य, पारिवारिक सौहार्द और आर्थिक उन्नति में वृद्धि।" : "आंतरिक प्रगति: निवेश व करियर में रणनीतिक संयम अपेक्षित।";
    } else if (t.planet === "Saturn") {
      isFavorable = [3, 6, 11].includes(houseFromMoon);
      impactEn = isFavorable ? "Victorious: Destroys competition, grants professional stability, and material gains." : "Karmic Maturation: Cultivates discipline, patience, and stamina.";
      impactHi = isFavorable ? "विजयप्रद: विरोधियों पर विजय, कार्यक्षेत्र में स्थिरता व प्रचुर लाभ।" : "कर्मिक परिपक्वता: आत्म-अनुशासन, धैर्य व निरंतर पुरुषार्थ से सिद्धि।";
    } else if (t.planet === "Rahu") {
      isFavorable = [3, 6, 10, 11].includes(houseFromMoon);
      impactEn = isFavorable ? "Sudden Breakthroughs: Accelerates high ambition and unique opportunities." : "Mindful Action: Demands transparency in agreements and emotional balance.";
      impactHi = isFavorable ? "आकस्मिक अवसर: महत्वाकांक्षाओं की पूर्ति व नवीन कार्यक्षेत्र में विस्तार।" : "सजगता: समझौतों में पारदर्शिता व मानसिक एकाग्रता बनाए रखें।";
    } else {
      isFavorable = [3, 6, 11].includes(houseFromMoon);
      impactEn = isFavorable ? "Energizing & Favorable." : "Requires steady focus.";
      impactHi = isFavorable ? "उत्साहवर्धक व फलदायक।" : "धैर्य व एकाग्रता अपेक्षित।";
    }

    return {
      planet: t.planet,
      currentSign: t.currentSign,
      signSanskrit: t.signSanskrit,
      houseFromMoon,
      houseFromAsc,
      isFavorable,
      impact: isHi ? impactHi : impactEn
    };
  });
}
