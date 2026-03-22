'use client'

import { Heart, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { startTransition } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { EventLocation } from '../types/event-location'
import { toggleFavoriteAction } from './actions'

interface CardEventProps {
  event: EventLocation
  isAuthenticated: boolean
}

export function CardEvent({ event, isAuthenticated }: CardEventProps) {
  const router = useRouter()

  const { name, startDate, address, isFavorited } = event

  const coverImageUrl = event.images[0] || ''

  const handleNavigateToDetails = () => {
    router.push(`/event/${event.slug}`)
  }

  const toggleFavorite = () => {
    startTransition(async () => {
      const result = await toggleFavoriteAction(event.id, undefined)
      if (result.success) {
        router.refresh()
      } else {
        console.error(result.error)
      }
    })
  }

  return (
    <article className="bg-card flex flex-col overflow-hidden rounded-3xl transition-all duration-300 ease-in-out hover:scale-[1.01] hover:shadow-lg">
      <div
        className="flex h-32 w-full flex-col justify-between rounded-t-3xl bg-cover bg-center p-2 sm:h-40 sm:p-3 md:h-48 md:p-4 lg:h-52"
        style={{ backgroundImage: `url(${coverImageUrl})` }}
      >
        <div className="relative z-10 flex w-full items-start justify-between gap-2">
          <div className="bg-accent/90 flex h-auto min-h-10 w-auto min-w-10 flex-col items-center justify-center rounded-lg p-1.5 shadow backdrop-blur-sm">
            <span className="text-foreground text-[10px] leading-tight font-medium capitalize">
              {new Date(startDate).toLocaleString('pt-BR', { month: 'short' })}
            </span>
            <span className="text-primary text-base leading-tight font-bold sm:text-lg">
              {new Date(startDate).getDate()}
            </span>
          </div>
          {isAuthenticated && (
            <button
              className="bg-accent/90 hover:bg-accent flex h-8 w-8 items-center justify-center rounded-full p-1.5 shadow backdrop-blur-sm transition-colors sm:h-9 sm:w-9"
              aria-label={
                isFavorited
                  ? 'Remover dos favoritos'
                  : 'Adicionar aos favoritos'
              }
              onClick={toggleFavorite}
            >
              <Heart
                className={cn(
                  'h-4 w-4',
                  isFavorited
                    ? 'fill-destructive text-destructive'
                    : 'text-muted-foreground hover:text-destructive/80',
                )}
              />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-2 p-3 sm:gap-3 sm:p-4">
        <div>
          <h3 className="text-foreground line-clamp-2 text-sm leading-snug font-semibold sm:text-base">
            {name}
          </h3>
          {address && (
            <div className="mt-2 flex items-start gap-1.5">
              <MapPin className="text-primary mt-0.5 h-4 w-4 shrink-0 sm:h-4 sm:w-4" />
              <span className="text-muted-foreground line-clamp-2 text-xs font-light wrap-break-word sm:text-sm">
                {address.neighborhood} - {address.city}, {address.state}
              </span>
            </div>
          )}
        </div>

        <Button
          className="h-8 w-full text-xs font-medium hover:cursor-pointer sm:h-10 sm:text-sm"
          onClick={handleNavigateToDetails}
        >
          Ver detalhes
        </Button>
      </div>
    </article>
  )
}
