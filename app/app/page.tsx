"use client"
import { useState, useEffect, useRef } from "react"
import { HubNavbar } from "@/components/navbar/hub-navbar"
import { SearchInput } from "@/components/search/search-input"
import { ModuleCard } from "@/components/module/module-card"
import { ModuleCardSkeleton } from "@/components/skeleton/module-card-skeleton"
import { ModulePagination } from "@/components/pagination/module-pagination"
import { Footer } from "@/components/footer/hub-footer"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"
import { ModuleType, useModuleStore } from "@/store/module-state"
import { useRouter } from "next/navigation"

const ITEMS_PER_PAGE = 12

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [filteredModules, setFilteredModules] = useState<ModuleType[]>([]);
  const [networkFilter, setNetworkFilter] = useState<string | null>(null);  // track network filter
  const [tagFilter, setTagFilter] = useState<string | null>(null);  // track tag filter
  const router = useRouter()

  const { fetchModules, modules, loadingModules, assignRandomNetworkAndTags } = useModuleStore();

  const hasFetched = useRef(false)

  useEffect(() => {
    if (!hasFetched.current) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          await fetchModules();
          await assignRandomNetworkAndTags();
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
          hasFetched.current = true;
        }
      }
      fetchData()
    }
  }, [assignRandomNetworkAndTags, fetchModules])

  useEffect(() => {
    const filtered = modules.filter((module) => {
      const matchesNetwork = !networkFilter || module.network === networkFilter;
      const matchesTag = !tagFilter || (module.tags && module.tags.includes(tagFilter));
      const matchesSearch = !searchTerm || module.name.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesNetwork && matchesTag && matchesSearch;
    });
    setFilteredModules(filtered);
  }, [searchTerm, modules, networkFilter, tagFilter]);

  const totalPages = Math.ceil(filteredModules.length / ITEMS_PER_PAGE)
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE
  const currentItems = filteredModules.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleFilterChange = ({
    network,
    tag,
    search,
  }: { network: string | null; tag: string | null; search: string }) => {
    setSearchTerm(search);  // update the search term

    // if the search is cleared, keep the selected filters intact
    if (search) {
      setNetworkFilter(network);  // store the network filter
      setTagFilter(tag);  // store the tag filter
    }

    const filtered = modules.filter((module) => {
      const matchesNetwork = !network || module.network === network
      const matchesTag = !tag || (module.tags && module.tags.includes(tag))
      const matchesSearch = !search || module.name.toLowerCase().includes(search.toLowerCase())

      return matchesNetwork && matchesTag && matchesSearch
    })
    setFilteredModules(filtered);
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#03040B] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <HubNavbar onSearch={handleSearch} moduleData={modules} onFilterChange={handleFilterChange} />

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
                  onClick={() => { router.push("/module/create") }}
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
          className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        >
          {isLoading
            ? Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => <ModuleCardSkeleton key={index} />)
            : currentItems.map((module, index) => (
              <ModuleCard
                key={index}
                name={module.name}
                mkey={module.key}
                network={module.network}
                tags={module.tags}
                timestamp={module.time.toString()}
                description={module?.description || "This is a description of a module.The module takes input from the user and gives the output."}
              />
            ))}
        </motion.div>

        {!isLoading && filteredModules.length > ITEMS_PER_PAGE && (
          <ModulePagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}

        {!isLoading && !loadingModules && filteredModules.length === 0 && (
          <div className="text-center text-gray-400 mt-8">No modules found.</div>
        )}

      </main>

      <Footer />
    </div>
  )
}
