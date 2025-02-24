"use client";

import { useState, useEffect, useCallback } from "react";
import { ModuleCard } from "@/components/module/module-card";
import { ModuleCardSkeleton } from "@/components/skeleton/module-card-skeleton";
import { ModulePagination } from "@/components/pagination/module-pagination";
import { Footer } from "@/components/footer/hub-footer";
import { motion } from "framer-motion";
import { ModuleType, useModuleStore } from "@/store/use-module-state";
import { AlternateSidebar } from "@/components/alternate-sidebar/alternate-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import useSearchStore from "@/store/use-search-state";
import useSidebarStore from "@/store/use-sidebar-state";
import { WalletConnect } from "@/components/wallet/wallet-connect";

const ITEMS_PER_PAGE = 12;

export default function Home() {
  const [filteredModules, setFilteredModules] = useState<ModuleType[]>([]);

  const { fetchModules, modules, loadingModules, isLoading, assignRandomNetworkAndTags } = useModuleStore();
  const { searchTerm, currentPage, setCurrentPage } = useSearchStore();
  const { selectedNetworks, selectedTags } = useSidebarStore()

  const filterModules = useCallback(
    (modules: ModuleType[], search: string) => {
      return modules.filter((module) => {
        setCurrentPage(1);
        const matchesSearch = !search || module.name.toLowerCase().includes(search.toLowerCase());
        const matchesNetwork = selectedNetworks.length === 0 || selectedNetworks.includes(module.network);
        const matchesTags = selectedTags.length === 0 || module.tags.some(tag => selectedTags.includes(tag));
        return matchesSearch && matchesNetwork && matchesTags;
      });
    },
    [selectedNetworks, selectedTags, setCurrentPage]
  );

  useEffect(() => {
    const filtered = filterModules(modules, searchTerm);
    setFilteredModules(filtered);
  }, [searchTerm, modules, filterModules, selectedNetworks, selectedTags]);

  const fetchData = useCallback(async () => {
    if (modules.length > 0) return;
    await fetchModules();
    assignRandomNetworkAndTags();
  }, [modules.length, fetchModules, assignRandomNetworkAndTags]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalPages = Math.ceil(filteredModules.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredModules.slice(startIndex, endIndex);

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, [setCurrentPage]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0F0F]">
      <div>
        <SidebarProvider>
          <AlternateSidebar className="p-2 bg-[#0F0F0F] border-r border-gray-500/10" />
          <div className="flex flex-col flex-grow">
            <SidebarInset className="bg-[#0F0F0F] flex-grow">
              <header className="flex justify-between items-center pr-4">
                <div className="flex items-center gap-2 px-4 py-8">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">
                          <h1 className="text-green-500 text-lg">Modules</h1>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
                <WalletConnect />
              </header>
              <main className="flex-grow container mx-auto px-4 py-8">
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3"
                >
                  {
                    isLoading
                      ? Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                        <ModuleCardSkeleton key={index} />
                      ))
                      : currentItems.map((module, index) => (
                        <ModuleCard
                          key={`${module.key}-${index}`}
                          name={module.name}
                          mkey={module.key}
                          network={module.network}
                          tags={module.tags}
                          timestamp={module.time.toString()}
                          description={
                            module?.description ||
                            "This is a description of a module.The module takes input from the user and gives the output."
                          }
                        />
                      ))}
                </motion.div>
                {!isLoading && filteredModules.length > ITEMS_PER_PAGE && (
                  <ModulePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
                {!isLoading && !loadingModules && filteredModules.length === 0 && (
                  <div className="text-center text-gray-400 mt-8">No modules found.</div>
                )}
              </main>
            </SidebarInset>
            <Footer />
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}
