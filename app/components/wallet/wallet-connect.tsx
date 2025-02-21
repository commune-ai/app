"use client";

import { JSX, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Wallet, Copy, LogOut, Check, ChevronDown } from "lucide-react";
import { WalletConnectDialog } from "./wallet-connect-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWalletStore } from "@/store/use-wallet-state";
import { WalletType } from "@/types/wallet-types";
import { usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { AvatarImage } from "@radix-ui/react-avatar";
import useSidebarStore from "@/store/use-sidebar-state";

export function WalletConnect({ onSidebar }: { onSidebar?: boolean }): JSX.Element {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { walletConnected, setWalletConnected, setWallet, wallet } = useWalletStore();
  const { isCollapsed } = useSidebarStore();

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

  const truncatedAddress = useMemo(() => wallet ? wallet.address.slice(0, 7) : '', [wallet]);

  if (walletConnected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn("border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-gray-300 transition-colors", { "md:h-auto": onSidebar })}
          >
            <div className={cn("flex items-center w-full gap-2", { "md:flex-col": onSidebar })}>
              <div className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={`${walletImageSrc}`} alt={`${wallet?.name} preview`} className="p-[2px] object-contain" width={60} height={60} />
                  <AvatarFallback className="bg-white/5 text-blue-400 text-xs">{wallet?.address.slice(0, 2)}</AvatarFallback>
                </Avatar>
                {!isModulePath && <h3 className="hidden md:flex" >{wallet?.name}</h3>}
              </div>
              <div className="flex-1 flex items-center justify-between mr-2">
                <span className="font-mono text-sm text-gray-300">$:{wallet?.balance}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white/5 border border-white/10 backdrop-blur-xl backdrop-filter text-white">
          <DropdownMenuLabel>Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem className="flex justify-between">
            <span>Name:</span>
            <span>{wallet?.name}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex justify-between cursor-pointer"
            onClick={() => wallet?.address && copyToClipboard(wallet.address)}
          >
            <span>Address:</span>
            <div className="flex items-center">
              <span className="mr-2">{truncatedAddress}..</span>
              {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex justify-between">
            <span>Balance:</span>
            <span>{wallet?.balance}</span>
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
        {!isModulePath && !isCollapsed && <span className="hidden sm:inline">Connect Wallet</span>}
      </Button>
      <WalletConnectDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />
    </>
  );
}
