import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ModulePagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pageNumbers = [...Array(totalPages)].map((_, i) => i + 1);

  const handlePrevClick = () => onPageChange(currentPage - 1);
  const handleNextClick = () => onPageChange(currentPage + 1);
  const handlePageClick = (page: number) => onPageChange(page);

  const getButtonClass = (isCurrentPage: boolean) =>
    `w-8 h-8 ${
      isCurrentPage
        ? 'bg-blue-500 text-white'
        : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <nav className="flex justify-center items-center space-x-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevClick}
        disabled={currentPage === 1}
        className={getButtonClass(false)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {pageNumbers.map((number) => (
        <Button
          key={number}
          variant={currentPage === number ? 'default' : 'outline'}
          size="icon"
          onClick={() => handlePageClick(number)}
          className={getButtonClass(currentPage === number)}
        >
          {number}
        </Button>
      ))}
      <Button
        variant="outline"
        size="icon"
        onClick={handleNextClick}
        disabled={currentPage === totalPages}
        className={getButtonClass(false)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
