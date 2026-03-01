import { useState } from "react";
import { signUpAndSaveProfile } from "./services/auth";
import { getSchoolTheme, isEduEmail, getSchoolNameFromEmail } from "./lib/schools";

// ── Theme ──────────────────────────────────────────────────────────────────────
const DARK = {
  bg: "#13111C",
  surface: "#1C1A28",
  card: "#211F2E",
  cardBorder: "#2E2B3E",
  accent: "#A78BFA",
  accentDim: "#2D1F4E",
  accentText: "#C4B5FD",
  teal: "#5EEAD4",
  text: "#EDE9FE",
  subtext: "#A99EC4",
  muted: "#6B6485",
  danger: "#F87171",
};

const LIGHT = {
  bg: "#F7F5FF",
  surface: "#EFECFF",
  card: "#FFFFFF",
  cardBorder: "#DDD8F5",
  accent: "#7C3AED",
  accentDim: "#EDE9FE",
  accentText: "#7C3AED",
  teal: "#0D9488",
  text: "#1E1A2E",
  subtext: "#6D5FA0",
  muted: "#9B91BE",
  danger: "#DC2626",
};

const SAMPLE_SESSIONS = [
  { id: 1, name: "Priya Sharma", initials: "PS", color: "#A78BFA", course: "MATH 221", topic: "Integration by Parts", location: "Love Library, 2nd Floor", time: "Now → 3hrs", style: "Practice Problems", level: "Struggling a bit", compatibility: 94, tags: ["quiet", "focused"] },
  { id: 2, name: "Marcus Webb", initials: "MW", color: "#5EEAD4", course: "CS 310", topic: "Binary Trees & Recursion", location: "Schorr Center, Room 114", time: "In 30min → 2hrs", style: "Discussion-based", level: "Pretty comfortable", compatibility: 87, tags: ["collaborative", "whiteboard"] },
  { id: 3, name: "Aiden Torres", initials: "AT", color: "#FDBA74", course: "ECON 212", topic: "Game Theory midterm prep", location: "Nebraska Union, Table 7", time: "Now → 2hrs", style: "Visual / diagrams", level: "Want to teach others", compatibility: 78, tags: ["social", "snacks ok"] },
  { id: 4, name: "Lily Chen", initials: "LC", color: "#86EFAC", course: "BIOS 101", topic: "Cell Division & Mitosis", location: "Hamilton Hall, Study Room 3", time: "Tonight 7–9pm", style: "Flashcards + quizzing", level: "Struggling a bit", compatibility: 82, tags: ["quiet", "focused"] },
  { id: 5, name: "Zara Ahmed", initials: "ZA", color: "#F9A8D4", course: "PSYC 181", topic: "Memory & Cognition", location: "Burnett Hall, Room 204", time: "Now → 1.5hrs", style: "Discussion-based", level: "Pretty comfortable", compatibility: 91, tags: ["collaborative", "social"] },
  { id: 6, name: "Jake Morris", initials: "JM", color: "#93C5FD", course: "PHYS 211", topic: "Kinematics & Newton's Laws", location: "Jorgensen Hall, 3rd Floor", time: "In 1hr → 2hrs", style: "Practice Problems", level: "Struggling a bit", compatibility: 85, tags: ["quiet", "focused"] },
];

const STYLE_EMOJI = {
  "Practice Problems": "📝",
  "Discussion-based": "💬",
  "Visual / diagrams": "🖊️",
  "Flashcards + quizzing": "🃏",
};

// ── Onboarding ─────────────────────────────────────────────────────────────────
function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ name: "", university: "", major: "", courses: "", style: "", level: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const T = DARK;

  const styleOptions = ["Practice Problems", "Discussion-based", "Visual / diagrams", "Flashcards + quizzing"];
  const levelOptions = ["Just getting started", "Struggling a bit", "Pretty comfortable", "Want to teach others"];

  const canNext =
    step === 0 ? data.name.trim().length > 0 :
    step === 1 ? data.university.trim().length > 0 :
    step === 2 ? data.major.trim().length > 0 :
    step === 3 ? data.courses.trim().length > 0 :
    step === 4 ? data.style.length > 0 :
    step === 5 ? data.level.length > 0 :
    step === 6 ? isEduEmail(data.email) :
    data.password.length >= 6;

  async function next() {
    if (step < 7) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setError("");
      try {
        await signUpAndSaveProfile(data.email, data.password, data);
        onDone(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  }

  const inputStyle = {
    width: "100%", padding: "15px 18px", borderRadius: 14,
    border: `1.5px solid ${T.cardBorder}`,
    background: T.surface, color: T.text, fontSize: 15, outline: "none",
    boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      {/* Left branding panel */}
      <div style={{
        width: "42%", padding: "64px 56px",
        background: `linear-gradient(160deg, ${T.surface} 0%, ${T.bg} 100%)`,
        borderRight: `1px solid ${T.cardBorder}`,
        display: "flex", flexDirection: "column", justifyContent: "center",
      }}>
        <div style={{ marginBottom: 52 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 38, fontWeight: 800, letterSpacing: -1, marginBottom: 8 }}>
            <span style={{ color: "#A78BFA" }}>study</span><span style={{ color: "#5EEAD4" }}>sync</span>
          </div>
          <div style={{ color: T.muted, fontSize: 15 }}>find your perfect study match</div>
        </div>
        <div style={{ color: T.text, fontSize: 26, fontFamily: "'Syne', sans-serif", fontWeight: 700, lineHeight: 1.4, marginBottom: 16 }}>
          Study smarter,<br />together.
        </div>
        <div style={{ color: T.subtext, fontSize: 14, lineHeight: 1.8, marginBottom: 40 }}>
          Match with students in your classes based on study style, comfort level, and availability.
        </div>
        {[
          { icon: "🎯", text: "Smart compatibility matching" },
          { icon: "📍", text: "Sessions happening on campus now" },
          { icon: "⚡", text: "Join or post in seconds" },
        ].map(item => (
          <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: T.accentDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>
              {item.icon}
            </div>
            <span style={{ color: T.subtext, fontSize: 14 }}>{item.text}</span>
          </div>
        ))}
      </div>

      {/* Right form panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
        <div style={{ width: "100%", maxWidth: 460 }}>

          {/* Progress bar */}
          <div style={{ display: "flex", gap: 5, marginBottom: 40 }}>
            {[0,1,2,3,4,5,6,7].map(i => (
              <div key={i} style={{
                flex: i === step ? 4 : 1, height: 5, borderRadius: 3,
                background: i < step ? T.accent + "88" : i === step ? T.accent : T.cardBorder,
                transition: "all 0.35s ease",
              }} />
            ))}
          </div>

          <div style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: 24, padding: 40 }}>

            {step === 0 && <>
              <Label T={T}>Step 1 of 8</Label>
              <Question T={T}>What's your name?</Question>
              <input autoFocus value={data.name}
                onChange={e => setData({ ...data, name: e.target.value })}
                onKeyDown={e => e.key === "Enter" && canNext && next()}
                placeholder="e.g. Jordan" style={inputStyle} />
            </>}

            {step === 1 && <>
              <Label T={T}>Step 2 of 8</Label>
              <Question T={T}>Your university?</Question>
              <input autoFocus value={data.university}
                onChange={e => setData({ ...data, university: e.target.value })}
                onKeyDown={e => e.key === "Enter" && canNext && next()}
                placeholder="e.g. University of Nebraska-Lincoln" style={inputStyle} />
            </>}

            {step === 2 && <>
              <Label T={T}>Step 3 of 8</Label>
              <Question T={T}>Your major?</Question>
              <input autoFocus value={data.major}
                onChange={e => setData({ ...data, major: e.target.value })}
                onKeyDown={e => e.key === "Enter" && canNext && next()}
                placeholder="e.g. Computer Science" style={inputStyle} />
            </>}

            {step === 3 && <>
              <Label T={T}>Step 4 of 8</Label>
              <Question T={T}>Courses this semester?</Question>
              <input autoFocus value={data.courses}
                onChange={e => setData({ ...data, courses: e.target.value })}
                onKeyDown={e => e.key === "Enter" && canNext && next()}
                placeholder="e.g. MATH 221, CS 310, ECON 212" style={inputStyle} />
            </>}

            {step === 4 && <>
              <Label T={T}>Step 5 of 8</Label>
              <Question T={T}>How do you study best?</Question>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {styleOptions.map(opt => (
                  <button key={opt} onClick={() => setData({ ...data, style: opt })} style={{
                    padding: "16px 14px", borderRadius: 14, cursor: "pointer", textAlign: "left",
                    fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                    border: `1.5px solid ${data.style === opt ? T.accent : T.cardBorder}`,
                    background: data.style === opt ? T.accentDim : T.surface,
                    color: data.style === opt ? T.accentText : T.subtext,
                    transition: "all 0.15s",
                  }}>
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{STYLE_EMOJI[opt]}</div>
                    {opt}
                  </button>
                ))}
              </div>
            </>}

            {step === 5 && <>
              <Label T={T}>Step 6 of 8</Label>
              <Question T={T}>Where are you at?</Question>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {levelOptions.map(opt => (
                  <button key={opt} onClick={() => setData({ ...data, level: opt })} style={{
                    padding: "14px 18px", borderRadius: 14, cursor: "pointer", textAlign: "left",
                    fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                    border: `1.5px solid ${data.level === opt ? T.teal : T.cardBorder}`,
                    background: data.level === opt ? "#0D3330" : T.surface,
                    color: data.level === opt ? T.teal : T.subtext,
                    transition: "all 0.15s",
                  }}>
                    {opt}
                  </button>
                ))}
              </div>
            </>}

            {step === 6 && <>
              <Label T={T}>Step 7 of 8</Label>
              <Question T={T}>Your college email?</Question>
              <input autoFocus value={data.email}
                onChange={e => setData({ ...data, email: e.target.value })}
                onKeyDown={e => e.key === "Enter" && canNext && next()}
                placeholder="e.g. jordan@huskers.unl.edu"
                type="email" style={inputStyle} />
              {data.email.includes("@") && !isEduEmail(data.email) && (
                <div style={{ color: T.danger, fontSize: 13, marginTop: 8 }}>
                  ⚠️ Must be a .edu email address
                </div>
              )}
              {isEduEmail(data.email) && (
                <div style={{ color: T.teal, fontSize: 13, marginTop: 8 }}>
                  ✓ {getSchoolNameFromEmail(data.email)}
                </div>
              )}
            </>}

            {step === 7 && <>
              <Label T={T}>Step 8 of 8</Label>
              <Question T={T}>Create a password</Question>
              <input autoFocus value={data.password}
                onChange={e => setData({ ...data, password: e.target.value })}
                onKeyDown={e => e.key === "Enter" && canNext && next()}
                placeholder="At least 6 characters"
                type="password" style={inputStyle} />
              {error && <div style={{ color: T.danger, fontSize: 13, marginTop: 8 }}>{error}</div>}
            </>}

            <button onClick={next} disabled={!canNext || loading} style={{
              marginTop: 28, width: "100%", padding: "15px", borderRadius: 14, border: "none",
              background: canNext ? T.accent : T.accentDim,
              color: canNext ? "#13111C" : T.muted,
              fontSize: 15, fontWeight: 700, cursor: canNext ? "pointer" : "not-allowed",
              fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
            }}>
              {step === 7 ? (loading ? "Creating account..." : "Find My Study Matches →") : "Continue →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({ T, children }) {
  return <div style={{ color: T.muted, fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{children}</div>;
}
function Question({ T, children }) {
  return <div style={{ color: T.text, fontSize: 24, fontWeight: 700, fontFamily: "'Syne', sans-serif", marginBottom: 24 }}>{children}</div>;
}

// ── Session Card ───────────────────────────────────────────────────────────────
function SessionCard({ session, onJoin, T }) {
  const [joined, setJoined] = useState(false);
  const [passed, setPassed] = useState(false);
  if (passed) return null;

  return (
    <div style={{
      background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: 20, padding: 24, position: "relative",
      transition: "transform 0.2s, box-shadow 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${T.accent}18`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{
        position: "absolute", top: 20, right: 20,
        background: session.compatibility >= 90 ? T.accentDim : T.surface,
        border: `1px solid ${session.compatibility >= 90 ? T.accent + "66" : T.cardBorder}`,
        borderRadius: 20, padding: "4px 10px", display: "flex", alignItems: "center", gap: 5,
      }}>
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: session.compatibility >= 90 ? T.accent : T.muted }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: session.compatibility >= 90 ? T.accentText : T.muted }}>
          {session.compatibility}% match
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 13, background: session.color + "22",
          border: `1.5px solid ${session.color}66`, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 700, color: session.color, fontFamily: "'Syne', sans-serif", flexShrink: 0,
        }}>{session.initials}</div>
        <div>
          <div style={{ color: T.text, fontWeight: 600, fontSize: 14 }}>{session.name}</div>
          <div style={{ color: T.muted, fontSize: 12 }}>{session.level}</div>
        </div>
      </div>

      <div style={{ background: T.surface, borderRadius: 10, padding: "10px 14px", marginBottom: 12 }}>
        <div style={{ color: T.accentText, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 3 }}>{session.course}</div>
        <div style={{ color: T.text, fontSize: 14, fontWeight: 600 }}>{session.topic}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
        {[["📍", session.location], ["⏰", session.time], [STYLE_EMOJI[session.style], session.style]].map(([icon, val]) => (
          <div key={val} style={{ display: "flex", gap: 8, alignItems: "center", color: T.subtext, fontSize: 12 }}>
            <span>{icon}</span>{val}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {session.tags.map(tag => (
          <span key={tag} style={{
            background: T.surface, color: T.muted, fontSize: 10, fontWeight: 600,
            padding: "3px 9px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 0.8,
            border: `1px solid ${T.cardBorder}`,
          }}>{tag}</span>
        ))}
      </div>

      {joined ? (
        <div style={{
          background: T.accentDim, border: `1px solid ${T.accent}55`,
          borderRadius: 10, padding: "12px", textAlign: "center", color: T.accentText, fontWeight: 600, fontSize: 13,
        }}>✓ You're in! {session.name} has been notified.</div>
      ) : (
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setPassed(true)} style={{
            flex: 1, padding: "11px", borderRadius: 10, border: `1px solid ${T.cardBorder}`,
            background: "transparent", color: T.muted, cursor: "pointer", fontSize: 13, fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif",
          }}>Pass</button>
          <button onClick={() => { setJoined(true); onJoin(session); }} style={{
            flex: 2, padding: "11px", borderRadius: 10, border: "none",
            background: T.accent, color: "#13111C", cursor: "pointer", fontSize: 13, fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif",
          }}>Join Session →</button>
        </div>
      )}
    </div>
  );
}

// ── Post Modal ─────────────────────────────────────────────────────────────────
function PostModal({ onClose, T }) {
  const [form, setForm] = useState({ course: "", topic: "", location: "", time: "", style: "" });
  const [posted, setPosted] = useState(false);
  const styleOptions = ["Practice Problems", "Discussion-based", "Visual / diagrams", "Flashcards + quizzing"];
  const canPost = Object.values(form).every(v => v.trim().length > 0);

  if (posted) return (
    <div style={{ position: "fixed", inset: 0, background: "#00000088", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div style={{ background: T.card, border: `1px solid ${T.accent}55`, borderRadius: 24, padding: 48, textAlign: "center", maxWidth: 380 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, color: T.text, fontWeight: 700, marginBottom: 8 }}>Session Posted!</div>
        <div style={{ color: T.subtext, fontSize: 14, marginBottom: 28 }}>Your session is live. Matched students will be notified.</div>
        <button onClick={onClose} style={{ width: "100%", padding: 14, borderRadius: 12, background: T.accent, color: "#13111C", border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Done</button>
      </div>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000088", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24 }}>
      <div style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: 24, padding: 36, maxWidth: 540, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: T.text }}>Post a Study Session</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 18 }}>✕</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          {[["Course", "course", "e.g. MATH 221"], ["Topic", "topic", "e.g. Integration by Parts"], ["Location", "location", "e.g. Love Library"], ["Time", "time", "e.g. Now → 3hrs"]].map(([label, key, ph]) => (
            <div key={key}>
              <div style={{ color: T.muted, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
              <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={ph} style={{
                width: "100%", padding: "11px 14px", borderRadius: 10, border: `1px solid ${T.cardBorder}`,
                background: T.surface, color: T.text, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif",
              }} />
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ color: T.muted, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Study Style</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
            {styleOptions.map(opt => (
              <button key={opt} onClick={() => setForm({ ...form, style: opt })} style={{
                padding: "10px 6px", borderRadius: 10, cursor: "pointer", textAlign: "center",
                border: `1px solid ${form.style === opt ? T.accent : T.cardBorder}`,
                background: form.style === opt ? T.accentDim : T.surface,
                color: form.style === opt ? T.accentText : T.muted,
                fontSize: 10, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
              }}>
                <div style={{ fontSize: 16, marginBottom: 4 }}>{STYLE_EMOJI[opt]}</div>{opt}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => canPost && setPosted(true)} disabled={!canPost} style={{
          width: "100%", padding: 14, borderRadius: 12, border: "none",
          background: canPost ? T.accent : T.accentDim,
          color: canPost ? "#13111C" : T.muted,
          fontSize: 15, fontWeight: 700, cursor: canPost ? "pointer" : "not-allowed", fontFamily: "'DM Sans', sans-serif",
        }}>Post Session</button>
      </div>
    </div>
  );
}

// ── Profile Modal ─────────────────────────────────────────────────────────────
function ProfileModal({ user, onSave, onClose, T }) {
  const [form, setForm] = useState({ ...user });
  const styleOptions = ["Practice Problems", "Discussion-based", "Visual / diagrams", "Flashcards + quizzing"];
  const levelOptions = ["Just getting started", "Struggling a bit", "Pretty comfortable", "Want to teach others"];

  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: 10,
    border: `1px solid ${T.cardBorder}`, background: T.surface,
    color: T.text, fontSize: 14, outline: "none",
    boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000088", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24 }}>
      <div style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: 24, padding: 36, maxWidth: 520, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: T.text }}>Edit Profile</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 18 }}>✕</button>
        </div>

        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, padding: "16px 20px", background: T.surface, borderRadius: 16, border: `1px solid ${T.cardBorder}` }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: T.accentDim,
            border: `2px solid ${T.accent}55`, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 22, fontWeight: 700, color: T.accentText,
            fontFamily: "'Syne', sans-serif", flexShrink: 0,
          }}>{form.name ? form.name[0].toUpperCase() : "?"}</div>
          <div>
            <div style={{ color: T.text, fontWeight: 600, fontSize: 16 }}>{form.name || "Your Name"}</div>
            <div style={{ color: T.subtext, fontSize: 13 }}>{form.university || "Your University"}</div>
            <div style={{ color: T.muted, fontSize: 12, marginTop: 2 }}>{form.major || "Your Major"}</div>
          </div>
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {[
            { label: "Name", key: "name", placeholder: "e.g. Jordan" },
            { label: "University", key: "university", placeholder: "e.g. University of Nebraska-Lincoln" },
            { label: "Major", key: "major", placeholder: "e.g. Computer Science" },
            { label: "Courses this semester", key: "courses", placeholder: "e.g. MATH 221, CS 310, ECON 212" },
          ].map(f => (
            <div key={f.key}>
              <div style={{ color: T.muted, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>{f.label}</div>
              <input value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder} style={inputStyle} />
            </div>
          ))}

          {/* Study Style multi-select */}
          <div>
            <div style={{ color: T.muted, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Study Style</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {styleOptions.map(opt => {
                const selected = form.style ? form.style.split(",").map(s => s.trim()).includes(opt) : false;
                const toggle = () => {
                  const current = form.style ? form.style.split(",").map(s => s.trim()).filter(Boolean) : [];
                  const updated = selected ? current.filter(s => s !== opt) : [...current, opt];
                  setForm({ ...form, style: updated.join(", ") });
                };
                return (
                  <button key={opt} onClick={toggle} style={{
                    padding: "12px", borderRadius: 12, cursor: "pointer", textAlign: "left",
                    fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                    border: `1px solid ${selected ? T.accent : T.cardBorder}`,
                    background: selected ? T.accentDim : T.surface,
                    color: selected ? T.accentText : T.subtext,
                    display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s",
                  }}>
                    <span style={{ fontSize: 16 }}>{STYLE_EMOJI[opt]}</span>
                    <span>{opt}</span>
                    {selected && <span style={{ marginLeft: "auto", color: T.accent, fontWeight: 800, fontSize: 12 }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comfort Level */}
          <div>
            <div style={{ color: T.muted, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Comfort Level</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {levelOptions.map(opt => (
                <button key={opt} onClick={() => setForm({ ...form, level: opt })} style={{
                  padding: "11px 14px", borderRadius: 12, cursor: "pointer", textAlign: "left",
                  fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                  border: `1px solid ${form.level === opt ? T.teal : T.cardBorder}`,
                  background: form.level === opt ? T.tealDim : T.surface,
                  color: form.level === opt ? T.teal : T.subtext,
                  transition: "all 0.15s",
                }}>{opt}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Save */}
        <button onClick={() => onSave(form)} style={{
          marginTop: 28, width: "100%", padding: "14px", borderRadius: 14, border: "none",
          background: T.accent, color: "#13111C", fontSize: 15, fontWeight: 700,
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
        }}>Save Changes</button>
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────────
function MainApp({ user: initialUser, school }) {
  const [mode, setMode] = useState("dark");
  const T = mode === "dark" ? DARK : LIGHT;
  const [tab, setTab] = useState("discover");
  const [showPost, setShowPost] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [joined, setJoined] = useState([]);
  const [filter, setFilter] = useState("");
  const [user, setUser] = useState(initialUser);

  // Use school colors for accent when available
  const accentColor = school?.primary || T.accent;
  const accentDim = school?.accentDim || T.accentDim;
  const accentText = school?.accentText || T.accentText;

  const filtered = SAMPLE_SESSIONS.filter(s =>
    !filter || s.course.toLowerCase().includes(filter.toLowerCase()) || s.topic.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans', sans-serif", transition: "background 0.3s" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      {showPost && <PostModal onClose={() => setShowPost(false)} T={T} />}

      {activeRoom && <SessionRoom session={activeRoom} user={user} onClose={() => setActiveRoom(null)} T={T} />}

      {/* Navbar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px", height: 62,
        background: T.card, borderBottom: `1px solid ${T.cardBorder}`,
        position: "sticky", top: 0, zIndex: 50,
      }}>

        {/* Logo — clean, just studysync text */}
        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 21, fontWeight: 800, letterSpacing: -0.5 }}>
          <span style={{ color: accentColor }}>study</span>
          <span style={{ color: school?.secondary || T.teal }}>sync</span>
        </span>

        {/* Nav tabs */}
        <div style={{ display: "flex", gap: 6 }}>
          {["discover", "my sessions"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "7px 18px", borderRadius: 20,
              border: `1px solid ${tab === t ? accentColor + "88" : T.cardBorder}`,
              background: tab === t ? accentDim : "transparent",
              color: tab === t ? accentText : T.muted,
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize",
            }}>{t}</button>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

          {/* Post session button */}
          <button onClick={() => setShowPost(true)} style={{
            padding: "8px 18px", borderRadius: 20, border: "none",
            background: accentColor, color: "#13111C", fontSize: 13, fontWeight: 700,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}>+ Post Session</button>

          {/* Dark/Light toggle with school logo baked in */}
          <button onClick={() => setMode(m => m === "dark" ? "light" : "dark")} style={{
            padding: "5px 14px 5px 6px", borderRadius: 20,
            border: `1px solid ${T.cardBorder}`,
            background: T.surface, color: T.subtext,
            fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            display: "flex", alignItems: "center", gap: 8, fontWeight: 500,
          }}>
            {school?.logoUrl ? (
              <img
                src={school.logoUrl}
                alt={school.shortName || "logo"}
                style={{ width: 24, height: 24, objectFit: "contain", borderRadius: 4 }}
                onError={e => { e.target.style.display = "none"; }}
              />
            ) : school?.shortName ? (
              <div style={{
                padding: "2px 7px", borderRadius: 6,
                background: accentDim, color: accentText,
                fontSize: 10, fontWeight: 800, fontFamily: "'Syne', sans-serif",
              }}>
                {school.shortName}
              </div>
            ) : null}
            {mode === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>

          {/* User avatar */}
          <button onClick={() => setShowProfile(true)} style={{
            width: 34, height: 34, borderRadius: 10, background: accentDim,
            border: `1px solid ${accentColor}55`, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 13, fontWeight: 700, color: accentText,
            fontFamily: "'Syne', sans-serif", cursor: "pointer",
          }}>{user.name[0].toUpperCase()}</button>
        </div>
      </div>

      {/* Discover tab */}
      {tab === "discover" && (
        <div style={{ padding: "32px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700, color: T.text, marginBottom: 4 }}>
                Hey {user.name} 👋
              </div>
              <div style={{ color: T.subtext, fontSize: 14 }}>
                {school?.name ? `Study sessions at ${school.name} right now.` : "Study sessions happening on campus right now."}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ background: T.surface, border: `1px solid ${T.cardBorder}`, borderRadius: 10, padding: "7px 14px", display: "flex", gap: 5, alignItems: "center" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.teal }} />
                <span style={{ color: T.subtext, fontSize: 12, fontWeight: 500 }}>{filtered.length} live sessions</span>
              </div>
              <div style={{ background: T.surface, border: `1px solid ${T.cardBorder}`, borderRadius: 10, padding: "7px 14px" }}>
                <span style={{ color: T.subtext, fontSize: 12, fontWeight: 500 }}>📍 On campus</span>
              </div>
            </div>
          </div>

          <input value={filter} onChange={e => setFilter(e.target.value)}
            placeholder="🔍  Filter by course or topic..."
            style={{
              width: "100%", padding: "13px 18px", borderRadius: 12, border: `1px solid ${T.cardBorder}`,
              background: T.surface, color: T.text, fontSize: 14, outline: "none",
              boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif", marginBottom: 24,
            }}
          />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 18 }}>
            {filtered.length === 0
              ? <div style={{ color: T.muted, fontSize: 14, padding: 48 }}>No sessions match your filter.</div>
              : filtered.map(s => <SessionCard key={s.id} session={s} onJoin={s => setJoined(j => [...j, s])} T={T} />)
            }
          </div>
        </div>
      )}

      {/* My Sessions tab */}
      {tab === "my sessions" && (
        <div style={{ padding: "32px 40px" }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700, color: T.text, marginBottom: 24 }}>My Sessions</div>
          {joined.length === 0 ? (
            <div style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: 20, padding: 60, textAlign: "center", maxWidth: 440 }}>
              <div style={{ fontSize: 44, marginBottom: 14 }}>📚</div>
              <div style={{ color: T.text, fontSize: 17, fontWeight: 600, marginBottom: 8 }}>No sessions yet</div>
              <div style={{ color: T.subtext, fontSize: 14, marginBottom: 22 }}>Join a session from Discover or post your own.</div>
              <button onClick={() => setTab("discover")} style={{
                padding: "11px 26px", borderRadius: 12, border: "none",
                background: accentColor, color: "#13111C", fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}>Browse Sessions →</button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
              {joined.map(s => (
                <div key={s.id} style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: 16, padding: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ color: accentText, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>{s.course}</div>
                      <div style={{ color: T.text, fontWeight: 600, fontSize: 15, marginBottom: 5 }}>{s.topic}</div>
                      <div style={{ color: T.subtext, fontSize: 12 }}>with {s.name} · {s.location}</div>
                    </div>
                    <div style={{ background: accentDim, border: `1px solid ${accentColor}55`, borderRadius: 20, padding: "3px 10px", flexShrink: 0 }}>
                      <span style={{ color: accentText, fontSize: 10, fontWeight: 700 }}>JOINED</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Root ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [school, setSchool] = useState(null);

  async function handleDone(data) {
    const theme = await getSchoolTheme(data.email);
    setSchool(theme);
    setUser(data);
  }

  if (!user) return <Onboarding onDone={handleDone} />;
  return <MainApp user={user} school={school} />;
}
