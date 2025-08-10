import {getRequestOptions, sendGetRequest, sendUpdateCreateRequest} from "@/services/index"
import { BACKEND_URL } from "@/constants/configs"
import type { TradeType } from "@/constants/types"

const TRADE_API_SERVICE_URL = `${BACKEND_URL}/api/core/trades/`

export const getTradesAPI = async (): Promise<TradeType[]> => {
  return await sendGetRequest(TRADE_API_SERVICE_URL, "trades")
}

export const createTradeAPI = async (trade: TradeType): Promise<TradeType> => {
    const requestOptions = await getRequestOptions(trade, "POST")
    return await sendUpdateCreateRequest(TRADE_API_SERVICE_URL, requestOptions, "trade") as TradeType
}