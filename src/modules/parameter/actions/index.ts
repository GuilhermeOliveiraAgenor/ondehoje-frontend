'use server'

import { getParameterByKey } from '../services/get-parameter-by-key'

export async function getParameterByKeyAction(key: string) {
  try {
    const { parameter } = await getParameterByKey(key)

    if (!parameter) {
      return {
        success: false,
        data: null,
        error: 'Parâmetro não encontrado.',
      }
    }

    return {
      success: true,
      data: parameter,
    }
  } catch (error) {
    console.error('[GET_PARAMETER_BY_KEY_ACTION_ERROR]', error)
    return {
      success: false,
      data: null,
      error: 'Falha ao buscar parâmetro.',
    }
  }
}
