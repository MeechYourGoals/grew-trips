
-- 1) trip_files
create table if not exists public.trip_files (
  id uuid primary key default gen_random_uuid(),
  trip_id text not null,
  name text not null,
  file_type text not null,
  content_text text,
  ai_summary text,
  extracted_events integer not null default 0,
  uploaded_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.trip_files enable row level security;

-- Read-only for now: allow SELECT for everyone (demo-safe), restrict writes
create policy "Anyone can read trip_files"
  on public.trip_files
  for select
  using (true);

create policy "Owners can insert trip_files"
  on public.trip_files
  for insert
  with check (auth.uid() = uploaded_by);

create policy "Owners can update trip_files"
  on public.trip_files
  for update
  using (auth.uid() = uploaded_by);

create policy "Owners can delete trip_files"
  on public.trip_files
  for delete
  using (auth.uid() = uploaded_by);

create trigger set_updated_at_trip_files
before update on public.trip_files
for each row execute function public.update_updated_at_column();


-- 2) trip_links
create table if not exists public.trip_links (
  id uuid primary key default gen_random_uuid(),
  trip_id text not null,
  url text not null,
  title text not null,
  description text,
  category text,
  votes integer not null default 0,
  added_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.trip_links enable row level security;

create policy "Anyone can read trip_links"
  on public.trip_links
  for select
  using (true);

create policy "Owners can insert trip_links"
  on public.trip_links
  for insert
  with check (auth.uid() = added_by);

create policy "Owners can update trip_links"
  on public.trip_links
  for update
  using (auth.uid() = added_by);

create policy "Owners can delete trip_links"
  on public.trip_links
  for delete
  using (auth.uid() = added_by);

create trigger set_updated_at_trip_links
before update on public.trip_links
for each row execute function public.update_updated_at_column();


-- 3) trip_polls
create table if not exists public.trip_polls (
  id uuid primary key default gen_random_uuid(),
  trip_id text not null,
  question text not null,
  options jsonb not null default '[]'::jsonb,
  total_votes integer not null default 0,
  status text not null default 'active', -- avoid CHECK to keep it flexible per guidelines
  created_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.trip_polls enable row level security;

create policy "Anyone can read trip_polls"
  on public.trip_polls
  for select
  using (true);

create policy "Owners can insert trip_polls"
  on public.trip_polls
  for insert
  with check (auth.uid() = created_by);

create policy "Owners can update trip_polls"
  on public.trip_polls
  for update
  using (auth.uid() = created_by);

create policy "Owners can delete trip_polls"
  on public.trip_polls
  for delete
  using (auth.uid() = created_by);

create trigger set_updated_at_trip_polls
before update on public.trip_polls
for each row execute function public.update_updated_at_column();


-- 4) trip_chat_messages
create table if not exists public.trip_chat_messages (
  id uuid primary key default gen_random_uuid(),
  trip_id text not null,
  content text not null,
  author_name text not null,
  sentiment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.trip_chat_messages enable row level security;

create policy "Anyone can read trip_chat_messages"
  on public.trip_chat_messages
  for select
  using (true);

-- Writes gated to authenticated users only (expand later if needed)
create policy "Authenticated can insert trip_chat_messages"
  on public.trip_chat_messages
  for insert
  with check (auth.uid() is not null);

create trigger set_updated_at_trip_chat_messages
before update on public.trip_chat_messages
for each row execute function public.update_updated_at_column();


-- 5) trip_preferences
create table if not exists public.trip_preferences (
  id uuid primary key default gen_random_uuid(),
  trip_id text not null unique,
  dietary jsonb not null default '[]'::jsonb,
  vibe jsonb not null default '[]'::jsonb,
  accessibility jsonb not null default '[]'::jsonb,
  business jsonb not null default '[]'::jsonb,
  entertainment jsonb not null default '[]'::jsonb,
  lifestyle jsonb not null default '[]'::jsonb,
  budget_min integer not null default 0,
  budget_max integer not null default 1000,
  time_preference text not null default 'flexible',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.trip_preferences enable row level security;

create policy "Anyone can read trip_preferences"
  on public.trip_preferences
  for select
  using (true);

-- No write policies yet to keep it read-only for demo (add later when needed)

create trigger set_updated_at_trip_preferences
before update on public.trip_preferences
for each row execute function public.update_updated_at_column();
