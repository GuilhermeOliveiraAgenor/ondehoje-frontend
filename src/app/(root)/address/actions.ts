'use server'

import { fetchAddress } from '@/modules/address/services/fetch-address'

export async function getAddressesAction() {
  try {
    const { address } = await fetchAddress()

    return {
      success: true,
      data: address,
    }
  } catch (error) {
    console.error('[GET_ADDRESS_ACTION_ERROR]', error)
    return {
      success: false,
      data: [],
      error: 'Falha ao buscar endereço.',
    }
  }
}
