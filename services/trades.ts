import { getRequestOptions, sendGetRequest, sendUpdateCreateRequest } from "@/services/index"
import { BACKEND_URL } from "@/constants/configs"
import type { CohortType, TradeType } from "@/constants/types"
import { EditableTrade } from "@/components/edit-trade-dialog"
import { ExitTrade } from "@/components/exit-trade-dialog"

const TRADE_API_SERVICE_URL = `${BACKEND_URL}/api/core/trades/`
const COHORT_API_SERVICE_URL = `${BACKEND_URL}/api/core/cohorts/`

export const getTradesAPI = async (): Promise<TradeType[]> => {
  return await sendGetRequest(TRADE_API_SERVICE_URL, "trades")
}

export const createTradeAPI = async (trade: TradeType): Promise<TradeType> => {
  const requestOptions = await getRequestOptions(trade, "POST")
  return await sendUpdateCreateRequest(TRADE_API_SERVICE_URL, requestOptions, "trade") as TradeType
}

export const partialUpdateTradeAPI = async (trade: EditableTrade, id?: string): Promise<TradeType> => {
  const requestOptions = await getRequestOptions(trade, "PATCH")
  return await sendUpdateCreateRequest(TRADE_API_SERVICE_URL + id + "/", requestOptions, "trade") as TradeType
}

export const exitTradeAPI = async (trade: ExitTrade, id?: string): Promise<TradeType> => {
  const requestOptions = await getRequestOptions(trade, "PATCH")
  return await sendUpdateCreateRequest(TRADE_API_SERVICE_URL + id + "/", requestOptions, "trade") as TradeType
}

export const createCohortAPI = async (cohort: CohortType): Promise<CohortType> => {
  const requestOptions = await getRequestOptions(cohort, "POST")
  return await sendUpdateCreateRequest(COHORT_API_SERVICE_URL, requestOptions, "cohort") as CohortType
}

