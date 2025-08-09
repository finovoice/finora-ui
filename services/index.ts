import ApiClient from "@/lib/axiosClient";
import { AxiosResponse } from "axios"
import {BACKEND_URL} from "@/constants/configs";

const apiClient = ApiClient()

export const sendUpdateCreateRequest = async (
    url: string,
    requestOptions: any,
    object = "resource"
) => {
    let status = 200
    try {
        let response: AxiosResponse
        response = await apiClient(url, requestOptions)
        if (response.status >= 400) {
            status = response.status
            throw new Error(`Failed to update the ${object}`)
        }
        return response.data
    } catch (error) {
        console.error(`Error occurred while updating the ${object}`, error)
        throw { error, status }
    }
}

export const sendGetRequest = async (url: string, object = "resource") => {
    let status = 200
    const response = await apiClient.get(url)
    if (response.status >= 400) {
        console.error(`Failed to update the `, {response})
        status = response.status
        throw new Error(`Failed to update the ${object}`)
    }
    return response.data

}

export const startServerAPI = async () => {
    const url = `${BACKEND_URL}/health`;
    const response = await fetch(url);
    try {
        if (response.status >= 400) {
            console.warn(`Failed to update the ${response}`)
        }
    }
    catch (error) {
        console.warn(`Error occurred while getting image generation status`, error);
    }
};



