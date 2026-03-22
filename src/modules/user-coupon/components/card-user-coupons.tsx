'use client'

import { Calendar, CheckCircle2, Clock, MapPin, Ticket } from 'lucide-react'
import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import type { UserCoupon } from '@/modules/user-coupon/types/user-coupon'

type CardUserCouponProps = {
  userCoupon: UserCoupon
}

export function CardUserCoupon({ userCoupon }: CardUserCouponProps) {
  const { coupon, usedAt } = userCoupon
  const { name, description, expiresAt, event } = coupon

  // Formatar datas
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const isExpired = new Date(expiresAt) < new Date()
  const isUsed = !!usedAt

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
        isUsed || isExpired ? 'opacity-75' : ''
      }`}
    >
      {/* Badge de status */}
      <div className="absolute top-4 right-4 z-10">
        {isUsed ? (
          <Badge variant="secondary" className="gap-1 font-semibold">
            <CheckCircle2 className="h-3 w-3" />
            Utilizado
          </Badge>
        ) : isExpired ? (
          <Badge variant="destructive" className="gap-1 font-semibold">
            <Clock className="h-3 w-3" />
            Expirado
          </Badge>
        ) : (
          <Badge className="gap-1 font-semibold">
            <Ticket className="h-3 w-3" />
            Disponível
          </Badge>
        )}
      </div>

      <CardHeader className="space-y-4 pb-4">
        {/* Imagem do evento */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          {event.images && event.images.length > 0 ? (
            <Image
              src={event.images[0].url || '/placeholder.svg'}
              alt={event.name}
              width={300}
              height={300}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="bg-muted flex h-full w-full items-center justify-center">
              <Ticket className="text-muted-foreground h-16 w-16" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        </div>

        {/* Nome do cupom */}
        <div>
          <h3 className="line-clamp-2 text-xl leading-tight font-bold">
            {name}
          </h3>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        {/* Descrição */}
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {description}
        </p>

        {/* Informações do evento */}
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{event.name}</p>
              <p className="text-muted-foreground line-clamp-1 text-xs">
                {event.address.neighborhood}, {event.address.city}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="text-muted-foreground h-4 w-4 shrink-0" />
            <p className="text-muted-foreground text-xs">
              Evento: {formatDate(event.startDate)} até{' '}
              {formatDate(event.endDate)}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground text-xs">
              {isUsed
                ? `Usado em ${formatDate(usedAt)}`
                : `Válido até ${formatDate(expiresAt)}`}
            </span>
          </div>
          <Badge variant="outline" className="text-xs">
            {event.category.name}
          </Badge>
        </div>
      </CardFooter>
    </Card>
  )
}
