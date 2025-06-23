'use client'
import Link from 'next/link'
import { useState, FormEvent } from 'react'
import config from '@/config.json'
import { Wallet } from '@/app/wallet/wallet'
import { CopyButton } from '@/app/components/CopyButton'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import { Menu } from 'lucide-react'

export const Header = () => {
  const [password, setPassword] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [walletInfo, setWalletInfo] = useState<{
    address: string
    crypto_type: string
  } | null>(null)

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await cryptoWaitReady()
      const wallet = new Wallet(password)
      setWalletInfo({
        address: wallet.address,
        crypto_type: wallet.crypto_type,
      })
      setPassword('')
      setIsMenuOpen(false)
    } catch (error) {
      console.error('Failed to create wallet:', error)
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-black border-b border-green-500/30 bg-opacity-90 backdrop-blur font-mono">
      <nav className="p-3 px-5 mx-auto max-w-7xl">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Link href="/" className="flex items-center">
              <span className="text-green-500 text-5xl">©</span>
            </Link>
          </div>
          <div className="flex gap-4">
            {walletInfo ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-black/60 rounded">
                  <span className="text-gray-400 text-sm">
                    {walletInfo.address.slice(0, 6)}...
                    {walletInfo.address.slice(-4)}
                  </span>
                  <CopyButton code={walletInfo.address} />
                </div>
                <button
                  onClick={() => setWalletInfo(null)}
                  className="px-4 py-2 bg-black/60 text-green-400 border border-green-500/30 rounded hover:bg-green-900/20 transition-colors"
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
                  className="px-4 py-2 bg-black/60 border border-green-500/30 rounded text-green-400 text-sm focus:outline-none focus:border-green-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-black/60 text-green-400 border border-green-500/30 rounded hover:bg-green-900/20 transition-colors"
                >
                  $ login
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-green-500 text-4xl">©</span>
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-green-400 p-2"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 p-4 bg-black/90 rounded-lg border border-green-500/30">
            {walletInfo ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-2 px-4 py-2 bg-black/60 rounded">
                  <span className="text-gray-400 text-sm">
                    {walletInfo.address.slice(0, 6)}...
                    {walletInfo.address.slice(-4)}
                  </span>
                  <CopyButton code={walletInfo.address} />
                </div>
                <button
                  onClick={() => {
                    setWalletInfo(null)
                    setIsMenuOpen(false)
                  }}
                  className="w-full px-4 py-2 bg-black/60 text-green-400 border border-green-500/30 rounded hover:bg-green-900/20 transition-colors"
                >
                  $ logout
                </button>
              </div>
            ) : (
              <form onSubmit={handleSignIn} className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">$</span>
                  <input
                    type="password"
                    placeholder="enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-black/60 border border-green-500/30 rounded text-green-400 text-sm focus:outline-none focus:border-green-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-black/60 text-green-400 border border-green-500/30 rounded hover:bg-green-900/20 transition-colors"
                >
                  $ login
                </button>
              </form>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header