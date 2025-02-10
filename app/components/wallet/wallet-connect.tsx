"use client"

import { useState } from "react"
import { Avatar } from "@/components/ui/avatar"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Wallet, Copy, LogOut, Check } from "lucide-react"
import { WalletConnectDialog } from "./wallet-connect-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useWalletStore from "@/store/wallet-state"
import { WalletType } from "@/types/wallet-types"
import { usePathname } from 'next/navigation'
export function WalletConnect() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const {walletConnected,setWalletConnected,setWallet,wallet } =useWalletStore();
  const [copied, setCopied] = useState(false)
  const pathname = usePathname()

  const rootPath = pathname === "/" ? true : false

  const handleOpenDialog = () => {
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  const handleDisconnect = () => {
    setWalletConnected(false);
    setWallet(WalletType.METAMASK,"0","0")
  }

  const copyToClipboard = async(text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }
  if (walletConnected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className=" bg-transparent cursor-pointer h-11 w-11">
          <Image src={`/${wallet.name?.toLocaleLowerCase()}.svg`} className="p-1.5 object-contain" alt={`${wallet.name} preview`}/>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white/5 border border-white/10 backdrop-blur-xl backdrop-filter text-white">
          <DropdownMenuLabel>Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem className="flex justify-between">
            <span>Name:</span>
            <span>{wallet.name}</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex justify-between cursor-pointer" onClick={() => copyToClipboard(wallet.address)}>
            <span>Address:</span>
            <div className="flex items-center">
              <span className="mr-2">{wallet.address.slice(0,7)}..</span>
              {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex justify-between">
            <span>Balance:</span>
            <span>{wallet.balance}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem className="text-red-400 focus:text-red-400 cursor-pointer" onClick={handleDisconnect}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Remove Wallet</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
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
  )
}

