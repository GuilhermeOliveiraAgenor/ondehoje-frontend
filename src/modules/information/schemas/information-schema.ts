import z from 'zod'

const emptyToUndefined = z
  .string()
  .nullable()
  .optional()
  .transform((val) => {
    if (val === null || val?.trim() === '') return undefined
    return val
  })

const baseInformationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Nome é obrigatório'),

  phoneNumber: emptyToUndefined,
  email: emptyToUndefined,
  description: emptyToUndefined,
})

export const informationSchema = baseInformationSchema.superRefine(
  (data, ctx) => {
    const hasPhone = !!data.phoneNumber
    const hasEmail = !!data.email
    const hasDescription = !!data.description

    // Se só phone estiver preenchido → phoneSchema
    if (hasPhone && !hasEmail && !hasDescription) {
      if (!data.phoneNumber) {
        ctx.addIssue({
          path: ['phoneNumber'],
          code: z.ZodIssueCode.custom,
          message: 'Número de telefone é obrigatório',
        })
      }
      return
    }

    // Se só email estiver preenchido → emailSchema
    if (hasEmail && !hasPhone && !hasDescription) {
      if (!z.string().email().safeParse(data.email).success) {
        ctx.addIssue({
          path: ['email'],
          code: z.ZodIssueCode.custom,
          message: 'Email inválido',
        })
      }
      return
    }

    // Se só description estiver preenchida → descriptionSchema
    if (hasDescription && !hasPhone && !hasEmail) {
      if (!data.description) {
        ctx.addIssue({
          path: ['description'],
          code: z.ZodIssueCode.custom,
          message: 'Descrição é obrigatória',
        })
      }
      return
    }

    // Se nenhum estiver preenchido
    if (!hasPhone && !hasEmail && !hasDescription) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Você deve preencher celular, email ou descrição',
      })
      return
    }

    // Se tiver mais de um tipo preenchido
    const filledCount = [hasPhone, hasEmail, hasDescription].filter(
      Boolean,
    ).length

    if (filledCount > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Somente um dos campos pode ser preenchido: phoneNumber, email ou description',
      })
    }
  },
)
