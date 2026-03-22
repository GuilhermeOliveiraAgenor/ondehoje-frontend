import { isAuthenticated } from '@/auth/auth'
import { CompanyDetails } from '@/modules/company/types/company-details'
import { EventLocation } from '@/modules/event/types/event-location'

import { fetchCompaniesForUserAction } from '../establishment/actions'
import { fetchEventsForUserAction } from '../event/actions'
import { FavoriteList } from './favorite-list'

export default async function FavoritePage() {
  const authenticated = await isAuthenticated()

  let events: EventLocation[] = []
  let companies: CompanyDetails[] = []

  if (authenticated) {
    const eventsResult = await fetchEventsForUserAction({
      latitude: undefined,
      longitude: undefined,
    })
    events = eventsResult.data

    const companiesResult = await fetchCompaniesForUserAction({
      latitude: undefined,
      longitude: undefined,
    })
    companies = companiesResult.data
  }

  return (
    <FavoriteList
      events={events}
      companies={companies}
      isAuthenticated={authenticated}
    />
  )
}
