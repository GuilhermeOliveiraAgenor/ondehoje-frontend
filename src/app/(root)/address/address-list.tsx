'use client'

import { Edit } from 'lucide-react'

import { SiteHeader } from '@/components/nav/site-header'
import { DataTable } from '@/components/table/data-table'
import type { Lineaction } from '@/components/table/types/lineaction'
import { SaveAddressSheet } from '@/modules/address/components/save-address-sheet'
import { addressColumns } from '@/modules/address/constants/colums'
import { Address } from '@/modules/address/types/address'

type AddressListProps = {
  addresses: Address[]
}

export function AddressList({ addresses }: AddressListProps) {
  const item = {
    label: 'Criar novo endereço',
  }

  const lineactions: Lineaction[] = [
    {
      label: 'Editar endereço',
      icon: Edit,
      component: SaveAddressSheet,
    },
  ]

  return (
    <main className="grid gap-4">
      <SiteHeader title="Listagem dos Endereços" />

      <div className="grid w-full grid-cols-1 gap-4 px-4 md:px-6 lg:px-10">
        <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
          <div className="grid gap-2">
            <h3 className="text-xl font-medium">Painel</h3>
            <p className="text-sm">
              Aqui você encontra todos os seus Endereços já registradas no
              sistema.
            </p>
          </div>

          <div className="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90 disabled:pointer-announcements-none inline-flex h-9 w-full shrink-0 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:opacity-50 has-[>svg]:px-3 lg:w-fit [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
            <SaveAddressSheet lineaction={item} />
          </div>
        </div>

        <DataTable
          columns={addressColumns}
          data={addresses}
          lineActions={lineactions}
        />
      </div>
    </main>
  )
}
