import { ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from '@/components/table/components/header'
import { maskDate } from '@/utils/masks'

import { Address } from '../types/address'

export const addressColumns: ColumnDef<Address>[] = [
  {
    accessorKey: 'street',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rua" />
    ),
  },
  {
    accessorKey: 'neighborhood',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bairro" />
    ),
  },
  {
    accessorKey: 'number',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Número" />
    ),
  },
  {
    accessorKey: 'complement',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Complemento" />
    ),
  },
  {
    accessorKey: 'cep',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CEP" />
    ),
  },
  {
    accessorKey: 'city',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cidade" />
    ),
  },
  {
    accessorKey: 'uf',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="UF" />
    ),
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
