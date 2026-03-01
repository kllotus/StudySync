# 🏗️ Backend & Database Setup

This document covers the complete Supabase setup for StudySync — SQL schema, Row Level Security policies, Auth configuration, and table descriptions.

---

## Table of Contents

- [Supabase Project Setup](#supabase-project-setup)
- [Database Schema](#database-schema)
- [Row Level Security](#row-level-security-rls-policies)
- [Auth Configuration](#auth-configuration)
- [Table Reference](#table-reference)
- [Environment Variables](#environment-variables)

---

## Supabase Project Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a region close to your users
3. Save your **database password** somewhere safe
4. Navigate to **SQL Editor** and run the schema below

---

## Database Schema

Run this SQL in your Supabase **SQL Editor** to create all required tables:

```sql
-- ─────────────────────────────────────────────
-- Users table (extends Supabase auth.users)
-- ─────────────────────────────────────────────
CREATE TABLE public.users (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name        TEXT NOT NULL,
  major       TEXT,
  courses     TEXT[],          -- array of course codes, e.g. {"MATH 221","CS 310"}
  study_style TEXT,            -- comma-separated styles
  level       TEXT,            -- comfort level
  available   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- Sessions table (study sessions posted by users)
-- ─────────────────────────────────────────────
CREATE TABLE public.sessions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id     UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  course      TEXT NOT NULL,
  topic       TEXT NOT NULL,
  location    TEXT NOT NULL,
  time        TEXT NOT NULL,
  style       TEXT NOT NULL,
  active      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- Session members (join table for users ↔ sessions)
-- ─────────────────────────────────────────────
CREATE TABLE public.session_members (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id  UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  user_id     UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  joined_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, user_id)
);

-- ─────────────────────────────────────────────
-- Ratings table (post-session feedback)
-- ─────────────────────────────────────────────
CREATE TABLE public.ratings (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id  UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  rater_id    UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  rated_id    UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  thumbs      TEXT CHECK (thumbs IN ('up', 'down')) NOT NULL,
  tags        TEXT[],
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, rater_id)
);
```

---

## Row Level Security (RLS) Policies

Run this SQL after the schema to lock down each table:

```sql
-- Enable RLS on all tables
ALTER TABLE public.users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings        ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────
-- users policies
-- ─────────────────────────────────────────────

-- Any authenticated user can read all profiles (for matching)
CREATE POLICY "Users are publicly readable"
  ON public.users FOR SELECT
  TO authenticated
  USING (true);

-- Users can only insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- ─────────────────────────────────────────────
-- sessions policies
-- ─────────────────────────────────────────────

-- Any authenticated user can view active sessions
CREATE POLICY "Sessions are publicly readable"
  ON public.sessions FOR SELECT
  TO authenticated
  USING (active = true);

-- Only the host can create a session
CREATE POLICY "Users can create own sessions"
  ON public.sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = host_id);

-- Only the host can update or deactivate their session
CREATE POLICY "Hosts can update own sessions"
  ON public.sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = host_id);

-- ─────────────────────────────────────────────
-- session_members policies
-- ─────────────────────────────────────────────

-- Members of a session can see who else is in it
CREATE POLICY "Session members are readable"
  ON public.session_members FOR SELECT
  TO authenticated
  USING (true);

-- Users can join sessions
CREATE POLICY "Users can join sessions"
  ON public.session_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can leave sessions they joined
CREATE POLICY "Users can leave sessions"
  ON public.session_members FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- ratings policies
-- ─────────────────────────────────────────────

-- Ratings are visible to authenticated users
CREATE POLICY "Ratings are readable"
  ON public.ratings FOR SELECT
  TO authenticated
  USING (true);

-- Users can submit ratings (one per session per rater)
CREATE POLICY "Users can submit ratings"
  ON public.ratings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = rater_id);
```

---

## Auth Configuration

In the Supabase dashboard under **Authentication → Settings**:

| Setting | Value |
|---------|-------|
| **Email confirmations** | Disabled (for hackathon/dev) |
| **Minimum password length** | 6 |
| **Site URL** | `http://localhost:5173` (dev) |
| **Redirect URLs** | `http://localhost:5173/**` |

> For production, enable email confirmations and update the Site URL to your deployed domain.

### Email Domain Restriction (Optional)

To restrict signups to `.edu` emails only at the database level, add a check constraint:

```sql
-- Optional: enforce .edu emails at the DB level
-- (App already validates this in the UI)
ALTER TABLE public.users
  ADD CONSTRAINT edu_email_only
  CHECK (
    (SELECT email FROM auth.users WHERE id = public.users.id)
    ILIKE '%.edu'
  );
```

---

## Table Reference

### `public.users`

| Column | Type | Description |
|--------|------|-------------|
| `id` | `UUID` | Primary key, references `auth.users.id` |
| `name` | `TEXT` | Display name |
| `major` | `TEXT` | Academic major |
| `courses` | `TEXT[]` | Array of course codes (e.g. `{"MATH 221","CS 310"}`) |
| `study_style` | `TEXT` | Comma-separated preferred study styles |
| `level` | `TEXT` | Comfort level with material |
| `available` | `BOOLEAN` | Live availability status |
| `created_at` | `TIMESTAMPTZ` | Account creation timestamp |

### `public.sessions`

| Column | Type | Description |
|--------|------|-------------|
| `id` | `UUID` | Primary key |
| `host_id` | `UUID` | FK → `users.id` |
| `course` | `TEXT` | Course code (e.g. `MATH 221`) |
| `topic` | `TEXT` | Session topic |
| `location` | `TEXT` | Campus location |
| `time` | `TEXT` | Human-readable time (e.g. `Now → 3hrs`) |
| `style` | `TEXT` | Study style for this session |
| `active` | `BOOLEAN` | Whether session is currently live |
| `created_at` | `TIMESTAMPTZ` | When the session was posted |

### `public.session_members`

| Column | Type | Description |
|--------|------|-------------|
| `id` | `UUID` | Primary key |
| `session_id` | `UUID` | FK → `sessions.id` |
| `user_id` | `UUID` | FK → `users.id` |
| `joined_at` | `TIMESTAMPTZ` | When the user joined |

### `public.ratings`

| Column | Type | Description |
|--------|------|-------------|
| `id` | `UUID` | Primary key |
| `session_id` | `UUID` | FK → `sessions.id` |
| `rater_id` | `UUID` | FK → `users.id` (who submitted) |
| `rated_id` | `UUID` | FK → `users.id` (who was rated) |
| `thumbs` | `TEXT` | `'up'` or `'down'` |
| `tags` | `TEXT[]` | Array of feedback tags |
| `created_at` | `TIMESTAMPTZ` | Submission timestamp |

---

## Environment Variables

Add these to `studysync/.env`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Find both values in your Supabase dashboard under **Project Settings → API**.

The `supabase.js` client reads them like this:

```js
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

---

*Back to [README.md](../README.md)*