import { Movie, Review, CommunityThread, UserProfile, VoiceTrack, SubtitleTrack } from '@/types/movies';

export const movies: Movie[] = [
  {
    id: '1',
    slug: 'aurora-dreams',
    title: 'Aurora Dreams',
    description: 'A poetic sci-fi journey that follows an astronaut returning home to an Earth bathed in perpetual auroras.',
    year: 2023,
    genres: ['Sci-Fi', 'Drama'],
    coverImageUrl: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://storage.googleapis.com/astrastream/trailers/aurora-dreams.mp4',
    movieUrl: 'https://storage.googleapis.com/astrastream/movies/aurora-dreams-4k.mp4',
    voiceLanguages: ['en', 'tr', 'ru'],
    subtitleLanguages: ['en', 'tr', 'ru'],
    licenseType: 'creative_commons',
    aiTags: ['cosmic', 'meditative', 'introspective', 'space exploration'],
    rating: 4.7,
    reviewCount: 324,
    durationMinutes: 118,
    cast: ['Mei Tanaka', 'Carter Jones', 'Mila Voronova'],
    director: 'Anaïs Duval',
    era: 'recent',
    moods: ['contemplative', 'optimistic'],
    createdAt: '2024-02-12T10:00:00Z',
    updatedAt: '2024-04-01T12:00:00Z'
  },
  {
    id: '2',
    slug: 'ember-valley',
    title: 'Ember Valley',
    description: 'An intimate autumn-set romance between a chef and a botanist rebuilding a wildfire-scarred community.',
    year: 2021,
    genres: ['Romance', 'Drama'],
    coverImageUrl: 'https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://storage.googleapis.com/astrastream/trailers/ember-valley.mp4',
    movieUrl: 'https://storage.googleapis.com/astrastream/movies/ember-valley.mp4',
    voiceLanguages: ['en', 'tr'],
    subtitleLanguages: ['en', 'tr', 'ru'],
    licenseType: 'public_domain',
    aiTags: ['comforting', 'culinary', 'slow burn romance'],
    rating: 4.3,
    reviewCount: 142,
    durationMinutes: 104,
    cast: ['Rafael Mendes', 'Leyla Acar', 'Sabine Holt'],
    director: 'Emir Kaplan',
    era: 'modern',
    moods: ['warm', 'romantic'],
    createdAt: '2023-10-05T08:00:00Z',
    updatedAt: '2024-03-20T16:30:00Z'
  },
  {
    id: '3',
    slug: 'neon-odyssey',
    title: 'Neon Odyssey',
    description: 'Synthwave-infused action thriller chasing a rogue AI across the mega-cities of a neon-drenched future Earth.',
    year: 2019,
    genres: ['Action', 'Thriller'],
    coverImageUrl: 'https://images.unsplash.com/photo-1520446266423-6cbd3abce3f0?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://storage.googleapis.com/astrastream/trailers/neon-odyssey.mp4',
    movieUrl: 'https://storage.googleapis.com/astrastream/movies/neon-odyssey.mp4',
    voiceLanguages: ['en', 'ru'],
    subtitleLanguages: ['en', 'ru'],
    licenseType: 'creative_commons',
    aiTags: ['cyberpunk', 'ai rebellion', 'adrenaline', 'future noir'],
    rating: 4.1,
    reviewCount: 286,
    durationMinutes: 129,
    cast: ['Haruto Sato', 'Ines Garcia', 'Malik Petrov'],
    director: 'Lena Khristenko',
    era: 'modern',
    moods: ['energetic', 'dark'],
    createdAt: '2020-07-22T11:00:00Z',
    updatedAt: '2024-02-14T09:30:00Z'
  },
  {
    id: '4',
    slug: 'midnight-lanterns',
    title: 'Midnight Lanterns',
    description: 'A heartfelt coming-of-age drama set during the Lantern Festival blending tradition, identity, and modern love.',
    year: 2022,
    genres: ['Drama', 'Coming of Age'],
    coverImageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://storage.googleapis.com/astrastream/trailers/midnight-lanterns.mp4',
    movieUrl: 'https://storage.googleapis.com/astrastream/movies/midnight-lanterns.mp4',
    voiceLanguages: ['en'],
    subtitleLanguages: ['en', 'tr'],
    licenseType: 'creative_commons',
    aiTags: ['festival', 'identity', 'family'],
    rating: 4.8,
    reviewCount: 512,
    durationMinutes: 112,
    cast: ['Zhang Jia', 'Amelia Reyes', 'Okan Demir'],
    director: 'Mira Huang',
    era: 'recent',
    moods: ['uplifting', 'nostalgic'],
    createdAt: '2023-05-18T14:00:00Z',
    updatedAt: '2024-03-02T10:00:00Z'
  }
];

export const voiceTracks: VoiceTrack[] = [
  { movieId: '1', languageCode: 'en', audioFileUrl: '/audio/aurora-dreams-en.m4a', quality: 'hd' },
  { movieId: '1', languageCode: 'tr', audioFileUrl: '/audio/aurora-dreams-tr.m4a', quality: 'standard' },
  { movieId: '1', languageCode: 'ru', audioFileUrl: '/audio/aurora-dreams-ru.m4a', quality: 'hd' },
  { movieId: '2', languageCode: 'en', audioFileUrl: '/audio/ember-valley-en.m4a', quality: 'standard' },
  { movieId: '2', languageCode: 'tr', audioFileUrl: '/audio/ember-valley-tr.m4a', quality: 'standard' },
  { movieId: '3', languageCode: 'en', audioFileUrl: '/audio/neon-odyssey-en.m4a', quality: 'hd' },
  { movieId: '3', languageCode: 'ru', audioFileUrl: '/audio/neon-odyssey-ru.m4a', quality: 'hd' }
];

export const subtitleTracks: SubtitleTrack[] = [
  { movieId: '1', languageCode: 'en', subtitleFileUrl: '/subtitles/aurora-dreams-en.vtt', subtitleText: 'Auroras shimmering...' },
  { movieId: '1', languageCode: 'tr', subtitleFileUrl: '/subtitles/aurora-dreams-tr.vtt', subtitleText: 'Kuzey ışıkları...' },
  { movieId: '1', languageCode: 'ru', subtitleFileUrl: '/subtitles/aurora-dreams-ru.vtt', subtitleText: 'Северное сияние...' },
  { movieId: '2', languageCode: 'en', subtitleFileUrl: '/subtitles/ember-valley-en.vtt', subtitleText: 'In the ember valley...' },
  { movieId: '2', languageCode: 'tr', subtitleFileUrl: '/subtitles/ember-valley-tr.vtt', subtitleText: 'Köz vadisinde...' },
  { movieId: '2', languageCode: 'ru', subtitleFileUrl: '/subtitles/ember-valley-ru.vtt', subtitleText: 'В долине углей...' },
  { movieId: '3', languageCode: 'en', subtitleFileUrl: '/subtitles/neon-odyssey-en.vtt', subtitleText: 'Neon nights ignite...' },
  { movieId: '3', languageCode: 'ru', subtitleFileUrl: '/subtitles/neon-odyssey-ru.vtt', subtitleText: 'Неоновые ночи...' }
];

export const reviews: Review[] = [
  {
    id: 'r1',
    movieId: '1',
    userId: 'u1',
    username: 'stellar.sage',
    avatarUrl: 'https://api.dicebear.com/7.x/thumbs/svg?seed=stellar',
    rating: 5,
    text: 'A transcendent voyage. The AI recommendation perfectly matched my craving for contemplative sci-fi tonight.',
    spoilers: false,
    language: 'en',
    createdAt: '2024-03-18T20:00:00Z',
    helpfulCount: 48,
    notHelpfulCount: 2,
    replies: [
      {
        id: 'r1-1',
        movieId: '1',
        userId: 'u2',
        username: 'cosmic.voyager',
        avatarUrl: 'https://api.dicebear.com/7.x/thumbs/svg?seed=cosmic',
        rating: 0,
        text: 'Agree! The aurora soundscapes were unreal.',
        spoilers: false,
        language: 'en',
        createdAt: '2024-03-19T08:00:00Z',
        helpfulCount: 12,
        notHelpfulCount: 0
      }
    ]
  },
  {
    id: 'r2',
    movieId: '2',
    userId: 'u3',
    username: 'autumn.dreamer',
    avatarUrl: 'https://api.dicebear.com/7.x/thumbs/svg?seed=autumn',
    rating: 4,
    text: 'Comfort cinema at its best. Loved how the AI search picked up my desire for a soothing, food-centric romance.',
    spoilers: false,
    language: 'tr',
    createdAt: '2024-02-10T12:00:00Z',
    helpfulCount: 28,
    notHelpfulCount: 1
  }
];

export const threads: CommunityThread[] = [
  {
    id: 't1',
    title: 'Best winter-themed comfort movies?',
    category: 'community/recommendations',
    author: 'frostbite',
    avatarUrl: 'https://api.dicebear.com/7.x/thumbs/svg?seed=frost',
    createdAt: '2024-01-05T09:30:00Z',
    replies: 32,
    likes: 118,
    tags: ['winter', 'comfort', 'ai-suggestions'],
    body: 'Share your favorite winter comfort films! Bonus points if the AI search found them for you.'
  },
  {
    id: 't2',
    title: 'Seeking Turkish dubbed sci-fi gems',
    category: 'community/languages',
    author: 'istanbulite',
    avatarUrl: 'https://api.dicebear.com/7.x/thumbs/svg?seed=istanbul',
    createdAt: '2024-03-12T17:45:00Z',
    replies: 21,
    likes: 86,
    tags: ['turkish', 'dubbing', 'sci-fi'],
    body: 'Looking for high-quality Turkish dubbed science fiction titles. Any hidden gems on AstraStream?'
  },
  {
    id: 't3',
    title: 'Help! Subtitles out of sync on Neon Odyssey',
    category: 'community/technical',
    author: 'technerd',
    avatarUrl: 'https://api.dicebear.com/7.x/thumbs/svg?seed=tech',
    createdAt: '2024-04-08T13:15:00Z',
    replies: 5,
    likes: 15,
    tags: ['support', 'subtitles'],
    body: 'Anyone else noticing offset captions on the Russian subtitles? Trying to file a report.'
  }
];

export const profiles: UserProfile[] = [
  {
    id: 'u1',
    username: 'stellar.sage',
    avatarUrl: 'https://api.dicebear.com/7.x/thumbs/svg?seed=stellar',
    bio: 'Cinephile and aurora chaser. I love introspective sci-fi and meditative documentaries.',
    favoriteGenres: ['Sci-Fi', 'Documentary', 'Drama'],
    watchlist: ['3', '4'],
    followers: 2140,
    following: 302,
    achievements: ['Aurora Explorer', 'Top Curator', 'Spring Storyteller'],
    preferredAudio: 'en',
    preferredSubtitles: ['en', 'tr']
  }
];
