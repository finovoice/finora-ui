import { getRequestOptions, sendGetRequest, sendUpdateCreateRequest } from "@/services/index"
import { BACKEND_URL } from "@/constants/configs"
import { ClientType, EditableClient, LeadType, ContractUploadResponse, SigningStatusResponse } from "@/constants/types";

const CLIENT_API_SERVICE_URL = `${BACKEND_URL}/api/core/clients/`
const BULK_CREATE_LEADS_API_SERVICE_URL = `${BACKEND_URL}/api/core/clients/bulk-create/`


interface GetClientsResponse {
    data: ClientType[]
    metadata: {
        total_count: number
        total_pages: number
        current_page: number
        page_size: number
    }
}

export const getClientsAPI = async (query: string = ''): Promise<GetClientsResponse> => {
  return await sendGetRequest(CLIENT_API_SERVICE_URL + query, "clients")
}

export const importLeadAPI = async (lead: LeadType): Promise<ClientType> => {
  const requestOptions = await getRequestOptions(lead, "POST")
  return await sendUpdateCreateRequest(CLIENT_API_SERVICE_URL, requestOptions, "clients") as ClientType
}

export const editLeadAPI = async (lead: EditableClient, id: string): Promise<ClientType> => {
  const requestOptions = await getRequestOptions(lead, "PATCH")
  return await sendUpdateCreateRequest(CLIENT_API_SERVICE_URL + id + '/', requestOptions, "clients") as ClientType
}

export const bulkCreateLeadsAPI = async (leads: LeadType[]): Promise<any> => {
  const requestOptions = await getRequestOptions(leads, "POST")
  return await sendUpdateCreateRequest(BULK_CREATE_LEADS_API_SERVICE_URL, requestOptions, "bulk leads")
}

// Contract Upload and Signing APIs
export const uploadContractAPI = async (file: File, clientId: string): Promise<ContractUploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('clientId', clientId)

  const url = `${BACKEND_URL}/api/core/clients/upload-contract/`
  const apiClient = (await import("@/lib/axiosClient")).default()

  const response = await apiClient.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  if (response.status >= 400) {
    throw new Error('Failed to upload contract')
  }

  return response.data
}

export const refreshSigningStatusAPI = async (requestId: string, clientId: string): Promise<SigningStatusResponse> => {
  const url = `${BACKEND_URL}/api/core/clients/refresh-status/?requestId=${requestId}&clientId=${clientId}`
  return await sendGetRequest(url, "signing status")
}
