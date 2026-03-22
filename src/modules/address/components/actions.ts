'use server'

import { revalidatePath } from 'next/cache'
import z from 'zod'

import {
  createAddressBodySchema,
  editAddressBodySchema,
} from '../schemas/address-schema'
import { createAddress } from '../services/create-address'
import { editAddress } from '../services/edit-address'

export async function createAddressAction(data: FormData) {
  const formData = Object.fromEntries(data)

  const result = createAddressBodySchema.safeParse(formData)

  if (!result.success) {
    const errors = z.treeifyError(result.error)

    return { success: false, message: null, errors }
  }

  try {
    await createAddress(result.data)
  } catch (error) {
    console.error('[CREATE_ADDRESS_ACTION_ERROR]', error)
    const message =
      error instanceof Error ? error.message : 'Erro ao criar endereço.'

    return {
      success: false,
      message: message,
      errors: null,
    }
  }

  revalidatePath('/addresses')

  return {
    success: true,
    message: 'Endereço salvo com sucesso.',
    errors: null,
  }
}

export async function editAddressAction(data: FormData) {
  const formData = Object.fromEntries(data)

  const result = editAddressBodySchema.safeParse(formData)

  if (!result.success) {
    const errors = z.treeifyError(result.error)

    return { success: false, message: null, errors }
  }

  try {
    await editAddress(result.data)
  } catch (error) {
    console.error('[EDIT_ADDRESS_ACTION_ERROR]', error)

    const message =
      error instanceof Error ? error.message : 'Erro ao editar o endereço.'

    return {
      success: false,
      message: message,
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Endereço salvo com sucesso.',
    errors: null,
  }
}
