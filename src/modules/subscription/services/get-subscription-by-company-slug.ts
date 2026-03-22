import { api } from '@/lib/api'

import { Subscription } from '../types/subscription'

interface GetSubscriptionByCompanySlugRequest {
  slug: string
}

interface GetSubscriptionByCompanySlugResponse {
  subscription: Subscription
}

export async function getSubscriptionByCompanySlug({
  slug,
}: GetSubscriptionByCompanySlugRequest) {
  const result = await api<GetSubscriptionByCompanySlugResponse>(
    `/subscriptions/company/${slug}`,
  )

  return result
}
