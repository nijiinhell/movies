'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Loader2, UploadCloud } from 'lucide-react';

interface ReviewFormValues {
  rating: number;
  text: string;
  spoilers: boolean;
  language: 'en' | 'tr' | 'ru';
  screenshot?: FileList;
}

export const ReviewForm = ({ movieTitle }: { movieTitle: string }) => {
  const { register, handleSubmit, watch, setValue } = useForm<ReviewFormValues>({
    defaultValues: { rating: 5, text: '', spoilers: false, language: 'en' }
  });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (values: ReviewFormValues) => {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.info('Review submitted', values);
    setValue('text', '');
    setSubmitting(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/70"
    >
      <div>
        <h3 className="font-display text-2xl text-white">Share your thoughts on {movieTitle}</h3>
        <p className="text-sm text-white/60">Minimum 10 characters, up to 1000. Mark spoilers when necessary.</p>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-white">
          <span className="text-sm uppercase tracking-[0.2em] text-white/60">Rating</span>
          <div className="flex items-center gap-1 text-2xl">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setValue('rating', value)}
                className={`transition ${watch('rating') >= value ? 'text-yellow-300' : 'text-white/20'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-white/70">
          <input type="checkbox" {...register('spoilers')} className="h-4 w-4 rounded border-white/20 bg-transparent" />
          Contains spoilers
        </label>
        <div className="flex items-center gap-2 text-sm text-white/70">
          <span>Review language</span>
          <select
            {...register('language')}
            className="rounded-full border border-white/20 bg-black/40 px-4 py-2 text-white focus:border-white/60 focus:outline-none"
          >
            <option value="en">English</option>
            <option value="tr">Türkçe</option>
            <option value="ru">Русский</option>
          </select>
        </div>
      </div>
      <textarea
        {...register('text', { minLength: 10, maxLength: 1000 })}
        placeholder="Tell the community why this movie resonated with you..."
        className="min-h-[140px] w-full rounded-3xl border border-white/20 bg-black/40 px-5 py-4 text-sm text-white focus:border-white/60 focus:outline-none"
      />
      <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-white/20 bg-black/20 p-6 text-sm text-white/70">
        <UploadCloud className="h-6 w-6" />
        <span>Upload up to 3 screenshots (optional)</span>
        <input type="file" multiple accept="image/*" className="hidden" {...register('screenshot')} />
      </label>
      <button type="submit" className="btn-primary w-full justify-center">
        {submitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Submitting review...
          </>
        ) : (
          'Publish review'
        )}
      </button>
    </form>
  );
};
