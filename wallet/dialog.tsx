"use client";
import { connectToMetaMask, connectToPhantom, connectToSubWallet } from "@/wallet/utils";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, LogIn, Wallet as WalletIcon, ChevronRight } from "lucide-react";
import Image from "next/image";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useWalletStore } from "@/wallet/state";
import { WalletType, networkOptions, walletOptions } from "@/wallet/types";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletSelector } from "@/wallet/selector";
import { Input } from "@/components/ui/input";
import { Wallet } from "@/wallet/wallet";

interface WalletConnectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const WALLET_OPTIONS = [
  {
    name: "Metamask",
    icon: "/metamask.svg",
    type: WalletType.METAMASK,
    connect: connectToMetaMask,
  },
  {
    name: "Subwallet",
    icon: "/subwallet.svg",
    type: WalletType.SUBWALLET,
    connect: connectToSubWallet,
  },
  { name: "Phantom", icon: "/phantom.svg", type: WalletType.PHANTOM, connect: connectToPhantom },
];

export function WalletConnectDialog({ isOpen, onClose }: WalletConnectDialogProps) {
  const  [error, setError] = useState<string | null>(null);
  const [walletSelected, setWalletSelected] = useState<WalletType | null>(null);
  const { setWallet, setWalletConnected, connectingWallet, setConnectingWallet } = useWalletStore();
  const [activeTab, setActiveTab] = useState<string>("local");
  
  // Local wallet states
  const [selectedLocalWallet, setSelectedLocalWallet] = useState<string>(WalletType.POLKADOT);

  const randomString = (length: number): string => { 
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  const  [password, setPassword] = useState<string>(randomString(12));  
  const [isCreatingWallet, setIsCreatingWallet] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setPassword("");
      setIsCreatingWallet(false);
    }
  }, );

  const handleConnect = async (selectedWallet: WalletType) => {
    const wallet = WALLET_OPTIONS.find((w) => w.type === selectedWallet);
    if (!wallet) {
      setError("Unsupported wallet type");
      return;
    }
    setConnectingWallet(true);
    setWalletSelected(selectedWallet);
    const response = await wallet.connect();

    if (response.success && response.address && response.balance) {
      setWallet(selectedWallet, response.address, response.balance);
      setWalletConnected(true);
      setConnectingWallet(false);
      setWalletSelected(null);
      onClose();
    } else {
      setError(
        response.success ? "Failed to retrieve wallet address or balance" : response.error ?? null
      );
      setConnectingWallet(false);
      setWalletSelected(null);
    }
  };

  const handleCreateLocalWallet = async () => {
    if (!password) {
      setError("Password is required");
      return;
    }
    
    setIsCreatingWallet(true);
    setError(null);
    
    try {
      const walletInstance = new Wallet();
      const walletData = await walletInstance.fromPassword(password, 'sr25519');
      
      // Mock balance for demo purposes
      const mockBalance = (Math.random() * 1000).toFixed(2);
      
      setWallet(selectedLocalWallet, walletData.address, mockBalance);
      setWalletConnected(true);
      onClose();
    } catch (err) {
      setError(`Failed to create wallet: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsCreatingWallet(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] bg-white/5 border border-white/10 backdrop-blur-xl backdrop-filter p-0 overflow-hidden text-white">
        <DialogDescription className="hidden">Wallet Connection</DialogDescription>
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/10">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-semibold text-white">Connect Wallet</DialogTitle>
          </div>
        </DialogHeader>

        <Tabs defaultValue="local" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-4">
            <TabsList className="w-full bg-white/5 border border-white/10">
            <TabsTrigger value="local" className="flex-1 data-:bg-white/10">
                Local Wallet
              </TabsTrigger>
              <TabsTrigger value="external" className="flex-1 data-:bg-white/10">
                External Wallet
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="external" className="px-6 py-4">
            <p className="text-sm text-gray-400 mb-4">
              Connect with your existing wallet provider.
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
                  className="w-full justify-between text-left font-normal bg-white/5 border-white/10 hover:bg-white/10 text-white transition-all duration-200"
                  disabled={connectingWallet}
                >
                  <div className="flex items-center">
                    <Image
                      src={icon || "/placeholder.svg"}
                      alt={`${name} icon`}
                      width={24}
                      height={24}
                      className="mr-3"
                    />
                    Connect to {name}
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="local" className="px-6 py-4">
            <p className="text-sm text-gray-400 mb-4">
              Create or access a local wallet using a password.
            </p>

            {error && (
              <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm flex items-start mb-3">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Select Wallet Type</label>
                <WalletSelector 
                  options={networkOptions}
                  selectedWallet={selectedLocalWallet}
                  onSelect={setSelectedLocalWallet}
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Password</label>
                <Input
                  type="password"
                  placeholder="Enter your wallet password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This password will be used to generate your wallet keys.
                </p>
              </div>

              <Button
                onClick={handleCreateLocalWallet}
                className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isCreatingWallet || !password}
              >
                {isCreatingWallet ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Wallet...
                  </>
                ) : (
                  <>
                    <WalletIcon className="h-4 w-4 mr-2" />
                    Access Local Wallet
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <AnimatePresence>
          {connectingWallet && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="px-6 pb-4"
            >
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-500/20 p-3 rounded-full">
                      <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Connecting to {walletSelected}</h4>
                      <p className="text-xs text-gray-400 mt-1">
                        Please wait while we establish a secure connection...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="px-6 py-4 bg-white/5 border-t border-white/10">
          <p className="text-xs text-gray-400 text-center">
            By connecting a wallet, you agree to hub Terms of Service and Privacy Policy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}