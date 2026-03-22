import type { ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from '@/components/table/components/header'
import { maskCurrency, maskDate } from '@/utils/masks'

import { Subscription } from '../types/subscription'

export const subscriptionColumns: ColumnDef<Subscription>[] = [
  {
    accessorKey: 'startDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data de Início" />
    ),
    cell: ({ row }) => {
      return `${maskDate(row.original.startDate)}`
    },
    enableGlobalFilter: false,
  },
  {
    accessorKey: 'endDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fim da Assinatura" />
    ),
    cell: ({ row }) => {
      return `${maskDate(row.original.endDate)}`
    },
    enableGlobalFilter: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Valor" />
    ),
    cell: ({ row }) => {
      return `${maskCurrency(row.original.amount)}`
    },
  },
]
