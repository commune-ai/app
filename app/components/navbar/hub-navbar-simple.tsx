"use client"
import { WalletConnect } from "@/components/wallet/wallet-connect"

export function SimpleHubNavbar() {

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-white/5 backdrop-blur-xl backdrop-filter">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-white">
              <span className="text-blue-400">dhub</span>
            </span>
          </div>
          <WalletConnect />
        </div>
      </div>
    </nav>
  )
}

