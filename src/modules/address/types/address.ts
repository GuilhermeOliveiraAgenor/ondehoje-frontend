interface Address {
  id: string
  street: string
  neighborhood: string
  number: string
  complement?: string | null
  cep: string
  city: string
  state: string
  latitude: number
  longitude: number
  createdAt: string
  updatedAt?: string | null
}

export type { Address }
