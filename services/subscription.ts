import { getRequestOptions, sendGetRequest, sendUpdateCreateRequest } from "@/services/index"
import { BACKEND_URL } from "@/constants/configs"
import { SubscriptionType } from "@/constants/types";

const SUBSCRIPTION_API_SERVICE_URL = `${BACKEND_URL}/api/core/subscriptions/`

export const getSubscriptionsAPI = async (): Promise<SubscriptionType[]> => {
    return await sendGetRequest(SUBSCRIPTION_API_SERVICE_URL, "subscriptions")
}

export const postSubscriptionAPI = async (sub: SubscriptionType): Promise<SubscriptionType> => {
    const requestOptions = await getRequestOptions(sub, "POST")
    return await sendUpdateCreateRequest(SUBSCRIPTION_API_SERVICE_URL, requestOptions, "subscriptions") as SubscriptionType
}



