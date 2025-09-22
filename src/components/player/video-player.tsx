'use client';

import { useMemo, useState } from 'react';
import { Movie, SubtitleTrack, VoiceTrack } from '@/types/movies';
import { Film, Languages, MonitorSpeaker, Volume2 } from 'lucide-react';

interface VideoPlayerProps {
  movie: Movie;
  voiceTracks: VoiceTrack[];
  subtitleTracks: SubtitleTrack[];
}

export const VideoPlayer = ({ movie, voiceTracks, subtitleTracks }: VideoPlayerProps) => {
  const [audioLanguage, setAudioLanguage] = useState(movie.voiceLanguages[0]);
  const [subtitleLanguage, setSubtitleLanguage] = useState<string | 'off'>(movie.subtitleLanguages[0] || 'off');
  const [fontSize, setFontSize] = useState(16);
  const [position, setPosition] = useState<'bottom' | 'top'>('bottom');

  const selectedAudio = useMemo(
    () => voiceTracks.find((track) => track.languageCode === audioLanguage),
    [audioLanguage, voiceTracks]
  );

  const selectedSubtitle = useMemo(
    () => subtitleTracks.find((track) => track.languageCode === subtitleLanguage),
    [subtitleLanguage, subtitleTracks]
  );

  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/80">
        <video
          key={`${movie.id}-${audioLanguage}`}
          controls
          className="aspect-video w-full"
          poster={movie.coverImageUrl}
        >
          <source src={movie.movieUrl} type="video/mp4" />
          {voiceTracks.map((track) => (
            <track key={track.languageCode} kind="descriptions" srcLang={track.languageCode} src={track.audioFileUrl} />
          ))}
          {subtitleTracks.map((track) => (
            <track
              key={track.subtitleFileUrl}
              default={track.languageCode === subtitleLanguage}
              kind="subtitles"
              src={track.subtitleFileUrl}
              srcLang={track.languageCode}
              label={track.languageCode.toUpperCase()}
            />
          ))}
        </video>
        <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-xs text-white/70">
          <Film className="h-4 w-4" />
          Adaptive streaming enabled
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-white">
              <MonitorSpeaker className="h-4 w-4" />
              Audio tracks
            </div>
            <span className="text-xs text-white/60">Quality auto adjusts</span>
          </div>
          {selectedAudio && (
            <p className="mt-2 text-xs text-white/60">
              Currently playing {selectedAudio.languageCode.toUpperCase()} audio in {selectedAudio.quality.toUpperCase()} quality.
            </p>
          )}
          <div className="mt-4 grid gap-3">
            {voiceTracks.map((track) => (
              <button
                key={track.languageCode}
                onClick={() => setAudioLanguage(track.languageCode)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${
                  audioLanguage === track.languageCode
                    ? 'border-white/70 bg-white/10 text-white'
                    : 'border-white/10 text-white/70 hover:border-white/40'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Volume2 className="h-4 w-4" />
                  <span className="font-semibold">{track.languageCode.toUpperCase()}</span>
                  <span className="text-xs text-white/60">{track.quality.toUpperCase()}</span>
                </span>
                <span className="text-xs text-white/50">Preview</span>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-white">
              <Languages className="h-4 w-4" />
              Subtitles
            </div>
            <button
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60"
              onClick={() => setSubtitleLanguage((current) => (current === 'off' ? movie.subtitleLanguages[0] : 'off'))}
            >
              Toggle
            </button>
          </div>
          <div className="mt-4 grid gap-2">
            <div className="flex flex-wrap gap-2 text-xs">
              {movie.subtitleLanguages.map((language) => (
                <button
                  key={language}
                  onClick={() => setSubtitleLanguage(language)}
                  className={`rounded-full px-4 py-2 transition ${
                    subtitleLanguage === language
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {language.toUpperCase()}
                </button>
              ))}
              <button
                onClick={() => setSubtitleLanguage('off')}
                className={`rounded-full px-4 py-2 transition ${
                  subtitleLanguage === 'off' ? 'bg-white/20 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                Off
              </button>
            </div>
            <div className="mt-3 grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs">
              <label className="flex items-center justify-between">
                <span>Font size</span>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={fontSize}
                  onChange={(event) => setFontSize(Number(event.target.value))}
                  className="w-2/3"
                />
              </label>
              <div className="flex items-center justify-between">
                <span>Position</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPosition('bottom')}
                    className={`rounded-full px-3 py-1 ${position === 'bottom' ? 'bg-white/30 text-white' : 'bg-white/10 text-white/70'}`}
                  >
                    Bottom
                  </button>
                  <button
                    onClick={() => setPosition('top')}
                    className={`rounded-full px-3 py-1 ${position === 'top' ? 'bg-white/30 text-white' : 'bg-white/10 text-white/70'}`}
                  >
                    Top
                  </button>
                </div>
              </div>
              {selectedSubtitle && (
                <p className="text-white/60">
                  Search inside subtitles: <span className="text-white">{selectedSubtitle.subtitleText.slice(0, 64)}...</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
        <h3 className="font-display text-2xl text-white">Playback intelligence</h3>
        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>Adaptive bitrate adjusts quality between 480p and 4K based on your current connection.</li>
          <li>Seasonal theming shifts the player chrome to match the current mood.</li>
          <li>Keyboard shortcuts: press L to cycle language, S to toggle subtitles, +/- to adjust caption size.</li>
        </ul>
      </div>
    </section>
  );
};
