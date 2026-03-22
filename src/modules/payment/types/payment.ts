interface Payment {
  subscriptionId: string | null
  advertisementId: string | null
  gateway?: string | null
  checkoutId?: string | null
  amount: number
  tax?: number | null
  status: string
  link?: string | null
  method?: string | null
  pixData?: string | null
  finalCard?: string | null
  confirmationDate?: string | null
  expiresAt: string
  createdAt: string
  updatedAt: string
}

export type { Payment }
