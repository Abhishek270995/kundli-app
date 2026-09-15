// ══════════════════════════════════════════════════════════════════════════════
// DELUXE 45-50 PAGE VEDIC LIFE REPORT GENERATOR & ENGINE
// Comprehensive Parashari Calculations, Planetary Deep Dives & Bhava Analyses
// ══════════════════════════════════════════════════════════════════════════════

import { SIGNS, NAKSHATRAS } from "./jyotishEngine";

export const PLANETS = [
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

// Helper to compute Navamsha (D9) sign index
export function calculateD9SignIndex(longitudeDeg) {
  const deg = ((longitudeDeg % 360) + 360) % 360;
  const signIdx = Math.floor(deg / 30);
  const degInSign = deg % 30;
  const pada = Math.floor(degInSign / (3 + 1 / 3)); // 0 to 8

  // Movable signs: 0, 3, 6, 9 (Aries, Cancer, Libra, Capricorn)
  // Fixed signs: 1, 4, 7, 10 (Taurus, Leo, Scorpio, Aquarius)
  // Dual signs: 2, 5, 8, 11 (Gemini, Virgo, Sagittarius, Pisces)
  let startIdx = signIdx;
  if ([1, 4, 7, 10].includes(signIdx)) {
    startIdx = (signIdx + 8) % 12;
  } else if ([2, 5, 8, 11].includes(signIdx)) {
    startIdx = (signIdx + 4) % 12;
  }
  return (startIdx + pada) % 12;
}

// Helper to compute Dasamsa (D10) sign index
export function calculateD10SignIndex(longitudeDeg) {
  const deg = ((longitudeDeg % 360) + 360) % 360;
  const signIdx = Math.floor(deg / 30);
  const degInSign = deg % 30;
  const pada10 = Math.floor(degInSign / 3); // 0 to 9

  if (signIdx % 2 === 0) {
    // Odd signs (1, 3, 5, 7, 9, 11 in 1-based, 0, 2, 4, 6, 8, 10 in 0-based)
    return (signIdx + pada10) % 12;
  } else {
    // Even signs
    return (signIdx + 8 + pada10) % 12;
  }
}

// Build houses dictionary from planet longitudes and ascendant for any divisional chart
export function buildDivisionalHouses(planetData = {}, ascSignName = "Aries", getSignFn = (deg) => Math.floor(deg / 30)) {
  const ascSignIdx = SIGNS.findIndex(s => s.name === ascSignName);
  const validAscIdx = ascSignIdx >= 0 ? ascSignIdx : 0;

  const houses = {};
  for (let h = 1; h <= 12; h++) {
    const sIdx = (validAscIdx + (h - 1)) % 12;
    houses[h] = {
      sign: SIGNS[sIdx].name,
      signSanskrit: SIGNS[sIdx].sanskrit,
      planets: []
    };
  }

  Object.entries(planetData).forEach(([pName, pInfo]) => {
    if (!pInfo || typeof pInfo.degreeVal === "undefined") return;
    const targetSignIdx = getSignFn(pInfo.degreeVal);
    const targetSignName = SIGNS[targetSignIdx]?.name;
    for (let h = 1; h <= 12; h++) {
      if (houses[h].sign === targetSignName) {
        houses[h].planets.push(pName);
        break;
      }
    }
  });

  return houses;
}

// Planet deep dive texts & attributes
export const PLANET_DEEP_DIVES = {
  Sun: {
    title: "Surya (Sun) — The Cosmic Atman & Divine Sovereign",
    sanskrit: "सूर्य देव · आत्माकारक",
    significance: "Soul vitality, father, government recognition, sovereign power, bone health & leadership authority.",
    gemstone: "Ruby (Manikya) in Gold or Copper",
    mantra: "ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः (Om Hraam Hreem Hroum Sah Suryaya Namah)",
    vedicDeity: "Lord Shiva / Surya Narayana",
    bodyParts: "Heart, spine, eyes (right eye), bones, systemic vitality & immunity",
    karmicMeaning: "The Sun represents the divine spark within. A strong Sun confers unflinching integrity, courage to lead without fear, and deep-seated self-respect.",
    remedyText: "Offer fresh water mixed with red flowers and kumkum to the rising Sun daily in a copper vessel while reciting the Gayatri Mantra. Respect father and authority figures."
  },
  Moon: {
    title: "Chandra (Moon) — The Manas, Emotional Equilibrium & Intuition",
    sanskrit: "चंद्र देव · मनसो जातः",
    significance: "Mind, emotions, mother, mental serenity, intuitive faculties, public connection & memory.",
    gemstone: "Natural Pearl (Moti) or Moonstone in Silver",
    mantra: "ॐ श्रां श्रीं श्रौं सः चंद्राय नमः (Om Shraam Shreem Shroum Sah Chandraya Namah)",
    vedicDeity: "Goddess Parvati / Lord Shiva",
    bodyParts: "Mind, body fluids, stomach, left eye, lymphatic system & emotional balance",
    karmicMeaning: "The Moon reflects how we perceive reality and digest emotional experiences. A luminous Moon grants serene contentment and profound creative sensitivity.",
    remedyText: "Drink water from a silver cup. Offer raw milk and water to the Shiva Lingam on Mondays. Seek blessings from your mother and maternal elders daily."
  },
  Mars: {
    title: "Mangal (Mars) — The Senapati, Valor, Real Estate & Ambition",
    sanskrit: "मंगल देव · पराक्रम एवं भूमि",
    significance: "Physical endurance, valor, property ownership, technical mastery, executive drive & blood vitality.",
    gemstone: "Red Coral (Moonga) in Copper or Gold",
    mantra: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः (Om Kraam Kreem Kroum Sah Bhaumaya Namah)",
    vedicDeity: "Lord Hanuman / Kartikeya (Murugan)",
    bodyParts: "Blood, marrow, muscular system, forehead & adrenal vitality",
    karmicMeaning: "Mars represents raw kinetic energy, courageous resolve, and the ability to take decisive initiative in the face of obstacles.",
    remedyText: "Recite the Hanuman Chalisa on Tuesdays. Donate red lentils (Masoor Dal) or jaggery. Maintain harmonious relations with younger brothers."
  },
  Mercury: {
    title: "Budha (Mercury) — The Buddhi, Commercial Genius & Communication",
    sanskrit: "बुध देव · बुद्धि एवं वाणिज्य",
    significance: "Intellect, analytical reasoning, trade, speech, nervous coordination & humorous agility.",
    gemstone: "Emerald (Panna) in Bronze or Gold",
    mantra: "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः (Om Braam Breem Broum Sah Budhaya Namah)",
    vedicDeity: "Lord Vishnu / Mahavishnu",
    bodyParts: "Nervous system, skin, vocal cords, bronchial tracts & analytical brain",
    karmicMeaning: "Mercury governs discernment (Viveka) and the capacity to convert raw data into actionable, profitable wisdom.",
    remedyText: "Feed green grass or spinach to cows on Wednesdays. Chant the Vishnu Sahasranama or 'Om Namo Bhagavate Vasudevaya'. Keep green indoor plants."
  },
  Jupiter: {
    title: "Guru (Jupiter) — The Brihaspati, Fortune, Wisdom & Progeny",
    sanskrit: "देवगुरु बृहस्पति · भाग्य एवं ज्ञान",
    significance: "Divine wisdom, wealth expansion, spiritual dharma, mentors, progeny & higher philosophy.",
    gemstone: "Yellow Sapphire (Pukhraj) in Yellow Gold",
    mantra: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः (Om Graam Greem Groum Sah Gurave Namah)",
    vedicDeity: "Lord Brahma / Dakshinamurthy / Dattatreya",
    bodyParts: "Liver, gallbladder, arterial system, adipose tissue & cerebral wisdom",
    karmicMeaning: "Jupiter is the ultimate benefic, representing divine grace, benevolent mentorship, and the protection of positive past-life karma (Purva Punya).",
    remedyText: "Apply a saffron or turmeric tilak on the forehead on Thursdays. Donate yellow split chickpeas (Chana Dal) or bananas to students or temple priests."
  },
  Venus: {
    title: "Shukra (Venus) — The Daityaguru, Romance, Luxury & Aesthetics",
    sanskrit: "शुक्राचार्य · ऐश्वर्य एवं दांपत्य",
    significance: "Marital happiness, refined aesthetics, luxury vehicles, creative arts & reproductive vigor.",
    gemstone: "Diamond / White Sapphire / Opal in Platinum or Silver",
    mantra: "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः (Om Draam Dreem Droum Sah Shukraya Namah)",
    vedicDeity: "Goddess Mahalakshmi",
    bodyParts: "Reproductive organs, kidneys, complexion, throat & artistic glands",
    karmicMeaning: "Venus governs our ability to love selflessly, appreciate subtle beauty, and magnetize harmonious abundance into physical reality.",
    remedyText: "Donate white sweets, rice, or ghee on Fridays. Worship Goddess Lakshmi with fragrant white flowers. Treat all women with supreme respect."
  },
  Saturn: {
    title: "Shani (Saturn) — The Karmaphala Data, Discipline & Endurance",
    sanskrit: "शनैश्चर · न्याय एवं कर्मफल",
    significance: "Karmic justice, longevity, perseverance, structural organization, labor & ultimate power.",
    gemstone: "Blue Sapphire (Neelam) / Blue Topaz / Amethyst in Silver or Iron",
    mantra: "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः (Om Praam Preem Proum Sah Shanaishcharaya Namah)",
    vedicDeity: "Lord Shiva / Yama / Lord Hanuman",
    bodyParts: "Teeth, bones, joints, knees, sciatic nerve & longevity life-force",
    karmicMeaning: "Saturn demands relentless truth, punctuality, humility, and service. It tests ruthlessly only to bestow unshakeable, lifelong stature.",
    remedyText: "Light a mustard oil lamp under a Peepal tree on Saturday evenings. Feed black sesame seeds and roti to crows and stray dogs. Serve the underprivileged."
  },
  Rahu: {
    title: "Rahu (North Node) — The Cosmic Innovator, Tech & Global Realms",
    sanskrit: "राहु ग्रह · तमो ग्रह एवं विदेश",
    significance: "Exponential breakthroughs, foreign connections, technological disruption & overcoming boundaries.",
    gemstone: "Hessonite Garnet (Gomed) in Panchdhatu or Silver",
    mantra: "ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः (Om Bhraam Bhreem Bhroum Sah Rahave Namah)",
    vedicDeity: "Goddess Durga / Bhairava",
    bodyParts: "Breathing passages, skin allergies, neurological sensitivities & mental imagination",
    karmicMeaning: "Rahu represents the hunger for new experiences and radical transformation. Channelled ethically, it produces world-renowned visionaries and tech pioneers.",
    remedyText: "Feed barley or dry fruits to birds on Saturdays. Donate blue or black blankets to the needy. Recite the Durga Chalisa regularly."
  },
  Ketu: {
    title: "Ketu (South Node) — The Moksha Karaka, Intuition & Mystical Depth",
    sanskrit: "केतु ग्रह · मोक्षकारक एवं अध्यात्म",
    significance: "Spiritual liberation, psychic perception, mastery of esoteric sciences, detachment & inner peace.",
    gemstone: "Cat's Eye (Lehsuniya) in Silver or Panchdhatu",
    mantra: "ॐ स्त्रां स्त्रीं स्त्रौं सः केतवे नमः (Om Straam Streem Stroum Sah Ketave Namah)",
    vedicDeity: "Lord Ganesha / Matsya Avatar",
    bodyParts: "Spine, soles of feet, psychic nervous centers & subconscious dreams",
    karmicMeaning: "Ketu represents wisdom distilled from previous incarnations. It dissolves hollow worldly attachments to reveal our eternal spiritual core.",
    remedyText: "Offer fresh Durva grass to Lord Ganesha on Wednesdays. Feed stray street dogs with sweet rotis. Practice regular meditation and breathwork."
  }
};

// House deep dive texts & attributes
export const HOUSE_DEEP_DIVES = [
  {
    house: 1,
    title: "House 1 (Tanu Bhava) — Self, Physical Constitution & Life Path",
    sanskrit: "प्रथम भाव · तनु भाव (लग्न)",
    coreThemes: "Physical vitality, character, self-identity, appearance, head, innate constitution and overall destiny path.",
    detailedSignificance: "The First House is the primary cornerstone of your horoscope. It governs your energetic signature, personal magnetism, how you initiate projects, and the physical stamina with which you encounter life. An auspiciously supported first house confers enduring vitality, a dignified aura, and strong leadership presence.",
    karmicImpact: "Your rising sign establishes the baseline of your reactive temperament. It indicates the primary life lessons and self-actualization goals your soul has chosen to fulfill."
  },
  {
    house: 2,
    title: "House 2 (Dhana Bhava) — Accumulated Wealth, Assets & Lineage",
    sanskrit: "द्वितीय भाव · धन एवं कुटुंब भाव",
    coreThemes: "Liquid finances, accumulated assets, ancestral lineage, speech, family traditions, values and oral health.",
    detailedSignificance: "The Second House measures your capacity to preserve, build, and multiply financial resources over time. It governs wealth preservation, family inheritance, truthfulness in speech, and the food habits that sustain physical vitality.",
    karmicImpact: "Planets influencing this house determine whether money flows through steady conventional savings or dynamic multi-stream assets."
  },
  {
    house: 3,
    title: "House 3 (Sahaja Bhava) — Valor, Enterprise, Siblings & Communications",
    sanskrit: "तृतीय भाव · सहज एवं पराक्रम भाव",
    coreThemes: "Personal initiative, physical courage, younger siblings, creative writing, digital media and short journeys.",
    detailedSignificance: "This Upachaya house measures your entrepreneurial grit. It dictates how courageously you handle crisis, negotiate contracts, and express ideas across spoken and digital platforms.",
    karmicImpact: "Effort invested in House 3 areas consistently expands and matures with age, transforming raw courage into strategic market authority."
  },
  {
    house: 4,
    title: "House 4 (Sukha Bhava) — Mother, Domestic Peace, Land & Vehicles",
    sanskrit: "चतुर्थ भाव · सुख एवं मातृ भाव",
    coreThemes: "Mother's blessings, residential properties, vehicular assets (Vahan), emotional sanctuary and inner peace.",
    detailedSignificance: "The Fourth House represents the emotional roots of your existence. It governs fixed properties, real estate investments, vehicles, maternal warmth, and your private sanctuary away from worldly noise.",
    karmicImpact: "A well-aspected fourth house ensures lifelong domestic contentment, ownership of prestigious homes and tranquil mental composure."
  },
  {
    house: 5,
    title: "House 5 (Putra Bhava) — Creative Genius, Children, Mantras & Past Merits",
    sanskrit: "पंचम भाव · पुत्र एवं पूर्वपुण्य भाव",
    coreThemes: "Creative intelligence, speculative gains, children, devotional mantras, romance and past-life blessings.",
    detailedSignificance: "The Fifth House is the paramount Trikona of intellect and divine grace. It governs original creativity, speculative financial instincts, educational mastery, progeny, and mantra siddhi.",
    karmicImpact: "This house acts as your spiritual bank account from previous lives (Purva Punya), granting sudden flashes of genius and fortunate breakthroughs."
  },
  {
    house: 6,
    title: "House 6 (Ripu Bhava) — Health, Immunity, Competition & Overcoming Hurdles",
    sanskrit: "षष्ठ भाव · शत्रु, ऋण एवं रोग भाव",
    coreThemes: "Daily discipline, biological immunity, debt management, competitive triumphs and litigation protection.",
    detailedSignificance: "The Sixth House is the training ground of resilience. It rules your relationship with daily routines, biological digestion, legal disputes, competitive examinations, and overcoming adversaries.",
    karmicImpact: "Benefic influences here transform potential obstacles into springboard victories, conferring the ability to outwork and outlast any rival."
  },
  {
    house: 7,
    title: "House 7 (Kalatra Bhava) — Marriage, Spouse Identity & Public Partnerships",
    sanskrit: "सप्तम भाव · जाया एवं साझेदारी भाव",
    coreThemes: "Matrimony, life partner's character, business partnerships, public prestige and foreign diplomacy.",
    detailedSignificance: "The Seventh House governs all sacred one-on-one commitments. It mirrors your soul's ideal complement, spouse's physical and psychological traits, and the success of commercial contracts.",
    karmicImpact: "Harmonious planetary aspects here produce deeply enriching, loyal marriages and prosperous commercial joint-ventures."
  },
  {
    house: 8,
    title: "House 8 (Ayur Bhava) — Longevity, Unexpected Wealth & Occult Transformation",
    sanskrit: "अष्टम भाव · आयु एवं गूढ़ ज्ञान भाव",
    coreThemes: "Longevity, sudden windfalls, partner's assets, esoteric research, deep transformations and psychological resilience.",
    detailedSignificance: "The Eighth House rules the deep mysteries of existence. It governs unearned wealth (inheritances, settlements, taxes), psychological regeneration, longevity, and occult insight.",
    karmicImpact: "This house grants miraculous phoenix-like recoveries from sudden challenges, converting hidden crises into profound spiritual strength."
  },
  {
    house: 9,
    title: "House 9 (Dharma Bhava) — Divine Luck, Higher Wisdom, Guru & Pilgrimages",
    sanskrit: "नवम भाव · भाग्य एवं धर्म भाव",
    coreThemes: "Divine fortune (Bhagya), ethical virtue, father, spiritual preceptors (Gurus), long overseas pilgrimages and higher learning.",
    detailedSignificance: "The Ninth House is the supreme house of luck and righteousness. It measures divine benevolence, ethical integrity, guidance from enlightened teachers, and international spiritual journeys.",
    karmicImpact: "When the ninth house is robust, life events orchestrate serendipitous alignments, shielding you from catastrophe and opening royal doors."
  },
  {
    house: 10,
    title: "House 10 (Karma Bhava) — Career Eminence, Public Status & Executive Power",
    sanskrit: "दशम भाव · कर्म एवं कीर्ति भाव",
    coreThemes: "Professional leadership, executive honors, public status, government favor, career milestones and societal legacy.",
    detailedSignificance: "The Tenth House is the pinnacle of the horoscope. It dictates your public vocation, authority in corporate or governmental hierarchies, executive reputation, and the tangible legacy you leave behind.",
    karmicImpact: "Planets positioned here determine the magnitude of your professional impact, public renown, and highest career achievements."
  },
  {
    house: 11,
    title: "House 11 (Labha Bhava) — Multi-Source Income, Wealth Realization & Global Networks",
    sanskrit: "एकादश भाव · लाभ एवं सिद्धि भाव",
    coreThemes: "Fulfillment of desires, recurring revenues, expansive social networks, venture profits, elder siblings and visionary goals.",
    detailedSignificance: "The Eleventh House is the supreme house of wealth realization (Labha). It dictates how efficiently your talents convert into recurring profits, large patron networks, and major milestone accomplishments.",
    karmicImpact: "As the ultimate Upachaya, planets in the eleventh house constantly magnify their financial benefits as you progress through life."
  },
  {
    house: 12,
    title: "House 12 (Vyaya Bhava) — Foreign Relocation, Subconscious Mind & Spiritual Moksha",
    sanskrit: "द्वादश भाव · व्यय, विदेश एवं मोक्ष भाव",
    coreThemes: "Foreign settlements, global commerce, spiritual liberation (Moksha), meditation, charitable giving and subconscious rejuvenation.",
    detailedSignificance: "The Twelfth House marks the return of the soul to its divine source. It governs overseas travel, international relocation, hospital/retreat rejuvenation, sleep harmony, and spiritual liberation.",
    karmicImpact: "Strong 12th house placements produce worldly detachment paired with profound foreign prosperity and mystical spiritual awakening."
  }
];
