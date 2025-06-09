'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ModuleType } from '../../types/module'
import { CopyButton } from '@/app/components/CopyButton'
import {
  GlobeAltIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'

// Helper function for shortening strings
function shorten(key: string, length = 10) {
  if (!key || typeof key !== 'string') return ''
  return `${key.slice(0, length)}...${key.slice(-length)}`
}

function time2str(time: number) {
  const d = new Date(time * 1000)
  return d.toLocaleString()
}

function is_module(module: any): module is ModuleType {
  return (
    typeof module === 'object' &&
    module !== null &&
    'name' in module &&
    'key' in module &&
    'time' in module 
  )
}

export default function ModuleCard({ module }: { module: ModuleType }) {
  const router = useRouter()
  const  [isHovered, setIsHovered] = useState(false)
  const [displayedDescription, setDisplayedDescription] = useState('')
  const description = module.desc || 'No description available'

  if (!is_module(module)) {
    console.error('Invalid module data:', module)
    return <div className='text-red-500'>Invalid module data</div>
  }

  // Typing effect for description
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    let currentIndex = 0

    if (isHovered) {
      const typeNextChar = () => {
        if (currentIndex < description.length) {
          setDisplayedDescription(description.slice(0, currentIndex + 1))
          currentIndex++
          timeoutId = setTimeout(typeNextChar, 20)
        }
      }
      typeNextChar()
    } else {
      setDisplayedDescription('')
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, )

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`module/${module.name}`)
  }

  return (
    <div 
      className='relative h-[320px] w-full'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        onClick={handleCardClick}
        className='relative h-full w-full cursor-pointer rounded-lg border border-green-500/30 
                   bg-black/90 font-mono transition-all duration-300 hover:border-green-400 
                   hover:shadow-lg hover:shadow-green-500/20 overflow-hidden'
      >
        {/* Main Content */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
          {/* Header */}
          <div className='flex items-center justify-between border-b border-green-500/30 px-6 py-4'>
            <h3 className='text-lg font-semibold text-green-400'>{module.name}</h3>
          </div>

          {/* Content */}
          <div className='p-6 space-y-4'>
            {/* Key with Copy */}
            <div className='flex items-center justify-between rounded border border-green-500/20 bg-black/60 p-3'>
              
              {/* key icon */}
              <span className='text-green-400'>🔑 key</span>
              <div className='flex items-center gap-2'>
                <span className='text-xs text-green-400 font-mono'>{shorten(module.key)}</span>
                <div onClick={(e) => e.stopPropagation()}>
                  <CopyButton code={module.key} />
                </div>
              </div>
            </div>

            {/* Key with Copy */}
            <div className='flex items-center justify-between rounded border border-green-500/20 bg-black/60 p-3'>
              
              {/* key icon */}
              <GlobeAltIcon className='h-4 w-4 text-green-400' />
              <span className='text-green-400'> cid</span>
              <div className='flex items-center gap-2'>
                <span className='text-xs text-green-400 font-mono'>{shorten(module.cid)}</span>
                <div onClick={(e) => e.stopPropagation()}>
                  <CopyButton code={module.cid} />
                </div>
              </div>
            </div>

            {/* Time */}
            <div className='flex items-center justify-between rounded border border-green-500/20 bg-black/60 p-3'>
              <div className='flex items-center gap-2'>
                <ClockIcon className='h-4 w-4 text-green-400' />
                <span className='text-green-400'> time</span>
              </div>
              <span className='text-xs text-green-400'>
                {time2str(module.time)}
              </span>
            </div>

            {/* Tags */}
            {module.tags && module.tags.length > 0 && (
              <div className='flex flex-wrap gap-2 pt-2'>
                {module.tags.map((tag, index) => (
                  <span
                    key={index}
                    className='rounded-full border border-green-500/30 bg-green-900/20 px-3 
                             py-1 text-xs text-green-400'
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* App Link */}
            {module.url && (
              <div className='pt-4'>
                <Link
                  href={module.url}
                  onClick={(e) => e.stopPropagation()}
                  className='flex items-center justify-center gap-2 rounded 
                            border border-green-500/30 px-4 py-3 text-sm 
                            text-green-400 transition-colors hover:bg-green-900/20'
                >
                  <GlobeAltIcon className='h-5 w-5' />
                  <span>Open App</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Description Overlay */}
        <div className={`absolute inset-0 flex flex-col transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          {/* Header */}
          <div className='flex items-center justify-between border-b border-green-500/30 px-6 py-4'>
            <h3 className='text-lg font-semibold text-green-400'>{module.name}</h3>
          </div>

          {/* Description */}
          <div className='flex-1 p-6 flex items-center justify-center'>
            <p className='text-green-400 text-sm leading-relaxed text-center max-w-[90%]'>
              {displayedDescription}
              {isHovered && displayedDescription.length < description.length && (
                <span className='inline-block w-2 h-4 bg-green-400 animate-pulse ml-1' />
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}