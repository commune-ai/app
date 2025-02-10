'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ModuleType } from '../../types/module'
import { CopyButton } from '../CopyButton'
import {
  CodeBracketIcon,
  ServerIcon,
  GlobeAltIcon,
  ClockIcon,
  HashtagIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'

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
      className='group relative flex min-h-[320px] cursor-pointer
                 flex-col rounded-lg border
                 border-green-500/30 bg-black/90 p-6
                 font-mono transition-all duration-300 hover:border-green-400'
    >
      {/* Terminal Header with Module Name and Key */}
      <div
        className='absolute left-0 right-0 top-0 flex items-center 
                    rounded-t-lg border-b border-green-500/30 bg-black/90 px-6 py-4'
      >
        <div className='flex w-full flex-col gap-3'>
          <div
            className='absolute left-0 right-0 top-0 flex items-center 
              rounded-t-lg border-b border-green-500/30 bg-black/90 px-6 py-4'
          >
            <div className='flex w-full items-center justify-between'>
              <span className='text-white-500 text-sm md:text-lg'>
                {module.name}
              </span>
              <div className='flex items-center space-x-4'>
                <span className='text-white-500 md:text-md w-24 font-mono text-sm text-gray-400'>
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
      <div className='mt-12 flex-grow space-y-6'>
        {/* Description */}
        {(isHovered && (
          <div className='mt-4 rounded border border-green-500/20 bg-black/60 p-3 text-xs md:text-sm'>
            <span className='mr-2 text-green-400'>$</span>
            <span className='text-green-400 '>
              {displayedDescription}
              <span className='animate-pulse text-green-400'>
                _
              </span>
            </span>
          </div>
        )) || (
          <div className='mt-4 rounded border border-green-500/20 bg-black/60 p-3 text-xs md:text-sm'>
            <span className='mr-2 text-green-400'>$</span>
            <span className='text-green-400'>
              {description}
            </span>
          </div>
        )}

        {/* Key Info Grid with better spacing */}
        <div className='grid grid-cols-1 gap-3'>
          {/* Remove the Key section since it's now in the header */}

          {/* Hash */}
          <div className='flex items-center justify-between rounded border border-green-500/20 bg-black/60 p-3'>
            <div className='flex items-center gap-3'>
              <HashtagIcon className='h-4 w-4 text-green-400' />
              <span className='text-xs text-gray-400'>Hash:</span>
            </div>
            <span className='text-xs text-green-400'>
              {shorten(module.hash)}
            </span>
          </div>

          {/* Time */}
          <div className='flex items-center justify-between rounded border border-green-500/20 bg-black/60 p-3'>
            <div className='flex items-center gap-3'>
              <ClockIcon className='h-4 w-4 text-green-400' />
              <span className='text-xs text-gray-400'>Time:</span>
            </div>
            <span className='text-xs text-green-400'>
              {time2str(module.time)}
            </span>
          </div>
        </div>
        {/* Tags with better spacing */}
        {module.tags && module.tags.length > 0 && (
          <div className='mt-4 flex flex-wrap gap-2'>
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

        {/* Quick Access Buttons with better spacing */}
        <div className='mt-auto grid grid-cols-3 gap-3'>
          <Link
            href={`/module/${module.name}?code=true`}
            className='flex items-center justify-center gap-2 rounded 
                      border border-green-500/30 px-3
                      py-2 text-xs text-green-400 transition-colors hover:bg-green-900/20'
          >
            <CodeBracketIcon className='h-4 w-4' />
            <span>code</span>
          </Link>
          {module.url && (
            <button
              className='flex items-center justify-center gap-2 rounded 
                        border border-green-500/30 px-3
                        py-2 text-xs text-green-400 transition-colors hover:bg-green-900/20'
            >
              <GlobeAltIcon className='h-4 w-4' />
              <span>app</span>
            </button>
          )}
          <Link
            href={`/module/${module.name}?api=true`}
            className='flex items-center justify-center gap-2 rounded 
                      border border-green-500/30 px-3
                      py-2 text-xs text-green-400 transition-colors hover:bg-green-900/20'
          >
            <ServerIcon className='h-4 w-4' />
            <span>api</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
