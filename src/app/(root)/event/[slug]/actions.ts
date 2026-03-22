'use server'

import { fetchAdvertisementsByEventId } from '@/modules/advertisement/services/fetch-advertisements-by-event-id'
import { fetchCouponsByEvent } from '@/modules/coupon/services/fetch-coupons-by-event'
import { GetEventBySlug } from '@/modules/event/services/get-event-by-slug'
import { saveUserCoupon } from '@/modules/user-coupon/services/create-user-coupon'

export async function saveUserCouponAction(data: FormData) {
  const id = data.get('id') as string

  try {
    await saveUserCoupon({
      couponId: id,
    })
  } catch (error) {
    console.error('[SAVE_USER_COUPON_ACTION_ERROR]', error)

    const message =
      error instanceof Error ? error.message : 'Erro ao salvar cupom.'

    return {
      success: false,
      message: message,
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Cupom salvo com sucesso!',
    errors: null,
  }
}

export async function getEventAction(slug: string) {
  try {
    const { event } = await GetEventBySlug(slug)
    return {
      success: true,
      data: event,
    }
  } catch (error) {
    console.error('[GET_EVENT_ACTION_ERROR]', error)
    return {
      success: false,
      data: null,
      error: 'Falha ao buscar evento.',
    }
  }
}

export async function fetchCouponsByEventIdAction(id: string) {
  try {
    const { coupons } = await fetchCouponsByEvent(id)

    return {
      success: true,
      data: coupons,
    }
  } catch (error) {
    console.error('[GET_COUPONS_BY_EVENT_ID_ACTION_ERROR]', error)

    return {
      success: false,
      data: [],
      error: 'Falha ao buscar cupons.',
    }
  }
}

export async function fetchAdvertisementsByEventIdAction(eventId: string) {
  try {
    const { advertisements } = await fetchAdvertisementsByEventId({ eventId })

    return {
      success: true,
      data: advertisements,
    }
  } catch (error) {
    console.error('[FETCH_ADVERTISEMENTS_BY_EVENT_ID_ACTION_ERROR]', error)

    return {
      success: false,
      data: [],
      error: 'Falha ao buscar anúncios.',
    }
  }
}
