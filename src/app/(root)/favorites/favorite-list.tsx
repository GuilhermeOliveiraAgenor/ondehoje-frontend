'use client'

import { Heart, Search, UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Fragment, useMemo, useState } from 'react'

import { SiteHeader } from '@/components/nav/site-header'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { Input } from '@/components/ui/input'
import { CardCompany } from '@/modules/company/components/card-company'
import type { CompanyDetails } from '@/modules/company/types/company-details'
import { CardEvent } from '@/modules/event/components/card-event'
import type { EventLocation } from '@/modules/event/types/event-location'

type FavoriteListProps = {
  events: EventLocation[]
  companies: CompanyDetails[]
  isAuthenticated: boolean
}

export function FavoriteList({
  events,
  isAuthenticated,
  companies,
}: FavoriteListProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Filtrar apenas os favoritos
  const favoriteEvents = useMemo(() => {
    if (!events) return []
    return events.filter((event) => event.isFavorited === true)
  }, [events])

  const favoriteCompanies = useMemo(() => {
    if (!companies) return []
    return companies.filter((company) => company.isFavorited === true)
  }, [companies])

  // Aplicar busca nos favoritos
  const filteredEvents = useMemo(() => {
    if (!searchQuery) return favoriteEvents

    return favoriteEvents.filter((event) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [favoriteEvents, searchQuery])

  const filteredCompanies = useMemo(() => {
    if (!searchQuery) return favoriteCompanies

    return favoriteCompanies.filter((company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [favoriteCompanies, searchQuery])

  const hasFavorites = favoriteEvents.length > 0 || favoriteCompanies.length > 0
  const hasFilteredResults =
    filteredEvents.length > 0 || filteredCompanies.length > 0

  function handleLogin() {
    router.push('/auth/sign-in')
  }

  function handleRegister() {
    router.push('/auth/sign-in')
  }

  // Tela de não autenticado
  if (!isAuthenticated) {
    return (
      <Fragment>
        <div className="from-background to-muted/20 min-h-screen bg-linear-to-b">
          <SiteHeader title="Meus favoritos" />

          <section className="px-4 py-4 sm:px-6 lg:py-8">
            <div className="mx-auto max-w-7xl">
              <div className="bg-muted/30 flex min-h-screen flex-col items-center justify-center rounded-3xl border-2 border-dashed p-12 text-center">
                <div className="bg-muted/50 mb-6 rounded-full p-5 sm:p-8">
                  <UserPlus className="text-muted-foreground h-12 w-12 sm:h-20 sm:w-20" />
                </div>
                <h2 className="mb-3 text-xl font-bold sm:text-2xl">
                  Autenticação Necessária
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md text-sm leading-relaxed sm:text-base">
                  Para salvar e visualizar seus eventos e estabelecimentos
                  favoritos, você precisa estar autenticado. Crie uma conta ou
                  faça login para continuar.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button size="lg" className="min-w-40" onClick={handleLogin}>
                    Fazer Login
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="min-w-40 bg-transparent"
                    onClick={handleRegister}
                  >
                    Criar Conta
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <SiteHeader title="Meus favoritos" />

      <div className="grid w-full grid-cols-1 gap-4 px-4 md:px-6 lg:px-10">
        {/* Campo de busca */}
        <Input
          type="text"
          placeholder="Buscar favoritos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />

        {/* Estado: Nenhum favorito salvo */}
        {!hasFavorites ? (
          <section className="py-4 lg:py-8">
            <div className="mx-auto max-w-7xl">
              <div className="bg-muted/30 flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed p-12 text-center">
                <div className="bg-muted/50 mb-6 rounded-full p-8">
                  <Heart className="text-muted-foreground h-20 w-20" />
                </div>
                <h2 className="mb-3 text-2xl font-bold">
                  Nenhum favorito ainda
                </h2>
                <p className="text-muted-foreground max-w-md text-base">
                  Você ainda não possui favoritos salvos. Explore os eventos e
                  estabelecimentos e adicione alguns! ❤️
                </p>
              </div>
            </div>
          </section>
        ) : !hasFilteredResults ? (
          /* Estado: Nenhum resultado na busca */
          <section className="py-4 lg:py-8">
            <div className="mx-auto max-w-7xl">
              <div className="bg-muted/30 flex min-h-[300px] flex-col items-center justify-center rounded-3xl border-2 border-dashed p-12 text-center">
                <div className="bg-muted/50 mb-6 rounded-full p-8">
                  <Search className="text-muted-foreground h-16 w-16" />
                </div>
                <h2 className="mb-3 text-2xl font-bold">
                  Nenhum favorito encontrado
                </h2>
                <p className="text-muted-foreground max-w-md text-base">
                  Não encontramos favoritos que correspondam à sua busca. Tente
                  outros termos.
                </p>
              </div>
            </div>
          </section>
        ) : (
          /* Listagem de favoritos */
          <div className="space-y-8 pb-12 lg:pb-16">
            {/* Seção de Eventos */}
            {filteredEvents.length > 0 && (
              <section>
                <div className="mb-6 flex items-end justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                      Eventos Favoritos
                    </h2>
                    <p className="text-muted-foreground mt-2 text-sm">
                      {filteredEvents.length}{' '}
                      {filteredEvents.length === 1
                        ? 'evento favorito'
                        : 'eventos favoritos'}
                    </p>
                  </div>
                </div>
                <Carousel
                  opts={{
                    align: 'start',
                    loop: false,
                  }}
                  className="w-full"
                >
                  <CarouselContent>
                    {filteredEvents.map((event) => (
                      <CarouselItem
                        key={event.id}
                        className="pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3 xl:basis-1/4"
                      >
                        <CardEvent event={event} isAuthenticated={true} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </section>
            )}

            {/* Seção de Estabelecimentos */}
            {filteredCompanies.length > 0 && (
              <section>
                <div className="mb-6 flex items-end justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                      Estabelecimentos Favoritos
                    </h2>
                    <p className="text-muted-foreground mt-2 text-sm">
                      {filteredCompanies.length}{' '}
                      {filteredCompanies.length === 1
                        ? 'estabelecimento favorito'
                        : 'estabelecimentos favoritos'}
                    </p>
                  </div>
                </div>
                <Carousel
                  opts={{
                    align: 'start',
                    loop: false,
                  }}
                  className="w-full"
                >
                  <CarouselContent>
                    {filteredCompanies.map((company) => (
                      <CarouselItem
                        key={company.id}
                        className="pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3 xl:basis-1/4"
                      >
                        <CardCompany
                          key={company.id}
                          company={company}
                          isAuthenticated={true}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </section>
            )}
          </div>
        )}
      </div>
    </Fragment>
  )
}
