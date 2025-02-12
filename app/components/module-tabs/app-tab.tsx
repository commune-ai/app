'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Link2 } from 'lucide-react';
import Link from 'next/link';
import { memo } from 'react';

export const AppTab = memo(() => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src="/sample.png" alt="App Icon" />
          </Avatar>
        </div>
        <Link
          href="https://bettertherapy.ai/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white text-sm hover:underline hover:text-blue-600 flex items-center gap-2"
        >
          Go to App Url <Link2 className="w-4 h-4" />
        </Link>
      </div>

      <Separator className="bg-white/10" />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">App Preview</h3>
        <div className="aspect-video w-full overflow-hidden rounded-lg border border-white/10">
          <iframe
            src="https://bettertherapy.ai/"
            className="w-full h-full"
            style={{ minHeight: '400px' }}
            title="Module Application Preview"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
});

AppTab.displayName = 'AppTab';
