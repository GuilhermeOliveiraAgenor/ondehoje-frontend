'use server'

import { getPaymentByCheckoutId } from '@/modules/payment/services/get-payment-by-checkout-id'

export async function getPaymentByCheckoutIdAction(checkoutId: string) {
  try {
    const { payment } = await getPaymentByCheckoutId({ checkoutId })

    return {
      success: true,
      data: payment,
    }
  } catch (error) {
    console.error('[GET_PAYMENT_BY_CHECKOUT_ID_ACTION_ERROR]', error)
    return {
      success: false,
      data: null,
      error: 'Falha ao buscar pagamento.',
    }
  }
}
