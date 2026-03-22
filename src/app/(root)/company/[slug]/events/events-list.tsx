'use client'

import { Edit } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { SiteHeader } from '@/components/nav/site-header'
import { DataTable } from '@/components/table/data-table'
import type { Lineaction } from '@/components/table/types/lineaction'
import { Button } from '@/components/ui/button'
import { Address } from '@/modules/address/types/address'
import { Category } from '@/modules/category/types/category'
import { EditEventSheet } from '@/modules/event/components/edit-event-sheet'
import { eventColumns } from '@/modules/event/constants/columns'
import { EventDetails } from '@/modules/event/types/event-details'

type EventsListProps = {
  events: EventDetails[]
  addresses: Address[]
  categories: Category[]
}

export function EventsList({ events, addresses, categories }: EventsListProps) {
  const router = useRouter()

  function handleNavigateToCreateEvent() {
    router.push('events/save')
  }

  const lineactions: Lineaction[] = [
    {
      label: 'Editar',
      icon: Edit,
      component: EditEventSheet,
      componentProps: { addresses, categories },
    },
  ]

  return (
    <>
      <SiteHeader title="Meus eventos" />

      <div className="grid w-full grid-cols-1 gap-4 px-4 md:px-6 lg:px-10">
        <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
          <div className="grid gap-2">
            <h3 className="text-xl font-medium">Painel</h3>
            <p className="text-sm">
              Aqui você pode criar novos eventos e gerenciar os existentes.
            </p>
          </div>

          <div className="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90 disabled:pointer-announcements-none inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:opacity-50 has-[>svg]:px-3 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
            <Button onClick={handleNavigateToCreateEvent}>
              Criar novo evento
            </Button>
          </div>
        </div>

        <DataTable
          columns={eventColumns}
          data={events}
          lineActions={lineactions}
        />
      </div>
    </>
  )
}
