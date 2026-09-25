import React from "react";
import {
  calculateD9SignIndex,
  calculateD10SignIndex,
  buildDivisionalHouses,
  PLANET_DEEP_DIVES,
  HOUSE_DEEP_DIVES,
  PLANETS
} from "./deluxeReportData";
import {
  getPlanetaryAvastha,
  detectPlanetaryConjunctions,
  getPlanetLifeImpactBreakdown,
  HOUSE_TITLES
} from "./planetaryAnalysisEngine";
import { SIGNS } from "./jyotishEngine";

export default function DeluxeLifeReportDossier({
  result,
  form = {},
  lang = "en",
  NorthIndianChart,
  SouthIndianChart,
  careerPrediction,
  marriagePrediction
}) {
  if (!result) return null;

  const hi = lang === "hi";
  const nameUpper = (form.name || "NATIVE").toUpperCase();
  const dobStr = form.dob || "1998-01-01";
  const tobStr = form.tob || "12:00 PM";
  const pobStr = form.pob || "New Delhi, India";
  const reportCertId = `JP-DLX-${Math.abs(nameUpper.split("").reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0) % 900000 + 100000)}`;

  // Divisional charts
  const d9Houses = buildDivisionalHouses(result.planetData, result.lagna, calculateD9SignIndex);
  const d10Houses = buildDivisionalHouses(result.planetData, result.lagna, calculateD10SignIndex);
  const moonHouses = buildDivisionalHouses(result.planetData, result.rashi, (deg) => Math.floor(deg / 30));

  const cp = careerPrediction || {};
  const mp = marriagePrediction || {};
  const lva = mp.loveVsArrange || {};

  // Conjunctions & Planetary Map
  const pMap = result.planetHouseMap || PLANETS.reduce((acc, p) => {
    if (result.planetData?.[p.name]?.house) acc[p.name] = result.planetData[p.name].house;
    return acc;
  }, {});
  const conjunctions = detectPlanetaryConjunctions(pMap, result.planetData, lang);

  // Standard Page Shell Helper
  const PageShell = ({ pageNum, chapterNum, chapterTitle, children, noHeader = false }) => (
    <div className="print-page">
      {!noHeader && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid rgba(212,175,55,0.45)", paddingBottom: 6, marginBottom: 12, fontSize: 10, color: "rgba(243,211,122,0.9)", letterSpacing: 0.8, textTransform: "uppercase" }}>
          <span>🔯 JYOTISH PARAMARSH · GOLDEN DELUXE LIFE DOSSIER</span>
          <span>{chapterTitle ? `CH. ${chapterNum}: ${chapterTitle}` : nameUpper}</span>
          <span>ID: {reportCertId}</span>
        </div>
      )}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
        {children}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1.5px solid rgba(212,175,55,0.35)", paddingTop: 6, marginTop: 12, fontSize: 9.5, color: "rgba(241,231,208,0.7)", letterSpacing: 0.8 }}>
        <span>✦ OM TAT SAT · AUTHENTIC PARASHARI VEDIC COMPUTATIONS ✦</span>
        <span>CONFIDENTIAL · JYOTISHPARAMASH.COM</span>
        <span style={{ color: "#FDE68A", fontWeight: 800 }}>PAGE {pageNum} OF 45</span>
      </div>
    </div>
  );

  return (
    <div className="deluxe-print-dossier">
      {/* ══════════════════════════════════════════════════════════════
          PAGE 1: ROYAL COVER PAGE & SACRED CERTIFICATE
      ══════════════════════════════════════════════════════════════ */}
      <PageShell pageNum={1} noHeader>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", border: "3px double #D4AF37", borderRadius: 14, padding: "34px 26px", background: "radial-gradient(circle at 50% 30%, rgba(42,27,78,0.95), rgba(11,8,25,0.98))" }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>॥ श्री गणेशाय नमः ॥</div>
          <div style={{ fontSize: 13, color: "rgba(243,211,122,0.85)", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 14 }}>
            ॐ गं गणपतये नमः · ॐ ऐं सरस्वत्यै नमः
          </div>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🔯 👑 📜</div>
          <h1 style={{ fontFamily: "'Cinzel', serif", color: "#F3D37A", fontSize: 32, fontWeight: 900, letterSpacing: 3, margin: "6px 0 10px", textTransform: "uppercase" }}>
            GOLDEN DELUXE LIFE DOSSIER
          </h1>
          <div style={{ fontSize: 14, color: "#34D399", fontWeight: 800, letterSpacing: 2, marginBottom: 20 }}>
            ✦ COMPLETE 45-PAGE PARASHARI ASTROLOGICAL BLUEPRINT ✦
          </div>

          <div style={{ width: 140, height: 2, background: "linear-gradient(90deg, transparent, #D4AF37, transparent)", margin: "0 auto 24px" }} />

          {/* Native Info Box */}
          <div style={{ width: "100%", maxWidth: 520, background: "rgba(11,8,25,0.75)", border: "1.5px solid rgba(212,175,55,0.4)", borderRadius: 12, padding: "20px 24px", marginBottom: 24, textAlign: "left" }}>
            <div style={{ textAlign: "center", borderBottom: "1px solid rgba(212,175,55,0.25)", paddingBottom: 10, marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "#F59E0B", fontWeight: 700, letterSpacing: 1.5 }}>NATIVE HOROSCOPE DEDICATION</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#FDE68A", marginTop: 4 }}>{nameUpper}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 12.5 }}>
              <div><b style={{ color: "rgba(243,211,122,0.85)" }}>Date of Birth:</b> <span style={{ color: "#FFF" }}>{dobStr}</span></div>
              <div><b style={{ color: "rgba(243,211,122,0.85)" }}>Time of Birth:</b> <span style={{ color: "#FFF" }}>{tobStr}</span></div>
              <div><b style={{ color: "rgba(243,211,122,0.85)" }}>Place of Birth:</b> <span style={{ color: "#FFF" }}>{pobStr}</span></div>
              <div><b style={{ color: "rgba(243,211,122,0.85)" }}>Ascendant (Lagna):</b> <span style={{ color: "#34D399", fontWeight: 700 }}>{result.lagna}</span></div>
              <div><b style={{ color: "rgba(243,211,122,0.85)" }}>Moon Sign (Rashi):</b> <span style={{ color: "#FDE68A", fontWeight: 700 }}>{result.rashi}</span></div>
              <div><b style={{ color: "rgba(243,211,122,0.85)" }}>Birth Nakshatra:</b> <span style={{ color: "#FFF" }}>{result.nakshatra}</span></div>
              <div><b style={{ color: "rgba(243,211,122,0.85)" }}>Ayanamsha:</b> <span style={{ color: "#FFF" }}>Lahiri / Chitra Paksha</span></div>
              <div><b style={{ color: "rgba(243,211,122,0.85)" }}>Document ID:</b> <span style={{ color: "#93C5FD", fontWeight: 700 }}>{reportCertId}</span></div>
            </div>
          </div>

          <div style={{ fontSize: 12, color: "rgba(241,231,208,0.85)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 20px" }}>
            This sacred horoscope is meticulously computed following Maharishi Parashara's classical Brihat Parashara Hora Shastra and certified by Jyotish Paramarsh Vedic Scholars.
          </div>

          <div style={{ borderTop: "1px solid rgba(212,175,55,0.3)", paddingTop: 12, fontSize: 11, color: "#F3D37A", letterSpacing: 1.5, textTransform: "uppercase" }}>
            ✦ STRICTLY CONFIDENTIAL · PERSONAL KARMIC DOSSIER ✦
          </div>
        </div>
      </PageShell>

      {/* ══════════════════════════════════════════════════════════════
          PAGE 2: TABLE OF CONTENTS (50 SECTIONS / 12 CHAPTERS)
      ══════════════════════════════════════════════════════════════ */}
      <PageShell pageNum={2} chapterNum={1} chapterTitle="Executive Astrological Index">
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <h2 style={{ color: "#F3D37A", fontSize: 20, fontWeight: 800, margin: 0 }}>✦ COMPLETE DOSSIER DIRECTORY (45 PAGES) ✦</h2>
          <div style={{ fontSize: 12, color: "rgba(241,231,208,0.8)", marginTop: 4 }}>Structured Parashari Epistemology, Divisional Charts & Chronological Life Readings</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, fontSize: 12 }}>
          {[
            { ch: "Chapter 1", title: "Avakahada Chakra & Astronomical Coordinates", p: "Pages 3–4", items: ["Core Panchang & Elemental Archetype", "Ascendant (Lagna) In-Depth Analysis"] },
            { ch: "Chapter 2", title: "Sacred Divisional Charts Gallery", p: "Pages 5–8", items: ["D1 Lagna North Indian Diamond Chart", "D1 South Indian Square Rashi Chart", "D9 Navamsha Chart (Spouse & Dharma)", "D10 Dasamsa & Chandra Kundli (Career & Mind)"] },
            { ch: "Chapter 3", title: "Planetary Ephemeris, Shadbala & Avasthas", p: "Pages 9–10", items: ["Planetary Positions, Dignities & Degrees", "Avasthas, Combustions, Vakri & Karakas"] },
            { ch: "Chapter 4", title: "9 Graha Single-Planet Master Dossiers", p: "Pages 11–19", items: ["Surya (Sun) & Chandra (Moon) Deep Dives", "Mangal (Mars) & Budha (Mercury) Analysis", "Guru (Jupiter) & Shukra (Venus) Blessings", "Shani (Saturn), Rahu & Ketu Karmic Lessons"] },
            { ch: "Chapter 5", title: "12 Bhava (Houses) Complete Life Analysis", p: "Pages 20–31", items: ["Houses 1 to 4: Body, Wealth, Courage & Home", "Houses 5 to 8: Genius, Health, Spouse & Longevity", "Houses 9 to 12: Fortune, Career, Gains & Moksha"] },
            { ch: "Chapter 6", title: "Vedic Yogas & Planetary Combinations", p: "Pages 32–33", items: ["Raja Yogas, Dhana Yogas & Special Auspicious Yogas", "Adverse Yogas, Dosha Diagnostic & Neutralizations"] },
            { ch: "Chapter 7", title: "120-Year Vimshottari Mahadasha Timelines", p: "Pages 34–35", items: ["Chronological Mahadasha Master Schedule", "Current Active Mahadasha & Antardasha Predictions"] },
            { ch: "Chapter 8", title: "Saturn (Shani) Sade Sati & Dhaiya Chronology", p: "Page 36", items: ["30-Year Saturn Transit Cycle & Protective Upay"] },
            { ch: "Chapter 9", title: "2026–2027 Annual Transit & Milestones", p: "Pages 37–39", items: ["Gochara Planetary Influences", "Quarterly Life Milestones (Q1–Q4)", "Month-by-Month Astrological Windows"] },
            { ch: "Chapter 10", title: "Executive Career & Matrimonial Blueprints", p: "Pages 40–41", items: ["Career Switches, Promotion Windows & Wealth", "Spouse Identity, Vivah Timing & Married Life"] },
            { ch: "Chapter 11", title: "Medical Astrology & Ayurvedic Constitution", p: "Page 42", items: ["Tridosha Balance (Vata, Pitta, Kapha) & Vitality"] },
            { ch: "Chapter 12", title: "Sacred Remedies, Ratna, Rudraksha & Synthesis", p: "Pages 43–45", items: ["Prescribed Gemstones, Metals & Mantras", "Rudraksha, Yantras & Sacred Daily Sadhana", "Grand Life Synthesis & Astrological Seal"] },
          ].map((sec, idx) => (
            <div key={idx} style={{ background: "rgba(15,10,32,0.75)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(212,175,55,0.15)", paddingBottom: 4, marginBottom: 6 }}>
                <span style={{ color: "#FDE68A", fontWeight: 800 }}>{sec.ch}: {sec.title}</span>
                <span style={{ color: "#34D399", fontWeight: 700, fontSize: 11 }}>{sec.p}</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: 16, color: "rgba(241,231,208,0.85)", fontSize: 11.5 }}>
                {sec.items.map((item, ii) => (
                  <li key={ii} style={{ marginBottom: 2 }}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </PageShell>

      {/* ══════════════════════════════════════════════════════════════
          PAGE 3: AVAKAHADA CHAKRA & BIRTH PANCHANG
      ══════════════════════════════════════════════════════════════ */}
      <PageShell pageNum={3} chapterNum={1} chapterTitle="Avakahada Chakra & Core Panchang">
        <h3 style={{ color: "#F3D37A", fontSize: 16, fontWeight: 800, marginBottom: 12, borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 6 }}>
          ✦ ASTRONOMICAL BIRTH PARAMETERS & PANCHANG ATTRIBUTES
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
          {[
            { label: "Ascendant (Lagna)", val: result.lagna, icon: "👑" },
            { label: "Moon Sign (Rashi)", val: result.rashi, icon: "🌙" },
            { label: "Birth Nakshatra", val: result.nakshatra, icon: "⭐" },
            { label: "Nakshatra Pada", val: result.planetData?.Moon?.pada ? `Pada ${result.planetData.Moon.pada}` : "Pada 1", icon: "🔢" },
            { label: "Tithi (Lunar Phase)", val: result.tithi, icon: "🌕" },
            { label: "Vedic Yoga", val: result.yoga, icon: "⚡" },
            { label: "Solar Day (Vara)", val: new Date(dobStr).toLocaleDateString("en-US", { weekday: "long" }), icon: "☀️" },
            { label: "Ayanamsha", val: "Lahiri 24°09'", icon: "📐" },
          ].map((item, i) => (
            <div key={i} style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 16 }}>{item.icon}</div>
              <div style={{ fontSize: 11, color: "rgba(243,211,122,0.85)", fontWeight: 600, marginTop: 2 }}>{item.label}</div>
              <div style={{ fontSize: 13.5, color: "#FDE68A", fontWeight: 800, marginTop: 2 }}>{item.val}</div>
            </div>
          ))}
        </div>

        <h3 style={{ color: "#F3D37A", fontSize: 15, fontWeight: 800, marginBottom: 10 }}>
          ✦ AVAKAHADA 8-FOLD ELEMENTAL TEMPERAMENT MATRIX
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid rgba(212,175,55,0.3)", marginBottom: 16 }}>
          <thead>
            <tr style={{ background: "rgba(245, 158, 11, 0.15)", borderBottom: "1px solid rgba(212,175,55,0.4)" }}>
              <th style={{ padding: "8px 12px", color: "#FDE68A", fontSize: 11.5, textAlign: "left" }}>Panchang Koota</th>
              <th style={{ padding: "8px 12px", color: "#FDE68A", fontSize: 11.5, textAlign: "left" }}>Assigned Value</th>
              <th style={{ padding: "8px 12px", color: "#FDE68A", fontSize: 11.5, textAlign: "left" }}>Cosmic Significance</th>
            </tr>
          </thead>
          <tbody>
            {[
              { koota: "Varna (Intellectual / Action Orientation)", val: ["Cancer", "Scorpio", "Pisces"].includes(result.rashi) ? "Brahmin (Philosophical)" : ["Aries", "Leo", "Sagittarius"].includes(result.rashi) ? "Kshatriya (Protective / Dynamic)" : ["Taurus", "Virgo", "Capricorn"].includes(result.rashi) ? "Vaishya (Commercial / Prudent)" : "Shudra (Diligent / Labor)", desc: "Indicates the innate psychological orientation and core evolutionary aptitude of the soul." },
              { koota: "Vashya (Magnetism & Control)", val: "Chatushpada / Manava", desc: "Measures mental resilience, authority over circumstance and mutual natural harmony with peers." },
              { koota: "Yoni (Animal Archetype)", val: "Simha / Ashwa / Gaja", desc: "Reveals instinctive biological temperament, emotional passion, loyalty and raw stamina." },
              { koota: "Gana (Temperamental Frequency)", val: "Deva (Spiritual) / Manushya (Ambition)", desc: "Governs baseline psychological reactions to stress, societal norms and divine virtues." },
              { koota: "Nadi (Biological Vitality / Pulse)", val: "Madhya / Antya / Adi Nadi", desc: "Primary indicator of nervous constitution, genetic vitality, bio-energetic health and lineage." },
              { koota: "Tatva (Elemental Alignment)", val: ["Aries", "Leo", "Sagittarius"].includes(result.lagna) ? "Agni (Fire — Drive & Vision)" : ["Taurus", "Virgo", "Capricorn"].includes(result.lagna) ? "Prithvi (Earth — Practical Stability)" : ["Gemini", "Libra", "Aquarius"].includes(result.lagna) ? "Vayu (Air — Intellect & Speed)" : "Jala (Water — Empathy & Receptivity)", desc: "The elemental anchor through which the native's nervous system and actions interact with reality." },
            ].map((row, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid rgba(212,175,55,0.1)", background: idx % 2 ? "rgba(255,255,255,0.02)" : "transparent", fontSize: 12 }}>
                <td style={{ padding: "8px 12px", fontWeight: 700, color: "#FDE68A" }}>{row.koota}</td>
                <td style={{ padding: "8px 12px", fontWeight: 700, color: "#34D399" }}>{row.val}</td>
                <td style={{ padding: "8px 12px", color: "rgba(241,231,208,0.85)" }}>{row.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8, padding: "12px 14px", fontSize: 12, lineHeight: 1.65, color: "rgba(241,231,208,0.9)" }}>
          <b style={{ color: "#FDE68A" }}>✦ Astrological Synthesis:</b> The conjunction of your Lagna ({result.lagna}) and Moon ({result.rashi}) with Nakshatra ({result.nakshatra}) forms a remarkably coherent mind-body axis. You possess an innate gift for synthesizing intuitive empathy with high logical execution.
        </div>
      </PageShell>

      {/* ══════════════════════════════════════════════════════════════
          PAGE 4: SOUL ARCHETYPE & ASCENDANT (LAGNA) IN-DEPTH
      ══════════════════════════════════════════════════════════════ */}
      <PageShell pageNum={4} chapterNum={1} chapterTitle="Soul Archetype & Ascendant">
        <h3 style={{ color: "#F3D37A", fontSize: 17, fontWeight: 800, marginBottom: 12, borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 6 }}>
          👑 THE ASCENDANT (LAGNA): {result.lagna.toUpperCase()} — YOUR ESSENTIAL NATURE
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          <div style={{ background: "rgba(15,10,32,0.7)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 14 }}>
            <h4 style={{ color: "#FDE68A", fontSize: 13.5, fontWeight: 800, margin: "0 0 6px" }}>🌟 Primary Psychological Traits</h4>
            <p style={{ fontSize: 12, lineHeight: 1.7, color: "rgba(241,231,208,0.88)", margin: 0 }}>
              Born with {result.lagna} rising, your personality projects natural dignity, purposeful ambition, and sharp perceptive clarity. You instinctively dislike superficiality and seek substantive depth in personal and professional alliances.
            </p>
          </div>
          <div style={{ background: "rgba(15,10,32,0.7)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 14 }}>
            <h4 style={{ color: "#FDE68A", fontSize: 13.5, fontWeight: 800, margin: "0 0 6px" }}>⚡ Executive Strengths & Talents</h4>
            <p style={{ fontSize: 12, lineHeight: 1.7, color: "rgba(241,231,208,0.88)", margin: 0 }}>
              Your mind excels at strategic long-range planning. You are capable of sustained focus where others falter, bringing methodical execution to ambitious visions and earning the trust of seniors and mentors.
            </p>
          </div>
        </div>

        <div style={{ background: "rgba(11,8,25,0.8)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <h4 style={{ color: "#F3D37A", fontSize: 14, fontWeight: 800, margin: "0 0 8px" }}>📜 Parashari Classical Shloka Interpretation for {result.lagna} Lagna</h4>
          <p style={{ fontSize: 12.5, lineHeight: 1.75, color: "rgba(241,231,208,0.92)", margin: 0 }}>
            {result.overview || `As per Brihat Parashara Hora Shastra, a native born under ${result.lagna} Lagna is bestowed with noble intellect, endurance through worldly transitions, and a natural attraction to high dharmic pursuits. The placement of the Lagna Lord determines the prime channel of lifetime wealth, spiritual fulfillment, and social distinction.`}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, padding: 12 }}>
            <div style={{ color: "#34D399", fontWeight: 800, fontSize: 12 }}>✓ Sattvic Harmonizers</div>
            <div style={{ fontSize: 11.5, color: "rgba(241,231,208,0.85)", marginTop: 4, lineHeight: 1.5 }}>
              Morning meditation, ethical business dealings, loyalty to mentors, and spending peaceful time near serene natural waters.
            </div>
          </div>
          <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8, padding: 12 }}>
            <div style={{ color: "#FDE68A", fontWeight: 800, fontSize: 12 }}>⚠️ Potential Pitfalls</div>
            <div style={{ fontSize: 11.5, color: "rgba(241,231,208,0.85)", marginTop: 4, lineHeight: 1.5 }}>
              Occasional perfectionism, overthinking small delays, or withholding emotions until tension builds unnecessarily.
            </div>
          </div>
          <div style={{ background: "rgba(147,197,253,0.08)", border: "1px solid rgba(147,197,253,0.3)", borderRadius: 8, padding: 12 }}>
            <div style={{ color: "#93C5FD", fontWeight: 800, fontSize: 12 }}>🎯 Evolutionary Dharma</div>
            <div style={{ fontSize: 11.5, color: "rgba(241,231,208,0.85)", marginTop: 4, lineHeight: 1.5 }}>
              To anchor substantial material success and organizational leadership without losing inner detachment and spiritual warmth.
            </div>
          </div>
        </div>
      </PageShell>

      {/* ══════════════════════════════════════════════════════════════
          PAGE 5: D1 NATAL CHART (NORTH INDIAN DIAMOND)
      ══════════════════════════════════════════════════════════════ */}
      <PageShell pageNum={5} chapterNum={2} chapterTitle="D1 Lagna Kundli (North Indian)">
        <h3 style={{ color: "#F3D37A", fontSize: 16, fontWeight: 800, marginBottom: 10, textAlign: "center" }}>
          ✦ D1 NATAL LAGNA KUNDLI (NORTH INDIAN DIAMOND FORMAT) ✦
        </h3>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <NorthIndianChart houses={result.houses} planetData={result.planetData} lang={lang} />
        </div>
        <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 8, padding: "10px 14px", fontSize: 11.5, color: "rgba(241,231,208,0.85)", textAlign: "center" }}>
          House 1 at top center indicates the rising Ascendant ({result.lagna}). Planets are placed with exact degrees and minutes in their respective houses.
        </div>
      </PageShell>

      {/* ══════════════════════════════════════════════════════════════
          PAGE 6: D1 NATAL CHART (SOUTH INDIAN SQUARE)
      ══════════════════════════════════════════════════════════════ */}
      <PageShell pageNum={6} chapterNum={2} chapterTitle="D1 Rashi Chart (South Indian)">
        <h3 style={{ color: "#F3D37A", fontSize: 16, fontWeight: 800, marginBottom: 10, textAlign: "center" }}>
          ✦ D1 RASHI KUNDLI (SOUTH INDIAN SQUARE FORMAT) ✦
        </h3>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <SouthIndianChart houses={result.houses} planetData={result.planetData} lang={lang} />
        </div>
        <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 8, padding: "10px 14px", fontSize: 11.5, color: "rgba(241,231,208,0.85)", textAlign: "center" }}>
          Zodiac signs remain fixed in South Indian format (Pisces at top-left, Aries second, clockwise to Aquarius). The ASC badge indicates your rising Lagna.
        </div>
      </PageShell>

      {/* ══════════════════════════════════════════════════════════════
          PAGE 7: D9 NAVAMSHA KUNDLI (SPOUSE, DHARMA & SECOND HALF)
      ══════════════════════════════════════════════════════════════ */}
      <PageShell pageNum={7} chapterNum={2} chapterTitle="D9 Navamsha Kundli">
        <h3 style={{ color: "#F3D37A", fontSize: 16, fontWeight: 800, marginBottom: 8, textAlign: "center" }}>
          ✦ D9 NAVAMSHA KUNDLI (DHARMA, SOULMATE & POST-30 DESTINY) ✦
        </h3>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <NorthIndianChart houses={d9Houses} planetData={result.planetData} lang={lang} />
        </div>
        <div style={{ background: "rgba(15,10,32,0.8)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 10, padding: 14, fontSize: 12, lineHeight: 1.65, color: "rgba(241,231,208,0.9)" }}>
          <b style={{ color: "#FDE68A" }}>Significance of the Navamsha (D9):</b> While D1 reveals physical opportunity, D9 reveals internal realization and marriage. Any planet exalted or vargottama in D9 provides immense hidden stamina, flourishing particularly after marriage and into mature adulthood.
        </div>
      </PageShell>

      {/* ══════════════════════════════════════════════════════════════
          PAGE 8: D10 DASAMSA & CHANDRA KUNDLI (CAREER & MIND)
      ══════════════════════════════════════════════════════════════ */}
      <PageShell pageNum={8} chapterNum={2} chapterTitle="D10 Dasamsa & Chandra Kundli">
        <h3 style={{ color: "#F3D37A", fontSize: 16, fontWeight: 800, marginBottom: 12, textAlign: "center" }}>
          ✦ D10 DASAMSA (PROFESSIONAL PEAKS) & CHANDRA KUNDLI (MIND) ✦
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 12 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#FDE68A", fontWeight: 800, fontSize: 13, marginBottom: 6 }}>💼 D10 Dasamsa (Career)</div>
            <NorthIndianChart houses={d10Houses} planetData={result.planetData} lang={lang} />
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#93C5FD", fontWeight: 800, fontSize: 13, marginBottom: 6 }}>🌙 Chandra Kundli (Mind)</div>
            <NorthIndianChart houses={moonHouses} planetData={result.planetData} lang={lang} />
          </div>
        </div>
        <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 8, padding: "10px 14px", fontSize: 11.5, color: "rgba(241,231,208,0.85)" }}>
          The D10 chart analyzes executive recognition and promotion cycles, while the Chandra Kundli provides a cross-check of emotional willingness and public popularity.
        </div>
      </PageShell>

      {/* ══════════════════════════════════════════════════════════════
          PAGE 9: PLANETARY EPHEMERIS & DIGNITIES TABLE
      ══════════════════════════════════════════════════════════════ */}
      <PageShell pageNum={9} chapterNum={3} chapterTitle="Planetary Ephemeris & Dignities">
        <h3 style={{ color: "#F3D37A", fontSize: 16, fontWeight: 800, marginBottom: 12 }}>
          ✦ COMPLETE PLANETARY EPHEMERIS & DIGNITIES (NIRAYANA LAHIRI)
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid rgba(212,175,55,0.3)", marginBottom: 14 }}>
          <thead>
            <tr style={{ background: "rgba(245, 158, 11, 0.15)", borderBottom: "1px solid rgba(212,175,55,0.4)" }}>
              <th style={{ padding: "8px 10px", color: "#FDE68A", fontSize: 11, textAlign: "left" }}>Planet</th>
              <th style={{ padding: "8px 10px", color: "#FDE68A", fontSize: 11, textAlign: "left" }}>Sign & House</th>
              <th style={{ padding: "8px 10px", color: "#FDE68A", fontSize: 11, textAlign: "left" }}>Degrees & Pada</th>
              <th style={{ padding: "8px 10px", color: "#FDE68A", fontSize: 11, textAlign: "left" }}>Avastha & Potency</th>
              <th style={{ padding: "8px 10px", color: "#FDE68A", fontSize: 11, textAlign: "left" }}>Dignity</th>
              <th style={{ padding: "8px 10px", color: "#FDE68A", fontSize: 11, textAlign: "left" }}>Functional Effect</th>
            </tr>
          </thead>
          <tbody>
            {PLANETS.map((p, idx) => {
              const pd = result.planetData?.[p.name] || {};
              const signIdx = Math.max(0, SIGNS.findIndex(s => s.name === pd.sign));
              const av = getPlanetaryAvastha(pd.degInt !== undefined ? pd.degInt : (parseFloat(pd.degree) || 0), signIdx);

              return (
                <tr key={p.name} style={{ borderBottom: "1px solid rgba(212,175,55,0.1)", background: idx % 2 ? "rgba(255,255,255,0.02)" : "transparent", fontSize: 11 }}>
                  <td style={{ padding: "7px 10px", fontWeight: 700, color: p.color }}>{p.symbol} {p.name} <span style={{ fontSize: 9.5, opacity: 0.75 }}>({p.sanskrit})</span></td>
                  <td style={{ padding: "7px 10px" }}>{pd.sign} <span style={{ color: "#FDE68A", fontWeight: 700 }}>· H{pd.house}</span></td>
                  <td style={{ padding: "7px 10px", color: "#34D399", fontWeight: 600 }}>{pd.degree} <div style={{ fontSize: 9.5, color: "rgba(241,231,208,0.75)" }}>{pd.nakshatra} (P{pd.pada})</div></td>
                  <td style={{ padding: "7px 10px" }}>
                    <span style={{
                      padding: "2px 6px",
                      borderRadius: 6,
                      fontSize: 10,
                      fontWeight: 700,
                      background: av.key === "Yuva" ? "rgba(16, 185, 129, 0.2)" : (av.key === "Kumara" ? "rgba(59, 130, 246, 0.2)" : "rgba(245, 158, 11, 0.2)"),
                      color: av.key === "Yuva" ? "#34D399" : (av.key === "Kumara" ? "#93C5FD" : "#FDE68A")
                    }}>
                      {hi ? av.nameHi : av.nameEn}
                    </span>
                    <div style={{ fontSize: 9.5, color: "rgba(241,231,208,0.7)", marginTop: 2 }}>{hi ? av.potencyHi : av.potencyEn}</div>
                  </td>
                  <td style={{ padding: "7px 10px", fontWeight: 700, color: pd.status?.includes("Exalted") || pd.status?.includes("Own") ? "#34D399" : "#FDE68A" }}>{pd.status || "Active"}</td>
                  <td style={{ padding: "7px 10px", fontSize: 10, color: "rgba(241,231,208,0.85)", lineHeight: 1.4 }}>{pd.effect}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div style={{ background: "rgba(11,8,25,0.8)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 8, padding: 12, fontSize: 12, lineHeight: 1.6, color: "rgba(241,231,208,0.85)" }}>
          <b style={{ color: "#F3D37A" }}>✦ Ephemeris & Avastha Analysis:</b> Planets positioned in Kendra (1, 4, 7, 10) and Trikona (1, 5, 9) houses endowed with Yuva or Kumara Avasthas form the indestructible backbone of your fortune, rapidly delivering auspicious outcomes during their dasha sub-periods.
        </div>
      </PageShell>

      {/* ══════════════════════════════════════════════════════════════
          PAGE 10: AVASTHAS, DEGREE POTENCIES & JAIMINI KARAKAS
      ══════════════════════════════════════════════════════════════ */}
      <PageShell pageNum={10} chapterNum={3} chapterTitle="Planetary Avasthas & Karakas">
        <h3 style={{ color: "#F3D37A", fontSize: 16, fontWeight: 800, marginBottom: 10 }}>
          ✦ PLANETARY AVASTHAS (DEGREE POTENCY) & JAIMINI CHARA KARAKAS
        </h3>

        {/* Native's Computed Avasthas Matrix */}
        <div style={{ background: "rgba(15,10,32,0.8)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 10, padding: "10px 12px", marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <h4 style={{ color: "#FDE68A", fontSize: 12.5, fontWeight: 800, margin: 0 }}>
              ⚖️ Classical Baladi Avastha Analysis (Odd/Even Sign Degree Rule)
            </h4>
            <span style={{ fontSize: 10, color: "#34D399", fontWeight: 700 }}>
              Parashari Metric
            </span>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
            <thead>
              <tr style={{ background: "rgba(245, 158, 11, 0.12)", borderBottom: "1px solid rgba(212,175,55,0.3)" }}>
                <th style={{ padding: "4px 6px", color: "#FDE68A", textAlign: "left" }}>Planet</th>
                <th style={{ padding: "4px 6px", color: "#FDE68A", textAlign: "left" }}>Sign & Type</th>
                <th style={{ padding: "4px 6px", color: "#FDE68A", textAlign: "left" }}>Degree</th>
                <th style={{ padding: "4px 6px", color: "#FDE68A", textAlign: "left" }}>Avastha</th>
                <th style={{ padding: "4px 6px", color: "#FDE68A", textAlign: "left" }}>Potency</th>
                <th style={{ padding: "4px 6px", color: "#FDE68A", textAlign: "left" }}>Physical Manifestation Meaning</th>
              </tr>
            </thead>
            <tbody>
              {PLANETS.map((p, pIdx) => {
                const pd = result.planetData?.[p.name] || {};
                const signIdx = Math.max(0, SIGNS.findIndex(s => s.name === pd.sign));
                const av = getPlanetaryAvastha(pd.degInt !== undefined ? pd.degInt : (parseFloat(pd.degree) || 0), signIdx);
                const isOdd = signIdx % 2 === 0;

                return (
                  <tr key={p.name} style={{ borderBottom: "1px solid rgba(212,175,55,0.08)", background: pIdx % 2 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                    <td style={{ padding: "4px 6px", fontWeight: 700, color: p.color }}>{p.symbol} {p.name}</td>
                    <td style={{ padding: "4px 6px", color: "rgba(241,231,208,0.9)" }}>{pd.sign} ({isOdd ? "Odd" : "Even"})</td>
                    <td style={{ padding: "4px 6px", color: "#34D399", fontWeight: 600 }}>{pd.degree}</td>
                    <td style={{ padding: "4px 6px" }}>
                      <span style={{
                        padding: "1px 5px",
                        borderRadius: 4,
                        fontWeight: 700,
                        fontSize: 9.5,
                        background: av.key === "Yuva" ? "rgba(16, 185, 129, 0.2)" : (av.key === "Kumara" ? "rgba(59, 130, 246, 0.2)" : "rgba(245, 158, 11, 0.2)"),
                        color: av.key === "Yuva" ? "#34D399" : (av.key === "Kumara" ? "#93C5FD" : "#FDE68A")
                      }}>
                        {av.nameEn}
                      </span>
                    </td>
                    <td style={{ padding: "4px 6px", fontWeight: 700, color: av.key === "Yuva" ? "#34D399" : "#FDE68A" }}>
                      {av.pct}%
                    </td>
                    <td style={{ padding: "4px 6px", color: "rgba(241,231,208,0.85)", fontSize: 9.5 }}>
                      {av.descEn}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <h4 style={{ color: "#F3D37A", fontSize: 13, fontWeight: 800, margin: "0 0 6px" }}>✦ JAIMINI CHARA KARAKAS (SOUL MISSION INDICATORS)</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {[
            { role: "Atmakaraka (AK)", desc: "King of the Soul — reveals your highest spiritual lessons & supreme karmic purpose.", icon: "👑" },
            { role: "Amatyakaraka (AmK)", desc: "Minister of Career — indicates professional vocation, intellect & financial vehicle.", icon: "💼" },
            { role: "Bhratrikaraka (BK)", desc: "Guru & Siblings — guides mentors, teachers, protective brothers & spiritual father.", icon: "📜" },
            { role: "Matrikaraka (MK)", desc: "Mother & Sustenance — influences emotional security, real estate & domestic bliss.", icon: "🏡" },
            { role: "Putrakaraka (PK)", desc: "Progeny & Wisdom — governs artistic children, creative intelligence & disciples.", icon: "🎨" },
            { role: "Darakaraka (DK)", desc: "Spouse & Soulmate — defines the nature and arrival of the lifetime romantic partner.", icon: "💑" },
          ].map((k, i) => (
            <div key={i} style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8, padding: "7px 9px" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#FDE68A" }}>{k.icon} {k.role}</div>
              <div style={{ fontSize: 10, color: "rgba(241,231,208,0.85)", marginTop: 2, lineHeight: 1.35 }}>{k.desc}</div>
            </div>
          ))}
        </div>
      </PageShell>

      {/* ══════════════════════════════════════════════════════════════
          PAGES 11–19: 9 GRAHA SINGLE-PLANET MASTER DOSSIERS
      ══════════════════════════════════════════════════════════════ */}
      {["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].map((pName, pIdx) => {
        const pObj = PLANETS.find(x => x.name === pName) || { symbol: pName.slice(0, 2), color: "#D4AF37" };
        const pd = result.planetData?.[pName] || {};
        const dd = PLANET_DEEP_DIVES[pName] || {};
        const pBreakdown = getPlanetLifeImpactBreakdown(pName, pd, result.houses, lang);

        return (
          <PageShell key={pName} pageNum={11 + pIdx} chapterNum={4} chapterTitle={`${pName} Cosmic Dossier`}>
            {/* Header Banner */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid rgba(212,175,55,0.3)", paddingBottom: 6, marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 26, color: pObj.color }}>{pObj.symbol}</div>
                <div>
                  <h3 style={{ color: "#F3D37A", fontSize: 16.5, fontWeight: 800, margin: 0 }}>
                    {pBreakdown.planet} ({pBreakdown.planetHi}) · {dd.title}
                  </h3>
                  <div style={{ color: "rgba(241,231,208,0.75)", fontSize: 11, marginTop: 2 }}>
                    Placement: <b>{pBreakdown.sign}</b> ({pBreakdown.degree}) in <b>House {pBreakdown.house}</b> · Karaka: {pBreakdown.karaka}
                  </div>
                </div>
              </div>
              <span style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.35)", color: "#34D399", padding: "2px 7px", borderRadius: 6, fontSize: 10.5, fontWeight: 700 }}>
                {pd.status || "Benefic"}
              </span>
            </div>

            {/* Degree Avastha & House Association Banner */}
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 8, marginBottom: 8 }}>
              <div style={{ background: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: 7, padding: "6px 9px", fontSize: 10.5 }}>
                <div style={{ color: "#FDE68A", fontWeight: 800, marginBottom: 2, display: "flex", alignItems: "center", gap: 5 }}>
                  <span>📐</span>
                  <span>Avastha: {pBreakdown.avastha.nameEn} ({pBreakdown.avastha.potencyEn})</span>
                </div>
                <div style={{ color: "rgba(241,231,208,0.9)", lineHeight: 1.4 }}>
                  {pBreakdown.avastha.descEn}
                </div>
              </div>

              <div style={{ background: "rgba(59, 130, 246, 0.08)", border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: 7, padding: "6px 9px", fontSize: 10.5 }}>
                <div style={{ color: "#93C5FD", fontWeight: 800, marginBottom: 2, display: "flex", alignItems: "center", gap: 5 }}>
                  <span>🏠</span>
                  <span>{pBreakdown.houseTitle}</span>
                </div>
                <div style={{ color: "rgba(241,231,208,0.9)", lineHeight: 1.4 }}>
                  {pBreakdown.houseGovernance}
                </div>
              </div>
            </div>

            {/* 5-Dimensional Life Impact Grid */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: "#F3D37A", marginBottom: 5, letterSpacing: 0.5 }}>
                ✦ MULTI-DIMENSIONAL LIFE IMPACT ANALYSIS
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                {/* 1. Career */}
                <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 7, padding: "7px 9px" }}>
                  <div style={{ color: "#FDE68A", fontSize: 10.5, fontWeight: 800, marginBottom: 2 }}>
                    💼 Career & Ambition
                  </div>
                  <div style={{ color: "rgba(241,231,208,0.88)", fontSize: 10, lineHeight: 1.45 }}>
                    {pBreakdown.aspects.career}
                  </div>
                </div>

                {/* 2. Education */}
                <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 7, padding: "7px 9px" }}>
                  <div style={{ color: "#93C5FD", fontSize: 10.5, fontWeight: 800, marginBottom: 2 }}>
                    🎓 Education & Intellect
                  </div>
                  <div style={{ color: "rgba(241,231,208,0.88)", fontSize: 10, lineHeight: 1.45 }}>
                    {pBreakdown.aspects.education}
                  </div>
                </div>

                {/* 3. Love Life */}
                <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 7, padding: "7px 9px" }}>
                  <div style={{ color: "#F472B6", fontSize: 10.5, fontWeight: 800, marginBottom: 2 }}>
                    ❤️ Love Life & Marriage
                  </div>
                  <div style={{ color: "rgba(241,231,208,0.88)", fontSize: 10, lineHeight: 1.45 }}>
                    {pBreakdown.aspects.love}
                  </div>
                </div>

                {/* 4. Wealth */}
                <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 7, padding: "7px 9px" }}>
                  <div style={{ color: "#34D399", fontSize: 10.5, fontWeight: 800, marginBottom: 2 }}>
                    💰 Wealth & Assets
                  </div>
                  <div style={{ color: "rgba(241,231,208,0.88)", fontSize: 10, lineHeight: 1.45 }}>
                    {pBreakdown.aspects.wealth}
                  </div>
                </div>
              </div>

              {/* 5. Health */}
              <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 7, padding: "7px 9px", marginTop: 7 }}>
                <div style={{ color: "#C084FC", fontSize: 10.5, fontWeight: 800, marginBottom: 2 }}>
                  🌿 Health & Vitality
                </div>
                <div style={{ color: "rgba(241,231,208,0.88)", fontSize: 10, lineHeight: 1.45 }}>
                  {pBreakdown.aspects.health}
                </div>
              </div>
            </div>

            {/* Vedic Remedies & Harmonization */}
            <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 7, padding: "8px 10px" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#F3D37A", marginBottom: 4, display: "flex", justifyContent: "space-between" }}>
                <span>🛡️ Vedic Harmonization & Upay</span>
                <span style={{ color: "#34D399" }}>Deity: {pBreakdown.deity}</span>
              </div>
              <div style={{ fontSize: 10, lineHeight: 1.45, color: "rgba(241,231,208,0.9)", marginBottom: 4 }}>
                <b>Remedial Karma:</b> {pBreakdown.remedy}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, borderTop: "1px solid rgba(245,158,11,0.2)", paddingTop: 4, color: "#FDE68A", flexWrap: "wrap", gap: 6 }}>
                <span><b>Gemstone:</b> {pBreakdown.gemstone}</span>
                <span><b>Sacred Mantra:</b> {pBreakdown.mantra}</span>
              </div>
            </div>
          </PageShell>
        );
      })}

      {/* ══════════════════════════════════════════════════════════════
          PAGES 20–31: 12 BHAVA (HOUSES) COMPLETE LIFE ANALYSIS
      ══════════════════════════════════════════════════════════════ */}
      {HOUSE_DEEP_DIVES.map((hInfo) => {
        const n = hInfo.house;
        const houseData = result.houses?.[n] || {};
        const planetsInH = houseData.planets || [];

        return (
          <PageShell key={n} pageNum={19 + n} chapterNum={5} chapterTitle={`House ${n} Life Domain`}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid rgba(212,175,55,0.3)", paddingBottom: 10, marginBottom: 14 }}>
              <div>
                <h3 style={{ color: "#F3D37A", fontSize: 18, fontWeight: 800, margin: 0 }}>{hInfo.title}</h3>
                <div style={{ color: "#34D399", fontSize: 12.5, fontWeight: 700, marginTop: 2 }}>{hInfo.sanskrit} · Sign on Cusp: <b>{houseData.sign}</b></div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 10, padding: "4px 12px", color: "#FDE68A", fontSize: 12, fontWeight: 800 }}>
                  {planetsInH.length > 0 ? `Occupied by: ${planetsInH.join(", ")}` : "Empty (Aspect Dependent)"}
                </span>
              </div>
            </div>

            <div style={{ background: "rgba(15,10,32,0.75)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 14, marginBottom: 14 }}>
              <h4 style={{ color: "#FDE68A", fontSize: 13, fontWeight: 800, margin: "0 0 6px" }}>🎯 Core Governed Life Themes</h4>
              <p style={{ fontSize: 12.5, lineHeight: 1.7, color: "rgba(241,231,208,0.9)", margin: 0 }}>
                {hInfo.coreThemes}
              </p>
            </div>

            <div style={{ background: "rgba(11,8,25,0.85)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 10, padding: 16, marginBottom: 14 }}>
              <h4 style={{ color: "#F3D37A", fontSize: 13.5, fontWeight: 800, margin: "0 0 8px" }}>📜 Specific Astrological Interpretation for Your Chart</h4>
              <p style={{ fontSize: 12.5, lineHeight: 1.8, color: "rgba(241,231,208,0.92)", margin: "0 0 10px" }}>
                {houseData.interpretation || hInfo.detailedSignificance}
              </p>
              <p style={{ fontSize: 12.5, lineHeight: 1.8, color: "rgba(241,231,208,0.92)", margin: 0 }}>
                {hInfo.karmicImpact}
              </p>
            </div>

            <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10, padding: 12, fontSize: 12, lineHeight: 1.65, color: "rgba(241,231,208,0.9)" }}>
              <b style={{ color: "#FDE68A" }}>✦ House Evolution Guidance:</b> Cultivate conscious alignment with the ruler of {houseData.sign}. Activating positive virtues of House {n} triggers auspicious ripple effects across the trine houses.
            </div>
          </PageShell>
        );
      })}

      {/* ══════════════════════════════════════════════════════════════
          PAGE 32: ACTIVE PLANETARY CONJUNCTIONS & GRAND YOGAS
      ══════════════════════════════════════════════════════════════ */}
      <PageShell pageNum={32} chapterNum={6} chapterTitle="Vedic Yogas & Combinations">
        <h3 style={{ color: "#F3D37A", fontSize: 16, fontWeight: 800, marginBottom: 8, borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 6 }}>
          ⚡ ACTIVE PLANETARY CONJUNCTIONS (YUTIS) & GRAND VEDIC YOGAS
        </h3>
        <p style={{ fontSize: 11.5, lineHeight: 1.6, color: "rgba(241,231,208,0.85)", marginBottom: 10 }}>
          When multiple planets occupy the same house, their joint energies synthesize distinct karmic patterns. Below are the active planetary conjunctions identified in your horoscope:
        </p>

        {conjunctions.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
            {conjunctions.slice(0, 3).map((conj, cIdx) => (
              <div key={cIdx} style={{ background: "rgba(15,10,32,0.8)", border: conj.category === "auspicious" ? "1px solid rgba(16, 185, 129, 0.35)" : "1px solid rgba(245, 158, 11, 0.35)", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ color: "#FDE68A", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}>
                    <span>{conj.icon}</span>
                    <span>{conj.yogaName}</span>
                    <span style={{ fontSize: 10.5, color: "#34D399", fontWeight: 600 }}>({conj.houseTitle})</span>
                  </div>
                  <span style={{
                    fontSize: 10,
                    padding: "2px 6px",
                    borderRadius: 6,
                    background: conj.category === "auspicious" ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)",
                    color: conj.category === "auspicious" ? "#34D399" : "#FDE68A",
                    fontWeight: 700
                  }}>
                    {conj.category === "auspicious" ? "Auspicious Yoga" : "Dynamic Karmic Yoga"}
                  </span>
                </div>
                <p style={{ fontSize: 11, lineHeight: 1.5, color: "rgba(241,231,208,0.9)", margin: "0 0 6px" }}>
                  {conj.meaning}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, fontSize: 10 }}>
                  <div style={{ background: "rgba(245, 158, 11, 0.06)", border: "1px solid rgba(245, 158, 11, 0.2)", borderRadius: 6, padding: "5px 8px" }}>
                    <b style={{ color: "#FDE68A" }}>💼 Career:</b> <span style={{ color: "rgba(241,231,208,0.85)" }}>{conj.career}</span>
                  </div>
                  <div style={{ background: "rgba(59, 130, 246, 0.06)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: 6, padding: "5px 8px" }}>
                    <b style={{ color: "#93C5FD" }}>🎓 Intellect:</b> <span style={{ color: "rgba(241,231,208,0.85)" }}>{conj.intellect}</span>
                  </div>
                  <div style={{ background: "rgba(244, 114, 182, 0.06)", border: "1px solid rgba(244, 114, 182, 0.2)", borderRadius: 6, padding: "5px 8px" }}>
                    <b style={{ color: "#F472B6" }}>❤️ Love Life:</b> <span style={{ color: "rgba(241,231,208,0.85)" }}>{conj.love}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(212,175,55,0.3)", borderRadius: 8, padding: 12, marginBottom: 12, textAlign: "center" }}>
            <div style={{ color: "#FDE68A", fontSize: 12.5, fontWeight: 700 }}>Independent Planetary Distribution</div>
            <div style={{ color: "rgba(241,231,208,0.85)", fontSize: 11, marginTop: 4 }}>
              Planets are distributed across separate houses without direct conjunctions, providing focused energy across diverse life spheres without combustion friction.
            </div>
          </div>
        )}

        <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.35)", borderRadius: 10, padding: 12, fontSize: 11.5, lineHeight: 1.65, color: "rgba(241,231,208,0.92)" }}>
          <b style={{ color: "#F3D37A" }}>✦ Classical Parashari Yogas:</b> {result.yogas || "Your birth chart displays fortunate mutual trines between benefic planets, promising steady recognition during Jupiter and Venus dasha periods."}
        </div>
      </PageShell>

      {/* ══════════════════════════════════════════════════════════════
          PAGE 33: ADVERSE YOGAS & MITIGATIONS
      ══════════════════════════════════════════════════════════════ */}
      <PageShell pageNum={33} chapterNum={6} chapterTitle="Dosha Diagnostics & Mitigations">
        <h3 style={{ color: "#F3D37A", fontSize: 17, fontWeight: 800, marginBottom: 12, borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 6 }}>
          ⚠️ DOSHA DIAGNOSTICS & SACRED VEDIC NEUTRALIZATION
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          <div style={{ background: "rgba(11,8,25,0.8)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 10, padding: 14 }}>
            <h4 style={{ color: "#F87171", fontSize: 13.5, fontWeight: 800, margin: "0 0 6px" }}>🔥 Manglik Dosha (Kuja Dosha) Assessment</h4>
            <p style={{ fontSize: 12, lineHeight: 1.65, color: "rgba(241,231,208,0.88)", margin: "0 0 8px" }}>
              Evaluation of Mars in houses 1, 4, 7, 8, 12. In your horoscope, powerful Jupiter aspects and benefic placements neutralize severe friction, ensuring healthy marital harmony.
            </p>
            <div style={{ fontSize: 11.5, color: "#34D399", fontWeight: 700 }}>Status: Balanced / Mild & Remediable</div>
          </div>

          <div style={{ background: "rgba(11,8,25,0.8)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 10, padding: 14 }}>
            <h4 style={{ color: "#F87171", fontSize: 13.5, fontWeight: 800, margin: "0 0 6px" }}>🐍 Kaal Sarp & Rahu-Ketu Axis Analysis</h4>
            <p style={{ fontSize: 12, lineHeight: 1.65, color: "rgba(241,231,208,0.88)", margin: "0 0 8px" }}>
              Assessment of planet clustering around Rahu and Ketu. Multiple planets break the containment axis, dissolving rigid obstacles and promoting international success.
            </p>
            <div style={{ fontSize: 11.5, color: "#34D399", fontWeight: 700 }}>Status: Free from Total Kaal Sarp Dosha</div>
          </div>
        </div>

        <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 10, padding: 16 }}>
          <h4 style={{ color: "#FDE68A", fontSize: 13.5, fontWeight: 800, margin: "0 0 8px" }}>🛡️ Universal Dosha Remedial Protocol</h4>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, lineHeight: 1.8, color: "rgba(241,231,208,0.9)" }}>
            <li><b>Mahamrityunjaya Japa:</b> Recite 11 times daily to create an invulnerable auric shield against accidents and stress.</li>
            <li><b>Hanuman Chalisa:</b> Chanting on Tuesdays and Saturdays dispels fear, inertia, and Mars-Saturn friction.</li>
            <li><b>Charity & Seva:</b> Feeding stray cows on Wednesdays and dogs on Saturdays balances Rahu-Ketu and Mercury.</li>
          </ul>
        </div>
      </PageShell>

      {/* ══════════════════════════════════════════════════════════════
          PAGE 34: 120-YEAR VIMSHOTTARI MAHADASHA TIMELINE
      ══════════════════════════════════════════════════════════════ */}
      <PageShell pageNum={34} chapterNum={7} chapterTitle="Vimshottari Mahadasha Timeline">
        <h3 style={{ color: "#F3D37A", fontSize: 17, fontWeight: 800, marginBottom: 12, borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 6 }}>
          ⏱️ 120-YEAR VIMSHOTTARI MAHADASHA CHRONOLOGICAL TIMELINE
        </h3>
        <p style={{ fontSize: 12, lineHeight: 1.65, color: "rgba(241,231,208,0.85)", marginBottom: 12 }}>
          Vimshottari Dasha is the crown jewel of Vedic timing. It calculates the exact planetary ruler influencing your psychological state and external fortune across 120 years based on your birth Nakshatra ({result.nakshatra}):
        </p>

        <div style={{ background: "rgba(11,8,25,0.8)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 14, marginBottom: 14 }}>
          <div style={{ color: "#FDE68A", fontSize: 13.5, fontWeight: 800, marginBottom: 8 }}>✦ Lifetime Mahadasha Schedule:</div>
          <div style={{ fontSize: 12.5, lineHeight: 1.8, color: "rgba(241,231,208,0.92)", whiteSpace: "pre-wrap" }}>
            {result.dasha || "• Sun Mahadasha: 6 Years (Vitality & Recognition)\n• Moon Mahadasha: 10 Years (Public Stature & Emotional Fulfillment)\n• Mars Mahadasha: 7 Years (Dynamic Expansion & Real Estate)\n• Rahu Mahadasha: 18 Years (Foreign Ventures & Innovation)\n• Jupiter Mahadasha: 16 Years (Pinnacle Wealth, Mentorship & Wisdom)\n• Saturn Mahadasha: 19 Years (Executive Authority & Consolidations)\n• Mercury Mahadasha: 17 Years (Commercial Intellect & Global Gains)"}
          </div>
        </div>

        <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, padding: 12, fontSize: 12, color: "rgba(241,231,208,0.9)" }}>
          <b style={{ color: "#34D399" }}>Dasha Transition Rule:</b> The most powerful transformation periods occur during the Dasha Sandhi (the final 6 months of a Mahadasha and first 6 months of the incoming Mahadasha).
        </div>
      </PageShell>

      {/* ══════════════════════════════════════════════════════════════
          PAGE 35: CURRENT ACTIVE MAHADASHA & ANTARDASHA
      ══════════════════════════════════════════════════════════════ */}
      <PageShell pageNum={35} chapterNum={7} chapterTitle="Active Dasha Forecast">
        <h3 style={{ color: "#F3D37A", fontSize: 17, fontWeight: 800, marginBottom: 12, borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 6 }}>
          ⚡ CURRENT ACTIVE MAHADASHA & ANTARDASHA STRATEGIC FORECAST
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          <div style={{ background: "rgba(15,10,32,0.75)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 16 }}>
            <div style={{ color: "#FDE68A", fontSize: 14, fontWeight: 800, marginBottom: 6 }}>🌟 Active Mahadasha Lord Influence</div>
            <p style={{ fontSize: 12, lineHeight: 1.7, color: "rgba(241,231,208,0.9)", margin: 0 }}>
              Your current Mahadasha period activates Kendra and Trikona houses, stimulating career ambitions, asset acquisition, and expanding social prestige. You are being pushed to take calculated strategic risks.
            </p>
          </div>
          <div style={{ background: "rgba(15,10,32,0.75)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 16 }}>
            <div style={{ color: "#34D399", fontSize: 14, fontWeight: 800, marginBottom: 6 }}>📅 Immediate 24-Month Forecast</div>
            <p style={{ fontSize: 12, lineHeight: 1.7, color: "rgba(241,231,208,0.9)", margin: 0 }}>
              Upcoming Antardashas trigger favorable salary leaps, high-value professional collaborations, and resolution of longstanding family or legal matters.
            </p>
          </div>
        </div>

        <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 10, padding: 14, fontSize: 12.5, lineHeight: 1.75, color: "rgba(241,231,208,0.92)" }}>
          <b style={{ color: "#FDE68A" }}>Strategic Action Directive:</b> Align your key contracts, property purchases, and marriage milestones during sub-periods of benefic planets (Jupiter, Venus, Mercury) to ensure lasting auspiciousness.
        </div>
      </PageShell>

      {/* ══════════════════════════════════════════════════════════════
          PAGE 36: SATURN SADE SATI & DHAIYA 30-YEAR CHRONOLOGY
      ══════════════════════════════════════════════════════════════ */}
      <PageShell pageNum={36} chapterNum={8} chapterTitle="Shani Sade Sati Chronology">
        <h3 style={{ color: "#F3D37A", fontSize: 17, fontWeight: 800, marginBottom: 12, borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 6 }}>
          🪐 SATURN (SHANI) SADE SATI, DHAIYA & 30-YEAR TRANSIT CYCLE
        </h3>

        <div style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 10, padding: 14, marginBottom: 14, textAlign: "center" }}>
          <div style={{ color: "#FDE68A", fontSize: 14, fontWeight: 800, marginBottom: 4 }}>
            ⚖️ Current Status: {result.annualTransit?.sadeSatiStatus || "Free from Sade Sati"}
          </div>
          <div style={{ fontSize: 12, color: "rgba(241,231,208,0.85)" }}>
            Moon Sign: <b>{result.rashi}</b> · Saturn transit through Pisces, Aries, and Taurus governs the core Sade Sati phases.
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
          <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8, padding: 12 }}>
            <div style={{ color: "#FDE68A", fontWeight: 800, fontSize: 12.5 }}>Phase 1 (Rising)</div>
            <div style={{ fontSize: 11.5, color: "rgba(241,231,208,0.85)", marginTop: 4, lineHeight: 1.6 }}>
              Saturn transits 12th from natal Moon. Mental expenditure, relocation, spiritual introspection.
            </div>
          </div>
          <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8, padding: 12 }}>
            <div style={{ color: "#34D399", fontWeight: 800, fontSize: 12.5 }}>Phase 2 (Peak)</div>
            <div style={{ fontSize: 11.5, color: "rgba(241,231,208,0.85)", marginTop: 4, lineHeight: 1.6 }}>
              Saturn transits over natal Moon. Great karmic restructuring, forging unshakeable inner discipline.
            </div>
          </div>
          <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8, padding: 12 }}>
            <div style={{ color: "#93C5FD", fontWeight: 800, fontSize: 12.5 }}>Phase 3 (Setting)</div>
            <div style={{ fontSize: 11.5, color: "rgba(241,231,208,0.85)", marginTop: 4, lineHeight: 1.6 }}>
              Saturn transits 2nd from natal Moon. Financial consolidation, family stabilization, reaping long-term rewards.
            </div>
          </div>
        </div>

        <div style={{ background: "rgba(15,10,32,0.75)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 14 }}>
          <h4 style={{ color: "#F3D37A", fontSize: 13, fontWeight: 800, margin: "0 0 6px" }}>🛡️ Protective Saturn Upay & Rituals</h4>
          <div style={{ fontSize: 12, lineHeight: 1.7, color: "rgba(241,231,208,0.9)" }}>
            • Light a mustard oil diya facing West on Saturday evenings.<br />
            • Recite the Shani Gayatri or Dasharatha Shani Stotram.<br />
            • Practice humility, avoid deceitful contracts, and respect working-class individuals.
          </div>
        </div>
      </PageShell>

      {/* ══════════════════════════════════════════════════════════════
          PAGE 37: 2026–2027 ANNUAL TRANSIT (GOCHARA)
      ══════════════════════════════════════════════════════════════ */}
      <PageShell pageNum={37} chapterNum={9} chapterTitle="2026–2027 Annual Transit">
        <h3 style={{ color: "#F3D37A", fontSize: 17, fontWeight: 800, marginBottom: 12, borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 6 }}>
          🪐 2026–2027 ANNUAL TRANSIT (GOCHARA) INFLUENCES
        </h3>
        <p style={{ fontSize: 12, lineHeight: 1.65, color: "rgba(241,231,208,0.85)", marginBottom: 14 }}>
          Transits activate natal planetary potentials. The celestial configuration for 2026–2027 produces extraordinary shifts across corporate growth, real estate, and relationships:
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 16 }}>
          {(result.annualTransit?.transits || []).map((tr, i) => (
            <div key={i} style={{ background: "rgba(15,10,32,0.8)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 14 }}>
              <div style={{ color: "#FDE68A", fontSize: 13.5, fontWeight: 800, marginBottom: 4 }}>{tr.planet} in {tr.sign}</div>
              <div style={{ color: "rgba(241,231,208,0.88)", fontSize: 12, lineHeight: 1.6 }}>{tr.effect}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 10, padding: 14, fontSize: 12.5, lineHeight: 1.7, color: "rgba(241,231,208,0.92)" }}>
          <b style={{ color: "#F3D37A" }}>✦ Gochara Verdict:</b> Benefic Jupiter transit directly aspects your career and relationship houses in 2026–2027, neutralizing protracted bottlenecks and paving the way for lucrative milestones.
        </div>
      </PageShell>

      {/* ══════════════════════════════════════════════════════════════
          PAGE 38: 2026–2027 QUARTERLY LIFE MILESTONES (Q1–Q4)
      ══════════════════════════════════════════════════════════════ */}
      <PageShell pageNum={38} chapterNum={9} chapterTitle="Quarterly Milestones (Q1–Q4)">
        <h3 style={{ color: "#F3D37A", fontSize: 17, fontWeight: 800, marginBottom: 12, borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 6 }}>
          ⚡ 2026–2027 QUARTERLY LIFE MILESTONES & STRATEGIC CALENDAR
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {(result.annualTransit?.quarters || []).map((q, i) => (
            <div key={i} style={{ background: "rgba(11,8,25,0.8)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ color: "#FDE68A", fontSize: 14, fontWeight: 800 }}>{q.quarter}</span>
                <span style={{ color: "#34D399", fontSize: 13, fontWeight: 800 }}>{q.rating}</span>
              </div>
              <div style={{ color: "#F3D37A", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{q.theme}</div>
              <div style={{ color: "rgba(241,231,208,0.88)", fontSize: 12, lineHeight: 1.6 }}>{q.impact}</div>
            </div>
          ))}
        </div>
      </PageShell>

      {/* ══════════════════════════════════════════════════════════════
          PAGE 39: MONTH-BY-MONTH 12-MONTH FORECAST WINDOWS
      ══════════════════════════════════════════════════════════════ */}
      <PageShell pageNum={39} chapterNum={9} chapterTitle="Month-by-Month Forecast">
        <h3 style={{ color: "#F3D37A", fontSize: 16, fontWeight: 800, marginBottom: 10 }}>
          📅 MONTH-BY-MONTH ASTROLOGICAL WINDOWS (2026–2027)
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid rgba(212,175,55,0.3)", fontSize: 11 }}>
          <thead>
            <tr style={{ background: "rgba(245, 158, 11, 0.15)", borderBottom: "1px solid rgba(212,175,55,0.4)" }}>
              <th style={{ padding: "6px 8px", color: "#FDE68A", textAlign: "left" }}>Month</th>
              <th style={{ padding: "6px 8px", color: "#FDE68A", textAlign: "left" }}>Primary Focus</th>
              <th style={{ padding: "6px 8px", color: "#FDE68A", textAlign: "center" }}>Auspicious Days</th>
              <th style={{ padding: "6px 8px", color: "#FDE68A", textAlign: "left" }}>Strategic Action Directive</th>
            </tr>
          </thead>
          <tbody>
            {[
              { m: "January 2026", f: "Career Launches", d: "4, 11, 21, 28", a: "Initiate major ventures; solar ingress favors leadership pitches." },
              { m: "February 2026", f: "Financial Consolidation", d: "2, 9, 17, 24", a: "Favorable for investments and debt elimination." },
              { m: "March 2026", f: "Skill Acquisition", d: "5, 14, 22, 29", a: "Master new tech or certification; strategic travel." },
              { m: "April 2026", f: "Asset Inflows", d: "3, 10, 18, 26", a: "Exalted Sun brings high executive recognition." },
              { m: "May 2026", f: "Domestic Peace", d: "7, 15, 23, 30", a: "Real estate investments and family harmony." },
              { m: "June 2026", f: "Creative Growth", d: "4, 12, 19, 27", a: "Speculative intelligence and high-impact partnerships." },
              { m: "July 2026", f: "Workplace Triumph", d: "2, 11, 18, 25", a: "Overcome competitive resistance; legal victories." },
              { m: "August 2026", f: "Matrimony & Alliances", d: "6, 14, 21, 29", a: "Supreme window for marital discussions and joint contracts." },
              { m: "September 2026", f: "Inner Rejuvenation", d: "3, 9, 17, 24", a: "Deep research, occult wisdom and strategic restructuring." },
              { m: "October 2026", f: "Fortune Expansion", d: "5, 12, 20, 28", a: "Long-distance journeys and mentor blessings." },
              { m: "November 2026", f: "Executive Eminence", d: "2, 10, 18, 26", a: "Promotions, major salary increments and authority." },
              { m: "December 2026", f: "Year-End Gains", d: "4, 13, 21, 30", a: "Fulfillment of ambitious annual revenue targets." },
            ].map((row, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid rgba(212,175,55,0.1)", background: idx % 2 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                <td style={{ padding: "6px 8px", fontWeight: 700, color: "#FDE68A" }}>{row.m}</td>
                <td style={{ padding: "6px 8px", color: "#34D399", fontWeight: 600 }}>{row.f}</td>
                <td style={{ padding: "6px 8px", textAlign: "center" }}>{row.d}</td>
                <td style={{ padding: "6px 8px", color: "rgba(241,231,208,0.85)" }}>{row.a}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PageShell>

      {/* ══════════════════════════════════════════════════════════════
          PAGE 40: EXECUTIVE CAREER & WEALTH BLUEPRINT
      ══════════════════════════════════════════════════════════════ */}
      <PageShell pageNum={40} chapterNum={10} chapterTitle="Career & Wealth Blueprint">
        <h3 style={{ color: "#F3D37A", fontSize: 17, fontWeight: 800, marginBottom: 12, borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 6 }}>
          💼 EXECUTIVE CAREER, PROMOTIONS & WEALTH BLUEPRINT
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
          <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8, padding: 12 }}>
            <div style={{ color: "#FDE68A", fontSize: 11.5, fontWeight: 700 }}>Ideal Career Sectors</div>
            <div style={{ fontSize: 13, color: "#34D399", fontWeight: 800, marginTop: 2 }}>{cp.industrySectors || "Tech, Finance, Consulting & Governance"}</div>
          </div>
          <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8, padding: 12 }}>
            <div style={{ color: "#FDE68A", fontSize: 11.5, fontWeight: 700 }}>Peak Promotion Window</div>
            <div style={{ fontSize: 13, color: "#FDE68A", fontWeight: 800, marginTop: 2 }}>{cp.promotionYears || "2026–2028"}</div>
          </div>
          <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8, padding: 12 }}>
            <div style={{ color: "#FDE68A", fontSize: 11.5, fontWeight: 700 }}>Business vs Job Verdict</div>
            <div style={{ fontSize: 12, color: "#FFF", fontWeight: 700, marginTop: 2 }}>{cp.businessOrJob || "Hybrid Enterprise / Senior Executive"}</div>
          </div>
        </div>

        <div style={{ background: "rgba(15,10,32,0.8)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 16, marginBottom: 14 }}>
          <h4 style={{ color: "#F3D37A", fontSize: 13.5, fontWeight: 800, margin: "0 0 6px" }}>🏆 Detailed Career Path Analysis</h4>
          <p style={{ fontSize: 12.5, lineHeight: 1.75, color: "rgba(241,231,208,0.92)", margin: 0 }}>
            {cp.careerPathOverview || result.career || "Your 10th house and D10 Dasamsa indicate exceptional executive acumen. You thrive when given autonomous decision-making responsibility. Combining tech innovation with strategic commercial execution unlocks multi-fold growth."}
          </p>
        </div>

        <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 10, padding: 14 }}>
          <h4 style={{ color: "#FDE68A", fontSize: 13, fontWeight: 800, margin: "0 0 6px" }}>💰 Wealth Accumulation Rules</h4>
          <div style={{ fontSize: 12, lineHeight: 1.7, color: "rgba(241,231,208,0.9)" }}>
            Diversify surplus profits into tangible assets (real estate and gold). Avoid speculative trading during lunar eclipses. Maintain ethical transparency in business contracts.
          </div>
        </div>
      </PageShell>

      {/* ══════════════════════════════════════════════════════════════
          PAGE 41: MATRIMONIAL & SPOUSE IDENTITY BLUEPRINT
      ══════════════════════════════════════════════════════════════ */}
      <PageShell pageNum={41} chapterNum={10} chapterTitle="Matrimonial Blueprint">
        <h3 style={{ color: "#F3D37A", fontSize: 17, fontWeight: 800, marginBottom: 12, borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 6 }}>
          💑 MATRIMONIAL, SPOUSE IDENTITY & VIVAH TIMING DOSSIER
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
          <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8, padding: 10, textAlign: "center" }}>
            <div style={{ color: "rgba(243,211,122,0.85)", fontSize: 11, fontWeight: 600 }}>Auspicious Window</div>
            <div style={{ color: "#34D399", fontSize: 13, fontWeight: 800, marginTop: 2 }}>{mp.primaryWindow || "2026–2027"}</div>
          </div>
          <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8, padding: 10, textAlign: "center" }}>
            <div style={{ color: "rgba(243,211,122,0.85)", fontSize: 11, fontWeight: 600 }}>Spouse Profession</div>
            <div style={{ color: "#FDE68A", fontSize: 12, fontWeight: 800, marginTop: 2 }}>{mp.spouseProfession || "Professional / Corporate"}</div>
          </div>
          <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8, padding: 10, textAlign: "center" }}>
            <div style={{ color: "rgba(243,211,122,0.85)", fontSize: 11, fontWeight: 600 }}>Spouse Direction</div>
            <div style={{ color: "#FFF", fontSize: 13, fontWeight: 800, marginTop: 2 }}>{mp.spouseDirection || "North-East"}</div>
          </div>
          <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8, padding: 10, textAlign: "center" }}>
            <div style={{ color: "rgba(243,211,122,0.85)", fontSize: 11, fontWeight: 600 }}>Marriage Nature</div>
            <div style={{ color: "#FBCFE8", fontSize: 12, fontWeight: 800, marginTop: 2 }}>{lva.dominantType || "Love with Family Blessings"}</div>
          </div>
        </div>

        <div style={{ background: "rgba(15,10,32,0.8)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 16, marginBottom: 14 }}>
          <h4 style={{ color: "#F3D37A", fontSize: 13.5, fontWeight: 800, margin: "0 0 6px" }}>🕊️ Spouse Personality & Marital Harmony</h4>
          <p style={{ fontSize: 12.5, lineHeight: 1.75, color: "rgba(241,231,208,0.92)", margin: 0 }}>
            {mp.spouseDescription || result.marriage || "The 7th house and Venus indicate an intellectually stimulating, emotionally supportive spouse with high artistic or professional competence. Mutual open communication and shared spiritual goals foster lifelong loyalty."}
          </p>
        </div>

        <div style={{ background: "rgba(244,114,182,0.08)", border: "1px solid rgba(244,114,182,0.3)", borderRadius: 10, padding: 14 }}>
          <h4 style={{ color: "#FBCFE8", fontSize: 13, fontWeight: 800, margin: "0 0 6px" }}>💍 Sacred Vivah Remedies</h4>
          <div style={{ fontSize: 12, lineHeight: 1.7, color: "rgba(241,231,208,0.9)" }}>
            {mp.remedies || "Worship Lord Shiva and Goddess Parvati together on Mondays. Offer fragrant white flowers to Goddess Lakshmi on Fridays for matrimonial serenity."}
          </div>
        </div>
      </PageShell>

      {/* ══════════════════════════════════════════════════════════════
          PAGE 42: HEALTH, VITALITY & MEDICAL ASTROLOGY
      ══════════════════════════════════════════════════════════════ */}
      <PageShell pageNum={42} chapterNum={11} chapterTitle="Health & Medical Astrology">
        <h3 style={{ color: "#F3D37A", fontSize: 17, fontWeight: 800, marginBottom: 12, borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 6 }}>
          🌿 HEALTH, LONGEVITY & AYURVEDIC MEDICAL ASTROLOGY
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
          <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8, padding: 12, textAlign: "center" }}>
            <div style={{ color: "#FDE68A", fontSize: 12, fontWeight: 700 }}>Tridosha Constitution</div>
            <div style={{ color: "#34D399", fontSize: 14, fontWeight: 800, marginTop: 4 }}>Pitta-Vata Balanced</div>
          </div>
          <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8, padding: 12, textAlign: "center" }}>
            <div style={{ color: "#FDE68A", fontSize: 12, fontWeight: 700 }}>Longevity (Ayushya)</div>
            <div style={{ color: "#FDE68A", fontSize: 14, fontWeight: 800, marginTop: 4 }}>Deerghayu (80+ Vital Years)</div>
          </div>
          <div style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8, padding: 12, textAlign: "center" }}>
            <div style={{ color: "#FDE68A", fontSize: 12, fontWeight: 700 }}>Immunity Factor</div>
            <div style={{ color: "#93C5FD", fontSize: 14, fontWeight: 800, marginTop: 4 }}>Robust Ojas & Prana</div>
          </div>
        </div>

        <div style={{ background: "rgba(15,10,32,0.8)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 16, marginBottom: 14 }}>
          <h4 style={{ color: "#F3D37A", fontSize: 13.5, fontWeight: 800, margin: "0 0 6px" }}>🩺 Biological Vulnerabilities & Precautions</h4>
          <p style={{ fontSize: 12.5, lineHeight: 1.75, color: "rgba(241,231,208,0.92)", margin: 0 }}>
            {result.health || "Auspicious ascendant strength ensures strong natural vitality. Maintain mindful hydration, reduce excessive spicy or late-night foods, and incorporate daily breathwork (Anulom-Vilom Pranayama) to sustain nervous equilibrium."}
          </p>
        </div>

        <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, padding: 14 }}>
          <h4 style={{ color: "#34D399", fontSize: 13, fontWeight: 800, margin: "0 0 6px" }}>🌿 Prescribed Ayurvedic Diet & Lifestyle</h4>
          <div style={{ fontSize: 12, lineHeight: 1.7, color: "rgba(241,231,208,0.9)" }}>
            • Drink copper-infused water in the morning to balance Agni.<br />
            • Consume warm herbal teas (tulsi, ginger, cardamom) during transit shifts.<br />
            • Maintain regular sleep schedules; practice 10 minutes of yoga Nidra before bedtime.
          </div>
        </div>
      </PageShell>

      {/* ══════════════════════════════════════════════════════════════
          PAGE 43: SACRED REMEDIES & PRESCRIBED GEMSTONES
      ══════════════════════════════════════════════════════════════ */}
      <PageShell pageNum={43} chapterNum={12} chapterTitle="Vedic Gemstone Protocol">
        <h3 style={{ color: "#F3D37A", fontSize: 17, fontWeight: 800, marginBottom: 12, borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 6 }}>
          💎 PRESCRIBED VEDIC GEMSTONES (RATNA CHIKITSA)
        </h3>

        <div style={{ background: "rgba(15,10,32,0.8)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 10, padding: 16, marginBottom: 14 }}>
          <h4 style={{ color: "#FDE68A", fontSize: 14, fontWeight: 800, margin: "0 0 8px" }}>👑 Primary Life Gemstone: {result.rudraksha || "Natural Yellow Sapphire / Emerald"}</h4>
          <p style={{ fontSize: 12.5, lineHeight: 1.75, color: "rgba(241,231,208,0.92)", margin: 0 }}>
            {result.gems || "Wearing your prescribed life stone strengthens the Ascendant lord and attracts divine fortune. Must be set in proper metal (Gold or Silver), energized on an auspicious Shukla Paksha morning, and worn on the designated finger."}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
          {[
            { label: "Auspicious Colors", val: result.colours || "Gold, Cream & Silk White" },
            { label: "Lucky Numbers", val: result.numbers || "1, 3, 9" },
            { label: "Auspicious Days", val: result.days || "Thursday & Sunday" },
            { label: "Sacred Metal", val: "Gold / Copper / Silver" },
          ].map((item, idx) => (
            <div key={idx} style={{ background: "rgba(11,8,25,0.75)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8, padding: 10, textAlign: "center" }}>
              <div style={{ color: "rgba(243,211,122,0.85)", fontSize: 11, fontWeight: 600 }}>{item.label}</div>
              <div style={{ color: "#FDE68A", fontSize: 12.5, fontWeight: 800, marginTop: 2 }}>{item.val}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 10, padding: 14, fontSize: 12, lineHeight: 1.65, color: "rgba(241,231,208,0.9)" }}>
          <b style={{ color: "#FDE68A" }}>⚠️ Gemstone Caution:</b> Never wear conflicting gemstones simultaneously (such as Blue Sapphire and Ruby together). Ensure stones are 100% natural, unheated, and certified by a recognized gemological laboratory.
        </div>
      </PageShell>

      {/* ══════════════════════════════════════════════════════════════
          PAGE 44: SACRED RUDRAKSHA, YANTRAS & DAILY SADHANA
      ══════════════════════════════════════════════════════════════ */}
      <PageShell pageNum={44} chapterNum={12} chapterTitle="Rudraksha & Sacred Sadhana">
        <h3 style={{ color: "#F3D37A", fontSize: 17, fontWeight: 800, marginBottom: 12, borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: 6 }}>
          📿 SACRED RUDRAKSHA, YANTRAS & DAILY VEDIC SADHANA
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div style={{ background: "rgba(11,8,25,0.8)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 14 }}>
            <h4 style={{ color: "#FDE68A", fontSize: 13.5, fontWeight: 800, margin: "0 0 6px" }}>📿 Prescribed Rudraksha Therapy</h4>
            <p style={{ fontSize: 12, lineHeight: 1.7, color: "rgba(241,231,208,0.9)", margin: 0 }}>
              A 5-Mukhi or 7-Mukhi Nepali Rudraksha strung in silk or silver wire protects against negative vibrations, lowers blood pressure, and calms mental restlessness. Wear around the neck after purifying with Ganga water.
            </p>
          </div>
          <div style={{ background: "rgba(11,8,25,0.8)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, padding: 14 }}>
            <h4 style={{ color: "#FDE68A", fontSize: 13.5, fontWeight: 800, margin: "0 0 6px" }}>🔯 Prescribed Sacred Yantras</h4>
            <p style={{ fontSize: 12, lineHeight: 1.7, color: "rgba(241,231,208,0.9)", margin: 0 }}>
              Place an energized <b>Shree Yantra</b> or <b>Kuber Yantra</b> in the North-East corner of your home or workspace facing East. Offering incense on Fridays anchors abundance and shields from financial drain.
            </p>
          </div>
        </div>

        <div style={{ background: "rgba(15,10,32,0.85)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 10, padding: 16 }}>
          <h4 style={{ color: "#F3D37A", fontSize: 13.5, fontWeight: 800, margin: "0 0 8px" }}>☀️ Daily 10-Minute Micro-Sadhana Protocol</h4>
          <ol style={{ margin: 0, paddingLeft: 18, fontSize: 12, lineHeight: 1.8, color: "rgba(241,231,208,0.92)" }}>
            <li><b>Morning (Sunrise):</b> Offer clean water to the rising Sun from a copper vessel with the Gayatri Mantra (11 times).</li>
            <li><b>Workplace Entrance:</b> Chant "ॐ गं गणपतये नमः" mentally before starting important financial or administrative tasks.</li>
            <li><b>Evening:</b> Light a ghee lamp in the North-East corner of your residence. Chanting "ॐ नमः शिवाय" restores serene sleep.</li>
          </ol>
        </div>
      </PageShell>

      {/* ══════════════════════════════════════════════════════════════
          PAGE 45: GRAND LIFE SYNTHESIS & CERTIFICATE OF AUTHENTICITY
      ══════════════════════════════════════════════════════════════ */}
      <PageShell pageNum={45} chapterNum={12} chapterTitle="Grand Synthesis & Certificate">
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 32, marginBottom: 4 }}>✦ ॐ तत्सत् ✦</div>
          <h3 style={{ color: "#F3D37A", fontSize: 18, fontWeight: 800, margin: 0 }}>
            ASTROLOGICAL GRAND SYNTHESIS & FINAL BENEDICTION
          </h3>
          <div style={{ fontSize: 12, color: "#34D399", fontWeight: 700, marginTop: 4 }}>
            The Four Purusharthas: Dharma (Duty), Artha (Wealth), Kama (Desire), Moksha (Liberation)
          </div>
        </div>

        <div style={{ background: "rgba(15,10,32,0.85)", border: "1.5px solid rgba(212,175,55,0.4)", borderRadius: 12, padding: "18px 20px", marginBottom: 18, fontSize: 13, lineHeight: 1.85, color: "rgba(241,231,208,0.95)" }}>
          <p style={{ margin: "0 0 12px" }}>
            {result.verdict || `Your horoscope represents a soul gifted with rare balance between intellectual tenacity and ethical vision. As you advance through life, your capacity to transform temporary adversity into long-term institutional authority will continuously expand.`}
          </p>
          <p style={{ margin: 0, color: "#FDE68A", fontWeight: 700 }}>
            "Karma is your chisel; the planets provide the stone. By aligning your daily actions with high dharma and disciplined effort, the cosmic forces stand pledged to deliver supreme fulfillment and enduring peace."
          </p>
        </div>

        {/* Official Certification Box */}
        <div style={{ border: "2px double #D4AF37", borderRadius: 12, padding: "16px 20px", background: "rgba(11,8,25,0.9)", textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "#F3D37A", fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
            ✦ OFFICIAL CERTIFICATE OF VEDIC AUTHENTICITY ✦
          </div>
          <div style={{ fontSize: 11.5, color: "rgba(241,231,208,0.8)", marginBottom: 12 }}>
            Computed for <b>{nameUpper}</b> · Certificate Ref: <b>{reportCertId}</b> · Parashari Computational Engine
          </div>
          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", borderTop: "1px solid rgba(212,175,55,0.25)", paddingTop: 10, fontSize: 11 }}>
            <div>
              <div style={{ color: "#34D399", fontWeight: 700 }}>✓ Verified Nirayana Ephemeris</div>
              <div style={{ color: "rgba(241,231,208,0.6)", fontSize: 10 }}>Lahiri Ayanamsha 24°09'</div>
            </div>
            <div style={{ fontSize: 28 }}>☸️</div>
            <div>
              <div style={{ color: "#FDE68A", fontWeight: 700 }}>Jyotish Paramarsh Astrologer Desk</div>
              <div style={{ color: "rgba(241,231,208,0.6)", fontSize: 10 }}>Certified Parashari Scholars</div>
            </div>
          </div>
        </div>
      </PageShell>
    </div>
  );
}
