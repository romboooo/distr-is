import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export interface PaginationControlsProps {
  currentPage: number; // zero-based index
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const generatePageItems = () => {
    let items: (number | string)[] = [];

    if (totalPages <= 5) {
      items = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      const current = currentPage + 1; // Convert to 1-based for display

      items = [1];

      if (current > 3) {
        items.push('...');
      }

      const startPage = Math.max(2, current - 1);
      const endPage = Math.min(totalPages - 1, current + 1);

      for (let i = startPage; i <= endPage; i++) {
        items.push(i);
      }

      if (current < totalPages - 2) {
        items.push('...');
      }

      items.push(totalPages);
    }

    return items;
  };

  return (
    <div className='flex justify-center mt-4'>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(0, currentPage - 1))}
              className={`
                ${
                  currentPage === 0
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer hover:bg-accent hover:text-accent-foreground'
                }
              `}
            />
          </PaginationItem>

          {generatePageItems().map((item, index) => (
            <PaginationItem key={`${item}-${index}`}>
              {item === '...' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => onPageChange((item as number) - 1)}
                  isActive={currentPage === (item as number) - 1}
                  className={`
                    cursor-pointer
                    ${
                      currentPage === (item as number) - 1
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'hover:bg-accent hover:text-accent-foreground'
                    }
                  `}
                >
                  {item}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                onPageChange(Math.min(totalPages - 1, currentPage + 1))
              }
              className={`
                ${
                  currentPage === totalPages - 1
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer hover:bg-accent hover:text-accent-foreground'
                }
              `}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
