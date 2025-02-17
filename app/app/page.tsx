"use client";

import { useState, useEffect, useCallback } from "react";
import { HubNavbar } from "@/components/navbar/hub-navbar";
import { SearchInput } from "@/components/search/search-input";
import { ModuleCard } from "@/components/module/module-card";
import { ModuleCardSkeleton } from "@/components/skeleton/module-card-skeleton";
import { ModulePagination } from "@/components/pagination/module-pagination";
import { Footer } from "@/components/footer/hub-footer";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { ModuleType, useModuleStore } from "@/store/use-module-state";
import { useRouter } from "next/navigation";
import { useNavbarSidebarStore } from "@/store/use-navbar-sidebar-state";
import { NavbarSidebarToggle } from "@/components/alternate-sidebar/navbar-sidebar-toggle";

import { AlternateSidebar } from "@/components/alternate-sidebar/alternate-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const ITEMS_PER_PAGE = 12;

interface FilterParams {
  network: string | null;
  tag: string | null;
  search: string;
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filteredModules, setFilteredModules] = useState<ModuleType[]>([]);
  const [networkFilter, setNetworkFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  const router = useRouter();

  const { fetchModules, modules, loadingModules, assignRandomNetworkAndTags } = useModuleStore();
  const { isAlternateLayout } = useNavbarSidebarStore();

  const filterModules = useCallback(
    (modules: ModuleType[], network: string | null, tag: string | null, search: string) => {
      return modules.filter((module) => {
        const matchesNetwork = !network || module.network === network;
        const matchesTag = !tag || (module.tags && module.tags.includes(tag));
        const matchesSearch = !search || module.name.toLowerCase().includes(search.toLowerCase());

        return matchesNetwork && matchesTag && matchesSearch;
      });
    },
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      if (modules.length > 0) return;
      try {
        setIsLoading(true);
        await fetchModules();
        assignRandomNetworkAndTags();
      } catch (err) {
        console.error("Error fetching modules:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [assignRandomNetworkAndTags, fetchModules, modules]);

  useEffect(() => {
    const filtered = filterModules(modules, networkFilter, tagFilter, searchTerm);
    setFilteredModules(filtered);
  }, [searchTerm, modules, networkFilter, tagFilter, filterModules]);

  const totalPages = Math.ceil(filteredModules.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredModules.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback(
    ({ network, tag, search }: FilterParams) => {
      setSearchTerm(search);

      if (search) {
        setNetworkFilter(network);
        setTagFilter(tag);
      }

      const filtered = filterModules(modules, network, tag, search);
      setFilteredModules(filtered);
      setCurrentPage(1);
    },
    [modules, filterModules]
  );

  const handleCreateModule = useCallback(() => {
    router.push("/module/create");
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-[#03040B]">
      {isAlternateLayout ? (
        <div>
          <SidebarProvider>
            <AlternateSidebar />
            <SidebarInset className="bg-[#0F0F0F] ">
              <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="#">Modules</BreadcrumbLink>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </header>
              <main className="flex-grow container mx-auto px-4 py-8">
                <div className="mb-6 flex items-center space-x-2">
                  <div className="flex-1">
                    <SearchInput onSearch={handleSearch} />
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleCreateModule}
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

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                >
                  {isLoading
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
          </SidebarProvider>
          <Footer />
        </div>
      ) : (
        <>
          <HubNavbar
            onSearch={handleSearch}
            moduleData={modules}
            onFilterChange={handleFilterChange}
          />

          <main className="flex-grow container mx-auto px-4 py-8">
            <div className="md:hidden mb-6 flex items-center space-x-2">
              <div className="flex-1">
                <SearchInput onSearch={handleSearch} />
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCreateModule}
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

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            >
              {isLoading
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
          <Footer />
        </>
      )}
      <NavbarSidebarToggle />
    </div>
  );
}
