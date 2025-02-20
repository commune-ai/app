'use client';

import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { WalletConnect } from '/wallet/wallet-connect';

export function AlternateSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"
    >
      <SidebarHeader>
        {/* icon */}
        <span className="text-2xl font-bold text-white">
          <span className="text-blue-400">dhub</span>
        </span>
      </SidebarHeader>
      <SidebarContent>
        {/* network and tags */}
        <p>Content</p>
      </SidebarContent>
      <SidebarFooter>
        {/* wallet connect */}
        <WalletConnect />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
