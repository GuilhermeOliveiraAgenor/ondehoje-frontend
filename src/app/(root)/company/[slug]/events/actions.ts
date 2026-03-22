'use server'

import { getCurrentCompany } from '@/auth/auth'
import { fetchEventsByCompany } from '@/modules/event/services/fetch-events-by-company'

export async function getEventsByCompanyAction() {
  try {
    const slug = await getCurrentCompany()

    if (!slug) {
      return {
        success: false,
        data: [],
        error: 'Empresa não encontrada.',
      }
    }

    const { events } = await fetchEventsByCompany(slug)

    return {
      success: true,
      data: events,
    }
  } catch (error) {
    console.error('[GET_EVENTS_BY_COMPANY_ACTION_ERROR]', error)
    return {
      success: false,
      data: [],
      error: 'Falha ao buscar eventos da empresa.',
    }
  }
}
