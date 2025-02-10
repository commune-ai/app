"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Check, Copy, Code, ExternalLink, Key, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ModuleCardProps {
  name: string
  mkey: string
  timestamp: string
  imageUrl?: string
  network?: string
  tags?: string[]
  description: string
}

export function ModuleCard({ name, mkey, timestamp, description, imageUrl, network = "commune", tags = ["LLM", "Text Conversion","LLM", "Text Conversion","LLM", "Text Conversion"] }: ModuleCardProps) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [isHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const navigateToModule = (e: React.MouseEvent) => {
    if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
      router.push(`/module/${encodeURIComponent(name.toLowerCase())}`)
    }
  }

  const handleCodeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/module/${encodeURIComponent(name.toLowerCase())}?tab=code`)
  }

  const handleApiClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/module/${encodeURIComponent(name.toLowerCase())}?tab=api`)
  }

  const handleAppClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/module/${encodeURIComponent(name.toLowerCase())}?tab=app`)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const truncatedDescription = description.length > 80 ? `${description.slice(0, 80)}...` : description

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="group relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-md backdrop-filter transition-all duration-300 hover:bg-white/10 cursor-pointer"
        onClick={navigateToModule}
      >
        <CardContent className="p-5 flex flex-col">
        <div className="flex items-center space-x-3 mb-3">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-white/10">
              <Image
                src={
                  !imageError
                    ? imageUrl || "/sample.png"
                    : "/placeholder.svg?height=48&width=48"
                }
                alt={name}
                width={64}
                height={64}
                className="object-cover"
                onError={handleImageError}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white truncate">{name}</h3>
              <Badge variant="outline" className="mt-1 bg-blue-500/10 text-blue-400 border-blue-500/20 font-medium">
                {network}
              </Badge>
            </div>
          </div>

          {/* Description Section - Fixed height */}
          <div className="mb-3 h-[40px]">
            <p className="text-sm text-gray-300 line-clamp-2">{truncatedDescription}</p>
          </div>

          {/* Info Section */}
          <div className="font-mono text-sm space-y-1 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Key className="h-4 w-4 text-blue-400" />
                <span className="text-blue-400">Key:</span>
                <span className="text-blue-400 truncate max-w-[150px]">{mkey}</span>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyToClipboard(mkey)
                      }}
                      className="h-8 w-8 rounded-md hover:bg-[#30363D] transition-all duration-200"
                    >
                      <AnimatePresence>
                        {copied ? (
                          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <Check className="h-4 w-4 text-green-400" />
                          </motion.span>
                        ) : (
                          <Copy className="h-4 w-4 text-gray-400" />
                        )}
                      </AnimatePresence>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy module ID</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-gray-400">Time:</span>
              <span className="text-gray-300">{timestamp}</span>
            </div>
          </div>

          {/* Tags Section - Fixed height for two lines of badges */}
          <div ref={cardRef} className="h-[30px]">
            <ScrollArea className="h-full w-full">
              <div className="flex flex-wrap gap-1 pr-4">
                {tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="flex-shrink-0 bg-white/5 text-gray-300 border-white/10"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>

        <CardFooter className="grid grid-cols-3 border-t border-white/10 p-0">
          <Button
            variant="ghost"
            onClick={handleCodeClick}
            className="flex h-12 items-center justify-center space-x-2 rounded-none border-r border-white/10 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Code className="h-4 w-4" />
            <span>Code</span>
          </Button>
          <Button
            variant="ghost"
            onClick={handleApiClick}
            className="flex h-12 items-center justify-center space-x-2 rounded-none border-r border-white/10 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            <span>API</span>
          </Button>
          <Button
            variant="ghost"
            onClick={handleAppClick}
            className="flex h-12 items-center justify-center space-x-2 rounded-none text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <span>App</span>
          </Button>
        </CardFooter>

        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"
        />
      </Card>
    </motion.div>
  )
}