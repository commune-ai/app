'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ModuleType } from '../types'
import { CopyButton } from '../components/CopyButton'
import { 
  CodeBracketIcon, 
  ServerIcon, 
  GlobeAltIcon,
  KeyIcon,
  ClockIcon,
  HashtagIcon 
} from '@heroicons/react/24/outline'

// Helper function for shortening strings
function shorten(key: string) {
  if (key.length <= 12) return key
  return `${key.slice(0, 8)}...`
}

function time2str(time: number) {
  const d = new Date(time * 1000)
  return d.toLocaleString()
}

export default function ModuleCard({ module }: { module: ModuleType }) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const [displayedDescription, setDisplayedDescription] = useState('')
  const description = module.desc || 'No description available'

  // Typing effect for description
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    let currentIndex = 0

    if (isHovered) {
      const typeNextChar = () => {
        if (currentIndex < description.length) {
          setDisplayedDescription(description.slice(0, currentIndex + 1))
          currentIndex++
          timeoutId = setTimeout(typeNextChar, 50)
        }
      }
      typeNextChar()
    } else {
      setDisplayedDescription('')
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [isHovered, description])

  return (
    <div
      onClick={() => router.push(`module/${module.name}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative p-6 rounded-lg cursor-pointer font-mono
                 border border-green-500/30 bg-black/90
                 hover:border-green-400 transition-all duration-300
                 min-h-[320px] flex flex-col group"
    >
      {/* Terminal Header with Module Name and Key */}
      <div className="absolute top-0 left-0 right-0 bg-black/90 rounded-t-lg 
                    flex items-center px-6 py-4 border-b border-green-500/30">
        <div className="flex flex-col w-full gap-3">
        <div className="absolute top-0 left-0 right-0 bg-black/90 rounded-t-lg 
              flex items-center px-6 py-4 border-b border-green-500/30">
  <div className="flex items-center justify-between w-full">

  <span className="text-white-500">
        {module.name}
      </span>
    <div className="flex items-center space-x-4">
      <span className="text-gray-400 w-24 font-mono">
        {shorten(module.key)}
      </span>

    </div>


    <div onClick={(e) => e.stopPropagation()}>
      <CopyButton code={module.key} />
    </div>
  </div>
</div>
        </div>
      </div>
      {/* Main Content with more spacing */}
      <div className="mt-12 flex-grow space-y-6">
    

      {/* Description */}
      {isHovered && (
        <div className="bg-black/60 p-3 rounded border border-green-500/20 mt-4">
          <span className="text-green-400 mr-2">$</span>
          <span className="text-green-400 ml-1 animate-pulse">▋</span>
          <span className="text-sm text-green-400">{displayedDescription}</span>
        </div>
      ) ||  
      <div className="bg-black/60 p-3 rounded border border-green-500/20 mt-4">
        <span className="text-green-400 mr-2">$</span>
        <span className="text-green-400 ml-1">▋</span>
        <span className="text-sm text-green-400">{description}</span>
      </div>}



        {/* Key Info Grid with better spacing */}
        <div className="grid grid-cols-1 gap-3">
          {/* Remove the Key section since it's now in the header */}
          
          {/* Hash */}
          <div className="flex items-center justify-between bg-black/60 p-3 rounded border border-green-500/20">
            <div className="flex items-center gap-3">
              <HashtagIcon className="h-4 w-4 text-green-400" />
              <span className="text-xs text-gray-400">Hash:</span>
            </div>
            <span className="text-xs text-green-400">{shorten(module.hash)}</span>
          </div>
  
          {/* Time */}
          <div className="flex items-center justify-between bg-black/60 p-3 rounded border border-green-500/20">
            <div className="flex items-center gap-3">
              <ClockIcon className="h-4 w-4 text-green-400" />
              <span className="text-xs text-gray-400">Time:</span>
            </div>
            <span className="text-xs text-green-400">{time2str(module.time)}</span>
          </div>
        </div>
        {/* Tags with better spacing */}
        {module.tags && module.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {module.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs bg-green-900/20 text-green-400 
                         rounded-full border border-green-500/30"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
  
        {/* Quick Access Buttons with better spacing */}
        <div className="grid grid-cols-3 gap-3 mt-auto">
          <button 
            className="px-3 py-2 text-xs border border-green-500/30 
                      hover:bg-green-900/20 text-green-400 rounded
                      transition-colors flex items-center justify-center gap-2"
          >
            <CodeBracketIcon className="h-4 w-4" />
            <span>code</span>
          </button>
          {module.url && (
            <button 
              className="px-3 py-2 text-xs border border-green-500/30 
                        hover:bg-green-900/20 text-green-400 rounded
                        transition-colors flex items-center justify-center gap-2"
            >
              <GlobeAltIcon className="h-4 w-4" />
              <span>app</span>
            </button>
          )}
          <button 
            className="px-3 py-2 text-xs border border-green-500/30 
                      hover:bg-green-900/20 text-green-400 rounded
                      transition-colors flex items-center justify-center gap-2"
          >
            <ServerIcon className="h-4 w-4" />
            <span>api</span>
          </button>
        </div>
      </div>
  

    </div>
  )
}