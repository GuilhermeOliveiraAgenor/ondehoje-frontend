import { getAddressesAction } from '@/app/(root)/address/actions'
import { getCategoriesAction } from '@/app/(root)/event/actions'

import { getEventsByCompanyAction } from './actions'
import { EventsList } from './events-list'

export default async function EventsPage() {
  const { data: events } = await getEventsByCompanyAction()
  const { data: addresses } = await getAddressesAction()
  const { data: categories } = await getCategoriesAction()

  return (
    <EventsList events={events} addresses={addresses} categories={categories} />
  )
}
