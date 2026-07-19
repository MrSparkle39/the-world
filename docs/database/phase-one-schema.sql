-- Phase One draft schema for The World
-- Application runs on localStorage now; this prepares a future Supabase/Postgres backend.

create extension if not exists "pgcrypto";

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  explorer_name text not null check (char_length(explorer_name) between 1 and 24),
  age_bracket text not null check (age_bracket in ('6-8', '9-12', '13-16')),
  explorer_style text not null,
  companion_id text,
  coins integer not null default 0 check (coins >= 0),
  starlight integer not null default 0 check (starlight >= 0),
  created_at timestamptz not null default now(),
  last_visited_at timestamptz not null default now()
);

create table if not exists inventory_entries (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete cascade,
  item_id text not null,
  quantity integer not null check (quantity > 0),
  acquired_at timestamptz not null default now(),
  source text not null,
  favourite boolean not null default false,
  unique (player_id, item_id)
);

create table if not exists player_progress (
  player_id uuid primary key references players(id) on delete cascade,
  completed_onboarding boolean not null default false,
  visited_locations jsonb not null default '[]'::jsonb,
  collected_dailies jsonb not null default '{}'::jsonb,
  wheel_spins jsonb not null default '{}'::jsonb,
  quest_states jsonb not null default '{}'::jsonb,
  arcade_high_scores jsonb not null default '{}'::jsonb,
  arcade_rewards_claimed jsonb not null default '{}'::jsonb,
  discovered_secrets jsonb not null default '[]'::jsonb,
  world_flags jsonb not null default '{}'::jsonb,
  placed_decorations jsonb not null default '[]'::jsonb,
  worn_items jsonb not null default '[]'::jsonb,
  journal_unlocks jsonb not null default '[]'::jsonb,
  locked_door_clicks integer not null default 0,
  bakery_quest_done boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists player_settings (
  player_id uuid primary key references players(id) on delete cascade,
  music boolean not null default true,
  sfx boolean not null default true,
  volume real not null default 0.7,
  motion text not null default 'full',
  text_size text not null default 'standard',
  high_contrast boolean not null default false
);

create table if not exists game_reward_ledger (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete cascade,
  game_id text not null,
  score integer not null,
  coins_awarded integer not null,
  created_at timestamptz not null default now()
);

create table if not exists event_snapshots (
  id text primary key,
  name text not null,
  status text not null,
  stage text not null,
  community_progress integer not null default 0,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
