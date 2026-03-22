'use server'

import { fetchCompanies } from '@/modules/company/services/fetch-companies'
import { fetchCompaniesForUser } from '@/modules/company/services/fetch-company-for-user'

interface FetchCompaniesRequest {
  latitude?: number
  longitude?: number
}

export async function fetchCompaniesForUserAction({
  latitude,
  longitude,
}: FetchCompaniesRequest) {
  try {
    const { companies } = await fetchCompaniesForUser({
      latitude,
      longitude,
    })

    return {
      success: true,
      data: companies,
    }
  } catch (error) {
    console.error('[FETCH_COMPANIES_FOR_USER_ACTION_ERROR]', error)

    return {
      success: false,
      data: [],
      error: 'Falha ao buscar empresas.',
    }
  }
}

export async function fetchCompaniesAction({
  latitude,
  longitude,
}: FetchCompaniesRequest) {
  try {
    const { companies } = await fetchCompanies({
      latitude,
      longitude,
    })

    return {
      success: true,
      data: companies,
    }
  } catch (error) {
    console.error('[FETCH_COMPANIES_ACTION_ERROR]', error)

    return {
      success: false,
      data: [],
      error: 'Falha ao buscar empresas.',
    }
  }
}
