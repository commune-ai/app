
'use client';

import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useWalletStore } from '@/wallet/state';
import { AccountSidebar } from '@/components/account/account-sidebar';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { User, LogIn } from 'lucide-react';
import { truncateAddress } from '@/utils/wallet-utils';
import { PasswordWallet } from '@/wallet/password/password-wallet';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function WalletConnect() {
  const { wallet, walletConnected, disconnectWallet } = useWalletStore();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleSuccess = () => {
    setError(null);
    setIsOpen(false);
  };

  const handleDisconnect = useCallback(() => {
    disconnectWallet();
  }, [disconnectWallet]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {walletConnected && wallet ? (
          <Button 
            variant="outline" 
            className="border-white/10 bg-white/5 hover:bg-white/10 text-white"
          >
            <User className="mr-2 h-4 w-4" />
            {truncateAddress(wallet.address)}
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="border-white/10 bg-white/5 hover:bg-white/10 text-white"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Connect
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-[350px] sm:w-[450px] bg-[#03040B]/95 border-white/10 backdrop-blur-xl">

        <div className="mt-6">
          {walletConnected ? (
            <>
              <AccountSidebar />
              <Button 
                onClick={handleDisconnect} 
                variant="destructive" 
                className="w-full mt-4"
              >
                Disconnect Wallet
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <PasswordWallet 
                onSuccess={handleSuccess} 
                onError={handleError} 
              />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
