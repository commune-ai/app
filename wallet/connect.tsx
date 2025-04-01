// wallet/connect/connect.tsx
"use client";

import { JSX, useState, useCallback, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Wallet, Copy, LogOut, Check } from "lucide-react";
import { WalletConnectDialog } from "./dialog";
import { useWalletStore } from "@/wallet/state";
import { WalletType } from "@/wallet/types";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/lib";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function WalletConnect({ onSidebar }: { onSidebar?: boolean }): JSX.Element {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { walletConnected, setWalletConnected, setWallet, wallet } = useWalletStore();
  const [copied, setCopied] = useState<boolean>(false);
  const pathname = usePathname();

  const isModulePath = useMemo(() => pathname.startsWith("/module/"), [pathname]);

  const handleOpenDialog = useCallback((): void => {
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback((): void => {
    setIsDialogOpen(false);
  }, []);

  const handleDisconnect = useCallback((): void => {
    setWalletConnected(false);
    setWallet(WalletType.METAMASK, "0", "0");
  }, [setWalletConnected, setWallet]);

  const copyToClipboard = useCallback(async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }, []);

  const walletImageSrc = useMemo(() => wallet ? `/${wallet.name?.toLowerCase()}.svg` : '', [wallet]);
  const truncatedAddress = useMemo(() => wallet ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : '', [wallet]);

  return (
    <>
      {walletConnected && wallet ? (
        <TooltipProvider>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "border-white/10 bg-gradient-to-r from-white/5 to-white/10 text-white hover:from-white/10 hover:to-white/15 hover:text-gray-300 transition-colors shadow-sm",
                      { "md:h-auto": onSidebar }
                    )}
                  >
                    <div className={cn("flex items-center w-full gap-2", { "md:flex-col": onSidebar })}>
                      <Avatar className="h-6 w-6 mr-1 ring-1 ring-white/20">
                        <AvatarImage
                          src={walletImageSrc}
                          alt={`${wallet.name} preview`}
                          className="p-[2px] object-contain"
                        />
                        <AvatarFallback className="bg-blue-500/20 text-blue-400 text-xs">
                          {wallet.address.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-mono text-sm text-white font-medium">
                        {truncatedAddress}
                      </span>
                    </div>
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-black/80 border-white/10 text-white text-xs">
                ${wallet.balance}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                  onClick={() => wallet.address && copyToClipboard(wallet.address)}
                >
                  {copied ?
                    <Check className="h-4 w-4 text-green-400" /> :
                    <Copy className="h-4 w-4 text-gray-400 hover:text-white" />
                  }
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-black/80 border-white/10 text-white text-xs">
                {copied ? "Copied!" : "Copy address"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 transition-colors"
                  onClick={handleDisconnect}
                >
                  <LogOut className="h-4 w-4 text-red-400" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-black/80 border-white/10 text-white text-xs">
                Disconnect wallet
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      ) : (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-200 shadow-sm"
            onClick={handleOpenDialog}
          >
            <Wallet className="mr-2 h-4 w-4" />
            {!isModulePath && <span className="hidden sm:inline">Connect Wallet</span>}
          </Button>
        </motion.div>
      )}
      <WalletConnectDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />
    </>
  );
}
