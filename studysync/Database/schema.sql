-- =============================================
-- StudySync Database Schema
-- Run this in Supabase → SQL Editor
-- =============================================

-- Users table (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  major text,
  courses text[] default '{}',   -- e.g. ["MATH 221", "CS 310"]
  study_style text,               -- "Practice Problems", "Discussion-based", etc.
  level text,                     -- "Struggling a bit", "Pretty comfortable", etc.
  created_at timestamp with time zone default now()
);

-- Sessions table (what PostModal creates)
create table public.sessions (
  id uuid default gen_random_uuid() primary key,
  host_id uuid references public.users(id) on delete cascade not null,
  course text not null,
  topic text not null,
  location text not null,
  time_window text not null,      -- "Now → 3hrs" or "Tonight 7-9pm"
  style text not null,
  tags text[] default '{}',       -- ["quiet", "focused"]
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Who joined what
create table public.session_members (
  session_id uuid references public.sessions(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  joined_at timestamp with time zone default now(),
  primary key (session_id, user_id)
);

-- =============================================
-- Row Level Security (RLS) — keeps data safe
-- =============================================

alter table public.users enable row level security;
alter table public.sessions enable row level security;
alter table public.session_members enable row level security;

-- Users: anyone can read profiles, only you can edit yours
create policy "Public profiles are viewable by everyone"
  on public.users for select using (true);

create policy "Users can insert their own profile"
  on public.users for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users for update using (auth.uid() = id);

-- Sessions: anyone logged in can read, only host can edit/delete
create policy "Sessions are viewable by everyone"
  on public.sessions for select using (true);

create policy "Logged in users can create sessions"
  on public.sessions for insert with check (auth.uid() = host_id);

create policy "Only host can update their session"
  on public.sessions for update using (auth.uid() = host_id);

create policy "Only host can delete their session"
  on public.sessions for delete using (auth.uid() = host_id);

-- Session members: anyone can read, only you can join/leave
create policy "Session members are viewable by everyone"
  on public.session_members for select using (true);

create policy "Logged in users can join sessions"
  on public.session_members for insert with check (auth.uid() = user_id);

create policy "Users can only remove themselves"
  on public.session_members for delete using (auth.uid() = user_id);

-- =============================================
-- Enable Realtime (for join notifications)
-- =============================================
alter publication supabase_realtime add table public.session_members;