import z from 'zod'

import { informationSchema } from '@/modules/information/schemas/information-schema'

export const editEventBodySchema = z.object({
  id: z.uuid('ID do evento inválido'),
  addressId: z.uuid('ID do endereço inválido').optional(),
  categoryId: z.uuid('ID da categoria inválido').optional(),
  name: z
    .string()
    .min(3, 'Nome do evento deve ter no mínimo 3 caracteres')
    .optional(),
  description: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
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
  imagesIds: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return []

      try {
        const parsed = JSON.parse(val)

        // garantir que é array
        if (!Array.isArray(parsed)) return []

        // garantir que cada item é string
        return parsed.filter((x) => typeof x === 'string')
      } catch (e) {
        console.error('Erro ao fazer JSON.parse(imagesIds):', e)
        return []
      }
    }),
})
