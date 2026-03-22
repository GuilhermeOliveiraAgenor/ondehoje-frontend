'use client'

import {
  Calendar,
  Check,
  Clock,
  Info,
  MapPin,
  Ticket,
  User,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { SiteHeader } from '@/components/nav/site-header'
import { DataTable } from '@/components/table/data-table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/use-form-state'
import { EvaluateAdvertisementsSheet } from '@/modules/advertisement/components/evaluate-advertisements-sheet'
import { Advertisement } from '@/modules/advertisement/types/advertisement'
import { Coupon } from '@/modules/coupon/types/coupon'
import { documentColumns } from '@/modules/document/constants/columns'
import { EventDetails as TypeEventDetails } from '@/modules/event/types/event-details'

import { saveUserCouponAction } from './actions'

type EventDetailsProps = {
  event: TypeEventDetails
  coupons: Coupon[]
  advertisements: Advertisement[]
  canEvaluateAdvertisement?: boolean
}

const calcDuracao = (startDateISO: string, endDateISO: string): string => {
  const startDate = new Date(startDateISO)
  const endDate = new Date(endDateISO)

  const diffMs = endDate.getTime() - startDate.getTime()

  if (diffMs < 0) return 'Duração inválida'

  const msPerMinute = 1000 * 60
  const msPerHour = msPerMinute * 60
  const msPerDay = msPerHour * 24

  const days = Math.floor(diffMs / msPerDay)
  const hours = Math.floor((diffMs % msPerDay) / msPerHour)
  const minutes = Math.floor((diffMs % msPerHour) / msPerMinute)

  const parts: string[] = []

  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)

  if (parts.length === 0) {
    const seconds = Math.floor((diffMs % msPerMinute) / 1000)
    if (seconds > 0) return `${seconds}s`
    return '0m'
  }

  return parts.join(' ')
}

export function EventDetails({
  event,
  coupons,
  advertisements,
  canEvaluateAdvertisement = false,
}: EventDetailsProps) {
  const hasCoupons = coupons && coupons.length > 0
  const duracaoEvento = calcDuracao(event.startDate, event.endDate)

  const formAction = saveUserCouponAction

  const [{ success, message }, handleSubmit, isPending] =
    useFormState(formAction)

  const renderCouponCard = () => (
    <Card className="h-full border shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-center text-lg font-semibold">
          {hasCoupons ? 'Cupons Exclusivos' : 'Cupons de Desconto'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {!hasCoupons ? (
          <p className="text-muted-foreground text-center text-sm">
            Não há cupons disponíveis para este evento no momento.
          </p>
        ) : (
          <div className="space-y-3">
            {coupons.map((cp) => {
              const isRedeemed = cp.isRedeemed
              const isDisabled = isPending || isRedeemed

              return (
                <form key={cp.id} action={handleSubmit}>
                  <input type="hidden" name="id" value={cp.id} />

                  <button
                    type="submit"
                    disabled={isDisabled}
                    className={`group relative w-full overflow-hidden rounded-lg border-2 p-3.5 text-left transition-all duration-300 ease-in-out ${
                      isRedeemed
                        ? 'cursor-not-allowed border-green-500 bg-green-50 shadow-sm'
                        : 'hover:border-primary cursor-pointer border-dashed border-gray-300 bg-white hover:scale-[1.02] hover:shadow-md active:scale-100'
                    } ${isPending ? 'cursor-wait opacity-70' : ''} `}
                  >
                    {isRedeemed && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
                        <Check className="h-3 w-3" />
                        Resgatado
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${isRedeemed ? 'bg-green-500' : 'bg-primary group-hover:bg-primary/90'} transition-colors`}
                        >
                          {isPending ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : isRedeemed ? (
                            <Check className="h-5 w-5 text-white" />
                          ) : (
                            <Ticket className="h-5 w-5 text-white" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                            Código
                          </p>
                          <p
                            className={`text-lg font-bold tracking-wider ${
                              isRedeemed ? 'text-green-700' : 'text-gray-900'
                            }`}
                          >
                            {cp.name}
                          </p>
                          {cp.description && (
                            <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
                              {cp.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {!isRedeemed && !isPending && (
                        <div className="shrink-0 text-right">
                          <div className="text-primary group-hover:text-primary/90 text-xs font-semibold uppercase">
                            Clique para
                          </div>
                          <div className="text-primary group-hover:text-primary/90 text-xs font-semibold uppercase">
                            Resgatar
                          </div>
                        </div>
                      )}
                    </div>

                    {isPending && (
                      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-200">
                        <div className="bg-primary h-full w-2/3 animate-pulse rounded-full"></div>
                      </div>
                    )}
                  </button>

                  {message && !isPending && (
                    <p
                      className={`mt-1.5 text-center text-xs font-medium ${
                        success ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {message}
                    </p>
                  )}
                </form>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="bg-background text-foreground relative flex min-h-screen w-full flex-col font-sans">
      <SiteHeader title={event.name}>
        {canEvaluateAdvertisement && advertisements.length > 0 && (
          <EvaluateAdvertisementsSheet advertisements={advertisements} />
        )}
      </SiteHeader>

      <div className="relative h-64 w-full overflow-hidden md:h-80 lg:h-96">
        <Image
          src={event.images[0].url}
          alt={event.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <main className="container mx-auto px-4 py-8 lg:px-8">
        <div className="relative z-10 -mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <Card className="overflow-hidden border shadow-lg lg:col-span-2">
            <CardHeader className="rounded-t-lg pb-4">
              <div className="mb-2 flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-white">
                  {event.category?.description || 'Categoria'}
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold wrap-break-word md:text-3xl">
                {event.name}
              </CardTitle>
              <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>
                  {new Date(event.startDate).toLocaleDateString('pt-BR')}
                </span>
                <Clock className="ml-3 h-4 w-4 shrink-0" />
                <span>
                  {new Date(event.startDate).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="text-muted-foreground mt-1 flex flex-wrap items-start gap-2 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="min-w-0 flex-1 wrap-break-word">
                  Organizado por: {event.company?.name || 'Organizador'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <h3 className="mb-3 text-lg font-semibold">
                Descrição do Evento
              </h3>
              <p className="text-muted-foreground mb-4 wrap-break-word whitespace-pre-wrap">
                {event.description || 'Sem descrição disponível.'}
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <Clock className="text-muted-foreground h-4 w-4 shrink-0" />
                  <span>Duração do evento:</span>
                  <span className="font-medium">{duracaoEvento}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <User className="text-muted-foreground h-4 w-4 shrink-0" />
                  <span>Criado por: </span>
                  <Link
                    href={`/establishment/${event.company.slug}`}
                    className="text-primary break-all hover:underline"
                  >
                    {event.company.name}
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-1">{renderCouponCard()}</div>
        </div>

        {event.informations.length > 0 && (
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
                    <h4 className="font-medium">Informações de Contato</h4>
                    {event.informations.map((info) => (
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

                <div className="flex items-start gap-3">
                  <MapPin className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium">Endereço Completo</h4>
                    <p className="text-muted-foreground text-sm wrap-break-word">
                      {event.address?.street}, {event.address?.number}
                      {event.address?.complement &&
                        `, ${event.address.complement}`}
                      <br />
                      {event.address?.neighborhood}, {event.address?.city},{' '}
                      {event.address?.state}
                      <br />
                      CEP: {event.address?.cep}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {canEvaluateAdvertisement && (
          <>
            <Label className="mt-10 mb-4 text-2xl font-bold">Documentos</Label>

            <DataTable
              columns={documentColumns}
              data={event.company.documents}
              lineActions={[]}
            />
          </>
        )}
      </main>
    </div>
  )
}
