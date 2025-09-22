const state = {
  user: null,
  layout: 'grid',
  loading: false,
  results: [],
  suggestions: [],
  prompt: '',
  season: detectSeason(),
  reviews: {}
};

function detectSeason(date = new Date()) {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

function initialiseUser() {
  const stored = localStorage.getItem('ss-user');
  if (stored) {
    state.user = JSON.parse(stored);
  } else {
    state.user = {
      name: 'Guest',
      preferences: {
        subtitleLanguages: ['en', 'tr'],
        audioLanguage: 'en',
        theme: 'auto'
      }
    };
    localStorage.setItem('ss-user', JSON.stringify(state.user));
  }
}

function applySeasonalTheme() {
  document.body.classList.remove('season-spring', 'season-summer', 'season-autumn', 'season-winter');
  document.body.classList.add(`season-${state.season}`);
}

function createElement(tag, className, options = {}) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (options.text) element.textContent = options.text;
  if (options.html) element.innerHTML = options.html;
  return element;
}

async function fetchSuggestions(query = '') {
  const params = new URLSearchParams();
  if (query) params.set('search', query);
  const response = await fetch(`/api/movies?${params.toString()}`);
  const data = await response.json();
  state.suggestions = data.items;
  return state.suggestions;
}

function createHeader(root) {
  const header = createElement('header', 'header');
  const brand = createElement('a', 'brand');
  brand.href = '/';
  const brandLogo = createElement('div', 'brand-logo');
  const brandName = createElement('span', null, { text: 'Seasons Stream' });
  brand.append(brandLogo, brandName);

  const navActions = createElement('div', 'nav-actions');
  const joinBtn = createElement('button', null, { text: 'Join Community' });
  const discoverBtn = createElement('button', 'primary', { text: 'Discover Movies' });
  joinBtn.addEventListener('click', () => {
    document.querySelector('#community')?.scrollIntoView({ behavior: 'smooth' });
  });
  discoverBtn.addEventListener('click', () => {
    document.querySelector('#results')?.scrollIntoView({ behavior: 'smooth' });
  });
  navActions.append(joinBtn, discoverBtn);

  const mobileNav = createElement('div', 'mobile-nav');
  const menuButton = createElement('button', null, { text: '☰' });
  menuButton.addEventListener('click', () => {
    document.querySelector('.footer')?.scrollIntoView({ behavior: 'smooth' });
  });
  mobileNav.append(menuButton);

  header.append(brand, navActions, mobileNav);
  root.appendChild(header);
}

function createHero(root, onSearch) {
  const hero = createElement('section', 'hero');

  const media = createElement('div', 'hero-media');
  media.innerHTML = `
    <video autoplay muted loop playsinline>
      <source src="assets/video/solstice-rush-trailer.mp4" type="video/mp4" />
    </video>
  `;

  const content = createElement('div', 'hero-content');
  const eyebrow = createElement('div', 'hero-eyebrow', { text: `Seasonal Edition · ${state.season.toUpperCase()}` });
  const title = createElement('h1', 'hero-title', {
    text: 'Stream movies that match your mood, language, and season.'
  });
  const greeting = state.user?.name && state.user.name !== 'Guest'
    ? `Welcome back, ${state.user.name}`
    : 'Hello, movie dreamer';
  const description = createElement('p', 'hero-description', {
    text: `${greeting}! Tell our AI what you're craving and we will curate the perfect queue for your next watch party.`
  });

  const ctaGroup = createElement('div', 'cta-group');
  const discover = createElement('button', 'primary', { text: 'Discover Movies' });
  const community = createElement('button', 'secondary', { text: 'Join Community' });
  discover.addEventListener('click', () => {
    document.querySelector('#results')?.scrollIntoView({ behavior: 'smooth' });
  });
  community.addEventListener('click', () => {
    document.querySelector('#community')?.scrollIntoView({ behavior: 'smooth' });
  });
  ctaGroup.append(discover, community);

  const searchPanel = createSearchPanel(onSearch);

  content.append(eyebrow, title, description, ctaGroup, searchPanel);
  hero.append(media, content);
  root.appendChild(hero);
}

function createSearchPanel(onSearch) {
  const panel = createElement('div', 'search-panel');
  const searchForm = document.createElement('form');
  searchForm.className = 'search-input-wrapper';
  const input = document.createElement('input');
  input.type = 'search';
  input.placeholder = 'What movie mood are you in today?';
  input.value = state.prompt;
  const voiceButton = createElement('button', 'voice-button', { text: '🎤' });
  voiceButton.type = 'button';
  const recogniser = initialiseVoiceSearch(input, onSearch, voiceButton);

  const loader = createElement('span', null, { html: '<span class="loader" hidden></span>' });
  loader.firstChild?.classList.add('loading-spinner');

  searchForm.append(input, voiceButton, loader);

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    onSearch(input.value);
  });

  const suggestionList = createElement('div', 'suggestion-list');
  fetchSuggestions().then((items) => {
    items.slice(0, 8).forEach((item) => {
      const pill = createElement('span', 'suggestion-pill', { text: item.title });
      pill.addEventListener('click', () => {
        input.value = item.title;
        onSearch(item.title);
      });
      suggestionList.appendChild(pill);
    });
  });

  input.addEventListener('input', async (event) => {
    const value = event.target.value;
    if (!value) return;
    const suggestions = await fetchSuggestions(value);
    suggestionList.replaceChildren();
    suggestions.slice(0, 6).forEach((item) => {
      const pill = createElement('span', 'suggestion-pill', { text: `${item.title} (${item.year})` });
      pill.addEventListener('click', () => {
        input.value = item.title;
        onSearch(item.title);
      });
      suggestionList.appendChild(pill);
    });
  });

  panel.append(searchForm, suggestionList);

  panel.updateLoading = (isLoading) => {
    state.loading = isLoading;
    if (isLoading) {
      loader.firstChild?.removeAttribute('hidden');
      voiceButton.disabled = true;
      voiceButton.textContent = '…';
    } else {
      loader.firstChild?.setAttribute('hidden', '');
      voiceButton.disabled = false;
      voiceButton.textContent = '🎤';
    }
  };
  panel.recogniser = recogniser;
  panel.input = input;
  return panel;
}

function initialiseVoiceSearch(input, onSearch, button) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    button.disabled = true;
    button.title = 'Voice search unavailable';
    return null;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    input.value = transcript;
    onSearch(transcript);
  };
  recognition.onerror = () => {
    button.classList.remove('active');
  };
  button.addEventListener('click', () => {
    button.classList.add('active');
    recognition.start();
  });
  recognition.onend = () => button.classList.remove('active');
  return recognition;
}

function createResultsSection(root) {
  const sectionTitle = createElement('h2', 'section-title', { text: 'Your AI Matched Movies' });
  sectionTitle.id = 'results-title';
  const sectionSubtitle = createElement('p', 'section-subtitle', {
    text: 'Results adapt to your prompt, language choices, and seasonal vibes.'
  });
  const layoutSwitcher = createElement('div', 'grid-layout-options');
  const gridBtn = createElement('button', state.layout === 'grid' ? 'active' : '', { text: 'Grid' });
  const listBtn = createElement('button', state.layout === 'list' ? 'active' : '', { text: 'List' });
  const tableBtn = createElement('button', state.layout === 'table' ? 'active' : '', { text: 'Table' });
  const timelineBtn = createElement('button', state.layout === 'timeline' ? 'active' : '', { text: 'Timeline' });

  layoutSwitcher.append(gridBtn, listBtn, tableBtn, timelineBtn);

  const grid = createElement('section', 'movie-grid');
  grid.id = 'results';

  const timeline = createElement('section', 'timeline-view');
  timeline.id = 'timeline-results';
  timeline.hidden = state.layout !== 'timeline';

  function updateLayoutButtons() {
    [gridBtn, listBtn, tableBtn, timelineBtn].forEach((btn) => btn.classList.remove('active'));
    if (state.layout === 'grid') gridBtn.classList.add('active');
    if (state.layout === 'list') listBtn.classList.add('active');
    if (state.layout === 'table') tableBtn.classList.add('active');
    if (state.layout === 'timeline') timelineBtn.classList.add('active');
    renderResultsGrid(grid, timeline);
  }

  gridBtn.addEventListener('click', () => {
    state.layout = 'grid';
    grid.classList.remove('table-view');
    grid.dataset.layout = 'grid';
    timeline.hidden = true;
    updateLayoutButtons();
  });

  listBtn.addEventListener('click', () => {
    state.layout = 'list';
    grid.classList.add('table-view');
    grid.dataset.layout = 'list';
    timeline.hidden = true;
    updateLayoutButtons();
  });

  tableBtn.addEventListener('click', () => {
    state.layout = 'table';
    grid.classList.add('table-view');
    grid.dataset.layout = 'table';
    timeline.hidden = true;
    updateLayoutButtons();
  });

  timelineBtn.addEventListener('click', () => {
    state.layout = 'timeline';
    grid.dataset.layout = 'timeline';
    timeline.hidden = false;
    updateLayoutButtons();
  });

  root.append(sectionTitle, sectionSubtitle, layoutSwitcher, grid, timeline);
  renderResultsGrid(grid, timeline);
}

function renderResultsGrid(grid, timeline) {
  grid.replaceChildren();
  timeline.replaceChildren();
  if (state.loading) {
    const spinner = createElement('div', 'loading-spinner');
    grid.appendChild(spinner);
    return;
  }

  if (!state.results.length) {
    const empty = createElement('p', 'section-subtitle', {
      text: 'Start by describing your perfect movie night to our AI concierge.'
    });
    grid.appendChild(empty);
    return;
  }

  state.results.forEach((movie) => {
    const card = createMovieCard(movie);
    if (state.layout === 'timeline') {
      const row = createElement('div', 'timeline-row');
      row.append(createElement('div', null, { text: movie.year }), card);
      timeline.appendChild(row);
    } else {
      grid.appendChild(card);
    }
  });
}

function createMovieCard(movie) {
  const card = createElement('article', 'movie-card');
  const img = document.createElement('img');
  img.loading = 'lazy';
  img.src = movie.cover_image_url;
  img.alt = `${movie.title} cover`;
  card.appendChild(img);

  const content = createElement('div', 'movie-card-content');
  const title = createElement('a', 'movie-card-title', { text: movie.title });
  title.href = `/movie/${movie.id}/${movie.slug}`;
  const meta = createElement('div', 'movie-meta', { text: `${movie.year} • ${movie.genres.join(', ')}` });
  const description = createElement('p', 'movie-description', {
    text: movie.description.slice(0, 100) + (movie.description.length > 100 ? '…' : '')
  });
  const flags = createElement('div', 'language-flags');
  (movie.voice_languages || []).forEach((lang) => {
    const flag = createElement('span', 'language-flag', { text: lang });
    flags.appendChild(flag);
  });
  const ratingRow = createElement('div', 'rating-row');
  const stars = createElement('span', 'star-group', { text: '★★★★★'.slice(0, Math.round(movie.rating)) });
  const reviews = createElement('span', null, { text: `${movie.review_count} reviews` });
  ratingRow.append(stars, reviews);

  const watch = createElement('a', 'watch-now', { text: 'Watch Now' });
  watch.href = `/movie/${movie.id}/${movie.slug}`;

  content.append(title, meta, description, flags, ratingRow, watch);
  card.appendChild(content);
  return card;
}

function createCommunitySection(root) {
  const wrapper = createElement('section', 'community-panels');
  wrapper.id = 'community';
  const panels = [
    {
      title: 'Community Lounge',
      description: 'Discuss premieres, seasonal marathons, and AI-fuelled predictions with cinephiles from 120+ countries.',
      link: '#community/general'
    },
    {
      title: 'Group Watchlists',
      description: 'Build collaborative watchlists, synchronise schedules, and host themed parties with real-time chat.',
      link: '#community/group-watchlists'
    },
    {
      title: 'Achievement Badges',
      description: 'Unlock badges like Discoverer, Reviewer, Curator, and Polyglot for your contributions and discoveries.',
      link: '#community/badges'
    }
  ];

  panels.forEach((panel) => {
    const card = createElement('article', 'community-card');
    card.append(
      createElement('h3', null, { text: panel.title }),
      createElement('p', null, { text: panel.description }),
      createElement('span', 'cta-link', { text: 'Explore →' })
    );
    card.querySelector('.cta-link').addEventListener('click', () => {
      window.location.hash = panel.link;
    });
    wrapper.appendChild(card);
  });

  root.appendChild(wrapper);
}

function createForumPreview(root) {
  const forum = createElement('section', 'forum-grid');
  forum.id = 'community-forum';
  const threads = [
    {
      title: 'Springtime comfort films',
      tags: ['General', 'Seasonal'],
      summary: 'Share the films that feel like blossoms and rain.',
      likes: 420,
      replies: 62
    },
    {
      title: 'Need a thriller with Turkish dub',
      tags: ['Recommendations', 'Languages'],
      summary: 'Looking for intense but not gory suggestions for family night.',
      likes: 188,
      replies: 34
    },
    {
      title: 'Help! Subtitles out of sync',
      tags: ['Technical'],
      summary: 'Community troubleshooting guide for syncing captions.',
      likes: 92,
      replies: 18
    }
  ];
  threads.forEach((thread) => {
    const card = createElement('article', 'forum-thread');
    const header = createElement('header');
    header.append(
      createElement('h3', null, { text: thread.title }),
      createElement('span', null, { text: `${thread.likes} ▲` })
    );
    const tags = createElement('div', 'tags');
    thread.tags.forEach((tag) => tags.appendChild(createElement('span', 'tag', { text: tag })));
    card.append(header, tags, createElement('p', null, { text: thread.summary }), createElement('small', null, { text: `${thread.replies} replies · Active` }));
    forum.appendChild(card);
  });
  root.appendChild(forum);
}

function createProfileShowcase(root) {
  const profiles = createElement('section', 'profile-grid');
  const items = [
    {
      name: 'Seda A.',
      bio: 'Polyglot curator of Turkish voiceovers and indie gems.',
      genres: ['Drama', 'Romance'],
      followers: 1208,
      following: 89
    },
    {
      name: 'Eren P.',
      bio: 'Sci-fi analyst and resident subtitle sync wizard.',
      genres: ['Science Fiction', 'Thriller'],
      followers: 1980,
      following: 112
    },
    {
      name: 'Lucia R.',
      bio: 'Hosts weekly group watch parties for feel-good musicals.',
      genres: ['Music', 'Documentary'],
      followers: 905,
      following: 64
    }
  ];

  items.forEach((profile) => {
    const card = createElement('article', 'profile-card');
    const header = createElement('div', 'profile-header');
    const avatar = createElement('div', 'profile-avatar', { text: profile.name[0] });
    const meta = createElement('div');
    meta.append(createElement('h3', null, { text: profile.name }), createElement('p', null, { text: profile.bio }));
    header.append(avatar, meta);
    const badges = createElement('div', 'badge-row');
    profile.genres.forEach((genre) => badges.appendChild(createElement('span', 'badge', { text: genre })));
    card.append(header, badges, createElement('p', null, { text: `${profile.followers} followers · ${profile.following} following` }));
    profiles.appendChild(card);
  });
  root.appendChild(profiles);
}

function createReviewSection(root) {
  const section = createElement('section', 'review-section');
  const formCard = createElement('form', 'review-form');
  formCard.innerHTML = `
    <h3>Share Your Review</h3>
    <div class="form-group">
      <label for="review-movie">Movie</label>
      <select id="review-movie" required></select>
    </div>
    <div class="form-group">
      <label for="review-rating">Rating</label>
      <input id="review-rating" type="range" min="1" max="5" step="1" value="5" />
    </div>
    <div class="form-group">
      <label for="review-text">Review</label>
      <textarea id="review-text" rows="4" minlength="10" maxlength="1000" required></textarea>
    </div>
    <div class="form-group">
      <label><input type="checkbox" id="review-spoiler" /> Contains spoilers</label>
    </div>
    <div class="form-group">
      <label for="review-language">Language Preference</label>
      <select id="review-language">
        <option value="en">English</option>
        <option value="tr">Türkçe</option>
        <option value="ru">Русский</option>
      </select>
    </div>
    <div class="form-group">
      <label for="review-image">Screenshot (optional)</label>
      <input type="file" id="review-image" accept="image/*" />
    </div>
    <button type="submit" class="primary">Submit Review</button>
  `;

  const movieSelect = formCard.querySelector('#review-movie');
  fetchSuggestions().then((movies) => {
    movies.forEach((movie) => {
      const option = document.createElement('option');
      option.value = movie.id;
      option.textContent = movie.title;
      movieSelect.appendChild(option);
    });
  });

  const reviewList = createElement('div', 'review-list');
  reviewList.innerHTML = '<h3>Community Reviews</h3>';
  const reviewContainer = createElement('div');
  reviewContainer.id = 'review-container';
  reviewList.appendChild(reviewContainer);

  formCard.addEventListener('submit', (event) => {
    event.preventDefault();
    const review = {
      movieId: movieSelect.value,
      rating: Number(formCard.querySelector('#review-rating').value),
      text: formCard.querySelector('#review-text').value,
      spoiler: formCard.querySelector('#review-spoiler').checked,
      language: formCard.querySelector('#review-language').value,
      createdAt: new Date().toISOString(),
      user: state.user?.name || 'Guest'
    };
    const key = `reviews-${review.movieId}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.unshift(review);
    localStorage.setItem(key, JSON.stringify(existing));
    renderReviews(review.movieId, reviewContainer);
    formCard.reset();
  });

  renderReviews(null, reviewContainer);

  section.append(formCard, reviewList);
  root.appendChild(section);
}

function renderReviews(movieId, container) {
  container.replaceChildren();
  const keys = Object.keys(localStorage).filter((key) => key.startsWith('reviews-'));
  const reviews = keys.flatMap((key) => JSON.parse(localStorage.getItem(key) || '[]'));
  const limited = reviews.slice(0, 6);
  if (!limited.length) {
    container.appendChild(createElement('p', null, { text: 'No reviews yet. Be the pioneer reviewer!' }));
    return;
  }

  limited.forEach((review) => {
    const card = createElement('article', 'review-card');
    card.append(
      createElement('div', 'meta', { text: `${review.user} · ${new Date(review.createdAt).toLocaleString()}` }),
      createElement('div', 'star-group', { text: '★'.repeat(review.rating) }),
      createElement('p', null, { text: review.text }),
      createElement('div', 'actions', { text: 'Helpful · Not Helpful · Reply · Report' })
    );
    container.appendChild(card);
  });
}

function createAdminDashboard(root) {
  const section = createElement('section', 'admin-dashboard');
  section.innerHTML = `
    <h2>Admin Control Center</h2>
    <div class="dashboard-grid">
      <article class="dashboard-card">
        <h3>Role-Based Access</h3>
        <p>Assign roles: Super Admin, Content Manager, Moderator, Translator. Track permissions and login activity in real time.</p>
      </article>
      <article class="dashboard-card">
        <h3>Content Upload Workflow</h3>
        <p>Upload video, trailer, subtitles, and assign multi-language audio tracks. Validate licenses and schedule releases.</p>
      </article>
      <article class="dashboard-card">
        <h3>Bulk Operations</h3>
        <p>Import CSV metadata, mass tag genres, automate thumbnail generation, and verify quality with AI-assisted checks.</p>
      </article>
    </div>
  `;
  root.appendChild(section);
}

function createAdvancedSearch(root) {
  const section = createElement('section', 'search-advanced');
  section.innerHTML = `
    <h2>Advanced Search & Filters</h2>
    <div class="search-filters">
      <div class="filter-group">
        <label>Genre</label>
        <textarea rows="2" placeholder="Action, Drama, Documentary"></textarea>
      </div>
      <div class="filter-group">
        <label>Year Range</label>
        <input type="text" placeholder="1990-2024" />
      </div>
      <div class="filter-group">
        <label>Languages</label>
        <select multiple>
          <option>English Voice</option>
          <option>Türkçe Voice</option>
          <option>Русский Voice</option>
        </select>
      </div>
      <div class="filter-group">
        <label>Subtitles</label>
        <select multiple>
          <option>English</option>
          <option>Türkçe</option>
          <option>Русский</option>
        </select>
      </div>
      <div class="filter-group">
        <label>Rating Threshold</label>
        <input type="number" min="0" max="5" step="0.1" value="3.5" />
      </div>
      <div class="filter-group">
        <label>License Type</label>
        <select>
          <option value="creative_commons">Creative Commons</option>
          <option value="public_domain">Public Domain</option>
        </select>
      </div>
    </div>
  `;
  root.appendChild(section);
}

function createFooter(root) {
  const footer = createElement('footer', 'footer');
  const columns = [
    {
      title: 'Product',
      links: ['Features', 'Pricing', 'Roadmap', 'Accessibility']
    },
    {
      title: 'Community',
      links: ['Forums', 'Ambassadors', 'Creator Program', 'Events']
    },
    {
      title: 'Legal',
      links: ['Privacy Policy', 'Terms of Service', 'DMCA', 'Cookies']
    },
    {
      title: 'Apps',
      links: ['iOS', 'Android', 'Smart TV', 'PWA']
    }
  ];
  columns.forEach((column) => {
    const col = createElement('div', 'footer-column');
    col.append(createElement('h4', null, { text: column.title }));
    const list = document.createElement('ul');
    column.links.forEach((link) => {
      const item = document.createElement('li');
      item.textContent = link;
      list.appendChild(item);
    });
    col.appendChild(list);
    footer.appendChild(col);
  });
  root.appendChild(footer);
}

async function performSearch(prompt) {
  const searchPanel = document.querySelector('.search-panel');
  searchPanel?.updateLoading(true);
  renderResultsGrid(
    document.querySelector('#results'),
    document.querySelector('#timeline-results')
  );
  try {
    state.prompt = prompt;
    const response = await fetch('/api/ai-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    state.results = data.results;
    renderResultsGrid(
      document.querySelector('#results'),
      document.querySelector('#timeline-results')
    );
    document.querySelector('#results-title')?.scrollIntoView({ behavior: 'smooth' });
  } finally {
    searchPanel?.updateLoading(false);
  }
}

async function renderHome(root) {
  createHeader(root);
  const main = document.createElement('main');
  createHero(main, performSearch);
  createResultsSection(main);
  createCommunitySection(main);
  createForumPreview(main);
  createProfileShowcase(main);
  createReviewSection(main);
  createAdminDashboard(main);
  createAdvancedSearch(main);
  root.appendChild(main);
  createFooter(root);

  if (!state.results.length) {
    const defaultMovies = await fetchSuggestions();
    state.results = defaultMovies.slice(0, 8).map((movie) => ({
      ...movie,
      description: 'Preview this creative commons highlight curated for the current season.',
      voice_languages: ['en', 'tr', 'ru'],
      review_count: Math.floor(Math.random() * 800),
      rating: 4.2,
      genres: movie.genres || ['Drama'],
      subtitle_languages: ['en', 'tr']
    }));
    renderResultsGrid(document.querySelector('#results'), document.querySelector('#timeline-results'));
  }
}

async function renderMovieDetail(root, movieId) {
  createHeader(root);
  const main = document.createElement('main');
  main.className = 'video-page';
  const response = await fetch(`/api/movies/${movieId}`);
  if (!response.ok) {
    main.appendChild(createElement('p', null, { text: 'Movie not found.' }));
    root.appendChild(main);
    createFooter(root);
    return;
  }
  const data = await response.json();
  const { movie, related } = data;

  const playerShell = createElement('section', 'player-shell');
  playerShell.innerHTML = `
    <h1>${movie.title}</h1>
    <video id="movie-player" class="video-js vjs-default-skin" controls preload="auto"></video>
    <div class="language-selector">
      <h3>Audio Languages</h3>
      <div class="selector-row" id="audio-selector"></div>
    </div>
    <div class="subtitle-selector">
      <h3>Subtitle Options</h3>
      <div class="selector-row" id="subtitle-selector"></div>
    </div>
  `;

  const info = createElement('section', 'community-card');
  info.innerHTML = `
    <h2>Synopsis</h2>
    <p>${movie.description}</p>
    <div class="movie-meta">${movie.year} · ${movie.genres.join(', ')} · ${movie.duration} min</div>
    <div class="badge-row">
      <span class="badge">${movie.license_type.replace('_', ' ')}</span>
      <span class="badge">${movie.moods.join(', ')}</span>
    </div>
  `;

  const relatedSection = createElement('section', 'movie-grid');
  relatedSection.innerHTML = '<h2>Related Movies</h2>';
  related.forEach((item) => {
    const card = createMovieCard({
      ...item,
      description: 'Related recommendation from AI matchmaker.',
      voice_languages: movie.voice_languages,
      review_count: item.rating * 100,
      rating: item.rating,
      genres: movie.genres
    });
    relatedSection.appendChild(card);
  });

  main.append(playerShell, info, relatedSection);
  root.appendChild(main);
  createFooter(root);

  setupVideoPlayer(movie);
  setupDetailReviews(movie.id);
}

function setupVideoPlayer(movie) {
  const player = window.videojs('movie-player', {
    autoplay: false,
    controls: true,
    preload: 'auto',
    responsive: true,
    fluid: true
  });
  player.src({
    src: movie.movie_url,
    type: 'video/mp4'
  });

  const audioSelector = document.querySelector('#audio-selector');
  movie.voice_languages.forEach((lang) => {
    const button = createElement('button', null, { text: languageLabel(lang) });
    button.addEventListener('click', () => {
      document.querySelectorAll('#audio-selector button').forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      player.trigger('audiotrackchange', { language: lang });
    });
    audioSelector.appendChild(button);
  });
  audioSelector.querySelector('button')?.classList.add('active');

  const subtitleSelector = document.querySelector('#subtitle-selector');
  movie.subtitle_languages.forEach((lang) => {
    const button = createElement('button', null, { text: languageLabel(lang) });
    button.addEventListener('click', () => {
      document.querySelectorAll('#subtitle-selector button').forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      player.trigger('subtitlechange', { language: lang });
    });
    subtitleSelector.appendChild(button);
  });
  subtitleSelector.querySelector('button')?.classList.add('active');
}

function languageLabel(code) {
  const map = { en: 'English', tr: 'Türkçe', ru: 'Русский' };
  return map[code] || code;
}

function setupDetailReviews(movieId) {
  const reviewSection = document.querySelector('.review-section');
  if (reviewSection) return;
  const container = document.querySelector('.video-page');
  const reviewRoot = createElement('section', 'review-section');
  reviewRoot.innerHTML = '<div class="review-list"><h3>Viewer Feedback</h3><div id="detail-review-container"></div></div>';
  container.appendChild(reviewRoot);
  renderMovieReviews(movieId);
}

function renderMovieReviews(movieId) {
  const container = document.querySelector('#detail-review-container');
  if (!container) return;
  container.replaceChildren();
  const key = `reviews-${movieId}`;
  const reviews = JSON.parse(localStorage.getItem(key) || '[]');
  if (!reviews.length) {
    container.appendChild(createElement('p', null, { text: 'No reviews yet. Add your voice from the home page form!' }));
    return;
  }
  reviews.forEach((review) => {
    const card = createElement('article', 'review-card');
    card.append(
      createElement('div', 'meta', { text: `${review.user} · ${new Date(review.createdAt).toLocaleString()}` }),
      createElement('div', 'star-group', { text: '★'.repeat(review.rating) }),
      createElement('p', null, { text: review.text })
    );
    container.appendChild(card);
  });
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
}

function bootstrap() {
  initialiseUser();
  applySeasonalTheme();
  registerServiceWorker();

  const root = document.getElementById('app');
  root.replaceChildren();

  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  if (pathSegments[0] === 'movie' && pathSegments[1]) {
    renderMovieDetail(root, pathSegments[1]);
  } else {
    renderHome(root);
  }
}

document.addEventListener('DOMContentLoaded', bootstrap);
