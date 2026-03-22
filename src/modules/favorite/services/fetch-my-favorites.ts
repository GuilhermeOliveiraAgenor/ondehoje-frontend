import { api } from '@/lib/api'

import { Favorite } from '../types/my-favorite-events'

interface FetchMyFavoritesResponse {
  favorites: Favorite[]
}

export async function fetchMyFavorites() {
  const result = await api<FetchMyFavoritesResponse>('/favorites')

  return result
}
