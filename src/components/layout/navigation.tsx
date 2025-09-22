'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSeason } from './season-provider';
import { useTheme } from 'next-themes';
import { Sun, Moon, Search, UserCircle2, MessageCircle, LayoutDashboard } from 'lucide-react';

const links = [
  { href: '/', label: 'Discover' },
  { href: '/community', label: 'Community' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/admin', label: 'Admin' }
];

export const Navigation = () => {
  const pathname = usePathname();
  const { season } = useSeason();
  const { theme, setTheme } = useTheme();

  return (
    <header className={`fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-neutral-950/70 backdrop-blur-xl season-${season}`}>
      <div className="seasonal-overlay" />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
            <LayoutDashboard className="h-6 w-6 text-white" />
          </span>
          <div className="flex flex-col">
            <span className="font-display text-xl text-white">AstraStream</span>
            <span className="text-xs text-white/70">Seasonal movie intelligence</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-white/80 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-white ${pathname === link.href ? 'text-white' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/#ai-search"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/90 transition hover:border-white/40 hover:text-white"
          >
            <Search className="h-4 w-4" />
            Quick search
          </Link>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/80 transition hover:border-white/40 hover:text-white"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Link
            href="/profile/you"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/80 transition hover:border-white/40 hover:text-white"
          >
            <UserCircle2 className="h-5 w-5" />
          </Link>
          <Link
            href="/community"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/80 transition hover:border-white/40 hover:text-white"
          >
            <MessageCircle className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
};
