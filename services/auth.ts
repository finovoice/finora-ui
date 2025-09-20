import {BACKEND_URL} from "@/constants/configs";


const AUTH_SERVICE_URL = `${BACKEND_URL}/account`;

import { USER_DATA_KEY, UserData } from "@/hooks/user-atom";

export const loginAPI = async (email: string, password: string): Promise<{ valid: boolean; token: string | null; user: UserData }> => {
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
        console.error('Failed to login:', result);
        return {
            valid: false,
            token: null,
            user: null
        };
    }

    // Persist user_data to sessionStorage for global availability/persistence
    try {
        const userData: UserData = result?.data?.user_data ?? null
        if (typeof window !== 'undefined' && userData) {
            window.sessionStorage.setItem(USER_DATA_KEY, JSON.stringify(userData))
        }
    } catch (e) {
        console.error('Failed to persist user_data to storage', e)
    }

    return {
        valid: true,
        token: result?.data?.access ?? null,
        user: result?.data?.user_data ?? null
    };
}
