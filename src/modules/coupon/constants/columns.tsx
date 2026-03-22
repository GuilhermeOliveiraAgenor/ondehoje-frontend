import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { date } from 'zod'

import { DataTableColumnHeader } from '@/components/table/components/header'

import { Coupon } from '../types/coupon'

export type CouponWithEventName = Coupon & { eventName: string }

export const couponColumns: ColumnDef<Coupon>[] = [
  {
    accessorKey: 'event.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Evento" />
    ),
  },
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
  },
  {
    accessorKey: 'expiresAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expira em" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.expiresAt)
      return format(date, 'dd/MM/yyyy')
    },
  },
]
