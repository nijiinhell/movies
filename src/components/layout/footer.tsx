import Link from 'next/link';
import { Mail, Twitter, Youtube, Github } from 'lucide-react';

const footerLinks = [
  {
    title: 'Platform',
    links: [
      { name: 'Discover', href: '/' },
      { name: 'Community', href: '/community' },
      { name: 'AI Search', href: '/#ai-search' },
      { name: 'Mobile Apps', href: '/pwa' }
    ]
  },
  {
    title: 'Company',
    links: [
      { name: 'About', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Contact', href: '/contact' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy', href: '/privacy' },
      { name: 'Terms', href: '/terms' },
      { name: 'DMCA', href: '/dmca' },
      { name: 'Licensing', href: '/licensing' }
    ]
  }
];

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-neutral-950">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        <div className="space-y-4">
          <h3 className="font-display text-2xl text-white">AstraStream</h3>
          <p className="text-sm text-neutral-300">
            Seasonal-first streaming platform built for global movie lovers with AI-assisted discovery and community-powered
            storytelling.
          </p>
          <div className="flex gap-3">
            <Link href="mailto:hello@astrastream.com" className="rounded-full border border-white/10 p-2 text-white/70 hover:text-white">
              <Mail className="h-4 w-4" />
            </Link>
            <Link href="https://twitter.com" className="rounded-full border border-white/10 p-2 text-white/70 hover:text-white">
              <Twitter className="h-4 w-4" />
            </Link>
            <Link href="https://youtube.com" className="rounded-full border border-white/10 p-2 text-white/70 hover:text-white">
              <Youtube className="h-4 w-4" />
            </Link>
            <Link href="https://github.com" className="rounded-full border border-white/10 p-2 text-white/70 hover:text-white">
              <Github className="h-4 w-4" />
            </Link>
          </div>
        </div>
        {footerLinks.map((section) => (
          <div key={section.title} className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/70">{section.title}</h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              {section.links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="transition hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/60">
        © {new Date().getFullYear()} AstraStream. All rights reserved.
      </div>
    </footer>
  );
};
