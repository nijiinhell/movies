import { notFound } from 'next/navigation';
import { profiles, movies } from '@/lib/mock-data';
import Image from 'next/image';
import { MovieGrid } from '@/components/movies/movie-grid';
import { Heart, MessageSquare, UserPlus } from 'lucide-react';

export default function ProfilePage({ params }: { params: { username: string } }) {
  const profile = profiles.find((item) => item.username === params.username);
  if (!profile) return notFound();

  const watchlistMovies = movies.filter((movie) => profile.watchlist.includes(movie.id));

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-6 pb-24 text-white/80">
      <header className="flex flex-col gap-6 rounded-4xl border border-white/10 bg-white/5 p-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-6">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white/20">
            <Image src={profile.avatarUrl} alt={profile.username} fill className="object-cover" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-3xl text-white">{profile.username}</h1>
            <p className="text-sm text-white/60">{profile.bio}</p>
            <div className="flex gap-3 text-xs text-white/60">
              <span>{profile.followers} followers</span>
              <span>{profile.following} following</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {profile.favoriteGenres.map((genre) => (
                <span key={genre} className="rounded-full border border-white/10 px-3 py-1">
                  #{genre}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="btn-primary">
            <UserPlus className="h-4 w-4" /> Follow
          </button>
          <button className="btn-secondary">
            <MessageSquare className="h-4 w-4" /> Message
          </button>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/70">
          <h2 className="font-display text-2xl text-white">Preferences</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt>Preferred audio</dt>
              <dd className="rounded-full bg-white/10 px-3 py-1 text-white/80">{profile.preferredAudio.toUpperCase()}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Subtitle languages</dt>
              <dd className="flex gap-2">
                {profile.preferredSubtitles.map((language) => (
                  <span key={language} className="rounded-full bg-white/10 px-3 py-1">
                    {language.toUpperCase()}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/70">
          <h2 className="font-display text-2xl text-white">Achievements</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {profile.achievements.map((achievement) => (
              <li key={achievement} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <Heart className="mr-2 inline h-4 w-4 text-rose-300" /> {achievement}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="font-display text-3xl text-white">Watchlist</h2>
          <p className="text-sm text-white/60">Public list of titles they are planning to watch soon.</p>
        </div>
        <MovieGrid items={watchlistMovies} />
      </section>
    </div>
  );
}
