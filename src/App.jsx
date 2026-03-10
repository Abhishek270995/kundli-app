import { useState, useEffect, useRef } from "react";

const SECTIONS = [
  { id: "overview", label: "✦ Overview", icon: "🌟" },
  { id: "planets", label: "✦ Planets", icon: "🪐" },
  { id: "life", label: "✦ Life Areas", icon: "🌿" },
  { id: "predictions", label: "✦ Predictions", icon: "🔮" },
  { id: "lifestyle", label: "✦ Lifestyle", icon: "☯️" },
  { id: "remedies", label: "✦ Remedies", icon: "💎" },
  { id: "longevity", label: "✦ Longevity", icon: "⏳" },
];

const StarField = () => {
  const stars = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 4,
    duration: 2 + Math.random() * 3,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {stars.map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: `rgba(255,220,150,${0.3 + Math.random() * 0.5})`,
            animation: `twinkle ${s.duration}s ${s.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
};

const MandalaSpinner = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, padding: "60px 0" }}>
    <div style={{ position: "relative", width: 120, height: 120 }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: i * 15,
            border: `2px solid rgba(212,175,55,${0.8 - i * 0.2})`,
            borderRadius: "50%",
            animation: `spin ${3 + i}s linear infinite ${i % 2 ? "reverse" : ""}`,
            borderTopColor: "transparent",
          }}
        />
      ))}
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 32,
        animation: "pulse 2s ease-in-out infinite"
      }}>🔯</div>
    </div>
    <p style={{ color: "#d4af37", fontFamily: "'Cinzel', serif", fontSize: 14, letterSpacing: 3, textAlign: "center" }}>
      CONSULTING THE COSMOS...
    </p>
  </div>
);

const SectionBlock = ({ title, content, icon }) => (
  <div style={{
    background: "linear-gradient(135deg, rgba(20,10,40,0.9) 0%, rgba(10,5,30,0.95) 100%)",
    border: "1px solid rgba(212,175,55,0.3)",
    borderRadius: 16,
    padding: "28px 32px",
    marginBottom: 24,
    position: "relative",
    overflow: "hidden",
    backdropFilter: "blur(10px)",
  }}>
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 2,
      background: "linear-gradient(90deg, transparent, #d4af37, transparent)",
    }} />
    <h3 style={{
      fontFamily: "'Cinzel Decorative', serif",
      color: "#d4af37",
      fontSize: 16,
      marginBottom: 18,
      display: "flex",
      alignItems: "center",
      gap: 10,
      letterSpacing: 2,
    }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      {title}
    </h3>
    <div style={{
      color: "rgba(230,210,180,0.9)",
      fontFamily: "'EB Garamond', serif",
      fontSize: 16,
      lineHeight: 1.9,
      whiteSpace: "pre-wrap",
    }}>
      {content}
    </div>
  </div>
);

const TabNav = ({ activeSection, setActiveSection }) => (
  <div style={{
    display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 40,
  }}>
    {SECTIONS.map((s) => (
      <button
        key={s.id}
        onClick={() => setActiveSection(s.id)}
        style={{
          background: activeSection === s.id
            ? "linear-gradient(135deg, #d4af37, #8b6914)"
            : "rgba(212,175,55,0.08)",
          border: `1px solid ${activeSection === s.id ? "#d4af37" : "rgba(212,175,55,0.3)"}`,
          color: activeSection === s.id ? "#0a0520" : "#d4af37",
          fontFamily: "'Cinzel', serif",
          fontSize: 11,
          letterSpacing: 1.5,
          padding: "8px 16px",
          borderRadius: 30,
          cursor: "pointer",
          transition: "all 0.3s ease",
          fontWeight: activeSection === s.id ? 700 : 400,
        }}
      >
        {s.icon} {s.label.replace("✦ ", "")}
      </button>
    ))}
  </div>
);

const KundliChart = ({ name }) => {
  const houses = Array.from({ length: 12 }, (_, i) => i + 1);
  const planets = ["☉", "☽", "♂", "♃", "♄", "♀", "☿", "⚷", "☊"];

  return (
    <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
      <div style={{
        position: "relative", width: 280, height: 280,
        border: "2px solid rgba(212,175,55,0.6)",
        background: "rgba(10,5,30,0.8)",
        transform: "rotate(45deg)",
      }}>
        {/* Inner diamond */}
        <div style={{
          position: "absolute", inset: 70, border: "1px solid rgba(212,175,55,0.4)",
        }} />
        {/* Cross lines */}
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "rgba(212,175,55,0.4)" }} />
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "rgba(212,175,55,0.4)" }} />
        <div style={{ position: "absolute", top: "25%", left: 0, right: 0, height: 1, background: "rgba(212,175,55,0.2)" }} />
        <div style={{ position: "absolute", top: "75%", left: 0, right: 0, height: 1, background: "rgba(212,175,55,0.2)" }} />
        <div style={{ position: "absolute", left: "25%", top: 0, bottom: 0, width: 1, background: "rgba(212,175,55,0.2)" }} />
        <div style={{ position: "absolute", left: "75%", top: 0, bottom: 0, width: 1, background: "rgba(212,175,55,0.2)" }} />

        {/* Center Om symbol */}
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center",
          justifyContent: "center", transform: "rotate(-45deg)", fontSize: 28, color: "#d4af37",
        }}>ॐ</div>

        {/* House numbers */}
        {[
          { h: 1, top: "50%", left: "50%", tx: "-50%", ty: "-50%" },
          { h: 2, top: "25%", left: "50%", tx: "-50%", ty: "-50%" },
          { h: 3, top: "12%", left: "75%", tx: "-50%", ty: "-50%" },
          { h: 4, top: "50%", left: "75%", tx: "-50%", ty: "-50%" },
          { h: 5, top: "88%", left: "75%", tx: "-50%", ty: "-50%" },
          { h: 6, top: "75%", left: "50%", tx: "-50%", ty: "-50%" },
          { h: 7, top: "50%", left: "50%", tx: "-50%", ty: "50%" },
          { h: 8, top: "75%", left: "25%", tx: "-50%", ty: "-50%" },
          { h: 9, top: "88%", left: "25%", tx: "-50%", ty: "-50%" },
          { h: 10, top: "50%", left: "25%", tx: "-50%", ty: "-50%" },
          { h: 11, top: "12%", left: "25%", tx: "-50%", ty: "-50%" },
          { h: 12, top: "25%", left: "50%", tx: "50%", ty: "-50%" },
        ].map(({ h, top, left, tx, ty }) => (
          <div key={h} style={{
            position: "absolute", top, left,
            transform: `translate(${tx}, ${ty}) rotate(-45deg)`,
            color: "rgba(212,175,55,0.5)", fontSize: 9, fontFamily: "'Cinzel', serif",
          }}>{h}</div>
        ))}
      </div>
    </div>
  );
};

export default function KundliApp() {
  const [form, setForm] = useState({ name: "", dob: "", pob: "", tob: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [error, setError] = useState("");
  const resultRef = useRef(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const generateKundli = async () => {
    if (!form.name || !form.dob || !form.pob) {
      setError("Please fill in Name, Date of Birth, and Place of Birth.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    const prompt = `You are an expert Vedic astrologer. Generate a detailed Kundli reading for:
Name: ${form.name}
Date of Birth: ${form.dob}
Place of Birth: ${form.pob}
Time of Birth: ${form.tob || "12:00"}

Return ONLY a JSON object with these keys, each value being 2-3 sentences:
{
  "overview": "Sun sign, Moon sign, Rising sign and overall cosmic personality",
  "planets": "Key planetary positions and their main influences",
  "health": "Health tendencies and recommendations",
  "wealth": "Wealth potential and financial guidance",
  "education": "Educational aptitude and best fields",
  "career": "Best career paths and peak years",
  "marriage": "Marriage timing and spouse nature",
  "children": "Children prospects",
  "predictions": "Key life predictions by decade 0-10, 10-20, 20-30, 30-40, 40-50, 50+",
  "lifestyle_adopt": "Habits and practices to adopt",
  "lifestyle_avoid": "Things to avoid",
  "favourable_colours": "Lucky colours with reasons",
  "favourable_numbers": "Lucky numbers with reasons",
  "favourable_days": "Auspicious days of week",
  "gemstones": "Recommended gemstones and how to wear",
  "rudraksha": "Recommended Rudraksha beads",
  "mantras": "Key mantras to chant",
  "longevity": "Life expectancy and vitality assessment",
  "spiritual_path": "Dharmic path and soul purpose",
  "summary_verdict": "Final cosmic advice and life mission"
}
Return ONLY valid JSON, no markdown, no backticks.`;

    try {
      const response = await fetch("/api/claude-proxy", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          system: "You are an expert Vedic and Western astrologer. Return only valid JSON with no markdown formatting, no backticks, no code blocks. Just raw JSON.",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const raw = data.content.map((b) => b.text || "").join("");
      const cleaned = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      setResult(parsed);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      setError("The cosmos whispered too softly. Please try again.");
    }
    setLoading(false);
  };

  const sectionContent = result ? {
    overview: { title: "Cosmic Blueprint", icon: "🌟", content: result.overview },
    planets: { title: "Planetary Positions & Influences", icon: "🪐", content: result.planets },
    life: null,
    predictions: { title: "Life Predictions — Decade by Decade", icon: "🔮", content: result.predictions },
    lifestyle: null,
    remedies: null,
    longevity: { title: "Longevity & Vitality", icon: "⏳", content: result.longevity },
  } : {};

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0520 0%, #050215 40%, #0d0828 70%, #08041a 100%)",
      color: "#e6d4b0",
      fontFamily: "'EB Garamond', Georgia, serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
        @keyframes twinkle { from { opacity: 0.2; transform: scale(1); } to { opacity: 1; transform: scale(1.5); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.1); opacity: 1; } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        input:focus { outline: none; border-color: rgba(212,175,55,0.8) !important; box-shadow: 0 0 20px rgba(212,175,55,0.15); }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #050215; }
        ::-webkit-scrollbar-thumb { background: #d4af37; border-radius: 3px; }
      `}</style>

      <StarField />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 860, margin: "0 auto", padding: "40px 20px 80px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 48, marginBottom: 12, animation: "pulse 3s ease-in-out infinite" }}>🔯</div>
          <h1 style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: "clamp(24px, 5vw, 42px)",
            background: "linear-gradient(90deg, #8b6914, #d4af37, #f5d87a, #d4af37, #8b6914)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmer 4s linear infinite",
            letterSpacing: 4,
            marginBottom: 10,
          }}>
            JYOTISH KUNDLI
          </h1>
          <p style={{ color: "rgba(212,175,55,0.6)", fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: 4 }}>
            VEDIC BIRTH CHART & COSMIC LIFE READING
          </p>
          <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #d4af37, transparent)", margin: "20px auto", maxWidth: 300 }} />
          <p style={{ color: "rgba(230,210,180,0.5)", fontSize: 14, fontStyle: "italic" }}>
            "As above, so below — the stars illuminate the path of your soul"
          </p>
        </div>

        {/* Form */}
        <div style={{
          background: "linear-gradient(135deg, rgba(20,10,45,0.95), rgba(10,5,30,0.98))",
          border: "1px solid rgba(212,175,55,0.4)",
          borderRadius: 20,
          padding: "40px 36px",
          marginBottom: 40,
          backdropFilter: "blur(20px)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #8b6914, #d4af37, #f5d87a, #d4af37, #8b6914)" }} />

          <h2 style={{ fontFamily: "'Cinzel', serif", color: "#d4af37", fontSize: 16, letterSpacing: 3, marginBottom: 28, textAlign: "center" }}>
            ENTER YOUR BIRTH DETAILS
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {[
              { name: "name", label: "Full Name *", placeholder: "Your complete name", type: "text", full: true },
              { name: "dob", label: "Date of Birth *", placeholder: "", type: "date", full: false },
              { name: "tob", label: "Time of Birth", placeholder: "", type: "time", full: false },
              { name: "pob", label: "Place of Birth *", placeholder: "City, State, Country", type: "text", full: true },
            ].map((field) => (
              <div key={field.name} style={{ gridColumn: field.full ? "1 / -1" : "span 1" }}>
                <label style={{
                  display: "block", fontFamily: "'Cinzel', serif", fontSize: 10,
                  color: "rgba(212,175,55,0.7)", letterSpacing: 2, marginBottom: 8,
                }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  style={{
                    width: "100%", background: "rgba(212,175,55,0.06)",
                    border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10,
                    padding: "13px 16px", color: "#e6d4b0",
                    fontFamily: "'EB Garamond', serif", fontSize: 16,
                    transition: "all 0.3s ease",
                    colorScheme: "dark",
                  }}
                />
              </div>
            ))}
          </div>

          {error && (
            <p style={{ color: "#e87d7d", fontFamily: "'Cinzel', serif", fontSize: 12, textAlign: "center", marginTop: 16, letterSpacing: 1 }}>
              ⚠ {error}
            </p>
          )}

          <button
            onClick={generateKundli}
            disabled={loading}
            style={{
              display: "block", width: "100%", marginTop: 28,
              background: loading ? "rgba(212,175,55,0.2)" : "linear-gradient(135deg, #8b6914, #d4af37, #f5d87a, #d4af37, #8b6914)",
              backgroundSize: "200% auto",
              border: "none", borderRadius: 12, padding: "16px",
              color: loading ? "rgba(212,175,55,0.5)" : "#0a0520",
              fontFamily: "'Cinzel', serif", fontSize: 14, letterSpacing: 3,
              fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              animation: loading ? "none" : "shimmer 3s linear infinite",
              transition: "all 0.3s ease",
            }}
          >
            {loading ? "✦ CONSULTING THE STARS ✦" : "✦ REVEAL MY KUNDLI ✦"}
          </button>
        </div>

        {/* Loading */}
        {loading && <MandalaSpinner />}

        {/* Results */}
        {result && (
          <div ref={resultRef} style={{ animation: "fadeSlideIn 0.8s ease forwards" }}>

            {/* Person Header */}
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>✨</div>
              <h2 style={{
                fontFamily: "'Cinzel Decorative', serif",
                color: "#d4af37", fontSize: "clamp(18px, 4vw, 28px)", letterSpacing: 3,
              }}>
                {form.name.toUpperCase()}
              </h2>
              <p style={{ color: "rgba(212,175,55,0.5)", fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: 2, marginTop: 6 }}>
                {form.dob} • {form.pob} {form.tob ? `• ${form.tob}` : ""}
              </p>
              <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #d4af37, transparent)", margin: "20px auto", maxWidth: 400 }} />
            </div>

            {/* Kundli Chart */}
            <KundliChart name={form.name} />

            {/* Tab Navigation */}
            <TabNav activeSection={activeSection} setActiveSection={setActiveSection} />

            {/* Section Content */}
            {activeSection === "overview" && (
              <div>
                <SectionBlock title="Your Cosmic Blueprint" icon="🌟" content={result.overview} />
                <SectionBlock title="Spiritual Path & Dharma" icon="🕉️" content={result.spiritual_path} />
                <SectionBlock title="The Stars' Final Verdict" icon="✨" content={result.summary_verdict} />
              </div>
            )}

            {activeSection === "planets" && (
              <SectionBlock title="Planetary Positions & Influences" icon="🪐" content={result.planets} />
            )}

            {activeSection === "life" && (
              <div>
                <SectionBlock title="Health & Vitality" icon="🌿" content={result.health} />
                <SectionBlock title="Wealth & Prosperity" icon="💰" content={result.wealth} />
                <SectionBlock title="Education & Intellect" icon="📚" content={result.education} />
                <SectionBlock title="Career & Profession" icon="🏆" content={result.career} />
                <SectionBlock title="Marriage & Relationships" icon="💑" content={result.marriage} />
                <SectionBlock title="Children & Legacy" icon="👶" content={result.children} />
              </div>
            )}

            {activeSection === "predictions" && (
              <SectionBlock title="Life Predictions — Decade by Decade" icon="🔮" content={result.predictions} />
            )}

            {activeSection === "lifestyle" && (
              <div>
                <SectionBlock title="What to Adopt for a Blessed Life" icon="🌱" content={result.lifestyle_adopt} />
                <SectionBlock title="What to Avoid for Harmony" icon="⚡" content={result.lifestyle_avoid} />
                <SectionBlock title="Sacred Mantras for Your Chart" icon="🕉️" content={result.mantras} />
              </div>
            )}

            {activeSection === "remedies" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                  {[
                    { title: "Lucky Colours", icon: "🎨", content: result.favourable_colours },
                    { title: "Lucky Numbers", icon: "🔢", content: result.favourable_numbers },
                    { title: "Auspicious Days", icon: "📅", content: result.favourable_days },
                  ].map((item) => (
                    <div key={item.title} style={{
                      background: "linear-gradient(135deg, rgba(20,10,40,0.9), rgba(10,5,30,0.95))",
                      border: "1px solid rgba(212,175,55,0.3)",
                      borderRadius: 16, padding: "24px",
                    }}>
                      <h3 style={{ fontFamily: "'Cinzel', serif", color: "#d4af37", fontSize: 13, letterSpacing: 1.5, marginBottom: 12 }}>
                        {item.icon} {item.title}
                      </h3>
                      <p style={{ color: "rgba(230,210,180,0.85)", fontFamily: "'EB Garamond', serif", fontSize: 15, lineHeight: 1.8 }}>
                        {item.content}
                      </p>
                    </div>
                  ))}
                  <div style={{
                    background: "linear-gradient(135deg, rgba(20,10,40,0.9), rgba(10,5,30,0.95))",
                    border: "1px solid rgba(212,175,55,0.3)",
                    borderRadius: 16, padding: "24px",
                  }}>
                    <h3 style={{ fontFamily: "'Cinzel', serif", color: "#d4af37", fontSize: 13, letterSpacing: 1.5, marginBottom: 12 }}>
                      📿 Rudraksha
                    </h3>
                    <p style={{ color: "rgba(230,210,180,0.85)", fontFamily: "'EB Garamond', serif", fontSize: 15, lineHeight: 1.8 }}>
                      {result.rudraksha}
                    </p>
                  </div>
                </div>
                <SectionBlock title="Gemstone Recommendations" icon="💎" content={result.gemstones} />
              </div>
            )}

            {activeSection === "longevity" && (
              <SectionBlock title="Longevity & Life Vitality Assessment" icon="⏳" content={result.longevity} />
            )}

          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 60, color: "rgba(212,175,55,0.3)", fontSize: 12, fontFamily: "'Cinzel', serif", letterSpacing: 2 }}>
          <div style={{ marginBottom: 8 }}>✦ OM GANESHAYA NAMAH ✦</div>
          <div style={{ fontSize: 10 }}>For spiritual guidance only • Consult a professional astrologer for life decisions</div>
        </div>
      </div>
    </div>
  );
}