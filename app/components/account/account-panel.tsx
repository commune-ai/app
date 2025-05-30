
'use client';

import * as React from 'react';
import { useCallback, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useWalletStore } from '@/wallet/state';
import { LogOut, Settings, User, Copy, Check } from 'lucide-react';
import { truncateAddress } from '@/utils/wallet-utils';
import { NetworkType, WalletType } from '@/wallet/types';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function AccountPanel() {
  const { wallet, walletConnected, setWalletConnected } = useWalletStore();
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleSignOut = useCallback(() => {
    setWalletConnected(false);
    router.push('/');
  }, [setWalletConnected, router]);

  const handleCopyAddress = useCallback(() => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [wallet?.address]);

  const handleSettings = useCallback(() => {
    router.push('/account/settings');
  }, [router]);

  const getWalletIcon = useCallback((walletType: WalletType) => {
    switch (walletType) {
      case WalletType.POLKADOT:
        return '/images/wallets/polkadot.svg';
      case WalletType.PASSWORD:
        return '/images/wallets/password.svg';
      default:
        return '/images/wallets/generic.svg';
    }
  }, []);

  const getNetworkName = useCallback((networkType: NetworkType) => {
    switch (networkType) {
      case NetworkType.POLKADOT:
        return 'Polkadot';
      case NetworkType.KUSAMA:
        return 'Kusama';
      case NetworkType.LOCAL:
        return 'Local';
      default:
        return 'Unknown';
    }
  }, []);

  if (!walletConnected || !wallet) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <h2 className="text-lg font-medium text-white mb-2">Account</h2>
        <p className="text-sm text-gray-400 mb-4">You are not connected</p>
        <Button
          onClick={() => router.push('/signin')}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          Sign In
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push('/signup')}
          className="w-full mt-2 border-white/10 bg-white/5 hover:bg-white/10"
        >
          Create Account
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center pb-3">
        <h2 className="text-lg font-medium text-white">Account</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-black/90 border-white/10 text-white">
            <DropdownMenuItem onClick={handleSettings} className="cursor-pointer hover:bg-white/10">
              <User className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer hover:bg-white/10 text-red-400">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-20 w-20 border-2 border-blue-500/30">
          <AvatarImage src={getWalletIcon(wallet.name)} alt={wallet.name} />
          <AvatarFallback className="bg-blue-500/20 text-blue-300">
            {wallet.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="text-center">
          <h3 className="text-lg font-medium text-white">{wallet.name}</h3>
          <div className="mt-1 flex items-center justify-center space-x-1">
            <span className="text-sm text-gray-400">{truncateAddress(wallet.address)}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-gray-400 hover:text-white"
              onClick={handleCopyAddress}
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-400" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>

        <div className="w-full space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Balance</span>
            <span className="font-medium text-white">{wallet.balance || "0"}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Network</span>
            <span className="text-sm bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
              {wallet.network ? getNetworkName(wallet.network) : 'Unknown'}
            </span>
          </div>
        </div>

        <Button 
          variant="destructive" 
          onClick={handleSignOut}
          className="w-full mt-4 bg-red-500/20 text-red-300 hover:bg-red-500/30 hover:text-red-200"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
