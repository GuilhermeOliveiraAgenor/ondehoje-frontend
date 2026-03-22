import { getProfileAction } from './actions'
import { Profile } from './profile'

export default async function ProfilePage() {
  const { data: user } = await getProfileAction()
  if (!user) {
    throw new Error('Usuário não encontrado')
  }
  return <Profile user={user} />
}
