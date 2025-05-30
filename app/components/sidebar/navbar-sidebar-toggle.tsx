'use client';

import { Button } from '@/components/ui/button';
import { Layout, LayoutDashboard } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavbarSidebarStore } from '@/store/navbar';

export function NavbarSidebarToggle() {
  const { isAlternateLayout, onToggle } = useNavbarSidebarStore();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-8 right-8 z-50 rounded-full h-12 w-12 bg-blue-500 border-blue-400 text-white hover:bg-blue-600 hover:border-blue-500 shadow-lg"
            onClick={onToggle}
          >
            {isAlternateLayout ? (
              <Layout className="h-5 w-5" />
            ) : (
              <LayoutDashboard className="h-5 w-5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Toggle Layout</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
