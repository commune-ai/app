'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { ModuleType } from '@/store/use-module-state';

interface MainSidebarProps {
  children: React.ReactNode;
  onFilterChange: (filters: FilterState) => void;
  moduleData: ModuleType[];
}

interface FilterState {
  network: string | null;
  tag: string | null;
  search: string;
}

const initialFilterState: FilterState = {
  network: null,
  tag: null,
  search: '',
};

export function MainSidebar({ children, onFilterChange, moduleData }: MainSidebarProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const networks = useMemo(
    () => [...new Set(moduleData.map((module) => module.network))],
    [moduleData]
  );

  const tags = useMemo(
    () => [...new Set(moduleData.flatMap((module) => module.tags || []))],
    [moduleData]
  );

  const handleFilterChange = useCallback(
    (type: 'network' | 'tag', value: string) => {
      setFilters((prevFilters) => {
        const newFilters = {
          ...prevFilters,
          [type]: prevFilters[type] === value ? null : value,
        };
        onFilterChange(newFilters);
        return newFilters;
      });
    },
    [onFilterChange]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFilters((prevFilters) => {
        const newFilters = {
          ...prevFilters,
          search: value,
        };
        onFilterChange(newFilters);
        return newFilters;
      });
    },
    [onFilterChange]
  );

  const renderBadge = useCallback(
    (value: string, type: 'network' | 'tag', index?: number) => (
      <Badge
        key={type === 'network' ? value + index : value}
        variant="outline"
        className={`cursor-pointer hover:bg-white/10 transition-colors ${
          filters[type] === value
            ? 'bg-blue-500/20 text-blue-400 border-blue-500/20'
            : 'bg-white/5 text-gray-300 border-white/10'
        }`}
        onClick={() => handleFilterChange(type, value)}
      >
        {value}
      </Badge>
    ),
    [filters, handleFilterChange]
  );

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
            <div>
              <Label className="text-sm font-medium text-gray-400 mb-3 block">Network</Label>
              <div className="flex flex-wrap gap-2">
                {networks.map((network, index) => renderBadge(network, 'network', index))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-400 mb-3 block">Tags</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => renderBadge(tag, 'tag'))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
