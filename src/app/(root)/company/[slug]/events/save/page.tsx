import { getAddressesAction } from '@/app/(root)/address/actions'
import { getCategoriesAction } from '@/app/(root)/event/actions'

import { EventForm } from './event-form'

export default async function SaveEventPage() {
  const { data: addresses } = await getAddressesAction()
  const { data: categories } = await getCategoriesAction()

  return <EventForm addresses={addresses} categories={categories} />
}
