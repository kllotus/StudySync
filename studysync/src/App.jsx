import { useState, useEffect, useRef } from "react";

const DARK = {
  bg: "#13111C", surface: "#1C1A28", card: "#211F2E", cardBorder: "#2E2B3E",
  accent: "#A78BFA", accentDim: "#2D1F4E", accentText: "#C4B5FD",
  teal: "#5EEAD4", tealDim: "#0D3330",
  text: "#EDE9FE", subtext: "#A99EC4", muted: "#6B6485",
};
const LIGHT = {
  bg: "#F7F5FF", surface: "#EFECFF", card: "#FFFFFF", cardBorder: "#DDD8F5",
  accent: "#7C3AED", accentDim: "#EDE9FE", accentText: "#7C3AED",
  teal: "#0D9488", tealDim: "#CCFBF1",
  text: "#1E1A2E", subtext: "#6D5FA0", muted: "#9B91BE",
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
  "Practice Problems": "📝", "Discussion-based": "💬",
  "Visual / diagrams": "🖊️", "Flashcards + quizzing": "🃏",
};

// ── Smart Course Matching ──────────────────────────────────────────────────────
// Returns sessions sorted: exact course match first, then by compatibility
function getMatchedSessions(sessions, userCourses) {
  const userCourseList = userCourses
    .split(",")
    .map(c => c.trim().toUpperCase())
    .filter(Boolean);

  return [...sessions].sort((a, b) => {
    const aMatch = userCourseList.includes(a.course.toUpperCase());
    const bMatch = userCourseList.includes(b.course.toUpperCase());
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return b.compatibility - a.compatibility;
  });
}

// ── Session Room ───────────────────────────────────────────────────────────────
function SessionRoom({ session, user, onClose, T }) {
  const [messages, setMessages] = useState([
    { id: 1, sender: session.name, initials: session.initials, color: session.color, text: "Hey! Just grabbed a spot 👋", time: "2m ago", mine: false },
    { id: 2, sender: session.name, initials: session.initials, color: session.color, text: `Ready to work on ${session.topic}. Where do you want to start?`, time: "1m ago", mine: false },
  ]);
  const [input, setInput] = useState("");
  const [timerSecs, setTimerSecs] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState("focus");
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Review core concepts", done: false },
    { id: 2, text: "Work through practice problems", done: false },
    { id: 3, text: "Quiz each other", done: false },
    { id: 4, text: "Summarize key takeaways", done: false },
  ]);
  const [onMyWay, setOnMyWay] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSecs(s => {
          if (s <= 1) {
            setTimerRunning(false);
            setTimerMode(m => m === "focus" ? "break" : "focus");
            return s === 1 ? (timerMode === "focus" ? 5 * 60 : 25 * 60) : 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerMode]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage() {
    if (!input.trim()) return;
    setMessages(m => [...m, {
      id: Date.now(), sender: user.name,
      initials: user.name[0].toUpperCase(), color: T.accent,
      text: input.trim(), time: "just now", mine: true,
    }]);
    setInput("");

    // Simulate reply after 1.5s
    setTimeout(() => {
      const replies = [
        "Good point! Let me think about that...",
        "Yeah exactly, that's what I got stuck on too",
        "Can you explain that part again?",
        "Got it! Moving on to the next one?",
        "This is really helping, thanks!",
      ];
      setMessages(m => [...m, {
        id: Date.now() + 1, sender: session.name,
        initials: session.initials, color: session.color,
        text: replies[Math.floor(Math.random() * replies.length)],
        time: "just now", mine: false,
      }]);
    }, 1500);
  }

  const mins = String(Math.floor(timerSecs / 60)).padStart(2, "0");
  const secs = String(timerSecs % 60).padStart(2, "0");
  const timerProgress = timerMode === "focus"
    ? timerSecs / (25 * 60)
    : timerSecs / (5 * 60);
  const circumference = 2 * Math.PI * 36;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#00000099", zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{
        background: T.bg, borderRadius: 28, width: "100%", maxWidth: 920,
        maxHeight: "90vh", display: "flex", flexDirection: "column",
        border: `1px solid ${T.cardBorder}`, overflow: "hidden",
      }}>

        {/* Header */}
        <div style={{
          padding: "20px 28px", borderBottom: `1px solid ${T.cardBorder}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: T.card, flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12, background: session.color + "22",
              border: `1.5px solid ${session.color}66`, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 14, fontWeight: 700, color: session.color,
              fontFamily: "'Syne', sans-serif",
            }}>{session.initials}</div>
            <div>
              <div style={{ color: T.text, fontWeight: 700, fontSize: 16, fontFamily: "'Syne', sans-serif" }}>
                {session.course} · {session.topic}
              </div>
              <div style={{ color: T.subtext, fontSize: 12, marginTop: 2 }}>
                📍 {session.location} · with {session.name}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* On my way button */}
            {!onMyWay && (
              <button onClick={() => setOnMyWay(true)} style={{
                padding: "7px 14px", borderRadius: 20, border: `1px solid ${T.teal}66`,
                background: T.tealDim, color: T.teal, fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}>🚶 I'm on my way</button>
            )}
            {onMyWay && (
              <div style={{
                padding: "7px 14px", borderRadius: 20, background: T.tealDim,
                border: `1px solid ${T.teal}66`, color: T.teal, fontSize: 12, fontWeight: 600,
              }}>✓ They know you're coming</div>
            )}
            <button onClick={onClose} style={{
              background: T.surface, border: `1px solid ${T.cardBorder}`,
              borderRadius: 10, width: 32, height: 32, cursor: "pointer",
              color: T.muted, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
          </div>
        </div>

        {/* Body — 3 columns */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* LEFT: Chat */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", borderRight: `1px solid ${T.cardBorder}` }}>
            <div style={{ padding: "12px 20px", borderBottom: `1px solid ${T.cardBorder}`, flexShrink: 0 }}>
              <span style={{ color: T.subtext, fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>💬 Session Chat</span>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
              {messages.map(msg => (
                <div key={msg.id} style={{
                  display: "flex", gap: 10, flexDirection: msg.mine ? "row-reverse" : "row",
                  alignItems: "flex-end",
                }}>
                  {!msg.mine && (
                    <div style={{
                      width: 30, height: 30, borderRadius: 8, background: msg.color + "22",
                      border: `1px solid ${msg.color}55`, display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 11, fontWeight: 700, color: msg.color,
                      flexShrink: 0,
                    }}>{msg.initials}</div>
                  )}
                  <div style={{ maxWidth: "72%" }}>
                    {!msg.mine && (
                      <div style={{ color: T.muted, fontSize: 11, marginBottom: 4, marginLeft: 2 }}>{msg.sender}</div>
                    )}
                    <div style={{
                      padding: "10px 14px", borderRadius: msg.mine ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                      background: msg.mine ? T.accentDim : T.surface,
                      border: `1px solid ${msg.mine ? T.accent + "44" : T.cardBorder}`,
                      color: msg.mine ? T.accentText : T.text,
                      fontSize: 13, lineHeight: 1.5,
                    }}>{msg.text}</div>
                    <div style={{ color: T.muted, fontSize: 10, marginTop: 3, textAlign: msg.mine ? "right" : "left", marginLeft: 2 }}>{msg.time}</div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: "12px 16px", borderTop: `1px solid ${T.cardBorder}`, display: "flex", gap: 8, flexShrink: 0 }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                style={{
                  flex: 1, padding: "10px 14px", borderRadius: 12,
                  border: `1px solid ${T.cardBorder}`,
                  background: T.surface, color: T.text, fontSize: 13,
                  outline: "none", fontFamily: "'DM Sans', sans-serif",
                }}
              />
              <button onClick={sendMessage} style={{
                width: 40, height: 40, borderRadius: 12, border: "none",
                background: T.accent, color: "#13111C", cursor: "pointer", fontSize: 16,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>→</button>
            </div>
          </div>

          {/* RIGHT: Timer + Checklist */}
          <div style={{ width: 280, display: "flex", flexDirection: "column", flexShrink: 0 }}>

            {/* Pomodoro Timer */}
            <div style={{ padding: "20px", borderBottom: `1px solid ${T.cardBorder}` }}>
              <div style={{ color: T.subtext, fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>
                ⏱ {timerMode === "focus" ? "Focus Timer" : "Break Time"}
              </div>

              {/* Circular timer */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                <div style={{ position: "relative", width: 100, height: 100 }}>
                  <svg width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="50" cy="50" r="36" fill="none" stroke={T.cardBorder} strokeWidth="6" />
                    <circle
                      cx="50" cy="50" r="36" fill="none"
                      stroke={timerMode === "focus" ? T.accent : T.teal}
                      strokeWidth="6"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference * (1 - timerProgress)}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 1s linear" }}
                    />
                  </svg>
                  <div style={{
                    position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <div style={{ color: T.text, fontSize: 20, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>{mins}:{secs}</div>
                    <div style={{ color: T.muted, fontSize: 9, textTransform: "uppercase", letterSpacing: 1 }}>
                      {timerMode === "focus" ? "focus" : "break"}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setTimerRunning(r => !r)} style={{
                    padding: "8px 18px", borderRadius: 20, border: "none",
                    background: timerRunning ? T.surface : T.accent,
                    color: timerRunning ? T.subtext : "#13111C",
                    fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    border: `1px solid ${timerRunning ? T.cardBorder : "transparent"}`,
                  }}>{timerRunning ? "⏸ Pause" : "▶ Start"}</button>
                  <button onClick={() => {
                    setTimerRunning(false);
                    setTimerSecs(timerMode === "focus" ? 25 * 60 : 5 * 60);
                  }} style={{
                    padding: "8px 12px", borderRadius: 20, border: `1px solid ${T.cardBorder}`,
                    background: "transparent", color: T.muted, fontSize: 12,
                    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  }}>↺</button>
                </div>

                {/* Mode switch */}
                <div style={{ display: "flex", gap: 6, width: "100%" }}>
                  {["focus", "break"].map(m => (
                    <button key={m} onClick={() => {
                      setTimerMode(m);
                      setTimerRunning(false);
                      setTimerSecs(m === "focus" ? 25 * 60 : 5 * 60);
                    }} style={{
                      flex: 1, padding: "6px", borderRadius: 10, cursor: "pointer",
                      border: `1px solid ${timerMode === m ? (m === "focus" ? T.accent : T.teal) : T.cardBorder}`,
                      background: timerMode === m ? (m === "focus" ? T.accentDim : T.tealDim) : "transparent",
                      color: timerMode === m ? (m === "focus" ? T.accentText : T.teal) : T.muted,
                      fontSize: 11, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize",
                    }}>{m === "focus" ? "25m Focus" : "5m Break"}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
              <div style={{ color: T.subtext, fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>
                ✅ Session Goals
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {checklist.map(item => (
                  <button key={item.id} onClick={() => setChecklist(c => c.map(i => i.id === item.id ? { ...i, done: !i.done } : i))} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                    borderRadius: 10, cursor: "pointer", textAlign: "left", width: "100%",
                    border: `1px solid ${item.done ? T.teal + "44" : T.cardBorder}`,
                    background: item.done ? T.tealDim : T.surface,
                    transition: "all 0.2s",
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 6, flexShrink: 0,
                      border: `1.5px solid ${item.done ? T.teal : T.muted}`,
                      background: item.done ? T.teal : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {item.done && <span style={{ color: "#13111C", fontSize: 10, fontWeight: 800 }}>✓</span>}
                    </div>
                    <span style={{
                      color: item.done ? T.teal : T.subtext, fontSize: 13,
                      textDecoration: item.done ? "line-through" : "none",
                      fontFamily: "'DM Sans', sans-serif",
                    }}>{item.text}</span>
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 16, color: T.muted, fontSize: 12, textAlign: "center" }}>
                {checklist.filter(i => i.done).length}/{checklist.length} completed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Onboarding ─────────────────────────────────────────────────────────────────
function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ name: "", university: "", major: "", courses: "", style: "", level: "" });
  const T = DARK;

  const styleOptions = ["Practice Problems", "Discussion-based", "Visual / diagrams", "Flashcards + quizzing"];
  const levelOptions = ["Just getting started", "Struggling a bit", "Pretty comfortable", "Want to teach others"];

  const canNext =
    step === 0 ? data.name.trim().length > 0 :
    step === 1 ? data.university.trim().length > 0 :
    step === 2 ? data.major.trim().length > 0 :
    step === 3 ? data.courses.trim().length > 0 :
    step === 4 ? data.style.length > 0 :
    data.level.length > 0;

  function next() {
    if (step < 5) setStep(step + 1);
    else onDone(data);
  }

  const inputStyle = {
    width: "100%", padding: "15px 18px", borderRadius: 14,
    border: `1.5px solid ${T.cardBorder}`, background: T.surface,
    color: T.text, fontSize: 15, outline: "none", boxSizing: "border-box",
    fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      {/* Left panel */}
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
          Match with students in your exact courses, join a session room, and stay focused with a shared Pomodoro timer.
        </div>
        {[
          { icon: "🎯", text: "Matched to your exact courses" },
          { icon: "💬", text: "Live session chat & coordination" },
          { icon: "⏱", text: "Shared Pomodoro focus timer" },
          { icon: "✅", text: "Shared session goal checklist" },
        ].map(item => (
          <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: T.accentDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
              {item.icon}
            </div>
            <span style={{ color: T.subtext, fontSize: 14 }}>{item.text}</span>
          </div>
        ))}
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
        <div style={{ width: "100%", maxWidth: 460 }}>
          <div style={{ display: "flex", gap: 5, marginBottom: 40 }}>
            {[0,1,2,3,4,5].map(i => (
              <div key={i} style={{
                flex: i === step ? 4 : 1, height: 5, borderRadius: 3,
                background: i < step ? T.accent + "88" : i === step ? T.accent : T.cardBorder,
                transition: "all 0.35s ease",
              }} />
            ))}
          </div>

          <div style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: 24, padding: 40 }}>
            <div style={{ color: T.muted, fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Step {step + 1} of 6</div>

            {step === 0 && <>
              <div style={{ color: T.text, fontSize: 24, fontWeight: 700, fontFamily: "'Syne', sans-serif", marginBottom: 24 }}>What's your name?</div>
              <input autoFocus value={data.name} onChange={e => setData({ ...data, name: e.target.value })} onKeyDown={e => e.key === "Enter" && canNext && next()} placeholder="e.g. Jordan" style={inputStyle} />
            </>}

            {step === 1 && <>
              <div style={{ color: T.text, fontSize: 24, fontWeight: 700, fontFamily: "'Syne', sans-serif", marginBottom: 24 }}>Your university?</div>
              <input autoFocus value={data.university} onChange={e => setData({ ...data, university: e.target.value })} onKeyDown={e => e.key === "Enter" && canNext && next()} placeholder="e.g. University of Nebraska-Lincoln" style={inputStyle} />
            </>}

            {step === 2 && <>
              <div style={{ color: T.text, fontSize: 24, fontWeight: 700, fontFamily: "'Syne', sans-serif", marginBottom: 24 }}>Your major?</div>
              <input autoFocus value={data.major} onChange={e => setData({ ...data, major: e.target.value })} onKeyDown={e => e.key === "Enter" && canNext && next()} placeholder="e.g. Computer Science" style={inputStyle} />
            </>}

            {step === 3 && <>
              <div style={{ color: T.text, fontSize: 24, fontWeight: 700, fontFamily: "'Syne', sans-serif", marginBottom: 8 }}>Courses this semester?</div>
              <div style={{ color: T.muted, fontSize: 13, marginBottom: 20 }}>We'll match you with sessions in your exact courses first 🎯</div>
              <input autoFocus value={data.courses} onChange={e => setData({ ...data, courses: e.target.value })} onKeyDown={e => e.key === "Enter" && canNext && next()} placeholder="e.g. MATH 221, CS 310, ECON 212" style={inputStyle} />
              <div style={{ marginTop: 10, color: T.muted, fontSize: 12 }}>Separate with commas</div>
            </>}

            {step === 4 && <>
              <div style={{ color: T.text, fontSize: 24, fontWeight: 700, fontFamily: "'Syne', sans-serif", marginBottom: 24 }}>How do you study best?</div>
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
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{STYLE_EMOJI[opt]}</div>{opt}
                  </button>
                ))}
              </div>
            </>}

            {step === 5 && <>
              <div style={{ color: T.text, fontSize: 24, fontWeight: 700, fontFamily: "'Syne', sans-serif", marginBottom: 24 }}>Where are you at?</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {levelOptions.map(opt => (
                  <button key={opt} onClick={() => setData({ ...data, level: opt })} style={{
                    padding: "14px 18px", borderRadius: 14, cursor: "pointer", textAlign: "left",
                    fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                    border: `1.5px solid ${data.level === opt ? T.teal : T.cardBorder}`,
                    background: data.level === opt ? T.tealDim : T.surface,
                    color: data.level === opt ? T.teal : T.subtext,
                    transition: "all 0.15s",
                  }}>{opt}</button>
                ))}
              </div>
            </>}

            <button onClick={next} disabled={!canNext} style={{
              marginTop: 28, width: "100%", padding: "15px", borderRadius: 14, border: "none",
              background: canNext ? T.accent : T.accentDim,
              color: canNext ? "#13111C" : T.muted,
              fontSize: 15, fontWeight: 700, cursor: canNext ? "pointer" : "not-allowed",
              fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
            }}>
              {step === 5 ? "Find My Study Matches →" : "Continue →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Session Card ───────────────────────────────────────────────────────────────
function SessionCard({ session, onJoin, onOpenRoom, userCourses, T }) {
  const [joined, setJoined] = useState(false);
  const [passed, setPassed] = useState(false);

  const userCourseList = userCourses.split(",").map(c => c.trim().toUpperCase()).filter(Boolean);
  const isMyCourse = userCourseList.includes(session.course.toUpperCase());

  if (passed) return null;

  return (
    <div style={{
      background: T.card, borderRadius: 20, padding: 24, position: "relative",
      border: `1px solid ${isMyCourse ? T.accent + "55" : T.cardBorder}`,
      transition: "transform 0.2s, box-shadow 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${T.accent}15`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Course match badge */}
      {isMyCourse && (
        <div style={{
          position: "absolute", top: -10, left: 20,
          background: T.accentDim, border: `1px solid ${T.accent}66`,
          borderRadius: 20, padding: "3px 10px",
          color: T.accentText, fontSize: 10, fontWeight: 700, letterSpacing: 1,
        }}>⭐ YOUR COURSE</div>
      )}

      {/* Compatibility badge */}
      <div style={{
        position: "absolute", top: 18, right: 18,
        background: session.compatibility >= 90 ? T.accentDim : T.surface,
        border: `1px solid ${session.compatibility >= 90 ? T.accent + "66" : T.cardBorder}`,
        borderRadius: 20, padding: "4px 10px", display: "flex", alignItems: "center", gap: 5,
      }}>
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: session.compatibility >= 90 ? T.accent : T.muted }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: session.compatibility >= 90 ? T.accentText : T.muted }}>
          {session.compatibility}% match
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, marginTop: isMyCourse ? 6 : 0 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 13, background: session.color + "22",
          border: `1.5px solid ${session.color}66`, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 14, fontWeight: 700, color: session.color,
          fontFamily: "'Syne', sans-serif", flexShrink: 0,
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
        <button onClick={() => onOpenRoom(session)} style={{
          width: "100%", padding: "12px", borderRadius: 10, border: `1px solid ${T.teal}55`,
          background: T.tealDim, color: T.teal, cursor: "pointer", fontSize: 13, fontWeight: 700,
          fontFamily: "'DM Sans', sans-serif",
        }}>💬 Open Session Room →</button>
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

// ── Main App ───────────────────────────────────────────────────────────────────
function MainApp({ user }) {
  const [mode, setMode] = useState("dark");
  const T = mode === "dark" ? DARK : LIGHT;
  const [tab, setTab] = useState("discover");
  const [showPost, setShowPost] = useState(false);
  const [joined, setJoined] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [filter, setFilter] = useState("");

  const matched = getMatchedSessions(SAMPLE_SESSIONS, user.courses || "");
  const filtered = matched.filter(s =>
    !filter || s.course.toLowerCase().includes(filter.toLowerCase()) || s.topic.toLowerCase().includes(filter.toLowerCase())
  );

  const userCourseList = (user.courses || "").split(",").map(c => c.trim().toUpperCase()).filter(Boolean);
  const myCourseSessions = filtered.filter(s => userCourseList.includes(s.course.toUpperCase()));
  const otherSessions = filtered.filter(s => !userCourseList.includes(s.course.toUpperCase()));

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
        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 21, fontWeight: 800, letterSpacing: -0.5 }}>
          <span style={{ color: "#A78BFA" }}>study</span><span style={{ color: "#5EEAD4" }}>sync</span>
        </span>

        <div style={{ display: "flex", gap: 6 }}>
          {["discover", "my sessions"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "7px 18px", borderRadius: 20,
              border: `1px solid ${tab === t ? T.accent + "88" : T.cardBorder}`,
              background: tab === t ? T.accentDim : "transparent",
              color: tab === t ? T.accentText : T.muted,
              fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize",
            }}>{t}</button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setMode(m => m === "dark" ? "light" : "dark")} style={{
            padding: "7px 14px", borderRadius: 20, border: `1px solid ${T.cardBorder}`,
            background: T.surface, color: T.subtext, fontSize: 13, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 5, fontWeight: 500,
          }}>{mode === "dark" ? "☀️ Light" : "🌙 Dark"}</button>
          <button onClick={() => setShowPost(true)} style={{
            padding: "8px 18px", borderRadius: 20, border: "none",
            background: T.accent, color: "#13111C", fontSize: 13, fontWeight: 700,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}>+ Post Session</button>
          <div style={{
            width: 34, height: 34, borderRadius: 10, background: T.accentDim,
            border: `1px solid ${T.accent}55`, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 13, fontWeight: 700, color: T.accentText,
            fontFamily: "'Syne', sans-serif",
          }}>{user.name[0].toUpperCase()}</div>
        </div>
      </div>

      {/* Discover */}
      {tab === "discover" && (
        <div style={{ padding: "32px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700, color: T.text, marginBottom: 4 }}>
                Hey {user.name} 👋
              </div>
              <div style={{ color: T.subtext, fontSize: 14 }}>
                {myCourseSessions.length > 0
                  ? `${myCourseSessions.length} session${myCourseSessions.length > 1 ? "s" : ""} in your courses right now`
                  : "Study sessions happening on campus right now."}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ background: T.surface, border: `1px solid ${T.cardBorder}`, borderRadius: 10, padding: "7px 14px", display: "flex", gap: 5, alignItems: "center" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.teal }} />
                <span style={{ color: T.subtext, fontSize: 12, fontWeight: 500 }}>{filtered.length} live sessions</span>
              </div>
            </div>
          </div>

          <input value={filter} onChange={e => setFilter(e.target.value)}
            placeholder="🔍  Filter by course or topic..."
            style={{
              width: "100%", padding: "13px 18px", borderRadius: 12, border: `1px solid ${T.cardBorder}`,
              background: T.surface, color: T.text, fontSize: 14, outline: "none",
              boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif", marginBottom: 28,
            }}
          />

          {/* Your courses section */}
          {myCourseSessions.length > 0 && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ color: T.accentText, fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>⭐ Your Courses</span>
                <div style={{ flex: 1, height: 1, background: T.cardBorder }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 18, marginBottom: 36 }}>
                {myCourseSessions.map(s => (
                  <SessionCard key={s.id} session={s} onJoin={s => setJoined(j => [...j, s])} onOpenRoom={setActiveRoom} userCourses={user.courses || ""} T={T} />
                ))}
              </div>
            </>
          )}

          {/* Other sessions */}
          {otherSessions.length > 0 && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ color: T.subtext, fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Other Sessions</span>
                <div style={{ flex: 1, height: 1, background: T.cardBorder }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 18 }}>
                {otherSessions.map(s => (
                  <SessionCard key={s.id} session={s} onJoin={s => setJoined(j => [...j, s])} onOpenRoom={setActiveRoom} userCourses={user.courses || ""} T={T} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* My Sessions */}
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
                background: T.accent, color: "#13111C", fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}>Browse Sessions →</button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
              {joined.map(s => (
                <div key={s.id} style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: 16, padding: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <div style={{ color: T.accentText, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>{s.course}</div>
                      <div style={{ color: T.text, fontWeight: 600, fontSize: 15, marginBottom: 5 }}>{s.topic}</div>
                      <div style={{ color: T.subtext, fontSize: 12 }}>with {s.name} · {s.location}</div>
                    </div>
                    <div style={{ background: T.accentDim, border: `1px solid ${T.accent}55`, borderRadius: 20, padding: "3px 10px", flexShrink: 0 }}>
                      <span style={{ color: T.accentText, fontSize: 10, fontWeight: 700 }}>JOINED</span>
                    </div>
                  </div>
                  <button onClick={() => setActiveRoom(s)} style={{
                    width: "100%", padding: "10px", borderRadius: 10, border: `1px solid ${T.teal}55`,
                    background: T.tealDim, color: T.teal, cursor: "pointer", fontSize: 13, fontWeight: 700,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>💬 Open Session Room →</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  if (!user) return <Onboarding onDone={setUser} />;
  return <MainApp user={user} />;
}