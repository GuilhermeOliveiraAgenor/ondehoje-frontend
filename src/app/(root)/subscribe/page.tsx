import { isAuthenticated } from '@/auth/auth'

import SubscribeForm from './subscribe-form'

export default async function Page() {
  const authenticated = await isAuthenticated()

  return <SubscribeForm authenticated={authenticated} />
}
