import axios from "axios"

const ApiClient = () => {
  const instance = axios.create()
  instance.interceptors.request.use(async (request) => {
    let accessToken = null
    try {
      accessToken = getAuthToken()
    } catch (error) {
      console.error("Error parsing session from localStorage", error)
    }
    if (accessToken) {
      request.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return request
  })
  instance.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        throw {
          ...error,
          status: error?.response?.status,
          message: error?.response?.data?.message,
        }
      }
  )

  return instance
}

const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {

      console.log("Fetching access token from localStorage", localStorage.getItem('accessToken'))
    return localStorage.getItem('accessToken');
  }
  return null;
};

export const signOut = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
};


export default ApiClient
