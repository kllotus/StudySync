import { useState } from "react";

const COLORS = {
  bg: "#0A0E1A",
  card: "#111827",
  cardBorder: "#1E2D45",
  accent: "#4FFFB0",
  accentDim: "#1a5c40",
  blue: "#38BDF8",
  orange: "#FB923C",
  text: "#E2E8F0",
  muted: "#64748B",
  danger: "#F87171",
};

const SAMPLE_SESSIONS = [
  {
    id: 1,
    name: "Priya Sharma",
    initials: "PS",
    color: "#A78BFA",
    course: "MATH 221",
    topic: "Integration by Parts",
    location: "Love Library, 2nd Floor",
    time: "Now → 3hrs",
    style: "Practice Problems",
    level: "Struggling a bit",
    compatibility: 94,
    tags: ["quiet", "focused"],
  },
  {
    id: 2,
    name: "Marcus Webb",
    initials: "MW",
    color: "#38BDF8",
    course: "CS 310",
    topic: "Binary Trees & Recursion",
    location: "Schorr Center, Room 114",
    time: "In 30min → 2hrs",
    style: "Discussion-based",
    level: "Pretty comfortable",
    compatibility: 87,
    tags: ["collaborative", "whiteboard"],
  },
  {
    id: 3,
    name: "Aiden Torres",
    initials: "AT",
    color: "#FB923C",
    course: "ECON 212",
    topic: "Game Theory midterm prep",
    location: "Nebraska Union, Table 7",
    time: "Now → 2hrs",
    style: "Visual / diagrams",
    level: "Want to teach others",
    compatibility: 78,
    tags: ["social", "snacks ok"],
  },
  {
    id: 4,
    name: "Lily Chen",
    initials: "LC",
    color: "#4FFFB0",
    course: "BIOS 101",
    topic: "Cell Division & Mitosis",
    location: "Hamilton Hall, Study Room 3",
    time: "Tonight 7-9pm",
    style: "Flashcards + quizzing",
    level: "Struggling a bit",
    compatibility: 82,
    tags: ["quiet", "focused"],
  },
];

const STYLE_EMOJI = {
  "Practice Problems": "📝",
  "Discussion-based": "💬",
  "Visual / diagrams": "🖊️",
  "Flashcards + quizzing": "🃏",
};

function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ name: "", major: "", courses: "", style: "", level: "" });

  const steps = [
    { label: "What's your name?", field: "name", placeholder: "e.g. Jordan" },
    { label: "Your major?", field: "major", placeholder: "e.g. Computer Science" },
    { label: "Courses this semester?", field: "courses", placeholder: "e.g. MATH 221, CS 310, ECON 212" },
  ];

  const styleOptions = ["Practice Problems", "Discussion-based", "Visual / diagrams", "Flashcards + quizzing"];
  const levelOptions = ["Just getting started", "Struggling a bit", "Pretty comfortable", "Want to teach others"];

  const canNext = step < 3
    ? data[steps[Math.min(step, 2)]?.field]?.trim().length > 0
    : step === 3 ? data.style : data.level;

  function next() {
    if (step < 4) setStep(step + 1);
    else onDone(data);
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      <div style={{ width: "100%", maxWidth: 440, padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: COLORS.accent, letterSpacing: -1 }}>
            study<span style={{ color: COLORS.blue }}>sync</span>
          </span>
          <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 4 }}>find your perfect study match</div>
        </div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 40 }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{
              width: i === step ? 24 : 8, height: 8, borderRadius: 4,
              background: i <= step ? COLORS.accent : COLORS.cardBorder,
              transition: "all 0.3s ease"
            }} />
          ))}
        </div>
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 20, padding: 32 }}>
          {step < 3 ? (
            <>
              <div style={{ color: COLORS.muted, fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Step {step + 1} of 5</div>
              <div style={{ color: COLORS.text, fontSize: 22, fontWeight: 600, fontFamily: "'Syne', sans-serif", marginBottom: 24 }}>{steps[step].label}</div>
              <input
                autoFocus
                value={data[steps[step].field]}
                onChange={e => setData({ ...data, [steps[step].field]: e.target.value })}
                onKeyDown={e => e.key === "Enter" && canNext && next()}
                placeholder={steps[step].placeholder}
                style={{
                  width: "100%", padding: "14px 16px", borderRadius: 12, border: `1.5px solid ${COLORS.cardBorder}`,
                  background: COLORS.bg, color: COLORS.text, fontSize: 15, outline: "none", boxSizing: "border-box",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />
            </>
          ) : step === 3 ? (
            <>
              <div style={{ color: COLORS.muted, fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Step 4 of 5</div>
              <div style={{ color: COLORS.text, fontSize: 22, fontWeight: 600, fontFamily: "'Syne', sans-serif", marginBottom: 24 }}>How do you study best?</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {styleOptions.map(opt => (
                  <button key={opt} onClick={() => setData({ ...data, style: opt })} style={{
                    padding: "13px 16px", borderRadius: 12, border: `1.5px solid ${data.style === opt ? COLORS.accent : COLORS.cardBorder}`,
                    background: data.style === opt ? COLORS.accentDim : "transparent", color: data.style === opt ? COLORS.accent : COLORS.text,
                    cursor: "pointer", textAlign: "left", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                    transition: "all 0.15s",
                  }}>
                    {STYLE_EMOJI[opt]} {opt}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div style={{ color: COLORS.muted, fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Step 5 of 5</div>
              <div style={{ color: COLORS.text, fontSize: 22, fontWeight: 600, fontFamily: "'Syne', sans-serif", marginBottom: 24 }}>Where are you at with your coursework?</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {levelOptions.map(opt => (
                  <button key={opt} onClick={() => setData({ ...data, level: opt })} style={{
                    padding: "13px 16px", borderRadius: 12, border: `1.5px solid ${data.level === opt ? COLORS.blue : COLORS.cardBorder}`,
                    background: data.level === opt ? "#0e2a3a" : "transparent", color: data.level === opt ? COLORS.blue : COLORS.text,
                    cursor: "pointer", textAlign: "left", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                    transition: "all 0.15s",
                  }}>
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}
          <button onClick={next} disabled={!canNext} style={{
            marginTop: 24, width: "100%", padding: "14px", borderRadius: 12,
            background: canNext ? COLORS.accent : COLORS.accentDim,
            color: canNext ? "#0A0E1A" : COLORS.muted, border: "none",
            fontSize: 15, fontWeight: 700, cursor: canNext ? "pointer" : "not-allowed",
            fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
          }}>
            {step === 4 ? "Find My Study Matches →" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SessionCard({ session, onJoin }) {
  const [joined, setJoined] = useState(false);
  const [passed, setPassed] = useState(false);

  if (passed) return null;

  return (
    <div style={{
      background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`,
      borderRadius: 20, padding: 24, position: "relative", overflow: "hidden",
      transition: "transform 0.2s, box-shadow 0.2s",
    }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <div style={{
        position: "absolute", top: 20, right: 20,
        background: session.compatibility >= 90 ? COLORS.accentDim : "#1a2a3a",
        border: `1px solid ${session.compatibility >= 90 ? COLORS.accent : COLORS.cardBorder}`,
        borderRadius: 20, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: session.compatibility >= 90 ? COLORS.accent : COLORS.blue }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: session.compatibility >= 90 ? COLORS.accent : COLORS.blue }}>
          {session.compatibility}% match
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14, background: session.color + "33",
          border: `2px solid ${session.color}`, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 700, color: session.color, fontFamily: "'Syne', sans-serif",
        }}>
          {session.initials}
        </div>
        <div>
          <div style={{ color: COLORS.text, fontWeight: 600, fontSize: 16 }}>{session.name}</div>
          <div style={{ color: COLORS.muted, fontSize: 13 }}>{session.level}</div>
        </div>
      </div>
      <div style={{ background: COLORS.bg, borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
        <div style={{ color: COLORS.accent, fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>
          {session.course}
        </div>
        <div style={{ color: COLORS.text, fontSize: 15, fontWeight: 600 }}>{session.topic}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", color: COLORS.muted, fontSize: 13 }}>
          <span>📍</span> {session.location}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", color: COLORS.muted, fontSize: 13 }}>
          <span>⏰</span> {session.time}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", color: COLORS.muted, fontSize: 13 }}>
          <span>{STYLE_EMOJI[session.style]}</span> {session.style}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {session.tags.map(tag => (
          <span key={tag} style={{
            background: "#1E2D45", color: COLORS.muted, fontSize: 11, fontWeight: 600,
            padding: "4px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 1,
          }}>{tag}</span>
        ))}
      </div>
      {joined ? (
        <div style={{
          background: COLORS.accentDim, border: `1px solid ${COLORS.accent}`,
          borderRadius: 12, padding: "14px", textAlign: "center",
          color: COLORS.accent, fontWeight: 700, fontSize: 14,
        }}>
          ✓ You're in! {session.name} has been notified.
        </div>
      ) : (
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setPassed(true)} style={{
            flex: 1, padding: "13px", borderRadius: 12, border: `1.5px solid ${COLORS.cardBorder}`,
            background: "transparent", color: COLORS.muted, cursor: "pointer", fontSize: 14, fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Pass
          </button>
          <button onClick={() => { setJoined(true); onJoin(session); }} style={{
            flex: 2, padding: "13px", borderRadius: 12, border: "none",
            background: COLORS.accent, color: "#0A0E1A", cursor: "pointer", fontSize: 14, fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Join Session →
          </button>
        </div>
      )}
    </div>
  );
}

function PostModal({ onClose, user }) {
  const [course, setCourse] = useState("");
  const [topic, setTopic] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [style, setStyle] = useState("");
  const [posted, setPosted] = useState(false);

  const styleOptions = ["Practice Problems", "Discussion-based", "Visual / diagrams", "Flashcards + quizzing"];
  const canPost = course && topic && location && time && style;

  if (posted) return (
    <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24 }}>
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.accent}`, borderRadius: 24, padding: 40, textAlign: "center", maxWidth: 360, width: "100%" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, color: COLORS.text, fontWeight: 700, marginBottom: 8 }}>Session Posted!</div>
        <div style={{ color: COLORS.muted, fontSize: 14, marginBottom: 24 }}>Your session is now live. Students will be notified based on their courses and study style.</div>
        <button onClick={onClose} style={{
          width: "100%", padding: 14, borderRadius: 12, background: COLORS.accent,
          color: "#0A0E1A", border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
        }}>Done</button>
      </div>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24, overflowY: "auto" }}>
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 24, padding: 28, maxWidth: 440, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: COLORS.text }}>Post a Study Session</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>
        {[
          { label: "Course", val: course, set: setCourse, placeholder: "e.g. MATH 221" },
          { label: "Topic", val: topic, set: setTopic, placeholder: "e.g. Integration by Parts" },
          { label: "Location", val: location, set: setLocation, placeholder: "e.g. Love Library, 2nd Floor" },
          { label: "Time window", val: time, set: setTime, placeholder: "e.g. Now → 3hrs or Tonight 7-9pm" },
        ].map(f => (
          <div key={f.label} style={{ marginBottom: 16 }}>
            <div style={{ color: COLORS.muted, fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>{f.label}</div>
            <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} style={{
              width: "100%", padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${COLORS.cardBorder}`,
              background: COLORS.bg, color: COLORS.text, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif",
            }} />
          </div>
        ))}
        <div style={{ marginBottom: 24 }}>
          <div style={{ color: COLORS.muted, fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Study Style</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {styleOptions.map(opt => (
              <button key={opt} onClick={() => setStyle(opt)} style={{
                padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${style === opt ? COLORS.accent : COLORS.cardBorder}`,
                background: style === opt ? COLORS.accentDim : "transparent",
                color: style === opt ? COLORS.accent : COLORS.muted, cursor: "pointer",
                fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", textAlign: "left",
              }}>
                {STYLE_EMOJI[opt]} {opt}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => canPost && setPosted(true)} disabled={!canPost} style={{
          width: "100%", padding: 14, borderRadius: 12, border: "none",
          background: canPost ? COLORS.accent : COLORS.accentDim,
          color: canPost ? "#0A0E1A" : COLORS.muted,
          fontSize: 15, fontWeight: 700, cursor: canPost ? "pointer" : "not-allowed", fontFamily: "'DM Sans', sans-serif",
        }}>
          Post Session
        </button>
      </div>
    </div>
  );
}

function MainApp({ user }) {
  const [tab, setTab] = useState("discover");
  const [showPost, setShowPost] = useState(false);
  const [joined, setJoined] = useState([]);
  const [filter, setFilter] = useState("");

  const filtered = SAMPLE_SESSIONS.filter(s =>
    !filter || s.course.toLowerCase().includes(filter.toLowerCase()) || s.topic.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'DM Sans', sans-serif", paddingBottom: 80 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      {showPost && <PostModal onClose={() => setShowPost(false)} user={user} />}
      <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: COLORS.accent, letterSpacing: -0.5 }}>
          study<span style={{ color: COLORS.blue }}>sync</span>
        </span>
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 20, padding: "6px 14px", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: COLORS.accent + "33", border: `1.5px solid ${COLORS.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: COLORS.accent }}>
            {user.name[0].toUpperCase()}
          </div>
          <span style={{ color: COLORS.text, fontSize: 13, fontWeight: 600 }}>{user.name}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, padding: "20px 20px 0" }}>
        {["discover", "my sessions"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 18px", borderRadius: 20, border: `1.5px solid ${tab === t ? COLORS.accent : COLORS.cardBorder}`,
            background: tab === t ? COLORS.accentDim : "transparent",
            color: tab === t ? COLORS.accent : COLORS.muted,
            fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize",
          }}>
            {t}
          </button>
        ))}
        <button onClick={() => setShowPost(true)} style={{
          marginLeft: "auto", padding: "8px 18px", borderRadius: 20, border: "none",
          background: COLORS.accent, color: "#0A0E1A", fontSize: 13, fontWeight: 700,
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
        }}>
          + Post Session
        </button>
      </div>
      {tab === "discover" && (
        <>
          <div style={{ padding: "16px 20px 0" }}>
            <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter by course or topic..." style={{
              width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${COLORS.cardBorder}`,
              background: COLORS.card, color: COLORS.text, fontSize: 14, outline: "none",
              boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif",
            }} />
          </div>
          <div style={{ padding: "12px 20px", display: "flex", gap: 8 }}>
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 10, padding: "8px 14px", display: "flex", gap: 6, alignItems: "center" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.accent }} />
              <span style={{ color: COLORS.muted, fontSize: 12, fontWeight: 600 }}>{filtered.length} live sessions</span>
            </div>
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 10, padding: "8px 14px" }}>
              <span style={{ color: COLORS.muted, fontSize: 12, fontWeight: 600 }}>📍 On campus</span>
            </div>
          </div>
          <div style={{ padding: "4px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", color: COLORS.muted, padding: 48, fontSize: 15 }}>No sessions match your filter.</div>
            ) : filtered.map(s => (
              <SessionCard key={s.id} session={s} onJoin={s => setJoined(j => [...j, s])} />
            ))}
          </div>
        </>
      )}
      {tab === "my sessions" && (
        <div style={{ padding: "20px" }}>
          {joined.length === 0 ? (
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 20, padding: 40, textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
              <div style={{ color: COLORS.text, fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No sessions yet</div>
              <div style={{ color: COLORS.muted, fontSize: 14, marginBottom: 20 }}>Join a session from the Discover tab or post your own.</div>
              <button onClick={() => setTab("discover")} style={{
                padding: "12px 24px", borderRadius: 12, border: "none",
                background: COLORS.accent, color: "#0A0E1A", fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}>Browse Sessions →</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ color: COLORS.text, fontWeight: 700, fontFamily: "'Syne', sans-serif", fontSize: 18, marginBottom: 4 }}>Your Sessions</div>
              {joined.map(s => (
                <div key={s.id} style={{ background: COLORS.card, border: `1px solid ${COLORS.accentDim}`, borderRadius: 16, padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ color: COLORS.accent, fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>{s.course}</div>
                      <div style={{ color: COLORS.text, fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{s.topic}</div>
                      <div style={{ color: COLORS.muted, fontSize: 13 }}>with {s.name} · {s.location}</div>
                    </div>
                    <div style={{ background: COLORS.accentDim, border: `1px solid ${COLORS.accent}`, borderRadius: 20, padding: "4px 10px" }}>
                      <span style={{ color: COLORS.accent, fontSize: 11, fontWeight: 700 }}>JOINED</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: COLORS.card, borderTop: `1px solid ${COLORS.cardBorder}`, padding: "12px 40px", display: "flex", justifyContent: "space-around" }}>
        {[
          { icon: "🔍", label: "Discover", t: "discover" },
          { icon: "📅", label: "My Sessions", t: "my sessions" },
          { icon: "👤", label: "Profile", t: "profile" },
        ].map(item => (
          <button key={item.t} onClick={() => setTab(item.t)} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            color: tab === item.t ? COLORS.accent : COLORS.muted, fontFamily: "'DM Sans', sans-serif",
          }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 600 }}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  if (!user) return <Onboarding onDone={setUser} />;
  return <MainApp user={user} />;
}