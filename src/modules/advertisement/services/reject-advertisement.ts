import { api } from '@/lib/api'

interface RejectAdvertisementRequest {
  advertisementId: string
  rejectedReason: string
}

export async function rejectAdvertisement({
  advertisementId,
  rejectedReason,
}: RejectAdvertisementRequest) {
  await api(`/advertisements/evaluate/${advertisementId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      approved: false,
      rejectedReason,
    }),
  })
}
