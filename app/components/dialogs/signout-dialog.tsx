
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PasswordSignOut } from '@/wallet/password/password-signout';
import { useWalletStore } from '@/wallet/state';
import { WalletType } from '@/wallet/types';

interface SignOutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const { wallet } = useWalletStore();
  const router = useRouter();

  const handleSignOutSuccess = () => {
    onOpenChange(false);
    router.push('/');
  };

  const handleSignOutError = (errorMessage: string) => {
    setError(errorMessage);
  };

  // Only require password confirmation for password wallets
  const isPasswordWallet = wallet?.name === WalletType.PASSWORD;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white/5 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Sign Out Confirmation</DialogTitle>
          <DialogDescription className="text-gray-400">
            {isPasswordWallet
              ? 'Please confirm your password to sign out.'
              : 'Are you sure you want to sign out?'}
          </DialogDescription>
        </DialogHeader>
        
        {isPasswordWallet ? (
          <PasswordSignOut 
            onSuccess={handleSignOutSuccess} 
            onError={handleSignOutError} 
          />
        ) : (
          <div className="flex justify-end space-x-2 mt-4">
            <button
              className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 transition-colors"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
              onClick={() => {
                useWalletStore.getState().disconnectWallet();
                handleSignOutSuccess();
              }}
            >
              Sign Out
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
