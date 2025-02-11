"use client"

import React from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Label } from "@/components/ui/label"
import { ModuleType } from "@/store/module-state"

interface MainSidebarProps {
  children: React.ReactNode
  onFilterChange: (filters: FilterState) => void
  moduleData: ModuleType[]
}

interface FilterState {
  network: string | null
  tag: string | null
  search: string
}

export function MainSidebar({ children, onFilterChange, moduleData }: MainSidebarProps) {
  const [filters, setFilters] = React.useState<FilterState>({
    network: null,
    tag: null,
    search: "",
  })

  // Extract unique networks and tags
  const networks = React.useMemo(() => {
    return Array.from(new Set(moduleData.map((module) => module.network)))
  }, [moduleData])

  const tags = React.useMemo(() => {
    const allTags = moduleData.flatMap((module) => module.tags || [])
    return Array.from(new Set(allTags))
  }, [moduleData])

  const handleFilterChange = (type: "network" | "tag", value: string) => {
    const newFilters = {
      ...filters,
      [type]: filters[type] === value ? null : value,
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = {
      ...filters,
      search: e.target.value,
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="left"
        className="w-[300px] md:w-[400px] lg:w-[500px] bg-white/5 backdrop-blur-xl backdrop-filter border-white/10 text-white"
      >
        <SheetHeader>
          <SheetTitle className="text-white">filter module</SheetTitle>
        </SheetHeader>

        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
            <Input
              placeholder="search modules..."
              value={filters.search}
              onChange={handleSearchChange}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
          <div className="space-y-6">
            {/* Networks Section */}
            <div>
              <Label className="text-sm font-medium text-gray-400 mb-3 block">Network</Label>
              <div className="flex flex-wrap gap-2">
                {networks.map((network,index) => (
                  <Badge
                    key={network+index}
                    variant="outline"
                    className={`cursor-pointer hover:bg-white/10 transition-colors ${
                      filters.network === network
                        ? "bg-blue-500/20 text-blue-400 border-blue-500/20"
                        : "bg-white/5 text-gray-300 border-white/10"
                    }`}
                    onClick={() => handleFilterChange("network", network)}
                  >
                    {network}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tags Section */}
            <div>
              <Label className="text-sm font-medium text-gray-400 mb-3 block">Tags</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className={`cursor-pointer hover:bg-white/10 transition-colors ${
                      filters.tag === tag
                        ? "bg-blue-500/20 text-blue-400 border-blue-500/20"
                        : "bg-white/5 text-gray-300 border-white/10"
                    }`}
                    onClick={() => handleFilterChange("tag", tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

