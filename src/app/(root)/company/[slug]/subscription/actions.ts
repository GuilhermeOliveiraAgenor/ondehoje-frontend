'use server'

import {
  fetchPaymentsBySubscriptionId,
  FetchPaymentsBySubscriptionIdRequest,
} from '@/modules/payment/services/fetch-payments-by-subscription-id'
import { getSubscriptionByCompanySlug } from '@/modules/subscription/services/get-subscription-by-company-slug'

export async function getSubscriptionByCompanySlugAction({
  slug,
}: {
  slug: string
}) {
  try {
    const { subscription } = await getSubscriptionByCompanySlug({
      slug,
    })

    return {
      success: true,
      data: subscription,
    }
  } catch (error) {
    console.error('[GET_SUBSCRIPTION_BY_COMPANY_SLUG_ACTION_ERROR]', error)
    return {
      success: false,
      data: null,
      error: 'Falha ao buscar assinatura.',
    }
  }
}

export async function fetchPaymentsBySubscriptionIdAction({
  subscriptionId,
}: FetchPaymentsBySubscriptionIdRequest) {
  try {
    const { payments } = await fetchPaymentsBySubscriptionId({
      subscriptionId,
    })

    return {
      success: true,
      data: payments,
    }
  } catch (error) {
    console.error('[GET_PAYMENTS_BY_SUBSCRIPTION_ID_ACTION_ERROR]', error)
    return {
      success: false,
      data: [],
      error: 'Falha ao buscar pagamentos da assinatura.',
    }
  }
}
