
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletType } from "../types";
import { PasswordWallet } from "../password/password-wallet";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface WalletConnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedWallet: WalletType | null;
  onSuccess?: () => void;
}

export function WalletConnectDialog({
  open,
  onOpenChange,
  selectedWallet,
  onSuccess,
}: WalletConnectDialogProps) {
  const [error, setError] = useState<string | null>(null);

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const getDefaultTab = () => {
    if (selectedWallet === WalletType.PASSWORD) return "password";
    if (selectedWallet === WalletType.POLKADOT) return "polkadot";
    if (selectedWallet === WalletType.ETHEREUM) return "ethereum";
    if (selectedWallet === WalletType.SOLANA) return "solana";
    return "password";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect to Wallet</DialogTitle>
          <DialogDescription>
            Choose your preferred wallet connection method
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue={getDefaultTab()} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="wallets">Wallets</TabsTrigger>
          </TabsList>
          <TabsContent value="password" className="mt-4">
            <PasswordWallet 
              onSuccess={onSuccess} 
              onError={handleError} 
            />
          </TabsContent>
          <TabsContent value="wallets" className="mt-4">
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">
                External wallet connections will be implemented soon.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
