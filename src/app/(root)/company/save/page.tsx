import { getAddressesAction } from '../../address/actions'
import { getDocumentTypesAction } from '../actions'
import { CompanyForm } from './company-form'

export default async function SaveCompanyPage() {
  const { data: addresses } = await getAddressesAction()
  const { data: documentTypes } = await getDocumentTypesAction()

  return <CompanyForm addresses={addresses} documentTypes={documentTypes} />
}
