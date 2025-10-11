'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { Banknote, EyeIcon, Loader2 } from 'lucide-react';
import * as React from 'react';

import { LanguageRoutes } from '@/shared/config/i18n/types';
import { formatPrice } from '@/shared/lib/formatPrice';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { User_Api } from '../lib/api';
import { PaymentRow } from '../lib/data';
import PaginationButtons from './PaginationButtons';

const ReservationsTabs = ({
  setDetail,
  setOrderDetilId,
}: {
  setDetail: React.Dispatch<React.SetStateAction<boolean>>;
  setOrderDetilId: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const t = useTranslations();
  const [page, setPage] = React.useState<number>(1);
  const page_size = 10;
  const { locale } = useParams();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order_all', page],
    queryFn: () => User_Api.getOrder({ page, page_size: page_size }),
  });

  const columns: ColumnDef<PaymentRow>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          className="bg-white focus:ring-0 border-[#084FE3] size-4 rounded-[5px]"
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'id',
      header: t('Код бронирования'),
      cell: ({ row }) => <div className="capitalize">{row.getValue('id')}</div>,
    },
    {
      accessorKey: 'service',
      header: t('Название услуги'),
      cell: ({ row }) => {
        const ticket = row.original.ticket;
        return (
          <div className="capitalize">
            {ticket?.service_name || ticket?.title || t('Не указано')}
          </div>
        );
      },
    },
    {
      accessorKey: 'total_price',
      header: t('Общая сумма'),
      cell: ({ row }) => (
        <div className="capitalize">
          {formatPrice(
            row.getValue('total_price'),
            locale as LanguageRoutes,
            true,
          )}
        </div>
      ),
    },
    {
      accessorKey: 'destination',
      header: t('Место положение'),
      cell: ({ row }) => {
        const ticket = row.original.ticket;
        return (
          <div className="capitalize">
            {ticket?.location_name || ticket?.location_name || t('Не указано')}
          </div>
        );
      },
    },
    {
      accessorKey: 'order_status',
      header: t('Статус'),
      cell: ({ row }) => {
        type OrderStatus =
          | 'pending_payment'
          | 'pending_confirmation'
          | 'cancelled'
          | 'confirmed'
          | 'completed';
        const status = row.getValue('order_status') as OrderStatus;
        const statusConfig: Record<
          OrderStatus,
          { label: string; className: string }
        > = {
          pending_payment: {
            label: t('Kutimoqda'),
            className:
              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
          },
          pending_confirmation: {
            label: t('Tasdiqlanmoqda'),
            className:
              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
          },
          cancelled: {
            label: t('Bekor qilingan'),
            className:
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
          },
          confirmed: {
            label: t('Tasdiqlangan'),
            className:
              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
          },
          completed: {
            label: t('Tugallangan'),
            className:
              'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
          },
        };
        const config =
          statusConfig[status] ||
          ({
            label: status,
            className: 'bg-gray-100 text-gray-800',
          } as const);

        return (
          <div
            className={`capitalize px-2 py-1 rounded-md text-sm font-medium inline-block ${config.className}`}
          >
            {config.label}
          </div>
        );
      },
    },
    {
      accessorKey: 'detail',
      header: t('Действие'),
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            className="bg-[#ECF2FF] border-[#ECF2FF] text-[#084FE3] hover:bg-[#ECF2FF] hover:text-[#084FE3] cursor-pointer text-md"
            variant={'outline'}
            onClick={() => {
              setDetail(true);
              setOrderDetilId(row.getValue('id'));
            }}
          >
            <EyeIcon />
            {t("Ba'tafsil")}
          </Button>
          <Button
            disabled={row.getValue('order_status') !== 'pending_payment'}
            className="flex items-center cursor-pointer gap-2 bg-green-100 border border-green-100 text-green-600 hover:bg-green-100 hover:text-green-600 hover:border-green-100 transition-colors duration-300 text-md font-medium"
            variant="outline"
          >
            <Banknote className="w-5 h-5" />
            {t("To'lash")}
          </Button>
        </div>
      ),
    },
  ];
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const tableData = order?.data?.data?.results || [];
  const totalItems = order?.data?.data?.total_items || 0;
  const totalPages = order?.data?.data?.total_pages || 0;

  const table = useReactTable<PaymentRow>({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    pageCount: totalPages,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: page - 1,
        pageSize: 10,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-3xl">
        <div className="flex items-center px-4 py-4 justify-between">
          <p className="text-xl font-semibold">{t('Последние бронирования')}</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#084FE3]" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-3xl">
      <div className="flex items-center px-4 py-4 justify-between">
        <p className="text-xl font-semibold">{t('Последние бронирования')}</p>
      </div>
      <div className="overflow-hidden">
        <Table className="!border-none !px-4">
          <TableHeader className="!border-none !px-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="!border-none bg-[#ECF2FF] !text-[#084FE3] !px-10"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="!border-none !text-[#084FE3] !px-4"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="text-[#212122] !px-4"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="!px-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t('Не найдено')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4 mt-5">
        <div className="flex items-center justify-end space-x-2 py-4 mt-5 px-10 max-lg:mt-0 max-lg:py-0 w-full">
          <div className="text-muted-foreground flex-1 text-md px-10 max-lg:hidden">
            {t("Ko'rsatilmoqda")}{' '}
            {tableData.length > 0 ? (page - 1) * page_size + 1 : 0}–
            {Math.min(page * page_size, totalItems)} {t('от')} {totalItems}
          </div>
          <div className="flex gap-2 max-lg:justify-center max-lg:items-center max-lg:w-full">
            <PaginationButtons
              table={table}
              page={page}
              totalPages={totalPages}
              setPage={setPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationsTabs;
