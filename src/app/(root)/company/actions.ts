'use server'

import { fetchDocumentTypes } from '@/modules/company/services/fetch-document-types'
import { fetchMyCompanies } from '@/modules/company/services/fetch-my-companies'

export async function fetchMyCompaniesAction() {
  try {
    const { companies } = await fetchMyCompanies()

    return {
      success: true,
      data: companies,
    }
  } catch (error) {
    console.error('[GET_COMPANIES_ACTION_ERROR]', error)
    return {
      success: false,
      data: [],
      error: 'Falha ao buscar empresas.',
    }
  }
}

export async function getDocumentTypesAction() {
  try {
    const { documentTypes } = await fetchDocumentTypes()

    return {
      success: true,
      data: documentTypes,
    }
  } catch (error) {
    console.error('[GET_DOCUMENT_TYPES_ACTION_ERROR]', error)
    return {
      success: false,
      data: [],
      error: 'Falha ao buscar lista de tipos de documentos.',
    }
  }
}
