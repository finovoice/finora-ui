import { BACKEND_URL } from "@/constants/configs"
import { getRequestOptions, sendGetRequest, sendUpdateCreateRequest } from "@/services/index"

const ORG_API_SERVICE_URL = `${BACKEND_URL}/api/core/organisations/`

// Response type based on backend example
export type Organisation = {
  id: number
  license_number: string
  name: string
  whatsapp_number: string
  owner_name: string
  gst_optional: string | null
  address: string
  sebi_score: string | null
  owner: number
  logo_url: string | null
  signature_url: string | null
  created_at: string
  updated_at: string
}

// PATCH request type for updating organisation
// The issue demonstrates updating name, whatsapp_number, and owner_name
export type OrganisationUpdateRequest = Partial<{
  name: string
  whatsapp_number: string
  owner_name: string
    logo_url: string | null
    signature_url: string | null
    address: string

}>

/**
 * Fetch organisation details by id
 */
export const getOrganisationAPI = async (id: number): Promise<Organisation> => {
  const url = `${ORG_API_SERVICE_URL}${id}/`
  return await sendGetRequest(url, "organisation") as Organisation
}

/**
 * Update organisation details via PATCH
 */
export const updateOrganisationAPI = async (
  id: number,
  payload: OrganisationUpdateRequest
): Promise<Organisation> => {
  const url = `${ORG_API_SERVICE_URL}${id}/`
  const requestOptions = await getRequestOptions(payload, "PATCH")
  return await sendUpdateCreateRequest(url, requestOptions, "organisation") as Organisation
}
