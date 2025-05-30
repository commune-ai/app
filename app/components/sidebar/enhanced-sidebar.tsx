
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
import { AccountSidebar } from '@/components/account/account-sidebar';
import { FriendsSidebar } from '@/components/sidebar/friends-sidebar';
import { CryptoSidebar } from '@/components/crypto/crypto-sidebar';
import { MessageSigner } from '@/components/crypto/message-signer';

export function EnhancedSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <AccountSidebar />
        <MessageSigner />
        <CryptoSidebar />
        <FriendsSidebar />
      </SidebarContent>
      <SidebarFooter>
        <WalletConnect />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
