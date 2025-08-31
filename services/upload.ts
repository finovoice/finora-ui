import { BACKEND_URL } from "@/constants/configs"
import { getRequestOptions, sendUpdateCreateRequest } from "@/services/index"

const UPLOAD_API_SERVICE_URL = `${BACKEND_URL}/api/core/uploads/`
const SIGNED_URLS_API_SERVICE_URL = `${BACKEND_URL}/api/core/signed-urls/`

/**
 * Response type for upload API
 */
export interface UploadResponse {
  key: string
  url: string
  signed_url: string
}

/**
 * Response type for signed URL API
 */
export interface SignedUrlResponse {
  signed_url: string
  expires_in: number
}

/**
 * Upload a file with a given purpose.
 * This sends a multipart/form-data POST request with fields:
 * - file: binary file
 * - purpose: string (e.g., "invoice")
 */
import { AxiosProgressEvent } from "axios";

export const uploadFileAPI = async (
  file: File | Blob,
  purpose: string,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("purpose", purpose)

  // Do not set Content-Type explicitly so Axios can set the correct boundary for FormData
  const requestOptions = {
    method: "POST",
    data: formData,
    redirect: "Follow",
    headers: {},
    onUploadProgress, // Pass the progress callback to Axios
  }

  return await sendUpdateCreateRequest(
    UPLOAD_API_SERVICE_URL,
    requestOptions,
    "upload"
  )
}

/**
 * Request a signed URL from the backend for a given S3 object key (full URL or key as required by backend).
 * Sends JSON: { key: string }
 */
export const createSignedUrlAPI = async (key: string): Promise<SignedUrlResponse> => {
  const payload = { key }
  const requestOptions = await getRequestOptions(payload, "POST")
  return await sendUpdateCreateRequest(
    SIGNED_URLS_API_SERVICE_URL,
    requestOptions,
    "signed-url"
  )
}
