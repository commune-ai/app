'use client';

import { JSX, useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Wallet, Copy, LogOut, Check } from 'lucide-react';
import { WalletConnectDialog } from './wallet-connect-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useWalletStore from '@/store/wallet-state';
import { WalletType } from '@/types/wallet-types';
import { usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export function WalletConnect(): JSX.Element {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { walletConnected, setWalletConnected, setWallet, wallet } = useWalletStore();
  const [copied, setCopied] = useState<boolean>(false);
  const pathname = usePathname();

  const rootPath = useMemo(() => pathname === '/', [pathname]);

  const handleOpenDialog = useCallback((): void => {
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback((): void => {
    setIsDialogOpen(false);
  }, []);

  const handleDisconnect = useCallback((): void => {
    setWalletConnected(false);
    setWallet(WalletType.METAMASK, '0', '0');
  }, [setWalletConnected, setWallet]);

  const copyToClipboard = useCallback(async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, []);

  const walletImageSrc = useMemo(() => `/${wallet.name?.toLowerCase()}.svg`, [wallet.name]);

  const truncatedAddress = useMemo(() => wallet.address.slice(0, 7), [wallet.address]);

  if (walletConnected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-transparent cursor-pointer h-11 w-11">
            <Image
              src={walletImageSrc}
              width={48}
              height={48}
              className="p-1.5 object-contain"
              alt={`${wallet.name} preview`}
              priority
            />
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white/5 border border-white/10 backdrop-blur-xl backdrop-filter text-white">
          <DropdownMenuLabel>Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem className="flex justify-between">
            <span>Name:</span>
            <span>{wallet.name}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex justify-between cursor-pointer"
            onClick={() => copyToClipboard(wallet.address)}
          >
            <span>Address:</span>
            <div className="flex items-center">
              <span className="mr-2">{truncatedAddress}..</span>
              {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex justify-between">
            <span>Balance:</span>
            <span>{wallet.balance}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem
            className="text-red-400 focus:text-red-400 cursor-pointer"
            onClick={handleDisconnect}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Remove Wallet</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="border-white/10 bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white transition-colors duration-200"
        onClick={handleOpenDialog}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {rootPath && <span className="hidden sm:inline">Connect Wallet</span>}
      </Button>
      <WalletConnectDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />
    </>
  );
}
