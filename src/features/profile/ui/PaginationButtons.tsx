import { Button } from '@/shared/ui/button';
import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaymentRow } from '../lib/data';

interface PaginationButtonsProps {
  table: Table<PaymentRow>;
  page: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const PaginationButtons = ({
  table,
  page,
  totalPages,
  setPage,
}: PaginationButtonsProps) => {
  // Sahifa raqamlarini chiqarish (masalan: 1, 2, 3, 4, 5 yoki 3 ... 7)
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    for (
      let i = Math.max(1, page - delta);
      i <= Math.min(totalPages, page + delta);
      i++
    ) {
      range.push(i);
    }
    return range;
  };

  const handlePageChange = (p: number) => {
    if (p >= 1 && p <= totalPages) {
      setPage(p);
      table.setPageIndex(p - 1);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      {/* Oldingi sahifa */}
      <Button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className="rounded-full w-auto h-10 !p-0 !px-2 bg-[#ECF2FF] hover:bg-[#E0E6F7] disabled:opacity-50"
      >
        <ChevronLeft color="#084FE3" className="size-6" />
      </Button>

      {/* Dinamik raqamlar */}
      {getPageNumbers().map((p) => (
        <Button
          key={p}
          onClick={() => handlePageChange(p)}
          className={`rounded-full w-auto h-10 !p-0 !px-4 ${
            p === page
              ? 'bg-[#084FE3] text-white'
              : 'bg-[#ECF2FF] text-[#084FE3]'
          }`}
        >
          {p}
        </Button>
      ))}

      {/* Agar ko‘p sahifalar bo‘lsa "..." qo‘shamiz */}
      {page + 2 < totalPages && (
        <span className="text-[#084FE3] font-semibold">...</span>
      )}

      {/* Keyingi sahifa */}
      <Button
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
        className="rounded-full w-auto h-10 !p-0 !px-2 bg-[#ECF2FF] hover:bg-[#E0E6F7] disabled:opacity-50"
      >
        <ChevronRight color="#084FE3" className="size-6" />
      </Button>
    </div>
  );
};

export default PaginationButtons;
