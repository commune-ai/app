
'use client';

import * as React from 'react';
import { useCallback, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWalletStore } from '@/wallet/state';
import { LogOut, Copy, Check, Key } from 'lucide-react';
import { truncateAddress } from '@/utils/wallet-utils';
import { useRouter } from 'next/navigation';

export function SimplifiedAccount() {
  const { wallet, walletConnected, setWalletConnected } = useWalletStore();
  const [copied, setCopied] = useState(false);
  const [copiedPublicKey, setCopiedPublicKey] = useState(false);
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

  const handleCopyPublicKey = useCallback(() => {
    if (wallet?.public_key) {
      navigator.clipboard.writeText(wallet.public_key);
      setCopiedPublicKey(true);
      setTimeout(() => setCopiedPublicKey(false), 2000);
    }
  }, [wallet?.public_key]);

  if (!walletConnected || !wallet) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Your Wallet</CardTitle>
          <CardDescription>Connect to access crypto tools</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <Button
            onClick={() => router.push('/signin')}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-white">Your Wallet</CardTitle>
        <CardDescription>Manage your identity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-16 w-16 border-2 border-blue-500/30">
            <AvatarImage src="/images/wallets/generic.svg" alt="Wallet" />
            <AvatarFallback className="bg-blue-500/20 text-blue-300">
              {wallet.name?.substring(0, 2).toUpperCase() || 'WL'}
            </AvatarFallback>
          </Avatar>
          
          <div className="w-full space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Address</span>
              <div className="flex items-center">
                <span className="font-medium text-white mr-2">{truncateAddress(wallet.address)}</span>
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
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Public Key</span>
              <div className="flex items-center">
                <span className="font-medium text-white mr-2">{truncateAddress(wallet.public_key || '', 6, 6)}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-gray-400 hover:text-white"
                  onClick={handleCopyPublicKey}
                >
                  {copiedPublicKey ? (
                    <Check className="h-3 w-3 text-green-400" />
                  ) : (
                    <Key className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Balance</span>
              <span className="font-medium text-white">{wallet.balance || "0"}</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="w-full mt-4 border-white/10 bg-white/5 hover:bg-white/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
