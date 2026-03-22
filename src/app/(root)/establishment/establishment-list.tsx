'use client'
import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { CardCompany } from '@/modules/company/components/card-company'
import type { CompanyDetails } from '@/modules/company/types/company-details'

import { fetchCompaniesAction, fetchCompaniesForUserAction } from './actions'
import { CompanyCardSkeleton } from './loading'

type establishmentlistProps = {
  initialCompanies: CompanyDetails[]
  isAuthenticated: boolean
}

export function EstablishmentList({
  initialCompanies,
  isAuthenticated,
}: establishmentlistProps) {
  const [companies, setCompanies] = useState<CompanyDetails[]>(initialCompanies)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [error] = useState<string | null>(null)
  const [loadingLocation, setLoadingLocation] = useState(false)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          const action = isAuthenticated
            ? fetchCompaniesForUserAction
            : fetchCompaniesAction

          const { data } = await action({ latitude, longitude })

          if (data && data.length > 0) {
            setCompanies(data)
            toast.success('Eventos atualizados com sua localização!')
          }
        } catch (err) {
          console.error('Erro ao buscar eventos por localização', err)
        } finally {
          setLoadingLocation(false)
        }
      },
      (error) => {
        console.log('Usuário negou localização ou erro:', error)
        setLoadingLocation(false)
      },
    )
  }, [isAuthenticated])

  const filteredCompanies = useMemo(() => {
    if (!searchQuery) {
      return companies
    }

    return companies.filter(
      (company) =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.address.neighborhood
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        company.address.city.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [companies, searchQuery])

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
            Descubra novos estabelecimentos.
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

      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loadingLocation
          ? Array.from({ length: 8 }).map((_, i) => (
              <CompanyCardSkeleton key={i} />
            ))
          : filteredCompanies.map((company, index) => (
              <CardCompany
                key={`${company.id}-${index}`}
                company={company}
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
