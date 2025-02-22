import { memo } from "react";
import { WalletConnect } from "@/components/wallet/wallet-connect";
import Link from "next/link";

export const SimpleHubNavbar = memo(function SimpleHubNavbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-green-700/10 bg-green-700/5 backdrop-blur-xl backdrop-filter">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <div className="flex-shrink-0">
            <div className="text-2xl font-bold text-green-700">
              <Link href="/" className="text-green-400">dhub</Link>
            </div>
          </div>
          <WalletConnect />
        </div>
      </div>
    </nav>
  );
});
