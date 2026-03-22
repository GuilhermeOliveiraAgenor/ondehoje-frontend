import type { ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from '@/components/table/components/header'
import { Badge } from '@/components/ui/badge'
import { maskCurrency, maskDate } from '@/utils/masks'

import type { Payment } from '../types/payment'

export const paymentColumns: ColumnDef<Payment>[] = [
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
    accessorKey: 'tax',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Taxa" />
    ),
    cell: ({ row }) => {
      return `${maskCurrency(row.original.tax ? row.original.tax : 0)}`
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    accessorKey: 'link',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Link de Pagamento" />
    ),
    cell: ({ row }) => {
      const status = row.original.status
      const link = row.original.link || ''

      if (status !== 'Aguardando pagamento') {
        return <Badge variant="success">Já pago</Badge>
      }

      return (
        <a
          href={link}
          rel="noopener noreferrer"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-2 py-1 text-sm"
        >
          Pagar assinatura
        </a>
      )
    },
  },
  {
    accessorKey: 'confirmationDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data de Confirmação" />
    ),
    cell: ({ row }) => {
      return `${maskDate(row.original.confirmationDate || '')}`
    },
    enableHiding: false,
  },
]
