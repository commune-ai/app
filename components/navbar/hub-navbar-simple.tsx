import { memo } from "react";
import { WalletConnect } from "@/wallet/wallet-connect";

export const SimpleHubNavbar = memo(function SimpleHubNavbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-green-700/10 bg-green-700/5 backdrop-blur-xl backdrop-filter">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-green-700">
              <span className="text-blue-400">dhub</span>
            </span>
          </div>
          <WalletConnect />
        </div>
      </div>
    </nav>
  );
});
