import { Information } from './information'

export type InformationForm = {
  id?: string
  name: Information['name']
  description: Information['description']
  phoneNumber: Information['phoneNumber']
  email: Information['email']
  type: 'description' | 'e-mail' | 'phone-number'
}
