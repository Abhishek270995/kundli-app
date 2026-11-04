import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOOLS = [
  {
    id: "vimshottari",
    slug: "vimshottari-dasha",
    icon: "⏳",
    titleEn: "Vimshottari Dasha Calculator — Mahadasha & Antardasha Predictions",
    titleHi: "विंशोत्तरी महादशा एवं अंतर्दशा कैलकुलेटर | 120-Year Vedic Dasha",
    descEn: "Calculate your 120-year Vimshottari Mahadasha, Antardasha, and Pratyantardasha periods with start-end dates, planetary lords, and traditional Vedic timing predictions.",
    descHi: "अपने जन्म नक्षत्र के आधार पर संपूर्ण १२० वर्षीय विंशोत्तरी महादशा, अंतर्दशा एवं प्रत्यंतर्दशा की सटीक समय-सीमा, ग्रह स्वामी व शास्त्रीय फलकथन जानें।",
    keywords: "Vimshottari Dasha Calculator, Mahadasha Antardasha Calculator, Vedic Dasha Calculator, Kundli Dasha, Dasha Bhukti, Astrology Timing"
  },
  {
    id: "divisional",
    slug: "divisional-charts",
    icon: "📊",
    titleEn: "Divisional Chart Generator (Shodashvarga D9, D10, D7, D12, D60)",
    titleHi: "षोडशवर्ग कुंडली चक्र (D9 नवमांश, D10 दशमांश) | 16 Varga Charts",
    descEn: "Generate authentic D9 Navamsha (marriage & spiritual dharma), D10 Dashamsha (career & fame), D7 Saptamsha, D12, D30, and D60 Shashtiamsha with North Indian visual charts.",
    descHi: "D9 नवमांश (विवाह व धर्म), D10 दशमांश (करियर व यश), D7, D12, D30 एवं D60 षष्ट्यंश वर्ग कुंडलियों का उत्तर भारतीय शैली में प्रामाणिक चक्र एवं विश्लेषण।",
    keywords: "Divisional Charts Astrology, Shodashvarga Calculator, D9 Navamsha Chart, D10 Dashamsha Chart, D7 Saptamsha, Vedic Varga Charts"
  },
  {
    id: "ashtakavarga",
    slug: "ashtakavarga-calculator",
    icon: "⚖️",
    titleEn: "Ashtakavarga & SAV 337 Bindu Calculator — Planetary Strength Matrix",
    titleHi: "सर्वाष्टकवर्ग (SAV) एवं भिन्नाष्टकवर्ग कैलकुलेटर | 337 Bindus",
    descEn: "Compute Sarvashtakavarga (SAV) 337 bindus and 7-planet Bhinnashtakavarga (BAV). Identify auspicious houses with over 28 points for transits and life milestones.",
    descHi: "१२ राशियों में ३३७ बिंदुओं का सर्वाष्टकवर्ग एवं ७ ग्रहों का भिन्नाष्टकवर्ग वितरण। गोचर व कार्य सिद्धि हेतु २८+ शुभ बिंदु वाले भावों की पहचान।",
    keywords: "Ashtakavarga Calculator, Sarvashtakavarga SAV, Bhinnashtakavarga BAV, Ashtakavarga Bindu, 337 Bindu Astrology, Transit Strength"
  },
  {
    id: "gochar",
    slug: "gochar-transit-calculator",
    icon: "🪐",
    titleEn: "Gochar & Planetary Transit Impact Calculator — Sade Sati & Transits",
    titleHi: "दैनिक गोचर एवं साढ़ेसाती प्रभाव कैलकुलेटर | Live Planetary Transits",
    descEn: "Track real-time planetary transits (Saturn, Jupiter, Rahu, Ketu, Mars) relative to your natal Moon sign and Lagna, with Sade Sati phase analysis and remedies.",
    descHi: "शनि, गुरु, राहु-केतु के वास्तविक गोचर की अपनी चंद्र राशि व लग्न से स्थिति, साढ़ेसाती चरण एवं तात्कालिक प्रभाव व वैदिक उपाय जानें।",
    keywords: "Gochar Calculator, Planetary Transit Today, Shani Sade Sati Calculator, Jupiter Transit Gochar, Rahu Ketu Transit, Aaj Ka Gochar"
  },
  {
    id: "shadbala",
    slug: "planetary-strength-calculator",
    icon: "💪",
    titleEn: "Planetary Strength & Shadbala Calculator — 6-Fold Planetary Dignity",
    titleHi: "षड्बल एवं ग्रह बल सामर्थ्य कैलकुलेटर | Shadbala 6-Fold Dignity",
    descEn: "Calculate Sthana, Dig, Kala, Cheshta, Naisargika, and Drik Bala in Rupas. Evaluate which planets are strong, neutral, or require Vedic astrological remedies.",
    descHi: "ग्रहों के ६ बलों (स्थान, दिग्, काल, चेष्टा, नैसर्गिक, दृग्बल) की रूपा में शास्त्रीय गणना एवं कौन सा ग्रह आपकी कुंडली में सर्वाधिक बली व कारक है।",
    keywords: "Shadbala Calculator, Planetary Strength Calculator, Graha Bala Rupas, Sthana Bala Dig Bala, Vedic Planet Strength, Kundli Graha Bal"
  },
  {
    id: "kp_chart",
    slug: "kp-chart-calculator",
    icon: "🧭",
    titleEn: "KP Chart & Sub-Lord Calculator — Krishnamurti Paddhati Cusps",
    titleHi: "केपी कुंडली एवं उप-स्वामी (Sub-Lord) कैलकुलेटर | KP Astrology",
    descEn: "Generate Krishnamurti Paddhati (KP) planetary coordinates, 12 house cusps, Nakshatra Star Lords, and Sub-Lords based on exact Placidus house divisions.",
    descHi: "कृष्णमूर्ति पद्धति (KP) के अनुसार सभी १२ भाव संधियों, नवग्रहों के नक्षत्र स्वामी एवं उप-स्वामी (Sub-Lord) की प्लेसिडस पद्धति आधारित सूक्ष्म गणना।",
    keywords: "KP Chart Calculator, KP Sub Lord Calculator, Krishnamurti Paddhati, KP House Cusps, Placidus House Division, KP Star Lord"
  },
  {
    id: "kp_significators",
    slug: "kp-house-significator",
    icon: "🎯",
    titleEn: "KP 4-Fold House Significator Analyzer — Event Timing & Fruit",
    titleHi: "केपी ४-स्तरीय भाव कारक (Significator) विश्लेषक | 4-Level KP Matrix",
    descEn: "Analyze Level A, B, C, D significators for specific life domains: Career (2, 6, 10, 11), Marriage (2, 7, 11), Property (4, 11, 12), and Childbirth (2, 5, 11).",
    descHi: "करियर, विवाह, संपत्ति एवं संतान हेतु KP ४-स्तरीय भाव कारकों (Level A to D) का सूक्ष्म विश्लेषण एवं घटना समय निर्धारण।",
    keywords: "KP Significators, KP 4 Fold Significators, KP Marriage Timing, KP Career Significator, Level A B C D Significator, Krishnamurti Paddhati"
  },
  {
    id: "kp_horary",
    slug: "kp-horary-calculator",
    icon: "🔮",
    titleEn: "KP Horary 1–249 Prashna Calculator — Instant Query Astrology",
    titleHi: "केपी प्रश्न कुंडली १–२४९ कैलकुलेटर | KP Horary 1-249 Query",
    descEn: "Enter a horary query number from 1 to 249 to generate an instantaneous KP Prashna chart with Ascendant Sub-Lord and clear house fruition verdict.",
    descHi: "१ से २४९ में से कोई भी संख्या चुनकर तत्काल प्रश्न कुंडली तैयार करें और अपने कार्य की सफलता व समय-सीमा का अचूक उत्तर पाएं।",
    keywords: "KP Horary Calculator, KP 1 to 249 Calculator, KP Prashna Kundli, Horary Astrology, KP Question Answer, KP Prashna Jyotish"
  },
  {
    id: "kp_ruling",
    slug: "kp-ruling-planets",
    icon: "👑",
    titleEn: "KP Ruling Planets (RP) Calculator — Instant Cosmic Clock",
    titleHi: "केपी सत्तारूढ़ ग्रह (Ruling Planets) कैलकुलेटर | Instant RP Matrix",
    descEn: "Compute the cosmic Ruling Planets at the exact moment of inquiry: Lagna Sign/Star/Sub Lord, Moon Sign/Star/Sub Lord, and Weekday Lord for event verification.",
    descHi: "प्रश्न क्षण के तात्कालिक सत्तारूढ़ ग्रहों (लग्न, चंद्र एवं वार स्वामियों) की गणना, जिसका उपयोग समय शुद्धि एवं सटीक समय निर्धारण में होता है।",
    keywords: "KP Ruling Planets, Ruling Planets RP Calculator, Lagna Moon Sub Lord, KP RP Astrology, KP Event Verification, Timing with RP"
  },
  {
    id: "lifepath",
    slug: "life-path-number",
    icon: "🌟",
    titleEn: "Life Path Number Calculator — Soul Purpose & Master Numbers (11, 22, 33)",
    titleHi: "मूलांक व भाग्यांक (Life Path) कैलकुलेटर | Master Numbers 11, 22, 33",
    descEn: "Calculate your core Life Path Number from your birth date with step-by-step reduction, Master Numbers (11, 22, 33) detection, and soul archetype guidance.",
    descHi: "जन्म तिथि से अपने मूलांक व भाग्यांक की गणना, मास्टर नंबर (११, २२, ३३) की पहचान एवं जीवन के मुख्य उद्देश्य का विस्तृत मार्गदर्शन।",
    keywords: "Life Path Number Calculator, Mulank Bhagyank Calculator, Numerology Master Numbers, Master Number 11 22 33, Birth Date Numerology"
  },
  {
    id: "name_numerology",
    slug: "name-numerology",
    icon: "🔤",
    titleEn: "Name Numerology (Chaldean & Pythagorean) — Expression & Soul Urge",
    titleHi: "नाम अंकशास्त्र (काल्डियन व पाइथागोरियन पद्धति) | Name Vibrations",
    descEn: "Analyze any personal, business, or brand name with letter-by-letter vibrational values. Calculate Expression, Soul Urge (vowels), and Personality numbers.",
    descHi: "अपने नाम, व्यवसाय या ब्रांड के अक्षरों की काल्डियन व पाइथागोरियन गणना। नामांक, आत्मांक (Soul Urge) व व्यक्तित्व अंक जानें।",
    keywords: "Name Numerology Calculator, Chaldean Numerology, Pythagorean Name Number, Soul Urge Number, Business Name Numerology, Namank Calculator"
  },
  {
    id: "personal_year",
    slug: "personal-year-month",
    icon: "📅",
    titleEn: "Personal Year & Personal Month Calculator — 9-Year Epicycle Guide",
    titleHi: "व्यक्तिगत वर्ष व माह चक्र (Personal Year Cycle) | 9-Year Cycle",
    descEn: "Discover which stage of the universal 9-year epicycle you are currently navigating (from Year 1: Seed Planting to Year 9: Harvest & Release).",
    descHi: "वर्तमान में आप ९-वर्षीय जीवन चक्र के किस वर्ष में हैं (आरंभ, विस्तार, परिश्रम, परिवर्तन या पूर्णता) और यह माह आपके लिए कैसा रहेगा।",
    keywords: "Personal Year Calculator, Personal Month Numerology, 9 Year Epicycle, Current Year Numerology, Year Number Prediction"
  },
  {
    id: "compatibility",
    slug: "lucky-number-compatibility",
    icon: "❤️",
    titleEn: "Lucky Numbers & Number Compatibility Tool — Resonance Matrix",
    titleHi: "शुभ अंक एवं अंक अनुकूलता (Number Compatibility) | Lucky Numbers",
    descEn: "Explore your ruling planet numbers, friendly vs enemy numbers, and test date-to-date resonance score with your spouse, business partner, or lucky dates.",
    descHi: "अपने मित्र व शत्रु अंक जानें तथा दो जन्म तिथियों के मध्य अंक अनुकूलता (Compatibility Score %) का शास्त्रीय परीक्षण करें।",
    keywords: "Numerology Compatibility Calculator, Lucky Number Calculator, Date of Birth Compatibility, Friendly Enemy Numbers, Ank Jyotish Milan"
  },
  {
    id: "choghadiya",
    slug: "choghadiya-calculator",
    icon: "🕉️",
    titleEn: "Choghadiya Calculator (Day & Night) — Real-Time Live Muhurat",
    titleHi: "दैनिक चौघड़िया मुहूर्त (दिन व रात्रि) | Live Choghadiya Today",
    descEn: "View daily 8-slot Day and Night Choghadiya (Amrit, Shubh, Labh, Char, Rog, Kaal, Udveg) with real-time LIVE indicator for your exact location.",
    descHi: "आज का दिन व रात्रि चौघड़िया: अमृत, शुभ, लाभ, चर, रोग, काल व उद्वेग मुहूर्त। वर्तमान में कौन सा चौघड़िया चल रहा है, लाइव देखें।",
    keywords: "Choghadiya Calculator, Aaj Ka Choghadiya, Day Night Choghadiya, Shubh Choghadiya Today, Amrit Choghadiya, Live Choghadiya Muhurat"
  },
  {
    id: "rahu_kaal",
    slug: "rahu-kaal-calculator",
    icon: "⏱️",
    titleEn: "Rahu Kaal, Yamaganda & Gulika Calculator — Today's Inauspicious Timings",
    titleHi: "राहुकाल, यमगंड एवं गुलिक काल कैलकुलेटर | Today Rahu Kaal",
    descEn: "Location-based calculation of daily inauspicious time bands based on astronomical sunrise and sunset with live status and cautionary guidance.",
    descHi: "सूर्योदय व सूर्यास्त आधारित सटीक दैनिक राहुकाल, यमगंड एवं गुलिक काल समय-सारिणी। क्या अभी राहुकाल प्रभावी है? तुरंत जांचें।",
    keywords: "Rahu Kaal Calculator, Today Rahu Kaal Timing, Yamagandam Today, Gulika Kaal, Inauspicious Time Today, Rahu Kalam Calculator"
  },
  {
    id: "muhurat_finder",
    slug: "personalized-muhurat-finder",
    icon: "✨",
    titleEn: "Personalized Shubh Muhurat Finder — Marriage, Griha Pravesh, Vehicle",
    titleHi: "शुभ मुहूर्त अन्वेषक (विवाह, गृह प्रवेश, वाहन, व्यापार) | Shubh Muhurat",
    descEn: "Filter the best auspicious windows in the next 7, 15, or 30 days for Marriage, House Warming, Vehicle Purchase, Business Launch, or Naming Ceremonies.",
    descHi: "आगामी ७, १५ या ३० दिनों में विवाह, गृह प्रवेश, वाहन क्रय, व्यापार आरंभ एवं नामकरण संस्कार हेतु श्रेष्ठ मुहूर्तों की सूची।",
    keywords: "Shubh Muhurat Finder, Vivah Muhurat Calculator, Griha Pravesh Muhurat 2026, Vehicle Purchase Muhurat, Business Launch Muhurat"
  },
  {
    id: "daily_transit",
    slug: "daily-transit-horoscope",
    icon: "🌅",
    titleEn: "Personalized Daily Transit Horoscope — Natal Moon & Lagna Based",
    titleHi: "व्यक्तिगत दैनिक गोचर राशिफल (चंद्र राशि व लग्न आधारित) | Daily Transit",
    descEn: "Replace generic sun-sign horoscopes with a custom daily reading derived from today's active Moon transit relative to your birth chart.",
    descHi: "सामान्य अखबारों के सूर्य-राशिफल के स्थान पर आपकी जन्म चंद्र राशि एवं लग्न पर आज के ग्रहों के गोचर से तैयार व्यक्तिगत भविष्यफल।",
    keywords: "Daily Transit Horoscope, Natal Moon Transit, Personalized Daily Rashifal, Aaj Ka Rashifal By Kundli, Today Planetary Transit Impact"
  },
  {
    id: "prashna_oracle",
    slug: "prashna-quick-oracle",
    icon: "🧭",
    titleEn: "Prashna / Horary Quick Decision Oracle — Instant Cosmic Verdict",
    titleHi: "प्रश्न ज्योतिष त्वरित निर्णय ओरेकल (Yes/No & Timing) | Prashna Oracle",
    descEn: "Need clarity on an immediate decision? Query the cosmos right now to analyze current planetary hour (Hora) and Ascendant dignity for an instant verdict.",
    descHi: "क्या मैं यह कार्य अभी करूं? वर्तमान क्षण की ग्रह होरा एवं लग्न बल के आधार पर तुरंत 'हां / थोड़ा ठहरें / सावधानी बरतें' का उत्तर प्राप्त करें।",
    keywords: "Prashna Kundli Oracle, Horary Astrology Quick Answer, Yes No Astrology Question, Prashna Jyotish Online, Instant Decision Astrology"
  },
  {
    id: "tara_chandra",
    slug: "tarabala-chandrabala",
    icon: "⭐",
    titleEn: "Tara Bala & Chandra Bala Activity Chooser — Daily Auspiciousness",
    titleHi: "तारा बल एवं चंद्र बल कार्य सिद्धि परीक्षक | Tara Bala & Chandra Bala",
    descEn: "Check whether today's Moon and Nakshatra form an auspicious Tara (Sampat, Kshema, Sadhana, Mitra) for signing contracts, travel, or investments.",
    descHi: "अपने जन्म नक्षत्र से आज के नक्षत्र का ९ ताराओं (सम्पत, क्षेम, साधना, मित्र) में परीक्षण करें कि आज का दिन आपके लिए कितना अनुकूल है।",
    keywords: "Tarabala Calculator, Chandrabala Calculator, 9 Taras Astrology, Sampat Tara Kshema Tara, Daily Auspicious Nakshatra, Muhurat Tarabalam"
  },
  {
    id: "pancha_pakshi",
    slug: "pancha-pakshi-calculator",
    icon: "🦚",
    titleEn: "Pancha Pakshi Decision Biorhythm Tool — 5 Cosmic Birds System",
    titleHi: "पंच पक्षी समय चक्र (प्राचीन दक्षिण भारतीय पद्धति) | 5 Cosmic Birds",
    descEn: "Ancient Tamil 5 Cosmic Birds system (Peacock, Rooster, Crow, Owl, Vulture). Pinpoint your bird's ruling hours (Eating, Walking, Sitting, Sleeping, Dying).",
    descHi: "प्राचीन तमिल पंच पक्षी प्रणाली द्वारा अपने जन्म पक्षी के ५ कार्यों (भोजन, गमन, राज्य, निद्रा, मरण) के आधार पर शुभ समय का चुनाव करें।",
    keywords: "Pancha Pakshi Calculator, 5 Birds Astrology, Tamil Pancha Pakshi Shastra, Ruling Bird Hours, Auspicious Bird Activity"
  },
  {
    id: "cosmic_compass",
    slug: "cosmic-decision-compass",
    icon: "🧭",
    titleEn: "Planetary Hora Compass (24-Hour Guide) — Hourly Auspicious Vibrations",
    titleHi: "२४ घंटे की ग्रह होरा चक्र (Planetary Hora Compass) | Hourly Horas",
    descEn: "Explore the 24 hourly planetary vibrations from sunrise to sunrise. Learn the best hours for finance (Jupiter), negotiations (Venus), tech (Mercury), or rest.",
    descHi: "सूर्योदय से लेकर २४ घंटों की ग्रह होरा (सूर्य, शुक्र, बुध, चंद्र, शनि, गुरु, मंगल) एवं किस होरा में कौन सा कार्य सर्वोत्तम फल देता है।",
    keywords: "Planetary Hora Calculator, Aaj Ki Hora, Hourly Planetary Ruler, Jupiter Hora Venus Hora, Shubh Hora Today, 24 Hora Astrology"
  }
];

function generateToolHtml(tool, canonicalPath) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${tool.titleEn} | Jyotish Paramarsh</title>
    <meta name="description" content="${tool.descEn}" />
    <meta name="keywords" content="${tool.keywords}" />
    <meta name="author" content="Jyotish Paramarsh" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta name="theme-color" content="#0a0520" />

    <link rel="canonical" href="https://www.jyotishparamash.com${canonicalPath}" />
    <link rel="alternate" hreflang="en" href="https://www.jyotishparamash.com${canonicalPath}" />
    <link rel="alternate" hreflang="hi" href="https://www.jyotishparamash.com${canonicalPath}?lang=hi" />
    <link rel="alternate" hreflang="x-default" href="https://www.jyotishparamash.com${canonicalPath}" />

    <!-- Google Search Structured Data (JSON-LD) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": ${JSON.stringify(tool.titleEn)},
      "alternateName": ${JSON.stringify(tool.titleHi)},
      "url": "https://www.jyotishparamash.com${canonicalPath}",
      "description": ${JSON.stringify(tool.descEn)},
      "applicationCategory": "LifestyleApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Jyotish Paramarsh",
        "url": "https://www.jyotishparamash.com",
        "logo": "https://www.jyotishparamash.com/logo.png"
      }
    }
    </script>

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Jyotish Paramarsh" />
    <meta property="og:url" content="https://www.jyotishparamash.com${canonicalPath}" />
    <meta property="og:title" content="${tool.titleEn} | Jyotish Paramarsh" />
    <meta property="og:description" content="${tool.descEn}" />
    <meta property="og:image" content="https://www.jyotishparamash.com/og-banner.jpg" />

    <!-- Twitter / X -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="https://www.jyotishparamash.com${canonicalPath}" />
    <meta name="twitter:title" content="${tool.titleEn} | Jyotish Paramarsh" />
    <meta name="twitter:description" content="${tool.descEn}" />
    <meta name="twitter:image" content="https://www.jyotishparamash.com/og-banner.jpg" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-P8RMZ1CZC4"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-P8RMZ1CZC4', { send_page_view: true });
    </script>
  </head>
  <body>
    <div id="root">
      <main style="background:#0a0520;color:#FDE68A;min-height:100vh;padding:40px 20px;font-family:sans-serif;max-width:960px;margin:0 auto;">
        <header style="margin-bottom:24px;">
          <a href="/astrology-tools" style="color:#F59E0B;text-decoration:none;font-size:14px;font-weight:600;">← All Astrology Tools (सभी ज्योतिषीय टूल्स)</a>
          <h1 style="color:#F59E0B;font-size:32px;margin:16px 0 8px 0;line-height:1.2;">${tool.icon} ${tool.titleEn}</h1>
          <h2 style="color:#FDE68A;font-size:20px;margin:0 0 16px 0;font-weight:normal;">${tool.titleHi}</h2>
        </header>
        <section style="background:rgba(255,255,255,0.04);border:1px solid rgba(245,158,11,0.25);border-radius:12px;padding:24px;margin-bottom:24px;">
          <h3 style="color:#F59E0B;font-size:18px;margin-top:0;">About This Vedic Calculation (शास्त्रीय परिचय)</h3>
          <p style="color:#F1E7D0;line-height:1.7;font-size:16px;margin-bottom:12px;">${tool.descEn}</p>
          <p style="color:#FCD34D;line-height:1.7;font-size:15px;margin-bottom:0;">${tool.descHi}</p>
        </section>
        <div style="text-align:center;padding:20px;color:#9CA3AF;">
          <p>Loading interactive calculation engine & personalized guidance...</p>
        </div>
      </main>
    </div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`;
}

function generateAstrologyToolsHubHtml() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vedic Astrology Calculators & Divine Jyotish Instruments | Jyotish Paramarsh</title>
    <meta name="description" content="21 authentic classical Vedic astrological calculators: Vimshottari Dasha, Shodashvarga, KP Horary (1-249), Chaldean Numerology, Choghadiya Muhurat, and Prashna Oracle computed with astronomical precision." />
    <meta name="keywords" content="Astrology Tools, Vedic Astrology Calculator, Vimshottari Dasha Calculator, KP Astrology Calculator, KP Sub Lord, KP Horary 1 to 249, Life Path Number, Name Numerology Chaldean, Choghadiya Calculator, Rahu Kaal Calculator, Pancha Pakshi, Jyotish Tools" />
    <meta name="author" content="Jyotish Paramarsh" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta name="theme-color" content="#0a0520" />

    <link rel="canonical" href="https://www.jyotishparamash.com/astrology-tools" />
    <link rel="alternate" hreflang="en" href="https://www.jyotishparamash.com/astrology-tools" />
    <link rel="alternate" hreflang="hi" href="https://www.jyotishparamash.com/astrology-tools?lang=hi" />
    <link rel="alternate" hreflang="x-default" href="https://www.jyotishparamash.com/astrology-tools" />

    <!-- Google Search Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Vedic Astrology Calculators & Divine Jyotish Instruments",
      "url": "https://www.jyotishparamash.com/astrology-tools",
      "description": "21 specialized astrology calculators across Vedic Astrology, KP Astrology, Numerology, Daily Astrology, and Personal Decision Tools.",
      "publisher": {
        "@type": "Organization",
        "name": "Jyotish Paramarsh",
        "logo": "https://www.jyotishparamash.com/logo.png"
      }
    }
    </script>

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Jyotish Paramarsh" />
    <meta property="og:url" content="https://www.jyotishparamash.com/astrology-tools" />
    <meta property="og:title" content="Vedic Astrology Calculators & Divine Jyotish Instruments | Jyotish Paramarsh" />
    <meta property="og:description" content="21 precision astrology calculators: Vimshottari Dasha, KP Sub-Lords, Horary 1-249, Life Path Number, Name Numerology, Choghadiya & Shubh Muhurat." />
    <meta property="og:image" content="https://www.jyotishparamash.com/og-banner.jpg" />

    <!-- Twitter / X Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="https://www.jyotishparamash.com/astrology-tools" />
    <meta name="twitter:title" content="Astrology Tools for Every Question — Vedic, KP, Numerology & Decision Tools" />
    <meta name="twitter:description" content="21 precision astrology calculators: Vimshottari Dasha, KP Sub-Lords, Horary 1-249, Life Path Number, Name Numerology, Choghadiya & Shubh Muhurat." />
    <meta name="twitter:image" content="https://www.jyotishparamash.com/og-banner.jpg" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-P8RMZ1CZC4"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-P8RMZ1CZC4', { send_page_view: true });
    </script>
  </head>
  <body>
    <div id="root">
      <main style="background:#0a0520;color:#FDE68A;min-height:100vh;padding:40px 20px;font-family:sans-serif;max-width:960px;margin:0 auto;">
        <h1 style="color:#F59E0B;font-size:32px;margin-bottom:12px;">ज्योतिषीय टूल्स एवं गणना केंद्र (Astrology Tools Hub)</h1>
        <p style="color:#F1E7D0;line-height:1.7;font-size:16px;">
          २१ प्रामाणिक शास्त्रीय उपकरण: वैदिक ज्योतिष, कृष्णमूर्ति पद्धति (KP), अंक ज्योतिष, दैनिक मुहूर्त व कॉस्मिक निर्णय साधन। Loading interactive astrology tools...
        </p>
      </main>
    </div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`;
}

function run() {
  const baseDir = __dirname;

  // 1. Ensure astrology-tools/index.html & tools/index.html
  const astroToolsDir = path.join(baseDir, "astrology-tools");
  fs.mkdirSync(astroToolsDir, { recursive: true });
  fs.writeFileSync(path.join(astroToolsDir, "index.html"), generateAstrologyToolsHubHtml(), 'utf-8');

  const toolsDir = path.join(baseDir, "tools");
  fs.mkdirSync(toolsDir, { recursive: true });
  fs.writeFileSync(path.join(toolsDir, "index.html"), generateAstrologyToolsHubHtml(), 'utf-8');

  // 2. Generate each tool directory and index.html in BOTH astrology-tools/{slug} and tools/{slug}
  for (const tool of TOOLS) {
    const slug = tool.slug;
    const toolDir = path.join(astroToolsDir, slug);
    fs.mkdirSync(toolDir, { recursive: true });
    fs.writeFileSync(path.join(toolDir, "index.html"), generateToolHtml(tool, `/astrology-tools/${slug}`), 'utf-8');

    const toolDirAlias = path.join(toolsDir, slug);
    fs.mkdirSync(toolDirAlias, { recursive: true });
    fs.writeFileSync(path.join(toolDirAlias, "index.html"), generateToolHtml(tool, `/astrology-tools/${slug}`), 'utf-8');
  }

  console.log(`Generated HTML pages for ${TOOLS.length} tools in astrology-tools/ and tools/.`);
}

run();
