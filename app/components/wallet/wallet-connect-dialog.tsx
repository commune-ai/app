'use client';
import { connectToMetaMask, connectToPhantom, connectToSubWallet } from '@/utils/wallet';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { DialogDescription } from '@radix-ui/react-dialog';
import useWalletStore from '@/store/use-wallet-state';
import { WalletType } from '@/types/wallet-types';

interface WalletConnectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const WALLET_OPTIONS = [
  {
    name: 'Metamask',
    icon: '/metamask.svg',
    type: WalletType.METAMASK,
    connect: connectToMetaMask,
  },
  {
    name: 'Subwallet',
    icon: '/subwallet.svg',
    type: WalletType.SUBWALLET,
    connect: connectToSubWallet,
  },
  { name: 'Phantom', icon: '/phantom.svg', type: WalletType.PHANTOM, connect: connectToPhantom },
];

export function WalletConnectDialog({ isOpen, onClose }: WalletConnectDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const { setWallet, setWalletConnected } = useWalletStore();

  useEffect(() => {
    if (!isOpen) setError(null);
  }, [isOpen]);

  const handleConnect = async (selectedWallet: WalletType) => {
    const wallet = WALLET_OPTIONS.find((w) => w.type === selectedWallet);
    if (!wallet) {
      setError('Unsupported wallet type');
      return;
    }

    const response = await wallet.connect();

    if (response.success && response.address && response.balance) {
      setWallet(selectedWallet, response.address, response.balance);
      setWalletConnected(true);
      onClose();
    } else {
      setError(
        response.success ? 'Failed to retrieve wallet address or balance' : response.error ?? null
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-white/5 border border-white/10 backdrop-blur-xl backdrop-filter p-0 overflow-hidden text-white">
        <DialogDescription className="hidden">Wallet Connection</DialogDescription>
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/10">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-semibold text-white">Connect Wallet</DialogTitle>
          </div>
        </DialogHeader>

        <div className="px-6 py-4">
          <p className="text-sm text-gray-400 mb-4">
            Choose how you want to connect. There are several wallet providers.
          </p>

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm flex items-start mb-3">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-3">
            {WALLET_OPTIONS.map(({ name, icon, type }) => (
              <Button
                key={name}
                variant="outline"
                onClick={() => handleConnect(type)}
                className="w-full justify-center text-center font-normal bg-white/5 border-white/10 hover:bg-white/30 text-white transition-all duration-200"
              >
                Connect to {name}
                <Image
                  src={icon || '/placeholder.svg'}
                  alt={`${name} icon`}
                  width={24}
                  height={24}
                  className="mr-3"
                />
              </Button>
            ))}
          </div>
        </div>
        <div className="px-6 py-4 bg-white/5 border-t border-white/10">
          <p className="text-xs text-gray-400 text-center">
            By connecting a wallet, you agree to hub Terms of Service and Privacy Policy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
