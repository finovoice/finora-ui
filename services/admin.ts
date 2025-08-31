import { BACKEND_URL } from "@/constants/configs";
import { getRequestOptions, sendGetRequest, sendUpdateCreateRequest } from ".";

const ADMIN_API_SERVICE_URL = `${BACKEND_URL}/account/`

export const adminPasswordReset = async function (password: any) {

    // const corsToken = await getCORSHeaders()
    // console.log('cors' + corsToken)
    const requestOptions = await getRequestOptions(password, "POST")
    return await sendUpdateCreateRequest(ADMIN_API_SERVICE_URL + 'password-reset', requestOptions, "admin")

}

export const getCORSHeaders = async function () {
    return await sendGetRequest(ADMIN_API_SERVICE_URL + 'password-reset')
}
