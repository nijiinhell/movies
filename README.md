# Seasons Stream

A modern seasonal-themed movie streaming experience with AI-assisted discovery, multi-language playback, and vibrant community tooling. Built as a full-stack prototype demonstrating Supabase-ready schemas, AI prompt parsing, PWA offline support, and responsive design patterns.

## Features

### Seasonal landing page
- Automatic theme detection using the current season with dynamic CSS variables.
- Hero carousel with background video, contextual greeting, and prominent AI search.
- Responsive navigation with quick scroll shortcuts to discovery and community spaces.

### AI-powered search
- Natural-language prompt parsing that extracts genres, moods, languages, and eras.
- Voice input via the Web Speech API, auto-suggestions, and real-time loading feedback.
- `/api/ai-search` endpoint scores each movie using keyword, genre, language, and mood relevance before applying a popularity factor.

### Movie discovery & detail views
- Responsive grid, list, table, and timeline layouts for browsing results.
- Accessible movie cards featuring languages, subtitles, star ratings, and action buttons.
- SEO-friendly dynamic routes (`/movie/[id]/[slug]`) with Video.js playback, audio/subtitle selectors, and related recommendations.

### Community ecosystem
- Forum previews, group watchlist highlights, badge showcases, and advanced review system.
- LocalStorage-backed review submissions with spoiler tagging and language preferences.
- Admin dashboard blueprint covering role management, content uploads, and bulk operations.

### Platform readiness
- Supabase schema (`supabase/schema.sql`) covering movies, voice tracks, subtitles, and watch history tables with supporting indexes.
- Progressive Web App manifest and service worker for offline caching and install prompts.
- Node.js server using native modules for static file hosting and API endpoints.

## Getting started

```bash
npm run start
```

This launches the Node.js server on [http://localhost:3000](http://localhost:3000). The server automatically serves the same SPA bundle for SEO-friendly movie routes and exposes:

- `GET /api/movies?search=` for suggestions and metadata previews.
- `GET /api/movies/:id` for detail page hydration and related content.
- `POST /api/ai-search` for AI prompt processing and scoring.

Environment variables are read directly from `process.env` (no external dependencies required). To integrate with OpenAI or Supabase, provide credentials in your runtime environment.

## Development notes

- Requires Node.js 18+ (for built-in `fetch` and ES modules).
- All assets referenced under `public/assets` are placeholders; supply production-ready media when deploying.
- Service worker caches the core shell for PWA support. Update `CACHE_NAME` when shipping new releases.
- `supabase/schema.sql` can be executed in the Supabase SQL editor or via `psql` to bootstrap the database structure.

## Roadmap ideas

- Integrate Supabase Auth for the user profile and watchlist features.
- Connect to a real vector search pipeline for semantic AI recommendations.
- Expand analytics dashboards for video engagement and conversion funnels.
- Add automated tests for the scoring engine and front-end components.
