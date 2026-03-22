'use client'

import { Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { Category } from '@/modules/category/types/category'
import { CardEvent } from '@/modules/event/components/card-event'
import { EventLocation } from '@/modules/event/types/event-location'

import { EventCardSkeleton } from '../loading'
import { fetchEventsAction, fetchEventsForUserAction } from './actions'

type EventsListProps = {
  categories: Category[]
  initialEvents: EventLocation[]
  isAuthenticated: boolean
}

export function EventsList({
  categories,
  initialEvents,
  isAuthenticated,
}: EventsListProps) {
  const [events, setEvents] = useState<EventLocation[]>(initialEvents)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [error] = useState<string | null>(null)
  const [loadingLocation, setLoadingLocation] = useState(false)

  const activeCategories = useMemo(() => {
    const usedCategoryNames = new Set(
      events.map((event) => event.category.name),
    )

    return categories.filter((category) => usedCategoryNames.has(category.name))
  }, [categories, events])

  const fetchingRef = useRef(false)

  useEffect(() => {
    // Se não tiver geolocation no navegador, paramos
    if (!('geolocation' in navigator)) return

    const successCallback = async (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords

      // Trava de segurança no Front
      if (!latitude && !longitude) return

      if (fetchingRef.current) return
      fetchingRef.current = true

      // Opcional: Mostrar loading apenas se quiser bloquear a tela
      // setLoadingLocation(true)

      try {
        const action = isAuthenticated
          ? fetchEventsForUserAction
          : fetchEventsAction

        const { data } = await action({
          latitude: Number(latitude),
          longitude: Number(longitude),
        })

        if (data && data.length > 0) {
          setEvents(data)
          // toast.success('Localização atualizada!') // Opcional, as vezes é chato pro usuário
        }
      } catch (err) {
        console.error('Erro location', err)
      } finally {
        setLoadingLocation(false)
        fetchingRef.current = false
      }
    }

    navigator.geolocation.getCurrentPosition(
      successCallback,
      (err) => {
        console.log('Erro geo', err)
        setLoadingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000, // Diminua o timeout para não ficar pendurado
        maximumAge: 0,
      },
    )
  }, [isAuthenticated])

  const filteredEvents = useMemo(() => {
    if (!selectedCategory && !searchQuery) {
      return events
    }

    let filtered = events

    if (selectedCategory) {
      filtered = filtered.filter(
        (event) => event.category.name === selectedCategory,
      )
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.address.neighborhood
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.address.city
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          event.category.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          event.company.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }
    return filtered
  }, [selectedCategory, events, searchQuery])

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category)
  }

  return (
    <div>
      <header className="bg-primary grid px-1 py-2">
        <div className="grid shrink-0 items-center gap-2 p-2">
          <SidebarTrigger className="text-card -ml-1" />
        </div>
        <div className="text-card grid gap-2 text-center">
          <h1 className="text-4xl leading-tight font-bold tracking-tight sm:text-5xl">
            Onde Hoje?
          </h1>
          <p className="text-sm font-light opacity-90">
            Descubra os melhores eventos.
          </p>
        </div>
      </header>

      <div className="px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar eventos por nome, local ou categoria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-gray-300 bg-white py-3 pr-4 pl-11 text-sm shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="grid">
        <nav className="border-border bg-background flex gap-8 border-b px-4">
          {activeCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className={`py-4 text-sm font-medium transition-colors ${
                selectedCategory === category.name
                  ? 'text-primary border-primary border-b-2'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {category.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loadingLocation
          ? Array.from({ length: 8 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))
          : filteredEvents.map((event, index) => (
              <CardEvent
                key={`${event.id}-${index}`}
                event={event}
                isAuthenticated={isAuthenticated}
              />
            ))}
      </div>

      <div>
        {error && <div className="mt-4 text-center text-red-600">{error}</div>}
      </div>
    </div>
  )
}
