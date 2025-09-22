import Link from 'next/link';
import { CommunityThread } from '@/types/movies';
import Image from 'next/image';
import { MessageSquare, ThumbsUp } from 'lucide-react';

interface ThreadCardProps {
  thread: CommunityThread;
}

export const ThreadCard = ({ thread }: ThreadCardProps) => {
  return (
    <Link
      href={`/${thread.category}/${thread.id}`}
      className="group flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 text-white/70 transition hover:border-white/40 hover:text-white"
    >
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <Image src={thread.avatarUrl} alt={thread.author} fill className="object-cover" />
        </div>
        <div>
          <p className="text-sm text-white">{thread.author}</p>
          <p className="text-xs text-white/50">{new Date(thread.createdAt).toLocaleString()}</p>
        </div>
      </div>
      <div>
        <h3 className="font-display text-xl text-white">{thread.title}</h3>
        <p className="mt-2 text-sm line-clamp-3">{thread.body}</p>
      </div>
      <div className="mt-auto flex items-center justify-between text-xs">
        <div className="flex flex-wrap gap-2">
          {thread.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-white/70">
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4 text-white/60">
          <span className="inline-flex items-center gap-1">
            <MessageSquare className="h-4 w-4" /> {thread.replies}
          </span>
          <span className="inline-flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" /> {thread.likes}
          </span>
        </div>
      </div>
    </Link>
  );
};
