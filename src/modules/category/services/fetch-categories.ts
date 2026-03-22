import { api } from '@/lib/api'

import { Category } from '../types/category'

interface FetchCategoriesResponse {
  categories: Category[]
}

export async function fetchCategories() {
  const result = await api<FetchCategoriesResponse>('/categories')

  return result
}
