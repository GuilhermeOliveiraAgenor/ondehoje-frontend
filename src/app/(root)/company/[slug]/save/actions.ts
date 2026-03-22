import z from 'zod'

import { editCompany } from '@/modules/company/services/edit-company'
import { informationSchema } from '@/modules/information/schemas/information-schema'

export const editCompanySchema = z.object({
  id: z.uuid('ID da empresa não informado'),
  addressId: z.uuid({ error: 'Selecione o endereço' }),
  name: z.string().min(1, 'Nome é obrigatório'),
  socialName: z.string().min(1, 'Nome Social da empresa é obrigatório'),
  cnpj: z.string().min(1, 'CNPJ é obrigatório'),
  informations: z.preprocess((val) => {
    if (typeof val === 'string') {
      try {
        return JSON.parse(val)
      } catch {
        return []
      }
    }
    return val
  }, z.array(informationSchema)),
  imagesIds: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return []

      try {
        const parsed = JSON.parse(val)

        if (!Array.isArray(parsed)) return []

        return parsed.filter((x) => typeof x === 'string')
      } catch (e) {
        console.error('Erro ao fazer JSON.parse(imagesIds):', e)
        return []
      }
    }),
  documentsIds: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return []

      try {
        const parsed = JSON.parse(val)

        if (!Array.isArray(parsed)) return []

        return parsed.filter((x) => typeof x === 'string')
      } catch (e) {
        console.error('Erro ao fazer JSON.parse(documentsIds):', e)
        return []
      }
    }),
})

export async function editCompanyAction(data: FormData) {
  console.log('[EDIT_COMPANY_ACTION]', Object.fromEntries(data))
  const result = editCompanySchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    console.log(
      '[EDIT_COMPANY_ACTION_VALIDATION_ERROR]',
      result.error.flatten().fieldErrors,
    )
    const errors = z.treeifyError(result.error)

    return { success: false, message: null, errors }
  }

  try {
    await editCompany({
      ...result.data,
      document: result.data.cnpj,
    })
  } catch (error) {
    console.error('[EDIT_COMPANY_ACTION_ERROR]', error)
    const message =
      error instanceof Error ? error.message : 'Erro ao salvar empresa.'

    return {
      success: false,
      message: message,
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Empresa salva com sucesso!',
    errors: null,
  }
}
