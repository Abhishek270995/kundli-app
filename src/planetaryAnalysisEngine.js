/**
 * PLANETARY ANALYSIS ENGINE (विस्तृत ग्रह स्थिति एवं जीवन प्रभाव विश्लेषण)
 * Authentic Parashari Vedic Astrology Engine for:
 * 1. Planetary Avasthas (Bala, Kumara, Yuva, Vriddha, Mrita) based on exact degrees and odd/even signs.
 * 2. Planetary Conjunctions (Yutis) & Grand Classical Yogas.
 * 3. Multi-dimensional Life Impact Analysis for every planet:
 *    - Career & Profession (करियर व आजीविका)
 *    - Education & Intellect (शिक्षा व बौद्धिक क्षमता)
 *    - Love Life & Marriage (दांपत्य व प्रेम संबंध)
 *    - Wealth & Finances (धन व संपत्ति)
 *    - Health & Vitality (स्वास्थ्य व मानसिक ऊर्जा)
 *    - House Association & Vedic Remedies (भाव संबंध व उपाय)
 */

export const HOUSE_TITLES = {
  1: { en: "1st House (Tanu Bhava - Self & Life Vitality)", hi: "प्रथम भाव (तनु भाव - व्यक्तित्व, आत्मबल व जीवन दिशा)" },
  2: { en: "2nd House (Dhana Bhava - Wealth & Family)", hi: "द्वितीय भाव (धन भाव - संचित संपत्ति, वाणी व कुटुंब)" },
  3: { en: "3rd House (Sahaja Bhava - Valor & Skills)", hi: "तृतीय भाव (सहज भाव - पराक्रम, भाई-बहन व रचनात्मक कौशल)" },
  4: { en: "4th House (Sukha Bhava - Mother & Assets)", hi: "चतुर्थ भाव (सुख भाव - माता, भूमि-वाहन व गृह शांति)" },
  5: { en: "5th House (Putra Bhava - Intellect & Romance)", hi: "पंचम भाव (पुत्र भाव - विद्या, बुद्धि, प्रेम व पूर्व पुण्य)" },
  6: { en: "6th House (Ari Bhava - Service & Competition)", hi: "षष्ठ भाव (अरि भाव - रोग, ऋण, शत्रु व सेवा)" },
  7: { en: "7th House (Yuvati Bhava - Marriage & Partnerships)", hi: "सप्तम भाव (जाया भाव - जीवनसाथी, विवाह व साझेदारी)" },
  8: { en: "8th House (Randhra Bhava - Longevity & Mystery)", hi: "अष्टम भाव (रंध्र भाव - आयु, गूढ़ विद्या व आकस्मिक लाभ)" },
  9: { en: "9th House (Dharma Bhava - Fortune & Spirituality)", hi: "नवम भाव (भाग्य भाव - धर्म, गुरु, तीर्थयात्रा व उच्च भाग्य)" },
  10: { en: "10th House (Karma Bhava - Career & Status)", hi: "दशम भाव (कर्म भाव - आजीविका, नेतृत्व, सत्ता व मान-सम्मान)" },
  11: { en: "11th House (Labha Bhava - Gains & Desires)", hi: "एकादश भाव (लाभ भाव - आय वृद्धि, मित्र व अभीष्ट सिद्धि)" },
  12: { en: "12th House (Vyaya Bhava - Liberation & Foreign)", hi: "द्वादश भाव (व्यय भाव - विदेश गमन, मोक्ष, दान व आध्यात्म)" }
};

/**
 * Calculate Planetary Avastha based on degree within sign (0°-30°) and odd/even sign
 */
export function getPlanetaryAvastha(degInSign, signIdx) {
  const isOddSign = signIdx % 2 === 0; // 0=Aries (odd), 1=Taurus (even), etc.
  const deg = (degInSign % 30 + 30) % 30;

  let key = "Yuva";
  let pct = 100;
  let nameEn = "Yuva Avastha (Youthful)";
  let nameHi = "युवावस्था (पूर्ण बली)";
  let potencyEn = "100% Supreme Strength";
  let potencyHi = "100% पूर्ण सामर्थ्य";
  let descEn = "The planet is at the zenith of its strength and youth, actively and powerfully manifesting its auspicious promises into physical reality.";
  let descHi = "ग्रह अपनी पूर्ण युवावस्था में है। यह अपने भाव व कारक तत्वों का 100% संपूर्ण फल भौतिक जीवन में साकार करने की क्षमता रखता है।";

  if (isOddSign) {
    if (deg < 6) {
      key = "Bala"; pct = 25;
      nameEn = "Bala Avastha (Infant)"; nameHi = "बाल्यावस्था (अल्प बली)";
      potencyEn = "25% Developing Potential"; potencyHi = "25% अंकुरित क्षमता";
      descEn = "Operates like a tender infant; results are gentle and take dedicated cultivation, patience, and effort to blossom.";
      descHi = "शैशव अवस्था के समान ऊर्जा। परिणाम धीरे-धीरे विकसित होते हैं और निरंतर कर्म से पूर्ण परिपक्वता प्राप्त करते हैं।";
    } else if (deg < 12) {
      key = "Kumara"; pct = 50;
      nameEn = "Kumara Avastha (Adolescent)"; nameHi = "कुमारावस्था (प्रगतिशील)";
      potencyEn = "50% Progressive Vigor"; potencyHi = "50% प्रगतिशील बल";
      descEn = "Dynamic and inquisitive like an eager youth; imparts fast learning, agility, and steadily accelerating life results.";
      descHi = "किशोर अवस्था के समान उत्साही व जिज्ञासु। सीखने की तीव्र क्षमता, बौद्धिक स्फूर्ति और प्रगतिशील जीवन फल।";
    } else if (deg < 18) {
      // Yuva (default)
    } else if (deg < 24) {
      key = "Vriddha"; pct = 20;
      nameEn = "Vriddha Avastha (Elderly/Wise)"; nameHi = "वृद्धावस्था (अनुभवी/धीमी गति)";
      potencyEn = "20% Advisory Wisdom"; potencyHi = "20% बौद्धिक प्रज्ञा";
      descEn = "Seasoned and contemplative; favors deep strategic prudence, advisory leadership, and philosophy over sudden physical gains.";
      descHi = "प्रौढ़ अवस्था के समान। भौतिक हड़बड़ी के बजाय दूरदर्शिता, रणनीतिक समझ और जीवन का गहन अनुभव प्रदान करता है।";
    } else {
      key = "Mrita"; pct = 5;
      nameEn = "Mrita Avastha (Dormant/Karmic)"; nameHi = "मृतावस्था (सुप्त/कर्मिक)";
      potencyEn = "5% Dormant Energy"; potencyHi = "5% सुप्त ऊर्जा";
      descEn = "Operates in a quiet, dormant state; lessons manifest at a subtle karmic plane and awaken through Vedic mantras and noble deeds.";
      descHi = "ऊर्जा सुप्त व अंतर्मुखी अवस्था में है। इसके शुभ प्रभावों को जाग्रत करने हेतु नियमित मंत्र जप, ध्यान व दान अत्यंत श्रेयस्कर होता है।";
    }
  } else {
    // Even signs (reverse progression in classical Parashara)
    if (deg < 6) {
      key = "Mrita"; pct = 5;
      nameEn = "Mrita Avastha (Dormant/Karmic)"; nameHi = "मृतावस्था (सुप्त/कर्मिक)";
      potencyEn = "5% Dormant Energy"; potencyHi = "5% सुप्त ऊर्जा";
      descEn = "Operates in a quiet, dormant state in even sign; subtle karmic lessons that awaken through dedicated spiritual practices.";
      descHi = "सुप्त ऊर्जा। इस ग्रह के प्रभावों को जाग्रत करने हेतु मंत्र जप व नियमित पूजा अत्यंत फलदायी होती है।";
    } else if (deg < 12) {
      key = "Vriddha"; pct = 20;
      nameEn = "Vriddha Avastha (Elderly/Wise)"; nameHi = "वृद्धावस्था (अनुभवी/धीमी गति)";
      potencyEn = "20% Advisory Wisdom"; potencyHi = "20% बौद्धिक प्रज्ञा";
      descEn = "Mature and seasoned; grants contemplative prudence, deep research aptitude, and philosophical patience.";
      descHi = "गहन चिंतन व धैर्य। त्वरित लाभ के बजाय दीर्घकालिक स्थायित्व और विवेक प्रदान करता है।";
    } else if (deg < 18) {
      // Yuva (default)
    } else if (deg < 24) {
      key = "Kumara"; pct = 50;
      nameEn = "Kumara Avastha (Adolescent)"; nameHi = "कुमारावस्था (प्रगतिशील)";
      potencyEn = "50% Progressive Vigor"; potencyHi = "50% प्रगतिशील बल";
      descEn = "Active developmental vigor; brings steady progression, agility, and enthusiasm.";
      descHi = "सक्रिय व प्रगतिशील बल। निरंतर प्रयास से सफलता की सीढ़ियां चढ़ने में सहयोग करता है।";
    } else {
      key = "Bala"; pct = 25;
      nameEn = "Bala Avastha (Infant)"; nameHi = "बाल्यावस्था (अल्प बली)";
      potencyEn = "25% Developing Potential"; potencyHi = "25% अंकुरित क्षमता";
      descEn = "Initial budding stage of energy; provides sweet beginnings that flourish with patient maturity.";
      descHi = "शैशव ऊर्जा। प्रारंभिक जीवन में संघर्ष के पश्चात अनुभव के साथ बलवती होती है।";
    }
  }

  return { key, pct, nameEn, nameHi, potencyEn, potencyHi, descEn, descHi };
}

/**
 * Detect all active Planetary Conjunctions (Yutis) in the chart
 */
export function detectPlanetaryConjunctions(planetHouseMap, planetData, lang = "hi") {
  const isHi = lang === "hi";
  const housePlanets = {};

  // Group planets by house
  Object.entries(planetHouseMap || {}).forEach(([planet, house]) => {
    if (!housePlanets[house]) housePlanets[house] = [];
    housePlanets[house].push(planet);
  });

  const conjunctions = [];

  Object.entries(housePlanets).forEach(([houseStr, pList]) => {
    const houseNum = parseInt(houseStr, 10);
    if (pList.length < 2) return;

    // Check specific 2-planet pairs or multi-planet combinations
    const set = new Set(pList);
    const hTitle = HOUSE_TITLES[houseNum] || { en: `House ${houseNum}`, hi: `${houseNum}वां भाव` };

    let yogaNameEn = `${pList.join(" + ")} Conjunction`;
    let yogaNameHi = `${pList.map(p => translatePlanet(p, "hi")).join(" + ")} युति`;
    let category = "auspicious"; // "auspicious" | "intense" | "rajayoga" | "dhanyoga"
    let icon = "✨";

    let meaningEn = `Planets ${pList.join(" and ")} merge their cosmic rays in ${hTitle.en}, deeply coloring every life area governed by this house.`;
    let meaningHi = `${pList.map(p => translatePlanet(p, "hi")).join(" और ")} का ${hTitle.hi} में पावन मिलन, इस भाव से जुड़े सभी जीवन क्षेत्रों पर गहरा संयुक्त प्रभाव डालता है।`;

    let careerEn = "Encourages a multifaceted approach to your work, combining diverse skillsets to excel.";
    let careerHi = "करियर में बहुमुखी प्रतिभा का विकास। दोनों ग्रहों के संयुक्त प्रभाव से कार्यक्षेत्र में विशिष्ट पहचान मिलती है।";

    let loveEn = "Shapes relationship expectations through a blended emotional and energetic wavelength.";
    let loveHi = "दांपत्य व प्रेम संबंधों में भावनात्मक संतुलन और परिपक्व संवाद की आवश्यकता रहती है।";

    let intellectEn = "Enhances cognitive breadth, allowing you to view problems from multiple complementary angles.";
    let intellectHi = "विचारों में व्यापकता, समस्याओं को विभिन्न दृष्टिकोणों से सुलझाने की अद्वितीय बौद्धिक क्षमता।";

    // Specific Classical Yuti Syntheses:
    if (set.has("Sun") && set.has("Mercury")) {
      yogaNameEn = "Budhaditya Mahayoga (Sun + Mercury)";
      yogaNameHi = "बुधादित्य महायोग (सूर्य + बुध)";
      category = "rajayoga";
      icon = "👑";
      meaningEn = "The glorious conjunction of Solar authority and Mercurial intellect. Endows the native with a brilliant mathematical mind, eloquence, and executive prowess.";
      meaningHi = "सूर्य के तेज व प्रभाव तथा बुध की तीक्ष्ण बुद्धि का दिव्य संयोग। यह जातक को प्रखर बुद्धि, तर्कशक्ति, प्रशासनिक कुशलता और सम्मोहक वाकपटुता प्रदान करता है।";
      careerEn = "High administrative roles, governmental advisory, IT leadership, financial analysis, writing, and high-level consulting.";
      careerHi = "प्रशासनिक सेवाएं, उच्च पद, वित्तीय प्रबंधन, तकनीकी नेतृत्व, पत्रकारिता व स्वतंत्र परामर्श में अपार सफलता।";
      loveEn = "Valuing intellectual companionship; partner respects your status and sharp intellect. Transparent communication maintains harmony.";
      loveHi = "जीवनसाथी बौद्धिक स्तर पर आपका सम्मान करता है। संबंधों में वैचारिक तालमेल व स्पष्ट संवाद सुखद रहता है।";
      intellectEn = "Exceptional analytical reasoning, rapid learning, photographic recall, and persuasive oratory skills.";
      intellectHi = "असाधारण तार्किक क्षमता, तीव्र ग्रहण शक्ति, विश्लेषण में दक्षता और प्रभावशाली वक्तृत्व कला।";
    } else if (set.has("Jupiter") && set.has("Moon")) {
      yogaNameEn = "Gajakesari Mahayoga (Jupiter + Moon)";
      yogaNameHi = "गजकेसरी महायोग (गुरु + चंद्र)";
      category = "rajayoga";
      icon = "🐘";
      meaningEn = "One of the most auspicious royal yogas in Vedic Astrology. Formed by Divine Guru and gentle Moon, blessing the native with an untarnished reputation, wisdom, and lasting fortune.";
      meaningHi = "वैदिक ज्योतिष का सर्वश्रेष्ठ राजयोग। देवगुरु बृहस्पति व चंद्रमा की पावन युति जातक को निष्कलंक यश, उदार हृदय, अपार सम्मान और अखंड समृद्धि प्रदान करती है।";
      careerEn = "Professorship, judicial services, institutional heads, banking, social leadership, counseling, and high spiritual advisory.";
      careerHi = "शिक्षा, न्यायपालिका, बैंकिंग, सार्वजनिक नेतृत्व, संस्थागत प्रमुख व नीति-निर्माण में सर्वोच्च प्रतिष्ठा।";
      loveEn = "Deeply devoted, cultured, and benevolent marital bond; brings emotional fulfillment, mutual respect, and noble progeny.";
      loveHi = "दांपत्य जीवन अत्यंत मधुर, संस्कारित व गरिमापूर्ण। जीवनसाथी से आत्मिक सहयोग व संतान सुख की प्राप्ति।";
      intellectEn = "Philosophical depth, encyclopedic knowledge, emotional equilibrium, and profound ethical wisdom.";
      intellectHi = "गहन आध्यात्मिक व दार्शनिक समझ, शांत मानसिक स्थिति, नीतिशास्त्र व लोक-कल्याणकारी सोच।";
    } else if (set.has("Moon") && set.has("Mars")) {
      yogaNameEn = "Chandra-Mangal Dhana Yoga (Moon + Mars)";
      yogaNameHi = "चंद्र-मंगल महालक्ष्मी योग (चंद्र + मंगल)";
      category = "dhanyoga";
      icon = "💰";
      meaningEn = "An exceptionally powerful wealth-creating combination. Merges Lunar adaptability and Martian bold enterprise, turning ambitions into tangible liquid wealth.";
      meaningHi = "अथाह धन व समृद्धि प्रदायक महालक्ष्मी योग। चंद्रमा की संवेदनशीलता व मंगल के अदम्य साहस का मिलन जातक को धनार्जन व उद्यमिता में निपुण बनाता है।";
      careerEn = "Real estate, property development, commercial entrepreneurship, engineering, hospitality, and resource management.";
      careerHi = "रियल एस्टेट, भवन निर्माण, व्यापारिक उद्यम, होटल प्रबंधन, उद्योग व बहुराष्ट्रीय वित्त में असाधारण प्रगति।";
      loveEn = "High emotional passion and drive; mutual financial prosperity together with partner. Channeling occasional impatience preserves warmth.";
      loveHi = "प्रेम व दांपत्य में प्रगाढ़ आकर्षण। मिलकर पारिवारिक संपत्ति में भारी वृद्धि करते हैं। भावुकता पर संयम लाभकारी है।";
      intellectEn = "Sharp commercial instinct, rapid risk calculation, and unwavering execution speed.";
      intellectHi = "व्यापारिक पैनी दृष्टि, त्वरित निर्णय लेने की क्षमता और कार्य को अंत तक पहुंचाने की दृढ़ इच्छाशक्ति।";
    } else if (set.has("Mercury") && set.has("Venus")) {
      yogaNameEn = "Lakshmi-Narayan Yoga (Mercury + Venus)";
      yogaNameHi = "लक्ष्मी-नारायण कला योग (बुध + शुक्र)";
      category = "auspicious";
      icon = "🪷";
      meaningEn = "The harmonious union of Mercury's intellect and Venus's artistic elegance. Imparts charm, aesthetic discernment, luxury, and sweet speech.";
      meaningHi = "बुध की बौद्धिक चातुर्य और शुक्र के सौंदर्य व कला का अनुपम संगम। जातक अत्यंत आकर्षक, मृदुभाषी, कलाप्रिय और वैभवशाली होता है।";
      careerEn = "Creative design, luxury branding, advertising, entertainment, law, diplomacy, writing, software UI/UX, and commerce.";
      careerHi = "डिजाइन, कला, सिनेमा, फैशन, कानून, राजनय, विज्ञापन, सॉफ्टवेयर व उच्च-स्तरीय व्यापार में ख्याति।";
      loveEn = "Romantic, affectionate, and sophisticated romantic demeanor; high marital sweetness and mutual artistic appreciation.";
      loveHi = "रोमांटिक, सुरुचिपूर्ण व सौम्य दांपत्य। जीवनसाथी कलात्मक व सहयोग करने वाला होता है।";
      intellectEn = "Aesthetic intelligence, creative problem-solving, refined linguistic expression, and diplomatic tact.";
      intellectHi = "सौंदर्यपरक बुद्धि, रचनात्मक सोच, भाषा पर अद्भुत पकड़ और विवादों को शांति से सुलझाने की कला।";
    } else if (set.has("Mars") && set.has("Venus")) {
      yogaNameEn = "Bhrigu-Mangal Passion & Magnetism Yoga (Mars + Venus)";
      yogaNameHi = "भृगु-मंगल प्रेम व सम्मोहन योग (मंगल + शुक्र)";
      category = "auspicious";
      icon = "🔥";
      meaningEn = "A magnetic fusion of Martian fire and Venusian water. Grants mesmerizing personal charisma, deep aesthetic passion, and intense romantic magnetism.";
      meaningHi = "मंगल की अग्नि व शुक्र के जल तत्व का चुंबकीय मिलन। जातक में असाधारण शारीरिक आकर्षण, कलात्मक जुनून और प्रेम की तीव्र अनुभूति होती है।";
      careerEn = "Fashion, performing arts, interior architecture, media production, sports entertainment, and lifestyle industries.";
      careerHi = "ग्लैमर, अभिनय, वास्तुकला, जीवनशैली उत्पाद, खेल व रचनात्मक उद्योगों में विशेष सफलता।";
      loveEn = "Intensely romantic and expressive; deep loyalty when emotional transparency and appreciation are nurtured.";
      loveHi = "प्रगाढ़ प्रेम व आकर्षण। रिश्ते में खुलापन, सम्मान और परस्पर समर्पण से दांपत्य जीवन स्वर्णिम बनता है।";
      intellectEn = "Intuitive sensory intelligence, spontaneous creativity, and rapid aesthetic synthesis.";
      intellectHi = "कलात्मक संवेदनशीलता, त्वरित निर्णय और रचनात्मक कल्पना शक्ति।";
    } else if (set.has("Sun") && set.has("Jupiter")) {
      yogaNameEn = "Guru-Aditya Raja Yoga (Sun + Jupiter)";
      yogaNameHi = "गुरु-आदित्य ज्ञान योग (सूर्य + गुरु)";
      category = "rajayoga";
      icon = "☀️";
      meaningEn = "The union of King Sun and Divine Priest Jupiter. Bestows upright moral character, spiritual dignity, and revered leadership.";
      meaningHi = "राजा सूर्य व देवगुरु बृहस्पति की गरिमामयी युति। जातक नीतिवान, धर्मनिष्ठ, सत्यवादी और समाज में आदरणीय पद प्राप्त करने वाला होता है।";
      careerEn = "High civil administration, advisory councils, university leadership, judiciary, and international diplomacy.";
      careerHi = "उच्च प्रशासनिक सेवा, न्यायाधीश, शैक्षणिक प्रमुख, नीति आयोग व आध्यात्मिक मार्गदर्शन।";
      loveEn = "Spouse shares high moral ethics and intellectual values; a respected family life founded on mutual righteousness.";
      loveHi = "जीवनसाथी संस्कारवान व आदरणीय। दांपत्य जीवन में सात्विक प्रेम व पारिवारिक मान-सम्मान की वृद्धि।";
      intellectEn = "Visionary ethical intellect, ability to grasp constitutional and philosophical frameworks effortlessly.";
      intellectHi = "विशाल दृष्टिकोण, नीतिगत समझ, न्यायप्रिय बुद्धि और आत्म-अनुशासन।";
    } else if (set.has("Saturn") && set.has("Venus")) {
      yogaNameEn = "Shani-Shukra Sambandha (Saturn + Venus)";
      yogaNameHi = "शनि-शुक्र कर्म व कला योग (शनि + शुक्र)";
      category = "auspicious";
      icon = "⚖️";
      meaningEn = "Friends in Vedic astrology, Saturn's discipline grounds Venusian aspirations, yielding enduring creative mastery and long-term financial stability.";
      meaningHi = "शनि के अनुशासन और शुक्र के सौंदर्य का संतुलित समन्वय। जातक कर्मठ, यथार्थवादी, कलाप्रेमी और दीर्घकालिक संपत्ति का निर्माता होता है।";
      careerEn = "Architecture, manufacturing, luxury commodities, legal advocacy, industrial design, and corporate diplomacy.";
      careerHi = "वास्तुकला, भारी उद्योग, कानून, कॉर्पोरेट प्रबंधन व अंतरराष्ट्रीय व्यापार में टिकाऊ सफलता।";
      loveEn = "Loyal, grounded, and committed relationship; favors maturity, practical stability, and enduring mutual respect over fleeting drama.";
      loveHi = "निष्ठावान व व्यावहारिक दांपत्य। जीवनसाथी गंभीर, कर्तव्यनिष्ठ और जीवन भर साथ निभाने वाला।";
      intellectEn = "Practical aesthetic logic, architectural precision, and disciplined resource management.";
      intellectHi = "व्यावहारिक रचनात्मकता, वित्तीय संयम और हर योजना को जमीनी स्तर पर क्रियान्वित करने का कौशल।";
    } else if (set.has("Mars") && set.has("Rahu")) {
      yogaNameEn = "Angarak Yoga (Mars + Rahu)";
      yogaNameHi = "अंगारक योग (मंगल + राहु)";
      category = "intense";
      icon = "⚡";
      meaningEn = "Combines Mars's explosive heat with Rahu's amplificatory power. Gives fearless bravery, technological brilliance, and immense physical stamina.";
      meaningHi = "मंगल की प्रचंड ऊर्जा व राहु की विस्तारवादी शक्ति का संगम। जातक में अदम्य साहस, निर्भीकता और तकनीक में अप्रत्याशित दक्षता होती है।";
      careerEn = "Surgeons, defense forces, high-tech engineering, cybersecurity, competitive sports, and pioneering ventures.";
      careerHi = "शल्य चिकित्सा (सर्जरी), रक्षा सेवाएं, साइबर सुरक्षा, एरोस्पेस, स्पोर्ट्स व जटिल तकनीकी अनुसंधान।";
      loveEn = "High intensity requiring conscious patience and temper management; physical exercise and meditation keep romantic harmony serene.";
      loveHi = "संबंधों में उत्तेजना से बचें। धैर्य, मधुर वाणी और नियमित प्राणायाम से दांपत्य में सुख-शांति बनी रहती है।";
      intellectEn = "Hyper-fast tactical intellect, out-of-the-box unconventional problem solving, and courageous thinking.";
      intellectHi = "तीव्र सामरिक बुद्धि, लीक से हटकर सोचने की क्षमता और अभूतपूर्व जोखिम लेने का माद्दा।";
    } else if ((set.has("Sun") && set.has("Rahu")) || (set.has("Moon") && set.has("Rahu"))) {
      const lum = set.has("Sun") ? (isHi ? "सूर्य" : "Sun") : (isHi ? "चंद्र" : "Moon");
      yogaNameEn = `Rahu-${lum} Eclipse Yoga (Grahan Yoga)`;
      yogaNameHi = `${lum}-राहु ग्रहण योग (गूढ़ अनुसंधान)`;
      category = "intense";
      icon = "🌑";
      meaningEn = `Rahu's shadow aligns with ${lum}, gifting extraordinary psychological penetration, unconventional insight, and ability to perceive hidden realities.`;
      meaningHi = `${lum} के साथ राहु का संयोजन जातक को असाधारण मनोवैज्ञानिक अंतर्दृष्टि, परा-विज्ञान की समझ और छिपे हुए सत्यों को भांपने की क्षमता देता है।`;
      careerEn = "Psychological research, data science, foreign diplomacy, biotechnology, investigative journalism, and occult studies.";
      careerHi = "मनोविज्ञान, डेटा साइंस, अंतरराष्ट्रीय अनुसंधान, अन्वेषण, गुप्तचर सेवाएं व आधुनिक डिजिटल तकनीक।";
      loveEn = "Needs emotional reassurance and clarity; avoiding over-suspicion fosters profound, soulful connection.";
      loveHi = "रिश्तों में अनावश्यक संशय से बचें। सत्यनिष्ठा व शिव आराधना से दांपत्य में प्रगाढ़ विश्वास उत्पन्न होता है।";
      intellectEn = "Unorthodox genius, intuitive x-ray vision into human nature, and inventive problem solving.";
      intellectHi = "मानव स्वभाव को पढ़ने की अद्भुत क्षमता, गहन शोध दृष्टि और गूढ़ विषयों में निपुणता।";
    } else if (set.has("Jupiter") && set.has("Rahu")) {
      yogaNameEn = "Guru-Chandal Yoga (Jupiter + Rahu)";
      yogaNameHi = "गुरु-चांडाल योग (रूढ़ि-भंजन व अन्वेषण)";
      category = "intense";
      icon = "🌪️";
      meaningEn = "A daring conjunction that questions conventional dogmas. Creates an unconventional thinker who challenges orthodoxy to discover universal truths.";
      meaningHi = "पारंपरिक मान्यताओं से परे सोचने वाला स्वतंत्र चिंतन। जातक रूढ़ियों को तोड़कर नए वैज्ञानिक व सामाजिक आयाम स्थापित करता है।";
      careerEn = "Modern educational reforms, philosophical research, foreign trade, disruptive startups, and digital ethics.";
      careerHi = "शिक्षा में नवाचार, स्टार्टअप्स, अंतरराष्ट्रीय व्यापार, दार्शनिक शोध व सामाजिक सुधार।";
      loveEn = "Prefers a partner who respects intellectual independence; spiritual alignment brings lasting stability.";
      loveHi = "जीवनसाथी विचारों में खुला व स्वतंत्र हो। गुरु मंत्र व सात्विक जीवनशैली से दांपत्य सुदृढ़ रहता है।";
      intellectEn = "Radical philosophical inquiry, out-of-the-box reformist ideas, and fearless debate.";
      intellectHi = "तर्कशील बुद्धि, स्थापित मान्यताओं का विश्लेषण और नवप्रवर्तनकारी दृष्टिकोण।";
    } else if (set.has("Saturn") && set.has("Rahu")) {
      yogaNameEn = "Shani-Rahu Karmic Conjunction (Shrapit / Tapasvi Yoga)";
      yogaNameHi = "शनि-राहु कर्म व तपस्वी योग (शनि + राहु)";
      category = "intense";
      icon = "🛡️";
      meaningEn = "Deep past-life karmic lessons forged through perseverance. Imparts immense patience, resilience against adversity, and mastery in complex systems.";
      meaningHi = "कठोर तप व धैर्य का प्रतीक। जीवन के पूर्वार्ध में संघर्ष के पश्चात उत्तरार्ध में अद्वितीय परिपक्वता, स्थिरता और सफलता दिलाता है।";
      careerEn = "Complex mechanical engineering, mining, metallurgy, cybersecurity, jurisprudence, and international infrastructure.";
      careerHi = "भारी उद्योग, भूगर्भ विज्ञान, साइबर लॉ, सॉफ्टवेयर सुरक्षा, श्रम प्रबंधन व अवसंरचना विकास।";
      loveEn = "Demands steady maturity, emotional patience, and mutual loyalty; blooms into an unbreakable alliance with time.";
      loveHi = "समय के साथ दांपत्य में प्रगाढ़ता। धैर्य और एक-दूसरे के प्रति कर्तव्यनिष्ठा ही सफलता की कुंजी है।";
      intellectEn = "Steel-forged endurance, structural thinking, and ability to handle immense pressure without breaking.";
      intellectHi = "गंभीर एकाग्रता, संकट में भी विचलित न होने वाला मन और दीर्घकालिक योजना निर्माण की कुशलता।";
    }

    conjunctions.push({
      house: houseNum,
      houseTitle: isHi ? hTitle.hi : hTitle.en,
      planets: pList,
      yogaName: isHi ? yogaNameHi : yogaNameEn,
      category,
      icon,
      meaning: isHi ? meaningHi : meaningEn,
      career: isHi ? careerHi : careerEn,
      love: isHi ? loveHi : loveEn,
      intellect: isHi ? intellectHi : intellectEn
    });
  });

  return conjunctions;
}

/**
 * Generate in-depth life aspect breakdown for every planet in the birth chart
 */
export function getPlanetLifeImpactBreakdown(planetName, pData, houses, lang = "hi") {
  const isHi = lang === "hi";
  const houseNum = pData.house;
  const sign = pData.sign;
  const signHi = pData.signSanskrit || sign;
  const degInt = pData.degInt || 0;
  const hTitle = HOUSE_TITLES[houseNum] || { en: `House ${houseNum}`, hi: `${houseNum}वां भाव` };

  // Calculate Avastha
  const avastha = getPlanetaryAvastha(degInt, getSignIndexFromSignName(sign));

  // Determine Planet Archetype & Governance
  const details = PLANET_ARCHETYPES[planetName] || DEFAULT_PLANET_ARCHETYPE;

  // Synthesize life areas
  const career = synthesizeCareerImpact(planetName, houseNum, pData.status, isHi);
  const education = synthesizeEducationImpact(planetName, houseNum, isHi);
  const love = synthesizeLoveImpact(planetName, houseNum, isHi);
  const wealth = synthesizeWealthImpact(planetName, houseNum, isHi);
  const health = synthesizeHealthImpact(planetName, houseNum, isHi);

  return {
    planet: planetName,
    planetHi: translatePlanet(planetName, "hi"),
    symbol: details.symbol,
    color: details.color,
    karaka: isHi ? details.karakaHi : details.karakaEn,
    house: houseNum,
    houseTitle: isHi ? hTitle.hi : hTitle.en,
    sign: isHi ? signHi : sign,
    degree: pData.formattedDegree || pData.degree,
    nakshatra: isHi ? (pData.nakshatraHi || pData.nakshatra) : pData.nakshatra,
    pada: pData.pada,
    status: pData.status,
    avastha,
    houseGovernance: isHi ? getHouseGovernanceHi(houseNum) : getHouseGovernanceEn(houseNum),
    aspects: {
      career,
      education,
      love,
      wealth,
      health
    },
    remedy: isHi ? details.remedyHi : details.remedyEn,
    mantra: details.mantra,
    deity: isHi ? details.deityHi : details.deityEn,
    gemstone: isHi ? details.gemstoneHi : details.gemstoneEn
  };
}

// ─────────────────────────────────────────────────────────────
// HELPER SYNTHESIS & METADATA
// ─────────────────────────────────────────────────────────────

function translatePlanet(p, lang = "hi") {
  const map = {
    Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगल", Mercury: "बुध",
    Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु"
  };
  return lang === "hi" ? (map[p] || p) : p;
}

function getSignIndexFromSignName(name) {
  const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  const idx = signs.indexOf(name);
  return idx >= 0 ? idx : 0;
}

const PLANET_ARCHETYPES = {
  Sun: {
    symbol: "☉", color: "#FBBF24",
    karakaEn: "Soul, Atman, Royal Authority, Father, Vital Health, Ambition",
    karakaHi: "आत्मकारक, पिता, राजसत्ता, आत्म-सम्मान, प्राणशक्ति व नेतृत्व",
    deityEn: "Lord Shiva & Lord Surya Narayana", deityHi: "भगवान शिव एवं सूर्यनारायण",
    gemstoneEn: "Ruby (Manikya) in Copper / Gold", gemstoneHi: "माणिक्य (तांबे या सोने में)",
    mantra: "ॐ ह्रीं ह्रीं सूर्याय नमः (Om Hreem Hreem Suryaya Namah)",
    remedyEn: "Offer pure water with red flowers to rising Sun; recite Aditya Hridayam Stotram; respect elders and father.",
    remedyHi: "प्रातःकाल तांबे के लोटे से सूर्यदेव को रोली-अक्षत युक्त अर्घ्य दें, आदित्य हृदय स्तोत्र का पाठ करें तथा पिता का चरण स्पर्श कर आशीर्वाद लें।"
  },
  Moon: {
    symbol: "☽", color: "#E2E8F0",
    karakaEn: "Mind, Emotions, Intuition, Mother, Fluids, Inner Peace",
    karakaHi: "मनोकारक, माता, भावनाएं, अंतःप्रेरणा, जल तत्व व मानसिक शांति",
    deityEn: "Goddess Parvati & Lord Chandra", deityHi: "माता पार्वती एवं चंद्रदेव",
    gemstoneEn: "Natural Pearl (Moti) or Moonstone in Silver", gemstoneHi: "शुद्ध मोती अथवा चंद्रकांत मणि (चांदी में)",
    mantra: "ॐ सों सोमाय नमः (Om Som Somaya Namah)",
    remedyEn: "Drink water in a silver cup; offer milk to Shiva Lingam on Mondays; honor and serve mother.",
    remedyHi: "चांदी के पात्र में जल पिएं, सोमवार को शिवलिंग पर कच्चा दूध व जल अर्पित करें तथा माता की सेवा कर उनका आशीर्वाद लें।"
  },
  Mars: {
    symbol: "♂", color: "#F87171",
    karakaEn: "Courage, Blood, Real Estate, Physical Energy, Younger Siblings, Victory",
    karakaHi: "पराक्रम, रक्त, भूमि-भवन, शौर्य, छोटे भाई-बहन व प्रतिस्पर्धा",
    deityEn: "Lord Kartikeya & Lord Hanuman", deityHi: "भगवान कार्तिकेय एवं श्री हनुमान जी",
    gemstoneEn: "Red Coral (Moonga) in Copper / Gold", gemstoneHi: "रक्त मूंगा (तांबे या सोने में)",
    mantra: "ॐ अं अंगारकाय नमः (Om Am Angarakaya Namah)",
    remedyEn: "Chant Hanuman Chalisa daily; feed jaggery and gram to monkeys or cows on Tuesday; engage in athletic discipline.",
    remedyHi: "प्रतिदिन हनुमान चालीसा का पाठ करें, मंगलवार को बंदरों या गाय को गुड़-चना खिलाएं तथा नियमित शारीरिक व्यायाम करें।"
  },
  Mercury: {
    symbol: "☿", color: "#34D399",
    karakaEn: "Intellect, Speech, Commerce, Logic, Communication, Maternal Uncles",
    karakaHi: "बुद्धिकारक, वाणी, व्यापार, तर्कशास्त्र, संचार व गणितीय मेधा",
    deityEn: "Lord Vishnu & Lord Ganesha", deityHi: "भगवान श्री विष्णु एवं श्री गणेश जी",
    gemstoneEn: "Emerald (Panna) or Green Tourmaline in Bronze / Gold", gemstoneHi: "पन्ना अथवा हरा तुरमली (कांसे या सोने में)",
    mantra: "ॐ बुं बुधाय नमः (Om Bum Budhaya Namah)",
    remedyEn: "Feed green fodder to cows on Wednesdays; worship Lord Ganesha with fresh Durva grass; maintain financial books neatly.",
    remedyHi: "बुधवार को गाय को हरा चारा खिलाएं, श्री गणेश जी को २१ दूर्वा दल अर्पित करें तथा अपनी वाणी में मधुरता व सत्यता रखें।"
  },
  Jupiter: {
    symbol: "♃", color: "#F59E0B",
    karakaEn: "Wisdom, Fortune (Bhagya), Children, Guru, Dharma, Expansion, Wealth",
    karakaHi: "ज्ञानकारक, भाग्य, संतान, गुरु, धर्म, समृद्धि व ईश्वरीय कृपा",
    deityEn: "Lord Brihaspati & Lord Dakshinamurthy", deityHi: "देवगुरु बृहस्पति एवं भगवान श्री हरि",
    gemstoneEn: "Yellow Sapphire (Pukhraj) or Topaz in Gold / Brass", gemstoneHi: "पीला पुखराज अथवा सुनहला (सोने या पीतल में)",
    mantra: "ॐ बृं बृहस्पतये नमः (Om Brim Brihaspataye Namah)",
    remedyEn: "Apply saffron/turmeric tilak on forehead; water Peepal or banana tree on Thursdays; donate yellow lentils (chana dal) and books.",
    remedyHi: "माथे पर केसर अथवा हल्दी का तिलक लगाएं, गुरुवार को केले के वृक्ष में जल दें तथा चने की दाल, बेसन के लड्डू व धार्मिक पुस्तकें दान करें।"
  },
  Venus: {
    symbol: "♀", color: "#F472B6",
    karakaEn: "Love, Beauty, Marital Bliss, Vehicles, Luxury, Refined Arts, Comfort",
    karakaHi: "प्रेम, सौंदर्य, दांपत्य सुख, वाहन, वैभव, संगीत, कला व ऐश्वर्य",
    deityEn: "Goddess Mahalakshmi & Lord Shukradeva", deityHi: "मां महालक्ष्मी एवं श्री शुक्राचार्य",
    gemstoneEn: "Diamond (Heera) or White Zircon in Platinum / Silver", gemstoneHi: "हीरा अथवा सफेद जरकन (चांदी या प्लैटिनम में)",
    mantra: "ॐ शुं शुक्राय नमः (Om Shum Shukraya Namah)",
    remedyEn: "Respect women; donate white sweets, rice, or curd on Fridays; chant Shri Suktam for abundance.",
    remedyHi: "महिलाओं का सदैव सम्मान करें, शुक्रवार को कन्याओं को खीर अथवा सफेद मिठाई खिलाएं तथा श्री सूक्त का पाठ करें।"
  },
  Saturn: {
    symbol: "♄", color: "#A78BFA",
    karakaEn: "Karma, Discipline, Longevity, Justice, Perseverance, Laborers, Realization",
    karakaHi: "कर्मकारक, न्याय, आयु, वैराग्य, अनुशासन, धैर्य व जनसेवा",
    deityEn: "Lord Shani Deva & Lord Shiva", deityHi: "कर्मफलदाता शनिदेव एवं भगवान महाकाल",
    gemstoneEn: "Blue Sapphire (Neelam) or Amethyst in Iron / Silver (Only after trial)", gemstoneHi: "नीलम अथवा जामुनिया (लोहे या चांदी में - परीक्षण उपरांत)",
    mantra: "ॐ शं शनैश्चराय नमः (Om Sham Shanaishcharaya Namah)",
    remedyEn: "Light mustard oil lamp under Peepal tree on Saturday evening; serve poor and handicapped laborers; maintain steadfast humility.",
    remedyHi: "शनिवार सायंकाल पीपल के नीचे सरसों के तेल का दीपक प्रज्वलित करें, निर्धनों व दिव्यांगों को भोजन कराएं तथा असहायों की सेवा करें।"
  },
  Rahu: {
    symbol: "☊", color: "#94A3B8",
    karakaEn: "Ambition, Foreign Lands, Modern Tech, Sudden Leaps, Maya, Unconventional Ideas",
    karakaHi: "महत्वाकांक्षा, विदेश, आधुनिक तकनीक, आकस्मिक परिवर्तन, माया व शोध",
    deityEn: "Goddess Durga & Lord Bhairava", deityHi: "मां भगवती दुर्गा एवं कालभैरव",
    gemstoneEn: "Hessonite (Gomed) in Silver / Ashtadhatu", gemstoneHi: "गोमेद (चांदी या अष्टधातु में)",
    mantra: "ॐ रां राहवे नमः (Om Ram Rahave Namah)",
    remedyEn: "Recite Durga Saptashati / Durga Chalisa; feed birds daily; keep electronic gadgets clean and avoid clutter at home.",
    remedyHi: "मां दुर्गा की आराधना करें, प्रतिदिन पक्षियों को बाजरा व सात प्रकार का अनाज खिलाएं तथा घर की छत व कोनों को स्वच्छ रखें।"
  },
  Ketu: {
    symbol: "☋", color: "#FB923C",
    karakaEn: "Moksha, Spiritual Liberation, Occult, Detachment, Intuitive Perception, Mastery",
    karakaHi: "मोक्षकारक, आध्यात्म, वैराग्य, परा-विद्या, अंतर्ज्ञान व सूक्ष्म दृष्टि",
    deityEn: "Lord Ganesha & Matsya Avatar", deityHi: "भगवान श्री गणेश एवं मत्स्य अवतार",
    gemstoneEn: "Cat's Eye (Lehsuniya) in Silver / Panchdhatu", gemstoneHi: "लहसुनिया (चांदी या पंचधातु में)",
    mantra: "ॐ कें केतवे नमः (Om Kem Ketave Namah)",
    remedyEn: "Feed stray black & white dogs; donate warm blankets to needy in winter; practice silent meditation.",
    remedyHi: "दो-रंगे (चितकबरे) कुत्तों को रोटी खिलाएं, सर्दियों में जरूरतमंदों को कंबल दान करें तथा नियमित मौन ध्यान का अभ्यास करें।"
  }
};

const DEFAULT_PLANET_ARCHETYPE = {
  symbol: "✨", color: "#FDE68A",
  karakaEn: "Universal Energy", karakaHi: "सार्वभौमिक ऊर्जा",
  deityEn: "Supreme Consciousness", deityHi: "परम ब्रह्म",
  gemstoneEn: "Vedic Yantra", gemstoneHi: "वैदिक यंत्र",
  mantra: "ॐ नमः शिवाय",
  remedyEn: "Perform regular charity and meditation.",
  remedyHi: "नियमित दान व ध्यान करें।"
};

function getHouseGovernanceEn(h) {
  const map = {
    1: "Body, constitution, character, physical vitality, self-confidence, and general life path.",
    2: "Wealth accumulation, financial reserves, family lineage, speech, and material sustenance.",
    3: "Courage, initiative, younger siblings, creative skills, communication, and short travels.",
    4: "Mother, inner contentment, ancestral land, real estate, vehicles, and peace of mind.",
    5: "Intellectual brilliance, creativity, speculative gains, higher education, and romantic pursuits.",
    6: "Overcoming competition, daily work ethics, health resilience, debts, and conflict resolution.",
    7: "Spouse personality, marital bliss, business partnerships, negotiations, and social rapport.",
    8: "Longevity, sudden transformations, occult wisdom, research, hidden resources, and spiritual depth.",
    9: "Higher fortune (Bhagya), wisdom, father, pilgrimages, divine grace, and ethical philosophy.",
    10: "Career apex, executive leadership, reputation, profession, societal impact, and public authority.",
    11: "Liquid financial gains, fulfillment of core ambitions, expansive networking, and income streams.",
    12: "Spiritual liberation (Moksha), foreign travels, expenditure management, meditation, and dreams."
  };
  return map[h] || "General Life Sphere";
}

function getHouseGovernanceHi(h) {
  const map = {
    1: "शारीरिक ऊर्जा, व्यक्तित्व, आत्मबल, आरोग्य और संपूर्ण जीवन की दिशा।",
    2: "धन संचय, पैतृक संपत्ति, वाणी का प्रभाव, पारिवारिक सुख और वित्तीय स्थिरता।",
    3: "साहस, पराक्रम, छोटे भाई-बहन, संचार कौशल, लेखन व छोटी यात्राएं।",
    4: "माता का स्नेह, गृह सुख, भूमि-भवन, वाहन सुख और आंतरिक मानसिक शांति।",
    5: "बौद्धिक प्रतिभा, पूर्व जन्म के पुण्य, रचनात्मकता, उच्च शिक्षा व प्रेम संबंध।",
    6: "प्रतिस्पर्धा पर विजय, कार्यकुशलता, स्वास्थ्य सजगता, ऋण मुक्ति व सेवा भाव।",
    7: "दांपत्य सुख, जीवनसाथी का स्वभाव, व्यापारिक साझेदारी व सामाजिक प्रतिष्ठा।",
    8: "आयु, गूढ़ विद्या, आकस्मिक धन लाभ, जीवन में परिवर्तन व आध्यात्मिक अनुसंधान।",
    9: "उच्च भाग्य (भाग्योदय), पिता का सहयोग, धर्म, गुरु कृपा व पुण्य कर्म।",
    10: "करियर, आजीविका, नेतृत्व क्षमता, प्रशासनिक पद, सामाजिक सम्मान व कर्मक्षेत्र।",
    11: "आय के स्रोत, मनोकामनाओं की पूर्ति, मित्रों का सहयोग व आर्थिक उन्नति।",
    12: "मोक्ष, विदेश यात्राएं, आध्यात्मिक चिंतन, दान-पुण्य व व्यय नियंत्रण।"
  };
  return map[h] || "जीवन का महत्वपूर्ण क्षेत्र";
}

function synthesizeCareerImpact(planet, house, status = "", isHi = false) {
  if (isHi) {
    if ([10, 1, 9, 11].includes(house)) {
      return `${planet} आपके करियर भाव से अत्यधिक शुभ संबंध बना रहा है। यह आपको कार्यक्षेत्र में नेतृत्व, स्वतंत्र निर्णय क्षमता, उच्च पद और प्रतिष्ठा दिलाने में सहायक है। आपकी मेहनत से समाज व संस्था में आपका प्रभाव निरंतर बढ़ेगा।`;
    }
    if ([2, 5, 7].includes(house)) {
      return `${planet} आपकी व्यावसायिक सूझबूझ, जनसंपर्क और वित्तीय प्रबंधन को मजबूती प्रदान करता है। स्वतंत्र व्यापार, परामर्श, शिक्षण अथवा साझेदारी में यह आपको अप्रत्याशित प्रगति दिलाएगा।`;
    }
    if ([3, 6].includes(house)) {
      return `${planet} आपको कठिन चुनौतियों व प्रतिस्पर्धी परीक्षाओं में विजय दिलाने का संकल्प देता है। तकनीकी, रक्षा, विधिक, चिकित्सा अथवा प्रबंधन के क्षेत्र में आपके प्रयास सदैव सार्थक परिणाम देंगे।`;
    }
    return `${planet} आपके कार्यक्षेत्र में गहन अनुसंधान, नवाचार और विदेश अथवा दूरस्थ संपर्कों से लाभ के नए मार्ग प्रशस्त करता है। धैर्य व अनुशासन से आप विशिष्ट कार्यक्षेत्र में महारत हासिल करेंगे।`;
  } else {
    if ([10, 1, 9, 11].includes(house)) {
      return `${planet} forms a stellar connection with your career axis, conferring executive authority, independent decision-making, and high societal reputation. Your focused efforts bring steady promotions and leadership roles.`;
    }
    if ([2, 5, 7].includes(house)) {
      return `${planet} enriches your commercial instincts, public relations, and financial management. Highly auspicious for entrepreneurship, advisory roles, education, and collaborative business ventures.`;
    }
    if ([3, 6].includes(house)) {
      return `${planet} bestows relentless stamina to triumph in competitive environments and demanding projects. Ideal for engineering, law, defense, medicine, or corporate management.`;
    }
    return `${planet} opens innovative avenues in research, specialized consultancy, and foreign or remote institutional connections. Steady patience yields undisputed mastery.`;
  }
}

function synthesizeEducationImpact(planet, house, isHi = false) {
  if (isHi) {
    if ([5, 4, 9, 1].includes(house)) {
      return `शिक्षा व ज्ञानार्जन में तीव्र एकाग्रता। यह स्थिति उच्च डिग्री, अनुसंधान, विश्लेषणात्मक विषयों और बौद्धिक प्रतियोगिताओं में उत्कृष्ट परिणाम प्रदान करती है।`;
    }
    if ([2, 3, 10].includes(house)) {
      return `व्यावहारिक ज्ञान, तार्किक सोच और संचार कौशल में निपुणता। सैद्धांतिक ज्ञान के साथ-साथ व्यावसायिक व तकनीकी कौशलों को शीघ्र आत्मसात करने की क्षमता।`;
    }
    return `गूढ़ व सूक्ष्म विषयों, शोध, दर्शन और बहु-विषयक अध्ययन में गहरी रुचि। जटिल समस्याओं के मूल तक पहुंचकर समाधान ढूंढने में सफल।`;
  } else {
    if ([5, 4, 9, 1].includes(house)) {
      return "Superb academic focus and conceptual clarity. Highly favorable for prestigious degrees, analytical research, scholarships, and intellectual distinction.";
    }
    if ([2, 3, 10].includes(house)) {
      return "Sharp practical intellect and articulate communication. Quickly assimilates technical, commercial, and professional skills with real-world application.";
    }
    return "Deep affinity for investigative sciences, philosophy, research, and interdisciplinary fields. Excels when diving into profound specialized knowledge.";
  }
}

function synthesizeLoveImpact(planet, house, isHi = false) {
  if (isHi) {
    if ([7, 5, 4, 1].includes(house)) {
      return `दांपत्य व प्रेम में परस्पर सम्मान, निष्ठा और आकर्षण। जीवनसाथी सुशिक्षित, संस्कारित व जीवन के हर मोड़ पर संबल बनने वाला सिद्ध होगा।`;
    }
    if ([2, 9, 11].includes(house)) {
      return `विवाह के उपरांत पारिवारिक सुख व भाग्य में निरंतर वृद्धि। जीवनसाथी के आगमन से घर में सौहार्द और आर्थिक समृद्धि का संचार होगा।`;
    }
    return `रिश्तों में परिपक्वता व स्पष्ट संवाद आवश्यक है। भावनात्मक समझ और परस्पर विश्वास से दांपत्य जीवन सुखी व दीर्घकालिक रहता है।`;
  } else {
    if ([7, 5, 4, 1].includes(house)) {
      return "Harmonious marital chemistry grounded in mutual loyalty and affection. Spouse brings culture, supportive guidance, and emotional stability.";
    }
    if ([2, 9, 11].includes(house)) {
      return "Marriage brings steady fortune and family prosperity. Your partner plays a positive role in domestic peace and joint wealth accumulation.";
    }
    return "Encourages mature patience and transparent communication in personal bonds. Mutual empathy fosters an enduring and deeply meaningful companionship.";
  }
}

function synthesizeWealthImpact(planet, house, isHi = false) {
  if (isHi) {
    if ([2, 11, 9, 5].includes(house)) {
      return `धन संचय और आय के निरंतर स्रोतों का शुभ योग। भूमि, संपत्ति, निवेश और अपनी प्रतिभा के बल पर आप दीर्घकालिक वित्तीय सुरक्षा अर्जित करेंगे।`;
    }
    if ([1, 4, 10].includes(house)) {
      return `अपनी कर्मठता व प्रतिष्ठा के माध्यम से उत्तम धन लाभ। वाहन, भवन व भौतिक सुख-साधनों की प्राप्ति निरंतर होती रहेगी।`;
    }
    return `योजनाबद्ध निवेश और वित्तीय अनुशासन से उत्तम लाभ। व्यय पर नियंत्रण और अप्रत्याशित वित्तीय अवसरों का लाभ उठाने में समर्थ।`;
  } else {
    if ([2, 11, 9, 5].includes(house)) {
      return "Strong wealth accumulation axis with multiple flowing income streams. Astute investments in real estate, equities, and professional expertise generate lasting financial security.";
    }
    if ([1, 4, 10].includes(house)) {
      return "Substantial wealth earned through personal credibility and professional status. Favors comfortable home ownership, premium vehicles, and tangible assets.";
    }
    return "Disciplined financial foresight yields steady prosperity. Strategic budgeting and calculated investments safeguard against sudden expenditures.";
  }
}

function synthesizeHealthImpact(planet, house, isHi = false) {
  if (isHi) {
    if ([1, 5, 9].includes(house)) {
      return `उत्कृष्ट रोग प्रतिरोधक क्षमता, शारीरिक स्फूर्ति और दृढ़ आत्मबल। नियमित दिनचर्या व प्राणायाम से आप दीर्घायु व निरोगी जीवन व्यतीत करेंगे।`;
    }
    if ([6, 8, 12].includes(house)) {
      return `खान-पान में सात्विकता और तनाव से बचाव आवश्यक है। नियमित योग, ध्यान और जल का पर्याप्त सेवन आपको सदैव ऊर्जावान रखेगा।`;
    }
    return `संतुलित शारीरिक ऊर्जा। कार्य और विश्राम के बीच सामंजस्य बनाए रखने से मानसिक व शारीरिक स्वास्थ्य उत्तम बना रहता है।`;
  } else {
    if ([1, 5, 9].includes(house)) {
      return "Robust immune resilience, high vitality, and strong physical recuperative power. Balanced diet and daily breathwork sustain enduring wellness.";
    }
    if ([6, 8, 12].includes(house)) {
      return "Benefits from conscious stress management and a wholesome lifestyle. Regular hydration, yoga, and mindful sleep rhythms maintain prime constitutional equilibrium.";
    }
    return "Balanced vitality. Maintaining equilibrium between intensive work commitments and mindful relaxation preserves physical stamina and mental serenity.";
  }
}
