'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import { Loader2, Mic, MicOff, Sparkle, XCircle } from 'lucide-react';
import { AiSearchResult } from '@/lib/ai-matcher';

const fetcher = (url: string, prompt: string) =>
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  }).then((res) => res.json());

const suggestions = [
  'Find me a comforting winter romance with Turkish dubbing',
  'I want a neon cyberpunk thriller with Russian subtitles',
  'Suggest a feel good summer movie under 2 hours',
  'Show me classic documentaries with English audio',
  'What are some autumn-set dramas with foodie themes?'
];

type SearchResponse = {
  prompt: string;
  results: AiSearchResult[];
};

export const AiSearch = () => {
  const [query, setQuery] = useState('');
  const [shouldFetch, setShouldFetch] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState<string | null>(suggestions[0]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [listening, setListening] = useState(false);

  const { data, isLoading, mutate } = useSWR<SearchResponse>(
    shouldFetch && query ? ['/api/ai-search', query] : null,
    ([url, prompt]) => fetcher(url, prompt),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false
    }
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setShouldFetch(true);
      setListening(false);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
  }, []);

  const startVoiceInput = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.start();
    setListening(true);
  };

  const stopVoiceInput = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShouldFetch(true);
    mutate(undefined, { revalidate: true });
  };

  const handleSuggestion = (text: string) => {
    setQuery(text);
    setActiveSuggestion(text);
    setShouldFetch(true);
    mutate(undefined, { revalidate: true });
  };

  const placeholder = useMemo(() => 'What movie mood are you in today?', []);

  return (
    <div id="ai-search" className="relative overflow-hidden rounded-4xl border border-white/10 bg-neutral-950/70 p-10 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
      <div className="relative space-y-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-3xl text-white">AI cinematic concierge</h2>
            <p className="text-sm text-white/70">
              Ask for vibes, voices, languages, eras, even actors. Our AI translates your mood into precise cinematic matches.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2 text-sm text-white/80 transition hover:border-white/40 hover:text-white"
            onClick={() => handleSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)])}
          >
            <Sparkle className="h-4 w-4" />
            Surprise me
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
              className="h-16 w-full rounded-3xl border border-white/20 bg-black/50 px-6 pr-32 text-lg text-white shadow-inner focus:border-white/60 focus:outline-none"
            />
            <div className="absolute inset-y-0 right-3 flex items-center gap-2">
              {listening ? (
                <button
                  type="button"
                  onClick={stopVoiceInput}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-500/80 text-white shadow-lg"
                >
                  <MicOff className="h-5 w-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startVoiceInput}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white shadow-lg transition hover:bg-white/40"
                  aria-label="Voice search"
                >
                  <Mic className="h-5 w-5" />
                </button>
              )}
              <button type="submit" className="btn-primary h-12 px-6">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Find movies'}
              </button>
            </div>
          </div>
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setShouldFetch(false);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm text-white/60 transition hover:border-white/40 hover:text-white"
            >
              <XCircle className="h-4 w-4" />
              Clear
            </button>
          )}
        </form>

        <div className="flex flex-wrap gap-3 text-sm text-white/60">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSuggestion(suggestion)}
              className={`rounded-full border px-4 py-2 transition ${
                activeSuggestion === suggestion
                  ? 'border-white/60 bg-white/10 text-white'
                  : 'border-white/10 bg-white/5 hover:border-white/40'
              }`}
            >
              {suggestion}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {data?.results && data.results.length > 0 ? (
            <div className="grid gap-6">
              {data.results.map((result) => (
                <div
                  key={result.movie.id}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80 transition hover:border-white/40"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-display text-2xl text-white">{result.movie.title}</h3>
                      <p className="text-sm text-white/70">{result.movie.description}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-white/70">Match score</p>
                      <p className="font-display text-3xl text-white">{Math.round(result.score * 100)}%</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/80">
                    {result.matched.moods.map((mood) => (
                      <span key={mood} className="rounded-full bg-emerald-500/20 px-3 py-1">
                        Mood · {mood}
                      </span>
                    ))}
                    {result.matched.genres.map((genre) => (
                      <span key={genre} className="rounded-full bg-blue-500/20 px-3 py-1">
                        Genre · {genre}
                      </span>
                    ))}
                    {result.matched.languages.map((language) => (
                      <span key={language} className="rounded-full bg-purple-500/20 px-3 py-1">
                        Language · {language}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : shouldFetch && !isLoading ? (
            <p className="rounded-3xl border border-white/10 bg-black/30 p-6 text-center text-white/60">
              We could not find a perfect match. Try describing the mood, language, or era differently.
            </p>
          ) : (
            <p className="text-sm text-white/60">Your personalized results will appear here.</p>
          )}
        </div>
      </div>
    </div>
  );
};
