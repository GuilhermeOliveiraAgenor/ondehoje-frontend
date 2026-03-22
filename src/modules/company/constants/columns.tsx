import { ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from '@/components/table/components/header'

import { Company } from '../types/company'

export const companyColumns: ColumnDef<Company>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    accessorKey: 'document',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CNPJ" />
    ),
  },
  {
    accessorKey: 'slug',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gerenciamento" />
    ),
    cell: ({ row }) => {
      const slug = row.getValue('slug') as string

      return (
        <a href={`/company/${slug}/subscription`}>
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-2 py-1 text-sm">
            Gerenciar
          </button>
        </a>
      )
    },
  },
]
