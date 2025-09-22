-- Movies table holds core metadata and streaming references
create table if not exists movies (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  title text not null,
  slug text not null unique,
  description text,
  year integer,
  genres text[] default array[]::text[],
  cover_image_url text,
  trailer_url text,
  movie_url text,
  voice_languages text[] default array[]::text[],
  subtitle_languages text[] default array[]::text[],
  license_type text check (license_type in ('creative_commons', 'public_domain')),
  ai_tags text[] default array[]::text[],
  rating numeric(3,2) default 0,
  review_count integer default 0,
  duration integer,
  moods text[] default array[]::text[],
  era text,
  popularity numeric(4,2) default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists movies_slug_idx on movies (slug);
create index if not exists movies_genres_idx on movies using gin (genres);
create index if not exists movies_ai_tags_idx on movies using gin (ai_tags);

-- Voice tracks for multilingual playback
create table if not exists voice_tracks (
  id uuid primary key default gen_random_uuid(),
  movie_id uuid references movies(id) on delete cascade,
  language_code text not null,
  audio_file_url text not null,
  quality text check (quality in ('standard', 'hd')) default 'standard',
  created_at timestamptz default now()
);

create index if not exists voice_tracks_movie_idx on voice_tracks (movie_id);

-- Subtitle storage for accessibility and AI search indexing
create table if not exists subtitles (
  id uuid primary key default gen_random_uuid(),
  movie_id uuid references movies(id) on delete cascade,
  language_code text not null,
  subtitle_file_url text,
  subtitle_text text,
  created_at timestamptz default now()
);

create index if not exists subtitles_movie_idx on subtitles (movie_id);
create index if not exists subtitles_language_idx on subtitles (language_code);

-- Basic watch history for recommendation engine
create table if not exists watch_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  movie_id uuid references movies(id) on delete cascade,
  watched_at timestamptz default now(),
  completed boolean default false,
  rating numeric(3,2)
);

create index if not exists watch_history_user_idx on watch_history (user_id);
create index if not exists watch_history_movie_idx on watch_history (movie_id);

-- Materialized view blueprint for AI relevance scoring
create materialized view if not exists movie_ai_index as
select
  m.id,
  m.title,
  m.genres,
  m.moods,
  m.voice_languages,
  m.subtitle_languages,
  coalesce(m.ai_tags, array[]::text[]) as ai_tags,
  ts_rank_cd(
    setweight(to_tsvector('english', coalesce(m.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(m.description, '')), 'B'),
    plainto_tsquery('english', coalesce(m.title, ''))
  ) as base_rank
from movies m;
