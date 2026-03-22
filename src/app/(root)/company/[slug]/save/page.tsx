import { notFound } from 'next/navigation'

import { getAddressesAction } from '@/app/(root)/address/actions'

import { getDocumentTypesAction } from '../../actions'
import { getCompanyDetailsAction } from '../settings/actions'
import { CompanyForm } from './company-form'

export default async function SaveCompanyPage() {
  const { data: company } = await getCompanyDetailsAction()
  const { data: addresses } = await getAddressesAction()
  const { data: documentTypes } = await getDocumentTypesAction()

  if (!company) {
    notFound()
  }

  return (
    <CompanyForm
      company={company}
      addresses={addresses}
      documentTypes={documentTypes}
    />
  )
}
