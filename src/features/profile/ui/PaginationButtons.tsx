import { Button } from '@/shared/ui/button';
import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaymentRow } from '../lib/data';

const PaginationButtons = ({ table }: { table: Table<PaymentRow> }) => {
  return (
    <div className="flex gap-2">
      <Button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        className="rounded-full w-auto h-10 !p-0 !px-2 bg-[#ECF2FF] hover:bg-[#ECF2FF] disabled:opacity-50"
      >
        <ChevronLeft color="#084FE3" className="size-6" />
      </Button>
      <Button
        className={`rounded-full w-auto h-10 !p-0 !px-4 ${'bg-[#084FE3] text-white'}`}
      >
        1
      </Button>
      <Button
        className={`rounded-full w-auto h-10 !p-0 !px-4 ${'bg-[#ECF2FF] text-[#084FE39]'}`}
      >
        2
      </Button>
      <Button
        className={`rounded-full w-auto h-10 !p-0 !px-4 ${'bg-[#ECF2FF] text-[#084FE39]'}`}
      >
        3
      </Button>
      <Button
        className={`rounded-full w-auto h-10 !p-0 !px-4 ${'bg-[#ECF2FF] text-[#084FE39]'}`}
      >
        4
      </Button>
      <Button
        className={`rounded-full w-auto h-10 !p-0 !px-4 ${'bg-[#ECF2FF] text-[#084FE39]'}`}
      >
        5
      </Button>
      <Button
        className={`rounded-full w-auto h-10 !p-0 !px-3 ${'bg-[#ECF2FF] text-[#084FE3]'}`}
      >
        ...
      </Button>

      <Button
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        className="rounded-full w-auto h-10 !p-0 !px-2 bg-[#ECF2FF] hover:bg-[#ECF2FF] disabled:opacity-50"
      >
        <ChevronRight color="#084FE3" className="size-6" />
      </Button>
    </div>
  );
};

export default PaginationButtons;
