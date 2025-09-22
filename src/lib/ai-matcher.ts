import { movies } from './mock-data';
import type { Movie } from '@/types/movies';

type SearchIntent = {
  moodKeywords: string[];
  genreKeywords: string[];
  languagePreferences: string[];
  eraPreferences: string[];
  includeCast: string[];
  includeDirector: string[];
};

const KEYWORD_MAP = {
  moods: ['feel good', 'scary', 'romantic', 'comfort', 'cozy', 'exciting', 'chill', 'nostalgic', 'uplifting', 'dark'],
  eras: ['classic', 'recent', 'modern', '90s', '2000s', '80s'],
  genres: [
    'action',
    'adventure',
    'animation',
    'comedy',
    'documentary',
    'drama',
    'thriller',
    'romance',
    'sci-fi',
    'fantasy',
    'horror',
    'crime',
    'mystery'
  ]
};

const normalize = (value: string) => value.toLowerCase();

const extractIntent = (prompt: string): SearchIntent => {
  const normalized = normalize(prompt);
  const moodKeywords = KEYWORD_MAP.moods.filter((mood) => normalized.includes(mood));
  const genreKeywords = KEYWORD_MAP.genres.filter((genre) => normalized.includes(genre));
  const eraPreferences = KEYWORD_MAP.eras.filter((era) => normalized.includes(era));

  const languagePreferences: string[] = [];
  if (normalized.includes('turkish')) languagePreferences.push('tr');
  if (normalized.includes('russian')) languagePreferences.push('ru');
  if (normalized.includes('english')) languagePreferences.push('en');

  const includeCast: string[] = [];
  const includeDirector: string[] = [];

  movies.forEach((movie) => {
    movie.cast.forEach((actor) => {
      if (normalized.includes(actor.toLowerCase())) includeCast.push(actor);
    });
    if (normalized.includes(movie.director.toLowerCase())) includeDirector.push(movie.director);
  });

  return { moodKeywords, genreKeywords, languagePreferences, eraPreferences, includeCast, includeDirector };
};

const computeScore = (movie: Movie, intent: SearchIntent): number => {
  let score = 0;
  const haystack = [movie.title, movie.description, movie.aiTags.join(' '), movie.genres.join(' '), movie.moods.join(' ')]
    .join(' ')
    .toLowerCase();

  intent.moodKeywords.forEach((mood) => {
    if (haystack.includes(mood)) score += 0.4;
  });

  intent.genreKeywords.forEach((genre) => {
    if (movie.genres.map((g) => g.toLowerCase()).includes(genre)) score += 0.25;
  });

  if (intent.languagePreferences.length === 0) {
    score += 0.1;
  } else {
    intent.languagePreferences.forEach((code) => {
      if (movie.voiceLanguages.includes(code as Movie['voiceLanguages'][number])) score += 0.2;
      if (movie.subtitleLanguages.includes(code as Movie['subtitleLanguages'][number])) score += 0.15;
    });
  }

  intent.eraPreferences.forEach((era) => {
    if (era === '90s' && movie.year >= 1990 && movie.year < 2000) score += 0.15;
    if (['classic', 'recent', 'modern'].includes(era) && movie.era === era) score += 0.15;
  });

  intent.includeCast.forEach((actor) => {
    if (movie.cast.includes(actor)) score += 0.3;
  });

  intent.includeDirector.forEach((director) => {
    if (movie.director === director) score += 0.3;
  });

  score += movie.rating * 0.05 + movie.reviewCount * 0.0005;
  return Number(score.toFixed(3));
};

export type AiSearchResult = {
  movie: Movie;
  score: number;
  matched: {
    moods: string[];
    genres: string[];
    languages: string[];
    era: string[];
  };
};

export const performAiSearch = (prompt: string): AiSearchResult[] => {
  const intent = extractIntent(prompt);
  return movies
    .map((movie) => ({
      movie,
      score: computeScore(movie, intent),
      matched: {
        moods: intent.moodKeywords.filter((keyword) => movie.moods.map((m) => m.toLowerCase()).includes(keyword)),
        genres: intent.genreKeywords.filter((genre) => movie.genres.map((g) => g.toLowerCase()).includes(genre)),
        languages: intent.languagePreferences.filter((lang) =>
          movie.voiceLanguages.includes(lang as Movie['voiceLanguages'][number]) ||
          movie.subtitleLanguages.includes(lang as Movie['subtitleLanguages'][number])
        ),
        era: intent.eraPreferences.filter((era) => era === movie.era)
      }
    }))
    .filter((entry) => entry.score > 0.15)
    .sort((a, b) => b.score - a.score);
};
