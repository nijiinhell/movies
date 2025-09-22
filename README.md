# AstraStream

AstraStream is a concept-stage seasonal movie streaming experience that combines AI-powered discovery with global language
support and a vibrant community hub.

## Features

- 🎨 **Seasonal Theming** – Automatic seasonal palettes, backgrounds, and illustrations that adapt with the calendar.
- 🔍 **AI Concierge** – Natural language search with voice input, auto suggestions, and contextual match highlights.
- 🎬 **Cinematic Library** – Responsive movie grid, rich card design, multilingual audio/subtitle indicators, and watch now CTA.
- 📺 **Advanced Player** – Multi-language audio selector, subtitle styling controls, and playback intelligence panel.
- 📝 **Reviews & Community** – Multilingual reviews, helpfulness voting, nested replies, and forum-style discussion previews.
- 👤 **Profiles & Social** – Showcase preferences, achievements, followers, and public watchlists.
- 🗄️ **Supabase Ready** – SQL schema definitions for movies, voice tracks, and subtitles tables.
- ☁️ **Future Integrations** – Placeholder hooks for authentication, analytics, notifications, and admin workflows.

## Getting Started

```bash
npm install
npm run dev
```

Set the following environment variables for Supabase and AI providers when ready:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

## Project Structure

- `src/app` – Next.js app directory with the landing page, community hub, and dynamic movie/profile routes.
- `src/components` – Reusable UI for layout, movies, community, reviews, and player experiences.
- `src/lib` – Mock data, AI matching helpers, and Supabase client placeholder.
- `src/types` – Shared TypeScript interfaces for movies, reviews, threads, and profiles.
- `supabase-schema.sql` – Database schema ready for Supabase migrations.

## Testing

Run linting to ensure code quality:

```bash
npm run lint
```

## License

MIT © 2024 AstraStream
