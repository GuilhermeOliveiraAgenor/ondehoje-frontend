'use client'

import { SiteHeader } from '@/components/nav/site-header'
import { DataTable } from '@/components/table/data-table'
import type { Lineaction } from '@/components/table/types/lineaction'
import { AdvertisementPaymentList } from '@/modules/advertisement/components/advertisement-payments-list'
import { SaveAdvertisementSheet } from '@/modules/advertisement/components/save-advertisement-sheet'
import { advertisementColumns } from '@/modules/advertisement/constants/columns'
import { Advertisement } from '@/modules/advertisement/types/advertisement'
import { EventDetails } from '@/modules/event/types/event-details'
import { Parameter } from '@/modules/parameter/types/parameter'

type AdvertisementsListProps = {
  advertisements: Advertisement[]
  events: EventDetails[]
  price: Parameter
  discount: Parameter
  percentage: Parameter
}

export function AdvertisementsList({
  advertisements,
  events,
  price,
  discount,
  percentage,
}: AdvertisementsListProps) {
  const item = {
    label: 'Criar novo anúncio',
  }

  const lineactions: Lineaction[] = []

  return (
    <>
      <SiteHeader title="Anúncios" />

      <div className="grid w-full grid-cols-1 gap-4 px-4 md:px-6 lg:px-10">
        <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
          <div className="grid gap-2">
            <h3 className="text-xl font-medium">Painel</h3>
            <p className="text-sm">
              Aqui você pode divulgar seus eventos ou seu próprio negócio
            </p>
          </div>

          <div className="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90 disabled:pointer-announcements-none inline-flex h-9 w-full shrink-0 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:opacity-50 has-[>svg]:px-3 lg:w-fit [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
            <SaveAdvertisementSheet
              events={events}
              price={price}
              discount={discount}
              percentage={percentage}
              lineaction={item}
            />
          </div>
        </div>

        <DataTable
          columns={advertisementColumns}
          data={advertisements}
          lineActions={lineactions}
          renderSubComponent={({ row }) => (
            <AdvertisementPaymentList advertisementId={row.original.id} />
          )}
        />
      </div>
    </>
  )
}
