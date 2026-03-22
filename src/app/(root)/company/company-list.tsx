'use client'

import Link from 'next/link'

import { SiteHeader } from '@/components/nav/site-header'
import { DataTable } from '@/components/table/data-table'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { companyColumns } from '@/modules/company/constants/columns'
import { Company } from '@/modules/company/types/company'

type CompanyListProps = {
  companies: Company[]
}

export function CompanyList({ companies }: CompanyListProps) {
  return (
    <main className="grid gap-4">
      <SiteHeader title="Minhas empresas">
        <Button asChild className="gap-2 p-2">
          <Link href="/company/save">Criar nova empresa</Link>
        </Button>
      </SiteHeader>

      <div className="grid w-full grid-cols-1 gap-4 px-4 md:px-6 lg:px-10">
        <h1 className="text-base font-medium md:text-xl">
          Listagem das empresas cadastradas
        </h1>

        <Label className="text-md font-light md:text-base">
          Aqui você encontra todas as empresas já registradas no sistema.
          Selecione uma delas para visualizar detalhes, gerenciar informações ou
          atualizar dados de assinatura.
        </Label>

        <DataTable columns={companyColumns} data={companies} lineActions={[]} />
      </div>
    </main>
  )
}
