# 📚 StudySync

> **Campus study partner matching — built at Raikes Hacks 2026**

StudySync connects college students with the right study partner, for their exact courses, at the right moment. It's not just a matching app — it's the full study experience from first match to final problem solved.

---

## ✨ Features

**Smart Course Matching**
Sessions in your enrolled courses surface first, ranked by compatibility score based on your study style, comfort level, and courses.

**Live Session Room**
Join a session and get a shared chat, a Pomodoro focus timer with 25-min/5-min modes, and a goal checklist — all in one room.

**Availability Calendar**
Mark your free hours on a weekly grid. StudySync detects overlaps with your matched students and lets you schedule a session in two taps.

**Post-Session Rating**
After every session, leave a quick thumbs up/down with tags like "Explained well" or "Stayed focused" to build trust scores over time.

**Availability Status**
Toggle yourself Available or Busy — matched students see a live indicator on your card so they know when you're ready to study right now.

**Editable Profile**
Update your name, university, email, courses, study style, and comfort level anytime. Changes instantly re-sort your matched sessions.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + Vite |
| Styling | Inline styles with dynamic theming |
| Fonts | Google Fonts — Syne, DM Sans |
| State | React useState / useEffect |
| Backend | Supabase (school theme lookup) |
| Language | JavaScript (JSX) |

---

## 🚀 Running Locally

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/kllotus/StudySync.git
cd StudySync/studysync

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

> No environment variables or API keys required to run the app locally. The app works fully out of the box.

---

## 📁 Project Structure

```
StudySync/
└── studysync/
    ├── src/
    │   ├── App.jsx          # All components — Onboarding, SessionRoom,
    │   │                    # ProfileModal, CalendarTab, RatingModal, MainApp
    │   ├── main.jsx         # React entry point
    │   └── index.css        # Base styles
    ├── public/              # Static assets
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🧭 Walkthrough for Judges

Follow these steps to evaluate the full feature set:

**1. Onboarding**
- Fields are pre-filled for demo speed — just click through
- Step 4: select one or more study styles
- Step 5: pick a comfort level
- Click "Find My Study Matches →"

**2. Discover Tab**
- Your enrolled courses (MATH 221, CS 310, ECON 212) surface at the top under ⭐ Your Courses
- Cards show compatibility %, availability status, study style, and location
- Use the filter bar to search by course or topic

**3. Join a Session**
- Click "Join Session →" on any card
- Click "Open Session Room →" to enter the live room

**4. Session Room**
- Send a chat message (press Enter or click →)
- Start the Pomodoro timer
- Check off goals in the checklist
- Click ✕ to close — the rating modal appears automatically

**5. Rate the Session**
- Pick 👍 or 👎
- Select tags
- Submit — the card now shows a "Rated" badge

**6. Calendar Tab**
- Click cells to mark your free hours
- Teal cells = overlap with a matched student
- Click a teal cell → pick a student → Schedule →

**7. Profile**
- Click your avatar (top right)
- Edit any field and save — sessions re-sort instantly

**8. Availability Toggle**
- Click "Available" in the navbar to toggle Busy/Available
- Cards on Discover reflect live availability status

---

## 👥 Team

| Name | GitHub |
|------|--------|
| Kanwal Lotay | [@kllotus](https://github.com/kllotus) |
| Bradley Chebefuh | [@bchebefuh2](https://github.com/bchebefuh2) |

---

## 🏆 Built At

**Raikes Hacks 2026** — FindU Track  
University of Nebraska-Lincoln
