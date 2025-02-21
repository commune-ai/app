"use client";

import { useState, useRef, useCallback, JSX } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Code, ExternalLink, Key, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

type Tag = string;

interface ModuleCardProps {
  name: string;
  mkey: string;
  timestamp: string;
  imageUrl?: string;
  network?: string;
  tags?: Tag[];
  description: string;
}

export function ModuleCard({
  name,
  mkey,
  timestamp,
  description,
  imageUrl,
  network = "commune",
  tags = ["LLM", "Text Conversion", "LLM", "Text Conversion", "LLM", "Text Conversion"],
}: ModuleCardProps): JSX.Element {
  const router = useRouter();
  const [imageError, setImageError] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false)

  const navigateToModule = useCallback(() => {
    router.push(`/module/${encodeURIComponent(name.toLowerCase())}`);
  }, [router, name]
  );

  const handleCodeClick = useCallback(
    (e: React.MouseEvent): void => {
      e.stopPropagation();
      router.push(`/module/${encodeURIComponent(name.toLowerCase())}?tab=code`);
    },
    [router, name]
  );

  const handleApiClick = useCallback(
    (e: React.MouseEvent): void => {
      e.stopPropagation();
      router.push(`/module/${encodeURIComponent(name.toLowerCase())}?tab=api`);
    },
    [router, name]
  );

  const handleAppClick = useCallback(
    (e: React.MouseEvent): void => {
      e.stopPropagation();
      router.push(`/module/${encodeURIComponent(name.toLowerCase())}?tab=app`);
    },
    [router, name]
  );

  const handleImageError = useCallback((): void => {
    setImageError(true);
  }, []);

  const truncateKey = (key: string) => {
    if (key.length <= 6) return key
    return `${key.slice(0, 3)}...${key.slice(-3)}`
  }

  const truncateName = (name: string) => {
    if (name.length <= 18) return name
    return `${name.slice(0, 15)}...`
  }

  const getDateOnly = (timestamp: string): string => {
    const date = new Date(Number(timestamp) * 1000);
    return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="group relative overflow-hidden border-white/10 bg-[#0f0f0f] backdrop-blur-md backdrop-filter transition-all duration-300 hover:bg-green-500/10 cursor-pointer"
        onClick={navigateToModule}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-5 flex flex-col">
          <AnimatePresence>
            {isHovered ? (
              <motion.div
                initial={{ opacity: 0, }}
                animate={{ opacity: 1, }}
                exit={{ opacity: 0 }}
                className="mb-3 overflow-hidden h-28"
              >
                <h1 className="text-white font-bold text-xl">{name}</h1>
                <p className="text-sm text-gray-300 h-full">{description}</p>
              </motion.div>
            ) :
              <>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-white/10">
                    <Image
                      src={
                        !imageError ? imageUrl || "/sample.png" : "/placeholder.svg?height=48&width=48"
                      }
                      alt={name}
                      width={64}
                      height={64}
                      className="object-cover"
                      onError={handleImageError}
                      priority
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-white truncate">{truncateName(name)}</h3>
                      <Badge
                        variant="outline"
                        className="mt-1 bg-green-500/10 text-green-400 border-green-500/20 font-medium"
                      >
                        {network}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-start space-x-2 mb-1">
                        <div className="flex items-center justify-between space-x-1">
                          <Key className="h-3 w-3 text-green-400" />
                          <span className="text-xs text-green-400">Key: {truncateKey(mkey)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end space-x-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-300">Time: {getDateOnly(timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div ref={cardRef} className="h-[50px]">
                  <ScrollArea className="h-full w-full">
                    <div className="flex flex-wrap gap-1 pr-4">
                      {tags.map((tag, index) => (
                        <Badge
                          key={`${tag}-${index}`}
                          variant="outline"
                          className="flex-shrink-0 bg-white/5 text-gray-300 border-white/10"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </>
            }
          </AnimatePresence>
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
      </Card>
    </motion.div>
  );
}
