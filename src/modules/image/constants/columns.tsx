import { ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from '@/components/table/components/header'

import { Image } from '../types/image'

export const imageColumns: ColumnDef<Image>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },

  {
    accessorKey: 'url',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Arquivo" />
    ),
    cell: ({ row }) => {
      const url = row.original.url

      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-2 py-1 text-sm"
        >
          Visualizar arquivo
        </a>
      )
    },
  },
  {
    accessorKey: 'alt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descrição" />
    ),
  },
]
