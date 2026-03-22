import { Document } from './document'

interface DocumentForm {
  id?: Document['id']
  documentTypeId: Document['documentTypeId']
  name: Document['name']
  file?: File
  description?: Document['description']
  expiresAt?: Date
}

export type { DocumentForm }
