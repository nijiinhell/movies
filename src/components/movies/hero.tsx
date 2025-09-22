'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSeason } from '../layout/season-provider';
import { Sparkle, Users, Zap } from 'lucide-react';

const seasonalMedia: Record<string, string> = {
  spring: 'https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=1600&q=80',
  summer: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1600&q=80',
  autumn: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
  winter: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80'
};

const seasonalCopy: Record<string, { title: string; subtitle: string }> = {
  spring: {
    title: 'Blossom into new stories',
    subtitle: 'Celebrate renewal with uplifting dramas and poetic documentaries curated for longer days.'
  },
  summer: {
    title: 'Sun-drenched adventures await',
    subtitle: 'Dive into feel-good blockbusters, surfside romances, and energetic travelogues perfect for warm nights.'
  },
  autumn: {
    title: 'Embrace cinematic coziness',
    subtitle: 'Snuggle into amber-hued romances, comfort cooking shows, and thoughtful indie gems.'
  },
  winter: {
    title: 'Find warmth in winter tales',
    subtitle: 'Discover snow-lit mysteries, aurora-lit sci-fi, and community-driven stories to brighten long nights.'
  }
};

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export const Hero = () => {
  const { season } = useSeason();
  const copy = seasonalCopy[season];
  const media = seasonalMedia[season];

  return (
    <section className={`relative overflow-hidden rounded-4xl border border-white/10 bg-neutral-950/80 text-white season-${season}`}>
      <div className="seasonal-overlay" />
      <div className="relative grid gap-8 overflow-hidden lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-10 p-10 lg:p-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80">
            <Sparkle className="h-4 w-4" />
            {greeting()}, cinephile
          </div>
          <div className="space-y-4">
            <h1 className="font-display text-5xl leading-tight">{copy.title}</h1>
            <p className="max-w-2xl text-lg text-white/70">{copy.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/#ai-search" className="btn-primary">
              Start discovering
            </Link>
            <Link href="/community" className="btn-secondary">
              Join community
            </Link>
          </div>
          <dl className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <dt className="flex items-center gap-2 text-sm text-white/70">
                <Zap className="h-4 w-4" /> AI matches served
              </dt>
              <dd className="mt-2 font-display text-3xl">2.4M</dd>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <dt className="flex items-center gap-2 text-sm text-white/70">
                <Users className="h-4 w-4" /> Community members
              </dt>
              <dd className="mt-2 font-display text-3xl">180k</dd>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <dt className="flex items-center gap-2 text-sm text-white/70">
                Seasonal playlists curated
              </dt>
              <dd className="mt-2 font-display text-3xl">520</dd>
            </div>
          </dl>
        </div>
        <div className="relative h-full min-h-[420px]">
          <Image src={media} alt={`${season} feature`} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/70" />
          <div className="absolute bottom-6 left-6 rounded-3xl bg-white/10 p-6 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">Seasonal highlights</p>
            <p className="mt-2 font-display text-2xl">Expertly curated collections drop every equinox.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
