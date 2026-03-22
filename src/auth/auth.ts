'use server'

import { cookies } from 'next/headers'

import { getProfile } from '@/modules/user/services/get-profile'

export async function isAuthenticated() {
  const cookieStore = await cookies()

  return !!cookieStore.get('ondehoje_token')?.value
}

export async function getCurrentCompany() {
  const cookieStore = await cookies()

  return cookieStore.get('company')?.value ?? null
}

export async function defineAbilityForUser() {
  const { client: user } = await getProfile()

  const permissions = Array.from(user.permissions)
  const roles = Array.from(user.roles)

  return {
    can(key: string): boolean {
      if (roles.includes('developer')) return true

      return permissions.some((perm) => perm === key)
    },
  }
}
