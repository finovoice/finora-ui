import {BACKEND_URL} from "@/constants/configs";


const AUTH_SERVICE_URL = `${BACKEND_URL}/account`;

export const loginAPI = async (email: string, password: string): Promise<{ valid: boolean; token: any }> => {
    const url = `${AUTH_SERVICE_URL}/login`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    const result = await response.json();
    if (!response.ok) {
        console.error(response);
        console.error('Failed to verify token:', result);
        return {
            valid: false,
            token: null
        };
    }
    return {
        valid: true,
        token: result.data.access
    };
}