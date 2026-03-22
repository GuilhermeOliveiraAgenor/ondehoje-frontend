import z from 'zod'

import { getCurrentCompany } from '@/auth/auth'

import { approveAdvertisement } from '../services/approve-advertisement'
import { createAdvertisement } from '../services/create-advertisement'
import { getPaymentByAdvertisementId } from '../services/get-payment-by-advertisement-id'
import { rejectAdvertisement } from '../services/reject-advertisement'

const advertisementSchema = z.object({
  companySlug: z.string(),
  eventSlug: z.string().optional(),
  days: z.coerce.number(),
})

export async function createAdvertisementAction(data: FormData) {
  const currentCompany = await getCurrentCompany()

  if (!currentCompany) {
    return {
      success: false,
      message: 'Empresa não encontrada.',
      errors: null,
    }
  }

  data.set('companySlug', currentCompany)
  const result = advertisementSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = z.treeifyError(result.error)

    return { success: false, message: null, errors }
  }

  const { eventSlug, companySlug, days } = result.data

  try {
    await createAdvertisement({
      eventSlug,
      companySlug,
      days,
    })
  } catch (error) {
    console.error('[CREATE_ADVERTISEMENT_ACTION_ERROR]', error)

    const message =
      error instanceof Error ? error.message : 'Erro ao criar anúncio.'

    return {
      success: false,
      message: message,
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Successfully saved the advertisement.',
    errors: null,
  }
}

export async function getAdvertisementPaymentsAction(advertisementId: string) {
  try {
    const { payments } = await getPaymentByAdvertisementId(advertisementId)

    return {
      success: true,
      data: payments,
    }
  } catch (error) {
    console.error('[GET_ADVERTISEMENT_PAYMENTS_ACTION_ERROR]', error)

    return {
      success: false,
      data: [],
      error: 'Falha ao buscar listagem de pagamentos.',
    }
  }
}

export async function approveAdvertisementAction(data: FormData) {
  const advertisementId = data.get('advertisementId') as string

  try {
    await approveAdvertisement({ advertisementId })
  } catch (error) {
    console.error('[APPROVE_ADVERTISEMENT_ACTION_ERROR]', error)

    const message =
      error instanceof Error ? error.message : 'Erro ao aprovar anúncio.'

    return {
      success: false,
      message: message,
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Anúncio aprovado com sucesso.',
    errors: null,
  }
}

const rejectAdvertisementSchema = z.object({
  advertisementId: z.uuid('ID do anúncio inválido.'),
  rejectedReason: z.string(),
})

export async function rejectAdvertisementAction(data: FormData) {
  const result = rejectAdvertisementSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    console.error(
      '[REJECT_ADVERTISEMENT_VALIDATION_ERROR]',
      result.error.flatten().fieldErrors,
    )
    const errors = z.treeifyError(result.error)

    return { success: false, message: null, errors }
  }

  try {
    await rejectAdvertisement(result.data)
  } catch (error) {
    console.error('[REJECT_ADVERTISEMENT_ACTION_ERROR]', error)

    const message =
      error instanceof Error ? error.message : 'Erro ao rejeitar anúncio.'

    return {
      success: false,
      message: message,
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Anúncio rejeitado com sucesso.',
    errors: null,
  }
}
