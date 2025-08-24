import {  sendGetRequest } from "@/services/index"
import { BACKEND_URL } from "@/constants/configs"
import {ClientType} from "@/constants/types";

const CLIENT_API_SERVICE_URL = `${BACKEND_URL}/api/core/clients/`

export const getClientsAPI = async (): Promise<ClientType[]> => {
  return await sendGetRequest(CLIENT_API_SERVICE_URL, "clients")
}