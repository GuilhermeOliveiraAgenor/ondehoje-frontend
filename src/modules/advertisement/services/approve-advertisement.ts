import { api } from '@/lib/api'

interface ApproveAdvertisementRequest {
  advertisementId: string
}

export async function approveAdvertisement({
  advertisementId,
}: ApproveAdvertisementRequest) {
  await api(`/advertisements/evaluate/${advertisementId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      approved: true,
    }),
  })
}
