'use client'

import { Building, Info, MapPin } from 'lucide-react'
import Image from 'next/image'

import { SiteHeader } from '@/components/nav/site-header'
import { DataTable } from '@/components/table/data-table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { EvaluateAdvertisementsSheet } from '@/modules/advertisement/components/evaluate-advertisements-sheet'
import { Advertisement } from '@/modules/advertisement/types/advertisement'
import { CompanyDetails } from '@/modules/company/types/company-details'
import { documentColumns } from '@/modules/document/constants/columns'

type CompanyDetailsProps = {
  company: CompanyDetails
  advertisements: Advertisement[]
  canEvaluateAdvertisement?: boolean
}

export function EstablishmentDetailsView({
  company,
  advertisements,
  canEvaluateAdvertisement,
}: CompanyDetailsProps) {
  const coverImage =
    company?.images?.[0]?.url || 'https://picsum.photos/seed/tDqa0VF/1920/1080'

  const address = company?.address || company?.address || null

  return (
    <div className="bg-background text-foreground relative min-h-screen font-sans">
      <SiteHeader title={company.name}>
        {canEvaluateAdvertisement && advertisements.length > 0 && (
          <EvaluateAdvertisementsSheet advertisements={advertisements} />
        )}
      </SiteHeader>

      {/* IMAGEM DE CAPA */}
      <div className="relative h-64 w-full overflow-hidden md:h-80 lg:h-96">
        <Image
          src={coverImage}
          alt={company.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <main className="container mx-auto px-4 py-8 lg:px-8">
        <div className="relative z-10 -mt-16 grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* COLUNA PRINCIPAL */}
          <Card className="overflow-hidden border shadow-lg lg:col-span-4">
            <CardHeader className="rounded-t-lg pb-4">
              <div className="mb-4 flex items-center gap-4">
                <div className="bg-primary/10 flex h-24 w-24 items-center justify-center rounded-lg">
                  <Building className="text-primary h-12 w-12" />
                </div>

                <div>
                  <Badge variant="outline" className="mb-2 bg-white">
                    Estabelecimento
                  </Badge>

                  <CardTitle className="text-2xl font-bold md:text-3xl">
                    {company.name}
                  </CardTitle>

                  {company.socialName &&
                    company.socialName !== company.name && (
                      <p className="text-muted-foreground text-sm">
                        {company.socialName}
                      </p>
                    )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-2">
              <div className="space-y-6">
                {/* INFORMAÇÕES LEGAIS */}
                {company.document && (
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-2 text-lg font-semibold">
                      Informações Legais
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      <span className="font-medium">CNPJ/CPF:</span>{' '}
                      {company.document}
                    </p>
                  </div>
                )}

                {/* LOCALIZAÇÃO */}
                {address && (
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-2 text-lg font-semibold">Localização</h3>
                    <div className="flex items-start gap-2">
                      <MapPin className="text-muted-foreground mt-0.5 h-5 w-5" />
                      <p className="text-muted-foreground text-sm">
                        {address.street}, {address.number}
                        {address.complement && `, ${address.complement}`}
                        <br />
                        {address.neighborhood}
                        <br />
                        {address.city} - {address.state}
                        <br />
                        CEP: {address.cep}
                      </p>
                    </div>
                  </div>
                )}

                {/* DESCRIÇÃO DO ESTABELECIMENTO */}
                {company.informations.length > 0 && (
                  <div className="mt-8">
                    <Card className="overflow-hidden border shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold">
                          Informações Adicionais
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="flex items-start gap-3">
                          <Info className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium">
                              Informações de Contato
                            </h4>
                            {company.informations.map((info) => (
                              <div key={info.id} className="space-y-1">
                                {info.phoneNumber && (
                                  <p className="text-muted-foreground text-sm">
                                    Telefone: {info.phoneNumber}
                                  </p>
                                )}
                                {info.email && (
                                  <p className="text-muted-foreground text-sm">
                                    Email: {info.email}
                                  </p>
                                )}
                                <p className="text-muted-foreground text-sm"></p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {canEvaluateAdvertisement && (
          <>
            <Label className="mt-10 mb-4 text-2xl font-bold">Documentos</Label>

            <DataTable
              columns={documentColumns}
              data={company.documents}
              lineActions={[]}
            />
          </>
        )}
      </main>
    </div>
  )
}
