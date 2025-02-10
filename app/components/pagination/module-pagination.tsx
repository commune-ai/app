import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function ModulePagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className="flex justify-center items-center space-x-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {pageNumbers.map((number) => (
        <Button
          key={number}
          variant={currentPage === number ? "default" : "outline"}
          size="icon"
          onClick={() => onPageChange(number)}
          className={`w-8 h-8 ${
            currentPage === number
              ? "bg-blue-500 text-white"
              : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          {number}
        </Button>
      ))}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  )
}

