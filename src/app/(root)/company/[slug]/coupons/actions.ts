'use server'

import { getCurrentCompany } from '@/auth/auth'
import { fetchCouponsByCompany } from '@/modules/coupon/services/fetch-coupons-by-company'

export async function fetchCouponsByCompanyAction() {
  try {
    const slug = await getCurrentCompany()

    if (!slug) {
      return {
        success: false,
        data: [],
        error: 'Empresa não encontrada.',
      }
    }

    const { coupons } = await fetchCouponsByCompany(slug)
    console.log(coupons)

    return {
      success: true,
      data: coupons,
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
