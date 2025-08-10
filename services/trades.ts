import { sendGetRequest } from "@/services/index"
import { BACKEND_URL } from "@/constants/configs"
import type { TradeAPI } from "@/constants/types"

const TRADE_API_SERVICE_URL = `${BACKEND_URL}/api/core/trades`

export const getTradesAPI = async (): Promise<TradeAPI[]> => {
  return await sendGetRequest(TRADE_API_SERVICE_URL, "trades")
}