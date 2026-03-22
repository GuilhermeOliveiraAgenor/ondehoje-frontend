'use server'

import { cookies } from 'next/headers'

import { env } from '@/env'

import { ApiError } from './api-error'

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const cookieStore = await cookies()
  const token = cookieStore.get('ondehoje_token')?.value

  const baseUrl = env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')
  const formattedPath = path.replace(/^\//, '')
  const url = `${baseUrl}/${formattedPath}`

  const requestHeaders = new Headers(options.headers ?? {})

  requestHeaders.set('Content-Type', 'application/json')

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(url, {
    cache: 'no-store',
    ...options,
    headers: requestHeaders,
  })

  if (response.status === 204 || response.status === 201) {
    return undefined as T
  }

  let data: any
  try {
    data = await response.json()
  } catch {
    // Se falhar o parse e a resposta não for OK, lançamos erro genérico
    if (!response.ok) {
      throw new ApiError('Erro na comunicação com a API.', response.status)
    }
  }

  if (!response.ok) {
    throw new ApiError(
      data?.message || 'Erro desconhecido na API.',
      response.status,
      data?.errors,
    )
  }

  return data as T
}
