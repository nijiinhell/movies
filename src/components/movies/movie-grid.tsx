import { Movie } from '@/types/movies';
import { MovieCard } from './movie-card';
import { AiSearchResult } from '@/lib/ai-matcher';

interface MovieGridProps {
  items: (Movie | AiSearchResult)[];
}

export const MovieGrid = ({ items }: MovieGridProps) => {
  if (!items.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-black/30 p-12 text-center text-white/70">
        No movies matched your filters yet. Try a different vibe or language preference.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {items.map((item) => {
        if ('movie' in item) {
          return <MovieCard key={item.movie.id} movie={item.movie} score={item.score} highlight={item.matched} />;
        }
        return <MovieCard key={item.id} movie={item} />;
      })}
    </div>
  );
};
