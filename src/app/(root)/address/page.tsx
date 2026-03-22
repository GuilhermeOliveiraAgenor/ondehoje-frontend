import { getAddressesAction } from './actions'
import { AddressList } from './address-list'

export default async function addressPage() {
  const { data: addresses } = await getAddressesAction()

  return <AddressList addresses={addresses} />
}
