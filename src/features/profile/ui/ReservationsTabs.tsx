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
import { Search } from 'lucide-react';
import * as React from 'react';

import { Checkbox } from '@/shared/ui/checkbox';
import { Input } from '@/shared/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import { useTranslations } from 'next-intl';
import { dataPayment, PaymentRow } from '../lib/data';
import PaginationButtons from './PaginationButtons';

const ReservationsTabs = () => {
  const t = useTranslations();
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
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('service')}</div>
      ),
    },
    {
      accessorKey: 'amount',
      header: t('Общая сумма'),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('amount')}</div>
      ),
    },
    {
      accessorKey: 'location',
      header: t('Место положение'),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('location')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: t('Статус'),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('status')}</div>
      ),
    },
    {
      accessorKey: 'detail',
      header: t('Действие'),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('detail')}</div>
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

  const table = useReactTable({
    data: dataPayment.data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full bg-white rounded-3xl">
      <div className="flex items-center px-4 py-4 justify-between">
        <p className="text-xl font-semibold">{t('Последние бронирования')}</p>
        <div className="relative">
          <Input
            placeholder={t('Укажите город')}
            value={
              (table.getColumn('location')?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn('location')?.setFilterValue(event.target.value)
            }
            className="max-w-46 px-10"
          />
          <Search
            className="absolute top-1/2 transform -translate-y-1/2 left-2 size-5"
            color="#909091"
          />
        </div>
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
            {t('Ko‘rsatilmoqda')}{' '}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}
            –
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              dataPayment.total,
            )}{' '}
            {t('от')} {dataPayment.total}
          </div>
          <div className="flex gap-2 max-lg:justify-center max-lg:items-center max-lg:w-full">
            <PaginationButtons table={table} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationsTabs;
