import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials missing. Ensure environment variables are configured in deployment.');
}

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : undefined;

export const MOVIES_TABLE = 'movies';
export const VOICE_TRACKS_TABLE = 'voice_tracks';
export const SUBTITLE_TABLE = 'subtitles';
export const REVIEWS_TABLE = 'reviews';
export const THREADS_TABLE = 'threads';

export type SupabaseMovieRow = {
  id: string;
  title: string;
  description: string;
  year: number;
  genre: string[];
  cover_image_url: string;
  trailer_url: string;
  movie_url: string;
  voice_languages: string[];
  subtitle_languages: string[];
  license_type: string;
  ai_tags: string[];
  created_at: string;
  updated_at: string;
};

export type SupabaseVoiceTrackRow = {
  movie_id: string;
  language_code: string;
  audio_file_url: string;
  quality: 'standard' | 'hd';
};

export type SupabaseSubtitleRow = {
  movie_id: string;
  language_code: string;
  subtitle_file_url: string;
  subtitle_text: string;
};
