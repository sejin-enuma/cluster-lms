interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 0) return null;

  const getVisiblePages = () => {
    const maxVisible = 10;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getVisiblePages();

  const ArrowButton = ({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-[24px] h-[24px] flex items-center justify-center border-none bg-transparent cursor-pointer ${
        disabled ? 'opacity-30 cursor-not-allowed' : 'text-gray-950'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex items-center gap-[2px]">
      <ArrowButton onClick={() => onPageChange(1)} disabled={currentPage === 1}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="7 2 3 6 7 10" />
          <line x1="3" y1="2" x2="3" y2="10" />
        </svg>
      </ArrowButton>
      <ArrowButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="8 2 4 6 8 10" />
        </svg>
      </ArrowButton>

      <div className="flex items-center gap-[4px]">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-[24px] h-[24px] flex items-center justify-center p-[10px] text-[14px] border-none bg-transparent cursor-pointer ${
              page === currentPage
                ? 'text-primary-red font-semibold'
                : 'text-gray-950 font-normal'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <ArrowButton onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="4 2 8 6 4 10" />
        </svg>
      </ArrowButton>
      <ArrowButton onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="5 2 9 6 5 10" />
          <line x1="9" y1="2" x2="9" y2="10" />
        </svg>
      </ArrowButton>
    </div>
  );
}
