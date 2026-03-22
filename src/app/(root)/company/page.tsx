import { fetchMyCompaniesAction } from './actions'
import { CompanyList } from './company-list'

export default async function CompanyPage() {
  const { data: companies } = await fetchMyCompaniesAction()

  return <CompanyList companies={companies} />
}
