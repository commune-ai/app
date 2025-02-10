"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchInputProps {
  onSearch: (value: string) => void
}

export function SearchInput({ onSearch }: SearchInputProps) {
  const [searchValue, setSearchValue] = useState("")

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchValue(value)
    onSearch(value)
  }

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
      <Input
        type="search"
        placeholder="Search modules..."
        value={searchValue}
        onChange={handleSearch}
        className="w-full pl-10 border-white/10 bg-white/10 text-sm text-gray-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
      />
    </div>
  )
}

