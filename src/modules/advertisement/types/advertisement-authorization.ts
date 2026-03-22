interface AdvertisementAuthorization {
  id: string
  status: string
  decidedAt: string
  rejectedReason?: string | null
}

export type { AdvertisementAuthorization }
