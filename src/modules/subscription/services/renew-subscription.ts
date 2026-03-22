import { api } from '@/lib/api'

export async function renewSubscription(id: string) {
  const result = await api(`/subscriptions/renew/${id}`, {
    method: 'PUT',
  })

  return result
}
