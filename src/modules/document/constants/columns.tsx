import { ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from '@/components/table/components/header'

import { Document } from '../types/document'

export const documentColumns: ColumnDef<Document>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
  },
  {
    accessorKey: 'file',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Arquivo" />
    ),
    cell: ({ row }) => {
      const file = row.original.file

      return (
        <a
          href={file}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-2 py-1 text-sm"
        >
          Visualizar arquivo
        </a>
      )
    },
  },
]
