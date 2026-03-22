import { notFound } from 'next/navigation'

import { getAddressesAction } from '@/app/(root)/address/actions'

import { getCompanyDetailsAction } from './actions'
import { SettingsPage } from './settings'

export default async function CompanySettingsPage() {
  const { data: company } = await getCompanyDetailsAction()
  const { data: addresses } = await getAddressesAction()

  if (!company) {
    notFound()
  }

  return <SettingsPage company={company} addresses={addresses} />
}
