'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import config from '@/config.json'
import { Wallet } from '@/app/wallet'
import { CopyButton } from '@/app/components/CopyButton'
import { cryptoWaitReady } from '@polkadot/util-crypto'

export const Header = () => {
  const [password, setPassword] = useState('whatsup')
  const [walletInfo, setWalletInfo] = useState<{address: string, type: string} | null>(null)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await cryptoWaitReady();
      const wallet = new Wallet(password);
      setWalletInfo({
        address: wallet.address,
        crypto_type: wallet.crypto_type
      });
    } catch (error) {
      console.error('Failed to create wallet:', error);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-black/90 border-b border-green-500/30 backdrop-blur font-mono">
      <nav className="p-4 px-6 mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center">
            <span className="text-green-400 mr-2">$</span>
            <Image 
              src="/comhub.png" 
              width={40} 
              height={40} 
              alt="commune logo"
              priority
              className="hover:opacity-80 transition-opacity" 
            />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {walletInfo ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-black/60 border border-green-500/30 rounded">
                <span className="text-green-400">$</span>
                <span className="text-gray-400 text-sm font-mono">
                  {walletInfo.address.slice(0,6)}...{walletInfo.address.slice(-4)}
                </span>
                <CopyButton code={walletInfo.address} />
              </div>
              <button
                onClick={() => setWalletInfo(null)}
                className="px-4 py-2 bg-red-900/30 text-red-400 border border-red-500/30 rounded hover:bg-red-900/50 transition-colors"
              >
                $ logout
              </button>
            </div>
          ) : (
            <form onSubmit={handleSignIn} className="flex items-center gap-2">
              <span className="text-green-400">$</span>
              <input
                type="password"
                placeholder="enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-2 bg-black/60 border border-green-500/30 rounded text-green-400 text-sm focus:outline-none focus:border-green-400 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-900/30 text-green-400 border border-green-500/30 rounded hover:bg-green-900/50 transition-colors font-mono"
              >
                $ login
              </button>
            </form>
          )}
        </div>
      </nav>
    </header>
  )
}