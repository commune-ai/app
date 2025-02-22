'use client';

import React, { useCallback, useMemo } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { WalletConnect } from '../wallet/wallet-connect';
import { SearchInput } from '../search/search-input';
import { Button } from '../ui/button';
import { NetworkIcon, Plus, TagIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useSearchStore from '@/store/use-search-state';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import useSidebarStore from '@/store/use-sidebar-state';
import { useModuleStore } from '@/store/use-module-state';
import { Badge } from '../ui/badge';
import Link from 'next/link';

export function AlternateSidebar({ ...props }) {
  const { setSearchTerm, setCurrentPage } = useSearchStore();
  const { modules } = useModuleStore();
  const { selectedNetworks, setSelectedNetworks, selectedTags, setSelectedTags } = useSidebarStore();
  const { open, setOpen } = useSidebar();

  const router = useRouter();

  const handleCreateModule = useCallback(() => {
    router.push("/module/create");
  }, [router]);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, [setCurrentPage, setSearchTerm]);

  const networks = useMemo(
    () => [...new Set(modules.map((module) => module.network))],
    [modules]
  );

  const tags = useMemo(
    () => [...new Set(modules.flatMap((module) => module.tags || []))],
    [modules]
  );

  return (
    <Sidebar
      collapsible="icon"
      {...props}

    >
      <SidebarHeader>
        <Link href="/" className="text-green-500 text-2xl font-bold">dhub</Link>
      </SidebarHeader>
      <SidebarContent className='pl-2'>
        <WalletConnect />
        <div className="flex items-center w-full space-x-2 container mx-auto">
          {!!!!open && <SearchInput onSearch={handleSearch} />}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCreateModule}
                  className={`${!open ? "w-full" : 'w-14'} border-white/10 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors duration-200`}
                >
                  <Plus className={`${!open ? "w-full" : "w-4"} h-4`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add New Model</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <h1>NetWorks</h1>
        {!open && <Button onClick={(() => setOpen(!open))}>
          <NetworkIcon className='text-green-500' />
        </Button>}
        <div>{!!open && networks.map((network, index) => <Badge
          key={index + 1}
          variant="outline"
          onClick={() => setSelectedNetworks(network)}
          className={`m-1 ${selectedNetworks.includes(network) ? 'bg-green-500/10 text-green-400' : 'bg-green-500/20 text-white'} border-green-500/20 font-medium text-md cursor-pointer`}
        >
          {network}
        </Badge>)}
        </div>
        <h1>Tags</h1>
        {!open && <Button onClick={() => setOpen(!open)}>
          <TagIcon className='text-green-500' />
        </Button>}
        <div>{!!open && tags.map((tag, index) => <Badge
          key={index + 1}
          variant="outline"
          onClick={() => setSelectedTags(tag)}
          className={`m-1 ${selectedTags.includes(tag) ? 'bg-green-500/10 text-green-400' : 'bg-green-500/20 text-white'}  border-green-500/20 font-medium text-md cursor-pointer`}
        >
          {tag}
        </Badge>)}
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
