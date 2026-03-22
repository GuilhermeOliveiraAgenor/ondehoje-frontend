'use server'

import { getProfile } from '@/modules/user/services/get-profile'

export async function getProfileAction() {
  try {
    const { client } = await getProfile()

    return {
      success: true,
      data: client,
    }
  } catch (error) {
    console.error('[GET_PROFILE_ACTION_ERROR]', error)
    return {
      success: false,
      data: [],
      error: 'Falha ao buscar empresas.',
    }
  }
}
