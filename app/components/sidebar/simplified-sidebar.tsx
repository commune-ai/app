
'use client';

import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { WalletConnect } from '@/wallet/connect/connect';
import { SimplifiedAccount } from '@/components/account/simplified-account';
import { SimpleCryptoTools } from '@/components/crypto/simple-crypto-tools';

export function SimplifiedSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"
    >
      <SidebarHeader>
        <span className="text-2xl font-bold text-white">
          <span className="text-blue-400">commune</span>
        </span>
      </SidebarHeader>
      <SidebarContent className="space-y-4">
        <SimplifiedAccount />
        <SimpleCryptoTools />
      </SidebarContent>
      <SidebarFooter>
        <WalletConnect />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
