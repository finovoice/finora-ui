import { getRequestOptions, sendGetRequest, sendUpdateCreateRequest } from "@/services/index"
import { BACKEND_URL } from "@/constants/configs"
import { ClientType, EditableClient, LeadType } from "@/constants/types";

const CLIENT_API_SERVICE_URL = `${BACKEND_URL}/api/core/clients/`
const BULK_CREATE_LEADS_API_SERVICE_URL = `${BACKEND_URL}/api/core/clients/bulk-create/`

export const getClientsAPI = async (): Promise<ClientType[]> => {
  return await sendGetRequest(CLIENT_API_SERVICE_URL, "clients")
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
