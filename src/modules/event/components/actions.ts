'use server'

import { revalidatePath } from 'next/cache'
import z from 'zod'

import { toggleFavorite } from '@/modules/favorite/services/patch-favorites'

import { editEventBodySchema } from '../schemas/edit-event'
import { editEvent } from '../services/edit-event'

export async function toggleFavoriteAction(
  eventId?: string,
  companyId?: string,
) {
  try {
    if (eventId && companyId) {
      return {
        success: false,
        error: 'Forneça apenas um ID: evento ou empresa.',
      }
    }

    if (eventId) {
      await toggleFavorite({
        eventId,
      })
    } else if (companyId) {
      await toggleFavorite({
        companyId,
      })
    } else {
      return {
        success: false,
        error: 'Um ID (evento ou empresa) deve ser fornecido.',
      }
    }

    revalidatePath('/favorites')
    revalidatePath('/')

    return {
      success: true,
    }
  } catch (error) {
    console.error('[TOGGLE_FAVORITE_ACTION_ERROR]', error)
    return {
      success: false,
      error: 'Falha ao atualizar favorito.',
    }
  }
}

export async function editEventAction(data: FormData) {
  console.log('[EDIT_EVENT_ACTION]', Object.fromEntries(data))
  const result = editEventBodySchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    console.error(
      '[EDIT_EVENT_VALIDATION_ERROR]',
      result.error.flatten().fieldErrors,
    )
    const errors = z.treeifyError(result.error)

    return { success: false, message: null, errors }
  }

  try {
    await editEvent(result.data)
  } catch (error) {
    console.error('[EDIT_EVENT_ACTION_ERROR]', error)

    const message =
      error instanceof Error ? error.message : 'Erro ao editar evento.'

    return {
      success: false,
      message: message,
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Evento salvo com sucesso.',
    errors: null,
  }
}
