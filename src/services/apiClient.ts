import axios from 'axios'

let getToken: () => string | null = () => null
let refreshTokens: () => Promise<void> = async () => {
  throw new Error('refreshTokens not set')
}

export const setAuthHandlers = ({
  getJwt,
  refresh,
}: {
  getJwt: () => string | null
  refresh: () => Promise<void>
}) => {
  getToken = getJwt
  refreshTokens = refresh
}

const api = axios.create({
  baseURL: 'http://localhost:5092/api/v1',
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        await refreshTokens()
        originalRequest.headers.Authorization = `Bearer ${getToken()}`
        return api(originalRequest)
      } catch (e) {
        return Promise.reject(e)
      }
    }
    return Promise.reject(error)
  },
)

export default api
