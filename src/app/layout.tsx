import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { SeasonProvider } from '@/components/layout/season-provider';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { ThemeWrapper } from '@/components/layout/theme-wrapper';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata: Metadata = {
  title: 'AstraStream — Seasonal Movie Streaming Powered by AI',
  description:
    'A modern seasonal movie streaming platform featuring AI-powered discovery, global language support, and a thriving community.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} bg-neutral-950 text-neutral-100`}>
        <ThemeWrapper>
          <SeasonProvider>
            <div className="min-h-screen flex flex-col">
              <Navigation />
              <main className="flex-1 pt-16">{children}</main>
              <Footer />
            </div>
          </SeasonProvider>
        </ThemeWrapper>
      </body>
    </html>
  );
}
