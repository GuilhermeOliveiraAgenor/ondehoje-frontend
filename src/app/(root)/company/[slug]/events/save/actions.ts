import z from 'zod'

import { getCurrentCompany } from '@/auth/auth'
import { createEvent } from '@/modules/event/services/create-event'
import { informationSchema } from '@/modules/information/schemas/information-schema'

export const createEventSchema = z.object({
  addressId: z.uuid({ error: 'Selecione o endereço' }),
  categoryId: z.uuid({ error: 'Selecione o endereço' }),
  name: z
    .string('Nome do evento é obrigatório')
    .min(1, 'O evento deve ter um nome maior que 1 caractere'),
  description: z
    .string('Descrição do evento é obrigatória')
    .min(30, 'A descrição deve ser maior que 30 caractere'),
  startDate: z.coerce.date({ error: 'Data de início é obrigatória' }),
  endDate: z.coerce.date({ error: 'Data de término é obrigatória' }),
  imagesIds: z
    .string()
    .optional()
    .transform((val) =>
      val
        ? val
            .split(',')
            .map((id) => id.trim())
            .filter((id) => id.length > 0)
        : [],
    ),
  informations: z
    .preprocess((val) => {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val)
        } catch {
          return []
        }
      }
      return val
    }, z.array(informationSchema))
    .optional(),
})

export async function createEventAction(data: FormData) {
  console.log('[CREATE_EVENT_ACTION]', Object.fromEntries(data))
  const companySlug = await getCurrentCompany()

  if (!companySlug) {
    return {
      success: false,
      message: 'Empresa não encontrada.',
      errors: null,
    }
  }

  const result = createEventSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    console.log('[CREATE_EVENT_ACTION_VALIDATION_ERROR]', result.error)
    const errors = z.treeifyError(result.error)

    return { success: false, message: null, errors }
  }

  try {
    await createEvent({ companySlug, ...result.data })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Erro ao criar evento.'

    return {
      success: false,
      message: message || 'Erro ao criar evento.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Successfully saved the event.',
    errors: null,
  }
}
