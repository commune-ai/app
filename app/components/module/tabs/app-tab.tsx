'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Link2 } from 'lucide-react';
import Link from 'next/link';
import { memo } from 'react';

export const AppTab  = memo((module) => {
  return (
    <div className="space-y-6">
      <Separator className="bg-white/10" />

      <div className="space-y-4">
          <iframe
            src={module.url}
            className="w-full h-full"
            style={{ minHeight: '600px' }}
            title="Module Application Preview"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
          />
      </div>
    </div>
  );
});

AppTab.displayName = 'AppTab';
