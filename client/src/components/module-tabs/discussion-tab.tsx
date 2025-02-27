'use client';

import { JSX, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

type Comment = {
  readonly id: number;
  readonly user: string;
  readonly avatar: string;
  readonly content: string;
  readonly timestamp: string;
};

type DiscussionTabProps = {
  readonly moduleName: string;
};

const INITIAL_COMMENTS: readonly Comment[] = [
  {
    id: 1,
    user: '0x3d',
    avatar: '/avatars/alice.png',
    content: 'This module looks promising! Has anyone used it for large-scale data processing?',
    timestamp: '2 hours ago',
  },
  {
    id: 2,
    user: '8CDE',
    avatar: '/avatars/bob.png',
    content: "I've been testing it out, and the performance is impressive. Definitely worth a try!",
    timestamp: '1 hour ago',
  },
] as const;

export function DiscussionTab({ moduleName }: DiscussionTabProps): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [comments, setComments] = useState<readonly Comment[]>(INITIAL_COMMENTS);
  const [newComment, setNewComment] = useState<string>('');

  const handleCommentSubmit = (): void => {
    toast.warning("Wait for the next version of dhub to access this feature");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Discussion about {moduleName}</h2>
      <ScrollArea className="h-full pr-4">
        <div className="space-y-6 ">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-4">
              <Avatar>
                <AvatarImage src={comment.avatar} alt={comment.user} />
                <AvatarFallback>{comment.user[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">{comment.user}</h3>
                  <span className="text-xs text-gray-400">{comment.timestamp}</span>
                </div>
                <p className="text-sm text-gray-300">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="space-y-4">
        <Textarea
          placeholder="Add your comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder-gray-400"
        />
        <Button onClick={handleCommentSubmit} className="bg-green-500 text-white hover:bg-green-600">
          Post Comment
        </Button>
      </div>
    </div>
  );
}
