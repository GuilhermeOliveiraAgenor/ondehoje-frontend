import z from 'zod'

export const createAddressBodySchema = z.object({
  cep: z
    .string()
    .min(8, 'CEP deve ter 8 dígitos')
    .max(9, 'CEP inválido')
    .transform((value) => value.replace(/\D/g, '')),
  street: z.string().min(3, 'Rua é obrigatória'),
  neighborhood: z.string().min(3, 'Bairro é obrigatório'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  state: z
    .string()
    .min(2, 'UF deve ter 2 letras')
    .max(2, 'UF deve ter 2 letras'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  longitude: z.coerce.number('A longitude é obrigatória'),
  latitude: z.coerce.number('A latitude é obrigatória'),
})

export const editAddressBodySchema = createAddressBodySchema.extend({
  id: z.uuid('ID inválido'),
})
