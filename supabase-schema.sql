-- Movies catalog
create table if not exists public.movies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  year int2 not null,
  genre text[] not null default '{}',
  cover_image_url text not null,
  trailer_url text,
  movie_url text,
  voice_languages text[] not null default '{}',
  subtitle_languages text[] not null default '{}',
  license_type text not null check (license_type in ('creative_commons', 'public_domain')),
  ai_tags text[] not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Audio tracks
create table if not exists public.voice_tracks (
  id bigserial primary key,
  movie_id uuid references public.movies(id) on delete cascade,
  language_code text not null,
  audio_file_url text not null,
  quality text not null check (quality in ('standard', 'hd')),
  created_at timestamptz default now()
);

-- Subtitle tracks
create table if not exists public.subtitles (
  id bigserial primary key,
  movie_id uuid references public.movies(id) on delete cascade,
  language_code text not null,
  subtitle_file_url text not null,
  subtitle_text text,
  created_at timestamptz default now()
);
