"use client"

import { WalletConnect } from "@/components/wallet/wallet-connect"
import { SearchInput } from "@/components/search/search-input"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"
interface NavbarProps {
  onSearch: (value: string) => void
}

export function HubNavbar({ onSearch }: NavbarProps) {
  const router=useRouter();
  
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-white/5 backdrop-blur-xl backdrop-filter">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-white">
              <span className="text-blue-400">dhub</span>
            </span>
          </div>

          <div className="hidden md:flex items-center justify-center flex-1 mx-4 space-x-2">
            <div className="max-w-md w-full">
              <SearchInput onSearch={onSearch} />
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={()=>{router.push("/module/create")}}
                    className="border-white/10 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add New Model</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <WalletConnect />
        </div>
      </div>
    </nav>
  )
}

