interface Document {
  id: string
  documentTypeId: string
  name: string
  file: string
  description?: string | null
  expiresAt?: string | null
  createdAt: string
}

export type { Document }
