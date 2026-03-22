import { isAuthenticated } from '@/auth/auth'

import { fetchCompaniesAction, fetchCompaniesForUserAction } from './actions'
import { EstablishmentList } from './establishment-list'

export default async function EstablishmentPage() {
  const authenticated = await isAuthenticated()

  const { data: publicCompanies } = await fetchCompaniesAction({
    latitude: undefined,
    longitude: undefined,
  })

  if (!authenticated) {
    return (
      <EstablishmentList
        initialCompanies={publicCompanies}
        isAuthenticated={authenticated}
      />
    )
  }

  const { data: companiesForUser } = await fetchCompaniesForUserAction({
    latitude: undefined,
    longitude: undefined,
  })

  return (
    <EstablishmentList
      initialCompanies={companiesForUser}
      isAuthenticated={authenticated}
    />
  )
}
