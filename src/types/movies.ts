export type VoiceLanguage = 'en' | 'tr' | 'ru';
export type SubtitleLanguage = VoiceLanguage;

export interface VoiceTrack {
  movieId: string;
  languageCode: VoiceLanguage;
  audioFileUrl: string;
  quality: 'standard' | 'hd';
}

export interface SubtitleTrack {
  movieId: string;
  languageCode: SubtitleLanguage;
  subtitleFileUrl: string;
  subtitleText: string;
}

export interface Movie {
  id: string;
  slug: string;
  title: string;
  description: string;
  year: number;
  genres: string[];
  coverImageUrl: string;
  trailerUrl: string;
  movieUrl: string;
  voiceLanguages: VoiceLanguage[];
  subtitleLanguages: SubtitleLanguage[];
  licenseType: 'creative_commons' | 'public_domain';
  aiTags: string[];
  rating: number;
  reviewCount: number;
  durationMinutes: number;
  cast: string[];
  director: string;
  era: 'classic' | 'modern' | 'recent';
  moods: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  movieId: string;
  userId: string;
  username: string;
  avatarUrl: string;
  rating: number;
  text: string;
  spoilers: boolean;
  language: VoiceLanguage;
  createdAt: string;
  helpfulCount: number;
  notHelpfulCount: number;
  replies?: Review[];
}

export interface CommunityThread {
  id: string;
  title: string;
  category: string;
  author: string;
  avatarUrl: string;
  createdAt: string;
  replies: number;
  likes: number;
  tags: string[];
  body: string;
}

export interface UserProfile {
  id: string;
  username: string;
  avatarUrl: string;
  bio: string;
  favoriteGenres: string[];
  watchlist: string[];
  followers: number;
  following: number;
  achievements: string[];
  preferredAudio: VoiceLanguage;
  preferredSubtitles: SubtitleLanguage[];
}
