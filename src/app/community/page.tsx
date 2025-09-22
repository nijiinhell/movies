import { threads } from '@/lib/mock-data';
import { ThreadCard } from '@/components/community/thread-card';
import { MessageSquarePlus, PlusCircle } from 'lucide-react';

const categories = [
  { slug: 'community/general', title: 'General', description: 'Global film chats, events, and announcements.' },
  { slug: 'community/reviews', title: 'Reviews', description: 'Share deep dives, spoiler threads, and quick impressions.' },
  {
    slug: 'community/recommendations',
    title: 'Recommendations',
    description: 'Ask for suggestions by mood, language, accessibility, or theme.'
  },
  { slug: 'community/languages', title: 'Languages', description: 'Discuss dubs, subtitles, and translation quality.' },
  { slug: 'community/technical', title: 'Technical', description: 'Streaming help, bug reports, and device optimisation tips.' }
];

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-12 px-6 pb-24">
      <section className="space-y-4 rounded-4xl border border-white/10 bg-white/5 p-10 text-white/70">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/60">
          <MessageSquarePlus className="h-4 w-4" /> Community hub
        </div>
        <h1 className="font-display text-4xl text-white">Your cinematic clubhouse</h1>
        <p className="max-w-2xl text-sm text-white/60">
          Host seasonal watch parties, exchange multilingual recommendations, and build collaborative watchlists. Moderators keep
          the space welcoming for every cinephile.
        </p>
        <button className="btn-primary mt-4 inline-flex items-center">
          <PlusCircle className="h-5 w-5" /> Start a thread
        </button>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => (
          <div key={category.slug} className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/70">
            <h2 className="font-display text-2xl text-white">{category.title}</h2>
            <p className="mt-2 text-sm text-white/60">{category.description}</p>
            <button className="mt-4 rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-white/40 hover:text-white">
              Explore threads
            </button>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="font-display text-3xl text-white">Featured discussions</h2>
          <p className="text-sm text-white/60">Hand-picked by moderators to highlight global voices and accessibility tips.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {threads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))}
        </div>
      </section>
    </div>
  );
}
