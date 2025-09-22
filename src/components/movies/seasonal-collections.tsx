import { Flame, Leaf, Snowflake, SunMedium } from 'lucide-react';

const collections = [
  {
    title: 'Spring bloom stories',
    description: 'Tender documentaries, floral romances, and hopeful dramas curated for renewal season.',
    icon: <Leaf className="h-5 w-5" />,
    color: 'from-emerald-500/40 via-transparent to-transparent'
  },
  {
    title: 'Summer festival nights',
    description: 'Feel-good comedies, travel escapades, and global music docs to fuel long evenings.',
    icon: <SunMedium className="h-5 w-5" />,
    color: 'from-orange-500/40 via-transparent to-transparent'
  },
  {
    title: 'Autumn ember tales',
    description: 'Cozy romances, culinary journeys, and introspective indie cinema for crisp nights.',
    icon: <Flame className="h-5 w-5" />,
    color: 'from-amber-500/40 via-transparent to-transparent'
  },
  {
    title: 'Winter aurora visions',
    description: 'Snow-lit mysteries, polar documentaries, and meditative sci-fi to warm the darkest nights.',
    icon: <Snowflake className="h-5 w-5" />,
    color: 'from-sky-500/40 via-transparent to-transparent'
  }
];

export const SeasonalCollections = () => {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      {collections.map((collection) => (
        <div
          key={collection.title}
          className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${collection.color}`} />
          <div className="relative space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
              {collection.icon}
              Seasonal curation
            </div>
            <h3 className="font-display text-2xl text-white">{collection.title}</h3>
            <p className="text-sm text-white/70">{collection.description}</p>
            <button className="btn-secondary">View playlist</button>
          </div>
        </div>
      ))}
    </section>
  );
};
