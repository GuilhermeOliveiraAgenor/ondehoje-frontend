import { api } from '@/lib/api'

import { Favorite } from '../types/my-favorite-events'

interface toggleFavoriteRequest {
  eventId?: string
  companyId?: string
}

export async function toggleFavorite({
  eventId,
  companyId,
}: toggleFavoriteRequest) {
  console.log('[TOGGLE_FAVORITE_SERVICE]', { eventId, companyId })
  await api('/favorites/toggle', {
    method: 'PATCH',
    body: JSON.stringify({
      eventId,
      companyId,
    }),
  })
}
