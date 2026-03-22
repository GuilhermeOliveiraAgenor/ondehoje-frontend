'use client'

import { ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from '@/components/table/components/header'
import { maskCurrency, maskDate } from '@/utils/masks'

import { Advertisement } from '../types/advertisement'

export const advertisementColumns: ColumnDef<Advertisement>[] = [
  {
    accessorKey: 'company.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Empresa" />
    ),
  },
  {
    accessorKey: 'event.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Evento" />
    ),
    cell: ({ row }) => {
      const eventName = row.original.event?.name

      if (!eventName) {
        return 'Anúncio da empresa'
      }

      return `${row.original.event?.name}`
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    accessorKey: 'days',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Qtd. de Dias" />
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
  {
    accessorKey: 'clicks',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Qtd. de Cliques" />
    ),
  },
  {
    accessorKey: 'insights',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Qtd. de Visualizações" />
    ),
  },
  {
    accessorKey: 'expirationDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data de expiração" />
    ),
    cell: ({ row }) => {
      return `${maskDate(row.original.expirationDate)}`
    },
    enableGlobalFilter: false,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Criado em" />
    ),
    cell: ({ row }) => {
      return `${maskDate(row.original.createdAt)}`
    },
    enableGlobalFilter: false,
  },
]
