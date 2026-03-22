import { api } from '@/lib/api'

import { DocumentType } from '../types/document-type'

interface FetchDocumentTypesResponse {
  documentTypes: DocumentType[]
}

export async function fetchDocumentTypes() {
  const result = await api<FetchDocumentTypesResponse>('/document-types')

  return result
}
