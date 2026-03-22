'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { SiteHeader } from '@/components/nav/site-header'
import { DataTable } from '@/components/table/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Address } from '@/modules/address/types/address'
import { CompanyDetails } from '@/modules/company/types/company-details'
import { documentColumns } from '@/modules/document/constants/columns'
import { imageColumns } from '@/modules/image/constants/columns'
import { maskCNPJ } from '@/utils/masks'

type SettingsPageProps = {
  company: CompanyDetails
  addresses: Address[]
}

export function SettingsPage({ company, addresses }: SettingsPageProps) {
  const router = useRouter()

  const [addressId, setAddressId] = useState(company.address.id || '')
  const [name, setName] = useState(company.name || '')
  const [socialName, setSocialName] = useState(company.socialName || '')
  const [document, setDocument] = useState(company.document || '')

  function handleNavigateToEdit() {
    router.push(`/company/${company.slug}/save`)
  }

  return (
    <div className="grid space-y-4">
      <SiteHeader title="Detalhes da empresa">
        <Button className="gap-2 p-2" onClick={handleNavigateToEdit}>
          Editar minha empresa
        </Button>
      </SiteHeader>

      <form className="grid space-y-4 p-4">
        <div className="grid gap-2">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <Label htmlFor="addressId">Endereço da empresa</Label>
          </div>
          <Select value={addressId} onValueChange={setAddressId}>
            <SelectTrigger
              id="addressId"
              disabled
              className="w-full py-2 text-xs sm:py-2.5 sm:text-sm"
            >
              <SelectValue placeholder="Selecione o endereço cadastrado" />
            </SelectTrigger>
            <SelectContent>
              {addresses.map((option) => (
                <SelectItem key={option.id} value={String(option.id)}>
                  {option.street}, {option.neighborhood} - {option.city}/
                  {option.state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="addressId" value={addressId} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="name">Nome da empresa</Label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome da empresa"
            autoComplete="off"
            disabled
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="socialName">Nome social da empresa</Label>
          <Input
            id="socialName"
            name="socialName"
            value={socialName}
            onChange={(e) => setSocialName(e.target.value)}
            placeholder="Nome social da empresa"
            autoComplete="off"
            disabled
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="document">CNPJ</Label>
          <Input
            id="document"
            name="document"
            value={maskCNPJ(document)}
            onChange={(e) => setDocument(e.target.value)}
            placeholder="Preencha o CNPJ da empresa"
            autoComplete="off"
            disabled
          />
        </div>

        <div className="grid gap-4 rounded-md border p-4">
          <h3 className="text-base font-medium">Imagens</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3">
            {company.images.map((image, i) => (
              <div key={i} className="flex flex-col items-center">
                <Image
                  src={image.url || '/placeholder.svg'}
                  width={1920}
                  height={1080}
                  alt={`Preview ${i + 1}`}
                  className="object-cover"
                  priority
                  sizes="100vw"
                />
              </div>
            ))}
          </div>

          <DataTable
            columns={imageColumns}
            data={company.images}
            lineActions={[]}
          />
        </div>

        <div className="grid gap-4 rounded-md border p-4">
          <h3 className="text-base font-medium">Documentos</h3>

          <DataTable
            columns={documentColumns}
            data={company.documents}
            lineActions={[]}
          />
        </div>
      </form>
    </div>
  )
}
