'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type ModuleType = {
  name: string
  key: string
  url: string
}

export default function ModuleCard({ module }: { module: ModuleType }) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onClick={() => router.push(`/modules/${module.key}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative p-6 rounded-lg cursor-pointer font-mono
                 border border-green-500/30 bg-black/90
                 hover:border-green-400 transition-all duration-300"
    >
      <div className="absolute top-0 left-0 right-0 h-8 bg-black/90 rounded-t-lg 
                      flex items-center px-4 border-b border-green-500/30">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <span className="ml-4 text-green-400 text-xs">$ {module.name}</span>
      </div>

      <div className="mt-6">
        <div className="text-green-400 mb-2">
          <span className="text-gray-500">$</span> module info
        </div>
        <pre className="text-sm text-green-400 bg-black/60 p-4 rounded border border-green-500/20">
{`name: ${module.name}
key:  ${module.key}
url:  ${module.url}`}
        </pre>
      </div>

      <div className="mt-4 flex items-center text-xs text-gray-400">
        <span className="text-green-400 mr-2">$</span>
        {isHovered ? 'click to explore' : 'hover for details'}
        <span className="text-green-400 ml-1 animate-pulse">▋</span>
      </div>
    </div>
  )
}
