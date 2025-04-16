import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Question {
  text: string;
  type: string;
  required: boolean;
  timeLimit: number;
}

interface QuestionPaginationProps {
  questions: Question[];
  renderQuestion: (question: Question, index: number) => React.ReactNode;
}

export function QuestionPagination({ questions, renderQuestion }: QuestionPaginationProps) {
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(isMobile ? 5 : 10);
  
  // Reset to page 1 when itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);
  
  // Reset itemsPerPage based on screen size
  useEffect(() => {
    setItemsPerPage(isMobile ? 5 : 10);
  }, [isMobile]);

  const totalPages = Math.ceil(questions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, questions.length);
  const currentQuestions = questions.slice(startIndex, endIndex);

  // Generate an array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    if (currentPage > 2) {
      pages.push(1);
    }
    
    // Show ellipsis if needed
    if (currentPage > 3) {
      pages.push('ellipsis');
    }
    
    // Calculate range around current page - keep it small for mobile
    const pageRange = isMobile ? 1 : 2;
    const start = Math.max(currentPage > 2 ? currentPage - pageRange : 1, 1);
    const end = Math.min(totalPages, currentPage + pageRange);
    
    // Add pages around current page
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      pages.push('ellipsis');
    }
    
    // Always show last page if we have more than 1 page
    if (totalPages > 1 && currentPage < totalPages) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Display current questions */}
      <div className="space-y-3">
        {currentQuestions.map((question, index) => (
          renderQuestion(question, startIndex + index)
        ))}
      </div>
      
      {/* Empty state */}
      {questions.length === 0 && (
        <div className="text-center py-10 text-gray-500 animate-fade-in">
          <p className="text-lg font-medium">No questions added yet</p>
          <p className="text-sm">Add questions manually or generate with AI</p>
        </div>
      )}
      
      {/* Pagination controls */}
      {questions.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {questions.length > 0 ? `Showing ${startIndex + 1}-${endIndex} of ${questions.length}` : "No questions"}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => setItemsPerPage(parseInt(value))}
            >
              <SelectTrigger className="w-[100px] sm:w-[130px]">
                <SelectValue placeholder="Per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="15">15 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
              </SelectContent>
            </Select>
            
            <Pagination>
              <PaginationContent>
                {totalPages > 1 && (
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:scale-105 transition-transform"}
                      aria-disabled={currentPage === 1}
                    >
                      {isMobile ? <ChevronLeft className="h-4 w-4" /> : "Previous"}
                    </PaginationPrevious>
                  </PaginationItem>
                )}
                
                {!isMobile && totalPages > 1 && getPageNumbers().map((page, i) => (
                  page === 'ellipsis' ? (
                    <PaginationItem key={`ellipsis-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => setCurrentPage(page as number)}
                        className="cursor-pointer hover:scale-105 transition-transform"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                ))}
                
                {isMobile && (
                  <PaginationItem>
                    <PaginationLink isActive>
                      {currentPage} / {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                )}
                
                {totalPages > 1 && (
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:scale-105 transition-transform"}
                      aria-disabled={currentPage === totalPages}
                    >
                      {isMobile ? <ChevronRight className="h-4 w-4" /> : "Next"}
                    </PaginationNext>
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
}
