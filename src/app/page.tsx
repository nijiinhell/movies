import { Hero } from '@/components/movies/hero';
import { AiSearch } from '@/components/movies/ai-search';
import { SeasonalCollections } from '@/components/movies/seasonal-collections';
import { MovieGrid } from '@/components/movies/movie-grid';
import { movies, threads } from '@/lib/mock-data';
import { ThreadCard } from '@/components/community/thread-card';
import { Sparkle, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-16 px-6 pb-24">
      <Hero />

      <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <AiSearch />
        <div className="space-y-6">
          <div className="rounded-4xl border border-white/10 bg-white/5 p-6 text-white/80">
            <div className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-white/60">
              <Sparkle className="h-4 w-4" /> Trending right now
            </div>
            <p className="mt-3 text-2xl font-semibold text-white">Seasonally spotlighted films</p>
            <p className="mt-2 text-sm text-white/60">
              Our AI blends community favorites with seasonal intent to surface the perfect queue for tonight.
            </p>
          </div>
          <MovieGrid items={movies} />
        </div>
      </section>

      <SeasonalCollections />

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-white/60">Community pulse</p>
            <h2 className="font-display text-3xl text-white">Join the conversation</h2>
            <p className="text-sm text-white/60">
              Discover multilingual discussions, recommendations, and technical guides curated by our moderators.
            </p>
          </div>
          <button className="btn-secondary">
            <Users className="h-4 w-4" /> View community hub
          </button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {threads.slice(0, 3).map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))}
        </div>
      </section>
    </div>
  );
}
