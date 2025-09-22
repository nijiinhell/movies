import { Review } from '@/types/movies';
import Image from 'next/image';
import { MessageCircle, ShieldAlert, ThumbsDown, ThumbsUp } from 'lucide-react';

export const ReviewList = ({ reviews }: { reviews: Review[] }) => {
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <article key={review.id} className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image src={review.avatarUrl} alt={review.username} fill className="object-cover" />
              </div>
              <div>
                <p className="font-semibold text-white">{review.username}</p>
                <p className="text-xs text-white/50">{new Date(review.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="text-right text-xs text-white/70">
              <p>{'★'.repeat(review.rating || 0)}</p>
              <p className="text-white/50">Language: {review.language.toUpperCase()}</p>
            </div>
          </header>
          <p className="text-sm text-white/80">{review.text}</p>
          <footer className="flex flex-wrap items-center gap-4 text-xs text-white/60">
            <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 hover:border-white/40">
              <ThumbsUp className="h-3 w-3" /> Helpful ({review.helpfulCount})
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 hover:border-white/40">
              <ThumbsDown className="h-3 w-3" /> Not helpful ({review.notHelpfulCount})
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 hover:border-white/40">
              <MessageCircle className="h-3 w-3" /> Reply
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 hover:border-white/40">
              <ShieldAlert className="h-3 w-3" /> Report
            </button>
          </footer>
          {review.replies && review.replies.length > 0 && (
            <div className="space-y-3 border-t border-white/10 pt-4">
              {review.replies.map((reply) => (
                <div key={reply.id} className="flex gap-3 rounded-2xl border border-white/5 bg-black/30 p-4">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <Image src={reply.avatarUrl} alt={reply.username} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <p className="font-semibold text-white">{reply.username}</p>
                      <p>{new Date(reply.createdAt).toLocaleString()}</p>
                    </div>
                    <p className="mt-2 text-sm text-white/70">{reply.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  );
};
