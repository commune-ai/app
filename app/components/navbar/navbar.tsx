"use client";

import { WalletConnect } from "@/wallet/connect/connect";
import { SearchInput } from "@/components/search/search-input";
import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter, usePathname } from "next/navigation";
import { MainSidebar } from "@/components/navbar/main-sidebar";
import { ModuleType } from "@/store/module";
import { memo, useCallback } from "react";

interface FilterState {
  network: string | null;
  tag: string | null;
  search: string;
}

interface NavbarProps {
  onSearch: (value: string) => void;
  onFilterChange: (filters: FilterState) => void;
  moduleData: ModuleType[];
}

export const HubNavbar = memo(function HubNavbar({
  onSearch,
  onFilterChange,
  moduleData,
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isRootPage = pathname === "/";

  const handleAddNewModel = useCallback(() => {
    router.push("/module/create");
  }, [router]);

  const renderSidebarButton = useCallback(
    () => (
      <Button
        variant="ghost"
        size="icon"
        className="text-green-400 hover:text-green-700 hover:bg-green-700/10"
      >
        <Menu className="h-6 w-6" />
      </Button>
    ),
    []
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-green-700/10 bg-green-700/5 backdrop-blur-xl backdrop-filter">
      {isRootPage && (
        <div className="hidden md:flex flex-shrink-0 mr-4 absolute top-4 left-9">
          <MainSidebar onFilterChange={onFilterChange} moduleData={moduleData}>
            {renderSidebarButton()}
          </MainSidebar>
        </div>
      )}
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <div className="flex-shrink-0 flex items-center">
            {isRootPage && (
              <div className="md:hidden flex-shrink-0 -ml-2">
                <MainSidebar onFilterChange={onFilterChange} moduleData={moduleData}>
                  {renderSidebarButton()}
                </MainSidebar>
              </div>
            )}
            <span className="text-2xl font-bold text-white">
              <span className="text-green-400">commune</span>
            </span>
          </div>

          <div className="hidden md:flex items-center justify-center flex-1 mx-4 space-x-2">
            <div className="max-w-md w-full">
              <SearchInput onSearch={onSearch} />
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleAddNewModel}
                    className="border-white/10 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add New Model</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <WalletConnect />
        </div>
      </div>
    </nav>
  );
});
