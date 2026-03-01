 #🎓 StudySync

> **Real-time study partner matching with dynamic institutional branding.**  
> Built at **Raikes Hacks 2026** — FindU Track · University of Nebraska-Lincoln

StudySync connects college students with the right study partner for their exact courses, at the right moment. A smart branding engine automatically skins the entire UI to match your university's colors the moment you enter your `.edu` email — no configuration needed.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage Guide](#-usage-guide)
- [Project Documentation](#-project-documentation)
- [Team](#-team)

---

## ✨ Features

### 🎨 Dynamic Institutional Branding
Enter your `.edu` email and the entire app re-themes to your university's colors — scarlet for Nebraska, maize for Michigan, burnt orange for Texas. Unknown `.edu` domains get a clean default theme.

### 🎯 Smart Course Matching
Sessions in your enrolled courses surface first, ranked by a compatibility score built from your study style, comfort level, and course overlap. No browsing noise — your courses, front and center.

### 💬 Live Session Room
Join a session and get a fully-featured collaborative room: shared chat with live auto-replies, a Pomodoro focus timer (25-min focus / 5-min break) with circular progress, and a shared goal checklist — all in one view.

### 📅 Availability Calendar
Mark your free hours on a weekly grid. StudySync detects overlaps with matched students, highlights them in teal, and lets you schedule directly from the calendar in two taps.

### ⭐ Post-Session Rating
After every session, leave a thumbs up/down with contextual tags like "Explained well" or "Stayed focused" to build trust scores over time. Rated sessions display a badge on the card.

### 🟢 Live Availability Toggle
Toggle yourself Available or Busy from the navbar. Your status reflects immediately on cards so matched students know when you're ready to study right now.

### 👤 Editable Profile
Update your name, university email, courses, study style, and comfort level anytime from the profile modal. Changes instantly re-sort your matched sessions and re-apply your school theme.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + Vite |
| Styling | Inline styles with dynamic theme engine |
| Fonts | Google Fonts — Syne (headings), DM Sans (body) |
| State | React `useState` / `useEffect` |
| Backend & Auth | Supabase (Auth + PostgreSQL) |
| Language | JavaScript (JSX) |

---

## 📁 Project Structure

```
StudySync/
└── studysync/
    ├── src/
    │   ├── App.jsx              # All UI components — Onboarding, MainApp,
    │   │                        # SessionRoom, ProfileModal, CalendarTab,
    │   │                        # RatingModal, SessionCard, PostModal
    │   ├── main.jsx             # React entry point
    │   ├── index.css            # Base reset styles
    │   ├── services/
    │   │   └── auth.js          # Supabase auth — signUp, signIn, signOut,
    │   │                        # getCurrentUserProfile
    │   └── lib/
    │       └── supabase.js      # Supabase client initialization
    ├── docs/
    │   └── BACKEND.md           # SQL schema, RLS policies, Supabase setup
    ├── public/                  # Static assets
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Installation

### Prerequisites

- Node.js **v18 or higher**
- npm **v9 or higher**
- A [Supabase](https://supabase.com) account (free tier works)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/kllotus/StudySync.git
cd StudySync/studysync

# 2. Install dependencies
npm install

# 3. Set up environment variables (see below)
cp .env.example .env
# Edit .env and add your Supabase credentials

# 4. Set up the database
# Run the SQL from docs/BACKEND.md in your Supabase SQL editor

# 5. Start the dev server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔐 Environment Variables

Create a `.env` file in the `studysync/` directory with the following:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

You can find both values in your Supabase dashboard under **Project Settings → API**.

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 🧭 Usage Guide

### Onboarding (8 Steps)

1. **Name** — enter your first name
2. **University** — e.g. University of Nebraska-Lincoln
3. **Major** — e.g. Computer Science
4. **Courses** — comma-separated course codes: `MATH 221, CS 310, ECON 212`
5. **Study Style** — select all that apply (Practice Problems, Discussion-based, etc.)
6. **Comfort Level** — where you're at in the material
7. **College Email** — must be a `.edu` address; your school theme applies instantly
8. **Password** — creates your Supabase account and saves your profile

### Discover Tab

- Courses you enrolled in surface under **⭐ Your Courses** first
- Cards show compatibility %, live availability, study style, and location
- Use the filter bar to search by course code or topic keyword

### Session Room

1. Click **Join Session →** on any card
2. Click **Open Session Room →** to enter
3. Chat via the message input (Enter to send)
4. Start the Pomodoro timer — 25-min focus, 5-min break
5. Check off goals in the checklist as you go
6. Close the room (✕) — the **rating modal** appears automatically

### Calendar Tab

1. Click any cell to mark yourself free at that hour
2. **Teal cells** = overlap with a matched student
3. Click a teal cell → pick a student → **Schedule →**

### Profile

- Click your avatar (top-right) to open the profile modal
- Update any field and save — sessions re-sort and theme re-applies instantly

---

## 📚 Project Documentation

Technical backend details are in a dedicated sub-page to keep this README focused:

| Document | Contents |
|----------|----------|
| [🏗️ Backend & Database Setup](./docs/BACKEND.md) | SQL schema, RLS policies, Supabase Auth config, table descriptions |

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

---

<p align="center">
  <strong>studysync</strong> · find your perfect study match
</p>