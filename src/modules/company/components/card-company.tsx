'use client'

import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { startTransition } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toggleFavoriteAction } from '@/modules/event/components/actions'

import type { CompanyDetails } from '../types/company-details'

interface CardCompanyProps {
  company: CompanyDetails
  isAuthenticated: boolean
}

export function CardCompany({ company, isAuthenticated }: CardCompanyProps) {
  const { name, address, isFavorited } = company

  const router = useRouter()

  const coverImageUrl = company.images[0].url

  const handleNavigateToDetails = () => {
    router.push(`/establishment/${company.slug}`)
  }

  const toggleFavorite = () => {
    startTransition(async () => {
      const result = await toggleFavoriteAction(undefined, company.id)
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
        <div className="relative z-10 flex w-full items-start justify-end gap-2">
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
                    ? 'fill-red-500 text-red-500'
                    : 'text-muted-foreground hover:text-red-500/80',
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
            <p className="text-muted-foreground mt-2 line-clamp-2 text-xs font-light sm:text-sm">
              {address.neighborhood}, {address.city} - {address.state}
            </p>
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
