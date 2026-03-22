'use client'

import { Pencil } from 'lucide-react'

import { SiteHeader } from '@/components/nav/site-header'
import { DataTable } from '@/components/table/data-table'
import { Lineaction } from '@/components/table/types/lineaction'
import { SaveCouponSheet } from '@/modules/coupon/components/save-coupon-sheet'
import { couponColumns } from '@/modules/coupon/constants/columns'
import { Coupon } from '@/modules/coupon/types/coupon'
import { EventDetails } from '@/modules/event/types/event-details'

type CouponListProps = {
  events: EventDetails[]
  coupons: Coupon[]
}

export function CouponsList({ coupons, events }: CouponListProps) {
  const item = { label: 'Criar novo cupom' }

  const lineactions: Lineaction[] = [
    {
      icon: Pencil,
      label: 'Editar',
      component: SaveCouponSheet,
      componentProps: { events },
    },
  ]

  return (
    <>
      <SiteHeader title="Gerenciamento de cupons" />

      <div className="grid w-full grid-cols-1 gap-4 px-4 md:px-6 lg:px-10">
        <div className="flex flex-row items-center justify-between">
          <div className="grid gap-2">
            <h3 className="text-xl font-medium">Painel</h3>
            <p className="text-sm">Lista de cupons</p>
          </div>

          <div className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium">
            <SaveCouponSheet events={events} lineaction={item} />
          </div>
        </div>

        <DataTable
          columns={couponColumns}
          data={coupons}
          lineActions={lineactions}
        />
      </div>
    </>
  )
}
