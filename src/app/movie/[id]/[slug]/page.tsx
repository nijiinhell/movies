import { notFound } from 'next/navigation';
import { movies, reviews, subtitleTracks, voiceTracks } from '@/lib/mock-data';
import { VideoPlayer } from '@/components/player/video-player';
import { ReviewForm } from '@/components/reviews/review-form';
import { ReviewList } from '@/components/reviews/review-list';
import { MovieGrid } from '@/components/movies/movie-grid';
import { BookmarkPlus, Calendar, Clock, UsersRound } from 'lucide-react';

export const dynamicParams = false;

export function generateStaticParams() {
  return movies.map((movie) => ({ id: movie.id, slug: movie.slug }));
}

export default function MovieDetailsPage({ params }: { params: { id: string; slug: string } }) {
  const movie = movies.find((item) => item.id === params.id && item.slug === params.slug);
  if (!movie) return notFound();

  const movieVoiceTracks = voiceTracks.filter((track) => track.movieId === movie.id);
  const movieSubtitleTracks = subtitleTracks.filter((track) => track.movieId === movie.id);
  const movieReviews = reviews.filter((review) => review.movieId === movie.id);
  const relatedMovies = movies.filter((item) => item.id !== movie.id && item.genres.some((genre) => movie.genres.includes(genre)));

  return (
    <div className="mx-auto max-w-6xl space-y-16 px-6 pb-24 text-white/80">
      <section className="space-y-6">
        <div className="space-y-3">
          <h1 className="font-display text-4xl text-white">{movie.title}</h1>
          <p className="text-sm text-white/60">{movie.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-white/60">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2">
            <Calendar className="h-4 w-4" /> {movie.year}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2">
            <Clock className="h-4 w-4" /> {movie.durationMinutes} minutes
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2">
            <UsersRound className="h-4 w-4" /> Cast: {movie.cast.join(', ')}
          </span>
          <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-white/70 hover:border-white/40 hover:text-white">
            <BookmarkPlus className="h-4 w-4" /> Add to watchlist
          </button>
        </div>
      </section>

      <VideoPlayer movie={movie} voiceTracks={movieVoiceTracks} subtitleTracks={movieSubtitleTracks} />

      <section className="space-y-6">
        <div>
          <h2 className="font-display text-3xl text-white">Community insights</h2>
          <p className="text-sm text-white/60">Share your experience. Multilingual reviews are welcome.</p>
        </div>
        <ReviewForm movieTitle={movie.title} />
        <ReviewList reviews={movieReviews} />
      </section>

      <section className="space-y-6">
        <h2 className="font-display text-3xl text-white">Related discoveries</h2>
        <MovieGrid items={relatedMovies} />
      </section>
    </div>
  );
}
