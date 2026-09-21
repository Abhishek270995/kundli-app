# Jyotish Paramarsh (ज्योतिष परामर्श)

Official web application repository for **[jyotishparamash.com](https://jyotishparamash.com)** — an authentic, classical Parashari Vedic Astrology platform, Daily Panchang, Shubh Muhurat Directory, and Cosmic Life Dossier generator.

---

## 📑 Table of Contents
1. [Overview & Architecture](#-overview--architecture)
2. [Libraries & Dependencies](#-libraries--dependencies)
3. [Kundli & Astronomical Calculation Engine](#-kundli--astronomical-calculation-engine)
   - [Ayanamsa (Chitra Paksha / Lahiri)](#1-ayanamsa-chitra-paksha--lahiri)
   - [Planetary Positions (Graha Sphuta)](#2-planetary-positions-graha-sphuta)
   - [Lunar Nodes (Rahu & Ketu)](#3-lunar-nodes-rahu--ketu)
   - [Ascendant (Lagna Sphuta)](#4-ascendant-lagna-sphuta)
   - [Bhavas (Houses) & Planetary Dignities](#5-bhavas-houses--planetary-dignities)
   - [Nakshatras, Padas & Avakahada Chakra](#6-nakshatras-padas--avakahada-chakra)
   - [Divisional Charts (D9 Navamsha & D10 Dasamsa)](#7-divisional-charts-d9-navamsha--d10-dasamsa)
   - [Vimshottari Dasha Engine](#8-vimshottari-dasha-engine)
   - [Ashtakoot 36-Gun Milan (Matchmaking)](#9-ashtakoot-36-gun-milan-matchmaking)
4. [Hindu Panchang & Calendar Calculation Engine](#-hindu-panchang--calendar-calculation-engine)
   - [Tithi (Lunar Day)](#1-tithi-lunar-day)
   - [Nakshatra & Pada](#2-nakshatra--pada)
   - [Yoga](#3-yoga)
   - [Karana](#4-karana)
   - [Vaar (Weekday) & Hindu Eras](#5-vaar-weekday--hindu-eras)
   - [Solar Clock & Auspicious Muhurats](#6-solar-clock--auspicious-muhurats)
   - [Inauspicious Windows (Rahu Kaal, Yamaganda, Gulika)](#7-inauspicious-windows)
   - [Choghadiya (Day & Night)](#8-choghadiya-day--night)
5. [Shubh Muhurat & Festival Date System](#-shubh-muhurat--festival-date-system)
   - [How Muhurat Dates are Sourced & Computed](#1-how-muhurat-dates-are-sourced--computed)
   - [How Festival & Vrat Dates are Sourced & Computed](#2-how-festival--vrat-dates-are-sourced--computed)
6. [Project Structure](#-project-structure)
7. [Getting Started & Development](#-getting-started--development)

---

## 🌟 Overview & Architecture

Jyotish Paramarsh is built as a zero-backend, client-side astronomical compute engine. All planetary ephemerides, ascendant coordinates, house cusp determinations, Vimshottari dasha cycles, and Panchang tithi math run directly in the browser with sub-arcminute precision.

```
[ User Input (DOB, TOB, POB / Coordinates) ]
                     │
                     ▼
       [ astronomy-engine (Ephemeris) ]
     (AstroTime, GeoVector, Ecliptic, GMST)
                     │
                     ▼
         [ Lahiri Ayanamsa Shift ]
       (Sayana Tropical ➔ Nirayana Sidereal)
                     │
       ┌─────────────┴──────────────┐
       ▼                            ▼
[ Natal Kundli Engine ]    [ Daily Panchang & Muhurat ]
 - Lagna & Bhavas           - Tithi, Nakshatra, Yoga, Karana
 - 9 Grahas & Dignities     - Sunrise/Sunset & Solar Noon
 - D9 Navamsha, D10 Dasamsa - Abhijit, Brahma, Amrit Kaal
 - 120-Year Vimshottari     - Rahu Kaal, Yamaganda, Gulika
 - Ashtakoot 36-Gun Milan   - 8 Day & 8 Night Choghadiyas
       │                            │
       └─────────────┬──────────────┘
                     ▼
[ Interactive UI & 45-Page Deluxe PDF Dossier ]
```

---

## 📦 Libraries & Dependencies

| Library | Version | Role & Usage |
| :--- | :--- | :--- |
| **`astronomy-engine`** | `^2.1.19` | High-precision astronomical ephemeris library. Provides `AstroTime`, `GeoVector`, `Ecliptic`, `Body`, and `SiderealTime` for calculating topocentric/geocentric planetary longitudes, latitudes, and Greenwich Mean Sidereal Time (GMST). |
| **`react`** | `^18.3.1` | Component-based reactive UI rendering, responsive tabs, dynamic North/South Indian SVGs, and interactive state management. |
| **`react-dom`** | `^18.3.1` | DOM renderer for React web interface. |
| **`vite`** | `^5.4.10` | Next-generation fast frontend build tool, ES module bundler, and HMR server. |

---

## 🪐 Kundli & Astronomical Calculation Engine

All core Vedic calculations are implemented in `src/jyotishEngine.js` and divisional chart structures in `src/deluxeReportData.js`.

### 1. Ayanamsa (Chitra Paksha / Lahiri)
Vedic astrology uses the **Nirayana** (sidereal) zodiac, whereas modern astronomical ephemerides output **Sayana** (tropical) coordinates. The angular offset between the two is the **Ayanamsa**.

The engine computes the standard government-recognized **Chitra Paksha (Lahiri) Ayanamsa** for any target date:
```javascript
export function getLahiriAyanamsa(date) {
  const yr = date.getFullYear() + (date.getMonth() * 30 + date.getDate()) / 365.25;
  return 23.85 + (yr - 2000) * 0.01397; // Precession rate ~50.29" per year
}

export function applyLahiriAyanamsa(tropicalLon, date) {
  const ayanamsa = getLahiriAyanamsa(date);
  return ((tropicalLon - ayanamsa) % 360 + 360) % 360;
}
```

### 2. Planetary Positions (Graha Sphuta)
Calculated via `calculatePlanets(date)`:
1. Instantiates `AstroTime(date)` in Universal Time (UTC).
2. Computes the geocentric position vector using `GeoVector(Body, time, false)` for the 7 physical bodies:
   - **Sun** (`Body.Sun`), **Moon** (`Body.Moon`), **Mars** (`Body.Mars`), **Mercury** (`Body.Mercury`), **Jupiter** (`Body.Jupiter`), **Venus** (`Body.Venus`), **Saturn** (`Body.Saturn`).
3. Converts vectors to ecliptic spherical coordinates via `Ecliptic(vector)`.
4. Subtracts Lahiri Ayanamsa from the tropical longitude (`elon`) to yield the true sidereal longitude.

### 3. Lunar Nodes (Rahu & Ketu)
Rahu and Ketu are mathematical points of intersection between the Moon's orbital plane and the ecliptic.
- The mean longitude of Rahu is computed via the standard IAU/Meeus polynomial:
  $$\Omega = 125.04452^\circ - 1934.136261^\circ \cdot T + 0.0020708^\circ \cdot T^2 + \frac{T^3}{450000}$$
  where $T = \text{Julian centuries from J2000.0}$.
- Subtracts Lahiri Ayanamsa to arrive at **Sidereal Rahu**.
- **Sidereal Ketu** is positioned exactly $180^\circ$ opposite:
  $$\text{Ketu} = (\text{Rahu} + 180^\circ) \pmod{360^\circ}$$

### 4. Ascendant (Lagna Sphuta)
Calculated via `calculateAscendant(date, lat, lon)`:
1. Calculates Greenwich Mean Sidereal Time (GMST) via `SiderealTime(time)`.
2. Converts to Local Sidereal Time (LST):
   $$\text{LST}_{\text{deg}} = (\text{GMST}_{\text{hours}} \times 15 + \text{longitude}) \pmod{360}$$
3. Solves the spherical triangle using the obliquity of the ecliptic ($\epsilon \approx 23.439^\circ$) and native geographic latitude ($\phi$):
   $$\theta = \text{LST}, \quad y = \cos(\theta), \quad x = -(\sin(\theta)\cos(\epsilon) + \tan(\phi)\sin(\epsilon))$$
   $$\text{Lagna}_{\text{tropical}} = \text{atan2}(y, x)$$
4. Applies `applyLahiriAyanamsa` to obtain the sidereal **Lagna (Ascendant)**.

### 5. Bhavas (Houses) & Planetary Dignities
- **House Division**: Parashari Whole Sign / Equal House system where the sign containing the Ascendant is Bhava 1, continuing sequentially through Bhava 12.
- **Dignity Evaluation** (`evaluatePlanetStatus`):
  - **Exaltation (Uchcha)** & **Debilitation (Neecha)** exact signs (e.g. Sun exalted in Aries, debilitated in Libra; Moon exalted in Taurus, debilitated in Scorpio).
  - **Moolatrikona** & **Own Sign (Swakshetra)** recognition.
  - **Friendly (Mitra)**, **Enemy (Shatru)**, and **Neutral (Sama)** classifications based on classical Panchadha Maitri.

### 6. Nakshatras, Padas & Avakahada Chakra
- The $360^\circ$ zodiac is segmented into 27 Nakshatras of $13^\circ 20'$ ($800'$) each.
- Each Nakshatra is subdivided into 4 Padas of $3^\circ 20'$ ($200'$) each.
- Evaluates native's:
  - **Varna** (Brahmin, Kshatriya, Vaishya, Shudra)
  - **Vashya** (Chatushpada, Dwipada, Jalachara, Vanachara, Keeta)
  - **Tara** (9-Tara cycle from Janma Tara)
  - **Yoni** (14 animal types)
  - **Gana** (Deva, Manushya, Rakshasa)
  - **Nadi** (Adi, Madhya, Antya)

### 7. Divisional Charts (D9 Navamsha & D10 Dasamsa)
Implemented in `src/deluxeReportData.js`:
- **Navamsha (D9)** (`calculateD9SignIndex`):
  Each sign ($30^\circ$) is divided into 9 segments of $3^\circ 20'$.
  - Movable Signs (Aries, Cancer, Libra, Capricorn): Start from the sign itself.
  - Fixed Signs (Taurus, Leo, Scorpio, Aquarius): Start from the 9th sign.
  - Dual Signs (Gemini, Virgo, Sagittarius, Pisces): Start from the 5th sign.
- **Dasamsa (D10)** (`calculateD10SignIndex`):
  Each sign is divided into 10 segments of $3^\circ$.
  - Odd signs: Count from the sign itself.
  - Even signs: Count from the 9th sign.

### 8. Vimshottari Dasha Engine
- Calculates the 120-year classical cycle:
  `Ketu (7y) ➔ Venus (20y) ➔ Sun (6y) ➔ Moon (10y) ➔ Mars (7y) ➔ Rahu (18y) ➔ Jupiter (16y) ➔ Saturn (19y) ➔ Mercury (17y)`
- **Dasha Balance at Birth**: Determined by the exact proportion of the Moon's birth Nakshatra already traversed:
  $$\text{Balance Ratio} = 1 - \frac{\text{Moon Longitude} \pmod{13.3333^\circ}}{13.3333^\circ}$$
  $$\text{Starting Balance Years} = \text{Full Dasha Span} \times \text{Balance Ratio}$$
- Expands dynamically into chronological Mahadashas and Antardashas.

### 9. Ashtakoot 36-Gun Milan (Matchmaking)
`calculateGunMilan({ partner1, partner2 })` computes compatibility across 8 Kootas:
1. **Varna Koota** (1 Point): Spiritual ego and work nature.
2. **Vashya Koota** (2 Points): Mutual dominance and attraction.
3. **Tara Koota** (3 Points): Destiny, health, and longevity resonance.
4. **Yoni Koota** (4 Points): Biological and physical affinity.
5. **Graha Maitri Koota** (5 Points): Psychological and intellectual harmony.
6. **Gana Koota** (6 Points): Temperament and social behavior.
7. **Bhakoot Koota** (7 Points): Family prosperity, emotional depth, and progeny welfare.
8. **Nadi Koota** (8 Points): Genetic compatibility and Prana energy.
*Total maximum score: 36 Points. Includes automatic checks for Nadi Dosha and Bhakoot Dosha cancellations.*

---

## 🕉️ Hindu Panchang & Calendar Calculation Engine

Implemented in `calculateDailyPanchang({ dateStr, lat, lon, cityName, lang })` in `src/jyotishEngine.js`.

### 1. Tithi (Lunar Day)
Tithi represents the longitudinal angular separation between the Moon and the Sun:
$$\Delta\lambda = (\lambda_{\text{Moon}} - \lambda_{\text{Sun}}) \pmod{360^\circ}$$
$$\text{Tithi Index} = \left\lfloor \frac{\Delta\lambda}{12^\circ} \right\rfloor$$
- Indices `0` to `14`: **Shukla Paksha** (Waxing Phase, ending in Purnima).
- Indices `15` to `29`: **Krishna Paksha** (Waning Phase, ending in Amavasya).

### 2. Nakshatra & Pada
The Moon's Nirayana sidereal longitude ($\lambda_{\text{Moon}}$) is mapped into the 27 Nakshatras:
$$\text{Nakshatra Index} = \left\lfloor \frac{\lambda_{\text{Moon}}}{13^\circ 20'} \right\rfloor$$
$$\text{Pada} = \left\lfloor \frac{\lambda_{\text{Moon}} \pmod{13^\circ 20'}}{3^\circ 20'} \right\rfloor + 1$$

### 3. Yoga
Computed by adding the Nirayana longitudes of the Sun and the Moon:
$$\text{Sum} = (\lambda_{\text{Sun}} + \lambda_{\text{Moon}}) \pmod{360^\circ}$$
$$\text{Yoga Index} = \left\lfloor \frac{\text{Sum}}{360^\circ / 27} \right\rfloor$$
Yields the 27 classical Yogas (Vishkambha, Priti, Ayushman, ..., Brahma, Indra, Vaidhriti).

### 4. Karana
A Karana is half of a Tithi ($6^\circ$ difference):
$$\text{Karana Index} = \left\lfloor \frac{\Delta\lambda}{6^\circ} \right\rfloor$$
- 1st half of Shukla Pratipada is **Kimstughna** (Fixed).
- Next 56 half-tithis cycle through the 7 movable Karanas: **Bava, Balava, Kaulava, Taitila, Gara, Vanija, Vishti (Bhadra)**.
- Final 3 half-tithis are fixed: **Shakuni, Chatushpada, Naga**.

### 5. Vaar (Weekday) & Hindu Eras
- **Vaar**: Mapped to planetary rulers (Ravivasara/Sun, Somavasara/Moon, Mangalavasara/Mars, Budhavasara/Mercury, Guruvasara/Jupiter, Shukravasara/Venus, Shanivasara/Saturn).
- **Vikram Samvat**: $\text{Current Year} + 57$
- **Shaka Samvat**: $\text{Current Year} - 78$
- **Masa (Lunar Month)** & **Ritu (Season)**: Derived from the Sun's sidereal transit sign.

### 6. Solar Clock & Auspicious Muhurats
Calculated relative to local sunrise ($T_{\text{sunrise}}$) and sunset ($T_{\text{sunset}}$):
- **Brahma Muhurat**: $T_{\text{sunrise}} - 96\text{ mins}$ to $T_{\text{sunrise}} - 48\text{ mins}$ (pre-dawn spiritual window).
- **Abhijit Muhurat**: Local solar noon $\pm 24\text{ mins}$ (midpoint of the daytime period).
- **Amrit Kaal**: Auspicious planetary window calculated from lunar distance.
- **Vijay Muhurat**: Daytime period at 65% progression towards sunset.
- **Godhuli Muhurat**: $T_{\text{sunset}} - 15\text{ mins}$ to $T_{\text{sunset}} + 15\text{ mins}$.

### 7. Inauspicious Windows
Day length ($T_{\text{sunset}} - T_{\text{sunrise}}$) is split into 8 equal parts of duration $P$:
- **Rahu Kaal**: Inauspicious slot assigned per weekday (Mon: 2nd, Tue: 7th, Wed: 5th, Thu: 6th, Fri: 4th, Sat: 3rd, Sun: 8th part).
- **Yamaganda**: Assigned per weekday table.
- **Gulika Kaal**: Assigned per weekday table.
- **Disha Shool**: Directional warning based on weekday with recommended traditional countermeasures (e.g. consuming jaggery, curd, or coriander seeds before departure).

### 8. Choghadiya (Day & Night)
- Divides daytime into 8 equal slots and nighttime into 8 equal slots.
- 7 classical Choghadiyas (**Amrit, Shubh, Labh, Char, Rog, Kaal, Udveg**) mapped based on weekday cyclic permutations.

---

## 🪔 Shubh Muhurat & Festival Date System

### 1. How Muhurat Dates are Sourced & Computed
The Shubh Muhurats directory (`UPCOMING_SHUBH_MUHURATS` in `src/jyotishEngine.js`) provides verified dates and time windows for:
- 💍 **Vivah Muhurat (Marriage)**
- 🏡 **Griha Pravesh (Housewarming)**
- 🚗 **Vahan Kharidari (Vehicle Purchase)**
- ✂️ **Mundan Sanskar (Tonsure)**
- 📜 **Naamakaran (Naming Ceremony)**
- 🏗️ **Property / Land Purchase**

**Calculation & Filtering Criteria**:
1. **Lagna Shuddhi**: The ascendant must be free of malefics in the 7th and 8th houses.
2. **Solar/Lunar Alignment**: Verified against Brihat Parashara Hora Shastra and Muhurta Chintamani guidelines. Avoids inauspicious months (Adhik Masa, Malmas, Chaturmas for marriages).
3. **Nakshatra & Tithi Harmony**: Favorable constellations (e.g., Rohini, Mrigashira, Uttara Phalguni, Hasta, Swati, Anuradha, Uttara Ashadha, Shravana, Uttara Bhadrapada, Revati).
4. **Yoga Synchronization**: Coincides with auspicious Yogas like **Sarvartha Siddhi Yoga** and **Amrit Siddhi Yoga**.

### 2. How Festival & Vrat Dates are Sourced & Computed
The Festival Calendar (`HINDU_FESTIVALS_CALENDAR` in `src/jyotishEngine.js`) encompasses all annual national and regional Hindu observances:
- **All 24 Monthly Ekadashis**: Both Shukla and Krishna Paksha Ekadashis (Aja, Parivartini, Indira, Papankusha, Rama, Devutthana, Utpanna, Mokshada, Saphala, Pausha Putrada, Shatila, Jaya, Vijaya, Amalaki, Papmochani, Kamada, Varuthini, Mohini, Apara, Nirjala, Yogini, Kamika, Shravana Putrada).
- **Major Festivals**: Ganesh Chaturthi, Sharad Navratri, Dussehra/Vijayadashami, Karwa Chauth, Dhanteras, Diwali (Lakshmi Puja), Govardhan Puja, Bhai Dooj, Chhath Puja, Makar Sankranti, Maha Shivratri, Holi, Chaitra Navratri, Rama Navami, Hanuman Jayanti, Raksha Bandhan, Krishna Janmashtami.

**Determination Rules**:
- **Tithi-Based Astronomical Determination**: Hindu festivals depend on the Tithi active during the specific time of day prescribed by Shastras:
  - *Udaya Tithi* (sunrise-prevailing tithi) for general fasts and Ekadashis.
  - *Pradosh Kaal* (dusk/evening) for Lakshmi Puja (Diwali) and Pradosh Vrat.
  - *Madhyahna Kaal* (solar noon) for Ganesh Chaturthi and Rama Navami.
  - *Nishita Kaal* (midnight) for Janmashtami and Maha Shivratri.
- Each event includes verified **Puja Muhurat**, **Parana timing**, **Vedic spiritual significance**, and **Fasting (*vrata*) dietary rules**.

---

## 📁 Project Structure

```
kundli-app/
├── index.html                  # HTML5 entry with multi-resolution favicons & JSON-LD
├── public/
│   ├── favicon.ico             # Multi-size ICO (16, 32, 48)
│   ├── favicon-48x48.png       # Crawled by Google Search bot
│   ├── favicon-192x192.png     # Android Chrome icon
│   ├── favicon-512x512.png     # PWA splash icon
│   ├── apple-touch-icon.png    # iOS Safari bookmark icon
│   ├── inr-upi-qr.png          # High-contrast UPI payment QR
│   ├── logo.png                # 512x512 Golden Vedic emblem
│   ├── og-banner.jpg           # Social media OpenGraph banner
│   ├── robots.txt              # Search crawler permissions
│   ├── sitemap.xml             # XML sitemap for search engines
│   └── site.webmanifest        # PWA manifest
├── src/
│   ├── App.jsx                 # Core UI, category tabs & checkout flow
│   ├── jyotishEngine.js        # Astronomical ephemeris, Panchang & Parashari math
│   ├── deluxeReportData.js     # Divisional charts (D9, D10) & 45-page content
│   ├── DeluxeLifeReportDossier.jsx # 45-Page A4 printable life report dossier
│   ├── kundliEngine.js         # Chart builder utilities
│   ├── geocode.js              # City coordinate mapping
│   └── main.jsx               # React DOM entry
├── package.json
└── vite.config.js
```

---

## 💻 Getting Started & Development

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Installation & Local Run
```bash
# Clone the repository
git clone https://github.com/Abhishek270995/kundli-app.git
cd kundli-app

# Install dependencies
npm install

# Start local development server
npm run dev
```

### Production Build
```bash
npm run build
# Outputs minified assets to the /dist directory
```

---

## 📜 License & Acknowledgements
- **Calculations**: Derived from Maharishi Parashara's *Brihat Parashara Hora Shastra*, *Muhurta Chintamani*, and modern astronomical planetary theory.
- **Ephemeris**: Powered by `astronomy-engine` by Don Cross.
- **Maintainer**: Jyotish Paramarsh Vedic Research Team ([teamjyotishparamarsh@gmail.com](mailto:teamjyotishparamarsh@gmail.com)).
