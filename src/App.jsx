import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  generateVedicKundliData,
  calculateGunMilan,
  generateDailyHoroscope,
  calculateMarriagePrediction,
  calculateCareerPrediction,
  getLifeProblemRemedies,
  calculateDailyPanchang,
  getUpcomingShubhMuhurats,
  getUpcomingFestivalsAndVrats,
  getFestivalOrVratForDate,
  SHUBH_MUHURAT_CATEGORIES,
  MAJOR_INDIAN_CITIES,
  LIFE_PROBLEMS_LIST,
  SIGNS
} from "./jyotishEngine";
import { getCoordinates } from "./geocode";
import DeluxeLifeReportDossier from "./DeluxeLifeReportDossier";
import {
  getPlanetaryAvastha,
  detectPlanetaryConjunctions,
  getPlanetLifeImpactBreakdown,
  HOUSE_TITLES
} from "./planetaryAnalysisEngine";
import { Icons } from "./components/Icons";

const ZODIAC_SIGNS = [
  { name: "Aries", symbol: "♈", sanskrit: "Mesh", num: 1, element: "Fire" },
  { name: "Taurus", symbol: "♉", sanskrit: "Vrishabh", num: 2, element: "Earth" },
  { name: "Gemini", symbol: "♊", sanskrit: "Mithun", num: 3, element: "Air" },
  { name: "Cancer", symbol: "♋", sanskrit: "Kark", num: 4, element: "Water" },
  { name: "Leo", symbol: "♌", sanskrit: "Simha", num: 5, element: "Fire" },
  { name: "Virgo", symbol: "♍", sanskrit: "Kanya", num: 6, element: "Earth" },
  { name: "Libra", symbol: "♎", sanskrit: "Tula", num: 7, element: "Air" },
  { name: "Scorpio", symbol: "♏", sanskrit: "Vrishchik", num: 8, element: "Water" },
  { name: "Sagittarius", symbol: "♐", sanskrit: "Dhanu", num: 9, element: "Fire" },
  { name: "Capricorn", symbol: "♑", sanskrit: "Makar", num: 10, element: "Earth" },
  { name: "Aquarius", symbol: "♒", sanskrit: "Kumbh", num: 11, element: "Air" },
  { name: "Pisces", symbol: "♓", sanskrit: "Meen", num: 12, element: "Water" },
];

const PLANETS = [
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

const PERSONAL_TABS = [
  { id: "chart", icon: "🔯", iconName: "Chart", labelEn: "Chart & Shodashvarga", labelHi: "लग्न व वर्ग कुंडलियां" },
  { id: "overview", icon: "🌟", iconName: "Overview", labelEn: "Overview & Panchang", labelHi: "सिंहावलोकन व पंचांग" },
  { id: "planets", icon: "🪐", iconName: "Planet", labelEn: "Planets", labelHi: "ग्रह स्थिति" },
  { id: "houses", icon: "🏠", iconName: "House", labelEn: "Houses", labelHi: "भाव विश्लेषण" },
  { id: "doshas", icon: "⚡", iconName: "Shield", labelEn: "Doshas & Yogas", labelHi: "दोष व योग निदान" },
  { id: "shadbala", icon: "⚖️", iconName: "Scale", labelEn: "Shadbala & SAV", labelHi: "षड्बल व अष्टकवर्ग" },
  { id: "life", icon: "🌿", iconName: "Sparkle", labelEn: "Life Areas", labelHi: "जीवन क्षेत्र" },
  { id: "careerTiming", icon: "💼", iconName: "Briefcase", labelEn: "Career & Job", labelHi: "करियर व नौकरी" },
  { id: "marriageTiming", icon: "💍", iconName: "Heart", labelEn: "Marriage & Spouse", labelHi: "विवाह व जीवनसाथी" },
  { id: "predictions", icon: "🔮", iconName: "Hourglass", labelEn: "Dasha & Transits", labelHi: "दशा व गोचर" },
  { id: "lifeProblems", icon: "🛡️", iconName: "Shield", labelEn: "Problem Solver & Remedies", labelHi: "समस्या निवारण" },
  { id: "store", icon: "💎", iconName: "Gem", labelEn: "Gemstones & Remedies", labelHi: "रत्न व उपाय" },
  { id: "matchmaking", icon: "❤️", iconName: "Heart", labelEn: "Kundli Milan", labelHi: "गुण मिलान" },
];

const GENERIC_TABS = [
  { id: "panchang", icon: "🕉️", iconName: "Moon", labelEn: "Hindu Panchang", labelHi: "दैनिक पंचांग" },
  { id: "muhurat", icon: "⏳", iconName: "Clock", labelEn: "Shubh Muhurat", labelHi: "शुभ मुहूर्त" },
  { id: "festivals", icon: "🪔", iconName: "Flame", labelEn: "Festivals & Vrat", labelHi: "व्रत व त्यौहार" },
  { id: "daily", icon: "☀️", iconName: "Sun", labelEn: "Daily Horoscope", labelHi: "दैनिक राशिफल" },
  { id: "forecast", icon: "📅", iconName: "Calendar", labelEn: "2026–2027 Forecast", labelHi: "वार्षिक राशिफल" },
  { id: "consult", icon: "🧙‍♂️", iconName: "BookOpen", labelEn: "Talk to Astrologer", labelHi: "ज्योतिषी परामर्श" },
];

const TABS = [...PERSONAL_TABS, ...GENERIC_TABS];

const UI = {
  en: {
    title: "JYOTISH PARAMARSH",
    subtitle: "VEDIC BIRTH CHART & COSMIC LIFE READING",
    tagline: '"As above, so below — the stars illuminate the path of your soul"',
    formTitle: "Enter Your Birth Details",
    formSub: "Accurate planetary calculations according to traditional Parashari Vedic Astrology",
    fName: "Full Name", fDob: "Date of Birth", fTob: "Time of Birth", fPob: "Place of Birth",
    fTobHelp: "(12:00 PM if unsure)",
    phName: "Enter your full name", phPob: "Enter birth city, state / country",
    btnGo: "Reveal My Kundli ✦", btnWait: "Consulting the Stars...",
    errFields: "Please fill in your Name, Date of Birth, and Place of Birth.",
    errPartnerFields: "Please enter partner name and date of birth.",
    errApi: "Unable to generate Kundli. Please verify your details and try again.",
    s1: "Calculating exact planetary coordinates & Lagna...",
    s2: "Synthesizing 12 Bhavas, Yogas, Dashas & Life Predictions...",
    chartTitle: "Natal Birth Chart (Lagna Kundli)",
    chartSub: "House 1 at top · Signs and planetary placements in natal houses",
    chartStyleNorth: "North Indian (Diamond)",
    chartStyleSouth: "South Indian (Square)",
    ptTitle: "Planetary Positions & Dignities",
    htTitle: "12 Bhavas (Houses) Comprehensive Breakdown",
    sec: {
      blueprint: "Cosmic Blueprint & Soul Archetype",
      yogas: "Auspicious Yogas & Astrological Formations",
      verdict: "The Stars' Final Verdict",
      pa: "Planetary Synthesis",
      ha: "Bhava (House) Dynamics",
      dasha: "Vimshottari Mahadasha Timeline",
      health: "Health, Vitality & Well-being",
      wealth: "Wealth, Finances & Prosperity",
      education: "Education, Intellect & Learning",
      career: "Career, Ambition & Societal Status",
      marriage: "Marriage, Relationships & Partnerships",
      pred: "Life Predictions — Decade by Decade",
      colours: "Lucky Colours", numbers: "Lucky Numbers", days: "Auspicious Days",
      rudraksha: "Prescribed Rudraksha", gems: "Gemstones & Astrological Remedies",
      longevity: "Longevity & Life Vitality (Deerghayu)"
    },
    pills: { lagna: "Ascendant (Lagna)", rashi: "Moon Sign (Rashi)", nakshatra: "Nakshatra", tithi: "Tithi", yoga: "Yoga" },
    pcols: ["Planet", "Sign", "House", "Degree & Nakshatra", "Dignity", "Astrological Effect"],
    hnames: ["Self & Vitality", "Wealth & Lineage", "Courage & Siblings", "Home & Happiness", "Intellect & Karma", "Health & Service", "Marriage & Partners", "Longevity & Transformation", "Fortune & Dharma", "Career & Status", "Gains & Aspirations", "Moksha & Expenses"],
    nopl: "No planets residing",
    langBtn: "हिंदी में देखें",
    printBtn: "Save Complete Kundli as PDF",
    editBtn: "Edit Details",
    footer1: "✦ OM TAT SAT ✦",
    footer2: "Authentic Parashari Vedic Astrology Engine · Client Computation",
    partnerName: "Partner Name",
    partnerDob: "Date of Birth",
    partnerTob: "Time of Birth",
    partnerTobHelp: "(12:00 PM if unsure)",
    partnerFormTitle: "Enter Partner's Details:",
    calculateMatchBtn: "Calculate Gun Milan Compatibility ✦",
    currencyLabel: "Select Currency",
    deliveryTimeLabel: "Preferred Delivery Time",
    checkoutEmailLabel: "Your Email Address (For PDF Report & Receipt) *",
    checkoutEmailHelp: "Your unlocked high-resolution report and invoice will be sent here.",
    checkoutTxIdLabel: "PayPal Transaction ID / Order Ref (Optional)",
    checkoutTxIdHelp: "Found in your PayPal confirmation email or activity receipt.",
    checkoutPhoneLabel: "Phone Number (Optional)",
    checkoutPhoneHelp: "Optional for order reference and dispatch notification.",
    cardNumberLabel: "Card Number",
    cardExpiryLabel: "Card Expiry (MM/YY)",
    cardCvvLabel: "Security Code (CVV)",
    quickDailyPrompt: "Or check Today's Daily Vedic Horoscope & Email Alerts:",
    quickDailyBtn: "Daily Horoscope",
  },
  hi: {
    title: "ज्योतिष परामर्श",
    subtitle: "वैदिक जन्म कुंडली एवं ब्रह्मांडीय जीवन विश्लेषण",
    tagline: '"जैसा ऊपर, वैसा नीचे — नक्षत्र आपकी आत्मा के दिव्य मार्ग को प्रकाशित करते हैं"',
    formTitle: "अपना जन्म विवरण दर्ज करें",
    formSub: "पराशरी वैदिक ज्योतिष के प्रामाणिक सिद्धांतों पर आधारित सटीक गणना",
    fName: "पूरा नाम", fDob: "जन्म तिथि", fTob: "जन्म समय", fPob: "जन्म स्थान",
    fTobHelp: "(यदि निश्चित न हो तो दोपहर 12:00 रहने दें)",
    phName: "अपना पूरा नाम दर्ज करें", phPob: "जन्म का शहर, राज्य / देश दर्ज करें",
    btnGo: "मेरी कुंडली प्रकट करें ✦", btnWait: "ग्रहों से परामर्श जारी है...",
    errFields: "कृपया अपना पूरा नाम, जन्म तिथि और जन्म स्थान भरें।",
    errPartnerFields: "कृपया जीवनसाथी का नाम और जन्म तिथि दर्ज करें।",
    errApi: "कुंडली गणना में त्रुटि हुई। कृपया विवरण पुनः जांचें।",
    s1: "ग्रह स्थितियों एवं लग्न की सटीक खगोलीय गणना...",
    s2: "१२ भावों, योगों, विंशोत्तरी दशा और जीवन फल का विश्लेषण...",
    chartTitle: "लग्न कुंडली चक्र (Lagna Kundli)",
    chartSub: "भाव १ शीर्ष पर · राशि संख्या एवं ग्रहों की जन्मकालीन स्थिति",
    chartStyleNorth: "उत्तर भारतीय (डायमंड)",
    chartStyleSouth: "दक्षिण भारतीय (स्क्वायर)",
    ptTitle: "ग्रह स्थिति एवं बल तालिका",
    htTitle: "सभी १२ भावों का विस्तृत विश्लेषण",
    sec: {
      blueprint: "ब्रह्मांडीय प्रारूप एवं मूल स्वभाव",
      yogas: "शुभ ग्रह योग एवं प्रभाव",
      verdict: "तारों का अंतिम संदेश",
      pa: "ग्रह विश्लेषण",
      ha: "भाव विश्लेषण",
      dasha: "विंशोत्तरी महादशा कालचक्र",
      health: "स्वास्थ्य, स्फूर्ति एवं ऊर्जा",
      wealth: "धन संचय, वित्त एवं समृद्धि",
      education: "विद्या, बुद्धि एवं ज्ञान",
      career: "करियर, आजीविका एवं सामाजिक प्रतिष्ठा",
      marriage: "विवाह, दांपत्य एवं साझेदारी",
      pred: "जीवन भविष्यवाणी — दशक दर दशक",
      colours: "शुभ रंग", numbers: "भाग्यशाली अंक", days: "शुभ दिन",
      rudraksha: "कल्याणकारी रुद्राक्ष", gems: "रत्न एवं वैदिक उपाय",
      longevity: "आयु एवं जीवन शक्ति (दीर्घायु)"
    },
    pills: { lagna: "लग्न", rashi: "चंद्र राशि", nakshatra: "नक्षत्र", tithi: "तिथि", yoga: "योग" },
    pcols: ["ग्रह", "राशि", "भाव", "अंश व नक्षत्र", "स्थिति / बल", "प्रभाव"],
    hnames: ["स्वयं एवं व्यक्तित्व", "धन एवं कुटुंब", "पराक्रम व बंधु", "गृह-माता सुख", "बुद्धि व संतान", "स्वास्थ्य व प्रतिस्पर्धा", "दांपत्य व साझेदारी", "आयु व परिवर्तन", "भाग्य व धर्म", "करियर व प्रतिष्ठा", "लाभ व आय", "मोक्ष व व्यय"],
    nopl: "कोई ग्रह नहीं",
    langBtn: "View in English",
    printBtn: "सम्पूर्ण कुंडली PDF सहेजें",
    editBtn: "विवरण बदलें",
    footer1: "✦ ॐ तत् सत् ✦",
    footer2: "प्रामाणिक वैदिक ज्योतिष गणना प्रणाली · सुरक्षित एवं पूर्णतः गोपनीय",
    partnerName: "जीवनसाथी (Partner) का पूरा नाम",
    partnerDob: "जन्म तिथि",
    partnerTob: "जन्म समय",
    partnerTobHelp: "(यदि निश्चित न हो तो दोपहर 12:00 रहने दें)",
    partnerFormTitle: "द्वितीय जातक (Partner) का विवरण दर्ज करें:",
    calculateMatchBtn: "गुण मिलान गणना करें ✦",
    currencyLabel: "मुद्रा चुनें (Select Currency)",
    deliveryTimeLabel: "प्राप्ति समय (Delivery Time)",
    checkoutEmailLabel: "आपका ईमेल पता (PDF रिपोर्ट व रसीद हेतु) *",
    checkoutEmailHelp: "अनलॉक की गई विस्तृत PDF रिपोर्ट एवं रसीद इस ईमेल पर भेजी जाएगी।",
    checkoutTxIdLabel: "PayPal Transaction ID / ऑर्डर संदर्भ (वैकल्पिक)",
    checkoutTxIdHelp: "पेपैल रसीद / ईमेल में दी गई ट्रांजैक्शन आईडी दर्ज करें।",
    checkoutPhoneLabel: "फोन / मोबाइल नंबर (वैकल्पिक)",
    checkoutPhoneHelp: "तुरंत ऑर्डर संदर्भ व सूचना हेतु (वैकल्पिक)।",
    cardNumberLabel: "कार्ड नंबर (Card Number)",
    cardExpiryLabel: "समाप्ति तिथि (MM/YY)",
    cardCvvLabel: "सुरक्षा कोड (CVV)",
    quickDailyPrompt: "या आज का दैनिक राशिफल व ईमेल अलर्ट्स देखें:",
    quickDailyBtn: "दैनिक राशिफल (Daily Horoscope)",
  }
};

const VEDIC_FAQS = [
  {
    qEn: "Why is the exact time of birth critical in Vedic Astrology?",
    qHi: "वैदिक ज्योतिष में जन्म का सटीक समय इतना महत्वपूर्ण क्यों है?",
    aEn: "In Vedic (Sidereal) astrology, the Ascendant (Lagna) changes sign approximately every 2 hours, and the Moon moves about 1 degree every two hours. Exact birth time determines the precise rising degree, the arrangement of the 12 houses (Bhavas), and micro-divisional charts (like the D9 Navamsha and D60 Shashtiamsha) which govern career, marriage, and past-life karma.",
    aHi: "वैदिक ज्योतिष में लग्न (Ascendant) औसतन प्रत्येक २ घंटे में बदलता है और चंद्रमा तीव्र गति से राशि चक्र में भ्रमण करता है। सटीक जन्म समय से ही लग्न अंश, द्वादश भावों की संधि एवं सूक्ष्म वर्ग कुंडलियों (जैसे डी-९ नवांश और डी-६० षष्ट्यंश) का सटीक निर्धारण होता है।"
  },
  {
    qEn: "How is Vedic Astrology different from Western Sun Sign astrology?",
    qHi: "वैदिक ज्योतिष पाश्चात्य (Western) ज्योतिष से किस प्रकार भिन्न है?",
    aEn: "Western astrology uses the Tropical zodiac (fixed to seasonal equinoxes), which has drifted by approximately 24 degrees from actual visible constellations. Vedic astrology utilizes the Sidereal (Nirayana) zodiac with exact Chitra Paksha Lahiri Ayanamsha, reflecting the true astronomical positions of visible stars in the cosmos.",
    aHi: "पाश्चात्य ज्योतिष ऋतु-आधारित (Tropical) प्रणाली पर काम करता है जो वास्तविक तारों से लगभग २४ अंश पीछे है। इसके विपरीत, वैदिक ज्योतिष 'निरयण' (Sidereal) खगोलीय पद्धति और चित्रा पक्ष (लाहिड़ी) अयनांश का उपयोग करता है जो आकाश में ग्रहों की वास्तविक स्थिति को दर्शाता है।"
  },
  {
    qEn: "Why are the 50-Page Dossier and calculations 100% free on this platform?",
    qHi: "इस प्लेटफॉर्म पर 50-पृष्ठ महा-कुंडली और समस्त गणनाएं निःशुल्क क्यों हैं?",
    aEn: "Jyotish Paramarsh was founded on the sacred principle of Seva (selfless service) and preserving authentic Vedic heritage. We believe everyone deserves pure, unadulterated astrological clarity without paywalls. Seekers who find deep value can voluntarily offer 'Shraddha Dakshina' to help maintain high-performance astronomical servers.",
    aHi: "ज्योतिष परामर्श की स्थापना सनातन धर्म के सेवा भाव और शुद्ध वैदिक ज्ञान के प्रचार हेतु की गई है। हमारा मानना है कि जीवन मार्गदर्शन पर सबका अधिकार है। इच्छुक जातक सर्वर खर्च व अनुसंधान सहयोग हेतु स्वेच्छानुसार 'श्रद्धा दक्षिणा' अर्पित कर सकते हैं।"
  },
  {
    qEn: "How are Lucky Gemstones and Astrological Remedies prescribed?",
    qHi: "शुभ रत्न एवं ज्योतिषीय उपाय किस आधार पर निर्धारित किए जाते हैं?",
    aEn: "Remedies in Brihat Parashara Hora Shastra are prescribed strictly based on your functional benefic planets (Karaka Grahas) for your specific Lagna, ensuring no malefic planet is accidentally energized. We recommend certified natural unheated gemstones and consecrated Rudraksha for spiritual and psychological harmony.",
    aHi: "बृहत्पाराशर होराशास्त्र के अनुसार, उपाय केवल आपकी कुंडली के 'योगकारक' व शुभ ग्रहों को बल देने हेतु निर्धारित किए जाते हैं। मारक अथवा अकारक ग्रहों का रत्न कभी नहीं पहनाया जाता। हम केवल शुद्ध, प्राकृतिक रत्न व सिद्ध रुद्राक्ष की संस्तुति करते हैं।"
  },
  {
    qEn: "Is my personal birth data kept safe and confidential?",
    qHi: "क्या मेरा व्यक्तिगत जन्म विवरण सुरक्षित और पूर्णतः गोपनीय है?",
    aEn: "Absolutely. All chart mathematics and dasha computations are executed securely within your browser session using high-precision client algorithms. We do not sell, harvest, or monetize your personal birth information with third-party advertisers.",
    aHi: "पूर्णतः सुरक्षित। समस्त खगोलीय गणनाएं आपके ब्राउज़र में सुरक्षित एल्गोरिदम द्वारा की जाती हैं। हम आपका व्यक्तिगत विवरण कभी भी किसी तीसरे पक्ष या विज्ञापनदाता के साथ साझा नहीं करते।"
  }
];

const SEEKER_TESTIMONIALS = [
  {
    name: "Dr. Vikramaditya M.",
    roleEn: "Senior Surgeon",
    roleHi: "वरिष्ठ चिकित्सक",
    location: "Bengaluru, India",
    stars: 5,
    quoteEn: "The accuracy of the Vimshottari Dasha timeline is astonishing. It pinpointed my relocation and surgical fellowship abroad down to the exact month. The 50-page dossier is more thorough than paid consultations I have taken in the past.",
    quoteHi: "विंशोत्तरी दशा चक्र की सटीकता विस्मयकारी है। इसने मेरे विदेश में फेलोशिप और स्थानांतरण का सटीक महीना पहले ही बता दिया था। 50-पृष्ठ की महा-रिपोर्ट किसी भी सशुल्क परामर्श से कहीं अधिक विस्तृत और प्रामाणिक है।"
  },
  {
    name: "Priyanka & Arjun K.",
    roleEn: "Software Architects",
    roleHi: "सॉफ्टवेयर इंजीनियर",
    location: "London, UK",
    stars: 5,
    quoteEn: "We used the Ashtakoot Gun Milan before our wedding. What we appreciated most was the nuanced explanation of Nadi and Bhakoot doshas without fear-mongering, and the clear Vedic remedies provided. Highly recommended!",
    quoteHi: "हमने अपने विवाह पूर्व अष्टकूट गुण मिलान का उपयोग किया। सबसे प्रशंसनीय बात यह थी कि नाड़ी और भकूट दोष को बिना किसी भय के वैज्ञानिक रूप से समझाया गया और सरल उपाय बताए गए।"
  },
  {
    name: "Rajeshwar Sengupta",
    roleEn: "Financial Consultant",
    roleHi: "वित्तीय सलाहकार",
    location: "Kolkata, India",
    stars: 5,
    quoteEn: "Finding a platform that calculates 16 Shodashvarga divisional charts and Sripati Bhava cusps with arc-second precision for free is rare. The Shani Sade Sati and annual transit analysis gave me immense mental peace.",
    quoteHi: "१६ षोडशवर्ग कुंडलियां और भाव चलित संधि को खगोलीय सटीकता के साथ निःशुल्क उपलब्ध कराने वाला ऐसा प्रामाणिक मंच दुर्लभ है। शनि साढ़ेसाती और गोचर विश्लेषण से मुझे अत्यधिक मानसिक संबल मिला।"
  }
];

// ── NORTH INDIAN KUNDLI CHART ─────────────────────────────────────
// Helper to extract formatted degree for a planet inside chart
const getPlanetDegree = (pName, houseData, planetData) => {
  if (houseData?.planetDetails) {
    const detail = houseData.planetDetails.find(d => d.name === pName);
    if (detail?.degree) return detail.degree;
  }
  const p = planetData?.[pName];
  if (p) {
    if (p.formattedDegree) return p.formattedDegree;
    if (p.degree) {
      const num = parseFloat(p.degree);
      if (!isNaN(num)) {
        const degInt = Math.floor(num);
        const mins = Math.floor((num - degInt) * 60);
        return mins > 0 ? `${degInt}°${mins < 10 ? "0" : ""}${mins}'` : `${degInt}°`;
      }
      return p.degree;
    }
  }
  return "";
};

// ── NORTH INDIAN KUNDLI CHART ─────────────────────────────────────
const NorthIndianChart = ({ houses, planetData, lang, hoveredHouse, setHoveredHouse }) => {
  const SIZE = 520;
  const PAD = 20;
  const W = SIZE - 2 * PAD;
  const xc = SIZE / 2;
  const yc = SIZE / 2;
  const x0 = PAD;
  const y0 = PAD;
  const x1 = SIZE - PAD;
  const y1 = SIZE - PAD;

  const getSignNum = (signName) => {
    const found = ZODIAC_SIGNS.find(z => z.name === signName || z.sanskrit === signName);
    return found ? found.num : "";
  };

  const houseLayout = [
    { n: 1,  cx: xc,            cy: y0 + W * 0.22, isLagna: true, path: `${xc},${y0} ${x1 - W*0.25},${y0 + W*0.25} ${xc},${yc} ${x0 + W*0.25},${y0 + W*0.25}` },
    { n: 2,  cx: x0 + W * 0.24, cy: y0 + W * 0.12, path: `${x0},${y0} ${xc},${y0} ${x0 + W*0.25},${y0 + W*0.25}` },
    { n: 3,  cx: x0 + W * 0.12, cy: y0 + W * 0.24, path: `${x0},${y0} ${x0},${yc} ${x0 + W*0.25},${y0 + W*0.25}` },
    { n: 4,  cx: x0 + W * 0.22, cy: yc,            path: `${x0},${yc} ${x0 + W*0.25},${y0 + W*0.25} ${xc},${yc} ${x0 + W*0.25},${y1 - W*0.25}` },
    { n: 5,  cx: x0 + W * 0.12, cy: y1 - W * 0.24, path: `${x0},${y1} ${x0},${yc} ${x0 + W*0.25},${y1 - W*0.25}` },
    { n: 6,  cx: x0 + W * 0.24, cy: y1 - W * 0.12, path: `${x0},${y1} ${xc},${y1} ${x0 + W*0.25},${y1 - W*0.25}` },
    { n: 7,  cx: xc,            cy: y1 - W * 0.22, path: `${xc},${y1} ${x0 + W*0.25},${y1 - W*0.25} ${xc},${yc} ${x1 - W*0.25},${y1 - W*0.25}` },
    { n: 8,  cx: x1 - W * 0.24, cy: y1 - W * 0.12, path: `${x1},${y1} ${xc},${y1} ${x1 - W*0.25},${y1 - W*0.25}` },
    { n: 9,  cx: x1 - W * 0.12, cy: y1 - W * 0.24, path: `${x1},${y1} ${x1},${yc} ${x1 - W*0.25},${y1 - W*0.25}` },
    { n: 10, cx: x1 - W * 0.22, cy: yc,            path: `${x1},${yc} ${x1 - W*0.25},${y0 + W*0.25} ${xc},${yc} ${x1 - W*0.25},${y1 - W*0.25}` },
    { n: 11, cx: x1 - W * 0.12, cy: y0 + W * 0.24, path: `${x1},${y0} ${x1},${yc} ${x1 - W*0.25},${y0 + W*0.25}` },
    { n: 12, cx: x1 - W * 0.24, cy: y0 + W * 0.12, path: `${x1},${y0} ${xc},${y0} ${x1 - W*0.25},${y0 + W*0.25}` },
  ];

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="kundli-svg" style={{ width: "100%", maxWidth: 500, height: "auto" }}>
      <defs>
        <radialGradient id="kundliGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2A1B4E" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0D0A1C" stopOpacity="0.98" />
        </radialGradient>
      </defs>

      <rect width={SIZE} height={SIZE} fill="url(#kundliGlow)" rx="16" stroke="rgba(212,175,55,0.35)" strokeWidth="1.5" />

      {houseLayout.map(({ n, path }) => (
        <polygon
          key={`poly-${n}`}
          points={path}
          fill={hoveredHouse === n ? "rgba(245, 158, 11, 0.28)" : "transparent"}
          stroke={hoveredHouse === n ? "#FBBF24" : "rgba(212,175,55,0.25)"}
          strokeWidth={hoveredHouse === n ? "2.5" : "0.6"}
          style={{ cursor: "pointer", transition: "all 0.2s ease", filter: hoveredHouse === n ? "drop-shadow(0 0 6px rgba(245, 158, 11, 0.6))" : "none" }}
          onMouseEnter={() => setHoveredHouse && setHoveredHouse(n)}
          onMouseLeave={() => setHoveredHouse && setHoveredHouse(null)}
          onClick={() => setHoveredHouse && setHoveredHouse(hoveredHouse === n ? null : n)}
        />
      ))}

      <rect x={x0} y={y0} width={W} height={W} fill="none" stroke="rgba(212,175,55,0.7)" strokeWidth="2" />
      <line x1={x0} y1={y0} x2={x1} y2={y1} stroke="rgba(212,175,55,0.6)" strokeWidth="1.6" />
      <line x1={x1} y1={y0} x2={x0} y2={y1} stroke="rgba(212,175,55,0.6)" strokeWidth="1.6" />
      <polygon points={`${xc},${y0} ${x1},${yc} ${xc},${y1} ${x0},${yc}`} fill="none" stroke="rgba(212,175,55,0.65)" strokeWidth="1.6" />

      <circle cx={xc} cy={yc} r={hoveredHouse ? "34" : "32"} fill="rgba(15,10,30,0.9)" stroke={hoveredHouse ? "#F59E0B" : "rgba(212,175,55,0.4)"} strokeWidth={hoveredHouse ? "1.8" : "1"} style={{ transition: "all 0.2s ease" }} />
      <text x={xc} y={yc - 6} textAnchor="middle" fill="#F3D37A" fontSize="11" letterSpacing="1.5" fontWeight="700" opacity="0.9">
        {hoveredHouse ? `H${hoveredHouse}` : "LAGNA"}
      </text>
      <text x={xc} y={yc + 14} textAnchor="middle" fill="#F3D37A" fontSize="20" fontFamily="serif">ॐ</text>

      {houseLayout.map(({ n, cx, cy, isLagna }) => {
        const houseData = houses?.[n] || {};
        const signNum = getSignNum(houseData.sign);
        const planetsInHouse = houseData.planets || [];
        const totalPlanets = planetsInHouse.length;

        return (
          <g key={n} style={{ pointerEvents: "none" }}>
            {isLagna && (() => {
              const hasAscDeg = !!houses?.[1]?.ascDegree;
              const badgeW = hasAscDeg ? (lang === "hi" ? 104 : 110) : (lang === "hi" ? 64 : 70);
              return (
                <g>
                  <rect
                    x={cx - badgeW / 2}
                    y={cy - 41}
                    width={badgeW}
                    height="20"
                    rx="5"
                    fill="rgba(245,158,11,0.28)"
                    stroke="#F59E0B"
                    strokeWidth="1"
                  />
                  <text
                    x={cx}
                    y={cy - 27}
                    textAnchor="middle"
                    fill="#FDE68A"
                    fontSize="10.5"
                    fontWeight="800"
                    letterSpacing="0.4"
                  >
                    {lang === "hi" ? "लग्न १" : "LAGNA 1"}{hasAscDeg ? ` ${houses[1].ascDegree}` : ""}
                  </text>
                </g>
              );
            })()}

            <text x={cx} y={isLagna ? cy - 6 : cy - 12} textAnchor="middle" fill="#F3D37A" fontSize="15" fontWeight="800" fontFamily="'Outfit', sans-serif">
              {signNum}
            </text>

            {planetsInHouse.map((pName, idx) => {
              const pObj = PLANETS.find(x => x.name === pName) || { symbol: pName.slice(0, 2), color: "#D4AF37" };
              const degStr = getPlanetDegree(pName, houseData, planetData);
              const yBase = isLagna 
                ? (totalPlanets <= 2 ? cy + 12 : cy + 6)
                : (totalPlanets <= 2 ? cy + 6 : cy + 1);
              const yOffset = yBase + idx * 16;

              return (
                <text key={idx} x={cx} y={yOffset} textAnchor="middle" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.85))" }}>
                  <tspan fill={pObj.color} fontSize="13" fontWeight="800" letterSpacing="0.4">
                    {pObj.symbol}
                  </tspan>
                  {degStr && (
                    <tspan fill="#FDE68A" fontSize="10.5" fontWeight="600" opacity="0.95">
                      {" " + degStr}
                    </tspan>
                  )}
                </text>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
};

// ── SOUTH INDIAN KUNDLI CHART ─────────────────────────────────────
const SouthIndianChart = ({ houses, planetData, lang, hoveredHouse, setHoveredHouse }) => {
  const SIZE = 520;
  const PAD = 20;
  const W = (SIZE - 2 * PAD) / 4;
  const x0 = PAD;
  const y0 = PAD;

  const rashiGrid = [
    { signNum: 12, col: 0, row: 0, signName: "Pisces", signHi: "मीन" },
    { signNum: 1,  col: 1, row: 0, signName: "Aries", signHi: "मेष" },
    { signNum: 2,  col: 2, row: 0, signName: "Taurus", signHi: "वृषभ" },
    { signNum: 3,  col: 3, row: 0, signName: "Gemini", signHi: "मिथुन" },
    { signNum: 4,  col: 3, row: 1, signName: "Cancer", signHi: "कर्क" },
    { signNum: 5,  col: 3, row: 2, signName: "Leo", signHi: "सिंह" },
    { signNum: 6,  col: 3, row: 3, signName: "Virgo", signHi: "कन्या" },
    { signNum: 7,  col: 2, row: 3, signName: "Libra", signHi: "तुला" },
    { signNum: 8,  col: 1, row: 3, signName: "Scorpio", signHi: "वृश्चिक" },
    { signNum: 9,  col: 0, row: 3, signName: "Sagittarius", signHi: "धनु" },
    { signNum: 10, col: 0, row: 2, signName: "Capricorn", signHi: "मकर" },
    { signNum: 11, col: 0, row: 1, signName: "Aquarius", signHi: "कुंभ" },
  ];

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="kundli-svg" style={{ width: "100%", maxWidth: 500, height: "auto" }}>
      <rect width={SIZE} height={SIZE} fill="#0D0A1C" rx="16" stroke="rgba(212,175,55,0.35)" strokeWidth="1.5" />

      <rect x={x0 + W} y={y0 + W} width={W * 2} height={W * 2} fill="rgba(20,15,40,0.6)" stroke="rgba(212,175,55,0.4)" strokeWidth="1.5" rx="8" />
      <text x={SIZE / 2} y={SIZE / 2 - 8} textAnchor="middle" fill="#F3D37A" fontSize="12" letterSpacing="2" fontWeight="600">SOUTH INDIAN CHART</text>
      <text x={SIZE / 2} y={SIZE / 2 + 18} textAnchor="middle" fill="#F3D37A" fontSize="24">ॐ</text>

      {rashiGrid.map((box) => {
        const bx = x0 + box.col * W;
        const by = y0 + box.row * W;

        let houseNum = null;
        let isLagna = false;
        let planetsInBox = [];
        let houseData = null;

        for (let h = 1; h <= 12; h++) {
          if (houses?.[h]?.sign === box.signName) {
            houseNum = h;
            houseData = houses[h];
            if (h === 1) isLagna = true;
            planetsInBox = houses[h].planets || [];
            break;
          }
        }

        return (
          <g
            key={box.signNum}
            onMouseEnter={() => houseNum && setHoveredHouse && setHoveredHouse(houseNum)}
            onMouseLeave={() => setHoveredHouse && setHoveredHouse(null)}
            onClick={() => houseNum && setHoveredHouse && setHoveredHouse(hoveredHouse === houseNum ? null : houseNum)}
          >
            <rect
              x={bx}
              y={by}
              width={W}
              height={W}
              fill={hoveredHouse === houseNum ? "rgba(245, 158, 11, 0.28)" : "rgba(15,10,32,0.85)"}
              stroke={hoveredHouse === houseNum ? "#FBBF24" : "rgba(212,175,55,0.5)"}
              strokeWidth={hoveredHouse === houseNum ? "2.5" : "1.2"}
              style={{ cursor: "pointer", transition: "all 0.2s ease", filter: hoveredHouse === houseNum ? "drop-shadow(0 0 6px rgba(245, 158, 11, 0.6))" : "none" }}
            />

            <text x={bx + 8} y={by + 16} fill="rgba(212,175,55,0.7)" fontSize="10" fontWeight="600">
              {lang === "hi" ? box.signHi : box.signName}
            </text>

            {isLagna && (() => {
              const hasAscDeg = !!houses?.[1]?.ascDegree;
              const badgeW = hasAscDeg ? 56 : 38;
              const badgeX = bx + W - badgeW - 5;
              return (
                <g>
                  <line x1={bx} y1={by} x2={bx + W} y2={by + W} stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                  <rect x={badgeX} y={by + 5} width={badgeW} height="15" rx="3" fill="rgba(245,158,11,0.25)" stroke="#F59E0B" strokeWidth="0.8" />
                  <text x={badgeX + badgeW / 2} y={by + 15.5} textAnchor="middle" fill="#FDE68A" fontSize="7.5" fontWeight="700" letterSpacing="0.2">
                    ASC{hasAscDeg ? ` ${houses[1].ascDegree}` : ""}
                  </text>
                </g>
              );
            })()}

            {houseNum && (
              <text x={bx + 8} y={by + W - 8} fill="rgba(243,211,122,0.4)" fontSize="9">
                H{houseNum}
              </text>
            )}

            {planetsInBox.map((pName, idx) => {
              const pObj = PLANETS.find(x => x.name === pName) || { symbol: pName.slice(0, 2), color: "#D4AF37" };
              const degStr = getPlanetDegree(pName, houseData, planetData);
              return (
                <text key={idx} x={bx + W / 2} y={by + 34 + idx * 15} textAnchor="middle" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.85))" }}>
                  <tspan fill={pObj.color} fontSize="12.5" fontWeight="800">
                    {pObj.symbol}
                  </tspan>
                  {degStr && (
                    <tspan fill="#FDE68A" fontSize="10" fontWeight="600" opacity="0.95">
                      {" " + degStr}
                    </tspan>
                  )}
                </text>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
};

// ── COSMIC BACKGROUND CANVAS PARTICLES ───────────────────────────
const CosmicBackdrop = () => (
  <div className="no-print" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
    <div style={{ position: "absolute", top: "-10%", left: "15%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, rgba(13,10,28,0) 70%)", filter: "blur(60px)" }} />
    <div style={{ position: "absolute", bottom: "10%", right: "10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(217,119,6,0.09) 0%, rgba(13,10,28,0) 70%)", filter: "blur(70px)" }} />
    {Array.from({ length: 65 }).map((_, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${(i * 19.3) % 100}%`,
          top: `${(i * 37.7) % 100}%`,
          width: i % 4 === 0 ? 3 : i % 2 === 0 ? 2 : 1.5,
          height: i % 4 === 0 ? 3 : i % 2 === 0 ? 2 : 1.5,
          borderRadius: "50%",
          background: i % 3 === 0 ? "#FDE68A" : "#FFFFFF",
          opacity: 0.3 + (i % 5) * 0.12,
          animation: `twinkle ${3 + (i % 4)}s ease-in-out infinite ${(i % 3) * 0.8}s alternate`,
        }}
      />
    ))}
  </div>
);

const CURRENCIES = {
  USD: { code: "USD", symbol: "$", name: "USD ($)", flag: "🇺🇸", baseRate: 1 },
  EUR: { code: "EUR", symbol: "€", name: "EUR (€)", flag: "🇪🇺", baseRate: 0.92 },
  GBP: { code: "GBP", symbol: "£", name: "GBP (£)", flag: "🇬🇧", baseRate: 0.79 },
  CAD: { code: "CAD", symbol: "CA$", name: "CAD (CA$)", flag: "🇨🇦", baseRate: 1.36 },
  AUD: { code: "AUD", symbol: "AU$", name: "AUD (AU$)", flag: "🇦🇺", baseRate: 1.52 },
  AED: { code: "AED", symbol: "AED ", name: "AED (د.إ)", flag: "🇦🇪", baseRate: 3.67 },
  INR: { code: "INR", symbol: "₹", name: "INR (₹)", flag: "🇮🇳", baseRate: 83.5 },
};

const PRODUCT_PRICES = {
  dakshina: { USD: "$1.99", EUR: "€1.99", GBP: "£1.49", CAD: "CA$2.49", AUD: "AU$2.99", AED: "AED 9", INR: "₹101" },
  deluxeReport: { USD: "$4.99", EUR: "€4.49", GBP: "£3.99", CAD: "CA$6.49", AUD: "AU$7.49", AED: "AED 19", INR: "₹399" },
  annualReport: { USD: "$2.99", EUR: "€2.79", GBP: "£2.49", CAD: "CA$3.99", AUD: "AU$4.49", AED: "AED 12", INR: "₹249" },
  matchmakingReport: { USD: "$2.99", EUR: "€2.79", GBP: "£2.49", CAD: "CA$3.99", AUD: "AU$4.49", AED: "AED 12", INR: "₹249" },
  marriageTimingReport: { USD: "$2.99", EUR: "€2.79", GBP: "£2.49", CAD: "CA$3.99", AUD: "AU$4.49", AED: "AED 12", INR: "₹249" },
  careerReport: { USD: "$3.99", EUR: "€3.49", GBP: "£2.99", CAD: "CA$4.99", AUD: "AU$5.99", AED: "AED 15", INR: "₹299" },
  remediesReport: { USD: "$2.99", EUR: "€2.79", GBP: "£2.49", CAD: "CA$3.99", AUD: "AU$4.49", AED: "AED 12", INR: "₹249" },
  dailyMonthly: { USD: "$0.99", EUR: "€0.99", GBP: "£0.79", CAD: "CA$1.29", AUD: "AU$1.49", AED: "AED 4", INR: "₹79" },
  dailyYearly: { USD: "$4.99", EUR: "€4.99", GBP: "£3.99", CAD: "CA$6.99", AUD: "AU$7.99", AED: "AED 22", INR: "₹399" },
};

const detectDefaultCurrency = () => {
  try {
    // 1. Saved user preference takes top priority
    const saved = localStorage.getItem("jyotish_user_currency");
    if (saved && CURRENCIES[saved]) return saved;

    // 2. Exact timezone string
    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || "").toLowerCase();

    // 3. Timezone offset (IST is UTC+5:30 -> exactly -330 minutes)
    const offset = new Date().getTimezoneOffset();
    if (offset === -330) return "INR";

    // 4. Timezone matching India
    if (tz.includes("kolkata") || tz.includes("calcutta") || tz.includes("india") || tz.includes("delhi") || tz.includes("mumbai")) {
      return "INR";
    }

    // 5. Browser languages (Indian languages or en-IN)
    const navLang = (navigator.language || "").toLowerCase();
    const navLangs = (navigator.languages || []).map(l => (l || "").toLowerCase());
    const isIndian = (l) => l.endsWith("-in") || l.startsWith("hi") || l.startsWith("mr") || 
      l.startsWith("ta") || l.startsWith("te") || l.startsWith("bn") || l.startsWith("gu") || 
      l.startsWith("kn") || l.startsWith("ml") || l.startsWith("pa") || l.startsWith("or");

    if (isIndian(navLang) || navLangs.some(isIndian)) {
      return "INR";
    }

    // 6. International regions
    if (tz.includes("london") || navLang.includes("en-gb")) return "GBP";
    if (tz.includes("europe/")) return "EUR";
    if (tz.includes("canada") || tz.includes("toronto") || tz.includes("vancouver")) return "CAD";
    if (tz.includes("australia") || tz.includes("sydney") || tz.includes("melbourne")) return "AUD";
    if (tz.includes("dubai") || tz.includes("asia/dubai") || tz.includes("uae")) return "AED";

    return "USD";
  } catch (e) {
    return "INR"; // Safe default for Vedic Jyotish platform
  }
};

// ── MONETIZATION CHECKOUT MODAL ──────────────────────────────────
const CheckoutModal = ({ item, onClose, onPaid, lang, currency = "USD", setCurrency, isAdmin = false }) => {
  const [method, setMethod] = useState("paypal"); // "paypal" | "card"
  const [checkoutStep, setCheckoutStep] = useState("pay"); // "pay" | "verify" | "success"
  const [email, setEmail] = useState("");
  const [paypalTxId, setPaypalTxId] = useState("");
  const [phone, setPhone] = useState("");
  const [verifyErr, setVerifyErr] = useState("");
  const [orderId, setOrderId] = useState("");
  const [modalCustomAmt, setModalCustomAmt] = useState(null);
  const hi = lang === "hi";

  const isINR = currency === "INR";

  // Handle switching currency inside modal
  const handleSwitchCurrency = (newCurr) => {
    if (!newCurr || !CURRENCIES[newCurr]) return;
    setCurrency && setCurrency(newCurr);
    try {
      localStorage.setItem("jyotish_user_currency", newCurr);
    } catch (e) {}
    setModalCustomAmt(null);
  };

  // Dynamic price formatted for current currency (custom preset dakshina takes precedence if it matches currency)
  let displayPrice = modalCustomAmt;
  if (!displayPrice) {
    if (item.isDakshina) {
      if (isINR) {
        displayPrice = (item.price && item.price.includes("₹")) ? item.price : (PRODUCT_PRICES.dakshina.INR || "₹101");
      } else {
        displayPrice = (item.price && !item.price.includes("₹"))
          ? item.price
          : (PRODUCT_PRICES.dakshina[currency] || PRODUCT_PRICES.dakshina.USD || "$1.99");
      }
    } else if (item.priceKey && PRODUCT_PRICES[item.priceKey]) {
      displayPrice = PRODUCT_PRICES[item.priceKey][currency] || PRODUCT_PRICES[item.priceKey].USD;
    } else {
      displayPrice = item.price || (isINR ? "₹101" : "$1.99");
    }
  }

  // Numerical value for PayPal / UPI
  const cleanNumericVal = (displayPrice || "4.99").replace(/[^0-9.]/g, "") || "4.99";
  const currCode = currency || "USD";
  const paypalUrl = `https://www.paypal.com/paypalme/abhishek270995/${cleanNumericVal}${currCode}`;
  const dynamicQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(paypalUrl)}&margin=10`;
  const upiUrl = `upi://pay?pa=8094199663@upi&pn=Jyotish%20Paramarsh&am=${cleanNumericVal}&cu=INR&tn=${encodeURIComponent("Jyotish Paramarsh - " + (item.title || "Vedic Astrological Report"))}`;

  const handleProceedToVerify = () => {
    setCheckoutStep("verify");
    setVerifyErr("");
  };

  const handleConfirmPayment = () => {
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setVerifyErr(hi ? "कृपया मान्य ईमेल पता दर्ज करें (PDF व रसीद हेतु)।" : "Please enter a valid email address for instant PDF report delivery.");
      return;
    }

    const generatedOrderId = "JK-" + Math.floor(100000 + Math.random() * 900000);
    setOrderId(generatedOrderId);
    setCheckoutStep("success");

    setTimeout(() => {
      onPaid && onPaid(item);
    }, 1200);
  };

  const getEmailSupportLink = () => {
    const subject = encodeURIComponent(`Jyotish Paramarsh Order Confirmation — ${orderId || item.title}`);
    const body = encodeURIComponent(
      `Namaste Team Jyotish Paramarsh,\n\n` +
      `I have placed an order on Jyotish Paramarsh:\n\n` +
      `• Item: ${item.title}\n` +
      `• Amount Paid: ${displayPrice}\n` +
      `• Order ID: ${orderId || "Pending"}\n` +
      `• Delivery Email: ${email || "N/A"}\n` +
      `${paypalTxId ? `• PayPal Tx ID / Ref: ${paypalTxId}\n` : ""}` +
      `${phone ? `• Contact Phone: ${phone}\n` : ""}\n` +
      `Please verify and send my complete astrological report & reading.\n\nThank you!`
    );
    return `mailto:teamjyotishparamarsh@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)", padding: 20 }}>
      <div className="glass-card" style={{ maxWidth: 470, width: "100%", padding: "26px 24px", position: "relative", maxHeight: "92vh", overflowY: "auto", border: "1px solid rgba(212,175,55,0.3)" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 16, background: "none", border: "none", color: "#F3D37A", fontSize: 20, cursor: "pointer" }}>✕</button>

        {/* 👑 VIP Admin Instant Bypass Banner */}
        {isAdmin && checkoutStep !== "success" && (
          <div style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(217,119,6,0.32))", border: "1.5px solid #F59E0B", borderRadius: 10, padding: "12px 14px", marginBottom: 16, textAlign: "center" }}>
            <div style={{ color: "#FDE68A", fontWeight: 800, fontSize: 13, marginBottom: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <span>👑</span> {hi ? "एडमिन वीआईपी मोड सक्रिय" : "VIP ADMIN MODE ACTIVE"}
            </div>
            <div style={{ color: "rgba(241,231,208,0.9)", fontSize: 12, marginBottom: 8 }}>
              {hi ? "आप एडमिन मोड में हैं। किसी भुगतान की आवश्यकता नहीं है।" : "You are in Admin Mode. No payment required."}
            </div>
            <button
              onClick={() => {
                onPaid && onPaid(item);
                onClose && onClose();
              }}
              style={{ background: "linear-gradient(90deg, #F59E0B, #D97706)", border: "none", color: "#0F0A1E", padding: "8px 18px", borderRadius: 6, fontSize: 12.5, fontWeight: 800, cursor: "pointer", boxShadow: "0 2px 8px rgba(245,158,11,0.4)" }}
            >
              ⚡ {hi ? "एडमिन: तुरंत अनलॉक करें (बिना भुगतान)" : "Admin Instant Bypass (Unlock Free)"}
            </button>
          </div>
        )}

        {/* ── STEP 3: SUCCESS ── */}
        {checkoutStep === "success" && (
          <div style={{ textAlign: "center", padding: "20px 10px" }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>{item.isDakshina ? "🪷" : "🎉"}</div>
            <h3 style={{ color: "#34D399", fontSize: 19, fontWeight: 700, marginBottom: 6 }}>
              {item.isDakshina
                ? (hi ? "आपकी श्रद्धा दक्षिणा सादर स्वीकृत हुई!" : "Sacred Dakshina Received with Reverence!")
                : (hi ? "भुगतान एवं ऑर्डर सफल!" : "Payment & Order Confirmed!")}
            </h3>
            <p style={{ color: "rgba(241,231,208,0.8)", fontSize: 13.5, marginBottom: 16 }}>
              {item.isDakshina
                ? (hi ? `ऑर्डर आईडी: ${orderId} · आपके इस पुनीत सहयोग के लिए हृदय से धन्यवाद। ईश्वर आपका कल्याण करें।` : `Order ID: ${orderId} · Thank you deeply for sustaining this platform. May you be blessed with peace & light.`)
                : (hi ? `ऑर्डर आईडी: ${orderId} · सेवा अनलॉक कर दी गई है।` : `Order ID: ${orderId} · Your premium access is now activated.`)}
            </p>

            <div style={{ background: "rgba(11,8,25,0.85)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 14, textAlign: "left", fontSize: 13, marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "rgba(241,231,208,0.6)" }}>Item:</span>
                <span style={{ color: "#F3D37A", fontWeight: 700 }}>{item.title}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "rgba(241,231,208,0.6)" }}>{item.isDakshina ? (hi ? "समर्पित दक्षिणा:" : "Dakshina Offered:") : "Amount Paid:"}</span>
                <span style={{ color: "#34D399", fontWeight: 700 }}>{displayPrice}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "rgba(241,231,208,0.6)" }}>Delivery Email:</span>
                <span style={{ color: "#FFF", fontWeight: 600 }}>{email}</span>
              </div>
              {paypalTxId && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: "rgba(241,231,208,0.6)" }}>{isINR ? "UPI UTR / Ref:" : "PayPal Tx ID:"}</span>
                  <span style={{ color: isINR ? "#6EE7B7" : "#93C5FD", fontWeight: 600 }}>{paypalTxId}</span>
                </div>
              )}
            </div>

            <a
              href={getEmailSupportLink()}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                width: "100%",
                background: "linear-gradient(90deg, #F59E0B, #D97706)",
                color: "#0F0A1E",
                padding: "11px 16px",
                borderRadius: 8,
                fontSize: 13.5,
                fontWeight: 700,
                textDecoration: "none",
                marginBottom: 10
              }}
            >
              <span>✉️</span> {hi ? "ईमेल पर रसीद भेजें / संपर्क करें" : "Send Receipt via Email / Contact Support"}
            </a>

            <button onClick={onClose} className="gold-cta-btn" style={{ padding: "10px 18px", fontSize: 13.5, width: "100%" }}>
              {hi ? "पूर्ण करें (Done)" : "Done / Continue"}
            </button>
          </div>
        )}

        {/* ── STEP 2: VERIFY (EMAIL & PAYPAL TX ID) ── */}
        {checkoutStep === "verify" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 32 }}>📝</span>
              <h3 style={{ color: "#F3D37A", fontSize: 18, fontWeight: 700, marginTop: 4 }}>
                {hi ? "ऑर्डर एवं रिपोर्ट प्राप्ति विवरण" : "Confirm Delivery Details"}
              </h3>
              <p style={{ color: "rgba(241,231,208,0.7)", fontSize: 13, marginTop: 2 }}>
                {item.title} — <b style={{ color: "#FDE68A" }}>{displayPrice}</b>
              </p>
            </div>

            <div style={{ background: "rgba(11,8,25,0.85)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 12, padding: "18px 16px", marginBottom: 16 }}>
              {/* Customer Email Address */}
              <div style={{ marginBottom: 14 }}>
                <label htmlFor="checkout-email-input" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700, color: "#FDE68A", marginBottom: 6 }}>
                  <span>📧</span> {hi ? "आपका ईमेल पता (PDF रिपोर्ट व रसीद हेतु) *" : "Your Email Address (For PDF Report & Receipt) *"}
                </label>
                <input
                  id="checkout-email-input"
                  name="email"
                  type="email"
                  required
                  aria-required="true"
                  aria-label={hi ? "ईमेल पता" : "Email Address"}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. yourname@example.com"
                  style={{ width: "100%", background: "rgba(0,0,0,0.6)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8, padding: "11px 14px", color: "#FFF", fontSize: 14 }}
                />
                <div style={{ fontSize: 11.5, color: "rgba(241,231,208,0.65)", marginTop: 4 }}>
                  {hi ? "अनलॉक की गई विस्तृत PDF रिपोर्ट एवं रसीद इस ईमेल पर भेजी जाएगी।" : "Your unlocked high-resolution report and invoice will be sent here."}
                </div>
              </div>

              {/* Transaction ID / Order Ref */}
              <div style={{ marginBottom: 14 }}>
                <label htmlFor="checkout-txid-input" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700, color: "#FDE68A", marginBottom: 6 }}>
                  <span>{isINR ? "📱" : "🅿️"}</span> {isINR
                    ? (hi ? "UPI Transaction ID / 12-अंकों का UTR (वैकल्पिक)" : "UPI Transaction ID / 12-digit UTR (Optional)")
                    : (hi ? "PayPal Transaction ID / ऑर्डर संदर्भ (वैकल्पिक)" : "PayPal Transaction ID / Order Ref (Optional)")}
                </label>
                <input
                  id="checkout-txid-input"
                  name="paypalTxId"
                  type="text"
                  aria-label={isINR ? (hi ? "यूपीआई ट्रांजैक्शन आईडी" : "UPI Transaction ID") : (hi ? "पेपैल ट्रांजैक्शन आईडी" : "PayPal Transaction ID")}
                  value={paypalTxId}
                  onChange={e => setPaypalTxId(e.target.value)}
                  placeholder={isINR ? "e.g. 423456789012 (12 digits)" : "e.g. 9XY12345678901234"}
                  style={{ width: "100%", background: "rgba(0,0,0,0.6)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8, padding: "11px 14px", color: "#FFF", fontSize: 14, letterSpacing: 0.5 }}
                />
                <div style={{ fontSize: 11.5, color: "rgba(243,211,122,0.75)", marginTop: 4 }}>
                  💡 {isINR
                    ? (hi ? "PhonePe, GPay या Paytm रसीद में दिया गया UTR / UPI Ref नंबर दर्ज करें।" : "Found in your PhonePe, Google Pay or Paytm payment receipt.")
                    : (hi ? "पेपैल रसीद / ईमेल में दी गई Transaction ID दर्ज करें।" : "Found in your PayPal confirmation email or activity receipt.")}
                </div>
              </div>

              {/* Optional Phone */}
              <div>
                <label htmlFor="checkout-phone-input" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700, color: "#FDE68A", marginBottom: 6 }}>
                  <span>📞</span> {hi ? "फोन / संपर्क नंबर (वैकल्पिक)" : "Phone / Contact Number (Optional)"}
                </label>
                <div style={{ display: "flex", gap: 6 }}>
                  <div style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8, padding: "11px 14px", color: "rgba(241,231,208,0.9)", fontSize: 14, fontWeight: 600 }}>
                    {CURRENCIES[currency]?.flag || "🌐"}
                  </div>
                  <input
                    id="checkout-phone-input"
                    name="phone"
                    type="tel"
                    aria-label={hi ? "फोन नंबर" : "Phone Number"}
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. +1 (555) 019-2834"
                    style={{ width: "100%", background: "rgba(0,0,0,0.6)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8, padding: "11px 14px", color: "#FFF", fontSize: 14 }}
                  />
                </div>
              </div>
            </div>

            {verifyErr && (
              <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", borderRadius: 8, padding: "10px 14px", color: "#FCA5A5", fontSize: 13, marginBottom: 14 }}>
                ⚠️ {verifyErr}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10 }}>
              <button
                onClick={() => setCheckoutStep("pay")}
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, color: "rgba(241,231,208,0.9)", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}
              >
                ← {hi ? "पीछे (Back)" : "Back"}
              </button>
              <button onClick={handleConfirmPayment} className="gold-cta-btn" style={{ padding: "13px 16px", fontSize: 14 }}>
                {item.isDakshina
                  ? (hi ? "श्रद्धा दक्षिणा अर्पित करें ✦" : `Confirm Sacred Dakshina (${displayPrice}) ✦`)
                  : (hi ? "सत्यापित करें एवं अनलॉक करें ✦" : `Confirm & Unlock (${displayPrice}) ✦`)}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 1: PAYMENT (PAYPAL & CARDS) ── */}
        {checkoutStep === "pay" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 36 }}>{item.icon || "💎"}</span>
              <h3 style={{ color: "#F3D37A", fontSize: 19, fontWeight: 700, marginTop: 4 }}>{item.title}</h3>
              <div style={{ color: "#FDE68A", fontSize: 30, fontWeight: 800, marginTop: 4 }}>{displayPrice}</div>
              <p style={{ color: "rgba(241,231,208,0.75)", fontSize: 13, marginTop: 4 }}>{item.desc}</p>
            </div>

            {/* ── HIGH PRIORITY: PROMPT REGION & CURRENCY SELECTION BEFORE PAYMENT ── */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,175,55,0.28)", borderRadius: 14, padding: "12px 14px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "rgba(243,211,122,0.95)", letterSpacing: 0.3, display: "flex", alignItems: "center", gap: 5 }}>
                  <span>📍</span> {hi ? "भुगतान क्षेत्र / मुद्रा चुनें:" : "Choose Payment Region & Currency:"}
                </span>
                <span style={{ fontSize: 11, color: isINR ? "#34D399" : "#60A5FA", fontWeight: 700, background: isINR ? "rgba(16,185,129,0.15)" : "rgba(0,112,186,0.18)", padding: "2px 8px", borderRadius: 10 }}>
                  {isINR ? "✓ भारत (UPI सक्रिय)" : `✓ International (${currency})`}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => handleSwitchCurrency("INR")}
                  style={{
                    background: isINR ? "linear-gradient(135deg, rgba(16,185,129,0.3), rgba(5,150,105,0.4))" : "rgba(11,8,25,0.6)",
                    border: `2px solid ${isINR ? "#10B981" : "rgba(212,175,55,0.22)"}`,
                    color: isINR ? "#A7F3D0" : "rgba(241,231,208,0.75)",
                    borderRadius: 10,
                    padding: "9px 8px",
                    cursor: "pointer",
                    textAlign: "center",
                    boxShadow: isINR ? "0 4px 12px rgba(16,185,129,0.25)" : "none",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ fontSize: 13.5, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                    <span>🇮🇳</span> भारत / India
                  </div>
                  <div style={{ fontSize: 10.5, color: isINR ? "#D1FAE5" : "rgba(241,231,208,0.55)", marginTop: 2 }}>
                    UPI • PhonePe • GPay • ₹
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSwitchCurrency(currency === "INR" ? "USD" : currency)}
                  style={{
                    background: !isINR ? "linear-gradient(135deg, rgba(0,112,186,0.32), rgba(2,132,199,0.42))" : "rgba(11,8,25,0.6)",
                    border: `2px solid ${!isINR ? "#38BDF8" : "rgba(212,175,55,0.22)"}`,
                    color: !isINR ? "#BAE6FD" : "rgba(241,231,208,0.75)",
                    borderRadius: 10,
                    padding: "9px 8px",
                    cursor: "pointer",
                    textAlign: "center",
                    boxShadow: !isINR ? "0 4px 12px rgba(0,112,186,0.25)" : "none",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ fontSize: 13.5, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                    <span>🌍</span> Overseas
                  </div>
                  <div style={{ fontSize: 10.5, color: !isINR ? "#E0F2FE" : "rgba(241,231,208,0.55)", marginTop: 2 }}>
                    PayPal • Cards ($/€/£)
                  </div>
                </button>
              </div>

              {!isINR && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, overflowX: "auto", paddingBottom: 2 }}>
                  <span style={{ fontSize: 10.5, color: "rgba(241,231,208,0.6)", whiteSpace: "nowrap" }}>{hi ? "विदेशी मुद्रा:" : "Currency:"}</span>
                  {Object.values(CURRENCIES).filter(c => c.code !== "INR").map(c => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleSwitchCurrency(c.code)}
                      style={{
                        background: currency === c.code ? "rgba(0,112,186,0.5)" : "rgba(255,255,255,0.06)",
                        border: `1px solid ${currency === c.code ? "#38BDF8" : "rgba(212,175,55,0.2)"}`,
                        color: currency === c.code ? "#FFF" : "rgba(241,231,208,0.7)",
                        borderRadius: 12,
                        padding: "2px 8px",
                        fontSize: 10.5,
                        fontWeight: 700,
                        cursor: "pointer",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {c.flag} {c.code}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* In-Modal Quick Dakshina Amount Preset Selector */}
            {item.isDakshina && (
              <div style={{ marginBottom: 16, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "rgba(243,211,122,0.8)", fontWeight: 700, marginBottom: 6 }}>
                  {hi ? "दक्षिणा राशि बदलें:" : "CHANGE DAKSHINA AMOUNT:"}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6 }}>
                  {(isINR
                    ? ["₹51", "₹101", "₹251", "₹501", "₹1,100"]
                    : [
                        `${CURRENCIES[currency]?.symbol || "$" }1.99`,
                        `${CURRENCIES[currency]?.symbol || "$" }4.99`,
                        `${CURRENCIES[currency]?.symbol || "$" }11.00`,
                        `${CURRENCIES[currency]?.symbol || "$" }21.00`
                      ]
                  ).map(amt => {
                    const isSelected = displayPrice === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setModalCustomAmt(amt)}
                        style={{
                          background: isSelected ? "linear-gradient(135deg, rgba(245,158,11,0.35), rgba(217,119,6,0.45))" : "rgba(255,255,255,0.06)",
                          border: `1.5px solid ${isSelected ? "#F59E0B" : "rgba(212,175,55,0.25)"}`,
                          borderRadius: 8,
                          padding: "5px 11px",
                          color: isSelected ? "#FDE68A" : "rgba(241,231,208,0.8)",
                          fontSize: 12,
                          fontWeight: 800,
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                      >
                        {amt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Payment Mode Selector */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {(isINR ? [
                { id: "paypal", name: "UPI / QR Code", icon: "📱", badge: "PhonePe / GPay" },
                { id: "card", name: hi ? "डेबिट / क्रेडिट कार्ड" : "Debit / Credit Card", icon: "💳", badge: "RuPay/Visa/MC" },
              ] : [
                { id: "paypal", name: "PayPal", icon: "🅿️", badge: "Instant" },
                { id: "card", name: hi ? "डेबिट / क्रेडिट कार्ड" : "Debit / Credit Card", icon: "💳", badge: "Visa/MC" },
              ]).map(m => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  style={{
                    background: method === m.id ? (isINR ? "rgba(16,185,129,0.25)" : "rgba(0,112,186,0.25)") : "rgba(11,8,25,0.6)",
                    border: `1.5px solid ${method === m.id ? (isINR ? "#10B981" : "#0070BA") : "rgba(212,175,55,0.2)"}`,
                    color: method === m.id ? (isINR ? "#6EE7B7" : "#93C5FD") : "#FFF",
                    borderRadius: 10,
                    padding: "11px 10px",
                    fontSize: 13.5,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ fontSize: 18, marginBottom: 2 }}>{m.icon}</div>
                  <div>{m.name}</div>
                  <div style={{ fontSize: 10.5, color: "rgba(241,231,208,0.6)", marginTop: 2 }}>{m.badge}</div>
                </button>
              ))}
            </div>

            {method === "paypal" ? (
              isINR ? (
                /* ── INR UPI QR CODE (India Users) ── */
                <div style={{ background: "rgba(11,8,25,0.85)", border: "1.5px solid rgba(16,185,129,0.45)", borderRadius: 14, padding: "20px 16px", textAlign: "center", marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginBottom: 12 }}>
                    <span style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.5)", borderRadius: 12, padding: "4px 14px", color: "#34D399", fontSize: 12.5, fontWeight: 700 }}>
                      🔒 {hi ? `निर्धारित राशि: ${displayPrice}` : `Amount: ${displayPrice} (INR)`}
                    </span>
                    <span style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 12, padding: "4px 10px", color: "#34D399", fontSize: 12, fontWeight: 700 }}>
                      ✓ {hi ? "सत्यापित मर्चेंट" : "Verified Merchant"}
                    </span>
                  </div>

                  {/* Amount-Enforced High-Contrast INR UPI QR Code */}
                  <div style={{ width: 205, height: 205, background: "#FFF", borderRadius: 12, margin: "0 auto", padding: 8, display: "flex", alignItems: "center", justifyContent: "center", border: "2.5px solid #10B981", boxShadow: "0 6px 20px rgba(16,185,129,0.3)" }}>
                    <img
                      src="/inr-upi-qr.png"
                      alt="UPI Payment QR Code (INR)"
                      style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 6 }}
                    />
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#6EE7B7", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                      <span>🛡️</span> {hi ? "प्राप्तकर्ता: ज्योतिष परामर्श™" : "Merchant: Jyotish Paramarsh™"}
                    </div>
                    <div style={{ fontSize: 11.5, color: "rgba(241,231,208,0.8)", marginTop: 2 }}>
                      Google Pay • PhonePe • Paytm • BHIM • Cred UPI • Any Banking App
                    </div>
                  </div>

                  {/* Direct 1-Tap Mobile UPI Intent Link */}
                  <a
                    href={upiUrl}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      width: "100%",
                      marginTop: 14,
                      background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                      border: "1px solid #34D399",
                      color: "#FFFFFF",
                      padding: "13px 14px",
                      borderRadius: 8,
                      fontSize: 14.5,
                      fontWeight: 700,
                      textDecoration: "none",
                      boxShadow: "0 4px 14px rgba(5,150,105,0.45)"
                    }}
                  >
                    <span style={{ fontSize: 16 }}>📱</span> {hi ? `किसी भी UPI ऐप से ${displayPrice} का भुगतान करें` : `Pay with Any UPI App (${displayPrice})`}
                  </a>
                  <div style={{ fontSize: 11.5, color: "rgba(241,231,208,0.65)", marginTop: 8 }}>
                    {hi ? "PhonePe, Google Pay या Paytm से QR कोड स्कैन करें या ऊपर दिए बटन पर टैप करें।" : "Scan QR code or tap button above to pay directly using any UPI app."}
                  </div>
                </div>
              ) : (
                /* ── EXISTING PAYPAL QR CODE (Non-INR / International Users) ── */
                <div style={{ background: "rgba(11,8,25,0.85)", border: "1px solid rgba(0,112,186,0.45)", borderRadius: 14, padding: "20px 16px", textAlign: "center", marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginBottom: 12 }}>
                    <span style={{ background: "rgba(0,112,186,0.2)", border: "1px solid rgba(0,112,186,0.5)", borderRadius: 12, padding: "4px 14px", color: "#60A5FA", fontSize: 12.5, fontWeight: 700 }}>
                      🔒 {hi ? `निर्धारित राशि: ${displayPrice}` : `Amount: ${displayPrice} (${currCode})`}
                    </span>
                    <span style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 12, padding: "4px 10px", color: "#34D399", fontSize: 12, fontWeight: 700 }}>
                      ✓ {hi ? "सत्यापित मर्चेंट" : "Verified Merchant"}
                    </span>
                  </div>

                  {/* Amount-Enforced High-Contrast QR Code */}
                  <div style={{ width: 195, height: 195, background: "#FFF", borderRadius: 12, margin: "0 auto", padding: 8, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #0070BA", boxShadow: "0 6px 20px rgba(0,0,0,0.6)" }}>
                    <img
                      src={dynamicQrCodeUrl}
                      alt="PayPal Payment QR Code"
                      style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 4 }}
                    />
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#93C5FD", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                      <span>🛡️</span> {hi ? "प्राप्तकर्ता: ज्योतिष परामर्श™ वैदिक रिसर्च" : "Merchant: Jyotish Paramarsh™ Vedic Services"}
                    </div>
                    <div style={{ fontSize: 11.5, color: "rgba(241,231,208,0.8)", marginTop: 2 }}>
                      {hi ? "आधिकारिक पेपैल गेटवे · 100% सुरक्षित एवं गोपनीय" : "Official PayPal Gateway · 100% Buyer Protected"}
                    </div>
                  </div>

                  {/* Direct 1-Tap Mobile / Web PayPal Link */}
                  <a
                    href={paypalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      width: "100%",
                      marginTop: 14,
                      background: "linear-gradient(135deg, #0070BA 0%, #003087 100%)",
                      border: "1px solid #60A5FA",
                      color: "#FFFFFF",
                      padding: "13px 14px",
                      borderRadius: 8,
                      fontSize: 14.5,
                      fontWeight: 700,
                      textDecoration: "none",
                      boxShadow: "0 4px 14px rgba(0,112,186,0.45)"
                    }}
                  >
                    <span style={{ fontSize: 16 }}>🅿️</span> {hi ? `पेपैल से ${displayPrice} का भुगतान करें` : `Pay with PayPal (${displayPrice})`}
                  </a>
                  <div style={{ fontSize: 11.5, color: "rgba(241,231,208,0.65)", marginTop: 8 }}>
                    {hi ? "पेपैल बैलेंस, बैंक खाते या कार्ड्स से सुरक्षित भुगतान करें।" : "Supports PayPal Balance, Bank Transfer & Guest Cards."}
                  </div>
                </div>
              )
            ) : (
              <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontSize: 13, color: "rgba(243,211,122,0.9)", fontWeight: 600 }}>
                    {hi ? `क्रेडिट / डेबिट कार्ड (${displayPrice})` : `Credit or Debit Card (${displayPrice})`}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(241,231,208,0.6)", display: "flex", gap: 4 }}>
                    <span>💳 Visa</span>
                    <span>• MC</span>
                    <span>• Amex</span>
                  </div>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <label htmlFor="checkout-card-num" style={{ display: "block", fontSize: 12, color: "rgba(243,211,122,0.85)", marginBottom: 4, fontWeight: 600 }}>
                    {hi ? "कार्ड नंबर" : "Card Number"}
                  </label>
                  <input
                    id="checkout-card-num"
                    name="cardNumber"
                    aria-label={hi ? "कार्ड नंबर" : "Card Number"}
                    placeholder="4000 1234 5678 9010"
                    style={{ width: "100%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 6, padding: "10px 12px", color: "#FFF", fontSize: 13.5 }}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label htmlFor="checkout-card-exp" style={{ display: "block", fontSize: 12, color: "rgba(243,211,122,0.85)", marginBottom: 4, fontWeight: 600 }}>
                      {hi ? "समाप्ति (MM/YY)" : "Expiry (MM/YY)"}
                    </label>
                    <input
                      id="checkout-card-exp"
                      name="cardExpiry"
                      aria-label={hi ? "समाप्ति तिथि" : "Card Expiry"}
                      placeholder="MM/YY"
                      style={{ width: "100%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 6, padding: "10px 12px", color: "#FFF", fontSize: 13.5 }}
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-card-cvv" style={{ display: "block", fontSize: 12, color: "rgba(243,211,122,0.85)", marginBottom: 4, fontWeight: 600 }}>
                      {hi ? "सुरक्षा कोड (CVV)" : "Security Code (CVV)"}
                    </label>
                    <input
                      id="checkout-card-cvv"
                      name="cardCvv"
                      aria-label={hi ? "सुरक्षा कोड CVV" : "Card Security Code CVV"}
                      placeholder="CVV"
                      type="password"
                      maxLength={4}
                      style={{ width: "100%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 6, padding: "10px 12px", color: "#FFF", fontSize: 13.5 }}
                    />
                  </div>
                </div>
              </div>
            )}

            <button onClick={handleProceedToVerify} className="gold-cta-btn" style={{ padding: "14px 20px", fontSize: 15, width: "100%" }}>
              {item.isDakshina
                ? (hi ? `मैंने दक्षिणा अर्पित कर दी है (${displayPrice}) →` : `I Have Offered Dakshina (${displayPrice}) →`)
                : (hi ? `मैंने भुगतान कर दिया है (${displayPrice}) →` : `I Have Made the Payment (${displayPrice}) →`)}
            </button>
            <div style={{ textAlign: "center", fontSize: 12, color: "rgba(243,211,122,0.65)", marginTop: 10 }}>
              🔒 256-Bit Bank Grade SSL Encrypted Global Checkout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── MAIN APP COMPONENT ───────────────────────────────────────────
export default function App() {
  const [form, setForm] = useState({ name: "", dob: "", pob: "", tob: "" });
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("chart");
  const [tabCategoryFilter, setTabCategoryFilter] = useState("all"); // 'all' | 'personal' | 'generic'
  const [chartStyle, setChartStyle] = useState("north");
  const [selectedDivisionalChart, setSelectedDivisionalChart] = useState("D1");
  const [showBhavaCuspTable, setShowBhavaCuspTable] = useState(false);
  const [hoveredHouse, setHoveredHouse] = useState(null);
  const [err, setErr] = useState("");
  const [lang, setLang] = useState("en");
  const [selectedPlanetDetail, setSelectedPlanetDetail] = useState("Sun");
  const [currency, setCurrency] = useState(detectDefaultCurrency);
  const [lastCoords, setLastCoords] = useState({ lat: 26.8467, lon: 80.9462 });
  const handleSetCurrency = (newCurr) => {
    if (!newCurr || !CURRENCIES[newCurr]) return;
    setCurrency(newCurr);
    try {
      localStorage.setItem("jyotish_user_currency", newCurr);
    } catch (e) {}
  };

  // Matchmaking State
  const [partnerForm, setPartnerForm] = useState({ name: "", dob: "", pob: "", tob: "" });
  const [milanResult, setMilanResult] = useState(null);

  // FAQ Accordion State & Location Detector State
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert(hi ? "आपके ब्राउज़र में स्थान सेवा समर्थित नहीं है।" : "Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          setLastCoords({ lat: latitude, lon: longitude });
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          if (res.ok) {
            const data = await res.json();
            const city = data.address?.city || data.address?.town || data.address?.state_district || data.address?.state || "Detected City";
            const country = data.address?.country ? `, ${data.address.country}` : "";
            setForm(prev => ({ ...prev, pob: `${city}${country}` }));
          } else {
            setForm(prev => ({ ...prev, pob: `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E` }));
          }
        } catch (e) {
          console.warn("Reverse geocode failed", e);
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        alert(hi ? "स्थान का पता लगाने में असमर्थ। कृपया शहर का नाम दर्ज करें।" : "Unable to retrieve location. Please type your city manually.");
      },
      { timeout: 8000 }
    );
  };

  const handleFillSample = () => {
    setForm({
      name: hi ? "राहुल शर्मा" : "Rahul Sharma",
      dob: "1995-05-15",
      tob: "10:30",
      pob: "New Delhi, India"
    });
    setErr("");
  };

  // Daily Horoscope State
  const [dailySign, setDailySign] = useState("Aries");
  const [dailyChannel, setDailyChannel] = useState("email");
  const [dailyContact, setDailyContact] = useState("");
  const [dailyPlan, setDailyPlan] = useState("yearly");
  const [dailyTime, setDailyTime] = useState("07:00 AM");
  const [isDailySubscribed, setIsDailySubscribed] = useState(() => {
    try {
      return !!localStorage.getItem("jyotish_daily_sub");
    } catch {
      return false;
    }
  });

  // Monetization Modal State
  const [activeCheckout, setActiveCheckout] = useState(null);
  const [unlockedProReport, setUnlockedProReport] = useState(false);
  const [unlockedMarriageReport, setUnlockedMarriageReport] = useState(() => {
    try {
      return !!localStorage.getItem("jyotish_unlocked_marriage");
    } catch {
      return false;
    }
  });
  const [unlockedCareerReport, setUnlockedCareerReport] = useState(() => {
    try {
      return !!localStorage.getItem("jyotish_unlocked_career");
    } catch {
      return false;
    }
  });
  const [unlockedRemediesReport, setUnlockedRemediesReport] = useState(() => {
    try {
      return !!localStorage.getItem("jyotish_unlocked_remedies");
    } catch {
      return false;
    }
  });
  const [unlockedAnnualReport, setUnlockedAnnualReport] = useState(() => {
    try {
      return !!localStorage.getItem("jyotish_unlocked_annual");
    } catch {
      return false;
    }
  });
  const [unlockedMatchmakingReport, setUnlockedMatchmakingReport] = useState(() => {
    try {
      return !!localStorage.getItem("jyotish_unlocked_matchmaking");
    } catch {
      return false;
    }
  });
  const [activeProblemId, setActiveProblemId] = useState("career_job");

  // Admin VIP Bypass State (Dedicated for Owner Abhishek)
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const adminParam = urlParams.get("admin") || urlParams.get("vip");
      if (adminParam && ["2709", "abhishek", "true", "owner"].includes(adminParam.toLowerCase())) {
        localStorage.setItem("jyotish_admin_mode", "true");
        return true;
      }
      return localStorage.getItem("jyotish_admin_mode") === "true";
    } catch {
      return false;
    }
  });

  const [showAdminPinModal, setShowAdminPinModal] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState("");
  const [adminPinErr, setAdminPinErr] = useState("");
  const [logoClickCount, setLogoClickCount] = useState(0);

  // ── 100% FREE INITIATIVE: ALL FEATURES & REPORTS ARE FULLY UNLOCKED ──
  const effectiveMarriageUnlocked = true;
  const effectiveCareerUnlocked = true;
  const effectiveRemediesUnlocked = true;
  const effectiveDailySubscribed = true;
  const effectiveProUnlocked = true;
  const effectiveAnnualUnlocked = true;
  const effectiveMatchmakingUnlocked = true;

  const [activePrintReport, setActivePrintReport] = useState("all");

  const handlePrintReport = (reportType = "all") => {
    setActivePrintReport(reportType);
    setTimeout(() => {
      window.print();
    }, 120);
  };

  const handleSecretTrigger = () => {
    setLogoClickCount(prev => {
      const next = prev + 1;
      if (next >= 3) {
        setShowAdminPinModal(true);
        setAdminPinErr("");
        return 0;
      }
      setTimeout(() => setLogoClickCount(0), 2500);
      return next;
    });
  };

  const handleVerifyAdminPin = () => {
    const clean = adminPinInput.trim().toLowerCase();
    if (clean === "2709" || clean === "abhishek" || clean === "admin") {
      try {
        localStorage.setItem("jyotish_admin_mode", "true");
      } catch (e) {}
      setIsAdmin(true);
      setShowAdminPinModal(false);
      setAdminPinInput("");
      setAdminPinErr("");
    } else {
      setAdminPinErr(hi ? "अमान्य एडमिन पिन! कृपया सही पासकी दर्ज करें।" : "Invalid Admin PIN! Please enter the correct passkey.");
    }
  };

  const handleToggleAdminMode = () => {
    const nextState = !isAdmin;
    setIsAdmin(nextState);
    try {
      if (nextState) {
        localStorage.setItem("jyotish_admin_mode", "true");
      } else {
        localStorage.removeItem("jyotish_admin_mode");
      }
    } catch (e) {}
  };

  // ── DEDICATED SACRED DAKSHINA OFFERING COMPONENT ──
  const renderDakshinaCard = (isCompact = false) => {
    const isINR = currency === "INR";
    const dakshinaPresets = isINR
      ? [
          { amount: "₹51", label: hi ? "शुभ भेंट" : "Shubh Bhent" },
          { amount: "₹101", label: hi ? "श्रद्धा दक्षिणा" : "Shraddha Seva", popular: true },
          { amount: "₹251", label: hi ? "समर्पण" : "Samarpan" },
          { amount: "₹501", label: hi ? "कल्याण भेंट" : "Kalyan Bhent" },
          { amount: "₹1,100", label: hi ? "महा सेवा" : "Maha Seva" },
        ]
      : [
          { amount: `${CURRENCIES[currency]?.symbol || "$" }1.99`, label: hi ? "लघु सहयोग" : "Humble Seva" },
          { amount: `${CURRENCIES[currency]?.symbol || "$" }4.99`, label: hi ? "श्रद्धा भेंट" : "Devoted Seva", popular: true },
          { amount: `${CURRENCIES[currency]?.symbol || "$" }11.00`, label: hi ? "पुनीत सहयोग" : "Generous Seva" },
          { amount: `${CURRENCIES[currency]?.symbol || "$" }21.00`, label: hi ? "महा संरक्षक" : "Patron of Light" },
        ];

    const openDakshina = (customPrice = null) => {
      setActiveCheckout({
        title: hi ? "श्रद्धा दक्षिणा (Seva Bhent)" : "Offer Dakshina (Sacred Offering)",
        priceKey: "dakshina",
        price: customPrice || PRODUCT_PRICES.dakshina[currency],
        desc: hi ? "वैदिक ज्योतिष अनुसंधान एवं निःशुल्क सर्वर सेवा हेतु स्वैच्छिक दक्षिणा" : "Voluntary offering to maintain free Vedic compute servers and support seekers worldwide",
        icon: "🪷",
        isDakshina: true
      });
    };

    return (
      <div
        className="glass-card no-print"
        style={{
          padding: isCompact ? "20px 22px" : "28px 30px",
          marginBottom: 26,
          background: "linear-gradient(135deg, rgba(38, 22, 70, 0.96), rgba(18, 11, 40, 0.98))",
          border: "1.5px solid rgba(245, 158, 11, 0.6)",
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(245, 158, 11, 0.22), 0 0 16px rgba(245, 158, 11, 0.12)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Soft background ambient halo */}
        <div style={{ position: "absolute", top: -50, right: -50, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.28) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -40, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(217,119,6,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Top Header Tag */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14, position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(245, 158, 11, 0.2)", border: "1px solid rgba(245, 158, 11, 0.5)", borderRadius: 20, padding: "5px 14px" }}>
            <span style={{ fontSize: 16 }}>🪷</span>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: "#FDE68A", letterSpacing: 0.5 }}>
              {hi ? "श्रद्धा दक्षिणा · एक पावन निवेदन" : "SHRADDHA DAKSHINA · A SACRED OFFERING"}
            </span>
          </div>
          <div style={{ background: "rgba(16, 185, 129, 0.2)", border: "1px solid rgba(16, 185, 129, 0.45)", borderRadius: 12, padding: "4px 12px", color: "#34D399", fontSize: 12, fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span>✓</span> {hi ? "सभी 50+ पेज रिपोर्ट व फीचर्स 100% निःशुल्क" : "ALL 50+ PAGE REPORTS ARE 100% FREE"}
          </div>
        </div>

        {/* Emotional Headline */}
        <h3 style={{ color: "#F3D37A", fontSize: "clamp(18px, 3.2vw, 22px)", fontWeight: 800, lineHeight: 1.4, marginBottom: 12, position: "relative", zIndex: 2 }}>
          {hi
            ? "वैदिक ज्ञान का प्रकाश सर्वजन कल्याण हेतु निःशुल्क है — इस पुनीत सेवा को बनाए रखने में अपना सहयोग दें"
            : "Divine Vedic Wisdom is Free For Every Seeking Soul — Help Us Sustain This Sacred Light"}
        </h3>

        {/* Heartfelt Emotional Message */}
        <div style={{ color: "rgba(241, 231, 208, 0.92)", fontSize: 14, lineHeight: 1.75, marginBottom: 20, position: "relative", zIndex: 2 }}>
          <p style={{ marginBottom: 10 }}>
            {hi ? (
              <>
                सनातन धर्म की पावन परंपरा के अनुसार, वैदिक ज्ञान एवं दिव्य ज्योतिष का प्रकाश हर जिज्ञासु के कल्याण के लिए है, किसी व्यापार के लिए नहीं। इसीलिए हमने इस मंच के <b>समस्त गहन विश्लेषण, 50-पेज महा-कुंडली रिपोर्ट, करियर-विवाह मार्गदर्शन एवं लाल किताब उपाय आप सभी के लिए 100% निःशुल्क (FREE)</b> कर दिए हैं।
              </>
            ) : (
              <>
                In the timeless spirit of Sanatan Dharma, divine Vedic wisdom is a sacred light meant to illuminate every human journey without financial barriers. That is why <b>every single calculation, planetary transit analysis, personalized remedy, and our comprehensive 50-Page Deluxe Life Dossier is offered 100% FREE for all seekers worldwide</b>.
              </>
            )}
          </p>
          <p style={{ margin: 0 }}>
            {hi ? (
              <>
                उच्च-सटीक खगोलीय गणनाओं, सुपरकंप्यूटिंग सर्वर और निरंतर वैदिक शोध को निर्बाध संचालित रखने के लिए संसाधन आवश्यक होते हैं। यदि हमारी इस निःशुल्क सेवा से आपके जीवन में थोड़ा भी मार्गदर्शन, शांति अथवा स्पष्टता आई हो, तो इस पुनीत सेवा को सदैव जीवित रखने हेतु अपनी सामर्थ्यानुसार एक छोटी सी <b>'श्रद्धा दक्षिणा' (स्वैच्छिक भेंट)</b> अवश्य अर्पित करें। आपकी यह पावन आहुति इस मंच को हर जरूरतमंद के लिए सदैव निःशुल्क रखने में सहयोग करेगी। 🙏
              </>
            ) : (
              <>
                Powering high-precision astronomical algorithms, sustaining server infrastructure, and advancing continuous Vedic research requires ongoing resources. If our guidance has illuminated your path, brought peace to your heart, or provided clarity in your decisions, we warmly invite you to offer a small voluntary Dakshina. Whatever offering feels right to your heart—no amount is too small. Your loving support keeps this platform freely accessible for every seeking soul. 🙏
              </>
            )}
          </p>
        </div>

        {/* Voluntary Dakshina Amount Selector Pills & Fast Region Toggle */}
        <div style={{ marginBottom: 18, position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: "rgba(243, 211, 122, 0.85)", fontWeight: 700, letterSpacing: 0.5 }}>
              {hi ? "अपनी स्वेच्छानुसार दक्षिणा राशि चुनें:" : "SELECT A VOLUNTARY DAKSHINA AMOUNT:"}
            </div>
            {/* Quick Country / Payment Region Switcher */}
            <div style={{ display: "inline-flex", background: "rgba(0,0,0,0.5)", borderRadius: 16, padding: 3, border: "1px solid rgba(212,175,55,0.35)" }}>
              <button
                type="button"
                onClick={() => handleSetCurrency("INR")}
                style={{
                  background: isINR ? "linear-gradient(90deg, #10B981, #059669)" : "transparent",
                  color: isINR ? "#FFF" : "rgba(241,231,208,0.7)",
                  border: "none",
                  borderRadius: 13,
                  padding: "4px 11px",
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  boxShadow: isINR ? "0 2px 8px rgba(16,185,129,0.35)" : "none",
                  transition: "all 0.2s ease"
                }}
              >
                <span>🇮🇳</span> भारत (₹ UPI)
              </button>
              <button
                type="button"
                onClick={() => handleSetCurrency(currency === "INR" ? "USD" : currency)}
                style={{
                  background: !isINR ? "linear-gradient(90deg, #0284C7, #0369A1)" : "transparent",
                  color: !isINR ? "#FFF" : "rgba(241,231,208,0.7)",
                  border: "none",
                  borderRadius: 13,
                  padding: "4px 11px",
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  boxShadow: !isINR ? "0 2px 8px rgba(2,132,199,0.35)" : "none",
                  transition: "all 0.2s ease"
                }}
              >
                <span>🌍</span> Overseas ($/€/£)
              </button>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {dakshinaPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => openDakshina(preset.amount)}
                style={{
                  background: preset.popular
                    ? "linear-gradient(135deg, rgba(245, 158, 11, 0.35), rgba(217, 119, 6, 0.45))"
                    : "rgba(26, 18, 48, 0.9)",
                  border: preset.popular ? "1.5px solid #F59E0B" : "1px solid rgba(212, 175, 55, 0.35)",
                  borderRadius: 12,
                  padding: "8px 14px",
                  color: "#FDE68A",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#F59E0B"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = preset.popular ? "#F59E0B" : "rgba(212, 175, 55, 0.35)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <span style={{ fontSize: 14, fontWeight: 800 }}>{preset.amount}</span>
                <span style={{ fontSize: 11, color: "rgba(241, 231, 208, 0.75)" }}>({preset.label})</span>
                {preset.popular && <span style={{ fontSize: 10, background: "#F59E0B", color: "#0F0A1E", padding: "1px 6px", borderRadius: 8, fontWeight: 800 }}>⭐ {hi ? "लोकप्रिय" : "Popular"}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", position: "relative", zIndex: 2 }}>
          <button
            onClick={() => openDakshina()}
            className="gold-cta-btn"
            style={{
              background: "linear-gradient(90deg, #F59E0B, #D97706)",
              border: "none",
              color: "#0F0A1E",
              padding: "13px 28px",
              borderRadius: 10,
              fontSize: 14.5,
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(245, 158, 11, 0.4)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8
            }}
          >
            <span style={{ fontSize: 16 }}>🪷</span>
            <span>{hi ? "श्रद्धा दक्षिणा अर्पित करें (Offer Dakshina)" : "Offer Dakshina Now (श्रद्धा दक्षिणा)"}</span>
          </button>

          <span style={{ fontSize: 12.5, color: "rgba(241, 231, 208, 0.75)", fontStyle: "italic" }}>
            🔒 {isINR ? "PhonePe, Google Pay, Paytm UPI QR समर्थित" : "Instant & Secure PayPal Contribution"} · {hi ? "शत प्रतिशत सुरक्षित व पूर्णतः स्वैच्छिक" : "100% Secure & Purely Voluntary"}
          </span>
        </div>
      </div>
    );
  };

  const resultRef = useRef(null);
  const t = UI[lang];
  const hi = lang === "hi";

  // Standalone Feature State (Direct Access without Birth Details)
  const [mainSection, setMainSection] = useState("kundli"); // "kundli", "panchang", "muhurat", "festivals", "daily"
  const [panchangDate, setPanchangDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [panchangCity, setPanchangCity] = useState(MAJOR_INDIAN_CITIES[0]);
  const [choghadiyaPeriod, setChoghadiyaPeriod] = useState("day");
  const [muhuratCategory, setMuhuratCategory] = useState("all");
  const [festivalFilter, setFestivalFilter] = useState("all");
  const [festivalSearch, setFestivalSearch] = useState("");

  const panchangData = calculateDailyPanchang({
    dateStr: panchangDate,
    lat: panchangCity.lat,
    lon: panchangCity.lon,
    cityName: hi ? panchangCity.nameHi : panchangCity.name,
    lang
  });

  const filteredMuhurats = getUpcomingShubhMuhurats({
    category: muhuratCategory,
    lang
  });

  const filteredFestivals = getUpcomingFestivalsAndVrats({
    filter: festivalFilter,
    lang
  }).filter(f => {
    if (!festivalSearch.trim()) return true;
    const q = festivalSearch.toLowerCase();
    return f.nameEn.toLowerCase().includes(q) || f.nameHi.includes(q) || f.month.toLowerCase().includes(q);
  });

  // Current real-time date (YYYY-MM-DD)
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Today's Panchang Data (computed for today's date for real-time status)
  const todayPanchangData = useMemo(() => {
    return calculateDailyPanchang({
      dateStr: todayStr,
      lat: panchangCity.lat,
      lon: panchangCity.lon,
      cityName: hi ? panchangCity.nameHi : panchangCity.name,
      lang
    });
  }, [todayStr, panchangCity, hi, lang]);

  // Today's active festival or fast (null if regular day)
  const todayFestival = useMemo(() => {
    return getFestivalOrVratForDate(todayStr, todayPanchangData);
  }, [todayStr, todayPanchangData]);

  // Active festival or fast for the user-selected panchang date
  const selectedPanchangFestival = useMemo(() => {
    return getFestivalOrVratForDate(panchangDate, panchangData);
  }, [panchangDate, panchangData]);

  // Sync daily horoscope sign when Kundli result loads
  useEffect(() => {
    if (result?.rashiSign) {
      setDailySign(result.rashiSign);
    }
  }, [result]);

  const run = async () => {
    if (!form.name.trim() || !form.dob || !form.pob.trim()) {
      setErr(t.errFields);
      return;
    }
    setErr("");
    setStep(1);
    setResult(null);

    try {
      let lat = 26.8467;
      let lon = 80.9462;

      try {
        const coords = await getCoordinates(form.pob);
        if (coords && coords.lat && coords.lon) {
          lat = coords.lat;
          lon = coords.lon;
          setLastCoords({ lat, lon });
        }
      } catch (geoErr) {
        console.warn("Geocoding failed, using regional coordinates", geoErr);
      }

      await new Promise(r => setTimeout(r, 400));
      setStep(2);

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
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 150);
    } catch (e) {
      console.error(e);
      setErr(t.errApi);
    } finally {
      setStep(0);
    }
  };

  const handleRunGunMilan = () => {
    if (!partnerForm.name || !partnerForm.dob) {
      alert(t.errPartnerFields || (hi ? "कृपया जीवनसाथी का नाम और जन्म तिथि दर्ज करें।" : "Please enter partner name and date of birth."));
      return;
    }
    const res = calculateGunMilan({
      partner1: { name: form.name || "Primary Native", dob: form.dob, tob: form.tob },
      partner2: partnerForm
    });
    setMilanResult(res);
  };

  const handleLangToggle = () => {
    const newLang = lang === "en" ? "hi" : "en";
    setLang(newLang);
    if (err) {
      setErr(UI[newLang].errFields);
    }
    if (result && form.dob && form.pob) {
      try {
        const updated = generateVedicKundliData({
          name: form.name,
          dob: form.dob,
          tob: form.tob,
          pob: form.pob,
          lat: lastCoords.lat,
          lon: lastCoords.lon,
          lang: newLang
        });
        setResult(updated);
      } catch (e) {
        console.error(e);
      }
    }
    if (milanResult && partnerForm.name && partnerForm.dob) {
      try {
        const updatedMilan = calculateGunMilan({
          partner1: { name: form.name || "Primary Native", dob: form.dob, tob: form.tob },
          partner2: partnerForm
        });
        setMilanResult(updatedMilan);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // ── RENDER HELPER: SEEKER TESTIMONIALS ────────────────────────────
  const renderTestimonialsSection = () => (
    <section className="no-print" style={{ marginBottom: 36, animation: "fadeInCard 0.4s ease" }}>
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#F59E0B", fontSize: 12, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase" }}>
          <span>🌟</span> {hi ? "विश्वसनीय जातक अनुभव" : "AUTHENTIC SEEKER TESTIMONIALS"}
        </div>
        <h3 style={{ color: "#F3D37A", fontSize: 22, fontWeight: 800, marginTop: 4 }}>
          {hi ? "हजारों जातकों का विश्वास एवं प्रामाणिक अनुभव" : "Trusted by Thousands of Seekers Worldwide"}
        </h3>
        <p style={{ color: "rgba(241,231,208,0.75)", fontSize: 13.5, maxWidth: 620, margin: "4px auto 0" }}>
          {hi ? "पाराशर पद्धति की खगोलीय सटीकता, दशा भविष्यवाणियों एवं निःशुल्क सेवा पर जातकों के विचार" : "Real reflections on Parashari mathematical accuracy, dasha milestones & free Vedic insight"}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {SEEKER_TESTIMONIALS.map((tItem, idx) => (
          <div
            key={idx}
            className="glass-card"
            style={{
              padding: "22px 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              border: "1px solid rgba(212,175,55,0.22)",
              borderRadius: 14,
              boxShadow: "0 6px 20px rgba(0,0,0,0.3)"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ color: "#F59E0B", fontSize: 14, letterSpacing: 2 }}>
                  {"★".repeat(tItem.stars)}
                </div>
                <span style={{ fontSize: 11, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#34D399", padding: "2px 8px", borderRadius: 8, fontWeight: 700 }}>
                  ✓ {hi ? "प्रमाणित जातक" : "Verified Seeker"}
                </span>
              </div>
              <p style={{ color: "rgba(241,231,208,0.92)", fontSize: 13, lineHeight: 1.7, fontStyle: "italic", margin: "0 0 14px" }}>
                "{hi ? tItem.quoteHi : tItem.quoteEn}"
              </p>
            </div>

            <div style={{ borderTop: "1px solid rgba(212,175,55,0.15)", paddingTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #F59E0B, #D97706)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0F0A1E", fontWeight: 900, fontSize: 13 }}>
                {tItem.name.charAt(0)}
              </div>
              <div>
                <div style={{ color: "#FDE68A", fontSize: 13, fontWeight: 800 }}>{tItem.name}</div>
                <div style={{ color: "rgba(241,231,208,0.7)", fontSize: 11.5 }}>
                  {hi ? tItem.roleHi : tItem.roleEn} · {tItem.location}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  // ── RENDER HELPER: VEDIC FAQ ACCORDION ─────────────────────────────
  const renderFaqSection = () => (
    <section className="no-print" style={{ marginBottom: 40, animation: "fadeInCard 0.4s ease" }}>
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#F59E0B", fontSize: 12, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase" }}>
          <span>❓</span> {hi ? "सामान्य जिज्ञासाएं एवं समाधान" : "FREQUENTLY ASKED QUESTIONS"}
        </div>
        <h3 style={{ color: "#F3D37A", fontSize: 22, fontWeight: 800, marginTop: 4 }}>
          {hi ? "वैदिक ज्योतिष एवं गणना संबंधी प्रश्नोत्तर" : "Understanding Vedic Astrology & Your Kundli"}
        </h3>
        <p style={{ color: "rgba(241,231,208,0.75)", fontSize: 13.5, maxWidth: 640, margin: "4px auto 0" }}>
          {hi ? "सटीक जन्म समय, अयनांश, महा-रिपोर्ट व गोपनीयता संबंधी महत्वपूर्ण शास्त्रीय स्पष्टीकरण" : "Classical clarification on birth accuracy, Lahiri Ayanamsha, and client data privacy"}
        </p>
      </div>

      <div style={{ maxWidth: 840, margin: "0 auto", display: "flex", flexDirection: "column", gap: 10 }}>
        {VEDIC_FAQS.map((faq, idx) => {
          const isOpen = openFaqIndex === idx;
          return (
            <div
              key={idx}
              className="glass-card"
              style={{
                border: isOpen ? "1.5px solid #F59E0B" : "1px solid rgba(212,175,55,0.22)",
                borderRadius: 12,
                overflow: "hidden",
                transition: "all 0.2s ease"
              }}
            >
              <button
                type="button"
                onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "16px 20px",
                  background: isOpen ? "rgba(245,158,11,0.12)" : "transparent",
                  border: "none",
                  color: isOpen ? "#FDE68A" : "#FFF",
                  fontSize: 14.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12
                }}
              >
                <span>{hi ? faq.qHi : faq.qEn}</span>
                <span style={{ fontSize: 14, color: "#F59E0B", transition: "transform 0.2s ease", transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}>
                  ▼
                </span>
              </button>

              {isOpen && (
                <div style={{ padding: "0 20px 18px", color: "rgba(241,231,208,0.9)", fontSize: 13.5, lineHeight: 1.75, borderTop: "1px solid rgba(212,175,55,0.15)", paddingTop: 14 }}>
                  {hi ? faq.aHi : faq.aEn}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );

  // ── RENDER HELPER: HINDU PANCHANG ────────────────────────────────
  const renderPanchangContent = () => (
    <div className="glass-card" style={{ padding: "28px 26px", marginBottom: 26, animation: "fadeInCard 0.4s ease" }}>
      {/* Visual Photographic Banner */}
      <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", marginBottom: 20, height: 140, boxShadow: "0 4px 16px rgba(0,0,0,0.5)" }}>
        <img src="/images/feature_panchang.jpg" alt="Vedic Panchang Sunrise" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(15,10,32,0.92) 20%, rgba(15,10,32,0.65) 60%, transparent 100%)", display: "flex", alignItems: "center", padding: "0 24px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#F59E0B", fontSize: 11.5, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" }}>
              <Icons.Sun size={14} color="#F59E0B" /> {hi ? "प्रामाणिक वैदिक पंचांग" : "AUTHENTIC SIDEREAL PANCHANGA"}
            </div>
            <h2 style={{ color: "#FFF", fontSize: 20, fontWeight: 800, margin: "4px 0 2px" }}>
              {hi ? "दैनिक पंचांग, सूर्योदय, चंद्रोदय एवं चौघड़िया मुहूर्त" : "Daily Sidereal Ephemeris & Tithi Almanac"}
            </h2>
            <div style={{ color: "#FDE68A", fontSize: 12.5, fontWeight: 600 }}>
              {hi ? "ऋषि पाराशर एवं सूर्य सिद्धांत खगोलीय गणना" : "Surya Siddhanta Astronomical Precision"}
            </div>
          </div>
        </div>
      </div>

      {/* Panchang Header Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, borderBottom: "1px solid rgba(212,175,55,0.25)", paddingBottom: 18, marginBottom: 20 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#F59E0B", fontSize: 12.5, fontWeight: 800, letterSpacing: 1 }}>
            <Icons.Sun size={14} color="#F59E0B" /> {hi ? "वैदिक पंचांग गणना" : "DAILY SIDEREAL PANCHANG"}
          </div>
          <h3 style={{ color: "#F3D37A", fontSize: 22, fontWeight: 800, marginTop: 2 }}>
            {panchangData.displayDate}
          </h3>
          <div style={{ fontSize: 13, color: "rgba(243,211,122,0.85)", marginTop: 2 }}>
            {hi ? `विक्रम संवत ${panchangData.vikramSamvat} · शक संवत ${panchangData.shakaSamvat} · ${panchangData.masa} मास · ${panchangData.ritu}` : `Vikram Samvat ${panchangData.vikramSamvat} · Shaka ${panchangData.shakaSamvat} · ${panchangData.masa} Masa · ${panchangData.ritu}`}
          </div>
        </div>

        {/* Date & Location Switchers */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {/* Quick Date Switcher */}
          <div style={{ display: "flex", gap: 6, background: "rgba(0,0,0,0.4)", padding: "4px", borderRadius: 20, border: "1px solid rgba(212,175,55,0.2)" }}>
            <button
              onClick={() => {
                const d = new Date(panchangDate);
                d.setDate(d.getDate() - 1);
                setPanchangDate(d.toISOString().split("T")[0]);
              }}
              style={{ background: "transparent", border: "none", color: "#FDE68A", padding: "4px 10px", borderRadius: 14, fontSize: 12, cursor: "pointer" }}
              title="Yesterday"
            >
              ◀ {hi ? "कल" : "Prev"}
            </button>
            <button
              onClick={() => setPanchangDate(new Date().toISOString().split("T")[0])}
              style={{ background: "rgba(245,158,11,0.25)", border: "1px solid rgba(245,158,11,0.4)", color: "#FFF", padding: "4px 12px", borderRadius: 14, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
            >
              {hi ? "आज" : "Today"}
            </button>
            <button
              onClick={() => {
                const d = new Date(panchangDate);
                d.setDate(d.getDate() + 1);
                setPanchangDate(d.toISOString().split("T")[0]);
              }}
              style={{ background: "transparent", border: "none", color: "#FDE68A", padding: "4px 10px", borderRadius: 14, fontSize: 12, cursor: "pointer" }}
              title="Tomorrow"
            >
              {hi ? "कल" : "Next"} ▶
            </button>
          </div>

          {/* Date Picker */}
          <input
            type="date"
            aria-label="Panchang Date"
            value={panchangDate}
            onChange={e => setPanchangDate(e.target.value)}
            style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 10, padding: "7px 12px", color: "#FFF", fontSize: 13, colorScheme: "dark" }}
          />

          {/* City Selector */}
          <select
            aria-label="Panchang City"
            value={panchangCity.name}
            onChange={e => {
              const c = MAJOR_INDIAN_CITIES.find(city => city.name === e.target.value);
              if (c) setPanchangCity(c);
            }}
            style={{ background: "rgba(26,18,48,0.9)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 10, padding: "8px 12px", color: "#FDE68A", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            {MAJOR_INDIAN_CITIES.map(c => (
              <option key={c.name} value={c.name} style={{ background: "#0F0A1E", color: "#FFF" }}>
                📍 {hi ? c.nameHi : c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── ACTIVE FESTIVAL / VRAT BANNER FOR THIS DATE ── */}
      {selectedPanchangFestival && (
        <div
          style={{
            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.22), rgba(180, 83, 9, 0.32))",
            border: "1.5px solid #F59E0B",
            borderRadius: 14,
            padding: "16px 20px",
            marginBottom: 22,
            boxShadow: "0 6px 20px rgba(245, 158, 11, 0.22)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            animation: "fadeInCard 0.3s ease"
          }}
        >
          <div style={{ flex: "1 1 320px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 18 }}>🚩</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#FDE68A", letterSpacing: 0.5, textTransform: "uppercase" }}>
                {panchangDate === todayStr ? (hi ? "आज का पावन पर्व व व्रत" : "Today's Sacred Festival & Fast") : (hi ? "इस तिथि का पावन पर्व / व्रत" : "Festival on this Date")}
              </span>
              <span style={{ background: "#F59E0B", color: "#0F0A1E", fontSize: 10.5, fontWeight: 800, padding: "2px 8px", borderRadius: 10 }}>
                {hi ? "विशेष व्रत" : "Active Vrat"}
              </span>
            </div>
            <h4 style={{ color: "#FFF", fontSize: 19, fontWeight: 800, margin: "2px 0 6px" }}>
              {hi ? selectedPanchangFestival.nameHi : selectedPanchangFestival.nameEn}
            </h4>
            <p style={{ color: "rgba(241, 231, 208, 0.95)", fontSize: 13, lineHeight: 1.5, margin: "0 0 8px" }}>
              {hi ? selectedPanchangFestival.significanceHi : selectedPanchangFestival.significanceEn}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, fontSize: 12.5, color: "#FDE68A" }}>
              <span>🪔 <b>{hi ? "पूजा मुहूर्त:" : "Puja Muhurat:"}</b> {hi ? selectedPanchangFestival.pujaMuhuratHi : selectedPanchangFestival.pujaMuhuratEn}</span>
              <span>🙏 <b>{hi ? "व्रत नियम:" : "Fasting:"}</b> {hi ? selectedPanchangFestival.fastingRulesHi : selectedPanchangFestival.fastingRulesEn}</span>
            </div>
          </div>
          <button
            onClick={() => setMainSection("festivals")}
            className="gold-cta-btn"
            style={{
              padding: "10px 18px",
              fontSize: 13,
              fontWeight: 800,
              whiteSpace: "nowrap"
            }}
          >
            {hi ? "संपूर्ण व्रत कैलेंडर देखें →" : "View Festival Calendar →"}
          </button>
        </div>
      )}

      {/* Core 4-Box Metric Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
        <div style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 12, color: "rgba(243,211,122,0.85)", fontWeight: 700 }}>🌙 {hi ? "तिथि एवं पक्ष" : "Tithi & Paksha"}</div>
          <div style={{ fontSize: 16.5, color: "#FDE68A", fontWeight: 800, marginTop: 4 }}>{panchangData.tithi}</div>
          <div style={{ fontSize: 12, color: "#34D399", fontWeight: 600, marginTop: 2 }}>{panchangData.paksha}</div>
        </div>

        <div style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 12, color: "rgba(243,211,122,0.85)", fontWeight: 700 }}>🌟 {hi ? "नक्षत्र एवं पद" : "Nakshatra & Pada"}</div>
          <div style={{ fontSize: 16.5, color: "#FDE68A", fontWeight: 800, marginTop: 4 }}>{panchangData.nakshatra}</div>
          <div style={{ fontSize: 12, color: "rgba(241,231,208,0.8)", marginTop: 2 }}>
            {hi ? `पद ${panchangData.pada} · स्वामी: ${panchangData.nakshatraLord}` : `Pada ${panchangData.pada} · Lord: ${panchangData.nakshatraLord}`}
          </div>
        </div>

        <div style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 12, color: "rgba(243,211,122,0.85)", fontWeight: 700 }}>⚡ {hi ? "योग एवं करण" : "Yoga & Karana"}</div>
          <div style={{ fontSize: 16.5, color: "#FDE68A", fontWeight: 800, marginTop: 4 }}>{panchangData.yoga} {hi ? "योग" : "Yoga"}</div>
          <div style={{ fontSize: 12, color: "rgba(241,231,208,0.8)", marginTop: 2 }}>
            {hi ? `${panchangData.karana} करण (स्वामी: ${panchangData.karanaRuler})` : `${panchangData.karana} Karana (${panchangData.karanaRuler})`}
          </div>
        </div>

        <div style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 12, color: "rgba(243,211,122,0.85)", fontWeight: 700 }}>☀️ {hi ? "वार एवं राशि स्थिति" : "Weekday & Moon/Sun"}</div>
          <div style={{ fontSize: 16.5, color: "#FDE68A", fontWeight: 800, marginTop: 4 }}>{panchangData.vaar}</div>
          <div style={{ fontSize: 12, color: "rgba(241,231,208,0.8)", marginTop: 2 }}>
            {hi ? `सूर्य: ${panchangData.sunSign} · चंद्र: ${panchangData.moonSign}` : `Sun: ${panchangData.sunSign} · Moon: ${panchangData.moonSign}`}
          </div>
        </div>
      </div>

      {/* 2 Columns: Auspicious Timings vs Inauspicious & Disha Shool */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18, marginBottom: 24 }}>
        {/* Auspicious Timings Card */}
        <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 14, padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, borderBottom: "1px solid rgba(16,185,129,0.2)", paddingBottom: 8 }}>
            <h4 style={{ color: "#34D399", fontSize: 15, fontWeight: 800, margin: 0 }}>
              ✨ {hi ? "शुभ काल एवं सूर्य-चंद्र चक्र" : "Auspicious Timings & Solar Cycle"}
            </h4>
            <span style={{ fontSize: 12, color: "rgba(241,231,208,0.8)" }}>📍 {panchangData.cityName}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14, background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: "10px 12px" }}>
            <div>
              <div style={{ fontSize: 11.5, color: "#FDE68A" }}>🌅 {hi ? "सूर्योदय" : "Sunrise"}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#FFF" }}>{panchangData.sunrise}</div>
            </div>
            <div>
              <div style={{ fontSize: 11.5, color: "#FDE68A" }}>🌇 {hi ? "सूर्यास्त" : "Sunset"}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#FFF" }}>{panchangData.sunset}</div>
            </div>
            <div>
              <div style={{ fontSize: 11.5, color: "#FDE68A" }}>🌙 {hi ? "चंद्रोदय" : "Moonrise"}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#FFF" }}>{panchangData.moonrise}</div>
            </div>
            <div>
              <div style={{ fontSize: 11.5, color: "#FDE68A" }}>🌚 {hi ? "चंद्रास्त" : "Moonset"}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#FFF" }}>{panchangData.moonset}</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", background: "rgba(16,185,129,0.1)", borderRadius: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#FDE68A" }}>🌟 {hi ? "अभिजीत मुहूर्त (सर्वश्रेष्ठ)" : "Abhijit Muhurat"}</span>
              <span style={{ fontSize: 13.5, fontWeight: 800, color: "#34D399" }}>{panchangData.muhurats.abhijit}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 6 }}>
              <span style={{ fontSize: 13, color: "rgba(241,231,208,0.9)" }}>🪷 {hi ? "ब्रह्म मुहूर्त (साधना)" : "Brahma Muhurat"}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#FDE68A" }}>{panchangData.muhurats.brahma}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 6 }}>
              <span style={{ fontSize: 13, color: "rgba(241,231,208,0.9)" }}>✨ {hi ? "अमृत काल" : "Amrit Kaal"}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#FDE68A" }}>{panchangData.muhurats.amritKaal}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 6 }}>
              <span style={{ fontSize: 13, color: "rgba(241,231,208,0.9)" }}>🏆 {hi ? "विजय मुहूर्त" : "Vijay Muhurat"}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#FDE68A" }}>{panchangData.muhurats.vijay}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 6 }}>
              <span style={{ fontSize: 13, color: "rgba(241,231,208,0.9)" }}>🌅 {hi ? "गोधूलि मुहूर्त" : "Godhuli Muhurat"}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#FDE68A" }}>{panchangData.muhurats.godhuli}</span>
            </div>
          </div>
        </div>

        {/* Inauspicious & Disha Shool Card */}
        <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 14, padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, borderBottom: "1px solid rgba(239,68,68,0.2)", paddingBottom: 8 }}>
            <h4 style={{ color: "#F87171", fontSize: 15, fontWeight: 800, margin: 0 }}>
              ⚠️ {hi ? "अशुभ काल व दिशाशूल (त्याज्य समय)" : "Inauspicious Timings & Disha Shool"}
            </h4>
            <span style={{ fontSize: 12, color: "#FCA5A5" }}>{hi ? "नए कार्य न करें" : "Avoid Key Launches"}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8 }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: "#FCA5A5" }}>⚠️ {hi ? "राहु काल (अति त्याज्य)" : "Rahu Kaal"}</div>
                <div style={{ fontSize: 11.5, color: "rgba(241,231,208,0.75)" }}>{hi ? "शुभ कार्य व यात्रा पूर्णतः वर्जित" : "Avoid any new auspicious beginnings"}</div>
              </div>
              <span style={{ fontSize: 14.5, fontWeight: 800, color: "#EF4444", alignSelf: "center" }}>{panchangData.inauspicious.rahuKaal}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 6 }}>
              <span style={{ fontSize: 13, color: "rgba(241,231,208,0.9)" }}>⛔ {hi ? "यमगण्ड काल" : "Yamaganda"}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#F87171" }}>{panchangData.inauspicious.yamaganda}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 6 }}>
              <span style={{ fontSize: 13, color: "rgba(241,231,208,0.9)" }}>🛑 {hi ? "गुलिक काल" : "Gulika Kaal"}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#F87171" }}>{panchangData.inauspicious.gulika}</span>
            </div>
          </div>

          {/* Disha Shool Banner */}
          <div style={{ background: "rgba(245,158,11,0.08)", border: "1px dashed rgba(245,158,11,0.35)", borderRadius: 8, padding: "12px 14px" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#FDE68A", marginBottom: 4 }}>
              🧭 {hi ? `आज का दिशाशूल: ${panchangData.dishashool}` : `Today's Disha Shool: ${panchangData.dishashool}`}
            </div>
            <div style={{ fontSize: 12.5, color: "rgba(241,231,208,0.85)", lineHeight: 1.5 }}>
              <b>{hi ? "निवारण उपाय:" : "Remedy:"}</b> {panchangData.dishashoolRemedy}
            </div>
          </div>
        </div>
      </div>

      {/* Full Daily Choghadiya Table */}
      <div style={{ background: "rgba(11,8,25,0.8)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 14, padding: "20px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 12, marginBottom: 16 }}>
          <div>
            <h4 style={{ color: "#F3D37A", fontSize: 16, fontWeight: 800, margin: 0 }}>
              ⏱️ {hi ? "दैनिक चौघड़िया चक्र (Choghadiya Muhurat)" : "Daily Choghadiya Planetary Clock"}
            </h4>
            <p style={{ fontSize: 12, color: "rgba(243,211,122,0.8)", margin: "2px 0 0" }}>
              {hi ? "यात्रा, क्रय-विक्रय व व्यावसायिक कार्यों हेतु समय का सटीक विभाजन" : "Classical 8-part astrological timing divisions"}
            </p>
          </div>

          <div style={{ display: "flex", background: "rgba(0,0,0,0.5)", borderRadius: 20, padding: 3, border: "1px solid rgba(212,175,55,0.25)" }}>
            <button
              onClick={() => setChoghadiyaPeriod("day")}
              style={{ background: choghadiyaPeriod === "day" ? "linear-gradient(135deg, #F59E0B, #D97706)" : "transparent", border: "none", color: choghadiyaPeriod === "day" ? "#0F0A1E" : "#FDE68A", padding: "6px 16px", borderRadius: 16, fontSize: 12.5, fontWeight: 800, cursor: "pointer" }}
            >
              ☀️ {hi ? "दिन का चौघड़िया" : "Day Choghadiya"}
            </button>
            <button
              onClick={() => setChoghadiyaPeriod("night")}
              style={{ background: choghadiyaPeriod === "night" ? "linear-gradient(135deg, #A78BFA, #6366F1)" : "transparent", border: "none", color: choghadiyaPeriod === "night" ? "#0F0A1E" : "#FDE68A", padding: "6px 16px", borderRadius: 16, fontSize: 12.5, fontWeight: 800, cursor: "pointer" }}
            >
              🌙 {hi ? "रात का चौघड़िया" : "Night Choghadiya"}
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10 }}>
          {(choghadiyaPeriod === "day" ? panchangData.dayChoghadiya : panchangData.nightChoghadiya).map((slot, i) => (
            <div key={i} style={{ background: "rgba(0,0,0,0.35)", border: `1px solid ${slot.color}35`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: slot.color }}>{slot.name}</span>
                <span style={{ fontSize: 11, background: `${slot.color}20`, color: slot.color, padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>
                  {slot.quality}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#FFF", fontWeight: 600 }}>{slot.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── RENDER HELPER: SHUBH MUHURAT DIRECTORY ────────────────────────
  const renderMuhuratContent = () => (
    <div className="glass-card" style={{ padding: "28px 26px", marginBottom: 26, animation: "fadeInCard 0.4s ease" }}>
      {/* Visual Photographic Banner */}
      <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", marginBottom: 22, height: 140, boxShadow: "0 4px 16px rgba(0,0,0,0.5)" }}>
        <img src="/images/feature_muhurat.jpg" alt="Auspicious Temple Sanctum" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(15,10,32,0.92) 20%, rgba(15,10,32,0.65) 60%, transparent 100%)", display: "flex", alignItems: "center", padding: "0 24px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#34D399", fontSize: 11.5, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" }}>
              <Icons.Clock size={14} color="#34D399" /> {hi ? "शुभ मुहूर्त गणना" : "AUTHENTIC AUSPICIOUS TIMINGS"}
            </div>
            <h2 style={{ color: "#FFF", fontSize: 20, fontWeight: 800, margin: "4px 0 2px" }}>
              {hi ? "आगामी सर्व शुभ मुहूर्त डायरेक्टरी (2026–2027)" : "Upcoming Auspicious Muhurats Directory"}
            </h2>
            <div style={{ color: "#FDE68A", fontSize: 12.5, fontWeight: 600 }}>
              {hi ? "विवाह, गृह प्रवेश, वाहन, संपत्ति व व्यापार मुहूर्त" : "Parashari Certified Timings for Life's Major Milestones"}
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 22 }}>
        {SHUBH_MUHURAT_CATEGORIES.map(cat => {
          const isSel = muhuratCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setMuhuratCategory(cat.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: isSel ? "linear-gradient(135deg, #F59E0B, #D97706)" : "rgba(11,8,25,0.7)",
                border: isSel ? "none" : "1px solid rgba(212,175,55,0.25)",
                color: isSel ? "#0F0A1E" : "#FDE68A",
                padding: "7px 14px",
                borderRadius: 20,
                fontSize: 12.5,
                fontWeight: isSel ? 800 : 600,
                cursor: "pointer"
              }}
            >
              <span>{cat.icon}</span>
              <span>{hi ? cat.labelHi : cat.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Muhurats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        {filteredMuhurats.map((m, idx) => (
          <div key={idx} style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, borderBottom: "1px solid rgba(212,175,55,0.18)", paddingBottom: 8 }}>
              <span style={{ fontSize: 12, background: "rgba(245,158,11,0.18)", color: "#FDE68A", padding: "3px 10px", borderRadius: 12, fontWeight: 800 }}>
                {SHUBH_MUHURAT_CATEGORIES.find(c => c.id === m.category)?.[hi ? "labelHi" : "labelEn"] || m.category}
              </span>
              <span style={{ fontSize: 12, color: "#34D399", fontWeight: 700 }}>
                ✨ {hi ? m.yogaHi : m.yogaEn}
              </span>
            </div>

            <h4 style={{ color: "#FFF", fontSize: 17, fontWeight: 800, margin: "0 0 4px" }}>
              {new Date(m.date).toLocaleDateString(hi ? "hi-IN" : "en-US", { day: "numeric", month: "long", year: "numeric" })}, {hi ? m.dayHi : m.dayEn}
            </h4>

            <div style={{ fontSize: 12.5, color: "rgba(243,211,122,0.9)", marginBottom: 8 }}>
              🌙 {hi ? m.tithiHi : m.tithiEn} · 🌟 {hi ? m.nakshatraHi : m.nakshatraEn}
            </div>

            <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 8, padding: "8px 12px", color: "#34D399", fontSize: 13, fontWeight: 800, marginBottom: 10 }}>
              ⏱️ {hi ? m.timeHi : m.timeEn}
            </div>

            <p style={{ fontSize: 12.5, color: "rgba(241,231,208,0.85)", lineHeight: 1.6, margin: 0 }}>
              {hi ? m.noteHi : m.noteEn}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  // ── RENDER HELPER: HINDU FESTIVALS & VRAT CALENDAR ───────────────
  const renderFestivalsContent = () => (
    <div className="glass-card" style={{ padding: "28px 26px", marginBottom: 26, animation: "fadeInCard 0.4s ease" }}>
      {/* Visual Photographic Banner */}
      <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", marginBottom: 22, height: 140, boxShadow: "0 4px 16px rgba(0,0,0,0.5)" }}>
        <img src="/images/feature_festivals.jpg" alt="Traditional Brass Diyas and Rangoli" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(15,10,32,0.92) 20%, rgba(15,10,32,0.65) 60%, transparent 100%)", display: "flex", alignItems: "center", padding: "0 24px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#F59E0B", fontSize: 11.5, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" }}>
              <Icons.Flame size={14} color="#F59E0B" /> {hi ? "सनातन धर्म के पावन पर्व" : "HINDU SACRED CALENDAR"}
            </div>
            <h2 style={{ color: "#FFF", fontSize: 20, fontWeight: 800, margin: "4px 0 2px" }}>
              {hi ? "व्रत, पर्व एवं त्यौहार पंचांग (2026–2027)" : "Vedic Fasting, Festivals & Vrat Almanac"}
            </h2>
            <div style={{ color: "#FDE68A", fontSize: 12.5, fontWeight: 600 }}>
              {hi ? "एकादशी, प्रदोष, दीपावली, छठ, नवरात्रि व समस्त व्रत" : "Authentic Tithi Timings, Fasting Rules & Puja Muhurats"}
            </div>
          </div>
        </div>
      </div>

      {/* ── TODAY'S ACTIVE FESTIVAL HIGHLIGHT SPOTLIGHT ── */}
      {todayFestival && (
        <div
          style={{
            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(180, 83, 9, 0.35))",
            border: "2px solid #F59E0B",
            borderRadius: 14,
            padding: "20px 22px",
            marginBottom: 24,
            boxShadow: "0 8px 24px rgba(245, 158, 11, 0.28)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 8 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#F59E0B", color: "#0F0A1E", padding: "3px 10px", borderRadius: 12, fontSize: 11.5, fontWeight: 800 }}>
              <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#DC2626" }} />
              {hi ? "आज का पावन पर्व व व्रत" : "TODAY'S SACRED FESTIVAL"}
            </div>
            <span style={{ fontSize: 12.5, color: "#34D399", fontWeight: 700 }}>
              📅 {new Date(todayFestival.date).toLocaleDateString(hi ? "hi-IN" : "en-US", { day: "numeric", month: "long", year: "numeric" })} ({hi ? todayFestival.dayHi : todayFestival.dayEn})
            </span>
          </div>

          <h3 style={{ color: "#FFF", fontSize: 22, fontWeight: 800, margin: "6px 0 8px" }}>
            {hi ? todayFestival.nameHi : todayFestival.nameEn}
          </h3>

          <div style={{ fontSize: 13, color: "rgba(243,211,122,0.9)", fontWeight: 600, marginBottom: 8 }}>
            🌙 {hi ? todayFestival.tithiHi : todayFestival.tithiEn}
          </div>

          <p style={{ color: "rgba(241, 231, 208, 0.95)", fontSize: 13.5, lineHeight: 1.6, margin: "0 0 14px", maxWidth: 780 }}>
            {hi ? todayFestival.significanceHi : todayFestival.significanceEn}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10, borderTop: "1px solid rgba(245, 158, 11, 0.3)", paddingTop: 12 }}>
            <div style={{ fontSize: 12.5, color: "#FDE68A" }}>
              🪔 <b>{hi ? "पूजा मुहूर्त:" : "Puja Muhurat:"}</b> {hi ? todayFestival.pujaMuhuratHi : todayFestival.pujaMuhuratEn}
            </div>
            <div style={{ fontSize: 12.5, color: "#FDE68A" }}>
              🙏 <b>{hi ? "व्रत व उपवास नियम:" : "Fasting Rules:"}</b> {hi ? todayFestival.fastingRulesHi : todayFestival.fastingRulesEn}
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        {/* Category Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            { id: "all", label: hi ? "समस्त पर्व (All)" : "All Festivals" },
            { id: "major", label: hi ? "🌟 प्रमुख त्यौहार" : "Major Festivals" },
            { id: "ekadashi", label: hi ? "🌸 एकादशी व्रत" : "Ekadashi Vrats" },
            { id: "purnima_amavasya", label: hi ? "🌕 पूर्णिमा/अमावस्या" : "Purnima & Amavasya" },
            { id: "vrat", label: hi ? "📿 उपवास व अन्य व्रत" : "Fasts & Vrats" },
          ].map(f => {
            const isSel = festivalFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFestivalFilter(f.id)}
                style={{
                  background: isSel ? "linear-gradient(135deg, #F59E0B, #D97706)" : "rgba(11,8,25,0.7)",
                  border: isSel ? "none" : "1px solid rgba(212,175,55,0.25)",
                  color: isSel ? "#0F0A1E" : "#FDE68A",
                  padding: "7px 14px",
                  borderRadius: 20,
                  fontSize: 12.5,
                  fontWeight: isSel ? 800 : 600,
                  cursor: "pointer"
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <input
          type="text"
          placeholder={hi ? "त्यौहार या व्रत खोजें..." : "Search festival (e.g. Diwali, Ekadashi)..."}
          value={festivalSearch}
          onChange={e => setFestivalSearch(e.target.value)}
          style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 20, padding: "8px 16px", color: "#FFF", fontSize: 13, minWidth: 220 }}
        />
      </div>

      {/* Festivals Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 16 }}>
        {filteredFestivals.map((fest) => {
          const isToday = fest.date === todayStr;
          return (
            <div
              key={fest.id}
              style={{
                background: isToday
                  ? "linear-gradient(135deg, rgba(58, 30, 20, 0.95), rgba(30, 16, 42, 0.98))"
                  : "rgba(11,8,25,0.75)",
                border: isToday ? "2px solid #F59E0B" : "1px solid rgba(212,175,55,0.25)",
                borderRadius: 12,
                padding: "20px 22px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: isToday ? "0 0 20px rgba(245, 158, 11, 0.35)" : "none",
                position: "relative"
              }}
            >
              {isToday && (
                <div style={{ position: "absolute", top: -10, right: 14, background: "#F59E0B", color: "#0F0A1E", fontSize: 10.5, fontWeight: 900, padding: "2px 8px", borderRadius: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.4)" }}>
                  🌟 {hi ? "आज का पर्व (TODAY)" : "TODAY"}
                </div>
              )}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: isToday ? "#FDE68A" : "#34D399", fontWeight: 800 }}>
                    📅 {new Date(fest.date).toLocaleDateString(hi ? "hi-IN" : "en-US", { day: "numeric", month: "short", year: "numeric" })} ({hi ? fest.dayHi : fest.dayEn})
                  </span>
                  <span style={{ fontSize: 11, background: isToday ? "#F59E0B" : "rgba(245,158,11,0.2)", color: isToday ? "#0F0A1E" : "#FDE68A", padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>
                    {fest.month}
                  </span>
                </div>

                <h4 style={{ color: "#F3D37A", fontSize: 18, fontWeight: 800, margin: "0 0 4px" }}>
                  {hi ? fest.nameHi : fest.nameEn}
                </h4>

                <div style={{ fontSize: 12, color: "rgba(243,211,122,0.85)", marginBottom: 10 }}>
                  🌙 {hi ? fest.tithiHi : fest.tithiEn}
                </div>

                <p style={{ fontSize: 13, color: "rgba(241,231,208,0.9)", lineHeight: 1.6, marginBottom: 12 }}>
                  {hi ? fest.significanceHi : fest.significanceEn}
                </p>
              </div>

              <div style={{ borderTop: "1px solid rgba(212,175,55,0.15)", paddingTop: 10 }}>
                <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 6, padding: "6px 10px", color: "#FDE68A", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                  🪔 <b>{hi ? "शुभ पूजा मुहूर्त:" : "Puja Muhurat:"}</b> {hi ? fest.pujaMuhuratHi : fest.pujaMuhuratEn}
                </div>
                <div style={{ fontSize: 11.5, color: "rgba(241,231,208,0.8)", lineHeight: 1.5 }}>
                  <b>{hi ? "व्रत व पूजा नियम:" : "Fasting Rules:"}</b> {hi ? fest.fastingRulesHi : fest.fastingRulesEn}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── RENDER HELPER: DAILY HOROSCOPE & ALERTS ───────────────────────
  const renderDailyHoroscopeContent = () => {
    const daily = generateDailyHoroscope(dailySign, lang);
    const stars = (num) => "★".repeat(num || 3) + "☆".repeat(Math.max(0, 5 - (num || 3)));
    const activePrice = dailyPlan === "yearly" ? PRODUCT_PRICES.dailyYearly[currency] : PRODUCT_PRICES.dailyMonthly[currency];
    const activePriceKey = dailyPlan === "yearly" ? "dailyYearly" : "dailyMonthly";

    return (
      <div style={{ animation: "fadeInCard 0.4s ease" }}>
        {/* Visual Photographic Banner */}
        <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", marginBottom: 20, height: 140, boxShadow: "0 4px 16px rgba(0,0,0,0.5)", border: "1px solid rgba(212,175,55,0.25)" }}>
          <img src="/images/feature_horoscope.jpg" alt="12 Zodiac Constellations Armillary" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(15,10,32,0.92) 20%, rgba(15,10,32,0.65) 60%, transparent 100%)", display: "flex", alignItems: "center", padding: "0 24px" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#FBBF24", fontSize: 11.5, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" }}>
                <Icons.Sun size={14} color="#FBBF24" /> {hi ? "दैनिक राशिफल" : "DAILY HOROSCOPE & TRANSITS"}
              </div>
              <h2 style={{ color: "#FFF", fontSize: 20, fontWeight: 800, margin: "4px 0 2px" }}>
                {hi ? "ग्रह गोचर एवं नक्षत्र आधारित दैनिक भविष्यवाणी" : "Planetary Transits & Rashiphal Forecast"}
              </h2>
              <div style={{ color: "#FDE68A", fontSize: 12.5, fontWeight: 600 }}>
                {hi ? "करियर, वित्त, स्वास्थ्य, प्रेम एवं शुभ अंक/रंग" : "Career, Health, Love & Lucky Metrics for all 12 Signs"}
              </div>
            </div>
          </div>
        </div>

        {/* Zodiac Sign Carousel / Pills */}
        <div className="glass-card" style={{ padding: "16px 20px", marginBottom: 20, overflowX: "auto" }}>
          <div style={{ display: "flex", gap: 10, minWidth: "max-content" }}>
            {SIGNS.map(s => {
              const isSelected = dailySign.toLowerCase() === s.name.toLowerCase();
              return (
                <button
                  key={s.name}
                  onClick={() => setDailySign(s.name)}
                  style={{
                    background: isSelected ? "linear-gradient(135deg, #F59E0B, #D97706)" : "rgba(15,10,32,0.65)",
                    border: `1px solid ${isSelected ? "#F59E0B" : "rgba(212,175,55,0.25)"}`,
                    color: isSelected ? "#0F0A1E" : "#FDE68A",
                    padding: "10px 16px",
                    borderRadius: 12,
                    fontSize: 13.5,
                    fontWeight: isSelected ? 800 : 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    transition: "all 0.2s ease"
                  }}
                >
                  <span style={{ fontSize: 18 }}>{s.symbol}</span>
                  <span>{hi ? s.sanskrit : s.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Daily Horoscope Card */}
        <div className="glass-card" style={{ padding: "28px 30px", marginBottom: 20 }}>
          {/* Header with Alignment Score */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 16, marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 12, padding: "4px 12px", color: "#FDE68A", fontSize: 12, fontWeight: 800, marginBottom: 4 }}>
                <span>📅</span> {daily.dateStr}
              </div>
              <h3 style={{ color: "#F3D37A", fontSize: 19, fontWeight: 800, marginTop: 2 }}>
                {daily.symbol} {daily.sign} ({daily.signSanskrit}) — {hi ? "आज का विस्तृत राशिफल" : "Today's Vedic Transit Reading"}
              </h3>
            </div>

            <div style={{ textAlign: "right", background: "rgba(11,8,25,0.6)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 12, padding: "10px 18px" }}>
              <div style={{ fontSize: 12, color: "rgba(243,211,122,0.85)", fontWeight: 600 }}>{hi ? "दैनिक ग्रहीय अनुकूलता" : "Cosmic Harmony Score"}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#34D399" }}>{daily.overallScore}%</div>
            </div>
          </div>

          {/* 4 Category Ratings Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 22 }}>
            {[
              { name: hi ? "करियर व व्यवसाय" : "Career & Work", score: daily.careerScore, icon: "💼", color: "#60A5FA" },
              { name: hi ? "प्रेम व दांपत्य" : "Love & Family", score: daily.loveScore, icon: "❤️", color: "#F472B6" },
              { name: hi ? "धन व समृद्धि" : "Wealth & Gains", score: daily.wealthScore, icon: "💰", color: "#FBBF24" },
              { name: hi ? "स्वास्थ्य व ऊर्जा" : "Health & Vitality", score: daily.healthScore, icon: "🌿", color: "#34D399" },
            ].map((cat, idx) => (
              <div key={idx} style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 18 }}>{cat.icon}</div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#FDE68A", marginTop: 3 }}>{cat.name}</div>
                <div style={{ fontSize: 15, color: cat.color, marginTop: 4 }}>{stars(cat.score)}</div>
              </div>
            ))}
          </div>

          {/* What Will Go Good & What to be Cautious About (2 Column Split) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 20 }}>
            {/* 🟢 Positive / Opportunities */}
            <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 12, padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#34D399", fontSize: 14, fontWeight: 800, marginBottom: 8 }}>
                <span>🟢</span> {hi ? "आज क्या शुभ रहेगा (Opportunities & Wins)" : "What Will Go Good Today"}
              </div>
              <p style={{ color: "rgba(241,231,208,0.9)", fontSize: 14, lineHeight: 1.75, margin: 0 }}>
                {daily.good}
              </p>
            </div>

            {/* 🔴 Cautionary Advice / Pitfalls */}
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.35)", borderRadius: 12, padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#F87171", fontSize: 14, fontWeight: 800, marginBottom: 8 }}>
                <span>🔴</span> {hi ? "सावधानियां व चेतावनी (Alerts & Caution)" : "What to Watch Out For & Avoid"}
              </div>
              <p style={{ color: "rgba(241,231,208,0.9)", fontSize: 14, lineHeight: 1.75, margin: 0 }}>
                {daily.caution}
              </p>
            </div>
          </div>

          {/* 🛡️ Daily Vedic Remedy & Sacred Mantra */}
          <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.35)", borderRadius: 12, padding: "18px 20px", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#FDE68A", fontSize: 14, fontWeight: 800, marginBottom: 8 }}>
              <span>🛡️</span> {hi ? "आज का अचूक वैदिक उपाय (Daily Upay)" : "Prescribed Vedic Remedy of the Day"}
            </div>
            <p style={{ color: "rgba(241,231,208,0.92)", fontSize: 14, lineHeight: 1.75, margin: 0 }}>
              {daily.remedy}
            </p>
          </div>

          {/* 🎨 Daily Micro-Muhurat Card */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 12, padding: "16px 18px" }}>
            <div>
              <div style={{ fontSize: 12.5, color: "rgba(243,211,122,0.85)", fontWeight: 600 }}>🎨 {hi ? "भाग्यशाली रंग" : "Lucky Color"}</div>
              <div style={{ color: "#FDE68A", fontSize: 14.5, fontWeight: 800, marginTop: 2 }}>{daily.luckyColor}</div>
            </div>
            <div>
              <div style={{ fontSize: 12.5, color: "rgba(243,211,122,0.85)", fontWeight: 600 }}>🔢 {hi ? "भाग्यशाली अंक" : "Lucky Number"}</div>
              <div style={{ color: "#34D399", fontSize: 15, fontWeight: 800, marginTop: 2 }}>{daily.luckyNumber}</div>
            </div>
            <div>
              <div style={{ fontSize: 12.5, color: "rgba(243,211,122,0.85)", fontWeight: 600 }}>⏳ {hi ? "शुभ मुहूर्त" : "Auspicious Window"}</div>
              <div style={{ color: "#F3D37A", fontSize: 14, fontWeight: 800, marginTop: 2 }}>{daily.auspiciousWindow}</div>
            </div>
          </div>
        </div>

        {/* ── DAILY HOROSCOPE EMAIL INBOX SUBSCRIPTION BOX ── */}
        <div className="glass-card" style={{ padding: "28px 30px", marginBottom: 24, border: "1.5px solid rgba(245,158,11,0.45)", background: "linear-gradient(135deg, rgba(30,18,55,0.92), rgba(16,10,32,0.98))" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14, borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 18, marginBottom: 20 }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.18)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 14, padding: "4px 12px", color: "#FDE68A", fontSize: 12, fontWeight: 800, marginBottom: 6 }}>
                <span>📧</span> {hi ? "दैनिक ईमेल राशिफल सेवा" : "DAILY HOROSCOPE TO YOUR INBOX"}
              </div>
              <h3 style={{ color: "#F3D37A", fontSize: 20, fontWeight: 800 }}>
                {hi ? "नित्य प्रातः 7:00 बजे अपनी राशि का सटीक राशिफल ईमेल पर प्राप्त करें" : "Receive Daily Horoscope & Shubh Muhurat in Your Email Every Morning"}
              </h3>
              <p style={{ color: "rgba(241,231,208,0.85)", fontSize: 13.5, margin: "4px 0 0" }}>
                {hi ? "दैनिक ग्रहीय गोचर, शुभ समय, राहुकाल व अचूक लाल किताब उपाय सीधे आपके ईमेल इनबॉक्स पर।" : "Start each day with favorable planetary timings, Rahu Kaal warnings & Vedic remedies delivered directly to your inbox."}
              </p>
            </div>
          </div>

          {effectiveDailySubscribed ? (
            <div style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 12, padding: "18px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>🎉</div>
              <h4 style={{ color: "#34D399", fontSize: 16, fontWeight: 800, margin: "0 0 6px" }}>
                {hi ? "आपकी दैनिक राशिफल ईमेल सेवा सक्रिय है!" : "Your Daily Horoscope Email Service is Active!"}
              </h4>
              <p style={{ color: "rgba(241,231,208,0.9)", fontSize: 13.5, margin: 0 }}>
                {hi
                  ? `आपकी राशि (${dailySign}) के लिए दैनिक अलर्ट, शुभ मुहूर्त व उपाय आपके ईमेल पर नित्य प्रातः 7:00 बजे भेजे जा रहे हैं।`
                  : `Personalized daily alerts, favorable muhurats & remedies for ${dailySign} are scheduled to your email inbox every morning at 7:00 AM.`}
              </p>
            </div>
          ) : (
            <div>
              {/* Delivery Preferences Form */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
                <div>
                  <label htmlFor="daily-contact-input" style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#FDE68A", marginBottom: 6 }}>
                    <span>📧</span> {hi ? "आपका ईमेल पता (Email Address) *" : "Your Email Address (For Daily Delivery) *"}
                  </label>
                  <input
                    id="daily-contact-input"
                    aria-label="Email Address for Daily Horoscope"
                    type="email"
                    required
                    placeholder="e.g. yourname@example.com"
                    value={dailyContact}
                    onChange={e => setDailyContact(e.target.value)}
                    style={{ width: "100%", background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8, padding: "10px 14px", color: "#FFF", fontSize: 13.5 }}
                  />
                </div>

                <div>
                  <label htmlFor="daily-time-select" style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#FDE68A", marginBottom: 6 }}>
                    <span>⏰</span> {hi ? "प्राप्ति समय (Delivery Time)" : "Preferred Morning Time"}
                  </label>
                  <select
                    id="daily-time-select"
                    aria-label="Preferred Morning Time"
                    value={dailyTime}
                    onChange={e => setDailyTime(e.target.value)}
                    style={{ width: "100%", background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8, padding: "10px 14px", color: "#FFF", fontSize: 13.5 }}
                  >
                    <option value="06:00 AM">🌅 06:00 AM (Sunrise Alert)</option>
                    <option value="07:00 AM">☀️ 07:00 AM (Standard)</option>
                    <option value="08:00 AM">☕ 08:00 AM (Morning Coffee)</option>
                  </select>
                </div>
              </div>

              {/* Plan Pricing Options */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 20 }}>
                {/* Yearly Plan */}
                <div
                  onClick={() => setDailyPlan("yearly")}
                  style={{
                    background: dailyPlan === "yearly" ? "rgba(245,158,11,0.18)" : "rgba(11,8,25,0.6)",
                    border: `2px solid ${dailyPlan === "yearly" ? "#F59E0B" : "rgba(212,175,55,0.2)"}`,
                    borderRadius: 12,
                    padding: "16px 18px",
                    cursor: "pointer",
                    position: "relative",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ position: "absolute", top: -10, right: 12, background: "linear-gradient(90deg, #F59E0B, #D97706)", color: "#0F0A1E", padding: "3px 10px", borderRadius: 10, fontSize: 11, fontWeight: 800 }}>
                    BEST VALUE · 60% OFF
                  </div>
                  <div style={{ color: "#FDE68A", fontSize: 14, fontWeight: 700 }}>
                    {hi ? "वार्षिक सदस्यता (Yearly Pass)" : "1-Year VIP Subscription"}
                  </div>
                  <div style={{ color: "#34D399", fontSize: 22, fontWeight: 800, marginTop: 4 }}>
                    {PRODUCT_PRICES.dailyYearly[currency]} <span style={{ fontSize: 12, color: "rgba(241,231,208,0.7)", fontWeight: 500 }}>/ year</span>
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(241,231,208,0.75)", marginTop: 3 }}>
                    {hi ? "पूरे 365 दिन दैनिक मार्गदर्शन सीधे ईमेल पर" : "365 Days of daily alerts & remedies directly to email"}
                  </div>
                </div>

                {/* Monthly Plan */}
                <div
                  onClick={() => setDailyPlan("monthly")}
                  style={{
                    background: dailyPlan === "monthly" ? "rgba(245,158,11,0.18)" : "rgba(11,8,25,0.6)",
                    border: `2px solid ${dailyPlan === "monthly" ? "#F59E0B" : "rgba(212,175,55,0.2)"}`,
                    borderRadius: 12,
                    padding: "16px 18px",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ color: "#FDE68A", fontSize: 14, fontWeight: 700 }}>
                    {hi ? "मासिक सदस्यता (Monthly Pass)" : "Monthly Subscription"}
                  </div>
                  <div style={{ color: "#FFF", fontSize: 22, fontWeight: 800, marginTop: 4 }}>
                    {PRODUCT_PRICES.dailyMonthly[currency]} <span style={{ fontSize: 12, color: "rgba(241,231,208,0.7)", fontWeight: 500 }}>/ month</span>
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(241,231,208,0.75)", marginTop: 3 }}>
                    {hi ? "माह-दर-माह नवीकरणीय" : "Cancel or renew anytime"}
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => setActiveCheckout({
                  title: dailyPlan === "yearly"
                    ? `${dailySign} — 1-Year Daily Horoscope Subscription (EMAIL)`
                    : `${dailySign} — Monthly Daily Horoscope Subscription (EMAIL)`,
                  priceKey: activePriceKey,
                  price: activePrice,
                  desc: `Daily delivery to Email at ${dailyTime} with custom remedies & alerts`,
                  icon: "☀️",
                  isDailySub: true
                })}
                className="gold-cta-btn"
                style={{ width: "100%", padding: "15px 22px", fontSize: 15, fontWeight: 800 }}
              >
                {hi
                  ? `सदस्यता लें (${activePrice}) — ईमेल पर शुरू करें ✦`
                  : `Subscribe Now (${activePrice}) — Start Daily Email Delivery ✦`}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0B0819", color: "#F1E7D0", fontFamily: hi ? "'Noto Sans Devanagari', 'Outfit', sans-serif" : "'Outfit', sans-serif", position: "relative", overflowX: "hidden" }}>
      <style>{`
        @keyframes twinkle { 0% { opacity: 0.2; transform: scale(0.9); } 100% { opacity: 0.9; transform: scale(1.2); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulseSlow { 0%, 100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.04); opacity: 1; } }
        @keyframes fadeInCard { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmerBtn { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus { outline: none !important; border-color: #F59E0B !important; box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.18) !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.4); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #D4AF37; }

        .glass-card {
          background: linear-gradient(135deg, rgba(26, 18, 48, 0.7) 0%, rgba(15, 10, 32, 0.85) 100%);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(212, 175, 55, 0.22);
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
          color: #0F0A1E;
          font-weight: 700;
          box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35);
          border-color: #FCD34D;
        }

        .tab-btn:not(.active) {
          background: rgba(26, 18, 48, 0.5);
          color: #E2D9C8;
          border-color: rgba(212, 175, 55, 0.15);
        }

        .tab-btn:not(.active):hover {
          background: rgba(212, 175, 55, 0.12);
          border-color: rgba(212, 175, 55, 0.35);
          color: #FFF;
        }

        .gold-cta-btn {
          width: 100%;
          padding: 15px 24px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(90deg, #B45309 0%, #F59E0B 40%, #FDE68A 50%, #F59E0B 60%, #B45309 100%);
          background-size: 200% auto;
          color: #0F0A1E;
          font-family: ${hi ? "'Noto Sans Devanagari', sans-serif" : "'Outfit', sans-serif"};
          font-size: 15px;
          font-weight: 700;
          letter-spacing: ${hi ? "0.5px" : "1.5px"};
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.3);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          animation: shimmerBtn 4s linear infinite;
        }

        .city-chip {
          transition: all 0.18s ease;
          cursor: pointer;
        }
        .city-chip:hover {
          transform: translateY(-2px);
          background: rgba(245, 158, 11, 0.22) !important;
          border-color: rgba(245, 158, 11, 0.6) !important;
          color: #FFF !important;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25);
        }

        .house-card-interactive {
          transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .house-card-interactive:hover {
          transform: translateY(-3px);
          border-color: rgba(245, 158, 11, 0.55) !important;
          box-shadow: 0 8px 24px rgba(245, 158, 11, 0.18) !important;
        }

        .print-only-report {
          display: none;
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          body, html, #root {
            background: #0B0819 !important;
            color: #F1E7D0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print, header, .form-section-card, footer, .tab-bar-nav {
            display: none !important;
          }
          .screen-only-tabs {
            display: none !important;
          }
          .print-only-report {
            display: block !important;
          }
          .page-break-avoid {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .page-break-before {
            page-break-before: always !important;
            break-before: always !important;
          }
          .print-page {
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            min-height: 265mm;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            padding: 8px 0;
          }
          .print-page:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
        }
      `}</style>

      <CosmicBackdrop />

      {activeCheckout && (
        <CheckoutModal
          item={activeCheckout}
          isAdmin={isAdmin}
          onClose={() => setActiveCheckout(null)}
          onPaid={(purchasedItem) => {
            setUnlockedProReport(true);
            const key = purchasedItem?.priceKey || activeCheckout?.priceKey;
            if (activeCheckout?.isMarriageUnlock || key === "marriageReport") {
              try {
                localStorage.setItem("jyotish_unlocked_marriage", "true");
                setUnlockedMarriageReport(true);
              } catch (e) {
                console.error(e);
              }
            }
            if (activeCheckout?.isCareerUnlock || key === "careerReport") {
              try {
                localStorage.setItem("jyotish_unlocked_career", "true");
                setUnlockedCareerReport(true);
              } catch (e) {
                console.error(e);
              }
            }
            if (activeCheckout?.isRemediesUnlock || key === "remediesReport") {
              try {
                localStorage.setItem("jyotish_unlocked_remedies", "true");
                setUnlockedRemediesReport(true);
              } catch (e) {
                console.error(e);
              }
            }
            if (activeCheckout?.isAnnualUnlock || key === "annualReport") {
              try {
                localStorage.setItem("jyotish_unlocked_annual", "true");
                setUnlockedAnnualReport(true);
              } catch (e) {
                console.error(e);
              }
            }
            if (activeCheckout?.isMatchmakingUnlock || key === "matchmakingReport") {
              try {
                localStorage.setItem("jyotish_unlocked_matchmaking", "true");
                setUnlockedMatchmakingReport(true);
              } catch (e) {
                console.error(e);
              }
            }
            if (activeCheckout?.isDeluxeUnlock || key === "deluxeReport") {
              try {
                localStorage.setItem("jyotish_unlocked_deluxe", "true");
                setUnlockedProReport(true);
              } catch (e) {
                console.error(e);
              }
            }
            if (activeCheckout?.isDailySub || key === "dailyYearly" || key === "dailyMonthly") {
              try {
                localStorage.setItem("jyotish_daily_sub", JSON.stringify({
                  sign: dailySign,
                  channel: dailyChannel,
                  plan: dailyPlan,
                  time: dailyTime,
                  date: new Date().toISOString()
                }));
                setIsDailySubscribed(true);
              } catch (e) {
                console.error(e);
              }
            }
          }}
          lang={lang}
          currency={currency}
          setCurrency={handleSetCurrency}
        />
      )}

      {/* Admin Secret PIN Modal */}
      {showAdminPinModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", padding: 20 }}>
          <div className="glass-card" style={{ maxWidth: 420, width: "100%", padding: "28px 24px", position: "relative", border: "1.5px solid rgba(245,158,11,0.6)", background: "linear-gradient(135deg, rgba(26,18,48,0.98), rgba(11,8,25,0.99))" }}>
            <button
              onClick={() => setShowAdminPinModal(false)}
              style={{ position: "absolute", top: 12, right: 14, background: "none", border: "none", color: "rgba(241,231,208,0.6)", fontSize: 20, cursor: "pointer" }}
            >
              ✕
            </button>
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <div style={{ fontSize: 36 }}>👑</div>
              <h3 style={{ color: "#F3D37A", fontSize: 18, fontWeight: 800, marginTop: 4 }}>
                Admin VIP Access Portal
              </h3>
              <p style={{ color: "rgba(241,231,208,0.7)", fontSize: 12, marginTop: 4 }}>
                {hi ? "वेबसाइट एडमिन हेतु सभी प्रीमियम फीचर्स की निःशुल्क पहुंच" : "Unlock all paid reports & VIP features for Owner/Admin without making payments"}
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label htmlFor="admin-pin-input" style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#FDE68A", marginBottom: 6 }}>
                {hi ? "एडमिन गुप्त पासकी (Admin PIN):" : "Enter Admin Secret PIN / Passkey:"}
              </label>
              <input
                id="admin-pin-input"
                name="adminPin"
                type="password"
                aria-label="Admin PIN"
                value={adminPinInput}
                onChange={e => { setAdminPinInput(e.target.value); setAdminPinErr(""); }}
                onKeyDown={e => e.key === "Enter" && handleVerifyAdminPin()}
                placeholder="Enter PIN (e.g. 2709)"
                style={{ width: "100%", background: "rgba(0,0,0,0.6)", border: "1px solid rgba(212,175,55,0.35)", borderRadius: 8, padding: "10px 14px", color: "#FFF", fontSize: 14, textAlign: "center", letterSpacing: 2 }}
                autoFocus
              />
            </div>

            {adminPinErr && (
              <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", borderRadius: 8, padding: "8px 12px", color: "#FCA5A5", fontSize: 11, marginBottom: 14, textAlign: "center" }}>
                ⚠️ {adminPinErr}
              </div>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={handleVerifyAdminPin}
                className="gold-cta-btn"
                style={{ flex: 1, padding: "11px 14px", fontSize: 13, fontWeight: 700 }}
              >
                👑 {hi ? "एडमिन मोड सक्रिय करें" : "Activate Admin VIP"}
              </button>
              {isAdmin && (
                <button
                  onClick={() => { handleToggleAdminMode(); setShowAdminPinModal(false); }}
                  style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)", color: "#FCA5A5", borderRadius: 10, padding: "11px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                >
                  {hi ? "एडमिन बंद करें" : "Turn Off"}
                </button>
              )}
            </div>
            <div style={{ fontSize: 10, color: "rgba(243,211,122,0.45)", textAlign: "center", marginTop: 12 }}>
              💡 Secret PIN is configured as <code style={{ color: "#FDE68A" }}>2709</code>
            </div>
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="no-print" style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(11, 8, 25, 0.88)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(212, 175, 55, 0.2)", padding: "14px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            onClick={handleSecretTrigger}
            style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}
            title="Click 3 times to open Admin VIP access portal"
          >
            <img
              src="/logo.png"
              alt="Jyotish Paramarsh Logo"
              style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid rgba(245,158,11,0.7)", boxShadow: "0 0 12px rgba(245,158,11,0.4)", objectFit: "cover" }}
            />
            <div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 17, fontWeight: 800, color: "#F3D37A", letterSpacing: 1.5 }}>JYOTISH PARAMARSH</div>
              <div style={{ fontSize: 12, color: "rgba(243, 211, 122, 0.85)", letterSpacing: 0.4, fontWeight: 500 }}>{hi ? "समस्त ज्योतिषीय आवश्यकताओं का संपूर्ण समाधान" : "Your One-Stop Solution for All Astrology Needs"}</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {isAdmin && (
              <div
                onClick={() => setShowAdminPinModal(true)}
                style={{
                  background: "linear-gradient(135deg, #F59E0B, #D97706)",
                  color: "#0B0819",
                  padding: "6px 12px",
                  borderRadius: 20,
                  fontSize: 12.5,
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  boxShadow: "0 2px 10px rgba(245,158,11,0.4)"
                }}
                title="Admin VIP Mode is Active - Click to Manage"
              >
                <span>👑</span> VIP Admin
              </div>
            )}
            {/* Currency Selector */}
            <select
              id="header-currency-select"
              aria-label={t.currencyLabel}
              value={currency}
              onChange={e => handleSetCurrency(e.target.value)}
              style={{
                background: "rgba(26,18,48,0.95)",
                border: "1px solid rgba(212,175,55,0.4)",
                borderRadius: 20,
                padding: "7px 12px",
                color: "#FDE68A",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                outline: "none"
              }}
            >
              {Object.values(CURRENCIES).map(c => (
                <option key={c.code} value={c.code} style={{ background: "#0D0A1C", color: "#FFF" }}>
                  {c.flag} {c.code} ({c.symbol.trim()})
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setActiveCheckout({
                title: hi ? "श्रद्धा दक्षिणा (Seva Bhent)" : "Offer Dakshina (Sacred Offering)",
                priceKey: "dakshina",
                price: PRODUCT_PRICES.dakshina[currency],
                desc: hi ? "वैदिक ज्योतिष अनुसंधान एवं निःशुल्क सर्वर सेवा हेतु स्वैच्छिक दक्षिणा" : "Voluntary offering to maintain free Vedic compute servers and support seekers worldwide",
                icon: "🪷",
                isDakshina: true
              })}
              style={{
                background: "linear-gradient(135deg, rgba(245, 158, 11, 0.28), rgba(217, 119, 6, 0.38))",
                border: "1.5px solid #F59E0B",
                color: "#FDE68A",
                padding: "8px 18px",
                borderRadius: 22,
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 7,
                boxShadow: "0 0 14px rgba(245,158,11,0.35)",
                animation: "pulseSlow 3s ease-in-out infinite"
              }}
            >
              <span style={{ fontSize: 15 }}>🪷</span> {hi ? "श्रद्धा दक्षिणा" : "Offer Dakshina"} ({PRODUCT_PRICES.dakshina[currency]})
            </button>

            {result && (
              <button
                onClick={() => handlePrintReport("all")}
                style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", border: "none", color: "#0F0A1E", padding: "8px 18px", borderRadius: 20, fontSize: 13, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 2px 10px rgba(245,158,11,0.35)" }}
              >
                <span>📥</span> {t.printBtn}
              </button>
            )}

            <button
              onClick={handleLangToggle}
              style={{ background: "linear-gradient(135deg, rgba(26,18,48,0.9), rgba(15,10,32,0.95))", border: "1px solid rgba(212, 175, 55, 0.4)", borderRadius: 24, padding: "7px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "#F3D37A", fontSize: 13, fontWeight: 700 }}
            >
              <span>{hi ? "🇬🇧" : "🇮🇳"}</span>
              <span>{t.langBtn}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ position: "relative", zIndex: 1, maxWidth: 960, margin: "0 auto", padding: "24px 20px 80px" }}>

        {/* ── LIVE REAL-TIME ASTRONOMICAL EPHEMERIS STATUS BAR ── */}
        <aside
          aria-label={hi ? "दैनिक खगोलीय पंचांग सूचना" : "Live Astronomical Ephemeris Status"}
          className="no-print"
          style={{
            background: "linear-gradient(135deg, rgba(26, 18, 48, 0.95), rgba(15, 10, 32, 0.98))",
            border: "1px solid rgba(212, 175, 55, 0.35)",
            borderRadius: 14,
            padding: "10px 18px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            boxShadow: "0 4px 18px rgba(0, 0, 0, 0.35)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.4)", borderRadius: 20, padding: "3px 10px", color: "#34D399", fontSize: 11, fontWeight: 800 }}>
              <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 8px #10B981", animation: "pulseSlow 1.5s infinite" }} />
              {hi ? "लाइव खगोलीय पंचांग" : "LIVE SIDEREAL EPHEMERIS"}
            </div>
            <span style={{ color: "#FDE68A", fontSize: 13, fontWeight: 700 }}>
              {todayPanchangData.displayDate} · {hi ? `विक्रम संवत ${todayPanchangData.vikramSamvat}` : `Vikram ${todayPanchangData.vikramSamvat}`}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", fontSize: 12.5 }}>
            <span style={{ color: "rgba(241, 231, 208, 0.9)" }}>
              🌙 <b>{hi ? "तिथि:" : "Tithi:"}</b> <span style={{ color: "#FDE68A" }}>{todayPanchangData.tithi}</span>
            </span>
            <span style={{ color: "rgba(241, 231, 208, 0.9)" }}>
              ⭐ <b>{hi ? "नक्षत्र:" : "Nakshatra:"}</b> <span style={{ color: "#FDE68A" }}>{todayPanchangData.nakshatra}</span>
            </span>
            <span style={{ color: "rgba(241, 231, 208, 0.9)" }}>
              ⏱️ <b>{hi ? "राहुकाल:" : "Rahu Kaal:"}</b> <span style={{ color: "#F87171", fontWeight: 700 }}>{todayPanchangData.rahuKaal}</span>
            </span>
            <button
              onClick={() => setMainSection("panchang")}
              style={{ background: "transparent", border: "none", color: "#F59E0B", fontSize: 12, fontWeight: 800, cursor: "pointer", textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: 4 }}
            >
              <span>{hi ? "सम्पूर्ण पंचांग" : "Full Almanac"}</span> →
            </button>
          </div>
        </aside>

        {/* ── TOP GLOBAL FEATURE NAVIGATION BAR (Instant Access Without Birth Details) ── */}
        <nav className="no-print" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 28 }}>
          {[
            { id: "kundli", icon: "🔯", label: hi ? "जन्म कुंडली" : "Natal Kundli" },
            { id: "panchang", icon: "🕉️", label: hi ? "दैनिक पंचांग" : "Today's Panchang" },
            { id: "muhurat", icon: "⏳", label: hi ? "शुभ मुहूर्त" : "Shubh Muhurat" },
            { id: "festivals", icon: "🪔", label: hi ? "व्रत व त्यौहार" : "Festivals & Vrat" },
            { id: "daily", icon: "☀️", label: hi ? "दैनिक राशिफल" : "Daily Horoscope" },
          ].map(feat => {
            const isSelected = mainSection === feat.id;
            return (
              <button
                key={feat.id}
                onClick={() => {
                  setMainSection(feat.id);
                  if (result && ["chart", "panchang", "muhurat", "festivals", "daily"].includes(feat.id)) {
                    setTab(feat.id === "kundli" ? "chart" : feat.id);
                  }
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: isSelected
                    ? "linear-gradient(135deg, rgba(245,158,11,0.35), rgba(217,119,6,0.45))"
                    : "rgba(26,18,48,0.85)",
                  border: isSelected ? "1.5px solid #F59E0B" : "1px solid rgba(212,175,55,0.3)",
                  borderRadius: 24,
                  padding: "10px 18px",
                  color: isSelected ? "#FDE68A" : "rgba(241,231,208,0.9)",
                  fontSize: 13.5,
                  fontWeight: isSelected ? 800 : 600,
                  cursor: "pointer",
                  boxShadow: isSelected ? "0 0 16px rgba(245,158,11,0.35)" : "none",
                  transition: "all 0.2s ease"
                }}
              >
                <span style={{ fontSize: 16 }}>{feat.icon}</span>
                <span>{feat.label}</span>
              </button>
            );
          })}
        </nav>

        {/* ── STANDALONE PANCHANG VIEW ── */}
        {mainSection === "panchang" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <button
                onClick={() => setMainSection("kundli")}
                style={{ background: "transparent", border: "1px solid rgba(212,175,55,0.3)", color: "#FDE68A", padding: "6px 14px", borderRadius: 16, fontSize: 12.5, cursor: "pointer" }}
              >
                ← {hi ? "जन्म कुंडली फॉर्म पर लौटें" : "Back to Kundli Generator"}
              </button>
            </div>
            {renderPanchangContent()}
          </div>
        )}

        {/* ── STANDALONE SHUBH MUHURAT VIEW ── */}
        {mainSection === "muhurat" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <button
                onClick={() => setMainSection("kundli")}
                style={{ background: "transparent", border: "1px solid rgba(212,175,55,0.3)", color: "#FDE68A", padding: "6px 14px", borderRadius: 16, fontSize: 12.5, cursor: "pointer" }}
              >
                ← {hi ? "जन्म कुंडली फॉर्म पर लौटें" : "Back to Kundli Generator"}
              </button>
            </div>
            {renderMuhuratContent()}
          </div>
        )}

        {/* ── STANDALONE FESTIVALS & VRAT VIEW ── */}
        {mainSection === "festivals" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <button
                onClick={() => setMainSection("kundli")}
                style={{ background: "transparent", border: "1px solid rgba(212,175,55,0.3)", color: "#FDE68A", padding: "6px 14px", borderRadius: 16, fontSize: 12.5, cursor: "pointer" }}
              >
                ← {hi ? "जन्म कुंडली फॉर्म पर लौटें" : "Back to Kundli Generator"}
              </button>
            </div>
            {renderFestivalsContent()}
          </div>
        )}

        {/* ── STANDALONE DAILY HOROSCOPE VIEW ── */}
        {mainSection === "daily" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <button
                onClick={() => setMainSection("kundli")}
                style={{ background: "transparent", border: "1px solid rgba(212,175,55,0.3)", color: "#FDE68A", padding: "6px 14px", borderRadius: 16, fontSize: 12.5, cursor: "pointer" }}
              >
                ← {hi ? "जन्म कुंडली फॉर्म पर लौटें" : "Back to Kundli Generator"}
              </button>
            </div>
            {renderDailyHoroscopeContent()}
          </div>
        )}

        {/* ── KUNDLI GENERATOR SECTION ── */}
        {mainSection === "kundli" && (
          <>
            {/* Hero Section with Photographic Vedic Showcase */}
            <section className="no-print" style={{ textAlign: "center", marginBottom: 32 }}>
              <div
                style={{
                  position: "relative",
                  borderRadius: 20,
                  overflow: "hidden",
                  border: "1.5px solid rgba(212, 175, 55, 0.45)",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.65), 0 0 35px rgba(245, 158, 11, 0.2)",
                  marginBottom: 26,
                  height: "clamp(220px, 32vw, 320px)"
                }}
              >
                <img
                  src="/images/hero_vedic_astrology.jpg"
                  alt="Ancient Vedic Astrology Armillary Sphere and Manuscripts"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(11, 8, 25, 0.96) 15%, rgba(15, 10, 32, 0.65) 60%, rgba(11, 8, 25, 0.4) 100%)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    padding: "24px 20px"
                  }}
                >
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(0, 0, 0, 0.65)", backdropFilter: "blur(8px)", border: "1px solid rgba(245, 158, 11, 0.5)", borderRadius: 30, padding: "5px 16px", marginBottom: 10 }}>
                    <Icons.Sparkle size={13} color="#F59E0B" />
                    <span style={{ fontSize: 11.5, fontWeight: 800, color: "#FDE68A", letterSpacing: 1.4, textTransform: "uppercase" }}>
                      {hi ? "ऋषि पाराशर विरचित सिद्धांती गणना" : "PARASHARI SIDEREAL COMPUTATIONAL CORE · 16 SHODASHVARGAS"}
                    </span>
                  </div>

                  <h1 style={{ fontFamily: hi ? "'Noto Sans Devanagari', sans-serif" : "'Cinzel Decorative', serif", fontSize: "clamp(24px, 4.5vw, 40px)", background: "linear-gradient(90deg, #D4AF37 0%, #FDE68A 40%, #F59E0B 70%, #D4AF37 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: hi ? 1 : 2.5, fontWeight: 900, margin: "0 0 6px", textShadow: "0 4px 18px rgba(0,0,0,0.8)" }}>
                    {t.title}
                  </h1>
                  <p style={{ color: "rgba(243, 211, 122, 0.95)", fontSize: "clamp(12px, 2vw, 14px)", letterSpacing: hi ? 0.5 : 2.5, textTransform: "uppercase", fontWeight: 700, margin: 0, textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
                    {t.subtitle}
                  </p>
                </div>
              </div>

              <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 14px" }}>
                <p style={{ color: "rgba(241, 231, 208, 0.88)", fontSize: 14.5, fontStyle: "italic", lineHeight: 1.6, margin: "0 0 4px" }}>
                  {t.tagline}
                </p>
                <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5), transparent)", margin: "12px auto 0" }} />
              </div>
            </section>

            {/* ── 3-PILLAR CREDIBILITY & VEDIC INTEGRITY STRIP ── */}
            <div className="no-print" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginBottom: 28 }}>
              {[
                {
                  icon: "🏛️",
                  titleEn: "Parashari & Surya Siddhanta",
                  titleHi: "ऋषि पाराशर एवं सूर्य सिद्धांत",
                  subEn: "Pure traditional computational core adhering to Brihat Parashara Hora Shastra",
                  subHi: "बृहत्पाराशर होराशास्त्र एवं शास्त्रीय सिद्धांतों पर आधारित प्रामाणिक गणना"
                },
                {
                  icon: "🔒",
                  titleEn: "100% Client-Side Privacy",
                  titleHi: "१००% पूर्ण गोपनीयता गारंटी",
                  subEn: "Zero data tracking. Calculations compute privately on your device",
                  subHi: "आपका जन्म विवरण पूर्णतः निजी है। कोई डेटा साझा या बेचा नहीं जाता"
                },
                {
                  icon: "⚡",
                  titleEn: "Arc-Second NASA Accuracy",
                  titleHi: "खगोलीय सूक्ष्म अयनांश सटीकता",
                  subEn: "Exact Chitra Paksha (Lahiri) Ayanamsha with exact Sripati cusp boundaries",
                  subHi: "चित्रा पक्ष लाहिड़ी अयनांश एवं वास्तविक संधि-आधारित ग्रह विश्लेषण"
                }
              ].map((pill, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "rgba(18, 12, 36, 0.75)",
                    border: "1px solid rgba(212, 175, 55, 0.25)",
                    borderRadius: 12,
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    boxShadow: "0 4px 14px rgba(0,0,0,0.25)"
                  }}
                >
                  <span style={{ fontSize: 24 }}>{pill.icon}</span>
                  <div>
                    <div style={{ color: "#FDE68A", fontSize: 13, fontWeight: 800 }}>
                      {hi ? pill.titleHi : pill.titleEn}
                    </div>
                    <div style={{ color: "rgba(241, 231, 208, 0.75)", fontSize: 11.5, marginTop: 2, lineHeight: 1.4 }}>
                      {hi ? pill.subHi : pill.subEn}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Standalone Feature Spotlight Cards with Realistic Photographic Imagery */}
            {!result && (
              <div className="no-print" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 30 }}>
                {/* 1. Panchang Card */}
                <div
                  onClick={() => setMainSection("panchang")}
                  style={{
                    background: "rgba(18, 12, 34, 0.92)",
                    border: todayFestival ? "1.5px solid #F59E0B" : "1px solid rgba(212,175,55,0.3)",
                    borderRadius: 16,
                    overflow: "hidden",
                    cursor: "pointer",
                    boxShadow: todayFestival ? "0 6px 24px rgba(245, 158, 11, 0.28)" : "0 4px 18px rgba(0,0,0,0.4)",
                    transition: "transform 0.2s ease, border-color 0.2s ease"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#F59E0B"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = todayFestival ? "#F59E0B" : "rgba(212,175,55,0.3)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ height: 125, position: "relative", overflow: "hidden" }}>
                    <img src="/images/feature_panchang.jpg" alt="Daily Hindu Panchang" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(18, 12, 34, 0.98) 10%, rgba(18, 12, 34, 0.3) 60%, transparent 100%)" }} />
                    <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 6 }}>
                      {todayFestival && (
                        <span style={{ fontSize: 10.5, color: "#0F0A1E", fontWeight: 800, background: "#F59E0B", padding: "2px 8px", borderRadius: 8 }}>
                          {hi ? "आज विशेष व्रत" : "Today's Vrat"}
                        </span>
                      )}
                      <span style={{ fontSize: 10.5, color: "#34D399", fontWeight: 700, background: "rgba(0,0,0,0.7)", border: "1px solid rgba(52,211,153,0.4)", padding: "2px 8px", borderRadius: 8 }}>
                        {hi ? "लाइव पंचांग" : "Live Daily"}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: "14px 18px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <Icons.Moon size={16} color="#F59E0B" />
                      <h3 style={{ color: "#F3D37A", fontSize: 16.5, fontWeight: 800, margin: 0 }}>
                        {hi ? "दैनिक हिंदू पंचांग" : "Today's Hindu Panchang"}
                      </h3>
                    </div>

                    <div style={{ fontSize: 12.5, color: "rgba(241,231,208,0.85)", margin: "6px 0 10px" }}>
                      {todayFestival ? (
                        <span style={{ color: "#FDE68A", fontWeight: 700 }}>
                          {hi ? todayFestival.nameHi : todayFestival.nameEn}
                        </span>
                      ) : (
                        `${panchangData.tithi} · ${panchangData.nakshatra}`
                      )}
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "#FDE68A", borderTop: "1px solid rgba(212,175,55,0.15)", paddingTop: 8 }}>
                      <span>{hi ? "अभिजीत:" : "Abhijit:"} {panchangData.muhurats.abhijit.split("-")[0]}</span>
                      <span style={{ color: "#F87171" }}>{hi ? "राहुकाल:" : "Rahu:"} {panchangData.inauspicious.rahuKaal.split("-")[0]}</span>
                    </div>

                    <div style={{ marginTop: 10, color: "#F59E0B", fontSize: 12, fontWeight: 800, textAlign: "right", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                      <span>{hi ? "चौघड़िया व पंचांग देखें" : "View Full Panchang"}</span>
                      <Icons.ArrowRight size={13} color="#F59E0B" />
                    </div>
                  </div>
                </div>

                {/* 2. Shubh Muhurat Card */}
                <div
                  onClick={() => setMainSection("muhurat")}
                  style={{
                    background: "rgba(18, 12, 34, 0.92)",
                    border: "1px solid rgba(212,175,55,0.3)",
                    borderRadius: 16,
                    overflow: "hidden",
                    cursor: "pointer",
                    boxShadow: "0 4px 18px rgba(0,0,0,0.4)",
                    transition: "transform 0.2s ease, border-color 0.2s ease"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#F59E0B"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ height: 125, position: "relative", overflow: "hidden" }}>
                    <img src="/images/feature_muhurat.jpg" alt="Auspicious Shubh Muhurat" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(18, 12, 34, 0.98) 10%, rgba(18, 12, 34, 0.3) 60%, transparent 100%)" }} />
                    <div style={{ position: "absolute", top: 10, right: 10 }}>
                      <span style={{ fontSize: 10.5, color: "#FDE68A", fontWeight: 700, background: "rgba(0,0,0,0.7)", border: "1px solid rgba(245,158,11,0.4)", padding: "2px 8px", borderRadius: 8 }}>
                        2026–2027
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: "14px 18px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <Icons.Clock size={16} color="#F59E0B" />
                      <h3 style={{ color: "#F3D37A", fontSize: 16.5, fontWeight: 800, margin: 0 }}>
                        {hi ? "सर्व शुभ मुहूर्त डायरेक्टरी" : "Auspicious Muhurats"}
                      </h3>
                    </div>

                    <div style={{ fontSize: 12.5, color: "rgba(241,231,208,0.85)", margin: "6px 0 10px" }}>
                      {hi ? "विवाह, गृह प्रवेश, वाहन, संपत्ति व व्यापार" : "Weddings, Housewarming, Vehicles & Business"}
                    </div>

                    <div style={{ fontSize: 11.5, color: "#34D399", borderTop: "1px solid rgba(212,175,55,0.15)", paddingTop: 8 }}>
                      {hi ? "सर्वार्थ सिद्धि व अमृत योग सहित" : "Certified Vedic Muhurat Windows"}
                    </div>

                    <div style={{ marginTop: 10, color: "#F59E0B", fontSize: 12, fontWeight: 800, textAlign: "right", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                      <span>{hi ? "शुभ मुहूर्त सूची देखें" : "View All Muhurats"}</span>
                      <Icons.ArrowRight size={13} color="#F59E0B" />
                    </div>
                  </div>
                </div>

                {/* 3. Festivals & Vrat Card */}
                <div
                  onClick={() => setMainSection("festivals")}
                  style={{
                    background: todayFestival
                      ? "linear-gradient(135deg, rgba(62, 28, 20, 0.96), rgba(28, 14, 40, 0.98))"
                      : "rgba(18, 12, 34, 0.92)",
                    border: todayFestival ? "2px solid #F59E0B" : "1px solid rgba(212,175,55,0.3)",
                    borderRadius: 16,
                    overflow: "hidden",
                    cursor: "pointer",
                    boxShadow: todayFestival ? "0 0 24px rgba(245, 158, 11, 0.35)" : "0 4px 18px rgba(0,0,0,0.4)",
                    transition: "transform 0.2s ease, border-color 0.2s ease"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#F59E0B"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = todayFestival ? "#F59E0B" : "rgba(212,175,55,0.3)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ height: 125, position: "relative", overflow: "hidden" }}>
                    <img src="/images/feature_festivals.jpg" alt="Vedic Festivals & Vrats" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(18, 12, 34, 0.98) 10%, rgba(18, 12, 34, 0.3) 60%, transparent 100%)" }} />
                    {todayFestival && (
                      <div style={{ position: "absolute", top: 10, right: 10, background: "#F59E0B", color: "#0F0A1E", fontSize: 10.5, fontWeight: 900, padding: "2px 8px", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
                        {hi ? "आज विशेष पर्व" : "TODAY'S FESTIVAL"}
                      </div>
                    )}
                  </div>

                  <div style={{ padding: "14px 18px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <Icons.Flame size={16} color="#F59E0B" />
                      <h3 style={{ color: "#F3D37A", fontSize: 16.5, fontWeight: 800, margin: 0 }}>
                        {todayFestival ? (hi ? todayFestival.nameHi : todayFestival.nameEn) : (hi ? "हिंदू व्रत एवं त्यौहार कैलेंडर" : "Festivals & Vrat Calendar")}
                      </h3>
                    </div>

                    <div style={{ fontSize: 12.5, color: todayFestival ? "#34D399" : "rgba(241,231,208,0.85)", fontWeight: todayFestival ? 700 : 400, margin: "6px 0 10px" }}>
                      {todayFestival
                        ? (hi ? `पूजा मुहूर्त: ${todayFestival.pujaMuhuratHi.split("(")[0]}` : `Muhurat: ${todayFestival.pujaMuhuratEn.split("(")[0]}`)
                        : (hi ? "एकादशी, प्रदोष, दीपावली, छठ, शिवरात्रि" : "Ekadashis, Pradosh, Diwali, Chhath & Fasts")}
                    </div>

                    <div style={{ fontSize: 11.5, color: "#FDE68A", borderTop: "1px solid rgba(212,175,55,0.15)", paddingTop: 8 }}>
                      {todayFestival ? (
                        <span>{hi ? "व्रत नियम व पूजा विधि देखें" : "View Fasting Rules & Details"}</span>
                      ) : (
                        <span>{hi ? "पूजा मुहूर्त व पारण समय सहित" : "With Puja Muhurat & Fasting Rules"}</span>
                      )}
                    </div>

                    <div style={{ marginTop: 10, color: "#F59E0B", fontSize: 12, fontWeight: 800, textAlign: "right", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                      <span>{todayFestival ? (hi ? "आज का पर्व देखें" : "View Today's Vrat") : (hi ? "कैलेंडर देखें" : "View Calendar")}</span>
                      <Icons.ArrowRight size={13} color="#F59E0B" />
                    </div>
                  </div>
                </div>

                {/* 4. Daily Horoscope Card */}
                <div
                  onClick={() => setMainSection("daily")}
                  style={{
                    background: "rgba(18, 12, 34, 0.92)",
                    border: "1px solid rgba(212,175,55,0.3)",
                    borderRadius: 16,
                    overflow: "hidden",
                    cursor: "pointer",
                    boxShadow: "0 4px 18px rgba(0,0,0,0.4)",
                    transition: "transform 0.2s ease, border-color 0.2s ease"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#F59E0B"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ height: 125, position: "relative", overflow: "hidden" }}>
                    <img src="/images/feature_horoscope.jpg" alt="12 Zodiac Daily Horoscope" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(18, 12, 34, 0.98) 10%, rgba(18, 12, 34, 0.3) 60%, transparent 100%)" }} />
                    <div style={{ position: "absolute", top: 10, right: 10 }}>
                      <span style={{ fontSize: 10.5, color: "#FBBF24", fontWeight: 700, background: "rgba(0,0,0,0.7)", border: "1px solid rgba(251,191,36,0.4)", padding: "2px 8px", borderRadius: 8 }}>
                        {hi ? "१२ राशियां" : "12 Signs"}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: "14px 18px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <Icons.Sun size={16} color="#FBBF24" />
                      <h3 style={{ color: "#F3D37A", fontSize: 16.5, fontWeight: 800, margin: 0 }}>
                        {hi ? "दैनिक राशिफल (Rashiphal)" : "Daily Horoscope"}
                      </h3>
                    </div>

                    <div style={{ fontSize: 12.5, color: "rgba(241,231,208,0.85)", margin: "6px 0 10px" }}>
                      {hi ? "करियर, स्वास्थ्य, प्रेम व वित्तीय मार्गदर्शन" : "Career, Health, Love & Financial Guidance"}
                    </div>

                    <div style={{ fontSize: 11.5, color: "#34D399", borderTop: "1px solid rgba(212,175,55,0.15)", paddingTop: 8 }}>
                      {hi ? "नक्षत्र व गोचर आधारित विश्लेषण" : "Accurate Planetary Transit Synthesis"}
                    </div>

                    <div style={{ marginTop: 10, color: "#F59E0B", fontSize: 12, fontWeight: 800, textAlign: "right", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                      <span>{hi ? "अपनी राशि चुनें" : "Check Your Rashi"}</span>
                      <Icons.ArrowRight size={13} color="#F59E0B" />
                    </div>
                  </div>
                </div>

                {/* 5. Kundli Milan Card */}
                <div
                  onClick={() => {
                    setTab("matchmaking");
                    if (!result) {
                      const el = document.getElementById("birth-name");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  style={{
                    background: "rgba(18, 12, 34, 0.92)",
                    border: "1px solid rgba(212,175,55,0.3)",
                    borderRadius: 16,
                    overflow: "hidden",
                    cursor: "pointer",
                    boxShadow: "0 4px 18px rgba(0,0,0,0.4)",
                    transition: "transform 0.2s ease, border-color 0.2s ease"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#F59E0B"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ height: 125, position: "relative", overflow: "hidden" }}>
                    <img src="/images/feature_matchmaking.jpg" alt="Vedic Wedding Vivaha Matchmaking" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(18, 12, 34, 0.98) 10%, rgba(18, 12, 34, 0.3) 60%, transparent 100%)" }} />
                    <div style={{ position: "absolute", top: 10, right: 10 }}>
                      <span style={{ fontSize: 10.5, color: "#F472B6", fontWeight: 700, background: "rgba(0,0,0,0.7)", border: "1px solid rgba(244,114,182,0.4)", padding: "2px 8px", borderRadius: 8 }}>
                        {hi ? "३६ गुण मिलान" : "36 Gunas"}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: "14px 18px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <Icons.Heart size={16} color="#F472B6" />
                      <h3 style={{ color: "#F3D37A", fontSize: 16.5, fontWeight: 800, margin: 0 }}>
                        {hi ? "कुंडली मिलान (Gun Milan)" : "Kundli Matchmaking"}
                      </h3>
                    </div>

                    <div style={{ fontSize: 12.5, color: "rgba(241,231,208,0.85)", margin: "6px 0 10px" }}>
                      {hi ? "अष्टकूट मिलान, नाड़ी दोष व मांगलिक परीक्षण" : "Ashtakoot Compatibility, Nadi & Manglik"}
                    </div>

                    <div style={{ fontSize: 11.5, color: "#FDE68A", borderTop: "1px solid rgba(212,175,55,0.15)", paddingTop: 8 }}>
                      {hi ? "दांपत्य सुख एवं दीर्घायु मिलान" : "Marital Longevity & Soulmate Harmony"}
                    </div>

                    <div style={{ marginTop: 10, color: "#F59E0B", fontSize: 12, fontWeight: 800, textAlign: "right", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                      <span>{hi ? "गुण मिलान करें" : "Calculate Compatibility"}</span>
                      <Icons.ArrowRight size={13} color="#F59E0B" />
                    </div>
                  </div>
                </div>

                {/* 6. Gemstones & Remedies Card */}
                <div
                  onClick={() => {
                    setTab("store");
                    if (!result) {
                      const el = document.getElementById("birth-name");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  style={{
                    background: "rgba(18, 12, 34, 0.92)",
                    border: "1px solid rgba(212,175,55,0.3)",
                    borderRadius: 16,
                    overflow: "hidden",
                    cursor: "pointer",
                    boxShadow: "0 4px 18px rgba(0,0,0,0.4)",
                    transition: "transform 0.2s ease, border-color 0.2s ease"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#F59E0B"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ height: 125, position: "relative", overflow: "hidden" }}>
                    <img src="/images/feature_gemstones.jpg" alt="Vedic Gemstones and Rudraksha" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(18, 12, 34, 0.98) 10%, rgba(18, 12, 34, 0.3) 60%, transparent 100%)" }} />
                    <div style={{ position: "absolute", top: 10, right: 10 }}>
                      <span style={{ fontSize: 10.5, color: "#34D399", fontWeight: 700, background: "rgba(0,0,0,0.7)", border: "1px solid rgba(52,211,153,0.4)", padding: "2px 8px", borderRadius: 8 }}>
                        {hi ? "प्रमाणित रत्न" : "Certified Gems"}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: "14px 18px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <Icons.Gem size={16} color="#34D399" />
                      <h3 style={{ color: "#F3D37A", fontSize: 16.5, fontWeight: 800, margin: 0 }}>
                        {hi ? "रत्न एवं रुद्राक्ष निर्धारण" : "Gemstones & Rudraksha"}
                      </h3>
                    </div>

                    <div style={{ fontSize: 12.5, color: "rgba(241,231,208,0.85)", margin: "6px 0 10px" }}>
                      {hi ? "लग्न कारक रत्न, रुद्राक्ष एवं वैदिक उपाय" : "Lagna Lord Gemstones & Sacred Rudraksha"}
                    </div>

                    <div style={{ fontSize: 11.5, color: "#FDE68A", borderTop: "1px solid rgba(212,175,55,0.15)", paddingTop: 8 }}>
                      {hi ? "१००% प्राकृतिक एवं दोषरहित चयन" : "100% Natural Astrological Selection"}
                    </div>

                    <div style={{ marginTop: 10, color: "#F59E0B", fontSize: 12, fontWeight: 800, textAlign: "right", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                      <span>{hi ? "उपाय व रत्न देखें" : "View Prescriptions"}</span>
                      <Icons.ArrowRight size={13} color="#F59E0B" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Free Initiative & Dakshina Spotlight Announcement Banner */}
            {!result && (
              <div
                className="glass-card no-print"
                style={{
                  padding: "18px 24px",
                  marginBottom: 24,
                  background: "linear-gradient(135deg, rgba(38, 22, 68, 0.92), rgba(18, 11, 40, 0.96))",
                  border: "1.5px solid rgba(245, 158, 11, 0.55)",
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 16,
                  boxShadow: "0 6px 24px rgba(245, 158, 11, 0.15)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 260 }}>
                  <span style={{ fontSize: 32 }}>🪷</span>
                  <div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#34D399", fontSize: 11.5, fontWeight: 800, background: "rgba(16,185,129,0.18)", border: "1px solid rgba(16,185,129,0.35)", padding: "2px 10px", borderRadius: 12, marginBottom: 4 }}>
                      <span>✓</span> {hi ? "100% निःशुल्क सेवा पहल · सर्वजन कल्याण" : "100% FREE INITIATIVE · FOR EVERY SEEKER"}
                    </div>
                    <div style={{ color: "#FDE68A", fontSize: 15, fontWeight: 800 }}>
                      {hi
                        ? "समस्त गणनाएं, भविष्यवाणियां व 50-पेज महा-कुंडली रिपोर्ट पूर्णतः निःशुल्क हैं"
                        : "All Vedic Forecasts & Deluxe 50-Page Kundli Dossiers Are 100% Free"}
                    </div>
                    <div style={{ color: "rgba(241, 231, 208, 0.85)", fontSize: 13, marginTop: 2, lineHeight: 1.5 }}>
                      {hi
                        ? "सनातन धर्म की पावन भावना में वैदिक ज्ञान सब के लिए। सर्वर व शोध सहयोग हेतु स्वेच्छानुसार 'श्रद्धा दक्षिणा' अर्पित कर सकते हैं।"
                        : "Pure Vedic guidance for all. You may offer a voluntary Dakshina to support high-precision servers and continuous research."}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveCheckout({
                    title: hi ? "श्रद्धा दक्षिणा (Seva Bhent)" : "Offer Dakshina (Sacred Offering)",
                    priceKey: "dakshina",
                    price: PRODUCT_PRICES.dakshina[currency],
                    desc: hi ? "वैदिक ज्योतिष अनुसंधान एवं निःशुल्क सर्वर सेवा हेतु स्वैच्छिक दक्षिणा" : "Voluntary offering to maintain free Vedic compute servers and support seekers worldwide",
                    icon: "🪷",
                    isDakshina: true
                  })}
                  style={{
                    background: "linear-gradient(90deg, #F59E0B, #D97706)",
                    border: "none",
                    color: "#0F0A1E",
                    padding: "11px 22px",
                    borderRadius: 22,
                    fontSize: 13.5,
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    boxShadow: "0 4px 14px rgba(245,158,11,0.35)",
                    whiteSpace: "nowrap"
                  }}
                >
                  <span>🪷</span> {hi ? "श्रद्धा दक्षिणा दें" : "Offer Dakshina"}
                </button>
              </div>
            )}

            {/* Input Form Card */}
            <div className="glass-card form-section-card no-print" style={{ padding: "32px 34px", marginBottom: 36 }}>
              <div style={{ marginBottom: 20, textAlign: "center" }}>
                <h2 style={{ color: "#F3D37A", fontSize: 18, fontWeight: 800, letterSpacing: 0.5, marginBottom: 4 }}>{t.formTitle}</h2>
                <p style={{ color: "rgba(243, 211, 122, 0.8)", fontSize: 13.5, marginBottom: 12 }}>{t.formSub}</p>

                {/* 1-Click Sample Profile Fill */}
                <button
                  type="button"
                  onClick={handleFillSample}
                  style={{
                    background: "rgba(245, 158, 11, 0.15)",
                    border: "1px solid rgba(245, 158, 11, 0.4)",
                    color: "#FDE68A",
                    padding: "6px 16px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 0.2s ease"
                  }}
                  title="Auto-fill sample data to test the Kundli engine instantly"
                >
                  <span>⚡</span> {hi ? "नमूना विवरण भरें (1-Click Sample Chart)" : "Fill Sample Data (1-Click Demo)"}
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label htmlFor="birth-name" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#FDE68A", marginBottom: 8, letterSpacing: 0.5 }}>
                    <Icons.User size={15} color="#F59E0B" /> {t.fName} *
                  </label>
                  <input
                    id="birth-name"
                    name="name"
                    type="text"
                    required
                    aria-required="true"
                    aria-label={t.fName}
                    value={form.name}
                    onChange={e => { setForm({ ...form, name: e.target.value }); if (err) setErr(""); }}
                    placeholder={t.phName}
                    style={{ width: "100%", background: "rgba(11, 8, 25, 0.65)", border: "1px solid rgba(212, 175, 55, 0.3)", borderRadius: 10, padding: "13px 16px", color: "#FFF", fontSize: 15, fontFamily: "inherit", colorScheme: "dark" }}
                  />
                </div>

                <div>
                  <label htmlFor="birth-dob" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#FDE68A", marginBottom: 8, letterSpacing: 0.5 }}>
                    <Icons.Calendar size={15} color="#F59E0B" /> {t.fDob} *
                  </label>
                  <input
                    id="birth-dob"
                    name="dob"
                    type="date"
                    required
                    aria-required="true"
                    aria-label={t.fDob}
                    value={form.dob}
                    onChange={e => { setForm({ ...form, dob: e.target.value }); if (err) setErr(""); }}
                    style={{ width: "100%", background: "rgba(11, 8, 25, 0.65)", border: "1px solid rgba(212, 175, 55, 0.3)", borderRadius: 10, padding: "13px 16px", color: "#FFF", fontSize: 15, fontFamily: "inherit", colorScheme: "dark" }}
                  />
                </div>

                <div>
                  <label htmlFor="birth-tob" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#FDE68A", marginBottom: 8, letterSpacing: 0.5 }}>
                    <Icons.Clock size={15} color="#F59E0B" /> {t.fTob} <span style={{ fontSize: 12, color: "rgba(243, 211, 122, 0.8)", fontWeight: 500 }}>{t.fTobHelp}</span>
                  </label>
                  <input
                    id="birth-tob"
                    name="tob"
                    type="time"
                    aria-label={t.fTob}
                    value={form.tob}
                    onChange={e => setForm({ ...form, tob: e.target.value })}
                    style={{ width: "100%", background: "rgba(11, 8, 25, 0.65)", border: "1px solid rgba(212, 175, 55, 0.3)", borderRadius: 10, padding: "13px 16px", color: "#FFF", fontSize: 15, fontFamily: "inherit", colorScheme: "dark" }}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
                    <label htmlFor="birth-pob" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#FDE68A", letterSpacing: 0.5 }}>
                      <Icons.Location size={15} color="#F59E0B" /> {t.fPob} *
                    </label>
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={isLocating}
                      style={{
                        background: "rgba(52, 211, 153, 0.15)",
                        border: "1px solid rgba(52, 211, 153, 0.4)",
                        color: "#34D399",
                        padding: "3px 10px",
                        borderRadius: 12,
                        fontSize: 11.5,
                        fontWeight: 700,
                        cursor: isLocating ? "wait" : "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4
                      }}
                    >
                      <span>📍</span> {isLocating ? (hi ? "स्थान खोज रहे हैं..." : "Detecting...") : (hi ? "वर्तमान स्थान का उपयोग करें" : "Use Current Location")}
                    </button>
                  </div>
                  <input
                    id="birth-pob"
                    name="pob"
                    type="text"
                    required
                    aria-required="true"
                    aria-label={t.fPob}
                    value={form.pob}
                    onChange={e => { setForm({ ...form, pob: e.target.value }); if (err) setErr(""); }}
                    placeholder={t.phPob}
                    style={{ width: "100%", background: "rgba(11, 8, 25, 0.65)", border: "1px solid rgba(212, 175, 55, 0.3)", borderRadius: 10, padding: "13px 16px", color: "#FFF", fontSize: 15, fontFamily: "inherit", colorScheme: "dark" }}
                  />

                  {/* Quick Global City Chips */}
                  <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, color: "rgba(243, 211, 122, 0.8)", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                      <span>⚡</span> {hi ? "त्वरित चयन:" : "Popular Cities:"}
                    </span>
                    {[
                      { label: "🇺🇸 New York", val: "New York, USA" },
                      { label: "🇬🇧 London", val: "London, UK" },
                      { label: "🇨🇦 Toronto", val: "Toronto, Canada" },
                      { label: "🇦🇺 Sydney", val: "Sydney, Australia" },
                      { label: "🇦🇪 Dubai", val: "Dubai, UAE" },
                      { label: "🇮🇳 New Delhi", val: "New Delhi, India" },
                      { label: "🇮🇳 Mumbai", val: "Mumbai, India" },
                      { label: "🇮🇳 Bengaluru", val: "Bengaluru, India" },
                    ].map(city => (
                      <button
                        key={city.val}
                        type="button"
                        className="city-chip"
                        onClick={() => {
                          setForm({ ...form, pob: city.val });
                          if (err) setErr("");
                        }}
                        style={{
                          background: form.pob === city.val ? "rgba(245, 158, 11, 0.28)" : "rgba(255, 255, 255, 0.05)",
                          border: form.pob === city.val ? "1px solid rgba(245, 158, 11, 0.8)" : "1px solid rgba(212, 175, 55, 0.2)",
                          borderRadius: 14,
                          padding: "4px 10px",
                          fontSize: 12,
                          color: form.pob === city.val ? "#FDE68A" : "rgba(241, 231, 208, 0.9)",
                          cursor: "pointer",
                          backdropFilter: "blur(6px)",
                          fontWeight: form.pob === city.val ? 700 : 500,
                          boxShadow: form.pob === city.val ? "0 0 10px rgba(245, 158, 11, 0.3)" : "none"
                        }}
                      >
                        {city.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {err && (
                <div style={{ background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.35)", borderRadius: 8, padding: "12px 16px", color: "#FCA5A5", fontSize: 13.5, textAlign: "center", marginTop: 18 }}>
                  ⚠️ {err}
                </div>
              )}

              <button onClick={run} disabled={step > 0} className="gold-cta-btn" style={{ marginTop: 24, fontSize: 16 }}>
                {step > 0 ? t.btnWait : t.btnGo}
              </button>

              {/* Quick Daily Horoscope Access */}
              {!result && (
                <div style={{ marginTop: 20, textAlign: "center", borderTop: "1px solid rgba(212,175,55,0.2)", paddingTop: 16 }}>
                  <span style={{ fontSize: 13.5, color: "rgba(241,231,208,0.85)" }}>
                    {hi ? "या आज का दैनिक राशिफल व ईमेल अलर्ट्स देखें:" : "Or check Today's Daily Vedic Horoscope & Email Alerts:"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMainSection("daily");
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: "rgba(245,158,11,0.18)",
                      border: "1px solid rgba(245,158,11,0.4)",
                      borderRadius: 20,
                      padding: "7px 18px",
                      color: "#FDE68A",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      marginLeft: 10,
                      marginTop: 6
                    }}
                  >
                    <span>☀️</span> {hi ? "दैनिक राशिफल (Daily Horoscope)" : "Daily Horoscope"} →
                  </button>
                </div>
              )}
            </div>

            {/* Seeker Testimonials & Verified Reviews */}
            {!result && renderTestimonialsSection()}

            {/* Vedic Knowledge & FAQ Accordion */}
            {!result && renderFaqSection()}

            {/* Loading Progress */}
            {step > 0 && (
              <div className="glass-card no-print" style={{ padding: "36px 20px", textAlign: "center", marginBottom: 32 }}>
                <div style={{ display: "inline-block", position: "relative", width: 80, height: 80, marginBottom: 16 }}>
                  <div style={{ position: "absolute", inset: 0, border: "2px solid rgba(245, 158, 11, 0.3)", borderRadius: "50%", borderTopColor: "#F59E0B", animation: "spin 1.2s linear infinite" }} />
                  <div style={{ position: "absolute", inset: 8, border: "2px solid rgba(245, 158, 11, 0.15)", borderRadius: "50%", borderBottomColor: "#FDE68A", animation: "spin 2s linear infinite reverse" }} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, animation: "pulseSlow 1.5s infinite" }}>🔯</div>
                </div>
                <p style={{ color: "#F3D37A", fontSize: 14, fontWeight: 600, letterSpacing: 0.5 }}>{step === 1 ? t.s1 : t.s2}</p>
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            SCREEN VIEW (Interactive Tabs)
        ══════════════════════════════════════════════════════════════════════ */}
        {result && (
          <div ref={resultRef} className="screen-only-tabs" style={{ animation: "fadeInCard 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>

            {/* Profile Overview Header Card */}
            <div className="glass-card" style={{ position: "relative", overflow: "hidden", padding: "28px 30px", marginBottom: 28, textAlign: "center" }}>
              <div style={{ position: "absolute", top: 0, right: 0, width: 320, height: "100%", opacity: 0.18, pointerEvents: "none", overflow: "hidden", maskImage: "linear-gradient(to left, black, transparent)", WebkitMaskImage: "linear-gradient(to left, black, transparent)" }}>
                <img src="/images/feature_kundli.jpg" alt="Vedic Horoscope Parchment" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#F59E0B", fontWeight: 700, letterSpacing: 1.2, marginBottom: 6 }}>
                <Icons.Sparkle size={14} color="#F59E0B" /> {hi ? "वैदिक जन्म विवरण" : "NATAL PROFILE"}
              </div>
              <h2 style={{ fontFamily: hi ? "'Noto Sans Devanagari', sans-serif" : "'Cinzel Decorative', serif", color: "#F3D37A", fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 800, marginBottom: 6 }}>
                {form.name.toUpperCase()}
              </h2>
              <p style={{ color: "rgba(241, 231, 208, 0.8)", fontSize: 13.5, letterSpacing: 0.5, fontWeight: 500 }}>
                {form.dob} · {form.pob} {form.tob ? `· ${form.tob}` : ""}
              </p>

              {/* Core Panchang Pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 18 }}>
                {[
                  { label: t.pills.lagna, val: result.lagna, icon: "👑" },
                  { label: t.pills.rashi, val: result.rashi, icon: "🌙" },
                  { label: t.pills.nakshatra, val: result.nakshatra, icon: "⭐" },
                  { label: t.pills.tithi, val: result.tithi, icon: "🌕" },
                  { label: t.pills.yoga, val: result.yoga, icon: "⚡" },
                ].map((item, i) => (
                  <div key={i} style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: 12, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 12, color: "rgba(243, 211, 122, 0.85)", letterSpacing: 0.5, fontWeight: 600 }}>{item.label}</div>
                      <div style={{ fontSize: 15, color: "#FDE68A", fontWeight: 800 }}>{item.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dedicated Grand Emotional Dakshina Card (Highest Visibility) */}
            {renderDakshinaCard(false)}

            {/* 50-Page Deluxe Report Banner — 100% Free */}
            <div className="glass-card" style={{ padding: "22px 28px", marginBottom: 24, background: "linear-gradient(135deg, rgba(35,22,65,0.95), rgba(18,12,38,0.98))", border: "1.5px solid rgba(245,158,11,0.5)", borderRadius: 14, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(16,185,129,0.18)", border: "1px solid rgba(16,185,129,0.45)", borderRadius: 12, padding: "4px 12px", color: "#34D399", fontSize: 12, fontWeight: 800, marginBottom: 6 }}>
                  <span>✓</span> {hi ? "100% निःशुल्क महा-रिपोर्ट अनलॉक" : "100% FREE DELUXE REPORT UNLOCKED"}
                </div>
                <h4 style={{ color: "#F3D37A", fontSize: 16.5, fontWeight: 800 }}>
                  {hi ? "सम्पूर्ण 50+ पृष्ठ महा-कुंडली व जीवन दर्शन PDF (निःशुल्क डाउनलोड)" : "Complete 50+ Page Deluxe Kundli Dossier PDF (100% Free)"}
                </h4>
                <p style={{ color: "rgba(241,231,208,0.85)", fontSize: 13, margin: "4px 0 0" }}>
                  {hi ? "दशा चक्र, साढ़ेसाती काल, करियर प्रोमोशन, विवाह योग एवं सम्पूर्ण लाल किताब उपाय।" : "Full planetary dasha timelines, Sade Sati phases, career windows & remedial shields."}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <button
                  onClick={() => handlePrintReport("all")}
                  className="gold-cta-btn"
                  style={{ background: "linear-gradient(90deg, #F59E0B, #D97706)", border: "none", color: "#0F0A1E", padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 14px rgba(245,158,11,0.4)", display: "inline-flex", alignItems: "center", gap: 8 }}
                >
                  <span>📥</span> {hi ? "50-पेज PDF डाउनलोड करें (निःशुल्क)" : "Download Complete 50-Page PDF (FREE)"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCheckout({
                    title: hi ? "श्रद्धा दक्षिणा (Seva Bhent)" : "Offer Dakshina (Sacred Offering)",
                    priceKey: "dakshina",
                    price: PRODUCT_PRICES.dakshina[currency],
                    desc: hi ? "वैदिक ज्योतिष अनुसंधान एवं निःशुल्क सर्वर सेवा हेतु स्वैच्छिक दक्षिणा" : "Voluntary offering to maintain free Vedic compute servers and support seekers worldwide",
                    icon: "🪷",
                    isDakshina: true
                  })}
                  style={{ background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.4)", color: "#FDE68A", padding: "11px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
                >
                  <span>🪷</span> {hi ? "श्रद्धा दक्षिणा दें" : "Offer Dakshina"}
                </button>
              </div>
            </div>

            {/* ── REORGANIZED TAB NAVIGATION (Grouped by Context: Individual vs Universal) ── */}
            <div className="tab-bar-nav no-print" style={{ marginBottom: 30 }}>
              
              {/* Category Filter Pills */}
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => setTabCategoryFilter("all")}
                  style={{
                    padding: "7px 18px",
                    borderRadius: 22,
                    fontSize: 13,
                    fontWeight: tabCategoryFilter === "all" ? 800 : 600,
                    cursor: "pointer",
                    background: tabCategoryFilter === "all" ? "rgba(245, 158, 11, 0.25)" : "rgba(26, 18, 48, 0.6)",
                    border: tabCategoryFilter === "all" ? "1.5px solid #F59E0B" : "1px solid rgba(212, 175, 55, 0.25)",
                    color: tabCategoryFilter === "all" ? "#FDE68A" : "rgba(241, 231, 208, 0.75)",
                    boxShadow: tabCategoryFilter === "all" ? "0 0 12px rgba(245, 158, 11, 0.3)" : "none",
                    transition: "all 0.2s ease"
                  }}
                >
                  ✦ {hi ? `सभी अनुभाग (${PERSONAL_TABS.length + GENERIC_TABS.length})` : `All Sections (${PERSONAL_TABS.length + GENERIC_TABS.length})`}
                </button>
                <button
                  type="button"
                  onClick={() => setTabCategoryFilter("personal")}
                  style={{
                    padding: "7px 18px",
                    borderRadius: 22,
                    fontSize: 13,
                    fontWeight: tabCategoryFilter === "personal" ? 800 : 600,
                    cursor: "pointer",
                    background: tabCategoryFilter === "personal" ? "rgba(245, 158, 11, 0.25)" : "rgba(26, 18, 48, 0.6)",
                    border: tabCategoryFilter === "personal" ? "1.5px solid #F59E0B" : "1px solid rgba(212, 175, 55, 0.25)",
                    color: tabCategoryFilter === "personal" ? "#FDE68A" : "rgba(241, 231, 208, 0.75)",
                    boxShadow: tabCategoryFilter === "personal" ? "0 0 12px rgba(245, 158, 11, 0.3)" : "none",
                    transition: "all 0.2s ease"
                  }}
                >
                  👤 {hi ? `व्यक्तिगत कुंडली (${PERSONAL_TABS.length})` : `Individual Astrology (${PERSONAL_TABS.length})`}
                </button>
                <button
                  type="button"
                  onClick={() => setTabCategoryFilter("generic")}
                  style={{
                    padding: "7px 18px",
                    borderRadius: 22,
                    fontSize: 13,
                    fontWeight: tabCategoryFilter === "generic" ? 800 : 600,
                    cursor: "pointer",
                    background: tabCategoryFilter === "generic" ? "rgba(139, 92, 246, 0.25)" : "rgba(26, 18, 48, 0.6)",
                    border: tabCategoryFilter === "generic" ? "1.5px solid #A78BFA" : "1px solid rgba(212, 175, 55, 0.25)",
                    color: tabCategoryFilter === "generic" ? "#DDD6FE" : "rgba(241, 231, 208, 0.75)",
                    boxShadow: tabCategoryFilter === "generic" ? "0 0 12px rgba(139, 92, 246, 0.3)" : "none",
                    transition: "all 0.2s ease"
                  }}
                >
                  🌐 {hi ? `दैनिक पंचांग व सामान्य सेवाएं (${GENERIC_TABS.length})` : `Universal & Daily Tools (${GENERIC_TABS.length})`}
                </button>
              </div>

              {/* ── GROUP 1: INDIVIDUAL ASTROLOGY (Interconnected to Native's Chart) ── */}
              {(tabCategoryFilter === "all" || tabCategoryFilter === "personal") && (
                <div
                  style={{
                    background: "rgba(18, 12, 36, 0.75)",
                    border: "1.5px solid rgba(245, 158, 11, 0.3)",
                    borderRadius: 18,
                    padding: "16px 20px",
                    marginBottom: 16,
                    boxShadow: "0 6px 24px rgba(0,0,0,0.3)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid rgba(245, 158, 11, 0.18)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 18, color: "#F59E0B" }}>👤</span>
                      <div>
                        <span style={{ fontSize: 14, fontWeight: 800, color: "#FDE68A", letterSpacing: 0.6 }}>
                          {hi ? "व्यक्तिगत कुंडली विश्लेषण" : "INDIVIDUAL ASTROLOGY"}
                        </span>
                        <span style={{ fontSize: 12.5, color: "rgba(241, 231, 208, 0.65)", marginLeft: 8 }}>
                          {hi ? "• आपके जन्म समय व ग्रहों पर आधारित" : "• Connected to your birth chart & exact planetary positions"}
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: 11.5, padding: "4px 10px", borderRadius: 12, background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.3)", color: "#FDE68A", fontWeight: 700 }}>
                      {hi ? `${PERSONAL_TABS.length} व्यक्तिगत भाग` : `${PERSONAL_TABS.length} Linked Sections`}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "flex-start" }}>
                    {PERSONAL_TABS.map(tabItem => {
                      const isActive = tab === tabItem.id;
                      return (
                        <button
                          key={tabItem.id}
                          type="button"
                          onClick={() => setTab(tabItem.id)}
                          className={`tab-btn ${isActive ? "active" : ""}`}
                          style={{
                            fontSize: 13.5,
                            padding: "9px 16px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            borderRadius: 12,
                            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                            background: isActive
                              ? "linear-gradient(135deg, #F59E0B, #D97706)"
                              : "rgba(26, 18, 48, 0.7)",
                            color: isActive ? "#0F0A1E" : "rgba(241, 231, 208, 0.9)",
                            border: isActive ? "1px solid #F59E0B" : "1px solid rgba(212, 175, 55, 0.25)",
                            fontWeight: isActive ? 800 : 600,
                            boxShadow: isActive ? "0 4px 14px rgba(245, 158, 11, 0.4)" : "none",
                            cursor: "pointer"
                          }}
                        >
                          <span style={{ display: "inline-flex", alignItems: "center" }}>
                            {(() => {
                              const TabIcon = Icons[tabItem.iconName];
                              return TabIcon ? <TabIcon size={16} color={isActive ? "#0F0A1E" : "#FDE68A"} /> : tabItem.icon;
                            })()}
                          </span>
                          <span>{hi ? tabItem.labelHi : tabItem.labelEn}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── GROUP 2: GENERIC FOR EVERYONE (Universal Vedic Tools & Calendars) ── */}
              {(tabCategoryFilter === "all" || tabCategoryFilter === "generic") && (
                <div
                  style={{
                    background: "rgba(18, 12, 36, 0.75)",
                    border: "1.5px solid rgba(139, 92, 246, 0.3)",
                    borderRadius: 18,
                    padding: "16px 20px",
                    marginBottom: 24,
                    boxShadow: "0 6px 24px rgba(0,0,0,0.3)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid rgba(139, 92, 246, 0.18)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Icons.Compass size={18} color="#A78BFA" />
                      <div>
                        <span style={{ fontSize: 14, fontWeight: 800, color: "#DDD6FE", letterSpacing: 0.6 }}>
                          {hi ? "सार्वभौमिक वैदिक पंचांग व सामान्य सेवाएं" : "GENERIC FOR EVERYONE · DAILY & UNIVERSAL"}
                        </span>
                        <span style={{ fontSize: 12.5, color: "rgba(241, 231, 208, 0.65)", marginLeft: 8 }}>
                          {hi ? "• दैनिक पंचांग, शुभ मुहूर्त, पर्व व राशिफल" : "• Daily Panchang, Auspicious Muhurats, Festivals & Consultations"}
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: 11.5, padding: "4px 10px", borderRadius: 12, background: "rgba(139, 92, 246, 0.15)", border: "1px solid rgba(139, 92, 246, 0.3)", color: "#DDD6FE", fontWeight: 700 }}>
                      {hi ? "6 सामान्य उपकरण" : "6 Universal Tools"}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "flex-start" }}>
                    {GENERIC_TABS.map(tabItem => {
                      const isActive = tab === tabItem.id;
                      return (
                        <button
                          key={tabItem.id}
                          type="button"
                          onClick={() => setTab(tabItem.id)}
                          className={`tab-btn ${isActive ? "active" : ""}`}
                          style={{
                            fontSize: 13.5,
                            padding: "9px 16px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            borderRadius: 12,
                            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                            background: isActive
                              ? "linear-gradient(135deg, #8B5CF6, #6D28D9)"
                              : "rgba(26, 18, 48, 0.7)",
                            color: isActive ? "#FFFFFF" : "rgba(241, 231, 208, 0.9)",
                            border: isActive ? "1px solid #A78BFA" : "1px solid rgba(139, 92, 246, 0.25)",
                            fontWeight: isActive ? 800 : 600,
                            boxShadow: isActive ? "0 4px 14px rgba(139, 92, 246, 0.4)" : "none",
                            cursor: "pointer"
                          }}
                        >
                          <span style={{ display: "inline-flex", alignItems: "center" }}>
                            {(() => {
                              const TabIcon = Icons[tabItem.iconName];
                              return TabIcon ? <TabIcon size={16} color={isActive ? "#FFFFFF" : "#DDD6FE"} /> : tabItem.icon;
                            })()}
                          </span>
                          <span>{hi ? tabItem.labelHi : tabItem.labelEn}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* ── TAB 1: CHART & SHODASHVARGA DIVISIONAL CHARTS ── */}
            {tab === "chart" && (() => {
              const activeDivisionalList = result.shodashvargaList || [
                { id: "D1", nameEn: "D1 Rashi", nameHi: "डी-१ लग्न कुंडली", descEn: "Physical body, vitality, and primary life destiny", descHi: "शारीरिक ऊर्जा, व्यक्तित्व व संपूर्ण जीवन की दिशा" },
                { id: "D9", nameEn: "D9 Navamsha", nameHi: "डी-९ नवांश कुंडली", descEn: "Dharma, marriage, spouse, and inner soul potential", descHi: "धर्म, दांपत्य सुख, जीवनसाथी व आत्मा का सूक्ष्म स्वरूप" },
                { id: "D10", nameEn: "D10 Dasamsha", nameHi: "डी-१० दशमांश कुंडली", descEn: "Career, profession, reputation, and public accomplishments", descHi: "करियर, आजीविका, प्रतिष्ठा व सामाजिक प्रभाव" },
                { id: "CHALIT", nameEn: "Bhava Chalit", nameHi: "भाव चलित कुंडली", descEn: "Exact active cusp-based house placements of all planets", descHi: "वास्तविक संधि-आधारित ग्रह स्थिति व भाव प्रभाव" },
                { id: "CHANDRA", nameEn: "Chandra Kundli", nameHi: "चंद्र कुंडली", descEn: "Mental perception, emotional rhythm, and public reception", descHi: "मनोवैज्ञानिक दृष्टिकोण, मानसिक शांति व समाज में छवि" },
                { id: "SURYA", nameEn: "Surya Kundli", nameHi: "सूर्य कुंडली", descEn: "Soul purpose, physical vitality, willpower, and authority", descHi: "आत्मबल, शारीरिक तेज, प्रशासनिक क्षमता व प्रभुत्व" },
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
                { id: "D60", nameEn: "D60 Shashtiamsha", nameHi: "डी-६० षष्ट्यंश कुंडली", descEn: "Supreme past-life karmic blueprint and fine destiny", descHi: "सर्वोच्च पूर्वजन्म कर्म चक्र व सूक्ष्म प्रारब्ध" }
              ];
              const currentDivInfo = activeDivisionalList.find(d => d.id === selectedDivisionalChart) || activeDivisionalList[0];
              const activeHouses = (result.divisionalCharts && result.divisionalCharts[selectedDivisionalChart]) || result.houses;

              return (
              <div className="glass-card" style={{ padding: "30px 24px", marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                  <div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "#F59E0B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                      <span>🔯</span> {hi ? "षोडशवर्ग व भाव चलित चक्र" : "SHODASHVARGA & BHAVA CHALIT"}
                    </div>
                    <h3 style={{ color: "#F3D37A", fontSize: 19, fontWeight: 800 }}>
                      {hi ? currentDivInfo.nameHi : currentDivInfo.nameEn}
                    </h3>
                    <p style={{ color: "rgba(241, 231, 208, 0.75)", fontSize: 13, margin: "2px 0 0" }}>
                      {hi ? currentDivInfo.descHi : currentDivInfo.descEn}
                    </p>
                  </div>

                  <div style={{ display: "flex", background: "rgba(11, 8, 25, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", borderRadius: 20, padding: 3 }}>
                    <button
                      onClick={() => setChartStyle("north")}
                      style={{ background: chartStyle === "north" ? "rgba(245, 158, 11, 0.25)" : "transparent", border: "none", color: chartStyle === "north" ? "#FDE68A" : "rgba(241, 231, 208, 0.75)", padding: "7px 14px", borderRadius: 16, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                    >
                      {t.chartStyleNorth}
                    </button>
                    <button
                      onClick={() => setChartStyle("south")}
                      style={{ background: chartStyle === "south" ? "rgba(245, 158, 11, 0.25)" : "transparent", border: "none", color: chartStyle === "south" ? "#FDE68A" : "rgba(241, 231, 208, 0.75)", padding: "7px 14px", borderRadius: 16, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                    >
                      {t.chartStyleSouth}
                    </button>
                  </div>
                </div>

                {/* Divisional Chart Selector Chips */}
                <div style={{ background: "rgba(11, 8, 25, 0.6)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 12, padding: "12px 14px", marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
                    <span style={{ fontSize: 12, color: "#FDE68A", fontWeight: 700, letterSpacing: 0.5 }}>
                      ✦ {hi ? "वर्ग कुंडली बदलें (Click to switch chart view):" : "Switch Divisional Chart View:"}
                    </span>
                    {selectedDivisionalChart !== "D1" && (
                      <button
                        type="button"
                        onClick={() => setSelectedDivisionalChart("D1")}
                        style={{ background: "rgba(245, 158, 11, 0.18)", border: "1px solid #F59E0B", color: "#FDE68A", padding: "3px 10px", borderRadius: 6, fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}
                      >
                        ↺ {hi ? "लग्न कुंडली (D1) पर लौटें" : "Reset to D1 Rashi"}
                      </button>
                    )}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {activeDivisionalList.map(item => {
                      const isSel = selectedDivisionalChart === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedDivisionalChart(item.id)}
                          style={{
                            padding: "5px 12px",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: isSel ? 800 : 600,
                            cursor: "pointer",
                            background: isSel ? "linear-gradient(135deg, #F59E0B, #D97706)" : "rgba(26, 18, 48, 0.75)",
                            border: isSel ? "1px solid #F59E0B" : "1px solid rgba(212, 175, 55, 0.25)",
                            color: isSel ? "#0F0A1E" : "rgba(241, 231, 208, 0.85)",
                            boxShadow: isSel ? "0 2px 10px rgba(245, 158, 11, 0.35)" : "none",
                            transition: "all 0.15s ease"
                          }}
                        >
                          <span>{isSel ? "✦ " : ""}{item.id}</span>
                          <span style={{ opacity: isSel ? 0.95 : 0.7, marginLeft: 4 }}>
                            ({item.id === "D1" ? (hi ? "लग्न" : "Rashi") : item.id === "D9" ? (hi ? "नवांश" : "Navamsha") : item.id === "D10" ? (hi ? "दशमांश" : "Dasamsha") : item.id === "CHALIT" ? (hi ? "चलित" : "Chalit") : item.id === "CHANDRA" ? (hi ? "चंद्र" : "Moon") : item.id})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                  {chartStyle === "north" ? (
                    <NorthIndianChart houses={activeHouses} planetData={result.planetData} lang={lang} hoveredHouse={hoveredHouse} setHoveredHouse={setHoveredHouse} />
                  ) : (
                    <SouthIndianChart houses={activeHouses} planetData={result.planetData} lang={lang} hoveredHouse={hoveredHouse} setHoveredHouse={setHoveredHouse} />
                  )}
                </div>

                {hoveredHouse && (
                  <div style={{ background: "rgba(245, 158, 11, 0.12)", border: "1px solid rgba(245, 158, 11, 0.35)", borderRadius: 12, padding: "14px 20px", marginBottom: 20, animation: "fadeInCard 0.2s ease" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ color: "#FDE68A", fontSize: 14.5, fontWeight: 800 }}>
                        {hi ? `भाव ${hoveredHouse}` : `House ${hoveredHouse}`}: {t.hnames[hoveredHouse - 1]}
                      </span>
                      <span style={{ color: "#F3D37A", fontSize: 13.5, fontWeight: 600 }}>
                        {result.houses[hoveredHouse]?.sign} ({result.houses[hoveredHouse]?.signSanskrit})
                      </span>
                    </div>
                    <p style={{ color: "rgba(241, 231, 208, 0.9)", fontSize: 13.5, lineHeight: 1.7 }}>
                      {result.houses[hoveredHouse]?.interpretation}
                    </p>
                  </div>
                )}

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 24 }}>
                  {PLANETS.map(p => {
                    const pData = result.planetData?.[p.name];
                    const degText = pData?.formattedDegree || pData?.degree || "";
                    return (
                      <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(15, 10, 32, 0.8)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 8, padding: "6px 12px" }}>
                        <span style={{ color: p.color, fontWeight: "bold", fontSize: 13.5 }}>{p.symbol}</span>
                        <span style={{ color: "rgba(241, 231, 208, 0.85)", fontSize: 12.5, fontWeight: 600 }}>{hi ? p.sanskrit : p.name}</span>
                        {degText && <span style={{ color: "#FDE68A", fontSize: 11.5, fontWeight: 700, marginLeft: 2 }}>{degText}</span>}
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                  <div style={{ background: "rgba(15, 10, 32, 0.7)", border: "1px solid rgba(212, 175, 55, 0.2)", borderRadius: 12, padding: "20px 22px" }}>
                    <h4 style={{ color: "#F3D37A", fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                      <span>⚡</span> {t.sec.yogas}
                    </h4>
                    <div style={{ color: "rgba(241, 231, 208, 0.9)", fontSize: 14, lineHeight: 1.85, whiteSpace: "pre-wrap" }}>
                      {result.yogas}
                    </div>
                  </div>

                  <div style={{ background: "rgba(15, 10, 32, 0.7)", border: "1px solid rgba(212, 175, 55, 0.2)", borderRadius: 12, padding: "20px 22px" }}>
                    <h4 style={{ color: "#F3D37A", fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                      <span>⏱️</span> {t.sec.dasha}
                    </h4>
                    <div style={{ color: "rgba(241, 231, 208, 0.9)", fontSize: 14, lineHeight: 1.85, whiteSpace: "pre-wrap" }}>
                      {result.dasha}
                    </div>
                  </div>

                  {/* Planetary Positions, Conjunctions & Life Impact Spotlight Card */}
                  <div style={{
                    marginTop: 18,
                    background: "linear-gradient(135deg, rgba(245,158,11,0.18) 0%, rgba(139,92,246,0.2) 100%)",
                    border: "1.5px solid rgba(245,158,11,0.45)",
                    borderRadius: 14,
                    padding: "20px 22px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 16,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.35)"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 260, flex: 1 }}>
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: "rgba(245,158,11,0.15)",
                        border: "1px solid rgba(245,158,11,0.35)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 26
                      }}>
                        🪐
                      </div>
                      <div>
                        <div style={{ color: "#FDE68A", fontSize: 16, fontWeight: 800 }}>
                          {hi ? "ग्रह स्थिति, युति एवं संपूर्ण जीवन प्रभाव विश्लेषण" : "Planetary Positions, Yutis & Multi-Life Impact"}
                        </div>
                        <div style={{ color: "rgba(241,231,208,0.82)", fontSize: 13, marginTop: 3 }}>
                          {hi
                            ? "प्रत्येक ग्रह के अंश (Degree), बाल्यावस्था/युवावस्था बल, सक्रिय ग्रह युतियां व करियर, शिक्षा, दांपत्य, धन व स्वास्थ्य प्रभाव देखें।"
                            : "Explore exact degree avasthas, planetary combinations (yutis), and multi-dimensional impact on career, education, love life, wealth & health."}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setTab("planets");
                        window.scrollTo({ top: 400, behavior: "smooth" });
                      }}
                      style={{
                        background: "linear-gradient(90deg, #F59E0B, #D97706)",
                        color: "#0F0A1E",
                        border: "none",
                        borderRadius: 10,
                        padding: "11px 20px",
                        fontWeight: 800,
                        fontSize: 14,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        boxShadow: "0 4px 16px rgba(245,158,11,0.4)",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <span>{hi ? "ग्रह स्थिति व प्रभाव देखें" : "Explore Planetary Impact"}</span>
                      <span style={{ fontSize: 16 }}>→</span>
                    </button>
                  </div>
                </div>

                {/* ── MODULE 4: BHAVA CHALIT & CUSP DIAGNOSTICS ── */}
                {result.bhavaChalit && (
                  <div style={{ marginTop: 20, background: "rgba(18, 12, 36, 0.8)", border: "1.5px solid rgba(245, 158, 11, 0.35)", borderRadius: 14, padding: "18px 22px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 20, color: "#F59E0B" }}>🌀</span>
                        <div>
                          <h4 style={{ color: "#FDE68A", fontSize: 15.5, fontWeight: 800, margin: 0 }}>
                            {hi ? "भाव चलित विश्लेषण व संधि बिंदु (Bhava Chalit Engine)" : "Bhava Chalit Engine & Cusp Analysis"}
                          </h4>
                          <span style={{ color: "rgba(241, 231, 208, 0.7)", fontSize: 12 }}>
                            {hi ? "श्रीपति पद्धति अनुसार वास्तविक भाव सीमाएं एवं ग्रह स्थानांतरण" : "Actual karmic house cusps & planetary shifts according to Sripati system"}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          type="button"
                          onClick={() => setSelectedDivisionalChart(selectedDivisionalChart === "CHALIT" ? "D1" : "CHALIT")}
                          style={{
                            background: selectedDivisionalChart === "CHALIT" ? "linear-gradient(135deg, #F59E0B, #D97706)" : "rgba(245, 158, 11, 0.15)",
                            border: "1px solid #F59E0B",
                            borderRadius: 8,
                            color: selectedDivisionalChart === "CHALIT" ? "#0F0A1E" : "#FDE68A",
                            padding: "6px 14px",
                            fontSize: 12.5,
                            fontWeight: 700,
                            cursor: "pointer"
                          }}
                        >
                          {selectedDivisionalChart === "CHALIT" ? (hi ? "✓ चलित कुंडली दृश्यमान" : "✓ Viewing Chalit Chart") : (hi ? "चलित कुंडली देखें" : "View Chalit Chart")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowBhavaCuspTable(!showBhavaCuspTable)}
                          style={{ background: "rgba(11, 8, 25, 0.7)", border: "1px solid rgba(212, 175, 55, 0.35)", borderRadius: 8, color: "#FDE68A", padding: "6px 14px", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
                        >
                          {showBhavaCuspTable ? (hi ? "▲ संधि विवरण छिपाएं" : "▲ Hide Cusp Table") : (hi ? "▼ 12 भाव संधि व मध्य देखें" : "▼ View 12 Bhavas Cusp Table")}
                        </button>
                      </div>
                    </div>

                    {result.bhavaChalit.hasShift ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ fontSize: 12.5, color: "#F59E0B", fontWeight: 700 }}>
                          ⚡ {hi ? "ग्रह भाव परिवर्तन (Planets Shifting House in Chalit):" : "Planetary House Transitions in Chalit:"}
                        </div>
                        {result.bhavaChalit.shiftedPlanets.map((shift, idx) => (
                          <div key={idx} style={{ background: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.25)", borderRadius: 8, padding: "9px 14px", fontSize: 13 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800 }}>
                              <span style={{ color: "#FDE68A" }}>✦ {shift.planet}</span>
                              <span style={{ color: "#34D399" }}>
                                {hi ? `लग्न कुंडली भाव ${shift.rashiHouse} ➔ चलित भाव ${shift.chalitHouse}` : `D1 House ${shift.rashiHouse} ➔ Chalit House ${shift.chalitHouse}`}
                              </span>
                            </div>
                            <div style={{ color: "rgba(241, 231, 208, 0.8)", fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>
                              {hi ? shift.reasonHi : shift.reasonEn}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: 8, padding: "10px 14px", color: "#34D399", fontSize: 13 }}>
                        ✓ {hi ? "सर्व ग्रह समरूप: आपकी कुंडली में सभी ग्रह भाव चलित और लग्न कुंडली दोनों में समान भावों में स्थित हैं।" : "Full Alignment: All 9 planets occupy the exact same houses in both D1 Rashi and Bhava Chalit charts."}
                      </div>
                    )}

                    {/* Bhava Cusps Table */}
                    {showBhavaCuspTable && (
                      <div style={{ marginTop: 16, overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, textAlign: "left", color: "rgba(241,231,208,0.9)" }}>
                          <thead>
                            <tr style={{ background: "rgba(245, 158, 11, 0.18)", borderBottom: "1px solid rgba(245, 158, 11, 0.35)" }}>
                              <th style={{ padding: "8px 10px" }}>{hi ? "भाव" : "House"}</th>
                              <th style={{ padding: "8px 10px" }}>{hi ? "राशि" : "Sign"}</th>
                              <th style={{ padding: "8px 10px" }}>{hi ? "भाव आरंभ (Cusp Start)" : "Bhava Arambha (Start)"}</th>
                              <th style={{ padding: "8px 10px", color: "#FDE68A" }}>{hi ? "भाव मध्य (Cusp Peak)" : "Bhava Madhya (Peak)"}</th>
                              <th style={{ padding: "8px 10px" }}>{hi ? "भाव अंत (Cusp End)" : "Bhava Anta (End)"}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.bhavaChalit.bhavaCuspsTable.map(row => (
                              <tr key={row.house} style={{ borderBottom: "1px solid rgba(212, 175, 55, 0.15)" }}>
                                <td style={{ padding: "7px 10px", fontWeight: 700, color: "#FDE68A" }}>{hi ? `भाव ${row.house}` : `House ${row.house}`}</td>
                                <td style={{ padding: "7px 10px" }}>{hi ? row.signSanskrit : row.sign}</td>
                                <td style={{ padding: "7px 10px", opacity: 0.85 }}>{row.arambha}</td>
                                <td style={{ padding: "7px 10px", color: "#34D399", fontWeight: 700 }}>{row.madhya}</td>
                                <td style={{ padding: "7px 10px", opacity: 0.85 }}>{row.anta}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

            {/* ── TAB 2: OVERVIEW & NATAL PANCHANGA & AVAKAHADA CHAKRA ── */}
            {tab === "overview" && (
              <div>
                {/* 1. Natal Birth Panchanga Engine Card */}
                {result.natalPanchang && (
                  <div className="glass-card" style={{ padding: "26px 28px", marginBottom: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(212,175,55,0.25)", paddingBottom: 12, marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 24 }}>🕉️</span>
                        <div>
                          <div style={{ fontSize: 11.5, color: "#F59E0B", fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
                            MODULE 2 · NATAL PANCHANGA ENGINE
                          </div>
                          <h3 style={{ color: "#F3D37A", fontSize: 18, fontWeight: 800, margin: 0 }}>
                            {hi ? "जन्म कालीन पंचांग (Natal Birth Panchang)" : "Natal Birth Panchanga (Five Cosmic Limbs at Birth)"}
                          </h3>
                        </div>
                      </div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.35)", borderRadius: 14, padding: "4px 12px", color: "#FDE68A", fontSize: 12, fontWeight: 700 }}>
                        <span>☀️</span> {result.natalPanchang.birthKaal}
                      </div>
                    </div>

                    {/* 5 Angas Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 16 }}>
                      {/* Tithi */}
                      <div style={{ background: "rgba(11, 8, 25, 0.65)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 12, padding: "12px 14px" }}>
                        <div style={{ fontSize: 11.5, color: "rgba(243, 211, 122, 0.8)", fontWeight: 600 }}>1. {hi ? "तिथि (Tithi)" : "Tithi (Lunar Day)"}</div>
                        <div style={{ fontSize: 15, color: "#FDE68A", fontWeight: 800, marginTop: 2 }}>{result.natalPanchang.tithi}</div>
                        <div style={{ fontSize: 12, color: "#34D399", marginTop: 2 }}>{result.natalPanchang.paksha}</div>
                        <div style={{ fontSize: 11.5, color: "rgba(241, 231, 208, 0.65)", marginTop: 4 }}>
                          {hi ? `देवता: ${result.natalPanchang.tithiDeity}` : `Deity: ${result.natalPanchang.tithiDeity}`}
                        </div>
                      </div>

                      {/* Vaar */}
                      <div style={{ background: "rgba(11, 8, 25, 0.65)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 12, padding: "12px 14px" }}>
                        <div style={{ fontSize: 11.5, color: "rgba(243, 211, 122, 0.8)", fontWeight: 600 }}>2. {hi ? "वार (Solar Day)" : "Vaar (Solar Day)"}</div>
                        <div style={{ fontSize: 15, color: "#FDE68A", fontWeight: 800, marginTop: 2 }}>{result.natalPanchang.vaar}</div>
                        <div style={{ fontSize: 12, color: "#34D399", marginTop: 2 }}>
                          {hi ? `स्वामी: ${result.natalPanchang.vaarLord}` : `Lord: ${result.natalPanchang.vaarLord}`}
                        </div>
                        <div style={{ fontSize: 11.5, color: "rgba(241, 231, 208, 0.65)", marginTop: 4 }}>
                          {hi ? `उपास्य: ${result.natalPanchang.vaarDeity}` : `Deity: ${result.natalPanchang.vaarDeity}`}
                        </div>
                      </div>

                      {/* Nakshatra */}
                      <div style={{ background: "rgba(11, 8, 25, 0.65)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 12, padding: "12px 14px" }}>
                        <div style={{ fontSize: 11.5, color: "rgba(243, 211, 122, 0.8)", fontWeight: 600 }}>3. {hi ? "नक्षत्र (Nakshatra)" : "Nakshatra (Lunar Mansion)"}</div>
                        <div style={{ fontSize: 15, color: "#FDE68A", fontWeight: 800, marginTop: 2 }}>{result.natalPanchang.nakshatra}</div>
                        <div style={{ fontSize: 12, color: "#34D399", marginTop: 2 }}>
                          {hi ? `नक्षत्र स्वामी: ${result.natalPanchang.nakshatraLord}` : `Ruler: ${result.natalPanchang.nakshatraLord}`}
                        </div>
                        <div style={{ fontSize: 11.5, color: "rgba(241, 231, 208, 0.65)", marginTop: 4 }}>
                          {hi ? `गण: ${result.natalPanchang.nakshatraGana} · नाड़ी: ${result.natalPanchang.nakshatraNadi}` : `Gana: ${result.natalPanchang.nakshatraGana} · Nadi: ${result.natalPanchang.nakshatraNadi}`}
                        </div>
                      </div>

                      {/* Yoga */}
                      <div style={{ background: "rgba(11, 8, 25, 0.65)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 12, padding: "12px 14px" }}>
                        <div style={{ fontSize: 11.5, color: "rgba(243, 211, 122, 0.8)", fontWeight: 600 }}>4. {hi ? "योग (Solilunar Yoga)" : "Yoga (Solilunar Aspect)"}</div>
                        <div style={{ fontSize: 15, color: "#FDE68A", fontWeight: 800, marginTop: 2 }}>{result.natalPanchang.yoga}</div>
                        <div style={{ fontSize: 12, color: result.natalPanchang.isYogaAuspicious ? "#34D399" : "#F59E0B", marginTop: 2 }}>
                          {result.natalPanchang.yogaStatus}
                        </div>
                        <div style={{ fontSize: 11.5, color: "rgba(241, 231, 208, 0.65)", marginTop: 4 }}>
                          {hi ? "सूर्य-चंद्र का संयुक्त प्रभाव" : "Solilunar alignment"}
                        </div>
                      </div>

                      {/* Karana */}
                      <div style={{ background: "rgba(11, 8, 25, 0.65)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 12, padding: "12px 14px" }}>
                        <div style={{ fontSize: 11.5, color: "rgba(243, 211, 122, 0.8)", fontWeight: 600 }}>5. {hi ? "करण (Karana - Half Tithi)" : "Karana (Half Tithi)"}</div>
                        <div style={{ fontSize: 15, color: "#FDE68A", fontWeight: 800, marginTop: 2 }}>{result.natalPanchang.karana}</div>
                        <div style={{ fontSize: 12, color: "#34D399", marginTop: 2 }}>
                          {hi ? `प्रतीक: ${result.natalPanchang.karanaAnimal}` : `Animal: ${result.natalPanchang.karanaAnimal}`}
                        </div>
                        <div style={{ fontSize: 11.5, color: "rgba(241, 231, 208, 0.65)", marginTop: 4 }}>
                          {hi ? `करण स्वामी: ${result.natalPanchang.karanaLord}` : `Lord: ${result.natalPanchang.karanaLord}`}
                        </div>
                      </div>
                    </div>

                    {/* Secondary Solar & Muhurat Details */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "space-between", background: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.2)", borderRadius: 10, padding: "10px 16px", fontSize: 12.5 }}>
                      <div><span style={{ color: "#F59E0B", fontWeight: 700 }}>🌅 {hi ? "सूर्योदय" : "Sunrise"}:</span> <span style={{ color: "#FDE68A" }}>{result.natalPanchang.sunrise}</span></div>
                      <div><span style={{ color: "#F59E0B", fontWeight: 700 }}>🌇 {hi ? "सूर्यास्त" : "Sunset"}:</span> <span style={{ color: "#FDE68A" }}>{result.natalPanchang.sunset}</span></div>
                      <div><span style={{ color: "#F59E0B", fontWeight: 700 }}>⏳ {hi ? "दिनमान" : "Day Length"}:</span> <span style={{ color: "#FDE68A" }}>{result.natalPanchang.dayLength}</span></div>
                      <div><span style={{ color: "#F59E0B", fontWeight: 700 }}>⚠️ {hi ? "राहु काल (जन्म दिवस)" : "Rahu Kaal"}:</span> <span style={{ color: "#F87171" }}>{result.natalPanchang.rahuKaal}</span></div>
                    </div>
                  </div>
                )}

                {/* 2. Avakahada Chakra Engine Card (Module 5) */}
                {result.avakahadaChakra && (
                  <div className="glass-card" style={{ padding: "26px 28px", marginBottom: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(212,175,55,0.25)", paddingBottom: 12, marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 24 }}>⭐</span>
                        <div>
                          <div style={{ fontSize: 11.5, color: "#F59E0B", fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
                            MODULE 5 · NAKSHATRA & AVAKAHADA ENGINE
                          </div>
                          <h3 style={{ color: "#F3D37A", fontSize: 18, fontWeight: 800, margin: 0 }}>
                            {hi ? "अवकहड़ा चक्र एवं नामाक्षर (Avakahada Chakra)" : "Avakahada Chakra & Lucky Name Syllables"}
                          </h3>
                        </div>
                      </div>
                      <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.4)", borderRadius: 14, padding: "4px 12px", color: "#34D399", fontSize: 12, fontWeight: 700 }}>
                        ✦ {result.avakahadaChakra.paya.split(" ")[0]} {hi ? "पाया" : "Foot"}
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12, marginBottom: 16 }}>
                      <div style={{ background: "rgba(11, 8, 25, 0.65)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 10, padding: "10px 14px" }}>
                        <div style={{ fontSize: 11.5, color: "rgba(243, 211, 122, 0.8)", fontWeight: 600 }}>{hi ? "वर्ण (Varna)" : "Varna (Caste/Class)"}</div>
                        <div style={{ fontSize: 14.5, color: "#FDE68A", fontWeight: 800, marginTop: 2 }}>{result.avakahadaChakra.varna}</div>
                      </div>
                      <div style={{ background: "rgba(11, 8, 25, 0.65)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 10, padding: "10px 14px" }}>
                        <div style={{ fontSize: 11.5, color: "rgba(243, 211, 122, 0.8)", fontWeight: 600 }}>{hi ? "वश्य (Vashya)" : "Vashya (Control Group)"}</div>
                        <div style={{ fontSize: 14.5, color: "#FDE68A", fontWeight: 800, marginTop: 2 }}>{result.avakahadaChakra.vashya}</div>
                      </div>
                      <div style={{ background: "rgba(11, 8, 25, 0.65)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 10, padding: "10px 14px" }}>
                        <div style={{ fontSize: 11.5, color: "rgba(243, 211, 122, 0.8)", fontWeight: 600 }}>{hi ? "योनि (Yoni Archetype)" : "Yoni (Animal Archetype)"}</div>
                        <div style={{ fontSize: 14.5, color: "#FDE68A", fontWeight: 800, marginTop: 2 }}>{result.avakahadaChakra.yoni}</div>
                      </div>
                      <div style={{ background: "rgba(11, 8, 25, 0.65)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 10, padding: "10px 14px" }}>
                        <div style={{ fontSize: 11.5, color: "rgba(243, 211, 122, 0.8)", fontWeight: 600 }}>{hi ? "गण (Gana)" : "Gana (Temperament)"}</div>
                        <div style={{ fontSize: 14.5, color: "#FDE68A", fontWeight: 800, marginTop: 2 }}>{result.avakahadaChakra.gana}</div>
                      </div>
                      <div style={{ background: "rgba(11, 8, 25, 0.65)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 10, padding: "10px 14px" }}>
                        <div style={{ fontSize: 11.5, color: "rgba(243, 211, 122, 0.8)", fontWeight: 600 }}>{hi ? "नाड़ी (Nadi)" : "Nadi (Humor/Dosha)"}</div>
                        <div style={{ fontSize: 14.5, color: "#FDE68A", fontWeight: 800, marginTop: 2 }}>{result.avakahadaChakra.nadi}</div>
                      </div>
                      <div style={{ background: "rgba(11, 8, 25, 0.65)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 10, padding: "10px 14px" }}>
                        <div style={{ fontSize: 11.5, color: "rgba(243, 211, 122, 0.8)", fontWeight: 600 }}>{hi ? "तत्व (Cosmic Element)" : "Tatva (Element)"}</div>
                        <div style={{ fontSize: 14.5, color: "#FDE68A", fontWeight: 800, marginTop: 2 }}>{result.avakahadaChakra.tatva}</div>
                      </div>
                    </div>

                    {/* Paya & Namakshar Details */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
                      <div style={{ background: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.25)", borderRadius: 10, padding: "12px 16px" }}>
                        <div style={{ fontSize: 12, color: "#FDE68A", fontWeight: 700 }}>
                          🦶 {hi ? "पाया विचार (Birth Foot):" : "Paya Auspiciousness:"} <span style={{ color: "#34D399" }}>{result.avakahadaChakra.paya}</span>
                        </div>
                        <p style={{ color: "rgba(241, 231, 208, 0.85)", fontSize: 12.5, margin: "4px 0 0", lineHeight: 1.5 }}>
                          {result.avakahadaChakra.payaDesc}
                        </p>
                      </div>

                      <div style={{ background: "rgba(139, 92, 246, 0.08)", border: "1px solid rgba(139, 92, 246, 0.25)", borderRadius: 10, padding: "12px 16px" }}>
                        <div style={{ fontSize: 12, color: "#DDD6FE", fontWeight: 700 }}>
                          ✍️ {hi ? "शुभ नामाक्षर (Auspicious Naming Syllable):" : "Auspicious Name Syllables:"} <span style={{ color: "#FDE68A", fontSize: 14 }}>{result.avakahadaChakra.namakshar}</span>
                        </div>
                        <p style={{ color: "rgba(241, 231, 208, 0.85)", fontSize: 12.5, margin: "4px 0 0", lineHeight: 1.5 }}>
                          {hi ? `नक्षत्र के सभी ४ चरणों के नामाक्षर: ${result.avakahadaChakra.allSyllables}` : `Syllables across all 4 padas: ${result.avakahadaChakra.allSyllables}`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Birth Data & Sidereal Astronomy Engine Card (Module 1) */}
                {result.astronomicalSummary && (
                  <div className="glass-card" style={{ padding: "20px 24px", marginBottom: 24, background: "rgba(11, 8, 25, 0.65)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 18, color: "#F59E0B" }}>🌐</span>
                        <span style={{ color: "#FDE68A", fontSize: 14, fontWeight: 800 }}>
                          {hi ? "जन्म समय खगोलीय गणना विवरण (Birth Data & Astronomical Engine)" : "Birth Astronomical Coordinates & Sidereal Time (Module 1)"}
                        </span>
                      </div>
                      <span style={{ fontSize: 11.5, color: "rgba(241, 231, 208, 0.65)" }}>
                        {hi ? "चित्रा पक्ष (लाहिड़ी) अयनांश" : "Chitra Paksha (Lahiri) Ayanamsa"}
                      </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, fontSize: 12.5 }}>
                      <div style={{ background: "rgba(26, 18, 48, 0.7)", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(212, 175, 55, 0.2)" }}>
                        <div style={{ color: "rgba(243, 211, 122, 0.75)" }}>{hi ? "लाहिड़ी अयनांश" : "Lahiri Ayanamsa"}</div>
                        <div style={{ color: "#FDE68A", fontWeight: 700, marginTop: 2 }}>{result.astronomicalSummary.ayanamsa}</div>
                      </div>
                      <div style={{ background: "rgba(26, 18, 48, 0.7)", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(212, 175, 55, 0.2)" }}>
                        <div style={{ color: "rgba(243, 211, 122, 0.75)" }}>{hi ? "जूलियन दिन (JD)" : "Julian Day (JD)"}</div>
                        <div style={{ color: "#FDE68A", fontWeight: 700, marginTop: 2 }}>{result.astronomicalSummary.julianDay}</div>
                      </div>
                      <div style={{ background: "rgba(26, 18, 48, 0.7)", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(212, 175, 55, 0.2)" }}>
                        <div style={{ color: "rgba(243, 211, 122, 0.75)" }}>{hi ? "स्थानीय नाक्षत्र काल (LST)" : "Local Sidereal (LST)"}</div>
                        <div style={{ color: "#FDE68A", fontWeight: 700, marginTop: 2 }}>{result.astronomicalSummary.lst}</div>
                      </div>
                      <div style={{ background: "rgba(26, 18, 48, 0.7)", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(212, 175, 55, 0.2)" }}>
                        <div style={{ color: "rgba(243, 211, 122, 0.75)" }}>{hi ? "ग्रीनविच नाक्षत्र काल (GMST)" : "Greenwich Sidereal (GMST)"}</div>
                        <div style={{ color: "#FDE68A", fontWeight: 700, marginTop: 2 }}>{result.astronomicalSummary.gmst}</div>
                      </div>
                      <div style={{ background: "rgba(26, 18, 48, 0.7)", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(212, 175, 55, 0.2)" }}>
                        <div style={{ color: "rgba(243, 211, 122, 0.75)" }}>{hi ? "अक्षांश व देशांतर" : "Coordinates"}</div>
                        <div style={{ color: "#FDE68A", fontWeight: 700, marginTop: 2 }}>{result.astronomicalSummary.latitude}°N, {result.astronomicalSummary.longitude}°E</div>
                      </div>
                    </div>
                  </div>
                )}

                <SectionCard icon="🌟" title={t.sec.blueprint} content={result.overview} />
                <SectionCard icon="⚡" title={t.sec.yogas} content={result.yogas} />
                <SectionCard icon="✨" title={t.sec.verdict} content={result.verdict} highlight />
              </div>
            )}

            {/* ── TAB: CAREER, JOB & BUSINESS PREDICTION (FREEMIUM + PAID GATE) ── */}
            {tab === "careerTiming" && (() => {
              const cp = result.careerPrediction || calculateCareerPrediction({
                name: form.name || "User",
                dob: form.dob || "1998-01-01",
                lagnaSign: result.lagnaSign,
                rashiSign: result.rashiSign,
                lang
              });
              const unlockPrice = PRODUCT_PRICES.careerReport[currency];

              return (
                <div>
                  {/* Top Free Career Overview Card */}
                  <div className="glass-card" style={{ padding: "28px 30px", marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 16, marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                      <div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 12, padding: "4px 12px", color: "#FDE68A", fontSize: 12, fontWeight: 800, marginBottom: 4 }}>
                          <span>💼</span> {hi ? "दशम भाव कर्म स्थान एवं डी-१० दशांश विश्लेषण" : "10TH HOUSE KARMA & D10 ANALYSIS"}
                        </div>
                        <h3 style={{ color: "#F3D37A", fontSize: 19, fontWeight: 800, marginTop: 4 }}>
                          {form.name || "Native"} — {hi ? "करियर, नौकरी व व्यावसायिक मार्गदर्शन" : "Career, Job & Business Growth Blueprint"}
                        </h3>
                        <p style={{ color: "rgba(241,231,208,0.75)", fontSize: 13, marginTop: 3 }}>
                          {hi ? `दशम भाव राशि: ${cp.tenthSign} | कर्मेश: ${cp.tenthLord}` : `10th House Sign: ${cp.tenthSign} | 10th Lord: ${cp.tenthLord}`}
                        </p>
                      </div>

                      <div style={{ textAlign: "right", background: "rgba(11,8,25,0.6)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 12, padding: "10px 18px" }}>
                        <div style={{ fontSize: 12, color: "rgba(243,211,122,0.85)", fontWeight: 600 }}>{hi ? "करियर सफलता योग" : "Career Elevation Index"}</div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: "#34D399" }}>{cp.scores.corporate}%</div>
                      </div>
                    </div>

                    {/* Primary Archetype & Recommended Streams (FREE) */}
                    <div style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(11,8,25,0.8))", border: "1px solid rgba(245,158,11,0.35)", borderRadius: 14, padding: "20px 22px", marginBottom: 20 }}>
                      <div style={{ fontSize: 12, color: "#FDE68A", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>
                        🌟 {hi ? "आपका प्रधान करियर स्वभाव (Primary Career Archetype)" : "Dominant Professional Archetype"}
                      </div>
                      <h4 style={{ color: "#FFF", fontSize: 18, fontWeight: 800, marginTop: 4, marginBottom: 12 }}>
                        {cp.archetypeTitle}
                      </h4>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
                        {cp.primarySectors.map((sector, idx) => (
                          <div key={idx} style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ color: "#34D399", fontSize: 16 }}>✦</span>
                            <span style={{ color: "#FDE68A", fontSize: 13, fontWeight: 600 }}>{sector}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 4 Domain Suitability Spectrum (Govt vs Corporate vs Business vs Creative) (FREE) */}
                    <div style={{ marginBottom: 16 }}>
                      <h4 style={{ color: "#F3D37A", fontSize: 15.5, fontWeight: 800, marginBottom: 14 }}>
                        📊 {hi ? "क्षेत्र-वार अनुकूलता सूचकांक (Domain Suitability Spectrum)" : "Career Domain Suitability Spectrum"}
                      </h4>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12 }}>
                        {[
                          { name: hi ? "सरकारी व प्रशासनिक सेवा (Govt/PSU)" : "Government & Civil Administration", score: cp.scores.govt, icon: "🏛️", color: "#F59E0B" },
                          { name: hi ? "कॉर्पोरेट व आईटी नेतृत्व (Corporate/Tech)" : "Corporate & High-Tech Leadership", score: cp.scores.corporate, icon: "💼", color: "#60A5FA" },
                          { name: hi ? "स्वतंत्र व्यापार व उद्यम (Business/Startups)" : "Business & Scalable Startups", score: cp.scores.business, icon: "🚀", color: "#34D399" },
                          { name: hi ? "रिसर्च, मीडिया व कला (Creative/Research)" : "Creative Media & Advisory", score: cp.scores.creative, icon: "🎨", color: "#F472B6" },
                        ].map((domain, i) => (
                          <div key={i} style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: "14px 16px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                              <span style={{ color: "#FDE68A", fontSize: 13, fontWeight: 700 }}>{domain.icon} {domain.name}</span>
                              <span style={{ color: domain.color, fontSize: 14, fontWeight: 800 }}>{domain.score}%</span>
                            </div>
                            <div style={{ width: "100%", height: 7, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
                              <div style={{ width: `${domain.score}%`, height: "100%", background: domain.color, borderRadius: 4 }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Free Daily Career Mantra */}
                    <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 12, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                      <div style={{ color: "#34D399", fontSize: 13.5, fontWeight: 700 }}>
                        ☀️ {hi ? "दैनिक करियर सफलता मंत्र (Daily Career Mantra):" : "Daily Career Focus Mantra:"}
                      </div>
                      <div style={{ color: "#FDE68A", fontSize: 14.5, fontWeight: 800, letterSpacing: 0.5 }}>
                        {cp.dailyCareerMantra}
                      </div>
                    </div>
                  </div>

                  {/* ── PREMIUM LOCKED / BLURRED DEEP REPORT SECTION ── */}
                  <div style={{ position: "relative", marginBottom: 24 }}>
                    <div className="glass-card" style={{ padding: "28px 30px", filter: effectiveCareerUnlocked ? "none" : "blur(5px)", pointerEvents: effectiveCareerUnlocked ? "auto" : "none", userSelect: effectiveCareerUnlocked ? "auto" : "none", transition: "all 0.3s ease" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 14, marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 22 }}>📜</span>
                          <h4 style={{ color: "#F3D37A", fontSize: 16.5, fontWeight: 800 }}>
                            {hi ? "सटीक पदोन्नति कालखंड, नौकरी परिवर्तन व व्यापार ब्लूप्रिंट (Confidential Report)" : "Exact Promotion Windows, Job Switch Timing & Business Blueprint"}
                          </h4>
                        </div>
                        {effectiveCareerUnlocked && (
                          <div style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 12, padding: "3px 12px", color: "#34D399", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", gap: 4 }}>
                            <span>✓</span> {hi ? "प्रीमियम रिपोर्ट सक्रिय" : "Premium Report Active"}
                          </div>
                        )}
                      </div>

                      {/* Golden Career Timeline */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 14, marginBottom: 20 }}>
                        <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 12, padding: "16px 18px" }}>
                          <div style={{ color: "#34D399", fontSize: 13, fontWeight: 800, marginBottom: 4 }}>
                            📈 {hi ? "पदोन्नति व अप्रेजल काल" : "Next Promotion & Appraisal Window"}
                          </div>
                          <div style={{ color: "#FFF", fontSize: 14, fontWeight: 700 }}>
                            {cp.appraisalWindow}
                          </div>
                        </div>

                        <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.35)", borderRadius: 12, padding: "16px 18px" }}>
                          <div style={{ color: "#FDE68A", fontSize: 13, fontWeight: 800, marginBottom: 4 }}>
                            🔄 {hi ? "नौकरी परिवर्तन व वेतन वृद्धि" : "Job Switch & High-Package Timing"}
                          </div>
                          <div style={{ color: "#FFF", fontSize: 14, fontWeight: 700 }}>
                            {cp.jobChangeWindow}
                          </div>
                        </div>

                        <div style={{ background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.35)", borderRadius: 12, padding: "16px 18px" }}>
                          <div style={{ color: "#60A5FA", fontSize: 13, fontWeight: 800, marginBottom: 4 }}>
                            🌐 {hi ? "व्यापार विस्तार व वैश्विक अवसर" : "Business Launch & Expansion Phase"}
                          </div>
                          <div style={{ color: "#FFF", fontSize: 14, fontWeight: 700 }}>
                            {cp.expansionWindow}
                          </div>
                        </div>
                      </div>

                      {/* Workplace Obstacles & Doshas */}
                      <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 12, padding: "16px 18px", marginBottom: 20 }}>
                        <div style={{ color: "#F3D37A", fontSize: 14, fontWeight: 800, marginBottom: 6 }}>
                          ⚠️ {hi ? "कार्यक्षेत्र में आने वाले अवरोध व उनका ज्योतिषीय कारण" : "Workplace Friction & Astrological Diagnostics"}
                        </div>
                        <p style={{ color: "rgba(241,231,208,0.9)", fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>
                          {cp.obstacleAnalysis}
                        </p>
                      </div>

                      {/* Actionable Remedies */}
                      <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.35)", borderRadius: 12, padding: "18px 20px", marginBottom: 18 }}>
                        <div style={{ color: "#FDE68A", fontSize: 14.5, fontWeight: 800, marginBottom: 8 }}>
                          🛡️ {hi ? "करियर उन्नति के अचूक वैदिक उपाय व विधान" : "Actionable Vedic Remedies for Rapid Career Elevation"}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
                          {cp.remedies.map((rem, i) => (
                            <p key={i} style={{ color: "rgba(241,231,208,0.92)", fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>
                              {rem}
                            </p>
                          ))}
                        </div>
                      </div>

                      {effectiveCareerUnlocked && (
                        <div style={{ textAlign: "center", paddingTop: 14, display: "flex", justifyContent: "center", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                          <button onClick={() => handlePrintReport("career")} className="gold-cta-btn" style={{ padding: "11px 24px", fontSize: 13.5 }}>
                            📄 {hi ? "करियर PDF रिपोर्ट प्रिंट / डाउनलोड करें (FREE)" : "Save / Print Career Report PDF (FREE)"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveCheckout({
                              title: hi ? "श्रद्धा दक्षिणा (Seva Bhent)" : "Offer Dakshina (Sacred Offering)",
                              priceKey: "dakshina",
                              price: PRODUCT_PRICES.dakshina[currency],
                              desc: hi ? "वैदिक ज्योतिष अनुसंधान एवं निःशुल्क सर्वर सेवा हेतु स्वैच्छिक दक्षिणा" : "Voluntary offering to maintain free Vedic compute servers and support seekers worldwide",
                              icon: "🪷",
                              isDakshina: true
                            })}
                            style={{ background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.4)", color: "#FDE68A", padding: "10px 18px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
                          >
                            <span>🪷</span> {hi ? "श्रद्धा दक्षिणा दें" : "Offer Dakshina"}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Paywall Overlay Banner (When Locked) */}
                    {!effectiveCareerUnlocked && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(11,8,25,0.86)", backdropFilter: "blur(6px)", borderRadius: 16, border: "2px solid rgba(245,158,11,0.5)", padding: "26px 22px", textAlign: "center", zIndex: 10 }}>
                        <div style={{ fontSize: 38, marginBottom: 8 }}>🔒</div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 12, padding: "4px 14px", color: "#FDE68A", fontSize: 12, fontWeight: 800, marginBottom: 8 }}>
                          PREMIUM CAREER & BUSINESS BLUEPRINT
                        </div>
                        <h3 style={{ color: "#F3D37A", fontSize: 19, fontWeight: 800, maxWidth: 540 }}>
                          {hi ? "सटीक पदोन्नति तिथियां, नौकरी परिवर्तन काल एवं सम्पूर्ण २०-पृष्ठीय करियर PDF अनलॉक करें" : "Unlock Exact Promotion Windows, High-Package Job Switch Dates & 20-Page Career PDF"}
                        </h3>
                        <p style={{ color: "rgba(241,231,208,0.85)", fontSize: 14, maxWidth: 560, margin: "10px 0 18px", lineHeight: 1.6 }}>
                          {hi
                            ? "जानें कब मिलेगा बड़ा वेतन इजाफा, विदेश में नौकरी के अवसर, कार्यक्षेत्र में विरोधियों की शांति एवं डी-१० दशांश चार्ट का सूक्ष्म विश्लेषण।"
                            : "Access your pinpoint promotion quarters, foreign relocation & overseas job yogas, office politics neutralization, and full D10 Dasamsa analysis."}
                        </p>
                        <button
                          onClick={() => setActiveCheckout({
                            title: hi ? "सम्पूर्ण करियर, पदोन्नति व व्यापार ब्लूप्रिंट (PDF)" : "Complete 20-Page Career & Business Growth Blueprint PDF",
                            priceKey: "careerReport",
                            price: unlockPrice,
                            desc: "Detailed D10 Dasamsa analysis, promotion calendar, and wealth timing",
                            icon: "💼",
                            isCareerUnlock: true
                          })}
                          className="gold-cta-btn"
                          style={{ padding: "14px 30px", fontSize: 15, fontWeight: 800, boxShadow: "0 6px 20px rgba(245,158,11,0.45)" }}
                        >
                          {hi ? `करियर ब्लूप्रिंट अनलॉक करें (${unlockPrice}) ✦` : `Unlock Complete Career Blueprint (${unlockPrice}) ✦`}
                        </button>
                        <div style={{ fontSize: 12, color: "rgba(243,211,122,0.75)", marginTop: 10, fontWeight: 600 }}>
                          🔒 Instant Lifetime Access + Printable PDF Dossier
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ── TAB: DAILY LIFE PROBLEMS & VEDIC REMEDIAL SOLVER (FREEMIUM + PAID GATE) ── */}
            {tab === "lifeProblems" && (() => {
              const activeRemedy = getLifeProblemRemedies({
                problemId: activeProblemId,
                lagnaSign: result.lagnaSign,
                rashiSign: result.rashiSign,
                lang
              });
              const unlockPrice = PRODUCT_PRICES.remediesReport[currency];

              return (
                <div>
                  {/* Category Pill Selector (FREE INTERACTIVE) */}
                  <div className="glass-card" style={{ padding: "16px 20px", marginBottom: 20, overflowX: "auto" }}>
                    <div style={{ fontSize: 13, color: "rgba(243,211,122,0.85)", fontWeight: 700, marginBottom: 10 }}>
                      ⚡ {hi ? "अपनी वर्तमान समस्या अथवा चिंता का विषय चुनें:" : "Select Your Current Active Challenge or Concern:"}
                    </div>
                    <div style={{ display: "flex", gap: 10, minWidth: "max-content", flexWrap: "wrap" }}>
                      {LIFE_PROBLEMS_LIST.map(p => {
                        const isSelected = activeProblemId === p.id;
                        return (
                          <button
                            key={p.id}
                            onClick={() => setActiveProblemId(p.id)}
                            style={{
                              background: isSelected ? "linear-gradient(135deg, #F59E0B, #D97706)" : "rgba(15,10,32,0.65)",
                              border: `1px solid ${isSelected ? "#F59E0B" : "rgba(212,175,55,0.25)"}`,
                              color: isSelected ? "#0F0A1E" : "#FDE68A",
                              padding: "10px 16px",
                              borderRadius: 12,
                              fontSize: 13.5,
                              fontWeight: isSelected ? 800 : 700,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              transition: "all 0.2s ease"
                            }}
                          >
                            <span style={{ fontSize: 18 }}>{p.icon}</span>
                            <span>{hi ? p.shortHi : p.shortEn}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Free Diagnostic Header Card */}
                  <div className="glass-card" style={{ padding: "26px 28px", marginBottom: 20 }}>
                    <div style={{ borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 16, marginBottom: 18 }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 12, padding: "4px 12px", color: "#FDE68A", fontSize: 12, fontWeight: 800, marginBottom: 6 }}>
                        <span>🛡️</span> {hi ? "वैदिक व लाल किताब समस्या विश्लेषण" : "VEDIC & LAL KITAB PROBLEM DIAGNOSTIC"}
                      </div>
                      <h3 style={{ color: "#F3D37A", fontSize: 20, fontWeight: 800, marginTop: 2 }}>
                        {activeRemedy.icon} {activeRemedy.problemTitle}
                      </h3>
                    </div>

                    {/* Astrological Root Cause Diagnostic (FREE) */}
                    <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.35)", borderRadius: 12, padding: "18px 20px", marginBottom: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#F87171", fontSize: 14, fontWeight: 800, marginBottom: 6 }}>
                        <span>🔍</span> {hi ? "ज्योतिषीय मूल कारण (Astrological Root Cause Diagnostic)" : "Astrological Root Cause Diagnostic"}
                      </div>
                      <p style={{ color: "rgba(241,231,208,0.92)", fontSize: 14, lineHeight: 1.75, margin: 0 }}>
                        {activeRemedy.rootCause}
                      </p>
                    </div>

                    {/* Free General Upay Teaser */}
                    <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span style={{ fontSize: 20 }}>🌿</span>
                      <div>
                        <div style={{ color: "#34D399", fontSize: 13.5, fontWeight: 700 }}>{hi ? "प्राथमिक दैनिक परामर्श (First Action Step):" : "Initial Daily Action Step:"}</div>
                        <div style={{ color: "rgba(241,231,208,0.9)", fontSize: 13.5, marginTop: 2 }}>{activeRemedy.dailyUpay[0] || "Maintain daily cleanliness and offer water to rising sun."}</div>
                      </div>
                    </div>
                  </div>

                  {/* ── PREMIUM LOCKED / BLURRED DEEP REMEDIAL PROTOCOL SECTION ── */}
                  <div style={{ position: "relative", marginBottom: 24 }}>
                    <div className="glass-card" style={{ padding: "28px 30px", filter: effectiveRemediesUnlocked ? "none" : "blur(5px)", pointerEvents: effectiveRemediesUnlocked ? "auto" : "none", userSelect: effectiveRemediesUnlocked ? "auto" : "none", transition: "all 0.3s ease" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 14, marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 22 }}>🕉️</span>
                          <h4 style={{ color: "#F3D37A", fontSize: 16.5, fontWeight: 800 }}>
                            {hi ? "सिद्ध बीज मंत्र, लाल किताब विधान व कवच (Confidential Remedial Dossier)" : "Sacred Beej Mantra, 3-Step Lal Kitab Ritual & Gemstone Shield"}
                          </h4>
                        </div>
                        {effectiveRemediesUnlocked && (
                          <div style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 12, padding: "3px 12px", color: "#34D399", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", gap: 4 }}>
                            <span>✓</span> {hi ? "उपाय गाइड अनलॉक है" : "Remedies Dossier Active"}
                          </div>
                        )}
                      </div>

                      {/* Sacred Beej Mantra & Japa Count */}
                      <div style={{ background: "linear-gradient(135deg, rgba(35,22,65,0.85), rgba(15,10,32,0.95))", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 14, padding: "20px 22px", marginBottom: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                          <div style={{ color: "#FDE68A", fontSize: 14, fontWeight: 800 }}>
                            🕉️ {hi ? "सिद्ध बीज मंत्र एवं जप विधि" : "Prescribed Sacred Beej Mantra & Timing"}
                          </div>
                          <div style={{ color: "#34D399", fontSize: 12.5, fontWeight: 700, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, padding: "3px 10px" }}>
                            ⏱️ {activeRemedy.mantraCount}
                          </div>
                        </div>
                        <div style={{ background: "rgba(0,0,0,0.5)", border: "1px dashed rgba(245,158,11,0.35)", borderRadius: 10, padding: "14px 18px", color: "#F3D37A", fontSize: 16, fontWeight: 800, letterSpacing: 0.5, lineHeight: 1.7, textAlign: "center" }}>
                          {activeRemedy.mantra}
                        </div>
                      </div>

                      {/* 3 Practical Daily Lal Kitab & Vedic Upay */}
                      <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 12, padding: "18px 20px", marginBottom: 20 }}>
                        <div style={{ color: "#34D399", fontSize: 14.5, fontWeight: 800, marginBottom: 10 }}>
                          🌿 {hi ? "नित्य सरल लाल किताब व वैदिक उपाय (Daily Action Steps)" : "3 Simple Daily Action Steps (Lal Kitab & Vedic)"}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
                          {activeRemedy.dailyUpay.map((upay, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                              <span style={{ color: "#FDE68A", fontSize: 16, marginTop: 1 }}>✦</span>
                              <span style={{ color: "rgba(241,231,208,0.92)", fontSize: 13.5, lineHeight: 1.7 }}>{upay}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Charity, Gem/Rudraksha & Vastu Grid */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginBottom: 18 }}>
                        <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: "16px 18px" }}>
                          <div style={{ color: "#FDE68A", fontSize: 13, fontWeight: 800, marginBottom: 4 }}>
                            🤲 {hi ? "दान एवं सेवा संकल्प (Charity & Daan)" : "Prescribed Charity & Daan"}
                          </div>
                          <p style={{ color: "rgba(241,231,208,0.85)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                            {activeRemedy.charity}
                          </p>
                        </div>

                        <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: "16px 18px" }}>
                          <div style={{ color: "#FDE68A", fontSize: 13, fontWeight: 800, marginBottom: 4 }}>
                            💎 {hi ? "रत्न, रुद्राक्ष एवं सुरक्षा कवच" : "Gemstone & Rudraksha Shield"}
                          </div>
                          <p style={{ color: "rgba(241,231,208,0.85)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                            {activeRemedy.gemRudraksha}
                          </p>
                        </div>

                        <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: "16px 18px" }}>
                          <div style={{ color: "#FDE68A", fontSize: 13, fontWeight: 800, marginBottom: 4 }}>
                            🏡 {hi ? "वास्तु एवं ऊर्जा शुद्धि (Vastu & Aura)" : "Home & Workplace Energy Alignment"}
                          </div>
                          <p style={{ color: "rgba(241,231,208,0.85)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                            {activeRemedy.vastuTip}
                          </p>
                        </div>
                      </div>

                      {/* 21-Day Sankalp Ritual Note */}
                      <div style={{ background: "rgba(245,158,11,0.08)", border: "1px dashed rgba(245,158,11,0.35)", borderRadius: 10, padding: "14px 16px", textAlign: "center", color: "rgba(241,231,208,0.9)", fontSize: 13 }}>
                        ✨ <b>{hi ? "२१-दिवसीय संकल्प नियम:" : "21-Day Sankalp Protocol:"}</b> {hi ? "उपरोक्त मंत्र व उपाय को लगातार २१ दिनों तक निष्ठापूर्वक करने से नकारात्मक ऊर्जा का शमन होकर शुभ फल प्रकट होने लगते हैं।" : "Practicing the prescribed mantra and daily upay consistently for 21 days creates a powerful protective aura and clears karmic obstructions."}
                      </div>

                      {effectiveRemediesUnlocked && (
                        <div style={{ textAlign: "center", paddingTop: 14, display: "flex", justifyContent: "center", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                          <button onClick={() => handlePrintReport("remedies")} className="gold-cta-btn" style={{ padding: "11px 24px", fontSize: 13.5 }}>
                            📄 {hi ? "उपाय PDF रिपोर्ट प्रिंट / डाउनलोड करें (FREE)" : "Save / Print Remedies Dossier PDF (FREE)"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveCheckout({
                              title: hi ? "श्रद्धा दक्षिणा (Seva Bhent)" : "Offer Dakshina (Sacred Offering)",
                              priceKey: "dakshina",
                              price: PRODUCT_PRICES.dakshina[currency],
                              desc: hi ? "वैदिक ज्योतिष अनुसंधान एवं निःशुल्क सर्वर सेवा हेतु स्वैच्छिक दक्षिणा" : "Voluntary offering to maintain free Vedic compute servers and support seekers worldwide",
                              icon: "🪷",
                              isDakshina: true
                            })}
                            style={{ background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.4)", color: "#FDE68A", padding: "10px 18px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
                          >
                            <span>🪷</span> {hi ? "श्रद्धा दक्षिणा दें" : "Offer Dakshina"}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Paywall Overlay Banner (When Locked) */}
                    {!effectiveRemediesUnlocked && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(11,8,25,0.86)", backdropFilter: "blur(6px)", borderRadius: 16, border: "2px solid rgba(245,158,11,0.5)", padding: "26px 22px", textAlign: "center", zIndex: 10 }}>
                        <div style={{ fontSize: 38, marginBottom: 8 }}>🔒</div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 12, padding: "4px 14px", color: "#FDE68A", fontSize: 12, fontWeight: 800, marginBottom: 8 }}>
                          COMPLETE VEDIC DOSHA & REMEDIAL DOSSIER
                        </div>
                        <h3 style={{ color: "#F3D37A", fontSize: 19, fontWeight: 800, maxWidth: 540 }}>
                          {hi ? "सिद्ध बीज मंत्र, सम्पूर्ण लाल किताब उपाय एवं व्यक्तिगत सुरक्षा कवच अनलॉक करें" : "Unlock Sacred Beej Mantras, 3-Step Lal Kitab Shanti & Complete Remedial PDF"}
                        </h3>
                        <p style={{ color: "rgba(241,231,208,0.85)", fontSize: 14, maxWidth: 560, margin: "10px 0 18px", lineHeight: 1.6 }}>
                          {hi
                            ? "सभी ७ प्रमुख समस्याओं (करियर रुकावट, कर्ज मुक्ति, मानसिक तनाव, दांपत्य कलह, बुरी नजर निवारण) के सटीक तांत्रिक व वैदिक उपाय तुरंत प्राप्त करें।"
                            : "Get instant access to authentic energized Beej Mantras, Sade Sati & Rahu-Ketu Shanti, wealth attraction rituals, and custom gemstone shields."}
                        </p>
                        <button
                          onClick={() => setActiveCheckout({
                            title: hi ? "सम्पूर्ण वैदिक समस्या निवारण व लाल किताब उपाय (PDF)" : "Complete All-in-One Vedic & Lal Kitab Remedial Dossier PDF",
                            priceKey: "remediesReport",
                            price: unlockPrice,
                            desc: "Complete 7-issue remedial plans, Sade Sati peace rituals, and Yantra guidelines",
                            icon: "🛡️",
                            isRemediesUnlock: true
                          })}
                          className="gold-cta-btn"
                          style={{ padding: "14px 30px", fontSize: 15, fontWeight: 800, boxShadow: "0 6px 20px rgba(245,158,11,0.45)" }}
                        >
                          {hi ? `संपूर्ण उपाय गाइड अनलॉक करें (${unlockPrice}) ✦` : `Unlock Complete Remedies Dossier (${unlockPrice}) ✦`}
                        </button>
                        <div style={{ fontSize: 12, color: "rgba(243,211,122,0.75)", marginTop: 10, fontWeight: 600 }}>
                          🔒 Instant Lifetime Access + Printable PDF Dossier
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ── TAB: MARRIAGE AGE, TIMING & SPOUSE PREDICTION (FREEMIUM + PAID GATE) ── */}
            {tab === "marriageTiming" && (() => {
              const mp = result.marriagePrediction || calculateMarriagePrediction({
                name: form.name || "User",
                dob: form.dob || "1998-01-01",
                lagnaSign: result.lagnaSign,
                rashiSign: result.rashiSign,
                lang,
                planetData: result.planetData,
                houses: result.houses
              });
              const lva = mp.loveVsArrange || {};
              const unlockPrice = PRODUCT_PRICES.marriageTimingReport[currency];

              return (
                <div>
                  {/* Top Free Vivah Overview Card */}
                  <div className="glass-card" style={{ padding: "26px 28px", marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 16, marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                      <div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 12, padding: "4px 12px", color: "#FDE68A", fontSize: 12, fontWeight: 800, marginBottom: 4 }}>
                          <span>💍</span> {hi ? "वैदिक विवाह आयु व योग गणना" : "PARASHARI VEDIC VIVAH YOG"}
                        </div>
                        <h3 style={{ color: "#F3D37A", fontSize: 19, fontWeight: 800, marginTop: 4 }}>
                          {form.name || "Native"} — {hi ? "विवाह समय, आयु एवं जीवनसाथी विश्लेषण" : "Marriage Timing, Age & Spouse Analysis"}
                        </h3>
                        <p style={{ color: "rgba(241,231,208,0.75)", fontSize: 13, marginTop: 3 }}>
                          {hi ? `सप्तम भाव राशि: ${mp.seventhSign} | भावेश: ${mp.seventhLord}` : `7th House Sign: ${mp.seventhSign} | 7th Lord: ${mp.seventhLord}`}
                        </p>
                      </div>

                      <div style={{ textAlign: "right", background: "rgba(11,8,25,0.6)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 12, padding: "10px 18px" }}>
                        <div style={{ fontSize: 12, color: "rgba(243,211,122,0.85)", fontWeight: 600 }}>{hi ? "विवाह योग प्रबलता" : "Vivah Alignment Score"}</div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: "#34D399" }}>{mp.probabilityScore}%</div>
                      </div>
                    </div>

                    {/* Free Highlights Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
                      {/* Probable Marriage Age */}
                      <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 12, padding: "18px 20px", textAlign: "center" }}>
                        <div style={{ fontSize: 22 }}>🎂</div>
                        <div style={{ fontSize: 12.5, color: "rgba(243,211,122,0.85)", fontWeight: 600, marginTop: 4 }}>
                          {hi ? "संभावित विवाह आयु (Marriage Age)" : "Probable Marriage Age Range"}
                        </div>
                        <div style={{ color: "#FDE68A", fontSize: 22, fontWeight: 800, marginTop: 4 }}>
                          {mp.ageRange}
                        </div>
                        <div style={{ fontSize: 12, color: "#34D399", fontWeight: 700, marginTop: 3 }}>
                          ✓ {hi ? "सप्तमेश व गुरु गोचर आधारित" : "Based on 7th Lord & Jupiter Transits"}
                        </div>
                      </div>

                      {/* Current Timing Phase */}
                      <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 12, padding: "18px 20px", textAlign: "center" }}>
                        <div style={{ fontSize: 22 }}>⚡</div>
                        <div style={{ fontSize: 12.5, color: "rgba(243,211,122,0.85)", fontWeight: 600, marginTop: 4 }}>
                          {hi ? "वर्तमान विवाह योग चरण" : "Current Vivah Yog Phase"}
                        </div>
                        <div style={{ color: "#34D399", fontSize: 16.5, fontWeight: 800, marginTop: 6 }}>
                          {mp.timingPhase}
                        </div>
                        <div style={{ fontSize: 12, color: "rgba(241,231,208,0.75)", marginTop: 3 }}>
                          {hi ? "विंशोत्तरी दशा व गोचर सक्रिय" : "Active Dasha & Planetary Influences"}
                        </div>
                      </div>

                      {/* 7th House / Spouse Aura */}
                      <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 12, padding: "18px 20px", textAlign: "center" }}>
                        <div style={{ fontSize: 22 }}>💖</div>
                        <div style={{ fontSize: 12.5, color: "rgba(243,211,122,0.85)", fontWeight: 600, marginTop: 4 }}>
                          {hi ? "सप्तम भाव व दांपत्य ऊर्जा" : "7th House Marital Energy"}
                        </div>
                        <div style={{ color: "#F3D37A", fontSize: 16.5, fontWeight: 800, marginTop: 6 }}>
                          {mp.seventhSign}
                        </div>
                        <div style={{ fontSize: 12, color: "rgba(241,231,208,0.75)", marginTop: 3 }}>
                          {hi ? `स्वामी ग्रह: ${mp.seventhLord}` : `Governed by ${mp.seventhLord}`}
                        </div>
                      </div>
                    </div>

                    {/* ── DEDICATED FEATURE: LOVE VS. ARRANGED MARRIAGE PREDICTION ── */}
                    {lva && lva.type && (
                      <div style={{ background: "linear-gradient(135deg, rgba(38,16,52,0.88) 0%, rgba(18,12,35,0.95) 100%)", border: "1px solid rgba(244,114,182,0.35)", borderRadius: 14, padding: "22px 24px", marginBottom: 20, boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(244,114,182,0.25)", paddingBottom: 14, marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                          <div>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(244,114,182,0.18)", border: "1px solid rgba(244,114,182,0.4)", borderRadius: 12, padding: "3px 12px", color: "#FBCFE8", fontSize: 11.5, fontWeight: 800, marginBottom: 4 }}>
                              <span>💘 vs 🤝</span> {hi ? "प्रेम विवाह बनाम अरेंज्ड विवाह योग" : "LOVE VS. ARRANGED MARRIAGE DOSSIER"}
                            </div>
                            <h4 style={{ color: "#FDE68A", fontSize: 17.5, fontWeight: 800, margin: "2px 0 0" }}>
                              {hi ? "प्रेम विवाह या अरेंज्ड विवाह? कुंडली आधारित भविष्यवाणी" : "Love Marriage or Arranged Marriage Prediction"}
                            </h4>
                          </div>

                          <div style={{
                            background: lva.dominantType === "love" 
                              ? "linear-gradient(135deg, rgba(236,72,153,0.25), rgba(244,63,94,0.35))"
                              : (lva.dominantType === "arrange"
                                ? "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(16,185,129,0.35))"
                                : "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(236,72,153,0.25))"),
                            border: `1px solid ${lva.dominantType === "love" ? "#F472B6" : (lva.dominantType === "arrange" ? "#60A5FA" : "#FDE68A")}`,
                            borderRadius: 20,
                            padding: "6px 14px",
                            color: "#FFF",
                            fontWeight: 800,
                            fontSize: 13,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
                          }}>
                            <span>{lva.dominantType === "love" ? "💘" : (lva.dominantType === "arrange" ? "🤝" : "💞")}</span>
                            <span>{lva.type}</span>
                          </div>
                        </div>

                        {/* Dual Percentage Progress Bar */}
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 6, fontSize: 13 }}>
                            <span style={{ color: "#F472B6", fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
                              <span>💖</span> {hi ? "प्रेम विवाह योग" : "Love Marriage Affinity"}: <strong style={{ fontSize: 16 }}>{lva.lovePercentage}%</strong>
                            </span>
                            <span style={{ color: "#60A5FA", fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
                              <span>🤝</span> {hi ? "पारंपरिक अरेंज्ड विवाह" : "Arranged Marriage Affinity"}: <strong style={{ fontSize: 16 }}>{lva.arrangePercentage}%</strong>
                            </span>
                          </div>

                          <div style={{ height: 14, borderRadius: 10, overflow: "hidden", display: "flex", background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.12)", padding: 2 }}>
                            <div style={{ width: `${lva.lovePercentage}%`, background: "linear-gradient(90deg, #EC4899, #F43F5E)", borderRadius: "8px 0 0 8px", boxShadow: "0 0 10px rgba(236,72,153,0.5)", transition: "width 0.8s ease" }} />
                            <div style={{ width: `${lva.arrangePercentage}%`, background: "linear-gradient(90deg, #3B82F6, #10B981)", borderRadius: "0 8px 8px 0", boxShadow: "0 0 10px rgba(16,185,129,0.5)", transition: "width 0.8s ease" }} />
                          </div>
                        </div>

                        {/* Core Verdict Box */}
                        <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(244,114,182,0.25)", borderRadius: 10, padding: "14px 18px", marginBottom: 16 }}>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                            <span style={{ fontSize: 18, marginTop: 1 }}>✨</span>
                            <div style={{ color: "rgba(241,231,208,0.95)", fontSize: 13.5, lineHeight: 1.7, fontWeight: 500 }}>
                              {lva.verdict}
                            </div>
                          </div>
                        </div>

                        {/* Detailed Aspects: Meeting & Family Dynamics */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, marginBottom: 16 }}>
                          <div style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: 14 }}>
                            <div style={{ color: "#FDE68A", fontSize: 12.5, fontWeight: 800, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                              <span>📍</span> {hi ? "संभावित मिलन स्थल व माध्यम" : "Destined Meeting Place & Channel"}
                            </div>
                            <p style={{ color: "rgba(241,231,208,0.88)", fontSize: 12.5, lineHeight: 1.65, margin: 0 }}>
                              {lva.meetingCircumstance}
                            </p>
                          </div>

                          <div style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: 14 }}>
                            <div style={{ color: "#34D399", fontSize: 12.5, fontWeight: 800, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                              <span>👨‍👩‍👧‍👦</span> {hi ? "पारिवारिक सहमति व माता-पिता का दृष्टिकोण" : "Family & Parental Approval Dynamics"}
                            </div>
                            <p style={{ color: "rgba(241,231,208,0.88)", fontSize: 12.5, lineHeight: 1.65, margin: 0 }}>
                              {lva.familyAcceptance}
                            </p>
                          </div>
                        </div>

                        {/* Planetary Yogas Detected */}
                        {lva.yogasDetected && lva.yogasDetected.length > 0 && (
                          <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
                            <div style={{ color: "#FDE68A", fontSize: 12, fontWeight: 800, marginBottom: 8, letterSpacing: 0.5 }}>
                              🔯 {hi ? "आपकी कुंडली में उपस्थित वैदिक ग्रह योग (Panchamesh, Saptamesh & Graha Drishti)" : "Classical Planetary Yogas Identified in Your Chart"}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              {lva.yogasDetected.map((yog, yIdx) => (
                                <div key={yIdx} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "rgba(241,231,208,0.9)", lineHeight: 1.6 }}>
                                  <span style={{ color: "#34D399", fontWeight: 800, marginTop: 1 }}>✓</span>
                                  <span>{yog}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Success Formula */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.25)", borderRadius: 8, padding: "8px 14px", fontSize: 12, color: "rgba(241,231,208,0.9)" }}>
                          <span style={{ color: "#60A5FA", fontSize: 14 }}>🔑</span>
                          <div>
                            <strong style={{ color: "#93C5FD" }}>{hi ? "सफल दांपत्य का वैदिक सूत्र: " : "Astrological Key to Marital Bliss: "}</strong>
                            {lva.successFormula}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Free General Spouse Demeanor Teaser */}
                    <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 12, padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#34D399", fontSize: 14, fontWeight: 800, marginBottom: 6 }}>
                        <span>✨</span> {hi ? "जीवनसाथी का सामान्य स्वभाव (Spouse Nature Teaser)" : "Spouse Disposition & Compatibility Overview"}
                      </div>
                      <p style={{ color: "rgba(241,231,208,0.9)", fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>
                        {mp.spousePersonality}
                      </p>
                    </div>
                  </div>

                  {/* ── PREMIUM UNLOCKABLE / BLURRED DEEP REPORT SECTION ── */}
                  <div style={{ position: "relative", marginBottom: 24 }}>
                    <div className="glass-card" style={{ padding: "28px 30px", filter: effectiveMarriageUnlocked ? "none" : "blur(4px)", pointerEvents: effectiveMarriageUnlocked ? "auto" : "none", userSelect: effectiveMarriageUnlocked ? "auto" : "none", transition: "all 0.3s ease" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 14, marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 22 }}>📜</span>
                          <h4 style={{ color: "#F3D37A", fontSize: 16.5, fontWeight: 800 }}>
                            {hi ? "विस्तृत विवाह कालखंड, जीवनसाथी का पेशा व उपाय (Confidential Report)" : "Pinpoint Marriage Windows, Spouse Identity & Vedic Remedies"}
                          </h4>
                        </div>
                        {isAdmin && (
                          <div style={{ background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 12, padding: "3px 10px", color: "#FDE68A", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", gap: 4 }}>
                            <span>👑</span> {hi ? "एडमिन वीआईपी अनलॉक" : "Admin VIP Unlocked"}
                          </div>
                        )}
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 18 }}>
                        {/* Auspicious Marriage Years */}
                        <div style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: 16 }}>
                          <div style={{ fontSize: 12.5, color: "rgba(243,211,122,0.85)", fontWeight: 600 }}>📅 {hi ? "प्राथमिक शुभ विवाह कालखंड" : "Primary Auspicious Marriage Window"}</div>
                          <div style={{ color: "#34D399", fontSize: 16, fontWeight: 800, marginTop: 4 }}>{mp.primaryWindow}</div>
                          <div style={{ fontSize: 12.5, color: "rgba(241,231,208,0.75)", marginTop: 3 }}>{hi ? `द्वितीयक काल: ${mp.secondaryWindow}` : `Secondary: ${mp.secondaryWindow}`}</div>
                        </div>

                        {/* Peak Auspicious Months */}
                        <div style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: 16 }}>
                          <div style={{ fontSize: 12.5, color: "rgba(243,211,122,0.85)", fontWeight: 600 }}>🌟 {hi ? "सर्वोत्तम विवाह लग्न माह" : "Peak Favorable Vivah Months"}</div>
                          <div style={{ color: "#FDE68A", fontSize: 15, fontWeight: 800, marginTop: 4 }}>{mp.peakMonths}</div>
                          <div style={{ fontSize: 12.5, color: "rgba(241,231,208,0.75)", marginTop: 3 }}>{hi ? "गुरु एवं शुक्र शुभ दृष्टि" : "Aligned with Jupiter & Venus Transits"}</div>
                        </div>

                        {/* Spouse Career Field */}
                        <div style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: 16 }}>
                          <div style={{ fontSize: 12.5, color: "rgba(243,211,122,0.85)", fontWeight: 600 }}>💼 {hi ? "जीवनसाथी का संभावित कार्यक्षेत्र / पेशा" : "Spouse Likely Career Field"}</div>
                          <div style={{ color: "#F3D37A", fontSize: 15, fontWeight: 800, marginTop: 4 }}>{mp.spouseProfession}</div>
                        </div>

                        {/* Spouse Direction & Name Initials */}
                        <div style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: 16 }}>
                          <div style={{ fontSize: 12.5, color: "rgba(243,211,122,0.85)", fontWeight: 600 }}>🧭 {hi ? "जीवनसाथी के मूल स्थान की दिशा व नामाक्षर" : "Spouse Direction & Name Letters"}</div>
                          <div style={{ color: "#FDE68A", fontSize: 15, fontWeight: 800, marginTop: 4 }}>
                            {mp.spouseDirection} · <span style={{ color: "#34D399" }}>({mp.spouseNameLetters})</span>
                          </div>
                        </div>
                      </div>

                      {/* Obstacle Analysis & Remedies */}
                      <div style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                        <div style={{ fontSize: 13, color: "#F87171", fontWeight: 800, marginBottom: 6 }}>
                          ⚠️ {hi ? "विवाह में विलंब / बाधा विश्लेषण (Kalyana Dosha Check)" : "Delay & Obstacle Diagnostic"}
                        </div>
                        <p style={{ color: "rgba(241,231,208,0.9)", fontSize: 13.5, lineHeight: 1.75, margin: 0 }}>
                          {mp.obstacleAnalysis}
                        </p>
                      </div>

                      <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                        <div style={{ fontSize: 13, color: "#FDE68A", fontWeight: 800, marginBottom: 8 }}>
                          🛡️ {hi ? "शीघ्र व कल्याणकारी विवाह हेतु अचूक वैदिक उपाय (Prescribed Upay)" : "Sacred Vedic Vivah Remedies & Mantras"}
                        </div>
                        <div style={{ color: "rgba(241,231,208,0.92)", fontSize: 13.5, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                          {mp.remedies}
                        </div>
                      </div>

                      {/* Love & Family Harmony Sacred Remedies */}
                      {lva && lva.sacredRemedy && (
                        <div style={{ background: "rgba(244,114,182,0.08)", border: "1px solid rgba(244,114,182,0.3)", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                          <div style={{ fontSize: 13, color: "#FBCFE8", fontWeight: 800, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                            <span>🕊️</span> {hi ? "प्रेम संबंध व पारिवारिक सामंजस्य हेतु विशेष वैदिक अनुष्ठान (Sacred Upay)" : "Sacred Vedic Rituals for Love & Family Harmony"}
                          </div>
                          <div style={{ color: "rgba(241,231,208,0.92)", fontSize: 13.5, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                            {lva.sacredRemedy}
                          </div>
                        </div>
                      )}

                      {effectiveMarriageUnlocked && (
                        <div style={{ textAlign: "center", paddingTop: 14, display: "flex", justifyContent: "center", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                          <button onClick={() => handlePrintReport("marriage")} className="gold-cta-btn" style={{ padding: "11px 24px", fontSize: 13.5 }}>
                            📄 {hi ? "विवाह PDF रिपोर्ट प्रिंट / डाउनलोड करें (FREE)" : "Save / Print Marriage Report PDF (FREE)"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveCheckout({
                              title: hi ? "श्रद्धा दक्षिणा (Seva Bhent)" : "Offer Dakshina (Sacred Offering)",
                              priceKey: "dakshina",
                              price: PRODUCT_PRICES.dakshina[currency],
                              desc: hi ? "वैदिक ज्योतिष अनुसंधान एवं निःशुल्क सर्वर सेवा हेतु स्वैच्छिक दक्षिणा" : "Voluntary offering to maintain free Vedic compute servers and support seekers worldwide",
                              icon: "🪷",
                              isDakshina: true
                            })}
                            style={{ background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.4)", color: "#FDE68A", padding: "10px 18px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
                          >
                            <span>🪷</span> {hi ? "श्रद्धा दक्षिणा दें" : "Offer Dakshina"}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Paywall Overlay Banner (When Locked) */}
                    {!effectiveMarriageUnlocked && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(11,8,25,0.84)", backdropFilter: "blur(6px)", borderRadius: 16, border: "2px solid rgba(245,158,11,0.5)", padding: "26px 22px", textAlign: "center", zIndex: 10 }}>
                        <div style={{ fontSize: 38, marginBottom: 8 }}>🔒</div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 12, padding: "4px 14px", color: "#FDE68A", fontSize: 12, fontWeight: 800, marginBottom: 8 }}>
                          PREMIUM VIVAH REPORT
                        </div>
                        <h3 style={{ color: "#F3D37A", fontSize: 19, fontWeight: 800, maxWidth: 520 }}>
                          {hi ? "विवाह के सटीक वर्ष, जीवनसाथी का पेशा, नामाक्षर व अचूक उपाय अनलॉक करें" : "Unlock Exact Auspicious Marriage Dates, Spouse Career, Direction & Vedic Upay"}
                        </h3>
                        <p style={{ color: "rgba(241,231,208,0.85)", fontSize: 14, maxWidth: 540, margin: "10px 0 18px", lineHeight: 1.6 }}>
                          {hi
                            ? "जानें किस महीने में बन रहा है सबसे मजबूत विवाह योग, जीवनसाथी किस क्षेत्र में कार्यरत होगा, और विवाह में आ रही रुकावटों को दूर करने के वैदिक समाधान।"
                            : "Discover your exact high-probability wedding dates, spouse's profession & origin, delay diagnosis, and sacred Vedic mantras for a prosperous union."}
                        </p>
                        <button
                          onClick={() => setActiveCheckout({
                            title: hi ? "विस्तृत विवाह भविष्यवाणी व जीवनसाथी रिपोर्ट (PDF)" : "Complete Marriage Timing & Spouse Prediction Report",
                            priceKey: "marriageTimingReport",
                            price: unlockPrice,
                            desc: "Pinpoint marriage dates, spouse profession, birthplace direction & Vedic remedies",
                            icon: "💍",
                            isMarriageUnlock: true
                          })}
                          className="gold-cta-btn"
                          style={{ padding: "14px 30px", fontSize: 15, fontWeight: 800, boxShadow: "0 6px 20px rgba(245,158,11,0.45)" }}
                        >
                          {hi ? `संपूर्ण रिपोर्ट अनलॉक करें (${unlockPrice}) ✦` : `Unlock Complete Marriage Report (${unlockPrice}) ✦`}
                        </button>
                        <div style={{ fontSize: 12, color: "rgba(243,211,122,0.75)", marginTop: 10, fontWeight: 600 }}>
                          🔒 Instant Lifetime Access + Printable PDF
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ── TAB: HINDU PANCHANG ── */}
            {tab === "panchang" && renderPanchangContent()}

            {/* ── TAB: DAILY HOROSCOPE & RECURRING MESSENGER SUBSCRIPTION ── */}
            {tab === "daily" && renderDailyHoroscopeContent()}

            {/* ── TAB: SHUBH MUHURAT ── */}
            {tab === "muhurat" && renderMuhuratContent()}

            {/* ── TAB: FESTIVALS & VRAT ── */}
            {tab === "festivals" && renderFestivalsContent()}

            {/* ── TAB 3: 2026–2027 ANNUAL FORECAST (REVENUE MAGNET) ── */}
            {tab === "forecast" && (
              <div>
                <div className="glass-card" style={{ padding: "28px 30px", marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                    <div>
                      <h3 style={{ color: "#F3D37A", fontSize: 18, fontWeight: 800 }}>
                        📅 {hi ? "वर्ष 2026–2027 वार्षिक गोचर एवं भविष्यवाणी" : "2026–2027 Annual Transit & Planetary Forecast"}
                      </h3>
                      <p style={{ color: "rgba(241,231,208,0.75)", fontSize: 13, marginTop: 2 }}>
                        {hi ? `मूल नक्षत्र: ${result.nakshatra} | चंद्र राशि: ${result.rashi}` : `Natal Nakshatra: ${result.nakshatra} | Moon: ${result.rashi}`}
                      </p>
                    </div>
                    <span style={{ padding: "6px 14px", borderRadius: 14, background: "rgba(245,158,11,0.15)", color: "#FDE68A", fontSize: 13, fontWeight: 700, border: "1px solid rgba(245,158,11,0.35)" }}>
                      {result.annualTransit.sadeSatiStatus}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 24 }}>
                    {result.annualTransit.transits.map((tr, i) => (
                      <div key={i} style={{ background: "rgba(15,10,32,0.7)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 12, padding: "16px 18px" }}>
                        <div style={{ color: "#FDE68A", fontSize: 14.5, fontWeight: 800, marginBottom: 4 }}>{tr.planet} in {tr.sign}</div>
                        <div style={{ color: "rgba(241,231,208,0.88)", fontSize: 13.5, lineHeight: 1.65 }}>{tr.effect}</div>
                      </div>
                    ))}
                  </div>

                  <h4 style={{ color: "#F3D37A", fontSize: 15.5, fontWeight: 800, marginBottom: 14 }}>
                    ⚡ {hi ? "त्रैमासिक स्कोरकार्ड (Quarterly Milestones)" : "Quarterly Life Milestones"}
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 22 }}>
                    {result.annualTransit.quarters.map((q, i) => (
                      <div key={i} style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: "14px 16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{ color: "#FDE68A", fontSize: 13.5, fontWeight: 800 }}>{q.quarter}</span>
                          <span style={{ color: "#34D399", fontSize: 12.5, fontWeight: 800 }}>{q.rating}</span>
                        </div>
                        <div style={{ color: "#F3D37A", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{q.theme}</div>
                        <div style={{ color: "rgba(241,231,208,0.85)", fontSize: 12.5, lineHeight: 1.55 }}>{q.impact}</div>
                      </div>
                    ))}
                  </div>

                  {/* Upsell to PDF or Unlocked View */}
                  <div style={{ textAlign: "center", padding: "18px", background: effectiveAnnualUnlocked ? "rgba(245,158,11,0.12)" : "rgba(245,158,11,0.08)", border: effectiveAnnualUnlocked ? "1.5px solid rgba(245,158,11,0.5)" : "1px dashed rgba(245,158,11,0.4)", borderRadius: 12 }}>
                    <div style={{ color: "#FDE68A", fontSize: 14.5, fontWeight: 800, marginBottom: 6 }}>
                      {hi ? "महीने-दर-महीने संपूर्ण 2026-2027 PDF रिपोर्ट डाउनलोड करें" : "Download Full 2026-2027 Month-by-Month Forecast PDF"}
                    </div>
                    {effectiveAnnualUnlocked ? (
                      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        {isAdmin && (
                          <div style={{ background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 12, padding: "3px 12px", color: "#FDE68A", fontSize: 12, fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <span>👑</span> {hi ? "एडमिन वीआईपी अनलॉक" : "Admin VIP Access"}
                          </div>
                        )}
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                          <button
                            onClick={() => handlePrintReport("annual")}
                            className="gold-cta-btn"
                            style={{ background: "linear-gradient(90deg, #F59E0B, #D97706)", border: "none", color: "#0F0A1E", padding: "11px 24px", borderRadius: 8, fontSize: 14, fontWeight: 800, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 4px 14px rgba(245,158,11,0.35)" }}
                          >
                            <span>📄</span> {hi ? "2026-2027 वार्षिक PDF डाउनलोड / प्रिंट करें (FREE)" : "Download / Print Full 2026-2027 Forecast PDF (FREE)"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveCheckout({
                              title: hi ? "श्रद्धा दक्षिणा (Seva Bhent)" : "Offer Dakshina (Sacred Offering)",
                              priceKey: "dakshina",
                              price: PRODUCT_PRICES.dakshina[currency],
                              desc: hi ? "वैदिक ज्योतिष अनुसंधान एवं निःशुल्क सर्वर सेवा हेतु स्वैच्छिक दक्षिणा" : "Voluntary offering to maintain free Vedic compute servers and support seekers worldwide",
                              icon: "🪷",
                              isDakshina: true
                            })}
                            style={{ background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.4)", color: "#FDE68A", padding: "10px 18px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
                          >
                            <span>🪷</span> {hi ? "श्रद्धा दक्षिणा दें" : "Offer Dakshina"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveCheckout({
                          title: "2026-2027 Annual Transit Forecast PDF",
                          priceKey: "annualReport",
                          price: PRODUCT_PRICES.annualReport[currency],
                          desc: "Detailed monthly predictions, wealth windows & auspicious dates",
                          icon: "📅",
                          isAnnualUnlock: true
                        })}
                        style={{ marginTop: 8, background: "linear-gradient(90deg, #F59E0B, #D97706)", border: "none", color: "#0F0A1E", padding: "10px 22px", borderRadius: 8, fontSize: 13.5, fontWeight: 800, cursor: "pointer" }}
                      >
                        {hi ? "पूर्ण रिपोर्ट प्राप्त करें" : "Get Full PDF"} ({PRODUCT_PRICES.annualReport[currency]})
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 4: KUNDLI MILAN (GUN MILAN 36 POINTS) ── */}
            {tab === "matchmaking" && (
              <div className="glass-card" style={{ padding: "28px 26px", marginBottom: 20 }}>
                {/* Photographic Banner */}
                <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", marginBottom: 24, height: 150, boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
                  <img src="/images/feature_matchmaking.jpg" alt="Vedic Wedding Vivaha" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(15,10,32,0.92) 20%, rgba(15,10,32,0.65) 60%, transparent 100%)", display: "flex", alignItems: "center", padding: "0 24px" }}>
                    <div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#F472B6", fontSize: 11.5, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" }}>
                        <Icons.Heart size={14} color="#F472B6" /> {hi ? "वैदिक कुंडली मिलान" : "VEDIC KUNDLI MATCHMAKING"}
                      </div>
                      <h2 style={{ color: "#FFF", fontSize: 20, fontWeight: 800, margin: "4px 0 2px" }}>
                        {hi ? "अष्टकूट ३६ गुण मिलान एवं मांगलिक परीक्षण" : "Ashtakoot 36 Gunas Compatibility & Manglik Diagnostic"}
                      </h2>
                      <div style={{ color: "#FDE68A", fontSize: 12.5, fontWeight: 600 }}>
                        {hi ? `प्रथम जातक: ${form.name || "User"} (चंद्र राशि: ${result.rashi})` : `Primary Native: ${form.name || "User"} (Moon: ${result.rashi})`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Partner Form */}
                <div style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 12, padding: "20px 22px", marginBottom: 20 }}>
                  <h4 style={{ color: "#FDE68A", fontSize: 14.5, fontWeight: 800, marginBottom: 14 }}>
                    {t.partnerFormTitle}
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
                    <div>
                      <label htmlFor="partner-name-input" style={{ fontSize: 12.5, color: "#FDE68A", display: "flex", alignItems: "center", gap: 6, marginBottom: 6, fontWeight: 700 }}>
                        <Icons.User size={14} color="#F59E0B" /> {t.partnerName} *
                      </label>
                      <input
                        id="partner-name-input"
                        name="partnerName"
                        required
                        aria-required="true"
                        aria-label={t.partnerName}
                        placeholder={hi ? "जीवनसाथी का नाम दर्ज करें" : "Enter partner's full name"}
                        value={partnerForm.name}
                        onChange={e => setPartnerForm({ ...partnerForm, name: e.target.value })}
                        style={{ width: "100%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 8, padding: "10px 14px", color: "#FFF", fontSize: 14 }}
                      />
                    </div>
                    <div>
                      <label htmlFor="partner-dob-input" style={{ fontSize: 12.5, color: "#FDE68A", display: "flex", alignItems: "center", gap: 6, marginBottom: 6, fontWeight: 700 }}>
                        <Icons.Calendar size={14} color="#F59E0B" /> {t.partnerDob} *
                      </label>
                      <input
                        id="partner-dob-input"
                        name="partnerDob"
                        type="date"
                        required
                        aria-required="true"
                        aria-label={t.partnerDob}
                        value={partnerForm.dob}
                        onChange={e => setPartnerForm({ ...partnerForm, dob: e.target.value })}
                        style={{ width: "100%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 8, padding: "10px 14px", color: "#FFF", fontSize: 14, colorScheme: "dark" }}
                      />
                    </div>
                    <div>
                      <label htmlFor="partner-tob-input" style={{ fontSize: 12.5, color: "#FDE68A", display: "flex", alignItems: "center", gap: 6, marginBottom: 6, fontWeight: 700 }}>
                        <Icons.Clock size={14} color="#F59E0B" /> {t.partnerTob} <span style={{ fontSize: 11.5, color: "rgba(243,211,122,0.8)", fontWeight: 500 }}>{t.partnerTobHelp}</span>
                      </label>
                      <input
                        id="partner-tob-input"
                        name="partnerTob"
                        type="time"
                        aria-label={t.partnerTob}
                        value={partnerForm.tob}
                        onChange={e => setPartnerForm({ ...partnerForm, tob: e.target.value })}
                        style={{ width: "100%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 8, padding: "10px 14px", color: "#FFF", fontSize: 14, colorScheme: "dark" }}
                      />
                    </div>
                  </div>
                  <button onClick={handleRunGunMilan} className="gold-cta-btn" style={{ marginTop: 16, padding: "12px 20px", fontSize: 14 }}>
                    {t.calculateMatchBtn}
                  </button>
                </div>

                {/* Gun Milan Results */}
                {milanResult && (
                  <div style={{ background: "rgba(15,10,32,0.9)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 14, padding: "22px 24px", animation: "fadeInCard 0.4s ease" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(212,175,55,0.25)", paddingBottom: 16, marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                      <div>
                        <div style={{ fontSize: 13, color: "rgba(241,231,208,0.8)" }}>
                          {milanResult.p1.name} ({hi ? (milanResult.p1.signHi || milanResult.p1.sign) : milanResult.p1.sign}) × {milanResult.p2.name} ({hi ? (milanResult.p2.signHi || milanResult.p2.sign) : milanResult.p2.sign})
                        </div>
                        <h4 style={{ color: "#F3D37A", fontSize: 17, fontWeight: 800, marginTop: 2 }}>
                          {hi ? milanResult.verdictHi : milanResult.verdict}
                        </h4>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 26, fontWeight: 800, color: Number(milanResult.totalGunas) >= 18 ? "#34D399" : "#F87171" }}>
                          {milanResult.totalGunas} / {milanResult.maxGunas}
                        </div>
                        <div style={{ fontSize: 12, color: "rgba(243,211,122,0.85)", fontWeight: 600 }}>
                          {milanResult.percentage}% {hi ? "मिलान स्कोर" : "Match Score"}
                        </div>
                      </div>
                    </div>

                    {/* Kootas Breakdown */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 18 }}>
                      {milanResult.kootas.map((k, idx) => (
                        <div key={idx} style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.18)", borderRadius: 8, padding: "12px 14px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 800, color: "#FDE68A" }}>
                            <span>{hi ? (k.nameHi || k.name) : k.name}</span>
                            <span>{k.score}/{k.max}</span>
                          </div>
                          <div style={{ fontSize: 11.5, color: "rgba(241,231,208,0.75)", marginTop: 3 }}>
                            {hi ? (k.descHi || k.desc) : k.desc}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Manglik status */}
                    <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8, padding: "12px 16px", fontSize: 13.5, color: "#FDE68A", marginBottom: 18 }}>
                      🔥 <b>{hi ? "मांगलिक स्थिति व सामंजस्य:" : "Manglik Alignment:"}</b> {hi ? (milanResult.manglikStatusHi || milanResult.manglikStatus) : milanResult.manglikStatus}
                    </div>

                    {/* Pro compatibility report unlock */}
                    <div style={{ textAlign: "center", padding: "16px", background: "rgba(35,22,65,0.8)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 10 }}>
                      <div style={{ color: "#F3D37A", fontSize: 14.5, fontWeight: 800 }}>
                        {hi ? "विस्तृत दांपत्य भविष्य, संतान योग एवं निवारण रिपोर्ट (PDF)" : "Unlock Complete 25-Page Matrimonial Compatibility PDF"}
                      </div>
                      {effectiveMatchmakingUnlocked ? (
                        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                          {isAdmin && (
                            <div style={{ background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 12, padding: "2px 10px", color: "#FDE68A", fontSize: 11.5, fontWeight: 800 }}>
                              👑 {hi ? "एडमिन वीआईपी अनलॉक" : "Admin VIP Access"}
                            </div>
                          )}
                          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                            <button
                              onClick={() => handlePrintReport("matchmaking")}
                              className="gold-cta-btn"
                              style={{ background: "linear-gradient(90deg, #F59E0B, #D97706)", border: "none", color: "#0F0A1E", padding: "10px 22px", borderRadius: 8, fontSize: 13.5, fontWeight: 800, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
                            >
                              <span>📄</span> {hi ? "मिलान PDF डाउनलोड / प्रिंट करें (FREE)" : "Download / Print Compatibility PDF (FREE)"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveCheckout({
                                title: hi ? "श्रद्धा दक्षिणा (Seva Bhent)" : "Offer Dakshina (Sacred Offering)",
                                priceKey: "dakshina",
                                price: PRODUCT_PRICES.dakshina[currency],
                                desc: hi ? "वैदिक ज्योतिष अनुसंधान एवं निःशुल्क सर्वर सेवा हेतु स्वैच्छिक दक्षिणा" : "Voluntary offering to maintain free Vedic compute servers and support seekers worldwide",
                                icon: "🪷",
                                isDakshina: true
                              })}
                              style={{ background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.4)", color: "#FDE68A", padding: "10px 18px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
                            >
                              <span>🪷</span> {hi ? "श्रद्धा दक्षिणा दें" : "Offer Dakshina"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setActiveCheckout({
                            title: "Kundli Milan Comprehensive PDF Report",
                            priceKey: "matchmakingReport",
                            price: PRODUCT_PRICES.matchmakingReport[currency],
                            desc: "In-depth Bhakoot/Nadi analysis, future timing, and harmony remedies",
                            icon: "❤️",
                            isMatchmakingUnlock: true
                          })}
                          style={{ marginTop: 10, background: "linear-gradient(90deg, #F59E0B, #D97706)", border: "none", color: "#0F0A1E", padding: "10px 22px", borderRadius: 8, fontSize: 13.5, fontWeight: 800, cursor: "pointer" }}
                        >
                          {hi ? "डाउनलोड करें" : "Unlock Report"} ({PRODUCT_PRICES.matchmakingReport[currency]})
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 5: 1-ON-1 ASTROLOGER CONSULTATION (COMING SOON) ── */}
            {tab === "consult" && (
              <div className="glass-card" style={{ padding: "38px 28px", marginBottom: 20, textAlign: "center" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.35)", borderRadius: 20, padding: "5px 14px", color: "#FDE68A", fontSize: 12, fontWeight: 800, marginBottom: 16 }}>
                  <span>⏳</span> {hi ? "जल्द आ रहा है · COMING SOON" : "COMING SOON · PRIORITY LAUNCH"}
                </div>

                <div style={{ fontSize: 48, marginBottom: 12 }}>🔮</div>
                <h3 style={{ color: "#F3D37A", fontSize: 22, fontWeight: 800, marginBottom: 10 }}>
                  {hi ? "1-on-1 प्रमाणित ज्योतिषी परामर्श सेवा" : "1-on-1 Certified Astrologer Consultation"}
                </h3>
                <p style={{ color: "rgba(241,231,208,0.85)", fontSize: 14, maxWidth: 560, margin: "0 auto 26px", lineHeight: 1.75 }}>
                  {hi 
                    ? "हम वर्तमान में उच्च योग्यता प्राप्त, अनुभवी एवं प्रामाणिक वैदिक विद्वानों को जोड़ रहे हैं। शीघ्र ही आप करियर, विवाह, स्वास्थ्य एवं व्यक्तिगत प्रश्नों पर सीधे ईमेल व वीडियो परामर्श प्राप्त कर सकेंगे।" 
                    : "We are currently curating and verifying top-tier Vedic Astrologers and PhD scholars. Direct private 1-on-1 consultations for Career, Marriage & Life Guidance will be live shortly."}
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, maxWidth: 720, margin: "0 auto 28px", textAlign: "left" }}>
                  {[
                    { icon: "🛡️", title: hi ? "100% गोपनीय व सुरक्षित" : "100% Confidential", desc: hi ? "निजी परामर्श और पूर्ण गोपनीयता" : "Private & encrypted discussions" },
                    { icon: "📜", title: hi ? "सटीक पराशरी गणना" : "Parashari Principles", desc: hi ? "प्रामाणिक शास्त्रीय पद्धति" : "Classical Vedic astrological analysis" },
                    { icon: "✉️", title: hi ? "ईमेल व ऑडियो परामर्श" : "Direct Email & Audio Booking", desc: hi ? "सुविधाजनक स्लॉट व त्वरित ईमेल उत्तर" : "Priority scheduling & direct email support" },
                  ].map((feat, idx) => (
                    <div key={idx} style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: 16 }}>
                      <div style={{ fontSize: 22, marginBottom: 6 }}>{feat.icon}</div>
                      <div style={{ color: "#FDE68A", fontSize: 13.5, fontWeight: 800 }}>{feat.title}</div>
                      <div style={{ color: "rgba(241,231,208,0.75)", fontSize: 12.5, marginTop: 3 }}>{feat.desc}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <a
                    href={`mailto:teamjyotishparamarsh@gmail.com?subject=${encodeURIComponent("Priority Waitlist for 1-on-1 Vedic Astrologer Consultation")}&body=${encodeURIComponent("Namaste Team Jyotish Paramarsh,\n\nI would like to join the Priority Waitlist for 1-on-1 Vedic Astrologer Consultation on Jyotish Paramarsh.\n\nPlease notify me when booking slots open.\n\nThank you!")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: "linear-gradient(90deg, #F59E0B, #D97706)",
                      color: "#0F0A1E",
                      padding: "14px 28px",
                      borderRadius: 10,
                      fontSize: 14.5,
                      fontWeight: 800,
                      textDecoration: "none",
                      boxShadow: "0 4px 16px rgba(245,158,11,0.3)"
                    }}
                  >
                    <span>✉️</span> {hi ? "प्राथमिकता प्रतीक्षा सूची में जुड़ें (Email Waitlist)" : "Join Priority Waitlist via Email"}
                  </a>

                  <div style={{ fontSize: 13, color: "rgba(243, 211, 122, 0.9)", display: "flex", alignItems: "center", gap: 6 }}>
                    <span>📧</span>
                    <span>{hi ? "सीधे संपर्क करें:" : "Direct Astrologer Inquiries:"}</span>
                    <a href="mailto:teamjyotishparamarsh@gmail.com" style={{ color: "#FDE68A", fontWeight: 700, textDecoration: "underline" }}>
                      teamjyotishparamarsh@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 6: VEDIC STORE & CERTIFIED REMEDIES (COMING SOON) ── */}
            {tab === "store" && (
              <div className="glass-card" style={{ padding: "30px 26px", marginBottom: 20 }}>
                {/* Photographic Banner */}
                <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", marginBottom: 24, height: 160, boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
                  <img src="/images/feature_gemstones.jpg" alt="Certified Vedic Gemstones and Rudraksha" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(15,10,32,0.92) 20%, rgba(15,10,32,0.65) 60%, transparent 100%)", display: "flex", alignItems: "center", padding: "0 24px" }}>
                    <div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.25)", border: "1px solid rgba(245,158,11,0.5)", borderRadius: 20, padding: "3px 12px", color: "#FDE68A", fontSize: 11, fontWeight: 800, marginBottom: 8 }}>
                        <Icons.Clock size={12} color="#FDE68A" /> {hi ? "स्टोर जल्द उपलब्ध होगा · VENDOR ONBOARDING IN PROGRESS" : "STORE COMING SOON · CERTIFIED VENDOR ONBOARDING"}
                      </div>
                      <h2 style={{ color: "#FFF", fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>
                        {hi ? "आपकी कुंडली के अनुकूल निर्धारित रत्न एवं सिद्ध उपाय" : "Prescribed Gemstones & Astrological Remedies"}
                      </h2>
                      <div style={{ color: "#FDE68A", fontSize: 12.5, fontWeight: 600 }}>
                        {hi ? `आपके लग्न (${result.lagnaSign}) के अनुसार शास्त्रीय ज्योतिषीय विश्लेषण` : `Astrological prescription tailored specifically for your ${result.lagnaSign} Lagna`}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
                  {/* Prescribed Gemstone */}
                  <div style={{ background: "rgba(15,10,32,0.85)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 14, padding: "22px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontSize: 32 }}>💍</span>
                      <div style={{ color: "#FDE68A", fontSize: 12, fontWeight: 800, marginTop: 4 }}>PRESCRIBED LUCKY GEMSTONE</div>
                      <h4 style={{ color: "#F3D37A", fontSize: 17, fontWeight: 800 }}>{result.gemObj.gem}</h4>
                      <p style={{ color: "rgba(241,231,208,0.85)", fontSize: 13, marginTop: 6, lineHeight: 1.6 }}>
                        Certified natural, unheated gemstone recommended to strengthen your {result.lagnaSign} Lagna and enhance vitality & success.
                      </p>
                    </div>
                    <div style={{ marginTop: 18, borderTop: "1px solid rgba(212,175,55,0.15)", paddingTop: 14 }}>
                      <div style={{ background: "rgba(245,158,11,0.08)", border: "1px dashed rgba(245,158,11,0.3)", borderRadius: 8, padding: "10px 14px", textAlign: "center", color: "#FDE68A", fontSize: 12.5, fontWeight: 700 }}>
                        ⏳ {hi ? "प्रमाणित लैब रत्न स्टोर (जल्द शुरू)" : "Lab Certified Gemstone Store (Coming Soon)"}
                      </div>
                    </div>
                  </div>

                  {/* Energized Rudraksha */}
                  <div style={{ background: "rgba(15,10,32,0.85)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 14, padding: "22px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontSize: 32 }}>📿</span>
                      <div style={{ color: "#FDE68A", fontSize: 12, fontWeight: 800, marginTop: 4 }}>SACRED ENERGIZED RUDRAKSHA</div>
                      <h4 style={{ color: "#F3D37A", fontSize: 17, fontWeight: 800 }}>{result.rudraksha}</h4>
                      <p style={{ color: "rgba(241,231,208,0.85)", fontSize: 13, marginTop: 6, lineHeight: 1.6 }}>
                        Consecrated with sacred Vedic Beej Mantras for mental clarity, spiritual protection, and planetary peace.
                      </p>
                    </div>
                    <div style={{ marginTop: 18, borderTop: "1px solid rgba(212,175,55,0.15)", paddingTop: 14 }}>
                      <div style={{ background: "rgba(245,158,11,0.08)", border: "1px dashed rgba(245,158,11,0.3)", borderRadius: 8, padding: "10px 14px", textAlign: "center", color: "#FDE68A", fontSize: 12.5, fontWeight: 700 }}>
                        ⏳ {hi ? "सिद्ध रुद्राक्ष स्टोर (जल्द शुरू)" : "Energized Rudraksha Store (Coming Soon)"}
                      </div>
                    </div>
                  </div>

                  {/* Navagraha Yantra */}
                  <div style={{ background: "rgba(15,10,32,0.85)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 14, padding: "22px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontSize: 32 }}>🔯</span>
                      <div style={{ color: "#FDE68A", fontSize: 12, fontWeight: 800, marginTop: 4 }}>COPPER NAVAGRAHA YANTRA</div>
                      <h4 style={{ color: "#F3D37A", fontSize: 17, fontWeight: 800 }}>Shree Sampoorna Navagraha Yantra</h4>
                      <p style={{ color: "rgba(241,231,208,0.85)", fontSize: 13, marginTop: 6, lineHeight: 1.6 }}>
                        Pure copper geometric plate to balance planetary doshas in your residence or workspace.
                      </p>
                    </div>
                    <div style={{ marginTop: 18, borderTop: "1px solid rgba(212,175,55,0.15)", paddingTop: 14 }}>
                      <div style={{ background: "rgba(245,158,11,0.08)", border: "1px dashed rgba(245,158,11,0.3)", borderRadius: 8, padding: "10px 14px", textAlign: "center", color: "#FDE68A", fontSize: 12.5, fontWeight: 700 }}>
                        ⏳ {hi ? "वैदिक यंत्र स्टोर (जल्द शुरू)" : "Sacred Yantra Store (Coming Soon)"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 7: PLANETS & COMPREHENSIVE LIFE IMPACT ANALYSIS ── */}
            {tab === "planets" && (() => {
              const getPlanetStrength = (status = "") => {
                if (status.includes("Exalted") || status.includes("उच्च")) return { pct: 96, label: hi ? "उच्च (सर्वश्रेष्ठ)" : "Exalted (Supreme)", color: "#10B981", glow: "rgba(16,185,129,0.5)" };
                if (status.includes("Moolatrikona") || status.includes("मूलत्रिकोण")) return { pct: 90, label: hi ? "मूलत्रिकोण (अति बली)" : "Moolatrikona (Very Strong)", color: "#F59E0B", glow: "rgba(245,158,11,0.5)" };
                if (status.includes("Own") || status.includes("स्वगृही") || status.includes("स्वराशि")) return { pct: 84, label: hi ? "स्वगृही (शक्तिशाली)" : "Own Sign (Strong)", color: "#FBBF24", glow: "rgba(251,191,36,0.5)" };
                if (status.includes("Great Friend") || status.includes("अधिमित्र")) return { pct: 76, label: hi ? "अधिमित्र (शुभ)" : "Great Friend (Benefic)", color: "#60A5FA", glow: "rgba(96,165,250,0.5)" };
                if (status.includes("Friendly") || status.includes("मित्र")) return { pct: 68, label: hi ? "मित्र राशि (सकारात्मक)" : "Friendly (Positive)", color: "#38BDF8", glow: "rgba(56,189,248,0.5)" };
                if (status.includes("Neutral") || status.includes("सम")) return { pct: 52, label: hi ? "सम राशि (संतुलित)" : "Neutral (Balanced)", color: "#FDE68A", glow: "rgba(253,230,138,0.4)" };
                if (status.includes("Enemy") || status.includes("शत्रु") || status.includes("अधिशत्रु")) return { pct: 36, label: hi ? "शत्रु राशि (चुनौतीपूर्ण)" : "Enemy (Challenging)", color: "#FB923C", glow: "rgba(251,146,60,0.4)" };
                if (status.includes("Debilitated") || status.includes("नीच")) return { pct: 22, label: hi ? "नीच राशि (अशुभ/कमजोर)" : "Debilitated (Afflicted)", color: "#F87171", glow: "rgba(248,113,113,0.5)" };
                return { pct: 55, label: hi ? "सामान्य (सक्रिय)" : "Active", color: "#F3D37A", glow: "rgba(243,211,122,0.3)" };
              };

              let exaltedCount = 0;
              let strongCount = 0;
              let debilitatedCount = 0;
              let yuvaCount = 0;

              // Build resilient planetHouseMap
              const pMap = result.planetHouseMap || PLANETS.reduce((acc, p) => {
                if (result.planetData?.[p.name]?.house) acc[p.name] = result.planetData[p.name].house;
                return acc;
              }, {});

              // Detect all active planetary conjunctions
              const conjunctions = detectPlanetaryConjunctions(pMap, result.planetData, lang);

              PLANETS.forEach(p => {
                const pd = result.planetData?.[p.name] || {};
                const st = pd.status || "";
                if (st.includes("Exalted") || st.includes("उच्च")) exaltedCount++;
                else if (st.includes("Own") || st.includes("Moolatrikona") || st.includes("स्वगृही") || st.includes("मूलत्रिकोण") || st.includes("Friend") || st.includes("मित्र")) strongCount++;
                else if (st.includes("Debilitated") || st.includes("नीच")) debilitatedCount++;

                const signIdx = Math.max(0, ZODIAC_SIGNS.findIndex(s => s.name === pd.sign));
                const av = getPlanetaryAvastha(pd.degInt !== undefined ? pd.degInt : (parseFloat(pd.degree) || 0), signIdx);
                if (av.key === "Yuva") yuvaCount++;
              });

              // Detailed planet breakdown for the interactive deep-dive section
              const currentPlanetData = result.planetData?.[selectedPlanetDetail] || result.planetData?.["Sun"] || {};
              const planetDetail = getPlanetLifeImpactBreakdown(
                selectedPlanetDetail,
                currentPlanetData,
                result.houses,
                lang
              );

              return (
                <div>
                  {/* Planetary Power & Conjunction Summary Cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 22 }}>
                    <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 28 }}>🌟</span>
                      <div>
                        <div style={{ color: "#34D399", fontSize: 18, fontWeight: 800 }}>{exaltedCount + strongCount} {hi ? "शुभ व बली ग्रह" : "Benefic & Strong"}</div>
                        <div style={{ color: "rgba(241, 231, 208, 0.75)", fontSize: 12, marginTop: 2 }}>{hi ? "उच्च व स्वराशि बल स्थिति" : "Exalted & Own Dignity"}</div>
                      </div>
                    </div>

                    <div style={{ background: "rgba(139, 92, 246, 0.12)", border: "1px solid rgba(139, 92, 246, 0.35)", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 28 }}>✨</span>
                      <div>
                        <div style={{ color: "#C4B5FD", fontSize: 18, fontWeight: 800 }}>{conjunctions.length} {hi ? "सक्रिय ग्रह युतियां" : "Active Conjunctions"}</div>
                        <div style={{ color: "rgba(241, 231, 208, 0.75)", fontSize: 12, marginTop: 2 }}>{hi ? "महायोग व युति फल" : "Planetary Combinations & Yogas"}</div>
                      </div>
                    </div>

                    <div style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 28 }}>⚡</span>
                      <div>
                        <div style={{ color: "#FDE68A", fontSize: 18, fontWeight: 800 }}>{yuvaCount} {hi ? "युवावस्था ग्रह (100%)" : "Yuva Avastha (100%)"}</div>
                        <div style={{ color: "rgba(241, 231, 208, 0.75)", fontSize: 12, marginTop: 2 }}>{hi ? "पूर्ण भौतिक कार्यक्षमता" : "Full Physical Potency"}</div>
                      </div>
                    </div>

                    <div style={{ background: debilitatedCount > 0 ? "rgba(239, 68, 68, 0.1)" : "rgba(59, 130, 246, 0.1)", border: `1px solid ${debilitatedCount > 0 ? "rgba(239, 68, 68, 0.3)" : "rgba(59, 130, 246, 0.3)"}`, borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 28 }}>{debilitatedCount > 0 ? "⚠️" : "🛡️"}</span>
                      <div>
                        <div style={{ color: debilitatedCount > 0 ? "#FCA5A5" : "#93C5FD", fontSize: 18, fontWeight: 800 }}>{debilitatedCount} {hi ? "नीच ग्रह" : "Debilitated Placements"}</div>
                        <div style={{ color: "rgba(241, 231, 208, 0.75)", fontSize: 12, marginTop: 2 }}>{debilitatedCount > 0 ? (hi ? "विशिष्ट वैदिक उपाय सुझाए गए" : "Remedies recommended") : (hi ? "कोई गंभीर दोष नहीं" : "Fortified chart")}</div>
                      </div>
                    </div>
                  </div>

                  {/* ─────────────────────────────────────────────────────────────
                      SECTION 1: PLANETARY CONJUNCTIONS & GRAND YOGAS (युतियां)
                  ───────────────────────────────────────────────────────────── */}
                  <div className="glass-card" style={{ padding: "26px 24px", marginBottom: 24, border: "1.5px solid rgba(139, 92, 246, 0.35)", background: "linear-gradient(180deg, rgba(26, 16, 51, 0.85) 0%, rgba(15, 10, 32, 0.95) 100%)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 24 }}>✨</span>
                          <h3 style={{ color: "#F3D37A", fontSize: 18, fontWeight: 800, margin: 0 }}>
                            {hi ? "कुंडली में सक्रिय ग्रह युतियां व महायोग (Planetary Conjunctions & Yutis)" : "Active Planetary Conjunctions & Grand Yutis"}
                          </h3>
                        </div>
                        <p style={{ color: "rgba(241, 231, 208, 0.8)", fontSize: 13, margin: "6px 0 0 0" }}>
                          {hi
                            ? "जब दो या दो से अधिक ग्रह एक ही भाव में स्थित होते हैं, तो उनकी ऊर्जाएं मिलकर जातक के स्वभाव, करियर, शिक्षा और दांपत्य जीवन पर विशिष्ट संयुक्त प्रभाव डालती हैं।"
                            : "When two or more planets occupy the exact same house, their joint energies synthesize to create distinct life patterns across career, intellect, and marriage."}
                        </p>
                      </div>
                      <div style={{ fontSize: 12, color: "#C4B5FD", background: "rgba(139, 92, 246, 0.15)", border: "1px solid rgba(139, 92, 246, 0.3)", borderRadius: 12, padding: "5px 12px", fontWeight: 700 }}>
                        {conjunctions.length} {hi ? "युतियां विद्यमान" : "Active Combinations"}
                      </div>
                    </div>

                    {conjunctions.length === 0 ? (
                      <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px dashed rgba(212, 175, 55, 0.25)", borderRadius: 12, padding: "20px 24px", textAlign: "center" }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>🌌</div>
                        <div style={{ color: "#FDE68A", fontSize: 15, fontWeight: 700 }}>
                          {hi ? "ग्रहों का स्वतंत्र वितरण (Decentralized Planetary Placements)" : "Distinct & Independent Planetary Placements"}
                        </div>
                        <div style={{ color: "rgba(241, 231, 208, 0.82)", fontSize: 13, marginTop: 4, maxWidth: 640, margin: "6px auto 0" }}>
                          {hi
                            ? "आपकी कुंडली में ग्रह अलग-अलग भावों में स्वतंत्र रूप से स्थित हैं। कोई भी ग्रह किसी अन्य ग्रह के साथ एक ही भाव में युति नहीं बना रहा है, जिससे प्रत्येक भाव को एकाग्र ऊर्जा प्राप्त होती है और परस्पर टकराव नहीं होता।"
                            : "Your planets are situated across separate houses without direct conjunctions, providing balanced, focused focus across diverse areas of life without combustive interference."}
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {conjunctions.map((conj, cIdx) => (
                          <div
                            key={cIdx}
                            style={{
                              background: "rgba(15, 10, 32, 0.8)",
                              border: conj.category === "auspicious" ? "1px solid rgba(16, 185, 129, 0.35)" : "1px solid rgba(245, 158, 11, 0.35)",
                              borderRadius: 14,
                              padding: "20px 22px",
                              boxShadow: "0 4px 16px rgba(0,0,0,0.3)"
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <span style={{ fontSize: 26 }}>{conj.icon}</span>
                                <div>
                                  <div style={{ color: "#FDE68A", fontSize: 16, fontWeight: 800 }}>
                                    {conj.yogaName}
                                  </div>
                                  <div style={{ color: "rgba(243, 211, 122, 0.85)", fontSize: 12.5, marginTop: 2 }}>
                                    📍 {conj.houseTitle}
                                  </div>
                                </div>
                              </div>

                              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                <span style={{
                                  fontSize: 11.5,
                                  fontWeight: 700,
                                  padding: "3px 10px",
                                  borderRadius: 12,
                                  background: conj.category === "auspicious" ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                                  color: conj.category === "auspicious" ? "#34D399" : "#FDE68A",
                                  border: `1px solid ${conj.category === "auspicious" ? "rgba(16, 185, 129, 0.35)" : "rgba(245, 158, 11, 0.35)"}`
                                }}>
                                  {conj.category === "auspicious" ? (hi ? "शुभ राजयोग / महायोग" : "Auspicious Rajayoga") : (hi ? "विशिष्ट ऊर्जा योग" : "Dynamic Karmic Yoga")}
                                </span>

                                <div style={{ display: "flex", gap: 6 }}>
                                  {conj.planets.map(pName => {
                                    const pObj = PLANETS.find(p => p.name === pName) || {};
                                    const pData = result.planetData?.[pName] || {};
                                    return (
                                      <span
                                        key={pName}
                                        style={{
                                          background: "rgba(255, 255, 255, 0.06)",
                                          border: `1px solid ${pObj.color || "#D4AF37"}66`,
                                          color: pObj.color || "#FDE68A",
                                          padding: "3px 8px",
                                          borderRadius: 8,
                                          fontSize: 12,
                                          fontWeight: 700,
                                          display: "inline-flex",
                                          alignItems: "center",
                                          gap: 4
                                        }}
                                      >
                                        <span>{pObj.glyph || pObj.symbol}</span>
                                        <span>{hi ? (pObj.sanskrit || pName) : pName}</span>
                                        <span style={{ opacity: 0.75, fontSize: 11 }}>({pData.degree || ""})</span>
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            <p style={{ color: "rgba(241, 231, 208, 0.92)", fontSize: 13.5, lineHeight: 1.7, margin: "0 0 14px 0", background: "rgba(255, 255, 255, 0.02)", padding: "10px 14px", borderRadius: 8, borderLeft: "3px solid #F59E0B" }}>
                              {conj.meaning}
                            </p>

                            {/* 3-Column Life Impact Grid */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                              <div style={{ background: "rgba(245, 158, 11, 0.06)", border: "1px solid rgba(245, 158, 11, 0.2)", borderRadius: 10, padding: "12px 14px" }}>
                                <div style={{ color: "#FDE68A", fontSize: 12.5, fontWeight: 700, marginBottom: 5, display: "flex", alignItems: "center", gap: 6 }}>
                                  <span>💼</span> {hi ? "करियर व आजीविका प्रभाव" : "Career & Profession Impact"}
                                </div>
                                <div style={{ color: "rgba(241, 231, 208, 0.88)", fontSize: 12.5, lineHeight: 1.6 }}>
                                  {conj.career}
                                </div>
                              </div>

                              <div style={{ background: "rgba(59, 130, 246, 0.06)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: 10, padding: "12px 14px" }}>
                                <div style={{ color: "#93C5FD", fontSize: 12.5, fontWeight: 700, marginBottom: 5, display: "flex", alignItems: "center", gap: 6 }}>
                                  <span>🎓</span> {hi ? "शिक्षा व बौद्धिक क्षमता" : "Education & Intellect"}
                                </div>
                                <div style={{ color: "rgba(241, 231, 208, 0.88)", fontSize: 12.5, lineHeight: 1.6 }}>
                                  {conj.intellect}
                                </div>
                              </div>

                              <div style={{ background: "rgba(244, 114, 182, 0.06)", border: "1px solid rgba(244, 114, 182, 0.2)", borderRadius: 10, padding: "12px 14px" }}>
                                <div style={{ color: "#F472B6", fontSize: 12.5, fontWeight: 700, marginBottom: 5, display: "flex", alignItems: "center", gap: 6 }}>
                                  <span>❤️</span> {hi ? "दांपत्य व प्रेम संबंध" : "Love Life & Marriage"}
                                </div>
                                <div style={{ color: "rgba(241, 231, 208, 0.88)", fontSize: 12.5, lineHeight: 1.6 }}>
                                  {conj.love}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ─────────────────────────────────────────────────────────────
                      SECTION 2: PLANETARY DEGREE, AVASTHA & DIGNITY MATRIX TABLE
                  ───────────────────────────────────────────────────────────── */}
                  <div className="glass-card" style={{ padding: "26px 24px", marginBottom: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                      <div>
                        <h3 style={{ color: "#F3D37A", fontSize: 17, fontWeight: 800, margin: 0 }}>
                          {hi ? "ग्रह स्थिति, अंश, अवस्था व शक्ति सारणी (Degree & Avastha Matrix)" : "Planetary Degrees, Avasthas & Dignity Matrix"}
                        </h3>
                        <p style={{ color: "rgba(241, 231, 208, 0.78)", fontSize: 12.5, margin: "4px 0 0 0" }}>
                          {hi ? "पराशरीय बाल्यावस्था, कुमारावस्था, युवावस्था, वृद्धावस्था व मृतावस्था फल" : "Classical Parashari Bala, Kumara, Yuva, Vriddha & Mrita avastha potencies"}
                        </p>
                      </div>
                      <div style={{ fontSize: 12, color: "rgba(243, 211, 122, 0.85)", background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.25)", borderRadius: 12, padding: "4px 10px" }}>
                        ✨ {hi ? "क्लिक करके विस्तृत प्रभाव देखें" : "Click Planet for In-Depth Life Impact"}
                      </div>
                    </div>

                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
                        <thead>
                          <tr style={{ background: "rgba(245, 158, 11, 0.12)", borderBottom: "1px solid rgba(212, 175, 55, 0.3)" }}>
                            <th style={{ padding: "12px 14px", color: "#FDE68A", fontSize: 13, fontWeight: 800, textAlign: "left" }}>{hi ? "ग्रह (Planet)" : "Planet"}</th>
                            <th style={{ padding: "12px 14px", color: "#FDE68A", fontSize: 13, fontWeight: 800, textAlign: "left" }}>{hi ? "राशि व भाव" : "Sign & House"}</th>
                            <th style={{ padding: "12px 14px", color: "#FDE68A", fontSize: 13, fontWeight: 800, textAlign: "left" }}>{hi ? "अंश व नक्षत्र" : "Degree & Nakshatra"}</th>
                            <th style={{ padding: "12px 14px", color: "#FDE68A", fontSize: 13, fontWeight: 800, textAlign: "left" }}>{hi ? "ग्रहावस्था व कार्यक्षमता" : "Avastha & Potency"}</th>
                            <th style={{ padding: "12px 14px", color: "#FDE68A", fontSize: 13, fontWeight: 800, textAlign: "left" }}>{hi ? "स्थिति व बल" : "Dignity Strength"}</th>
                            <th style={{ padding: "12px 14px", color: "#FDE68A", fontSize: 13, fontWeight: 800, textAlign: "center" }}>{hi ? "विश्लेषण" : "Deep Dive"}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {PLANETS.map((p, idx) => {
                            const pd = result.planetData?.[p.name] || {};
                            const strength = getPlanetStrength(pd.status);
                            const signIdx = Math.max(0, ZODIAC_SIGNS.findIndex(s => s.name === pd.sign));
                            const avastha = getPlanetaryAvastha(pd.degInt !== undefined ? pd.degInt : (parseFloat(pd.degree) || 0), signIdx);
                            const isSelected = selectedPlanetDetail === p.name;

                            return (
                              <tr
                                key={p.name}
                                onClick={() => {
                                  setSelectedPlanetDetail(p.name);
                                  const el = document.getElementById("planet-deep-dive-section");
                                  if (el) el.scrollIntoView({ behavior: "smooth" });
                                }}
                                style={{
                                  borderBottom: "1px solid rgba(212, 175, 55, 0.1)",
                                  background: isSelected ? "rgba(245, 158, 11, 0.12)" : (idx % 2 ? "rgba(255, 255, 255, 0.02)" : "transparent"),
                                  cursor: "pointer",
                                  transition: "background 0.2s"
                                }}
                              >
                                <td style={{ padding: "12px 14px" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(255, 255, 255, 0.05)", border: `1px solid ${p.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, color: p.color, fontWeight: "bold" }}>
                                      {p.glyph || p.symbol}
                                    </div>
                                    <div>
                                      <div style={{ color: p.color, fontWeight: "bold", fontSize: 14 }}>{p.name}</div>
                                      <div style={{ fontSize: 11.5, color: "rgba(241, 231, 208, 0.75)", marginTop: 1 }}>{p.sanskrit}</div>
                                    </div>
                                  </div>
                                </td>

                                <td style={{ padding: "12px 14px", color: "rgba(241, 231, 208, 0.95)", fontSize: 13.5, fontWeight: 600 }}>
                                  <div>{pd.sign} <span style={{ fontSize: 12, color: "rgba(243, 211, 122, 0.85)" }}>({pd.signSanskrit})</span></div>
                                  <div style={{ color: "#FDE68A", fontSize: 12, fontWeight: 700, marginTop: 2 }}>{hi ? `${pd.house}वां भाव` : `House ${pd.house}`}</div>
                                </td>

                                <td style={{ padding: "12px 14px", color: "rgba(241, 231, 208, 0.9)", fontSize: 13.5 }}>
                                  <div style={{ fontWeight: 700 }}>{pd.degree}</div>
                                  <div style={{ fontSize: 11.5, color: "rgba(243, 211, 122, 0.85)", marginTop: 2 }}>{pd.nakshatra} (P{pd.pada})</div>
                                </td>

                                <td style={{ padding: "12px 14px" }}>
                                  <span style={{
                                    display: "inline-block",
                                    padding: "3px 9px",
                                    borderRadius: 10,
                                    fontSize: 11.5,
                                    fontWeight: 700,
                                    background: avastha.key === "Yuva" ? "rgba(16, 185, 129, 0.18)" : (avastha.key === "Kumara" ? "rgba(59, 130, 246, 0.18)" : "rgba(245, 158, 11, 0.18)"),
                                    color: avastha.key === "Yuva" ? "#34D399" : (avastha.key === "Kumara" ? "#93C5FD" : "#FDE68A"),
                                    border: `1px solid ${avastha.key === "Yuva" ? "rgba(16, 185, 129, 0.4)" : "rgba(245, 158, 11, 0.3)"}`
                                  }}>
                                    {hi ? avastha.nameHi : avastha.nameEn}
                                  </span>
                                  <div style={{ fontSize: 11, color: "rgba(241, 231, 208, 0.7)", marginTop: 3 }}>
                                    {hi ? avastha.potencyHi : avastha.potencyEn}
                                  </div>
                                </td>

                                <td style={{ padding: "12px 14px", minWidth: 150 }}>
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                                    <span style={{
                                      padding: "2px 7px",
                                      borderRadius: 10,
                                      fontSize: 11,
                                      fontWeight: 700,
                                      background: `${strength.color}22`,
                                      color: strength.color,
                                      border: `1px solid ${strength.color}55`
                                    }}>
                                      {pd.status || "—"}
                                    </span>
                                    <span style={{ fontSize: 11, fontWeight: 800, color: strength.color }}>
                                      {strength.pct}%
                                    </span>
                                  </div>
                                  <div style={{
                                    width: "100%",
                                    height: 6,
                                    background: "rgba(255, 255, 255, 0.08)",
                                    borderRadius: 999,
                                    overflow: "hidden"
                                  }}>
                                    <div style={{
                                      width: `${strength.pct}%`,
                                      height: "100%",
                                      borderRadius: 999,
                                      background: `linear-gradient(90deg, ${strength.color}88, ${strength.color})`,
                                      boxShadow: `0 0 8px ${strength.glow}`
                                    }} />
                                  </div>
                                </td>

                                <td style={{ padding: "12px 14px", textAlign: "center" }}>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedPlanetDetail(p.name);
                                      const el = document.getElementById("planet-deep-dive-section");
                                      if (el) el.scrollIntoView({ behavior: "smooth" });
                                    }}
                                    style={{
                                      background: isSelected ? "linear-gradient(90deg, #F59E0B, #D97706)" : "rgba(245, 158, 11, 0.12)",
                                      color: isSelected ? "#0F0A1E" : "#FDE68A",
                                      border: "1px solid rgba(245, 158, 11, 0.4)",
                                      borderRadius: 8,
                                      padding: "6px 12px",
                                      fontSize: 12,
                                      fontWeight: 700,
                                      cursor: "pointer",
                                      whiteSpace: "nowrap",
                                      transition: "all 0.2s"
                                    }}
                                  >
                                    {hi ? "विस्तार से समझें 🔍" : "Deep Dive 🔍"}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* ─────────────────────────────────────────────────────────────
                      SECTION 3: INTERACTIVE 9-PLANET LIFE IMPACT DEEP DIVE
                  ───────────────────────────────────────────────────────────── */}
                  <div id="planet-deep-dive-section" className="glass-card" style={{ padding: "28px 24px", marginBottom: 24, border: "1.5px solid rgba(245, 158, 11, 0.45)", background: "linear-gradient(180deg, rgba(20, 14, 40, 0.9) 0%, rgba(11, 8, 25, 0.98) 100%)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 26 }}>🪐</span>
                          <h3 style={{ color: "#F3D37A", fontSize: 19, fontWeight: 800, margin: 0 }}>
                            {hi ? "प्रत्येक ग्रह का संपूर्ण जीवन प्रभाव (Multi-Dimensional Life Impact)" : "In-Depth Life Aspect Breakdown by Planet"}
                          </h3>
                        </div>
                        <p style={{ color: "rgba(241, 231, 208, 0.8)", fontSize: 13, margin: "6px 0 0 0" }}>
                          {hi
                            ? "ग्रह के अंश (Degree), बाल्यावस्था/युवावस्था, संबंधित भाव के कारकत्व और करियर, शिक्षा, प्रेम-दांपत्य, धन व स्वास्थ्य पर प्रभाव का संपूर्ण वैदिक विश्लेषण।"
                            : "Detailed breakdown of planetary degree, avastha potency, house governance, and multi-dimensional effects across career, education, love, wealth & health."}
                        </p>
                      </div>
                    </div>

                    {/* Planet Selector Pills */}
                    <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, marginBottom: 22, scrollbarWidth: "thin" }}>
                      {PLANETS.map(p => {
                        const isSel = selectedPlanetDetail === p.name;
                        const pd = result.planetData?.[p.name] || {};
                        return (
                          <button
                            key={p.name}
                            onClick={() => setSelectedPlanetDetail(p.name)}
                            style={{
                              background: isSel ? "linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(139, 92, 246, 0.3) 100%)" : "rgba(255, 255, 255, 0.04)",
                              border: isSel ? "1.5px solid #F59E0B" : "1px solid rgba(212, 175, 55, 0.2)",
                              borderRadius: 12,
                              padding: "10px 14px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              whiteSpace: "nowrap",
                              transition: "all 0.2s ease",
                              boxShadow: isSel ? "0 4px 14px rgba(245, 158, 11, 0.3)" : "none"
                            }}
                          >
                            <span style={{ fontSize: 18, color: p.color }}>{p.glyph || p.symbol}</span>
                            <div style={{ textAlign: "left" }}>
                              <div style={{ color: isSel ? "#FDE68A" : "rgba(241, 231, 208, 0.9)", fontSize: 13, fontWeight: 700 }}>
                                {hi ? p.sanskrit : p.name}
                              </div>
                              <div style={{ fontSize: 11, color: isSel ? "#F3D37A" : "rgba(241, 231, 208, 0.6)" }}>
                                {hi ? `${pd.house}वां भाव` : `H${pd.house}`} · {pd.degree || ""}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Selected Planet Comprehensive Showcase Card */}
                    <div style={{ background: "rgba(15, 10, 32, 0.85)", border: "1px solid rgba(212, 175, 55, 0.3)", borderRadius: 16, padding: "24px 22px" }}>
                      {/* Planet Header Banner */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, borderBottom: "1px solid rgba(212, 175, 55, 0.2)", paddingBottom: 18, marginBottom: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255, 255, 255, 0.05)", border: `2px solid ${planetDetail.color || "#F59E0B"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: planetDetail.color || "#F59E0B" }}>
                            {planetDetail.symbol}
                          </div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <h4 style={{ color: "#F3D37A", fontSize: 20, fontWeight: 800, margin: 0 }}>
                                {hi ? planetDetail.planetHi : planetDetail.planet} ({planetDetail.planet})
                              </h4>
                              <span style={{ background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.3)", color: "#FDE68A", padding: "2px 8px", borderRadius: 8, fontSize: 11.5, fontWeight: 700 }}>
                                {planetDetail.status || "Active"}
                              </span>
                            </div>
                            <div style={{ color: "rgba(241, 231, 208, 0.85)", fontSize: 13, marginTop: 4 }}>
                              <strong>{hi ? "प्राकृतिक कारकतत्व:" : "Natural Significator (Karaka):"}</strong> {planetDetail.karaka}
                            </div>
                          </div>
                        </div>

                        {/* Position Badges */}
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <div style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 10, padding: "8px 12px", textAlign: "center" }}>
                            <div style={{ color: "rgba(241, 231, 208, 0.65)", fontSize: 11 }}>{hi ? "राशि" : "Sign"}</div>
                            <div style={{ color: "#FDE68A", fontSize: 13.5, fontWeight: 700 }}>{planetDetail.sign}</div>
                          </div>
                          <div style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 10, padding: "8px 12px", textAlign: "center" }}>
                            <div style={{ color: "rgba(241, 231, 208, 0.65)", fontSize: 11 }}>{hi ? "भाव" : "House"}</div>
                            <div style={{ color: "#34D399", fontSize: 13.5, fontWeight: 800 }}>{hi ? `${planetDetail.house}वां भाव` : `House ${planetDetail.house}`}</div>
                          </div>
                          <div style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 10, padding: "8px 12px", textAlign: "center" }}>
                            <div style={{ color: "rgba(241, 231, 208, 0.65)", fontSize: 11 }}>{hi ? "अंश (Degree)" : "Degree"}</div>
                            <div style={{ color: "#60A5FA", fontSize: 13.5, fontWeight: 700 }}>{planetDetail.degree}</div>
                          </div>
                          <div style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 10, padding: "8px 12px", textAlign: "center" }}>
                            <div style={{ color: "rgba(241, 231, 208, 0.65)", fontSize: 11 }}>{hi ? "नक्षत्र" : "Nakshatra"}</div>
                            <div style={{ color: "#F472B6", fontSize: 13.5, fontWeight: 700 }}>{planetDetail.nakshatra} (P{planetDetail.pada})</div>
                          </div>
                        </div>
                      </div>

                      {/* Degree Potency & Avastha Deep-Explanation */}
                      <div style={{
                        background: "linear-gradient(90deg, rgba(245, 158, 11, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                        border: "1px solid rgba(245, 158, 11, 0.35)",
                        borderRadius: 12,
                        padding: "16px 18px",
                        marginBottom: 16
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                          <div style={{ color: "#FDE68A", fontSize: 14.5, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
                            <span>📐</span>
                            <span>{hi ? "ग्रह के अंश (Degree) व अवस्था का गूढ़ प्रभाव:" : "Exact Degree & Planetary Avastha Impact:"}</span>
                            <span style={{ color: "#34D399", background: "rgba(16, 185, 129, 0.2)", padding: "2px 8px", borderRadius: 8, fontSize: 12 }}>
                              {hi ? planetDetail.avastha.nameHi : planetDetail.avastha.nameEn} ({hi ? planetDetail.avastha.potencyHi : planetDetail.avastha.potencyEn})
                            </span>
                          </div>
                        </div>
                        <p style={{ color: "rgba(241, 231, 208, 0.92)", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                          {hi ? planetDetail.avastha.descHi : planetDetail.avastha.descEn}
                        </p>
                      </div>

                      {/* House Association & Meaning */}
                      <div style={{
                        background: "rgba(59, 130, 246, 0.08)",
                        border: "1px solid rgba(59, 130, 246, 0.25)",
                        borderRadius: 12,
                        padding: "16px 18px",
                        marginBottom: 20
                      }}>
                        <div style={{ color: "#93C5FD", fontSize: 14, fontWeight: 800, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                          <span>🏠</span>
                          <span>{planetDetail.houseTitle}</span>
                        </div>
                        <p style={{ color: "rgba(241, 231, 208, 0.9)", fontSize: 13, lineHeight: 1.65, margin: 0 }}>
                          <strong>{hi ? "यह भाव क्या दर्शाता है: " : "Spheres Governed: "}</strong>
                          {planetDetail.houseGovernance}
                        </p>
                      </div>

                      {/* 5-Dimensional Life Impact Grid */}
                      <div style={{ marginBottom: 22 }}>
                        <h5 style={{ color: "#F3D37A", fontSize: 15, fontWeight: 800, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                          <span>🌐</span> {hi ? "जीवन के 5 मुख्य क्षेत्रों पर प्रभाव (5-Dimensional Life Impact)" : "Multi-Dimensional Life Aspects"}
                        </h5>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
                          {/* 1. Career */}
                          <div style={{ background: "rgba(245, 158, 11, 0.07)", border: "1px solid rgba(245, 158, 11, 0.25)", borderRadius: 12, padding: "16px 18px" }}>
                            <div style={{ color: "#FDE68A", fontSize: 13.5, fontWeight: 800, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                              <span>💼</span> {hi ? "करियर, आजीविका व पद-प्रतिष्ठा" : "Career, Profession & Ambition"}
                            </div>
                            <p style={{ color: "rgba(241, 231, 208, 0.9)", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                              {planetDetail.aspects.career}
                            </p>
                          </div>

                          {/* 2. Education */}
                          <div style={{ background: "rgba(59, 130, 246, 0.07)", border: "1px solid rgba(59, 130, 246, 0.25)", borderRadius: 12, padding: "16px 18px" }}>
                            <div style={{ color: "#93C5FD", fontSize: 13.5, fontWeight: 800, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                              <span>🎓</span> {hi ? "शिक्षा, ज्ञान व बौद्धिक क्षमता" : "Education, Intellect & Learning"}
                            </div>
                            <p style={{ color: "rgba(241, 231, 208, 0.9)", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                              {planetDetail.aspects.education}
                            </p>
                          </div>

                          {/* 3. Love Life */}
                          <div style={{ background: "rgba(244, 114, 182, 0.07)", border: "1px solid rgba(244, 114, 182, 0.25)", borderRadius: 12, padding: "16px 18px" }}>
                            <div style={{ color: "#F472B6", fontSize: 13.5, fontWeight: 800, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                              <span>❤️</span> {hi ? "दांपत्य, प्रेम व संबंध" : "Love Life, Marriage & Rapport"}
                            </div>
                            <p style={{ color: "rgba(241, 231, 208, 0.9)", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                              {planetDetail.aspects.love}
                            </p>
                          </div>

                          {/* 4. Wealth */}
                          <div style={{ background: "rgba(16, 185, 129, 0.07)", border: "1px solid rgba(16, 185, 129, 0.25)", borderRadius: 12, padding: "16px 18px" }}>
                            <div style={{ color: "#34D399", fontSize: 13.5, fontWeight: 800, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                              <span>💰</span> {hi ? "धन संचय, आय व आर्थिक समृद्धि" : "Wealth Accumulation & Gains"}
                            </div>
                            <p style={{ color: "rgba(241, 231, 208, 0.9)", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                              {planetDetail.aspects.wealth}
                            </p>
                          </div>

                          {/* 5. Health */}
                          <div style={{ background: "rgba(168, 85, 247, 0.07)", border: "1px solid rgba(168, 85, 247, 0.25)", borderRadius: 12, padding: "16px 18px" }}>
                            <div style={{ color: "#C084FC", fontSize: 13.5, fontWeight: 800, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                              <span>🌿</span> {hi ? "स्वास्थ्य, शारीरिक स्फूर्ति व मानसिक ऊर्जा" : "Health, Vitality & Mental Stamina"}
                            </div>
                            <p style={{ color: "rgba(241, 231, 208, 0.9)", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                              {planetDetail.aspects.health}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Vedic Remedies & Harmonization Box */}
                      <div style={{
                        background: "rgba(245, 158, 11, 0.1)",
                        border: "1.5px solid rgba(245, 158, 11, 0.4)",
                        borderRadius: 14,
                        padding: "18px 20px"
                      }}>
                        <div style={{ color: "#FDE68A", fontSize: 15, fontWeight: 800, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                          <span>🛡️</span>
                          <span>{hi ? `${planetDetail.planetHi} शांति व शुभ फल वृद्धि वैदिक उपाय` : `${planetDetail.planet} Vedic Harmonization & Remedies`}</span>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                          {/* Mantra */}
                          <div style={{ background: "rgba(0, 0, 0, 0.3)", borderRadius: 10, padding: "12px 14px", border: "1px solid rgba(212, 175, 55, 0.2)" }}>
                            <div style={{ color: "rgba(243, 211, 122, 0.8)", fontSize: 11.5, fontWeight: 700, marginBottom: 4 }}>
                              📿 {hi ? "सिद्ध वैदिक मंत्र (108 बार नित्य)" : "Vedic Beej Mantra"}
                            </div>
                            <div style={{ color: "#FFF", fontSize: 13, fontWeight: 700, letterSpacing: 0.3 }}>
                              {planetDetail.mantra}
                            </div>
                          </div>

                          {/* Deity */}
                          <div style={{ background: "rgba(0, 0, 0, 0.3)", borderRadius: 10, padding: "12px 14px", border: "1px solid rgba(212, 175, 55, 0.2)" }}>
                            <div style={{ color: "rgba(243, 211, 122, 0.8)", fontSize: 11.5, fontWeight: 700, marginBottom: 4 }}>
                              🕉️ {hi ? "आराध्य देव / देवी" : "Presiding Deity"}
                            </div>
                            <div style={{ color: "#FDE68A", fontSize: 13, fontWeight: 700 }}>
                              {planetDetail.deity}
                            </div>
                          </div>

                          {/* Gemstone */}
                          <div style={{ background: "rgba(0, 0, 0, 0.3)", borderRadius: 10, padding: "12px 14px", border: "1px solid rgba(212, 175, 55, 0.2)" }}>
                            <div style={{ color: "rgba(243, 211, 122, 0.8)", fontSize: 11.5, fontWeight: 700, marginBottom: 4 }}>
                              💎 {hi ? "शुभ रत्न व धातु" : "Auspicious Gemstone & Metal"}
                            </div>
                            <div style={{ color: "#34D399", fontSize: 13, fontWeight: 700 }}>
                              {planetDetail.gemstone}
                            </div>
                          </div>
                        </div>

                        {/* Karmic Remedy */}
                        <div style={{ marginTop: 12, background: "rgba(0, 0, 0, 0.25)", borderRadius: 10, padding: "12px 14px", border: "1px solid rgba(212, 175, 55, 0.15)" }}>
                          <div style={{ color: "rgba(243, 211, 122, 0.85)", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                            🕊️ {hi ? "दैनिक कर्मिक व दान उपाय:" : "Karmic Remedy & Charity:"}
                          </div>
                          <div style={{ color: "rgba(241, 231, 208, 0.92)", fontSize: 13, lineHeight: 1.6 }}>
                            {planetDetail.remedy}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <SectionCard icon="🪐" title={t.sec.pa} content={result.pa} />
                </div>
              );
            })()}

            {/* ── TAB 8: HOUSES ── */}
            {tab === "houses" && (
              <div>
                <div className="glass-card" style={{ padding: "26px 22px", marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                    <div>
                      <h3 style={{ color: "#F3D37A", fontSize: 17, fontWeight: 800, margin: 0 }}>{t.htTitle}</h3>
                      <p style={{ color: "rgba(241, 231, 208, 0.75)", fontSize: 12.5, marginTop: 4 }}>
                        {hi ? "किसी भी भाव पर क्लिक या होवर करके कुंडली चक्र के साथ सिंक देखें:" : "Click or hover any house to interactively sync with your Vedic Kundli Chart:"}
                      </p>
                    </div>
                    {hoveredHouse && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, color: "#FDE68A", background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.5)", borderRadius: 20, padding: "4px 12px", fontWeight: 700 }}>
                          ✨ {hi ? `भाव ${hoveredHouse} चयनित` : `House ${hoveredHouse} Active`}
                        </span>
                        <button
                          type="button"
                          onClick={() => setHoveredHouse(null)}
                          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: "3px 8px", color: "rgba(241,231,208,0.8)", fontSize: 11, cursor: "pointer" }}
                        >
                          ✕ {hi ? "रीसेट" : "Reset"}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Quick House Jumper Pills */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid rgba(212,175,55,0.15)" }}>
                    {Array.from({ length: 12 }, (_, i) => {
                      const hn = i + 1;
                      const isSel = hoveredHouse === hn;
                      return (
                        <button
                          key={hn}
                          type="button"
                          onClick={() => setHoveredHouse(isSel ? null : hn)}
                          style={{
                            background: isSel ? "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" : "rgba(255, 255, 255, 0.05)",
                            color: isSel ? "#0F0A1E" : "rgba(241, 231, 208, 0.85)",
                            border: isSel ? "1px solid #FCD34D" : "1px solid rgba(212, 175, 55, 0.2)",
                            borderRadius: 12,
                            padding: "5px 10px",
                            fontSize: 12,
                            fontWeight: isSel ? 800 : 600,
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            boxShadow: isSel ? "0 2px 10px rgba(245, 158, 11, 0.4)" : "none"
                          }}
                        >
                          H{hn} <span style={{ fontSize: 10, opacity: 0.85 }}>({t.hnames[i].split(" ")[0]})</span>
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                    {Array.from({ length: 12 }, (_, i) => {
                      const n = i + 1;
                      const d = result.houses?.[n] || {};
                      const sg = ZODIAC_SIGNS.find(z => z.name === d.sign || z.sanskrit === d.sign) || ZODIAC_SIGNS[i];
                      const pl = d.planets || [];
                      const isHovered = hoveredHouse === n;

                      return (
                        <div
                          key={n}
                          className="house-card-interactive"
                          onMouseEnter={() => setHoveredHouse(n)}
                          onMouseLeave={() => setHoveredHouse(null)}
                          onClick={() => setHoveredHouse(isHovered ? null : n)}
                          style={{
                            background: isHovered ? "linear-gradient(135deg, rgba(40, 26, 75, 0.9) 0%, rgba(20, 14, 45, 0.95) 100%)" : "rgba(15, 10, 32, 0.75)",
                            border: isHovered ? "1px solid #F59E0B" : "1px solid rgba(212, 175, 55, 0.2)",
                            borderRadius: 14,
                            padding: "18px 20px",
                            borderLeft: isHovered ? "4px solid #FCD34D" : "4px solid #F59E0B",
                            boxShadow: isHovered ? "0 8px 30px rgba(245, 158, 11, 0.25)" : "none",
                            transform: isHovered ? "translateY(-3px)" : "none",
                            position: "relative"
                          }}
                        >
                          {isHovered && (
                            <div style={{ position: "absolute", top: 8, right: 10, fontSize: 10, color: "#FDE68A", background: "rgba(245,158,11,0.25)", borderRadius: 8, padding: "2px 6px", fontWeight: 700 }}>
                              SYNCED ✦
                            </div>
                          )}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, paddingRight: isHovered ? 60 : 0 }}>
                            <div>
                              <span style={{ color: "#FDE68A", fontSize: 15, fontWeight: 800 }}>
                                {hi ? `भाव ${n}` : `House ${n}`}
                              </span>
                              <div style={{ fontSize: 12, color: "rgba(243, 211, 122, 0.85)", marginTop: 2, fontWeight: 600 }}>{t.hnames[i]}</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontSize: 20, color: "#F3D37A", lineHeight: 1 }}>{sg.symbol}</div>
                              <div style={{ fontSize: 11, color: "rgba(241, 231, 208, 0.7)", marginTop: 2 }}>{sg.sanskrit}</div>
                            </div>
                          </div>

                          {pl.length > 0 ? (
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                              {pl.map((p, j) => {
                                const pd = PLANETS.find(x => x.name === p);
                                return (
                                  <span key={j} style={{ padding: "3px 10px", borderRadius: 8, fontSize: 12, fontWeight: "bold", background: "rgba(245, 158, 11, 0.18)", color: pd?.color || "#F3D37A", border: "1px solid rgba(245, 158, 11, 0.35)" }}>
                                    {pd?.symbol || "✦"} {p}
                                  </span>
                                );
                              })}
                            </div>
                          ) : (
                            <div style={{ fontSize: 12, color: "rgba(241, 231, 208, 0.5)", marginBottom: 8, fontStyle: "italic" }}>{t.nopl}</div>
                          )}

                          <p style={{ fontSize: 13.5, color: "rgba(241, 231, 208, 0.9)", lineHeight: 1.7 }}>{d.interpretation}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <SectionCard icon="🏠" title={t.sec.ha} content={result.ha} />
              </div>
            )}

            {/* ── MODULE 7: DOSHAS & YOGAS DIAGNOSTIC HUB ── */}
            {tab === "doshas" && (() => {
              const da = result.doshaAnalysis || {};
              const m = da.manglik || {};
              const ks = da.kaalSarp || {};
              const ss = da.sadeSati || {};
              const p = da.pitra || {};
              const gc = da.guruChandal || {};
              const km = da.kemadruma || {};
              const gm = da.gandmool || {};

              return (
                <div style={{ animation: "fadeInCard 0.4s ease" }}>
                  {/* Header Banner */}
                  <div className="glass-card" style={{ padding: "26px 28px", marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                      <div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "#F59E0B", fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 }}>
                          <span>⚡</span> MODULE 7 · YOGA & DOSHA DIAGNOSTIC ENGINE
                        </div>
                        <h3 style={{ color: "#F3D37A", fontSize: 20, fontWeight: 800, margin: 0 }}>
                          {hi ? "वैदिक दोष व योग संपूर्ण निदान एवं शास्त्रीय उपाय" : "Comprehensive Vedic Dosha Diagnostics & Remedial Shields"}
                        </h3>
                        <p style={{ color: "rgba(241, 231, 208, 0.75)", fontSize: 13, marginTop: 4 }}>
                          {hi ? "मांगलिक, कालसर्प (१२ प्रकार), शनि साढ़ेसाती, पितृ दोष, गुरु चांडाल, केमद्रुम एवं राजयोगों का प्रामाणिक विश्लेषण।" : "Authentic Parashari assessment of Manglik, 12 Kaal Sarp variants, Sade Sati, Pitra & Kemadruma with Vedic remedies."}
                        </p>
                      </div>

                      <div style={{ background: "rgba(245, 158, 11, 0.12)", border: "1px solid rgba(245, 158, 11, 0.35)", borderRadius: 14, padding: "8px 16px", textAlign: "center" }}>
                        <div style={{ fontSize: 11.5, color: "rgba(243, 211, 122, 0.8)", fontWeight: 600 }}>{hi ? "दोष निवारण कवच" : "Remedial Status"}</div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: "#34D399" }}>
                          {m.isCancelled || !m.isManglik ? (hi ? "संरक्षित व शुभ" : "Shielded / Auspicious") : (hi ? "उपाय अपेक्षित" : "Remedies Active")}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 1. Manglik Dosha Card */}
                  <div className="glass-card" style={{ padding: "24px 26px", marginBottom: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 12, marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 22 }}>🔥</span>
                        <h4 style={{ color: "#FDE68A", fontSize: 17, fontWeight: 800, margin: 0 }}>
                          {hi ? "१. मांगलिक दोष (भौम / कुज दोष) विचार" : "1. Manglik Dosha (Kuja Dosha) Assessment"}
                        </h4>
                      </div>
                      <span style={{
                        padding: "5px 14px",
                        borderRadius: 14,
                        fontSize: 12.5,
                        fontWeight: 800,
                        background: m.isCancelled ? "rgba(16, 185, 129, 0.2)" : m.isManglik ? "rgba(239, 68, 68, 0.2)" : "rgba(16, 185, 129, 0.2)",
                        border: m.isCancelled ? "1px solid #10B981" : m.isManglik ? "1px solid #EF4444" : "1px solid #10B981",
                        color: m.isCancelled ? "#34D399" : m.isManglik ? "#F87171" : "#34D399"
                      }}>
                        {m.status}
                      </span>
                    </div>

                    <p style={{ color: "rgba(241, 231, 208, 0.9)", fontSize: 13.5, lineHeight: 1.7, marginBottom: 14 }}>
                      {m.desc}
                    </p>

                    <div style={{ background: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.25)", borderRadius: 10, padding: "12px 16px" }}>
                      <div style={{ fontSize: 12.5, color: "#FDE68A", fontWeight: 700, marginBottom: 4 }}>
                        🛡️ {hi ? "शास्त्रीय मंगल उपाय (Vedic Kuja Remedies):" : "Prescribed Vedic Remedies:"}
                      </div>
                      <div style={{ color: "rgba(241, 231, 208, 0.85)", fontSize: 13, lineHeight: 1.6 }}>
                        {hi ? m.remediesHi : m.remediesEn}
                      </div>
                    </div>
                  </div>

                  {/* 2. Kaal Sarp Dosha Card */}
                  <div className="glass-card" style={{ padding: "24px 26px", marginBottom: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 12, marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 22 }}>🐍</span>
                        <h4 style={{ color: "#FDE68A", fontSize: 17, fontWeight: 800, margin: 0 }}>
                          {hi ? "२. कालसर्प योग (१२ शास्त्रीय प्रकार) विचार" : "2. Kaal Sarp Yoga (12 Classical Archetypes)"}
                        </h4>
                      </div>
                      <span style={{
                        padding: "5px 14px",
                        borderRadius: 14,
                        fontSize: 12.5,
                        fontWeight: 800,
                        background: ks.isFull ? "rgba(239, 68, 68, 0.2)" : ks.isPartial ? "rgba(245, 158, 11, 0.2)" : "rgba(16, 185, 129, 0.2)",
                        border: ks.isFull ? "1px solid #EF4444" : ks.isPartial ? "1px solid #F59E0B" : "1px solid #10B981",
                        color: ks.isFull ? "#F87171" : ks.isPartial ? "#FDE68A" : "#34D399"
                      }}>
                        {ks.status}
                      </span>
                    </div>

                    <p style={{ color: "rgba(241, 231, 208, 0.9)", fontSize: 13.5, lineHeight: 1.7, marginBottom: 14 }}>
                      {ks.desc}
                    </p>

                    <div style={{ background: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.25)", borderRadius: 10, padding: "12px 16px" }}>
                      <div style={{ fontSize: 12.5, color: "#FDE68A", fontWeight: 700, marginBottom: 4 }}>
                        🕉️ {hi ? "कालसर्प शांति व शिव साधना उपाय:" : "Prescribed Kaal Sarp Remedies:"}
                      </div>
                      <div style={{ color: "rgba(241, 231, 208, 0.85)", fontSize: 13, lineHeight: 1.6 }}>
                        {hi ? ks.remediesHi : ks.remediesEn}
                      </div>
                    </div>
                  </div>

                  {/* 3. Shani Sade Sati & Shani Dhaiya Tracker Card */}
                  <div className="glass-card" style={{ padding: "24px 26px", marginBottom: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 12, marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 22 }}>🪐</span>
                        <h4 style={{ color: "#FDE68A", fontSize: 17, fontWeight: 800, margin: 0 }}>
                          {hi ? "३. शनि साढ़ेसाती एवं ढैया गोचर काल (2025–2027)" : "3. Shani Sade Sati & Dhaiya Live Transit (2025–2027)"}
                        </h4>
                      </div>
                      <span style={{
                        padding: "5px 14px",
                        borderRadius: 14,
                        fontSize: 12.5,
                        fontWeight: 800,
                        background: ss.phase !== "None" ? "rgba(139, 92, 246, 0.25)" : "rgba(16, 185, 129, 0.2)",
                        border: ss.phase !== "None" ? "1px solid #A78BFA" : "1px solid #10B981",
                        color: ss.phase !== "None" ? "#DDD6FE" : "#34D399"
                      }}>
                        {ss.status}
                      </span>
                    </div>

                    <p style={{ color: "rgba(241, 231, 208, 0.9)", fontSize: 13.5, lineHeight: 1.7, marginBottom: 14 }}>
                      {ss.desc}
                    </p>

                    <div style={{ background: "rgba(139, 92, 246, 0.08)", border: "1px solid rgba(139, 92, 246, 0.25)", borderRadius: 10, padding: "12px 16px" }}>
                      <div style={{ fontSize: 12.5, color: "#DDD6FE", fontWeight: 700, marginBottom: 4 }}>
                        ⚖️ {hi ? "शनि देव अनुग्रह व रक्षा उपाय:" : "Prescribed Saturnian Remedial Shields:"}
                      </div>
                      <div style={{ color: "rgba(241, 231, 208, 0.85)", fontSize: 13, lineHeight: 1.6 }}>
                        {hi ? ss.remediesHi : ss.remediesEn}
                      </div>
                    </div>
                  </div>

                  {/* 4. Pitra, Guru Chandal, Kemadruma & Gandmool Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, marginBottom: 20 }}>
                    {/* Pitra Dosha */}
                    <div style={{ background: "rgba(11, 8, 25, 0.7)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 12, padding: "16px 18px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ color: "#FDE68A", fontSize: 14, fontWeight: 800 }}>☀️ {hi ? "पितृ दोष विचार" : "Pitra Dosha"}</span>
                        <span style={{ fontSize: 11.5, padding: "2px 8px", borderRadius: 8, background: p.isAfflicted ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)", color: p.isAfflicted ? "#F87171" : "#34D399", fontWeight: 700 }}>
                          {p.status}
                        </span>
                      </div>
                      <p style={{ color: "rgba(241, 231, 208, 0.85)", fontSize: 12.5, lineHeight: 1.6, margin: "0 0 10px" }}>{p.desc}</p>
                      <div style={{ fontSize: 12, color: "#F59E0B" }}><strong>उपाय:</strong> {hi ? p.remediesHi : p.remediesEn}</div>
                    </div>

                    {/* Guru Chandal */}
                    <div style={{ background: "rgba(11, 8, 25, 0.7)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 12, padding: "16px 18px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ color: "#FDE68A", fontSize: 14, fontWeight: 800 }}>✨ {hi ? "गुरु चांडाल योग" : "Guru Chandal"}</span>
                        <span style={{ fontSize: 11.5, padding: "2px 8px", borderRadius: 8, background: gc.isAfflicted ? "rgba(245,158,11,0.2)" : "rgba(16,185,129,0.2)", color: gc.isAfflicted ? "#FDE68A" : "#34D399", fontWeight: 700 }}>
                          {gc.status}
                        </span>
                      </div>
                      <p style={{ color: "rgba(241, 231, 208, 0.85)", fontSize: 12.5, lineHeight: 1.6, margin: "0 0 10px" }}>{gc.desc}</p>
                      <div style={{ fontSize: 12, color: "#F59E0B" }}><strong>उपाय:</strong> {hi ? gc.remediesHi : gc.remediesEn}</div>
                    </div>

                    {/* Kemadruma */}
                    <div style={{ background: "rgba(11, 8, 25, 0.7)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 12, padding: "16px 18px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ color: "#FDE68A", fontSize: 14, fontWeight: 800 }}>🌙 {hi ? "केमद्रुम योग" : "Kemadruma Yoga"}</span>
                        <span style={{ fontSize: 11.5, padding: "2px 8px", borderRadius: 8, background: km.isAfflicted ? "rgba(245,158,11,0.2)" : "rgba(16,185,129,0.2)", color: km.isAfflicted ? "#FDE68A" : "#34D399", fontWeight: 700 }}>
                          {km.status}
                        </span>
                      </div>
                      <p style={{ color: "rgba(241, 231, 208, 0.85)", fontSize: 12.5, lineHeight: 1.6, margin: "0 0 10px" }}>{km.desc}</p>
                      <div style={{ fontSize: 12, color: "#F59E0B" }}><strong>उपाय:</strong> {hi ? km.remediesHi : km.remediesEn}</div>
                    </div>

                    {/* Gandmool */}
                    <div style={{ background: "rgba(11, 8, 25, 0.7)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 12, padding: "16px 18px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ color: "#FDE68A", fontSize: 14, fontWeight: 800 }}>🌿 {hi ? "गंडमूल विचार" : "Gandmool Check"}</span>
                        <span style={{ fontSize: 11.5, padding: "2px 8px", borderRadius: 8, background: gm.isAfflicted ? "rgba(245,158,11,0.2)" : "rgba(16,185,129,0.2)", color: gm.isAfflicted ? "#FDE68A" : "#34D399", fontWeight: 700 }}>
                          {gm.status}
                        </span>
                      </div>
                      <p style={{ color: "rgba(241, 231, 208, 0.85)", fontSize: 12.5, lineHeight: 1.6, margin: "0 0 10px" }}>{gm.desc}</p>
                      <div style={{ fontSize: 12, color: "#F59E0B" }}><strong>उपाय:</strong> {hi ? gm.remediesHi : gm.remediesEn}</div>
                    </div>
                  </div>

                  {/* Auspicious Grand Yogas */}
                  <SectionCard icon="🌟" title={t.sec.yogas} content={result.yogas} />
                </div>
              );
            })()}

            {/* ── MODULE 8: STRENGTH / SHADBALA & SARVASHTAKAVARGA ── */}
            {tab === "shadbala" && (() => {
              const sb = result.shadbala || {};
              const scores = sb.planetScores || {};
              const ranked = sb.rankedList || [];
              const sav = result.ashtakavarga || {};
              const savHouses = sav.houses || {};

              return (
                <div style={{ animation: "fadeInCard 0.4s ease" }}>
                  {/* Top Summary Banner */}
                  <div className="glass-card" style={{ padding: "26px 28px", marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                      <div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "#F59E0B", fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 }}>
                          <span>⚖️</span> MODULE 8 · SHADBALA & ASHTAKAVARGA ENGINE
                        </div>
                        <h3 style={{ color: "#F3D37A", fontSize: 20, fontWeight: 800, margin: 0 }}>
                          {hi ? "षड्बल ग्रह सामर्थ्य एवं सर्वाष्टकवर्ग चक्र (337 बिंदु)" : "Six-Fold Planetary Strengths (Shadbala) & Sarvashtakavarga Matrix"}
                        </h3>
                        <p style={{ color: "rgba(241, 231, 208, 0.75)", fontSize: 13, marginTop: 4 }}>
                          {hi ? "स्थान, दिग्, काल, चेष्टा, नैसर्गिक व दृग्बल का संपूर्ण अनुपात एवं १२ भावों का बिंदु सामर्थ्य।" : "Positional, directional, temporal, motional, natural, and aspectual planetary potencies."}
                        </p>
                      </div>

                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid #10B981", borderRadius: 12, padding: "8px 14px", textAlign: "center" }}>
                          <div style={{ fontSize: 11, color: "rgba(241, 231, 208, 0.7)" }}>{hi ? "सर्वश्रेष्ठ बली ग्रह" : "Strongest Planet"}</div>
                          <div style={{ fontSize: 15, fontWeight: 800, color: "#34D399" }}>👑 {sb.strongestPlanet}</div>
                        </div>
                        <div style={{ background: "rgba(245, 158, 11, 0.15)", border: "1px solid #F59E0B", borderRadius: 12, padding: "8px 14px", textAlign: "center" }}>
                          <div style={{ fontSize: 11, color: "rgba(241, 231, 208, 0.7)" }}>{hi ? "अष्टकवर्ग कुल बिंदु" : "Total SAV Bindus"}</div>
                          <div style={{ fontSize: 15, fontWeight: 800, color: "#FDE68A" }}>337 / 337</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shadbala Planet Strength Cards Grid */}
                  <div className="glass-card" style={{ padding: "24px 26px", marginBottom: 20 }}>
                    <h4 style={{ color: "#FDE68A", fontSize: 16.5, fontWeight: 800, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                      <span>🪐</span> {hi ? "सप्तग्रह षड्बल अनुपात एवं शक्ति क्रम (Planetary Strength Rankings)" : "7 Classical Planets: Shadbala Virupas & Potency Rankings"}
                    </h4>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, marginBottom: 20 }}>
                      {ranked.map((p, idx) => (
                        <div key={p.planet} style={{ background: "rgba(11, 8, 25, 0.75)", border: `1.5px solid ${p.badgeColor}40`, borderRadius: 12, padding: "14px 16px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 13, background: "rgba(245, 158, 11, 0.2)", border: "1px solid rgba(245, 158, 11, 0.4)", borderRadius: 6, padding: "2px 7px", fontWeight: 800, color: "#FDE68A" }}>
                                #{p.rank}
                              </span>
                              <span style={{ color: "#FFF", fontSize: 15, fontWeight: 800 }}>{p.planet}</span>
                            </div>
                            <span style={{ fontSize: 11.5, padding: "3px 9px", borderRadius: 10, background: `${p.badgeColor}25`, border: `1px solid ${p.badgeColor}`, color: p.badgeColor, fontWeight: 700 }}>
                              {p.category}
                            </span>
                          </div>

                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "rgba(241, 231, 208, 0.8)", marginBottom: 6 }}>
                            <span>{hi ? "कुल षड्बल" : "Total Virupas"}: <strong style={{ color: "#FDE68A" }}>{p.totalVirupas}</strong></span>
                            <span>{hi ? "अपेक्षित" : "Required"}: {p.minRequired} ({p.ratioPct}%)</span>
                          </div>

                          {/* Progress Bar */}
                          <div style={{ width: "100%", height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
                            <div style={{ width: `${Math.min(100, (p.ratioPct / 1.5))}%`, height: "100%", background: `linear-gradient(90deg, #F59E0B, ${p.badgeColor})`, borderRadius: 4 }} />
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 4, marginTop: 10, textAlign: "center", fontSize: 10, color: "rgba(241, 231, 208, 0.65)" }}>
                            <div><div>स्थान</div><div style={{ color: "#FDE68A", fontWeight: 700 }}>{p.sthana}</div></div>
                            <div><div>दिग्</div><div style={{ color: "#FDE68A", fontWeight: 700 }}>{p.dig}</div></div>
                            <div><div>काल</div><div style={{ color: "#FDE68A", fontWeight: 700 }}>{p.kala}</div></div>
                            <div><div>चेष्टा</div><div style={{ color: "#FDE68A", fontWeight: 700 }}>{p.chesta}</div></div>
                            <div><div>नैसर्गिक</div><div style={{ color: "#FDE68A", fontWeight: 700 }}>{p.naisargika}</div></div>
                            <div><div>दृग्</div><div style={{ color: "#FDE68A", fontWeight: 700 }}>{p.drik}</div></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sarvashtakavarga 12-House Matrix */}
                  <div className="glass-card" style={{ padding: "24px 26px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                      <h4 style={{ color: "#FDE68A", fontSize: 16.5, fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                        <span>🔢</span> {hi ? "सर्वाष्टकवर्ग १२ भाव बिंदु चक्र (Sarvashtakavarga Points Matrix)" : "Sarvashtakavarga (SAV) 12 Houses Bindu Allocation"}
                      </h4>
                      <div style={{ fontSize: 12, color: "rgba(241, 231, 208, 0.75)" }}>
                        {hi ? "मानक: २८ बिंदु = संतुलित | >२८ = अति शुभ | <२८ = संवेदनशील" : "Parashari Benchmark: 28 Bindus = Balanced | >28 = Highly Favorable"}
                      </div>
                    </div>

                    {/* Key Pillar Summary */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, marginBottom: 16 }}>
                      <div style={{ background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.35)", borderRadius: 10, padding: "10px 14px" }}>
                        <div style={{ fontSize: 11.5, color: "#34D399", fontWeight: 700 }}>💰 {hi ? "धन व लाभ भाव (२ व ११)" : "Wealth Axis (2nd & 11th)"}</div>
                        <div style={{ fontSize: 18, color: "#FDE68A", fontWeight: 800, marginTop: 2 }}>{sav.wealthBindus} {hi ? "बिंदु" : "Bindus"}</div>
                        <div style={{ fontSize: 11.5, color: "rgba(241, 231, 208, 0.7)", marginTop: 2 }}>
                          {sav.wealthBindus >= 56 ? (hi ? "अति उत्कृष्ट धन संचय व आय योग" : "Exceptional wealth accumulation") : (hi ? "संतुलित वित्तीय प्रयास" : "Steady financial rhythm")}
                        </div>
                      </div>

                      <div style={{ background: "rgba(245, 158, 11, 0.12)", border: "1px solid rgba(245, 158, 11, 0.35)", borderRadius: 10, padding: "10px 14px" }}>
                        <div style={{ fontSize: 11.5, color: "#F59E0B", fontWeight: 700 }}>💼 {hi ? "कर्म स्थान (१०वां भाव)" : "Career House (10th Bhava)"}</div>
                        <div style={{ fontSize: 18, color: "#FDE68A", fontWeight: 800, marginTop: 2 }}>{sav.careerBindus} {hi ? "बिंदु" : "Bindus"}</div>
                        <div style={{ fontSize: 11.5, color: "rgba(241, 231, 208, 0.7)", marginTop: 2 }}>
                          {sav.careerBindus >= 30 ? (hi ? "उच्च पद, सत्ता व सामाजिक सम्मान" : "High executive authority & honors") : (hi ? "कर्मठता से प्रगति" : "Progress via diligence")}
                        </div>
                      </div>

                      <div style={{ background: "rgba(139, 92, 246, 0.12)", border: "1px solid rgba(139, 92, 246, 0.35)", borderRadius: 10, padding: "10px 14px" }}>
                        <div style={{ fontSize: 11.5, color: "#DDD6FE", fontWeight: 700 }}>✨ {hi ? "भाग्य स्थान (९वां भाव)" : "Fortune House (9th Bhava)"}</div>
                        <div style={{ fontSize: 18, color: "#FDE68A", fontWeight: 800, marginTop: 2 }}>{sav.luckBindus} {hi ? "बिंदु" : "Bindus"}</div>
                        <div style={{ fontSize: 11.5, color: "rgba(241, 231, 208, 0.7)", marginTop: 2 }}>
                          {sav.luckBindus >= 28 ? (hi ? "प्रबल ईश्वरीय कृपा व भाग्य वृद्धि" : "Strong protective Bhagya grace") : (hi ? "आत्म-पुरुषार्थ प्रधान" : "Self-driven karma")}
                        </div>
                      </div>
                    </div>

                    {/* 12-Houses Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
                      {Array.from({ length: 12 }, (_, i) => {
                        const hNum = i + 1;
                        const hData = savHouses[hNum] || { bindus: 28, status: "Balanced", badgeColor: "#F59E0B" };
                        return (
                          <div key={hNum} style={{ background: "rgba(11, 8, 25, 0.7)", border: `1px solid ${hData.badgeColor}35`, borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                            <div style={{ fontSize: 11.5, color: "rgba(243, 211, 122, 0.8)", fontWeight: 700 }}>
                              {hi ? `भाव ${hNum}` : `House ${hNum}`}
                            </div>
                            <div style={{ fontSize: 11, color: "rgba(241, 231, 208, 0.65)" }}>
                              {hi ? hData.signSanskrit : hData.sign}
                            </div>
                            <div style={{ fontSize: 22, fontWeight: 900, color: hData.badgeColor, margin: "4px 0" }}>
                              {hData.bindus}
                            </div>
                            <div style={{ fontSize: 10.5, color: hData.badgeColor, fontWeight: 700 }}>
                              {hData.status}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ── TAB 9: LIFE AREAS ── */}
            {tab === "life" && (
              <div>
                <SectionCard icon="🌿" title={t.sec.health} content={result.health} />
                <SectionCard icon="💰" title={t.sec.wealth} content={result.wealth} />
                <SectionCard icon="📚" title={t.sec.education} content={result.education} />
                <SectionCard icon="🏆" title={t.sec.career} content={result.career} />
                <SectionCard icon="💑" title={t.sec.marriage} content={result.marriage} />
              </div>
            )}

            {/* ── MODULE 9: DASHA TIMETABLE & REAL-TIME GOCHARA TRANSITS ── */}
            {tab === "predictions" && (() => {
              const dd = result.detailedDashas || {};
              const activeMaha = dd.activeMahadasha || {};
              const antars = dd.activeAntardashas || [];
              const transits = result.gocharaTransits || [];

              return (
                <div style={{ animation: "fadeInCard 0.4s ease" }}>
                  {/* Top Dasha Card */}
                  <div className="glass-card" style={{ padding: "26px 28px", marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(212,175,55,0.25)", paddingBottom: 14, marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                      <div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "#F59E0B", fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 }}>
                          <span>🔮</span> MODULE 9 · VIMSHOTTARI DASHA & REAL-TIME TRANSIT ENGINE
                        </div>
                        <h3 style={{ color: "#F3D37A", fontSize: 19, fontWeight: 800, margin: 0 }}>
                          {hi ? `वर्तमान सक्रिय महादशा: ${activeMaha.lord} (${activeMaha.startYear} – ${activeMaha.endYear})` : `Active Vimshottari Mahadasha: ${activeMaha.lord} (${activeMaha.startYear} – ${activeMaha.endYear})`}
                        </h3>
                        <p style={{ color: "rgba(241, 231, 208, 0.75)", fontSize: 13, marginTop: 4 }}>
                          {hi ? "प्रत्येक महादशा के अंतर्गत ९ सूक्ष्म अंतर्दशाएं सक्रिय जीवन चक्र को निर्धारित करती हैं।" : "Each Mahadasha unfolds through 9 granular Antardasha sub-periods guiding current life outcomes."}
                        </p>
                      </div>

                      <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid #10B981", borderRadius: 12, padding: "8px 16px", textAlign: "center" }}>
                        <div style={{ fontSize: 11, color: "rgba(241, 231, 208, 0.7)" }}>{hi ? "सक्रिय अंतर्दशा" : "Active Antardasha"}</div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: "#34D399" }}>
                          ⚡ {dd.currentActiveAntardasha?.antardashaLord || activeMaha.lord}
                        </div>
                      </div>
                    </div>

                    {/* Antardasha Timetable */}
                    <h4 style={{ color: "#FDE68A", fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
                      ⏱️ {hi ? `${activeMaha.lord} महादशा के अंतर्गत ९ अंतर्दशा चक्र (Sub-Period Timetable):` : `9 Antardasha Cycles under ${activeMaha.lord} Mahadasha:`}
                    </h4>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10, marginBottom: 16 }}>
                      {antars.map((a, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: a.isActive ? "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(11,8,25,0.9))" : "rgba(11, 8, 25, 0.65)",
                            border: a.isActive ? "1.5px solid #F59E0B" : "1px solid rgba(212, 175, 55, 0.2)",
                            borderRadius: 10,
                            padding: "10px 14px",
                            boxShadow: a.isActive ? "0 0 14px rgba(245,158,11,0.3)" : "none"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ color: a.isActive ? "#FDE68A" : "#FFF", fontSize: 13.5, fontWeight: 800 }}>
                              {activeMaha.lord} – {a.antardashaLord}
                            </span>
                            {a.isActive && (
                              <span style={{ fontSize: 10, background: "#10B981", color: "#0F0A1E", padding: "2px 6px", borderRadius: 6, fontWeight: 900 }}>
                                ACTIVE NOW
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: 12, color: "rgba(241, 231, 208, 0.75)", marginTop: 4 }}>
                            {a.startYear} – {a.endYear} ({a.durationMonths} {hi ? "माह" : "mo"})
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2026-2027 Real-Time Gochara Transits Hub */}
                  <div className="glass-card" style={{ padding: "24px 26px", marginBottom: 20 }}>
                    <h4 style={{ color: "#FDE68A", fontSize: 16.5, fontWeight: 800, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                      <span>🪐</span> {hi ? "वर्ष 2026–2027 प्रमुख ग्रह गोचर प्रभाव (Real-Time Planetary Transits)" : "2026–2027 Major Planetary Transits (Gochara Impact)"}
                    </h4>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
                      {transits.map(tItem => (
                        <div key={tItem.planet} style={{ background: "rgba(11, 8, 25, 0.7)", border: "1px solid rgba(212, 175, 55, 0.25)", borderRadius: 12, padding: "14px 16px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <span style={{ color: "#FDE68A", fontSize: 14.5, fontWeight: 800 }}>{tItem.planet}</span>
                            <span style={{ fontSize: 11.5, padding: "2px 8px", borderRadius: 8, background: tItem.isFavorable ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)", color: tItem.isFavorable ? "#34D399" : "#FDE68A", fontWeight: 700 }}>
                              {tItem.isFavorable ? (hi ? "शुभ गोचर" : "Favorable") : (hi ? "संयम अपेक्षित" : "Inner Growth")}
                            </span>
                          </div>

                          <div style={{ fontSize: 12.5, color: "rgba(241, 231, 208, 0.8)", marginBottom: 4 }}>
                            {hi ? `वर्तमान राशि: ${tItem.signSanskrit}` : `Current Transit: ${tItem.currentSign}`}
                          </div>
                          <div style={{ fontSize: 12, color: "#34D399", marginBottom: 6 }}>
                            {hi ? `चंद्र राशि से भाव ${tItem.houseFromMoon} | लग्न से भाव ${tItem.houseFromAsc}` : `House ${tItem.houseFromMoon} from Moon | House ${tItem.houseFromAsc} from Lagna`}
                          </div>
                          <p style={{ color: "rgba(241, 231, 208, 0.85)", fontSize: 12.5, lineHeight: 1.5, margin: 0 }}>
                            {tItem.impact}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Decade Predictions */}
                  <SectionCard icon="🔮" title={t.sec.pred} content={result.pred} />
                  <SectionCard icon="⏱️" title={t.sec.dasha} content={result.dasha} />
                </div>
              );
            })()}

          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            PRINT-ONLY FULL DETAILED REPORT (Dynamic based on activePrintReport)
        ══════════════════════════════════════════════════════════════════════ */}
        {result && (() => {
          const cp = result.careerPrediction || calculateCareerPrediction({
            name: form.name || "User",
            dob: form.dob || "1998-01-01",
            lagnaSign: result.lagnaSign,
            rashiSign: result.rashiSign,
            lang
          });

          const mp = result.marriagePrediction || calculateMarriagePrediction({
            name: form.name || "User",
            dob: form.dob || "1998-01-01",
            lagnaSign: result.lagnaSign,
            rashiSign: result.rashiSign,
            lang,
            planetData: result.planetData,
            houses: result.houses
          });
          const lva = mp.loveVsArrange || {};

          return (
            <div className="print-only-report">
              {/* ══════════════════════════════════════════════════════════════════════
                  CASE 1: DEDICATED 20-PAGE CAREER & BUSINESS BLUEPRINT DOSSIER
              ══════════════════════════════════════════════════════════════════════ */}
              {activePrintReport === "career" && (
                <div>
                  {/* Title Cover Header */}
                  <div style={{ textAlign: "center", borderBottom: "2px solid #D4AF37", paddingBottom: 16, marginBottom: 24 }}>
                    <div style={{ fontSize: 26, marginBottom: 4 }}>💼 🔯</div>
                    <h1 style={{ fontFamily: "'Cinzel', serif", color: "#F3D37A", fontSize: 25, fontWeight: 800, letterSpacing: 1.5, margin: 0 }}>
                      {hi ? "सम्पूर्ण वैदिक करियर, पदोन्नति एवं व्यापार ब्लूप्रिंट" : "VEDIC CAREER, PROMOTION & BUSINESS GROWTH BLUEPRINT"}
                    </h1>
                    <div style={{ fontSize: 13, color: "#34D399", fontWeight: 800, marginTop: 4, letterSpacing: 1 }}>
                      ✦ CONFIDENTIAL PARASHARI & D10 DASAMSA HOROSCOPIC DOSSIER ✦
                    </div>
                    <p style={{ color: "rgba(243,211,122,0.9)", fontSize: 13, letterSpacing: 0.8, textTransform: "uppercase", marginTop: 6 }}>
                      {form.name.toUpperCase()} · DOB: {form.dob} · TOB: {form.tob || "12:00 PM"} · POB: {form.pob}
                    </p>
                  </div>

                  {/* Core Astrological Metrics Table */}
                  <div className="page-break-avoid" style={{ background: "rgba(26, 18, 48, 0.8)", border: "1px solid rgba(212, 175, 55, 0.4)", borderRadius: 12, padding: "16px 20px", marginBottom: 22 }}>
                    <h3 style={{ color: "#F3D37A", fontSize: 14.5, fontWeight: 800, marginBottom: 10, borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 6 }}>
                      ✦ CORE VEDIC HOROSCOPIC PARAMETERS
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, textAlign: "center" }}>
                      {[
                        { label: "Ascendant (Lagna)", val: result.lagna },
                        { label: "Moon Sign (Rashi)", val: result.rashi },
                        { label: "10th House (Karma)", val: `${cp.tenthSign} (${cp.tenthLord})` },
                        { label: "Elevation Score", val: `${cp.scores.corporate}%` },
                        { label: "Nakshatra & Pada", val: result.nakshatra },
                      ].map((p, i) => (
                        <div key={i} style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 8, padding: "8px 10px" }}>
                          <div style={{ fontSize: 11, color: "rgba(243,211,122,0.85)", marginBottom: 3, fontWeight: 600 }}>{p.label}</div>
                          <div style={{ fontSize: 13, color: "#FDE68A", fontWeight: 800 }}>{p.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chapter 1: 10th House Karma Sthana & D10 Dasamsa Analysis */}
                  <div className="page-break-avoid" style={{ marginBottom: 22, border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 18, background: "rgba(15,10,32,0.7)" }}>
                    <h3 style={{ color: "#F3D37A", fontSize: 15, fontWeight: 800, marginBottom: 8 }}>
                      🏛️ CHAPTER 1: 10TH HOUSE (KARMA STHANA) & D10 DASAMSA SYNTHESIS
                    </h3>
                    <p style={{ lineHeight: 1.8, fontSize: 13.5, color: "rgba(241,231,208,0.92)", margin: "0 0 10px" }}>
                      {hi
                        ? `दशम भाव कर्म, मान-सम्मान, पदोन्नति एवं सामाजिक प्रतिष्ठा का प्रधान केंद्र है। आपकी कुंडली में दशम भाव ${cp.tenthSign} राशि में स्थित है, जिसके स्वामी ग्रह '${cp.tenthLord}' हैं। यह विन्यास आपके भीतर असाधारण रणनीतिक दृष्टि, संगठनात्मक प्रबंधन तथा जटिल समस्याओं को सुलझाने की स्वाभाविक क्षमता को दर्शाता है।`
                        : `The 10th House (Karma Bhava) represents the pinnacle of executive authority, professional leadership, social status, and livelihood. In your natal chart, the 10th House falls in ${cp.tenthSign}, governed by Lord ${cp.tenthLord}. This stellar alignment bestows exceptional strategic vision, calculated risk tolerance, and sharp problem-solving intellect.`}
                    </p>
                    <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 8, padding: "10px 14px", color: "#FDE68A", fontSize: 13, fontWeight: 700 }}>
                      🌟 {hi ? "प्रधान करियर स्वभाव:" : "Primary Career Archetype:"} {cp.archetypeTitle}
                    </div>
                  </div>

                  {/* Chapter 2: D10 Dasamsa Planetary Positions & Career Influence Table */}
                  <div className="page-break-avoid" style={{ marginBottom: 22 }}>
                    <h3 style={{ color: "#F3D37A", fontSize: 14.5, fontWeight: 800, marginBottom: 10 }}>
                      📊 CHAPTER 2: D10 DASAMSA DIVISIONAL CHART PLANETARY INFLUENCES
                    </h3>
                    <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid rgba(212,175,55,0.3)" }}>
                      <thead>
                        <tr style={{ background: "rgba(245, 158, 11, 0.15)", borderBottom: "1px solid rgba(212,175,55,0.4)" }}>
                          <th style={{ padding: "8px 10px", color: "#FDE68A", fontSize: 12, textAlign: "left" }}>Planet</th>
                          <th style={{ padding: "8px 10px", color: "#FDE68A", fontSize: 12, textAlign: "left" }}>Sign & House</th>
                          <th style={{ padding: "8px 10px", color: "#FDE68A", fontSize: 12, textAlign: "left" }}>D10 Career Dignity</th>
                          <th style={{ padding: "8px 10px", color: "#FDE68A", fontSize: 12, textAlign: "left" }}>Direct Impact on Job, Promotion & CTC</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: "Sun (Surya)", sign: "Leo / Aries", dignity: "Digbala / Exalted", impact: hi ? "वरिष्ठ नेतृत्व, सरकारी मान्यता व निर्णय क्षमता" : "Executive command, government authority & leadership" },
                          { name: "Saturn (Shani)", sign: "Capricorn / Aquarius", dignity: "Swakshetra / Strong", impact: hi ? "दीर्घकालिक स्थिरता, टीम प्रबंधन व निष्ठा" : "Long-term career resilience, deep focus & team loyalty" },
                          { name: "Mercury (Budha)", sign: "Virgo / Gemini", dignity: "Exalted / Uchha", impact: hi ? "रणनीतिक बुद्धिमत्ता, डेटा एनालिटिक्स व संवाद" : "Sharp business acumen, systems logic & high communication" },
                          { name: "Jupiter (Guru)", sign: "Sagittarius / Cancer", dignity: "Mitra / Auspicious", impact: hi ? "वरिष्ठ अधिकारियों का मार्गदर्शन, बोनस व सलाहकार पद" : "Mentorship from C-suite, wealth expansion & advisory status" },
                          { name: "Mars (Mangal)", sign: "Capricorn / Scorpio", dignity: "Uchha / Powerful", impact: hi ? "परियोजना क्रियान्वयन, साहस व प्रतिस्पर्धा में विजय" : "Flawless execution, crisis management & competitive dominance" },
                          { name: "Venus (Shukra)", sign: "Pisces / Taurus", dignity: "Subha / Creative", impact: hi ? "ब्रांड वैल्यू, क्लाइंट नेटवर्किंग व उच्च जीवनशैली" : "Executive presence, stakeholder persuasion & lucrative packages" },
                          { name: "Rahu / Ketu", sign: "Gemini / Virgo", dignity: "Rajayoga Spark", impact: hi ? "विदेशी परियोजनाएं, आधुनिक तकनीक व अप्रत्याशित उछाल" : "Overseas projects, cutting-edge tech disruption & sudden hikes" },
                        ].map((row, idx) => (
                          <tr key={idx} style={{ borderBottom: "1px solid rgba(212,175,55,0.1)", background: idx % 2 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                            <td style={{ padding: "8px 10px", fontWeight: 700, color: "#FDE68A", fontSize: 12.5 }}>{row.name}</td>
                            <td style={{ padding: "8px 10px", fontSize: 12.5 }}>{row.sign}</td>
                            <td style={{ padding: "8px 10px", color: "#34D399", fontWeight: 700, fontSize: 12.5 }}>{row.dignity}</td>
                            <td style={{ padding: "8px 10px", fontSize: 12.5, color: "rgba(241,231,208,0.9)" }}>{row.impact}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="page-break-before" />

                  {/* Chapter 3: 4-Domain Suitability Spectrum */}
                  <div className="page-break-avoid" style={{ marginBottom: 22 }}>
                    <h3 style={{ color: "#F3D37A", fontSize: 14.5, fontWeight: 800, marginBottom: 10 }}>
                      📊 CHAPTER 3: DOMAIN SUITABILITY MATRIX & CAREER PATHWAYS
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                      {[
                        { title: hi ? "🏛️ प्रशासनिक व सरकारी सेवा (Govt/PSU)" : "🏛️ Government & Civil Administration", score: cp.scores.govt, desc: hi ? "UPSC, State PSC, सार्वजनिक उपक्रम एवं नीति निर्माण में उच्च सफलता योग।" : "Strong yogas for civil services, PSU leadership, and public sector governance." },
                        { title: hi ? "💼 कॉर्पोरेट व उच्च-तकनीकी प्रबंधन (Corporate/Tech)" : "💼 Corporate High-Tech Leadership", score: cp.scores.corporate, desc: hi ? "क्लाउड, एआई, ग्लोबल प्रोडक्ट मैनेजमेंट एवं सी-लेवल एक्जीक्यूटिव संवर्ग।" : "High-velocity capability for Fortune 500 tech architecture, strategy & C-suite." },
                        { title: hi ? "🚀 स्वतंत्र उद्यम व स्टार्टअप (Business/Startups)" : "🚀 Scalable Startups & Global Trade", score: cp.scores.business, desc: hi ? "ई-कॉमर्स, विनिर्माण, रियल एस्टेट एवं स्वतंत्र व्यापारिक उद्यम।" : "Favorable planetary support for self-built scalable enterprises and equity." },
                        { title: hi ? "🎨 रिसर्च, मीडिया व कानूनी परामर्श (Creative/Legal)" : "🎨 Creative Media & Strategic Advisory", score: cp.scores.creative, desc: hi ? "डिजिटल मीडिया, बौद्धिक संपदा, डेटा साइंस एवं स्वतंत्र सलाहकार पद।" : "Strong affinity for high-impact media, analytics, research and corporate legal counsel." },
                      ].map((item, i) => (
                        <div key={i} style={{ border: "1px solid rgba(212,175,55,0.25)", borderRadius: 8, padding: "12px 14px", background: "rgba(15,10,32,0.65)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                            <span style={{ color: "#FDE68A", fontSize: 13, fontWeight: 800 }}>{item.title}</span>
                            <span style={{ color: "#34D399", fontSize: 14, fontWeight: 800 }}>{item.score}%</span>
                          </div>
                          <p style={{ fontSize: 12.5, color: "rgba(241,231,208,0.85)", margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chapter 4: Multi-Year Golden Timeline (2026–2030) */}
                  <div className="page-break-avoid" style={{ marginBottom: 22 }}>
                    <h3 style={{ color: "#F3D37A", fontSize: 14.5, fontWeight: 800, marginBottom: 10 }}>
                      📅 CHAPTER 4: MULTI-YEAR PROMOTION, JOB SWITCH & EXPANSION CALENDAR (2026–2030)
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                      <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 10, padding: "14px 16px" }}>
                        <div style={{ color: "#34D399", fontSize: 13, fontWeight: 800, marginBottom: 4 }}>📈 Next Promotion & Appraisal Window</div>
                        <div style={{ color: "#FFF", fontSize: 13.5, fontWeight: 700 }}>{cp.appraisalWindow}</div>
                        <p style={{ fontSize: 12, color: "rgba(241,231,208,0.8)", marginTop: 6, lineHeight: 1.5 }}>
                          {hi ? "गुरु व शनि का शुभ गोचर आपके कार्य मूल्यांकन को नई ऊंचाई प्रदान करेगा।" : "Aligned transit of Jupiter & 10th Lord brings executive elevation."}
                        </p>
                      </div>

                      <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.35)", borderRadius: 10, padding: "14px 16px" }}>
                        <div style={{ color: "#FDE68A", fontSize: 13, fontWeight: 800, marginBottom: 4 }}>🔄 Senior Job Switch & Package Hike</div>
                        <div style={{ color: "#FFF", fontSize: 13.5, fontWeight: 700 }}>{cp.jobChangeWindow}</div>
                        <p style={{ fontSize: 12, color: "rgba(241,231,208,0.8)", marginTop: 6, lineHeight: 1.5 }}>
                          {hi ? "बुध एवं शुक्र का प्रभाव उच्च वेतनमान तथा पदोन्नति का मार्ग प्रशस्त करेगा।" : "Mercury-Venus trigger creates high CTC negotiation leverage."}
                        </p>
                      </div>

                      <div style={{ background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.35)", borderRadius: 10, padding: "14px 16px" }}>
                        <div style={{ color: "#60A5FA", fontSize: 13, fontWeight: 800, marginBottom: 4 }}>🌐 Global Relocation & Business Phase</div>
                        <div style={{ color: "#FFF", fontSize: 13.5, fontWeight: 700 }}>{cp.expansionWindow}</div>
                        <p style={{ fontSize: 12, color: "rgba(241,231,208,0.8)", marginTop: 6, lineHeight: 1.5 }}>
                          {hi ? "नवम व द्वादश भाव सक्रिय होने से विदेश यात्रा तथा वैश्विक उद्यम का योग।" : "9th & 12th house activation supports overseas visa & foreign equity."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Chapter 5: Workplace Obstacles & Neutralization */}
                  <div className="page-break-avoid" style={{ marginBottom: 22, border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "16px 18px", background: "rgba(239,68,68,0.06)" }}>
                    <h3 style={{ color: "#F87171", fontSize: 14.5, fontWeight: 800, marginBottom: 6 }}>
                      ⚠️ CHAPTER 5: WORKPLACE FRICTION, OFFICE POLITICS & OBSTACLE DIAGNOSTICS
                    </h3>
                    <p style={{ lineHeight: 1.75, fontSize: 13, color: "rgba(241,231,208,0.92)", margin: 0 }}>
                      {cp.obstacleAnalysis}
                    </p>
                  </div>

                  <div className="page-break-before" />

                  {/* Chapter 6: Actionable Vedic Career Remedies */}
                  <div className="page-break-avoid" style={{ marginBottom: 22, border: "1px solid rgba(245,158,11,0.4)", borderRadius: 10, padding: "18px 20px", background: "rgba(245,158,11,0.08)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <h3 style={{ color: "#FDE68A", fontSize: 15, fontWeight: 800, margin: 0 }}>
                        🛡️ CHAPTER 6: PRESCRIPTION OF VEDIC CAREER REMEDIES & SACRED PROTOCOLS
                      </h3>
                      <div style={{ color: "#34D399", fontSize: 12.5, fontWeight: 700 }}>☀️ {cp.dailyCareerMantra}</div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
                      {cp.remedies.map((rem, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <span style={{ color: "#FDE68A", fontSize: 15, marginTop: 2 }}>✦</span>
                          <span style={{ color: "rgba(241,231,208,0.92)", fontSize: 13, lineHeight: 1.7 }}>{rem}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chapter 7: 12 Houses Career Influence Table */}
                  <div className="page-break-avoid" style={{ marginBottom: 22 }}>
                    <h3 style={{ color: "#F3D37A", fontSize: 14.5, fontWeight: 800, marginBottom: 10 }}>
                      🏠 CHAPTER 7: 12 HOUSES KARMA & WEALTH ACCELERATION MATRIX
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {Array.from({ length: 12 }, (_, i) => {
                        const n = i + 1;
                        const d = result.houses?.[n] || {};
                        return (
                          <div key={n} style={{ border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8, padding: "10px 12px", background: "rgba(15,10,32,0.6)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                              <span style={{ color: "#FDE68A", fontSize: 12.5, fontWeight: 800 }}>House {n}: {t.hnames[i]}</span>
                              <span style={{ color: "#34D399", fontSize: 12 }}>{d.sign}</span>
                            </div>
                            <p style={{ fontSize: 12, lineHeight: 1.55, color: "rgba(241,231,208,0.85)", margin: 0 }}>{d.interpretation}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sign-off verdict */}
                  <div className="page-break-avoid" style={{ border: "1px solid rgba(245,158,11,0.5)", borderRadius: 10, padding: 18, background: "linear-gradient(135deg, rgba(35,22,65,0.9), rgba(18,12,38,0.95))", textAlign: "center" }}>
                    <h3 style={{ color: "#F3D37A", fontSize: 15, fontWeight: 800, marginBottom: 6 }}>✨ VEDIC ASTROLOGER BLESSING & FINAL VERDICT</h3>
                    <p style={{ fontSize: 13.5, lineHeight: 1.8, color: "#FFF", margin: "0 0 10px" }}>{result.verdict}</p>
                    <div style={{ color: "rgba(243,211,122,0.75)", fontSize: 12, letterSpacing: 1.5, fontWeight: 600 }}>
                      ✦ OM SHANTI SHANTI SHANTI ✦ — JYOTISH KUNDLI CERTIFIED DOSSIER
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════════════════
                  CASE 2: DEDICATED ALL-IN-ONE VEDIC & LAL KITAB REMEDIAL DOSSIER
              ══════════════════════════════════════════════════════════════════════ */}
              {activePrintReport === "remedies" && (
                <div>
                  <div style={{ textAlign: "center", borderBottom: "2px solid #D4AF37", paddingBottom: 16, marginBottom: 24 }}>
                    <div style={{ fontSize: 26, marginBottom: 4 }}>🛡️ 🕉️</div>
                    <h1 style={{ fontFamily: "'Cinzel', serif", color: "#F3D37A", fontSize: 25, fontWeight: 800, letterSpacing: 1.5, margin: 0 }}>
                      {hi ? "सम्पूर्ण वैदिक दोष शांति एवं लाल किताब समस्या निवारण गाइड" : "COMPLETE VEDIC DOSHA SHANTI & LAL KITAB REMEDIAL DOSSIER"}
                    </h1>
                    <div style={{ fontSize: 13, color: "#34D399", fontWeight: 800, marginTop: 4, letterSpacing: 1 }}>
                      ✦ CONFIDENTIAL TANTRA, MANTRA, YANTRA & VASTU SHIELD ✦
                    </div>
                    <p style={{ color: "rgba(243,211,122,0.9)", fontSize: 13, letterSpacing: 0.8, textTransform: "uppercase", marginTop: 6 }}>
                      {form.name.toUpperCase()} · DOB: {form.dob} · TOB: {form.tob || "12:00 PM"} · POB: {form.pob}
                    </p>
                  </div>

                  {/* All 7 Problems Remedial Breakdown */}
                  {LIFE_PROBLEMS_LIST.map((prob, idx) => {
                    const r = getLifeProblemRemedies({ problemId: prob.id, lagnaSign: result.lagnaSign, rashiSign: result.rashiSign, lang });
                    return (
                      <div key={prob.id} className="page-break-avoid" style={{ marginBottom: 20, border: "1px solid rgba(212,175,55,0.3)", borderRadius: 10, padding: "16px 18px", background: "rgba(15,10,32,0.7)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 8, marginBottom: 10 }}>
                          <h4 style={{ color: "#F3D37A", fontSize: 14.5, fontWeight: 800, margin: 0 }}>
                            {r.icon} SECTION {idx + 1}: {r.problemTitle}
                          </h4>
                          <span style={{ color: "#34D399", fontSize: 12, fontWeight: 700 }}>⏱️ {r.mantraCount}</span>
                        </div>

                        <div style={{ fontSize: 12.5, color: "rgba(241,231,208,0.9)", lineHeight: 1.65, marginBottom: 10 }}>
                          <b>🔍 Root Cause:</b> {r.rootCause}
                        </div>

                        <div style={{ background: "rgba(0,0,0,0.5)", border: "1px dashed rgba(245,158,11,0.35)", borderRadius: 8, padding: "8px 12px", color: "#FDE68A", fontSize: 13.5, fontWeight: 800, textAlign: "center", marginBottom: 10 }}>
                          🕉️ {r.mantra}
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8, fontSize: 12 }}>
                          <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 6, padding: "6px 8px" }}>
                            <b style={{ color: "#34D399" }}>🌿 Daily Upay:</b> {r.dailyUpay[0]}
                          </div>
                          <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 6, padding: "6px 8px" }}>
                            <b style={{ color: "#FDE68A" }}>🤲 Charity:</b> {r.charity}
                          </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
                          <div style={{ background: "rgba(11,8,25,0.6)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 6, padding: "6px 8px" }}>
                            <b style={{ color: "#FDE68A" }}>💎 Gem & Rudraksha:</b> {r.gemRudraksha}
                          </div>
                          <div style={{ background: "rgba(11,8,25,0.6)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 6, padding: "6px 8px" }}>
                            <b style={{ color: "#FDE68A" }}>🏡 Vastu Tip:</b> {r.vastuTip}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* 21-Day Sankalp Ritual Page */}
                  <div className="page-break-avoid" style={{ border: "1px solid rgba(245,158,11,0.5)", borderRadius: 10, padding: 18, background: "linear-gradient(135deg, rgba(35,22,65,0.9), rgba(18,12,38,0.95))", textAlign: "center", marginTop: 20 }}>
                    <h3 style={{ color: "#F3D37A", fontSize: 15, fontWeight: 800, marginBottom: 8 }}>✨ २१-दिवसीय दैनिक संकल्प एवं अनुष्ठान नियम</h3>
                    <p style={{ fontSize: 13, lineHeight: 1.75, color: "rgba(241,231,208,0.9)", margin: "0 0 10px" }}>
                      {hi
                        ? "उपरोक्त किसी भी एक मुख्य समस्या के मंत्र एवं उपाय को लगातार २१ दिनों तक ब्रह्म मुहूर्त में शुद्ध भाव से करने पर नकारात्मक ऊर्जा समाप्त होकर ईश्वरीय कृपा प्राप्त होती है।"
                        : "Consistently practicing the prescribed beej mantra, charity, and daily upay for 21 days creates a powerful protective aura and clears long-standing karmic obstructions."}
                    </p>
                    <div style={{ color: "rgba(243,211,122,0.75)", fontSize: 12, letterSpacing: 1.5, fontWeight: 600 }}>
                      ✦ SARVA MANOKAMNA SIDDHI ✦ — JYOTISH KUNDLI VEDIC DOSSIER
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════════════════
                  CASE 3: DEDICATED VEDIC VIVAH & SPOUSE PREDICTION REPORT
              ══════════════════════════════════════════════════════════════════════ */}
              {activePrintReport === "marriage" && (
                <div>
                  <div style={{ textAlign: "center", borderBottom: "2px solid #D4AF37", paddingBottom: 16, marginBottom: 24 }}>
                    <div style={{ fontSize: 26, marginBottom: 4 }}>💍 💖</div>
                    <h1 style={{ fontFamily: "'Cinzel', serif", color: "#F3D37A", fontSize: 25, fontWeight: 800, letterSpacing: 1.5, margin: 0 }}>
                      {hi ? "वैदिक विवाह समय, आयु एवं जीवनसाथी सम्पूर्ण विश्लेषण" : "PARASHARI VEDIC VIVAH & SPOUSE PREDICTION REPORT"}
                    </h1>
                    <div style={{ fontSize: 13, color: "#34D399", fontWeight: 800, marginTop: 4, letterSpacing: 1 }}>
                      ✦ 7TH HOUSE, NAVAMSHA (D9) & MATRIMONIAL MUHURAT DOSSIER ✦
                    </div>
                    <p style={{ color: "rgba(243,211,122,0.9)", fontSize: 13, letterSpacing: 0.8, textTransform: "uppercase", marginTop: 6 }}>
                      {form.name.toUpperCase()} · DOB: {form.dob} · TOB: {form.tob || "12:00 PM"} · POB: {form.pob}
                    </p>
                  </div>

                  <div className="page-break-avoid" style={{ background: "rgba(26, 18, 48, 0.8)", border: "1px solid rgba(212, 175, 55, 0.4)", borderRadius: 12, padding: "16px 20px", marginBottom: 22 }}>
                    <h3 style={{ color: "#F3D37A", fontSize: 14.5, fontWeight: 800, marginBottom: 10, borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 6 }}>
                      ✦ VIVAH TIMING & MARITAL ASTROLOGICAL PARAMETERS
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, textAlign: "center" }}>
                      {[
                        { label: "Vivah Score", val: `${mp.probabilityScore}%` },
                        { label: "Probable Age", val: mp.ageRange },
                        { label: "7th House Sign", val: mp.seventhSign },
                        { label: "7th Lord", val: mp.seventhLord },
                      ].map((p, i) => (
                        <div key={i} style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 8, padding: "8px 10px" }}>
                          <div style={{ fontSize: 11, color: "rgba(243,211,122,0.85)", marginBottom: 3, fontWeight: 600 }}>{p.label}</div>
                          <div style={{ fontSize: 14, color: "#FDE68A", fontWeight: 800 }}>{p.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="page-break-avoid" style={{ marginBottom: 20, border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 18, background: "rgba(15,10,32,0.7)" }}>
                    <h4 style={{ color: "#F3D37A", fontSize: 14.5, fontWeight: 800, marginBottom: 6 }}>📅 Auspicious Timing Windows & Peak Months</h4>
                    <p style={{ fontSize: 13, lineHeight: 1.75, color: "rgba(241,231,208,0.92)", margin: "0 0 8px" }}>
                      <b>Primary Window:</b> {mp.primaryWindow} | <b>Secondary Window:</b> {mp.secondaryWindow}
                    </p>
                    <p style={{ fontSize: 13, lineHeight: 1.75, color: "#34D399", margin: 0 }}>
                      <b>Peak Favorable Months:</b> {mp.peakMonths}
                    </p>
                  </div>

                  <div className="page-break-avoid" style={{ marginBottom: 20, border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 18, background: "rgba(15,10,32,0.7)" }}>
                    <h4 style={{ color: "#F3D37A", fontSize: 14.5, fontWeight: 800, marginBottom: 6 }}>👰/🤵 Spouse Physical Traits, Profession & Direction</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 13 }}>
                      <div><b>Nature & Demeanor:</b> {mp.spousePersonality}</div>
                      <div><b>Profession / Field:</b> {mp.spouseProfession}</div>
                      <div><b>Birth Direction:</b> {mp.spouseDirection}</div>
                      <div><b>Name Initial Letter:</b> {mp.spouseNameLetters || mp.spouseNameInitial}</div>
                    </div>
                  </div>

                  {/* Chapter: Love vs. Arranged Marriage Horoscopic Analysis */}
                  {lva && lva.type && (
                    <div className="page-break-avoid" style={{ marginBottom: 20, border: "1px solid rgba(244,114,182,0.35)", borderRadius: 10, padding: 18, background: "rgba(25,12,38,0.8)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, borderBottom: "1px solid rgba(244,114,182,0.2)", paddingBottom: 6 }}>
                        <h4 style={{ color: "#FBCFE8", fontSize: 14.5, fontWeight: 800, margin: 0 }}>
                          💘 CHAPTER: LOVE VS. ARRANGED MARRIAGE HOROSCOPIC PREDICTION
                        </h4>
                        <span style={{ color: "#FDE68A", fontSize: 12.5, fontWeight: 800 }}>
                          {lva.type} ({lva.lovePercentage}% Love / {lva.arrangePercentage}% Arranged)
                        </span>
                      </div>
                      <p style={{ fontSize: 13, lineHeight: 1.75, color: "rgba(241,231,208,0.95)", margin: "0 0 10px" }}>
                        {lva.verdict}
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 12.5, marginBottom: 10 }}>
                        <div style={{ background: "rgba(11,8,25,0.6)", padding: 10, borderRadius: 6, border: "1px solid rgba(212,175,55,0.2)" }}>
                          <b style={{ color: "#FDE68A" }}>Destined Meeting Circumstance:</b>
                          <div style={{ color: "rgba(241,231,208,0.85)", marginTop: 3 }}>{lva.meetingCircumstance}</div>
                        </div>
                        <div style={{ background: "rgba(11,8,25,0.6)", padding: 10, borderRadius: 6, border: "1px solid rgba(212,175,55,0.2)" }}>
                          <b style={{ color: "#34D399" }}>Family & Parental Dynamics:</b>
                          <div style={{ color: "rgba(241,231,208,0.85)", marginTop: 3 }}>{lva.familyAcceptance}</div>
                        </div>
                      </div>
                      {lva.yogasDetected && lva.yogasDetected.length > 0 && (
                        <div style={{ fontSize: 12, color: "rgba(241,231,208,0.85)", borderTop: "1px solid rgba(212,175,55,0.15)", paddingTop: 8 }}>
                          <b style={{ color: "#FDE68A" }}>Identified Planetary Yogas:</b>
                          <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>
                            {lva.yogasDetected.map((y, yi) => (
                              <li key={yi} style={{ marginBottom: 3 }}>{y}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="page-break-avoid" style={{ marginBottom: 20, border: "1px solid rgba(245,158,11,0.35)", borderRadius: 10, padding: 18, background: "rgba(245,158,11,0.08)" }}>
                    <h4 style={{ color: "#FDE68A", fontSize: 14.5, fontWeight: 800, marginBottom: 6 }}>🛡️ Prescribed Vivah Delay & Kalyana Remedies</h4>
                    <div style={{ fontSize: 13, lineHeight: 1.75, color: "rgba(241,231,208,0.92)", whiteSpace: "pre-wrap" }}>
                      {mp.remedies}
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════════════════
                  CASE 5: 2026–2027 ANNUAL TRANSIT & PLANETARY FORECAST DOSSIER
              ══════════════════════════════════════════════════════════════════════ */}
              {activePrintReport === "annual" && (
                <div>
                  <div style={{ textAlign: "center", borderBottom: "2px solid #D4AF37", paddingBottom: 16, marginBottom: 24 }}>
                    <div style={{ fontSize: 26, marginBottom: 4 }}>📅 🪐 🌟</div>
                    <h1 style={{ fontFamily: "'Cinzel', serif", color: "#F3D37A", fontSize: 25, fontWeight: 800, letterSpacing: 1.5, margin: 0 }}>
                      {hi ? "वर्ष 2026–2027 वार्षिक गोचर एवं संपूर्ण भविष्यवाणी रिपोर्ट" : "2026–2027 VEDIC ANNUAL TRANSIT & PLANETARY FORECAST"}
                    </h1>
                    <div style={{ fontSize: 13, color: "#34D399", fontWeight: 800, marginTop: 4, letterSpacing: 1 }}>
                      ✦ CONFIDENTIAL TRANSIT, GOCHARA & MILESTONE DOSSIER ✦
                    </div>
                    <p style={{ color: "rgba(243,211,122,0.9)", fontSize: 13, letterSpacing: 0.8, textTransform: "uppercase", marginTop: 6 }}>
                      {form.name.toUpperCase()} · DOB: {form.dob} · TOB: {form.tob || "12:00 PM"} · POB: {form.pob} · MOON: {result.rashi}
                    </p>
                  </div>

                  <div className="page-break-avoid" style={{ background: "rgba(26, 18, 48, 0.8)", border: "1px solid rgba(212, 175, 55, 0.4)", borderRadius: 12, padding: "16px 20px", marginBottom: 22 }}>
                    <h3 style={{ color: "#F3D37A", fontSize: 14.5, fontWeight: 800, marginBottom: 10, borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 6 }}>
                      ✦ CORE ASTROLOGICAL PARAMETERS & SADE SATI DIAGNOSTIC
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, textAlign: "center", marginBottom: 12 }}>
                      {[
                        { label: "Moon Sign (Rashi)", val: result.rashi },
                        { label: "Natal Nakshatra", val: result.nakshatra },
                        { label: "Ascendant (Lagna)", val: result.lagna },
                        { label: "Forecast Period", val: result.annualTransit?.year || "2026–2027" },
                      ].map((p, i) => (
                        <div key={i} style={{ background: "rgba(11,8,25,0.7)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 8, padding: "8px 10px" }}>
                          <div style={{ fontSize: 11, color: "rgba(243,211,122,0.85)", marginBottom: 3, fontWeight: 600 }}>{p.label}</div>
                          <div style={{ fontSize: 13.5, color: "#FDE68A", fontWeight: 800 }}>{p.val}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.35)", borderRadius: 8, padding: "10px 14px", color: "#FDE68A", fontSize: 13, fontWeight: 700, textAlign: "center" }}>
                      ⚖️ {result.annualTransit?.sadeSatiStatus}
                    </div>
                  </div>

                  <div className="page-break-avoid" style={{ marginBottom: 22 }}>
                    <h4 style={{ color: "#F3D37A", fontSize: 15, fontWeight: 800, marginBottom: 12 }}>
                      🪐 Major Planetary Ingresses & Gochara Influences (2026–2027)
                    </h4>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
                      {(result.annualTransit?.transits || []).map((tr, i) => (
                        <div key={i} style={{ background: "rgba(15,10,32,0.75)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 14 }}>
                          <div style={{ color: "#FDE68A", fontSize: 14, fontWeight: 800, marginBottom: 6 }}>{tr.planet} in {tr.sign}</div>
                          <div style={{ color: "rgba(241,231,208,0.88)", fontSize: 12.5, lineHeight: 1.6 }}>{tr.effect}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="page-break-avoid" style={{ marginBottom: 22 }}>
                    <h4 style={{ color: "#F3D37A", fontSize: 15, fontWeight: 800, marginBottom: 12 }}>
                      ⚡ 2026–2027 Quarterly Life Milestones & Growth Trajectory
                    </h4>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
                      {(result.annualTransit?.quarters || []).map((q, i) => (
                        <div key={i} style={{ background: "rgba(11,8,25,0.8)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 14 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <span style={{ color: "#FDE68A", fontSize: 13.5, fontWeight: 800 }}>{q.quarter}</span>
                            <span style={{ color: "#34D399", fontSize: 12.5, fontWeight: 800 }}>{q.rating}</span>
                          </div>
                          <div style={{ color: "#F3D37A", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{q.theme}</div>
                          <div style={{ color: "rgba(241,231,208,0.85)", fontSize: 12, lineHeight: 1.55 }}>{q.impact}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="page-break-avoid" style={{ marginBottom: 20, border: "1px solid rgba(245,158,11,0.35)", borderRadius: 10, padding: 16, background: "rgba(245,158,11,0.08)" }}>
                    <h4 style={{ color: "#FDE68A", fontSize: 14, fontWeight: 800, marginBottom: 6 }}>🛡️ Prescribed Annual Remedies & Planetary Harmonization</h4>
                    <div style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(241,231,208,0.92)", whiteSpace: "pre-wrap" }}>
                      {result.remedies || result.overview}
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════════════════
                  CASE 6: ASHTAKOOT 36 GUNA MILAN & COMPATIBILITY DOSSIER
              ══════════════════════════════════════════════════════════════════════ */}
              {activePrintReport === "matchmaking" && (
                <div>
                  <div style={{ textAlign: "center", borderBottom: "2px solid #D4AF37", paddingBottom: 16, marginBottom: 24 }}>
                    <div style={{ fontSize: 26, marginBottom: 4 }}>❤️ 🕊️</div>
                    <h1 style={{ fontFamily: "'Cinzel', serif", color: "#F3D37A", fontSize: 25, fontWeight: 800, letterSpacing: 1.5, margin: 0 }}>
                      {hi ? "वैदिक अष्टकूट ३६ गुण मिलान एवं दांपत्य अनुकूलता रिपोर्ट" : "VEDIC ASHTAKOOT 36 GUNA MILAN & MATRIMONIAL COMPATIBILITY"}
                    </h1>
                    <div style={{ fontSize: 13, color: "#34D399", fontWeight: 800, marginTop: 4, letterSpacing: 1 }}>
                      ✦ CONFIDENTIAL KUNDLI MATCHMAKING & VIVAH HARMONY DOSSIER ✦
                    </div>
                  </div>
                  {milanResult ? (
                    <div>
                      <div className="page-break-avoid" style={{ background: "rgba(26, 18, 48, 0.8)", border: "1px solid rgba(212, 175, 55, 0.4)", borderRadius: 12, padding: "16px 20px", marginBottom: 22, textAlign: "center" }}>
                        <div style={{ fontSize: 14, color: "rgba(241,231,208,0.85)", marginBottom: 6 }}>
                          {milanResult.p1.name} ({milanResult.p1.sign}) × {milanResult.p2.name} ({milanResult.p2.sign})
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: Number(milanResult.totalGunas) >= 18 ? "#34D399" : "#F87171" }}>
                          {milanResult.totalGunas} / {milanResult.maxGunas} ({milanResult.percentage}%)
                        </div>
                        <h3 style={{ color: "#F3D37A", fontSize: 16, fontWeight: 800, marginTop: 4 }}>
                          {hi ? milanResult.verdictHi : milanResult.verdict}
                        </h3>
                      </div>

                      <div className="page-break-avoid" style={{ marginBottom: 20 }}>
                        <h4 style={{ color: "#F3D37A", fontSize: 15, fontWeight: 800, marginBottom: 12 }}>
                          ✦ Ashtakoot 8-Fold Vedic Compatibility Breakdown
                        </h4>
                        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid rgba(212,175,55,0.3)" }}>
                          <thead>
                            <tr style={{ background: "rgba(245, 158, 11, 0.15)", borderBottom: "1px solid rgba(212,175,55,0.4)" }}>
                              <th style={{ padding: "8px 12px", color: "#FDE68A", fontSize: 12.5, textAlign: "left" }}>Koota</th>
                              <th style={{ padding: "8px 12px", color: "#FDE68A", fontSize: 12.5, textAlign: "center" }}>Obtained / Max</th>
                              <th style={{ padding: "8px 12px", color: "#FDE68A", fontSize: 12.5, textAlign: "left" }}>Significance & Analysis</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(milanResult.breakdown || []).map((b, bi) => (
                              <tr key={bi} style={{ borderBottom: "1px solid rgba(212,175,55,0.1)", background: bi % 2 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                                <td style={{ padding: "8px 12px", fontWeight: 700, color: "#FDE68A", fontSize: 13 }}>{b.name}</td>
                                <td style={{ padding: "8px 12px", fontWeight: 700, color: Number(b.obtained) > 0 ? "#34D399" : "#F87171", textAlign: "center", fontSize: 13 }}>
                                  {b.obtained} / {b.max}
                                </td>
                                <td style={{ padding: "8px 12px", fontSize: 12.5, color: "rgba(241,231,208,0.85)" }}>{b.desc}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: 20, color: "rgba(241,231,208,0.8)" }}>
                      Please calculate Gun Milan from the Kundli Milan tab to print this report.
                    </div>
                  )}
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════════════════
                  CASE 4: COMPLETE DELUXE NATAL KUNDLI & LIFE REPORT (Default All)
              ══════════════════════════════════════════════════════════════════════ */}
              {/* ══════════════════════════════════════════════════════════════════════
                  CASE 4: COMPLETE DELUXE NATAL KUNDLI & LIFE REPORT (45-PAGE DOSSIER)
              ══════════════════════════════════════════════════════════════════════ */}
              {activePrintReport === "all" && (
                <DeluxeLifeReportDossier
                  result={result}
                  form={form}
                  lang={lang}
                  NorthIndianChart={NorthIndianChart}
                  SouthIndianChart={SouthIndianChart}
                  careerPrediction={cp}
                  marriagePrediction={mp}
                />
              )}

            </div>
          );
        })()}

        {/* Dedicated Emotional Dakshina Card at Bottom of Page */}
        {renderDakshinaCard(false)}

        {/* Vedic Knowledge & FAQ Accordion for Screen Results */}
        {result && renderFaqSection()}

        {/* ── INSTITUTIONAL MULTI-COLUMN LUXURY FOOTER ── */}
        <footer
          className="no-print"
          style={{
            marginTop: 56,
            background: "linear-gradient(180deg, rgba(18, 11, 38, 0.85) 0%, rgba(10, 6, 22, 0.98) 100%)",
            border: "1px solid rgba(212, 175, 55, 0.25)",
            borderRadius: 20,
            padding: "40px 32px 28px",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.5)",
            color: "rgba(241, 231, 208, 0.85)"
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32, marginBottom: 36, textAlign: "left" }}>
            
            {/* Column 1: Brand & Sacred Heritage */}
            <div>
              <div
                onClick={handleSecretTrigger}
                style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none", marginBottom: 14 }}
                title="Click 3 times for Admin VIP Portal"
              >
                <img
                  src="/logo.png"
                  alt="Jyotish Paramarsh Logo"
                  style={{ width: 44, height: 44, borderRadius: "50%", border: "2px solid rgba(245,158,11,0.7)", boxShadow: "0 0 14px rgba(245,158,11,0.3)" }}
                />
                <div>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: 16, fontWeight: 800, color: "#F3D37A", letterSpacing: 1.5 }}>
                    JYOTISH PARAMARSH
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(243, 211, 122, 0.85)", letterSpacing: 0.5, fontWeight: 600 }}>
                    {hi ? "प्रामाणिक वैदिक ज्योतिष संस्थान" : "AUTHENTIC PARASHARI VEDIC PLATFORM"}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 12.5, lineHeight: 1.7, color: "rgba(241, 231, 208, 0.75)", margin: "0 0 14px" }}>
                {hi
                  ? "महर्षि पराशर विरचित बृहत्पाराशर होराशास्त्र के सिद्धांती सूत्रों एवं आधुनिक खगोलीय सूक्ष्म अयनांश पर आधारित संपूर्ण जीवन मार्गदर्शन।"
                  : "Dedicated to the pure computational heritage of Maharishi Parashara, delivering arc-second astronomical accuracy and life clarity for every seeker."}
              </p>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#F59E0B", letterSpacing: 1 }}>
                ✦ {t.footer1} ✦
              </div>
            </div>

            {/* Column 2: Vedic Engines & Calculators */}
            <div>
              <h4 style={{ color: "#FDE68A", fontSize: 14, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 14, borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 6 }}>
                {hi ? "वैदिक गणना उपकरण" : "Calculators & Ephemeris"}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 9, fontSize: 12.5 }}>
                <li>
                  <button
                    onClick={() => { setMainSection("kundli"); if (result) setTab("chart"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    style={{ background: "none", border: "none", color: "rgba(241,231,208,0.85)", cursor: "pointer", padding: 0, fontSize: "inherit", textAlign: "left" }}
                  >
                    ✦ {hi ? "लग्न एवं १६ षोडशवर्ग कुंडलियां" : "Lagna & 16 Shodashvargas"}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setMainSection("panchang"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    style={{ background: "none", border: "none", color: "rgba(241,231,208,0.85)", cursor: "pointer", padding: 0, fontSize: "inherit", textAlign: "left" }}
                  >
                    ✦ {hi ? "दैनिक वैदिक पंचांग एवं चौघड़िया" : "Daily Sidereal Panchang"}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setMainSection("muhurat"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    style={{ background: "none", border: "none", color: "rgba(241,231,208,0.85)", cursor: "pointer", padding: 0, fontSize: "inherit", textAlign: "left" }}
                  >
                    ✦ {hi ? "सर्व शुभ मुहूर्त डायरेक्टरी (2026–2027)" : "Shubh Muhurat Timings"}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setMainSection("festivals"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    style={{ background: "none", border: "none", color: "rgba(241,231,208,0.85)", cursor: "pointer", padding: 0, fontSize: "inherit", textAlign: "left" }}
                  >
                    ✦ {hi ? "सनातन धर्म के पावन पर्व एवं व्रत" : "Hindu Festivals & Vrats"}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setMainSection("daily"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    style={{ background: "none", border: "none", color: "rgba(241,231,208,0.85)", cursor: "pointer", padding: 0, fontSize: "inherit", textAlign: "left" }}
                  >
                    ✦ {hi ? "दैनिक राशिफल (१२ राशियां)" : "Daily Zodiac Horoscope"}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setMainSection("kundli"); setTab("matchmaking"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    style={{ background: "none", border: "none", color: "rgba(241,231,208,0.85)", cursor: "pointer", padding: 0, fontSize: "inherit", textAlign: "left" }}
                  >
                    ✦ {hi ? "वैदिक कुंडली मिलान (३६ गुण)" : "Ashtakoot Gun Milan (36 Pts)"}
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Dossiers & Astrologer Guidance */}
            <div>
              <h4 style={{ color: "#FDE68A", fontSize: 14, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 14, borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 6 }}>
                {hi ? "दस्तावेज़ एवं परामर्श" : "Dossiers & Guidance"}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 9, fontSize: 12.5 }}>
                <li>
                  <span style={{ color: "#34D399", fontWeight: 700 }}>✓</span>{" "}
                  <span style={{ color: "#FDE68A", fontWeight: 700 }}>
                    {hi ? "50-पेज महा-कुंडली रिपोर्ट (100% FREE)" : "50-Page Deluxe Dossier (FREE)"}
                  </span>
                </li>
                <li>
                  <button
                    onClick={() => { setMainSection("kundli"); setTab("consult"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    style={{ background: "none", border: "none", color: "rgba(241,231,208,0.85)", cursor: "pointer", padding: 0, fontSize: "inherit", textAlign: "left" }}
                  >
                    ✦ {hi ? "१-ऑन-१ ज्योतिषी परामर्श प्रतीक्षा सूची" : "1-on-1 Astrologer Priority Desk"}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setMainSection("kundli"); setTab("store"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    style={{ background: "none", border: "none", color: "rgba(241,231,208,0.85)", cursor: "pointer", padding: 0, fontSize: "inherit", textAlign: "left" }}
                  >
                    ✦ {hi ? "निर्धारित रत्न एवं रुद्राक्ष स्टोर" : "Certified Gemstones & Remedies"}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setMainSection("kundli"); setTab("predictions"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    style={{ background: "none", border: "none", color: "rgba(241,231,208,0.85)", cursor: "pointer", padding: 0, fontSize: "inherit", textAlign: "left" }}
                  >
                    ✦ {hi ? "विंशोत्तरी महादशा एवं साढ़ेसाती" : "Vimshottari Dasha & Sade Sati"}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveCheckout({
                      title: hi ? "श्रद्धा दक्षिणा (Seva Bhent)" : "Offer Dakshina (Sacred Offering)",
                      priceKey: "dakshina",
                      price: PRODUCT_PRICES.dakshina[currency],
                      desc: hi ? "वैदिक ज्योतिष अनुसंधान एवं निःशुल्क सर्वर सेवा हेतु स्वैच्छिक दक्षिणा" : "Voluntary offering to maintain free Vedic compute servers and support seekers worldwide",
                      icon: "🪷",
                      isDakshina: true
                    })}
                    style={{ background: "none", border: "none", color: "#F59E0B", cursor: "pointer", padding: 0, fontSize: "inherit", textAlign: "left", fontWeight: 700 }}
                  >
                    🪷 {hi ? "श्रद्धा दक्षिणा अर्पित करें (Seva)" : "Offer Shraddha Dakshina"}
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Trust, Security & Help Desk */}
            <div>
              <h4 style={{ color: "#FDE68A", fontSize: 14, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 14, borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 6 }}>
                {hi ? "सुरक्षा एवं संपर्क" : "Trust & Support"}
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#34D399" }}>
                  <span>🔒</span>
                  <span>{hi ? "२५६-बिट बैंक-ग्रेड एन्क्रिप्शन" : "256-Bit Bank Grade SSL Encrypted"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#34D399" }}>
                  <span>🛡️</span>
                  <span>{hi ? "१००% पूर्ण गोपनीयता गारंटी" : "100% Client-Side Privacy Guaranteed"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#FDE68A" }}>
                  <span>🏛️</span>
                  <span>{hi ? "सूर्य सिद्धांत एवं पाराशरी प्रमाणित" : "Surya Siddhanta Astronomical Precision"}</span>
                </div>
                
                <div style={{ borderTop: "1px solid rgba(212,175,55,0.15)", paddingTop: 10, marginTop: 4 }}>
                  <div style={{ color: "#FDE68A", fontWeight: 700, marginBottom: 4 }}>
                    {hi ? "आधिकारिक सहायता एवं परामर्श डेस्क:" : "Official Astrologer Help Desk:"}
                  </div>
                  <a
                    href="mailto:teamjyotishparamarsh@gmail.com"
                    style={{ color: "#F59E0B", textDecoration: "underline", fontWeight: 700, fontSize: 12.5 }}
                  >
                    teamjyotishparamarsh@gmail.com
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Copyright & Sacred Astrological Disclaimer */}
          <div style={{ borderTop: "1px solid rgba(212,175,55,0.2)", paddingTop: 20, textAlign: "center", fontSize: 11.5, color: "rgba(241, 231, 208, 0.65)", lineHeight: 1.6 }}>
            <div style={{ color: "rgba(243, 211, 122, 0.85)", fontWeight: 600, marginBottom: 6 }}>
              {t.footer2}
            </div>
            <div>
              {hi
                ? "वैदिक ज्योतिष एक प्राचीन आध्यात्मिक एवं खगोलीय विद्या है। गणनाएं शास्त्रीय सूत्रों पर आधारित हैं एवं इनका उद्देश्य आत्म-जागरूकता व शुभ मार्गदर्शन प्रदान करना है। © 2026 Jyotish Paramarsh. All Rights Reserved."
                : "Vedic astrology is an ancient metaphysical science. All algorithmic calculations are provided for spiritual enrichment and life guidance. © 2026 Jyotish Paramarsh. All Rights Reserved."}
            </div>
          </div>
        </footer>

        {/* Floating Admin Switcher Widget (When in Admin Mode) */}
        {isAdmin && (
          <aside
            aria-label="Admin Mode Controls"
            className="no-print"
            style={{
              position: "fixed",
              bottom: 18,
              right: 18,
              zIndex: 90,
              background: "linear-gradient(135deg, rgba(35,22,65,0.95), rgba(18,12,38,0.98))",
              border: "1.5px solid #F59E0B",
              borderRadius: 30,
              padding: "8px 16px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.7), 0 0 12px rgba(245,158,11,0.35)",
              display: "flex",
              alignItems: "center",
              gap: 10
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 800, color: "#FDE68A", display: "flex", alignItems: "center", gap: 6 }}>
              <span>👑</span> VIP Admin Mode
            </div>
            <button
              onClick={handleToggleAdminMode}
              style={{
                background: "rgba(245,158,11,0.2)",
                border: "1px solid rgba(245,158,11,0.5)",
                color: "#F3D37A",
                borderRadius: 20,
                padding: "4px 10px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer"
              }}
              title="Click to test regular user paywalls"
            >
              Test User View
            </button>
          </aside>
        )}

      </main>
    </div>
  );
}

// ── REUSABLE MODERN ACCORDION GLASS CARD ────────────────────────────
const SectionCard = ({ icon, title, content, highlight = false, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className="glass-card"
      style={{
        padding: "20px 24px",
        marginBottom: 18,
        border: highlight ? "1px solid rgba(245, 158, 11, 0.5)" : "1px solid rgba(212, 175, 55, 0.22)",
        background: highlight ? "linear-gradient(135deg, rgba(38, 24, 70, 0.85) 0%, rgba(18, 12, 38, 0.95) 100%)" : undefined,
        boxShadow: highlight ? "0 10px 30px rgba(245, 158, 11, 0.15)" : undefined,
        transition: "all 0.2s ease"
      }}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none"
        }}
      >
        <h3 style={{ color: "#F3D37A", fontSize: 16, fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>{icon}</span>
          <span>{title}</span>
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11.5, color: "rgba(243, 211, 122, 0.7)", fontWeight: 600, background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "2px 8px" }}>
            {isOpen ? "Collapse" : "Expand"}
          </span>
          <span
            style={{
              color: "#F59E0B",
              fontSize: 13,
              fontWeight: "bold",
              display: "inline-block",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease"
            }}
          >
            ▼
          </span>
        </div>
      </div>
      {isOpen && (
        <div
          style={{
            marginTop: 14,
            paddingTop: 14,
            borderTop: "1px solid rgba(212, 175, 55, 0.15)",
            color: "rgba(241, 231, 208, 0.94)",
            fontSize: 15,
            lineHeight: 1.9,
            whiteSpace: "pre-wrap",
            animation: "fadeInCard 0.25s ease"
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};
