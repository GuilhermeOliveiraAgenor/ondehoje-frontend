import type { ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from '@/components/table/components/header'
import { maskDate } from '@/utils/masks'

import type { EventDetails } from '../types/event-details'

export const eventColumns: ColumnDef<EventDetails>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descrição" />
    ),
    cell: ({ row }) => {
      return `${row.original.description.slice(0, 30)}${
        row.original.description.length > 30 ? '...' : ''
      }`
    },
  },
  {
    accessorKey: 'category.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Categoria" />
    ),
  },
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
      <DataTableColumnHeader column={column} title="Data de Término" />
    ),
    cell: ({ row }) => {
      return `${maskDate(row.original.endDate)}`
    },
    enableGlobalFilter: false,
  },
]
