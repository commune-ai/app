'use client'

import { useEffect, useState } from 'react'
import { Footer } from '@/app/components'
import { Loading } from '@/app/components/Loading'
import { useRouter } from 'next/navigation'
import { ModuleType } from '../types'

// Helper to abbreviate keys
function abbreviateKey(key: string) {
  if (key.length <= 12) return key
  return `${key.slice(0, 8)}...${key.slice(-4)}`
}

export default function ModuleCard({ module }: { module: ModuleType }) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onClick={() => router.push(`module/${module.key}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative p-6 rounded-lg cursor-pointer font-mono
                 border border-green-500/30 bg-black/90
                 hover:border-green-400 transition-all duration-300
                 min-h-[280px] flex flex-col"
    >
      {/* Terminal Header */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-black/90 rounded-t-lg 
                    flex items-center px-4 border-b border-green-500/30">
        <span className="ml-4 text-yellow-500">$ {module.name}</span>
      </div>

      {/* Module Content */}
      <div className="mt-8 flex-grow">
        <pre className="text-sm text-green-400 bg-black/60 p-4 rounded 
                       border border-green-500/20 overflow-hidden">
{`key:  ${abbreviateKey(module.key)}
url:  ${module.url || 'N/A'}
app:  ${module.app || 'N/A'}
desc: ${module.description || 'N/A'}`}
        </pre>

        {/* Quick Access Buttons */}
        {isHovered && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button className="px-2 py-1 text-xs border border-green-500/30 
                             hover:bg-green-900/20 text-green-400">
              [F1] API
            </button>
            <button className="px-2 py-1 text-xs border border-green-500/30 
                             hover:bg-green-900/20 text-green-400">
              [F2] APP
            </button>
          </div>
        )}
      </div>

      {/* Terminal Prompt */}
      <div className="mt-4 flex items-center text-xs text-gray-400">
        <span className="text-green-400 mr-2">$</span>
        {isHovered ? 'click to explore' : 'hover for details'}
        <span className="text-green-400 ml-1 animate-pulse">▋</span>
      </div>
    </div>
  )
}
const defaultModule: ModuleType = {
  name: 'agi',
  key: 'agi',
  url: 'agi.com',
  description: 'agi module',
  network: 'eth',
}


