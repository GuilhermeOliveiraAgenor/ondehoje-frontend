/* eslint-disable react-hooks/incompatible-library */
'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Fragment, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { DataTableActionsCell } from './actions/data-table-actions-cell'
import { DataTablePagination } from './buttons/pagination'
import { Lineaction } from './types/lineaction'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data?: TData[]
  toolbar?: React.ReactNode
  lineActions?: Lineaction[]
  showPagination?: boolean
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  lineActions = [],
  showPagination = true,
  renderSubComponent,
}: DataTableProps<TData, TValue>) {
  const [filter, setFilter] = useState<string>('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [expanded, setExpanded] = useState<ExpandedState>({}) // Estado da expansão

  const allColumns = useMemo<ColumnDef<TData, TValue>[]>(() => {
    const baseColumns = [...columns]

    if (renderSubComponent) {
      baseColumns.unshift({
        id: 'expander',
        header: () => null,
        cell: ({ row }) => {
          return row.getCanExpand() ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0"
              onClick={row.getToggleExpandedHandler()}
            >
              {row.getIsExpanded() ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          ) : null
        },
      })
    }

    if (lineActions.length > 0) {
      baseColumns.push({
        id: 'actions',
        header: () => <span className="sr-only">Ações</span>,
        cell: ({ row }) => (
          <DataTableActionsCell row={row} actions={lineActions} />
        ),
      })
    }

    return baseColumns
  }, [columns, lineActions, renderSubComponent])

  const table = useReactTable({
    data: data ?? [],
    columns: allColumns,
    state: {
      globalFilter: filter,
      sorting,
      columnFilters,
      expanded,
    },
    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setFilter,
    globalFilterFn: 'includesString',
  })

  return (
    <div className="flex w-full flex-col gap-6 pb-4">
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={row.getIsExpanded() ? 'bg-muted/50' : ''}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>

                  {row.getIsExpanded() && renderSubComponent && (
                    <TableRow>
                      <TableCell colSpan={row.getVisibleCells().length}>
                        <div className="bg-muted/30 rounded-md p-4">
                          {renderSubComponent({ row })}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={allColumns.length}
                  className="h-24 text-center"
                >
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination && <DataTablePagination table={table} />}
    </div>
  )
}
