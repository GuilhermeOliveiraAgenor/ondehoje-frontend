'use server'

import { renewSubscription } from '../services/renew-subscription'

export async function renewSubscriptionAction(data: FormData) {
  const id = data.get('id') as string

  try {
    await renewSubscription(id)
  } catch (error) {
    console.error('[RENEW_SUBSCRIPTION_ACTION_ERROR]', error)

    const message =
      error instanceof Error ? error.message : 'Erro ao renovar assinatura.'

    return {
      success: false,
      message: message,
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Renovação de assinatura realizada com sucesso.',
    errors: null,
  }
}
