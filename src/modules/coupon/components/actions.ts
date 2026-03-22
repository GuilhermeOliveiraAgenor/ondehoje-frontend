import z from 'zod'

import { createCoupon } from '../services/create-coupon'
import { editCoupon } from '../services/edit-coupon'

const upsertCouponSchema = z.object({
  eventId: z.string().uuid('Selecione o evento'),
  name: z.string('Informe o nome do cupom'),
  description: z.string('Informe a descrição do cupom'),
  expiresAt: z
    .union([z.date(), z.string()])
    .transform((val) => (typeof val === 'string' ? new Date(val) : val))
    .refine((date) => !isNaN(date.getTime()), {
      message: 'Digite uma data válida',
    }),
})

const editCouponSchema = z.object({
  id: z.string(),
  name: z.string('Informe o nome do cupom'),
  description: z.string('Informe a descrição do cupom'),
  expiresAt: z.coerce.date('Informe uma data válida'),
})

export async function createCouponAction(data: FormData) {
  const result = upsertCouponSchema.safeParse(Object.fromEntries(data))
  if (!result.success) {
    const errors = z.treeifyError(result.error)

    return { success: false, message: null, errors }
  }

  try {
    await createCoupon(result.data)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Erro ao criar cupom.'

    return {
      success: false,
      message: message,
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Successfully saved the coupon.',
    errors: null,
  }
}

export async function editCouponAction(data: FormData) {
  const result = editCouponSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = z.treeifyError(result.error)

    return { success: false, message: null, errors }
  }

  try {
    await editCoupon(result.data)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Erro ao editar cupom.'

    return {
      success: false,
      message: message,
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Successfully edit the coupon.',
    errors: null,
  }
}
