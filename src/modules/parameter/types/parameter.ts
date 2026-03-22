interface Parameter {
  key: string
  keyInfo: string
  value: string
  type: string
  status: boolean
  visible: boolean
  createdAt: string
  updatedAt?: string | null
}

export type { Parameter }
