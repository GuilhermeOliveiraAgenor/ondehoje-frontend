'use server'

import { fetchUserCoupons } from '@/modules/user-coupon/services/fetch-user-coupons'

export async function fetchUserCouponsAction() {
  try {
    const { userCoupons } = await fetchUserCoupons()

    return {
      success: true,
      data: userCoupons,
      errors: null,
    }
  } catch (error) {
    console.error('[FETCH_USER_COUPONS_ACTION_ERROR]', error)
    const message =
      error instanceof Error
        ? error.message
        : 'Erro ao recuperar cupons do usuário.'

    return {
      success: false,
      data: [],
      message: message,
      errors: null,
    }
  }
}
