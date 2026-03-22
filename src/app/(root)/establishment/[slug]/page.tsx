import { notFound } from 'next/navigation'

import { defineAbilityForUser, isAuthenticated } from '@/auth/auth'

import {
  fetchAdvertisementsByCompanyIdAction,
  getCompanyAction,
} from './actions'
import { EstablishmentDetailsView } from './establishment-details'

export default async function CompanyDetailsPage(props: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await props.params

  const { data: establishment } = await getCompanyAction(slug)

  if (!establishment) {
    notFound()
  }

  const authenticated = await isAuthenticated()

  if (!authenticated) {
    return (
      <EstablishmentDetailsView company={establishment} advertisements={[]} />
    )
  }

  const { data: advertisements } = await fetchAdvertisementsByCompanyIdAction(
    establishment.id,
  )

  const ability = await defineAbilityForUser()
  const canEvaluateAdvertisement = ability.can('evaluate:Advertisement')

  return (
    <EstablishmentDetailsView
      company={establishment}
      advertisements={advertisements}
      canEvaluateAdvertisement={canEvaluateAdvertisement}
    />
  )
}
