import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()

  const searchParams = request.nextUrl.searchParams

  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json(
      { message: 'Google OAuth "TOKEN" was not found.' },
      { status: 400 },
    )
  }

  cookieStore.set('ondehoje_token', token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  const redirectUrl = request.nextUrl.clone()

  redirectUrl.pathname = '/'
  redirectUrl.search = ''

  return NextResponse.redirect(redirectUrl)
}
