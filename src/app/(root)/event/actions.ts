'use server'

import { fetchAddress } from '@/modules/address/services/fetch-address'
import { fetchCategories } from '@/modules/category/services/fetch-categories'
import { fetchEvents } from '@/modules/event/services/fetch-events'
import { fetchEventsForUser } from '@/modules/event/services/fetch-events-for-user'

export async function getCategoriesAction() {
  try {
    const { categories } = await fetchCategories()
    return {
      success: true,
      data: categories,
    }
  } catch (error) {
    console.error('[GET_CATEGORIES_ACTION_ERROR]', error)
    return {
      success: false,
      data: [],
      error: 'Falha ao buscar categorias.',
    }
  }
}

interface FetchEventsActionRequest {
  latitude?: number
  longitude?: number
}

export async function fetchEventsAction({
  latitude,
  longitude,
}: FetchEventsActionRequest) {
  try {
    const { events } = await fetchEvents({ latitude, longitude })

    return {
      success: true,
      data: events,
    }
  } catch (error) {
    console.error('[FETCH_EVENTS_ACTION_ERROR]', error)

    return {
      success: false,
      data: [],
      error: 'Falha ao buscar eventos.',
    }
  }
}

export async function fetchEventsForUserAction({
  latitude,
  longitude,
}: FetchEventsActionRequest) {
  try {
    const { events } = await fetchEventsForUser({ latitude, longitude })

    return {
      success: true,
      data: events,
    }
  } catch (error) {
    console.error('[FETCH_EVENTS_FOR_USER_ACTION_ERROR]', error)

    return {
      success: false,
      data: [],
      error: 'Falha ao buscar eventos.',
    }
  }
}

export async function getAddressAction() {
  try {
    const { address } = await fetchAddress()
    return {
      success: true,
      data: address,
    }
  } catch (error) {
    console.error('[GET_ADDRESS_ACTION_ERROR]', error)
    return {
      success: false,
      data: [],
      error: 'Falha ao buscar endereço.',
    }
  }
}
