import http from 'http';
import { readFile, access } from 'fs/promises';
import { createReadStream } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.manifest': 'application/manifest+json'
};

const moviesPath = path.join(__dirname, 'data', 'movies.json');
const movieDataRaw = await readFile(moviesPath, 'utf-8');
const movies = JSON.parse(movieDataRaw);

const genreAliases = {
  action: ['action', 'fight', 'battle'],
  adventure: ['adventure', 'journey', 'explore'],
  documentary: ['documentary', 'docu', 'true story'],
  drama: ['drama', 'dramatic', 'emotional'],
  family: ['family', 'wholesome'],
  romance: ['romance', 'romantic', 'love'],
  mystery: ['mystery', 'mysterious', 'detective'],
  thriller: ['thriller', 'suspense', 'tense'],
  "science fiction": ['sci-fi', 'science fiction', 'space', 'future'],
  music: ['music', 'musical', 'band', 'concert']
};

const moodKeywords = {
  uplifting: ['feel good', 'uplifting', 'hopeful', 'light'],
  intense: ['intense', 'thrilling', 'edge', 'tense'],
  romantic: ['romantic', 'love', 'heart'],
  mysterious: ['mystery', 'mysterious', 'enigmatic'],
  scary: ['scary', 'horror', 'haunted'],
  energetic: ['energetic', 'adrenaline', 'fast'],
  inspiring: ['inspiring', 'motivation', 'motivational'],
  nostalgic: ['nostalgic', 'retro', 'classic'],
  cerebral: ['mind bending', 'cerebral', 'thought provoking']
};

const eraKeywords = {
  classic: ['classic', 'old', 'retro', 'vintage'],
  recent: ['recent', 'new', 'latest', 'modern'],
  '80s': ['80s', "1980s"],
  '90s': ['90s', "1990s"],
  '2000s': ['2000s', '2000'],
  '2010s': ['2010s', '2010'],
  '2020s': ['2020s', '2020'],
  '90s movies': ['90s movies']
};

const languageKeywords = {
  en: ['english'],
  tr: ['turkish', 'türkçe'],
  ru: ['russian', 'русский']
};

function normalise(text) {
  return text.toLowerCase();
}

function extractQueryFeatures(prompt) {
  const lowered = normalise(prompt);
  const genres = new Set();
  const moods = new Set();
  const languages = new Set();
  let era = null;
  const people = [];

  Object.entries(genreAliases).forEach(([genre, synonyms]) => {
    if (synonyms.some((syn) => lowered.includes(syn))) {
      genres.add(genre);
    }
  });

  Object.entries(moodKeywords).forEach(([mood, keywords]) => {
    if (keywords.some((keyword) => lowered.includes(keyword))) {
      moods.add(mood);
    }
  });

  Object.entries(languageKeywords).forEach(([lang, keywords]) => {
    if (keywords.some((keyword) => lowered.includes(keyword))) {
      languages.add(lang);
    }
  });

  Object.entries(eraKeywords).forEach(([eraKey, keywords]) => {
    if (keywords.some((keyword) => lowered.includes(keyword))) {
      era = eraKey;
    }
  });

  const match = lowered.match(/starring ([a-z\s]+)/);
  if (match) {
    people.push(match[1].trim());
  }

  return {
    prompt,
    genres: Array.from(genres),
    moods: Array.from(moods),
    languages: Array.from(languages),
    era,
    people
  };
}

function scoreMovie(movie, features) {
  let score = 0;
  const breakdown = [];
  const loweredDescription = normalise(`${movie.title} ${movie.description} ${movie.genres.join(' ')}`);
  const { prompt } = features;

  const keywordMatches = features.prompt
    ? features.prompt
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(Boolean)
        .reduce((acc, token) => {
          if (loweredDescription.includes(token)) {
            return acc + 1;
          }
          return acc;
        }, 0)
    : 0;
  const keywordScore = Math.min(keywordMatches * 5, 40);
  if (keywordScore) {
    breakdown.push({ label: 'keywords', value: keywordScore });
    score += keywordScore;
  }

  if (features.genres.length) {
    const overlap = features.genres.filter((genre) =>
      movie.genres.map(normalise).includes(normalise(genre))
    );
    const genreScore = overlap.length ? 25 : 0;
    if (genreScore) {
      score += genreScore;
      breakdown.push({ label: 'genre', value: genreScore });
    }
  }

  if (features.languages.length) {
    const languageOverlap = features.languages.filter((lang) => movie.voice_languages.includes(lang));
    const languageScore = languageOverlap.length ? 20 : 0;
    if (languageScore) {
      score += languageScore;
      breakdown.push({ label: 'language', value: languageScore });
    }
  }

  if (features.moods.length) {
    const moodOverlap = features.moods.filter((mood) => movie.moods.includes(mood));
    const moodScore = moodOverlap.length ? 15 : 0;
    if (moodScore) {
      score += moodScore;
      breakdown.push({ label: 'mood', value: moodScore });
    }
  }

  if (features.era && movie.era && normalise(movie.era).includes(normalise(features.era))) {
    score += 10;
    breakdown.push({ label: 'era', value: 10 });
  }

  score += Math.round((movie.popularity || 0) * 5);
  return { movie, score, breakdown };
}

async function handleAiSearch(req, res) {
  let body = '';
  for await (const chunk of req) {
    body += chunk;
  }
  let payload = {};
  try {
    payload = JSON.parse(body || '{}');
  } catch (error) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
    return;
  }

  const query = payload.prompt || '';
  const features = extractQueryFeatures(query);
  const scored = movies.map((movie) => scoreMovie(movie, features));
  const results = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map(({ movie, score, breakdown }) => ({
      ...movie,
      relevance: score,
      breakdown
    }));

  const response = {
    query: features,
    results,
    metadata: {
      total: results.length,
      generatedAt: new Date().toISOString(),
      usedOpenAI: false
    }
  };

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(response));
}

async function handleMovieSuggestion(req, res, url) {
  const searchTerm = (url.searchParams.get('search') || '').toLowerCase();
  let items = movies;
  if (searchTerm) {
    items = movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm) ||
      movie.genres.some((genre) => genre.toLowerCase().includes(searchTerm)) ||
      (movie.ai_tags || []).some((tag) => tag.toLowerCase().includes(searchTerm))
    );
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      items: items.slice(0, 20).map((movie) => ({
        id: movie.id,
        slug: movie.slug,
        title: movie.title,
        year: movie.year,
        genres: movie.genres,
        cover_image_url: movie.cover_image_url
      }))
    })
  );
}

async function handleMovieDetails(req, res, id) {
  const movie = movies.find((item) => item.id === id);
  if (!movie) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Movie not found' }));
    return;
  }

  const related = movies
    .filter((item) => item.id !== movie.id)
    .map((item) => ({
      item,
      overlap: item.genres.filter((genre) => movie.genres.includes(genre)).length +
        item.moods.filter((mood) => movie.moods.includes(mood)).length
    }))
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 6)
    .map(({ item }) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      cover_image_url: item.cover_image_url,
      year: item.year,
      rating: item.rating
    }));

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ movie, related }));
}

function isMovieRoute(pathname) {
  return /^\/movie\/[\w-]+\/[\w-]+$/.test(pathname);
}

async function serveStatic(req, res, pathname) {
  let relativePath = pathname === '/' ? 'index.html' : pathname.slice(1);
  if (isMovieRoute(pathname)) {
    relativePath = 'index.html';
  }
  const filePath = path.join(__dirname, 'public', relativePath);
  try {
    await access(filePath);
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    createReadStream(filePath).pipe(res);
  } catch (error) {
    const fallbackPath = path.join(__dirname, 'public', 'index.html');
    try {
      await access(fallbackPath);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      createReadStream(fallbackPath).pipe(res);
    } catch (innerError) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
    }
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  if (pathname === '/api/ai-search' && req.method === 'POST') {
    await handleAiSearch(req, res);
    return;
  }

  if (pathname === '/api/movies' && req.method === 'GET') {
    await handleMovieSuggestion(req, res, url);
    return;
  }

  const movieDetailsMatch = pathname.match(/^\/api\/movies\/(\w+)/);
  if (movieDetailsMatch && req.method === 'GET') {
    await handleMovieDetails(req, res, movieDetailsMatch[1]);
    return;
  }

  serveStatic(req, res, pathname);
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
