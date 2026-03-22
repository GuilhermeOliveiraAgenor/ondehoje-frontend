interface User {
  id: string
  name: string
  email: string
  birthDate: string
  provider: string
  image: string
  roles: string[]
  permissions: string[]
  createdAt: string
  updatedAt: string | null
}

export type { User }
