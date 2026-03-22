import { isAuthenticated } from '@/auth/auth'

import {
  fetchEventsAction,
  fetchEventsForUserAction,
  getCategoriesAction,
} from './event/actions'
import { EventsList } from './event/events-list'

export default async function Home() {
  const authenticated = await isAuthenticated()

  const { data: categories } = await getCategoriesAction()

  const { data: publicEvents } = await fetchEventsAction({
    latitude: undefined,
    longitude: undefined,
  })

  if (!authenticated) {
    return (
      <EventsList
        categories={categories}
        initialEvents={publicEvents}
        isAuthenticated={authenticated}
      />
    )
  }

  const { data: eventsForUser } = await fetchEventsForUserAction({
    latitude: undefined,
    longitude: undefined,
  })

  return (
    <EventsList
      categories={categories}
      initialEvents={eventsForUser}
      isAuthenticated={authenticated}
    />
  )
}
