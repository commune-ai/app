'use client';

import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { WalletConnect } from '../wallet/wallet-connect';

export function AlternateSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <span className="text-2xl font-bold text-white">
          <span className="text-blue-400">dhub</span>
        </span>
      </SidebarHeader>
      <SidebarContent>
        <p>Content</p>
      </SidebarContent>
      <SidebarFooter>
        <WalletConnect />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
