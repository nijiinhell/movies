import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/types/movies';
import { Globe2, Languages, PlayCircle, Star } from 'lucide-react';

const languageLabel: Record<string, string> = {
  en: 'English',
  tr: 'Türkçe',
  ru: 'Русский'
};

const languageFlag: Record<string, string> = {
  en: '🇺🇸',
  tr: '🇹🇷',
  ru: '🇷🇺'
};

interface MovieCardProps {
  movie: Movie;
  score?: number;
  highlight?: {
    moods?: string[];
    genres?: string[];
    languages?: string[];
  };
}

export const MovieCard = ({ movie, score, highlight }: MovieCardProps) => {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60 shadow-2xl transition hover:-translate-y-1 hover:border-white/30">
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={movie.coverImageUrl}
          alt={movie.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs text-white/80">
          {movie.durationMinutes} min · {movie.year}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg text-white line-clamp-2">{movie.title}</h3>
            <div className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-yellow-300">
              <Star className="h-3 w-3" />
              <span>{movie.rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-sm text-neutral-300 line-clamp-3">{movie.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-white/80">
          {movie.genres.map((genre) => (
            <span key={genre} className="season-pill bg-white/10 text-white/80">
              {genre}
            </span>
          ))}
        </div>
        <div className="space-y-3 text-xs text-neutral-300">
          <div className="flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-white/60" />
            <div className="flex gap-2">
              {movie.voiceLanguages.map((lang) => (
                <span key={lang} className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-1">
                  <span>{languageFlag[lang]}</span>
                  {languageLabel[lang]}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-white/60" />
            <div className="flex gap-2">
              {movie.subtitleLanguages.map((lang) => (
                <span key={lang} className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-1">
                  <span>{languageFlag[lang]}</span>
                  Subs
                </span>
              ))}
            </div>
          </div>
        </div>
        {score !== undefined && (
          <div className="rounded-2xl bg-white/5 p-3 text-xs text-white/80">
            <p className="font-semibold text-white">AI match score {Math.round(score * 100)}%</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {highlight?.moods?.map((mood) => (
                <span key={mood} className="rounded-full bg-emerald-500/20 px-2 py-1 text-emerald-200">
                  Mood: {mood}
                </span>
              ))}
              {highlight?.genres?.map((genre) => (
                <span key={genre} className="rounded-full bg-blue-500/20 px-2 py-1 text-blue-200">
                  Genre: {genre}
                </span>
              ))}
              {highlight?.languages?.map((language) => (
                <span key={language} className="rounded-full bg-purple-500/20 px-2 py-1 text-purple-200">
                  Language: {language}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="mt-auto flex items-center justify-between">
          <Link href={`/movie/${movie.id}/${movie.slug}`} className="btn-primary">
            <PlayCircle className="h-5 w-5" />
            Watch now
          </Link>
          <div className="text-xs text-white/60">{movie.reviewCount} reviews</div>
        </div>
      </div>
    </div>
  );
};
