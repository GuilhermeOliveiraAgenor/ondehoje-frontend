'use server'

import { redirect } from 'next/navigation'

import { env } from '@/env'

export async function signInWithGoogle() {
  const googleSignInURL = new URL('auth/google', env.NEXT_PUBLIC_API_URL)

  redirect(googleSignInURL.toString())
}
