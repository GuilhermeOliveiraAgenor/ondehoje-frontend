import z from 'zod'

import { createCompany } from '@/modules/company/services/create-company'
import { informationSchema } from '@/modules/information/schemas/information-schema'

export const upsertCompanySchema = z.object({
  addressId: z.uuid({ error: 'Selecione o endereço' }),
  name: z.string().min(1, 'Nome é obrigatório'),
  socialName: z.string().min(1, 'Nome Social da empresa é obrigatório'),
  document: z.string().min(1, 'CNPJ é obrigatório'),
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
  documentsIds: z
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

export async function createCompanyAction(data: FormData) {
  const result = upsertCompanySchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = z.treeifyError(result.error)

    return { success: false, message: null, errors }
  }

  try {
    await createCompany(result.data)
  } catch (error) {
    console.error(error)
  }

  return {
    success: true,
    message: 'Successfully saved the organization.',
    errors: null,
  }
}
